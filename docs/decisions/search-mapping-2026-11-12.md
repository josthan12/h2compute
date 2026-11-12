# Search sequence: syllabus mapping and boundaries

**Checked:** 12 November 2026.
**Scope:** two original algorithms/data structures lessons, explanatory checkpoints and offline Python tasks. Source mapping is verified; integration checks and independent agent sign-off are recorded by the delivery workflow. Independent teacher review remains pending.

## Official source and identifiers

The source is the [official 2026 H2 Computing 9569 syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf). The author inspected the complete relevant pages in the local PDF render (`docs/syllabus-check-07.png`, `08.png` and `09.png`) and opened the official PDF online. References below are the document's numeric outcome references, with **printed** page numbers; they are not invented internal IDs.

| Outcome | Printed page | Scope of the official outcome, paraphrased | Selected coverage |
| --- | --- | --- | --- |
| 1.2.3 | 7 | Implement linear, binary and hash table search algorithms. | Iterative linear and binary searches on indexed integer lists. |
| 1.2.4 | 7 | Explain search algorithms using examples. | Worked present/absent traces and the reasoning behind sequential checks or discarding an ordered half. |
| 1.2.5 | 7 | Compare worst-case time efficiency of sorting and searching with Big-O; space complexity is excluded. | O(n) linear versus O(log n) binary search on an already sorted, directly indexed list. |
| 2.3.2 | 9 | Write programs implementing linear, binary and hash table searches. | Single-file Python implementations with explicit stdin/stdout contracts. |

Every outcome remains **partial**. Hash table search and sorting algorithms are absent. These lessons do not teach the linked-list/tree/stack/queue outcomes in section 1.3 or claim full programming or algorithms/data structures coverage. Basic Python list length/indexing is prerequisite support, not a claim to complete the broad type/array outcome 2.2.1.

## Connected teaching sequence

1. `lists-and-linear-search` revisits control-flow prerequisites, introduces list length and zero-based positions, then implements a first-match linear search. It explains empty input lists, a not-found sentinel, repeated values, valid indices and worst-case O(n) time.
2. `binary-search` requires the first lesson. It teaches ascending order as a precondition, inclusive bounds, the lower integer midpoint, strict shrinking after a miss, the final single candidate, absence, duplicates and O(log n) search time. It distinguishes the search phase from O(n) input reading, and excludes any initial sorting cost from the comparison.

Both lessons map to all four listed outcomes. Each has two explanatory multiple-choice questions. `first-duplicate-position` and `empty-linear-search` assess 1.2.3/1.2.4; `sorted-precondition` also assesses 1.2.3/1.2.4; `search-growth` assesses 1.2.5. The two offline tasks, `find-first-match` and `binary-search-position`, assess implementation under 1.2.3/2.3.2 and use outcome subsets of their parent lessons.

The result contracts intentionally differ. Linear search returns the **first** matching non-negative index. Binary search stops at the **first matching midpoint reached by the specified lower-midpoint procedure**, which need not be the first duplicate. Either prints `-1` for absence. The binary task's exact procedure makes its visible expected outputs unambiguous without claiming that all binary searches choose the same duplicate.

## Provenance, verification and limits

All explanations, scenarios, code and questions are original project content. Syntax references are the [Python 3.14 lists tutorial](https://docs.python.org/3.14/tutorial/introduction.html#lists) and [Python 3.14 expression reference](https://docs.python.org/3.14/reference/expressions.html#binary-arithmetic-operations), opened on 12 November 2026. No textbook or examination question is reproduced.

The normal `python tests/check_examples.py` checker must include the lesson traces (`4`, then `8`; `1`; and `4`) and run all model blocks against all visible examples. The additional `python tests/check_search_examples.py` checker varies trusted repository-authored search inputs, not learner submissions. It checks exhaustive small inputs, duplicates, missing values, empty/singleton lists, both endpoints, input-value extremes and the maximum allowed 100-item list. Instrumented lesson lists reject invalid indices and bound item reads; fixed duplicate traces check the midpoint convention. These local checks do not establish behaviour on the pinned Pyodide runtime.

Tasks are offline practice only. They do not add SQL execution, learner browser execution, hidden tests, accounts, services or grading. They explicitly assume bounded valid input; malformed/empty stdin and unsorted binary-search input are outside their stated contracts. An empty list is supported by a zero count followed by a target line. Learner execution and all existing browser/provider/device release gates remain unchanged. An independent agent review cannot replace the still-pending independent teacher review.
