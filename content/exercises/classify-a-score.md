---
{
  "title": "Classify a score", "slug": "classify-a-score", "topic": "python-control-flow",
  "summary": "Design an ordered branch chain, then check its boundaries by hand or in your own Python installation.",
  "syllabus": { "year": 2026, "outcomes": ["2.2.3", "2.2.6"] },
  "difficulty": "core", "estimatedMinutes": 8, "prerequisites": ["sequence-and-selection"],
  "relatedExercises": [], "status": "published", "reviewedOn": "2026-10-12",
  "reviewer": "Codex: source mapping and executable-example review; independent teacher review pending",
  "provenance": "Original H2Compute practice prompt and model explanation.",
  "lesson": "sequence-and-selection", "objective": "Construct and trace a mutually exclusive score classification",
  "examples": [
    { "input": "0\n", "output": "Review\n" }, { "input": "59\n", "output": "Review\n" },
    { "input": "60\n", "output": "Ready\n" }, { "input": "79\n", "output": "Ready\n" },
    { "input": "80\n", "output": "Stretch\n" }, { "input": "100\n", "output": "Stretch\n" }
  ],
  "hints": ["Write the three disjoint score ranges on paper.", "Which threshold must you test first if your comparisons use >=?", "Check >= 80, then >= 60, then use else."]
}
---
## Your task

Write a single-file Python program that reads one integer score from standard input and prints exactly one category:

- 80 to 100 inclusive: `Stretch`
- 60 to 79 inclusive: `Ready`
- 0 to 59 inclusive: `Review`

Assume the input is one valid integer in the range 0–100. Empty, non-integer and out-of-range input are outside this exercise's contract; you do not need input validation here. Print one line with no extra prompt or label.

Try it on paper or in your own local Python installation. This website does not run or grade your code. Use the visible examples below as self-checks, then compare your reasoning with the model.

<!-- model -->
## Model explanation

Check the highest threshold first. A score of 85 is also at least 60, so the broader condition must come later. The remaining scores are below 60.

```python
score = int(input())
if score >= 80:
    print("Stretch")
elif score >= 60:
    print("Ready")
else:
    print("Review")
```

At 60, the first comparison is false and the second is true: `Ready`. At 80, the first comparison is true: `Stretch`; the next comparison is skipped. At 59, both are false: `Review`. The range endpoints 0 and 100 check that the allowed input extremes receive a category.

Other correct solutions are possible, including disjoint range checks. Explain how yours ensures exactly one output for every valid input. Reviewing a model is a local learning step, not proof that your program passed tests.

Return to [the lesson](/lessons/sequence-and-selection#completion) to mark your journey complete.
