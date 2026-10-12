# Current Status

**Last updated:** 12 October 2026
**Overall status:** Milestone 1 theory foundation implemented and locally verified; publication deferred
**Implementation:** Next.js App Router/TypeScript, Tailwind CSS/daisyUI, validated Git Markdown, one original sequence/selection lesson and explanatory checkpoint, offline practice/model, and versioned local completion/reset. Browser execution is absent. See [verification](docs/milestone-1-verification.md).

## Confirmed decisions

- MVP areas: Python programming; algorithms and data structures; relational databases and SQL.
- Build theory lessons, checkpoint quizzes, offline practice/model explanations and local progress first.
- First bounded topic: Python control flow, beginning with one complete learning journey.
- Next.js App Router/TypeScript, Markdown/MDX in Git and Vercel Hobby; no paid upgrades or extra services.
- Evaluate Pyodide for later Python-only browser practice behind a replaceable adapter. Activation depends on isolation, compatibility and resource checks.
- Browser tests and expected outputs are visible; results are local self-checks. Hosted grading/private tests are deferred.
- Theory/quizzes beta can launch without browser execution if its gate fails.
- No accounts, analytics, database, ads or paywall; voluntary donations never affect learning access.
- No official SEAB/MOE/NUS affiliation claims; no full-syllabus coverage promise.

## Repository and research

Repository and origin remote verified: git@github.com:josthan12/h2compute.git. Branch protections and host deployment are unverified. The worktree already contained status/roadmap/report changes, deletions of old research artifacts and an untracked docs/tmp directory before this update; preserve them. No commit or push was requested or performed.

The [historical Phase 1 review](docs/phase-1-feasibility.md) records verified 2026 outcomes, exclusions and hosting/Judge0 findings. Its hosted-only recommendation is superseded by the [runner decision](docs/decisions/runner-provider.md) and implementation.md. Official Pyodide/MDN documentation was checked; no runtime feasibility result is claimed.

## Remaining work and limits

1. Complete the remaining loop and combined-flow/tracing lessons in Milestone 2; the first journey is locally verified.
2. Review original content and item-level outcome coverage; verify code examples and accessibility.
3. Verify Vercel deployment/free limits before release.
4. After theory works, test a pinned Pyodide version, asset delivery, isolated frame/module-worker loading, origin/storage/network boundaries, supplied input, output bounds, Stop/Reset, state reset and mobile/desktop resource costs. A worker alone is not a sandbox; browser memory limits are not strict server-style quotas.
5. Add editor/public-example self-check practice only if those gates pass. Source/input remain on-device; disclose runtime asset requests separately.

Judge0 public-use, billing, privacy and security questions are deferred hosted-grading issues, not blockers for theory or a validated browser runner. No hosted account, credential, private tests or execution API is needed for MVP.

## Saved workflow

Follow [docs/milestone-workflow.md](docs/milestone-workflow.md) for each milestone and task. Implementation branch: feat/project-setup in a separate worktree at `C:/Users/crate/.codex/visualizations/2026/10/12/01a13043-c2df-7d22-a909-f11f2c7dca0a/project-setup`. The owner authorized this exception on 12 October 2026. After the owner fetched origin using their SSH key, main and origin/main both matched 568d525. The original docs/milestone-workflow checkout and its dirty planning changes remain untouched. Approved planning documents were copied into the new worktree before implementation; these inherited changes appear alongside the feature diff. No stash, commit, push, PR or merge was performed. Future SSH operations must be requested from the owner and wait for their completion.

## Next actions

1. Review the locally verified Milestone 1 changes and inherited planning-document copies; hosted CI/branch protection are still pending.
2. Complete the bounded three-lesson Python control-flow topic and verify the theory journey.
3. Run the browser feasibility spike; then add Pyodide/CodeMirror if feasible or retain offline self-check practice.
4. Expand reviewed content within the three areas, harden and deploy the beta.

## Change log

- 2026-10-12: Initial planning and priority-topic beta documented.
- 2026-10-12: Syllabus/hosting/Judge0 research completed; theory-first fallback proposed.
- 2026-10-12: Owner approved theory-first work and reported repository/remote setup.
- 2026-10-12: Owner requested the Pyodide planning revision. Updated runner architecture, content/test rules, acceptance gates and implementation sequence; application work remains unstarted.
- 2026-10-12: Saved the reusable milestone/Git workflow and continuation prompts; linked contributor/roadmap/build documents. Owner authorized the docs branch while preserving existing changes. No application implementation or publication.

- 2026-10-12: Implemented the first complete theory learning journey on the isolated feat/project-setup worktree. Updated setup, coverage, validation, local progress, tests and CI configuration. No deployment or browser runner; see the verification record for exact checks and limits.

- 2026-10-12: Owner requested Tailwind CSS with daisyUI during Milestone 1. Converted the existing shared journey controls and notes layout, exact-pinned local CSS build dependencies, and documented the choice in docs/decisions/ui-styling.md. The runner remains deferred.
