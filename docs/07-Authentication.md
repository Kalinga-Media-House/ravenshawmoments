# 07 - Authentication

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Authentication Specification

------------------------------------------------------------------------

# Purpose

This document defines the official authentication and account lifecycle
for Ravenshaw Moments.

------------------------------------------------------------------------

# Authentication Provider

-   Supabase Authentication
-   Email & Password
-   Google Sign-In
-   Secure Sessions
-   Email Verification
-   Password Reset

------------------------------------------------------------------------

# Account Types

-   Student
-   Teacher
-   Alumni
-   External Participant
-   Volunteer
-   Contributor
-   Sponsor
-   Administrator

------------------------------------------------------------------------

# Authentication Flow

1.  User selects sign in method.
2.  Credentials are validated by Supabase Auth.
3.  Email verification is checked (where required).
4.  User profile is loaded.
5.  Role is resolved.
6.  Permissions are applied.
7.  Session is established.

------------------------------------------------------------------------

# Registration

Supported methods:

-   Email registration
-   Google registration

Required information:

-   Full Name
-   Email Address
-   User Type

Additional profile information is collected after successful
authentication.

------------------------------------------------------------------------

# Profile Claim

Existing Ravenshaw users may claim an existing profile using approved
identifiers such as roll number and verification workflow.

------------------------------------------------------------------------

# Session Management

-   Secure HTTP-only session cookies
-   Automatic refresh
-   Sign out from all devices (future)
-   Session expiration handling

------------------------------------------------------------------------

# Password Policy

-   Minimum length requirement
-   Strong password recommendation
-   Password reset by verified email
-   Passwords are never stored by the application

------------------------------------------------------------------------

# Email Verification

Required for:

-   Email registration
-   Password reset
-   Email change

------------------------------------------------------------------------

# Role Resolution

Roles are assigned after authentication and determine application
access.

Supported roles:

-   Super Admin
-   Moderator
-   Department CR
-   Hostel BMC
-   Organization Admin
-   Student
-   Teacher
-   Alumni
-   Volunteer
-   External Participant

------------------------------------------------------------------------

# Authorization Principles

-   Role-Based Access Control (RBAC)
-   Row Level Security (RLS)
-   Server-side permission checks
-   Least privilege

------------------------------------------------------------------------

# Security Controls

-   HTTPS
-   CSRF protection through framework defaults
-   Server-side validation
-   Rate limiting
-   Audit logging
-   Secure session handling

------------------------------------------------------------------------

# Account Lifecycle

Registration

↓

Verification

↓

Profile Completion

↓

Active Use

↓

Optional Deactivation

↓

Deletion / Archival according to data retention policy

------------------------------------------------------------------------

# Related Documents

-   03-User-Roles.md
-   08-Permissions.md
-   12-Security.md
-   19-Profile-System.md

© Ravenshaw Moments
