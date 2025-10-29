# Product Engineering Plugin

Transform ideas into implementation through a systematic, AI-driven workflow with strong architectural discipline.

## 🎯 Overview

The Product Engineering plugin provides a complete workflow for transforming rough ideas into production-ready implementations:

```
Idea → Discovery → Spec → Design → Plan → Implementation → Validation
```

Each phase has clear inputs, outputs, and quality gates to ensure alignment between business intent and technical implementation.

## 🚀 Quick Start

### 1. Discovery Phase
Transform rough idea into validated discovery document:

```bash
/product-engineering:discover
```

**Input:** Rough idea description
**Output:** `docs/discovery/DISC-{###}-{name}.md`
**MCP:** Perplexity, Context7, Octocode for market research

### 2. Specification Phase
Create executable spec (PRD) with user stories:

```bash
/product-engineering:specify
```

**Input:** Discovery document
**Output:** `docs/specs/SPEC-{###}-{name}.md` + feature branch
**MCP:** Context7, Perplexity for requirements research

### 3. Design Phase
Define technical architecture and decisions:

```bash
/product-engineering:design
```

**Input:** Spec document
**Output:** `docs/design/DESIGN-{###}-{name}.md` + ADRs
**MCP:** Context7 (framework docs), Perplexity (best practices), Octocode (reference implementations)

### 4. Planning Phase
Break design into atomic, executable tasks:

```bash
/product-engineering:plan
```

**Input:** Design document + ADRs
**Output:** `docs/plans/PLAN-{###}-{name}.md` + `docs/tasks/TASKS-{###}-{name}.md`

### 5. Validation Phase
Verify implementation against spec and design:

```bash
/product-engineering:validate
```

**Input:** Spec + Design + Implementation code
**Output:** Validation report with coverage and gaps

## 📋 Workflow Phases

### Phase 1: Discovery
**Purpose:** Validate problem-solution fit before investing in detailed specs

**Activities:**
- Socratic questioning to refine vague ideas
- Market research (competitors, similar solutions)
- User pain point identification
- Alternative evaluation
- Go/No-Go decision

**Output:** Discovery document with research context and decision rationale

---

### Phase 2: Specification
**Purpose:** Define WHAT to build (not HOW) with clear acceptance criteria

**Activities:**
- Requirements elicitation (functional + non-functional)
- User story creation (prioritized P1, P2, P3)
- Acceptance criteria definition
- Success metrics identification
- Scope boundaries

**Key Principle:** Each user story must be independently testable

**Output:** Spec document (PRD) linked to discovery

---

### Phase 3: Design
**Purpose:** Define HOW to build with architectural decisions

**Activities:**
- Architecture selection (Clean Architecture, Hexagonal, etc.)
- Tech stack decision with trade-offs
- Data model design
- API design
- ADR creation for each major decision
- Architecture gates validation

**Architecture Gates:**
- ✅ Simplicity Gate: ≤3 projects, no future-proofing
- ✅ Type Safety Gate: No `any` types, branded types for domain
- ✅ Clean Code Gate: Functions < 20 lines, SOLID principles

**Output:** Technical design document + ADRs

---

### Phase 4: Planning
**Purpose:** Break design into atomic, TDD-driven tasks

**Activities:**
- Task breakdown by user story
- Dependency identification
- Batch grouping (parallel execution opportunities)
- Test-first task ordering
- Rastreabilidade mapping (task → user story → requirements)

**Key Principle:** Tests written FIRST (TDD Red-Green-Refactor)

**Output:** Implementation plan + task list with dependencies

---

### Phase 5: Validation
**Purpose:** Ensure implementation matches spec and passes all gates

**Activities:**
- Requirements coverage verification
- Architecture gates check
- Quality gates check (tests, types, lint, format)
- Gap identification
- Deviation analysis

**Output:** Validation report

## 🏗️ Architecture Principles

Our workflow enforces these architectural principles (see `gates/architecture-gates.md`):

### 1. Simplicity First
- Start with ≤3 projects maximum
- No future-proofing or speculative features
- Justify every abstraction layer

### 2. Type Safety
- No `any` types in TypeScript
- Use branded types for domain primitives
- Type guards for unknown types

### 3. Clean Code
- Functions < 20 lines
- SOLID principles (SRP, OCP, LSP, ISP, DIP)
- DRY only after Rule of Three
- Tell, Don't Ask pattern

### 4. Test-First
- TDD mandatory (Red-Green-Refactor)
- Tests written before implementation
- Integration tests with real dependencies

### 5. Clean Architecture (Backend)
- Domain layer (no dependencies)
- Application layer (depends on domain)
- Infrastructure layer (depends on application)
- Presentation layer (depends on application)

### 6. Feature-Based (Frontend)
- Components: Pure UI
- Pages: Orchestration
- Stores: Zustand (framework-agnostic)
- Gateways: Interface + HTTP + Fake (injected via Context)

## 📁 Document Structure

All documents are saved in `docs/` with clear naming and linking:

```
docs/
├── discovery/
│   └── DISC-001-feature-name.md
├── specs/
│   └── SPEC-001-feature-name.md        # Links to DISC-001
├── design/
│   └── DESIGN-001-feature-name.md      # Links to SPEC-001
├── adr/
│   ├── ADR-0001-decision-name.md
│   └── ADR-0002-another-decision.md
├── plans/
│   └── PLAN-001-feature-name.md        # Links to DESIGN-001
└── tasks/
    └── TASKS-001-feature-name.md       # Links to PLAN-001
```

**Rastreabilidade:** Task → User Story → Requirements → Discovery

## 🔗 Integration with Existing Plugins

### Superpowers Plugin
- Uses `executing-plans` skill for task execution
- Uses `brainstorming` skill as basis for `idea-refinement`
- Uses `code-reviewer` agent for validation

### Architecture-Design Plugin
- Uses `clean-architecture` skill during design phase
- Uses `backend-engineer` skill for implementation
- Uses `frontend-engineer` skill for UI implementation
- Uses `code-standards` skill throughout
- Uses `typescript-type-safety` skill throughout

### Quality Plugin
- Uses `/quality:check` before validation phase
- Enforces quality gates

### Git Plugin
- Uses `/git:commit` for commits
- Uses `/git:pr-creation` for PRs

## 🛠️ MCP Integration

Each phase leverages MCP servers for research:

### Context7
- Framework documentation (React, Hono, Drizzle, TanStack)
- Library API references
- Version-specific implementation patterns

### Perplexity
- Market research and competitor analysis
- Architectural best practices
- Latest technology trends
- Requirements for similar solutions

### Octocode
- Reference implementations from GitHub
- Private repository access
- Code patterns and examples
- Architectural patterns from real projects

## 📖 Templates

All templates are in `templates/` and support:
- YAML frontmatter for metadata
- Auto-numbering (DISC-###, SPEC-###, etc.)
- Cross-linking between documents
- [NEEDS CLARIFICATION] markers for ambiguities

Available templates:
- `discovery.md` - Discovery document
- `spec.md` - Specification (PRD)
- `technical-design.md` - Technical design
- `adr.md` - Architecture Decision Record
- `implementation-plan.md` - Implementation plan
- `tasks.md` - Task list

## 🎓 Examples

See `examples/` directory for complete workflow examples:
- `discovery-example.md` - Real-world discovery document
- `spec-example.md` - Complete spec with user stories
- `design-example.md` - Technical design with ADRs
- `plan-example.md` - Implementation plan with tasks

## 🤝 Contributing

This plugin follows the standards defined in:
- `gates/architecture-gates.md` - Our architectural constitution
- Superpowers plugin - Workflow patterns
- Architecture-Design plugin - Technical patterns

## 📝 License

MIT License - See LICENSE file for details

---

**Next Steps:**
1. Run `/product-engineering:discover` to start with an idea
2. Review generated documents and refine
3. Progress through phases with human checkpoints
4. Validate final implementation

**Philosophy:** Specifications drive implementation, not the other way around.
