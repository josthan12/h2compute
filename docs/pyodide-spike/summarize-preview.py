"""Retain a compact reviewed summary without changing the original spike evidence."""
from collections import Counter
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
evidence = json.loads((ROOT / "preview-results.json").read_text(encoding="utf-8"))
package = json.loads((ROOT / "preview-summary.json").read_text(encoding="utf-8"))
assert evidence["testURL"] == "http://127.0.0.1:3191"
assert evidence["runtimePrefix"] == "/runtime/314.0.7/"
authored = [r for r in evidence["runs"] if r["name"].startswith("authored ")]
assert len(authored) == 40 and all(r["state"] == "completed" for r in authored)
assert evidence["runs"][-1]["name"] == "cold loading"
assert evidence["runs"][-1]["stdout"] == "throttled\n"
summary = {
    "date": evidence["date"], "environment": evidence["environment"],
    "browser": evidence["browser"], "testURL": evidence["testURL"],
    "packageContentSHA256": package["contentSHA256"],
    "zipSHA256": package["zipSHA256"],
    "records": len(evidence["runs"]), "exactAuthoredComparisons": len(authored),
    "outcomes": dict(Counter(r["state"] for r in evidence["runs"] if "state" in r)),
    "checks": [{k: r[k] for k in ("mode", "name", "state", "loadMs", "totalMs") if k in r} for r in evidence["runs"]],
    "limits": ["Local Chromium and mobile emulation only", "No deployed or physical-device result", "No strict memory quota or memory-exhaustion result"],
}
(ROOT / "preview-evidence-summary.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
print(f'{summary["records"]} evidence records; {len(authored)} exact authored comparisons; Chromium {summary["browser"]}.')
