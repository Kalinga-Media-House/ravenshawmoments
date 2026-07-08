# 13 - Storage

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Storage Architecture

------------------------------------------------------------------------

# Purpose

This document defines the official file storage architecture, bucket
organization, access policies, lifecycle management, and security
requirements for Ravenshaw Moments.

------------------------------------------------------------------------

# Storage Platform

-   Supabase Storage
-   PostgreSQL metadata
-   CDN delivery (future)
-   Secure object storage

------------------------------------------------------------------------

# Storage Principles

-   Security by default
-   Private unless explicitly public
-   Least-privilege access
-   Organized bucket structure
-   Version-ready architecture

------------------------------------------------------------------------

# Storage Buckets

## Public Buckets

-   gallery
-   department-assets
-   organization-assets
-   hostel-images
-   public-achievements
-   winner-certificates

## Private Buckets

-   profile-images (restricted updates)
-   certificates
-   contribution-proofs
-   competition-submissions
-   verification-documents
-   admin-documents

------------------------------------------------------------------------

# File Organization

``` text
bucket/
  year/
    month/
      entity-id/
        filename.ext
```

Example:

``` text
gallery/
  2026/
    07/
      event-uuid/
        image-001.webp
```

------------------------------------------------------------------------

# Supported File Types

Images

-   JPG
-   JPEG
-   PNG
-   WEBP

Documents

-   PDF

Videos (future)

-   MP4

Executable files are never permitted.

------------------------------------------------------------------------

# Upload Validation

Every upload must validate:

-   Authentication
-   Authorization
-   MIME type
-   File extension
-   File size
-   Ownership
-   Bucket policy

------------------------------------------------------------------------

# Access Policies

Public Resources

-   Gallery
-   Public winner certificates
-   Public hostel images
-   Public department assets

Private Resources

-   Participation certificates
-   Payment proofs
-   Competition submissions
-   Verification documents

------------------------------------------------------------------------

# Image Optimization

-   WebP preferred
-   Responsive image delivery
-   Compression before upload where practical
-   Thumbnail generation (future)

------------------------------------------------------------------------

# Certificate Storage

Participation Certificates

-   Private
-   Downloadable by owner only

Winner Certificates

-   Public profile
-   Public verification page
-   Downloadable

------------------------------------------------------------------------

# Media Lifecycle

Upload

↓

Validation

↓

Storage

↓

Metadata creation

↓

Public/Private access

↓

Archive or deletion according to policy

------------------------------------------------------------------------

# Backup Strategy

-   Managed database backups
-   Storage redundancy
-   Disaster recovery planning
-   Regular integrity checks

------------------------------------------------------------------------

# Storage Security

-   Signed URLs where required
-   Bucket-level policies
-   RLS-backed ownership checks
-   Audit logging
-   Virus scanning (future)

------------------------------------------------------------------------

# Future Enhancements

-   CDN integration
-   AI image tagging
-   Duplicate detection
-   Automatic optimization
-   Cold archive storage

------------------------------------------------------------------------

# Related Documents

-   04-Database-Blueprint.md
-   12-Security.md
-   18-Media-System.md
-   44-Certificate-Policy.md
-   45-Data-Retention.md

© Ravenshaw Moments
