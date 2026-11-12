import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decodeProgress,
  encodeProgress,
  createEmptyProgress,
  updateLesson,
  readProgress,
  readProgressResult,
  createPendingProgress,
  queueProgressUpdate,
  applyPendingProgress,
  resetProgressWithSignal,
  saveProgress,
  resetProgress,
  STORAGE_KEY,
  type StorageLike,
} from "../lib/progress";
import { openProgressResetChannel } from "../lib/progress-channel";
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

test("earlier three-lesson v2 data expands without losing progress and preserves all areas", () => {
  const earlier = Object.fromEntries(LESSON_IDS.slice(0, 3).map(id => [id, complete]));
  const decoded = decodeProgress(JSON.stringify({ version: 2, lessons: earlier }));
  assert.equal(decoded.recovered, false);
  assert.equal(decoded.migrated, false);
  for (const id of LESSON_IDS.slice(0, 3)) assert.deepEqual(decoded.progress.lessons[id], complete);
  for (const id of LESSON_IDS.slice(3)) assert.equal(decoded.progress.lessons[id].completed, false);
  let next = updateLesson(decoded.progress, "binary-search", complete);
  next = updateLesson(next, "relations-and-keys", complete);
  const saved = decodeProgress(encodeProgress(next)).progress;
  for (const id of [...LESSON_IDS.slice(0, 3), "binary-search", "relations-and-keys"] as const) assert.deepEqual(saved.lessons[id], complete);
  assert.equal(saved.lessons["select-filter-and-order"].completed, false);
});

test("pending patches preserve fresh peer updates without restoring a stale snapshot", () => {
  const stale = updateLesson(createEmptyProgress(), LESSON_IDS[0], complete);
  const pending = queueProgressUpdate(stale, createPendingProgress(), LESSON_IDS[1], { quizReviewed: true });
  const fresh = updateLesson(createEmptyProgress(), LESSON_IDS[2], complete);
  const next = applyPendingProgress(fresh, pending);
  assert.equal(next.lessons[LESSON_IDS[0]].completed, false);
  assert.equal(next.lessons[LESSON_IDS[1]].quizReviewed, true);
  assert.deepEqual(next.lessons[LESSON_IDS[2]], complete);
  assert.deepEqual(Object.keys(pending.lessons), [LESSON_IDS[1]]);
  assert.deepEqual(Object.keys(pending.lessons[LESSON_IDS[1]]!), ["quizReviewed"]);
  assert.equal(stale.lessons[LESSON_IDS[1]].quizReviewed, false);
});

test("pending independent flags and consecutive actions combine on the newest lesson", () => {
  const base = createEmptyProgress();
  let pending = queueProgressUpdate(base, createPendingProgress(), LESSON_IDS[0], { quizReviewed: true });
  const peer = updateLesson(base, LESSON_IDS[0], { practiceReviewed: true });
  pending = queueProgressUpdate(peer, pending, LESSON_IDS[1], { quizReviewed: true });
  const next = applyPendingProgress(peer, pending);
  assert.deepEqual(next.lessons[LESSON_IDS[0]], { ...complete, completed: false });
  assert.equal(next.lessons[LESSON_IDS[1]].quizReviewed, true);
  assert.equal(next.lessons[LESSON_IDS[2]].quizReviewed, false);
});

test("pending prerequisite revoke and restore cannot resurrect completion", () => {
  const base = updateLesson(createEmptyProgress(), LESSON_IDS[0], complete);
  let pending = queueProgressUpdate(base, createPendingProgress(), LESSON_IDS[0], { quizReviewed: false });
  pending = queueProgressUpdate(base, pending, LESSON_IDS[0], { quizReviewed: true });
  assert.deepEqual(applyPendingProgress(base, pending).lessons[LESSON_IDS[0]], { ...complete, completed: false });
  pending = queueProgressUpdate(base, pending, LESSON_IDS[0], { completed: true });
  assert.deepEqual(applyPendingProgress(base, pending).lessons[LESSON_IDS[0]], complete);
  let initiallyEmpty = queueProgressUpdate(createEmptyProgress(), createPendingProgress(), LESSON_IDS[0], { quizReviewed: false });
  initiallyEmpty = queueProgressUpdate(base, initiallyEmpty, LESSON_IDS[0], { quizReviewed: true });
  assert.equal(applyPendingProgress(base, initiallyEmpty).lessons[LESSON_IDS[0]].completed, false);
  const impossible = queueProgressUpdate(createEmptyProgress(), createPendingProgress(), LESSON_IDS[0], { completed: true });
  assert.equal(applyPendingProgress(base, impossible).lessons[LESSON_IDS[0]].completed, false);
});

test("failed-reset intent discards old flags but keeps subsequent local work", () => {
  const stale = updateLesson(createEmptyProgress(), LESSON_IDS[0], complete);
  const pending = queueProgressUpdate(stale, createPendingProgress(true), LESSON_IDS[1], { quizReviewed: true });
  const next = applyPendingProgress(stale, pending);
  assert.deepEqual(next.lessons[LESSON_IDS[0]], createEmptyProgress().lessons[LESSON_IDS[0]]);
  assert.equal(next.lessons[LESSON_IDS[1]].quizReviewed, true);
  assert.equal(stale.lessons[LESSON_IDS[0]].completed, true);
});

test("tagged reads distinguish unavailable storage from a corrupt sentinel-shaped value", () => {
  const storage: StorageLike = { getItem: () => "unavailable", setItem() {}, removeItem() {} };
  assert.deepEqual(readProgressResult(storage), { available: true, raw: "unavailable" });
  storage.getItem = () => { throw new Error("Denied"); };
  assert.deepEqual(readProgressResult(storage), { available: false });
});

test("reset chooses only one transport and independently attempts removal", () => {
  const cases = [
    { present: true, read: true, write: true, remove: true, notification: "storage", cleared: true },
    { present: false, read: true, write: true, remove: true, notification: "storage", cleared: true },
    { present: true, read: false, write: true, remove: true, notification: "storage", cleared: true },
    { present: true, read: true, write: false, remove: true, notification: "storage", cleared: true },
    { present: false, read: true, write: false, remove: true, notification: "channel", cleared: true },
    { present: true, read: false, write: false, remove: true, notification: "uncertain", cleared: true },
    { present: false, read: false, write: false, remove: true, notification: "uncertain", cleared: true },
    { present: true, read: true, write: true, remove: false, notification: "channel", cleared: true },
    { present: true, read: true, write: false, remove: false, notification: "channel", cleared: false },
  ] as const;
  for (const entry of cases) {
    const values = new Map([["unrelated", "keep"]]);
    if (entry.present) values.set(STORAGE_KEY, encodeProgress(updateLesson(createEmptyProgress(), LESSON_IDS[0], complete)));
    let removals = 0;
    const storage: StorageLike = {
      getItem(name) { if (!entry.read) throw new Error("Denied"); return values.get(name) ?? null; },
      setItem(name, value) { if (!entry.write) throw new Error("Denied"); values.set(name, value); },
      removeItem(name) { removals++; if (!entry.remove) throw new Error("Denied"); values.delete(name); },
    };
    assert.deepEqual(resetProgressWithSignal(storage), { removed: entry.remove, cleared: entry.cleared, notification: entry.notification });
    assert.equal(removals, 1);
    assert.equal(values.get("unrelated"), "keep");
    if (entry.remove) assert.equal(values.has(STORAGE_KEY), false);
    else if (entry.write) assert.deepEqual(decodeProgress(values.get(STORAGE_KEY)!).progress, createEmptyProgress());
  }
});

test("optional reset channel validates fixed signals and closes exactly once", () => {
  const received: boolean[] = [];
  const sent: unknown[] = [];
  let closes = 0;
  const fake = {
    onmessage: null as ((event: MessageEvent<unknown>) => void) | null,
    postMessage(value: unknown) { sent.push(value); },
    close() { closes++; },
  };
  const channel = openProgressResetChannel(value => received.push(value), () => fake);
  const handler = fake.onmessage!;
  for (const data of [null, "reset", {}, { type: "reset", cleared: true }, ["h2compute-reset-cleared-v1"]]) handler({ data } as MessageEvent<unknown>);
  assert.deepEqual(received, []);
  assert(channel.notify(true));
  assert(channel.notify(false));
  for (const data of sent) handler({ data } as MessageEvent<unknown>);
  assert.deepEqual(received, [true, false]);
  channel.close();
  channel.close();
  assert.equal(closes, 1);
  assert.equal(fake.onmessage, null);
  assert.equal(channel.notify(true), false);
  handler({ data: sent[0] } as MessageEvent<unknown>);
  assert.deepEqual(received, [true, false]);
});

test("unsupported and denied channel operations preserve the storage fallback", () => {
  for (const create of [() => null, () => { throw new Error("Unavailable"); }]) {
    const channel = openProgressResetChannel(() => assert.fail("Unexpected reset"), create);
    assert.equal(channel.notify(true), false);
    channel.close();
  }
  const channel = openProgressResetChannel(() => assert.fail("Unexpected reset"), () => ({
    onmessage: null,
    postMessage() { throw new Error("Denied"); },
    close() { throw new Error("Denied"); },
  }));
  assert.equal(channel.notify(true), false);
  assert.doesNotThrow(() => channel.close());
});
