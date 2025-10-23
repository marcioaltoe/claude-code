#!/usr/bin/env node
/**
 * Universal Pull Request Review Exporter for Claude Code
 *
 * Executes the PR review export script with Bun:
 * - Download PR reviews: node run.js download [PR_NUMBER]
 * - Help: node run.js --help
 *
 * Ensures proper module resolution and dependency installation.
 */

import { execSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change to skill directory for proper module resolution
process.chdir(__dirname);

/**
 * Check if Bun is installed
 */
function checkBunInstalled() {
  try {
    execSync('bun --version', { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if dependencies are installed
 */
function checkDependenciesInstalled() {
  return existsSync(join(__dirname, 'node_modules'));
}

/**
 * Install dependencies using Bun
 */
function installDependencies() {
  console.log('📦 Dependencies not found. Installing...');
  try {
    execSync('bun install', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Dependencies installed successfully');
    return true;
  } catch (e) {
    console.error('❌ Failed to install dependencies:', e.message);
    console.error('Please run manually: cd', __dirname, '&& bun install');
    return false;
  }
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Pull Request Review Exporter - Claude Code Skill

USAGE:
  node run.js download [PR_NUMBER]     Download CodeRabbit comments for a PR
  node run.js download                 Download comments for latest open PR
  node run.js --help                   Show this help message

EXAMPLES:
  node run.js download 123             Download PR #123 reviews
  node run.js download                 Download latest open PR reviews

  # From any directory (saves to that directory's .reviews/)
  CWD=/path/to/repo node run.js download 123

ENVIRONMENT VARIABLES:
  GITHUB_TOKEN      GitHub Personal Access Token (required)
  OUTPUT_DIR        Output directory for reviews (default: ./.reviews)
  CWD               Working directory to save reviews (default: current directory)
  LOG_LEVEL         Logging level: error, warn, info, debug (default: info)
  PR_REVIEW_TZ      Timezone for dates (default: system timezone)

SETUP:
  1. Create .env file in skill directory:
     echo "GITHUB_TOKEN=ghp_your_token_here" > .env

  2. Optionally configure output directory and logging:
     echo "OUTPUT_DIR=./my-reviews" >> .env
     echo "LOG_LEVEL=debug" >> .env

For more information, see README.md
`);
}

/**
 * Run the PR review export script
 */
function runPRReviewScript(args) {
  const scriptPath = join(__dirname, 'pr-review.ts');

  if (!existsSync(scriptPath)) {
    console.error('❌ Error: pr-review.ts not found in skill directory');
    console.error('Expected at:', scriptPath);
    process.exit(1);
  }

  console.log('🚀 Starting PR Review Exporter...\n');

  // Use spawn to stream output in real-time
  const bunProcess = spawn('bun', ['run', scriptPath, ...args], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env }
  });

  bunProcess.on('error', (error) => {
    console.error('❌ Failed to start Bun process:', error.message);
    process.exit(1);
  });

  bunProcess.on('exit', (code) => {
    process.exit(code || 0);
  });
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  // Show help
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  // Check Bun installation
  if (!checkBunInstalled()) {
    console.error('❌ Bun is not installed or not in PATH');
    console.error('Please install Bun from: https://bun.sh');
    console.error('Or use: curl -fsSL https://bun.sh/install | bash');
    process.exit(1);
  }

  // Check and install dependencies if needed
  if (!checkDependenciesInstalled()) {
    const installed = installDependencies();
    if (!installed) {
      process.exit(1);
    }
  }

  // Parse command
  const command = args[0];

  if (command === 'download' || !command) {
    // Extract PR number if provided
    const prArgs = args.slice(1);
    runPRReviewScript(prArgs);
  } else {
    console.error(`❌ Unknown command: ${command}`);
    console.error('Run "node run.js --help" for usage information');
    process.exit(1);
  }
}

// Run main function
main().catch((error) => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
