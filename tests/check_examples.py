"""Execute repository-authored examples and models, never learner submissions."""
import json
import re
import subprocess
import sys
from pathlib import Path

runs = 0

def run(code, stdin=""):
    global runs
    result = subprocess.run([sys.executable, "-I", "-c", code], input=stdin, text=True, capture_output=True, timeout=3, check=True)
    assert result.stderr == "", result.stderr
    runs += 1
    return result.stdout

def code_blocks(source):
    return re.findall(r"```python\n(.*?)```", source, re.S)

expected = {
    "sequence-and-selection": ["60\n", "Ready\nRecorded\n"],
    "counted-and-conditional-loops": ["6\n", "3\n6\n9\n12\n", "10\n"],
    "combined-flow-and-tracing": ["2\n244\n"],
}
lesson_blocks = {}
for file in sorted(Path("content/lessons").glob("*.md")):
    source = file.read_text(encoding="utf-8")
    blocks = code_blocks(source)
    assert file.stem in expected, f"Add expected traces for {file}"
    assert len(blocks) == len(expected[file.stem]), f"Untested example in {file}"
    for code, output in zip(blocks, expected[file.stem]):
        assert run(code) == output, file
    lesson_blocks[file.stem] = blocks

branch = lesson_blocks["sequence-and-selection"][1]
for score, category in [(0,"Review"),(59,"Review"),(60,"Ready"),(79,"Ready"),(80,"Stretch"),(100,"Stretch")]:
    assert run(branch.replace("score = 75", f"score = {score}")) == f"{category}\nRecorded\n"
loops = lesson_blocks["counted-and-conditional-loops"]
assert run(loops[0].replace("range(1, 4)", "range(1, 1)")) == "0\n"
assert run(loops[0].replace("range(1, 4)", "range(1, 2)")) == "1\n"
assert run(loops[1].replace("total = 0", "total = 10")) == ""
assert run(loops[1].replace("total = 0", "total = 9")) == "12\n"
combined = lesson_blocks["combined-flow-and-tracing"][0]
for values, count, total in [( [],0,0),([60,60],2,120),([59],0,59),([60],1,60),([0,100],1,100)]:
    code = combined.replace("scores = [60, 45, 80, 59]", f"scores = {values}")
    assert run(code) == f"{count}\n{total}\n"

assert run(Path("content/examples/branch-preview.py").read_text(encoding="utf-8")) == "Ready\n"
for file in sorted(Path("content/exercises").glob("*.md")):
    source = file.read_text(encoding="utf-8")
    metadata = json.loads(source.split("---", 2)[1])
    prompt, model = source.split("<!-- model -->")
    assert not code_blocks(prompt), f"Add prompt-example tests for {file}"
    blocks = code_blocks(model)
    assert blocks, f"Missing model program: {file}"
    for code in blocks:
        for example in metadata["examples"]:
            actual = run(code, example["input"])
            assert actual == example["output"], (file, example, actual)
print(f"Passed {runs} authored Python runs on Python {sys.version.split()[0]} (all lesson/model blocks, loop boundaries, empty/repeated scores and visible cases).")
