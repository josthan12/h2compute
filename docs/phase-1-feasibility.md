# Phase 1 planning and feasibility review

> **Historical review; direction updated 12 October 2026.** The owner approved theory-first work and requested a Pyodide browser-practice planning revision. Hosted-only recommendations and pending approval statements below describe the earlier pass, not the current plan. Follow [implementation.md](../implementation.md), [current status](../current-status.md) and the [runner decision](decisions/runner-provider.md): theory first, browser feasibility next, visible-example self-checks if feasible, hosted grading deferred. Syllabus mappings and dated hosted-service findings remain useful; no browser feasibility success is claimed.

**Checked:** 12 October 2026 (Singapore time)  
**Status:** Research complete; proposals awaiting owner approval. Application implementation has not started.  
**Scope:** Python programming; algorithms and data structures; relational databases and SQL only.

## Recommendation

Proceed, after approval, with a theory-and-quizzes-first beta on Vercel Hobby using the proposed Next.js/TypeScript and Git-based content stack. Retain local progress and a replaceable runner boundary. Do not subscribe to Judge0 or enable public execution yet: a suitable zero-cost hosted allowance and several production guarantees have not been verified.

Start with the bounded topic **Python control flow: sequence, selection and iteration**. Build its complete learning journey before expanding within the three confirmed areas. No accounts, database, analytics, payment backend, additional language or SQL execution service is proposed.

The existing roadmap calls this feasibility work Phase 0 and calls repository/application setup Phase 1. This report uses the owner's “Phase 1” label for planning only. Existing implementation checkboxes must remain unchecked.

## Evidence and limits of verification

Read AGENTS.md, README.md, implementation.md, roadmap.md, current-status.md, content-guide.md, docs/architecture.md, docs/testing.md and the decision templates. There are no authored lessons to audit; the specification contains a binary-search example and broad topic intentions. The table below audits that example and a proposed topic sequence, not finished teaching content.

The official syllabus was located through the [SEAB 2026 school-candidate index](https://www.seab.gov.sg/gce-a-level/a-level-syllabuses-examined-for-school-candidates-2026/), downloaded and read with pypdf. Relevant outcome tables were also rendered with Poppler and inspected. The old `/files/...` links in the original plans no longer worked during this check. The index currently links to [the 2026 9569 PDF](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf).

Source snapshot SHA-256: `CEDEEC26D6B4E57191E1DB5E2FFF9966CE444E115F48F745ECF7F703D25CC62B`. It has 13 pages; page references below are printed page numbers. Outcome references are SEAB's real numeric references, stored as strings alongside syllabus year 2026. Lesson slugs are internal identifiers, not official outcomes.

Hosting and runner findings are documentary verification. No provider account was created, subscription purchased, execution submitted, server route written or deployment made. Consequently the specification's live Gate 1 pass condition has **not** been met. Public documentation availability does not establish production uptime or an SLA.

## Syllabus mapping

All entries are **proposed/planned**, with nothing published. Grouped rows may become several lessons; they are not a commitment to a lesson count. Quizzes and exercises inherit only the outcome subsets they actually teach or assess.

| Proposed lesson/unit | Official references | Page | Mapping boundary |
| --- | --- | --- | --- |
| Python style | 2.1.1–2.1.3 | 8 | Coding conventions |
| Values, arrays and library use | 2.2.1–2.2.2 | 8 | Python examples |
| Control flow | 2.2.3; 2.2.6 | 8 | Non-recursive tracing only |
| Functions and recursion | 2.2.4–2.2.7 | 8 | Include recursive tracing/stacks later |
| Text files | 2.3.4 | 9 | Single-program file tasks |
| Validation, debugging and testing | 2.4.1–2.4.4 | 9 | Explicit test selection |
| Object-oriented foundations | 2.5.1–2.5.5 | 10 | Includes diagrams |
| Pseudocode, flowcharts and decomposition | 1.1.1–1.1.5 | 6 | Decision tables included |
| Sorting | 1.2.1–1.2.2; 2.3.1 | 7, 9 | Insertion, bubble, quick, merge |
| Searching, including proposed binary-search example | 1.2.3–1.2.4; 2.3.2 | 7, 9 | Linear, binary, hash |
| Efficiency | 1.2.5 | 7 | Worst-case time only |
| Data structures | 1.3.1–1.3.7; 2.3.3 | 7, 9 | Allocation, stacks, queues, lists, trees |
| Relational modelling | 3.3.1–3.3.5 | 11 | All key types, dependencies, 3NF, ER |
| SQL and Python/SQLite | 3.3.7–3.3.8 | 11 | SQL portion only |

These mappings come from the [official syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf). Respect its exclusions: space complexity; doubly/circular linked lists; BST node editing/deletion; method overloading/multiple inheritance. Decision tables have at most three conditions. Python 3 is specified, without a universal minor version. SQLite is part of the practical environment.

The SQL statement sequence (for example selection, filtering, joins, grouping and data changes) is an editorial breakdown of 3.3.8, not separately numbered SEAB outcomes. Use SQLite-compatible examples and document that interpretation when authoring.

### Coverage gaps to disclose

- 3.3.6 is outside the relational-only scope; 3.3.7 and 3.3.8 remain partial because their NoSQL requirements are deferred.
- 3.1, 3.2, 3.3.9–3.3.13, 3.4 and all of section 4 are not covered by the initial topic plan. This is a coverage disclosure, not a proposal to add them.
- Python foundations alone do not complete section 2. A binary-search lesson alone does not complete the search outcomes.
- Theory, tracing and quizzes cannot establish practical programming competence. Practical coverage stays partial while hosted execution is disabled. Flask/web applications and MongoDB remain outside this MVP.

## Judge0 hosted execution

### Availability and pricing

Judge0 remains an active product with reachable official documentation and a shared-cloud signup link to the official RapidAPI listing. Its site describes e-learning as a use case. This supports technical suitability, but does not substitute for the hosted plan's contractual permission for an anonymous public educational site. [Judge0](https://judge0.com/)

The public indexed [official RapidAPI pricing listing](https://rapidapi.com/judge0-official/api/judge0-ce/pricing) currently shows Basic as **pay per use, USD 0.0017/use**, rather than a confirmed free allowance. It shows Pro USD 44.99/month with 2,000 submissions/day, Ultra USD 89.99 with 5,000/day and Mega USD 169.99 with 10,000/day; listed extra use is USD 0.0017. A bandwidth platform fee is also displayed above its included 10,240 MB/month. Batched submissions are separately listed billing objects.

Judge0's own homepage instead displays EUR 27/54/107 monthly plans and EUR 0.001 extra submissions. These sources conflict. The marketplace page is dynamic and did not expose a complete live checkout in the research tool. **Treat these as indicative public listings, not a verified invoice quote or evidence of a free tier.** Confirm checkout currency, current prices, batch metering, polling charges, rate limits and any platform fees before subscribing. No older “50 free/day” claim should enter the budget.

[RapidAPI's billing documentation](https://docs.rapidapi.com/v2/docs/api-pricing) says pay-per-use and freemium access require a card; quotas can incur overage charges. A daily allowance is not necessarily a hard stop. A card-backed account is therefore unsuitable for an unbounded public runner under the zero-cost objective.

### API and integration constraints

The [Judge0 API reference](https://ce.judge0.com/) documents asynchronous submission tokens, result retrieval, batches and configurable sandbox resources. Its Python 3 example is language ID 71 / Python 3.8.1; that is an example, not verification of the current subscribed runtime. Enumerate `/languages` and inspect `/config_info` on the actual contracted endpoint after approval. Do not hard-code language choices from old examples. `wait=true` may be disabled and is discouraged; design bounded asynchronous polling. Submission deletion needs authorization and can be disabled. Resource defaults and queue size in the docs are illustrative, not purchased capacity or concurrency guarantees.

For the eventual adapter:

- Keep endpoint, Python language ID and authentication entirely server-side. RapidAPI key/host headers must come from the selected subscription; direct Judge0 deployments have configurable authentication headers. Never put keys in URLs.
- The browser uses same-origin application routes. Provider CORS is not needed for server-to-server requests; CORS does not protect a public endpoint from abuse.
- Use single-file stdin/stdout exercises initially. Each hidden case can require another execution: batches are not assumed free. Do not embed a secret grading harness inside learner-visible source.
- Allowlist fields; never accept user-supplied provider URLs, callbacks, language IDs, packages, compiler options or sandbox settings. Disable execution-network access and verify that the hosted endpoint enforces it.
- Proposed application limits, subject to runtime validation: 16 KiB source; 8 KiB input per case; 16 KiB decoded visible output; at most five execution cases per submission; CPU 2 seconds, wall time 5 seconds and memory 128 MiB if supported. Provider payload limits must still be checked. CPU/memory/output bounds at the application layer cannot replace enforced provider bounds.
- Limit visible requests at the host edge, bound provider calls and polling, and fail closed on quota errors, queues, malformed results or outages. Do not blindly retry a timed-out POST: it may already have created a billable execution.
- Return an application-owned result enum and a job handle scoped to the requesting browser if polling crosses requests. Do not expose raw provider tokens or a general-purpose provider proxy.
- Keep hidden inputs/answers out of static assets. Suppress all hidden-case stdout, stderr and provider details in learner responses. Code necessarily receives its test input; hidden tests are not secrets from the program itself. Aggregate feedback and disabled network access reduce leakage, but cannot promise absolute secrecy.

### Security, privacy and unresolved service guarantees

The upstream project disclosed three critical sandbox escapes in 2024. The relevant advisory lists versions through 1.13.0 as affected and 1.13.1 or later as patched. Obtain confirmation of current hosted patching/isolation and network restrictions; neither marketing language nor an upstream fix proves the shared service's deployed configuration. Self-hosting remains deferred. [Upstream advisories](https://github.com/judge0/judge0/security/advisories), [patched-version advisory](https://github.com/judge0/judge0/security/advisories/GHSA-q7vg-26pg-v5hr)

Judge0's published [privacy policy](https://github.com/judge0/judge0/blob/master/PRIVACY_POLICY.md) says it stores submission data, without specifying a retention duration, storage location or deletion commitment. Its statement about personal information does not prevent learners from putting names or other identifiers into source/input. Hosted retention, backups, deletion rights, access controls, subprocessors, permitted public use, patching, production concurrency and hard billing caps remain unverified. No provider has been contacted on the owner's behalf.

**Runner verdict:** technically plausible behind a replaceable adapter, but **not cleared for public activation**. The zero-cost fallback is the recommended initial release mode.

## Hosting and likely costs

| Option | Verified constraints | Likely beta cost | Assessment |
| --- | --- | --- | --- |
| Vercel Hobby | Personal/non-commercial use; donation requests explicitly exempted from commercial use. Current limits include 100 GB fast transfer, 1M CDN requests, 1M function invocations, 4 CPU-hours and 360 GB-hours provisioned memory. Excess usage can pause service. | USD 0 within limits | Recommended for existing Next.js plan |
| Cloudflare Pages Free | Static Next.js export; 500 builds/month, 20-minute builds, 20,000 files. Static asset requests are free/unlimited. A static export does not provide the proposed Next.js server route. | USD 0 for static beta | Viable alternative if chosen before coding |
| Cloudflare Workers | Free: 100,000 dynamic requests/day and 10 ms CPU/request; paid starts at USD 5/month plus applicable usage. Current full-stack Next.js guidance recommends beta vinext. | USD 0 only if free runtime limits fit | No need to adopt another runtime for this beta |

Sources: [Vercel fair use](https://vercel.com/docs/limits/fair-use-guidelines), [Hobby limits](https://vercel.com/docs/plans/hobby), [Next.js support](https://vercel.com/docs/frameworks/full-stack/nextjs); [Pages limits](https://developers.cloudflare.com/pages/platform/limits/), [static/function pricing](https://developers.cloudflare.com/pages/functions/pricing/), [Next.js deployment distinction](https://developers.cloudflare.com/pages/framework-guides/nextjs/); [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [Workers prices](https://developers.cloudflare.com/workers/platform/pricing/), [current Next.js guidance](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).

Vercel fits an independently maintained, unpaid educational project with voluntary donations under the reviewed guidance; reassess if sponsorship, ads, paid development or other financial gain is introduced. Use a personal repository/team; verify Git integration eligibility during setup. Cloudflare's reviewed [self-serve agreement](https://www.cloudflare.com/terms/) contains no identified equivalent hobby-only restriction, but does not give a specific donation exemption; eligibility is an inference subject to its service terms. Vercel gives the clearer donation guidance for this project.

Vercel currently includes one [WAF rate-limiting rule on Hobby](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting). That can protect a future run/status route without adding Redis. Per-IP limits do **not** impose an atomic global Judge0 spend cap across many IPs or server instances. An in-memory counter is not a reliable distributed budget control. Keep execution disabled until a verified provider hard cap or an explicitly approved durable quota mechanism exists. Do not add a new service just to bypass this blocker.

### Budget assumptions, not traffic forecasts

- Theory beta example: 100 learners × 20 visits/month × 1 MB transferred/visit = roughly 2 GB/month before bots/cache variation. Static pages, client-side quizzes and local progress should fit the cited host allowance. Expected service bill: **USD 0/month** on the free host subdomain, with runner disabled.
- Conditional runner example: 100 learners each making ten one-case runs and ten five-case submissions/month = 6,000 ordinary executions. At the indexed USD 0.0017/use rate, execution alone would be **USD 10.20/month**; 1,000 learners at the same usage would be USD 102.00. This assumes one billed use per ordinary execution, excludes polling/batch ambiguity, platform fees, taxes and exchange costs, and is not an authorized budget.
- Paid runner subscriptions have minimum monthly fees even if unused; quotas are daily, so short bursts matter. Host allowances do not include Judge0 charges.
- A custom domain is optional and not included; use the host subdomain to retain a zero service bill. External donation processing fees depend on the owner's later choice. No paid host, domain or donation service is selected.

## First complete topic and acceptance proposal

**Python control flow** is the first bounded topic, within Python programming. Selection and loops have fewer prerequisites than binary search, and its quizzes can remain useful without a runner. The original binary-search example remains valid for a later algorithm topic.

Proposed sequence: (1) sequence and branching, (2) counted/conditional loops, (3) combined control flow, tracing and debugging. Include a short prerequisite refresher on values, comparisons and input/output. Each lesson has an original worked example, misconceptions, a checkpoint quiz with explanations, one practice prompt and local completion. End with one small program design task combining branching and iteration. Do not describe this as complete Python or complete 2.2.6 coverage.

Acceptance after implementation: students navigate all three lessons; trace results and explain branch/loop choices; review quiz feedback; complete a local revision journey; refresh/reset progress; use the pages by keyboard and on mobile. All authored examples are tested locally before publication. Until runner activation, practice is explicitly offline/self-check with model explanations and learner-marked completion, never an “accepted” grading claim. No working Run/Submit control is advertised. Keep the editor dependency deferred until execution work is approved.

If execution is subsequently enabled, add correct/incorrect/runtime/timeout tests and a real hosted smoke test before claiming the complete graded coding loop.

## Remaining blockers and release gates

| Item | Blocks notes/quizzes? | Blocks public runner? | Closure evidence |
| --- | --- | --- | --- |
| Owner approval of plan and fallback acceptance changes | Yes | Yes | Explicit approval |
| Create repository; deploy chosen host | Before release | Before release | Real build/deployment smoke test after approval |
| Original content, code-example checks and item-level coverage | Before release | Before release | Reviewed content and meaningful tests |
| Judge0 checkout, use permission and runtime/rate/concurrency limits | No | Yes | Actual subscription terms and authenticated inspection |
| Retention/deletion and hosted security guarantees | No | Yes | Provider documentation/confirmation acceptable to owner |
| Global spend enforcement and abuse resistance | No | Yes | Hard cap and failure-path verification |
| End-to-end hosted execution | No | Yes | Server route smoke test after authorization |

No application Git working state could be verified: `git status --short` reports no repository in this workspace, and `git -C .. status --short` was denied. Repository creation remains unperformed. This does not prevent document research.

### Proposed plan amendments for approval

1. Confirm exactly the three MVP areas; use the verified outcome references above and replace stale source links.
2. Approve Vercel Hobby as the initial host, without paid upgrades or added services.
3. Approve theory/quizzes/local-progress acceptance for the initial beta. Gate 2 and MVP criteria requiring hosted grading become a separate execution activation gate; they are not falsely marked passed.
4. Approve Python control flow as the first complete topic; retain stdin/stdout and a provider-independent server adapter for later runner work.
5. Keep Judge0 unselected/unsubscribed and public execution disabled until its blockers are closed and any cost is explicitly approved.

Research is complete for this planning pass. Production feasibility remains conditional as stated. Implementation requires the owner's explicit approval; this report does not grant it.

## Verification record

Successful checks: current SEAB index → exact linked PDF; pypdf extraction; Poppler rendering of pages 7–11; visual inspection of pages 7, 8, 9 and 11; SHA-256 capture; primary-source hosting, API, pricing and security research.

Failures/limitations: old syllabus download returned 404; initial restricted-network download had DNS failure; PyMuPDF rendering was unavailable (`fitz` not installed), so bundled Poppler was used successfully; Git state unavailable as above; dynamic RapidAPI checkout and Judge0 status page were not inspectable enough to verify billing or uptime. No dependencies were installed. No lint, typecheck, application tests, build, live runner or deployment checks were run because this task is planning-only.

Relevant local commands actually run:

- `rg --files -g AGENTS.md -g implementation.md -g roadmap.md -g current-status.md -g architecture.md`
- PowerShell `Get-Content` for the planning documents and `Get-ChildItem` for the workspace/decision records.
- `git status --short` and `git -C .. status --short` (failed as described).
- `Invoke-WebRequest` against the old SEAB URL (failed) and the replacement government PDF URL (succeeded, including the exact currently linked copy).
- Bundled Python with `pypdf.PdfReader` to extract the learning-outcome pages (succeeded).
- Bundled Python `import fitz` rendering attempt (failed; module unavailable).
- `pdftoppm -f 7 -l 11 -scale-to 1200 -png 9569_y26_sy.pdf syllabus-check` (succeeded).
- `Get-FileHash 9569_y26_sy.pdf -Algorithm SHA256` (succeeded).

Documentation changes: this report, three proposed decision records, an architecture review addendum, and synchronized root current-status/roadmap updates. The specification's material acceptance amendments remain proposals for approval. Downloaded sources are local research artifacts, not educational content for redistribution.
