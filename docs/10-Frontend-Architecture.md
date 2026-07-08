# 10 - Frontend Architecture

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Frontend Architecture

------------------------------------------------------------------------

# Purpose

This document defines the official frontend architecture, project
structure, UI principles, component organization, and development
standards for Ravenshaw Moments.

------------------------------------------------------------------------

# Technology Stack

-   Next.js 16 (App Router)
-   React 19
-   TypeScript
-   Tailwind CSS v4
-   Shadcn UI
-   Lucide Icons
-   React Hook Form
-   Zod

------------------------------------------------------------------------

# Architectural Principles

-   Component-based design
-   Server-first rendering
-   Reusable UI components
-   Accessibility by default
-   Responsive design
-   Performance-first
-   Documentation-first

------------------------------------------------------------------------

# Folder Structure

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
  hooks/
  lib/
  providers/
  styles/
```

------------------------------------------------------------------------

# Routing

Uses the Next.js App Router.

Main route groups:

-   (auth)
-   (dashboard)
-   public pages
-   API route handlers

------------------------------------------------------------------------

# Component Hierarchy

-   Layouts
-   Pages
-   Feature Components
-   Shared Components
-   UI Components
-   Utility Functions

------------------------------------------------------------------------

# State Management

-   Server Components by default
-   Client Components only when required
-   React state for local UI
-   Server Actions for mutations

------------------------------------------------------------------------

# Forms

-   React Hook Form
-   Zod validation
-   Server-side validation
-   Accessible error messages

------------------------------------------------------------------------

# Styling

-   Tailwind CSS v4
-   Design tokens
-   Responsive utilities
-   Shared component variants

------------------------------------------------------------------------

# Performance

-   Server rendering where possible
-   Lazy loading for heavy components
-   Optimized images
-   Code splitting
-   Minimal client JavaScript

------------------------------------------------------------------------

# Accessibility

-   Semantic HTML
-   Keyboard navigation
-   Screen reader support
-   Sufficient color contrast
-   Focus indicators

------------------------------------------------------------------------

# Error Handling

-   Route-level error boundaries
-   Loading states
-   Empty states
-   Friendly error messages

------------------------------------------------------------------------

# Security

-   No secrets in client code
-   Input validation
-   Output escaping
-   Auth-aware rendering

------------------------------------------------------------------------

# Coding Standards

-   Strong typing
-   Small reusable components
-   Consistent naming
-   Feature-based organization
-   No duplicated logic

------------------------------------------------------------------------

# Related Documents

-   01-Architecture.md
-   09-API-Specification.md
-   11-Backend-Architecture.md
-   31-Coding-Standards.md
-   32-UI-Design-System.md

© Ravenshaw Moments
