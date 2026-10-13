# Local preview package review

Prepared 13 October 2026. This is a standalone developer test harness, separate
from the Next.js theory app. Learner execution remains disabled. No publication,
project linking, commit, push or deployment is performed by these scripts.

Acceptance: verified core bytes; complete retained notice inventory and available
Pyodide source; versioned assets; existing opaque-frame/data-worker CSP; explicit
MIME/cache policy with no CORS grant; a local package that can be reviewed and
tested without publishing it. Real-host/device/activation gates remain open.

## Reproduce and inspect

From the repository root, using the existing Python/Node/Playwright installation:

```powershell
# Only if runtime cache is missing:
python docs/pyodide-spike/download.py
# Only if notice/source cache is missing; requires network access:
python docs/pyodide-spike/collect-notices.py
# Local packaging, with no network access:
python docs/pyodide-spike/build-preview.py
node docs/pyodide-spike/preview-server.mjs
```

The output directory and ZIP are recorded in [preview-summary.json](preview-summary.json).
Open `http://127.0.0.1:3191` during local verification. The page has no editor,
Run or Check buttons and never auto-executes Python. The existing developer API
is exercised explicitly by the test driver. Stop the server after review.

In a second terminal:

```powershell
node docs/pyodide-spike/check-preview.mjs
python docs/pyodide-spike/test-preview.py
$env:SPIKE_TEST_URL = 'http://127.0.0.1:3191'
$env:SPIKE_RUNTIME_PREFIX = '/runtime/314.0.7/'
$env:SPIKE_RESULTS_FILE = './preview-results.json'
node docs/pyodide-spike/check.mjs
Remove-Item Env:SPIKE_TEST_URL, Env:SPIKE_RUNTIME_PREFIX, Env:SPIKE_RESULTS_FILE
python docs/pyodide-spike/check-docs.py
```

Generated output is ignored in Git and ESLint; authored scripts remain checked.
Only manifest-listed files enter the package. Source code/stdin/results, caches,
credentials, test drivers, unrelated repository files, node_modules and app routes are not
copied. The packager checks runtime/notice/source hashes, refuses to overwrite
an altered existing output directory and uses stable ZIP timestamps. Content
changes produce a separate digest-named package. Keep [distribution notices](DISTRIBUTION-NOTICES.md)
and [notice manifest](notice-manifest.json) with the review.

## Proposed host configuration

Each package contains `public/`, `vercel.json` and `package-manifest.json`.
The Vercel project root would be that generated package directory, **not the
repository root or theory app**. `framework: null`, empty install/build commands
and `outputDirectory: public` describe static delivery. `cleanUrls: false`
preserves `/frame.html`. No function, rewrite, route to learner code or extra
service is configured. A preview may require protection settings; do not let a
login/toolbar/header override alter the runner response. Do not publish any
package until the owner explicitly authorizes it.

The generated config enumerates every public file's exact headers. The loopback
server reads the same manifest; checks compare both representations and actual
HTTP bytes. This is local verification, not a test of Vercel routing/header
precedence. Configuration references, checked 13 October 2026:
[Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json)
and [cache headers](https://vercel.com/docs/caching/cache-control-headers).

- `/runtime/314.0.7/*`: original core bytes, explicit JavaScript/WASM/ZIP/JSON MIME
  and `public, max-age=31536000, immutable`. Never change bytes under these URLs.
- `/frame.html`: the original permissive JS-evaluation CSP is confined to the
  opaque `sandbox="allow-scripts"` runner. Worker HTTP remains denied.
- Host/worker delivery/notices/source: original strict host CSP and `no-store`.
  No CORS permission is configured on any response; `nosniff` is present.
- No indexable preview: robots disallow plus X-Robots-Tag. These are indexing
  hints, not access controls. Referrer-Policy is `no-referrer`.

The trusted host still preloads bytes from its own origin, then sends them over
a private capability port. The generated host changes only the runtime URL
prefix. Worker/frame bytes are identical to the verified local spike. No
allow-same-origin, runner HTTP permission or main-site unsafe-eval is added.

## Remaining publication and activation checks

Once publication is explicitly authorized and a host URL is supplied, verify
actual headers, redirects, CORS absence, notice/source availability, MIME,
immutable caching, compression and cold/warm transfer sizes. Run all adversarial
probes there, including same-origin HTTP denial, worker termination and recovery.
The local server is deliberately uncompressed; ZIP size is a review/download
artifact size, not measured browser transfer or actual host compression.

Runtime loading still transfers 13,531,207 raw bytes on a cold load; the source
archive/notices are separate downloads. Recheck current Hobby terms/bandwidth
allowances and preview protection before authorizing publication. Physical
Android/iOS, intended desktop engines, low-memory recovery and an honest browser
support policy remain required. Keep learner activation NO-GO until all gates
pass, and retain theory/offline practice.
