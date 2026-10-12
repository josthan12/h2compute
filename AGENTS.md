# Agent and Contributor Rules

This file describes how coding assistants and contributors should work in this repository.

## Approval gate

The project is currently in planning. **Do not implement application code until the owner explicitly approves the planning documents.** When approved, follow `implementation.md` and `roadmap.md`.

## General rules

- Read `README.md`, `implementation.md`, `roadmap.md`, and `current-status.md` before making changes.
- Work in small, reviewable increments. Prefer one end-to-end vertical slice over broad scaffolding.
- Do not add dependencies or services without explaining their purpose, maintenance cost, and effect on the zero-cost goal.
- Never add a paid dependency or assume a free tier is permanent.
- Keep secrets in environment variables; never commit `.env` or credentials.
- Do not execute learner code in the web app process.
- Never expose hidden tests, provider credentials, or private provider response data to the browser.
- Validate all untrusted input and bound response/output sizes.
- Preserve account-free local progress for the MVP unless the owner approves a scope change.
- Use original educational content and verify syllabus mapping.
- Avoid claiming affiliation with SEAB, MOE, NUS, or any school.
- Do not invent test results or claim commands passed unless you ran them.

## Required workflow for a change

1. State the task and acceptance criteria.
2. Inspect relevant files and current Git state.
3. Make the smallest coherent change.
4. Add or update tests.
5. Run relevant lint, typecheck, tests, and build.
6. Report exact commands run and any failures or unverified checks.
7. Update `current-status.md` and roadmap checkboxes when progress materially changes.
8. Do not silently modify this specification; propose material changes for owner approval.

## Educational content

- Map each published lesson/question to a verified 9569 syllabus outcome.
- Do not invent syllabus outcome identifiers.
- Keep hidden test data server-side.
- Test all code examples.
- Include explanations and content provenance.

## UI quality

- Use semantic HTML, keyboard support, visible focus states, accessible names, sufficient contrast, and responsive layouts.
- Avoid copying NUS branding or another site's exact layout.
- Keep visual components consistent and avoid unnecessary animation.

## Definition of done

A change is done only when acceptance criteria are met, relevant tests pass, errors are handled, docs are updated, and remaining limitations are stated.
