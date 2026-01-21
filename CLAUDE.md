# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AlignPT is a web application that matches patients with physical therapists based on injury type, treatment goals, coaching preferences, and logistics. Built as a Next.js 14 App Router SPA with TypeScript, it features a 4-step intake wizard and intelligent matching algorithm.

**Current state**: Prototype with mock data (18 PT profiles), no backend/database.

## Commands

```bash
npm run dev          # Start development server at localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint
```

No test runner is configured.

## Architecture

### Data Flow

```
Landing Page → Intake Wizard (4 Steps) → Results Page → PT Profile Page
```

All state is client-side. Form data persists via React Context during intake, then transfers to sessionStorage before navigating to results.

### Key Directories

- `src/app/` - Next.js App Router pages (landing, intake wizard, results, PT profile)
- `src/components/ui/` - shadcn/ui primitives (button, card, dialog, etc.)
- `src/components/intake/` - 4-step wizard components (Step1Injury, Step2Goal, Step3Preferences, Step4Logistics)
- `src/components/results/` - PTCard, WeightsDrawer for results page
- `src/context/IntakeContext.tsx` - React Context managing multi-step form state
- `src/lib/matching.ts` - Core matching algorithm (369 lines)
- `src/data/mockPTs.ts` - 18 hardcoded PT profiles
- `src/types/index.ts` - TypeScript type definitions

### Matching Algorithm (`src/lib/matching.ts`)

Five-factor scoring system (total max: 100):
1. **Injury Fit** (max 30) - Specialty match with related injury fallback
2. **Goal Fit** (max 20) - Goal expertise match
3. **Style Fit** (max 20) - 4-dimensional preference comparison (1-5 scales, 3 = neutral)
4. **Logistics Fit** (max 20) - Visit type (hard filter), insurance, location
5. **Availability Fit** (max 10) - Time window overlap percentage

Returns top 5 matches with score breakdowns and reason strings. Visit type is a hard filter.

### Type System (`src/types/index.ts`)

Key types: `InjuryArea`, `InjuryRegion` (nested by area), `Goal`, `StylePreferences`, `VisitType`, `PatientInput`, `PTProfile`, `PTMatch`

## Tech Stack

- Next.js 14 (App Router) with TypeScript 5.7
- Tailwind CSS 3.4 with custom theme (HSL color system, custom shadows)
- shadcn/ui components built on Radix UI
- React Context for state management
- All components use `"use client"` directive

## Styling

Theme uses CSS custom properties in `globals.css`. Custom utilities: `shadow-soft`, `shadow-soft-lg`, `duration-250`, `timing-gentle`. Dark mode supported via class strategy.
