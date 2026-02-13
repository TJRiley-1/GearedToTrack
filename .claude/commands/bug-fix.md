# Bug Fix Protocol

When investigating or fixing bugs, follow this checklist **in order**.

## 1. Critical Path Audit (before any code changes)

Before diving into the reported bug, verify the app's critical user paths still work. Broken critical paths take priority over all other work.

**Authentication flow:**
- Verify `flowType: 'implicit'` is set in the Supabase client config (src/lib/supabase.ts). PKCE flow breaks on GitHub Pages because query params get lost in the 404 redirect chain.
- Verify `redirectTo` in the sign-in function (src/lib/auth.ts) points to `window.location.origin` (NOT `/auth/callback`). Tokens must arrive at `/` (index.html) directly, not at a non-existent path that triggers 404.html.
- Trace the full flow: button click → Google → Supabase → redirect with `#access_token=...` in hash → `detectSessionInUrl` picks up tokens → `onAuthStateChange` fires `SIGNED_IN` → Landing page redirects to `/home` or `/onboarding`.

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

## 4. Supabase + GitHub Pages OAuth Rules

**These rules apply to ANY project using Supabase OAuth on GitHub Pages:**

1. **Always use `flowType: 'implicit'`** in the Supabase client config. The default PKCE flow sends tokens as query params which get lost in the GitHub Pages 404 redirect chain. Implicit flow uses hash fragments which are client-side only and survive all redirects.

2. **Redirect to the origin root** (`window.location.origin`), not to a `/callback` path. The root URL resolves to index.html directly — no 404 redirect needed. Callback paths don't exist as files and go through the 404 chain which can mangle or lose tokens.

3. **Let `detectSessionInUrl: true` handle tokens automatically.** Don't manually parse hash fragments or call `exchangeCodeForSession()`. The Supabase client's `_initialize()` handles it.

4. **Never fight the framework.** Don't skip `initialize()`, don't race `onAuthStateChange`, don't manually extract tokens. Let the Supabase client do its job — just configure it correctly.

Reference working implementation: `/home/tim/Documents/Projects/whatnow-com/web/js/supabase.js`

## 5. SPA Routing Gotchas

- **Deep links** (`/gears`, `/times`, `/profile`) go through 404.html → index.html. This is fine for navigation, but NOT for auth tokens.
- After structural changes, rebuild and inspect `dist/404.html` and `dist/index.html`.
