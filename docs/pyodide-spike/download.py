"""Download the pinned upstream core; never execute Python submissions here."""
import hashlib
import io
import json
from pathlib import Path
import tarfile
import urllib.request

VERSION = "314.0.7"
ROOT = Path(__file__).resolve().parent
URL = f"https://github.com/pyodide/pyodide/releases/download/{VERSION}/pyodide-core-{VERSION}.tar.bz2"
FILES = {"pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"}

with urllib.request.urlopen(URL, timeout=120) as response:
    archive = response.read(64 * 1024 * 1024 + 1)
if len(archive) > 64 * 1024 * 1024:
    raise ValueError("Core archive exceeds download budget")
if hashlib.sha256(archive).hexdigest() != "2abdcc2e35208af406e07724cffa85bc582ced97e9028383ecf5462541393f95":
    raise ValueError("Pinned archive hash mismatch")
target = ROOT / ".runtime"
target.mkdir(exist_ok=True)
manifest = {"version": VERSION, "archiveURL": URL, "archiveBytes": len(archive), "archiveSHA256": hashlib.sha256(archive).hexdigest(), "files": {}}
with tarfile.open(fileobj=io.BytesIO(archive), mode="r:bz2") as bundle:
    for member in bundle.getmembers():
        name = Path(member.name).name
        if member.isfile() and (name in FILES or "license" in name.lower() or "copying" in name.lower()):
            data = bundle.extractfile(member).read()
            (target / (name + ".bin")).write_bytes(data)
            manifest["files"][name] = {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
if not FILES.issubset(manifest["files"]):
    raise ValueError("Missing core files")
# Preserve upstream MPL text even when absent from the core archive.
with urllib.request.urlopen(f"https://raw.githubusercontent.com/pyodide/pyodide/{VERSION}/LICENSE", timeout=60) as response:
    (ROOT / "PYODIDE-LICENSE.txt").write_bytes(response.read())
with urllib.request.urlopen("https://raw.githubusercontent.com/python/cpython/v3.14.2/LICENSE", timeout=60) as response:
    (ROOT / "CPYTHON-LICENSE.txt").write_bytes(response.read())
(ROOT / "asset-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(json.dumps(manifest, indent=2))
