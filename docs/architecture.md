# Architecture and Decision Notes

## Dated planning review

The [12 October 2026 feasibility review](phase-1-feasibility.md) verifies the three confirmed MVP areas: Python programming, algorithms/data structures, and relational databases/SQL. Its hosting, runner and content decisions are proposals awaiting owner approval. No implementation has started.

The recommended initial beta is theory, quizzes and local progress on Vercel Hobby. Judge0 remains a candidate behind the server-side adapter described below; no suitable zero-cost hosted allowance was verified, and public execution stays disabled until its cost, privacy, security and live integration gates pass. Initial practice can be labelled offline/self-check. This fallback requires the owner to approve revised beta acceptance criteria; it does not satisfy the existing hosted-execution gate.

For future execution, prefer stdin/stdout, asynchronous bounded polling and host-native edge rate limits. Per-IP or in-memory limits do not enforce a global provider spend cap. Hidden inputs necessarily reach learner code; suppress hidden-case output and disable runner network access rather than promising absolute secrecy. See [runner proposal](decisions/runner-provider.md), [hosting proposal](decisions/hosting-provider.md) and [content mapping](decisions/content-mapping.md).

## Overview

The preferred design is a simple Next.js application with mostly static content and a small server-side boundary for code execution. The site should not require a database or account system in the first release.

```text
Browser
  ├── Pages and MDX content
  ├── Quiz interactions
  ├── Local progress adapter (localStorage)
  └── Python editor
          |
          | validated exercise slug + source code
          v
Next.js server route (/api/run)
  ├── validates body, slug, length and rate
  ├── loads trusted exercise/test definition
  ├── calls provider adapter with server-only credentials
  ├── normalises result and caps output
  └── returns safe, provider-independent status
          |
          v
Hosted isolated code execution provider
```

## Why this shape?

- MDX in Git makes lessons reviewable, versioned and easy to back up.
- Local storage avoids accounts, a database, and personal-data collection.
- A server-side adapter keeps provider credentials out of browser code and lets the provider change without rewriting the editor UI.
- A hosted runner avoids the substantial security and operational burden of self-hosting a sandbox.
- A static-first app minimises server work and hosting cost.

## Main boundaries

### Content boundary
Content files are source-controlled. A build/test step validates metadata, slugs, syllabus mapping fields and internal references. Only published content is visible in the learner navigation.

### Progress boundary
A typed adapter reads/writes versioned local storage. UI components should not directly manipulate storage keys. Invalid or outdated data should be handled safely, not crash the page. Provide reset progress.

### Runner boundary
The browser never contacts the provider directly. The server route validates and caps requests, resolves exercise metadata from trusted content, calls the provider, polls within a bounded timeout, and maps provider statuses to a fixed response schema. Do not send hidden tests to the browser.

## Provider selection gate

Do not select a provider only because its landing page says “free.” Verify:
- public educational use is permitted;
- API access and authentication requirements;
- free quotas, rate limits, concurrency and queue behaviour;
- data retention and privacy;
- supported Python version;
- resource limits and output caps;
- terms for a public beta and donations;
- what happens when the free quota is exhausted;
- whether the provider's service can be used without exposing a secret to the browser.

Record the selected provider, plan, URL, date checked, limitations and fallback in `docs/decisions/runner-provider.md`.

## Hosting and donations

Choose a host after checking current terms. Donations are optional, do not gate features, and may involve transaction fees or provider setup. Keep a donation link external rather than adding a payment backend. Verify that the hosting plan allows the project and its donation arrangement.

## Data flow and privacy

No account data is collected in MVP. Source code and optional custom input are sent to the hosted runner when a learner runs/submits code. State this in a privacy notice. Avoid sending names, email addresses or other personal data. Do not add analytics by default.

## Decision records

Use short ADRs under `docs/decisions/` for decisions that are difficult to reverse. Each record should include context, decision, alternatives, trade-offs, date and a revisit trigger. The runner and hosting decisions must be recorded before public beta.
