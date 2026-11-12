# Bounded relational-database and SQL content mapping

Date checked: 12 November 2026. This record covers three original lessons, six explanatory checkpoint questions and three offline tasks. It records source/example checks; independent teacher review and independent candidate-agent review remain separate requirements. It does not claim completion of a full database strand or a beta release.

## Verified source and editorial scope

Read printed page 11 (zero-based PDF page 10) of the [official 2026 H2 Computing 9569 syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf), cross-checking the official PDF opened on 12 November and the retained `docs/syllabus-check-11.png`. Retained local PDF SHA-256: `cedeec26d6b4e57191e1db5e2fff9966ce444e115f48f745ecf7f703d25cc62b`.

The verified numeric outcomes are 3.3.1 (table, record and field), 3.3.2 (primary, secondary, composite and foreign keys), and 3.3.8 (SQL statements plus programming-language work with SQL and NoSQL databases). The new sequence teaches primary and foreign keys only within 3.3.2, and a selected read-query subset of 3.3.8. The clause names and lesson slugs are editorial divisions, not official outcome identifiers. All broad database/SQL coverage remains partial. The syllabus specifies SQLite in the practical context on printed pages 4–5.

| Lesson and offline task | Outcomes | Checkpoint outcome subsets | Selected scope |
| --- | --- | --- | --- |
| `relations-and-keys`; `model-club-keys` | 3.3.1, 3.3.2 | `identify-a-record`: 3.3.1; `foreign-key-can-repeat`: 3.3.2 | Table/record/field; chosen primary keys; two foreign-key references; repeated names and references |
| `select-filter-and-order`; `select-club-members` | 3.3.8 | Both questions: 3.3.8 | Single-table SELECT, WHERE, AND and ORDER BY; boundary/no-match results and tie order |
| `joins-and-aggregation`; `summarise-club-bookings` | 3.3.8 | Both questions: 3.3.8 | INNER JOIN, aliases, GROUP BY, COUNT(*) and SUM; pre-group filtering, unmatched rows and tied totals |

3.3.7 is not mapped merely because a club report supplies an application context: comparative applications are not an explicit assessed objective here. Secondary/composite keys, redundancy/dependency, 3NF, ER diagrams, outer joins, HAVING, data changes, programming-language integration and NoSQL are deferred. Missing values are excluded by the supplied schema; the lessons explicitly avoid generalising grouped empty-result behaviour to all aggregate queries.

SQLite details were cross-checked against its official [SELECT reference](https://www.sqlite.org/lang_select.html) and [foreign-key documentation](https://www.sqlite.org/foreignkeys.html) on 12 November. These support explicit result ordering, join/filter/group semantics, the caution about ungrouped selected fields, and enabling foreign-key enforcement with non-null references. They are implementation references, not additional syllabus requirements.

## Learning path and provenance

The path starts with an inspectable six-member club dataset, uses its keys to justify joins, and then distinguishes booking counts from reserved seats. Duplicate Ben names, a member with two bookings, a member with none, an unbooked session and tied Year 1 seat totals are intentional reasoning cases. All names, records, explanations, distractors and tasks were authored for this project. No real learner data, third-party notes, examination questions or external assets are included.

Each lesson links its prerequisite/revision route and one task. Each task links its parent lesson and contains a model after the existing separator. `format: design` explicitly declares the prose key-modelling task; `format: sql` declares both query tasks. Database descriptions occupy visible example inputs; these are not Python stdin examples. `(no rows)` is a human-readable label and never a query-generated record. Models are offline explanations, with no learner SQL runner, server database, account or service added.

## Executable-example contract

`content/examples/club-database.sql` creates a fresh in-memory fixture for each local authored-example check. Python's standard-library `sqlite3` executes only repository-authored SQL. No dependency is added. Maintenance cost is the small fixture, closed expected-result registry and standard-library check script; this adds no hosted usage or paid capability.

`python tests/check_sql_examples.py` checks the exact set of relational lessons/exercises, expected SQL-block counts and every displayed SQL block/model against explicit columns/rows. It checks both visible SQL exercise cases, and mutates fresh fixtures for a duplicate name, a sort tie, no matching Year 1 bookings, equal session titles, an extra legitimate booking, and empty tables. It also verifies the key-model answer's required structure, schema primary/foreign keys, duplicate-name allowance, forbidden duplicate primary IDs and missing references, and positive-seat constraints. This is authored-content verification, not learner-code execution or trusted grading. Exact command results belong in the task verification record after the command is run; this mapping does not invent results.

## Review limits

Metadata dates identify source/example review on 12 November 2026 and disclose that independent teacher review is pending. A separate candidate-bound agent receipt is required before the parent task's completed handoff. Physical-device, screen-reader, provider and public-release evidence are not supplied by these content checks. Existing browser-runner feasibility/activation gates remain unchanged.
