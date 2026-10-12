# Runner provider proposal

**Date checked:** 12 October 2026  
**Status:** Proposed; awaiting owner approval. Judge0 is not selected or subscribed.

## Context

Free, account-free education needs safe execution and predictable costs. Hosted Judge0 is a candidate, but published prices conflict and no adequate zero-cost hosted allowance was verified. Hosted retention, deletion, patching, limits, public-use permission and hard spend caps are unresolved.

## Proposed decision

Launch theory/quizzes/local progress first. Keep code execution disabled and preserve a provider-independent server boundary. Later prefer single-file Python 3 stdin/stdout tasks with server-owned tests, resource bounds, network disabled, bounded asynchronous polling and sanitized outcomes. Hidden-case output and provider tokens must not reach the browser.

The indexed [official marketplace listing](https://rapidapi.com/judge0-official/api/judge0-ce/pricing) shows Basic pay-per-use at USD 0.0017/use, while [Judge0's homepage](https://judge0.com/) displays different EUR prices. Neither is a verified checkout quote in this review. Do not assume a historical free tier.

## Alternatives and trade-offs

- Paid shared cloud: plausible later, but requires an explicit budget and enforceable spend controls.
- Other hosted provider: allowed behind the same contract if its terms and cost are verified; no additional provider is selected now.
- Self-hosted sandbox: deferred due to maintenance/security burden.

## Activation evidence

Require current contractual permission and billing, authenticated language/configuration inspection, acceptable retention/deletion and patching guarantees, enforceable resource/network/spend limits, and a real server-side Python smoke test covering correct/incorrect/error/timeout/quota cases. An upstream security patch is not proof of the deployed shared-cloud configuration.

Full findings, sources, proposed limits and cost assumptions: [Phase 1 review](../phase-1-feasibility.md). Revisit before any execution implementation or public activation, or if a genuinely suitable free allowance becomes available.
