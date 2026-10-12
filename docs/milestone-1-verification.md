# Milestone 1 — Minimal Theory Foundation

Date: 12 October 2026. Branch: `feat/project-setup`. Local implementation and verification only; no publication, commit, push, PR or merge.

## Acceptance criteria and delivered slice

- Next.js App Router and TypeScript with Tailwind CSS/daisyUI, lint/type checks, meaningful tests, production build and a GitHub Actions workflow.
- Git Markdown with bounded validated JSON frontmatter, unique slugs, publication filtering, quiz explanations, verified 2026 outcome references and working internal links/anchors.
- Topic → one original sequence/selection lesson → explanatory checkpoint → offline practice/model → self-marked completion.
- Versioned local completion, refresh persistence, corrupt/unsupported-data recovery, blocked-storage session fallback and confirmed reset of only the owned key.
- Responsive semantic pages, keyboard controls, visible focus, labelled inputs, status announcements, readable contrast and useful missing-page recovery.

The learner content maps to 2.2.3 and 2.2.6 on printed page 8 of the [official 2026 syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf), checked on this date. Coverage is explicitly partial: sequence/selection and short non-recursive traces. Loops and recursion are not taught. Algorithms/data structures and relational databases/SQL are planned; no other MVP area was added. Explanations, questions and scenarios are original. Independent teacher review remains pending and is disclosed.

## Repository preservation

The original checkout remains on `docs/milestone-workflow`, retaining 16 modified files, 8 deletions, `docs/milestone-workflow.md` and `docs/tmp/`. The owner approved a separate feature worktree and copies of the current approved planning documents. No original changes were discarded, overwritten or stashed.

`git -C C:/Users/crate/Documents/ProjectALEVEL fetch origin main:main` failed with GitHub `Permission denied (publickey)`. The HTTPS retry was rejected before execution. The owner then ran `git -C /c/Users/crate/Documents/ProjectALEVEL fetch origin` in Bash and reported Done. Read-only inspection afterwards found main/origin/main at 568d525, `0 0` ahead/behind and no conflicts. A fast-forward update was unnecessary because the refs already matched. Future SSH operations must be requested from the owner and wait for completion.

The app-managed worktree tool reported `Not a git repository` for the docs-only context. Git successfully created the worktree using:

```sh
git -C C:/Users/crate/Documents/ProjectALEVEL worktree add -b feat/project-setup C:/Users/crate/.codex/visualizations/2026/10/12/01a13043-c2df-7d22-a909-f11f2c7dca0a/project-setup main
```

The feature diff includes copies of approved, previously uncommitted planning revisions as well as new implementation. Review these inherited documentation changes separately from the app files; do not assume they are all newly authored implementation changes.

## Commands and results

Run from the isolated feature worktree. Local versions: Node 20.20.2, npm 10.8.2, Python 3.14.5, Next.js 16.4.0, React 19.3.0, Playwright 1.64.0, Chromium 156.0.8078.4. CI is configured for Node 22/Python 3.14 on Ubuntu; a hosted run has not occurred.

| Command | Final result |
| --- | --- |
| `npm install --no-fund --no-audit` | Installed app/test packages and generated lockfile; required network escalation after sandbox DNS failures. |
| `npm run lint` | Passed with the final ESLint 9.39.5 configuration. |
| `npm run typecheck` | Route generation and TypeScript passed. |
| `npm run check:content` | Two Markdown files validated, including outcome subsets, quiz metadata, links and anchors. |
| `npm test` | 9 tests passed: invalid metadata/outcomes/answers/links, duplicate/unpublished content, quiz results, progress corruption/versioning and storage failures/reset. |
| `npm run test:examples` | 15 authored Python runs passed: home preview, sequence example, worked branch boundaries and all six offline model examples. These execute repository-authored code locally, never learner submissions. |
| `python scripts/check-contrast.py` | Eight semantic theme text pairs passed 4.5:1; lowest tested ratio 5.30:1. |
| `$env:NEXT_TELEMETRY_DISABLED = '1'; npm run build` | Passed; all learning routes prerendered. Escalation resolved sandbox EPERM during static-output generation. |
| `npx playwright install chromium` | Installed the pinned Playwright Chromium browser and supporting local tools. |
| `$env:NEXT_TELEMETRY_DISABLED = '1'; npm run test:e2e` | 12 tests passed on desktop and mobile Chromium: full journey, retry explanations, refresh/reset, keyboard navigation/radio/disclosure, corrupt/blocked storage, 404s and all published routes at 320/768/1280px; main journey also tested at 390px. |
| `npm audit --omit=dev --audit-level=high` | No production dependency vulnerabilities reported on this date. Not a guarantee against future advisories. |
| `git diff --check` | Passed. |

Screenshots in ignored `test-results/` were visually inspected for home, lesson and offline model at desktop/mobile sizes. Browser tests verify no page-level horizontal overflow, including an open model explanation. Headings, landmarks, radio groups, visible focus and native disclosure controls support keyboard use. A screen-reader audit and real-device testing have not been performed.

## Corrected failures and maintenance notes

- Initial sandboxed `npm view` calls failed with `ENOTFOUND`; escalated registry calls worked.
- Initial lint found two unescaped apostrophes; corrected before final passing run.
- `tsx --test tests/*.test.ts` failed on Windows because the shell did not expand the glob; the portable command names the three test files explicitly.
- Initial build compiled/typechecked but failed creating a static segment directory with EPERM in the sandbox. The escalated build passed. Dynamic filesystem tracing warnings were removed by scoping reads to the content directory.
- ESLint 10.12.0 passed lint, but `npm ls eslint` reported invalid peers in Next.js's bundled import/React/accessibility plugins. Restored ESLint 9.39.5, which has valid peers but is deprecated upstream. Upgrade when the bundled plugins support the current major; this is a developer-tool maintenance limitation.
- New source was formatted using temporary `npm exec --yes --package=prettier@3.6.2 -- prettier --write ... --ignore-unknown`; no formatter dependency was added to the repository.
- Browser test output contained harmless NO_COLOR/FORCE_COLOR environment warnings.

## Remaining limits and next task

GitHub branch protection and an actual hosted CI run, Vercel deployment/terms, real mobile devices, other browser engines, independent educational review and screen-reader review remain unverified. No full beta/deployment gate is claimed. Existing plans retain those checks.

Progress schema version 1 deliberately supports this one lesson. There is no older supported schema to migrate; unknown versions recover safely. Milestone 2 must extend lesson-keyed progress and add migration tests without losing this lesson's data. Self-marked completion is not evidence that learner code ran or passed tests.

No CodeMirror, Pyodide, hosted execution, `/api/run`, hidden grading, account, database, analytics or payment integration was added. Hosting services were not provisioned. Next.js build telemetry was disabled for build/browser checks; this is separate from learner-app privacy.

Next milestone task: add the counted/conditional-loops lesson, then combined control-flow/tracing, each with tested original examples, explanatory checkpoints, offline models and multi-lesson local progress. Browser feasibility remains a later gated task.

## Milestone 1 styling revision — 12 October 2026

The owner requested Tailwind CSS with daisyUI before extending shared components. The existing Milestone 1 journey now uses the requested system. No installed daisyUI skill was found, so the official documentation was followed. See [UI styling decision](decisions/ui-styling.md) for source links, compatibility, exact pins, component allowlist and maintenance/cost.

Commands run for this revision:

- `npm install --save-dev --save-exact tailwindcss@4.3.3 @tailwindcss/postcss@4.3.3 daisyui@5.7.47 --no-fund --no-audit`
- `npm install --save-dev --save-exact postcss@8.5.29 --no-fund --no-audit`
- `npm ls tailwindcss @tailwindcss/postcss postcss daisyui --depth=0`: all four exact versions present.
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run check:content`, `python scripts/check-contrast.py`: passed; 9 unit tests, 2 Markdown items, 8 text contrast pairs.
- `$env:NEXT_TELEMETRY_DISABLED = '1'; npm run build`: passed with Tailwind/daisyUI CSS and all static routes.
- `$env:NEXT_TELEMETRY_DISABLED = '1'; npm run test:e2e`: 12 passed after the final corrections. Includes prior journey/storage/keyboard/mobile coverage plus fixed light theme under dark preference, 44px control height, 3px radio focus, correct punctuation and visible model code styling.
- `npm audit --audit-level=high`: failed with five affected development packages in the existing ESLint/braces chain. No patched braces release is listed and the suggested forced downgrade is incompatible; recorded in the styling decision. No new UI dependency was identified in this chain.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.
- `git diff --check`: passed.

Visual inspection of desktop/mobile screenshots caught and corrected punctuation damaged by a Windows text conversion and transitional clipping of model content. The corrected screenshots show readable text, code and disclosures. Control/disclosure animations are disabled. The PostCSS anonymous-export lint warning was corrected; package installation succeeded despite an optional resolver cleanup EPERM warning.

The original checkout, existing lesson/progress behaviour, runner deferral and publication restrictions are preserved. Documentation now identifies Tailwind/daisyUI as the styling system. Prior educational-example results remain valid: no Python content changed in this revision. Real devices, screen readers, hosted CI/deployment and independent educational review are still pending.
