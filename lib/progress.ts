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
export function readProgress(storage: StorageLike): string | null {
  try {
    return storage.getItem(STORAGE_KEY);
  } catch {
    return "unavailable";
  }
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
