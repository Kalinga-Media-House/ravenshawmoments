# 30 - Decisions

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Architectural Decision Record (ADR)

------------------------------------------------------------------------

# Purpose

This document records the major architectural, technical, operational,
legal, and product decisions that are officially frozen for Version 2.0.
These decisions act as the single source of truth for future
development.

------------------------------------------------------------------------

# Decision Principles

-   Documentation before implementation
-   Security before convenience
-   Privacy by default
-   Scalability by design
-   Backward compatibility where practical
-   Community-first experience

------------------------------------------------------------------------

# Technology Decisions

## ADR-001

**Framework:** Next.js 16 (App Router)

Reason: - Server Components - Server Actions - Long-term ecosystem
support

Status: Accepted

------------------------------------------------------------------------

## ADR-002

**Frontend**

-   React 19
-   TypeScript
-   Tailwind CSS v4
-   Shadcn UI

Status: Accepted

------------------------------------------------------------------------

## ADR-003

**Backend**

-   Next.js Server Actions
-   Route Handlers

Status: Accepted

------------------------------------------------------------------------

## ADR-004

**Database**

-   Supabase PostgreSQL
-   UUID Primary Keys
-   Row Level Security

Status: Accepted

------------------------------------------------------------------------

## ADR-005

**Authentication**

-   Supabase Auth
-   Email + Password
-   Google Sign-In
-   Email Verification

Status: Accepted

------------------------------------------------------------------------

# Product Decisions

## Profiles

-   Public profile by default with privacy controls
-   Profile claim supported
-   Student, Teacher, Alumni, Volunteer, Contributor, Sponsor and
    External profiles
-   QR profile sharing

------------------------------------------------------------------------

## Certificates

Participation Certificate

-   Auto-generated
-   Private
-   Visible only to owner
-   Downloadable PDF

Winner Certificate

-   Generated after approval
-   Public profile
-   Public verification page
-   QR verification

------------------------------------------------------------------------

## Contributions

-   Dedicated Contribution page
-   Screenshot upload workflow
-   Admin verification
-   Wall of Gratitude
-   Top Contributors of the Month
-   Appreciation certificates

------------------------------------------------------------------------

## Housing Hub

-   Official hostel pages
-   "Private Hostels Near Me"
-   Sponsored listings
-   Admin approval required

------------------------------------------------------------------------

## Competitions

-   Ravenshaw & External participants
-   Paid and free events
-   QR attendance
-   Automated certificate generation

------------------------------------------------------------------------

## Administration

-   Super Admin
-   Moderator
-   Department CR
-   Hostel BMC
-   Organization Admin

Role history is permanently preserved.

------------------------------------------------------------------------

# Legal Decisions

Platform includes:

-   Privacy Policy
-   Terms & Conditions
-   Cookie Policy
-   Disclaimer
-   Community Guidelines
-   Copyright & DMCA
-   Refund Policy
-   Data Retention
-   Security Policy

The platform clearly states it is **not the official Ravenshaw
University website** and links users to the official university website
for authoritative information.

------------------------------------------------------------------------

# Security Decisions

-   RBAC
-   RLS
-   HTTPS
-   Audit Logs
-   Server-side authorization
-   Private storage for sensitive files

------------------------------------------------------------------------

# Future Reserved Decisions

Reserved for Version 3.x:

-   Mobile Apps
-   AI Assistant
-   Placement Portal
-   Alumni Mentorship
-   Blockchain certificate verification
-   Multi-university support

------------------------------------------------------------------------

# Change Management

All future architectural changes must:

1.  Be documented.
2.  Receive approval.
3.  Update related documents.
4.  Preserve backward compatibility where feasible.

------------------------------------------------------------------------

# Related Documents

-   01-Architecture.md
-   12-Security.md
-   28-Development-Roadmap.md
-   README.md

© Ravenshaw Moments
