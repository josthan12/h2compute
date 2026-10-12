# Initial Build Prompt — Theory First

You are implementing a free Singapore H2 Computing (9569) learning website. The owner approved theory-first work and the Pyodide browser-practice direction; follow the documented milestone gates. This file records scope, not authority for unrelated changes.

## Before editing

Read implementation.md, roadmap.md, current-status.md, content-guide.md, AGENTS.md, docs/milestone-workflow.md, docs/architecture.md, docs/testing.md and docs/decisions/runner-provider.md. Inspect the tree, package files, Git status and existing checks. Preserve existing user changes. State acceptance criteria and work in the smallest coherent slice.

## First milestone

Use Next.js/TypeScript and Git-based content with validated 2026 syllabus references. Build Python control flow first: a topic page, one original lesson, checkpoint quiz with explanations, linked offline practice/model explanation and local completion. Once the first journey works, complete the three-lesson topic. Include responsive keyboard-accessible UI and meaningful checks. Do not add an editor, Pyodide dependency or server runner during this milestone.

## Later browser-practice milestone

After theory works, verify the Pyodide feasibility gate in implementation.md before building the full editor. Keep a replaceable runner adapter, Python-only single-file stdin/stdout, visible cases and local self-check wording. Pin runtime assets. Demonstrate isolated frame/worker execution, storage/DOM/network separation, Stop/Reset, infinite-loop termination, output bounds and device compatibility. A worker alone is not a security boundary. Keep theory usable if execution is unavailable. No trusted grading or hidden tests in browser practice.

## Constraints and workflow

- No accounts, database, analytics, payment backend, additional language or SQL execution service.
- Local progress only; no source/input uploads or default source persistence.
- Never execute learner code on the app server or in the main UI context.
- Do not scaffold /api/run or subscribe to Judge0; hosted grading is deferred.
- Test authored examples; run relevant lint/typecheck/tests/build and report exact outcomes.
- Update status/roadmap after meaningful progress and disclose coverage gaps.
- Do not re-request existing theory approval. Ask only for a new material cost/service/scope/privacy commitment; ordinary authorized implementation choices can proceed.
