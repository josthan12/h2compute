---
{
  "topic": "algorithms-and-data-structures",
  "difficulty": "core",
  "status": "published",
  "reviewedOn": "2026-11-12",
  "reviewer": "Codex: source mapping and executable-example review; independent teacher review pending",
  "provenance": "Original H2Compute explanations, examples and questions, authored for this project. Mapping checked against the official 2026 syllabus, printed pages 7 and 9; Python syntax checked against the Python 3.14 tutorial.",
  "title": "Binary search position",
  "slug": "binary-search-position",
  "summary": "Apply the inclusive-bound binary search to an already sorted list and report its matching midpoint.",
  "format": "python",
  "syllabus": {
    "year": 2026,
    "outcomes": [
      "1.2.3",
      "2.3.2"
    ]
  },
  "estimatedMinutes": 18,
  "prerequisites": [
    "lists-and-linear-search",
    "binary-search"
  ],
  "relatedExercises": [],
  "lesson": "binary-search",
  "objective": "Implement iterative binary search with inclusive bounds, a specified midpoint rule and a not-found result",
  "examples": [
    {
      "input": "7\n3\n7\n11\n18\n24\n31\n42\n24\n",
      "output": "4\n"
    },
    {
      "input": "0\n8\n",
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
      "input": "5\n2\n5\n5\n5\n9\n5\n",
      "output": "2\n"
    },
    {
      "input": "4\n-8\n0\n4\n12\n-8\n",
      "output": "0\n"
    },
    {
      "input": "4\n-8\n0\n4\n12\n12\n",
      "output": "3\n"
    },
    {
      "input": "4\n-8\n0\n4\n12\n5\n",
      "output": "-1\n"
    },
    {
      "input": "2\n3\n9\n2\n",
      "output": "-1\n"
    },
    {
      "input": "2\n3\n9\n10\n",
      "output": "-1\n"
    }
  ],
  "hints": [
    "The list is already sorted. Start with low = 0 and high = n - 1, both inclusive.",
    "While low <= high, compute middle = (low + high) // 2. Stop at a matching midpoint.",
    "After a miss, exclude the midpoint: move low to middle + 1 if its value is too small, or high to middle - 1 if too large."
  ]
}
---
## Your task

Write a single-file Python program that performs **binary search** on an already sorted list. Use inclusive bounds `low` and `high`, starting at 0 and `n - 1`. On each iteration choose `middle = (low + high) // 2`. Stop immediately if that value equals the target and print its index. Otherwise discard the midpoint and the half that cannot contain a match. Print `-1` if the interval becomes empty.

This task specifies the midpoint rule and immediate stopping so that each visible example has one exact output. With duplicates, report the **first matching midpoint reached by this procedure**, which may not be the first occurrence in the list. Do not sort the list or use a built-in search.

## Input and output

The first line contains an integer `n`, from 0 to 100 inclusive. The next `n` lines each contain one integer list value in ascending, non-decreasing order; duplicates are allowed. The final line contains the target integer. Each value and target is from -1000 to 1000 inclusive. All input is valid and complete; there are exactly `n + 2` lines. Empty, malformed, unsorted and out-of-range input are outside this exercise's contract.

An empty list still supplies the count line and target line. Print exactly one integer on one line, with no prompt or label. For the duplicate example `[2, 5, 5, 5, 9]` and target 5, the first midpoint is index 2, so print `2` even though index 1 also matches.

Attempt the task on paper or in your own local Python installation. Trace the interval after each unsuccessful comparison, including a target between two stored values and a target outside the stored range. This site does not execute or grade your attempt; the visible cases support offline self-checking.

<!-- model -->
## Model explanation

Read the already sorted values without rearranging them. An empty list gives `high = -1`, so the loop is skipped safely. Otherwise, keep both ends as candidates until a comparison excludes them. A successful equality saves the result; a miss removes the midpoint as well as the unsuitable half.

```python
n = int(input())
values = []
for count in range(n):
    values.append(int(input()))
target = int(input())
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

For `[3, 7, 11, 18, 24, 31, 42]` and target 24, midpoint indices 3, 5 and 4 are visited, producing result 4. For `[3, 9]` and target 10, midpoint 0 is too small, then midpoint 1 is too small. `low` becomes 2 while `high` remains 1, so the result stays `-1`.

When only one candidate remains, `low == high` and it must still be checked. Each unsuccessful update strictly shrinks the interval, which prevents repeating the same midpoint forever. No index is read after the interval becomes empty.

The search phase has O(log n) worst-case time on this indexed, already sorted list. Reading all `n` input values takes O(n) time, so the whole input-reading program is O(n). This distinction matters when describing what work an efficiency claim measures.

Return to [lesson completion](/lessons/binary-search#completion), or [compare linear search](/lessons/lists-and-linear-search).
