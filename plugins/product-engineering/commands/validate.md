---
description: "PHASE 5: Validate implementation against spec and design"
---

You are executing the **Product Engineering Validation** workflow.

## 🎯 Purpose

Verify implementation matches spec, passes all architecture gates, and meets quality standards.

## 📋 Process

### Step 1: Read Source Documents

- Spec: `docs/specs/SPEC-{###}-{name}.md`
- Design: `docs/design/DESIGN-{###}-{name}.md`
- Plan: `docs/plans/PLAN-{###}-{name}.md`

### Step 2: Invoke Validation Agent

- Invoke `implementation-validator` agent from `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/agents/implementation-validator.md`
- Agent will systematically verify implementation

### Step 3: Requirements Coverage Check

**For each User Story:**

- Verify acceptance criteria implemented
- Check independent testability
- Validate edge cases handled

**For each Functional Requirement:**

- Map to implementation code
- Verify behavior matches spec
- Check test coverage

**For each Non-Functional Requirement:**

- Performance: Measure actual metrics vs targets
- Security: Verify auth, encryption, HTTPS
- Scalability: Check horizontal scaling support
- Observability: Verify logging, metrics, tracing
- Maintainability: Check test coverage, code quality

### Step 4: Architecture Gates Validation

**Run ALL 7 gates from `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/gates/architecture-gates.md`:**

**Gate 1: Simplicity**

```bash
# Count projects
find src -maxdepth 1 -type d | wc -l  # Should be ≤3

# Check for speculative code
grep -r "TODO.*future" src/  # Should be minimal
```

**Gate 2: Type Safety**

```bash
# Check for any types
grep -r ": any" src/  # Should be 0

# Run type check
bun run type-check  # Should pass
```

**Gate 3: Clean Code**

```bash
# Check function sizes (use tool or manual review)
# All functions should be < 20 lines

# Verify SOLID principles (manual review)
```

**Gate 4: Test-First**

```bash
# Verify tests exist and pass
bun test  # All green

# Check test coverage
bun test --coverage  # Should meet NFR targets
```

**Gate 5: Clean Architecture (Backend)**

```bash
# Check dependency flow
# Domain should have no imports from other layers
grep -r "from.*application\|infrastructure\|presentation" src/domain/  # Should be 0

# Verify no "I" prefix on interfaces
grep -r "interface I[A-Z]" src/  # Should be 0
```

**Gate 6: Feature-Based Architecture (Frontend)**

```bash
# Check components are pure (no store imports)
grep -r "useStore\|createStore" features/*/components/  # Should be 0

# Check gateways exist (interface + http + fake)
ls features/*/gateways/*.gateway.ts  # Should have all 3
```

**Gate 7: Naming Conventions**

```bash
# Check file naming (kebab-case)
find src -name "*[A-Z]*" -type f  # Should only be in directories

# Check class naming (PascalCase with suffix)
# Manual review
```

### Step 5: Quality Gates Check

**Run quality checks:**

```bash
# Full quality check
/quality:check

# Individual checks:
bun test                 # All tests pass?
bun run type-check      # No type errors?
bun run lint            # No lint errors?
bun run format --check  # Properly formatted?
```

### Step 6: Gap Analysis

**Identify:**

- **Implemented:** What requirements are covered?
- **Missing:** What requirements are not implemented?
- **Partial:** What requirements are partially implemented?
- **Extra:** What was implemented but not in spec? (scope creep?)

### Step 7: Deviation Analysis

**Check for:**

- Design deviations (implementation differs from design)
- Architecture violations (doesn't follow chosen pattern)
- Tech stack deviations (different libraries/frameworks)
- Performance issues (doesn't meet NFRs)

**For each deviation:**

- Document what changed
- Explain why
- Assess impact
- Recommend: accept, fix, or update docs

### Step 8: Generate Validation Report

**Create report with:**

**Summary:**

- Overall status (✅ Pass | ⚠️ Partial | ❌ Fail)
- Requirements coverage (X% implemented)
- Architecture gates (X/7 passed)
- Quality gates (X/4 passed)

**Requirements Coverage:**
| Requirement | Status | Test Coverage | Notes |
|-------------|--------|---------------|-------|
| FR-001 | ✅ Implemented | 100% | - |
| FR-002 | ⚠️ Partial | 60% | Missing edge case X |
| NFR-P-001 | ❌ Not Met | - | Response time 300ms (target: 200ms) |

**Architecture Gates:**
| Gate | Status | Issues |
|------|--------|--------|
| Simplicity | ✅ Pass | - |
| Type Safety | ❌ Fail | 3 `any` types found in src/... |
| Clean Code | ⚠️ Partial | 5 functions > 20 lines |

**Quality Gates:**
| Check | Status | Details |
|-------|--------|---------|
| Tests | ✅ Pass | 142/142 passing |
| Types | ❌ Fail | 3 errors in src/... |
| Lint | ✅ Pass | - |
| Format | ✅ Pass | - |

**Gaps:**

- Missing: FR-003 (password reset flow)
- Partial: NFR-P-001 (performance below target)

**Deviations:**

- Design: Used repository pattern instead of direct DB access (justified: better testability)
- Tech: Added Redis caching (not in design) - needed for performance

**Recommendations:**

1. Fix 3 `any` types → branded types
2. Refactor 5 large functions → extract to helpers
3. Implement missing FR-003
4. Optimize query performance for NFR-P-001
5. Update design doc to reflect Redis addition

### Step 9: Present Report

**Show user:**

- Overall validation status
- Coverage percentages
- Failed gates and why
- Gaps and deviations
- Prioritized recommendations

### Step 10: Decision Point

**If validation passes:**
"Implementation validated! All gates passed, requirements met.

Ready for code review and PR?"

**If partial/fails:**
"Validation identified {N} issues. Review recommendations.

Should we:

1. Fix critical issues now
2. Create follow-up tasks
3. Update design docs to reflect changes"

---

## 📤 Output

**Validation Report** (inline or as file)

- Requirements coverage analysis
- Architecture gates results
- Quality gates results
- Gap analysis
- Deviation analysis
- Prioritized recommendations

---

## 🔗 Integration

**Input:**

- Spec document `SPEC-{###}`
- Design document `DESIGN-{###}`
- Implementation code (actual files)

**Tools Used:**

- Bash commands for automated checks
- `/quality:check` for quality gates
- Manual review for SOLID/Clean Code

**Next Phase:**

- If passed: Code review → PR → Merge
- If failed: Fix issues → Re-validate

---

## ✓ Success Criteria

- [ ] All user stories validated against acceptance criteria
- [ ] All requirements have coverage analysis
- [ ] All 7 architecture gates checked
- [ ] All 4 quality gates checked
- [ ] Gaps identified and documented
- [ ] Deviations analyzed with impact assessment
- [ ] Recommendations prioritized
- [ ] Report presented to user
