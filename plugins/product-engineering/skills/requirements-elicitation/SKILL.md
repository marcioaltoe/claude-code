---
name: requirements-elicitation
description: Transform discovery into testable requirements through Socratic questioning, user story creation, and priority assignment
---

# Requirements Elicitation

## Overview

Transform validated discovery documents into precise, testable specifications with independently verifiable user stories, clear priorities, and complete traceability.

**Core Principle:** Elicit WHAT to build (not HOW), make every requirement testable, prioritize ruthlessly.

**Announce at start:** "I'm using the requirements-elicitation skill to transform the discovery into a detailed specification with testable user stories."

---

## Quick Reference

| Phase                              | Key Activities                     | MCP Usage                  | Output                   |
| ---------------------------------- | ---------------------------------- | -------------------------- | ------------------------ |
| **1. Discovery Analysis**          | Extract solution, success criteria | None                       | Core requirements draft  |
| **2. Functional Requirements**     | Derive system capabilities         | Context7 (domain patterns) | FR-### list              |
| **3. Non-Functional Requirements** | Performance, security, scalability | Perplexity, Context7       | NFR-### list             |
| **4. User Story Creation**         | 3-5 stories with P1/P2/P3          | None                       | Prioritized user stories |
| **5. Acceptance Criteria**         | Given-When-Then scenarios          | None                       | Testable scenarios       |
| **6. Rastreabilidade Mapping**     | Link stories � requirements        | None                       | Traceability matrix      |
| **7. Validation & Documentation**  | Completeness check, write spec     | None                       | SPEC-{###}-{name}.md     |

---

## The Process

### Phase 1: Discovery Analysis

**Goal:** Extract validated solution and requirements foundation from discovery document

**Activities:**

1. Read discovery document: `docs/discovery/DISC-{###}-{name}.md`
2. Identify recommended solution from alternatives
3. Extract success criteria and constraints
4. Review research findings for context
5. Note any open questions or ambiguities

**Questions to Answer:**

- What solution was recommended and why?
- What are the measurable success criteria?
- What constraints were identified (technical, business, time)?
- What user pain points must be addressed?

**Output:** Draft understanding of core requirements

**Example:**

```
Based on DISC-001-chat-system, the recommended approach is a chat-only focus
with real-time messaging as the core value proposition.

Core Requirements Foundation:
- Real-time message delivery (< 500ms p95)
- Message history persistence
- User presence indicators
- Integration with existing authentication

Constraints:
- Must be affordable ($25/month pricing target)
- Must scale to 100 concurrent users initially
- Must work in web browsers (no native app required)
```

---

### Phase 2: Functional Requirements

**Goal:** Derive specific, testable system capabilities from the solution

**Format:** "System MUST {capability}" - active voice, specific, verifiable

**Activities:**

1. Break down solution into discrete capabilities
2. Make each requirement testable and unambiguous
3. Avoid implementation details (WHAT not HOW)
4. Mark unclear items: `[NEEDS CLARIFICATION: specific question]`

**Use Context7 for domain patterns:**

- "What are common functional requirements for chat systems?"
- "What requirements are typical for real-time messaging?"

**Output:** Numbered functional requirements

**Example:**

```
### Functional Requirements

- **FR-001**: System MUST deliver messages to all online recipients within 500ms (p95)
- **FR-002**: System MUST persist all messages for retrieval after reconnection
- **FR-003**: System MUST display user online/offline status in real-time
- **FR-004**: Users MUST be able to view message history for past 90 days
- **FR-005**: System MUST authenticate users before allowing message access
- **FR-006**: Users MUST be able to send text messages up to 5000 characters
- **FR-007**: System MUST [NEEDS CLARIFICATION: support file attachments? size limits?]
- **FR-008**: System MUST [NEEDS CLARIFICATION: support group chats or only 1:1?]
```

**Key Pattern:** Each requirement is independently testable with clear pass/fail criteria

---

### Phase 3: Non-Functional Requirements (NFRs)

**Goal:** Define quality attributes and constraints beyond functionality

**Categories (mandatory coverage):**

1. **Performance**: Response times, throughput, latency
2. **Security**: Authentication, authorization, encryption, data privacy
3. **Scalability**: Concurrent users, data volume, horizontal scaling
4. **Observability**: Logging, metrics, tracing, alerting
5. **Maintainability**: Test coverage, code quality, documentation

**Use MCP for research:**

**Perplexity:**

- "What are standard performance requirements for real-time chat systems?"
- "What security requirements are critical for messaging applications?"
- "What scalability patterns are common for WebSocket-based apps?"

**Context7:**

- Look up best practices for your tech stack (e.g., React performance, PostgreSQL optimization)
- Research framework-specific NFRs (e.g., Hono middleware patterns)

**Output:** Categorized non-functional requirements

**Example:**

```
### Non-Functional Requirements

#### Performance (NFR-P-###)
- **NFR-P-001**: System MUST respond to message send requests within 100ms (p95)
- **NFR-P-002**: System MUST support 100 concurrent WebSocket connections per server instance
- **NFR-P-003**: System MUST load message history (last 50 messages) within 200ms

#### Security (NFR-S-###)
- **NFR-S-001**: All WebSocket connections MUST use WSS (secure WebSocket)
- **NFR-S-002**: System MUST validate user authentication on every message
- **NFR-S-003**: Messages MUST be encrypted at rest in database
- **NFR-S-004**: System MUST rate-limit message sending to 10 msgs/second per user

#### Scalability (NFR-SC-###)
- **NFR-SC-001**: System MUST scale horizontally to support 1000+ concurrent users
- **NFR-SC-002**: Database MUST handle 10,000+ messages per minute
- **NFR-SC-003**: [NEEDS CLARIFICATION: Redis required for presence? If yes, specify failover]

#### Observability (NFR-O-###)
- **NFR-O-001**: System MUST log all message send/receive events with timestamps
- **NFR-O-002**: System MUST expose metrics for message latency (p50, p95, p99)
- **NFR-O-003**: System MUST track WebSocket connection/disconnection events

#### Maintainability (NFR-M-###)
- **NFR-M-001**: Code coverage MUST be e80% for critical paths
- **NFR-M-002**: All public APIs MUST have OpenAPI/TypeScript type documentation
- **NFR-M-003**: System MUST pass all quality gates (lint, format, type-check) before merge
```

---

### Phase 4: User Story Creation

**Goal:** Create 3-5 prioritized, independently testable user stories

**Priority Levels (from Spec-Kit):**

- **P1 (MVP)**: Must-have for initial release - blocks launch
- **P2 (Important)**: Valuable but not blocking - can follow quickly
- **P3 (Nice to have)**: Future enhancements - nice but not essential

**Story Format (from Spec-Kit):**

```
### User Story [#] - [Brief Title] (Priority: P1/P2/P3)

**As a** {user type}
**I want** {capability}
**So that** {benefit}

**Why this priority**: {rationale - explain value and why this priority level}

**Independent Test**: {describe how this can be tested alone without other stories}

**Acceptance Scenarios**:
1. **Given** {initial state}, **When** {action}, **Then** {expected outcome}
2. **Given** {error condition}, **When** {action}, **Then** {error handling}
3. **Given** {edge case}, **When** {action}, **Then** {expected behavior}
```

**Key Principles:**

- Each story MUST be independently testable (can deploy and verify alone)
- Priorities ruthlessly assigned (not everything is P1!)
- Acceptance criteria use Given-When-Then format (testable, unambiguous)

**Output:** 3-5 user stories with clear priorities

**Example:**

```
### User Story 1 - Real-Time Message Delivery (Priority: P1)

**As a** chat user
**I want** to send and receive messages instantly
**So that** I can have real-time conversations

**Why this priority**: Core value proposition - without real-time messaging, the product has no purpose. This is the MVP.

**Independent Test**: Can be fully tested by opening two browser windows, sending messages between users, and verifying delivery within 500ms. No other features required.

**Acceptance Scenarios**:
1. **Given** two users are online and connected, **When** User A sends a message, **Then** User B receives it within 500ms
2. **Given** User B is offline, **When** User A sends a message, **Then** message is queued and delivered when User B reconnects
3. **Given** network connection is lost, **When** User A attempts to send a message, **Then** system shows "Connecting..." status and retries automatically
4. **Given** a message exceeds 5000 characters, **When** user attempts to send, **Then** system displays character count error before sending

---

### User Story 2 - Message History Retrieval (Priority: P1)

**As a** chat user
**I want** to view previous messages when I reconnect
**So that** I don't lose conversation context

**Why this priority**: Essential for usability - users expect persistence. Blocks MVP because real-time-only chat is incomplete.

**Independent Test**: Send messages, close browser, reopen, verify last 50 messages load within 200ms. Tests persistence layer independently.

**Acceptance Scenarios**:
1. **Given** user has previous conversation history, **When** user opens chat, **Then** last 50 messages load within 200ms
2. **Given** user scrolls up in chat, **When** user reaches top of loaded messages, **Then** next 50 older messages load automatically
3. **Given** user has no message history with this contact, **When** user opens chat, **Then** empty state displays with prompt to start conversation

---

### User Story 3 - User Presence Indicators (Priority: P2)

**As a** chat user
**I want** to see when other users are online
**So that** I know if they're available for real-time conversation

**Why this priority**: Valuable for UX but not blocking - chat works without it. Can be added post-MVP for better experience.

**Independent Test**: Open two browser windows, log in/out, verify presence indicators update within 2 seconds. Tests independently of messaging.

**Acceptance Scenarios**:
1. **Given** User B is online, **When** User A opens chat, **Then** User B shows "Online" status with green indicator
2. **Given** User B closes browser/logs out, **When** disconnection occurs, **Then** User A sees User B change to "Offline" within 2 seconds
3. **Given** User B is typing, **When** User B starts typing, **Then** User A sees "typing..." indicator within 1 second

---

### User Story 4 - Search Message History (Priority: P3)

**As a** chat user
**I want** to search through past messages
**So that** I can find specific information quickly

**Why this priority**: Nice to have for power users but not essential for MVP. Most users scroll through recent history. Can be added later.

**Independent Test**: Create test conversation with known keywords, use search, verify results returned within 1 second. Independent feature.

**Acceptance Scenarios**:
1. **Given** user has message history with keyword "budget", **When** user searches for "budget", **Then** all messages containing "budget" are displayed within 1 second
2. **Given** user searches for non-existent keyword, **When** search executes, **Then** "No results found" message displays
3. **Given** user has 1000+ messages, **When** user searches, **Then** search indexes efficiently and returns results within 1 second
```

**Edge Cases Section:**

```
### Edge Cases

- What happens when user sends message while offline? (queue and retry)
- How does system handle rapid message bursts? (rate limiting per NFR-S-004)
- What happens when WebSocket connection drops mid-message? (retry with idempotency)
- How does system handle emoji/special characters? (UTF-8 support, test with emoji)
- What happens when database is unavailable? (graceful degradation, error message)
```

---

### Phase 5: Rastreabilidade (Traceability Mapping)

**Goal:** Create complete mapping from user stories � requirements � NFRs

**Format (from Task-Master & Spec-Kit):**

```
| User Story | Functional Requirements | Non-Functional Requirements |
|------------|-------------------------|-----------------------------|
| US-1       | FR-001, FR-002, FR-005  | NFR-P-001, NFR-S-001, NFR-S-002 |
| US-2       | FR-002, FR-004, FR-005  | NFR-P-003, NFR-O-001 |
| US-3       | FR-003, FR-005          | NFR-P-002, NFR-SC-001 |
| US-4       | FR-004, FR-005          | NFR-P-003, NFR-M-002 |
```

**Why this matters:**

- Ensures every requirement traces to a user story (no orphans)
- Identifies gaps (user stories without requirements)
- Enables impact analysis (changing FR-001 affects US-1)
- Supports validation phase (can verify all US-1 requirements implemented)

**Output:** Complete traceability matrix

---

### Phase 6: Validation Checklist

**Goal:** Ensure specification is complete before handing off to design phase

**Run completeness checklist:**

```
### Specification Completeness Checklist

#### Requirements
- [ ] All functional requirements are testable and unambiguous
- [ ] No [NEEDS CLARIFICATION] markers remain (or documented as intentional blockers)
- [ ] All five NFR categories covered (Performance, Security, Scalability, Observability, Maintainability)
- [ ] Every requirement has clear pass/fail criteria

#### User Stories
- [ ] 3-5 user stories created
- [ ] Each story has priority assigned (P1, P2, or P3)
- [ ] At least one P1 story exists (MVP definition)
- [ ] Each story has "Why this priority" rationale
- [ ] Each story has "Independent Test" description
- [ ] All stories have acceptance criteria in Given-When-Then format
- [ ] Each story is independently testable (no hidden dependencies)

#### Edge Cases
- [ ] Edge cases documented
- [ ] Error scenarios covered in acceptance criteria
- [ ] Boundary conditions identified

#### Rastreabilidade
- [ ] Traceability matrix complete
- [ ] Every functional requirement maps to at least one user story
- [ ] Every user story references relevant NFRs
- [ ] No orphaned requirements

#### Success Criteria
- [ ] Success criteria are measurable
- [ ] Success criteria align with discovery document
- [ ] Acceptance criteria support success criteria
```

---

### Phase 7: Documentation & Branch Creation

**Goal:** Generate specification document and create feature branch

**Activities:**

1. Load `~/.claude/plugins/marketplaces/claude-craftkit/plugins/product-engineering/templates/spec.md`
2. Auto-number: Scan `docs/specs/` for next SPEC-### number
3. Fill all sections with elicited requirements, stories, and acceptance criteria
4. Link to discovery document: `Related Discovery: [DISC-{###}](../discovery/DISC-{###}-{name}.md)`
5. Create feature branch: `git checkout -b {###-feature-name}` (e.g., `001-chat-system`)
6. Save to `docs/specs/SPEC-{###}-{name}.md`

**Template Sections:**

- **Header**: Feature branch, created date, status, linked discovery
- **User Scenarios & Testing**: All user stories with priorities and acceptance criteria (mandatory)
- **Requirements**: Functional requirements (mandatory)
- **Non-Functional Requirements**: All five categories (Performance, Security, Scalability, Observability, Maintainability)
- **Key Entities**: Data model entities (if applicable)
- **Edge Cases**: Boundary conditions and error scenarios
- **Success Criteria**: Measurable outcomes (mandatory)
- **Rastreabilidade**: Traceability matrix

**Output:** Complete specification document ready for design phase

---

## Key Principles

### Socratic Questioning for Elicitation

- Ask ONE clarifying question at a time
- Use "What happens when...?" to uncover edge cases
- Challenge assumptions: "Why must it work this way?"
- Guide user to discover requirements themselves

**Example Dialogue:**

```
User: "Users can send messages"
You: "What happens when a user sends a message while offline?"
User: "Good question - I guess it should queue and send when they reconnect"
You: "What if they never reconnect? How long do we keep queued messages?"
```

### Make Everything Testable

- Every requirement must have clear pass/fail criteria
- Acceptance criteria use Given-When-Then format
- "Independent Test" for each story ensures no hidden dependencies

**Test:**

-  Good: "System delivers messages within 500ms (p95)"
- L Bad: "System is fast"

### Prioritize Ruthlessly

- Not everything is P1 - be honest about MVP scope
- P1 = Blocks launch, P2 = Valuable but not blocking, P3 = Future
- Justify every priority: "Why this priority: {rationale}"

**Trap to Avoid:** Everything P1 = nothing is prioritized

### Avoid Implementation Details

- Focus on WHAT (capabilities), not HOW (implementation)
-  Good: "System MUST persist messages for 90 days"
- L Bad: "System MUST use PostgreSQL with 90-day retention policy"

### Use MCP for Domain Research

- Context7: Domain-specific patterns and best practices
- Perplexity: Industry standards and benchmarks
- Don't guess - research common NFRs for your domain

---

## MCP Integration Pattern

### Research Workflow

```javascript
// 1. Functional Requirements Research (Context7)
const functionalPatterns = await context7.getLibraryDocs({
  libraryId: "/github/spec-kit",
  topic: "functional requirements for messaging systems",
});

// 2. Non-Functional Requirements Research (Perplexity + Context7)
const nfrStandards = await perplexity.ask([
  {
    role: "user",
    content:
      "What are industry-standard performance requirements for real-time chat systems in 2025?",
  },
]);

const securityNFRs = await context7.getLibraryDocs({
  libraryId: "/owasp/owasp",
  topic: "security requirements for web applications",
});

// 3. Scalability Patterns (Perplexity)
const scalabilityPatterns = await perplexity.ask([
  {
    role: "user",
    content:
      "What scalability requirements are common for WebSocket-based applications handling 100-1000 concurrent users?",
  },
]);
```

---

## When to Skip This Skill

- Discovery document already contains detailed requirements and user stories
- User provides a complete PRD upfront
- This is a minor feature addition with obvious requirements

**In these cases:** Skip to `/product-engineering:design` (but verify requirements are testable first)

---

## Common Pitfalls

L **Don't:**

- Write vague requirements ("system is user-friendly")
- Skip NFRs (performance, security, scalability, observability, maintainability)
- Make all stories P1 (defeats prioritization)
- Forget edge cases and error scenarios
- Leave [NEEDS CLARIFICATION] markers without user input
- Write implementation details in requirements (WHAT not HOW)
- Create user stories with hidden dependencies (must be independently testable)

 **Do:**

- Use specific, measurable, testable requirements
- Cover all five NFR categories completely
- Prioritize ruthlessly (honest MVP scope)
- Document edge cases explicitly
- Use Given-When-Then for acceptance criteria
- Use MCP tools for domain research
- Create traceability matrix (requirements � stories)
- Mark every requirement with FR-### or NFR-{category}-### numbering

---

## Handoff to Next Phase

After specification document is complete and validated:

**Announce:**

"Specification complete! Your requirements are documented in `docs/specs/SPEC-{###}-{name}.md` with:

- {N} functional requirements (all testable)
- {N} non-functional requirements across 5 categories
- {N} prioritized user stories ({X} P1, {Y} P2, {Z} P3)
- Complete acceptance criteria in Given-When-Then format
- Full rastreabilidade mapping

Feature branch `{###-feature-name}` created.

Ready to proceed to Design phase?

If yes, I'll execute `/product-engineering:design` to transform this spec into a technical architecture with ADRs."

**Wait for user confirmation before proceeding.**

---

## Example Interaction Flow

```
User: "I have discovery document DISC-001-chat-system.md ready. Can you create the spec?"
```
