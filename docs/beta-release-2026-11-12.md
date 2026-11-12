# Local beta setup and release gates

This candidate is a theory/quiz/offline-practice beta. Its eight bounded lessons
teach Python control flow, list searching and relational data/SQL. It requires
no app account, database service, execution provider or payment integration.
Progress is local, device/browser/site specific and self-marked. Browser
execution remains disabled. No full-syllabus, trusted-grading, affiliation,
public-user or measured-learning claims are made.

## Set up, build and launch

Use Node 22 (minimum 20.9), npm and Python 3 with standard-library SQLite. The
recorded local environment is in [verification](beta-verification-2026-11-12.md).
From PowerShell:

```powershell
Set-Location -LiteralPath 'C:\Users\crate\Documents\ProjectALEVEL'
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Stop with Ctrl+C. For a production
preview, stop the dev server and run:

```powershell
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

No environment variable is required for learning. Set
`$env:NEXT_TELEMETRY_DISABLED = '1'` before local development/build commands to
disable Next developer telemetry. The learner app contains no analytics.
All teaching data is fictional and committed; no learner source is collected.

```powershell
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

The end-to-end script starts the production build at 127.0.0.1:3100. Build first;
leave that port free. On Linux a fresh browser environment may need
`npx playwright install --with-deps chromium`, as in CI. Test output and
failure traces go in ignored `test-results/`.

## Learner checks and correction workflow

Try one complete path: home → topic → lesson → quiz/explanations → offline task
→ model review → lesson completion → refresh → incomplete filter → reset.
Quizzes explain all options. SQL tasks describe fixed input tables and result
rows; key design expects written reasoning. Learner Python/SQL is never run.
Examples are public and results are local self-checks.

The [public issue tracker](https://github.com/josthan12/h2compute/issues) is the
feedback route; reporting requires external GitHub sign-in. Include page URL,
expected/observed behaviour and a small reproducible example, omitting personal
data and credentials. Review serious content/accessibility/security reports
before publication; retain corrections as focused commits and rerun affected
checks. Independent teacher/student and screen-reader feedback remains missing.
Donations are optional and not configured.

## Release sequence still required

1. Obtain independent candidate review under `independent-review.md`.
   The owner's later 12 November instruction now authorizes agent push and PR
   creation/update for this repository. Follow the incremental delivery plan;
   merge, production publication and learner activation remain gated. Older
   handoff records retain the earlier owner-only authority as historical evidence.
2. Obtain the existing required teacher/student educational feedback,
   independent accessibility/screen-reader review and real-device checks.
   Record reviewer/device/browser/date, findings, fixes and evidence. Resolve
   serious findings and obtain re-review; emulation is not physical evidence.
3. Restore deliberate Vercel authentication or scoped connector access, then
   verify intended **theory app** project, personal/non-commercial Hobby
   eligibility, current team opt-out/allowance and candidate CI. Public GitHub
   reads report main unprotected; owner review and detailed authenticated
   protection verification remain open. Do not change protection under this
   authorization. See [hosting/access record](hosting-terms-2026-11-12.md).
   A signed-out CLI may launch device login even for a read command; complete
   authentication deliberately rather than letting automation create a link.
4. Obtain authorization for the concrete reviewed theory deployment. Existing
   developer-preview authorization applies to the separate runner preview, not
   public production. Use the repository root and its standard Next build;
   `.vercelignore` excludes `docs/pyodide-spike/`. Never promote the runner
   preview as the theory beta or relax protection to get tests working.
5. Verify ordinary deployed theory journeys/404s, asset delivery, keyboard/narrow
   layouts, privacy/coverage/feedback links and local progress at the final URL.
   Run permitted functional checks only. Record deployment/commit/CI identifiers
   and versions; do not run prohibited hosted adversarial testing.
6. Obtain full applicable milestone/release sign-off and owner publication
   approval. Record release notes/corrections and accurate portfolio evidence
   only after actual publication. No user counts or learning outcomes exist.

Runner feasibility can remain blocked/deferred while the theory beta meets its
own gates. No editor/Run/Stop/Check-examples controls may be activated without
all separate feasibility/device/provider gates and activation authorization.
