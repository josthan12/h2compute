# Vercel hosting terms review — 13 October 2026

The owner authorized publishing the separate developer preview and necessary
local commits. Pushing and PR creation remain owner actions. This review does
not activate learner execution, authorize paid services or claim deployment.

## Suitability and constraints

Hobby appears suitable for the unpaid personal educational preview; that is an
inference from the documented project scope, not an account eligibility check.
Hobby is personal/non-commercial; paid development, ads and sales are commercial
examples, while donation requests are expressly exempted.
[Fair-use guidance](https://vercel.com/docs/limits/fair-use-guidelines).

Published Hobby allowances include 100 GB Fast Data Transfer, 10 GB Fast Origin
Transfer and one million CDN requests. Limits can pause service; allowance
remaining in the owner's account is unverified.
[Hobby plan](https://vercel.com/docs/plans/hobby),
[usage exhaustion](https://vercel.com/docs/plans).

The generated package directory is 16,294,036 bytes, including configuration and
manifest; public content is 16,216,826 bytes. It has 58 header rules, below the
published 2,048-route limit, and is below the 100 MB Hobby CLI upload limit.
Deployment acceptance is still untested.
[Deployment limits](https://vercel.com/docs/limits).

The 13,531,207-byte core allows about 7,390 runtime-only cold loads within
100 decimal GB, assuming raw transfer and no other traffic. Ten thousand loads
would be 135.31207 GB. These are calculations, not a visit allowance: actual
compression, cache behaviour, other assets and account usage change the budget.
The 8,242,613-byte ZIP is not the runtime's measured browser transfer size.

Current Terms section 3 enables model training for Hobby/trial Pro content and
allows opting out in team settings. Verify that opt-out before upload. Section 4
allows Hobby terms/availability to change; free hosting is not guaranteed.
[Terms of Service](https://vercel.com/legal/terms).

Vercel Authentication is available on Hobby. Protection/automation access and
notice/source accessibility must be checked without relaxing runner isolation.
[Deployment protection](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication).

## Hosted security-test restriction

Vercel expressly disallows penetration testing on Hobby and permits own-app
non-volumetric pentesting on Pro/Enterprise. Our browser-only isolation probes
may be ordinary application QA, but their exemption is not established by the
policy. Do not assume authorization for hosted adversarial tests. Ordinary
loading/header checks can be separated from those probes.
[Vercel pentesting policy](https://vercel.com/kb/guide/penetration-testing-on-vercel).

Seek clarification on whether the opaque-frame/worker DOM/storage/network-denial
checks, with no scanner/load test or platform attack, fall under that restriction.
No support message was sent; contacting Vercel requires owner instruction. No
paid upgrade or host substitution is authorized by publication approval.

## Next handoff

Confirm account plan, remaining usage, non-commercial eligibility and model
training opt-out. Publication authorization is already recorded; do not request
it again. Resolve hosted adversarial-test permission before running that part of
Gate 3. All deployment/device/memory/review/CI gates remain open, and learner
activation remains NO-GO. Local commits are permitted; push and PR remain with
the owner. This research turn made no commit or deployment.

Checks: official pages were opened directly, rather than relying on older search
snippets. Local package sizes/header count and bandwidth calculations were read
from the existing package; no assets, evidence or package hashes were changed.

## Setup follow-up — 13 October 2026

The owner confirmed model-training opt-out. CLI authentication verified active
Hobby and workspace access; the separate developer preview was published.
The [setup and delivery record](vercel-setup-2026-10-13.md) supersedes the earlier
upload-access blocker and package-acceptance uncertainty. The earlier package
figures above remain dated research evidence. Current allowance is unverified;
hosted adversarial-test permission, devices and learner activation remain open.

## Security-testing policy decision — 13 October 2026

Rechecked the official [pentesting policy](https://vercel.com/kb/guide/penetration-testing-on-vercel)
(published update: 17 June 2026) and
[fair-use guidance](https://vercel.com/docs/limits/fair-use-guidelines)
(published update: 14 September 2026). The specific policy excludes Hobby users;
its permission for non-volumetric own-application testing applies to Pro and
Enterprise. The fair-use page also lists penetration testing as prohibited use.
Direct Knowledge Base opens failed in the web tool; the primary site's indexed
full policy text supplied that result. The fair-use page opened directly.

**Decision: hosted adversarial verification is blocked on the current Hobby
plan.** No published exception was found for browser-only probes. Treat deliberate
DOM/storage/cookie/navigation escape attempts, network bypass attempts, forged
messages and resource-exhaustion probes as security testing for this plan. That
scope classification is our conservative application of the policy, not a
provider ruling about this harness. Small request counts and client-side Python
execution do not establish permission.

Provider clarification remains possible, but is not assumed. An owner may ask:
"Does Hobby permit security regression checks of an opaque iframe/data-worker
on our own protected static preview, including deliberate DOM/storage/navigation
escape, CSP network bypass and malformed-message attempts, with no scanner,
platform attack or load test? Please confirm the permitted scope in writing."
This is an unsent draft. No support contact, paid upgrade or replacement host
is authorized by this review. A reply must explicitly cover the intended probes
before that blocked work resumes; silence is not permission.

The [next focused verification proposal](milestone-3-verification.md#gate-3-review-and-next-verification-proposal--13-october-2026)
uses only normal fixed-program startup/cache measurements. It does not claim
that the deployed security gate passes.

## Owner contact decision — 15 October 2026

The owner explicitly chose **keep external contact blocked**. The
[generic policy question](vercel-policy-question-draft.md) remains an unsent
reference; no account creation, Community post or support message is authorized.
No provider clarification exists. The Hobby hosted-adversarial block remains in
force. The read-only installed CLI usage query returned billing cost data
unavailable for 1–15 October; remaining allowance cannot be inferred as zero or
within budget from that result.
