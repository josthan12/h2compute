export const LESSON_IDS = [
  "sequence-and-selection",
  "counted-and-conditional-loops",
  "combined-flow-and-tracing",
  "lists-and-linear-search",
  "binary-search",
  "relations-and-keys",
  "select-filter-and-order",
  "joins-and-aggregation",
] as const;
export type LessonId = (typeof LESSON_IDS)[number];
export const TOPICS = [
  {
    id: "python-control-flow", title: "Python control flow", area: "Python programming",
    summary: "Follow execution, choose branches, repeat work and trace the result.",
    coverage: "Sequence, selection, iteration and short non-recursive traces. Recursive tracing and the rest of Python remain outside this path.",
    lessonIds: ["sequence-and-selection", "counted-and-conditional-loops", "combined-flow-and-tracing"],
  },
  {
    id: "algorithms-and-data-structures", title: "Searching lists", area: "Algorithms and data structures",
    summary: "Search a list, reason about a shrinking interval and compare worst-case work.",
    coverage: "Linear and binary search on one-dimensional Python lists, including absent values and duplicate matches. Hash search, sorting and other data structures are not taught.",
    lessonIds: ["lists-and-linear-search", "binary-search"],
  },
  {
    id: "relational-databases-and-sql", title: "Relational data and SQL", area: "Relational databases and SQL",
    summary: "Connect records with keys, retrieve useful rows and summarise related data.",
    coverage: "Tables, records, fields, primary/foreign keys and selected SQL queries. Other key types, normalisation, data modification, programming-language database access and NoSQL are not taught.",
    lessonIds: ["relations-and-keys", "select-filter-and-order", "joins-and-aggregation"],
  },
] as const satisfies readonly { id: string; title: string; area: string; summary: string; coverage: string; lessonIds: readonly LessonId[] }[];
export type TopicId = (typeof TOPICS)[number]["id"];
export function isLessonId(value: unknown): value is LessonId {
  return typeof value === "string" && (LESSON_IDS as readonly string[]).includes(value);
}
export function isTopicId(value: unknown): value is TopicId {
  return TOPICS.some(topic => topic.id === value);
}
export function topicForLesson(id: LessonId) {
  return TOPICS.find(topic => (topic.lessonIds as readonly string[]).includes(id))!;
}
