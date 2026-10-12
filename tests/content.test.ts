import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  loadContent,
  parseContent,
  validateCollection,
  headings,
  lessons,
} from "../lib/content";
import { LESSON_IDS } from "../lib/lesson-ids";
const source = fs.readFileSync(
  "content/lessons/sequence-and-selection.md",
  "utf8",
);
test("published journey validates and maps each question", () => {
  const items = loadContent();
  assert.equal(items.length, 6);
  const lesson = items.find(
    (item) => item.kind === "lessons" && item.slug === "sequence-and-selection",
  )!;
  assert.equal(lesson.kind, "lessons");
  assert(lesson.kind === "lessons");
  assert.equal(lesson.quiz.length, 2);
  assert.equal(headings(lesson.body).length, 6);
  lesson.quiz.forEach((q) =>
    assert(q.outcomes.every((id) => lesson.syllabus.outcomes.includes(id))),
  );
});
test("unknown outcomes, wrong year, bad status, invalid answer and duplicate quiz IDs fail", () => {
  for (const invalid of [
    source.replaceAll("2.2.3", "9.9.9"),
    source.replace("2026,", "2025,"),
    source.replace('"published"', '"live"'),
    source.replace('"answer": 1', '"answer": 9'),
    source.replace('"first-match"', '"boundary-branch"'),
  ])
    assert.throws(() => parseContent(invalid, "lessons"));
});
test("duplicate slugs, missing related content, unpublished link targets and bad anchors fail", () => {
  const items = loadContent();
  assert.throws(() => validateCollection([...items, items[0]]));
  const lesson = items.find(
    (item) => item.kind === "lessons" && item.slug === "sequence-and-selection",
  )!;
  assert.equal(lesson.kind, "lessons");
  assert(lesson.kind === "lessons");
  const exercise = items.find(
    (item) => item.kind === "exercises" && item.slug === "classify-a-score",
  )!;
  assert.throws(() =>
    validateCollection(items.filter((item) => item.slug !== exercise.slug)),
  );
  assert.throws(() =>
    validateCollection(
      items.map((item) =>
        item.slug === exercise.slug ? { ...exercise, status: "draft" } : item,
      ),
    ),
  );
  assert.throws(() =>
    validateCollection(
      items.map((item) =>
        item.slug === lesson.slug
          ? {
              ...lesson,
              body:
                lesson.body +
                "\n[bad](/lessons/sequence-and-selection#missing)",
            }
          : item,
      ),
    ),
  );
  assert.throws(() =>
    validateCollection(
      items.map((item) =>
        item.slug === lesson.slug
          ? { ...lesson, body: lesson.body + "\n[bad][ref]\n\n[ref]: /missing" }
          : item,
      ),
    ),
  );
});
test("unsafe links, raw HTML, duplicate headings and oversized content fail", () => {
  const items = loadContent();
  const lesson = items.find(
    (item) => item.kind === "lessons" && item.slug === "sequence-and-selection",
  )!;
  assert.equal(lesson.kind, "lessons");
  assert(lesson.kind === "lessons");
  for (const suffix of [
    "\n[bad](javascript:alert)",
    "\n<div>Raw HTML</div>",
    "\n## Worked example\nDuplicate",
  ])
    assert.throws(() =>
      validateCollection(
        items.map((item) =>
          item.slug === lesson.slug
            ? { ...lesson, body: lesson.body + suffix }
            : item,
        ),
      ),
    );
  assert.throws(() => parseContent("x".repeat(65537), "lessons"));
  assert.throws(
    () => parseContent(source + "é".repeat(33000), "lessons"),
    /64 KiB/,
  );
});

test("published lesson order matches progress IDs and each task belongs to its parent", () => {
  assert.deepEqual(
    lessons().map((lesson) => lesson.slug),
    [...LESSON_IDS],
  );
  const items = loadContent();
  for (const lesson of lessons()) {
    assert.equal(lesson.relatedExercises.length, 1);
    const exercise = items.find(
      (item) =>
        item.kind === "exercises" && item.slug === lesson.relatedExercises[0],
    );
    assert(exercise?.kind === "exercises");
    assert.equal(exercise.lesson, lesson.slug);
    lesson.quiz.forEach((question) =>
      assert(
        question.outcomes.every((id) => lesson.syllabus.outcomes.includes(id)),
      ),
    );
  }
  const broken = items.map((item) =>
    item.kind === "exercises" && item.slug === "sum-a-sequence"
      ? { ...item, lesson: LESSON_IDS[0] }
      : item,
  );
  assert.throws(
    () => validateCollection(broken),
    /different lesson|does not link/,
  );
});
