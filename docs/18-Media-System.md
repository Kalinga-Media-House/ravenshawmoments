# 18 - Media System

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Media Management Specification

------------------------------------------------------------------------

# Purpose

This document defines the official media architecture for Ravenshaw
Moments, covering image and video management, galleries, albums,
moderation, storage, copyright, and long-term preservation.

------------------------------------------------------------------------

# Objectives

-   Preserve university memories.
-   Organize media by context.
-   Protect user privacy.
-   Ensure media authenticity.
-   Build a permanent digital archive.

------------------------------------------------------------------------

# Supported Media

## Images

-   JPG
-   JPEG
-   PNG
-   WEBP

## Videos

-   MP4
-   Embedded YouTube links

Future: - HEVC - AV1 - Live Streams

------------------------------------------------------------------------

# Media Sources

-   Student Uploads
-   Department Posts
-   Hostel Posts
-   Organization Posts
-   Event Galleries
-   Competition Galleries
-   Alumni Memories
-   Heritage Archive
-   Admin Uploads

------------------------------------------------------------------------

# Gallery Types

-   University Gallery
-   Department Gallery
-   Hostel Gallery
-   Organization Gallery
-   Event Gallery
-   Competition Gallery
-   Profile Gallery
-   Heritage Gallery
-   Featured Gallery

------------------------------------------------------------------------

# Album Structure

Albums include:

-   Title
-   Description
-   Cover Image
-   Owner
-   Category
-   Event Reference (optional)
-   Visibility
-   Created Date

------------------------------------------------------------------------

# Upload Workflow

User Upload

↓

Validation

↓

Moderation (if required)

↓

Storage

↓

Metadata Creation

↓

Gallery Publication

------------------------------------------------------------------------

# Metadata

Each media item stores:

-   Title
-   Caption
-   Tags
-   Upload Date
-   Uploaded By
-   Album
-   Related Department
-   Related Hostel
-   Related Event
-   Related Competition
-   Visibility

------------------------------------------------------------------------

# Visibility

Public: - Approved galleries - Event albums - Winner photos - Heritage
archive

Private: - User draft uploads - Restricted administrative media

------------------------------------------------------------------------

# Profile Gallery

Every registered Ravenshaw member may maintain a personal gallery.

Default limit: - Up to 50 photos (configurable)

Users control their own gallery.

------------------------------------------------------------------------

# Moderation

Moderators may:

-   Approve media
-   Reject media
-   Hide inappropriate content
-   Restore approved media
-   Review reports

------------------------------------------------------------------------

# Featured Media

Super Admin may feature:

-   Photo of the Day
-   Event Highlights
-   Historic Memories
-   Popular Albums
-   Campus Highlights

------------------------------------------------------------------------

# Copyright

Users retain ownership of their original uploads while granting
Ravenshaw Moments permission to display approved content according to
the Terms & Conditions.

Unauthorized copyrighted material may be removed following the Copyright
& DMCA Policy.

------------------------------------------------------------------------

# Storage

Media stored in Supabase Storage.

Suggested buckets:

-   gallery
-   profile-images
-   department-assets
-   hostel-images
-   organization-assets
-   heritage-archive

------------------------------------------------------------------------

# Security

-   File validation
-   Ownership checks
-   Bucket permissions
-   Audit logging
-   Server-side authorization

------------------------------------------------------------------------

# Future Enhancements

-   AI auto-tagging
-   Duplicate detection
-   Face grouping (opt-in)
-   EXIF preservation
-   AI image search
-   Automatic compression

------------------------------------------------------------------------

# Related Documents

-   13-Storage.md
-   17-Events.md
-   19-Profile-System.md
-   40-Content-Policy.md
-   41-Copyright-and-DMCA.md

© Ravenshaw Moments
