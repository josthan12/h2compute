# Hosting and feedback access recheck — 12 November 2026

Read-only discovery by agent `/root/beta_gap_audit`; no deployment, hosted
execution/security test, message, authentication change or protection change.
The earlier [October record](hosting-terms-2026-10-13.md) is preserved.

## Current official documents

- [Hobby plan](https://vercel.com/docs/plans/hobby): included 100 GB fast data
  transfer, 10 GB fast origin transfer and one million CDN requests; exhausted
  features may pause. These are allowances, not measured remaining usage.
- [Fair-use guidance](https://vercel.com/docs/limits/fair-use-guidelines), dated
  14 September 2026: Hobby is personal/non-commercial. Donations are exempt;
  this candidate does not configure them.
- [Terms](https://vercel.com/legal/terms), updated 19 October 2026: free-plan
  availability/terms can change. Hobby/trial model-training default and team
  opt-out remain. The prior owner-confirmed opt-out is historical evidence;
  current team settings could not be read and were not changed.
- [Penetration-testing policy](https://vercel.com/kb/guide/penetration-testing-on-vercel):
  Hobby penetration testing remains prohibited. The opened page displays
  3 November 2025, which differs from the saved October record's date; the
  substantive restriction is unchanged. External policy contact remains blocked
  by the owner. No browser-only exemption or permission is inferred.

## Access and commands

Connected Vercel `get_auth_user` confirms the existing account remains active on
Hobby. `list_teams` returns empty; explicit saved-team, preview-project and
billing-charge reads return 403 scope forbidden. Active membership does not
prove eligibility for this particular publication, available allowance, current
opt-out or production deployment.

Installed CLI: 63.1.2, Node 20.20.2. Help reads succeeded. Each of the following
read commands reported no credentials and started device login despite the
non-interactive flag. The discovery agent immediately cancelled each process;
each exited 1. No device login completed and no project was linked.

```powershell
vercel project inspect --non-interactive --format json
vercel project inspect h2compute-pyodide-preview --scope team_Z39ZqQNlBpVBnGnt7ktsEjSc --non-interactive --format json
vercel usage --since 2026-11-01T00:00:00Z --until 2026-11-12T23:59:59Z --scope team_Z39ZqQNlBpVBnGnt7ktsEjSc --non-interactive --json
```

Restoring deliberate CLI authentication or scoped connector access is the
smallest access action for current project/allowance checks. It does not itself
authorize public deployment. Protected developer-spike delivery remains
separate historical evidence, not production evidence for this theory beta.

## Feedback route

An unauthenticated GitHub API read confirms
[josthan12/h2compute](https://github.com/josthan12/h2compute) is public, active,
not archived, MIT licensed and has issues enabled. An ordinary GET of its
[issue tracker](https://github.com/josthan12/h2compute/issues) returned 200 and
exposed a new-issue link. Posting requires GitHub sign-in. No issue was filed.
The learner site links this route and asks writers to omit personal information
and credentials; it requires no app account to learn. The external site's
privacy policy applies when following the link.
