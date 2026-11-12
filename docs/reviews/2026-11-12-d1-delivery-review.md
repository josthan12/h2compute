# Independent review — D1 local delivery and draft publication readiness

Date: 12 November 2026.

Reviewer: `/root/d1_independent_review`, a separate agent started with a fresh
conversation (`fork_turns: "none"`), without a model override. I did not author
or repair the implementation. I wrote only this receipt. I derived the review
questions below from the owner request and repository requirements.

- Baseline: `5a3be845b1fcea139b7da0445252a252fa0c93c6`.
- Initially inspected candidate: `2f8860eb09712b8d311e5aa33c35546542155db0`.
- Final reviewed candidate: `ae7256d8bb62ea831ef06c927899b2b4fa0fba37`.
- Saved main used to inspect publication scope:
  `092dc5f3014a64e5a3d6255dac6ecfb784790769`.
- Scope: the twelve-file baseline-to-final D1 change, its authority/plan,
  bounded CI, offline driver command, repository-local Vercel automatic Git
  deployment hold, proposed open milestones and honest full-branch **draft** PR
  description. This is local D1 and draft-publication readiness, not completed
  publication, hosted CI, merge, production release or full milestone approval.

The supplied owner request authorizes autonomous incremental improvement and
repo-only push/PR delivery while preserving existing work. I read AGENTS.md,
README.md, implementation.md, roadmap.md, current-status.md, milestone-workflow.md,
independent-review.md, the D1–D3 plan/evidence, draft PR, milestone definitions,
release record and prior local beta receipt. Current-branch, merge, protection,
production, activation, cost, privacy and external-contact restrictions remain.
I performed no push, PR/milestone mutation, branch change, authentication change,
global configuration change, SSH command, deployment or hosted application test.

## Independently developed checklist

| Review question | Outcome and evidence |
| --- | --- |
| Does this increment have a clear deliverable and preserve the owner's narrower boundaries? | Pass for local scope. D1 config/delivery, D2 reproduced progress repair and D3 exact-head evidence are distinct. Current authority supersedes only the older owner-only push/PR wording; it does not authorize merge, production, protection or runner activation. No D2 app implementation is included. |
| Can untrusted PR code obtain unnecessary repository credentials or turn CI into a deployment/hosted runner job? | Pass for this workflow. It uses ordinary push/pull_request triggers, `contents: read`, checkout credential persistence disabled, no secrets/context interpolation into shell commands, no deployment step and no hosted runner driver invocation. All four actions are pinned to forty-character commits independently matched to official tag refs. |
| Are CI resources bounded without weakening the existing checks? | Pass. The existing verification pipeline is retained; eight offline driver unit tests are added. The job has a 20-minute timeout, cancelable workflow/source-repository/source-branch concurrency, and seven-day failure artifact retention. Push has an explicit context fallback; distinct fork repositories do not share the same branch key. Superseded cancellation is not claimed as a successful replacement check. Exact-head hosted behavior remains to be observed. |
| Does the added test command remain offline on Linux as well as Windows? | Pass for static/import and local execution scope. The command names exactly four existing Node test modules. Their imported drivers put browser launch, runtime/package reads, authentication, subprocesses and writes inside functions protected by direct-entry guards. Importing the functions from a test file cannot satisfy those guards. I inspected the complete four drivers and tests and independently passed all eight tests without a browser/runtime download or launch. This does not prove runner feasibility. |
| Does publication avoid implicitly approving a Vercel release? | Pass for the configuration claim. `vercel.json` parses and sets `git.deploymentEnabled` to boolean false, which official Vercel documentation supports for disabling automatic Git deployments. `.vercelignore` continues to exclude the developer runner. This is not evidence about other providers, manual/deploy-hook paths, a real production deployment or current hosting allowance. |
| Are transport, authentication failure and remote targeting claims honest? | Pass for the documented plan. Explicit HTTPS targets only `josthan12/h2compute` and the named feature ref, with existing Git Credential Manager authentication and interaction disabled. No token-scope refresh, global helper change, force push or SSH publication is proposed. The failed strict SSH read probe is disclosed. The dry run is explicitly not publication or proof that workflow updates will be accepted. Actual auth/ref mismatch or rejection must stop affected publication while preserving local work. I inspected the primary agent's transport evidence; I did not repeat authentication or remote probes. |
| Does the draft describe the entire unpublished branch and its known limitations? | Pass for draft readiness. The saved-main diff has 193 changed paths at the initial D1 candidate, versus 186 at the D1 baseline; this includes earlier developer-only feasibility code/notices/evidence. The PR explicitly discloses that combined scope, disabled learner execution, dated scoped receipts and outstanding gates. It does not present a theory-only diff or claim full Milestones 3/4/5. D2's reproduced recovery defects are disclosed and are not claimed fixed. Proposed milestones 3/4/5 are all open and preserve their exit criteria. |
| Is public publication free of detected credential/runtime-distribution exposure, and are learner boundaries preserved? | Pass for the bounded inspection, not an exhaustive secret certification. My current-tree checker passes at both candidates. A separate read-only factual audit by `/root/d1_independent_review/publication_boundary_check` inspected all 19 then-unpublished commit objects and all snapshot blobs, including deleted historical paths: 332 unique blobs, 230 paths, 4,958,196 bytes, ten binary blobs and 41 structured JSON blobs. It reported no selected sensitive-path/credential findings. I inspected its command/results/limits. The final delta is only two manually inspected documentation files and has no credential values. D1 changes no app/components/lib, runner source, public assets, dependency graph or learner data flow. |
| Are evidence and fallback statements reproducible without overclaiming? | Pass. My lint/type/build, config parsing, driver tests, whitespace and relative-link checks pass. The prior beta receipt binds its own source/example/browser claims to candidate `286470949e8ea8af6639c81d0ebf22a075e75359`; D1 does not alter that learner source or assertions. The interrupted review has no invented prior receipt. Fresh Node 22/Linux CI, actual publication and remote metadata remain pending. No new direct dependency, paid service, account or privacy expansion is introduced. |
| Must educational content, UI, device and production acceptance be re-certified here? | Inapplicable to this focused config/documentation approval: D1 changes no learner UI, educational content, examples or browser assertions. I inspected the prior scoped beta receipt rather than repeating its syllabus, example, screenshot or full browser review. Independent human/accessibility/physical-device and production requirements remain open and cannot be replaced by this review. |

## Checks personally run

Application/Git working directory: `C:\Users\crate\Documents\ProjectALEVEL`.
Versions personally read with `node --version`, `npm --version`, and
`python --version`: Node `v20.20.2`, npm `10.8.2`, Python `3.14.5`.

On `2f8860eb09712b8d311e5aa33c35546542155db0`:

| Exact command/check | Result |
| --- | --- |
| `git status --short --branch`; `git rev-parse HEAD`; `git rev-parse 5a3be84`; `git rev-parse --show-toplevel` | Authorized original-root execution confirmed a clean `feat/pyodide-feasibility`, exact candidate, full baseline and repository root. Initial sandbox status failed with `must be run in a work tree`; elevated read-only execution resolved that environment issue. |
| `git diff --name-status 5a3be84 2f8860eb09712b8d311e5aa33c35546542155db0`; `git show --stat --oneline 2f8860eb09712b8d311e5aa33c35546542155db0`; focused `git diff` path inspections | Inspected the actual twelve-file implementation/documentation diff and full-main publication statistics/history, rather than relying on dispatch prose. |
| `git diff --check 5a3be845b1fcea139b7da0445252a252fa0c93c6 2f8860eb09712b8d311e5aa33c35546542155db0` | Exit 0. |
| `npm run test:runner-drivers` | Exit 0: eight passed, zero failed/skipped/canceled. |
| `npm run lint` | Exit 0. |
| `npm run typecheck` | Exit 0: route type generation and TypeScript passed. |
| `$env:NEXT_TELEMETRY_DISABLED='1'; npm run build` | Exit 0: fresh production build, 24 generated entries. Same pre-existing warning about unrelated `C:\Users\crate\package-lock.json` outside the repository. |
| `python docs/delivery-evidence-2026-11-12/check-publication-scope.py` | Exit 0: 229 tracked files, no selected findings. |
| Configuration parse/assertion script below, piped to `node` using a PowerShell single-quoted here-string | Exit 0: workflow, package, deployment hold and all three open milestone records parse and satisfy the stated structural checks. No dependency added. |
| Relative-link script below, piped to `python -`, initially with the earlier candidate ID | Explicit UTF-8 rerun exited 0: 38 relative documentation targets, no missing target. The initial inspection script used Windows default decoding and failed with `UnicodeDecodeError`; this was corrected, not treated as an application failure. |

I personally read the four official action tag refs using:

```powershell
$actions=@(@('checkout','v4'),@('setup-node','v4'),@('setup-python','v5'),@('upload-artifact','v4')); foreach($action in $actions) { $uri='https://api.github.com/repos/actions/'+$action[0]+'/git/ref/tags/'+$action[1]; $ref=Invoke-RestMethod -Uri $uri -Headers @{Accept='application/vnd.github+json'} -TimeoutSec 20; [PSCustomObject]@{action=$action[0];tag=$action[1];type=$ref.object.type;sha=$ref.object.sha} | ConvertTo-Json -Compress }
```

Exit 0; all refs resolved directly to commits matching the workflow:
checkout `11d5960a326750d5838078e36cf38b85af677262`, setup-node
`49933ea5288caeca8642d1e84afbd3f7d6820020`, setup-python
`a26af69be951a213d495a4c3e4e4022e16d87065`, upload-artifact
`ea165f8d65b6e75b540449e92b4886f43607fa02`. The web reader could not open the
API endpoints; the scoped read-only REST lookup above succeeded.

I independently opened official [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration),
[GitHub concurrency guidance](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)
and [GitHub OAuth scopes](https://docs.github.com/en/enterprise-cloud@latest/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps).
They support the boolean deployment hold, cancelable groups/fallback and
workflow-file permission limitation respectively. They do not prove the current
credential's ability to publish.

Configuration assertion script, executed as a single-quoted here-string piped
to `node`:

```javascript
const fs=require('node:fs');
const assert=require('node:assert/strict');
const yaml=require('js-yaml');
const workflow=yaml.load(fs.readFileSync('.github/workflows/checks.yml','utf8'));
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const vercel=JSON.parse(fs.readFileSync('vercel.json','utf8'));
const milestones=JSON.parse(fs.readFileSync('docs/delivery-evidence-2026-11-12/milestones.json','utf8'));
assert.deepEqual(Object.keys(workflow.on).sort(),['pull_request','push']);
assert.deepEqual(workflow.permissions,{contents:'read'});
assert.equal(workflow.concurrency['cancel-in-progress'],true);
assert.equal(workflow.jobs.verify['timeout-minutes'],20);
assert.equal(workflow.jobs.verify.steps[0].with['persist-credentials'],false);
for(const step of workflow.jobs.verify.steps.filter(s=>s.uses)) assert.match(step.uses,/^[\w-]+\/[\w-]+@[0-9a-f]{40}$/);
assert.equal(workflow.jobs.verify.steps.at(-1).with['retention-days'],7);
assert.equal(workflow.jobs.verify.steps.at(-1).if,'failure()');
assert.equal(workflow.jobs.verify.steps.filter(s=>s.run==='npm run test:runner-drivers').length,1);
assert.equal(pkg.scripts['test:runner-drivers'].split(' ').filter(p=>p.endsWith('.test.mjs')).length,4);
assert.equal(vercel.git.deploymentEnabled,false);
assert.equal(milestones.length,3);
assert.ok(milestones.every(m=>m.state==='open'));
console.log('Workflow, package, deployment hold and three open milestone records parse and satisfy reviewed structural checks.');
```

On final candidate `ae7256d8bb62ea831ef06c927899b2b4fa0fba37`:

| Exact command/check | Result |
| --- | --- |
| `git status --short --branch`; `git rev-parse HEAD`; `git rev-parse 5a3be84` | Clean expected feature branch, exact final candidate and full baseline. |
| `git diff 2f8860eb09712b8d311e5aa33c35546542155db0 ae7256d8bb62ea831ef06c927899b2b4fa0fba37` | Inspected complete delta: only delivery plan/evidence transport and review-status prose. No source or CI change. |
| `git diff --name-only 2f8860eb09712b8d311e5aa33c35546542155db0 ae7256d8bb62ea831ef06c927899b2b4fa0fba37 -- .github/workflows/checks.yml package.json vercel.json app components lib docs/pyodide-spike .vercelignore` | Empty; prior driver/lint/type/build/config evidence still applies. |
| `git diff --check 5a3be845b1fcea139b7da0445252a252fa0c93c6 ae7256d8bb62ea831ef06c927899b2b4fa0fba37` | Exit 0. |
| `python docs/delivery-evidence-2026-11-12/check-publication-scope.py` | Exit 0: 229 tracked files, no selected findings. |
| Relative-link script below, piped to `python -` using a single-quoted here-string | Exit 0: 38 relative documentation targets, no missing target. |

```python
from pathlib import Path
import re,subprocess
root=Path.cwd()
base='5a3be845b1fcea139b7da0445252a252fa0c93c6'
candidate='ae7256d8bb62ea831ef06c927899b2b4fa0fba37'
names=subprocess.check_output(['git','diff','--name-only',base,candidate],encoding='utf-8').splitlines()
checked=[]
errors=[]
for name in names:
    if not name.endswith('.md'): continue
    content=subprocess.check_output(['git','show',candidate+':'+name],encoding='utf-8')
    for target in re.findall(r'(?<!!)\[[^\]]+\]\(([^)]+)\)',content):
        if target.startswith(('http:','https:','#','mailto:')): continue
        target=target.split('#',1)[0]
        if not target: continue
        checked.append((name,target))
        if not (root/name).parent.joinpath(target).exists(): errors.append((name,target))
print({'relative_link_targets_checked':len(checked),'errors':errors})
raise SystemExit(bool(errors))
```

Other personally executed inspection commands were `Get-Content -Raw` on the
requirements/configuration/evidence and four driver/test files discussed above,
`git diff --stat` against saved main, `git log --oneline` over that range, and
changed-path count checks. Earlier evidence inspected rather than repeated:
the beta's full 178 production-browser cases, unit/content/teaching/contrast
checks and independent receipt; D1 primary/implementation checks; GitHub
identity/ref/PR/milestone metadata; strict SSH read failure and HTTPS dry run;
the factual publication-boundary audit. The factual auditor issued no verdict
and wrote no files. I own this checklist and verdict.

The retained publication checker scans current tracked paths against filesystem
bytes, not Git history or index/worktree equality. The additional historical
audit is signature-based and does not establish exhaustive entropy detection,
archive decoding or image OCR. No fresh D1 browser suite or Linux/Node 22 CI
was personally run; app/browser assertions are unchanged and hosted CI is a
future gate. No device, screen-reader, teacher/student or provider-allowance
evidence is inferred.

## Findings, verdict and remaining gates

No actionable finding remains in this focused D1 candidate. The primary agent's
transport clarification was inspected before any verdict; there was no earlier
signed-off receipt for the initial candidate.

**SIGNED_OFF** for final candidate
`ae7256d8bb62ea831ef06c927899b2b4fa0fba37`, for local D1 configuration and
honest draft-publication readiness only. A following commit containing only
this reviewer-authored receipt can record the review without invalidating the
candidate. Any subsequent non-receipt edit requires a new candidate and review.

D1 as a delivered remote increment is still incomplete: actual explicit-ref
push and matching remote SHA, correctly targeted draft PR/open milestone
metadata, and terminal hosted checks for the exact current head must still be
recorded. This verdict neither predicts credential acceptance nor treats a
canceled superseded run as a pass. D2's two-tab lost-update and absent-key reset
defects remain queued and require their own repair/tests/review.

Milestones 3/4/5 remain open. Independent teacher/student, accessibility/
screen-reader and physical-device evidence, current intended hosting project/
allowance, reviewed production deployment and owner protection/publication
decisions are still required. Runner actual-host security/recovery, supported
devices and practical low-memory/provider gates plus explicit learner
activation authorization remain unmet. This receipt authorizes none of those
gated actions and is not a merge or public-release approval.
