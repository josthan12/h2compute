# Roadmap

**Status:** Eight-lesson theory-beta candidate is implemented locally across the three approved areas. Current checks and external release blockers are in [beta verification](docs/beta-verification-2026-11-12.md). Milestones 4/5 remain open. Milestone 3 stays NO-GO; developer-preview evidence is preserved and is separate from theory-beta deployment evidence.
**Scope:** Python programming, algorithms/data structures and relational databases/SQL only. Start with Python control flow. Browser practice follows theory; hosted grading is deferred.

Use [docs/milestone-workflow.md](docs/milestone-workflow.md) for autonomous delivery and the repeatable task/Git workflow. The agent implements, verifies, documents and makes focused local commits; the owner reviews completed milestones, pushes and opens the PR. Every completed handoff requires [independent agent sign-off](docs/independent-review.md). Existing authorization boundaries and milestone gates remain in force.

## Current incremental delivery

The owner now authorizes agent push/PR delivery for this repository only;
merge, production publication and learner activation stay gated. Follow
[D1–D3 in the delivery plan](docs/delivery-plan-2026-11-12.md) and its explicit
acceptance/fallback gates. D1 must be reviewed and integrated before the D2
progress-recovery implementation. Exact-head hosted results belong to D3;
local sign-off and CI cannot waive independent human/device/provider evidence.

## Phase 0 — Planning (completed research, conditional runtime gate)

- [x] Verify official 2026 outcomes, exclusions and partial coverage.
- [x] Investigate Judge0 and compare hosting/cost constraints; preserve dated findings.
- [x] Owner approves theory-first work, Vercel Hobby and Python control flow first.
- [x] Document Pyodide browser-practice direction, visible-test rules and theory-only fallback.
- [x] Verify repository and configured origin remote.

The [historical feasibility review](docs/phase-1-feasibility.md) is research, not evidence of live runtime/deployment success. Current decisions are in implementation.md and docs/decisions/runner-provider.md.

## Phase 1 — Minimal theory foundation

- [ ] Verify branch/CI settings; preserve existing worktree changes. Local branch and preservation verified; CI configured. Historical main checks pass (public API rechecked 12 November); no hosted CI for the current candidate. Main is publicly reported unprotected; detailed authenticated verification/owner review remain open.
- [x] Set up Next.js/TypeScript, Tailwind CSS/daisyUI as the styling system and relevant lint/typecheck/tests/build/CI.
- [x] Load Git-based content with validated metadata, numeric syllabus references and internal links.
- [x] Establish readable responsive navigation and accessible lesson/quiz components.
- [x] Add defensive versioned local progress, refresh persistence and reset.
- [x] Prove one original Python control-flow lesson → quiz → offline practice/model explanation → completion journey.

**Local exit:** one theory journey works without an editor, runner dependency or execution backend. See [verification](docs/milestone-1-verification.md). Milestone 1 checks passed per owner; branch protection and deployment remain pending; this is not public-beta release evidence.

## Phase 2 — First complete theory topic

The three-lesson implementation and local checks are recorded in [Milestone 2 verification](docs/milestone-2-verification.md). Independent teacher review, real devices, screen readers and deployment remain separate review/release limits.

- [x] Complete sequence/branching, counted/conditional loops and combined flow/tracing lessons.
- [x] Include prerequisite refresher, worked examples, misconceptions and explanatory quizzes.
- [x] Add original practice prompts/model explanations and local self-marked completion.
- [x] Review precise 2026 mappings and test every Python example locally.
- [x] Verify keyboard/mobile use, refresh/reset and corrupted-storage recovery. Layout checks now use independent route/viewport cases; the 13 October follow-up passed all 82 desktop/mobile Chromium tests.

**Exit:** the bounded Python control-flow topic provides a connected revision journey. This is not complete Python or full-syllabus coverage.

## Phase 3 — Browser Python feasibility, then practice

- [x] Pin/review Pyodide 314.0.7 / CPython 3.14.2; choose five core runtime files and retain MPL/CPython notices.
- [x] Prepare retained compiled third-party notices and Pyodide source availability for a local reviewable static preview.
- [x] Prepare a local preview package and exact proposed host headers with versioned assets, existing opaque-frame CSP and disabled learner controls. Owner-authorized publication, CLI workspace access and confirmed model-training opt-out are recorded in [Vercel setup](docs/vercel-setup-2026-10-13.md).
- [ ] Verify asset sizes, loading/cache/CORS/CSP on the deployment; budget host bandwidth. All 57 ordinary authenticated GET hash/header checks passed. The 15 October three-job hosted Chromium check also passed basic I/O/startup, same-page reuse, reload disk caching and successful cleanup. Remaining allowance and other supported browsers/devices are unverified; this full gate remains open.
- [ ] Prototype isolated iframe + module worker; prove main-site storage/DOM/cookie/navigation and unauthorized network separation.
- [ ] Verify supplied stdin/stdout, syntax/runtime errors, infinite loops, output floods, cancellation, fresh case/job state and stale-message rejection.
- [ ] Check supported desktop/mobile startup and memory/performance limitations.
- [ ] If feasible, add CodeMirror and a replaceable Pyodide adapter with Run, Stop/Reset and Check examples.
- [ ] Use visible cases and local self-check labels; no hidden tests or trusted-grade claims.
- [ ] Keep theory usable during runtime failure; preserve editor text and progress.

Local progress and exact evidence are in [Milestone 3 verification](docs/milestone-3-verification.md). Remaining boxes retain their full deployment/device/activation requirements; local evidence alone does not complete them. Hosted adversarial probes remain blocked on Hobby under the reviewed policy. The [15 October continuation](docs/milestone-3-verification.md#benign-hosted-chromium-verification--15-october-2026) passed the bounded benign Chromium startup/cache check. The [local desktop continuation](docs/pyodide-spike/DESKTOP-CHECK.md) fixes WebKit stdlib loading and passes source recovery/authored examples plus Chromium/WebKit candidate smoke checks. The old hosted package remains preserved with its historical WebKit defect. The [20 October continuation](docs/pyodide-spike/CONTINUATION-20261020.md) verifies a private Firefox cache, local Firefox/WebKit boundary probes, bounded desktop resource observations and a new protected preview of the reviewed package. All 57 ordinary delivery checks and three fixed jobs per Chromium/Firefox/WebKit pass there. Actual-host security/recovery, physical devices, genuine low-memory behavior, supported-device policy and remaining allowance remain unresolved. The owner keeps external contact blocked; the policy draft is unsent. No checkbox advances.

**Exit:** implementation.md Gate 3 passes before browser activation. If it fails, retain theory/quizzes and offline practice; do not add a paid/hosted service by assumption.

## Phase 4 — MVP content and beta hardening

- [x] Implement connected source-mapped lessons within the three confirmed areas: 3 Python, 2 searching-list and 3 relational/SQL journeys. Independent teacher/student review remains open below; counts remain flexible.
- [x] Display published partial mappings, planned expansion and explicit unlisted/uncovered outcomes with related revision links.
- [x] Add local incomplete filtering per topic and validate content/links in the existing CI command. Local checks pass; hosted CI for this candidate remains unverified.
- [x] Provide privacy/attribution and a verified active feedback issue tracker (external GitHub sign-in disclosed). Optional donation setup is deferred.
- [ ] Recheck Vercel Hobby terms/usage, verify production deployment and run relevant automated/manual checks.
- [ ] If browser practice ships, verify runner security/recovery on deployed browsers and disclose self-check limitations.
- [ ] Obtain student/teacher feedback and resolve serious accuracy/accessibility/security problems.

**Local scope:** eight complete offline learning journeys and applicable automated checks; independent candidate review is required. **Milestone exit remains open:** external educational/accessibility/device and production release evidence is missing. A worthwhile theory beta has honest coverage and no mandatory runner. Runtime controls appear only if the browser gate passes.

## Phase 5 — Public beta and portfolio evidence

- [ ] Publish site/repository, setup guidance, screenshots and known limitations.
- [x] Prepare local beta release notes, correction route and dated mapping/security decisions. Public-release validation and feedback-led corrections remain pending.
- [ ] Draft resume claims only from shipped features and measured evidence.

## Later / deferred

Hosted grading (Judge0 or another provider), private tests and server execution API; self-hosted sandbox; extra languages; SQL execution; Flask/multi-file projects; accounts/cloud sync; dashboards; AI tutoring; social/gamification; paid features; large-scale analytics.

## Definition of done

Acceptance criteria and precise syllabus mapping; original reviewed content; meaningful relevant tests/build checks; accessible responsive states; error recovery; updated docs/status; no secrets/personal data; honest local self-check results. Independent agent sign-off on the final candidate is required before presenting completion; full milestone sign-off must cover every exit criterion. Paid services or broader scope require separate owner authorization.
