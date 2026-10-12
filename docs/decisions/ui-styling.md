# UI styling — Tailwind CSS and daisyUI

Date: 12 October 2026. Owner-requested Milestone 1 revision. Replaces the initial plain-CSS approach in the isolated `feat/project-setup` worktree; the original planning checkout is preserved.

## Decision and purpose

Use Tailwind CSS for responsive layout, spacing and typography, with daisyUI for the shared controls needed by the first lesson/quiz journey. This is the project's single styling system. No additional UI library, typography plugin, paid tooling, CDN, theme switcher or remote font was added. The runner remains deferred.

No installed daisyUI skill was found in the available local skill directories. Integration follows [official Next.js installation](https://daisyui.com/docs/install/nextjs/), [components](https://daisyui.com/components/), [configuration](https://daisyui.com/docs/config/), [custom themes](https://daisyui.com/docs/themes/) and [Tailwind PostCSS installation](https://tailwindcss.com/docs/installation/using-postcss).

## Exact versions and integration

| Development dependency | Version | Purpose |
| --- | --- | --- |
| `tailwindcss` | 4.3.3 | Generates layout, spacing, responsive and typography utilities. |
| `@tailwindcss/postcss` | 4.3.3 | Matching Tailwind integration for the Next.js CSS build. |
| `postcss` | 8.5.29 | Processes the CSS with that plugin. |
| `daisyui` | 5.7.47 | CSS components and shared semantic theme tokens. |

All four are exact-pinned in package.json and resolved in package-lock.json. The production build verifies compatibility with Next.js 16.4.0. `postcss.config.mjs` registers the Tailwind plugin; `app/globals.css` imports Tailwind and the daisyUI plugins. The browserslist setting follows daisyUI's documented Turbopack guidance. Build tools run locally or in CI; generated CSS is served with the application, with no daisyUI JavaScript runtime or external asset request.

The daisyUI allowlist includes only button, card, badge, radio, table, collapse and fieldset. Shared quiz, practice, completion and reset controls use these classes directly. Native semantic HTML remains responsible for forms, radio groups, table headers and disclosure behaviour. The CSS contains Tailwind compositions for the notes layout and content typography rather than a second handwritten widget system.

## Quiet educational theme

The single `h2notes` light theme uses warm paper, green actions, dark text, muted secondary text, modest radii, system fonts and generous line height. No theme switcher or automatic dark variation is introduced. Theme depths/noise are disabled; control/disclosure transitions are disabled. Visible focus is explicitly maintained above component defaults. Code remains horizontally scrollable within its block, without page-level overflow.

Contrast checks now read the actual semantic theme variables rather than the removed plain-CSS palette. Browser checks exercise keyboard focus, dark system preference, minimum control height, the complete journey, storage failures and narrow layouts. Real-device and screen-reader reviews remain pending.

## Cost and maintenance

These open-source local CSS tools require no subscription or hosted service. They add package/build maintenance: retain the lockfile, review upstream updates/advisories, keep Tailwind and its PostCSS plugin aligned, and rerun build, visual, keyboard and responsive checks when upgrading. This dependency choice does not promise perpetual free hosting.

A full `npm audit --audit-level=high` reported five affected development packages in the existing ESLint chain (`eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`). The [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) currently lists no patched release. These are not the newly added UI dependencies and are not production app dependencies. `npm audit --omit=dev --audit-level=high` reports zero vulnerabilities. No forced downgrade to an incompatible old Next.js lint configuration was applied; track this tooling limitation along with the existing ESLint 9 support limitation.

The package install also emitted a cleanup EPERM warning for an optional resolver directory; install succeeded and dependency listing, lint, typecheck and build completed. No paid service or runtime execution was introduced.
