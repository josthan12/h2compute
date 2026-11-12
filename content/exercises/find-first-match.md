---
{
  "topic": "algorithms-and-data-structures",
  "difficulty": "core",
  "status": "published",
  "reviewedOn": "2026-11-12",
  "reviewer": "Codex: source mapping and executable-example review; independent teacher review pending",
  "provenance": "Original H2Compute explanations, examples and questions, authored for this project. Mapping checked against the official 2026 syllabus, printed pages 7 and 9; Python syntax checked against the Python 3.14 tutorial.",
  "title": "Find the first match",
  "slug": "find-first-match",
  "summary": "Search an unsorted list of integers and print the first matching zero-based index, or -1.",
  "format": "python",
  "syllabus": {
    "year": 2026,
    "outcomes": [
      "1.2.3",
      "2.3.2"
    ]
  },
  "estimatedMinutes": 15,
  "prerequisites": [
    "lists-and-linear-search"
  ],
  "relatedExercises": [],
  "lesson": "lists-and-linear-search",
  "objective": "Implement a bounded left-to-right linear search with first-match and not-found results",
  "examples": [
    {
      "input": "5\n6\n4\n6\n9\n4\n4\n",
      "output": "1\n"
    },
    {
      "input": "0\n9\n",
      "output": "-1\n"
    },
    {
      "input": "1\n-3\n-3\n",
      "output": "0\n"
    },
    {
      "input": "1\n-3\n2\n",
      "output": "-1\n"
    },
    {
      "input": "4\n8\n8\n8\n8\n8\n",
      "output": "0\n"
    },
    {
      "input": "3\n10\n-2\n7\n7\n",
      "output": "2\n"
    },
    {
      "input": "3\n10\n-2\n7\n5\n",
      "output": "-1\n"
    }
  ],
  "hints": [
    "The first input says how many list values to read. Read the target after those values, even when the count is zero.",
    "Start with position = -1, then inspect valid indices from zero upwards.",
    "Once position holds a match, stop comparing. Otherwise a later duplicate could replace the first position."
  ]
}
---
## Your task

Write a single-file Python program that performs a left-to-right **linear search**. Print the first zero-based index containing the target. Print `-1` if the target is absent. Preserve the input order; the values need not be sorted. Do not use `list.index` or another built-in search: the aim is to implement the comparisons and stopping rule.

## Input and output

The first line contains an integer `n`, from 0 to 100 inclusive. The next `n` lines each contain one integer list value. The final line contains the target integer. Each value and target is from -1000 to 1000 inclusive. All input is valid and complete; there are exactly `n + 2` lines. Empty, malformed and out-of-range input are outside this exercise's contract.

An empty **list** is valid: input `0` followed by a target has no list values, but it still has a target line. Print exactly one integer on one line, with no prompt or label. Zero-based index 0 means the first item, not "not found".

For the first visible example, the values are `[6, 4, 6, 9, 4]` and the target is 4. The first match is at index 1. The later match at index 4 does not change the answer.

Attempt the task on paper or in your own local Python installation. Check an empty list, a singleton, duplicates and a last-position match. This site does not execute or grade your attempt; the visible examples support offline self-checking.

<!-- model -->
## Model explanation

Read exactly `n` values into a list. `append` adds the next value at the end without changing the earlier order. Then read the target. Initialise the result to `-1`, and keep an index that only enters the body while it is in bounds and no earlier match has been found.

```python
n = int(input())
values = []
for count in range(n):
    values.append(int(input()))
target = int(input())
position = -1
index = 0
while index < len(values) and position == -1:
    if values[index] == target:
        position = index
    index = index + 1
print(position)
```

For `[6, 4, 6, 9, 4]`, the comparison at index 0 fails and the comparison at index 1 succeeds. The loop saves 1 and stops before checking index 2. The result is the saved index, not the incremented loop index. For an empty list, the search body never executes, so the result stays `-1`. A singleton either matches at index 0 or has no match.

The search performs at most `n` item comparisons and has O(n) worst-case time. Reading the input also takes O(n) time. Checking additional visible examples is a learning step, not a trusted grade on your program.

Return to [lesson completion](/lessons/lists-and-linear-search#completion), then compare the approach with [binary search](/lessons/binary-search).
