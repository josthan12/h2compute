---
{
  "topic": "algorithms-and-data-structures",
  "difficulty": "core",
  "status": "published",
  "reviewedOn": "2026-11-12",
  "reviewer": "Codex: source mapping and executable-example review; independent teacher review pending",
  "provenance": "Original H2Compute explanations, examples and questions, authored for this project. Mapping checked against the official 2026 syllabus, printed pages 7 and 9; Python syntax checked against the Python 3.14 tutorial.",
  "title": "Lists and linear search",
  "slug": "lists-and-linear-search",
  "summary": "Use list indices to search from left to right and report the first matching position.",
  "coverageNote": "One-dimensional integer lists support an iterative linear search, worked traces and worst-case O(n) reasoning. Binary and hash table search, sorting and linked data structures are not taught here.",
  "syllabus": {
    "year": 2026,
    "outcomes": [
      "1.2.3",
      "1.2.4",
      "1.2.5",
      "2.3.2"
    ]
  },
  "estimatedMinutes": 20,
  "prerequisites": [
    "Trace decisions and loops in the Python control-flow topic",
    "Compare integers for equality",
    "Recognise an accumulator or counter initialised before a loop"
  ],
  "relatedExercises": [
    "find-first-match"
  ],
  "quiz": [
    {
      "id": "first-duplicate-position",
      "outcomes": [
        "1.2.3",
        "1.2.4"
      ],
      "objective": "Distinguish a value from its first zero-based matching position",
      "difficulty": "core",
      "estimatedMinutes": 2,
      "prompt": "A left-to-right linear search stops at its first match. For values [14, 8, 14, 5] and target 14, which position does it report?",
      "answer": 1,
      "options": [
        {
          "text": "14",
          "explanation": "14 is the target value. The requested result is its position, counted from zero."
        },
        {
          "text": "0",
          "explanation": "The first item matches, and the first item's index is zero. Stopping immediately preserves the first match even though index 2 also holds 14."
        },
        {
          "text": "2",
          "explanation": "Index 2 is a later match. A first-match search must stop after finding the match at index 0."
        }
      ]
    },
    {
      "id": "empty-linear-search",
      "outcomes": [
        "1.2.3",
        "1.2.4"
      ],
      "objective": "Explain the result when an empty list has no valid index",
      "difficulty": "core",
      "estimatedMinutes": 2,
      "prompt": "In the worked search program, what happens if values is []?",
      "answer": 0,
      "options": [
        {
          "text": "It prints -1 without reading a list item.",
          "explanation": "index starts at 0 and len(values) is 0, so the loop condition is false. The initial not-found result remains -1."
        },
        {
          "text": "It prints 0 because that is the first index.",
          "explanation": "An empty list has no first item. Zero is only a valid index when the list contains at least one item."
        },
        {
          "text": "It raises IndexError on values[0].",
          "explanation": "The loop checks the bound before entering its body. Since it skips the body, values[index] is never evaluated."
        }
      ]
    }
  ]
}
---
## What you will learn

Read a one-dimensional Python list by position, implement a left-to-right linear search, and explain why it returns the first match or a not-found result. Count the work needed in the worst case.

Revisit [decisions inside loops](/lessons/combined-flow-and-tracing) first. This lesson uses integer values, equality, assignment and a conditional loop. A Python list provides an indexed sequence for these searches; this is not a lesson on the linked-list data structure.

## Values have positions

A **list** keeps values in order. An **index** identifies a position; Python starts counting indices at zero. `len(values)` gives the number of items, not the last index. For a non-empty list, the non-negative indices run from `0` through `len(values) - 1`.

```python
values = [14, 8, 14, 5]
print(len(values))
print(values[1])
```

This prints `4`, then `8`. The item at index 1 is the second item. Indices 0 and 2 both hold 14: equal values may occupy different positions. An empty list, `[]`, has length zero and no valid index. Reading past the end raises `IndexError`.

Python also allows negative indices, but the search contract here reports only non-negative positions. We use `-1` as a **sentinel**, a special result meaning no match. Check this result before using it as an index: `values[-1]` would mean the last item in a non-empty Python list, not "missing".

## Search one item at a time

**Linear search** checks items one by one. It works even when the values are unsorted. Our contract is: return the first index containing the target, or `-1` if the target does not occur.

Start at index zero with a not-found result. While there is an unchecked item and no match yet, compare that item with the target. Record its index if it matches. Otherwise move on. The loop below advances the index after every comparison; its next condition prevents another comparison once a match has been recorded.

```python
values = [14, 8, 14, 5]
target = 8
position = -1
index = 0
while index < len(values) and position == -1:
    if values[index] == target:
        position = index
    index = index + 1
print(position)
```

The bound is checked before the body reads `values[index]`. The index increases every iteration, so an unsuccessful search eventually reaches `len(values)` and stops. A match stops it sooner. An empty list skips the loop entirely and prints `-1`.

## Worked trace: first match or no match

For target 8, start with `index = 0` and `position = -1`.

1. Index 0 holds 14, so it does not match. Increase `index` to 1.
2. Index 1 holds 8. Set `position` to 1 and increase `index` to 2.
3. The next condition sees `position != -1`, so it stops. Print `1`.

The result is the saved position, not the advanced index. For target 14, the first comparison records position 0 and the later copy at position 2 is never checked. For target 9, all four comparisons fail and the result remains `-1`.

Before each comparison, every earlier index has already failed to match. This explains why the first successful comparison gives the first matching position. Continuing to overwrite the result after a match would instead return the last matching position.

## How much searching is needed?

Let `n` be the number of list items. Finding the target at the start takes one item-to-target equality check. An absent target, or a target first appearing at the last index, requires `n` checks. The worst-case time grows in proportion to `n`, written **O(n)**. With an empty list, there are zero item comparisons.

Big-O describes growth as input size increases; it is not an exact runtime in seconds. Doubling the list length can double the worst-case number of checks. The loop still performs only a fixed amount of other work per item.

## Common mistakes

- **Using the value as the answer.** A position answers "where?"; the target value answers "what?".
- **Reading index len(values).** This is one position beyond the end. Use `index < len(values)`.
- **Treating -1 as a usable search index.** Check for not found before indexing a list with the result.
- **Overwriting an earlier match.** Stop after the first match when the contract asks for the first position.
- **Assuming a search must find something.** Initialise and preserve an explicit not-found result.

## Recall and practise

Explain why the empty-list case is safe, why duplicates do not change the first-match contract, and why an absent target forces the most comparisons. Try [find the first match](/exercises/find-first-match), then continue to [binary search](/lessons/binary-search), where sorted values let us discard many positions at once.

Mapping: [official 2026 H2 Computing syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf), outcomes 1.2.3-1.2.5 on printed page 7 and 2.3.2 on printed page 9. These broad outcomes are only partly covered. Python reference: [Python 3.14 lists tutorial](https://docs.python.org/3.14/tutorial/introduction.html#lists). Sources checked 12 November 2026; explanations and examples are original. Independent teacher review remains pending.
