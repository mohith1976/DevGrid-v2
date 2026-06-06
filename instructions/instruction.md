# DevGrid Engineering Constitution

## Purpose

This document defines the engineering rules, architectural principles, and development standards for DevGrid.

The purpose of this document is to prevent architectural drift, scope creep, unnecessary rewrites, and inconsistent implementation decisions.

This document applies to all future versions of DevGrid unless explicitly superseded.

---

# Project Philosophy

DevGrid is a browser-first automation tool.

The project should remain:

* Simple
* Reliable
* Maintainable
* Secure
* Understandable

Complexity must be justified.

Every new component introduces maintenance cost.

Prefer the simplest solution that satisfies the requirements.

---

# Current Architecture

```text
src/

├── background/
│   └── index.ts
│
├── content/
│   ├── index.ts
│   └── submission-detector.ts
│
├── domain/
│   ├── github-config.ts
│   └── submission.ts
│
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.ts
│
├── services/
│   ├── github/
│   ├── leetcode/
│   ├── markdown/
│   └── storage/
│
├── utils/
│   └── file-naming.ts
```

Future additions should preserve this separation of concerns.

---

# Core Architectural Principles

## Rule 1 - Preserve Service Boundaries

Services must remain isolated.

Incorrect:

LeetCode Service → GitHub Service

Correct:

LeetCode Service
↓
Domain Object
↓
Sync Workflow
↓
GitHub Service

Services should communicate through domain models rather than direct coupling.

---

## Rule 2 - GitHub API Isolation

All GitHub API communication must remain inside:

```text
services/github
```

No direct GitHub API requests elsewhere in the application.

---

## Rule 3 - LeetCode API Isolation

All LeetCode GraphQL requests must remain inside:

```text
services/leetcode
```

No GraphQL requests should be scattered across the codebase.

---

## Rule 4 - Storage Isolation

All Chrome storage operations must go through:

```text
services/storage
```

Never access chrome.storage directly from UI, content scripts, or unrelated services.

---

## Rule 5 - Domain Models Are Contracts

Domain models represent application contracts.

Services should exchange typed domain objects.

Avoid passing raw API responses throughout the application.

---

# Authentication Principles

## Rule 6 - Authentication Must Be Abstracted

Authentication implementation must not leak across the codebase.

The application should not depend directly on:

* PATs
* Fine-Grained PATs
* OAuth
* GitHub Apps

Authentication should exist behind a dedicated abstraction boundary.

Suggested future structure:

```text
services/

├── auth/
├── github/
├── leetcode/
├── markdown/
└── storage/
```

Authentication changes should not require large-scale application rewrites.

---

## Rule 7 - Least Privilege First

When multiple solutions are viable:

Choose the solution that requires:

* Fewer permissions
* Smaller attack surface
* Lower maintenance burden

Convenience alone is not sufficient justification for broader access.

---

## Rule 8 - Research Before Security Decisions

Authentication and security changes must follow:

Research
↓
Review
↓
Decision
↓
Implementation

Never implement security changes based solely on assumptions.

---

# Scope Management

## Rule 9 - Scope Must Be Intentional

Features should only be added when they provide clear value.

Avoid adding functionality simply because it is technically possible.

Every feature increases:

* Maintenance cost
* Testing burden
* User complexity

---

## Rule 10 - Avoid Premature Infrastructure

Do not introduce:

* Servers
* Databases
* Cloud services
* Queues
* Background infrastructure

unless there is documented evidence that they are required.

Infrastructure should solve a proven problem.

---

# Reliability Principles

## Rule 11 - Preserve Existing User Data

Changes must not silently break:

* Existing repositories
* Existing configurations
* Existing sync history

If migration is required:

* Document it
* Test it
* Provide rollback considerations

---

## Rule 12 - Prefer Incremental Change

Working systems should not be rewritten without strong justification.

Prefer:

* Refactoring
* Isolation
* Hardening

over complete rewrites.

---

# Security Principles

## Rule 13 - Security Changes Require Documentation

Every significant security-related change must document:

* Threat addressed
* Risk level
* Mitigation strategy
* Tradeoffs

Undocumented security decisions are not acceptable.

---

## Rule 14 - Trust Through Transparency

Users should be able to understand:

* What permissions DevGrid uses
* Why those permissions are required
* How credentials are stored
* What access DevGrid has to their repositories

User trust is a product feature.

---

# Documentation Requirements

Major architectural or security work must be accompanied by documentation.

Examples:

```text
AUTH_ARCHITECTURE.md

SECURITY_REVIEW.md

THREAT_MODEL.md

ONBOARDING_REVIEW.md

ADR-001 Authentication Strategy

ADR-002 Credential Storage Strategy

ADR-003 Permission Model
```

Implementation should follow documented decisions.

---

# Definition of Good Engineering

Good engineering in DevGrid means:

* Simple solutions
* Clear boundaries
* Minimal permissions
* Evidence-based decisions
* Maintainable code
* Reliable behavior
* Transparent security practices

The goal is not maximum features.

The goal is building a tool users can trust.
