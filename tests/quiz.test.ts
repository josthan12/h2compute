import { test } from "node:test";
import assert from "node:assert/strict";
import { checkAnswers } from "../lib/quiz";
test("incomplete or malformed attempts cannot be checked", () => {
  for (const answers of [[null, 2], [1], [1, 2.5], [-1, 2], [1, 5]])
    assert.equal(checkAnswers(answers, [1, 2]), null);
});
test("mixed and correct attempts receive accurate summaries without a pass gate", () => {
  assert.deepEqual(checkAnswers([0, 2], [1, 2]), { correct: 1, total: 2 });
  assert.deepEqual(checkAnswers([1, 2], [1, 2]), { correct: 2, total: 2 });
});
