---
description: "PHASE 3: Transform spec into technical design with architecture decisions and ADRs"
---

You are executing the **Product Engineering Design** workflow.

## 🎯 Purpose

Define HOW to build with architectural decisions, tech stack, and detailed design.

## 📋 Process

### Step 1: Load Required Skills

- Load `architecture-decision` skill from `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/skills/architecture-decision/SKILL.md`
- Load `technical-design` skill from `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/skills/technical-design/SKILL.md`

### Step 2: Read Spec Document

- Locate spec: `docs/specs/SPEC-{###}-{name}.md`
- Extract: user stories, requirements (FR + NFR), success criteria
- Understand scope and constraints

### Step 3: Invoke Solutions Architect Agent

- Invoke `solutions-architect` agent from `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/agents/solutions-architect.md`
- Agent will propose 2-3 architectural approaches

### Step 4: Architecture Evaluation (MCP Heavy)

**Research Using MCP:**

```
Context7: Framework docs (Hono, Drizzle, React 19, TanStack)
Perplexity: "Best practices for {architecture pattern} in {year}"
Perplexity: "{tech stack} pros and cons for {use case}"
Octocode: Reference implementations with similar requirements
```

**Propose 2-3 Architectures:**

1. Clean Architecture (layered, strict boundaries)
2. Hexagonal Architecture (ports & adapters)
3. Transactional Script (simple, direct)

For each: describe, pros, cons, recommendation

### Step 5: Tech Stack Decision

**Backend Stack:**

- Runtime: Bun (vs Node.js/Deno - research trade-offs)
- Framework: Hono (vs Express/Fastify - research)
- Database: PostgreSQL + Drizzle (vs others)
- Cache: Redis (if needed - justify)
- Queue: BullMQ (if needed - justify)

**Frontend Stack:**

- Framework: React 19 + Vite 6
- Router: TanStack Router
- State: Zustand + TanStack Query
- UI: shadcn/ui + Tailwind 4

**Each decision needs:**

- Rationale (why this choice?)
- MCP research references
- Trade-offs considered

### Step 6: System Structure Design

**Backend (if Clean Architecture):**

```
src/domain/       # Entities, VOs, Ports (no dependencies)
src/application/  # Use Cases, DTOs
src/infrastructure/ # Repos, Adapters, DB, DI
src/presentation/ # Routes, Controllers, Schemas
```

**Frontend (Feature-Based):**

```
features/{name}/
  components/  # Pure UI
  pages/      # Orchestration
  stores/     # Zustand
  gateways/   # Interface + HTTP + Fake
```

### Step 7: Data Model Design

**Define:**

- Entities (with attributes, relationships, invariants)
- Value Objects (immutable, validation rules)
- Aggregates (roots, boundaries, invariants)
- Database schema (Drizzle definitions)

### Step 8: API Design

**Define endpoints:**
| Method | Path | Description | Request | Response | Auth |
|--------|------|-------------|---------|----------|------|
| POST | /api/v1/{resource} | ... | Schema | Schema | JWT |

**Create Zod schemas** for requests/responses

### Step 9: Architecture Gates Validation

Run through ALL 7 gates from `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/gates/architecture-gates.md`:

1. **Simplicity Gate:** ≤3 projects? No future-proofing?
2. **Type Safety Gate:** No `any`? Branded types?
3. **Clean Code Gate:** Functions < 20 lines? SOLID?
4. **Test-First Gate:** TDD approach? Real dependencies?
5. **Clean Architecture Gate (Backend):** Dependency flow correct?
6. **Feature-Based Gate (Frontend):** Pure components? Injected gateways?
7. **Naming Conventions Gate:** kebab-case files? PascalCase classes?

**For each FAIL:** Document in "Complexity Tracking" section

### Step 10: Create ADRs

For each major decision:

- Use template: `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/templates/adr.md`
- Auto-number: ADR-{####} (e.g., ADR-0001)
- Document: context, decision, alternatives, consequences
- Save to: `docs/adr/ADR-{####}-{decision-name}.md`

**Typical ADRs:**

- ADR-0001: Choice of architecture pattern
- ADR-0002: Tech stack selection
- ADR-0003: Database choice
- ADR-0004: State management approach

### Step 11: Generate Design Document

**Use template:** `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/templates/adr.md`

**Auto-number:**

- Scan `docs/design/` for next number (DESIGN-###)
- Link to spec: `spec: SPEC-{###}`

**Save to:** `docs/design/DESIGN-{###}-{name}.md`

### Step 12: Present Design

Show the user:

- Location of design document
- Location of ADRs
- Architecture approach and rationale
- Tech stack decisions
- Architecture gates status (PASS/FAIL for each)
- Any gate violations with justifications

### Step 13: Decision Point

**If approved to proceed:**
"Design approved! Ready to create Implementation Plan?

Execute `/product-engineering:plan` to break this design into atomic, executable tasks."

**If gates violated:**
"Some architecture gates failed. Review 'Complexity Tracking' section - are justifications acceptable?"

**If needs revision:**
"What aspects of the design need adjustment?"

---

## 📤 Output

- **File:** `docs/design/DESIGN-{###}-{name}.md`
- **ADRs:** `docs/adr/ADR-{####}-{decision}.md` (multiple)
- **Content:** Complete design with:
  - Architecture overview and rationale
  - Tech stack with research-backed decisions
  - System structure (backend + frontend)
  - Data model (entities, VOs, aggregates, schema)
  - API design (endpoints, schemas)
  - Architecture gates validation
  - Complexity tracking (if any gates failed)
  - Security and performance considerations

---

## 🔗 Integration

**Input:** Spec document `SPEC-{###}`

**MCP Servers Used (Heavy):**

- Context7 (framework documentation, best practices)
- Perplexity (architecture patterns, tech comparisons)
- Octocode (reference implementations)

**Next Phase:**

- If approved: `/product-engineering:plan`
- If needs work: Iterate on design

---

## ✓ Success Criteria

- [ ] Design document created with auto-numbered ID
- [ ] Linked to spec document
- [ ] 2-3 architecture alternatives evaluated
- [ ] Tech stack decisions with rationale and MCP references
- [ ] System structure defined (backend + frontend)
- [ ] Data model complete
- [ ] API design complete with schemas
- [ ] All 7 architecture gates validated
- [ ] ADRs created for major decisions
- [ ] Complexity tracking filled if any gates violated
