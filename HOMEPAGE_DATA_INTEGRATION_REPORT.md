# HOMEPAGE DATA INTEGRATION REPORT

This report documents the temporary local data structures currently driving the dynamic sections of the Ravenshaw Moments homepage. It outlines the integration requirements necessary to connect these sections to the future Supabase content-management modules.

## 1. Latest Memories Section

*   **Component**: `LatestMemoriesSection.tsx`
*   **Current Temporary Data**: `TEMPORARY_MEMORIES` (Array of objects containing `id`, `url`, `title`, `category`, `date`, `aspectRatio`)
*   **Intended Supabase Module**: Gallery / Memories module
*   **Required Database Fields**:
    *   `id` (UUID)
    *   `image_url` (Text/Storage path)
    *   `title` (Text)
    *   `category` (Text/Enum: event, campus, hostel, achievement)
    *   `published_at` (Timestamp)
    *   `aspect_ratio` (Text: e.g., 'square', 'wide', 'tall')
    *   `author_id` (UUID, Foreign Key to Profiles)
*   **Current Routes**: `/gallery` (View All)
*   **Future Integration Requirement**: Fetch the latest 5-8 approved gallery images ordered by `published_at` descending. Images must be passed through the Supabase Storage public URL utility before rendering.

## 2. Upcoming Events Section

*   **Component**: `UpcomingEventsSection.tsx`
*   **Current Temporary Data**: `TEMPORARY_EVENTS` (Array of `EventItem` containing `id`, `title`, `category`, `date`, `time`, `location`, `excerpt`, `slug`, `image`)
*   **Intended Supabase Module**: Events management module
*   **Required Database Fields**:
    *   `id` (UUID)
    *   `slug` (Text, Unique)
    *   `title` (Text)
    *   `category` (Text: academic, cultural, hostel, sports, alumni)
    *   `start_date` (Timestamp)
    *   `location` (Text)
    *   `excerpt` (Text)
    *   `cover_image` (Text/Storage path)
*   **Current Routes**: `/events/[slug]` (Individual Event), `/events` (View All)
*   **Future Integration Requirement**: Query events where `start_date >= now()`, ordered by `start_date` ascending. Limit to the upcoming 4-5 events to populate the featured and list slots.

## 3. Achievements and Inspiring Stories

*   **Component**: `AchievementsStoriesSection.tsx`
*   **Current Temporary Data**: `TEMPORARY_ACHIEVEMENTS` (Array of `AchievementItem` containing `id`, `slug`, `title`, `excerpt`, `personName`, `personRole`, `date`, `category`, `image`, `featured`)
*   **Intended Supabase Module**: Achievements & Stories module
*   **Required Database Fields**:
    *   `id` (UUID)
    *   `slug` (Text, Unique)
    *   `title` (Text)
    *   `excerpt` (Text)
    *   `person_name` (Text)
    *   `person_role` (Text)
    *   `category` (Text)
    *   `published_at` (Timestamp)
    *   `cover_image` (Text/Storage path)
    *   `is_featured` (Boolean)
*   **Current Routes**: `/news/[slug]` (Currently acting as the story route), `/news` (Explore All)
*   **Future Integration Requirement**: Query approved achievements/stories, utilizing the `is_featured` flag to populate the large featured card, and sorting the remainder by `published_at` descending for the secondary cards.

## 4. News and Publications

*   **Component**: `NewsPublicationsSection.tsx`
*   **Current Temporary Data**: `TEMPORARY_EDITORIAL_DATA` (Array of `EditorialItem` containing `id`, `slug`, `title`, `excerpt`, `contentType`, `publishedAt`, `authorName`, `authorType`, `coverImage`, `publicationFormat`)
*   **Intended Supabase Module**: News / Publications / Notices module
*   **Required Database Fields**:
    *   `id` (UUID)
    *   `slug` (Text, Unique)
    *   `title` (Text)
    *   `excerpt` (Text)
    *   `content_type` (Text/Enum: news, story, publication)
    *   `published_at` (Timestamp)
    *   `author_name` (Text)
    *   `author_role` (Text)
    *   `cover_image` (Text/Storage path)
    *   `format_type` (Text, optional: e.g., 'Digital Publication')
*   **Current Routes**: `/news/[slug]`, `/news` (Campus News), `/news` (Stories), `/news` (Publications)
*   **Future Integration Requirement**: This component utilizes client-side filtering (`contentType`). For production, data fetching should occur on the server (React Server Component) retrieving the latest ~12 records across all types, allowing the client component to filter them instantly without subsequent database queries.
