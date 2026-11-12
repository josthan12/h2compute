# Independent agent quality gate

Effective 15 October 2026, by owner instruction. Read with
[AGENTS.md](../AGENTS.md) and the [milestone workflow](milestone-workflow.md).

## Required before a completed handoff

The implementation agent must call a separate reviewer agent before presenting
any completed change or milestone to the owner. This includes documentation-only
changes. Routine progress updates, answers and truthful blocker reports are not
completion claims and need no sign-off. Local draft commits may precede review;
they are not evidence of readiness. Owner review happens after this gate.

Use the available subagent tool (currently `collaboration.spawn_agent`), not a
second self-review by the implementation agent. Start the reviewer with a fresh
conversation (`fork_turns: "none"`) and do not override its configured model.
The reviewer must not have authored the implementation it reviews. If no separate
reviewer is available, report the gate as blocked; never fabricate approval.
This is an agent workflow requirement, not a Git hook or unattended CI service.

## Dispatch and independent checklist

First run the applicable checks and prepare a focused local candidate commit.
Give the reviewer the original owner request, repository path, relevant milestone,
baseline and full candidate commit IDs, changed-file scope and evidence locations.
Disclose known failures and access/policy constraints without suggesting a verdict.
Avoid supplying the implementation agent's conclusions as the review checklist.

The reviewer reads the repository instructions and acceptance requirements,
creates its own risk-based checklist, and then inspects the actual diff and
evidence. The categories below are a minimum coverage guide, not a checklist to
copy mechanically. Add checks specific to the change; justify any inapplicable
category. Independently run relevant checks where practical and authorized.
Distinguish commands personally run from earlier evidence merely inspected.

- Requirements and scope: map the owner's request and milestone acceptance
  criteria to the actual result; detect missing work or unintended scope.
- Correctness and resilience: normal use, meaningful boundary/failure cases,
  recovery, state preservation and regressions relevant to the change.
- Tests and evidence: useful assertions, reproducibility, exact versions/results,
  honest skipped checks, and no weakened tests or substituted evidence.
- Security, privacy and cost: isolation, validation/bounds, secrets, data flow,
  provider-policy limits, account-free progress and the zero-cost commitment.
- Educational and UI quality where affected: verified syllabus mapping, original
  explanations/provenance, tested examples, accessibility and responsive use.
- Maintainability and delivery: clear focused changes, appropriate dependencies,
  documentation consistency, Git scope and preservation of existing evidence.

The reviewer may inspect and run authorized non-destructive checks, but must not
fix implementation files, push, open a PR, merge, change protection, spend money,
contact third parties or activate learner execution. It may write only its own
review receipt under `docs/reviews/`. Implementation fixes belong to the primary
agent and must return to review.

## Verdict and repair loop

Use one explicit verdict:

- `SIGNED_OFF`: every applicable acceptance requirement for the stated scope is
  met, checks support the claim, and no actionable correctness/security/acceptance
  finding remains. Optional future improvements may be recorded separately.
- `CHANGES_REQUIRED`: identify each actionable defect with file/location,
  consequence and required correction or missing test.
- `BLOCKED`: required evidence, access or a permitted testing path is unavailable.
  State what remains unverified and the exact dependency; do not infer a pass.

The primary agent fixes findings, reruns affected checks and asks the independent
reviewer to reassess the new candidate commit. It cannot approve its own fixes,
silently dismiss a finding or shop for a more permissive reviewer. A replacement
reviewer must receive the prior findings and resolutions. No completed handoff
or milestone advancement occurs until an explicit `SIGNED_OFF` is recorded.

A focused change can be signed off while unrelated milestone gates remain open.
The receipt must say so. Milestone sign-off requires the reviewer to check every
milestone exit criterion, including applicable deployed/device evidence. An
agent review cannot replace physical-device results, provider permission,
independent educational/accessibility review or owner-controlled release gates.

## Review receipt and snapshot validity

The reviewer records its own verdict in a uniquely named Markdown file under
`docs/reviews/` (date plus task name). The receipt must contain:

1. Review date, reviewer agent identity and review scope (focused change or full
   milestone), plus baseline and full candidate commit IDs.
2. Its independently developed checklist, outcome/evidence for each item, and
   reasons for anything inapplicable.
3. Exact commands it ran and their results; earlier evidence it inspected;
   failures, skipped checks and remaining limitations.
4. Findings, any repair/re-review history and the final explicit verdict.
5. A statement of which milestone gates, if any, remain open.

Bind sign-off to the candidate commit and reviewed file scope. Any subsequent
change outside the review receipt requires a new candidate and re-review before
handoff. A following commit may contain only the reviewer's receipt; that
record-only commit does not invalidate the reviewed candidate. The primary agent
may commit the receipt verbatim, but must not author or edit the reviewer's
verdict. Before handoff, verify that HEAD contains the approved candidate, only
the receipt was added afterwards, checks still apply and the working tree is
clean. Link the receipt in the final handoff and state its limited scope honestly.
