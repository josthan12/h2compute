# A-Level Computing Learning Platform

A planned free learning website for Singapore H2 Computing (syllabus 9569), combining structured theory notes, checkpoint quizzes and browser-based Python practice. The first public beta will cover **selected high-value topics in depth**, not the full syllabus.

**Project status: Milestone 1 theory foundation implemented locally.** One Python sequence/selection journey is available with an explanatory checkpoint, offline practice and versioned local progress. Deployment and hosted CI runs are unverified. Browser execution remains deferred.

## Documentation

- [`implementation.md`](implementation.md) — product and technical specification, security, acceptance criteria and open decisions.
- [`roadmap.md`](roadmap.md) — phased delivery plan.
- [`docs/milestone-workflow.md`](docs/milestone-workflow.md) — reusable milestone workflow, Git rules and continuation prompts.
- [`current-status.md`](current-status.md) — confirmed decisions, blockers and next actions.
- [`content-guide.md`](content-guide.md) — syllabus mapping and content standards.
- [`AGENTS.md`](AGENTS.md) — rules for coding assistants and contributors.
- [`docs/architecture.md`](docs/architecture.md) — architecture and trade-offs.
- [`docs/testing.md`](docs/testing.md) — testing strategy.
- [`prompts/initial-build.md`](prompts/initial-build.md) — prompt to use after planning approval.

## Product commitments

- Priority-topic beta with transparent syllabus coverage gaps; comprehensive coverage is deferred.
- Free for students; no account required in the MVP.
- Progress stored locally in the browser.
- Optional donations never unlock features or affect learning.
- Markdown/MDX content stored in Git.
- Confirmed MVP areas: Python programming, algorithms/data structures, relational databases/SQL.
- First bounded topic: Python control flow.
- Later Python-only practice uses Pyodide in an isolated browser runner, subject to feasibility, with visible tests and local self-check results.
- No execution API, provider key or private grading service in MVP; keep the adapter replaceable.
- Theory/quizzes beta remains viable if browser execution cannot pass its gates.

## Official syllabus

SEAB 2026 H2 Computing syllabus 9569:
https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf

The site is an independent educational project, not an official SEAB, MOE, NUS or school resource.

## Local development

Use Node.js 22 (minimum 20.9), npm and Python 3 for authored-example checks.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production preview: `npm run build`, then `npm run start`.

```sh
npm run lint
npm run typecheck
npm run check:content
npm test
npm run test:examples
python scripts/check-contrast.py
npm run build
npx playwright install chromium
npm run test:e2e
```

CI runs the same checks using Node 22 and Python 3.14. Browser tests start the production server on port 3100; build first. Set `NEXT_TELEMETRY_DISABLED=1` to disable Next.js developer/build telemetry (the learner app has no analytics).

Tailwind CSS 4.3.3 with daisyUI 5.7.47 is the sole styling system; the matching PostCSS plugin and PostCSS 8.5.29 are exact-pinned. See [UI styling decision](docs/decisions/ui-styling.md) for the purpose, component scope, official sources, cost and maintenance. Next.js/React provide the app; react-markdown renders text without raw HTML; mdast-util-from-markdown validates links and headings using the same Markdown syntax. TypeScript, ESLint and Playwright are local development tools, not paid services. The lockfile fixes resolved versions. Review updates and advisories periodically. ESLint 9.39.5 is deprecated upstream but remains within the peer ranges of Next.js's bundled React/accessibility plugins; upgrading to ESLint 10 currently produces invalid peers. Track this maintenance limitation.

Content lives in `content/lessons` and `content/exercises`. Metadata is JSON (also valid YAML) between Markdown `---` delimiters. Plain Markdown only; no MDX evaluation. Build/test validation enforces publication metadata, the checked 2026 outcome register, quiz explanations, exercise links and anchors. Only published files enter navigation. See [Milestone 1 verification](docs/milestone-1-verification.md) for acceptance evidence and limits.

Progress stores review/completion flags under a versioned, lesson-keyed `h2compute.progress` entry. It is local and self-marked; it does not certify learner code. There is no runtime, API runner, account, database, analytics or payment integration. Vercel deployment, current Hobby terms and branch protection still require verification before release.
