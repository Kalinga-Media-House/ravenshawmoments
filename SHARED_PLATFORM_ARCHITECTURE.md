# Ravenshaw Moments — Shared Platform Layer Architecture

**Project:** Ravenshaw Moments — Shared Platform Layer Architecture Extraction  
**Version:** 1.0 (Enterprise Shared Platform Standard)  
**Status:** ✅ Extracted, Verified & Zero-Regression Ready  
**Date:** 2026-07-08  

---

## 1. Executive Summary & Architectural Goal

Following the successful enterprise implementation of the **Universal Profile Module** and **Universal Department Ecosystem**, an **Architecture Extraction** was conducted to establish a unified **Shared Platform Layer** (`src/features/shared/`).

This extraction isolates all reusable domain logic, multi-tenant models, pagination engines, media storage rules, lifecycle status calculators, and sorting algorithms across both modules into **8 autonomous shared feature modules**.

**Strict Architectural Invariant Enforced:** Zero behavioral changes or breaking regressions were introduced to existing modules. All 15 enterprise test suites passed 100% cleanly alongside zero TypeScript compilation errors.

---

## 2. Shared Platform Directory Architecture

```
src/features/shared/
├── index.ts                # Unified Barrel Export (@/features/shared)
├── events/
│   └── index.ts            # Shared Event Lifecycle, Scheduling & Category taxonomy
├── gallery/
│   └── index.ts            # Shared Multi-Tenant Gallery Items, Albums & Sorting logic
├── notices/
│   └── index.ts            # Shared Circulars, Priority tags, Expiration & Pinning engines
├── publications/
│   └── index.ts            # Shared Magazine/Journal categories & Download normalization
├── achievements/
│   └── index.ts            # Shared Award levels, Certificate metadata & Date validation
├── media/
│   └── index.ts            # Shared Universal MIME rules, Size limits & Storage paths
├── search/
│   └── index.ts            # Shared Pagination metadata, OFFSET/LIMIT calculators & Sorting
└── notifications/
    └── index.ts            # Shared Notification payloads, Channels & Priority contracts
```

---

## 3. Extracted Shared Feature Modules Specification

### 3.1 `Events` (`src/features/shared/events`)
- **Extracted Logic:** Event scheduling lifecycle, category taxonomy (`seminar`, `workshop`, `conference`, `festival`, `guest_lecture`), and chronological validation (`isValidEventTimeRange`, `getEventTimeStatus`).
- **Reuse Scope:** Shared across Department academic symposiums/workshops and future campus-wide/alumni events.

### 3.2 `Gallery` (`src/features/shared/gallery`)
- **Extracted Logic:** Multi-tenant gallery items (`SharedGalleryItem`), album grouping (`SharedAlbum`), and deterministic ordering (`sortGalleryItems` by display order ascending, then creation time descending).
- **Reuse Scope:** Shared across Individual Profile Galleries and Department Showcase Galleries.

### 3.3 `Notices` (`src/features/shared/notices`)
- **Extracted Logic:** Circular priority taxonomy (`low`, `normal`, `high`, `critical`), audience targeting (`all`, `students`, `faculty`, `alumni`), automated expiry evaluation (`isNoticeExpired`), and pinned-first ordering (`sortNotices`).
- **Reuse Scope:** Shared across Department Noticeboards and future University-wide Circular systems.

### 3.4 `Publications` (`src/features/shared/publications`)
- **Extracted Logic:** Academic publication taxonomy (`annual_magazine`, `research_journal`, `proceedings`), download tracking normalization (`normalizeDownloadCount`), and syllabus archives.
- **Reuse Scope:** Shared across Department Annual Magazines, faculty research papers, and student journals.

### 3.5 `Achievements` (`src/features/shared/achievements`)
- **Extracted Logic:** Recognition level taxonomy (`international`, `national`, `state`, `university`, `department`), certificate attachment models, and historical date verification (`isValidAchievementDate`).
- **Reuse Scope:** Shared across Student Profile Achievements and Departmental Accreditation Awards.

### 3.6 `Media` (`src/features/shared/media`)
- **Extracted Logic:** Universal media limits (`MAX_IMAGE_BYTES: 5MB`, `MAX_DOCUMENT_BYTES: 25MB`), MIME whitelist validators (`isAllowedImageType`, `isAllowedDocumentType`), and multi-tenant storage path builder (`generatePlatformStoragePath`).
- **Reuse Scope:** Universal media upload handler across Profile avatars, Department banners, and document attachments.

### 3.7 `Search` (`src/features/shared/search`)
- **Extracted Logic:** Standardized pagination metadata (`SharedPaginatedResult<T>`), 1-indexed pagination range calculator (`calculateRange` returning `{ from, to }`), and paginated response builder (`buildPaginatedResult`).
- **Reuse Scope:** Universal query pagination across all listings (Departments, Teachers, Students, Notices, Events).

### 3.8 `Notifications` (`src/features/shared/notifications`)
- **Extracted Logic:** Multi-channel notification model (`SharedNotificationPayload`), delivery channels (`in_app`, `email`, `push`), priority tags, and factory helper (`createNotificationPayload`).
- **Reuse Scope:** Universal notification dispatch across profile updates, CR approvals, and notice circulars.

---

## 4. Extraction Verification Matrix

| Verification Command | Scope | Result | Status |
| :--- | :--- | :--- | :---: |
| **`npm test`** | Complete Vitest enterprise suite (15 Test Files) | **15 / 15 Test Files Passed (100% Pass Rate)** | **PASSED** |
| **`npx eslint .`** | Codebase formatting & linting | **0 Errors across shared & existing modules** | **PASSED** |
| **`npx tsc --noEmit`** | Strict TypeScript compilation check | **0 Compilation Errors** | **PASSED** |

---

## 5. Integration Rules for Future Enterprise Modules

1. **Direct Shared Platform Import:** All future domain modules must import shared utilities, models, and validation rules directly from `@/features/shared`.
2. **No Duplication of Common Patterns:** Pagination calculations, file validation rules, event lifecycle checks, and notice sorting must rely exclusively on `src/features/shared/`.
3. **Behavioral Invariance:** Any enhancement to a shared platform module must remain backwards-compatible with existing Profile and Department modules.
