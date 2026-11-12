# Independent review — D2 progress recovery and PR-update readiness

Date: 12 November 2026.

Reviewer: `/root/d2_independent_review`, a separate agent started with a fresh
conversation and no model override. I did not author or repair the implementation.
I developed the checklist below from the owner request, repository requirements
and actual diff. My only tracked write is this receipt; verification generated
ordinary ignored build/browser output.

- Baseline: `54a34f687bd8ff1d6157ba7965848430039d425c`.
- Initially reviewed candidate: `3bc7bc4f375b783eac7e056698e89f3eec9f33f6`.
- Final reviewed candidate: `de40544f6d5a09ac0099cd023fe4d4a58100dca8`.
- Scope: the fifteen-file baseline-to-final D2 change: progress provider,
  progress persistence/pending helpers, optional reset channel, progress unit
  tests, new production recovery regressions, and associated README/status/
  roadmap/release/delivery/PR/evidence documentation. This is focused local D2
  and honest PR-update readiness, not completed remote delivery or full
  Milestone 3, 4 or 5 approval.

The supplied owner request authorizes autonomous, incremental defensive
improvement and repository-only push/PR delivery. I read AGENTS.md, README.md,
implementation.md, roadmap.md, current-status.md, milestone-workflow.md,
independent-review.md, the delivery plan, recovery and delivery evidence, draft
PR description, release checklist and prior D1 receipt. I preserved the current
branch and the merge/protection/production/activation/cost/privacy/contact
restrictions. I made no source edit, Git mutation, push, PR/API write, global
configuration/authentication change, dependency installation, deployment or
hosted application probe.

## Independently developed checklist

| Review question | Outcome and evidence |
| --- | --- |
| Is the increment bounded to the authorized recovery problem? | Pass. The actual fifteen-file diff changes five implementation/test files and ten documentation/evidence files. App routes, lesson/exercise content, public assets, developer runner/evidence, dependencies, CI and deployment configuration are unchanged. D3 CI work remains queued. |
| Can a failed local save overwrite a peer's unrelated saved flags on retry? | Pass for observed/readable-base recovery. Pending state contains partial local flags, not a stale complete snapshot. An explicit action reads current storage, applies pending patches, then saves. Production regressions inspect saved state for different-lesson and independent same-lesson updates. There is no cross-tab transaction/locking guarantee. |
| Do consecutive actions and completion prerequisites remain coherent? | Pass. A synchronous reference prevents consecutive actions from using stale React state; writes occur outside state-updater callbacks. The pending helper preserves completion revocation when a prerequisite is revoked/restored. Unit assertions cover separate flags, neighboring lessons and impossible/resurrected completion. |
| Can denied reads or internal sentinel values cause a destructive save? | Pass. Tagged reads distinguish unavailable storage from readable corrupt strings. An unreadable base prohibits writes while local pending work remains usable; restored access alone does not trigger a background save. Browser tests assert zero writes while reads fail, preservation of prior completion, later explicit merging, and recovery of literal `loading`/`unavailable` stored text. |
| Does reset clear pending work when the owned key is absent, and handle partial failures? | Pass within the documented fallback. Reset transiently writes an empty record to the same owned key and independently attempts removal. One notification authority is selected. Unit cases cover readable/unreadable, present/absent, write/removal failures and unrelated-key preservation. Production tests cover absent-key resets with working/missing/throwing channels, failed reset intent, failed transient writes, uncertain notification and failed removal without old-flag resurrection. |
| Does a later denied storage getter lose a genuine peer reset or accept session-storage resets? | Pass. Only the initially obtained storage identity is retained for event comparison; fresh live reads/writes still govern persistence. The production regression rejects both owned-key and null-key session-storage events, denies the getter, positively waits for peer reset to clear pending model review, restores access and verifies that a later save does not restore that model flag. Initially inaccessible identity with no usable signal remains a disclosed limitation. |
| Is the optional channel narrow, optional and cleaned up? | Pass. It carries only two fixed reset strings and uses strict equality checks, with no progress/source payload. Constructor/post failures are harmless; native storage events remain available. Listener removal, close/idempotence and ignored post-close delivery are asserted in unit tests; production malformed-message tests leave pending review intact. The provider closes its channel and removes its storage listener on cleanup. |
| Do tests exercise actual learner behavior without weakening prior coverage? | Pass. The new production tests operate the existing quiz/model/reset controls and inspect stored flags, write counts and notices. The earlier browser files/config/assertions/timeouts are unchanged. My fresh production run passed all 206 cases, including all 28 new and 178 retained cases, across the existing desktop and mobile-emulated Chromium profiles. |
| Are privacy, cost and defensive bounds preserved? | Pass for this focused inspection. The existing owned key and schema version 2 remain; encoded state is canonical lesson flags and parsing retains its 16 KiB bound. Pending state is bounded by the registered eight lessons and three boolean flags. No account, background synchronization, source storage/upload, network service, paid dependency or learner execution is introduced. The existing bounded publication checker reports no selected findings. |
| Are UI and educational claims proportionate to this change? | Pass for affected behavior. Existing semantic controls, confirmation and status announcement remain, with explicit visit-only/peer-reset fallback text. Retained keyboard/layout/journey tests passed. No lesson, question, example or syllabus mapping changed, so a new educational-content certification is inapplicable here. Human accessibility/educational review and physical-device evidence remain required. |
| Are evidence, delivery state and limitations accurate? | Pass after the correction below. D1's exact-head pass is not substituted for D2 CI. The canceled duplicate run/aggregate issue and Node 20 action warning are disclosed for D3. Local test counts, historical intermediate results, failed-reset intent, non-atomic storage, uncertain absent-key notification and initially inaccessible-tab limits are recorded. All 63 changed-document relative links resolve and both evidence JSON files parse. |

The API assumptions were also checked against the primary WHATWG specifications:
absent-key removal does not broadcast, storage events are queued for peer storage
objects, and no locking should be assumed. [Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html)
supports the bounded guarantee stated above. Broadcast delivery is scoped by
storage key/channel name, and explicit close releases the channel's active
lifetime. [Broadcasting](https://html.spec.whatwg.org/multipage/web-messaging.html#broadcasting-to-other-browsing-contexts)
supports the optional local signaling design; it is not an acknowledgment or
cross-tab transaction mechanism.

## Checks personally run

Working directory: `C:\Users\crate\Documents\ProjectALEVEL`.

Versions personally queried with `node --version`, `npm --version`,
`npx playwright --version`, and
`node -p "require('next/package.json').version"`: Node `v20.20.2`, npm `10.8.2`,
Playwright `1.64.0`, Next `16.4.6`.

On initial candidate `3bc7bc4f375b783eac7e056698e89f3eec9f33f6`:

| Exact command/check | Result |
| --- | --- |
| `git status --short`; `git branch --show-current`; `git rev-parse HEAD` | Clean expected `feat/pyodide-feasibility`, exact initial candidate. |
| `git diff --stat 54a34f687bd8ff1d6157ba7965848430039d425c 3bc7bc4f375b783eac7e056698e89f3eec9f33f6`; matching `git diff --name-only`; focused `git diff` and `Get-Content` inspections | Inspected actual fifteen-file scope, complete provider/helpers/channel and new/retained regression assertions, plus documentation/evidence/configuration. |
| `npm test` | Exit 0: 22 passed, zero failed/skipped/canceled. |
| `npm run lint` | Exit 0. |
| `npm run typecheck` | Exit 0: route generation and TypeScript passed. |
| `$env:NEXT_TELEMETRY_DISABLED='1'` followed by `npm run build` | Exit 0: fresh optimized production build, 24 generated entries. Existing warning about unrelated parent `C:\Users\crate\package-lock.json` outside this repository. |
| `git diff --check 54a34f687bd8ff1d6157ba7965848430039d425c 3bc7bc4f375b783eac7e056698e89f3eec9f33f6` | Exit 0. |
| `Get-NetTCPConnection -LocalPort 3100 -State Listen -ErrorAction SilentlyContinue` | No listener before browser verification; the empty query itself returned exit 1. No other server was reused or stopped. |
| `npm run test:e2e` | Exit 0: **206 passed (2.0 minutes)**, including all 28 new recovery cases. Two workers, existing profiles/assertions/timeouts, no failed/skipped/retried cases reported. Playwright started and terminated its production server. Existing parent-lockfile and color-environment warnings only. |
| `python docs/delivery-evidence-2026-11-12/check-publication-scope.py` | Exit 0: 235 tracked files, no selected findings. This is a bounded current-tree signature/path check, not exhaustive secret detection or a new historical audit. |
| `git diff --name-only 54a34f687bd8ff1d6157ba7965848430039d425c 3bc7bc4f375b783eac7e056698e89f3eec9f33f6 -- app content public docs/pyodide-spike scripts package.json package-lock.json .github vercel.json .vercelignore` | Empty: no protected/unrelated scope changes. |
| Inline Python link/JSON script below | Exit 0: 63 relative targets, no missing targets, fifteen changed paths and two valid JSON files. |

The full production suite includes the new regression file; I did not separately
repeat the targeted 28-case invocation. Earlier six-plus-one pre-fix failures,
the primary agent's earlier 204-case checkpoint, D1 remote publication/CI metadata
and prior beta/D1 reviews were inspected as retained evidence, not personally
reproduced or freshly fetched. I did not repeat unchanged example, contrast,
offline-driver, hosted, physical-device or screen-reader checks.

Read-only factual assistance by
`/root/d2_independent_review/d2_factual_audit` independently inspected the actual
diff, documentation/scope and 63 relative links/two JSON files. It found the
documentation attribution issue below and made no writes or verdict. I checked
the actual issue, repeated link/JSON validation, and own this checklist/verdict.

## Finding, repair and exact-candidate re-review

At the initial candidate I required one documentation correction:
`docs/delivery-verification-2026-11-12.md` attributed the earlier 204-case
checkpoint to `d2-local-summary.json`, while that JSON contained only the final
206-case result. The earlier checkpoint was already retained in the narrative
recovery record. The primary agent added the real 22-unit/26-new-browser/
204-full-browser checkpoint, marked superseded, to the JSON and recorded this
repair in the recovery document. I did not edit either file.

On final candidate `de40544f6d5a09ac0099cd023fe4d4a58100dca8`, I personally ran:

| Exact command/check | Result |
| --- | --- |
| `git status --short --branch`; `git rev-parse HEAD` | Clean expected feature branch and exact final candidate before writing this receipt. |
| `git diff 3bc7bc4f375b783eac7e056698e89f3eec9f33f6 de40544f6d5a09ac0099cd023fe4d4a58100dca8` | Inspected complete delta: only the machine-summary checkpoint and recovery-document repair note. The attribution is now supported. |
| `git diff --name-only 3bc7bc4f375b783eac7e056698e89f3eec9f33f6 de40544f6d5a09ac0099cd023fe4d4a58100dca8 -- app components lib tests .github package.json package-lock.json` | Empty. The source/test/config bytes tested above are unchanged; no additional application rerun is needed for this documentation-only correction. |
| `git diff --check 54a34f687bd8ff1d6157ba7965848430039d425c de40544f6d5a09ac0099cd023fe4d4a58100dca8` | Exit 0. |
| Final-candidate inline Python link/JSON/checkpoint script below | Exit 0: 63 relative targets, zero missing, two valid JSON files, exact earlier checkpoint asserted. |
| Listener-count query below | Exit 0: port 3100 listener count 0 after the suite. |

One inspection attempted the nonexistent `.github/workflows/ci.yml`; the actual
unchanged workflow `.github/workflows/checks.yml` was then located with `rg --files`
and read. An initial final-checkpoint assertion used an incorrect field name
and raised `KeyError`; the rerun below uses the actual field and passes. These
were reviewer inspection mistakes, not application failures or waived checks.

Exact successful final link/JSON/checkpoint script, passed as a PowerShell
single-quoted here-string to `python -`:

```python
import json,re,subprocess
from pathlib import Path
base='54a34f687bd8ff1d6157ba7965848430039d425c'
candidate='de40544f6d5a09ac0099cd023fe4d4a58100dca8'
root=Path.cwd()
names=subprocess.check_output(['git','diff','--name-only',base,candidate],encoding='utf-8').splitlines()
links=[]; missing=[]
for name in names:
    content=subprocess.check_output(['git','show',candidate+':'+name],encoding='utf-8')
    if name.endswith('.json'): json.loads(content)
    if not name.endswith('.md'): continue
    for target in re.findall(r'(?<!!)\[[^\]]+\]\(([^)]+)\)',content):
        if target.startswith(('http:','https:','#','mailto:')): continue
        target=target.split('#',1)[0]
        if not target: continue
        links.append((name,target))
        if not (root/name).parent.joinpath(target).exists(): missing.append((name,target))
summary=json.loads(subprocess.check_output(['git','show',candidate+':docs/delivery-evidence-2026-11-12/d2-local-summary.json'],encoding='utf-8'))
assert summary['earlierRepairedCheckpoint']=={'unitTests':22,'newBrowserCases':26,'fullBrowserCases':204,'fullSuiteMinutes':1.9,'supersededByFinalGetterDenialRepair':True}
print({'relative_targets':len(links),'missing':missing,'changed_paths':len(names),'json_files':len([x for x in names if x.endswith('.json')]),'earlier_checkpoint':204})
raise SystemExit(bool(missing))
```

The initial candidate used the same link/JSON loop with its initial candidate
ID, omitting the new checkpoint assertion. The final listener-count query was:

```powershell
$listeners = @(Get-NetTCPConnection -LocalPort 3100 -State Listen -ErrorAction SilentlyContinue)
[PSCustomObject]@{port=3100;listenerCount=$listeners.Count} | ConvertTo-Json -Compress
```

## Verdict and remaining gates

No actionable finding remains in this focused final candidate.

**SIGNED_OFF** for candidate
`de40544f6d5a09ac0099cd023fe4d4a58100dca8`, covering local D2 progress recovery,
the associated documentation/evidence and honest PR-update readiness only.
A following commit may contain only this reviewer-authored receipt without
invalidating the candidate. Any subsequent non-receipt change requires another
candidate and review before completed handoff.

Actual D2 publication, matching remote head and the new exact head's hosted CI
are still required for delivered D2 evidence; D1 CI is not a substitute. The
observed duplicate-check/aggregate-cancellation and action-runtime maintenance
remain separate D3 work. No all-green aggregate or full milestone completion
is asserted here.

Non-atomic concurrent writes and notification delivery to inaccessible tabs
remain documented limits. Failed reset deliberately keeps empty-base intent
until a later successful local save. Unreadable storage plus failed marker and
accepted absent removal can leave peer reset uncertain and explicitly advises
manual peer reset. These are bounded local recovery observations, not a
distributed-transaction guarantee.

Milestones 3/4/5 and public release remain open. Independent teacher/student,
screen-reader/accessibility and physical-device evidence, current intended
hosting project/allowance, reviewed production deployment and owner protection/
publication decisions are still required. Runner actual-host security/recovery,
supported-device/low-memory/provider requirements and learner activation remain
gated; hosted adversarial testing and external policy contact remain prohibited.
This receipt supplies none of that missing evidence or authorization and does
not approve merge or public release.
