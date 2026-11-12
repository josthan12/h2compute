---
{
  "title": "Select a club member report",
  "slug": "select-club-members",
  "topic": "relational-databases-and-sql",
  "summary": "Write one offline SQL query that filters Year 2 members and sorts equal names by ID.",
  "syllabus": {
    "year": 2026,
    "outcomes": [
      "3.3.8"
    ]
  },
  "difficulty": "core",
  "estimatedMinutes": 10,
  "prerequisites": [
    "relations-and-keys",
    "select-filter-and-order"
  ],
  "relatedExercises": [],
  "status": "published",
  "reviewedOn": "2026-11-12",
  "reviewer": "Codex: source mapping and SQLite example review; independent teacher review pending",
  "provenance": "Original H2Compute club scenario, explanations, questions and models; no real learner data.",
  "format": "sql",
  "lesson": "select-filter-and-order",
  "objective": "Construct a filtered SELECT with explicit two-field ordering",
  "examples": [
    {
      "input": "Use the fixed club dataset from the relations-and-keys lesson.",
      "output": "member_id | member_name\n2 | Ben\n4 | Devi\n6 | Farah"
    },
    {
      "input": "Use the same club schema with no records in Member, ClubSession or Booking.",
      "output": "member_id | member_name\n(no rows)"
    }
  ],
  "hints": [
    "Keep rows whose year_group equals 2.",
    "Return only member_id and member_name; the filter field need not be selected.",
    "Order by member_name ASC, then member_id ASC to resolve tied names."
  ]
}
---
## Your task

Write one SQLite-compatible `SELECT` query using [the fixed club dataset](/lessons/relations-and-keys#club-dataset). Return the `member_id` and `member_name` of every Year 2 member. Sort by name ascending; when names tie, sort by ID ascending. Keep distinct member records even if their names match.

The schema and fixed records are the input, not text read from standard input. The second visible case uses the same tables with no records, to check empty-result reasoning. Return the two named columns in that order and no other columns. The examples show result rows separated by newlines and columns by ` | `; spaces in the display are for reading, not an SQL output-formatting requirement. `(no rows)` labels an empty result and is not a record to generate.

Attempt the query on paper or with your own local SQLite tool. This website does not execute learner SQL or grade a database. Check both the row selection and the stated tie rule, then compare with the model.

<!-- model -->
## Model explanation

```sql
SELECT member_id, member_name
FROM Member
WHERE year_group = 2
ORDER BY member_name ASC, member_id ASC;
```

The filter keeps Members 2, 4 and 6. Sorting their names gives Ben, Devi, Farah. `member_id` resolves name ties even though the fixed Year 2 subset has none; a report's rule must remain correct when another Year 2 member is also named Ben. An empty Member table produces no result rows.

The ID column keeps member identity visible. Adding a duplicate-removal operation or grouping by name could merge different members and would not satisfy the task. Return to [the lesson](/lessons/select-filter-and-order#completion) to record local completion.
