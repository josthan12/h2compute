import fs from "node:fs";
import path from "node:path";
import { fromMarkdown } from "mdast-util-from-markdown";
import type { Root, RootContent } from "mdast";
import syllabus from "../content/syllabus/2026.json";
import { LESSON_IDS, isLessonId, type LessonId } from "./lesson-ids";

export { syllabus };
export type Option = { text: string; explanation: string };
export type Question = {
  id: string;
  outcomes: string[];
  objective: string;
  difficulty: "core";
  estimatedMinutes: number;
  prompt: string;
  answer: number;
  options: Option[];
};
export type Metadata = {
  title: string;
  slug: string;
  topic: "python-control-flow";
  summary: string;
  syllabus: { year: 2026; outcomes: string[] };
  difficulty: "core";
  estimatedMinutes: number;
  prerequisites: string[];
  relatedExercises: string[];
  status: "draft" | "review" | "published" | "archived";
  reviewedOn: string;
  reviewer: string;
  provenance: string;
};
export type Lesson = Omit<Metadata, "slug"> & {
  slug: LessonId;
  coverageNote: string;
  kind: "lessons";
  body: string;
  quiz: Question[];
};
export type Exercise = Metadata & {
  kind: "exercises";
  body: string;
  model: string;
  lesson: LessonId;
  objective: string;
  examples: { input: string; output: string }[];
  hints: string[];
};
export type Content = Lesson | Exercise;
type RecordValue = Record<string, unknown>;
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function record(value: unknown): asserts value is RecordValue {
  assert(
    value && typeof value === "object" && !Array.isArray(value),
    "Expected object",
  );
}
function text(value: unknown): asserts value is string {
  assert(
    typeof value === "string" &&
      value.trim().length > 0 &&
      value.length <= 2000,
    "Expected bounded non-empty text",
  );
}
function strings(
  value: unknown,
  allowEmpty = false,
): asserts value is string[] {
  assert(
    Array.isArray(value) &&
      value.length <= 30 &&
      (allowEmpty || value.length > 0),
    "Expected bounded text list",
  );
  value.forEach(text);
  assert(new Set(value).size === value.length, "Duplicate list entry");
}
function outcomes(value: unknown) {
  strings(value);
  value.forEach((id) =>
    assert(
      Object.hasOwn(syllabus.outcomes, id),
      `Unverified syllabus outcome: ${id}`,
    ),
  );
}
function minutes(value: unknown) {
  assert(
    Number.isInteger(value) && Number(value) > 0 && Number(value) <= 120,
    "Invalid estimated time",
  );
}
function slug(value: unknown) {
  text(value);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), "Invalid slug");
}

export function parseContent(
  source: string,
  kind: "lessons" | "exercises",
): Content {
  assert(Buffer.byteLength(source, "utf8") <= 65536, "Content exceeds 64 KiB");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/.exec(source);
  assert(match, "Expected JSON frontmatter between --- delimiters");
  const meta: unknown = JSON.parse(match[1]);
  record(meta);
  ["title", "summary", "reviewer", "provenance"].forEach((key) =>
    text(meta[key]),
  );
  slug(meta.slug);
  assert(
    meta.topic === "python-control-flow" && meta.difficulty === "core",
    "Unsupported topic or difficulty",
  );
  assert(
    ["draft", "review", "published", "archived"].includes(String(meta.status)),
    "Invalid publication status",
  );
  record(meta.syllabus);
  assert(meta.syllabus.year === 2026, "Invalid syllabus year");
  outcomes(meta.syllabus.outcomes);
  minutes(meta.estimatedMinutes);
  strings(meta.prerequisites, true);
  strings(meta.relatedExercises, true);
  meta.relatedExercises.forEach(slug);
  text(meta.reviewedOn);
  assert(
    /^\d{4}-\d{2}-\d{2}$/.test(meta.reviewedOn) &&
      new Date(meta.reviewedOn).toISOString().slice(0, 10) === meta.reviewedOn,
    "Invalid review date",
  );
  if (kind === "lessons") {
    text(meta.coverageNote);
    if (meta.status === "published")
      assert(
        isLessonId(meta.slug),
        "Published lesson requires a registered progress ID",
      );
    assert(
      Array.isArray(meta.quiz) &&
        meta.quiz.length > 0 &&
        meta.quiz.length <= 10,
      "Lesson requires bounded quiz",
    );
    const ids = new Set<string>();
    for (const q of meta.quiz) {
      record(q);
      slug(q.id);
      assert(!ids.has(String(q.id)), "Duplicate quiz ID");
      ids.add(String(q.id));
      outcomes(q.outcomes);
      assert(
        (q.outcomes as string[]).every(
          (id) =>
            (meta.syllabus as RecordValue).outcomes instanceof Array &&
            ((meta.syllabus as RecordValue).outcomes as string[]).includes(id),
        ),
        "Quiz outcome outside lesson mapping",
      );
      text(q.objective);
      text(q.prompt);
      minutes(q.estimatedMinutes);
      assert(q.difficulty === "core", "Invalid quiz difficulty");
      assert(
        Array.isArray(q.options) &&
          q.options.length >= 2 &&
          q.options.length <= 5,
        "Invalid quiz options",
      );
      q.options.forEach((option) => {
        record(option);
        text(option.text);
        text(option.explanation);
      });
      assert(
        new Set(q.options.map((option) => option.text)).size ===
          q.options.length,
        "Duplicate option",
      );
      assert(
        Number.isInteger(q.answer) &&
          Number(q.answer) >= 0 &&
          Number(q.answer) < q.options.length,
        "Invalid answer index",
      );
    }
    return { ...meta, kind, body: match[2] } as Lesson;
  }
  slug(meta.lesson);
  assert(isLessonId(meta.lesson), "Unknown parent lesson ID");
  text(meta.objective);
  strings(meta.hints);
  assert(
    Array.isArray(meta.examples) &&
      meta.examples.length > 0 &&
      meta.examples.length <= 10,
    "Invalid example list",
  );
  meta.examples.forEach((example) => {
    record(example);
    text(example.input);
    text(example.output);
  });
  const parts = match[2].split("<!-- model -->");
  assert(
    parts.length === 2 && parts.every((part) => part.trim()),
    "Exercise requires one model separator",
  );
  return { ...meta, kind, body: parts[0], model: parts[1] } as Exercise;
}

export function headingId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
function nodeText(node: Root | RootContent): string {
  return "value" in node
    ? String(node.value)
    : "children" in node
      ? node.children.map((child) => nodeText(child as RootContent)).join("")
      : "";
}
function walk(
  node: Root | RootContent,
  visitor: (node: Root | RootContent) => void,
) {
  visitor(node);
  if ("children" in node)
    node.children.forEach((child) => walk(child as RootContent, visitor));
}
export function headings(body: string): { id: string; title: string }[] {
  const result: { id: string; title: string }[] = [];
  walk(fromMarkdown(body), (node) => {
    if (node.type === "heading")
      result.push({ id: headingId(nodeText(node)), title: nodeText(node) });
  });
  return result;
}
export function validateCollection(items: Content[]) {
  const routes = new Map<string, Set<string>>([
    ["/", new Set()],
    ["/topics/python-control-flow", new Set()],
    ["/privacy", new Set()],
    ["/about", new Set()],
  ]);
  const ids = new Set<string>();
  for (const item of items) {
    assert(!ids.has(item.slug), `Duplicate content slug: ${item.slug}`);
    ids.add(item.slug);
    if (item.status !== "published") continue;
    const titles = headings(item.body + ("model" in item ? item.model : ""));
    assert(
      titles.every((h) => h.id) &&
        new Set(titles.map((h) => h.id)).size === titles.length,
      "Empty or duplicate heading",
    );
    const anchors = titles.map((h) => h.id);
    if (item.kind === "lessons") {
      for (const id of ["checkpoint", "offline-practice", "completion"])
        assert(!anchors.includes(id), `Reserved heading: ${id}`);
      anchors.push("checkpoint", "offline-practice", "completion");
    }
    routes.set(`/${item.kind}/${item.slug}`, new Set(anchors));
  }
  for (const item of items.filter((item) => item.status === "published")) {
    item.relatedExercises.forEach((id) =>
      assert(
        routes.has(`/exercises/${id}`),
        `Missing published exercise: ${id}`,
      ),
    );
    if (item.kind === "exercises")
      assert(routes.has(`/lessons/${item.lesson}`), "Missing parent lesson");
    if (item.kind === "lessons") {
      assert(
        item.relatedExercises.length === 1,
        "Each lesson requires one offline journey task",
      );
      const exercise = items.find(
        (candidate) =>
          candidate.kind === "exercises" &&
          candidate.slug === item.relatedExercises[0],
      );
      assert(
        exercise?.kind === "exercises" && exercise.lesson === item.slug,
        "Exercise belongs to a different lesson",
      );
    }
    if (item.kind === "exercises") {
      const lesson = items.find(
        (candidate) =>
          candidate.kind === "lessons" && candidate.slug === item.lesson,
      );
      assert(
        lesson?.kind === "lessons" &&
          lesson.relatedExercises.includes(item.slug),
        "Parent lesson does not link this exercise",
      );
      assert(
        item.syllabus.outcomes.every((id) =>
          lesson.syllabus.outcomes.includes(id),
        ),
        "Exercise outcome outside parent mapping",
      );
      item.prerequisites.forEach((id) =>
        assert(
          routes.has(`/lessons/${id}`),
          `Missing prerequisite lesson: ${id}`,
        ),
      );
    }
    const definitions = new Map<string, string>();
    const tree = fromMarkdown(item.body + ("model" in item ? item.model : ""));
    walk(tree, (node) => {
      if (node.type === "definition")
        definitions.set(node.identifier, node.url);
    });
    walk(tree, (node) => {
      assert(
        node.type !== "html" &&
          node.type !== "image" &&
          node.type !== "imageReference",
        "Raw HTML and images unsupported in this content slice",
      );
      if (node.type === "heading")
        assert(
          node.depth >= 2 && node.depth <= 3,
          "Content headings must be h2 or h3",
        );
      if (node.type !== "link" && node.type !== "linkReference") return;
      const url =
        node.type === "link" ? node.url : definitions.get(node.identifier);
      assert(url, "Missing link definition");
      if (url.startsWith("https://")) {
        new URL(url);
        return;
      }
      assert(
        (url.startsWith("/") && !url.startsWith("//")) || url.startsWith("#"),
        `Unsupported link: ${url}`,
      );
      const parsed = new URL(
        url,
        `https://content.local/${item.kind}/${item.slug}`,
      );
      const anchors = routes.get(parsed.pathname);
      assert(anchors, `Broken internal link: ${url}`);
      assert(
        !parsed.search &&
          (!parsed.hash ||
            anchors.has(decodeURIComponent(parsed.hash.slice(1)))),
        `Broken internal anchor: ${url}`,
      );
    });
  }
}
export function loadContent(): Content[] {
  const items = (["lessons", "exercises"] as const).flatMap((kind) =>
    fs
      .readdirSync(path.join(process.cwd(), "content", kind))
      .filter((name) => name.endsWith(".md"))
      .sort()
      .map((name) => {
        const item = parseContent(
          fs.readFileSync(
            path.join(process.cwd(), "content", kind, name),
            "utf8",
          ),
          kind,
        );
        assert(`${item.slug}.md` === name, `Filename must match slug: ${name}`);
        return item;
      }),
  );
  validateCollection(items);
  return items;
}
export function lessons(): Lesson[] {
  return loadContent()
    .filter(
      (item): item is Lesson =>
        item.kind === "lessons" && item.status === "published",
    )
    .sort((a, b) => LESSON_IDS.indexOf(a.slug) - LESSON_IDS.indexOf(b.slug));
}
export function exercises(): Exercise[] {
  return loadContent().filter(
    (item): item is Exercise =>
      item.kind === "exercises" && item.status === "published",
  );
}
