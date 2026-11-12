# D2 progress recovery — 12 November 2026

Scope: local progress recovery/reset within the existing account-free theory
beta, after D1 was reviewed, published and verified on Linux. Baseline
`54a34f687bd8ff1d6157ba7965848430039d425c`. No content, runner, storage schema,
direct dependency, service, account or source-upload feature is added.

## Reproduced failures and acceptance

Two-tab tests reproduced stale failed-save memory overwriting a different
lesson's saved flags, and hiding an independently reviewed model of the same
lesson. Removing an already-absent key also failed to notify a peer retaining
unsaved progress. A read failure with working writes could overwrite stored
data from an invented empty base. These are recovery defects, not trustworthy
grading concerns; progress remains inspectable and self-marked.

The production regressions were added before the repair. The six selected
cases all failed against the old build:

```powershell
npx playwright test tests/e2e/progress-recovery.spec.ts --project=desktop-chromium --grep 'failed-save retry preserves|unreadable storage|absent-key peer reset' --workers=2
```

Exit 1 was the expected pre-fix result. Existing assertions/timeouts were
retained. Candidate acceptance requires these failures repaired, earlier
migration/corruption/reset/storage behavior preserved, and production checks
plus a fresh independent exact-candidate review.

## Implementation and fallback behavior

- Pending state contains only partial flags for registered lessons: bounded by
  eight IDs and three booleans each. It overlays the newest readable stored
  progress rather than replacing it with a stale complete snapshot. Independent
  flags and neighboring lessons survive a later explicit save.
- A synchronous pending reference preserves consecutive actions before React
  rerenders. Side-effecting writes are kept outside state-updater callbacks.
  Prerequisite revocation also retains `completed: false`, so restoring a flag
  cannot accidentally resurrect completion from a newer base.
- Tagged reads distinguish an unavailable base from valid/corrupt stored text.
  A save is prohibited while the base cannot be read. Pending visit work remains
  usable, and a later explicit action can merge/save it after reads recover.
  No background write is triggered merely by storage recovery. Stored raw
  `loading`/`unavailable` strings recover as corruption rather than colliding
  with internal readiness/error states.
- Failed reset retains an explicit local empty-base intent. A later successful
  action cannot restore flags that the user reset. Normal reset temporarily
  writes an empty record to the existing owned key, then independently attempts
  removal; even an initially absent key can emit the native removal event.
  A failed write never prevents the removal attempt, and no new persistent key
  or metadata is introduced.
- Reset uses one notification authority. Native storage events handle a known
  removal. A feature-detected same-origin `BroadcastChannel` is only a fallback
  when that signal cannot be generated, with two fixed reset-only strings,
  strict equality validation, harmless unsupported/constructor/post failures,
  explicit listener removal/close and no progress/source payload.
- If read/marker-write fail but removal is accepted, the sender cannot know
  whether an absent key generated an event. It reports that other open tabs may
  need their own reset and avoids sending a potentially delayed second reset
  that could erase fresh work. When every notification path is unavailable,
  local learning/reset remains usable; cross-tab delivery is not promised.

Native storage has no cross-tab locking guarantee, so this is bounded recovery
for observed updates and explicit actions, not a claim of atomic distributed
transactions. Sources checked: [WHATWG Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html)
and [Broadcasting](https://html.spec.whatwg.org/multipage/web-messaging.html#broadcasting-to-other-browsing-contexts).
No network service or provider execution is involved.

## Verification history

Implementation agent `/root/hardening_audit_next` personally ran unit tests,
lint, typecheck, a production build, the new production-browser regression file
and the complete suite. A design critique found/fixed the prerequisite invariant
and sentinel collision before these final builds.

At the first repaired checkpoint:

- `npm test`: 22 passed.
- `npm run lint`, `npm run typecheck`, `npm run build`: exit 0.
- New regression file: 26 passed across desktop/mobile Chromium, 24.6 seconds.
- `npm run test:e2e`: 204 passed, no skips, 1.9 minutes; all earlier 178 retained.
- `git diff --check`: exit 0.
- Personally queried local versions: Node 20.20.2, Playwright 1.64.0, Next 16.4.6.

Before the candidate was finalized, the primary agent identified an adjacent
listener loss: a later denial of `window.localStorage` itself caused the
storage-area identity guard to drop a genuine peer reset. A new regression
reproduced practice progress being restored after the peer reset, while also
asserting that session-storage owned-key/clear events are rejected:

```powershell
npx playwright test tests/e2e/progress-recovery.spec.ts --project=desktop-chromium --grep 'later localStorage getter denial'
```

Exit 1, one failed before the correction. The provider now captures only the
local-storage object identity during effect setup for event comparison. It
does not use that reference to bypass denied reads/writes; tagged fresh reads
still control saving. A tab whose storage was inaccessible from initialization
cannot acquire that identity; if no usable reset signal is available, its
visit-only work may require its own reset. No cross-tab delivery guarantee is
claimed for such an inaccessible tab.

The final corrected rebuild passed:

| Exact command | Local result |
| --- | --- |
| `npm test` | Exit 0, 22 passed. |
| `npm run lint` | Exit 0. |
| `npm run typecheck` | Exit 0. |
| `npm run build` | Exit 0, 24 generated entries; existing unrelated parent-lockfile warning. |
| `npx playwright test tests/e2e/progress-recovery.spec.ts` | Exit 0, 28 passed on the two existing Chromium profiles, 24.3 seconds. |
| `npm run test:e2e` | Exit 0, **206 passed**, no skips/retries/assertion weakening, 2.0 minutes. |
| `git diff --check` | Exit 0. |

The 206-case result supersedes the earlier 204-case checkpoint and includes the
getter-denial repair. The new regression positively waits for pending model
review to clear while the getter is still denied, rejects both owned-key and
null-key session-storage reset events, restores access, saves quiz review and
verifies the old model flag stays false. All original 178 cases remain intact.
No source edit followed that final build/test run. All owned local browser/server
processes terminated. These are local Chromium observations, not physical-device,
screen-reader or deployed evidence. Exact-candidate independent review and then
the new head's hosted CI remain required before delivered D2 readiness.

[Delivery evidence](delivery-verification-2026-11-12.md) retains the separate
D1/PR/CI history; D3 workflow changes remain queued until D2 integration.
