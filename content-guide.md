# Content Authoring Guide

## Purpose

Create accurate, approachable, exam-relevant learning material for Singapore H2 Computing syllabus 9569. Content should teach understanding and application, not merely reproduce notes.

## Source of truth

Official syllabus: https://www.seab.gov.sg/files/A%20Level%20Syllabus%20Private%20Cddts/2026/9569_y26_sy.pdf

Before authoring a topic:
1. Read the relevant official syllabus section.
2. Record the syllabus year, outcome identifier/reference and exact scope.
3. Identify prerequisites and likely misconceptions.
4. Create original explanation and examples.
5. Review against the syllabus and test all code.

Never invent outcome identifiers. If stable IDs are unavailable or unclear, use a documented internal identifier plus a page/section reference from the PDF.

## Priority-topic beta editorial rules

The initial release targets **several high-value syllabus areas in depth**, not every topic. Before committing to an area, check its relevance against the official 2026 syllabus, identify required prior knowledge, and plan an end-to-end sequence: accessible explanation → worked example → formative quiz → applicable Python practice → revision links. Not every theoretical outcome requires a coding problem.

Maintain a coverage register for the verified 2026 outcomes with states such as `published`, `partial`, `planned`, and `not-covered`. Display a human-readable summary of the beta's limitations. Do not equate an individual lesson with complete coverage of a broad syllabus strand.

Depth takes priority over counts: 8–12 lessons and up to 20–30 Python exercises are **provisional planning targets**, not minimum acceptance criteria. Content can ship in a smaller, coherent set when accuracy, test quality, accessibility, and time require it. Add new areas only when prior content is reviewed and usable.

## Lesson structure

Recommended order:
1. Title and one-sentence purpose.
2. Learning objectives tied to syllabus outcomes.
3. Prerequisite knowledge.
4. Plain-language explanation.
5. Key terms and precise definitions.
6. Worked example, explained step by step.
7. Diagram/table/pseudocode/code as appropriate.
8. Common misconceptions and exam traps.
9. Short checkpoint quiz with explanations.
10. Summary / recall prompts.
11. Related exercise and next lesson.
12. Sources and content review date where applicable.

Do not force every section into every short lesson. Prioritise clarity.

## Writing style

- Use clear English suitable for JC students.
- Define terminology before relying on it.
- Separate conceptual explanation from implementation details.
- Use consistent notation and naming.
- Keep code examples minimal, runnable and annotated.
- Explain why an answer is correct, not just that it is correct.
- Distinguish syllabus requirements from optional enrichment.
- Avoid promising that a specific question will appear in an examination.
- Do not use another school's or university's notes verbatim.

## Questions and exercises

Every question needs:
- unique slug/ID;
- syllabus mapping;
- intended learning objective;
- difficulty and estimated time;
- prompt and expected interface;
- sample input/output;
- test cases covering normal, boundary and invalid cases as appropriate;
- explanation/solution rationale;
- hints ordered from light nudge to stronger guidance;
- reviewer and last-reviewed date.

For programming problems, document input/output format precisely. Decide whether a task is stdin/stdout or function-based and use the same pattern consistently within a topic. Avoid ambiguous whitespace rules. Include empty input, singleton, duplicate, negative or boundary cases when relevant.

Hidden tests must not be bundled to the browser. Keep test definitions on the trusted server side or in the execution provider's private configuration.

## Markdown/MDX conventions

Use frontmatter fields validated by code. Suggested lesson fields:

```yaml
title: "Example lesson"
slug: "example-lesson"
topic: "algorithms-and-data-structures"
syllabus:
  year: 2026
  outcomes:
    - "REPLACE-WITH-VERIFIED-OUTCOME"
difficulty: "core"
estimatedMinutes: 10
prerequisites: []
relatedExercises: []
status: "draft"
reviewedOn: null
```

Allowed `status` values: `draft`, `review`, `published`, `archived`. Only `published` content should appear in learner navigation. Use stable slugs and avoid renaming public URLs without redirects.

## Review checklist

- [ ] Correctly mapped to official syllabus.
- [ ] No factual or code errors.
- [ ] Original or properly licensed material.
- [ ] Learning objective is explicit.
- [ ] Examples are explained and tested.
- [ ] Quiz distractors are plausible but unambiguous.
- [ ] Answer explanations are helpful.
- [ ] Exercise tests include edge cases.
- [ ] Markdown links and images work.
- [ ] Images have meaningful alt text.
- [ ] Accessible tables and headings.
- [ ] Spelling and terminology checked.
- [ ] Reviewed date and status updated.

## Copyright and attribution

Link to sources and identify external assets. Do not upload commercial textbooks, copyrighted notes, or past-paper questions unless permission/licence permits it. Prefer original questions and explanations. Keep third-party asset licences in a simple attribution file.
