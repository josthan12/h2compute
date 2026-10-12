---
{
  "title": "Summarise revision scores", "slug": "summarise-revision-scores", "topic": "python-control-flow",
  "summary": "Read several scores, count those meeting a threshold, and total every score in one pass.",
  "syllabus": { "year": 2026, "outcomes": ["2.2.3", "2.2.6"] },
  "difficulty": "core", "estimatedMinutes": 12,
  "prerequisites": ["combined-flow-and-tracing"], "relatedExercises": [], "status": "published", "reviewedOn": "2026-10-12",
  "reviewer": "Codex: source mapping and executable-example review; independent teacher review pending",
  "provenance": "Original H2Compute combined-program task and model explanation.",
  "lesson": "combined-flow-and-tracing", "objective": "Combine input, iteration, accumulation and conditional counting",
  "examples": [
    { "input": "0\n", "output": "Ready: 0\nTotal: 0\n" },
    { "input": "1\n59\n", "output": "Ready: 0\nTotal: 59\n" },
    { "input": "1\n60\n", "output": "Ready: 1\nTotal: 60\n" },
    { "input": "4\n60\n45\n80\n59\n", "output": "Ready: 2\nTotal: 244\n" },
    { "input": "3\n0\n100\n100\n", "output": "Ready: 2\nTotal: 200\n" },
    { "input": "6\n60\n60\n60\n60\n60\n60\n", "output": "Ready: 6\nTotal: 360\n" }
  ],
  "hints": ["Initialise separate variables for the count and total before reading scores.", "Read one score per iteration. Add every score to the total, regardless of the condition.", "Inside the loop, increase the count by one only when score >= 60. Print both summaries after the loop."]
}
---
## Your task

Design and write a single-file Python program that summarises an invented set of revision scores:

1. The first input line contains an integer `count` from 0 to 6.
2. The next `count` lines each contain one integer score from 0 to 100.
3. Count how many scores are at least 60 and total all scores, including those below 60.
4. Print exactly two lines: `Ready: ` followed by the qualifying count, then `Total: ` followed by the total. Each label has one space after the colon. Print no input prompt.

For a count of zero, read no score lines and output zero for both summaries. Repeated scores are separate entries; count and add each occurrence. The threshold is an original teaching scenario, not an examination grading rule.

Assume all input meets this contract. Missing scores, empty or non-integer lines, out-of-range values and extra lines are outside the task's contract; no validation is required here.

Attempt this offline on paper or in your own Python installation. Before coding, write the initial values, the updates on each iteration and the condition for the counter. Trace at least the 59/60 boundary and zero-input-count case. This site does not execute or grade your code.

<!-- model -->
## Model explanation

The count determines the loop repetitions. Reading a score, accumulating its value and possibly incrementing the counter happen in that order. Final prints are outside the loop.

```python
count = int(input())
ready_count = 0
total = 0
for index in range(count):
    score = int(input())
    total = total + score
    if score >= 60:
        ready_count = ready_count + 1
print("Ready:", ready_count)
print("Total:", total)
```

`index` takes values 0 to `count - 1`; it controls repetition and is not a score. `print` inserts a space between its arguments, matching the requested labels.

For the four scores 60, 45, 80 and 59, all values contribute to 244 while only 60 and 80 count as ready. The output is `Ready: 2`, then `Total: 244`. For count zero, the loop does not run: both initial values are printed. In the repeated-60 case, six entries produce a count of 6 and a total of 360.

Other correct designs are possible. Explain why every score affects the total, why the counter changes only for qualifying values, and why the program reads exactly the requested number of lines. Model review is self-marked learning, not grading.

Return to [lesson completion](/lessons/combined-flow-and-tracing#completion) or [the control-flow topic](/topics/python-control-flow) to choose what to revise.
