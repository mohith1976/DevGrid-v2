# DevGrid Extension Engineering Constitution

Version: 2.0

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

# Project Mission

DevGrid automatically synchronizes LeetCode progress to GitHub while remaining:

* Secure
* Transparent
* Reliable
* Easy to use
* Easy to maintain

DevGrid is browser-first.

The extension is the product.

---

# Repository Ownership

This repository owns:

## User Experience

* Popup UI
* Settings UI
* Authentication UI
* Status UI
* Error handling UI

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

* GitHub App secrets
* OAuth credentials
* Authentication infrastructure
* Authorization callbacks
* Secret management

These belong exclusively to:

devgrid-auth

---

# Multi Repository Architecture

DevGrid consists of:

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

The authentication repository follows these decisions.

---

# Architectural Principles

## Principle 1 - Product Logic Stays In The Extension

Business logic belongs inside this repository.

Examples:

* Submission workflows
* Repository workflows
* Statistics
* Markdown generation
* User workflows

must remain here.

Business logic must never migrate into devgrid-auth.

---

## Principle 2 - Direct GitHub Synchronization

Synchronization must occur directly between:

Extension
↓
GitHub

Never:

Extension
↓
Authentication Service
↓
GitHub

The authentication service is not a synchronization proxy.

---

## Principle 3 - Browser First

If functionality can safely execute inside the extension, it should remain inside the extension.

Avoid unnecessary backend dependencies.

---

## Principle 4 - Least Privilege

Request only permissions that are required.

Avoid broad host permissions.

Avoid unnecessary Chrome permissions.

---

## Principle 5 - Security Before Features

Security improvements take priority over feature additions.

Trust is a feature.

---

## Principle 6 - Incremental Evolution

Prefer:

* Refactoring
* Isolation
* Hardening

over rewrites.

Working systems should evolve.

Not restart.

---

## Principle 7 - Documentation First

Major changes require:

Research
↓
Review
↓
Decision
↓
Implementation

Implementation must not drive architecture.

---

# Intended Architecture

src/

├── background/
├── content/
├── domain/
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

No alternative structures should be introduced without architectural review.

---

# Layer Responsibilities

## background/

Responsibilities:

* Extension lifecycle
* Workflow coordination
* Event orchestration
* Message routing
* Sync coordination
* Authentication coordination

The background layer coordinates.

It does not implement business logic.

---

## content/

Responsibilities:

* DOM observation
* Submission detection
* LeetCode interaction
* Data collection

Content scripts collect information.

Content scripts do not:

* Call GitHub APIs
* Perform synchronization
* Manage authentication

---

## domain/

Responsibilities:

* Domain entities
* Contracts
* Shared types
* Business models

Examples:

* Submission
* GitHubConfig
* AuthState
* Repository
* SyncResult

Services communicate through domain objects.

Not raw API responses.

---

## popup/

Responsibilities:

* User interaction
* Configuration
* Status display

No business logic.

UI calls services.

Services perform work.

---

## services/auth/

Responsibilities:

* Authentication abstraction
* Login workflows
* Logout workflows
* Session validation
* Authentication state

All authentication communication must pass through this service.

No other service may directly call authentication endpoints.

---

## services/github/

Responsibilities:

* GitHub API communication
* Repository operations
* File management
* Commit creation

All GitHub communication belongs here.

---

## services/leetcode/

Responsibilities:

* LeetCode communication
* GraphQL operations
* Problem retrieval
* Submission retrieval

All LeetCode communication belongs here.

---

## services/markdown/

Responsibilities:

* README generation
* Markdown formatting
* Template processing

---

## services/storage/

Responsibilities:

* chrome.storage access
* Persistence
* Configuration storage
* Session storage

All storage access belongs here.

---

## utils/

Pure utility functions only.

Utilities must not:

* Access APIs
* Access storage
* Implement workflows

---

# Communication Rules

The extension communicates with:

* GitHub APIs
* LeetCode APIs
* devgrid-auth APIs

through defined interfaces.

No hidden coupling.

No direct repository dependency.

No shared source code.

---

# Forbidden Changes

Do not introduce:

* Analytics systems
* User tracking
* Telemetry
* Sync through backend
* Business logic in UI
* Business logic in content scripts
* Hidden feature flags
* Architecture bypasses

---

# Definition Of Success

A successful DevGrid extension:

* Detects submissions reliably
* Synchronizes repositories reliably
* Remains maintainable
* Preserves user trust
* Maintains least privilege
* Keeps product logic inside the extension
* Remains independent from authentication infrastructure
