"""Verify repository-authored relational/SQL content; never learner submissions.

Run from the repository root with Python's standard-library SQLite. Each check
uses a fresh in-memory database. Explicit registries prevent silently untested
new SQL blocks, models, topics, or visible fixture descriptions.
"""
import json
import re
import sqlite3
import sys
from contextlib import closing
from pathlib import Path


TOPIC = "relational-databases-and-sql"
LESSONS = {
    "relations-and-keys": [],
    "select-filter-and-order": [
        (
            ("member_id", "member_name"),
            [(1, "Aisha"), (2, "Ben"), (5, "Ben"), (3, "Chen"), (4, "Devi"), (6, "Farah")],
        ),
        (("member_id", "member_name"), [(5, "Ben"), (3, "Chen")]),
    ],
    "joins-and-aggregation": [
        (
            ("member_id", "member_name", "title", "seats"),
            [(1, "Aisha", "Chess", 2), (2, "Ben", "Coding", 1),
             (3, "Chen", "Chess", 1), (4, "Devi", "Coding", 3),
             (5, "Ben", "Coding", 2), (1, "Aisha", "Coding", 1)],
        ),
        (
            ("session_id", "title", "booking_count", "total_seats"),
            [(20, "Coding", 4, 7), (10, "Chess", 2, 3)],
        ),
    ],
}
EXERCISES = {
    "model-club-keys": ("design", "relations-and-keys"),
    "select-club-members": ("sql", "select-filter-and-order"),
    "summarise-club-bookings": ("sql", "joins-and-aggregation"),
}
FULL_INPUT = "Use the fixed club dataset from the relations-and-keys lesson."
EMPTY_INPUT = "Use the same club schema with no records in Member, ClubSession or Booking."
FIXTURE = Path("content/examples/club-database.sql").read_text(encoding="utf-8")
runs = 0
constraints = 0


def content(kind):
    result = {}
    for file in sorted(Path("content", kind).glob("*.md")):
        source = file.read_text(encoding="utf-8")
        match = re.fullmatch(r"---\n(.*?)\n---\n(.*)", source, re.S)
        assert match, f"Invalid frontmatter: {file}"
        meta = json.loads(match[1])
        body = match[2]
        sql = blocks(body)
        if meta["topic"] != TOPIC:
            assert not sql, f"SQL outside the closed SQL check registry: {file}"
            assert meta.get("format") not in {"sql", "design"}, f"Unregistered exercise format: {file}"
            continue
        assert file.stem == meta["slug"], file
        assert file.stem not in result, f"Duplicate SQL-content ID: {file}"
        # All executable snippets in this topic must be SQL. Text result blocks
        # are explanatory output, and the design answer intentionally has none.
        fences = re.findall(r"^```([^\n`]*)\n", body, re.M)
        assert len(fences) % 2 == 0 and all(fence == "" for fence in fences[1::2]), file
        languages = fences[::2]
        assert all(language in {"sql", "text"} for language in languages), (file, languages)
        result[file.stem] = (meta, body)
    return result


def blocks(source):
    return re.findall(r"^```sql\n(.*?)^```[ \t]*$", source, re.M | re.S)


def displayed(source):
    tables = re.findall(r"^```text\n(.*?)^```[ \t]*$", source, re.M | re.S)
    return ["\n".join(" | ".join(cell.strip() for cell in line.split("|"))
                      for line in table.strip().splitlines()) for table in tables]


def database(edits=()):
    conn = sqlite3.connect(":memory:")
    try:
        conn.executescript(FIXTURE)
        assert conn.execute("PRAGMA foreign_keys").fetchone() == (1,)
        assert conn.execute("PRAGMA foreign_key_check").fetchall() == []
        for sql in edits:
            conn.execute(sql)
        conn.commit()
        return conn
    except BaseException:
        conn.close()
        raise


def query(conn, sql):
    global runs
    assert re.match(r"\s*SELECT\b", sql, re.I), "Authored examples must be read queries"
    conn.execute("PRAGMA query_only = ON")
    # Protect the local authored-content check from an accidental runaway query.
    # This is not a learner SQL runner or a browser sandbox.
    conn.set_progress_handler(lambda: 1, 100_000)
    try:
        cursor = conn.execute(sql)  # rejects multiple statements
        assert cursor.description, sql
        rows = cursor.fetchmany(1001)
        assert len(rows) <= 1000, "Authored example result exceeds its bound"
        runs += 1
        return tuple(column[0] for column in cursor.description), rows
    finally:
        conn.set_progress_handler(None, 0)


def check(sql, expected, edits=()):
    with closing(database(edits)) as conn:
        actual = query(conn, sql)
        assert actual == expected, (sql, expected, actual)


def visible(result):
    columns, rows = result
    lines = [" | ".join(columns)]
    lines.extend(" | ".join(str(value) for value in row) for row in rows)
    if not rows:
        lines.append("(no rows)")
    return "\n".join(lines)


def reject(sql):
    global constraints
    with closing(database()) as conn:
        try:
            conn.execute(sql)
        except sqlite3.IntegrityError:
            constraints += 1
        else:
            raise AssertionError(f"Expected a fixture constraint failure: {sql}")


lessons = content("lessons")
exercises = content("exercises")
assert set(lessons) == set(LESSONS), "Register every relational lesson explicitly"
assert set(exercises) == set(EXERCISES), "Register every SQL/design task explicitly"

for slug, expected in LESSONS.items():
    sql = blocks(lessons[slug][1])
    assert len(sql) == len(expected), f"Untested/missing SQL block in {slug}"
    for statement, result in zip(sql, expected):
        check(statement, result)
    if expected:
        assert displayed(lessons[slug][1]) == [visible(result) for result in expected], f"Displayed SQL result drifted: {slug}"

# The three tables shown before SQL instruction must match the executable
# fixture too; otherwise later correct queries could teach from different data.
with closing(database()) as conn:
    dataset = [query(conn, f"SELECT * FROM {table} ORDER BY {key}") for table, key in (
        ("Member", "member_id"), ("ClubSession", "session_id"), ("Booking", "booking_id"),
    )]
    assert displayed(lessons["relations-and-keys"][1]) == [visible(result) for result in dataset], "Displayed club dataset drifted from fixture"

models = {}
for slug, (format_, parent) in EXERCISES.items():
    meta, body = exercises[slug]
    assert meta["format"] == format_ and meta["lesson"] == parent, slug
    parts = body.split("<!-- model -->")
    assert len(parts) == 2 and all(part.strip() for part in parts), slug
    prompt, model = parts
    assert not blocks(prompt), f"Add explicit prompt-SQL checks: {slug}"
    if format_ == "design":
        assert not blocks(model), "The declared key-design model is a prose answer"
        assert meta["syllabus"]["outcomes"] == ["3.3.1", "3.3.2"], slug
        required = (
            "`Member`", "`ClubSession`", "`Booking`", "three fields", "six records",
            "`(2, Ben, 2)`", "`Member.member_id`", "`ClubSession.session_id`",
            "`Booking.booking_id`", "unique", "must not be missing",
            "`Booking.member_id` referencing `Member.member_id`",
            "`Booking.session_id` referencing `ClubSession.session_id`",
            "repeated foreign key is valid", "names may repeat", "Member 99 must be rejected",
        )
        for phrase in required:
            assert phrase in model, (slug, "Missing key-design reasoning", phrase)
        assert meta["examples"] == [
            {"input": "Member contains (2, Ben, 2) and (5, Ben, 1). Can both records be kept?",
             "output": "Yes. member_id 2 and 5 are distinct primary-key values; member_name may repeat."},
            {"input": "A proposed Booking has booking_id 107, member_id 99, session_id 10 and seats 1. Member 99 is absent.",
             "output": "Reject the booking: Booking.member_id must reference an existing Member.member_id."},
        ], "Check each design example against the fixture contract when editing"
        continue
    sql = blocks(model)
    assert len(sql) == 1, f"Each SQL task has exactly one checked model: {slug}"
    assert meta["syllabus"]["outcomes"] == ["3.3.8"], slug
    assert [example["input"] for example in meta["examples"]] == [FULL_INPUT, EMPTY_INPUT], slug
    models[slug] = sql[0]
    for example in meta["examples"]:
        edits = () if example["input"] == FULL_INPUT else (
            "DELETE FROM Booking", "DELETE FROM Member", "DELETE FROM ClubSession",
        )
        with closing(database(edits)) as conn:
            assert visible(query(conn, sql[0])) == example["output"], (slug, example)

# Independently check the stated schema/key design, not just prose strings.
with closing(database()) as conn:
    for table, primary, field_count, row_count in [
        ("Member", "member_id", 3, 6), ("ClubSession", "session_id", 3, 3),
        ("Booking", "booking_id", 4, 6),
    ]:
        info = conn.execute(f"PRAGMA table_info({table})").fetchall()
        assert len(info) == field_count
        assert [(row[1], row[5]) for row in info if row[5]] == [(primary, 1)]
        assert all(row[3] == 1 for row in info), f"Unexpected nullable field in {table}"
        assert conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone() == (row_count,)
    assert conn.execute("SELECT * FROM Member WHERE member_id = 2").fetchone() == (2, "Ben", 2)
    assert conn.execute("SELECT member_id FROM Member WHERE member_name = 'Ben' ORDER BY member_id").fetchall() == [(2,), (5,)]
    assert conn.execute("SELECT booking_id FROM Booking WHERE member_id = 1 ORDER BY booking_id").fetchall() == [(101,), (106,)]
    references = {(row[3], row[2], row[4]) for row in conn.execute("PRAGMA foreign_key_list(Booking)")}
    assert references == {("member_id", "Member", "member_id"), ("session_id", "ClubSession", "session_id")}
    assert conn.execute("SELECT COUNT(*) FROM Member WHERE member_id = 99").fetchone() == (0,)

for statement in [
    "INSERT INTO Member VALUES (2, 'Other', 1)",
    "INSERT INTO ClubSession VALUES (10, 'Other', 1)",
    "INSERT INTO Booking VALUES (101, 1, 10, 1)",
    "INSERT INTO Booking VALUES (107, 99, 10, 1)",
    "INSERT INTO Booking VALUES (107, 1, 99, 1)",
    "INSERT INTO Booking VALUES (107, NULL, 10, 1)",
    "INSERT INTO Member VALUES (7, NULL, 1)",
    "INSERT INTO Booking VALUES (107, 1, 10, 0)",
]:
    reject(statement)

member_model = models["select-club-members"]
group_model = models["summarise-club-bookings"]
member_columns = ("member_id", "member_name")
group_columns = ("session_id", "title", "booking_count", "total_seats")

# Duplicate names must remain separate and the ID must break their sort tie.
check(member_model, (member_columns, [(2, "Ben"), (7, "Ben"), (4, "Devi"), (6, "Farah")]),
      ["INSERT INTO Member VALUES (7, 'Ben', 2)"])
# No matching rows in a non-empty table is different from a broken/empty schema.
check(member_model, (member_columns, []), ["UPDATE Member SET year_group = 1"])
check(group_model, (group_columns, []), ["DELETE FROM Booking WHERE member_id IN (1, 3, 5)"])
# A duplicate session title must not merge different session identities.
check(group_model, (group_columns, [(10, "Chess", 2, 3), (20, "Coding", 2, 3), (40, "Coding", 1, 3)]),
      ["INSERT INTO ClubSession VALUES (40, 'Coding', 1)",
       "INSERT INTO Booking VALUES (107, 3, 40, 3)"])
# An additional legitimate booking changes both row count and seat sum.
check(group_model, (group_columns, [(10, "Chess", 3, 4), (20, "Coding", 2, 3)]),
      ["INSERT INTO Booking VALUES (107, 1, 10, 1)"])
# IDs tied on the first ORDER BY expression still follow the second expression.
check(blocks(lessons["select-filter-and-order"][1])[0],
      (member_columns, [(1, "Aisha"), (2, "Ben"), (5, "Ben"), (7, "Ben"), (3, "Chen"), (4, "Devi"), (6, "Farah")]),
      ["INSERT INTO Member VALUES (7, 'Ben', 1)"])
# All displayed grouped/inner-join examples also cope with zero source rows.
for statement in blocks(lessons["joins-and-aggregation"][1]):
    with closing(database(["DELETE FROM Booking"])) as conn:
        assert query(conn, statement)[1] == []

print(f"Passed {runs} authored SQL queries, {constraints} rejected constraint cases and the key-design contract on Python {sys.version.split()[0]} / SQLite {sqlite3.sqlite_version} (all SQL lesson/model blocks, visible full/empty cases, no-match, duplicate names/titles and tie ordering).")
