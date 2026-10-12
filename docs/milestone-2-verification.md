# Milestone 2 — First Complete Theory Topic

Date: 12 October 2026. Branch: `feat/python-control-flow`, created from clean synchronized main at `b3fd8da` after the owner's fetch and merge of PR #1. No Milestone 2 commit, push, PR, merge or deployment has been performed. The original dirty planning checkout remains on `docs/milestone-workflow` and is preserved.

## Acceptance and delivered journey

- Three connected lessons: Make a decision with Python → Repeat with a purpose → Trace decisions inside a loop.
- Each has prerequisites/refresher, original worked examples, misconceptions, two explanatory checkpoint questions and a linked offline task/model.
- Offline tasks: classify a score, sum a sequence using a counted or conditional loop, and design a revision-score summary combining sequence, selection and iteration. Input/output contracts, visible boundary examples and progressively stronger hints are explicit. No attempt is executed or graded by the site.
- Topic navigation shows per-lesson status and total completion; previous/next links connect the lessons without preventing independent revision.
- Schema version 2 stores separate review/completion flags. Valid version 1 flags migrate into the original lesson, leaving new lessons incomplete. Invalid entries reset independently while valid neighbours are retained. Reset removes only the owned key after confirmation.
- Storage-blocked progress works across all three journeys for the current visit and is lost on refresh, with an explicit notice. Sequential cross-tab updates preserve other lessons and reset propagates between tabs.
- Quiet Tailwind/daisyUI styling retained. Multi-line examples preserve line breaks; fixed, wrapping table columns prevent clipping at 320px. Semantic landmarks/headings, native forms/disclosures, focus, keyboard use, contrast and responsive page/table overflow are checked.

No dependency or service was added. CodeMirror, Pyodide, execution APIs, hidden grading, accounts, databases, analytics and payments remain deferred.

## Syllabus mapping and provenance

All six lesson/practice files and their questions map to verified 2026 numeric outcomes 2.2.3 and/or 2.2.6, printed page 8 of the [official SEAB syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf), rechecked on this date. No new outcome identifier was invented. The topic teaches sequence, selection, counted/conditional iteration and small non-recursive traces; recursion, all Python and full-syllabus coverage are not claimed. The coverage register remains partial.

Explanations, scenarios, questions and models are original project content. Python semantics were checked against the official [3.14 control-flow tutorial](https://docs.python.org/3.14/tutorial/controlflow.html) and [introduction](https://docs.python.org/3.14/tutorial/introduction.html). Mapping and executable-example review by Codex is disclosed; independent teacher review is still pending.

## Local commands and final results

Commands were run in the existing worktree:
`C:/Users/crate/.codex/visualizations/2026/10/12/01a13043-c2df-7d22-a909-f11f2c7dca0a/project-setup`.
Local tools remain Node 20.20.2, Python 3.14.5, Next.js 16.4.0, Playwright 1.64.0 and Chromium 156.0.8078.4. CI configuration retains Node 22/Python 3.14.

| Command | Final result |
| --- | --- |
| `git status --short --branch` | Initial clean main; final changes are confined to feat/python-control-flow. |
| `git rev-list --left-right --count main...origin/main` | `0 0` before branching; main was already synchronized from the owner's preceding fetch. |
| `git switch -c feat/python-control-flow` | Created from b3fd8da; no edit on main. |
| `npm run lint` | Passed, no warnings in the final run. |
| `npm run typecheck` | Route generation and TypeScript passed. |
| `npm test` | 12 passed: content/schema/links, registered ordering and task ownership, quiz summaries, version 1 migration, version 2 per-lesson state, corrupt/future/oversized data, independent updates and storage failures/reset. |
| `npm run check:content` | Six Markdown items validated, including parent links, outcome subsets and internal anchors. Content caps measure UTF-8 bytes. |
| `npm run test:examples` | 42 authored Python runs passed: all 6 lesson blocks, all 4 model programs against every visible example, the home preview, empty/one-item ranges, condition boundaries, empty/repeated score lists and score thresholds. Each authored program runs in a fresh local subprocess with a timeout; no learner submission is involved. |
| `python scripts/check-contrast.py` | All 8 semantic text palette pairs passed 4.5:1; lowest measured ratio 5.30:1. |
| `$env:NEXT_TELEMETRY_DISABLED = '1'; npm run build` | Passed, including three static lesson routes and three static exercise routes. Executed with the same build-output permission escalation needed in Milestone 1. |
| `$env:NEXT_TELEMETRY_DISABLED = '1'; npm run test:e2e` | 24 passed across desktop/mobile Chromium. Covers the full topic, legacy migration, sequential two-tab updates/reset, failed-save memory cleared by another tab's owned-key reset or site-storage clear without resurrection on later saves, blocked storage across all three lessons, refresh/reset, explanatory retry, keyboard/focus, fixed light theme, missing pages, all published routes at 320/768/1280px and table-cell overflow. The original journey also runs at 390px. |
| `git diff --check` | Passed. |

Screenshots of the completed topic, new lesson headings/models and the multi-line examples table were visually inspected. The corrected 320px table shows complete output labels and numbers. Test screenshots/traces remain in ignored `test-results/`.

## Failures corrected

- Diff review reproduced failed-save memory surviving another tab's reset. The provider now clears its memory fallback and stale notice on an external localStorage reset. Added four desktop/mobile regression cases covering both reset paths and successful saving afterward. Re-ran `npm run lint`, `npm run typecheck`, `npm test` (12 passed), `$env:NEXT_TELEMETRY_DISABLED = '1'; npm run build`, and `$env:NEXT_TELEMETRY_DISABLED = '1'; npm run test:e2e` (24 passed). No educational content or styles changed in this fix. Formatting with `npx --yes prettier@3.6.2 --write components/ProgressProvider.tsx tests/e2e/topic.spec.ts` initially failed with sandbox DNS ENOTFOUND; the approved network retry succeeded without adding a dependency. The build-generated next-env.d.ts path changes were restored to their pre-fix values.
- The first typecheck/build failed because a revised test's find predicate no longer narrowed the lesson/exercise union. Added an explicit lesson assertion. Removed its unused fixture variable; final lint/typecheck/build passed.
- Screenshot review found narrow table cells clipping output digits despite page-level fit. Used equal fixed-width columns, wrapping headers and inline-block code with preserved line breaks. Added a table-cell overflow assertion; inspected the corrected table.
- A later desktop topic test refreshed immediately after clicking a client navigation link, reloading the previous lesson before the topic transition completed. The failure snapshot confirmed the previous page. The test now waits for the topic URL before refresh; the final complete suite passed 20/20. The assertions and progress behaviour were retained.
- Windows PowerShell wildcard handling required `Get-Content -LiteralPath` for [slug] files during inspection; the corrected reads succeeded.
- Next.js regenerated next-env.d.ts imports to production route/root-parameter type locations. This is generated type configuration, not a learner feature.
- New/edited source was formatted with the same temporary pinned Prettier 3.6.2; no formatter dependency was added. Harmless NO_COLOR/FORCE_COLOR warnings appeared in browser output.

## Remaining limits and next task

This is a locally verified bounded topic, not a deployed beta or proof of learning outcomes. Independent educational review, physical mobile devices, other browser engines, screen-reader review, current host terms/deployment and branch protection remain pending. PR #1's passing GitHub checks were owner-reported; its squash merge was verified locally at b3fd8da. This branch's hosted CI has not run because publication is not authorized.

Progress remains device/browser-specific and self-marked. Migration is persisted on the next learning update; unknown lesson keys are ignored. localStorage is not transactional: truly simultaneous tab writes may still use last-writer behaviour. No answers, source or personal details are saved. Clearing site data removes progress.

Dependencies and lockfile are unchanged. The documented ESLint 9 support limitation and development-only braces advisory from Milestone 1 remain recorded in the [UI styling decision](decisions/ui-styling.md); no new audit result is claimed here.

Next: review and publish Milestone 2 only with explicit authorization, then begin Milestone 3 feasibility after the topic is accepted. Browser execution must remain inactive until pinned-runtime, deployed isolation/loading, cancellation/output/state recovery and supported-device gates pass. Retain theory/offline practice if feasibility fails.
