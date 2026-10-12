"""Execute only repository-authored examples, never learner submissions."""
import json
import re
import subprocess
import sys
from pathlib import Path

def run(code, stdin=""):
    result = subprocess.run([sys.executable, "-I", "-c", code], input=stdin, text=True, capture_output=True, timeout=3, check=True)
    assert result.stderr == "", result.stderr
    return result.stdout

lesson = Path("content/lessons/sequence-and-selection.md").read_text(encoding="utf-8")
assert run(Path("content/examples/branch-preview.py").read_text(encoding="utf-8")) == "Ready\n"
blocks = re.findall(r"```python\n(.*?)```", lesson, re.S)
assert len(blocks) == 2
assert run(blocks[0]) == "60\n"
for score, category in [(0, "Review"), (59, "Review"), (60, "Ready"), (75, "Ready"), (79, "Ready"), (80, "Stretch"), (100, "Stretch")]:
    assert run(blocks[1].replace("score = 75", f"score = {score}")) == f"{category}\nRecorded\n"

exercise = Path("content/exercises/classify-a-score.md").read_text(encoding="utf-8")
metadata = json.loads(exercise.split("---", 2)[1])
model = re.findall(r"```python\n(.*?)```", exercise, re.S)
assert len(model) == 1
for example in metadata["examples"]:
    assert run(model[0], example["input"]) == example["output"]
print(f"Passed 15 authored Python runs on Python {sys.version.split()[0]} (home preview, sequence, branch boundaries, model examples).")
