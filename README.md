# AlignPT - Physical Therapist Matchmaker

A prototype web application that matches patients to physical therapists based on injury, goals, preferences, and logistics.

## Quick Start

```bash
# Navigate to the project
cd alignpt

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Data**: In-memory mock data (no database)

## Core Features

### 1. Landing Page
- Clean, healthcare-focused design
- Single CTA to start the matching process

### 2. Patient Intake Wizard (4 Steps)
- **Step 1**: Pain/Injury area selection
- **Step 2**: Goal selection (return to sport, reduce pain, etc.)
- **Step 3**: Preferences (coaching style, session style - multi-select)
- **Step 4**: Logistics (location search, visit type, insurance, availability)

### 3. Results Page
- Ranked list of top 5 PT matches
- Match score (0-100) with transparent breakdown:
  - Injury Fit (0-30)
  - Goal Fit (0-20)
  - Style Fit (0-20)
  - Logistics Fit (0-20)
  - Availability Fit (0-10)
- "Why this match" expandable section with top 3 reasons + top 1 tradeoff
- Debug drawer to adjust weights live

### 4. PT Profile Page
- Detailed bio and approach
- Specialties and conditions treated
- Reviews (sample data)
- Booking modal with:
  - Available time slots
  - Insurance coverage notice
  - Self-pay rate if not covered

## Matching Algorithm

The matching uses a deterministic weighted scoring algorithm:

- **Injury Match**: Full points for exact specialty match, partial for related injuries
- **Goal Match**: Full points for exact goal expertise, partial for related goals
- **Style Match**: Points for matching coaching and session style preferences
- **Logistics**: Visit type (hard filter), insurance match, location proximity
- **Availability**: Overlap between patient and PT time windows

### Hard Filters
- PT must accept at least one of the patient's selected visit types

### Scoring
- Insurance mismatch: Heavy penalty but not a hard filter
- Deterministic tie-breaking by PT name

## Project Structure

```
alignpt/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── intake/
│   │   │   └── page.tsx          # Intake wizard
│   │   ├── results/
│   │   │   └── page.tsx          # Results page
│   │   └── pt/[id]/
│   │       └── page.tsx          # PT profile page
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── intake/               # Wizard step components
│   │   └── results/              # PT card, weights drawer
│   ├── context/
│   │   └── IntakeContext.tsx     # Form state management
│   ├── data/
│   │   └── mockPTs.ts            # 18 PT profiles
│   ├── lib/
│   │   ├── matching.ts           # Matching algorithm
│   │   └── utils.ts              # Utility functions
│   └── types/
│       └── index.ts              # TypeScript types
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Mock Data

The `mockPTs.ts` file contains 18 diverse PT profiles with:
- Different specialties (sports, spine, hand therapy, etc.)
- Different neighborhoods in SF Bay Area
- Various insurance acceptance
- Different visit types (in-person, telehealth, at-home)
- Varied availability schedules
# alignpt
