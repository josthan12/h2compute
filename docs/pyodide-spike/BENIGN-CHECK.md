# Bounded benign browser check

This separate driver runs three fixed programs: supplied stdin/stdout/stderr,
Unicode without a final newline on the same page, and the first program again
after reload. It never imports `check.mjs`, accepts learner source, changes the
runner/package, or runs adversarial probes. No dependency was added. The existing
Playwright installation supplies desktop Chromium; this is not device evidence.

Run from `C:/Users/crate/Documents/ProjectALEVEL`:

```powershell
node --check docs/pyodide-spike/check-benign.mjs
node --test docs/pyodide-spike/check-benign.test.mjs
npm run lint
node docs/pyodide-spike/preview-server.mjs
# In another terminal, with the server reachable in the same environment:
node docs/pyodide-spike/check-benign.mjs --local
```

The local check verifies the existing immutable package
`314.0.7-1825befc25da`; it does not rebuild it. Stop the loopback server afterwards.
Missing package assets or a changed hash fails the check. The driver verifies
each delivered executable/core asset against the local manifest, original CSP
and absent CORS permission. This is delivery inspection, not a sandbox escape
test. The three original 30-second loading/five-second execution budgets remain.

## Protected hosted run

`--hosted` targets only the exact preview URL recorded in
[the deployment receipt](../vercel-setup-2026-10-13.md). It inspects that deployment
and the linked project through the already authenticated CLI. It requires the
existing protection setting and exactly one already configured automation
credential. It never creates a credential or updates project settings.

The credential is used in memory for one exact-origin request with redirects
disabled, exchanging it for an exact-host Secure/HttpOnly session cookie. The
browser uses that cookie without global auth headers or request routing. Cookies,
raw headers, CLI responses, traces, HARs and storage state are not exported.
Failure to establish this session stops the check. No authentication/protection
workaround should be substituted without review.

For the installed Windows CLI used in the recorded run:

```powershell
$env:VERCEL_CLI_ENTRY = 'C:/nvm4w/nodejs/node_modules/vercel/dist/vc.js'
# Use the existing linked staging directory for the authenticated CLI context:
Set-Location 'C:/Users/crate/Documents/ProjectALEVEL/docs/pyodide-spike/.runtime/vercel-preview-source-1825befc25da'
node C:/Users/crate/Documents/ProjectALEVEL/docs/pyodide-spike/check-benign.mjs --hosted
```

Adapt only the installed CLI filesystem path on another machine. The host,
deployment, package digest and three programs are intentionally pinned. A new
preview requires a deliberate reviewed driver update. The separate CLI OIDC
preflight/refresh used during this investigation is recorded in the verification
log; the final driver uses the existing automation session, not that local token.

## Evidence and limits

Each invocation writes a new sanitized JSON file under ignored `.runtime/`,
using a timestamp/UUID and exclusive creation. It never overwrites original
results. The retained [15 October hosted result](hosted-benign-results-20261015.json)
is an exact copy of that run's sanitized file; the reviewed summary is in
[Milestone 3 verification](../milestone-3-verification.md).

The driver checks exact output/version, successful frame/worker cleanup and host
responsiveness. It records Resource Timing plus Chromium DevTools cache flags;
same-page host-buffer reuse and post-reload browser caching are separate results.
Transfer sizes are browser measurements, not a complete account bandwidth bill.
It permits only manifest GET paths (plus favicon), bounds browser requests to 24
and core requests to 10, and closes the context if observed traffic leaves that
scope. Browser session cookies are limited to the exact preview host.

This driver does not validate syntax/error feedback, hostile-job cancellation,
origin/network denial, malformed-message handling, fresh interpreter isolation,
peak memory, other engines, physical devices or eventual learner-app integration.
The existing Hobby policy block remains. No successful benign result activates
learner execution or completes Gate 3.
