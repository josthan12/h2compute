---
{
  "title": "Make a decision with Python",
  "slug": "sequence-and-selection",
  "topic": "python-control-flow",
  "summary": "Follow a program in order, choose one branch, and explain exactly what it prints.",
  "syllabus": { "year": 2026, "outcomes": ["2.2.3", "2.2.6"] },
  "difficulty": "core", "estimatedMinutes": 15,
  "prerequisites": ["Assign an integer to a variable", "Read comparisons such as >= and <", "Recognise print()"],
  "relatedExercises": ["classify-a-score"],
  "status": "published", "reviewedOn": "2026-10-12",
  "reviewer": "Codex: source mapping and executable-example review; independent teacher review pending",
  "provenance": "Original H2Compute explanations and questions, authored for this project.",
  "quiz": [
    { "id": "boundary-branch", "outcomes": ["2.2.3", "2.2.6"], "objective": "Trace a boundary through an ordered branch chain", "difficulty": "core", "estimatedMinutes": 2,
      "prompt": "In the worked example, score is changed to 60. Which two lines are printed?", "answer": 1,
      "options": [
        { "text": "Review, then Recorded", "explanation": "60 >= 60 is true. The final else is skipped because an earlier branch was selected." },
        { "text": "Ready, then Recorded", "explanation": "60 >= 80 is false, then 60 >= 60 is true. The Ready block runs; the unindented final print runs afterwards." },
        { "text": "Ready only", "explanation": "Recorded is outside the branch chain. It executes after whichever branch is chosen." }
      ]
    },
    { "id": "first-match", "outcomes": ["2.2.3"], "objective": "Distinguish an ordered chain from independent conditions", "difficulty": "core", "estimatedMinutes": 2,
      "prompt": "Why is the >= 80 condition checked before >= 60?", "answer": 2,
      "options": [
        { "text": "Python always requires larger numbers first", "explanation": "Python has no such rule. This ordering is needed for these overlapping conditions and intended categories." },
        { "text": "Both matching branches must execute", "explanation": "An if/elif/else chain selects the first matching branch only. Separate if statements behave differently." },
        { "text": "Otherwise a score of 85 would match >= 60 first", "explanation": "85 satisfies both comparisons. Checking the broader >= 60 first would choose Ready and never reach the Stretch branch." }
      ]
    }
  ]
}
---
## What you will learn

Read statements in execution order, trace an `if` / `elif` / `else` chain, and explain why a boundary value takes a particular branch. This lesson covers sequence and selection; loops come later.

## Start with sequence

**Sequence** means executing statements in order. An assignment changes the value available to later statements. A comparison produces a Boolean value: `True` or `False`.

```python
score = 58
score = score + 2
print(score)
```

The first assignment stores 58. The second uses that value to calculate 60, then replaces the stored value. The output is `60`.

## Choose one branch

**Selection** chooses a path according to a condition. `if` tests the first condition. `elif` tests another only when earlier conditions were false. `else` handles the remaining case.

Each condition line ends with a colon. Indentation groups statements into a block. Use four spaces consistently. An `if` / `elif` / `else` chain runs at most one branch; when it includes `else`, exactly one branch is chosen.

## Worked example

A revision tool assigns a practice category to an integer score from 0 to 100. This is an invented learning scenario, not an examination grading scale.

```python
score = 75
if score >= 80:
    print("Stretch")
elif score >= 60:
    print("Ready")
else:
    print("Review")
print("Recorded")
```

Trace it before reading the result:

1. Store `75` in `score`.
2. Evaluate `75 >= 80`: false, so skip the Stretch block.
3. Evaluate `75 >= 60`: true, so print `Ready`.
4. Skip the `else` block because a branch has already been chosen.
5. Print `Recorded`. This line is unindented and belongs to the surrounding sequence.

The two output lines are:

```text
Ready
Recorded
```

For 80, the first branch prints `Stretch`. For 59, both comparisons are false and `else` prints `Review`. The final `Recorded` line appears in both cases.

## Common mistakes

- **Using `>` instead of `>=`.** `score > 60` excludes 60; `score >= 60` includes it. Trace the exact boundary, not just a nearby value.
- **Checking the broader condition first.** Every score at least 80 is also at least 60. Put the more specific category first in this chain.
- **Replacing `elif` with another `if`.** Independent `if` statements can both run. Also, an `else` belongs to its matching `if`, not to every earlier condition.
- **Indenting the final print.** That would put it inside a branch and change when it runs.
- **Confusing `=` with `==`.** `=` assigns a value; `==` compares values. Use a comparison when checking equality.

## Pause and explain

Say which condition is tested next and why. Then use the checkpoint below. You can retry every question; mistakes are useful evidence for revision.

After the checkpoint, try the [offline score classifier](/exercises/classify-a-score). Return to the [control-flow topic](/topics/python-control-flow) whenever you want to revisit the learning path.
