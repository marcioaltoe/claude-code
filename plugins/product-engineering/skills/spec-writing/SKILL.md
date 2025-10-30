---
name: spec-writing
description: Techniques for writing clear, unambiguous specifications with testable acceptance criteria and complete requirements coverage
---

# Spec Writing

## Overview

Master the craft of writing precise, actionable specifications that eliminate ambiguity, ensure testability, and drive successful implementation.

**Core Principle:** Specifications are executable contracts. Every word matters. Precision prevents bugs.

**Announce at start:** "I'm using the spec-writing skill to create a clear, testable specification document."

---

## Quick Reference

| Technique                     | Purpose                         | Key Pattern                   | Example                         |
| ----------------------------- | ------------------------------- | ----------------------------- | ------------------------------- |
| **Active Voice Requirements** | Clear, testable statements      | "System MUST {verb} {object}" | "System MUST validate email"    |
| **Given-When-Then Scenarios** | Unambiguous acceptance criteria | Given X, When Y, Then Z       | Given user logged in, When...   |
| **Avoid Ambiguity Words**     | Eliminate interpretation        | Replace vague with specific   | "< 500ms" not "fast"            |
| **Edge Case Documentation**   | Complete behavior specification | "What happens when...?"       | "What happens when offline?"    |
| **NFR Categorization**        | Systematic quality coverage     | 5 categories (P/S/SC/O/M)     | Performance, Security, etc.     |
| **[NEEDS CLARIFICATION]**     | Mark uncertainties explicitly   | Flag unknowns, don't guess    | [NEEDS CLARIFICATION: timeout?] |
| **Independent Testability**   | Stories work standalone         | No hidden dependencies        | Can test US-1 without US-2      |

---

## Key Principles

### Principle 1: Precision Over Brevity

Longer, specific requirements are better than short, vague ones.

### Principle 2: Testability is Mandatory

Every requirement must have clear pass/fail criteria. Ask: "How would I write a test case for this?"

### Principle 3: Solution-Agnostic (WHAT not HOW)

Describe capabilities, not implementation.

-  Good: "System MUST persist user preferences across sessions"
- L Bad: "System MUST store user preferences in localStorage"

### Principle 4: Quantify Everything Measurable

Replace subjective adjectives with objective metrics:

| Vague Word | Specific Metric                |
| ---------- | ------------------------------ |
| "Fast"     | "< 500ms p95"                  |
| "Scalable" | "Handle 1000 concurrent users" |
| "Reliable" | "99.9% uptime"                 |
| "Secure"   | "TLS 1.3, bcrypt rounds=12"    |

### Principle 5: Given-When-Then for All Acceptance Criteria

Format: **Given** {precondition}, **When** {action}, **Then** {expected outcome}

This eliminates ambiguity and makes tests easy to automate.

### Principle 6: Mark Uncertainties Explicitly

Use `[NEEDS CLARIFICATION: {specific question}]` when ambiguous. NEVER guess.

---

## Common Pitfalls

L **Don't:**

1. Use ambiguous words without quantification ("fast", "scalable", "robust")
2. Skip error scenarios in acceptance criteria
3. Write implementation-specific requirements
4. Forget to define domain terms
5. Leave [NEEDS CLARIFICATION] markers unresolved
6. Create user stories with hidden dependencies
7. Skip NFR categories

 **Do:**

1. Quantify everything measurable
2. Use Given-When-Then for all acceptance criteria
3. Mark uncertainties explicitly
4. Cover happy path + errors + edge cases
5. Make requirements independently testable
6. Document all NFR categories (Performance, Security, Scalability, Observability, Maintainability)
7. Define domain-specific terms explicitly

---

_This skill should be used in conjunction with `requirements-elicitation` skill when creating specifications from discovery documents._
