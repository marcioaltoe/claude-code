---
description: "PHASE 3: Transform spec into technical design with architecture decisions and ADRs"
---

You are executing the **Product Engineering Design** workflow.

## 🎯 Purpose

Define HOW to build with architectural decisions, tech stack choices, and detailed technical design.

## 📋 Workflow

This command will invoke the `solutions-architect` agent, which will:

1. **Read spec document** - Extract user stories, requirements (FR + NFR), and success criteria from `docs/specs/SPEC-{###}-{name}.md`
2. **Research architectures** - Use MCP (Context7, Perplexity, Octocode) to research patterns, frameworks, and reference implementations
3. **Evaluate 2-3 architectures** - Compare approaches (Clean, Hexagonal, Transactional Script) with pros/cons
4. **Design tech stack** - Select runtime, framework, database, cache, queue with research-backed rationale
5. **Define system structure** - Backend layers (domain/application/infrastructure with HTTP) and frontend features
6. **Model data** - Design entities, value objects, aggregates, and database schema
7. **Design API** - Define endpoints with Zod schemas for request/response
8. **Validate architecture gates** - Run all 7 gates (Simplicity, Type Safety, Clean Code, Test-First, Clean Architecture, Feature-Based, Naming)
9. **Create ADRs** - Document major decisions (architecture pattern, tech stack, database) in `docs/adr/ADR-{####}-{decision}.md`
10. **Generate design document** - Create `docs/design/DESIGN-{###}-{name}.md` using the technical design template

## 🤖 Agent Invocation

The agent will automatically use the `architecture-decision` and `technical-design` skills to ensure research-backed decisions and compliance with architecture gates.

**Agent:** `solutions-architect` from `plugins/product-engineering/agents/solutions-architect.md`

## 📤 Expected Output

- **File:** `docs/design/DESIGN-{###}-{kebab-case-name}.md`
- **ADRs:** `docs/adr/ADR-{####}-{decision}.md` (multiple - one per major decision)
- **Content:** Complete technical design with:
  - Architecture overview with 2-3 alternatives evaluated
  - Tech stack decisions (with MCP research references)
  - System structure (backend layers + frontend features)
  - Data model (entities, VOs, aggregates, Drizzle schema)
  - API design (endpoints table + Zod schemas)
  - Architecture gates validation (7 gates with PASS/FAIL status)
  - Complexity tracking (if gates violated)

## 🔗 Next Steps

**If approved:** Execute `/product-engineering:plan` to break design into atomic, executable tasks

**If gates violated:** Review "Complexity Tracking" section - are justifications acceptable?

**If needs revision:** Adjust architecture, tech stack, or data model based on feedback

## ✓ Success Criteria

- [ ] Design document created with auto-numbered ID (DESIGN-###)
- [ ] Linked to spec document (SPEC-###)
- [ ] 2-3 architecture alternatives evaluated with pros/cons
- [ ] Tech stack decisions with rationale and MCP references
- [ ] System structure defined (backend + frontend)
- [ ] Data model complete (entities, VOs, aggregates, schema)
- [ ] API design complete with Zod schemas
- [ ] All 7 architecture gates validated
- [ ] ADRs created for major decisions
- [ ] Complexity tracking documented if any gates failed
