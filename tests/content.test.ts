import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  loadContent,
  parseContent,
  validateCollection,
  headings,
} from "../lib/content";
const source = fs.readFileSync(
  "content/lessons/sequence-and-selection.md",
  "utf8",
);
test("published journey validates and maps each question", () => {
  const items = loadContent();
  assert.equal(items.length, 2);
  const lesson = items.find((item) => item.kind === "lessons")!;
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
  const lesson = items.find((item) => item.kind === "lessons")!;
  const exercise = items.find((item) => item.kind === "exercises")!;
  assert.throws(() => validateCollection([lesson]));
  assert.throws(() =>
    validateCollection([lesson, { ...exercise, status: "draft" }]),
  );
  assert.throws(() =>
    validateCollection([
      {
        ...lesson,
        body: lesson.body + "\n[bad](/lessons/sequence-and-selection#missing)",
      },
      exercise,
    ]),
  );
  assert.throws(() =>
    validateCollection([
      { ...lesson, body: lesson.body + "\n[bad][ref]\n\n[ref]: /missing" },
      exercise,
    ]),
  );
});
test("unsafe links, raw HTML, duplicate headings and oversized content fail", () => {
  const items = loadContent();
  const lesson = items.find((item) => item.kind === "lessons")!;
  const exercise = items.find((item) => item.kind === "exercises")!;
  for (const suffix of [
    "\n[bad](javascript:alert)",
    "\n<div>Raw HTML</div>",
    "\n## Worked example\nDuplicate",
  ])
    assert.throws(() =>
      validateCollection([{ ...lesson, body: lesson.body + suffix }, exercise]),
    );
  assert.throws(() => parseContent("x".repeat(65537), "lessons"));
});
