# Bug Fix Protocol

When investigating or fixing bugs, follow this checklist **in order**.

## 1. Critical Path Audit (before any code changes)

Before diving into the reported bug, verify the app's critical user paths still work. Broken critical paths take priority over all other work.

**Authentication flow:**
- Trace the full OAuth flow: button click → provider redirect → callback URL → session detection → route navigation
- On GitHub Pages: verify 404.html SPA redirect preserves query params AND hash fragments for OAuth callbacks
- Confirm the callback route (`/auth/callback`) is reachable after deployment (not just in dev)

**First-load experience:**
- Landing page renders without errors
- Sign-in button triggers the correct auth function
- Post-auth redirect lands on the correct page (onboarding vs home)

**Core CRUD operations:**
- Add, delete, and list operations for primary data types (chainrings, sprockets, sessions)

## 2. Reproduce the Reported Bug

- Identify the exact user action that triggers the bug
- Check browser console for errors
- Trace the code path from the UI event to the failing logic
- Identify the **root cause** — do not patch symptoms

## 3. Fix with Verification

- Write or update a test that would have caught this bug
- Apply the minimal fix to the root cause
- Verify the fix doesn't break any critical paths from step 1
- Run `npm run build`, `npm run test`, `npm run lint`

## 4. SPA + Deployment Gotchas

This app runs on GitHub Pages with client-side routing. Always check:
- **OAuth redirects**: tokens arrive via query params (PKCE `?code=`) or hash fragments (`#access_token=`). The 404.html → index.html handoff must preserve both.
- **Deep links**: any route like `/gears`, `/times`, `/profile` hits 404.html first. Verify the SPA redirect restores the full URL before React boots.
- **After structural changes**: rebuild and inspect `dist/404.html` and `dist/index.html` to confirm the redirect scripts are present and correct.
