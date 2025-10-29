---
description: "PHASE 2: Transform discovery into executable spec (PRD) with user stories and requirements"
---

You are executing the **Product Engineering Specification** workflow.

## 🎯 Purpose

Create an executable spec (PRD) with prioritized user stories and clear requirements.

## 📋 Process

### Step 1: Load Required Skills
- Load `requirements-elicitation` skill from `skills/requirements-elicitation/SKILL.md`
- Load `spec-writing` skill from `skills/spec-writing/SKILL.md`

### Step 2: Read Discovery Document
- Locate discovery document: `docs/discovery/DISC-{###}-{name}.md`
- Extract: problem, users, value proposition, recommended solution
- Review research findings and success criteria

### Step 3: Invoke Requirements Engineer Agent
- Invoke `requirements-engineer` agent from `agents/requirements-engineer.md`
- Agent will use loaded skills to guide elicitation

### Step 4: Requirements Elicitation

**Functional Requirements:**
- Derive from discovery's recommended solution
- Map to specific system capabilities
- Ensure testable and unambiguous
- Mark unclear items: `[NEEDS CLARIFICATION: question]`

**Non-Functional Requirements:**
- Performance (from discovery's success criteria)
- Security (authentication, authorization, data protection)
- Scalability (concurrent users, data volume)
- Observability (logging, metrics, tracing)
- Maintainability (test coverage, code quality)

**Use MCP for research:**
```
Context7: Best practices for {domain} requirements
Perplexity: "Common NFRs for {type} applications"
```

### Step 5: Create User Stories

**Generate 3-5 Prioritized User Stories:**

**Priority Levels:**
- P1 (MVP): Must-have for initial release
- P2 (Important): Valuable but not blocking
- P3 (Nice to have): Future enhancements

**Story Structure:**
```
As a {user type}
I want {capability}
So that {benefit}

Why P1/P2/P3: {rationale}

Independent Test: {how to verify this story alone}

Acceptance Criteria:
- Given {context}, When {action}, Then {outcome}
```

**Critical:** Each story MUST be independently testable (can build/test/deploy alone)

### Step 6: Rastreabilidade Mapping

Create table mapping:
- User Story → Functional Requirements
- User Story → Non-Functional Requirements

Example:
| User Story | Functional Requirements | NFRs |
|------------|-------------------------|------|
| US-1       | FR-001, FR-002          | NFR-P-001, NFR-S-001 |

### Step 7: Generate Spec Document

**Use template:** `templates/spec.md`

**Auto-number:**
- Scan `docs/specs/` for next number (SPEC-###)
- Link to discovery: `discovery: DISC-{###}`

**Create feature branch:**
```bash
# Branch naming: {###-kebab-case-name}
git checkout -b 001-feature-name
```

**Save to:** `docs/specs/SPEC-{###}-{name}.md`

### Step 8: Validation Checklist

Run through spec completeness checklist:
- [ ] No `[NEEDS CLARIFICATION]` markers remaining
- [ ] All user stories have acceptance criteria
- [ ] Each story has "Independent Test" defined
- [ ] Stories prioritized (P1, P2, P3)
- [ ] Requirements testable and unambiguous
- [ ] NFRs cover all categories
- [ ] Success criteria measurable
- [ ] Out of scope clearly defined
- [ ] Rastreabilidade table complete

### Step 9: Present Spec Document

Show the user:
- Location of spec document
- Summary of user stories (count by priority)
- Key requirements highlights
- Feature branch created
- Any remaining `[NEEDS CLARIFICATION]` items

### Step 10: Decision Point

**If approved to proceed:**
"Spec approved! Ready to create Technical Design?

Execute `/product-engineering:design` to define architecture, tech stack, and implementation approach."

**If needs clarification:**
"Let's resolve the `[NEEDS CLARIFICATION]` items. What should we decide for each?"

**If needs revision:**
"What aspects of the spec need adjustment?"

---

## 📤 Output

- **File:** `docs/specs/SPEC-{###}-{name}.md`
- **Branch:** `{###-feature-name}` (created from main/dev)
- **Content:** Complete spec with:
  - Overview (what, why, for whom)
  - 3-5 prioritized user stories (P1, P2, P3)
  - Functional requirements (testable, unambiguous)
  - Non-functional requirements (all categories)
  - Success criteria (measurable)
  - Out of scope (explicit boundaries)
  - Rastreabilidade mapping

---

## 🔗 Integration

**Input:** Discovery document `DISC-{###}`

**MCP Servers Used:**
- Context7 (requirements best practices)
- Perplexity (NFR research for domain)

**Next Phase:**
- If approved: `/product-engineering:design`
- If needs work: Iterate on spec

---

## ✓ Success Criteria

- [ ] Spec document created with auto-numbered ID
- [ ] Linked to discovery document
- [ ] Feature branch created
- [ ] 3-5 user stories with clear priorities
- [ ] All stories independently testable
- [ ] Functional and non-functional requirements complete
- [ ] Rastreabilidade table complete
- [ ] Validation checklist passed
