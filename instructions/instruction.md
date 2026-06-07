# DevGrid Extension Engineering Constitution

Version: 2.1

Status: ACTIVE

Repository Type: Master Repository

---

# Purpose

This repository contains the DevGrid product.

The extension is the primary runtime environment of DevGrid.

All user-facing functionality belongs here.

This document exists to:

* Prevent architectural drift
* Prevent backend creep
* Maintain engineering quality
* Preserve repository boundaries
* Ensure long-term maintainability
* Protect user trust

Every contributor, AI agent, and maintainer must follow this document.

---

# Governance Rules

## Authority Hierarchy

The source of truth for DevGrid is:

1. User Instructions
2. Approved ADR Documents
3. Phase Output Documents
4. instruction.md
5. v2-planning.md

If conflicts exist, higher-priority sources override lower-priority sources.

---

## Specification Authority

Kiro must not create new architecture decisions.

Kiro must not create alternative architectures.

Kiro must not reinterpret approved ADRs.

Kiro must not replace approved designs with its own recommendations.

Architecture has already been decided.

Implementation follows architecture.

---

## Architecture Freeze

The following decisions are locked:

* Two repository architecture
* GitHub OAuth authentication
* Minimal authentication service
* Repository boundaries
* Permission model
* Credential lifecycle strategy
* Onboarding strategy

These decisions are requirements.

Not suggestions.

---

## Product Ownership Rule

DevGrid-Extension is the product.

Kiro must not move product functionality into devgrid-auth.

The existence of devgrid-auth does not justify moving:

* Submission processing
* Repository synchronization
* Markdown generation
* Statistics
* User workflows

out of the extension.

---

## No Autonomous Expansion

Kiro must not independently introduce:

* Databases
* Analytics systems
* Queues
* Event buses
* Additional services
* Additional repositories
* Telemetry systems
* Monitoring platforms
* New infrastructure

unless explicitly approved.

---

# Project Mission

DevGrid automatically synchronizes LeetCode progress to GitHub while remaining:

* Secure
* Transparent
* Reliable
* Easy to use
* Easy to maintain

The extension is the product.

The browser is the primary runtime.

---

# Authentication Strategy

DevGrid uses:

GitHub OAuth
+
Minimal Authentication Service

The purpose of authentication is:

* Eliminate Personal Access Tokens
* Reduce onboarding friction
* Improve trust
* Provide familiar Sign In With GitHub UX

Users should experience:

Install Extension
↓
Sign In With GitHub
↓
Select Repository
↓
Use DevGrid

without manually generating credentials.

---

# Repository Ownership

This repository owns:

## User Experience

* Popup UI
* Settings UI
* Authentication UI
* Status UI
* Error Handling UI

---

## LeetCode Integration

* Page detection
* Submission detection
* Problem extraction
* Submission extraction
* GraphQL communication

---

## GitHub Synchronization

* Repository communication
* File creation
* File updates
* Commit creation
* Sync orchestration

---

## Data Processing

* Submission processing
* Metadata processing
* Statistics generation
* Markdown generation

---

## Storage

* User settings
* Repository configuration
* Session state
* Cached metadata

---

## Authentication Client

* Login initiation
* Logout initiation
* Session validation
* Auth state management

---

# Repository Boundaries

This repository DOES NOT own:

* OAuth Client Secret
* Authentication infrastructure
* Authorization callbacks
* Secret management
* OAuth configuration

These belong exclusively to:

devgrid-auth

---

# Multi Repository Architecture

Repository A

devgrid-extension

Public

Master Repository

---

Repository B

devgrid-auth

Private

Supporting Repository

---

Architecture decisions originate from:

devgrid-extension

The authentication repository follows those decisions.

---

# Architectural Principles

## Principle 1

Product Logic Stays In The Extension

Business logic belongs here.

Examples:

* Submission workflows
* Repository workflows
* Statistics
* Markdown generation
* User workflows

must remain here.

---

## Principle 2

Direct GitHub Synchronization

Correct:

Extension
↓
GitHub

Incorrect:

Extension
↓
Auth Service
↓
GitHub

The authentication service is not a synchronization proxy.

---

## Principle 3

Browser First

If functionality can safely execute in the extension:

Keep it in the extension.

Avoid unnecessary backend dependency.

---

## Principle 4

Least Privilege

Request only required permissions.

Avoid unnecessary Chrome permissions.

---

## Principle 5

Security Before Features

Trust is a feature.

Security improvements take priority over feature additions.

---

## Principle 6

Documentation First

Research
↓
Review
↓
Decision
↓
Implementation

Implementation must never drive architecture.

---

# Intended Architecture

src/

├── background/
│
├── content/
│
├── domain/
│
├── popup/
│
├── services/
│   ├── auth/
│   ├── github/
│   ├── leetcode/
│   ├── markdown/
│   └── storage/
│
└── utils/

---

# Definition Of Success

A successful DevGrid extension:

* Detects submissions reliably
* Synchronizes repositories reliably
* Maintains least privilege
* Preserves user trust
* Eliminates Personal Access Tokens
* Keeps product logic inside the extension
* Remains independent from authentication infrastructure

Users should be able to:

Install Extension
↓
Sign In With GitHub
↓
Select Repository
↓
Use DevGrid

with minimal onboarding friction.
