# 08 - Permissions

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Permission Matrix & Authorization Rules

------------------------------------------------------------------------

# Purpose

This document defines the authorization model for Ravenshaw Moments. It
specifies what each role is permitted to view, create, update, delete,
approve, and moderate across the platform.

------------------------------------------------------------------------

# Authorization Model

Ravenshaw Moments uses:

-   Role-Based Access Control (RBAC)
-   Row Level Security (RLS)
-   Server-side authorization
-   Least-Privilege Principle

------------------------------------------------------------------------

# Role Hierarchy

1.  Super Admin
2.  Moderator
3.  Department CR
4.  Hostel BMC
5.  Organization Admin
6.  Volunteer
7.  Teacher
8.  Student
9.  Alumni
10. External Participant
11. Contributor / Sponsor
12. Guest

------------------------------------------------------------------------

# Permission Matrix

## Super Admin

Full platform access.

Can:

-   Manage all users
-   Assign roles
-   Manage departments
-   Manage hostels
-   Manage organizations
-   Create competitions
-   Approve certificates
-   Verify contributions
-   Moderate all content
-   Access audit logs
-   Configure system settings

------------------------------------------------------------------------

## Moderator

Can:

-   Review reports
-   Hide inappropriate content
-   Approve or reject media
-   Escalate issues
-   Moderate comments (future)

Cannot:

-   Change system settings
-   Assign administrator roles

------------------------------------------------------------------------

## Department CR

Can:

-   Manage department page
-   Publish notices
-   Publish events
-   Upload department media
-   Manage department gallery

Cannot:

-   Access other departments
-   Change system settings

------------------------------------------------------------------------

## Hostel BMC

Can:

-   Publish hostel notices
-   Manage hostel gallery
-   Publish hostel events
-   Highlight achievements

Cannot:

-   Edit other hostels

------------------------------------------------------------------------

## Organization Admin

Can:

-   Manage organization profile
-   Publish events
-   Upload media
-   Manage organization members (subject to policy)

------------------------------------------------------------------------

## Volunteer

Can:

-   View assigned work
-   Update assigned activities
-   Download volunteer certificates

------------------------------------------------------------------------

## Teacher

Can:

-   Manage personal profile
-   Participate in events
-   View personal certificates

------------------------------------------------------------------------

## Student

Can:

-   Create or claim profile
-   Register for competitions
-   Upload gallery media
-   View private participation certificates
-   Download own certificates
-   Submit contributions

------------------------------------------------------------------------

## Alumni

Can:

-   Maintain profile
-   Share memories
-   Contribute
-   Join alumni activities

------------------------------------------------------------------------

## External Participant

Can:

-   Register for eligible competitions
-   Maintain limited profile
-   View own certificates

------------------------------------------------------------------------

## Contributor / Sponsor

Can:

-   Submit contributions
-   Upload payment proof
-   Receive appreciation certificates
-   Opt into public recognition

------------------------------------------------------------------------

## Guest

Can:

-   Browse public pages
-   Search public content
-   View public achievements
-   View public winner certificates

------------------------------------------------------------------------

# CRUD Principles

Every feature follows:

-   Create
-   Read
-   Update
-   Delete

Permissions are evaluated using role and ownership.

------------------------------------------------------------------------

# Ownership Rules

Users may modify only their own data unless granted administrative
permissions.

Department, hostel, and organization administrators may manage only
resources assigned to them.

------------------------------------------------------------------------

# Administrative Actions

All privileged operations are:

-   Logged
-   Auditable
-   Server-side validated

------------------------------------------------------------------------

# Security

Permission checks must never rely solely on client-side logic.

Authorization is enforced on the server and backed by Row Level Security
(RLS).

------------------------------------------------------------------------

# Related Documents

-   03-User-Roles.md
-   07-Authentication.md
-   12-Security.md
-   25-Admin-System.md
-   26-Super-Admin.md

© Ravenshaw Moments
