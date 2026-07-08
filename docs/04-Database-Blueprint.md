# 04 - Database Blueprint

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Database Blueprint

------------------------------------------------------------------------

# Purpose

This document defines the official database architecture for Ravenshaw
Moments. All schema changes, migrations, and future tables must follow
this blueprint.

------------------------------------------------------------------------

# Database Engine

-   PostgreSQL
-   Supabase Managed Database
-   UUID Primary Keys
-   Row Level Security (RLS)
-   Timestamp Auditing

------------------------------------------------------------------------

# Design Principles

-   Normalized schema
-   UUID v4 identifiers
-   Foreign-key integrity
-   Soft deletes where appropriate
-   Consistent naming conventions
-   Audit fields on business tables
-   Privacy-first data design

------------------------------------------------------------------------

# Core Domains

## Identity

-   roles
-   users
-   profiles

## Academic

-   departments
-   batches
-   courses
-   hostels
-   organizations

## Community

-   events
-   competitions
-   gallery_albums
-   media
-   announcements

## Recognition

-   achievements
-   certificates
-   certificate_templates
-   certificate_verifications

## Contributions

-   contributions
-   contribution_receipts
-   contributor_badges
-   gratitude_wall

## Housing Hub

-   private_hostels
-   hostel_photos
-   hostel_facilities
-   hostel_inquiries
-   hostel_sponsorships

## Administration

-   audit_logs
-   notifications
-   reports
-   moderation_reports
-   system_settings

------------------------------------------------------------------------

# Standard Columns

Every major table should include:

-   id (UUID)
-   created_at
-   updated_at
-   created_by
-   updated_by
-   is_active

Where applicable:

-   deleted_at
-   deleted_by

------------------------------------------------------------------------

# Naming Conventions

Tables: - plural_snake_case

Columns: - snake_case

Primary Keys: - id

Foreign Keys: -
```{=html}
<table>
```
\_id

Indexes: - idx\_
```{=html}
<table>
```
\_`<column>`{=html}

------------------------------------------------------------------------

# Relationships

-   One User → One Profile
-   One Department → Many Students
-   One Hostel → Many Students
-   One Competition → Many Registrations
-   One User → Many Certificates
-   One User → Many Contributions
-   One Event → Many Media Items

------------------------------------------------------------------------

# Storage Buckets

-   profile-images
-   gallery
-   certificates
-   contribution-proofs
-   competition-submissions
-   hostel-images
-   department-assets

------------------------------------------------------------------------

# Security

-   Row Level Security enabled
-   Role-Based Access Control
-   Server-side validation
-   Storage access policies
-   Audit logging

------------------------------------------------------------------------

# Migration Strategy

-   Sequential SQL migrations
-   No destructive changes without backup
-   Document every schema revision
-   Test migrations before production

------------------------------------------------------------------------

# Performance

-   Foreign key indexes
-   Composite indexes where needed
-   Pagination for large datasets
-   Query optimization
-   Connection pooling via Supabase

------------------------------------------------------------------------

# Future Reserved Tables

-   ai_search_index
-   mentorship
-   merchandise
-   mobile_devices
-   push_notifications
-   scholarships

------------------------------------------------------------------------

# Related Documents

-   01-Architecture.md
-   05-ER-Diagram.md
-   06-Table-Dictionary.md
-   09-API-Specification.md
-   12-Security.md

© Ravenshaw Moments
