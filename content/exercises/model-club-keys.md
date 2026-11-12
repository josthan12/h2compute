---
{
  "title": "Model the club's keys",
  "slug": "model-club-keys",
  "topic": "relational-databases-and-sql",
  "summary": "Explain the structure and key rules of a small relational database without writing executable SQL.",
  "syllabus": {
    "year": 2026,
    "outcomes": [
      "3.3.1",
      "3.3.2"
    ]
  },
  "difficulty": "core",
  "estimatedMinutes": 10,
  "prerequisites": [
    "relations-and-keys"
  ],
  "relatedExercises": [],
  "status": "published",
  "reviewedOn": "2026-11-12",
  "reviewer": "Codex: source mapping and SQLite example review; independent teacher review pending",
  "provenance": "Original H2Compute club scenario, explanations, questions and models; no real learner data.",
  "format": "design",
  "lesson": "relations-and-keys",
  "objective": "Identify records and fields and justify primary and foreign keys in the club model",
  "examples": [
    {
      "input": "Member contains (2, Ben, 2) and (5, Ben, 1). Can both records be kept?",
      "output": "Yes. member_id 2 and 5 are distinct primary-key values; member_name may repeat."
    },
    {
      "input": "A proposed Booking has booking_id 107, member_id 99, session_id 10 and seats 1. Member 99 is absent.",
      "output": "Reject the booking: Booking.member_id must reference an existing Member.member_id."
    }
  ],
  "hints": [
    "Separate the identity of a person from the person's name.",
    "Identify the ID that belongs to each table before tracing references.",
    "Follow Booking.member_id to Member.member_id and Booking.session_id to ClubSession.session_id."
  ]
}
---
## Your task

Use the [fixed club dataset](/lessons/relations-and-keys#club-dataset). Write a short design answer on paper; no program or SQL is required.

1. Name the three tables. State how many fields and records Member has, and identify the complete record for member ID 2.
2. Give the chosen primary key of each table and state the two rules its values must satisfy.
3. Give both foreign-key references in Booking, naming the source and target fields. Explain why member ID 1 may appear in two Booking records.
4. Explain why `member_name` is unsuitable as the Member primary key, and why a booking for an absent member must be rejected in this model.

The visible examples are design cases and expected reasoning, not standard input and output for a program. The contract is the supplied schema: all three ID primary keys are unique and present, both Booking references must point to existing records, and names may repeat. This website does not create a database or mark your answer automatically. Compare your explanation with the model after attempting all four parts.

<!-- model -->
## Model explanation

The tables are `Member`, `ClubSession` and `Booking`. Member has three fields (`member_id`, `member_name`, `year_group`) and six records. Its record for ID 2 is `(2, Ben, 2)`; `member_name` alone is a field, and `Ben` alone is one field value.

The chosen primary keys are `Member.member_id`, `ClubSession.session_id` and `Booking.booking_id`. Each primary-key value must be unique within its table and must not be missing. A new Member with ID 2 would violate uniqueness even if its name were different.

The foreign keys are `Booking.member_id` referencing `Member.member_id`, and `Booking.session_id` referencing `ClubSession.session_id`. Booking IDs 101 and 106 are different bookings, both made by Member 1. A repeated foreign key is valid; it references the same existing member rather than creating another Member record.

The two Ben records represent different people with IDs 2 and 5. `member_name` is unsuitable as this table's primary key because names may repeat. Both records can be kept. A proposed booking for Member 99 must be rejected because that member does not exist. Assigning a new booking ID does not repair a broken foreign-key reference.

This answer explains the given key choices. It does not establish that every possible database design must use the same fields. Return to [the lesson](/lessons/relations-and-keys#completion) to mark your local learning step complete.
