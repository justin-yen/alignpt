# PLAN.md

Future development roadmap for AlignPT.

## Completed: Database Integration

- [x] Add Supabase client configuration (`src/lib/supabase.ts`)
- [x] Define database types matching PostgreSQL schema (`src/types/database.ts`)
- [x] Add `saveToDatabase()` method to IntakeContext
- [x] Integrate database save on intake form submission
- [x] Add session ID tracking for anonymous users
- [x] Graceful fallback when Supabase is not configured

## TODO: Database - Next Steps

- [ ] Set up Supabase project and configure environment variables
- [ ] Create PostgreSQL tables and enums matching `src/types/database.ts`
- [ ] Add error handling UI for failed database saves
- [ ] Implement PT profiles table and CRUD operations
- [ ] Add analytics dashboard for intake submissions

## TODO: License Verification

- [ ] Verify PT license numbers against state licensing board APIs
- [ ] Add license expiration date tracking
- [ ] Display license status (active/inactive/expired) on PT profiles
- [ ] Implement periodic license re-verification
- [ ] Add license type validation (PT, DPT, PTA distinctions)
- [ ] Support multi-state license verification for PTs practicing in multiple states

## TODO: Matching Algorithm

- [ ] Add weighting customization for users to prioritize factors
- [ ] Implement machine learning model for score prediction based on outcomes
- [ ] Add distance calculation using actual addresses/zip codes
- [ ] Factor in PT capacity and current patient load
- [ ] Add patient review sentiment analysis to scoring
- [ ] Support condition-specific matching (e.g., post-surgical protocols)
- [ ] Implement A/B testing framework for algorithm variants
- [ ] Add explainability features showing why each factor scored as it did
