---
name: idea-refinement
description: Transform rough ideas into validated discovery documents through Socratic questioning, MCP research, and alternative exploration
---

# Idea Refinement

## Overview

Transform rough, vague ideas into structured discovery documents through systematic questioning, market research, and alternative evaluation.

**Core Principle:** Research first, ask targeted questions to fill gaps, explore alternatives before committing.

**Announce at start:** "I'm using the idea-refinement skill to transform your idea into a validated discovery document."

---

## Quick Reference

| Phase | Key Activities | MCP Usage | Output |
|-------|---------------|-----------|--------|
| **1. Initial Understanding** | Clarify problem, users, value | None | Draft understanding |
| **2. Market Research** | Competitors, trends, solutions | Perplexity, Context7, Octocode | Research findings |
| **3. Problem Validation** | Confirm real pain points | Perplexity | Validated problem |
| **4. Solution Exploration** | 2-3 alternatives with trade-offs | Context7, Octocode | Alternative approaches |
| **5. Recommendation** | Recommended approach + rationale | None | Go/No-Go decision |
| **6. Discovery Documentation** | Write structured discovery doc | None | DISC-{###}-{name}.md |

---

## The Process

### Phase 1: Initial Understanding

**Goal:** Understand the rough idea and identify gaps

**Activities:**
1. Listen to user's idea description
2. Identify what's clear vs unclear
3. Ask ONE focused question at a time for critical gaps
4. Draft initial understanding

**Questions to Answer:**
- What problem are we solving?
- Who has this problem?
- Why does it matter (business value)?
- What's the current situation?

**Output:** Draft problem statement to confirm with user

**Example:**
```
Based on your description, it sounds like you want to build a real-time
chat system for customer support teams, primarily because current solutions
like Intercom are too expensive for small businesses ($500/month).

Did I understand correctly? Is there anything I missed or got wrong?
```

---

### Phase 2: Market Research (Heavy MCP Usage)

**Goal:** Understand the competitive landscape and existing solutions

**MCP Research Strategy:**

**Use Perplexity for:**
- "What are the top 5 customer support chat solutions in 2025?"
- "What are common pain points with Intercom/Zendesk/Freshdesk?"
- "What features do users expect from support chat tools?"
- "Latest trends in customer support technology"

**Use Context7 for:**
- Docs for similar frameworks (e.g., Socket.io, WebSockets)
- Implementation patterns for real-time features
- Best practices documentation

**Use Octocode for:**
- GitHub repos of open-source chat solutions
- Reference implementations
- Popular chat libraries and their usage

**Output:** Research section with:
- 3-5 competitor solutions (strengths, weaknesses, relevance)
- Market trends and user expectations
- Technology landscape
- Key references (links, docs, repos)

**Example Research Output:**
```
## Competitors/Similar Solutions

**Solution 1: Intercom**
- What it does: Full-featured customer support platform
- Strengths: Rich features, integrations, automation
- Weaknesses: Expensive ($500+/month), complex setup
- Relevance: High - direct competitor, but price is our differentiator

**Solution 2: Crisp Chat**
- What it does: Affordable live chat ($25/month)
- Strengths: Simple, affordable, good UX
- Weaknesses: Limited automation, fewer integrations
- Relevance: Medium - similar pricing, but less feature-rich

## Market Insights

**Trends:**
- AI-powered responses gaining traction
- Mobile-first support becoming standard
- Self-service knowledge bases integrated with chat

**User Expectations:**
- Real-time responses < 1 second
- Mobile app support
- Integration with CRM/ticketing systems
- Chat history and search

**Technology Landscape:**
- WebSockets (Socket.io, ws) dominate real-time
- React/Vue for frontend
- Redis for presence/session management
- PostgreSQL for message persistence
```

---

### Phase 3: Problem Validation

**Goal:** Confirm this is a real problem worth solving

**Activities:**
1. Synthesize research findings
2. Validate problem exists in market
3. Identify target users and their pain points
4. Assess business value

**Use Perplexity to validate:**
- "How big is the market for affordable customer support chat?"
- "What % of small businesses use live chat?"
- "What are the biggest complaints about existing solutions?"

**Questions to Answer:**
- Is this a real, validated problem?
- Do users actually need this?
- What's the potential business impact?
- Who specifically will use this?

**Output:** Validated problem statement with evidence

---

### Phase 4: Solution Exploration

**Goal:** Explore 2-3 alternative approaches, not just the first idea

**Approach Pattern:**
For each alternative:
1. Describe high-level approach (NO technical details yet)
2. List pros
3. List cons
4. Explain why reject OR recommend

**Use MCP for validation:**
- Context7: Check if approach aligns with best practices
- Octocode: Find reference implementations
- Perplexity: Validate feasibility and common pitfalls

**Example Alternatives:**

```
### Alternative 1: Full-Featured Platform (Like Intercom Lite)
**Description:** Build complete support platform with chat, ticketing, knowledge base
**Pros:**
- Comprehensive solution
- Can charge premium pricing
- Higher customer value

**Cons:**
- Complex to build (6+ months)
- High maintenance overhead
- Competes with established players on features

**Why Rejected:** Too complex for MVP, scope creep risk

---

### Alternative 2: Chat-Only Focus (Recommended)
**Description:** Focus solely on real-time chat with basic features
**Pros:**
- Fast to build (2-3 months MVP)
- Clear value proposition
- Can expand features later

**Cons:**
- Limited initial revenue
- Must integrate with other tools

**Why Recommended:** Focused MVP, validates core value prop quickly

---

### Alternative 3: No-Code Platform Wrapper
**Description:** White-label existing open-source chat (e.g., Rocket.Chat)
**Pros:**
- Fastest to market (weeks)
- Proven technology

**Cons:**
- Limited differentiation
- Dependent on upstream project
- Harder to customize

**Why Rejected:** Not defensible, commoditized
```

---

### Phase 5: Recommendation & Decision

**Goal:** Make clear Go/No-Go recommendation with rationale

**Activities:**
1. Synthesize research and alternatives
2. Recommend ONE approach
3. Explain why this approach
4. Identify risks and mitigation
5. Define success criteria

**Output:** Clear recommendation with:
- Recommended approach
- Rationale (why this one?)
- Key risks and constraints
- Success metrics
- Go/No-Go decision

**Example Recommendation:**
```
**Recommended Approach:** Chat-Only Focus

**Why This One:**
- Fastest path to validate core value proposition
- Clear competitive advantage (price + simplicity)
- Research shows users want "Intercom minus complexity"
- Can expand features based on user feedback

**Risks:**
- Limited feature set may not attract users initially
- Revenue per customer lower than full platform
- Must integrate with existing ticketing systems

**Success Criteria:**
- 100 paying customers in first 6 months
- < $25/month pricing sustainable
- 90%+ uptime for real-time messaging
- < 500ms message delivery p95

**Decision:** ✅ Prosseguir para Spec
```

---

### Phase 6: Discovery Documentation

**Goal:** Write structured discovery document using template

**Activities:**
1. Load `templates/discovery.md`
2. Auto-number: DISC-{next-number}
3. Fill all sections with research findings
4. Include all MCP references
5. Save to `docs/discovery/DISC-{###}-{name}.md`

**Template Sections:**
- Problem Statement (from Phase 3)
- Who & Why (target users, pain points, business value)
- Research Context (from Phase 2)
- Proposed Solution (from Phase 5)
- Alternatives Considered (from Phase 4)
- Success Criteria (from Phase 5)
- Risks & Constraints (from Phase 5)
- Decision (Go/No-Go with rationale)

**Output:** Complete discovery document ready for review

---

## Key Principles

### Research First
- Use MCP tools BEFORE asking user questions
- Gather competitive intelligence automatically
- Validate assumptions with market data

### Socratic Questioning
- Ask ONE question at a time
- Only ask when cannot infer from research
- Guide user to discover insights themselves

### Alternative Exploration
- ALWAYS explore 2-3 alternatives
- Never commit to first idea
- Evaluate trade-offs objectively

### Evidence-Based Decisions
- Back recommendations with research
- Cite specific examples and data
- Link to references (Perplexity results, Context7 docs, Octocode repos)

### YAGNI for Discovery
- NO technical decisions yet (that's design phase)
- Focus on WHAT, not HOW
- Keep scope minimal (MVP thinking)

---

## MCP Integration Pattern

### Research Workflow

```javascript
// 1. Market Research (Perplexity)
const marketResearch = await perplexity.ask([
  { role: 'user', content: 'What are top customer support chat solutions in 2025?' }
]);

// 2. Technical Validation (Context7)
const technicalDocs = await context7.getLibraryDocs({
  libraryId: '/socketio/socket.io',
  topic: 'real-time messaging patterns'
});

// 3. Reference Implementations (Octocode)
const refImpls = await octocode.searchCode({
  queries: [{
    keywordsToSearch: ['realtime', 'chat', 'websocket'],
    stars: '>1000',
    match: 'file'
  }]
});
```

---

## When to Skip This Skill

- Idea is already well-researched with discovery doc
- User provides detailed PRD upfront
- This is a small feature addition to existing system

**In these cases:** Skip to `/product-engineering:specify`

---

## Common Pitfalls

❌ **Don't:**
- Jump to technical solutions (save for design phase)
- Accept first idea without exploring alternatives
- Skip market research (MCP is fast, use it!)
- Ask user for info you can research
- Write vague problem statements

✅ **Do:**
- Use MCP tools extensively for research
- Explore at least 2-3 alternatives
- Validate problems with market data
- Ask targeted questions only for gaps
- Write specific, measurable success criteria

---

## Handoff to Next Phase

After discovery document is approved:

**Announce:**
"Discovery complete! Your validated idea is documented in `docs/discovery/DISC-{###}-{name}.md`.

Ready to proceed to Specification phase?

If yes, I'll execute `/product-engineering:specify` to transform this discovery into a detailed spec (PRD) with user stories and requirements."

**Wait for user confirmation before proceeding.**

---

## Example Interaction Flow

```
User: "I want to build a cheaper alternative to Intercom"