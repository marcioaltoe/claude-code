---
id: PLAN-{auto-number}
design: DESIGN-{number}
created: {YYYY-MM-DD}
status: draft
phase: planning
---

# Implementation Plan: {Feature Name}

> **For Claude:** Use `superpowers:executing-plans` to implement this plan task-by-task.
>
> **Input:** Technical Design `DESIGN-{number}` + ADRs
> **Branch:** `{###-feature-name}`

## 🎯 Goal

{One-sentence goal from spec - what are we building?}

---

## 🏗️ Architecture

{2-3 sentences summarizing architecture approach from technical design}

---

## 🛠️ Tech Stack

**Backend:**
- Runtime: {Bun}
- Framework: {Hono}
- Database: {PostgreSQL + Drizzle}
- Cache: {Redis}
- Queue: {BullMQ}

**Frontend:**
- Framework: {React 19 + Vite 6}
- Router: {TanStack Router}
- State: {Zustand + TanStack Query}
- UI: {shadcn/ui + Tailwind 4}

**Testing:**
- {Bun test + React Testing Library + Playwright}

---

## 📦 Phase 1: Foundation (Shared Infrastructure)

**Purpose:** Core setup that blocks all user stories

**Critical:** This phase MUST be complete before ANY user story can begin.

### Tasks

- [ ] **T001** Setup project structure per Clean Architecture
  - **Files:** `src/domain/`, `src/application/`, `src/infrastructure/`, `src/presentation/`
  - **Story:** -
  - **Estimate:** 10 min

- [ ] **T002** Initialize Drizzle schema and migrations
  - **Files:** `src/infrastructure/database/schema.ts`, `drizzle.config.ts`
  - **Story:** -
  - **Depends:** T001
  - **Estimate:** 15 min

- [ ] **T003** [P] Configure DI Container with Symbol tokens
  - **Files:** `src/infrastructure/container/main.ts`, `src/infrastructure/container/tokens.ts`
  - **Story:** -
  - **Depends:** T001
  - **Estimate:** 15 min

- [ ] **T004** [P] Setup Zod validation schemas structure
  - **Files:** `src/presentation/schemas/`
  - **Story:** -
  - **Depends:** T001
  - **Estimate:** 5 min

- [ ] **T005** [P] Create base error handling (Result type)
  - **Files:** `src/domain/result.ts`
  - **Story:** -
  - **Depends:** T001
  - **Estimate:** 10 min

**Checkpoint:** ✅ Foundation ready - user stories can begin in parallel

---

## 🎯 Phase 2: User Story 1 - {Title} (Priority: P1) 🎯 MVP

**Goal:** {From spec US-1}

**Independent Test:** {From spec US-1}

**Rastreabilidade:** US-1 → {FR-001, FR-002, NFR-P-001}

### Tests (Write FIRST, Ensure FAIL) 🔴

- [ ] **T006** [P] [US1] Write contract test for `POST /api/{resource}`
  - **Files:** `tests/integration/api/{resource}.integration.test.ts`
  - **Story:** US-1
  - **Requirements:** FR-001
  - **Depends:** T001, T002, T003
  - **Estimate:** 20 min
  - **Test:** Should FAIL initially (TDD Red phase)

- [ ] **T007** [P] [US1] Write E2E test for user journey
  - **Files:** `tests/e2e/{feature}/{story}.e2e.test.ts`
  - **Story:** US-1
  - **Requirements:** FR-001, FR-002
  - **Depends:** T001
  - **Estimate:** 25 min
  - **Test:** Should FAIL initially (TDD Red phase)

### Implementation (TDD: Make tests PASS) 🟢

- [ ] **T008** [P] [US1] Create `{Entity1}` entity
  - **Files:** `src/domain/entities/{entity1}.entity.ts`
  - **Story:** US-1
  - **Requirements:** FR-001
  - **Depends:** T001, T005
  - **Estimate:** 15 min

- [ ] **T009** [P] [US1] Create `{Entity2}` value object
  - **Files:** `src/domain/value-objects/{vo}.vo.ts`
  - **Story:** US-1
  - **Requirements:** FR-001
  - **Depends:** T001, T005
  - **Estimate:** 10 min

- [ ] **T010** [US1] Create `{Repository}` port (interface)
  - **Files:** `src/domain/ports/repositories/{entity}.repository.ts`
  - **Story:** US-1
  - **Requirements:** FR-001
  - **Depends:** T008
  - **Estimate:** 10 min
  - **Note:** NO "I" prefix (e.g., `UserRepository`, not `IUserRepository`)

- [ ] **T011** [US1] Implement `{Repository}` with Drizzle
  - **Files:** `src/infrastructure/repositories/{entity}.repository.impl.ts`
  - **Story:** US-1
  - **Requirements:** FR-001
  - **Depends:** T010, T002
  - **Estimate:** 20 min

- [ ] **T012** [US1] Create `{UseCase}`
  - **Files:** `src/application/use-cases/{action}-{entity}.use-case.ts`
  - **Story:** US-1
  - **Requirements:** FR-001, FR-002
  - **Depends:** T010
  - **Estimate:** 15 min

- [ ] **T013** [US1] Create Zod schema for request/response
  - **Files:** `src/presentation/schemas/{resource}.schema.ts`
  - **Story:** US-1
  - **Requirements:** FR-001
  - **Depends:** T004
  - **Estimate:** 10 min

- [ ] **T014** [US1] Create `{Controller}`
  - **Files:** `src/presentation/controllers/{resource}.controller.ts`
  - **Story:** US-1
  - **Requirements:** FR-001
  - **Depends:** T012, T013
  - **Estimate:** 15 min
  - **Note:** Delegate to use case, no business logic here

- [ ] **T015** [US1] Create Hono routes
  - **Files:** `src/presentation/routes/{resource}.routes.ts`
  - **Story:** US-1
  - **Requirements:** FR-001
  - **Depends:** T014
  - **Estimate:** 10 min

- [ ] **T016** [US1] Register in DI Container
  - **Files:** `src/infrastructure/container/register-{module}.ts`
  - **Story:** US-1
  - **Requirements:** -
  - **Depends:** T011, T012, T014
  - **Estimate:** 10 min

### Verification ✅

- [ ] **T017** [US1] Run contract tests - all green?
  - **Story:** US-1
  - **Depends:** T006, T011, T012, T014, T015
  - **Estimate:** 5 min

- [ ] **T018** [US1] Run E2E tests - all green?
  - **Story:** US-1
  - **Depends:** T007, T015
  - **Estimate:** 5 min

- [ ] **T019** [US1] Type check - no errors?
  - **Command:** `bun run type-check`
  - **Story:** US-1
  - **Depends:** All US1 tasks
  - **Estimate:** 2 min

- [ ] **T020** [US1] Commit with conventional message
  - **Command:** `/git:commit`
  - **Story:** US-1
  - **Depends:** T017, T018, T019
  - **Estimate:** 2 min

**Checkpoint:** ✅ US-1 fully functional and testable independently

---

## 🎯 Phase 3: User Story 2 - {Title} (Priority: P2)

**Goal:** {From spec US-2}

**Independent Test:** {From spec US-2}

**Rastreabilidade:** US-2 → {FR-003, FR-004, NFR-P-002}

<!-- Repeat structure from Phase 2 -->

### Tests (Write FIRST, Ensure FAIL) 🔴

- [ ] **T021** [P] [US2] Write contract test for {endpoint}
- [ ] **T022** [P] [US2] Write E2E test for {journey}

### Implementation (TDD: Make tests PASS) 🟢

- [ ] **T023** [P] [US2] Create {Entity}
- [ ] **T024** [US2] Create {Repository} port
- [ ] **T025** [US2] Implement {Repository}
<!-- Continue pattern... -->

### Verification ✅

- [ ] **T0XX** [US2] Run all tests
- [ ] **T0XX** [US2] Type check
- [ ] **T0XX** [US2] Commit

**Checkpoint:** ✅ US-1 AND US-2 both work independently

---

## 🎯 Phase 4: User Story 3 - {Title} (Priority: P3)

<!-- Repeat structure -->

---

## 🧪 Phase N: Final Quality Gates

**Purpose:** Ensure implementation meets all architecture and quality gates

- [ ] **T0XX** Run full test suite (unit + integration + E2E)
  - **Command:** `bun test`
  - **Expected:** All tests pass

- [ ] **T0XX** Type check entire codebase
  - **Command:** `bun run type-check`
  - **Expected:** No errors, no `any` types

- [ ] **T0XX** Lint codebase
  - **Command:** `bun run lint`
  - **Expected:** No errors

- [ ] **T0XX** Format codebase
  - **Command:** `bun run format`
  - **Expected:** All files formatted

- [ ] **T0XX** Verify functions < 20 lines
  - **Manual:** Review largest functions
  - **Expected:** All < 20 lines

- [ ] **T0XX** Run quality check
  - **Command:** `/quality:check`
  - **Expected:** All checks pass

- [ ] **T0XX** Update documentation
  - **Files:** `README.md`, `docs/`
  - **Expected:** Docs reflect implementation

---

## 🔗 Task Rastreabilidade

| Task | User Story | Requirements | Files |
|------|------------|--------------|-------|
| T008 | US-1 | FR-001 | src/domain/entities/{entity1}.entity.ts |
| T010 | US-1 | FR-001 | src/domain/ports/repositories/{entity}.repository.ts |
| T011 | US-1 | FR-001 | src/infrastructure/repositories/{entity}.repository.impl.ts |
| T012 | US-1 | FR-001, FR-002 | src/application/use-cases/{action}-{entity}.use-case.ts |
<!-- Add all tasks... -->

---

## 🔄 Dependencies Graph

```
Foundation (T001-T005)
  ├─ T001 (Project Structure)
  │   ├─ T002 (Drizzle)
  │   ├─ T003 (DI Container)
  │   ├─ T004 (Schemas)
  │   └─ T005 (Error Handling)
  │
  └─ User Story 1 (T006-T020)
       ├─ Tests (T006, T007) - Can run in parallel
       ├─ Entities (T008, T009) - Can run in parallel
       └─ Repository (T010) → Implementation (T011) → Use Case (T012) → Controller (T014) → Routes (T015)
```

---

## 📝 Notes

<!-- Additional notes, assumptions, constraints -->

---

## ✓ Plan Completeness Checklist

- [ ] All user stories have dedicated phases
- [ ] Tests written BEFORE implementation for each story
- [ ] Tasks include exact file paths
- [ ] Dependencies clearly marked
- [ ] Parallel tasks marked with [P]
- [ ] Rastreabilidade table complete
- [ ] Dependencies graph visualized
- [ ] Final quality gates included

---

**Execution:** Use `superpowers:executing-plans` to execute in batches with checkpoints

**Created by:** {Your Name}
**Date:** {YYYY-MM-DD}
**Last Updated:** {YYYY-MM-DD}
