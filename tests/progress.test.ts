import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decodeProgress,
  encodeProgress,
  emptyProgress,
  readProgress,
  saveProgress,
  resetProgress,
  STORAGE_KEY,
  type StorageLike,
} from "../lib/progress";
test("progress round-trips without storing learner answers or source", () => {
  const complete = {
    ...emptyProgress,
    quizReviewed: true,
    practiceReviewed: true,
    completed: true,
  };
  assert.deepEqual(decodeProgress(encodeProgress(complete)), {
    progress: complete,
    recovered: false,
  });
  assert.deepEqual(Object.keys(JSON.parse(encodeProgress(complete))), [
    "version",
    "lessons",
  ]);
});
test("absent, corrupt, oversized, future version and invalid state recover safely", () => {
  assert.deepEqual(decodeProgress(null), {
    progress: emptyProgress,
    recovered: false,
  });
  for (const raw of [
    "null",
    "{",
    "x".repeat(4097),
    '{"version":2}',
    '{"version":1,"lessons":{"sequence-and-selection":{"quizReviewed":false,"practiceReviewed":true,"completed":true}}}',
    '{"version":1,"lessons":{"sequence-and-selection":{"quizReviewed":"yes","practiceReviewed":true,"completed":false}}}',
  ])
    assert.deepEqual(decodeProgress(raw), {
      progress: emptyProgress,
      recovered: true,
    });
});
test("storage failures are explicit and reset removes only the owned key", () => {
  const values = new Map([["unrelated", "keep"]]);
  const storage: StorageLike = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
  assert(saveProgress(storage, emptyProgress));
  assert.equal(readProgress(storage), encodeProgress(emptyProgress));
  assert(resetProgress(storage));
  assert(!values.has(STORAGE_KEY));
  assert.equal(values.get("unrelated"), "keep");
  const fail = () => {
    throw new Error("Denied");
  };
  const blocked = { getItem: fail, setItem: fail, removeItem: fail };
  assert.equal(readProgress(blocked), "unavailable");
  assert.equal(saveProgress(blocked, emptyProgress), false);
  assert.equal(resetProgress(blocked), false);
});
