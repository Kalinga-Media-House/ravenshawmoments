# 19 - Profile System

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Profile System Specification

------------------------------------------------------------------------

# Purpose

This document defines the official profile ecosystem for Ravenshaw
Moments, including profile creation, verification, privacy,
achievements, certificates, galleries, and role history.

------------------------------------------------------------------------

# Objectives

-   Build a lifelong digital identity.
-   Preserve achievements and memories.
-   Respect user privacy.
-   Connect the Ravenshaw community.
-   Support profile verification.

------------------------------------------------------------------------

# Supported Profile Types

-   Student
-   Teacher
-   Alumni
-   External Participant
-   Volunteer
-   Contributor
-   Sponsor

------------------------------------------------------------------------

# Profile Creation

Profiles may be:

-   Self-registered
-   Claimed from existing university records
-   Created by authorized CR/BMC/Admin
-   Imported (future)

------------------------------------------------------------------------

# Profile Claim

Existing Ravenshaw students may claim their profile using approved
identifiers (e.g. roll number) followed by verification.

------------------------------------------------------------------------

# Profile Sections

## Basic Information

-   Name
-   Profile Photo
-   User Type
-   Department
-   Batch
-   Hostel (optional)

## About

-   Biography
-   Interests
-   Skills

## Academic

-   Course
-   Department
-   Batch
-   Roll Number (private)

## Timeline

-   Events
-   Competitions
-   Leadership
-   Achievements
-   Contributions

## Gallery

-   Personal photos
-   Default limit: 50 images

## Certificates

-   Participation (private)
-   Winner (public)
-   Volunteer
-   Appreciation

## Achievements

-   Academic
-   Sports
-   Cultural
-   Leadership
-   Community Service

## Contributions

-   Contribution history
-   Badges
-   Wall of Gratitude status

------------------------------------------------------------------------

# Privacy Model

## Public

-   Name
-   Photo (optional)
-   Department
-   Batch
-   Public achievements
-   Winner certificates
-   Public contributions (if consented)

## Private

-   Email
-   Phone
-   Roll Number
-   Date of Birth
-   Participation certificates
-   Payment details

------------------------------------------------------------------------

# Verification

Profiles may be:

-   Unverified
-   Verified
-   Official

Verification is managed by authorized administrators.

------------------------------------------------------------------------

# Role History

Maintain historical records for: - Department CR - Hostel BMC -
Organization Admin - Volunteer

Each role stores: - Start Date - End Date - Status

------------------------------------------------------------------------

# Search

Public profiles are searchable according to privacy settings.

Private information never appears in search.

------------------------------------------------------------------------

# QR Profile

Each public profile may have: - Unique profile URL - QR code - Share
option

------------------------------------------------------------------------

# Security

-   Ownership checks
-   Server-side authorization
-   RBAC + RLS
-   Audit logging

------------------------------------------------------------------------

# Future Enhancements

-   Resume Builder
-   Portfolio
-   Social verification
-   AI profile summary
-   Digital ID Card

------------------------------------------------------------------------

# Related Documents

-   03-User-Roles.md
-   07-Authentication.md
-   15-Search.md
-   18-Media-System.md
-   24-Achievements.md
-   44-Certificate-Policy.md

© Ravenshaw Moments
