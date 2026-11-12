# Public-beta external review kit

**State: not performed.** This is a checklist for genuine remaining reviews,
not teacher, student, screen-reader or physical-device evidence. Agent code
review and Chromium emulation cannot complete these gates. Keep the public-beta
milestones open until findings are resolved and evidence is independently signed.
No reviewer has been contacted or assigned by the agent.

Use the reviewed local build under [setup instructions](beta-release-2026-11-12.md)
or a separately authorized, verified theory deployment. Record its exact commit
and URL; the protected developer runner preview is a different product surface.

## Educational/content review

Record a consented public reviewer identifier/role, date, commit and reviewed scope. Inspect all
published material in the three bounded paths:

| Path | Lessons | Mapping references to check |
| --- | --- | --- |
| Python control flow | Sequence/selection; loops; combined-flow tracing | 2.2.3/2.2.6, printed page 8 |
| Searching lists | Linear search; binary search | 1.2.3–1.2.5, page 7; 2.3.2, page 9 |
| Relational data/SQL | Relations/keys; selection/filter/order; joins/aggregation | 3.3.1/3.3.2/3.3.8, page 11 |

- Verify each claimed subset against the [official 2026 syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf).
- Review explanation accuracy, prerequisites, misconceptions and worked traces.
- Check each quiz answer and every option's explanation for ambiguity/errors.
- Attempt offline prompts independently, then compare model reasoning and
  visible boundary examples. No learner code or SQL runs in the website.
- Confirm original/attributed content, honest omissions and no examination or
  official-affiliation promises. Automated example runs support, not replace,
  educational judgment.

Record each finding with page/question ID, consequence, correction and re-review.
Do not mark a broad outcome fully covered merely because one lesson is correct.

## Student journey and accessibility/device review

Record a consented reviewer identifier, device model, OS, browser/version, assistive technology/
version, date, commit/URL and any applicable limits. Do not put student names,
email addresses, credentials or private device identifiers in public receipts.
Use intended supported
physical devices; emulated Pixel/viewport settings are not physical evidence.

- Follow home → topic → lesson → quiz/explanations → offline task/model → local
  completion, then refresh, incomplete filter and reset. Try one journey in
  each path and record confusing wording or navigation.
- Use keyboard navigation, radio selection, disclosures, status announcements,
  visible focus and reset confirmation with the intended screen reader.
- Check headings/landmarks, accessible names/order, zoom/reflow, narrow screens,
  code/table scrolling and readable feedback without color-only meaning.
- Confirm denied/corrupt storage still permits visit-only learning, with honest
  persistence/reset feedback. Cross-tab progress is best effort, not cloud sync.
- Verify partial coverage, privacy, attribution and the feedback route; reporting
  uses external GitHub sign-in, while learning requires no app account.

## Receipt and release disposition

Store a dated receipt in `docs/reviews/` with actual scope/evidence, findings,
fix/re-review history and verdict. Use `BLOCKED` for missing required access or
devices and `CHANGES_REQUIRED` for unresolved serious findings. No boxes here
are pre-checked and no numeric user/learning outcome claim is supported.

Separately verify intended hosting access/allowance, team opt-out, the reviewed
production deployment and owner protection/publication decisions. Runner
feasibility/activation has its own gates and remains NO-GO. Push/PR permission
does not authorize merge, production publication, third-party policy contact or
learner execution.
