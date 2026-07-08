# 03 - User Roles

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** User Roles & Access Model

------------------------------------------------------------------------

# Purpose

This document defines every user role supported by Ravenshaw Moments
Version 2.0, including responsibilities, permissions, and access
boundaries.

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
12. Guest (Public Visitor)

------------------------------------------------------------------------

# Role Descriptions

## Super Admin

Full platform control.

### Responsibilities

-   Manage users and roles
-   Manage departments, hostels, organizations
-   Verify contributors
-   Approve certificates
-   Manage competitions and events
-   Moderate all public content
-   View audit logs
-   Configure platform settings

------------------------------------------------------------------------

## Moderator

Responsible for maintaining community quality.

Permissions: - Review reports - Hide inappropriate content - Approve or
reject submissions - Escalate serious issues to Super Admin

------------------------------------------------------------------------

## Department CR

Manages a department community.

Permissions: - Post notices - Publish department events - Upload gallery
photos - Manage department members (within policy) - Create teacher
profiles (where authorized)

------------------------------------------------------------------------

## Hostel BMC

Manages a university hostel page.

Permissions: - Publish hostel notices - Upload hostel events - Manage
hostel gallery - Highlight hostel achievements

------------------------------------------------------------------------

## Organization Admin

Manages an approved student organization.

Permissions: - Publish organization activities - Manage members - Upload
media - Publish achievements

------------------------------------------------------------------------

## Volunteer

Supports approved events.

Permissions: - View assigned activities - Receive volunteer
certificates - Update volunteer tasks (where assigned)

------------------------------------------------------------------------

## Teacher

Permissions: - Maintain profile - Participate in events - Receive
certificates - View private dashboard

------------------------------------------------------------------------

## Student

Permissions: - Create or claim profile - Participate in competitions -
Upload gallery photos - View participation certificates - Download
certificates - Contribute to the platform

------------------------------------------------------------------------

## Alumni

Permissions: - Maintain alumni profile - Share memories - Contribute -
Participate in alumni activities

------------------------------------------------------------------------

## External Participant

Permissions: - Register for eligible competitions - Maintain limited
profile - Download participation certificates - Receive winner
certificates if applicable

------------------------------------------------------------------------

## Contributor / Sponsor

Permissions: - Submit contributions - Upload payment proof - Receive
appreciation certificates - Appear on Wall of Gratitude (if approved and
consented)

------------------------------------------------------------------------

## Guest

Permissions: - Browse public pages - Search public content - View public
achievements - View public winner certificates

------------------------------------------------------------------------

# Permission Principles

-   Least Privilege
-   Role-Based Access Control (RBAC)
-   Row Level Security (RLS)
-   Server-side authorization
-   Audit logging for privileged actions

------------------------------------------------------------------------

# Related Documents

-   07-Authentication.md
-   08-Permissions.md
-   19-Profile-System.md
-   25-Admin-System.md
-   26-Super-Admin.md
-   27-Moderation.md

© Ravenshaw Moments
