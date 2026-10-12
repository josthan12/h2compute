export const LESSON_IDS = [
  "sequence-and-selection",
  "counted-and-conditional-loops",
  "combined-flow-and-tracing",
] as const;
export type LessonId = (typeof LESSON_IDS)[number];
export function isLessonId(value: unknown): value is LessonId {
  return (
    typeof value === "string" &&
    (LESSON_IDS as readonly string[]).includes(value)
  );
}
