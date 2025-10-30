---
name: architecture-decision
description: Create Architecture Decision Records (ADRs) documenting technical choices, alternatives, consequences, and compliance with architecture gates
---

# Architecture Decision Records (ADRs)

## Overview

Document significant architectural decisions with structured ADRs that capture context, alternatives, trade-offs, and consequences for long-term maintainability and knowledge preservation.

**Core Principle:** Every major technical decision deserves documentation. ADRs create an audit trail of "why" that prevents future teams from repeating analysis or making incompatible changes.

**Announce at start:** "I'm using the architecture-decision skill to create ADRs for this technical design."

---

## Quick Reference

| Component              | Purpose             | Key Pattern                     | Example                           |
| ---------------------- | ------------------- | ------------------------------- | --------------------------------- |
| **Status**             | Lifecycle tracking  | proposed/accepted/deprecated    | "Accepted" after review           |
| **Context**            | Problem & forces    | Why this decision is needed     | Performance bottleneck identified |
| **Decision**           | What we're doing    | Clear, specific choice          | "We will use Redis for caching"   |
| **Alternatives**       | Options considered  | 2-3 alternatives with pros/cons | Memcached, in-memory, Redis       |
| **Consequences**       | Trade-offs          | Positive/negative/neutral       | Faster reads, more complexity     |
| **Architecture Gates** | Compliance check    | Pass/Fail against 7 gates       | Simplicity Gate: PASS             |
| **References**         | Supporting research | MCP sources, docs, benchmarks   | Link to Perplexity research       |

---

## When to Create an ADR

### Mandatory ADRs (Always Create)

1. **Architecture Pattern Selection**

   - Clean Architecture vs Hexagonal vs Transactional Script
   - Monolith vs Microservices
   - Layered vs Event-Driven

2. **Tech Stack Decisions**

   - Framework choice (Hono vs Express vs Fastify)
   - Database selection (PostgreSQL vs MongoDB vs SQLite)
   - State management (Zustand vs Redux vs Context API)
   - UI library (React vs Vue vs Svelte)

3. **Infrastructure Choices**

   - Deployment platform (Vercel vs AWS vs self-hosted)
   - Cache strategy (Redis vs Memcached vs none)
   - Queue system (BullMQ vs RabbitMQ vs SQS)

4. **Cross-Cutting Concerns**
   - Authentication approach (JWT vs sessions)
   - Error handling strategy (exceptions vs Result types)
   - Logging/observability tooling

### Optional ADRs (Good to Have)

- Significant library additions (e.g., adding Drizzle ORM)
- Major refactoring decisions
- Performance optimization strategies
- Security approach changes

### When NOT to Create an ADR

- Trivial decisions (formatting rules, variable names)
- Obvious/standard choices with no alternatives
- Implementation details that don't affect architecture
- Temporary solutions/experiments

---

## The ADR Creation Process

### Phase 1: Identify the Decision

**Goal:** Determine if this decision warrants an ADR

**Questions:**

- Will this decision affect multiple modules or teams?
- Does this choice constrain future options?
- Would a new team member ask "why did we choose this?"
- Are there multiple valid alternatives?

**If YES to 2+ questions � Create ADR**

---

### Phase 2: Research with MCP

**Goal:** Gather evidence and best practices before documenting alternatives

**Use Perplexity for:**

- "What are pros/cons of {Option A} vs {Option B} for {use case} in 2025?"
- "What are common pitfalls with {technology}?"
- "What performance benchmarks exist for {framework} vs {alternative}?"

**Use Context7 for:**

- Official documentation for each alternative
- Framework-specific best practices
- API patterns and examples

**Use Octocode for:**

- Reference implementations in similar projects
- Real-world usage patterns
- GitHub stars/activity as adoption indicators

**Example Research Queries:**

```javascript
// 1. Compare alternatives (Perplexity)
const comparison = await perplexity.ask([
  {
    role: "user",
    content:
      "Compare Hono vs Express vs Fastify for TypeScript API development in 2025. Include performance benchmarks, TypeScript support, middleware ecosystem, and learning curve.",
  },
]);

// 2. Get official docs (Context7)
const honoDoc = await context7.getLibraryDocs({
  libraryId: "/honojs/hono",
  topic: "getting started and middleware patterns",
});

// 3. Find real-world usage (Octocode)
const refImpls = await octocode.searchRepositories({
  queries: [
    {
      topicsToSearch: ["hono", "typescript", "api"],
      stars: ">500",
      sort: "stars",
    },
  ],
});
```

**Output:** Research findings document with sources cited

---

### Phase 3: Define Context & Forces

**Goal:** Establish why this decision is necessary

#### Context Structure

```markdown
## Context

**Problem:**
{What problem are we trying to solve? Be specific.}

**Current Situation:**
{What is the current state that's causing this problem?}

**Forces:**
{What factors influence this decision?}

- Business constraints (budget, timeline, team skills)
- Technical constraints (existing stack, performance requirements)
- Organizational constraints (compliance, standards, policies)
```

**Example:**

```markdown
## Context

**Problem:**
We need a web framework for our backend API that supports TypeScript natively, provides middleware for authentication/logging, and can handle 1000 req/sec with low latency (<50ms p95).

**Current Situation:**
Currently have no framework chosen. Team has Node.js experience but wants better TypeScript support than Express provides. Performance is critical for real-time features.

**Forces:**

- Team familiar with Express patterns but frustrated by type safety
- Need production-ready middleware ecosystem
- Performance target: 1000 req/sec, <50ms p95 latency
- Prefer native TypeScript over @types/\* approach
- Timeline: 2 months to MVP
- Small team (3 backend devs)
```

---

### Phase 4: Explore Alternatives (2-3 Required)

**Goal:** Document 2-3 viable alternatives with research-backed pros/cons

#### Alternative Template

```markdown
### Alternative {N}: {Name}

**Description:**
{Brief description of the alternative}

**Pros:**

- {Pro 1 - cite research if available}
- {Pro 2}
- {Pro 3}

**Cons:**

- {Con 1 - cite research if available}
- {Con 2}
- {Con 3}

**Why {Recommended/Rejected}:**
{Specific rationale based on context and forces}
```

**Critical:** Each alternative must have **research-backed** pros/cons, not speculation.

**Example:**

```markdown
### Alternative 1: Express.js

**Description:**
Most popular Node.js framework with massive ecosystem and community support.

**Pros:**

- Mature ecosystem (10,000+ middleware packages) [npm stats]
- Large community (Stack Overflow, tutorials abundant)
- Team already familiar (no learning curve)
- Battle-tested in production at scale [Ref: Perplexity research]

**Cons:**

- TypeScript support via @types only (not first-class) [Ref: Context7 docs]
- Performance: ~15,000 req/sec in benchmarks [Ref: Fastify benchmarks]
- Middleware typing often incomplete/incorrect
- Callback-based patterns (not modern async/await-first)

**Why Rejected:**
While mature and familiar, TypeScript experience is poor compared to newer alternatives. Performance benchmarks show 3x slower than Hono for our target workload. Team frustration with type safety outweighs familiarity benefit.

---

### Alternative 2: Fastify

**Description:**
Performance-focused framework with schema-based validation and good TypeScript support.

**Pros:**

- Excellent performance: ~50,000 req/sec [Ref: Fastify benchmarks]
- Schema-first approach ensures type safety
- Active ecosystem and plugins
- Good TypeScript support (better than Express)

**Cons:**

- Schema-first approach adds boilerplate
- Smaller ecosystem than Express
- Learning curve for schema validation patterns
- Less familiar to team

**Why Rejected:**
Performance exceeds requirements (50k >> 1k target), but schema-first approach adds complexity we don't need. Good TypeScript but still not as clean as Hono's approach. Overkill for our use case.

---

### Alternative 3: Hono (Recommended)

**Description:**
Modern, TypeScript-first framework optimized for edge/serverless with Express-like API.

**Pros:**

- Native TypeScript (designed for TS from ground up) [Ref: Context7 docs]
- Excellent performance: ~40,000 req/sec [Ref: Hono benchmarks]
- Express-like API (easy migration from team's mental model)
- Small bundle size, works on edge (Cloudflare Workers, Deno, Bun)
- Growing ecosystem with middleware for common needs

**Cons:**

- Smaller ecosystem than Express (but sufficient for our needs)
- Newer (less battle-tested than Express)
- Smaller community (fewer Stack Overflow answers)

**Why Recommended:**
Best balance of TypeScript-first design, performance (40x our requirement), and familiar API. Ecosystem is sufficient for authentication, logging, CORS needs. Performance headroom future-proofs as we scale. Native TS eliminates type frustrations team experienced with Express.
```

---

### Phase 5: Document Decision & Approach

**Goal:** State the chosen alternative and how it will be implemented

```markdown
## Decision

**We will:**
{Clear, specific statement of what we're choosing}

**Approach:**
{How we'll implement this - specific steps, phases, or patterns}
```

**Example:**

```markdown
## Decision

**We will:**
Adopt Hono as our backend web framework for all API routes and middleware.

**Approach:**

1. Install Hono and configure for Bun runtime
2. Create middleware stack: logging � authentication � error handling
3. Define route structure following Clean Architecture (controllers in infrastructure/http/)
4. Use Hono's built-in validation with Zod schemas
5. Migrate existing Express mental models to Hono patterns (minimal relearning)

**Migration Path:**
No migration needed (greenfield project). For future reference if porting from Express:

- Express `app.use()` � Hono `app.use()`
- Express `req/res` � Hono `c.req/c.json()`
- Express middleware � Hono middleware (similar patterns)
```

---

### Phase 6: Analyze Consequences

**Goal:** Document trade-offs honestly - what gets easier/harder

#### Consequence Categories

- **Positive**: What improves?
- **Negative**: What gets harder or introduces risks?
- **Neutral**: Changes without clear good/bad

```markdown
## Consequences

### Positive Consequences

- Native TypeScript eliminates type definition mismatches
- Performance headroom (40x requirement) supports future growth
- Express-like API minimizes learning curve
- Small bundle size enables edge deployment if needed

### Negative Consequences

- Smaller ecosystem means custom middleware may be needed for niche features
- Fewer community resources (Stack Overflow, tutorials) compared to Express
- Less battle-tested in large-scale production (risk: unknown edge cases)
- Team needs to learn Hono-specific patterns (middleware, context API)

### Neutral Consequences

- Different deployment patterns than Express (but we're greenfield)
- Need to evaluate Hono plugins vs Express ecosystem on case-by-case basis
```

---

### Phase 7: Architecture Gates Validation

**Goal:** Validate decision against project's 7 architecture gates

**The 7 Gates (from plugins/product-engineering/gates/architecture-gates.md):**

1. **Simplicity Gate**: d3 projects, no future-proofing, Rule of Three before DRY
2. **Type Safety Gate**: No `any`, branded types, type guards
3. **Clean Code Gate**: Functions <20 lines, SOLID, meaningful names
4. **Test-First Gate**: TDD (Red-Green-Refactor), tests before code
5. **Clean Architecture Gate** (Backend): Domain � Application � Infrastructure (with HTTP layer)
6. **Feature-Based Architecture Gate** (Frontend): Pure components, injected gateways, Zustand stores
7. **Naming Conventions Gate**: kebab-case (files), PascalCase (classes), camelCase (functions)

**Validation Format:**

```markdown
## Compliance Check

**Architecture Gates:**

- [x] **Simplicity Gate**: PASS - Hono is single framework choice, no additional complexity
- [x] **Type Safety Gate**: PASS - Native TypeScript support eliminates `any` usage
- [x] **Clean Code Gate**: N/A - Framework choice doesn't affect function size
- [x] **Test-First Gate**: PASS - Hono supports test-friendly context mocking
- [x] **Clean Architecture Gate**: PASS - Hono controllers live in infrastructure/http/, delegate to use cases
- [ ] **Feature-Based Architecture Gate**: N/A - Backend framework (frontend gate)
- [x] **Naming Conventions Gate**: PASS - Framework doesn't constrain naming

**If any FAIL:**
{Justify in Technical Design's "Complexity Tracking" section with:

- Why this complexity is necessary
- What problem it solves
- Why simpler alternatives were rejected
  }
```

**If a gate FAILS:** Document in the **Complexity Tracking** section of the technical design document.

---

### Phase 8: Complete ADR Template

**Goal:** Fill ADR template with all research and analysis

**Activities:**

1. Load `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/templates/adr.md`
2. Auto-number: Scan `docs/adr/` for next ADR-#### (e.g., ADR-0001, ADR-0002)
3. Fill all sections with research findings
4. Link to design document: `design: DESIGN-{number}`
5. Set status: `proposed` (until reviewed) or `accepted` (if approved immediately)
6. Add references: Link to Perplexity research, Context7 docs, Octocode repos
7. Save to `docs/adr/ADR-{####}-{decision-name}.md`

**Naming Convention:** `ADR-{####}-{kebab-case-decision-title}.md`

**Example:** `ADR-0001-choose-hono-web-framework.md`

---

## ADR Status Lifecycle

**Status values and their meanings:**

1. **proposed**: Decision documented but not yet approved
2. **accepted**: Decision approved and should be implemented
3. **rejected**: Proposed decision was not accepted (keep for historical context)
4. **deprecated**: Previously accepted decision is no longer recommended
5. **superseded**: Replaced by a newer ADR (link to superseding ADR)

**Status Transitions:**

```
proposed � accepted (after review/approval)
proposed � rejected (decision not to proceed)
accepted � deprecated (old decision no longer applies)
accepted � superseded (replaced by ADR-####)
```

**Example Supersession:**

```markdown
---
id: ADR-0001
status: superseded
superseded-by: ADR-0012
---

# ADR-0001: Use Express for Web Framework

## Status

**superseded**

Superseded by: [ADR-0012: Migrate to Hono](./ADR-0012-migrate-to-hono.md)

{Rest of original ADR...}
```

---

## Key Principles

### Principle 1: Document "Why", Not Just "What"

**The most valuable part of an ADR is the reasoning**

- Anyone can see WHAT we chose by reading code
- Only ADRs preserve WHY we chose it
- Future teams need "why" to avoid repeating analysis

### Principle 2: Research Before Writing

**Use MCP tools to gather evidence, not opinions**

- Perplexity: Benchmarks, comparisons, industry trends
- Context7: Official docs, API patterns
- Octocode: Real-world usage examples

**Don't guess or speculate - cite sources**

### Principle 3: Alternatives Are Mandatory

**Every ADR must document 2-3 alternatives with pros/cons**

- Shows due diligence was done
- Prevents "why didn't we consider X?" questions later
- Helps future teams understand trade-offs

### Principle 4: Be Honest About Cons

**Document negative consequences honestly**

- Every decision has trade-offs
- Hiding cons doesn't make them go away
- Teams need to know risks to mitigate them

### Principle 5: ADRs Are Immutable

**Once accepted, ADRs should not be edited (except status)**

- If decision changes, create new ADR that supersedes old one
- Preserves decision history and reasoning evolution
- Shows learning over time

---

## Common Pitfalls

L **Don't:**

1. **Skip alternatives** - Every decision needs 2-3 alternatives documented
2. **Guess at pros/cons** - Use MCP research to back claims
3. **Hide negative consequences** - Be honest about trade-offs
4. **Write after implementation** - ADRs should guide implementation, not document past
5. **Edit accepted ADRs** - Create superseding ADR instead
6. **Skip architecture gates validation** - Always check compliance
7. **Forget references** - Link to research sources (Perplexity, Context7, Octocode)
8. **Be vague about decision** - "We will" statement must be specific

 **Do:**

1. **Research with MCP before writing** - Evidence > opinions
2. **Document 2-3 alternatives** - Show trade-offs considered
3. **Be honest about consequences** - Both positive AND negative
4. **Link to supporting research** - Perplexity results, Context7 docs, Octocode repos
5. **Validate against architecture gates** - All 7 gates checked
6. **Use clear status lifecycle** - proposed � accepted � deprecated/superseded
7. **Make decisions specific** - "We will use Hono v3" not "We'll use a framework"
8. **Create before implementing** - ADRs guide code, not document code

---

## ADR Quality Checklist

Use this checklist before finalizing an ADR:

### Structure

- [ ] Auto-numbered (ADR-####)
- [ ] Linked to design document (design: DESIGN-{number})
- [ ] Status set (proposed/accepted)
- [ ] Created date included

### Content Quality

- [ ] Context explains problem clearly
- [ ] Forces documented (business, technical, organizational constraints)
- [ ] 2-3 alternatives documented
- [ ] Each alternative has research-backed pros/cons
- [ ] Decision statement is specific ("We will use X" not "We'll use something")
- [ ] Approach describes implementation steps

### Consequences

- [ ] Positive consequences listed
- [ ] Negative consequences honestly documented
- [ ] Neutral consequences included if applicable

### Validation

- [ ] All 7 architecture gates validated (PASS/FAIL/N/A)
- [ ] Failed gates justified in Complexity Tracking (if any)

### References

- [ ] MCP research linked (Perplexity queries)
- [ ] Context7 docs referenced (where applicable)
- [ ] Octocode repos linked (where applicable)
- [ ] Benchmarks/data cited (where applicable)

### Review

- [ ] Decision makers identified
- [ ] Participants listed
- [ ] Date documented

---

## Handoff Pattern

After ADR creation:

**Announce:**

"ADR-{####} created: **{Decision Title}**

**Decision:** {One-sentence summary}

**Alternatives Considered:** {List alternatives}

**Architecture Gates:** {Summary - all PASS or note FAILs}

**Status:** {proposed/accepted}

Saved to `docs/adr/ADR-{####}-{name}.md`

{If proposed} � Ready for review and approval
{If accepted} � Ready for implementation"

---

## Example ADR Workflow

```
1. Identify decision needed: "Which web framework?"
2. Research with MCP:
   - Perplexity: Compare Hono vs Express vs Fastify
   - Context7: Get Hono docs and Express docs
   - Octocode: Find real-world Hono usage examples
3. Document context: Performance needs, TypeScript frustration
4. Document alternatives: Express (familiar), Fastify (fast), Hono (TS-first)
5. State decision: "We will use Hono"
6. Analyze consequences: Better TS, smaller ecosystem
7. Validate gates: All PASS except N/A
8. Create ADR-0001-choose-hono-web-framework.md
9. Set status: accepted
10. Reference in technical design
```

---

_Powered by research from Perplexity MCP, architectural best practices, and GitHub Spec-Kit methodology_
