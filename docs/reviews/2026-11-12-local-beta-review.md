# Independent review — local three-area theory beta

Date: 12 November 2026.

Reviewer: `/root/independent_beta_review`, a separate agent started with a fresh
conversation. I did not author or repair the implementation. I wrote only this
receipt. The primary agent supplied the original owner request, baseline,
candidate, evidence locations and constraints; I derived the checklist below
from that request and the repository requirements.

- Baseline: `9da44a0b31df4c7875efaf7eee9f7949ea16bd21`.
- Initial candidate: `f376d91e9caf8fea902f92807700531a8368f60f`.
- Final reviewed candidate: `286470949e8ea8af6639c81d0ebf22a075e75359`.
- Scope: the complete **local theory/quiz/offline-practice implementation** and
  security maintenance in the baseline-to-final diff, including the review
  repair and delivery/evidence documentation. This is focused local readiness,
  not full Milestone 3, 4 or 5 completion, deployment readiness or public release.

I read the original owner request, root AGENTS.md, README.md, implementation.md,
roadmap.md, current-status.md, content-guide.md, milestone-workflow.md and
independent-review.md. The owner-authorized current-branch exception is recorded
in current-status.md. I performed no branch switch/fetch, installation, push,
PR, merge, deployment, protection change, authentication, third-party message,
hosted application test or learner activation.

## Independently developed checklist

| Review question | Outcome and evidence |
| --- | --- |
| Can a learner complete a worthwhile journey in each approved area, without a new account or execution service? | Pass for local scope. Eight lesson/checkpoint/offline-model/completion journeys form three bounded paths. I inspected all eight lesson explanations and the five new task/model contracts; executable checks cover every lesson/model block and visible case. Production-browser tests exercise all eight completion paths. No extra syllabus area, SQL runner, hosted grader, payment or account was introduced. |
| Are the new algorithms and database concepts correct, with clear prerequisites and unambiguous result contracts? | Pass. Linear search stops at the first index; binary search specifies the lower midpoint and its duplicate-result rule, safe inclusive bounds and the distinction between search and input-reading cost. SQL teaching preserves record identity, explicit order/ties, primary/foreign-key roles, join cardinality, booking count versus seats, and grouped empty results. The fresh SQLite fixture and search boundary/property tests support these claims. |
| Does each published lesson, checkpoint and task have a defensible 2026 mapping and honest provenance/coverage? | Pass for source/example review. I independently opened the [official 2026 syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf) and checked references 1.2.3–1.2.5, 2.2.3, 2.2.6, 2.3.2, 3.3.1, 3.3.2 and 3.3.8 against printed pages 7, 8, 9 and 11. The selected search, control-flow and database subsets fit those outcomes. The register, lesson coverage notes and About page disclose omitted parts; task/question subsets are validated against parents. Original content and fictional data are identified. This is not independent teacher/student review. |
| Do quizzes explain mistakes without presenting completion as a grade? | Pass. Every option has an explanation, all questions must be answered before checking, and completion depends on review rather than a perfect score. Model disclosure and local self-marking are explicit. Answers/source are not persisted. Unit and browser checks cover incorrect/correct attempts and the full flow. |
| Are navigation, revision and progress correctly scoped to each path? | Pass after repair R1 below. Topic routes are nonempty/disjoint; previous/next/back links stay within their path. The incomplete filter includes a useful empty state. Missing routes return recovery links. The corrected home Python badge and topic cards have separate counts; the footer retains the global total. |
| Does old or damaged local state preserve useful progress and recover safely? | Pass. I inspected the bounded parser, per-entry validation, v1 migration, expansion of earlier three-lesson v2 data, guarded storage operations and cross-tab reset handling. Tests cover refresh, independent updates, owned-key reset, corrupt/oversized/future state, unavailable storage, failed-save memory and external reset without resurrecting progress. |
| Is the UI usable locally at narrow widths and with keyboard controls? | Pass for the stated automated/visual scope. Semantic navigation/landmarks, radio groups, disclosure controls, completion/reset controls, status messages, visible focus and fixed light-theme behavior are covered. I inspected the retained desktop and 320px screenshots; code blocks scroll within their bounds and example cells wrap. All route/viewport assertions remain enabled. Palette checks pass with minimum 5.30:1 among checked pairs. This does not certify screen readers, independent accessibility review or physical devices. |
| Are execution, privacy, validation and cost boundaries preserved? | Pass for the local change. Learner routes have no runner/editor/API execution path. Markdown skips raw HTML; validated content/link bounds and defensive progress parsing remain. No source upload, analytics, credentials, private tests or paid service was added. The developer runner tree is unchanged in the candidate diff, and .vercelignore excludes it from theory uploads. Retained production traces contain no developer-runner files. |
| Is the dependency repair constrained and maintainable? | Pass with documented limits. Next/config pins and lock entries agree at 16.4.6. The scoped minimatch override is documented as crossing a declared major range, with a removal obligation; lint/build and my direct API smoke pass. My dated npm audit reports zero known vulnerabilities. npm ls exits 0 but reports the six documented extraneous optional WASM artifacts; this is not a clean-graph or all-platform assurance. Existing ESLint deprecation remains disclosed. No direct dependency/service was added. |
| Is evidence reproducible and candid about what has not been established? | Pass for local scope. I inspected the actual baseline-to-candidate diff, test additions, evidence checker, screenshot hashes, setup/release instructions and draft PR. Checks were extended for the new catalog and design-task format without weakening overflow/time/assertion limits. Historical runner and initial beta evidence are retained. Current local results are separated from historical hosted results and all release gates. |
| Are provider and publication claims appropriately limited? | Pass as a limitation record, not provider approval. I independently opened the official [Hobby plan](https://vercel.com/docs/plans/hobby), [fair-use guidance](https://vercel.com/docs/limits/fair-use-guidelines), [terms](https://vercel.com/legal/terms) and [pentesting policy](https://vercel.com/kb/guide/penetration-testing-on-vercel). They support the recorded allowance/eligibility, changeable free-plan terms, team training opt-out and Hobby pentesting restriction. Allowance is not remaining usage. I inspected the discovery agent's access and GitHub records; no account/team/protection or candidate-CI result is inferred from public documentation or historical main CI. |

## Commands personally run

Working directory for application/Git checks:
`C:\Users\crate\Documents\ProjectALEVEL`. Node `v20.20.2`, npm `10.8.2`,
Python `3.14.5`; the SQL checker reports SQLite `3.50.4`.

On initial candidate `f376d91e9caf8fea902f92807700531a8368f60f`:

| Exact check | Result |
| --- | --- |
| `git status --short --branch`; `git rev-parse HEAD`; `git diff --stat 9da44a0b31df4c7875efaf7eee9f7949ea16bd21 f376d91e9caf8fea902f92807700531a8368f60f`; `git diff --name-status 9da44a0b31df4c7875efaf7eee9f7949ea16bd21 f376d91e9caf8fea902f92807700531a8368f60f` | Clean feature branch and expected exact candidate; inspected actual diff and focused path diffs. No remote freshness claim. |
| `npm run lint; npm run typecheck; npm run check:content; npm test` | Group completed with exit 0 and no diagnostic failure: generated route types, validated all 16 content files, 14 tests passed, zero skipped. |
| `npm run test:examples` | Exit 0: 62 ordinary Python runs, 2,966 search runs, 19 SQL queries, 8 rejected constraint cases and key-design contract. |
| `python scripts/check-contrast.py` | Exit 0: eight theme pairs, 5.30–12.62:1. |
| `python docs/beta-evidence-2026-11-12/check.py` | Exit 0: 53 local documentation targets, four screenshot hashes and eight production traces without runner files. |
| `npm run build` | Exit 0: 24 generated Next entries. Retained warning about unrelated `C:\Users\crate\package-lock.json` outside the repository. |
| `npm run test:e2e` | Exit 0: 176 passed, zero skipped, 1.5 minutes, production loopback server, two Chromium profiles/two workers. |
| `npm audit --json --ignore-scripts --fetch-retries=0 --fetch-timeout=15000` | Exit 0: zero known vulnerabilities. |
| `node --version`; `npm --version`; `python --version` | Versions above. |
| `$dependencyGraph = npm ls --all --json \| ConvertFrom-Json; $npmStatus = $LASTEXITCODE; Write-Output "npm-ls-exit=$npmStatus"; $dependencyGraph.problems` | npm exit 0; six extraneous optional WASM artifacts, matching the documented limitation. |
| `git diff --name-only 9da44a0b31df4c7875efaf7eee9f7949ea16bd21 f376d91e9caf8fea902f92807700531a8368f60f -- docs/pyodide-spike` | Empty: retained runner tree unchanged. |
| `rg -n 'pyodide\|api/run\|CodeMirror\|iframe\|eval\(\|new Worker\|fetch\(' app components lib next.config.ts`; `Test-Path -LiteralPath 'public'` | Search exit 1 means no matches in those learner implementation paths; public directory absent. |
| `git diff --check 9da44a0b31df4c7875efaf7eee9f7949ea16bd21 f376d91e9caf8fea902f92807700531a8368f60f` | Exit 0. |

I also personally ran this compatibility smoke (passed):

```powershell
node -e "const assert=require('node:assert/strict'); const path=require('node:path'); const tool=require.resolve('@typescript-eslint/typescript-estree'); const resolved=require.resolve('minimatch',{paths:[path.dirname(tool)]}); const matcher=require(resolved); assert(matcher.minimatch('.hidden.ts','*.ts',{dot:true})); assert(matcher.minimatch('app/page.tsx','app/*.{ts,tsx}',{dot:true})); assert(!matcher.minimatch('app/page.js','app/*.{ts,tsx}',{dot:true})); console.log('Scoped minimatch compatibility smoke passed');"
```

Read-only inspection used `Get-Content`, `rg --files` and Git path diffs for the
requirements, application, content, tests and records discussed above. Two
inspection-only path misses were corrected: an attempted
`Get-Content -LiteralPath 'decisions\beta-content-scope-2026-11-12.md'` found no
such record (I read the actual search/SQL mapping records), and the first runner
reference search included the absent `public` directory (rerun shown above).
Neither was an application-test failure.

On final candidate `286470949e8ea8af6639c81d0ebf22a075e75359`:

| Exact check | Result |
| --- | --- |
| `git diff f376d91e9caf8fea902f92807700531a8368f60f 286470949e8ea8af6639c81d0ebf22a075e75359` | Inspected the complete repair/evidence/readiness delta: topic prop, seeded regression, retained initial summary, updated counts and public GitHub access facts. |
| `npm run lint` | Exit 0. |
| `npm run build` | Exit 0: production rebuild and TypeScript phase passed, 24 generated entries; same unrelated parent-lockfile warning. |
| `npm run test:e2e -- tests/e2e/beta.spec.ts --grep 'home Python path progress'` | Exit 0: both desktop/mobile Chromium profiles passed against my fresh production build, 2 tests, 4.5 seconds. |
| `python docs/beta-evidence-2026-11-12/check.py` | Exit 0: 53 targets, four screenshot hashes, eight runner-free production traces. |
| `git diff --check f376d91e9caf8fea902f92807700531a8368f60f 286470949e8ea8af6639c81d0ebf22a075e75359`; `git diff --check 9da44a0b31df4c7875efaf7eee9f7949ea16bd21 286470949e8ea8af6639c81d0ebf22a075e75359` | Exit 0. |
| `git status --short --branch`; `git rev-parse HEAD` | Clean current feature branch and exact final candidate before writing this receipt. |

I inspected, rather than personally repeated, the primary agent's final full
178-case production-browser run and final typecheck record. My initial full
176-case run covers unchanged flows; my final fresh build and two-profile
regression cover the only learner-code repair. Content, progress logic,
dependencies and earlier assertions did not change in that repair. The original
176-case summary remains in `beta-evidence-2026-11-12/initial-candidate-summary.json`.
The final summary/verification record reports the primary agent's 178-case run.

Other inspected evidence: beta-verification-2026-11-12.md; the four retained PNGs
(visually inspected); evidence check.py/summary.json; mapping/security decisions;
hosting-terms-2026-11-12.md; beta-release-2026-11-12.md; draft PR; CI configuration.
I did not repeat installation, provider account/CLI reads, public GitHub reads,
physical-device work, screen-reader work or independent human teaching review.

## Finding and repair history

**R1 — incorrect home Python-path count.** Initial candidate app/page.tsx passed
no topic to ProgressBadge inside the three-lesson Python introduction. The badge
therefore counted all eight lessons, allowing search/SQL completion to change
the apparent Python-path total. Initial disposition: `CHANGES_REQUIRED`.

The primary agent repaired this in `286470949e8ea8af6639c81d0ebf22a075e75359`
using `topicId="python-control-flow"`. The regression seeds only completed
search and SQL lessons and checks the Python introduction/card stay 0 of 3,
search is 1 of 2, SQL is 1 of 3, and the global total remains 2 of 8. I inspected
the actual change and independently passed both production-browser profiles.
R1 is resolved. No other actionable local-scope finding remains.

## Verdict and limits

**SIGNED_OFF** for the exact final candidate
`286470949e8ea8af6639c81d0ebf22a075e75359` and local implementation scope above.
This receipt does not approve publication or declare the project or a full
milestone complete. A subsequent commit containing only this reviewer-authored
receipt may record the review without invalidating the candidate; any other
change requires candidate-bound re-review.

The following gates remain open and are not waived:

- Independent teacher/student educational feedback, independent accessibility/
  screen-reader review and physical-device evidence, with findings resolved.
- Current intended Vercel theory-project access, eligibility, team opt-out and
  remaining allowance; connector 403/signed-out CLI remain access limitations.
- Production theory deployment and ordinary deployed verification, candidate
  hosted CI, owner review of publicly reported unprotected main, detailed
  authenticated protection verification, and owner-controlled publication.
  Historical main CI and the protected developer runner preview are different
  evidence.
- Full Pyodide actual-host security/recovery, provider-policy, supported-device
  and practical low-memory gates plus explicit learner-activation authorization.
  Learner execution remains disabled. No hosted adversarial test or third-party
  policy contact was performed.

Milestones 3, 4 and 5 and public release therefore remain incomplete. The local
theory/quiz/offline product can be reviewed and run using the recorded setup;
this sign-off establishes only that local scope.
