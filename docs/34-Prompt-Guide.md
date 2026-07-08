# 34 - Prompt Guide

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** AI Prompt & Development Guide

------------------------------------------------------------------------

# Purpose

This document provides the official prompt engineering guide for AI
coding assistants used to develop Ravenshaw Moments. It ensures every AI
follows the same architecture, coding standards, security model, and
documentation rules.

------------------------------------------------------------------------

# Core Rule

Treat all Version 2.0 architecture documents as the single source of
truth. Never redesign the platform unless explicitly instructed to
create Version 3.x documentation.

------------------------------------------------------------------------

# Primary Reference Documents

AI assistants must read first:

-   README.md
-   00-Project-Constitution.md
-   01-Architecture.md
-   02-Features.md
-   04-Database-Blueprint.md
-   09-API-Specification.md
-   30-Decisions.md
-   31-Coding-Standards.md
-   32-UI-Design-System.md

------------------------------------------------------------------------

# Technology Stack

Always use:

-   Next.js 16 App Router
-   React 19
-   TypeScript (strict)
-   Tailwind CSS v4
-   Shadcn UI
-   Supabase Auth
-   PostgreSQL
-   Supabase Storage

Never replace the stack without explicit approval.

------------------------------------------------------------------------

# Coding Rules

-   Prefer Server Components.
-   Use Client Components only when necessary.
-   Avoid `any`.
-   Reuse UI components.
-   Write secure server-side validation.
-   Respect RBAC and RLS.

------------------------------------------------------------------------

# Database Rules

-   UUID primary keys
-   Normalized schema
-   Snake_case table names
-   Never remove existing columns without migration
-   Produce forward-only SQL migrations

------------------------------------------------------------------------

# UI Rules

-   Mobile first
-   Accessible
-   Responsive
-   Follow design tokens
-   Use official color palette
-   Keep interfaces consistent

------------------------------------------------------------------------

# Security Checklist

Every generated feature must:

-   Validate inputs
-   Check authentication
-   Check authorization
-   Prevent XSS
-   Prevent SQL injection
-   Protect secrets
-   Respect privacy settings

------------------------------------------------------------------------

# Documentation Rules

Whenever architecture changes:

1.  Update related documentation.
2.  Record the decision.
3.  Keep documents synchronized.

------------------------------------------------------------------------

# Prompt Templates

## Generate Feature

> Implement the feature according to the frozen Version 2.0
> documentation. Do not change architecture unless requested.

## Generate Database

> Generate production-ready PostgreSQL migrations compatible with the
> approved database blueprint.

## Generate UI

> Build responsive, accessible UI using the Ravenshaw Moments design
> system.

## Refactor

> Improve readability and performance without changing behavior or
> architecture.

## Review

> Review code for security, performance, accessibility, and compliance
> with project standards.

------------------------------------------------------------------------

# Supported AI Tools

-   ChatGPT
-   Claude Code
-   Gemini CLI
-   Cursor
-   GitHub Copilot
-   Codex
-   Windsurf
-   Continue.dev

------------------------------------------------------------------------

# Prohibited Changes

Do not:

-   Replace framework
-   Break APIs
-   Ignore security
-   Remove documentation
-   Introduce incompatible patterns

------------------------------------------------------------------------

# Related Documents

-   01-Architecture.md
-   30-Decisions.md
-   31-Coding-Standards.md
-   32-UI-Design-System.md

© Ravenshaw Moments
