# Implementation Specification — Singapore A-Level Computing Learning Platform

**Status:** Draft for review — documentation only  
**Version:** 0.1  
**Date:** 12 October 2026  
**Owner:** Solo developer  
**Implementation status:** Not started; do not begin coding until this specification is approved.

## 1. Product summary

Build a free, syllabus-aligned learning website for students taking Singapore-Cambridge H2 Computing (syllabus 9569), beginning with the 2026 syllabus. The site combines structured theory notes, short formative checks, and browser-based Python programming practice. Its teaching style should be clear and structured, inspired by the organisation of university lecture notes, without copying another site's content or visual identity.

The project should also demonstrate software engineering quality for the owner's resume: clear architecture, tested code, documented decisions, secure integration with a code execution provider, accessible UI, and a public issue/roadmap process.

### Product principles

1. **Syllabus-first:** every published lesson and exercise maps to a syllabus outcome.
2. **Free for learners:** no paywall, subscription, account requirement, or ads in the initial public beta.
3. **Low-maintenance:** one developer should be able to understand and operate the system.
4. **Safety before convenience:** learner code must never execute directly inside the web application's own process.
5. **Honest feedback:** tests explain what failed without leaking hidden tests or server secrets.
6. **Progress without accounts:** save progress locally on the learner's device; explain that clearing browser data or changing devices may erase it.
7. **Incremental release:** ship one complete vertical slice, then expand from evidence and feedback.

### Confirmed beta coverage strategy — priority topics, not the whole syllabus

The first public beta will teach **several carefully chosen, high-value syllabus topic areas in depth**, rather than attempt comprehensive syllabus coverage. Selection must be grounded in the verified 2026 syllabus and consider learning value, prerequisites, availability of original explanations, and suitability for quizzes and Python practice. Do not state that the beta covers the entire syllabus.

- **First proof point:** one complete topic learning loop (lesson → quiz → Python practice → local progress) before scaling content.
- **Beta content:** expand into multiple coherent priority areas with linked, reviewed lessons and meaningful practice. As a planning target, aim for roughly 8–12 polished lessons and up to 20–30 Python exercises, **not fixed release requirements**; quality and safe operation take precedence over counts.
- **Coverage transparency:** show which syllabus outcomes are covered, partially covered, and not yet covered; distinguish original syllabus content from optional enrichment.
- **Release bar:** students can complete worthwhile, connected revision journeys within the selected areas; no promise of full-topic or full-syllabus completeness.
- **Later:** expand to remaining outcomes based on feedback, maintenance capacity and proven demand.

## 2. Goals and non-goals

### MVP goals

- Browse **selected priority syllabus topics** and lessons, with visible indications of beta coverage.
- Read responsive, accessible Markdown/MDX notes with diagrams, code, worked examples, and common mistakes.
- Complete embedded multiple-choice and short-answer checks.
- Open a linked Python exercise in an in-browser editor.
- Run sample/custom input and submit against exercise tests through a hosted execution service.
- See clear statuses: accepted, wrong answer, runtime error, time limit, compile/system error, or runner unavailable.
- Store lesson completion, quiz attempts, and exercise completion locally.
- Search/filter content by topic, difficulty, and status where useful.
- Offer a voluntary donation link without restricting learning access.
- Provide a clear feedback/bug-report path.
- Include automated checks, deployment instructions, privacy notes, and contributor documentation.

### Not in the initial release

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

Exercise page → read problem/specification → edit Python code → run sample/custom input → submit to tests → inspect failed case feedback → retry → mark completed locally.

### Journey C — revise

Topic overview → filter lessons by incomplete status → revisit weak concepts → retry quizzes/exercises.

### Journey D — provide feedback or donate

Footer/About page → submit feedback or open voluntary donation link. Donations must never change access, scores, or features.

## 4. Syllabus alignment and content integrity

Use the official SEAB 2026 H2 Computing syllabus 9569 as the source of truth:  
https://www.seab.gov.sg/files/A%20Level%20Syllabus%20Private%20Cddts/2026/9569_y26_sy.pdf

Before publishing the selected priority-topic tree, inspect the PDF and transcribe the relevant sections and learning outcomes accurately. Do not rely on informal topic lists alone. Store a stable syllabus outcome ID and a human-readable reference for every lesson, quiz, and exercise. Record the syllabus year/version.

The content system must distinguish:
- **Official syllabus wording:** short, attributed references where needed.
- **Original teaching explanation:** written by the project owner.
- **Practice question:** original or appropriately licensed.
- **External reference:** link and access date if relevant.

Do not present unofficial notes as official SEAB material. Re-check the syllabus before a major content release and record any mapping changes.

## 5. Scope and release gates

### Gate 0 — planning approval
Approve this specification, runner strategy, deployment constraints, content model, and MVP boundaries. No implementation before approval.

### Gate 1 — feasibility spike
In a throwaway branch or minimal proof of concept, verify the chosen host can deploy the intended app and that the hosted runner permits the intended educational use within an acceptable free allowance. Check authentication requirements, rate limits, data retention, privacy terms, CORS/server-side API requirements, and whether a payment/donation link affects hosting eligibility. Document the provider and date checked.

**Pass condition:** a Python sample can be submitted through a server-side route, safely bounded by provider limits, without exposing API credentials, and the expected monthly cost is acceptable to the owner.

**Fallback:** if no suitable hosted free allowance exists, launch theory and quiz functionality first with a clearly labelled “coding runner temporarily unavailable” state, or use a mock runner only for local development. Do not silently ship a nonfunctional Run button or run untrusted code on the app server.

### Gate 2 — vertical slice
One syllabus topic, one lesson, one checkpoint quiz, and one Python exercise must work end to end. This proves the learning loop before bulk content authoring.

### Gate 3 — MVP completeness
Content navigation, progress, runner failure handling, accessibility, tests, privacy notice, deployment, and feedback route are ready.

### Gate 4 — public beta
Invite a small group to test; publish known limitations, feedback route, content correction process, and incident/runner outage plan. Beta is not a claim of official endorsement.

## 6. Recommended architecture

### Default recommendation

- **Framework:** Next.js App Router with TypeScript.
- **Styling:** Tailwind CSS or a similarly simple CSS approach; use one consistent system rather than multiple UI libraries.
- **Content:** Markdown/MDX files committed to Git, with frontmatter validated at build/test time.
- **Editor:** CodeMirror 6 configured for Python.
- **Code execution:** a hosted execution API accessed only through a server-side adapter route. Judge0 is a candidate, not a committed dependency until Gate 1 is passed.
- **Progress:** browser local storage behind a typed storage adapter and schema version. No account or database in MVP.
- **Hosting:** static-first/Next-compatible host selected after checking current free-tier and project-use terms. Vercel is one candidate, not an unconditional choice.
- **Testing:** unit/component tests for parsing, quizzes, progress and result mapping; end-to-end tests for core learner journey; typecheck, lint and production build in CI.

This is deliberately not a microservice architecture. Avoid a separate database, authentication service, analytics platform, and backend service unless a concrete MVP requirement demands one.

### Cost principle

Keep the site static where possible and use server routes only where required (principally code execution). Do not introduce a payment processor, database, analytics, or authentication dependency just because it is familiar. A donation link can be an external link and must be optional.

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
│   └── api/run/route.ts
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

Keep paths adaptable to the framework's conventions. Do not create empty abstractions for speculative future features.

## 8. Content schema

Each lesson should have frontmatter such as:

```yaml
title: "Binary search"
slug: "binary-search"
topic: "algorithms-and-data-structures"
syllabus:
  year: 2026
  outcomes:
    - "VERIFY-AGAINST-OFFICIAL-PDF"
difficulty: "core"
estimatedMinutes: 12
prerequisites: []
relatedExercises:
  - "binary-search-index"
status: "draft"
```

Replace placeholder outcome IDs only after checking the official syllabus. Content validation must fail CI for missing required fields, duplicate slugs, invalid links where testable, or references to nonexistent exercises.

Exercise metadata should include slug, title, topic, difficulty, syllabus mapping, prompt, constraints, examples, starter code, sample tests, hidden tests, hints, explanation, and tags. Hidden tests must remain server-side or inside the trusted runner configuration; never embed hidden expected answers in the client bundle.

## 9. Theory and quiz behaviour

- Render semantic headings, a table of contents for longer lessons, code blocks, callouts, figures with alt text, and previous/next/related links.
- Keep paragraphs short and examples exam-relevant.
- Quiz answers should be checked locally where possible. Explain why an answer is right and why distractors are wrong.
- For short-answer questions, MVP may use exact/normalised expected answers only where fair; do not imply a brittle text matcher understands every valid answer.
- Randomisation must not make questions ambiguous or make it impossible to review previous answers.
- Avoid excessive gamification. Progress indicators should support revision, not shame learners.

## 10. Python exercise runner contract

All execution requests pass through a server-side route and a provider adapter. The browser must never receive provider secrets. Validate request body size, exercise slug, language ID, code length, input length, and request rate before contacting the provider.

Suggested request shape:

```json
{
  "exerciseSlug": "binary-search-index",
  "sourceCode": "def solve(...): ...",
  "mode": "run"
}
```

The server resolves the exercise from trusted repository content and determines which tests to run. The client must not submit arbitrary test definitions for hidden-test mode. `run` mode may use public sample input; `submit` mode executes the server-defined test set.

Response shape should be stable and provider-independent:

```json
{
  "status": "accepted",
  "summary": "All visible tests passed.",
  "results": [
    {
      "label": "Example 1",
      "passed": true,
      "expected": "…",
      "actual": "…"
    }
  ],
  "execution": {
    "timeMs": 42
  }
}
```

Do not return provider internals, environment variables, hidden test inputs/outputs, stack traces containing secrets, or raw unbounded stderr. Map provider outcomes to a fixed status enum. Handle queued submissions, timeout, quota exhaustion, malformed responses, provider outage, and rate limiting.

**Important security limitation:** the app server must not execute arbitrary learner code directly. Use a reputable isolated runner with resource limits. Verify provider terms, privacy, data retention, free quotas and permitted public educational use before selecting it. Do not send student names or personal information to the runner.

## 11. Local progress and privacy

- No account is required in MVP.
- Store progress in local storage with a schema version and defensive parsing.
- Store only what is needed: completed lesson IDs, quiz summaries, exercise status, and timestamps if useful.
- Never store source code by default unless the user explicitly chooses to save it locally.
- Add “Reset local progress” with confirmation and a clear explanation.
- Explain that progress is device/browser-specific and can be lost when site data is cleared.
- Do not add analytics or trackers by default.
- Include a privacy page explaining what code is sent to the execution provider and what the site itself stores.
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

Design explicit UI for:
- runner not configured;
- provider unavailable or slow;
- submission queued;
- rate limit/quota reached;
- malformed code or runtime error;
- output too long;
- no network;
- corrupted local progress;
- missing lesson/exercise slug.

A failed runner must not erase learner code or progress. Show a retry action only when safe and useful. Avoid endless polling.

## 14. Quality and acceptance criteria

MVP is acceptable for beta only when:

1. Every published item maps to a verified syllabus outcome and includes original or properly licensed material.
2. A learner can navigate topic → lesson → quiz → linked Python exercise.
3. A working solution passes all public and hidden tests, and a known incorrect solution produces a meaningful wrong-answer result.
4. Runtime, provider outage and rate-limit states are handled.
5. Provider credentials are server-only and no hidden test data is shipped to the client.
6. Progress persists across refreshes on the same browser and can be reset.
7. Site remains usable on desktop and mobile and passes basic keyboard/contrast checks.
8. `lint`, typecheck, unit tests, end-to-end smoke tests, and production build pass.
9. README documents setup, environment variables, provider setup, limitations, and deployment.
10. Privacy, terms/attribution, feedback, and donation pages/links are present where applicable.
11. No secret or personal data is committed.
12. Deployment and runner terms/free-tier eligibility have been checked and recorded before public beta.

## 15. Resume-quality evidence

Keep a small engineering log and be able to demonstrate:
- syllabus outcome-to-content traceability;
- an isolated, provider-agnostic code runner integration;
- defensive validation, rate limiting, and failure handling;
- automated tests and CI;
- accessibility and responsive design;
- a documented architecture and trade-offs;
- feedback-driven iterations and usage metrics only if collected ethically and transparently.

Do not claim user numbers, performance gains, or learning outcomes without evidence. A truthful resume bullet can be drafted after the public beta and actual results exist.

## 16. Open decisions before implementation

- Which hosted runner provider and plan meet cost, quota, terms and privacy requirements?
- Which hosting provider permits this project under its current free-tier terms?
- Exact syllabus topic/outcome identifiers after auditing the official PDF.
- Whether the initial public beta should expose code execution immediately or launch notes/quizzes first if runner terms fail.
- Donation provider and whether it introduces fees or account requirements for the owner.
- Whether exercise evaluation should use stdin/stdout or function-based calls. Prefer a consistent interface with the syllabus and exercise set.

Do not resolve these by assumption. Record each decision in `docs/decisions/` before coding if it materially affects architecture or cost.
