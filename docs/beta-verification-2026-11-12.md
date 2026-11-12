# Theory-beta candidate verification — 12 November 2026

Scope: a working **local theory/quiz/offline-practice beta** across the three
approved areas. This is not a public-release or Milestone 3/4/5 completion claim.
The owner explicitly authorized work on the current feature branch. Starting
state was clean `feat/pyodide-feasibility` at
`9da44a0b31df4c7875efaf7eee9f7949ea16bd21`. No branch switch/fetch, stash,
push, PR, merge, deployment, protection change, external message, paid service
or learner activation. Historical runner packages/evidence are unchanged.

## Acceptance checklist

| State | Requirement | Result / evidence |
| --- | --- | --- |
| Implemented; locally verified | Connected learning in all three areas | 3 Python control-flow, 2 list-search and 3 relational/SQL lessons; 16 explanatory MCQs; 8 linked offline tasks/models. No count is treated as syllabus completeness. |
| Implemented; locally verified | Accurate mapping and original material | Nine verified outcome references, printed pages 7/8/9/11, all explicitly partial. Search/SQL decision records retain source hash and scope. Every quiz/task maps to its parent subset; provenance/review limits are shown. |
| Implemented; locally verified | Revision/navigation | Three topic routes; own-topic previous/next/back links; incomplete filter including its empty state; overview/revision links; useful 404 recovery. Existing URLs retained. |
| Implemented; locally verified | Defensive local progress | Original v1 migration and earlier three-lesson v2 data preserved; new IDs default empty. Refresh, per-lesson updates, owned-key reset, failed saves, cross-tab resets, corrupted/unavailable storage covered. Completion is self-marked. |
| Implemented; locally verified | UI and errors | Semantic landmarks, keyboard radio/disclosure/completion/filter controls, visible focus, status messages, dark preference/reduced motion and 320/768/1280px checks. Palette contrast minimum among checked pairs is 5.30:1. |
| Implemented; locally verified | Privacy, attribution and feedback | No account, code upload, analytics, database service, payment or learner execution. Existing GitHub feedback route is public/active; external sign-in and privacy boundaries disclosed. |
| Implemented; locally verified | Dependency maintenance | Next/config 16.4.6; narrow minimatch 11.0.1 tooling override, clean lockfile installation, dated audit zero. Mixed licences and override removal obligation documented. |
| Failed initially; repaired | Stale generated route types | Replacing the static topic file left old `.next/dev/types` references. Removed only that verified generated directory; regeneration/typecheck passes. No assertion or compiler check disabled. |
| Failed initially; repaired | 320px design-task table cells | Initial browser run: 172 passed, 2 failed, both design-task cell overflow at 320px. Added bounded wrapping; unchanged overflow assertions remain. Final rerun status below. |
| Blocked external evidence | Educational/student review | Independent teacher/content feedback and student feedback are not supplied or fabricated. Agent source/example review is not teacher review. |
| Blocked external evidence | Accessibility/physical devices | Required independent educational/screen-reader/accessibility review and physical-device checks remain open. Chromium emulation and semantic/contrast tests do not replace them. |
| Blocked access / owner release | Hosting, CI, production | Current team/project/billing connector reads are 403; CLI lacks credentials. Remaining allowance, production theory deployment, hosted CI and branch protection unverified. Protected runner preview is different evidence. |
| Deferred; disabled | Browser execution | Existing feasibility runner remains outside learner routes/assets; `.vercelignore` excludes its directory from future theory uploads. Actual-host security/recovery, device/low-memory, provider-policy and activation gates remain open. |
| Deferred; optional | Donations and later features | No donation setup, accounts, hosted grading/private tests, SQL execution, comprehensive coverage or extra areas. |

## Exact local checks

Repository root: `C:\Users\crate\Documents\ProjectALEVEL`. Local versions:
Windows, Node **20.20.2**, npm **10.8.2**, Python **3.14.5**, SQLite **3.50.4**,
Next.js **16.4.6**, Playwright **1.64.0**, Chromium **156.0.8078.4** (revision
1248). CI configuration targets Node 22/Python 3.14; no hosted run is claimed.

| Command | Local outcome |
| --- | --- |
| `git status --short --branch`, `git rev-parse HEAD`, `git log -5 --oneline`, `git branch -vv`, `git diff --stat` | Initial sandbox parent-directory failure; elevated read verified clean current feature branch and exact baseline. No remote freshness claim. |
| `npm install --ignore-scripts --fetch-retries=0 --fetch-timeout=30000` | Exit 0; existing pins/lock updated, zero advisories. |
| `npm ci --ignore-scripts --fetch-retries=0 --fetch-timeout=30000` | Exit 0; clean lockfile installation, 462 installed packages, zero audit findings. Existing ESLint 9 deprecation warning retained as a maintenance limit. |
| `npm run lint` | Exit 0. |
| `npm run typecheck` | Exit 0 after stale generated-cache correction. |
| `npm run check:content` | Exit 0; all 16 files, metadata, mappings, quizzes, publication links and anchors. |
| `npm test` | Exit 0; 14 tests, no skips. |
| `npm run test:examples` | Exit 0; 62 ordinary Python runs, 2,966 search runs, 19 SQL queries, 8 rejected constraints and key-design contract. Covers all lesson/model blocks, visible cases, displayed SQL data/results and meaningful boundaries. |
| `python scripts/check-contrast.py` | Exit 0; eight actual theme pairs, 5.30–12.62:1. This is a palette check, not an accessibility audit. |
| `npx playwright install chromium` | Exit 0; installed required Chromium, headless shell, FFmpeg and Winldd. No app dependency added. |
| `npm run build` | Exit 0 after final layout/filter changes; all 24 generated Next entries. Local warning: unrelated parent `C:\Users\crate\package-lock.json` ignored outside repository. No root change required. |
| `npm run test:e2e` | Exit 0; **176 passed**, no skips, 1.6 minutes; production server on loopback port 3100, two Chromium profiles, two workers, no timeout/assertion weakening. |
| `npm audit --json --ignore-scripts --fetch-retries=0 --fetch-timeout=15000` | Exit 0; zero known vulnerabilities after patch. Initial audit had one critical Next package and eight propagated moderate tooling entries. |
| `npm ls --all --json` | Discovery agent independently reran: exit 0, with six `extraneous` optional WASM artifacts reported. All match locked optional versions; applicable Windows native bindings are installed. This is not a clean dependency-graph claim. |
| `python docs/beta-evidence-2026-11-12/check.py` | Exit 0; 53 local documentation targets, four screenshot hashes and eight production traces without developer-runner files. |
| `git diff --check` | Exit 0. |
| `git diff --cached --check` | Initial staged check caught one Markdown trailing-space line in the new search mapping record; corrected before independent review. |

The primary agent also ran this exact compatibility smoke command (exit 0):

```powershell
node -e "const assert=require('node:assert/strict'); const path=require('node:path'); const tool=require.resolve('@typescript-eslint/typescript-estree'); const mm=require.resolve('minimatch',{paths:[path.dirname(tool)]}); const m=require(mm); assert(m.minimatch('.hidden.ts','*.ts',{dot:true})); assert(m.minimatch('app/page.tsx','app/*.{ts,tsx}',{dot:true})); assert(!m.minimatch('app/page.js','app/*.{ts,tsx}',{dot:true})); console.log('Patched minimatch API smoke passed: dot paths, brace patterns and negative match.');"
```

The discovery agent's exact hosting commands, authentication cancellations,
official sources and feedback GET are in [the current hosting record](hosting-terms-2026-11-12.md).
No hostile hosted probe, physical device, screen reader, human teaching review,
deployment or hosted CI result is inferred from these local checks.

## Evidence and review

- [Search mapping](decisions/search-mapping-2026-11-12.md),
  [SQL mapping](decisions/sql-mapping-2026-11-12.md),
  [dependency maintenance](decisions/security-maintenance-2026-11-12.md).
- [Browser screenshots and final local run summary](beta-evidence-2026-11-12/summary.json) are retained under
  `docs/beta-evidence-2026-11-12/`; full reproducible local outputs are generated
  under ignored `test-results/` when rerunning the suite.
- Independent reviewer receipt must bind the exact final candidate and scope
  under `docs/reviews/`. Local implementation sign-off cannot waive any blocked
  milestone or public-release gate.
