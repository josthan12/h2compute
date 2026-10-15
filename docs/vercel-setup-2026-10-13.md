# Vercel setup and developer preview — 13 October 2026

The owner authorized Vercel Hobby developer-preview publication and necessary
local commits, retaining control of push and PR. Learner activation remains
NO-GO. This project serves only the static developer harness; the theory app
has no runtime assets or execution endpoints.

## Setup and deployment receipt

Fetched and followed [Vercel's setup playbook](https://vercel.com/get-started.md).
Installed `vercel@latest` globally with npm; `vercel --version` reports **63.1.2**
on Node **20.20.2**. Interactive OAuth completed; `vercel whoami --format json`
verified account `josthan12`, active Hobby, workspace `poopoopeepee`.
The owner confirmed model-training opt-out before upload. Remaining allowance
and continued personal/non-commercial eligibility require owner monitoring.

The Vercel plugin is installed and enabled globally, including its guidance and
MCP tools. Documentation search works; MCP team listing returned an empty list
and explicit workspace reads returned 403. Authenticated CLI access to the
correct workspace works. No duplicate standalone skills or MCP configuration
was added; MCP workspace access remains a connector limitation.

- Project: `h2compute-pyodide-preview`, `prj_PkuO8behJUpWctZUJiUCmADIVQ5m`.
- Workspace: `team_Z39ZqQNlBpVBnGnt7ktsEjSc` (`poopoopeepee`).
- URL: [protected developer preview](https://h2compute-pyodide-preview-6xu10swwo-poopoopeepee.vercel.app).
- Deployment: `dpl_EtLXtsqjPxkTVUAeaGhwJ6tZQ3BA`.
- Target/status: **preview / READY**, confirmed by `vercel inspect`.
- Source baseline: local commit `2062897`, with the reviewed delivery-config
  follow-up in the working tree at upload; metadata is not a claim of a clean
  commit deployment. The content digest below identifies the actual package.
- Framework: static / Other, empty install/build commands, `public` output.
- Build: **8.294 seconds**, iad1, Hobby basic machine, 2 cores / 8 GB.
- Protection: Vercel Authentication retained. No Git integration configured.

Vercel classified the first upload as production despite `--target preview`,
creating the separate project's default alias. That initial deployment is
`dpl_HpYocD7TQe5V6P6nF3RCrLUeXvc2`; it is not the verified preview above and
still has the original CORS delivery defect. Subsequent uploads have been
confirmed as preview. Use the exact verified URL, not the default alias.
No theory-app deployment, push, PR, merge or paid service was performed.

## Delivery correction and evidence

Initial protected frame GET returned HTTP 200 and the original CSP but included
an injected `feedback.js` script and `Access-Control-Allow-Origin: *`.
Disabled `enablePreviewFeedback` and `enableProductionFeedback` on this separate
project; protection remained `all_except_custom_domains`. Frame bytes then
matched. An empty CORS override did not remove the wildcard; that experiment's
package/deployment remains preserved as historical evidence.

The final packager uses exact continuing routes for the same original headers
and a documented `response.headers` / `delete` transform for
`Access-Control-Allow-Origin`. This removes the permission without adding
network access or changing any CSP. See
[routing/transform documentation](https://vercel.com/docs/project-configuration/vercel-json)
and [toolbar settings](https://vercel.com/docs/vercel-toolbar/managing-toolbar).
Frame, worker, runtime, content and notice bytes are unchanged.

Final package: `314.0.7-1825befc25da`, 57 public files / 16,216,826 raw bytes,
59 ZIP entries / 8,242,608 ZIP bytes.
Content SHA-256:
`1825befc25da4421c26bb27cfb625a3f9714220cac2652cbd6bd40a17cd6d3f2`.
ZIP SHA-256:
`861554c82cb26ee2eb906110ae9e6c9dc2ee936c986aaab604ae323c673d16f3`.
Older digest directories, ZIPs and dated runtime evidence were preserved.

## Commands and scope

Commands ran from the repository root unless a package directory is stated.
Generated CLI staging copies live under ignored `docs/pyodide-spike/.runtime/`,
separate from immutable `.preview/` packages. CLI-generated `.env.local` OIDC
credentials and raw authenticated response headers remain ignored; none were
printed or staged.

```powershell
npm install --global vercel@latest
vercel --version
vercel whoami --format json
vercel project create h2compute-pyodide-preview --scope team_Z39ZqQNlBpVBnGnt7ktsEjSc --non-interactive
python docs/pyodide-spike/build-preview.py
python docs/pyodide-spike/test-preview.py
node docs/pyodide-spike/preview-server.mjs
node docs/pyodide-spike/check-preview.mjs
npm run lint
```

In the isolated final staging copy `.runtime/vercel-preview-source-1825befc25da`:

```powershell
vercel link --project h2compute-pyodide-preview --scope team_Z39ZqQNlBpVBnGnt7ktsEjSc --yes --non-interactive
vercel project inspect --non-interactive --format json
vercel deploy --scope team_Z39ZqQNlBpVBnGnt7ktsEjSc --project h2compute-pyodide-preview --target preview --yes --non-interactive --meta milestone=3 --meta sourceCommit=2062897 --meta packageContentSHA256=1825befc25da4421c26bb27cfb625a3f9714220cac2652cbd6bd40a17cd6d3f2 --json
vercel inspect https://h2compute-pyodide-preview-6xu10swwo-poopoopeepee.vercel.app --scope team_Z39ZqQNlBpVBnGnt7ktsEjSc --format json
```

Toolbar mutation, in an authenticated staging copy:

```powershell
vercel api /v9/projects/prj_PkuO8behJUpWctZUJiUCmADIVQ5m --method PATCH --scope team_Z39ZqQNlBpVBnGnt7ktsEjSc -F enablePreviewFeedback=false -F enableProductionFeedback=false
```

Response output was filtered to project identity, feedback fields and protection.
Ordinary delivery checks used this command pattern for each manifest-listed
public path, saving bodies and raw headers only in ignored `.runtime/`:

```powershell
vercel curl /frame.html --deployment https://h2compute-pyodide-preview-6xu10swwo-poopoopeepee.vercel.app --scope team_Z39ZqQNlBpVBnGnt7ktsEjSc -- --silent --show-error --compressed --dump-header <ignored-header-file> --output <ignored-body-file> --write-out '%{http_code} %{size_download}'
```

The local checker initially failed with sandbox loopback `EACCES`, then
`ETIMEDOUT` when the server/client ran on different sides of the sandbox.
Restarting both outside the sandbox resolved this; all 57 local checks passed.
The two packager safety tests passed. No broader application or runtime suite
was rerun for this delivery-only change; previous dated results remain intact.

All **57 hosted ordinary GETs passed**: HTTP 200, exact decoded SHA-256/size,
original CSP, MIME, cache, nosniff, referrer/indexing headers and absent CORS
permission. Sanitized per-file records are in
[hosted delivery results](pyodide-spike/hosted-delivery-results-20261013.json).
Decoded total was **16,216,826 bytes**, transfer total **8,245,566 bytes** with
CLI curl `--compressed`. The five runtime files transferred **6,424,104 bytes**:
four gzip responses plus the already-compressed stdlib ZIP. These are ordinary
CLI downloads, not browser startup or HTTP/header overhead measurements.
Repeating all five runtime downloads returned **CDN HIT** for each, with the
same hashes and 6,424,104 transfer bytes; see
[runtime repeat results](pyodide-spike/hosted-runtime-repeat-20261013.json).
CDN hits still transfer bytes to the client and do not establish browser-cache
reuse. The local collector commands were:

```powershell
python docs/pyodide-spike/.runtime/check-hosted-delivery.py
$env:HOSTED_RUNTIME_ONLY='1'
python docs/pyodide-spike/.runtime/check-hosted-delivery.py
```

The collector is an ignored session helper. The CLI command pattern above and
committed sanitized results describe its checks without exposing raw auth
headers. `python docs/pyodide-spike/check-docs.py` passed 15 Markdown files and
73 local links; ZIP SHA-256 and all 59 entry bytes matched the final directory.
The loopback server was stopped after verification.

`npm run lint` initially scanned generated upstream runtime copies under ignored
`.runtime/` and failed with 15 errors / 16,215 warnings. Added that generated
cache to ESLint global ignores, alongside `.preview/`; authored spike scripts
remain checked. The rerun passed. Package content does not include this cache
or its downloaded credentials.

## Remaining gates

These HTTP downloads do not exercise browser execution, cancellation, recovery,
cross-origin denial, cold/warm browser caching or physical-device memory limits.
Do not run hosted adversarial probes until the
[Hobby testing-policy question](hosting-terms-2026-10-13.md) is resolved.
Vercel Authentication protects both runtime assets and notices/source; ordinary
authenticated availability does not establish anonymous access.
Real Android/iOS, intended desktop engines, supported-browser policy,
low-memory recovery, independent educational/screen-reader review, hosted CI and
branch protection remain required. Learner execution stays disabled.

## Local follow-up — 15 October 2026

The later [benign Chromium run](milestone-3-verification.md#benign-hosted-chromium-verification--15-october-2026)
adds ordinary hosted startup/I/O/cache evidence. A separate
[local WebKit compatibility fix](pyodide-spike/DESKTOP-CHECK.md) now exists in an
undeployed candidate; this original hosted package remains unchanged and has
no WebKit pass. The owner explicitly keeps external contact blocked; the policy
draft remains unsent and hosted adversarial probes remain blocked. An installed
CLI `usage --json --scope <existing-workspace>` query returned billing cost data
unavailable for 1–15 October, not zero usage. Remaining allowance is unverified.
