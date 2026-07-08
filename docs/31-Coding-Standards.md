# 31 - Coding Standards

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Coding Standards & Development Guidelines

------------------------------------------------------------------------

# Purpose

This document establishes the official coding standards for Ravenshaw
Moments to ensure consistency, maintainability, scalability,
readability, and security across the codebase.

------------------------------------------------------------------------

# Guiding Principles

-   Readability over cleverness
-   Consistency over personal preference
-   Security by default
-   Simplicity first
-   Reusable components
-   Strong typing
-   Documentation-first development

------------------------------------------------------------------------

# Technology Standards

-   Next.js 16 (App Router)
-   React 19
-   TypeScript (strict mode)
-   Tailwind CSS v4
-   Shadcn UI
-   Supabase
-   PostgreSQL

------------------------------------------------------------------------

# Folder Organization

Use feature-based organization.

``` text
src/
  app/
  components/
    ui/
    auth/
    profile/
    departments/
    hostels/
    organizations/
    competitions/
    events/
    admin/
  lib/
  hooks/
  providers/
  types/
  utils/
```

------------------------------------------------------------------------

# Naming Conventions

Files: - kebab-case.tsx

Components: - PascalCase

Variables: - camelCase

Constants: - UPPER_SNAKE_CASE

Interfaces: - PascalCase

Database tables: - plural_snake_case

------------------------------------------------------------------------

# TypeScript Rules

-   Avoid `any`
-   Prefer explicit types
-   Use shared interfaces
-   Enable strict mode
-   Validate external data

------------------------------------------------------------------------

# React Standards

-   Prefer Server Components
-   Use Client Components only when required
-   Keep components small
-   Reuse shared UI
-   Avoid deeply nested components

------------------------------------------------------------------------

# Styling

-   Tailwind utility classes
-   Reusable component variants
-   Responsive-first
-   No inline styles except debugging
-   Consistent spacing and typography

------------------------------------------------------------------------

# Forms

-   React Hook Form
-   Zod validation
-   Server-side validation required
-   Accessible error messages

------------------------------------------------------------------------

# Security Rules

-   Never expose secrets
-   Validate all inputs
-   Enforce RBAC + RLS
-   Sanitize user content
-   Use server-side authorization

------------------------------------------------------------------------

# Git Standards

Commit messages:

-   feat:
-   fix:
-   docs:
-   refactor:
-   perf:
-   test:
-   chore:

Feature branches should be merged through reviewed pull requests.

------------------------------------------------------------------------

# Testing

Before merging:

-   Type check passes
-   Lint passes
-   Build succeeds
-   Manual verification completed

------------------------------------------------------------------------

# Documentation

Every major module should include:

-   Purpose
-   Dependencies
-   Usage
-   Security considerations

Architecture documents must be updated when behavior changes.

------------------------------------------------------------------------

# Performance

-   Lazy load heavy components
-   Optimize images
-   Minimize client JavaScript
-   Avoid unnecessary re-renders

------------------------------------------------------------------------

# Accessibility

-   Semantic HTML
-   Keyboard navigation
-   Visible focus states
-   ARIA where appropriate
-   Sufficient color contrast

------------------------------------------------------------------------

# Code Review Checklist

-   Readable?
-   Typed?
-   Secure?
-   Tested?
-   Documented?
-   Accessible?
-   Performance acceptable?

------------------------------------------------------------------------

# Related Documents

-   10-Frontend-Architecture.md
-   11-Backend-Architecture.md
-   12-Security.md
-   30-Decisions.md
-   32-UI-Design-System.md

© Ravenshaw Moments
