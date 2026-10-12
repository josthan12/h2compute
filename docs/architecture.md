# Architecture and Decision Notes

**Updated:** 12 October 2026
**Direction:** Milestone 1 theory foundation locally implemented; Pyodide browser practice remains deferred until feasibility. See milestone-1-verification.md.

## Overview

Next.js/TypeScript, mostly static Git-based Markdown/MDX lessons, client-side quizzes and local progress on Vercel Hobby. The MVP areas remain Python programming, algorithms/data structures and relational databases/SQL. First complete topic: Python control flow.

```text
Main website
  ├── Validated lessons/topics
  ├── Quizzes and explanations
  ├── Offline practice/model explanations (first)
  ├── Versioned local progress
  └── Python editor + replaceable runner adapter (later)
              |
              | bounded source/stdin and job messages
              v
       Isolated browser runner context
         └── Module worker + pinned Pyodide
               └── Bounded output / visible-example self-checks

No execution API, account database or hosted grading service in MVP
```

This isolated frame/worker arrangement is a required boundary, not a tested implementation. Verify it before enabling execution. The [historical Phase 1 review](phase-1-feasibility.md) retains syllabus/hosted-service research; its hosted-only recommendation is superseded.

## Content and progress

Validate metadata, slugs, numeric 2026 references and links. Only reviewed original/licensed content is published. Browser cases and answers are public. Use defensive versioned storage/reset for lesson/quiz/self-check progress. Do not save source by default. Client results are inspectable and alterable, not authoritative grades.

## Runner adapter

Introduce a small execute/cancel/reset contract during the practice milestone, independent of Pyodide-specific UI calls. Normalize loading/running/completed/examples-passed/examples-failed/runtime-error/timeout/output-limit/cancelled/unavailable states. Run and Check examples use supplied stdin, single-file Python and visible cases. No interactive terminal, arbitrary packages, language picker or hidden-test submission. Do not scaffold hosted services.

## Execution isolation and recovery

Code runs neither in Next.js nor the main UI context. Pyodide exposes JavaScript/Web APIs; a worker alone does not provide origin isolation. Investigate a sandboxed opaque-origin frame containing a module worker. Verify actual asset loading under CORS/CSP, deny main-site DOM/storage/cookie access and parent navigation, and restrict unauthorized network access. Do not grant same-origin privileges merely to fix loading. If safe isolated loading fails, retain offline practice.

Validate schema, session/job ID, size/rate and source/channel identity for cross-context messages. Opaque frame messages may have origin null; that value alone cannot establish trust. Discard stale/unexpected responses. Messages cannot choose arbitrary progress keys or HTML; render output as text. Treat runner verdicts as untrusted local self-checks.

The trusted UI owns cancellation/recovery and preserves source text. Use a watchdog and worker termination for infinite loops, cancellation and output flooding. Start independent jobs/cases in fresh interpreter state; verify malformed traffic cannot strand the UI or accumulate workers. Browser memory has no dependable per-run server-style quota; assess/document supported device limitations. Avoid requiring SharedArrayBuffer just for cancellation.

## Delivery, cost and privacy

Pin a reviewed Pyodide/Python release and test authored exercises. Prefer minimal same-deployment assets if file/bandwidth/licence constraints and isolated loading allow it; verify rather than assume compatibility. Lazy-load on explicit use. PyScript or another CDN/service is not required; explain trade-offs before adding one.

Pyodide uses MPL-2.0: retain distribution licence notices and review obligations if its files are modified. No per-run provider bill exists, but asset transfer consumes host allowances and students supply CPU/memory. Source/stdin must not be uploaded/logged; no runtime telemetry or auto-running shared code. Disclose asset requests and host access logs separately.

## Sequence and fallback

1. Theory components, validated content, quizzes and local progress.
2. One polished lesson, then the bounded Python control-flow topic with offline practice/model explanations.
3. Browser feasibility: pinned assets, isolated loading, stdin/output, cancellation/flooding/reset and desktop/mobile behavior.
4. Editor and visible-example practice only if feasible; beta hardening and expansion within the approved areas.

Theory may ship without execution. Hosted grading/private tests require separate authorization and server-side security/privacy/billing gates. No /api/run or provider credentials now.

Sources checked 12 October 2026: [Pyodide project/licence](https://github.com/pyodide/pyodide), [worker integration](https://pyodide.org/en/stable/usage/webworker.html), [compatibility](https://pyodide.org/en/stable/usage/wasm-constraints.html), [worker termination](https://developer.mozilla.org/en-US/docs/Web/API/Worker/terminate), [iframe rules](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe).

Decisions: [runner](decisions/runner-provider.md), [hosting](decisions/hosting-provider.md), [content mapping](decisions/content-mapping.md). Version/deployment configuration and runtime success remain unverified.

## Milestone 1 implementation

App Router pages are prerendered. The server-only filesystem loader reads bounded Git Markdown with validated JSON frontmatter; no learner input is executed. react-markdown escapes content and raw HTML is rejected. The shared Markdown AST parser validates publication links/anchors and derives the table of contents. Published lesson/exercise routes are generated statically; missing slugs receive a useful 404.

A client progress provider reads an external storage snapshot after hydration, stores only versioned review/completion flags, handles blocked storage in memory for the current visit, and resets only its own key after confirmation. Unsupported versions/corrupt state start fresh; there is no historical schema to migrate yet. The current implementation deliberately supports the one lesson journey; extend the lesson-keyed schema and migration tests when Milestone 2 adds lessons. Quiz answers are ephemeral and all answer explanations are public.

Use Tailwind CSS 4.3.3/daisyUI 5.7.47 with one h2notes theme and system fonts; there is no remote font, additional UI library, runtime/editor, server API, account or analytics integration. Build telemetry is a Next.js developer tool setting, separate from learner-app privacy. Deployment/host logs and terms remain a release check.
