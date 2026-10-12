---
{
  "title": "Trace decisions inside a loop", "slug": "combined-flow-and-tracing", "topic": "python-control-flow",
  "summary": "Combine iteration and selection, track a counter and an accumulator, and test your reasoning at boundaries.",
  "coverageNote": "Sequence, selection and iteration combined in a small non-recursive program; recursive tracing is excluded.",
  "syllabus": { "year": 2026, "outcomes": ["2.2.3", "2.2.6"] },
  "difficulty": "core", "estimatedMinutes": 20,
  "prerequisites": ["Trace the counted and conditional loops lesson", "Compare integers with >=", "Read a short list of integer values"],
  "relatedExercises": ["summarise-revision-scores"], "status": "published", "reviewedOn": "2026-10-12",
  "reviewer": "Codex: source mapping and executable-example review; independent teacher review pending",
  "provenance": "Original H2Compute explanations and questions, authored for this project. Python syntax checked against the Python 3.14 tutorial.",
  "quiz": [
    { "id": "trace-two-variables", "outcomes": ["2.2.3", "2.2.6"], "objective": "Distinguish unconditional accumulation from conditional counting", "difficulty": "core", "estimatedMinutes": 3,
      "prompt": "For scores 60, 45, 80, 59, what are the final ready_count and total?", "answer": 2,
      "options": [
        { "text": "4 and 244", "explanation": "The total includes all scores, but the counter increases only for scores at least 60. There are two qualifying scores." },
        { "text": "2 and 140", "explanation": "140 sums only the qualifying scores. The accumulation statement is outside the if block, so 45 and 59 also contribute." },
        { "text": "2 and 244", "explanation": "60 and 80 meet the condition, giving two increments. All four scores contribute to 60 + 45 + 80 + 59 = 244." }
      ]
    },
    { "id": "empty-trace", "outcomes": ["2.2.3", "2.2.6"], "objective": "Trace initialised state through zero loop iterations", "difficulty": "core", "estimatedMinutes": 2,
      "prompt": "If scores is an empty list, what does the worked example print?", "answer": 0,
      "options": [
        { "text": "0, then 0", "explanation": "Both variables are initialised before the loop. With no scores, the body is skipped and both final prints still execute." },
        { "text": "Nothing", "explanation": "Only the body is skipped. The two prints are outside it and execute even for an empty list." },
        { "text": "An error because score is undefined", "explanation": "The final statements print ready_count and total, which are already initialised. They do not read score after the loop." }
      ]
    }
  ]
}
---
## What you will learn

Trace an `if` inside a `for`, distinguish a **counter** (how many) from an **accumulator** (how much), and explain which updates always happen. Then design one small program that combines sequence, selection and iteration.

Start with [branching](/lessons/sequence-and-selection) and [loops](/lessons/counted-and-conditional-loops). The notation `[60, 45, 80, 59]` is a list of four integers; a `for` loop visits them in that order. An empty list is written `[]`.

## Follow the indentation

A statement indented inside the loop executes on every iteration, unless a surrounding branch skips it. A statement indented one level further inside an `if` executes only when that condition is true. Statements after the whole loop execute once.

Record values **after** each iteration, and label them that way. Mixing before- and after-update values makes a correct trace look wrong.

## Worked example: a revision summary

This original scenario counts practice scores of at least 60 and totals all scores. The threshold is a learning scenario, not an examination grading scale.

```python
scores = [60, 45, 80, 59]
ready_count = 0
total = 0
for score in scores:
    total = total + score
    if score >= 60:
        ready_count = ready_count + 1
print(ready_count)
print(total)
```

Trace the same statements in the same order for each score:

1. Before the loop: `ready_count = 0`, `total = 0`.
2. After score 60: total is 60; `60 >= 60` is true; count is 1.
3. After score 45: total is 105; the condition is false; count stays 1.
4. After score 80: total is 185; the condition is true; count becomes 2.
5. After score 59: total is 244; the condition is false; count stays 2.
6. After the loop: print `2`, then `244` on the next line.

The total is updated even when the condition is false. This is visible in the indentation: the total update is in the loop but outside the `if`.

## Test your trace, not your guess

Trace 59 and 60 to distinguish the two sides of the boundary. Trace an empty list to check the initial state. Trace a repeated value to check that each occurrence counts separately. A total can increase while a counter stays the same; they answer different questions.

For `[60, 60]`, both scores qualify: the outputs are `2` and `120`. For `[]`, neither update runs: the outputs are `0` and `0`. These are useful checks because they expose different mistakes.

## Common mistakes

- **Adding a score to a counter.** Use `+ 1` when counting occurrences, not `+ score`.
- **Moving the total update into the if.** That would total only the qualifying scores, changing the problem being solved.
- **Reinitialising variables in the loop.** That loses the history from earlier iterations.
- **Changing state on a false branch.** If the condition is false, the indented counter update does not execute.
- **Printing during each iteration.** Keep final summary outputs after the loop when the contract requests one final result.

## Design the combined program

For the [offline revision summary task](/exercises/summarise-revision-scores), the values arrive as input instead of a literal list. Use the count on the first line to control how many score lines to read. For each score, update the total, then decide whether to increase the counter. Print the two summaries after all input scores have been processed.

Before coding, write the initial state and the per-score updates. Compare your model reasoning after an offline attempt. You can also [revisit loops](/lessons/counted-and-conditional-loops) or [return to the topic](/topics/python-control-flow).

This completes the bounded control-flow topic. Recursive programs and full Python/syllabus coverage remain outside these lessons.

Python syntax reference: [Python 3.14 control-flow tutorial](https://docs.python.org/3.14/tutorial/controlflow.html), checked 12 October 2026. Explanations and examples above are original.
