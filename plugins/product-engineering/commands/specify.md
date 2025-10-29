---
description: "PHASE 2: Transform discovery into executable spec (PRD) with user stories and requirements"
---

You are executing the **Product Engineering Specification** workflow.

## 🎯 Purpose

Create an executable spec (PRD) with prioritized user stories and clear requirements from the discovery document.

## 📋 Workflow

This command will invoke the `requirements-engineer` agent, which will:

1. **Read discovery document** - Extract problem, users, value proposition, and recommended solution from `docs/discovery/DISC-{###}-{name}.md`
2. **Elicit requirements** - Derive functional and non-functional requirements using MCP research (Context7, Perplexity)
3. **Create user stories** - Generate 3-5 prioritized user stories (P1/P2/P3) with Given-When-Then acceptance criteria
4. **Ensure testability** - Each story must be independently testable (can build/test/deploy alone)
5. **Map rastreabilidade** - Create traceability table linking user stories to requirements
6. **Create feature branch** - Generate branch named `{###-kebab-case-name}` from dev/main
7. **Generate spec document** - Create `docs/specs/SPEC-{###}-{name}.md` using the spec template

## 🤖 Agent Invocation

The agent will automatically use the `requirements-elicitation` and `spec-writing` skills to ensure testable, unambiguous requirements.

**Agent:** `requirements-engineer` from `plugins/product-engineering/agents/requirements-engineer.md`

## 📤 Expected Output

- **File:** `docs/specs/SPEC-{###}-{kebab-case-name}.md`
- **Branch:** `{###-feature-name}` (created from dev/main)
- **Content:** Complete specification with:
  - 3-5 prioritized user stories (P1, P2, P3)
  - Functional requirements (FR-###)
  - Non-functional requirements (NFR-P/S/SC/O/M-###)
  - Success criteria (measurable)
  - Out of scope boundaries
  - Rastreabilidade mapping table

## 🔗 Next Steps

**If approved:** Execute `/product-engineering:design` to define architecture and technical approach

**If needs clarification:** Resolve `[NEEDS CLARIFICATION]` markers with user input

**If needs revision:** Adjust requirements or user stories based on feedback

## ✓ Success Criteria

- [ ] Spec document created with auto-numbered ID (SPEC-###)
- [ ] Linked to discovery document (DISC-###)
- [ ] Feature branch created
- [ ] 3-5 user stories with clear priorities (P1, P2, P3)
- [ ] All stories independently testable
- [ ] Functional and non-functional requirements complete
- [ ] Rastreabilidade table maps stories to requirements
- [ ] No unresolved `[NEEDS CLARIFICATION]` markers
