# Dependency maintenance — 12 November 2026

The baseline pinned Next.js 16.4.0 and ESLint configuration 16.4.0. A current
`npm audit --json --ignore-scripts` reported one critical production package and
eight moderate development-tool entries. The latter are one minimatch advisory
propagated through the TypeScript ESLint dependency chain, not eight distinct
application vulnerabilities.

## Change and maintenance cost

Update the existing exact Next.js and eslint-config-next pins together to
16.4.6. Keep React/React DOM 19.3.0 and ESLint 9.39.5 within their accepted peer
ranges. This addresses the official [image SVG advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw),
[Server Actions denial of service](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r)
and [cache typed-array advisory](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr).
Their patched floor is 16.4.1; the registry and audit recommend the available
16.4.6 patch. The app currently uses none of the searched image/action/cache
features, but that is not a reason to retain an affected version.

The latest inspected typescript-eslint 8.72.2 still requests minimatch ^10.2.2.
Use a narrow npm override only below `@typescript-eslint/typescript-estree` to
pin minimatch 11.0.1, patched for [GHSA-g3hv-75wg-m249](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249).
This crosses that tool's declared major range. Its consumed interface remains
`minimatch(filePath, pattern, { dot: true })`; lint, TypeScript checking and an
explicit matching smoke check must support this temporary compatibility choice.
Remove the override when upstream adopts a patched compatible range. Recheck it
when upgrading ESLint/TypeScript tooling; do not use `npm audit --force` to
downgrade the Next configuration or disable checks.

No direct package or service is added. These remain local/open-source build
tools and application dependencies, with no subscription or runtime execution
bill. New resolved transitive bytes are retained in the lockfile. Next/config
are MIT; minimatch is BlueOak-1.0.0. The entire tree has mixed licences, including
optional native-library obligations, so it must not be described as all MIT.
ESLint 9's existing upstream deprecation remains a maintenance limitation;
ESLint 10 is not introduced while bundled plugins have incompatible peer ranges.

## Evidence

The discovery agent `/root/beta_gap_audit` ran the original audit and exact npm
metadata reads for Next/config 16.4.6, typescript-eslint 8.72.2 and minimatch
11.0.1. The primary agent installed using `npm install --ignore-scripts
--fetch-retries=0 --fetch-timeout=30000`. A subsequent `npm audit --json
--ignore-scripts --fetch-retries=0 --fetch-timeout=15000` exited 0 with zero
known vulnerabilities. This is a dated advisory check, not a guarantee that no
vulnerability exists. Full application evidence is recorded in
[the beta verification record](../beta-verification-2026-11-12.md).

After the clean installation, `npm ls --all --json` exits 0 but reports six
extraneous optional WASM artifacts: `@emnapi/core`, `@emnapi/runtime`,
`@emnapi/wasi-threads`, `@img/sharp-wasm32`, `@napi-rs/wasm-runtime` and
`@tybys/wasm-util`. The discovery agent verified each installed version matches
an optional lock record; their non-Windows parent bindings are absent while
the applicable Windows native bindings are installed. Retained optional-platform
artifacts are a reasonable inference, not a proven npm defect. Preserve the
working installation rather than pruning or changing the manifest without a
demonstrated problem. No all-platform dependency-graph pass is claimed.
