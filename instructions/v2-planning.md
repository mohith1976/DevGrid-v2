# DevGrid V2 Roadmap

Version: 2.1

Status: ACTIVE

Repository: devgrid-extension

Repository Role: Master Repository

---

# Theme

Trust, Security, and Production Readiness

V1 solved the workflow problem.

V2 focuses on making DevGrid trustworthy, secure, maintainable, and ready for broader adoption.

---

# Current Status

Phase 1
✅ Complete

Phase 2
✅ Complete

Phase 3
✅ Complete

Phase 4
🚧 Ready To Begin

---

# Phase 1 - Authentication Architecture Review

Status:

COMPLETED

---

## Outcome

Selected Architecture:

GitHub OAuth
+
Minimal Authentication Service

---

## Why OAuth Was Selected

* Familiar Sign In With GitHub experience
* Eliminates Personal Access Tokens
* Reduces onboarding friction
* Improves adoption
* Provides sufficient security for DevGrid's use case

---

## Why GitHub Apps Were Rejected

GitHub Apps introduced additional onboarding complexity:

Sign In
↓
Install App
↓
Choose Account
↓
Choose Repository Access
↓
Authorize
↓
Return To Extension

This conflicted with DevGrid's goal of making authentication simple and approachable.

---

# Phase 2 - Security Review

Status:

COMPLETED

---

## Outcome

Security Review Approved

No critical vulnerabilities identified.

Architecture Approved.

---

# Phase 3 - Architecture Decision Review

Status:

COMPLETED

---

## Approved ADRs

ADR-001 Authentication Strategy

ADR-002 Credential Storage Strategy

ADR-003 Permission Model

ADR-004 Credential Lifecycle Management

ADR-005 Repository Boundary Model

ADR-006 Onboarding Strategy

---

## Outcome

Architecture Frozen.

No architecture changes without explicit approval.

---

# Phase 4 - Implementation

Status:

READY

---

# Phase 4A - OAuth Integration

Objective:

Replace PAT authentication with GitHub OAuth authentication.

---

## Goals

Implement:

* Authentication abstraction
* OAuth integration
* Session management
* Login workflows
* Logout workflows
* Session validation

---

## Deliverables

services/auth

Authentication orchestration

Authentication UI

Authentication state management

Migration support

---

## Success Criteria

Users can:

Sign In With GitHub

without generating Personal Access Tokens.

---

# Phase 4B - Security Hardening

Objective:

Apply improvements identified during Phase 2.

---

## Goals

Implement:

* Rate limit handling
* Message validation
* Error handling improvements
* Session validation improvements
* Security hardening

---

# Phase 4C - Onboarding Improvements

Objective:

Reduce first-time setup friction.

---

## Goals

Improve:

* Sign-in experience
* Repository selection experience
* Setup guidance
* Error messaging

---

## Success Criteria

A new user can:

Clone Repository
↓
Build Extension
↓
Load Unpacked
↓
Sign In With GitHub
↓
Select Repository
↓
Use DevGrid

without generating tokens manually.

---

# Explicitly Out Of Scope

* Analytics dashboards
* AI features
* Leaderboards
* Cloud sync
* Multi-browser support
* Multi-repository support
* Theme customization
* Advanced statistics
* README redesign projects

---

# Engineering Rules

Phase 4 must not:

* Change repository ownership
* Change authentication architecture
* Introduce backend sync
* Introduce analytics systems
* Introduce unrelated features

Implementation follows architecture.

Architecture does not follow implementation.

---

# Definition Of Success

V2 succeeds when users trust:

* Authentication
* Permissions
* Credential handling
* Repository access
* Security model

while maintaining the simplicity and reliability established in V1.

The ideal DevGrid onboarding flow is:

Install Extension
↓
Sign In With GitHub
↓
Select Repository
↓
Start Solving Problems
