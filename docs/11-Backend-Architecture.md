# 11 - Backend Architecture

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Backend Architecture

------------------------------------------------------------------------

# Purpose

This document defines the official backend architecture for Ravenshaw
Moments. It establishes how business logic, authentication, data access,
storage, validation, and security are implemented.

------------------------------------------------------------------------

# Technology Stack

-   Next.js 16 Server Actions
-   Next.js Route Handlers
-   TypeScript
-   Supabase
-   PostgreSQL
-   Supabase Storage
-   Zod Validation

------------------------------------------------------------------------

# Design Principles

-   Server-first architecture
-   Thin API layer
-   Centralized business logic
-   Strong validation
-   Secure by default
-   Auditability
-   Modular services

------------------------------------------------------------------------

# Backend Layers

``` text
Client
   │
Server Actions / Route Handlers
   │
Business Logic
   │
Repositories / Data Access
   │
Supabase
   │
PostgreSQL + Storage
```

------------------------------------------------------------------------

# Responsibilities

## Server Actions

-   Handle authenticated mutations
-   Validate input
-   Enforce permissions
-   Return typed responses

## Route Handlers

-   Public APIs
-   Webhooks (future)
-   External integrations
-   File downloads
-   Verification endpoints

## Business Logic

-   Competition workflows
-   Certificate generation
-   Contribution approval
-   Notification creation
-   Profile lifecycle

## Data Access

-   Encapsulate database queries
-   Prevent duplicated SQL
-   Respect RLS policies

------------------------------------------------------------------------

# Validation

-   Zod schemas
-   Server-side validation
-   File validation
-   Permission validation
-   Business rule validation

------------------------------------------------------------------------

# Storage

Buckets include:

-   profile-images
-   gallery
-   certificates
-   contribution-proofs
-   competition-submissions
-   hostel-images

------------------------------------------------------------------------

# Authentication

-   Supabase Auth
-   Session validation
-   Role resolution
-   RBAC
-   Row Level Security

------------------------------------------------------------------------

# Error Handling

-   Typed errors
-   Validation errors
-   Permission errors
-   Database errors
-   Friendly client responses
-   Structured logging

------------------------------------------------------------------------

# Logging & Auditing

Record privileged operations:

-   Role changes
-   Content moderation
-   Certificate issuance
-   Contribution approval
-   System configuration

------------------------------------------------------------------------

# Security

-   HTTPS
-   Server-side authorization
-   Input sanitization
-   Rate limiting
-   Secret management
-   Environment isolation

------------------------------------------------------------------------

# Folder Structure

``` text
src/
  app/actions/
  app/api/
  lib/
    supabase/
    services/
    repositories/
    validation/
```

------------------------------------------------------------------------

# Future Expansion

-   Background jobs
-   Queue processing
-   Email service
-   Push notifications
-   AI services
-   Analytics pipeline

------------------------------------------------------------------------

# Related Documents

-   01-Architecture.md
-   07-Authentication.md
-   08-Permissions.md
-   09-API-Specification.md
-   12-Security.md

© Ravenshaw Moments
