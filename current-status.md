# Current Status

**Last updated:** 12 October 2026  
**Overall status:** Planning / awaiting owner review  
**Implementation:** Not started by design.

## Confirmed decisions

- Repository: new repository.
- Architecture: simpler stack with fewer external services.
- Learner accounts: none in initial release.
- Progress: local browser storage.
- Code execution: hosted service, subject to provider feasibility checks.
- Content: Markdown/MDX in Git.
- Release target: public beta.
- **Syllabus scope: priority-topic beta — several high-value topic areas taught in depth; no full-syllabus coverage promise.**
- UI: clean, NUS-notes-inspired educational interface; no implication of NUS affiliation.
- Pricing: free for students; optional donation link; no paywall or ads in MVP.
- Portfolio goal: demonstrate thoughtful engineering, testing, security and documentation.
- Approval gate: do not implement until the owner reviews and approves the planning documents.

## Recommended baseline (provisional)

- Next.js App Router + TypeScript.
- Markdown/MDX content files.
- CodeMirror 6 editor for Python.
- Local storage for progress.
- A provider-independent server-side adapter for hosted code execution.
- Static-first deployment where possible.

These are recommendations, not irreversible decisions. The exact runner and hosting provider remain unapproved until current terms and free limits are verified.

## Current blockers / risks

1. **Runner cost and terms:** no hosted service should be assumed permanently free or appropriate for unrestricted public use.
2. **Hosting plan:** free hosting terms may restrict use cases; donations alone may be treated differently from other financial gain, but terms must be rechecked.
3. **Syllabus mapping:** lesson IDs/outcomes must be checked directly against the official 2026 syllabus PDF.
4. **Content prioritisation:** choose high-value areas after auditing the official syllabus; avoid disconnected lessons and explicitly disclose uncovered outcomes.
5. **Privacy:** code sent to a third-party runner is not purely local; explain this clearly.
6. **Resume claims:** only describe shipped features and measured outcomes after they exist.

## Next actions (in order)

1. Owner reviews the planning package.
2. Owner approves or requests edits to `implementation.md`, especially the zero-cost plan and runner fallback.
3. Audit the official syllabus, select priority areas, and prepare a coverage map including known gaps.
4. Verify current hosting/runner terms and record a decision.
5. Only after explicit approval, begin Phase 1 from `roadmap.md`.

## Change log

- 2026-10-12: Initial planning documentation drafted. No application code created.
- 2026-10-12: Confirmed priority-topic beta: deeper coverage of several high-value topics, rather than full syllabus breadth. Documentation updated; approval and implementation still pending.
