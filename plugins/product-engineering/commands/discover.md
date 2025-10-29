---
description: "PHASE 1: Transform rough idea into validated discovery document with market research"
---

You are executing the **Product Engineering Discovery** workflow.

## 🎯 Purpose

Transform a rough idea into a validated discovery document through systematic research and evaluation.

## 📋 Process

### Step 1: Load Required Skills

- Load `idea-refinement` skill from `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/skills/idea-refinement/SKILL.md`

### Step 2: Invoke Discovery Agent

- Invoke `discovery-facilitator` agent from `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/agents/discovery-facilitator.md`
- Agent will use `idea-refinement` skill to guide the process

### Step 3: Execute Discovery Workflow

**Phase 1: Initial Understanding**

- Clarify the rough idea
- Identify problem, users, and value proposition
- Ask targeted questions to fill gaps

**Phase 2: Market Research (Heavy MCP Usage)**

- **Perplexity:** Competitor analysis, market trends, user expectations
- **Context7:** Documentation for similar solutions and frameworks
- **Octocode:** Reference implementations from GitHub

Research queries:

```
Perplexity: "What are the top {domain} solutions in 2025?"
Perplexity: "What are common pain points with {competitor}?"
Perplexity: "Latest trends in {domain}"
Context7: Get docs for relevant frameworks/libraries
Octocode: Search for reference implementations with keywords
```

**Phase 3: Problem Validation**

- Confirm this is a real problem worth solving
- Validate with market data from research
- Identify target users and pain points

**Phase 4: Solution Exploration**

- Generate 2-3 alternative approaches
- Evaluate pros/cons for each
- Use MCP to validate feasibility

**Phase 5: Recommendation**

- Recommend ONE approach with clear rationale
- Identify risks and mitigation strategies
- Define success criteria
- Make Go/No-Go decision

**Phase 6: Generate Discovery Document**

- Use template: `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/templates/discovery.md`
- Auto-number: Scan `docs/discovery/` for next number (DISC-###)
- Fill all sections with research findings
- Include MCP references
- Save to: `docs/discovery/DISC-{###}-{kebab-case-name}.md`

### Step 4: Present Discovery Document

Show the user:

- Location of discovery document
- Summary of key findings
- Recommendation and rationale
- Ask for feedback/approval

### Step 5: Decision Point

**If approved to proceed:**
"Discovery approved! Ready to create detailed Spec (PRD)?

Execute `/product-engineering:specify` to transform this discovery into a specification with user stories and requirements."

**If needs more research:**
"What additional research or clarification do you need?"

**If not proceeding:**
"Discovery documented for future reference. Learnings captured in decision section."

---

## 📤 Output

- **File:** `docs/discovery/DISC-{###}-{name}.md`
- **Content:** Complete discovery document with:
  - Problem statement with evidence
  - Target users and pain points
  - Market research findings (competitors, trends)
  - Alternative approaches evaluated
  - Recommended solution with rationale
  - Success criteria
  - Risks and constraints
  - Go/No-Go decision

---

## 🔗 Integration

**MCP Servers Used:**

- Perplexity (market research, trends, validation)
- Context7 (framework documentation)
- Octocode (reference implementations)

**Next Phase:**

- If approved: `/product-engineering:specify`
- If rejected: Document learnings and archive

---

## ✓ Success Criteria

- [ ] Discovery document created with auto-numbered ID
- [ ] Market research completed using all 3 MCP servers
- [ ] At least 2-3 alternatives explored
- [ ] Clear recommendation with rationale
- [ ] Success criteria defined and measurable
- [ ] Go/No-Go decision made with evidence
