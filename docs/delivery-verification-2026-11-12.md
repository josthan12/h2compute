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
Current exact reviewed D1 candidate and hosted results remain pending.
Publication must follow independent sign-off.

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

## D3 and public release

Not complete. Record PR/milestone URLs, remote SHA and exact-head hosted check
run results after each reviewed publication. Keep all human/device/hosting/
production/activation gates open until genuine applicable evidence exists.
