---
{
  "title": "Summarise Year 1 bookings",
  "slug": "summarise-club-bookings",
  "topic": "relational-databases-and-sql",
  "summary": "Join related tables, filter bookings by member year, and distinguish booking counts from seat totals.",
  "syllabus": {
    "year": 2026,
    "outcomes": [
      "3.3.8"
    ]
  },
  "difficulty": "core",
  "estimatedMinutes": 14,
  "prerequisites": [
    "relations-and-keys",
    "select-filter-and-order",
    "joins-and-aggregation"
  ],
  "relatedExercises": [],
  "status": "published",
  "reviewedOn": "2026-11-12",
  "reviewer": "Codex: source mapping and SQLite example review; independent teacher review pending",
  "provenance": "Original H2Compute club scenario, explanations, questions and models; no real learner data.",
  "format": "sql",
  "lesson": "joins-and-aggregation",
  "objective": "Construct an INNER JOIN and grouped summary after filtering individual booking rows",
  "examples": [
    {
      "input": "Use the fixed club dataset from the relations-and-keys lesson.",
      "output": "session_id | title | booking_count | total_seats\n10 | Chess | 2 | 3\n20 | Coding | 2 | 3"
    },
    {
      "input": "Use the same club schema with no records in Member, ClubSession or Booking.",
      "output": "session_id | title | booking_count | total_seats\n(no rows)"
    }
  ],
  "hints": [
    "Join Booking to Member by member_id and to ClubSession by session_id.",
    "Filter Member.year_group = 1 before grouping by the session's ID and title.",
    "Use COUNT(*) for booking rows, SUM(b.seats) for seats, then sort total_seats DESC and session_id ASC."
  ]
}
---
## Your task

Write one SQLite-compatible query for [the fixed club dataset](/lessons/relations-and-keys#club-dataset). Report only sessions that have bookings made by Year 1 members. Return these columns, in order:

- `session_id`
- `title`
- `booking_count`: the number of matching booking records
- `total_seats`: the sum of seats in those records

Use inner joins. Filter by the member's year group before grouping. Keep separate session IDs even if titles are equal. Sort by `total_seats` descending, then `session_id` ascending when totals tie. Exclude sessions with no matching booking; the task does not ask for zero rows for those sessions.

Input means the schema and records, not stdin. Both visible examples use the same schema; the second has no records in any table. The displayed column separators are for reading, not an SQL formatting requirement. `(no rows)` denotes an empty result, not a generated row. All fields in the supplied dataset are present and seats are positive integers; missing-value and invalid-schema handling are outside this task.

Attempt the joins and hand totals before reading the model. This website does not run learner SQL. Your result is an offline self-check, with local self-marked completion.

<!-- model -->
## Model explanation

```sql
SELECT s.session_id, s.title,
       COUNT(*) AS booking_count,
       SUM(b.seats) AS total_seats
FROM Booking AS b
INNER JOIN Member AS m ON b.member_id = m.member_id
INNER JOIN ClubSession AS s ON b.session_id = s.session_id
WHERE m.year_group = 1
GROUP BY s.session_id, s.title
ORDER BY total_seats DESC, s.session_id ASC;
```

Members 1, 3 and 5 are in Year 1. Their matching bookings are 101, 103, 105 and 106. Chess receives two bookings for `2 + 1 = 3` seats. Coding receives two bookings for `2 + 1 = 3` seats. The seat totals tie, so session ID 10 comes before 20. Member 1 contributes to two different sessions; each booking belongs in its own session's group.

Drama has no booking and forms no group. With no source records, there are no groups at all, so the result has no rows. Counting joined rows counts bookings here because each booking matches exactly one member and one session. A wrong join can multiply rows and corrupt both aggregates. Return to [the lesson](/lessons/joins-and-aggregation#completion) to record completion, or revisit [keys](/lessons/relations-and-keys) to trace the relationships.
