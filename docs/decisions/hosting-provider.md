# Hosting provider proposal

**Date checked:** 12 October 2026  
**Status:** Owner-approved Vercel Hobby direction; actual deployment pending.

## Proposed decision

Use Vercel Hobby for Next.js, mostly static content and client-side quizzes/local progress. Start on the free host subdomain. Later Pyodide browser practice requires no execution API; verify asset sizes, bandwidth, caching, CORS/CSP and isolated worker loading before activation. No paid upgrade, database, analytics, additional host or payment backend.

[Vercel fair-use guidance](https://vercel.com/docs/limits/fair-use-guidelines) restricts Hobby to personal/non-commercial use and explicitly excludes donation requests from commercial usage. The unpaid independent education project appears eligible on that basis. [Current Hobby allowances](https://vercel.com/docs/plans/hobby) support a small beta, with possible pauses when limits are exceeded; zero cost is conditional, not permanent or unlimited.

## Alternatives and trade-offs

Cloudflare Pages Free can host a static Next.js export with free static requests; it cannot provide a Next.js server route from that export. Current Cloudflare full-stack guidance introduces a different runtime path, so adopting it is unnecessary for this initial beta. No second hosting service is added. See the [Phase 1 review](../phase-1-feasibility.md) for its limits and dated source links.

## Verification still required

Repository and origin are verified; confirm personal Git/team eligibility, production build/deployment, account free limits and no paid upgrades. Browser practice consumes asset bandwidth without a per-run bill. Future hosted grading would need separate edge limits and a global provider budget; that is not an MVP dependency.

Revisit before public beta, after hosting term changes, or if paid work/sponsors/ads or sustained traffic change eligibility/capacity.
