# D3 single-head CI and supported action runtimes

This follows D2's independent sign-off and successful exact-head Linux run
`43157461908` at `c7cc59ad394c61a9e822183bd2d7e34791dc869c`. It changes only
the repository workflow plus delivery documentation. Learner source, content,
dependencies, test assertions and runtime activation remain unchanged.

## Observed problem and intended behavior

D1 and D2 each produced a feature push run and a pull-request run for the same
head. Concurrency correctly canceled one, but GitHub retained both check runs
and reported aggregate PR state `UNSTABLE` despite the active PR run succeeding.
Logs also warned that three old pinned actions targeted deprecated Node 20 and
were being forced onto Node 24. Earlier canceled runs remain historical
evidence; they are neither deleted nor represented as successful tests.

Keep `push` checks for main and ordinary `pull_request` checks for feature work.
This gives a feature head one applicable verification run while preserving
post-merge main coverage. Feature branches without a PR rely on the prescribed
local checks until their PR opens. Retain repository/branch concurrency for
superseded PR heads and avoid fork-name collisions. Official guidance:
[workflow events and branch filters](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax),
[concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency).

## Reviewed runtime pins and maintenance cost

Read-only research by `/root/delivery_audit_next` checked official latest
release, release-tag and v7-ref endpoints, then the SHA-bound descriptors and
READMEs. All refs resolved directly to these commits; all four `action.yml`
descriptors declare `node24`:

| Action/release | Exact commit | Relevant compatibility |
| --- | --- | --- |
| [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1) | `3d3c42e5aac5ba805825da76410c181273ba90b1` | Keep `persist-credentials: false`; unsafe privileged-fork behavior concerns triggers this workflow does not use. |
| [setup-node v7.1.0](https://github.com/actions/setup-node/releases/tag/v7.1.0) | `949feb2413d6458794dcd2491c4babbbce0c15c1` | Keep app Node 22 and explicit npm cache. No registry authentication input is configured. |
| [setup-python v7.1.0](https://github.com/actions/setup-python/releases/tag/v7.1.0) | `6d4fd22b20465ccc0f7354476588e8df7c9ca0e0` | ESM migration retains the Python 3.14 input. |
| [upload-artifact v7.0.2](https://github.com/actions/upload-artifact/releases/tag/v7.0.2) | `cf430e030ddbb5b0abf93d22962f4752f3646cd9` | Name/path/seven-day retention unchanged; archive defaults to true. |

Internal action Node 24 does not raise the application's Node requirement or
change local installed tools. These actions require a supported modern runner;
the repository uses GitHub-hosted Ubuntu. No service/direct dependency is added.
Keep exact pins and deliberately review future upstream runtime/input changes.
Standard free-plan terms can change; the existing 20-minute job, cancellation,
read-only permissions, non-persisted credentials and bounded artifacts remain.

## Acceptance and fallback

Compare the parsed workflow to the D2 baseline, allowing only the main-push
branch filter and four action pins to differ. Retain workflow/job names, every
verification command, Node/Python inputs, cache, retries, assertion limits and
artifact policy. Run relevant local structural/lint/offline checks and obtain
a fresh independent exact-candidate review before updating the draft PR.

Then verify that the new exact feature head has a single applicable PR run,
the full Linux pipeline passes (including 206 browser cases), the old Node 20
action warning is absent, and aggregate check state is actually clean. Do not
assume a branch filter clears the state before observing GitHub. A generic
runner-image migration notice is distinct from an action runtime deprecation.
A draft's intentional merge block is not a failed check and must not be removed
to improve the displayed check state.

If an action/input/runtime fails, inspect bounded job diagnostics and repair or
restore compatible reviewed pins; never disable a check, broaden credentials or
force-push. Preserve the draft/publication/runner gates. Post-merge main CI is
configured, not experimentally triggered by this task. No merge/main push or
production release is authorized.

Local candidate and actual hosted results are recorded in
[delivery evidence](delivery-verification-2026-11-12.md) and independent receipts
under `docs/reviews/`. The [external review kit](external-review-kit-2026-11-12.md)
prepares remaining genuine evidence without pretending those reviews occurred.

## Local verification before publication

| Command | Result |
| --- | --- |
| `node docs/delivery-evidence-2026-11-12/check-ci-config.mjs` | Exit 0; parsed baseline comparison permits only the main push filter/four reviewed pins and verifies the deployment hold. Uses the already-installed locked `js-yaml`; no parser dependency added. |
| `npm run lint` | Implementation agent and primary each ran: exit 0. |
| `npm run test:runner-drivers` | Implementation agent ran: eight passed, no skips. |
| `git --no-optional-locks diff --check -- .github/workflows/checks.yml` | Implementation agent ran: exit 0. |

The learner implementation and tests are unchanged from D2's independent local
206-case run and exact-head Linux success. No new local browser run is claimed
for a workflow-only change. New action/event behavior still requires actual
exact-head GitHub CI after candidate-bound review and publication.
