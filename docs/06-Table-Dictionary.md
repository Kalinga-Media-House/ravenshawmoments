# 06 - Table Dictionary

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Database Table Dictionary

------------------------------------------------------------------------

# Purpose

This document describes every major database table used by Ravenshaw
Moments, its purpose, primary relationships, and key business rules. It
serves as the authoritative reference for developers, database
administrators, and AI coding assistants.

------------------------------------------------------------------------

# Identity Domain

## roles

Purpose: Stores platform roles used for Role-Based Access Control
(RBAC).

Primary Key: - id

Related Tables: - users

------------------------------------------------------------------------

## users

Purpose: Stores authentication and account information.

Primary Key: - id

Related Tables: - roles - profiles

------------------------------------------------------------------------

## profiles

Purpose: Stores public and private profile information for students,
teachers, alumni, volunteers, and external participants.

Primary Key: - id

Related Tables: - users - departments - hostels - batches -
certificates - achievements - contributions

------------------------------------------------------------------------

# Academic Domain

## departments

Purpose: Stores Ravenshaw University departments.

------------------------------------------------------------------------

## batches

Purpose: Stores academic batches.

------------------------------------------------------------------------

## hostels

Purpose: Stores official university hostel information.

------------------------------------------------------------------------

## organizations

Purpose: Stores university organizations and clubs.

------------------------------------------------------------------------

## organization_members

Purpose: Maps users to organizations.

------------------------------------------------------------------------

# Events Domain

## events

Purpose: Stores university, department, hostel, and organization events.

------------------------------------------------------------------------

## event_registrations

Purpose: Stores event participation records.

------------------------------------------------------------------------

# Competition Domain

## competitions

Purpose: Stores competitions created by administrators.

------------------------------------------------------------------------

## competition_registrations

Purpose: Stores participant registrations.

------------------------------------------------------------------------

## competition_results

Purpose: Stores winners and rankings.

------------------------------------------------------------------------

# Certificate Domain

## certificate_templates

Purpose: Stores reusable certificate layouts.

------------------------------------------------------------------------

## certificates

Purpose: Stores issued certificates.

------------------------------------------------------------------------

## certificate_verifications

Purpose: Stores QR verification metadata.

------------------------------------------------------------------------

# Media Domain

## albums

Purpose: Stores logical media collections.

------------------------------------------------------------------------

## media

Purpose: Stores uploaded images, videos, and related metadata.

------------------------------------------------------------------------

# Contribution Domain

## contributions

Purpose: Stores contribution records.

------------------------------------------------------------------------

## contribution_receipts

Purpose: Stores payment verification details.

------------------------------------------------------------------------

## contributor_badges

Purpose: Stores supporter badge assignments.

------------------------------------------------------------------------

## gratitude_wall

Purpose: Stores publicly recognized contributors.

------------------------------------------------------------------------

# Housing Hub

## private_hostels

Purpose: Stores private hostel listings.

------------------------------------------------------------------------

## hostel_photos

Purpose: Stores hostel images.

------------------------------------------------------------------------

## hostel_facilities

Purpose: Stores available facilities.

------------------------------------------------------------------------

## hostel_inquiries

Purpose: Stores student inquiries.

------------------------------------------------------------------------

## hostel_sponsorships

Purpose: Stores sponsored listing information.

------------------------------------------------------------------------

# Administration

## notifications

Purpose: Stores in-app notifications.

------------------------------------------------------------------------

## audit_logs

Purpose: Stores important administrative actions.

------------------------------------------------------------------------

## moderation_reports

Purpose: Stores user reports for moderation.

------------------------------------------------------------------------

## system_settings

Purpose: Stores configurable platform settings.

------------------------------------------------------------------------

# Standard Columns

Recommended for business tables:

-   id
-   created_at
-   updated_at
-   created_by
-   updated_by
-   is_active

Optional:

-   deleted_at
-   deleted_by

------------------------------------------------------------------------

# Naming Rules

Tables: - plural_snake_case

Columns: - snake_case

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

# Related Documents

-   04-Database-Blueprint.md
-   05-ER-Diagram.md
-   09-API-Specification.md

© Ravenshaw Moments
