# 22 - Organizations

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Organization Management Specification

------------------------------------------------------------------------

# Purpose

This document defines the official framework for student organizations,
societies, clubs, and university bodies within Ravenshaw Moments.

------------------------------------------------------------------------

# Objectives

-   Digitally preserve organization history.
-   Showcase activities and achievements.
-   Improve communication with members.
-   Archive events, publications, and leadership.
-   Build a permanent institutional memory.

------------------------------------------------------------------------

# Supported Organizations

Examples include:

-   NCC
-   NSS
-   Youth Red Cross (YRC)
-   Rotaract Club
-   Entrepreneurship Cell
-   Literary Society
-   Debate Club
-   Photography Club
-   Music Club
-   Drama Society
-   Dance Club
-   Coding Club
-   Eco Club
-   Placement Cell
-   Any organization approved by Super Admin

------------------------------------------------------------------------

# Organization Homepage

Each organization page includes:

-   Banner Image
-   Logo
-   About
-   Vision & Mission
-   Faculty Advisor
-   Student Leadership
-   Member Directory
-   Events
-   Gallery
-   Notices
-   Achievements
-   Publications
-   Annual Reports
-   Contact Details

------------------------------------------------------------------------

# Administration

Managed by:

-   Organization Admin
-   Faculty Advisor
-   Super Admin

Organization Admin can:

-   Publish notices
-   Create events
-   Upload media
-   Manage members
-   Publish achievements
-   Update organization profile

------------------------------------------------------------------------

# Membership

Members may be:

-   Active
-   Executive
-   Office Bearer
-   Alumni Member
-   Honorary Member

Each member record stores:

-   Profile ID
-   Role (member, executive, office_bearer, alumni)
-   Status (active, inactive)
-   Join Date
-   Leave Date
-   Designation (if applicable)

Business Rules:

1. One President/Secretary per term.
2. Active status applies to current students only.

------------------------------------------------------------------------

# Implementation Architecture (Milestone Completed)

The Organization module is built directly on the **Universal Shared Platform Layer**, leveraging:
- `Shared Events`
- `Shared Gallery`
- `Shared Notices`
- `Shared Media`
- `Shared Publications`
- `Shared Achievements`

## Tech Stack
- Next.js 16 App Router
- Supabase (PostgreSQL, Row Level Security, Storage)
- Tailwind CSS
- Zod Validation

## Security Policies
- Strict Row Level Security isolates Organizations.
- `is_organization_admin` PG function enforces RBAC.
- Unauthenticated writes are explicitly blocked.

*Note: Organization Ecosystem implementation is fully tested, built, and production-ready.*
