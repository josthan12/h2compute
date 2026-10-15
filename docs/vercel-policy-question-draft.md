# Vercel Hobby policy clarification — unsent draft

Prepared 15 October 2026. **Owner decision: keep external contact blocked.**
Do not post or send this draft, create an account or ask again under the current
authorization. Retained only as an unsent reference; no provider reply exists.
This generic text
contains no project URL, account name, identifier, credential, learner data or
test output. Posting it requires the owner's explicit authorization; no account
creation, paid plan or private information disclosure is included.

Potential channel if separately authorized in future: Vercel Community, the normal Hobby support route identified in
[Vercel's support terms](https://vercel.com/legal/support-terms).

## Proposed post

Title: Clarifying Hobby security-testing policy for browser-only regression checks

I maintain a personal, non-commercial educational project on Hobby. A separate
protected static developer preview runs fixed Python examples entirely inside
an opaque sandboxed iframe and a browser worker. There is no server-side code
execution or submission/grading API. Learner execution is not enabled.

I understand that penetration testing is not permitted on Hobby. Before running
any hosted security checks, could an authorized Vercel representative clarify
whether the following small, sequential checks are prohibited pentesting or
permitted application regression QA?

- Deliberate attempts from that isolated browser context to access its parent
  DOM, storage or cookies, or navigate the parent.
- Attempts to verify browser-enforced network denial under the preview's CSP.
- Local cross-context message validation, genuine loop cancellation and bounded
  output-limit/recovery checks.

The checks would target only my own application and use dummy data. There would
be no scanner, request flood, load test, Vercel platform/infrastructure attack,
attempt to evade protection, or testing of another person's application.

Please confirm the permitted scope in writing, or confirm that these checks
must remain off Vercel on Hobby. Until clarified, I am running them only on
loopback; hosted checks are limited to ordinary loading and fixed-program I/O.

## Decision rule

Keep the current hosted adversarial-test block until an authorized provider
reply explicitly covers the intended checks. Community guesses, silence or a
generic documentation link do not establish permission. This draft does not
alter the milestone criteria, hosting choice or existing authorizations.
