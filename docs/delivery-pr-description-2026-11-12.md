# Deliver the theory beta and preserve gated browser feasibility

This branch combines the previously unmerged developer-only Pyodide feasibility
history with a working local theory/quiz/offline beta and incremental delivery
hardening. It is intentionally a **draft**, not a production or learner-runner
release. The branch stays intact under the owner's current-branch restriction;
its complete diff includes preserved notices, evidence, protocols and review
receipts, not only the newest theory lessons.

## Result

- Eight original lessons, sixteen explanatory MCQs and eight offline tasks
  across Python control flow, searching lists and relational data/SQL. Verified
  2026 outcome subsets and explicit partial coverage; teacher review pending.
- Topic navigation/filtering and defensive local progress with migration,
  reset and unavailable-storage fallback; no app account, source upload,
  analytics, database service or grading claim.
- Developer-only opaque-frame/worker feasibility code and dated evidence remain
  outside learner routes/public assets. Runtime distributions are not committed.
  Learner execution stays disabled and actual-host/device/provider gates stay open.
- Framework/tooling advisory patches, bounded/pinned CI, existing offline driver
  unit coverage and repository-local automatic-deployment hold. No paid service
  or new direct package dependency.

## Incremental delivery

[Delivery plan](https://github.com/josthan12/h2compute/blob/feat/pyodide-feasibility/docs/delivery-plan-2026-11-12.md) defines D1 bounded CI/draft
publication, D2 reproduced progress-recovery repair, and D3 exact-head hosted
verification. Each implementation slice requires its own candidate-bound review
and checks before being added to this PR. D2 is not claimed fixed by D1.

## Validation and review

The local beta candidate `2864709` passed all requested checks, including
178 production-browser cases, 14 unit tests, 62 Python teaching runs, 2,966
search runs, 19 SQL queries/8 rejected constraints, contrast, build and a dated
zero-finding dependency audit. Its independent receipt is
`docs/reviews/2026-11-12-local-beta-review.md`; earlier receipts retain the
feasibility increments. D1/new increments have separate receipts and evidence
under `docs/reviews/` and `docs/delivery-verification-2026-11-12.md`.

Hosted CI must be read for this PR's **exact head**; old main results and the
protected runner preview are not candidate/deployment evidence. No protected
hosted adversarial suite is run by this workflow.

## Remaining gates

Independent teacher/student feedback, accessibility/screen-reader and physical
device evidence; current intended hosting project/allowance and reviewed
production deployment; owner protection/publication decisions; full runner
feasibility and explicit activation authorization. Main is publicly reported
unprotected; this PR does not change protection. No merge, production release
or learner execution is authorized by this draft.
