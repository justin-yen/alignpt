# Changelog

All notable changes to AlignPT will be documented in this file.

## [Unreleased]

### Added
- **Database Integration**: Supabase client setup with typed helpers for intake submission storage
  - New `src/lib/supabase.ts` with `insertIntakeSubmission()` and `getSessionId()` helpers
  - New `src/types/database.ts` with TypeScript types matching PostgreSQL schema (enums, tables, insert types)
  - `saveToDatabase()` method added to IntakeContext for persisting intake form data
  - Session ID tracking for anonymous user submissions
  - Graceful degradation when Supabase environment variables are not configured

- **Availability Selection UX Improvements**: Enhanced time slot selection in Step4Logistics
  - Full day names displayed in availability summary
  - 12-hour time format (e.g., "10am-2pm") for better readability
  - Contiguous time slots merged into ranges for cleaner display

- **Branding Assets**: Added AlignPT logo files
  - `public/align_pt_logo.png`
  - `public/align_pt_transparent.png`

### Changed
- Updated landing page with new logo integration
- Enhanced intake page with database persistence on form completion
