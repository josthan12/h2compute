# Implementation Specification — Singapore A-Level Computing Learning Platform

**Status:** Theory-first direction approved; Pyodide practice planned subject to feasibility — documentation only
**Version:** 0.2
**Date:** 12 October 2026
**Owner:** Solo developer
**Implementation status:** Milestone 1 theory foundation implemented and locally verified on feat/project-setup. One lesson/checkpoint/offline-practice/local-completion journey exists; deployment, hosted CI and browser execution remain unverified or deferred. See current-status.md and docs/milestone-1-verification.md. The scope and activation gates below remain in force.

## 1. Product summary

Build a free, syllabus-aligned learning website for students taking Singapore-Cambridge H2 Computing (syllabus 9569), beginning with the 2026 syllabus. The site combines structured theory notes, short formative checks, and browser-based Python programming practice. Its teaching style should be clear and structured, inspired by the organisation of university lecture notes, without copying another site's content or visual identity.

The project should also demonstrate software engineering quality for the owner's resume: clear architecture, tested code, documented decisions, safe browser Python practice behind a replaceable runner adapter, accessible UI, and a public issue/roadmap process.

### Product principles

1. **Syllabus-first:** every published lesson and exercise maps to a syllabus outcome.
2. **Free for learners:** no paywall, subscription, account requirement, or ads in the initial public beta.
3. **Low-maintenance:** one developer should be able to understand and operate the system.
4. **Safety before convenience:** learner code must never execute on the app server or in the main UI context; browser execution requires a separately isolated runner context and worker.
5. **Honest feedback:** browser practice uses visible tests and labels results as self-checks; private hosted grading and secrets are deferred.
6. **Progress without accounts:** save progress locally on the learner's device; explain that clearing browser data or changing devices may erase it.
7. **Incremental release:** ship one complete vertical slice, then expand from evidence and feedback.

### Confirmed beta coverage strategy — priority topics, not the whole syllabus

The confirmed MVP areas are Python programming, algorithms and data structures, and relational databases and SQL. No other topic area is added by the browser-runner decision.

The first public beta will teach **several carefully chosen, high-value syllabus topic areas in depth**, rather than attempt comprehensive syllabus coverage. Selection must be grounded in the verified 2026 syllabus and consider learning value, prerequisites, availability of original explanations, and suitability for quizzes and Python practice. Do not state that the beta covers the entire syllabus.

- **First proof point:** Python control flow: lesson → checkpoint quiz → practice prompt/model explanation → local progress. Add runnable browser practice only after its feasibility gate passes.
- **Beta content:** expand into multiple coherent priority areas with linked, reviewed lessons and meaningful practice. As a planning target, aim for roughly 8–12 polished lessons and up to 20–30 Python exercises, **not fixed release requirements**; quality and safe operation take precedence over counts.
- **Coverage transparency:** show which syllabus outcomes are covered, partially covered, and not yet covered; distinguish original syllabus content from optional enrichment.
- **Release bar:** students can complete worthwhile, connected revision journeys within the selected areas; no promise of full-topic or full-syllabus completeness.
- **Later:** expand to remaining outcomes based on feedback, maintenance capacity and proven demand.

## 2. Goals and non-goals

### MVP goals

- Browse **selected priority syllabus topics** and lessons, with visible indications of beta coverage.
- Read responsive, accessible Markdown/MDX notes with diagrams, code, worked examples, and common mistakes.
- Complete embedded multiple-choice and short-answer checks.
- First deliver linked practice prompts and model explanations without execution.
- Later add a Python-only editor using a replaceable Pyodide browser adapter, with Run, Stop/Reset and Check examples.
- Run supplied stdin and compare against visible cases locally; browser results are self-checks, not trusted grades.
- Show loading, completed, examples-passed, examples-failed, runtime-error, timeout, output-limit and unavailable states.
- Store lesson completion, quiz attempts, and exercise completion locally.
- Search/filter content by topic, difficulty, and status where useful.
- Offer a voluntary donation link without restricting learning access.
- Provide a clear feedback/bug-report path.
- Include automated checks, deployment instructions, privacy notes, and contributor documentation.

### Not in the initial release

- Hosted grading, hidden programming tests, Judge0 subscription or a server execution route.
- User accounts, cloud synchronisation, teacher dashboards, classes, leaderboards, social features, or paid features.
- AI tutoring or AI-generated grading.
- Multi-file Flask/web application sandbox, arbitrary package installation, SQL server, HTML hosting, or general-purpose shell access.
- Multiple programming languages until Python is stable and syllabus needs are confirmed.
- A clone of LeetCode's full feature set.
- Official examination endorsement or claims that the site replaces school teaching, the official syllabus, or past papers.
- Uploading or redistributing copyrighted examination material without permission.
- Comprehensive syllabus coverage as a prerequisite for this beta.

## 3. Target users and key journeys

### Primary user

A Singapore JC student studying H2 Computing who wants a syllabus-organised reference and immediate practice without creating an account.

### Journey A — learn a concept

Home → syllabus topic → lesson → worked example → checkpoint quiz → mark lesson complete → related exercise.

### Journey B — practise programming

Initially: practice prompt → attempt offline or trace by hand → review explanation → mark completed locally.

After browser feasibility passes: exercise → edit Python → Run with supplied stdin / Check examples → inspect visible output → retry → mark local self-check progress. Stop/Reset cancels execution. No Submit for hidden grading in this MVP.

### Journey C — revise

Topic overview → filter lessons by incomplete status → revisit weak concepts → retry quizzes/exercises.

### Journey D — provide feedback or donate

Footer/About page → submit feedback or open voluntary donation link. Donations must never change access, scores, or features.

## 4. Syllabus alignment and content integrity

Use the official SEAB 2026 H2 Computing syllabus 9569 as the source of truth:
https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf

Before publishing the selected priority-topic tree, inspect the PDF and transcribe the relevant sections and learning outcomes accurately. Do not rely on informal topic lists alone. Store a stable syllabus outcome ID and a human-readable reference for every lesson, quiz, and exercise. Record the syllabus year/version.

The content system must distinguish:
- **Official syllabus wording:** short, attributed references where needed.
- **Original teaching explanation:** written by the project owner.
- **Practice question:** original or appropriately licensed.
- **External reference:** link and access date if relevant.

Do not present unofficial notes as official SEAB material. Re-check the syllabus before a major content release and record any mapping changes.

## 5. Scope and release gates

### Gate 0 — approved direction

The owner approved theory-first work, Vercel Hobby and Python control flow as the first topic, then requested planning for free browser Python practice. Follow the three confirmed MVP areas only. Do not re-request this approval for ordinary theory work. Paid services, extra infrastructure, hosted grading or scope/privacy changes need separate authorization.

### Gate 1 — theory deployment

After documentation changes, establish the Next.js/TypeScript foundation, validated Git content, quizzes and local progress. Verify a production build and Vercel Hobby deployment within free-plan terms. A runner is not required to pass this gate.

### Gate 2 — first theory learning journey

Complete Python control flow: sequence/branching, counted/conditional loops, combined flow/tracing. Begin with one polished lesson, then complete the bounded topic. Each lesson has an original worked example, misconceptions, quiz explanations, practice prompt/model explanation and local completion. Check syllabus mapping, code examples, keyboard/mobile use and refresh/reset progress before expanding.

### Gate 3 — Pyodide feasibility and activation

Only after the theory journey works, investigate a minimal browser runner before building the full editor. Pin a reviewed Pyodide/Python version compatible with the exercises. Verify runtime asset loading on the actual host, supported desktop/mobile browsers, stdin/stdout, cancellation of infinite loops, output flooding, reset isolation and initial download/resource costs.

Security pass condition: learner code runs outside the main site context in an isolated iframe/worker arrangement; it cannot read or modify the site's DOM, local progress or cookies, navigate the parent or make unauthorized network requests. A worker alone is not origin isolation. Test the proposed opaque-origin sandbox and its CORS/CSP/worker restrictions; do not grant same-origin access merely to make loading work. Keep cross-frame messages narrowly validated. Browser memory use cannot be given a dependable per-run server-style memory quota; assess practical device limits and document this limitation.

If those checks pass, add CodeMirror and the Pyodide adapter using visible tests only. Check examples is local, inspectable and alterable by the learner; do not claim trusted acceptance or concealed tests. If feasibility fails, keep the usable theory/quizzes beta and offline/self-check practice. Do not substitute a paid hosted service without approval.

### Gate 4 — public beta

Navigation, content accuracy, progress, accessibility, tests, privacy/attribution and feedback must be ready. Browser execution may be included only after Gate 3 passes; otherwise disclose its absence and omit executable controls. Recheck host terms and publish coverage gaps. Hosted execution is a later, separate decision, not a beta requirement.

## 6. Recommended architecture

### Default recommendation

- **Framework:** Next.js App Router with TypeScript.
- **Styling:** Tailwind CSS with daisyUI, requested by the owner for Milestone 1. Use one quiet notes theme and only the needed journey components; pin compatible versions. No other UI library or paid tooling.
- **Content:** Markdown/MDX files committed to Git, with frontmatter validated at build/test time.
- **Editor:** CodeMirror 6 configured for Python, added after the theory journey and browser feasibility check.
- **Code execution:** Pyodide in an isolated browser runner context plus module worker, behind a small replaceable adapter. No execution API/backend, API key or hidden tests in MVP. PyScript is not required. Pin and review the runtime during feasibility work.
- **Progress:** browser local storage behind a typed storage adapter and schema version. No account or database in MVP.
- **Hosting:** Vercel Hobby, mostly static pages; confirm terms/limits again before release. Pyodide asset delivery still consumes bandwidth and storage allowances.
- **Testing:** unit/component tests for parsing, quizzes, progress and result mapping; end-to-end tests for core learner journey; typecheck, lint and production build in CI.

This is deliberately not a microservice architecture. Avoid a separate database, authentication service, analytics platform, and backend service unless a concrete MVP requirement demands one.

### Cost principle

Keep the site static where possible. Browser Python adds no per-execution provider bill, but runtime downloads consume bandwidth and students supply CPU/memory. Lazy-load only on explicit use. Prefer pinned same-deployment assets if viable; verify distribution/licence notices, asset limits and caching before choosing delivery. Do not add a runtime CDN dependency by default. Do not introduce a payment processor, database, analytics, or authentication dependency just because it is familiar. A donation link can be an external link and must be optional.

A “free” provider tier can change, impose usage limits, require a card, or disallow a use case. Record provider plan terms and a dated decision. Do not promise perpetual zero cost to users or the owner.

## 7. Proposed repository structure

```text
/
├── app/
│   ├── page.tsx
│   ├── topics/
│   ├── lessons/[slug]/
│   ├── exercises/[slug]/
│   ├── about/
│   └── privacy/
├── components/
│   ├── content/
│   ├── quiz/
│   ├── editor/
│   ├── progress/
│   └── layout/
├── content/
│   ├── syllabus/
│   ├── lessons/
│   └── exercises/
├── lib/
│   ├── content/
│   ├── progress/
│   ├── runner/
│   └── validation/
├── tests/
├── public/
├── docs/
├── prompts/
├── implementation.md
├── roadmap.md
├── current-status.md
├── content-guide.md
├── AGENTS.md
├── README.md
└── .env.example
```

Keep paths adaptable to the framework's conventions. Add editor/worker/runtime assets only in the browser-practice milestone; no `/api/run` route is required. Do not create empty abstractions for speculative future features.

## 8. Content schema

Each lesson should have frontmatter such as:

```yaml
title: "Binary search"
slug: "binary-search"
topic: "algorithms-and-data-structures"
syllabus:
  year: 2026
  outcomes:
    - "1.2.3"
    - "1.2.4"
    - "2.3.2"
difficulty: "core"
estimatedMinutes: 12
prerequisites: []
relatedExercises:
  - "binary-search-index"
status: "draft"
```

The binary-search example covers only the binary-search portions of those outcomes; record that partial coverage. Use verified numeric outcome references as strings with year 2026 and printed page references. Content validation must fail CI for missing required fields, duplicate slugs, invalid links where testable, or references to nonexistent exercises.

Exercise metadata includes slug, title, topic, difficulty, syllabus mapping, prompt, constraints, examples, starter code, visible test cases, hints, explanation and tags. Initially prompts can be offline/self-check. All browser test inputs, answers and checking logic are intentionally public; no hidden-test field is required for this MVP. Any future private hosted test set must remain separate from client content.

## 9. Theory and quiz behaviour

- Render semantic headings, a table of contents for longer lessons, code blocks, callouts, figures with alt text, and previous/next/related links.
- Keep paragraphs short and examples exam-relevant.
- Quiz answers should be checked locally where possible. Explain why an answer is right and why distractors are wrong.
- For short-answer questions, MVP may use exact/normalised expected answers only where fair; do not imply a brittle text matcher understands every valid answer.
- Randomisation must not make questions ambiguous or make it impossible to review previous answers.
- Avoid excessive gamification. Progress indicators should support revision, not shame learners.

## 10. Python exercise runner contract

Use a small adapter with execute and cancel/reset operations, independent of Pyodide-specific UI calls. Support Python only; users cannot select arbitrary runtimes. Start with single-file stdin/stdout exercises and predefined input rather than an interactive terminal. The UI receives normalized state, bounded stdout/stderr and visible-case comparisons.

Request metadata includes exercise slug, source code, stdin and mode (`run` or `check-examples`). App content supplies visible cases. Validate all messages and sizes in the host UI as well as the runner context. Never render output/errors as HTML or let runner messages write arbitrary storage keys. Tag each job/session and discard stale or unexpected responses.

Suggested initial bounds to verify: 16 KiB UTF-8 source, 8 KiB stdin per case, 16 KiB decoded output per job, at most five visible cases and a five-second execution watchdog per case after runtime initialization. Give runtime loading a separate bounded timeout. Caps are application targets, not proven sandbox guarantees. Enforce a host-side cumulative output/message budget and terminate flooding workers. Browser memory exhaustion remains a practical limitation to test and disclose.

Keep the UI responsive in a module worker within an isolated runner context. The trusted host owns Stop/Reset/watchdog control. Terminate the worker on cancellation/timeout/output flooding, reset the context on malformed protocol traffic, and create a fresh interpreter for independent jobs/cases so previous globals/files cannot affect later results. Avoid requiring SharedArrayBuffer for MVP cancellation. Preserve the learner's editor text in the UI during recovery.

Status vocabulary: `loading`, `running`, `completed`, `examples-passed`, `examples-failed`, `runtime-error`, `timeout`, `output-limit`, `cancelled`, `unavailable`. Show “All visible examples passed — local self-check”, never a claim of trusted grading or all hidden tests passed. Client-side checking and progress can be modified by learners; that is acceptable for this account-free revision tool.

Gate 3 must demonstrate browser origin/storage/network isolation, bounded message handling and recovery. Pyodide exposes JavaScript/Web APIs; a worker is not automatically a security sandbox. Do not run learner code in the app server or the main UI context, auto-run shared source, or enable arbitrary package installation.

Future hosted execution, if separately authorized, uses a server-only adapter with its own credentials, private tests, provider validation, limits, privacy and cost gates. Do not scaffold that service now.

## 11. Local progress and privacy

- No account is required in MVP.
- Store progress in local storage with a schema version and defensive parsing.
- Store only what is needed: completed lesson IDs, quiz summaries, exercise status, and timestamps if useful.
- Never store source code by default unless the user explicitly chooses to save it locally.
- Add “Reset local progress” with confirmation and a clear explanation.
- Explain that progress is device/browser-specific and can be lost when site data is cleared.
- Do not add analytics or trackers by default.
- Explain that Pyodide executes source/input on the learner's device; the app must not upload or log it. Disclose runtime asset hosting/CDN requests and host access logs separately. No execution-provider submission storage exists in the browser MVP. Update privacy terms before any future hosted integration.
- Follow applicable laws and hosting/provider terms; obtain qualified advice if adding accounts, analytics, or handling more personal data.

## 12. UI and accessibility

Design direction: clean, quiet, readable, notes-inspired. Use a restrained palette, generous line spacing, visible code blocks, and a clear topic hierarchy. Do not copy NUS branding or present the site as NUS-affiliated.

Responsive layouts:
- Desktop: topic sidebar/table of contents and main lesson column; exercise prompt and editor can use a split view.
- Tablet: collapsible navigation and stacked or adjustable editor/prompt.
- Mobile: single-column content and usable editor controls; no horizontal overflow.

Accessibility baseline:
- semantic landmarks and heading order;
- keyboard access to navigation, quiz controls, editor actions and dialogs;
- visible focus states;
- sufficient contrast;
- accessible labels and status announcements;
- do not rely on colour alone for pass/fail;
- respect reduced-motion preferences;
- test at narrow widths and with keyboard-only navigation.

## 13. Error states and resilience

Theory remains usable if runtime assets are offline, blocked or unsupported. Browser-practice states include loading failure, unsupported browser, syntax/runtime errors, execution timeout, cancelled job, output limit, malformed worker message and interrupted network download. Keep editor text and progress during recovery; offer Stop/Reset and a bounded retry. Also handle corrupted local progress and missing content slugs. Avoid endless loading, worker accumulation or silent auto-runs.

## 14. Quality and acceptance criteria

### Theory/quizzes beta (first release gate)

1. Every published item maps to verified 2026 outcomes with original/licensed material and honest partial coverage.
2. A learner completes the Python control-flow lesson/quiz/practice-prompt journey without an account.
3. Quiz answers have explanations; offline practice has model explanations and self-marked completion, not grading claims.
4. Progress persists across refreshes and can be reset; corrupted storage recovers safely.
5. Desktop/mobile and keyboard/contrast checks pass.
6. Relevant lint, typecheck, unit/integration/end-to-end checks and production build pass.
7. Setup, hosting, limitations, attribution/privacy and feedback documentation are complete; optional donations never affect access.
8. Vercel deployment/terms are checked; no secret/personal data is committed. No executable controls appear before runner readiness.

### Additional gate for browser Python practice

1. Gate 3 feasibility passes on the actual deployment and supported browsers, with a pinned runtime and documented licence/asset delivery.
2. Correct/incorrect examples, runtime errors, infinite loops, output floods and runtime loading failures yield useful bounded feedback.
3. Stop/Reset/timeouts work; the main UI, source text and progress survive recovery; stale responses are ignored and cases/jobs do not share interpreter state.
4. Isolation checks verify that executed code cannot access the main site's storage/DOM/cookies, navigate it or make unauthorized network requests.
5. Visible cases and local results are labelled inspectable self-checks. No hosted key, private tests or trusted-grade claims are introduced.
6. Source/input are not uploaded, telemetry is absent, and browser resource/performance limitations are disclosed.

If browser checks fail, ship the theory/quizzes beta only. Hosted grading has separate future acceptance criteria; it is not required for either initial theory or public-example practice.

## 15. Resume-quality evidence

Keep a small engineering log and be able to demonstrate:
- syllabus outcome-to-content traceability;
- isolated browser Python practice behind a replaceable adapter, once actually shipped;
- defensive message/input/output validation, cancellation and failure recovery;
- automated tests and CI;
- accessibility and responsive design;
- a documented architecture and trade-offs;
- feedback-driven iterations and usage metrics only if collected ethically and transparently.

Do not claim user numbers, performance gains, or learning outcomes without evidence. A truthful resume bullet can be drafted after the public beta and actual results exist.

## 16. Remaining decisions by milestone

Theory work can proceed under the owner's existing approval. Verified syllabus references and first topic are recorded in docs/phase-1-feasibility.md and docs/decisions/content-mapping.md.

Before browser activation, verify the exact pinned Pyodide/Python version, runtime asset delivery/cache/licensing, input/output conventions, isolated frame/worker deployment, message protocol, cancellation/limits, browser/device support and startup/resource costs. These are feasibility tasks, not reasons to block theory development.

External donation setup remains optional. Hosted grading/provider selection, private tests and any paid or additional service remain deferred and require separate authorization. Record material findings in docs/decisions/runner-provider.md; preserve the theory-only fallback if the browser runner cannot pass its gates.
