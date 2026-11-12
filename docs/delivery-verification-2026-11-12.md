# Incremental delivery evidence — 12 November 2026

Read with [D1–D3 plan](delivery-plan-2026-11-12.md). Baseline clean
`feat/pyodide-feasibility` at `5a3be84`. Only this repository and
`josthan12/h2compute` may be mutated. No branch switch/history rewrite, merge,
production deployment, protection change, learner activation, paid service,
global configuration change or third-party policy message is authorized.

## D1: bounded repository delivery

Implemented candidate scope: current authority/acceptance/fallback records;
bounded/pinned CI with credential persistence disabled and seven-day failure
artifact retention; existing offline driver test script; Vercel Git automatic
deployment hold; honest full-branch draft PR and milestone definitions.

Official sources checked:
[Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration)
supports boolean `git.deploymentEnabled: false` for disabling automatic Git
deployments. This is repository-local configuration, not a change to a provider
project or another repo. Manual/deploy-hook paths are not authorized by this
setting. [GitHub concurrency guidance](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)
supports a bounded cancelable source-branch group with explicit push fallback;
the group includes the source repository so forks with equal branch names do
not cancel each other.

The four existing actions are pinned to official tag commits read on this date:

| Action tag | Exact commit |
| --- | --- |
| actions/checkout v4 | `11d5960a326750d5838078e36cf38b85af677262` |
| actions/setup-node v4 | `49933ea5288caeca8642d1e84afbd3f7d6820020` |
| actions/setup-python v5 | `a26af69be951a213d495a4c3e4e4022e16d87065` |
| actions/upload-artifact v4 | `ea165f8d65b6e75b540449e92b4886f43607fa02` |

Sources: `https://api.github.com/repos/actions/<action>/git/ref/tags/<tag>`;
all resolved directly to commits. Deliberately review/re-pin official action
commits when updating. No direct package or service is added. The offline
driver script runs only four import-guarded Node test modules; it neither
downloads a runtime nor executes a hosted probe. Real runner/device gates are
unchanged.

### Commands and observations

All Git/GitHub commands target the original repository root explicitly. Existing
GitHub CLI **2.97.0**, active account `josthan12`, current repo ADMIN access.
Authentication/global Git protocol/configuration was read but not changed.

| Exact command | Observation |
| --- | --- |
| `git status --short --branch`; `git log -6 --oneline`; `git branch -vv` | Clean baseline/current feature branch and preserved other worktree/refs. |
| `gh --version`; `gh auth status --hostname github.com` | Existing CLI/auth available; no login or config command. No token exposed. |
| `gh repo view josthan12/h2compute --json nameWithOwner,isPrivate,isArchived,defaultBranchRef,viewerPermission,url` | Correct public active repo, main default, ADMIN. |
| `git -c credential.helper= -c 'credential.helper=!gh auth git-credential' ls-remote --heads https://github.com/josthan12/h2compute.git refs/heads/main refs/heads/feat/pyodide-feasibility` | Exit 0; main at `092dc5f3014a64e5a3d6255dac6ecfb784790769`, feature ref absent. No SSH/fetch/config mutation. |
| `gh pr list --repo josthan12/h2compute --state all --head feat/pyodide-feasibility --json number,url,state,isDraft,headRefOid,title` | No existing branch PR. |
| `gh api 'repos/josthan12/h2compute/milestones?state=all&per_page=100' --jq '.[] \| {number,title,state}'` | No existing milestones. |
| `gh api repos/josthan12/h2compute/commits/main/check-runs --jq '.check_runs[] \| {name,status,conclusion,app:.app.slug}'` | Existing main has successful GitHub Actions verify; not new-head evidence. |
| `gh api repos/josthan12/h2compute/hooks --jq '.[] \| {id,active,events,name}'` | No repository webhook metadata returned. This does not rule out GitHub App/provider integrations; deployment hold is explicit. No URLs/secrets printed. |
| `python docs/.temp/check-publication-scope.py` | Initial 223 tracked files; no tracked private environment/runtime-distribution files or matches for selected real-token/private-key patterns. Retained checker at `docs/delivery-evidence-2026-11-12/check-publication-scope.py` for rerun after staging. A bounded redacted scan, not a comprehensive secret audit. |
| `npm run test:runner-drivers` | Primary and implementation agent each ran: exit 0, 8 passed, no skips. Imports validate drivers only; no browser launch, runtime or network job. |
| `npm run lint` | Implementation agent ran: exit 0. |
| `npm run typecheck` | Primary ran: exit 0. |
| `$env:NEXT_TELEMETRY_DISABLED='1'; npm run build` | Implementation agent ran: exit 0; 24 Next entries, pre-existing unrelated parent-lock warning. |
| `git --no-optional-locks diff --check -- .github/workflows/checks.yml package.json vercel.json` | Implementation agent ran: exit 0. |

Implementation agent also parsed the YAML with installed `js-yaml` and package/
Vercel JSON with `JSON.parse`; no parser dependency was added. The current
application source and browser assertions are unchanged from the beta's 178-case
production run. D1 therefore repeats relevant configuration/driver/lint/type/
build checks; exact-head Linux CI will execute the complete pipeline after
reviewed publication. No fresh local browser run is claimed for D1.

The three proposed open milestones are retained in
`docs/delivery-evidence-2026-11-12/milestones.json` before remote mutation.
At this prepublication snapshot, the exact reviewed D1 candidate and hosted
results were pending. Publication required independent sign-off; the subsequent
actual review, publication and hosted results are recorded below.

### Noninteractive publication transport

The GH CLI OAuth credential's reported scopes do not include `workflow`, which
[GitHub documents](https://docs.github.com/en/enterprise-cloud%40latest/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)
as required for new workflow-file content. No token refresh/login or global
credential/configuration change was attempted. A strict, noninteractive read
probe of the existing SSH transport failed with `Permission denied (publickey)`:

```powershell
git -c 'core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=yes' ls-remote --heads git@github.com:josthan12/h2compute.git refs/heads/main refs/heads/feat/pyodide-feasibility
```

That read probe did not push or alter keys, host checking or remote state.
Publication uses HTTPS only. A redacted read of existing `credential.helper`
reported `manager`; `git credential-manager github list` reported only the
existing `josthan12` account. No credential value was printed.

```powershell
$env:GIT_TERMINAL_PROMPT='0'; $env:GCM_INTERACTIVE='Never'; git -c credential.interactive=never push --dry-run https://github.com/josthan12/h2compute.git HEAD:refs/heads/feat/pyodide-feasibility
```

The dry run exited 0 and reported the new feature ref would be created. It did
not publish a ref and does not prove the server will accept workflow-file
updates on an actual push. Use the existing manager without configuration or
scope changes; if the actual reviewed push is rejected, preserve local work,
record the exact rejection and continue independent authorized work rather than
broaden credentials or force-push.

The first independent review attempt was interrupted before writing a receipt
by an agent usage limit. After the owner said to continue, the same reviewer
resumed with its own earlier checks preserved. No sign-off was invented for
that interrupted attempt.

## D2 discovery evidence (not fixed by D1)

Agent `/root/hardening_audit_next` reproduced both failures against the existing
local production build with elevated loopback server/browser. No files were
modified and all owned processes were stopped. It ran
`node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3111`
and inline Playwright probes (headless installed Chromium revision 1248).
Sandbox browser launch first failed `3221225506`; sandbox/elevated loopback
surfaces could not communicate, so successful probes used the same elevated
local context. No install or hosted test occurred.

1. A's checkpoint save throws `QuotaExceededError`; B saves another checkpoint.
   Saved flags before A's retry: first `false`, second `true`. Restore A's
   setter and retry: first `true`, second becomes `false`. Stale memory masks
   the latest saved state and overwrites B's work.
2. With no saved key, A's first save fails. B confirms reset, but removing an
   absent key emits no storage event. A stays reviewed in memory and can later
   write that pre-reset work back. Existing seeded-key reset tests miss this.

D2 must cover pending patches, unreadable-storage recovery and reset intent;
an exact-candidate review and production-browser evidence are required before
claiming either defect fixed.

### D2 regressions before implementation

The implementation agent added production-browser regressions before changing
the app and ran:

```powershell
npx playwright test tests/e2e/progress-recovery.spec.ts --project=desktop-chromium --grep 'failed-save retry preserves|unreadable storage|absent-key peer reset' --workers=2
```

Exit 1, all six selected cases failed as intended. A different-lesson retry
lost the peer's saved flag; the same-lesson case hid an externally reviewed
model beneath stale pending memory; unreadable-but-writable storage immediately
lost the displayed checkpoint; three absent-key reset/channel modes missed the
peer reset. These establish the gap in the old implementation, not a completed
fix. Existing tests, assertions and timeouts were retained. Subsequent results
and the exact repair candidate must be recorded separately.

The [D2 recovery record](progress-recovery-2026-11-12.md) now retains the bounded
implementation, fallback limits, additional getter-denial regression and final
local **206-case** production run. Its [machine summary](delivery-evidence-2026-11-12/d2-local-summary.json)
distinguishes the six plus one pre-fix failures, earlier 204 checkpoint and final
28 new/178 retained cases. Independent review and exact-head hosted D2 results
remain separate from D1's already successful run.

## D3 and public release

D3 is not complete. The PR, milestones and D1 hosted result are recorded below;
the latest D2/D3 head must receive its own review and hosted verification.
Keep all human/device/hosting/production/activation gates open until genuine
applicable evidence exists.

## D1 actual publication and hosted verification

Independent reviewer `/root/d1_independent_review` signed off candidate
`ae7256d8bb62ea831ef06c927899b2b4fa0fba37` for local D1/draft-publication
readiness. Its verbatim receipt-only commit is
`54a34f687bd8ff1d6157ba7965848430039d425c`. The actual noninteractive HTTPS
push succeeded; the existing manager accepted the workflow updates without
changing auth scopes/helpers or global configuration. A subsequent GitHub ref
read exactly matched the local full head SHA.

The reviewed milestone payloads created three **open** milestones:
[browser feasibility](https://github.com/josthan12/h2compute/milestone/1),
[content/hardening](https://github.com/josthan12/h2compute/milestone/2), and
[public beta](https://github.com/josthan12/h2compute/milestone/3).
[Draft PR #3](https://github.com/josthan12/h2compute/pull/3) targets main with
the expected feature head and content/hardening milestone. It was attached to
the Codex chat. No merge, protection change or deployment command was run.

The exact-head [pull-request run 43153217623](https://github.com/josthan12/h2compute/actions/runs/43153217623)
completed successfully on Linux, 12 November 2026 at 12:14:52 SGT. It validated
all 16 content files, 14 unit tests, eight offline driver tests, 62 ordinary
Python runs, 2,966 search runs, 19 SQL queries/eight rejected constraints,
contrast, build and **178 browser cases**. Hosted example versions were Python
3.14.10 / SQLite 3.46.1, distinct from the local Windows versions.

The prior push run `43153107718` was canceled by the PR run, not passed. The
aggregate PR state is still `UNSTABLE` because both same-head checks remain
visible. Logs also warn that the old pinned checkout/setup actions target
deprecated Node 20 and are forced to Node 24. These observed delivery issues
are queued as a separate D3 CI correction after D2 integration; they are not
hidden or counted as an all-green aggregate result.

Exact remote commands (repository root):

```powershell
$env:GIT_TERMINAL_PROMPT='0'; $env:GCM_INTERACTIVE='Never'; git -c credential.interactive=never push https://github.com/josthan12/h2compute.git HEAD:refs/heads/feat/pyodide-feasibility
gh api repos/josthan12/h2compute/git/ref/heads/feat/pyodide-feasibility --jq .object.sha
gh api --method POST repos/josthan12/h2compute/milestones --input docs/.temp/milestone-3.json --jq '{number,title,state,html_url}'
gh api --method POST repos/josthan12/h2compute/milestones --input docs/.temp/milestone-4.json --jq '{number,title,state,html_url}'
gh api --method POST repos/josthan12/h2compute/milestones --input docs/.temp/milestone-5.json --jq '{number,title,state,html_url}'
gh pr create --repo josthan12/h2compute --base main --head feat/pyodide-feasibility --draft --no-maintainer-edit --title "Deliver theory beta and preserve gated browser feasibility" --body-file docs/delivery-pr-description-2026-11-12.md --milestone "Milestone 4 - Theory beta content and hardening"
gh pr checks 3 --repo josthan12/h2compute --watch --interval 10
gh run view 43153217623 --repo josthan12/h2compute --json headSha,status,conclusion,url,updatedAt,jobs
gh run view 43153217623 --repo josthan12/h2compute --log | rg 'Validated |Passed [0-9]+|# pass |[0-9]+ passed|Python [0-9]|Node.js|Version:'
```

The three temporary payload files were generated verbatim from the reviewed
`milestones.json` array. Mutations and target/head/milestone reads exited 0.
The aggregate watch displayed both the successful active run and canceled old
run; direct run metadata establishes the actual conclusion. A compact
[remote receipt](delivery-evidence-2026-11-12/d1-remote-receipt.json) retains IDs,
counts and this limitation. It is not production/provider or human evidence.

## D2 actual publication and hosted verification

Independent reviewer `/root/d2_independent_review` signed candidate `de40544`
after its evidence attribution correction and independent 206-case production
run. Receipt-only commit/head
`c7cc59ad394c61a9e822183bd2d7e34791dc869c` was pushed over the same explicit
noninteractive HTTPS feature ref. The remote SHA matched; PR #3's reviewed body
was updated and it remained draft under milestone 4.

The [exact-head Linux run 43157461908](https://github.com/josthan12/h2compute/actions/runs/43157461908)
completed successfully on 12 November 2026 at 12:53:08 SGT. Logs confirm 206
browser cases (1.0 minute), 22 unit tests, eight offline driver tests, 16 content
files and all authored Python/search/SQL/constraint, contrast and build checks.
Hosted versions were Node 22.23.4, npm 10.9.9, Python 3.14.10 and SQLite 3.46.1.
The [D2 remote receipt](delivery-evidence-2026-11-12/d2-remote-receipt.json)
retains the full head, job ID and exact counts. No D1 result was substituted.

```powershell
gh run watch 43157461908 --repo josthan12/h2compute --exit-status --interval 10
gh run view 43157461908 --repo josthan12/h2compute --json headSha,status,conclusion,updatedAt,url,jobs
gh run view 43157461908 --repo josthan12/h2compute --log | rg 'Validated |# pass |Passed [0-9]+|[0-9]+ passed|node: v|npm: |Successfully set up'
```

These reads/watch exited 0 and confirmed the run's successful conclusion. The
superseded push run `43157456245` was canceled; the observed aggregate PR state
remained `UNSTABLE`, with the same old-action warning. D3 therefore follows as
its own [CI maintenance slice](ci-maintenance-2026-11-12.md), with learner source
held unchanged. Current local structural/lint/offline checks pass; exact-candidate
D3 review and actual single-head/aggregate hosted proof remain pending.
