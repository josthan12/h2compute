---
{
  "topic": "algorithms-and-data-structures",
  "difficulty": "core",
  "status": "published",
  "reviewedOn": "2026-11-12",
  "reviewer": "Codex: source mapping and executable-example review; independent teacher review pending",
  "provenance": "Original H2Compute explanations, examples and questions, authored for this project. Mapping checked against the official 2026 syllabus, printed pages 7 and 9; Python syntax checked against the Python 3.14 tutorial.",
  "title": "Binary search on sorted values",
  "slug": "binary-search",
  "summary": "Shrink an inclusive search interval in a sorted list and compare its worst-case growth with linear search.",
  "coverageNote": "Iterative binary search on an already sorted integer list, including absence, duplicates and O(log n) versus O(n) worst-case time. Hash table search, sorting algorithms and space complexity are excluded.",
  "syllabus": {
    "year": 2026,
    "outcomes": [
      "1.2.3",
      "1.2.4",
      "1.2.5",
      "2.3.2"
    ]
  },
  "estimatedMinutes": 22,
  "prerequisites": [
    "Find a first matching index with linear search",
    "Read zero-based list indices and len",
    "Trace a conditional loop with integer comparisons"
  ],
  "relatedExercises": [
    "binary-search-position"
  ],
  "quiz": [
    {
      "id": "sorted-precondition",
      "outcomes": [
        "1.2.3",
        "1.2.4"
      ],
      "objective": "Use sorted order to justify discarding part of the search interval",
      "difficulty": "core",
      "estimatedMinutes": 2,
      "prompt": "Why does this binary search require the values to be sorted in ascending order?",
      "answer": 2,
      "options": [
        {
          "text": "So the first midpoint is always the target.",
          "explanation": "A sorted list can have its target at any position, or not contain it. Several midpoint checks may be needed."
        },
        {
          "text": "So every value occurs only once.",
          "explanation": "Ascending order can include equal neighbouring values. Sorting does not remove duplicates."
        },
        {
          "text": "So comparing the midpoint value with the target identifies a half that cannot contain a match.",
          "explanation": "If the midpoint value is too small, every value to its left is also too small; if too large, every value to its right is also too large. This reasoning depends on sorted order."
        }
      ]
    },
    {
      "id": "search-growth",
      "outcomes": [
        "1.2.5"
      ],
      "objective": "Compare worst-case linear and binary search time growth",
      "difficulty": "core",
      "estimatedMinutes": 2,
      "prompt": "For an already sorted list with direct index access, which worst-case time comparison is correct as n grows?",
      "answer": 0,
      "options": [
        {
          "text": "Linear search is O(n); binary search is O(log n).",
          "explanation": "Linear search may check every item. Binary search discards about half of the remaining interval after each unsuccessful midpoint check."
        },
        {
          "text": "Both are O(n) because both use a loop.",
          "explanation": "A loop's growth depends on how its remaining work changes. The binary-search interval shrinks by about half rather than by one item."
        },
        {
          "text": "Binary search is O(1) because it starts in the middle.",
          "explanation": "The first midpoint may miss. The number of midpoint checks still grows, though slowly, as the list becomes larger."
        }
      ]
    }
  ]
}
---
## What you will learn

Implement an iterative binary search, trace its inclusive interval, and explain both safe termination and worst-case time growth. Begin with [lists and linear search](/lessons/lists-and-linear-search), including zero-based indices and the `-1` not-found convention.

Our list must already be in **ascending, non-decreasing order**: each item is at least as large as its predecessor. Duplicates are allowed. Binary search can return a matching position; the version here does not promise the first occurrence.

## Discard positions using order

**Binary search** checks the item at the midpoint of the remaining search interval. If it matches, stop. If it is smaller than the target, discard it and every position to its left. If it is larger, discard it and every position to its right.

Sorted order justifies each discard. When the midpoint value is too small, values to its left cannot be larger than it, so none can equal the target. This conclusion is invalid for an unsorted list. An unsorted input might sometimes give a correct answer by chance; it does not satisfy the algorithm's precondition.

We use an **inclusive interval** from index `low` through index `high`. Both endpoints are still candidates. Start with `low = 0` and `high = len(values) - 1`. The interval is empty when `low > high`; that is the not-found condition.

## Worked example: shrinking the interval

```python
values = [3, 7, 11, 18, 24, 31, 42]
target = 24
low = 0
high = len(values) - 1
position = -1
while low <= high and position == -1:
    middle = (low + high) // 2
    if values[middle] == target:
        position = middle
    elif values[middle] < target:
        low = middle + 1
    else:
        high = middle - 1
print(position)
```

`//` is integer floor division. With non-negative bounds, `(low + high) // 2` chooses an integer midpoint; for an even number of candidates it chooses the lower of the two central indices.

1. `low = 0`, `high = 6`: midpoint 3 holds 18. It is too small, so set `low = 4`.
2. `low = 4`, `high = 6`: midpoint 5 holds 31. It is too large, so set `high = 4`.
3. `low = 4`, `high = 4`: midpoint 4 holds 24. Save position 4 and stop on the next condition check.
4. Print `4`. The result is an index; the matching value is 24.

## Explain the bounds and termination

Before each iteration, any possible match must lie between `low` and `high`. After an unsuccessful comparison, the checked midpoint is excluded too: use `middle + 1` or `middle - 1`. Keeping the midpoint as a bound can leave a one-item interval unchanged forever.

Use `low <= high`, because `low == high` still describes one candidate. For target 25 in the worked list, the same first two steps leave only index 4. Its value, 24, is too small, so `low` becomes 5 while `high` stays 4. The empty interval stops the loop and `-1` is printed. No out-of-range item is read.

For `[]`, the initial bounds are 0 and -1, so there is no iteration. For a one-item list, the initial bounds are both zero; the single value is checked once. Every unsuccessful iteration reduces the number of candidates, so the loop eventually finds a match or empties the interval.

## Duplicates and result contracts

With `[3, 7, 7, 7, 12]` and target 7, the first midpoint is index 2, so this version returns 2. Index 1 also matches. The [linear search lesson](/lessons/lists-and-linear-search) instead promises the first match and returns 1 for that list.

Read the task contract before choosing an algorithm. Returning any matching index, the first matching index, and the number of matches are different requirements. The offline task specifies this midpoint rule so its visible examples have one exact output. Finding the first duplicate by binary search would require a different continuation rule and is outside this lesson.

## Compare worst-case time

Linear search may inspect `n` items: **O(n)** worst-case time. Binary search removes about half of the remaining candidates after each unsuccessful midpoint check: **O(log n)** worst-case time. Here the logarithm is base two; changing a fixed base does not change the Big-O class.

For 1, 3, 7 and 15 items, binary search needs at most 1, 2, 3 and 4 midpoint checks respectively. Linear search can need 1, 3, 7 and 15 item checks. A midpoint check may perform both an equality and an ordering comparison in this implementation; that fixed extra work does not change O(log n).

This comparison assumes the list is already sorted and items can be read directly by index. It excludes reading the input or sorting it first. Reading `n` input values still takes O(n) time in the offline program; the **search phase** has logarithmic worst-case time. Do not claim an entire input-reading program runs in O(log n).

## Common mistakes

- **Searching unsorted input.** The discard argument depends on ascending order.
- **Using low < high.** That skips a final one-item interval.
- **Keeping the midpoint after a miss.** Exclude it to guarantee progress.
- **Expecting the first duplicate.** This version stops at its first matching midpoint.
- **Calling the result a value.** Report the index requested by the contract, or `-1`.

## Recall and practise

Trace a present target, an absent target between two values, the smallest and largest items, an empty list, and a singleton. State why each discarded half cannot contain the target. Try [binary search position](/exercises/binary-search-position), or [revisit linear search](/lessons/lists-and-linear-search) to compare their contracts and worst cases.

Mapping: [official 2026 H2 Computing syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf), outcomes 1.2.3-1.2.5 on printed page 7 and 2.3.2 on printed page 9. Coverage is partial: hash table search and sorting are omitted; space complexity is excluded from outcome 1.2.5. Python reference: [Python 3.14 expressions reference](https://docs.python.org/3.14/reference/expressions.html#binary-arithmetic-operations). Sources checked 12 November 2026; explanations and examples are original. Independent teacher review remains pending.
