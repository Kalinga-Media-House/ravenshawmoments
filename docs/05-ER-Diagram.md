# 05 - ER Diagram

**Project:** Ravenshaw Moments\
**Version:** 2.0 (Legacy)\
**Status:** 🔒 Frozen\
**Document Type:** Entity Relationship Diagram (ERD)

------------------------------------------------------------------------

# Purpose

This document defines the logical relationships between all major
entities in the Ravenshaw Moments database. It serves as the master
reference for database design and future schema evolution.

------------------------------------------------------------------------

# Core Entity Groups

## Identity

-   roles
-   users
-   profiles

Relationship:

roles (1) ────────\< users

users (1) ──────── (1) profiles

------------------------------------------------------------------------

## Academic Structure

departments (1) ────────\< profiles

batches (1) ────────\< profiles

hostels (1) ────────\< profiles

organizations (1) ────────\< organization_members

profiles (1) ────────\< organization_members

------------------------------------------------------------------------

## Events & Competitions

events (1) ────────\< event_registrations

profiles (1) ────────\< event_registrations

competitions (1) ────────\< competition_registrations

profiles (1) ────────\< competition_registrations

competitions (1) ────────\< competition_results

profiles (1) ────────\< competition_results

------------------------------------------------------------------------

## Certificates

profiles (1) ────────\< certificates

certificate_templates (1) ────────\< certificates

certificates (1) ──────── (1) certificate_verifications

------------------------------------------------------------------------

## Media

profiles (1) ────────\< media

albums (1) ────────\< media

events (1) ────────\< media

departments (1) ────────\< media

hostels (1) ────────\< media

organizations (1) ────────\< media

------------------------------------------------------------------------

## Contributions

profiles (1) ────────\< contributions

contributions (1) ──────── (1) contribution_receipts

profiles (1) ────────\< contributor_badges

profiles (1) ────────\< gratitude_wall

------------------------------------------------------------------------

## Housing Hub

private_hostels (1) ────────\< hostel_photos

private_hostels (1) ────────\< hostel_facilities

private_hostels (1) ────────\< hostel_inquiries

private_hostels (1) ────────\< hostel_sponsorships

------------------------------------------------------------------------

## Administration

profiles (1) ────────\< notifications

profiles (1) ────────\< audit_logs

profiles (1) ────────\< moderation_reports

------------------------------------------------------------------------

# Cardinality Rules

-   One User has one Profile.
-   One Department has many Profiles.
-   One Hostel has many Members.
-   One Competition has many Registrations.
-   One User may own many Certificates.
-   One User may upload many Media items.
-   One Private Hostel may have many Photos and Facilities.
-   One Contribution produces one Receipt after verification.

------------------------------------------------------------------------

# ERD Principles

-   UUID primary keys
-   Foreign-key integrity
-   Normalized schema
-   Row Level Security on protected tables
-   Soft deletes where appropriate
-   Audit timestamps on business entities

------------------------------------------------------------------------

# Related Documents

-   04-Database-Blueprint.md
-   06-Table-Dictionary.md
-   09-API-Specification.md

© Ravenshaw Moments
