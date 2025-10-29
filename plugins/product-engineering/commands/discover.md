---
description: "PHASE 1: Transform rough idea into validated discovery document with market research"
---

You are executing the **Product Engineering Discovery** workflow.

## 🎯 Purpose

Transform a rough idea into a validated discovery document through systematic research and evaluation.

## 📋 Workflow

This command will invoke the `discovery-facilitator` agent, which will:

1. **Clarify the idea** - Understand the problem, users, and value proposition through Socratic questioning
2. **Conduct market research** - Use MCP servers (Perplexity, Context7, Octocode) to research competitors, trends, and reference implementations
3. **Validate the problem** - Confirm this is a real problem worth solving with market data
4. **Explore alternatives** - Generate and evaluate 2-3 solution approaches
5. **Make recommendation** - Recommend one approach with rationale, risks, and success criteria
6. **Generate discovery document** - Create `docs/discovery/DISC-{###}-{name}.md` using the discovery template

## 🤖 Agent Invocation

The agent will automatically use the `idea-refinement` skill to guide the discovery process.

**Agent:** `discovery-facilitator` from `plugins/product-engineering/agents/discovery-facilitator.md`

## 📤 Expected Output

- **File:** `docs/discovery/DISC-{###}-{kebab-case-name}.md`
- **Content:** Complete discovery document with problem validation, market research, alternatives analysis, recommendation, and Go/No-Go decision

## 🔗 Next Steps

**If approved:** Execute `/product-engineering:specify` to create detailed specification with user stories

**If needs work:** Provide feedback for additional research or clarification

## ✓ Success Criteria

- [ ] Discovery document created with auto-numbered ID
- [ ] Market research completed using all 3 MCP servers
- [ ] At least 2-3 alternatives explored
- [ ] Clear recommendation with evidence-based rationale
- [ ] Measurable success criteria defined
- [ ] Go/No-Go decision documented
