---
description: "PHASE 4: Transform design into implementation plan with atomic tasks"
---

You are executing the **Product Engineering Planning** workflow.

## 🎯 Purpose

Break technical design into atomic, TDD-driven tasks (5-20 min granularity) with clear dependencies and parallel execution opportunities.

## 📋 Workflow

This command will invoke the `task-planner` agent, which will:

1. **Read design documents** - Extract architecture, tech stack, and system structure from `docs/design/DESIGN-{###}-{name}.md` and ADRs
2. **Review spec** - Extract user stories from `docs/specs/SPEC-{###}-{name}.md` for priority-based task organization
3. **Organize by phases** - Foundation (core infrastructure) → User Story 1 (P1-MVP) → User Story 2 (P2) → User Story N (P3+) → Quality Gates
4. **Break into atomic tasks** - Each task 5-20 minutes with exact file paths, dependencies, and TDD ordering (Red→Green→Refactor)
5. **Map dependencies** - Create dependency graph showing critical path and parallel opportunities
6. **Create rastreabilidade** - Map tasks → user stories → requirements for full traceability
7. **Generate implementation plan** - Create `docs/plans/PLAN-{###}-{name}.md` with phases, dependencies, and quality gates
8. **Generate task list** - Create `docs/tasks/TASKS-{###}-{name}.md` with status tracking (backlog/in-progress/done/blocked)
9. **Present execution options** - Offer two approaches: subagent-driven (this session) or batch execution (parallel session)

## 🤖 Agent Invocation

The agent will automatically use the `task-breakdown` skill to ensure atomic tasks with proper TDD ordering and dependencies.

**Agent:** `task-planner` from `plugins/product-engineering/agents/task-planner.md`

## 📤 Expected Output

- **File 1:** `docs/plans/PLAN-{###}-{kebab-case-name}.md`

  - Implementation plan with phases (Foundation → US-1 → US-2 → Quality Gates)
  - Dependencies graph and critical path
  - Rastreabilidade table (tasks → user stories → requirements)
  - Final quality gates checklist

- **File 2:** `docs/tasks/TASKS-{###}-{kebab-case-name}.md`
  - Atomic task list (T001, T002, etc.) with format: `T{###} [P?] [US#] Description`
  - Each task includes: Story, Requirements, Files (exact paths), Dependencies, Estimate
  - Status tracking table (backlog/in-progress/done/blocked)
  - Progress tracking (X/Y tasks completed)

## 🔗 Next Steps

**Execute tasks** using one of two approaches:

1. **Subagent-driven (this session)** - Use `superpowers:subagent-driven-development` for fresh subagent per task with review between tasks
2. **Batch execution (parallel session)** - Use `superpowers:executing-plans` in new session for batches of 3-5 tasks with checkpoints

**After execution:** Run `/product-engineering:validate` to verify implementation against spec and design

## ✓ Success Criteria

- [ ] Plan document created with auto-numbered ID (PLAN-###)
- [ ] Task list created with auto-numbered ID (TASKS-###)
- [ ] Both linked to design document (DESIGN-###)
- [ ] Foundation phase defined (blocks all user stories)
- [ ] Each user story has TDD ordering: Tests (Red) → Implementation (Green) → Verification
- [ ] Tasks include exact file paths
- [ ] Dependencies clearly mapped with critical path
- [ ] Parallel tasks marked with [P]
- [ ] Rastreabilidade table complete (tasks → stories → requirements)
- [ ] Final quality gates included
- [ ] Execution options presented to user
