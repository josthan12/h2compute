# Testing Strategy

## Goals

Test the learner journey, educational correctness, local progress, and the boundary to the hosted runner. The runner is an external dependency and needs both adapter tests and failure-path tests.

## Automated checks

### Static quality
- TypeScript typecheck.
- Lint and formatting check.
- Production build.
- Content metadata/schema validation.
- Internal lesson/exercise reference validation.

### Unit tests
- Frontmatter/content parser and duplicate slug detection.
- Quiz answer normalisation and feedback mapping.
- Local progress schema migration, corrupted JSON recovery, and reset.
- Runner request validation: missing slug, unknown slug, oversized code/input, unsupported mode.
- Provider status mapping, timeout and malformed response handling.
- Output sanitisation and size limits.

### Integration tests
- Server route uses trusted exercise configuration.
- Hidden tests are not returned in the API response.
- Provider credentials are never included in client bundles.
- Rate-limit logic rejects repeated requests as configured.
- Runner adapter handles queue/polling and does not poll indefinitely.

### End-to-end smoke tests
1. Open a topic and lesson.
2. Answer a checkpoint quiz and view explanation.
3. Mark a lesson complete and refresh; progress remains.
4. Open linked exercise and edit starter code.
5. Run a sample and see output.
6. Submit a correct solution and receive accepted.
7. Submit an incorrect solution and receive wrong answer.
8. Trigger a runtime error and receive a useful message.
9. Simulate provider outage and see a retryable unavailable state.
10. Reset local progress and verify it clears.
11. Navigate with keyboard and test a narrow mobile viewport.

## Test data

Use tiny deterministic exercises for tests. Do not rely on a live third-party provider in every CI run; mock the provider adapter in automated tests. Maintain a separate manual smoke test for the actual provider before release.

## Security checks

- Search repository and built assets for accidental secrets.
- Confirm `.env` is ignored and `.env.example` contains placeholders only.
- Inspect API response for hidden test leakage.
- Verify request/body/output bounds.
- Verify the app never evaluates learner code locally or in the Next.js process.
- Verify user-supplied input is not logged unnecessarily.
- Review dependency audit output and update vulnerable dependencies as appropriate.

## Release gate

Do not publish a beta if any critical security test fails, hidden tests leak, runner credentials are exposed, or the hosted runner is not permitted for the intended use. Record known non-critical issues in the beta limitations page.
