# 01 - Architecture

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** System Architecture

------------------------------------------------------------------------

# Purpose

This document defines the official technical architecture of Ravenshaw
Moments. All implementations must conform to this architecture unless a
future major version explicitly revises it.

------------------------------------------------------------------------

# Architectural Principles

-   Documentation First
-   Modular Design
-   Security First
-   Privacy by Default
-   Scalability
-   Maintainability
-   Reusability
-   API First
-   Accessibility

------------------------------------------------------------------------

# High-Level Architecture

``` text
Users
   │
Next.js 16 (App Router)
   │
Server Actions / Route Handlers
   │
Supabase Auth
   │
PostgreSQL + Row Level Security
   │
Supabase Storage
```

------------------------------------------------------------------------

# Technology Stack

## Frontend

-   Next.js 16
-   React 19
-   TypeScript
-   Tailwind CSS v4
-   Shadcn UI
-   Lucide Icons

## Backend

-   Next.js Server Actions
-   Route Handlers
-   Supabase

## Database

-   PostgreSQL
-   UUID Primary Keys
-   Foreign Keys
-   Indexes
-   Row Level Security

## Storage

-   Supabase Storage
-   Images
-   Certificates
-   Documents

------------------------------------------------------------------------

# Major Modules

1.  Authentication
2.  Profile System
3.  Departments
4.  Hostels
5.  Housing Hub
6.  Organizations
7.  Events
8.  Competitions
9.  Certificates
10. Gallery
11. Achievements
12. Contributions
13. Heritage Archive
14. Admin
15. Notifications
16. Search
17. Legal & Compliance

------------------------------------------------------------------------

# Authentication Flow

User

↓

Supabase Authentication

↓

Role Resolution

↓

Permission Validation

↓

Application Access

------------------------------------------------------------------------

# Authorization

Role-Based Access Control (RBAC)

Roles include:

-   Super Admin
-   Department CR
-   Hostel BMC
-   Organization Admin
-   Moderator
-   Student
-   Teacher
-   Alumni
-   External Participant

------------------------------------------------------------------------

# Database Architecture

Core principles:

-   Normalized schema
-   UUID identifiers
-   Soft deletes where appropriate
-   Audit timestamps
-   Foreign-key integrity
-   RLS on all protected tables

------------------------------------------------------------------------

# Storage Architecture

Buckets:

-   profile-images
-   gallery
-   certificates
-   competition-submissions
-   hostel-images
-   department-assets
-   organization-assets
-   contribution-proofs

------------------------------------------------------------------------

# API Architecture

-   REST-style Route Handlers
-   Server Actions
-   Consistent response format
-   Input validation
-   Authorization checks
-   Audit logging

------------------------------------------------------------------------

# Security Architecture

-   HTTPS
-   Supabase Auth
-   Row Level Security
-   Secure Storage
-   Rate Limiting
-   Role Permissions
-   Server-side Validation
-   Input Sanitization

------------------------------------------------------------------------

# Folder Structure

``` text
src/
  app/
  components/
  lib/
  hooks/
  providers/
  styles/

docs/
supabase/
public/
```

------------------------------------------------------------------------

# Deployment

Development

↓

GitHub

↓

Vercel

↓

Supabase

Production assets served via CDN where applicable.

------------------------------------------------------------------------

# Scalability

Designed for:

-   100 users
-   1,000 users
-   10,000 users
-   100,000+ users

Future-ready for caching, queues, and microservices.

------------------------------------------------------------------------

# Disaster Recovery

-   Database Backups
-   Storage Backups
-   Audit Logs
-   Rollback Strategy
-   Environment Variable Management

------------------------------------------------------------------------

# Related Documents

-   00-Project-Constitution.md
-   00-Project-Overview.md
-   04-Database-Blueprint.md
-   07-Authentication.md
-   08-Permissions.md
-   12-Security.md

© Ravenshaw Moments
