import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decodeProgress,
  encodeProgress,
  createEmptyProgress,
  updateLesson,
  readProgress,
  saveProgress,
  resetProgress,
  STORAGE_KEY,
  type StorageLike,
} from "../lib/progress";
import { LESSON_IDS } from "../lib/lesson-ids";
const complete = {
  quizReviewed: true,
  practiceReviewed: true,
  completed: true,
};
test("v2 round-trips per-lesson flags without answers or source", () => {
  const progress = updateLesson(createEmptyProgress(), LESSON_IDS[1], complete);
  assert.deepEqual(decodeProgress(encodeProgress(progress)), {
    progress,
    recovered: false,
    migrated: false,
  });
  assert.equal(progress.lessons[LESSON_IDS[0]].completed, false);
  assert.deepEqual(Object.keys(JSON.parse(encodeProgress(progress))), [
    "version",
    "lessons",
  ]);
});
test("v1 migrates completed and partial first-lesson progress, without completing later lessons", () => {
  for (const original of [
    complete,
    { quizReviewed: true, practiceReviewed: false, completed: false },
  ]) {
    const raw = JSON.stringify({
      version: 1,
      lessons: { [LESSON_IDS[0]]: original },
    });
    const decoded = decodeProgress(raw);
    assert.equal(decoded.migrated, true);
    assert.equal(decoded.recovered, false);
    assert.deepEqual(decoded.progress.lessons[LESSON_IDS[0]], original);
    assert.equal(decoded.progress.lessons[LESSON_IDS[1]].completed, false);
    const next = updateLesson(decoded.progress, LESSON_IDS[1], complete);
    assert.deepEqual(
      decodeProgress(encodeProgress(next)).progress.lessons[LESSON_IDS[0]],
      original,
    );
  }
});
test("absent, corrupt, oversized and future data recover; a bad entry preserves other lessons", () => {
  const empty = createEmptyProgress();
  assert.deepEqual(decodeProgress(null), {
    progress: empty,
    recovered: false,
    migrated: false,
  });
  for (const raw of [
    "null",
    "{",
    "x".repeat(16385),
    '{"version":3,"lessons":{}}',
    '{"version":1,"lessons":{}}',
  ]) {
    assert.deepEqual(decodeProgress(raw), {
      progress: empty,
      recovered: true,
      migrated: false,
    });
  }
  const raw = JSON.stringify({
    version: 2,
    lessons: {
      [LESSON_IDS[0]]: complete,
      [LESSON_IDS[1]]: { ...complete, quizReviewed: "yes" },
      [LESSON_IDS[2]]: { ...complete, practiceReviewed: false },
      unregistered: complete,
    },
  });
  const decoded = decodeProgress(raw);
  assert.equal(decoded.recovered, true);
  assert.deepEqual(decoded.progress.lessons[LESSON_IDS[0]], complete);
  assert.deepEqual(
    decoded.progress.lessons[LESSON_IDS[1]],
    empty.lessons[LESSON_IDS[1]],
  );
  assert.deepEqual(
    decoded.progress.lessons[LESSON_IDS[2]],
    empty.lessons[LESSON_IDS[2]],
  );
  assert.deepEqual(Object.keys(decoded.progress.lessons), [...LESSON_IDS]);
});
test("independent updates preserve neighbours and cannot complete unreviewed steps", () => {
  const first = updateLesson(createEmptyProgress(), LESSON_IDS[0], complete);
  const next = updateLesson(first, LESSON_IDS[1], { completed: true });
  assert.deepEqual(next.lessons[LESSON_IDS[0]], complete);
  assert.equal(next.lessons[LESSON_IDS[1]].completed, false);
  assert.equal(first.lessons[LESSON_IDS[1]].completed, false);
});
test("storage failures are explicit; reset removes only the owned key", () => {
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
  const progress = updateLesson(createEmptyProgress(), LESSON_IDS[0], complete);
  assert(saveProgress(storage, progress));
  assert.equal(readProgress(storage), encodeProgress(progress));
  assert(resetProgress(storage));
  assert(!values.has(STORAGE_KEY));
  assert.equal(values.get("unrelated"), "keep");
  const fail = () => {
    throw new Error("Denied");
  };
  const blocked = { getItem: fail, setItem: fail, removeItem: fail };
  assert.equal(readProgress(blocked), "unavailable");
  assert.equal(saveProgress(blocked, progress), false);
  assert.equal(resetProgress(blocked), false);
});
