---
description: "PHASE 4: Transform design into implementation plan with atomic tasks"
---

You are executing the **Product Engineering Planning** workflow.

## 🎯 Purpose

Break technical design into atomic, TDD-driven tasks with clear dependencies.

## 📋 Process

### Step 1: Load Required Skills
- Load `task-breakdown` skill from `skills/task-breakdown/SKILL.md`

### Step 2: Read Design Documents
- Locate design: `docs/design/DESIGN-{###}-{name}.md`
- Read all ADRs: `docs/adr/ADR-*.md`
- Review spec for user stories: `docs/specs/SPEC-{###}-{name}.md`

### Step 3: Invoke Task Planner Agent
- Invoke `task-planner` agent from `agents/task-planner.md`
- Agent will break design into implementable tasks

### Step 4: Task Breakdown Strategy

**Organize by Phases:**
1. **Foundation:** Core infrastructure (BLOCKS all stories)
2. **User Story 1 (P1 - MVP):** Tests → Implementation → Verification
3. **User Story 2 (P2):** Tests → Implementation → Verification
4. **User Story N (P3+):** Tests → Implementation → Verification
5. **Final Quality Gates:** Complete validation

**Task Granularity:**
- Each task: 5-20 minutes
- Specific file paths required
- Clear dependencies
- Test-first ordering (TDD)

### Step 5: Foundation Phase Tasks

**Core Setup (all stories depend on this):**
- T001: Project structure (domain, application, infrastructure, presentation)
- T002: Database schema and migrations (Drizzle)
- T003: DI Container with Symbol tokens
- T004: Base error handling (Result type)
- T005: Zod schemas structure

**Critical:** Mark as blocking for all user stories

### Step 6: Per User Story Tasks

**For EACH user story (US-1, US-2, etc.):**

**Tests First (Red Phase):**
- Contract tests for API endpoints
- Integration tests for use cases
- E2E tests for user journeys
- **All tests must FAIL initially**

**Implementation (Green Phase):**
- Domain entities and value objects
- Repository ports (interfaces)
- Repository implementations
- Use cases
- Controllers
- Routes
- DI Container registration

**Verification:**
- Run tests (expect green)
- Type check
- Commit

**Task Format:**
```
- [ ] T{###} [P?] [US#] Description
  - Story: US-#
  - Requirements: FR-###
  - Files: exact/path/to/file.ts
  - Depends: T###, T###
  - Estimate: X min
```

**[P] = Parallel:** Can run with other [P] tasks in same batch

### Step 7: Dependencies Mapping

**Create dependency graph:**
```
Foundation (T001-T005)
  ├─ T001 (Structure)
  │   ├─ T002 (DB)
  │   ├─ T003 (DI)
  │   └─ T005 (Errors)
  │
  └─ User Story 1
       ├─ Tests (T006, T007) [P]
       ├─ Entities (T008, T009) [P]
       └─ Repository → Use Case → Controller → Routes
```

### Step 8: Rastreabilidade Table

Map tasks to requirements:
| Task | User Story | Requirements | Files |
|------|------------|--------------|-------|
| T008 | US-1 | FR-001 | src/domain/entities/... |

### Step 9: Generate Implementation Plan

**Use template:** `templates/implementation-plan.md`

**Auto-number:**
- Scan `docs/plans/` for next number (PLAN-###)
- Link to design: `design: DESIGN-{###}`

**Content:**
- Goal (from spec)
- Architecture summary (from design)
- Tech stack (from design)
- All phases with tasks
- Dependencies graph
- Rastreabilidade table
- Final quality gates

**Save to:** `docs/plans/PLAN-{###}-{name}.md`

### Step 10: Generate Task List

**Use template:** `templates/tasks.md`

**Auto-number:**
- Scan `docs/tasks/` for next number (TASKS-###)
- Link to plan: `plan: PLAN-{###}`

**Content:**
- All tasks organized by batch
- Status tracking (backlog, in-progress, done, blocked)
- Parallel opportunities marked
- Dependencies graph
- Progress tracking table

**Save to:** `docs/tasks/TASKS-{###}-{name}.md`

### Step 11: Execution Handoff

**Present two options:**

**Option 1: Subagent-Driven (This Session)**
- Use `superpowers:subagent-driven-development`
- Fresh subagent per task
- Review between tasks
- Fast iteration

**Option 2: Batch Execution (Parallel Session)**
- Use `superpowers:executing-plans` in new session
- Execute tasks in batches (3-5 tasks)
- Checkpoints for review
- Systematic execution

**Ask:** "Which execution approach do you prefer?"

### Step 12: Present Plan and Tasks

Show the user:
- Location of plan document
- Location of task list
- Total tasks count
- Tasks by phase
- Critical path (foundation → US-1 → US-2)
- Parallel opportunities
- Estimated total time

---

## 📤 Output

- **File 1:** `docs/plans/PLAN-{###}-{name}.md`
  - Implementation plan with phases
  - Dependencies and rastreabilidade
  - Final quality gates

- **File 2:** `docs/tasks/TASKS-{###}-{name}.md`
  - Atomic task list
  - Status tracking
  - Progress table

---

## 🔗 Integration

**Input:**
- Design document `DESIGN-{###}`
- ADRs `ADR-*`
- Spec document `SPEC-{###}` (for user stories)

**MCP Servers Used:** None (design already has tech decisions)

**Next Phase:**
- Execute tasks using chosen method
- Then: `/product-engineering:validate`

---

## ✓ Success Criteria

- [ ] Plan document created with auto-numbered ID
- [ ] Task list created with auto-numbered ID
- [ ] Both linked to design document
- [ ] Foundation phase defined (blocks all stories)
- [ ] Each user story has: Tests → Implementation → Verification
- [ ] Tasks include exact file paths
- [ ] Dependencies clearly mapped
- [ ] Parallel tasks marked with [P]
- [ ] Rastreabilidade table complete
- [ ] Final quality gates included
- [ ] Execution handoff options presented
