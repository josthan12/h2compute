---
{
  "title": "Join tables and summarise groups",
  "slug": "joins-and-aggregation",
  "topic": "relational-databases-and-sql",
  "summary": "Follow an INNER JOIN through primary and foreign keys, then count bookings and total seats per session.",
  "syllabus": {
    "year": 2026,
    "outcomes": [
      "3.3.8"
    ]
  },
  "difficulty": "core",
  "estimatedMinutes": 22,
  "prerequisites": [
    "Read primary and foreign keys from relations-and-keys",
    "Use SELECT, WHERE and ORDER BY from select-filter-and-order"
  ],
  "relatedExercises": [
    "summarise-club-bookings"
  ],
  "status": "published",
  "reviewedOn": "2026-11-12",
  "reviewer": "Codex: source mapping and SQLite example review; independent teacher review pending",
  "provenance": "Original H2Compute club scenario, explanations, questions and models; no real learner data.",
  "coverageNote": "INNER JOIN across the club tables, GROUP BY, COUNT(*) and SUM with explicit ordering. Outer joins, HAVING, other SQL statements, programming-language integration and NoSQL are deferred.",
  "quiz": [
    {
      "id": "inner-join-omits-unmatched",
      "outcomes": [
        "3.3.8"
      ],
      "objective": "Explain which records an INNER JOIN includes",
      "difficulty": "core",
      "estimatedMinutes": 2,
      "prompt": "Why does Drama not appear in the grouped INNER JOIN result?",
      "answer": 2,
      "options": [
        {
          "text": "ORDER BY removes sessions with no seats",
          "explanation": "ORDER BY only sorts rows already in the result. It does not remove sessions or create zero totals."
        },
        {
          "text": "GROUP BY changes Drama's title to Coding",
          "explanation": "Grouping combines matching joined rows with the same group values. It does not rename a session."
        },
        {
          "text": "Drama has no matching Booking record",
          "explanation": "INNER JOIN produces matching pairs only. With no Drama booking, there is no joined row to form a Drama group."
        }
      ]
    },
    {
      "id": "count-is-not-seat-total",
      "outcomes": [
        "3.3.8"
      ],
      "objective": "Distinguish the number of joined records from an aggregate field total",
      "difficulty": "core",
      "estimatedMinutes": 2,
      "prompt": "Coding has four bookings with seats 1, 3, 2 and 1. What do COUNT(*) and SUM(b.seats) return for Coding?",
      "answer": 0,
      "options": [
        {
          "text": "4 and 7",
          "explanation": "The four joined rows each represent a booking, so COUNT(*) is 4. Adding their seat values gives 7."
        },
        {
          "text": "7 and 7",
          "explanation": "COUNT(*) counts rows, not seats. A booking for three seats is still one booking row."
        },
        {
          "text": "4 and 4",
          "explanation": "SUM(b.seats) adds the seat values, including the booking for three and the booking for two; it does not count rows."
        }
      ]
    }
  ]
}
---
## What you will learn

Connect records with `INNER JOIN`, give tables short aliases, group the joined rows, and distinguish `COUNT(*)` from `SUM`. Start with [single-table filtering and ordering](/lessons/select-filter-and-order) and keep the [complete club dataset](/lessons/relations-and-keys#club-dataset) nearby.

## Join on the relationship

A booking stores IDs; a useful report may need the member's name and session title. `INNER JOIN` produces one combined row for each pair of records satisfying its `ON` condition. Use the primary/foreign-key relationship, rather than a coincidental match between names or row positions.

```sql
SELECT m.member_id, m.member_name, s.title, b.seats
FROM Booking AS b
INNER JOIN Member AS m ON b.member_id = m.member_id
INNER JOIN ClubSession AS s ON b.session_id = s.session_id
ORDER BY b.booking_id ASC;
```

`b`, `m` and `s` are **aliases** for the three tables inside this query. Prefixing fields, such as `b.member_id`, states which table supplies them. The `ON` conditions pair each Booking with its member and session.

```text
member_id | member_name | title  | seats
1         | Aisha       | Chess  | 2
2         | Ben         | Coding | 1
3         | Chen        | Chess  | 1
4         | Devi        | Coding | 3
5         | Ben         | Coding | 2
1         | Aisha       | Coding | 1
```

Booking 101 matches exactly one Member and one ClubSession because those referenced IDs are unique. Aisha appears twice because she has two bookings; the Bens are different members. These repeated names are meaningful rows, not an error to remove. Joining unrelated fields, or omitting the matching condition, can create wrong combinations and inflate later totals.

Farah has no booking, so this report has no Farah row. Drama also has no booking and is absent. An inner join does not invent rows for unmatched records. Reports that must include zero-booking sessions need a different join strategy, deferred here.

## Group rows and calculate totals

Suppose the club wants one row per booked session with its booking count and reserved-seat total. `GROUP BY` partitions the joined rows into groups with equal grouping values. An aggregate calculates one result for each group.

```sql
SELECT s.session_id, s.title,
       COUNT(*) AS booking_count,
       SUM(b.seats) AS total_seats
FROM ClubSession AS s
INNER JOIN Booking AS b ON s.session_id = b.session_id
GROUP BY s.session_id, s.title
ORDER BY total_seats DESC, s.session_id ASC;
```

```text
session_id | title  | booking_count | total_seats
20         | Coding | 4             | 7
10         | Chess  | 2             | 3
```

For Coding, Bookings 102, 104, 105 and 106 form one group. `COUNT(*)` counts its four rows. `SUM(b.seats)` adds `1 + 3 + 2 + 1`, giving seven. Chess has two bookings and three seats. `AS` also names an output expression: the alias `total_seats` can be used in this `ORDER BY`.

Group by both the session ID and title: the ID preserves separate sessions even if titles later repeat, and every selected field outside an aggregate is explicitly grouped. SQLite permits some ungrouped fields, but their values can be ambiguous; use the clear grouping pattern shown here. `GROUP BY` does not guarantee an output order, so the query orders totals descending and uses the ID to resolve ties.

## Filter rows before grouping

A `WHERE` condition placed after the joins and before `GROUP BY` filters individual joined rows. For example, filtering `m.year_group = 1` before grouping restricts the totals to bookings made by Year 1 members. It does not select groups by their calculated total. Filtering a group result requires another clause, which is outside this lesson.

With no matching bookings, this grouped query returns no groups and therefore no rows. A query containing only `COUNT(*)` without `GROUP BY` has different empty-input behaviour; that form is not the grouped report taught here.

## Common mistakes

- **Counting members when the rows represent bookings.** Aisha contributes two rows to the full join. Decide what one joined row represents before choosing an aggregate.
- **Using `COUNT(*)` for reserved seats.** It counts bookings; add `seats` with `SUM` to count reserved seats.
- **Grouping only by a label.** Different sessions could share a title. Keep session identity in the grouping.
- **Expecting a zero row for Drama.** Inner joins retain matches. There is no Drama group in this report.
- **Relying on group order.** `GROUP BY` groups; `ORDER BY` specifies presentation order.

## Practise and revise

Build [a Year 1 booking summary](/exercises/summarise-club-bookings). If totals look too large, revisit the join condition before changing the aggregate. Return to [single-table query tracing](/lessons/select-filter-and-order) or [key relationships](/lessons/relations-and-keys), then use the [topic overview](/topics/relational-databases-and-sql) to choose your next revision step.

## Source and coverage

This original material covers selected SQL statements within outcome 3.3.8, printed page 11 of the [official 2026 syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf). Every displayed SQL block is checked locally with SQLite. Outer joins, group-result filtering, database changes, programming-language integration and NoSQL remain deferred. This is a bounded revision sequence, with independent teacher review pending.
