export const STORAGE_KEY = "h2compute.progress";
export const LESSON_ID = "sequence-and-selection";
export type Progress = {
  version: 1;
  quizReviewed: boolean;
  practiceReviewed: boolean;
  completed: boolean;
};
export const emptyProgress: Progress = {
  version: 1,
  quizReviewed: false,
  practiceReviewed: false,
  completed: false,
};
export function decodeProgress(raw: string | null): {
  progress: Progress;
  recovered: boolean;
} {
  if (raw === null) return { progress: emptyProgress, recovered: false };
  try {
    if (raw.length > 4096) throw new Error("Oversized");
    const value = JSON.parse(raw);
    const entry = value.lessons?.[LESSON_ID];
    if (
      value.version !== 1 ||
      !entry ||
      ["quizReviewed", "practiceReviewed", "completed"].some(
        (key) => typeof entry[key] !== "boolean",
      ) ||
      (entry.completed && (!entry.quizReviewed || !entry.practiceReviewed))
    )
      throw new Error("Invalid schema");
    return {
      progress: {
        version: 1,
        quizReviewed: entry.quizReviewed,
        practiceReviewed: entry.practiceReviewed,
        completed: entry.completed,
      },
      recovered: false,
    };
  } catch {
    return { progress: emptyProgress, recovered: true };
  }
}
export function encodeProgress(progress: Progress): string {
  return JSON.stringify({
    version: 1,
    lessons: {
      [LESSON_ID]: {
        quizReviewed: progress.quizReviewed,
        practiceReviewed: progress.practiceReviewed,
        completed:
          progress.completed &&
          progress.quizReviewed &&
          progress.practiceReviewed,
      },
    },
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
