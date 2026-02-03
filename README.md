# GearedtoTrack

A track cycling web application for velodrome cyclists to manage gear ratios and track lap times.

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS (dark theme)
- **State**: Zustand + React Query (TanStack Query)
- **Backend**: Supabase (database + Google OAuth)
- **Hosting**: GitHub Pages with custom domain

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/GearedtoTrack.git
cd GearedtoTrack
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment example and configure:
```bash
cp .env.example .env
```

4. Edit `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Start the development server:
```bash
npm run dev
```

## Supabase Setup

### 1. Create Supabase Project

1. Go to https://supabase.com and sign in
2. Create a new project named `gearedtotrack`
3. Select the region closest to UK (eu-west-2 London)

### 2. Set Up Google OAuth

**In Google Cloud Console:**
1. Go to https://console.cloud.google.com
2. Create/select a project
3. Go to "APIs & Services" → "Credentials"
4. Create OAuth client ID (Web application)
5. Add redirect URI: `https://<your-supabase-project>.supabase.co/auth/v1/callback`

**In Supabase Dashboard:**
1. Go to Authentication → Providers → Google
2. Enable and paste your Client ID and Client Secret
3. Go to URL Configuration and add:
   - Site URL: `https://www.gearedtotrack.co.uk`
   - Redirect URLs: `https://www.gearedtotrack.co.uk/auth/callback`, `http://localhost:5173/auth/callback`

### 3. Run Database Migration

1. Go to SQL Editor in Supabase
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Run the SQL to create tables and policies

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Deployment

The project is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Setup GitHub Pages

1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. Add repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Custom Domain DNS

Configure DNS for `www.gearedtotrack.co.uk`:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | `<username>.github.io` |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

## Features

- **Gear Calculator**: Calculate and compare gear ratios, gear inches, and development
- **Chainrings & Sprockets**: Manage your gear components with favorites
- **Lap Times**: Track lap times across different track cycling events
- **Profile**: Configure bike setup (wheel diameter, track length) and data sharing preferences

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # AppLayout, BottomNav
│   ├── auth/            # GoogleSignInButton
│   ├── onboarding/      # Profile/DataSharing steps
│   ├── home/            # ProgressCard, QuickActions
│   ├── gears/           # Ratios, Chainrings, Sprockets
│   ├── laptimes/        # LapTimesList, AddLapTimeModal
│   └── profile/         # BikeSetup, DataSharing
├── hooks/               # React Query hooks
├── lib/                 # Supabase client, calculations
├── pages/               # Route components
├── store/               # Zustand stores
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## License

MIT
