---
description: "PHASE 5: Validate implementation against spec and design"
---

You are executing the **Product Engineering Validation** workflow.

## 🎯 Purpose

Verify implementation matches spec, passes all architecture gates, and meets quality standards before code review.

## 📋 Workflow

This command will invoke the `implementation-validator` agent, which will:

1. **Read source documents** - Extract requirements, user stories, and design decisions from `docs/specs/SPEC-{###}`, `docs/design/DESIGN-{###}`, and `docs/plans/PLAN-{###}`
2. **Check requirements coverage** - Verify each user story's acceptance criteria implemented, functional requirements mapped to code, NFRs measured
3. **Validate architecture gates** - Run all 7 gates (automated + manual):
   - Gate 1: Simplicity (≤3 projects, no speculative code)
   - Gate 2: Type Safety (no `any` types, strict mode passes)
   - Gate 3: Clean Code (functions < 20 lines, SOLID principles)
   - Gate 4: Test-First (all tests pass, coverage meets NFR targets)
   - Gate 5: Clean Architecture (backend dependency flow correct, no "I" prefix)
   - Gate 6: Feature-Based (frontend components pure, gateways injected)
   - Gate 7: Naming Conventions (kebab-case files, PascalCase classes)
4. **Run quality gates** - Execute `/quality:check` (tests, type-check, lint, format)
5. **Analyze gaps** - Identify implemented/missing/partial requirements and scope creep
6. **Analyze deviations** - Check for design deviations, architecture violations, tech stack changes, performance issues
7. **Generate validation report** - Create comprehensive report with:
   - Summary: Overall status (✅ Pass | ⚠️ Partial | ❌ Fail), coverage percentages, gates passed
   - Requirements coverage table (status, test coverage, notes)
   - Architecture gates table (status, issues)
   - Quality gates table (status, details)
   - Gaps and deviations with impact assessment
   - Prioritized recommendations

## 🤖 Agent Invocation

The agent will systematically verify implementation using automated checks (bash commands, `/quality:check`) and manual reviews (SOLID, Clean Code).

**Agent:** `implementation-validator` from `plugins/product-engineering/agents/implementation-validator.md`

## 📤 Expected Output

**Validation Report** (inline or as file: `docs/validation/VALIDATION-{###}-{name}.md`)

**Report includes:**
- **Summary:** Overall status, requirements coverage (X%), architecture gates (X/7), quality gates (X/4)
- **Requirements Coverage Table:** Each FR/NFR with status (✅ Implemented | ⚠️ Partial | ❌ Not Met), test coverage %, notes
- **Architecture Gates Table:** Each gate with status and issues found
- **Quality Gates Table:** Tests, types, lint, format with pass/fail status
- **Gaps:** Missing, partial, and extra implementations (scope creep)
- **Deviations:** Design, architecture, tech stack, or performance deviations with justifications
- **Recommendations:** Prioritized action items (fix, accept, or update docs)

## 🔗 Next Steps

**If validation passes (✅):**
"Implementation validated! All gates passed, requirements met. Ready for code review and PR?"

**If partial/fails (⚠️ ❌):**
"Validation identified {N} issues. Review recommendations:
1. Fix critical issues now
2. Create follow-up tasks for non-critical items
3. Update design docs to reflect accepted deviations"

## ✓ Success Criteria

- [ ] All user stories validated against acceptance criteria
- [ ] All requirements have coverage analysis (implemented/missing/partial)
- [ ] All 7 architecture gates checked with automated + manual verification
- [ ] All 4 quality gates checked (tests, type-check, lint, format)
- [ ] Gaps identified and categorized (missing/partial/extra)
- [ ] Deviations analyzed with impact assessment and recommendations
- [ ] Prioritized recommendations provided
- [ ] Validation report presented to user
