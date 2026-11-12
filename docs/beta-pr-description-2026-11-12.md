# Draft PR: Complete the three-area theory beta locally

The learner app previously offered only Python control flow. It now provides
eight connected lessons across Python, searching lists and relational data/SQL,
each with original worked examples, explanatory checkpoints and offline
practice/model review. All published content maps to verified partial 2026
9569 outcomes. Topic navigation and incomplete filtering keep revision within
each path; versioned local progress preserves earlier data and supports reset
and storage recovery.

The change also fixes narrow example-cell wrapping, shows correct syllabus
pages, updates setup/coverage/privacy-feedback and release evidence, excludes the
developer runner from future theory deployment uploads, and patches Next/config
to 16.4.6 with a documented scoped minimatch tooling override. No learner
execution, account, service, hosted grading or paid dependency is introduced.

Validation: lint, typecheck, 16-file content validation, 14 unit tests, 62 Python
teaching runs, 2,966 search runs, 19 SQL queries/8 rejected constraints/design
contract, actual-palette contrast, production build, clean lockfile install and
zero-finding dated dependency audit; all 176 production-browser tests pass.
Independent receipt and detailed evidence are recorded in `docs/beta-verification-2026-11-12.md` and
`docs/reviews/` before handoff.

This is a **local implementation candidate**, not public-release approval.
Independent teacher/student, screen-reader/accessibility and physical-device
evidence; current hosting access/allowance; production theory deployment,
hosted CI, branch-protection checks and owner-controlled publication remain
open. Existing Pyodide feasibility evidence and NO-GO activation decision remain
intact. No push, PR creation, merge, deployment or external message was made.
