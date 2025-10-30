---
id: TASKS-{auto-number}
plan: PLAN-{number}
created: { YYYY-MM-DD }
status: todo
phase: tasks
---

# Tasks: {Feature Name}

> **Input:** Implementation Plan `PLAN-{number}`

## Format: `[Status] [ID] [Tag] [P?] [Story] Description`

**Status:**

- `[ ]` = Not started
- `[→]` = In progress
- `[✓]` = Completed
- `[✗]` = Blocked

**Tags:**

- `backlog` = Not started yet
- `in-progress` = Currently being worked on
- `done` = Completed
- `blocked` = Blocked by dependency or issue

**Markers:**

- `[P]` = Can run in parallel with other [P] tasks in same batch
- `[Story]` = User story reference (US1, US2, US3, etc.)

---
w
## 📦 Batch 1: Foundation (5 tasks)

- [ ] `T001` [backlog] Setup project structure

  - **Story:** -
  - **Files:** `src/domain/`, `src/application/`, `src/infrastructure/` (including `infrastructure/http/`)
  - **Estimate:** 10 min
  - **Depends:** -

- [ ] `T002` [backlog] Initialize Drizzle schema and migrations

  - **Story:** -
  - **Files:** `src/infrastructure/database/schema.ts`, `drizzle.config.ts`
  - **Estimate:** 15 min
  - **Depends:** T001

- [ ] `T003` [backlog] [P] Configure DI Container

  - **Story:** -
  - **Files:** `src/infrastructure/container/main.ts`, `tokens.ts`
  - **Estimate:** 15 min
  - **Depends:** T001

- [ ] `T004` [backlog] [P] Setup Zod validation schemas structure

  - **Story:** -
  - **Files:** `src/infrastructure/http/schemas/`
  - **Estimate:** 5 min
  - **Depends:** T001

- [ ] `T005` [backlog] [P] Create base error handling (Result type)
  - **Story:** -
  - **Files:** `src/domain/result.ts`
  - **Estimate:** 10 min
  - **Depends:** T001

**Parallel Opportunity:** T003, T004, T005 can run together after T002 completes

---

## 🎯 Batch 2: User Story 1 (MVP) - Tests (2 tasks) 🔴

- [ ] `T006` [backlog] [P] [US1] Write contract test for `POST /api/{resource}`

  - **Story:** US-1
  - **Requirements:** FR-001
  - **Files:** `tests/integration/api/{resource}.integration.test.ts`
  - **Estimate:** 20 min
  - **Depends:** T001, T002, T003
  - **Test:** Should FAIL initially (TDD Red phase)

- [ ] `T007` [backlog] [P] [US1] Write E2E test for user journey
  - **Story:** US-1
  - **Requirements:** FR-001, FR-002
  - **Files:** `tests/e2e/{feature}/{story}.e2e.test.ts`
  - **Estimate:** 25 min
  - **Depends:** T001
  - **Test:** Should FAIL initially (TDD Red phase)

**Parallel Opportunity:** T006 and T007 can run together

---

## 🎯 Batch 3: User Story 1 (MVP) - Implementation (9 tasks) 🟢

- [ ] `T008` [backlog] [P] [US1] Create `{Entity1}` entity

  - **Story:** US-1
  - **Requirements:** FR-001
  - **Files:** `src/domain/entities/{entity1}.entity.ts`
  - **Estimate:** 15 min
  - **Depends:** T001, T005

- [ ] `T009` [backlog] [P] [US1] Create `{Entity2}` value object

  - **Story:** US-1
  - **Requirements:** FR-001
  - **Files:** `src/domain/value-objects/{vo}.vo.ts`
  - **Estimate:** 10 min
  - **Depends:** T001, T005

- [ ] `T010` [backlog] [US1] Create `{Repository}` port

  - **Story:** US-1
  - **Requirements:** FR-001
  - **Files:** `src/domain/ports/repositories/{entity}.repository.ts`
  - **Estimate:** 10 min
  - **Depends:** T008
  - **Note:** NO "I" prefix

- [ ] `T011` [backlog] [US1] Implement `{Repository}` with Drizzle

  - **Story:** US-1
  - **Requirements:** FR-001
  - **Files:** `src/infrastructure/repositories/{entity}.repository.impl.ts`
  - **Estimate:** 20 min
  - **Depends:** T010, T002

- [ ] `T012` [backlog] [US1] Create `{UseCase}`

  - **Story:** US-1
  - **Requirements:** FR-001, FR-002
  - **Files:** `src/application/use-cases/{action}-{entity}.use-case.ts`
  - **Estimate:** 15 min
  - **Depends:** T010

- [ ] `T013` [backlog] [US1] Create Zod schema

  - **Story:** US-1
  - **Requirements:** FR-001
  - **Files:** `src/infrastructure/http/schemas/{resource}.schema.ts`
  - **Estimate:** 10 min
  - **Depends:** T004

- [ ] `T014` [backlog] [US1] Create `{Controller}` (self-registering)

  - **Story:** US-1
  - **Requirements:** FR-001
  - **Files:** `src/infrastructure/http/controllers/{resource}.controller.ts`
  - **Estimate:** 15 min
  - **Depends:** T012, T013
  - **Note:** Delegate to use case, no business logic. Controller auto-registers routes in constructor.

- [ ] `T015` [backlog] [US1] Setup HttpServer adapter (if not exists)

  - **Story:** US-1
  - **Requirements:** FR-001
  - **Files:** `src/infrastructure/http/server/hono-http-server.adapter.ts`
  - **Estimate:** 10 min
  - **Depends:** T014

- [ ] `T016` [backlog] [US1] Register in DI Container
  - **Story:** US-1
  - **Requirements:** -
  - **Files:** `src/infrastructure/container/register-{module}.ts`
  - **Estimate:** 10 min
  - **Depends:** T011, T012, T014

**Parallel Opportunities:**

- T008 and T009 can run together
- T013 can run while T010-T012 are in progress

---

## 🎯 Batch 4: User Story 1 (MVP) - Verification (4 tasks) ✅

- [ ] `T017` [backlog] [US1] Run contract tests

  - **Story:** US-1
  - **Command:** `bun test tests/integration/api/{resource}.integration.test.ts`
  - **Estimate:** 5 min
  - **Depends:** T006, T011, T012, T014, T015
  - **Expected:** All green

- [ ] `T018` [backlog] [US1] Run E2E tests

  - **Story:** US-1
  - **Command:** `bun test tests/e2e/{feature}/{story}.e2e.test.ts`
  - **Estimate:** 5 min
  - **Depends:** T007, T015
  - **Expected:** All green

- [ ] `T019` [backlog] [US1] Type check

  - **Story:** US-1
  - **Command:** `bun run type-check`
  - **Estimate:** 2 min
  - **Depends:** All US1 tasks
  - **Expected:** No errors, no `any` types

- [ ] `T020` [backlog] [US1] Commit with conventional message
  - **Story:** US-1
  - **Command:** `/git:commit`
  - **Estimate:** 2 min
  - **Depends:** T017, T018, T019
  - **Expected:** Commit created

**Checkpoint:** ✅ US-1 MVP fully functional and independently testable

---

## 🎯 Batch 5: User Story 2 - Tests 🔴

<!-- Repeat pattern for US2 -->

- [ ] `T021` [backlog] [P] [US2] Write contract test
- [ ] `T022` [backlog] [P] [US2] Write E2E test

---

## 🎯 Batch 6: User Story 2 - Implementation 🟢

<!-- Repeat pattern for US2 -->

- [ ] `T023` [backlog] [P] [US2] Create entities/VOs
- [ ] `T024` [backlog] [US2] Create repository port
- [ ] `T025` [backlog] [US2] Implement repository
<!-- Continue... -->

---

## 🎯 Batch 7: User Story 2 - Verification ✅

- [ ] `T0XX` [backlog] [US2] Run all tests
- [ ] `T0XX` [backlog] [US2] Type check
- [ ] `T0XX` [backlog] [US2] Commit

**Checkpoint:** ✅ US-1 AND US-2 both work independently

---

## 🎯 Batch N: User Story 3 - Full Cycle

<!-- Repeat pattern for US3 -->

---

## 🧪 Final Batch: Quality Gates

- [ ] `T0XX` [backlog] Run full test suite

  - **Command:** `bun test`
  - **Expected:** All pass

- [ ] `T0XX` [backlog] Type check entire codebase

  - **Command:** `bun run type-check`
  - **Expected:** No errors, no `any` types

- [ ] `T0XX` [backlog] Lint codebase

  - **Command:** `bun run lint`
  - **Expected:** No errors

- [ ] `T0XX` [backlog] Format codebase

  - **Command:** `bun run format`
  - **Expected:** All files formatted

- [ ] `T0XX` [backlog] Verify functions < 20 lines

  - **Manual:** Review largest functions
  - **Expected:** All < 20 lines

- [ ] `T0XX` [backlog] Quality check

  - **Command:** `/quality:check`
  - **Expected:** All checks pass

- [ ] `T0XX` [backlog] Update documentation
  - **Files:** `README.md`, `docs/`
  - **Expected:** Complete

---

## 🔗 Dependencies Graph

```
Foundation (Batch 1)
  T001
   ├─ T002
   ├─ T003 [P]
   ├─ T004 [P]
   └─ T005 [P]

User Story 1 - Tests (Batch 2)
  T006 [P] (depends: T001, T002, T003)
  T007 [P] (depends: T001)

User Story 1 - Implementation (Batch 3)
  T008 [P] (depends: T001, T005)
  T009 [P] (depends: T001, T005)
  T010 (depends: T008)
   ├─ T011 (depends: T010, T002)
   └─ T012 (depends: T010)
        └─ T014 (depends: T012, T013)
             └─ T015 (depends: T014)
                  └─ T016 (depends: T011, T012, T014)

  T013 [P] (depends: T004)

User Story 1 - Verification (Batch 4)
  T017 (depends: T006, T015)
  T018 (depends: T007, T015)
  T019 (depends: All US1)
  T020 (depends: T017, T018, T019)
```

---

## 📊 Progress Tracking

| Batch         | Total  | Backlog | In Progress | Done  | Blocked |
| ------------- | ------ | ------- | ----------- | ----- | ------- |
| 1: Foundation | 5      | 5       | 0           | 0     | 0       |
| 2: US1 Tests  | 2      | 2       | 0           | 0     | 0       |
| 3: US1 Impl   | 9      | 9       | 0           | 0     | 0       |
| 4: US1 Verify | 4      | 4       | 0           | 0     | 0       |
| 5: US2 Tests  | 2      | 2       | 0           | 0     | 0       |
| **Total**     | **XX** | **XX**  | **0**       | **0** | **0**   |

---

## 🚀 Execution Strategy

### Option 1: Sequential by Priority

1. Complete ALL of US-1 (MVP) first
2. Validate US-1 works independently
3. Move to US-2
4. Validate US-2 works independently (and with US-1)
5. Continue...

### Option 2: Parallel by Team

- Developer A: US-1
- Developer B: US-2
- Developer C: US-3
- Merge and integrate after each is independently validated

### Option 3: Batch Execution (Recommended for AI)

- Use `superpowers:executing-plans`
- Execute 3-5 tasks per batch
- Review and validate between batches
- Adjust plan based on learnings

---

## 📝 Notes

<!-- Task-specific notes, blockers, decisions made during execution -->

---

## Task Management Commands

```bash
# Move task to in-progress
task-master move --from=T001 --from-tag=backlog --to-tag=in-progress

# Move multiple tasks
task-master move --from=T006,T007 --from-tag=backlog --to-tag=in-progress

# Mark task as done
task-master move --from=T001 --from-tag=in-progress --to-tag=done

# Move with dependencies
task-master move --from=T001 --from-tag=backlog --to-tag=done --with-dependencies
```

---

**Execution:** Use `superpowers:executing-plans` or manual task tracking

**Created by:** {Your Name}
**Date:** {YYYY-MM-DD}
**Last Updated:** {YYYY-MM-DD}
