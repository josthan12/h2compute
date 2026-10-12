---
{
  "title": "Sum a sequence", "slug": "sum-a-sequence", "topic": "python-control-flow",
  "summary": "Build a running total from 1 through n, including the case where there is nothing to add.",
  "syllabus": { "year": 2026, "outcomes": ["2.2.3", "2.2.6"] },
  "difficulty": "core", "estimatedMinutes": 10,
  "prerequisites": ["counted-and-conditional-loops"], "relatedExercises": [],
  "status": "published", "reviewedOn": "2026-10-12",
  "reviewer": "Codex: source mapping and executable-example review; independent teacher review pending",
  "provenance": "Original H2Compute practice prompt and model explanations.",
  "lesson": "counted-and-conditional-loops", "objective": "Use a loop and an accumulator, then trace an empty range",
  "examples": [ { "input": "0\n", "output": "0\n" }, { "input": "1\n", "output": "1\n" }, { "input": "3\n", "output": "6\n" }, { "input": "100\n", "output": "5050\n" } ],
  "hints": ["What value should total have before any additions?", "range excludes its stop value; include n by stopping at n + 1.", "Initialise total once, add the current number each iteration, then print after the loop."]
}
---
## Your task

Write a single-file Python program that reads one integer `n` and uses a loop to sum the integers from 1 through `n` inclusive. Print the total once, on one line, with no input prompt or extra label. For `n = 0`, there are no numbers to add, so the total is zero.

Assume one valid integer from 0 to 100 is supplied on standard input. Empty, non-integer and out-of-range input are outside this contract. Use a loop rather than a formula: the goal is to practise iteration and accumulation.

Try on paper or in your own local Python installation. Trace the loop's first and last values, and the zero-iteration case. This site does not execute or grade your attempt.

<!-- model -->
## Model explanation

Initialise the total before the loop. `range(1, n + 1)` includes `n`; when `n` is zero, the range is empty and the initial total is printed.

```python
n = int(input())
total = 0
for number in range(1, n + 1):
    total = total + number
print(total)
```

A conditional loop is also a valid solution. Its changing loop variable must eventually exceed `n`.

```python
n = int(input())
number = 1
total = 0
while number <= n:
    total = total + number
    number = number + 1
print(total)
```

For `n = 3`, both versions add 1, 2 and 3, producing 6. For `n = 0`, the counted range is empty and the conditional test `1 <= 0` is false immediately. Both output zero. For 100, the total is 5050.

Explain where your state changes and why your loop terminates. Reviewing these models is a local learning step, not a test verdict on your program.

Return to [lesson completion](/lessons/counted-and-conditional-loops#completion), then continue to [combined flow and tracing](/lessons/combined-flow-and-tracing).
