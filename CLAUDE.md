# GearedtoTrack - Project Reference

## Overview
Track cycling web application for velodrome cyclists to manage gear ratios and lap times.

## Hosting Configuration

**IMPORTANT: This project uses a CUSTOM DOMAIN, not GitHub Pages subdirectory.**

| Setting | Value |
|---------|-------|
| **Live URL** | https://www.gearedtotrack.co.uk |
| **Hosting** | GitHub Pages |
| **Repository** | https://github.com/TJRiley-1/GearedToTrack |
| **Branch** | `main` |

### Critical Config - DO NOT CHANGE
- `vite.config.ts` → `base: '/'` (NOT `/GearedToTrack/`)
- `public/CNAME` → Must contain `www.gearedtotrack.co.uk`
- `public/404.html` → Redirects to `/` (NOT `/GearedToTrack/`)

## Supabase Configuration

| Setting | Value |
|---------|-------|
| **Project URL** | https://klljtobzcfgcwzcoputv.supabase.co |
| **Credentials** | Hardcoded in `src/lib/supabase.ts` |
| **Auth Provider** | Google OAuth |

### Auth Redirect URLs (configured in Supabase Dashboard)
- Site URL: `https://www.gearedtotrack.co.uk`
- Redirect URL: `https://www.gearedtotrack.co.uk/auth/callback`

## Google OAuth

| Setting | Value |
|---------|-------|
| **Client ID** | `349006262545-puounl67gr2eent7ec4ukij6ejr2ek1q.apps.googleusercontent.com` |
| **Authorized Redirect URI** | `https://klljtobzcfgcwzcoputv.supabase.co/auth/v1/callback` |

## Tech Stack
- React 19 + Vite + TypeScript
- Tailwind CSS (dark theme)
- Zustand (state) + React Query (data fetching)
- Supabase (database + auth)

## Key Files
```
src/lib/supabase.ts      # Supabase client with hardcoded credentials
src/store/authStore.ts   # Auth state management
src/types/database.ts    # Database types
public/CNAME             # Custom domain config
vite.config.ts           # Build config (base path)
.github/workflows/deploy.yml  # GitHub Pages deployment
```

## Database Tables
- `profiles` - User profiles (extends auth.users)
- `chainrings` - User's chainrings
- `sprockets` - User's sprockets
- `lap_sessions` - Training sessions
- `lap_times` - Individual lap times

## Testing
```bash
npx playwright test      # Run deployment tests
npm run dev              # Local development
npm run build            # Production build
```

## Common Issues

### Site shows blank page
Check that `vite.config.ts` has `base: '/'` for custom domain.

### OAuth redirect error
Ensure Google Cloud Console has the Supabase callback URL:
`https://klljtobzcfgcwzcoputv.supabase.co/auth/v1/callback`

### Button stuck loading after OAuth cancel
Fixed with `visibilitychange` listener in `GoogleSignInButton.tsx`
