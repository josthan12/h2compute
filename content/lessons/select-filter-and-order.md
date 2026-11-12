---
{
  "title": "Select, filter and order rows",
  "slug": "select-filter-and-order",
  "topic": "relational-databases-and-sql",
  "summary": "Write a precise SELECT query, filter records with WHERE, and make result ordering explicit.",
  "syllabus": {
    "year": 2026,
    "outcomes": [
      "3.3.8"
    ]
  },
  "difficulty": "core",
  "estimatedMinutes": 18,
  "prerequisites": [
    "Identify records and fields in the relations-and-keys lesson",
    "Compare integers using =, >= and <"
  ],
  "relatedExercises": [
    "select-club-members"
  ],
  "status": "published",
  "reviewedOn": "2026-11-12",
  "reviewer": "Codex: source mapping and SQLite example review; independent teacher review pending",
  "provenance": "Original H2Compute club scenario, explanations, questions and models; no real learner data.",
  "coverageNote": "SQLite-compatible SELECT, WHERE, AND and ORDER BY on one table. Only part of 3.3.8: database updates, programming-language integration and NoSQL are deferred.",
  "quiz": [
    {
      "id": "filter-includes-boundary",
      "outcomes": [
        "3.3.8"
      ],
      "objective": "Trace a WHERE condition including its boundary",
      "difficulty": "core",
      "estimatedMinutes": 2,
      "prompt": "For WHERE year_group = 1 AND member_id >= 3, which Member IDs remain before ordering?",
      "answer": 0,
      "options": [
        {
          "text": "3 and 5",
          "explanation": "Both rows have year_group 1 and an ID at least 3. The >= comparison includes the boundary ID 3."
        },
        {
          "text": "1, 3 and 5",
          "explanation": "These are all Year 1 members, but ID 1 fails member_id >= 3. AND requires both conditions to be true."
        },
        {
          "text": "5 only",
          "explanation": "ID 3 meets >= 3 exactly. Excluding it would match > 3 instead."
        }
      ]
    },
    {
      "id": "order-tied-names",
      "outcomes": [
        "3.3.8"
      ],
      "objective": "Specify a deterministic order when sort values tie",
      "difficulty": "core",
      "estimatedMinutes": 2,
      "prompt": "A report must sort all members by name ascending and put the smaller ID first when names tie. Which clause states the complete rule?",
      "answer": 1,
      "options": [
        {
          "text": "ORDER BY member_name ASC",
          "explanation": "This sorts by name but leaves the relative order of the two Ben rows unspecified."
        },
        {
          "text": "ORDER BY member_name ASC, member_id ASC",
          "explanation": "SQL sorts by the first expression, then uses the second to break ties. The unique IDs finish the ordering."
        },
        {
          "text": "ORDER BY member_id ASC, member_name ASC",
          "explanation": "The ID would be the first sort priority. That produces ID order, rather than the requested name order."
        }
      ]
    }
  ]
}
---
## What you will learn

Choose output fields with `SELECT`, retain rows with `WHERE`, combine conditions with `AND`, and sort results with `ORDER BY`. Use the [club dataset and key definitions](/lessons/relations-and-keys#club-dataset) from the previous lesson. Read those six Member rows before tracing a query.

## Choose columns and a source

SQL describes the result wanted from a database. `SELECT` names the output expressions and `FROM` names the source table. The following SQLite-compatible query returns two columns, in the written column order:

```sql
SELECT member_id, member_name
FROM Member
ORDER BY member_name ASC, member_id ASC;
```

The result is:

```text
member_id | member_name
1         | Aisha
2         | Ben
5         | Ben
3         | Chen
4         | Devi
6         | Farah
```

`ASC` requests ascending order. The database sorts names first, then IDs for tied names. Both Ben records remain: selecting rows does not merge different people. If a query selected only `member_name`, it would still return two Ben values unless duplicate elimination were explicitly requested. We keep the IDs to preserve the distinction.

Never infer result order from the order in which records were inserted or displayed in a lesson. A query without `ORDER BY` does not promise a particular row order. `DESC` requests descending order for the expression immediately before it; give the direction for each sort expression when clarity matters.

## Filter before sorting

`WHERE` keeps rows whose condition is true. SQL uses `=` for equality and `<>` for inequality; `>=` includes the boundary. `AND` requires both conditions to be true. Text literals use single quotes, such as `'Ben'`; field names are not string literals.

```sql
SELECT member_id, member_name
FROM Member
WHERE year_group = 1 AND member_id >= 3
ORDER BY member_name ASC, member_id ASC;
```

Trace the query as a reasoning sequence: start with Member rows, test the condition on each row, keep the requested fields, then order the result. This describes the query's meaning, not a promise about the database engine's internal execution plan.

1. IDs 1, 3 and 5 have `year_group = 1`.
2. ID 1 fails `member_id >= 3`; IDs 3 and 5 pass.
3. Return their IDs and names. A field used for filtering need not appear in the output.
4. Sort Ben before Chen.

```text
member_id | member_name
5         | Ben
3         | Chen
```

If no row satisfies a filter, the result has zero rows. It does not contain a record saying `None`, and it does not contain one row of zeros. Our visible self-checks label this as `(no rows)` for readers; that label is not a value returned by SQL.

## Common mistakes

- **Putting `WHERE` after `ORDER BY`.** Use the clause order shown: `SELECT`, `FROM`, `WHERE`, `ORDER BY`.
- **Using `==` because Python does.** Use standard SQL `=` in these queries.
- **Quoting a field as a string.** `'year_group'` is literal text, whereas `year_group` refers to the field in this schema.
- **Assuming output is unique or ordered automatically.** Two Ben values can be returned; tied names need an explicit ID sort when the report requires it.
- **Confusing fields with records.** `SELECT` chooses output columns; `WHERE` chooses which source rows contribute.

## Practise and continue

Try [the member-report task](/exercises/select-club-members) on paper or in your own local SQLite tool. This website offers explanations and local completion marks; it does not run SQL. Then learn to [join tables and summarise groups](/lessons/joins-and-aggregation). Revisit [primary and foreign keys](/lessons/relations-and-keys) when a table relationship is unclear.

## Source and coverage

This original lesson teaches a selected SQL-statement part of outcome 3.3.8, printed page 11 of the [official 2026 syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf). Clause-level lesson names are editorial divisions, not extra official outcome numbers. All displayed SQL blocks are checked locally against the fixed dataset. Data changes, language integration, NoSQL and other SQL features remain uncovered; independent teacher review is pending.
