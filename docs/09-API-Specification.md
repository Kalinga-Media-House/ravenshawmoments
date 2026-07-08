# 09 - API Specification

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** API Specification

------------------------------------------------------------------------

# Purpose

This document defines the API standards, conventions, authentication
requirements, request and response formats, versioning strategy, and
security rules for Ravenshaw Moments.

------------------------------------------------------------------------

# API Principles

-   API First
-   REST-style endpoints
-   JSON request/response
-   Consistent error handling
-   Secure by default
-   Backward compatibility within major versions

------------------------------------------------------------------------

# Technology

-   Next.js Route Handlers
-   Next.js Server Actions
-   Supabase
-   PostgreSQL

------------------------------------------------------------------------

# Authentication

Protected endpoints require an authenticated session through Supabase
Auth.

Authorization is enforced using:

-   Role-Based Access Control (RBAC)
-   Row Level Security (RLS)
-   Server-side permission checks

------------------------------------------------------------------------

# API Versioning

Base path:

``` text
/api/v1/
```

Future breaking changes will use:

``` text
/api/v2/
```

------------------------------------------------------------------------

# Resource Groups

## Authentication

-   POST /api/v1/auth/login
-   POST /api/v1/auth/logout
-   POST /api/v1/auth/register
-   POST /api/v1/auth/reset-password

## Profiles

-   GET /api/v1/profiles
-   GET /api/v1/profiles/{id}
-   POST /api/v1/profiles
-   PATCH /api/v1/profiles/{id}

## Departments

-   GET /api/v1/departments
-   GET /api/v1/departments/{id}

## Hostels

-   GET /api/v1/hostels
-   GET /api/v1/private-hostels

## Organizations

-   GET /api/v1/organizations

## Events

-   GET /api/v1/events
-   POST /api/v1/events

## Competitions

-   GET /api/v1/competitions
-   POST /api/v1/competitions
-   POST /api/v1/competitions/{id}/register

## Certificates

-   GET /api/v1/certificates
-   GET /api/v1/certificates/{id}
-   GET /api/v1/certificates/verify/{certificateId}

## Contributions

-   POST /api/v1/contributions
-   POST /api/v1/contributions/upload-proof

## Media

-   POST /api/v1/media
-   GET /api/v1/media

## Notifications

-   GET /api/v1/notifications

------------------------------------------------------------------------

# Response Format

Success

``` json
{
  "success": true,
  "data": {}
}
```

Error

``` json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied."
  }
}
```

------------------------------------------------------------------------

# Status Codes

-   200 OK
-   201 Created
-   204 No Content
-   400 Bad Request
-   401 Unauthorized
-   403 Forbidden
-   404 Not Found
-   409 Conflict
-   422 Validation Error
-   429 Too Many Requests
-   500 Internal Server Error

------------------------------------------------------------------------

# Validation

-   Server-side validation required
-   Input sanitization
-   File type validation
-   Size limits
-   Rate limiting

------------------------------------------------------------------------

# Security

-   HTTPS only
-   Authenticated sessions
-   CSRF protection where applicable
-   Audit logging
-   No sensitive data in responses

------------------------------------------------------------------------

# Documentation Standards

Every endpoint should document:

-   Purpose
-   Authentication
-   Request body
-   Query parameters
-   Path parameters
-   Success response
-   Error responses
-   Permissions

------------------------------------------------------------------------

# Related Documents

-   01-Architecture.md
-   07-Authentication.md
-   08-Permissions.md
-   12-Security.md

© Ravenshaw Moments
