# Hosting provider proposal

**Date checked:** 12 October 2026  
**Status:** Proposed; owner approval and actual deployment pending.

## Proposed decision

Use Vercel Hobby for the proposed Next.js application, mostly static content and client-side quizzes/local progress. Start on the free host subdomain. No paid upgrade, database, analytics or payment backend.

[Vercel fair-use guidance](https://vercel.com/docs/limits/fair-use-guidelines) restricts Hobby to personal/non-commercial use and explicitly excludes donation requests from commercial usage. The unpaid independent education project appears eligible on that basis. [Current Hobby allowances](https://vercel.com/docs/plans/hobby) support a small beta, with possible pauses when limits are exceeded; zero cost is conditional, not permanent or unlimited.

## Alternatives and trade-offs

Cloudflare Pages Free can host a static Next.js export with free static requests; it cannot provide a Next.js server route from that export. Current Cloudflare full-stack guidance introduces a different runtime path, so adopting it is unnecessary for this initial beta. No second hosting service is added. See the [Phase 1 review](../phase-1-feasibility.md) for its limits and dated source links.

## Verification still required

After approval: create the repository, confirm personal Git/team eligibility, run a production build and deployment smoke test, check free limits in the account, and keep paid upgrades disabled. If hosted execution is later enabled, verify native edge limits and an enforceable global provider budget. Per-IP rate limits do not guarantee a spend ceiling.

Revisit before public beta, after hosting term changes, or if paid work/sponsors/ads or sustained traffic change eligibility/capacity.
