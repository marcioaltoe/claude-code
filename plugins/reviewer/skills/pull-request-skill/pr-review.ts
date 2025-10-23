#!/usr/bin/env bun

/**
 * PR Review Exporter (improved)
 *
 * Enhanced version with:
 * - Robust error handling and retry logic
 * - Rate limiting and throttling
 * - Structured logging with Winston
 * - Input validation with Zod
 * - Optimized API calls
 * - Improved markdown processing
 * - Better performance and reliability
 * - Environment file support (.env)
 * - Auto-detection of latest open PR
 * - Automatic directory creation
 *
 * Usage:
 *   # Option 1: Environment variable
 *   GITHUB_TOKEN=ghp_... bun pr-review.ts [PR_NUMBER]
 *
 *   # Option 2: .env file (recommended)
 *   echo "GITHUB_TOKEN=ghp_..." > scripts/.env
 *   bun pr-review.ts [PR_NUMBER]
 *
 *   # PR_NUMBER is optional - if not provided, uses latest open PR
 */

import { execSync } from 'node:child_process'
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { graphql } from '@octokit/graphql'
import { retry } from '@octokit/plugin-retry'
import { throttling } from '@octokit/plugin-throttling'
import { Octokit } from '@octokit/rest'
import type { Endpoints } from '@octokit/types'
import { config as dotenvConfig } from 'dotenv'
import * as winston from 'winston'
import { z } from 'zod'

// ---------- Environment Configuration ----------
// Load environment variables from .env file in the scripts directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Prefer scripts/.env (as documented); fallback to scripts/review/.env without overriding existing vars
dotenvConfig({ path: join(__dirname, '..', '.env') })
dotenvConfig({ path: join(__dirname, '.env') })

// Working directory - use CWD environment variable if provided, otherwise use process.cwd()
const WORKING_DIR = process.env.CWD || process.cwd()

// ---------- Configuration & Validation ----------

// Input validation schemas
const PRNumberSchema = z.number().int().positive()
const GitHubTokenSchema = z.string().min(1)
const RepoInfoSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
})

// Logger setup (initially only console)
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'pr-review-exporter' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
})

// Enhanced Octokit with retry and throttling
const EnhancedOctokit = Octokit.plugin(retry, throttling)

// Type for the enhanced Octokit instance
type EnhancedOctokitInstance = InstanceType<typeof EnhancedOctokit>

// ---------- Types ----------
interface BaseUser {
  login: string
}

interface Comment {
  body: string
  user: BaseUser
  created_at: string

  // Present only for review (inline) comments:
  path?: string
  line?: number

  // Present only for review (inline) comments from REST:
  id?: number // REST numeric id
  node_id?: string // REST relay/global ID (matches GraphQL id)
}

interface ReviewComment extends Comment {
  path: string
  line: number
  id: number
  node_id: string
}

interface IssueComment extends Comment {
  // General PR comments; no path/line/id resolution
}

interface SimpleReviewComment {
  // Pull Request Review (summary) comments, e.g., Approve/Comment with body
  id: number // review id (used by GitHub anchors: pullrequestreview-<id>)
  body: string
  user: BaseUser
  created_at: string // submitted_at from API
  state: string // APPROVED | COMMENTED | CHANGES_REQUESTED | DISMISSED
}

interface ReviewThread {
  id: string
  isResolved: boolean
  comments: {
    nodes: Array<{
      id: string // GraphQL relay/global ID
      databaseId: number | null // GraphQL numeric DB id
      body: string
      author: { login: string | null }
      createdAt: string
    }>
  }
}

interface GraphQLResponse {
  repository: {
    pullRequest: {
      reviewThreads: {
        nodes: ReviewThread[]
      }
    }
  }
}

// Octokit REST API response types
type RestReviewComment = Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}/comments']['response']['data'][number]
type RestIssueComment =
  Endpoints['GET /repos/{owner}/{repo}/issues/{issue_number}/comments']['response']['data'][number]
type RestPRReview = Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews']['response']['data'][number]

function getCommentSeverity(comment: ReviewComment): 'critical' | 'major' | 'trivial' {
  const body = comment.body || ''

  // Check for severity indicators in the comment body
  if (body.includes('🔴 Critical')) {
    return 'critical'
  }
  if (body.includes('🟠 Major')) {
    return 'major'
  }
  if (body.includes('🔵 Trivial') || body.includes('🧹 Nitpick')) {
    return 'trivial'
  }

  // Default to trivial if no severity found
  return 'trivial'
}

function getSeverityEmoji(severity: 'critical' | 'major' | 'trivial'): string {
  switch (severity) {
    case 'critical':
      return '🔴'
    case 'major':
      return '🟠'
    case 'trivial':
      return '🔵'
  }
}

function getSeverityLabel(severity: 'critical' | 'major' | 'trivial'): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1)
}

async function fetchLatestOpenPR(octokit: EnhancedOctokitInstance, owner: string, repo: string): Promise<number> {
  try {
    logger.debug('Fetching latest open PR', { owner, repo })

    // Fetch PRs sorted by most recently updated, limit to 1 open PR
    const response = await octokit.rest.pulls.list({
      owner,
      repo,
      state: 'open',
      sort: 'updated',
      direction: 'desc',
      per_page: 1,
    })

    if (response.data.length === 0) {
      const error = new Error('No open PRs found in the repository')
      logger.error('No open PRs available', { owner, repo })
      throw error
    }

    const latestPR = response.data[0]
    logger.debug('Found latest open PR', {
      number: latestPR.number,
      title: latestPR.title,
      updatedAt: latestPR.updated_at,
    })

    return latestPR.number
  } catch (error) {
    logger.error('Failed to fetch latest open PR', {
      error: error instanceof Error ? error.message : String(error),
      owner,
      repo,
    })
    throw error
  }
}

// ---------- Main ----------
async function main() {
  try {
    logger.info('Starting PR Review Exporter')

    // Validate command line arguments
    const args = process.argv.slice(2)
    let prNumber: number | undefined

    if (args.length === 0) {
      logger.info('No PR number provided, fetching latest open PR...')
      // Will fetch latest open PR below
    } else {
      // Validate PR number
      const prNumberResult = PRNumberSchema.safeParse(Number(args[0]))
      if (!prNumberResult.success) {
        const error = new Error(`Invalid PR number: ${args[0]}`)
        logger.error('Invalid PR number provided', {
          prNumber: args[0],
          validationErrors: prNumberResult.error.issues,
        })
        throw error
      }
      prNumber = prNumberResult.data
      logger.info('Using specified PR number', { prNumber })
    }

    // Validate GitHub token (from .env file or environment variable)
    const token = process.env.GITHUB_TOKEN
    const tokenResult = GitHubTokenSchema.safeParse(token)
    if (!tokenResult.success) {
      const error = new Error(
        'GITHUB_TOKEN is not set. Please set it in scripts/.env file or as an environment variable.',
      )
      logger.error('Missing or invalid GitHub token', {
        validationErrors: tokenResult.error.issues,
        hint: 'Create scripts/.env file with: GITHUB_TOKEN=ghp_your_token_here',
      })
      throw error
    }

    logger.info('Validated input parameters', { prNumber })

    const { owner, repo } = await getRepoInfo()
    const repoInfoResult = RepoInfoSchema.safeParse({ owner, repo })
    if (!repoInfoResult.success) {
      const error = new Error('Could not parse repository information from git remote')
      logger.error('Invalid repository information', {
        owner,
        repo,
        validationErrors: repoInfoResult.error.issues,
      })
      throw error
    }

    logger.info('Starting data collection', { prNumber, owner, repo })

    // Create enhanced Octokit instance with retry and throttling
    const octokit = new EnhancedOctokit({
      auth: token,
      retry: {
        doNotRetry: ['429'],
        enabled: true,
      },
      throttle: {
        onRateLimit: (retryAfter, options, _octokit) => {
          logger.warn('Rate limit exceeded, retrying', {
            retryAfter,
            method: options.method,
            url: options.url,
            requestRetryCount: options.request?.retryCount,
          })
          return options.request?.retryCount <= 2
        },
        onSecondaryRateLimit: (retryAfter, options, _octokit) => {
          logger.warn('Secondary rate limit detected', {
            retryAfter,
            method: options.method,
            url: options.url,
          })
          return false
        },
      },
    })

    // Fetch latest open PR if not specified
    if (!prNumber) {
      prNumber = await fetchLatestOpenPR(octokit, owner, repo)
      logger.info('Fetched latest open PR', { prNumber })
    }

    // At this point prNumber is guaranteed to be defined
    if (!prNumber) {
      throw new Error('Failed to determine PR number')
    }

    // Fetch data with error handling and logging
    logger.info('Fetching review comments (REST)')
    const allReviewComments = await fetchAllReviewComments(octokit, owner, repo, prNumber)
    logger.info('Fetched review comments', { count: allReviewComments.length })

    logger.info('Fetching issue comments (REST)')
    const allIssueComments = await fetchAllIssueComments(octokit, owner, repo, prNumber)
    logger.info('Fetched issue comments', { count: allIssueComments.length })

    logger.info('Fetching review threads (GraphQL)')
    const reviewThreads = await fetchReviewThreads(token as string, owner, repo, prNumber)
    logger.info('Fetched review threads', { count: reviewThreads.length })

    logger.info('Fetching pull request reviews (REST)')
    const allSimpleReviews = await fetchAllPullRequestReviews(octokit, owner, repo, prNumber)
    logger.info('Fetched pull request reviews', { count: allSimpleReviews.length })

    // Filter to CodeRabbit bot comments only
    const coderabbitReviewComments = allReviewComments.filter((c) => c.user?.login === 'coderabbitai[bot]')
    const coderabbitIssueComments = allIssueComments.filter((c) => c.user?.login === 'coderabbitai[bot]')
    const coderabbitSimpleReviews = allSimpleReviews.filter(
      (r) => r.user?.login === 'coderabbitai[bot]' && (r.body?.trim()?.length ?? 0) > 0,
    )

    const totalCodeRabbitComments =
      coderabbitReviewComments.length + coderabbitIssueComments.length + coderabbitSimpleReviews.length
    logger.info('Filtered CodeRabbit comments', {
      reviewComments: coderabbitReviewComments.length,
      issueComments: coderabbitIssueComments.length,
      simpleReviews: coderabbitSimpleReviews.length,
      total: totalCodeRabbitComments,
    })

    if (totalCodeRabbitComments === 0) {
      logger.info('No CodeRabbit AI comments found for PR', { prNumber })
      console.log(`No CodeRabbit AI comments found for PR #${prNumber}.`)
      return
    }

    // Get output directory from environment or use default
    // If OUTPUT_DIR is relative, resolve it from the working directory (user's repo)
    const defaultOutputDir = './.reviews'
    const configuredOutputDir = process.env.OUTPUT_DIR || defaultOutputDir
    const outputBaseDir = configuredOutputDir.startsWith('/')
      ? configuredOutputDir
      : join(WORKING_DIR, configuredOutputDir)
    const outputDir = join(outputBaseDir, `reviews-pr-${prNumber}`)
    const commentsDir = join(outputDir, 'comments')
    const issuesDir = join(outputDir, 'issues')
    const summaryFile = join(outputDir, 'summary.md')

    // Create base output directory if it doesn't exist
    await fs.mkdir(outputBaseDir, { recursive: true })

    // Create all subdirectories (no more severity-based subdirectories)
    const dirsToCreate = [outputDir, commentsDir, issuesDir]
    await Promise.all(dirsToCreate.map((dir) => fs.mkdir(dir, { recursive: true })))

    // Update logger to use PR-specific log files
    const prLogFile = join(outputDir, 'pr-review-combined.log')
    const prErrorFile = join(outputDir, 'pr-review-error.log')
    logger.add(
      new winston.transports.File({
        filename: prLogFile,
      }),
    )
    logger.add(
      new winston.transports.File({
        filename: prErrorFile,
        level: 'error',
      }),
    )

    logger.info('Creating output directories', { outputDir, outputBaseDir })

    // Categories:
    // - issues: resolvable review comments (inline threads)
    // - comments: simple comments (general PR issue comments + PR review bodies)
    const reviewComments = coderabbitReviewComments.slice()
    const issueComments = coderabbitIssueComments.slice()
    const simpleReviewComments = coderabbitSimpleReviews.slice()

    // Sort each category chronologically by creation time
    reviewComments.sort((a, b) => a.created_at.localeCompare(b.created_at))
    issueComments.sort((a, b) => a.created_at.localeCompare(b.created_at))
    simpleReviewComments.sort((a, b) => a.created_at.localeCompare(b.created_at))

    // Count resolution by policy: thread resolved AND contains "✅ Addressed in commit"
    const resolvedCount = reviewComments.filter((c) => isCommentResolvedByPolicy(c, reviewThreads)).length
    const unresolvedCount = reviewComments.length - resolvedCount

    logger.info('Processing review comments', {
      totalReviewComments: reviewComments.length,
      resolved: resolvedCount,
      unresolved: unresolvedCount,
    })

    logger.info('Creating issue files (resolvable review threads)')
    const severityCounts = { critical: 0, major: 0, trivial: 0 }

    for (let i = 0; i < reviewComments.length; i++) {
      const severity = getCommentSeverity(reviewComments[i])
      const isResolved = isCommentResolvedByPolicy(reviewComments[i], reviewThreads)
      severityCounts[severity]++
      // Use global sequential numbering (i + 1) for file names
      await createIssueFile(issuesDir, i + 1, reviewComments[i], reviewThreads, severity, isResolved)
    }

    logger.info('Creating comment files (simple comments)')
    // Merge general PR comments and simple PR review bodies into one sequence
    type SimpleItem = { kind: 'issue_comment'; data: IssueComment } | { kind: 'review'; data: SimpleReviewComment }
    const simpleItems: SimpleItem[] = [
      ...issueComments.map((c) => ({ kind: 'issue_comment' as const, data: c })),
      ...simpleReviewComments.map((r) => ({ kind: 'review' as const, data: r })),
    ].sort((a, b) => a.data.created_at.localeCompare(b.data.created_at))

    for (let i = 0; i < simpleItems.length; i++) {
      await createSimpleCommentFile(commentsDir, i + 1, simpleItems[i])
    }

    logger.info('Creating summary file')
    await createSummaryFile(
      summaryFile,
      prNumber,
      reviewComments,
      simpleItems,
      resolvedCount,
      unresolvedCount,
      reviewThreads,
      severityCounts,
    )

    const totalGenerated = reviewComments.length + simpleItems.length
    logger.info('Processing completed successfully', {
      prNumber,
      totalGenerated,
      outputDir,
      resolvedCount,
      unresolvedCount,
      severityCounts,
    })

    console.log(`\n✅ Done. ${totalGenerated} files in ${outputDir}`)
    console.log(`ℹ️ Threads resolved: ${resolvedCount} • unresolved: ${unresolvedCount}`)
  } catch (error) {
    logger.error('Fatal error in PR Review Exporter', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      prNumber: process.argv[2] ? Number(process.argv[2]) : undefined,
    })

    console.error('❌ Fatal error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

// ---------- Helpers ----------
async function getRepoInfo(): Promise<{ owner: string; repo: string }> {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim()
    const match = remoteUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)/)
    if (match) return { owner: match[1], repo: match[2] }
    throw new Error('Could not parse repository information from git remote')
  } catch (error) {
    logger.error("Error getting repository info. Ensure you're in a git repository with a GitHub remote.", {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

async function fetchAllReviewComments(
  octokit: EnhancedOctokitInstance,
  owner: string,
  repo: string,
  prNumber: number,
): Promise<ReviewComment[]> {
  try {
    logger.debug('Fetching review comments', { owner, repo, prNumber })
    const comments = await octokit.paginate(octokit.rest.pulls.listReviewComments, {
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
    })

    // Normalize to the fields we use (and ensure id/node_id present)
    const normalizedComments = (comments as RestReviewComment[]).map((c) => ({
      id: c.id,
      node_id: c.node_id,
      body: c.body || '',
      user: { login: c.user?.login || '' },
      created_at: c.created_at,
      path: c.path,
      line: c.line,
    })) as ReviewComment[]

    logger.debug('Successfully fetched review comments', {
      count: normalizedComments.length,
      owner,
      repo,
      prNumber,
    })

    return normalizedComments
  } catch (error) {
    logger.warn('Failed to fetch review comments', {
      error: error instanceof Error ? error.message : String(error),
      owner,
      repo,
      prNumber,
    })
    return []
  }
}

async function fetchAllIssueComments(
  octokit: EnhancedOctokitInstance,
  owner: string,
  repo: string,
  prNumber: number,
): Promise<IssueComment[]> {
  try {
    logger.debug('Fetching issue comments', { owner, repo, prNumber })
    const comments = await octokit.paginate(octokit.rest.issues.listComments, {
      owner,
      repo,
      issue_number: prNumber,
      per_page: 100,
    })

    const normalizedComments = (comments as RestIssueComment[]).map((c) => ({
      body: c.body || '',
      user: { login: c.user?.login || '' },
      created_at: c.created_at,
    })) as IssueComment[]

    logger.debug('Successfully fetched issue comments', {
      count: normalizedComments.length,
      owner,
      repo,
      prNumber,
    })

    return normalizedComments
  } catch (error) {
    logger.warn('Failed to fetch issue comments', {
      error: error instanceof Error ? error.message : String(error),
      owner,
      repo,
      prNumber,
    })
    return []
  }
}

async function fetchAllPullRequestReviews(
  octokit: EnhancedOctokitInstance,
  owner: string,
  repo: string,
  prNumber: number,
): Promise<SimpleReviewComment[]> {
  try {
    logger.debug('Fetching pull request reviews', { owner, repo, prNumber })
    const reviews = await octokit.paginate(octokit.rest.pulls.listReviews, {
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
    })

    const normalizedReviews = (reviews as RestPRReview[]).map((r) => ({
      id: r.id,
      body: r.body || '',
      user: { login: r.user?.login || '' },
      created_at: r.submitted_at || '',
      state: r.state,
    })) as SimpleReviewComment[]

    logger.debug('Successfully fetched pull request reviews', {
      count: normalizedReviews.length,
      owner,
      repo,
      prNumber,
    })

    return normalizedReviews
  } catch (error) {
    logger.warn('Failed to fetch pull request reviews', {
      error: error instanceof Error ? error.message : String(error),
      owner,
      repo,
      prNumber,
    })
    return []
  }
}

async function fetchReviewThreads(
  token: string,
  owner: string,
  repo: string,
  prNumber: number,
): Promise<ReviewThread[]> {
  try {
    logger.debug('Fetching review threads via GraphQL', { owner, repo, prNumber })

    const query = `
      query($owner: String!, $repo: String!, $number: Int!) {
        repository(owner: $owner, name: $repo) {
          pullRequest(number: $number) {
            reviewThreads(first: 100) {
              nodes {
                id
                isResolved
                comments(first: 100) {
                  nodes {
                    id
                    databaseId
                    body
                    author { login }
                    createdAt
                  }
                }
              }
            }
          }
        }
      }
    `

    const result = await graphql<GraphQLResponse>(query, {
      owner,
      repo,
      number: prNumber,
      headers: { authorization: `token ${token}` },
    })

    const threads = result.repository.pullRequest.reviewThreads.nodes

    logger.debug('Successfully fetched review threads', {
      count: threads.length,
      owner,
      repo,
      prNumber,
    })

    return threads
  } catch (error) {
    logger.warn('Failed to fetch review threads', {
      error: error instanceof Error ? error.message : String(error),
      owner,
      repo,
      prNumber,
    })
    return []
  }
}

/**
 * Determine if a review (inline) comment belongs to a resolved thread.
 * Uses robust ID matching:
 *   REST.reviewComment.id          ⇔ GraphQL.comment.databaseId
 *   REST.reviewComment.node_id     ⇔ GraphQL.comment.id        (fallback)
 */
function _isCommentResolved(comment: Comment, reviewThreads: ReviewThread[]): boolean {
  // General PR (issue) comments cannot be resolved
  if (!('path' in comment && 'line' in comment)) return false

  const rc = comment as ReviewComment
  for (const thread of reviewThreads) {
    const match = thread.comments.nodes.some(
      (tc) =>
        (tc.databaseId != null && rc.id != null && tc.databaseId === rc.id) || (!!rc.node_id && tc.id === rc.node_id),
    )
    if (match) return thread.isResolved
  }
  return false
}

// Policy-level resolution: the thread must be resolved AND contain
// a confirmation marker "✅ Addressed in commit" somewhere in the thread.
function isCommentResolvedByPolicy(comment: Comment, reviewThreads: ReviewThread[]): boolean {
  if (!('path' in comment && 'line' in comment)) return false
  const rc = comment as ReviewComment
  for (const thread of reviewThreads) {
    const match = thread.comments.nodes.some(
      (tc) =>
        (tc.databaseId != null && rc.id != null && tc.databaseId === rc.id) || (!!rc.node_id && tc.id === rc.node_id),
    )
    if (match) {
      const hasAddressed = thread.comments.nodes.some((tc) => (tc.body || '').includes('✅ Addressed in commit'))
      return Boolean(thread.isResolved && hasAddressed)
    }
  }
  return false
}

async function createIssueFile(
  outputDir: string,
  issueNumber: number,
  comment: ReviewComment,
  reviewThreads: ReviewThread[],
  severity: 'critical' | 'major' | 'trivial',
  isResolved: boolean,
): Promise<void> {
  const severityEmoji = getSeverityEmoji(severity)
  const severityLabel = getSeverityLabel(severity)
  const statusLabel = isResolved ? 'resolved' : 'unresolved'
  const fileName = `issue_${issueNumber.toString().padStart(3, '0')}_${severity}_${statusLabel}.md`
  const file = join(outputDir, fileName)
  const formattedDate = formatDate(comment.created_at)
  const resolvedStatus = isResolved ? '- [x] RESOLVED ✓' : '- [ ] UNRESOLVED'
  const thread = findThreadForReviewComment(comment, reviewThreads)
  const threadId = thread?.id ?? ''

  // Handle file location - some comments may not have a specific line number
  const fileLocation = comment.line ? `${comment.path}:${comment.line}` : comment.path

  const content = `# Issue ${issueNumber} - ${severityEmoji} ${severityLabel} - ${statusLabel.toUpperCase()}

**File:** \`${fileLocation}\`
**Date:** ${formattedDate}
**Status:** ${resolvedStatus}

## Body

${comment.body}

## How To Resolve This Issue

This comment belongs to a GitHub review thread. To mark it as resolved programmatically, call GitHub's GraphQL API using your \`GITHUB_TOKEN\` (scope: \`repo\`).

- Thread ID: ${threadId ? `\`${threadId}\`` : '(not found)'}
- Endpoint: \`POST https://api.github.com/graphql\`

GitHub CLI example:

\`\`\`bash
gh api graphql \\
  -f query='mutation($threadId: ID!) { resolveReviewThread(input: { threadId: $threadId }) { thread { isResolved } } }' \\
  -F threadId='${threadId || '<THREAD_ID>'}'
\`\`\`

curl example:

\`\`\`bash
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \\
     -H "Content-Type: application/json" \\
     --data '{
       "query": "mutation($threadId: ID!) { resolveReviewThread(input: { threadId: $threadId }) { thread { isResolved } } }",
       "variables": { "threadId": "${threadId || '<THREAD_ID>'}" }
     }' \\
     https://api.github.com/graphql
\`\`\`

To unresolve the thread, use:

\`\`\`bash
gh api graphql \\
  -f query='mutation($threadId: ID!) { unresolveReviewThread(input: { threadId: $threadId }) { thread { isResolved } } }' \\
  -F threadId='${threadId || '<THREAD_ID>'}'
\`\`\`

---
*Generated from PR review - CodeRabbit AI*
`
  await fs.writeFile(file, content, 'utf8')
  console.log(`  Created ${file}`)
}

// Maps a REST review comment to its GraphQL review thread, if available.
function findThreadForReviewComment(comment: ReviewComment, reviewThreads: ReviewThread[]): ReviewThread | undefined {
  for (const thread of reviewThreads) {
    const match = thread.comments.nodes.some(
      (tc) =>
        (tc.databaseId != null && comment.id != null && tc.databaseId === comment.id) ||
        (!!comment.node_id && tc.id === comment.node_id),
    )
    if (match) return thread
  }
  return undefined
}

async function createSimpleCommentFile(
  outputDir: string,
  commentNumber: number,
  item: { kind: 'issue_comment'; data: IssueComment } | { kind: 'review'; data: SimpleReviewComment },
): Promise<void> {
  const file = join(outputDir, `comment_${commentNumber.toString().padStart(3, '0')}.md`)
  const d = item.data
  const formattedDate = formatDate(d.created_at)
  const typeLabel = item.kind === 'review' ? `PR Review (${(d as SimpleReviewComment).state})` : 'General PR Comment'
  const content = `# Comment ${commentNumber} - ${typeLabel}

**Date:** ${formattedDate}
**Status:** N/A (not resolvable)

## Body

${d.body}

---
*Generated from PR review - CodeRabbit AI*
`
  await fs.writeFile(file, content, 'utf8')
  console.log(`  Created ${file}`)
}

async function createSummaryFile(
  summaryFile: string,
  prNumber: number,
  reviewComments: ReviewComment[],
  simpleItems: ({ kind: 'issue_comment'; data: IssueComment } | { kind: 'review'; data: SimpleReviewComment })[],
  resolvedCount: number,
  unresolvedCount: number,
  reviewThreads: ReviewThread[],
  severityCounts: { critical: number; major: number; trivial: number },
): Promise<void> {
  const now = new Date().toISOString()
  let content = `# PR Review #${prNumber} - CodeRabbit AI Export

This folder contains exported issues (resolvable review threads) and simple comments for PR #${prNumber}.

## Summary

- **Issues (resolvable review comments):** ${reviewComments.length}
  - 🔴 Critical: ${severityCounts.critical}
  - 🟠 Major: ${severityCounts.major}
  - 🔵 Trivial: ${severityCounts.trivial}
- **Comments (simple, not resolvable):** ${simpleItems.length}
  - **Resolved issues:** ${resolvedCount} ✓
  - **Unresolved issues:** ${unresolvedCount}

**Generated on:** ${formatDate(now)}

## Issues

### 🔴 Critical Issues

`

  // Group issues by severity for more efficient rendering
  const issuesBySeverity = {
    critical: [] as Array<{ index: number; comment: ReviewComment; isResolved: boolean }>,
    major: [] as Array<{ index: number; comment: ReviewComment; isResolved: boolean }>,
    trivial: [] as Array<{ index: number; comment: ReviewComment; isResolved: boolean }>,
  }

  for (let i = 0; i < reviewComments.length; i++) {
    const severity = getCommentSeverity(reviewComments[i])
    const isResolved = isCommentResolvedByPolicy(reviewComments[i], reviewThreads)
    issuesBySeverity[severity].push({ index: i, comment: reviewComments[i], isResolved })
  }

  // Render critical issues
  for (const { index, comment, isResolved } of issuesBySeverity.critical) {
    const checked = isResolved ? 'x' : ' '
    const statusLabel = isResolved ? 'resolved' : 'unresolved'
    const fileName = `issue_${(index + 1).toString().padStart(3, '0')}_critical_${statusLabel}.md`
    const issueFile = `issues/${fileName}`
    const loc = comment.line ? ` ${comment.path}:${comment.line}` : ` ${comment.path}`
    content += `- [${checked}] [Issue ${index + 1}](${issueFile}) -${loc}\n`
  }

  content += `

### 🟠 Major Issues

`

  // Render major issues
  for (const { index, comment, isResolved } of issuesBySeverity.major) {
    const checked = isResolved ? 'x' : ' '
    const statusLabel = isResolved ? 'resolved' : 'unresolved'
    const fileName = `issue_${(index + 1).toString().padStart(3, '0')}_major_${statusLabel}.md`
    const issueFile = `issues/${fileName}`
    const loc = comment.line ? ` ${comment.path}:${comment.line}` : ` ${comment.path}`
    content += `- [${checked}] [Issue ${index + 1}](${issueFile}) -${loc}\n`
  }

  content += `

### 🔵 Trivial Issues

`

  // Render trivial issues
  for (const { index, comment, isResolved } of issuesBySeverity.trivial) {
    const checked = isResolved ? 'x' : ' '
    const statusLabel = isResolved ? 'resolved' : 'unresolved'
    const fileName = `issue_${(index + 1).toString().padStart(3, '0')}_trivial_${statusLabel}.md`
    const issueFile = `issues/${fileName}`
    const loc = comment.line ? ` ${comment.path}:${comment.line}` : ` ${comment.path}`
    content += `- [${checked}] [Issue ${index + 1}](${issueFile}) -${loc}\n`
  }

  content += `\n## Comments (not resolvable)\n\n`
  for (let i = 0; i < simpleItems.length; i++) {
    const commentFile = `comments/comment_${(i + 1).toString().padStart(3, '0')}.md`
    const label = simpleItems[i].kind === 'review' ? 'review' : 'general'
    content += `- [ ] [Comment ${i + 1}](${commentFile}) (${label})\n`
  }

  await fs.writeFile(summaryFile, content, 'utf8')
  console.log(`  Created summary file: ${summaryFile}`)
}

function getConfiguredTimeZone(): string {
  const env = process.env.PR_REVIEW_TZ
  if (!env || env.toLowerCase() === 'local') {
    const sys = Intl.DateTimeFormat().resolvedOptions().timeZone
    return sys || 'UTC'
  }
  return env
}

function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString)
    if (Number.isNaN(d.getTime())) return dateString
    const tz = getConfiguredTimeZone()
    const parts = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: tz,
    })
      .formatToParts(d)
      .reduce(
        (acc: Record<string, string>, p) => {
          acc[p.type] = p.value
          return acc
        },
        {} as Record<string, string>,
      )
    return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second} ${tz}`
  } catch {
    return dateString // fallback to original format
  }
}

main().catch((error) => {
  logger.error('Unhandled error in main', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  })
  process.exit(1)
})
