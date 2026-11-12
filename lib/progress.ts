import { LESSON_IDS, isLessonId, type LessonId } from "./lesson-ids";
export const STORAGE_KEY = "h2compute.progress";
export type LessonProgress = {
  quizReviewed: boolean;
  practiceReviewed: boolean;
  completed: boolean;
};
export type Progress = {
  version: 2;
  lessons: Record<LessonId, LessonProgress>;
};
export function createEmptyProgress(): Progress {
  return {
    version: 2,
    lessons: Object.fromEntries(
      LESSON_IDS.map((id) => [
        id,
        { quizReviewed: false, practiceReviewed: false, completed: false },
      ]),
    ) as Record<LessonId, LessonProgress>,
  };
}
export const emptyProgress = createEmptyProgress();
function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function validEntry(value: unknown): value is LessonProgress {
  return (
    object(value) &&
    typeof value.quizReviewed === "boolean" &&
    typeof value.practiceReviewed === "boolean" &&
    typeof value.completed === "boolean" &&
    (!value.completed || (value.quizReviewed && value.practiceReviewed))
  );
}
export function decodeProgress(raw: string | null): {
  progress: Progress;
  recovered: boolean;
  migrated: boolean;
} {
  const progress = createEmptyProgress();
  if (raw === null) return { progress, recovered: false, migrated: false };
  try {
    if (raw.length > 16384) throw new Error("Oversized");
    const value: unknown = JSON.parse(raw);
    if (!object(value) || !object(value.lessons))
      throw new Error("Invalid schema");
    if (value.version === 1) {
      const original = value.lessons[LESSON_IDS[0]];
      if (!validEntry(original)) throw new Error("Invalid legacy state");
      progress.lessons[LESSON_IDS[0]] = {
        quizReviewed: original.quizReviewed,
        practiceReviewed: original.practiceReviewed,
        completed: original.completed,
      };
      return { progress, recovered: false, migrated: true };
    }
    if (value.version !== 2) throw new Error("Unsupported version");
    let recovered = false;
    for (const id of LESSON_IDS) {
      if (!Object.hasOwn(value.lessons, id)) continue;
      const entry = value.lessons[id];
      if (!validEntry(entry)) {
        recovered = true;
        continue;
      }
      progress.lessons[id] = {
        quizReviewed: entry.quizReviewed,
        practiceReviewed: entry.practiceReviewed,
        completed: entry.completed,
      };
    }
    return { progress, recovered, migrated: false };
  } catch {
    return { progress, recovered: true, migrated: false };
  }
}
export function updateLesson(
  progress: Progress,
  id: LessonId,
  patch: Partial<LessonProgress>,
): Progress {
  if (!isLessonId(id)) return progress;
  const entry = { ...progress.lessons[id], ...patch };
  entry.completed =
    entry.completed && entry.quizReviewed && entry.practiceReviewed;
  return { version: 2, lessons: { ...progress.lessons, [id]: entry } };
}
export function encodeProgress(progress: Progress): string {
  return JSON.stringify({
    version: 2,
    lessons: Object.fromEntries(
      LESSON_IDS.map((id) => {
        const entry = progress.lessons[id];
        return [
          id,
          {
            quizReviewed: entry.quizReviewed,
            practiceReviewed: entry.practiceReviewed,
            completed:
              entry.completed && entry.quizReviewed && entry.practiceReviewed,
          },
        ];
      }),
    ),
  });
}
export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type ProgressRead =
  | { available: true; raw: string | null }
  | { available: false };
export function readProgressResult(storage: StorageLike): ProgressRead {
  try {
    return { available: true, raw: storage.getItem(STORAGE_KEY) };
  } catch {
    return { available: false };
  }
}
export function readProgress(storage: StorageLike): string | null {
  const result = readProgressResult(storage);
  return result.available ? result.raw : "unavailable";
}
export function saveProgress(
  storage: StorageLike,
  progress: Progress,
): boolean {
  try {
    storage.setItem(STORAGE_KEY, encodeProgress(progress));
    return true;
  } catch {
    return false;
  }
}
export function resetProgress(storage: StorageLike): boolean {
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

// Only local changes are queued: at most three flags for each registered lesson.
export type PendingProgress = {
  reset: boolean;
  lessons: Partial<Record<LessonId, Partial<LessonProgress>>>;
};
export function createPendingProgress(reset = false): PendingProgress {
  return { reset, lessons: {} };
}
export function applyPendingProgress(base: Progress, pending: PendingProgress): Progress {
  let next = pending.reset ? createEmptyProgress() : base;
  for (const id of LESSON_IDS) {
    const patch = pending.lessons[id];
    if (patch) next = updateLesson(next, id, patch);
  }
  return next;
}
export function queueProgressUpdate(
  base: Progress,
  pending: PendingProgress,
  id: LessonId,
  value: Partial<LessonProgress>,
): PendingProgress {
  if (!isLessonId(id)) return pending;
  const current = applyPendingProgress(base, pending);
  const before = current.lessons[id];
  const after = updateLesson(current, id, value).lessons[id];
  const patch = { ...pending.lessons[id] };
  for (const flag of ["quizReviewed", "practiceReviewed", "completed"] as const) {
    if (typeof value[flag] === "boolean") patch[flag] = after[flag];
  }
  // Keep an invariant's effect even if a prerequisite is later restored.
  if (before.completed !== after.completed || value.quizReviewed === false || value.practiceReviewed === false) {
    patch.completed = after.completed;
  }
  return { ...pending, lessons: { ...pending.lessons, [id]: patch } };
}
export function resetProgressWithSignal(storage: StorageLike): {
  removed: boolean;
  cleared: boolean;
  notification: "storage" | "channel" | "uncertain";
} {
  const before = readProgressResult(storage);
  // An absent key must first exist for removal to notify other tabs. This is
  // an explicit reset action, not a background save or an additional key.
  const wroteEmpty = saveProgress(storage, createEmptyProgress());
  // A failed write must never prevent an independent removal attempt.
  const removed = resetProgress(storage);
  const notification = !removed
    ? "channel"
    : wroteEmpty || (before.available && before.raw !== null)
      ? "storage"
      : before.available
        ? "channel"
        : "uncertain";
  // Never send both transports: a delayed duplicate could clear a newer action.
  return { removed, cleared: removed || wroteEmpty, notification };
}
