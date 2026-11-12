---
{
  "title": "Describe relations and choose keys",
  "slug": "relations-and-keys",
  "topic": "relational-databases-and-sql",
  "summary": "Read related tables, distinguish records from fields, and justify primary and foreign keys.",
  "syllabus": {
    "year": 2026,
    "outcomes": [
      "3.3.1",
      "3.3.2"
    ]
  },
  "difficulty": "core",
  "estimatedMinutes": 16,
  "prerequisites": [
    "Read rows and columns in a table",
    "Recognise that different people can share a name"
  ],
  "relatedExercises": [
    "model-club-keys"
  ],
  "status": "published",
  "reviewedOn": "2026-11-12",
  "reviewer": "Codex: source mapping and SQLite example review; independent teacher review pending",
  "provenance": "Original H2Compute club scenario, explanations, questions and models; no real learner data.",
  "coverageNote": "Table, record and field in a small relational model; primary and foreign keys only. Secondary/composite keys, normalisation and ER diagrams are deferred.",
  "quiz": [
    {
      "id": "identify-a-record",
      "outcomes": [
        "3.3.1"
      ],
      "objective": "Distinguish a complete record from a field",
      "difficulty": "core",
      "estimatedMinutes": 2,
      "prompt": "In Member, which item is one complete record?",
      "answer": 1,
      "options": [
        {
          "text": "The member_name column",
          "explanation": "A column is a field/attribute shared by the records. It is not all the information about one member."
        },
        {
          "text": "The row (2, Ben, 2)",
          "explanation": "The row supplies one value for each Member field: member_id, member_name and year_group. It is one record."
        },
        {
          "text": "The value Ben alone",
          "explanation": "Ben is one field value. It does not include the member ID and year group needed for a complete Member record."
        }
      ]
    },
    {
      "id": "foreign-key-can-repeat",
      "outcomes": [
        "3.3.2"
      ],
      "objective": "Explain different uniqueness requirements for primary and foreign keys",
      "difficulty": "core",
      "estimatedMinutes": 2,
      "prompt": "Member 1 has Booking 101 and Booking 106. Why may member_id = 1 occur in both Booking rows?",
      "answer": 2,
      "options": [
        {
          "text": "A foreign key must always be different in every row",
          "explanation": "Foreign keys may repeat: several bookings can refer to the same member. Uniqueness applies to Booking's chosen primary key, booking_id."
        },
        {
          "text": "The repeated member ID creates a second Member record",
          "explanation": "Both foreign-key values refer to the existing Member record with ID 1. They do not create or copy a Member record."
        },
        {
          "text": "booking_id identifies each booking; member_id references an existing member",
          "explanation": "101 and 106 uniquely identify the bookings. Both are allowed to reference Member 1, representing two bookings by the same person."
        }
      ]
    }
  ]
}
---
## What you will learn

Identify a table, a record and a field, choose a primary key, and explain how a foreign key connects records in different tables. These are the foundations for the next two SQL lessons.

## Read a relation

A relational database represents data using related tables. A **table** describes one kind of thing, such as members. A **record** is one row describing one instance, such as one member. A **field** (attribute) is a named column, such as `year_group`; a cell contains that field's value for a particular record.

The table name and field names describe the structure. The current rows are the data. A different number of rows does not create a different set of fields. In this bounded model, every field has a value; missing values and SQL `NULL` are deferred.

## Club dataset

All three lessons use this invented school-club booking dataset. Each booking reserves one or more seats for a member at a session. One member may book several sessions. Names are fictional.

`Member` has three fields and six records:

```text
member_id | member_name | year_group
1         | Aisha       | 1
2         | Ben         | 2
3         | Chen        | 1
4         | Devi        | 2
5         | Ben         | 1
6         | Farah       | 2
```

`ClubSession` describes the available sessions. `fee` is the fee for one seat, in whole dollars.

```text
session_id | title  | fee
10         | Chess  | 4
20         | Coding | 6
30         | Drama  | 5
```

`Booking` links a member to a session:

```text
booking_id | member_id | session_id | seats
101        | 1         | 10         | 2
102        | 2         | 20         | 1
103        | 3         | 10         | 1
104        | 4         | 20         | 3
105        | 5         | 20         | 2
106        | 1         | 20         | 1
```

## Choose a primary key

A **primary key** is the chosen field, or combination of fields, that uniquely identifies a record. Its value must be unique and must not be missing. This model uses a single ID field in each table: `Member.member_id`, `ClubSession.session_id` and `Booking.booking_id`.

Names are a poor choice here. Members 2 and 5 are both called Ben. A search by name may find both; an ID distinguishes them. A field is not a valid primary key merely because the current sample happens to contain different values: the design must continue to identify records under the stated rules. This lesson uses stable, assigned IDs and does not teach secondary or composite keys.

## Connect records with foreign keys

A **foreign key** is a field, or combination of fields, whose value references a key in another table (or the same table). Here both references target primary keys:

- `Booking.member_id` references `Member.member_id`.
- `Booking.session_id` references `ClubSession.session_id`.

Trace Booking 101. Its `member_id` is 1, so find Member 1: Aisha. Its `session_id` is 10, so find Session 10: Chess. The booking reserves two seats. The ID values connect the records without copying Aisha's name and the session title into each booking.

A foreign key can repeat. Member 1 appears in Bookings 101 and 106 because Aisha booked two sessions. A foreign-key value in this model must reference an existing record: `member_id = 99` would be invalid because Member 99 does not exist. The supplied authored fixture enforces these rules; this website does not run a learner's database.

The relationships permit a member or session to have no booking: Farah and Drama demonstrate this. A table's rows have no guaranteed retrieval order; queries will request an order explicitly in the next lesson.

## Common mistakes

- **Calling a column a record.** `member_name` is a field; `(2, Ben, 2)` is a complete Member record.
- **Treating a name as an identity.** Duplicate names can represent different people. Keep both Bens and use their IDs.
- **Requiring a foreign key to be unique.** Repeated references express several bookings by one member. Each booking still has a unique `booking_id`.
- **Assuming a foreign key creates a record.** A reference to Member 99 does not create Member 99. It violates this model's rule.

## Practise and continue

Explain which records Booking 106 connects, then try [the key-modelling task](/exercises/model-club-keys). Continue to [select, filter and order rows](/lessons/select-filter-and-order). Revisit the [topic overview](/topics/relational-databases-and-sql) for the whole revision path.

## Source and coverage

Mapped to 2026 syllabus 9569 outcomes 3.3.1 and the primary/foreign-key part of 3.3.2, printed page 11 of the [official syllabus](https://isomer-user-content.by.gov.sg/334/cd7aef2f-eef7-4e5a-bebe-2339b214db42/9569_y26_sy.pdf). The explanations and dataset are original. This is partial relational-database coverage; other key types, redundancy, normalisation and ER diagrams remain outside this sequence. Independent teacher review is pending.
