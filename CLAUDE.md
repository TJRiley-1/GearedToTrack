## Workflow

Wait for the user to finish describing all issues before starting investigation or implementation. Do not begin exploring the codebase mid-list.

## Code Quality

After making UI or JavaScript changes, always verify the app loads without blank screen errors by checking for syntax errors and runtime exceptions before committing.

When removing a feature, audit ALL references: UI components, localStorage keys, event handlers, and related logic. Do a grep for the feature name before marking removal complete.

## Debugging

When fixing bugs, identify the root cause before applying fixes. Avoid quick patches like setTimeout or surface-level workarounds — trace the actual problem first.

Before any audit, feature work, or bug investigation, verify the critical user paths work end-to-end:
1. **Auth flow**: Google Sign-In button → OAuth redirect → callback URL receives tokens → session established → correct page loads. This is the first interaction every user has — if it's broken, nothing else matters.
2. **SPA routing**: Every client-side route (/gears, /times, /profile, /auth/callback) goes through GitHub Pages 404.html redirect. After any change to routing, 404.html, or index.html, verify the redirect chain preserves query params and hash fragments.
3. **First-load experience**: Landing page renders, sign-in works, post-auth navigation lands correctly.

Use `/bug-fix` to run the full bug fix protocol including critical path audit.

## Versioning

**Every commit that will be pushed MUST bump the version.** The single source of truth is `src/version.ts`. Update the `APP_VERSION` there — it is imported by `Landing.tsx` and `Profile.tsx`. Also update `version` in `package.json` to match. Use semver: patch for fixes (1.2.1), minor for features (1.3.0), major for breaking changes (2.0.0). The version displays on the landing page footer and Profile → About so the user can verify which build is deployed.

## Deployment

This project deploys via GitHub Pages with SPA routing via 404.html → index.html redirect.

- Always verify the build output directory is configured correctly (not serving source)
- Check deployment config before and after structural changes
- After build, inspect `dist/404.html` and `dist/index.html` to confirm the SPA redirect scripts are intact — these are critical for OAuth callbacks and deep links
- OAuth tokens arrive via query params (PKCE `?code=`) or hash fragments (`#access_token=`). The 404.html redirect MUST preserve both separately — never encode them into a single query parameter
