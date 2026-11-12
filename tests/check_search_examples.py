"""Boundary/property checks for repository-authored searches, never learner code.

Run from the repository root: python tests/check_search_examples.py
Only fixed local lesson/model sources are executed, in bounded isolated subprocesses.
The ordinary authored-example checker covers every visible stdin/stdout case too.
"""

import itertools
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

HARNESS = r"""
import contextlib
import io
import json
import sys

class CheckedList(list):
    def __init__(self, items):
        super().__init__(items)
        self.reads = 0

    def __getitem__(self, index):
        assert isinstance(index, int) and 0 <= index < len(self), index
        self.reads += 1
        return super().__getitem__(index)

payload = json.load(sys.stdin)
program = compile(payload["code"], "<repository-authored-search>", "exec")
results = []
for case in payload["cases"]:
    values = CheckedList(case["values"])
    namespace = {"__name__": "__main__", "values": values, "target": case["target"]}
    sys.stdin = io.StringIO(case["stdin"])
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        exec(program, namespace)
    results.append({"output": output.getvalue(), "reads": values.reads})
print(json.dumps(results))
"""


def blocks(source):
    return re.findall(r"```python\n(.*?)```", source, re.S)


def case(values, target, expected=None):
    return {
        "values": list(values),
        "target": target,
        "stdin": "\n".join(map(str, [len(values), *values, target])) + "\n",
        "expected": expected,
    }


def run_batch(code, cases):
    result = subprocess.run(
        [sys.executable, "-I", "-c", HARNESS],
        input=json.dumps({"code": code, "cases": cases}),
        text=True,
        capture_output=True,
        timeout=15,
        check=True,
    )
    assert result.stderr == "", result.stderr
    results = json.loads(result.stdout)
    assert len(results) == len(cases)
    return results


def read_programs(lesson_slug, exercise_slug, block_count):
    lesson = (ROOT / "content" / "lessons" / f"{lesson_slug}.md").read_text(encoding="utf-8")
    lesson_blocks = blocks(lesson)
    assert len(lesson_blocks) == block_count, "New lesson block needs ordinary example coverage"
    search = lesson_blocks[-1]
    lines = search.splitlines()
    assert lines[0].startswith("values = [") and lines[1].startswith("target = ")
    # Vary only the supplied data, preserving the complete authored search body.
    search_body = "\n".join(lines[2:])
    exercise = (ROOT / "content" / "exercises" / f"{exercise_slug}.md").read_text(encoding="utf-8")
    meta = json.loads(exercise.split("---", 2)[1])
    assert meta["format"] == "python"
    models = blocks(exercise.split("<!-- model -->")[1])
    assert len(models) == 1
    return search_body, models[0]


def first_index(values, target):
    try:
        return values.index(target)
    except ValueError:
        return -1


def check_linear(program, cases, instrumented):
    for given, actual in zip(cases, run_batch(program, cases)):
        expected = first_index(given["values"], given["target"])
        assert actual["output"] == f"{expected}\n", (given, actual)
        if instrumented:
            # A first match stops exactly after visiting that position; absence visits all.
            checks = expected + 1 if expected != -1 else len(given["values"])
            assert actual["reads"] == checks, (given, actual)


def check_binary(program, cases, instrumented):
    for given, actual in zip(cases, run_batch(program, cases)):
        values, target = given["values"], given["target"]
        output = actual["output"]
        position = int(output)
        assert output == f"{position}\n", (given, actual)
        if target in values:
            assert 0 <= position < len(values) and values[position] == target, (given, actual)
        else:
            assert position == -1, (given, actual)
        if given["expected"] is not None:
            assert position == given["expected"], (given, actual)
        if instrumented:
            # At most two list reads per midpoint check and at most floor(log2(n))+1
            # checks for non-empty input. Empty input performs no reads.
            assert actual["reads"] <= 2 * len(values).bit_length(), (given, actual)


linear_cases = [
    case(values, target)
    for size in range(5)
    for values in itertools.product((-2, 0, 2), repeat=size)
    for target in range(-3, 4)
]
binary_cases = [
    case(values, target)
    for size in range(7)
    for values in itertools.combinations_with_replacement((-2, 0, 2), size)
    for target in range(-3, 4)
]

# Maximum allowed length, minimum/maximum input values, and both outer bounds.
for values in ([-1000] * 100, list(range(-50, 50)), [1000] * 100):
    for target in (-1000, -51, -50, 0, 49, 50, 1000):
        linear_cases.append(case(values, target))
        binary_cases.append(case(values, target))

# Exact hand-traced duplicate results enforce the stated lower-midpoint contract.
for values, target, expected in [
    ([-2, -2], -2, 0),
    ([0, 0, 0, 0], 0, 1),
    ([-2, 0, 0, 0, 2, 2], 0, 2),
    ([0, 0, 2, 2, 2, 2], 2, 2),
    ([0, 0, 0, 2, 2, 2], 2, 4),
    ([0, 0, 0, 0, 0, 2], 0, 2),
]:
    binary_cases.append(case(values, target, expected))

linear_lesson, linear_model = read_programs("lists-and-linear-search", "find-first-match", 2)
binary_lesson, binary_model = read_programs("binary-search", "binary-search-position", 1)
check_linear(linear_lesson, linear_cases, instrumented=True)
check_linear(linear_model, linear_cases, instrumented=False)
check_binary(binary_lesson, binary_cases, instrumented=True)
check_binary(binary_model, binary_cases, instrumented=False)
print(
    f"Passed {2 * (len(linear_cases) + len(binary_cases))} authored search runs "
    f"on Python {sys.version.split()[0]} "
    f"({len(linear_cases)} linear cases and {len(binary_cases)} binary cases per lesson/model; "
    "empty, singleton, duplicates, absence, endpoint/value/length bounds and search-work limits)."
)
