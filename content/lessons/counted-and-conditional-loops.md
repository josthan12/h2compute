---
{
  "title": "Repeat with a purpose",
  "slug": "counted-and-conditional-loops", "topic": "python-control-flow",
  "summary": "Choose a counted or conditional loop, keep a running total, and explain when repetition stops.",
  "coverageNote": "Counted and conditional iteration with short non-recursive traces; recursion is excluded.",
  "syllabus": { "year": 2026, "outcomes": ["2.2.3", "2.2.6"] },
  "difficulty": "core", "estimatedMinutes": 18,
  "prerequisites": ["Read assignments and comparisons", "Trace a branch in Make a decision with Python", "Recognise that a running total starts at zero"],
  "relatedExercises": ["sum-a-sequence"], "status": "published", "reviewedOn": "2026-10-12",
  "reviewer": "Codex: source mapping and executable-example review; independent teacher review pending",
  "provenance": "Original H2Compute explanations and questions, authored for this project. Python syntax checked against the Python 3.14 tutorial.",
  "quiz": [
    { "id": "range-stop", "outcomes": ["2.2.3", "2.2.6"], "objective": "Trace the exclusive stop of range", "difficulty": "core", "estimatedMinutes": 2,
      "prompt": "Which values does number take in range(1, 4)?", "answer": 0,
      "options": [
        { "text": "1, 2, 3", "explanation": "The start is included and the stop is excluded. The loop runs three times." },
        { "text": "1, 2, 3, 4", "explanation": "4 is the stop value, so it is not produced. Use range(1, 5) to include 4." },
        { "text": "0, 1, 2, 3", "explanation": "Zero is the default start only when one argument is supplied. Here the explicit start is 1." }
      ]
    },
    { "id": "while-boundary", "outcomes": ["2.2.3", "2.2.6"], "objective": "Trace a pre-test loop that crosses a threshold", "difficulty": "core", "estimatedMinutes": 2,
      "prompt": "In the conditional-loop example, what is total when the loop stops?", "answer": 1,
      "options": [
        { "text": "9", "explanation": "At 9, total < 10 is still true, so the body runs once more." },
        { "text": "12", "explanation": "The values after each update are 3, 6, 9, 12. Only the next condition check stops the loop; the condition does not cap the update at 10." },
        { "text": "10", "explanation": "Adding 3 never produces exactly 10 from zero. A threshold condition can be crossed without landing exactly on it." }
      ]
    }
  ]
}
---
## What you will learn

Use a `for` loop when a known sequence describes the repetitions. Use a `while` loop when a condition decides whether to continue. Trace both, including the case where the body never executes.

First revisit [sequence and selection](/lessons/sequence-and-selection) if assignments or comparisons feel unfamiliar. A running total, also called an **accumulator**, stores the result built so far.

## Count repetitions with for

Python's `for` visits each item in a sequence. `range(start, stop)` supplies successive integers starting at `start` and ending before `stop`. `range(1, 4)` gives 1, 2 and 3. With one argument, `range(3)` gives 0, 1 and 2.

The indented body executes for each value. The first unindented statement after it executes once, after the loop.

## Worked example: a running total

```python
total = 0
for number in range(1, 4):
    total = total + number
print(total)
```

Start with `total = 0`, before any repetitions. Then trace each iteration:

1. `number = 1`: total becomes `0 + 1 = 1`.
2. `number = 2`: total becomes `1 + 2 = 3`.
3. `number = 3`: total becomes `3 + 3 = 6`.
4. There is no next number in the range. The final print outputs `6` once.

Initialise an accumulator **before** the loop. Setting it to zero inside the body would erase earlier work each time. Keep a separate trace column for the loop variable and the total.

## Continue while a condition holds

A `while` loop tests its condition **before** every iteration. If it is true, Python executes the body and tests again. If it is false, Python skips to the following statement.

```python
total = 0
while total < 10:
    total = total + 3
    print(total)
```

The output is four lines: `3`, `6`, `9`, `12`. The checks see 0, 3, 6 and 9, all below 10. After the fourth update, the next check sees 12, so the loop stops. A condition controls whether the body begins; it does not prevent an update from crossing a threshold.

Explain how the changing state will eventually make the condition false. Here the total increases by 3 every time. If an update is omitted, or moves the value in the wrong direction, a loop may never terminate. Do not try an endless loop to prove this; trace its unchanged condition on paper.

## Zero iterations and boundaries

`range(0)` contains no values. Likewise, a `while` condition that is already false skips its body. Always consider the state before the first check.

```python
total = 10
while total < 10:
    total = total + 3
print(total)
```

This prints `10`; the body never runs. A pre-test loop need not run once. For positive-step ranges, a start at or above the stop also gives no values.

## Common mistakes

- **Including the range stop.** To visit 1 through `n` inclusive, use `range(1, n + 1)`.
- **Resetting the accumulator inside the loop.** This loses previous values. Initialise once, then update.
- **Putting print at the wrong indentation.** Inside the loop it prints each partial result; after the loop it prints the final result once.
- **Expecting a while loop to stop at exactly the threshold.** Check the next condition using the actual updated value.
- **Ignoring termination.** State what changes and why it eventually makes the condition false.

## Recall and practise

Before tracing, write down the initial state, the values visited or condition checked, the update, and the location of each output statement.

Try [sum a sequence](/exercises/sum-a-sequence) after the checkpoint. Then continue to [combined flow and tracing](/lessons/combined-flow-and-tracing). This lesson teaches iteration, not recursion.

Python syntax reference: [Python 3.14 control-flow tutorial](https://docs.python.org/3.14/tutorial/controlflow.html), checked 12 October 2026. Explanations and examples above are original.
