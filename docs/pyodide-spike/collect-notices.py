"""Collect upstream notice texts for the pinned, unmodified test runtime.

No dependencies installed. Archives are cached locally, never extracted as code.
Run deliberately when updating runtime versions; review notice inventory changes.
"""
import hashlib
import io
import json
from pathlib import Path
import tarfile
import urllib.request

ROOT = Path(__file__).resolve().parent
SOURCES = {
    "pyodide": "https://codeload.github.com/pyodide/pyodide/tar.gz/refs/tags/314.0.7",
    "cpython": "https://www.python.org/ftp/python/3.14.2/Python-3.14.2.tgz",
    "emscripten": "https://codeload.github.com/emscripten-core/emscripten/tar.gz/refs/tags/5.0.3",
    "libffi": "https://codeload.github.com/libffi/libffi/tar.gz/f08493d249d2067c8b3207ba46693dd858f95db3",
    "hiwire": "https://codeload.github.com/pyodide/hiwire/tar.gz/6a1e67280a15d929ebeceee54a6358c9c8d5f697",
    "xz": "https://codeload.github.com/xz-mirror/xz/tar.gz/refs/tags/v5.2.2",
    "zstd": "https://codeload.github.com/python/cpython-source-deps/tar.gz/refs/tags/zstd-1.5.7",
    "zlib": "https://codeload.github.com/madler/zlib/tar.gz/refs/tags/v1.3.1",
    "bzip2": "https://codeload.github.com/emscripten-ports/bzip2/tar.gz/refs/tags/1.0.6",
    "sqlite": "https://www.sqlite.org/2022/sqlite-autoconf-3390000.tar.gz",
}
inventory = {}
previous = json.loads((ROOT / "notice-manifest.json").read_text()) if (ROOT / "notice-manifest.json").exists() else {}
for component, url in SOURCES.items():
    cached = ROOT / ".runtime" / (component + "-source.tar.gz.bin")
    if not cached.exists():
        with urllib.request.urlopen(url, timeout=60) as response:
            data = response.read(96 * 1024 * 1024 + 1)
        if len(data) > 96 * 1024 * 1024:
            raise ValueError("Source archive exceeds budget")
        if component == "cpython" and hashlib.sha256(data).hexdigest() != "c609e078adab90e2c6bacb6afafacd5eaf60cd94cf670f1e159565725fcd448d":
            raise ValueError("CPython source differs from pinned Pyodide build input")
        cached.write_bytes(data)
    data = cached.read_bytes()
    if component in previous:
        assert hashlib.sha256(data).hexdigest() == previous[component]["archiveSHA256"], "Cached source archive changed"
    records = []
    with tarfile.open(fileobj=io.BytesIO(data), mode="r:gz") as archive:
        for member in archive.getmembers():
            if not member.isfile():
                continue
            path = member.name.split("/", 1)[-1]
            name = Path(path).name.lower()
            # Keep complete upstream texts, including vendor files with inline notices.
            notice = name.startswith(("license", "licence", "copying", "copyright", "notice"))
            vendor = component == "pyodide" and path.startswith("src/js/vendor/")
            if component == "emscripten":
                notice = notice and (path.startswith("system/") or "/" not in path)
                vendor = path.endswith("mini-lz4.js") or path == "AUTHORS"
            if component == "cpython":
                notice = notice and (path.startswith("Modules/") or path.startswith("Doc/") or path == "LICENSE")
                vendor = path in {"Modules/_decimal/libmpdec/mpdecimal.h", "Modules/_hacl/Hacl_Hash_SHA2.h", "Modules/_hacl/include/krml/internal/types.h", "Modules/_blake2/blake2.h", "Python/pyhash.c"}
            if component == "zlib":
                vendor = path == "zlib.h"
            if component == "sqlite":
                vendor = path == "sqlite3.h"
            if not (notice or vendor):
                continue
            if member.size > 2 * 1024 * 1024:
                raise ValueError("Unexpected notice size")
            text = archive.extractfile(member).read()
            output = component + "--" + path.replace("/", "--") + ".txt"
            target = ROOT / "notices" / output
            if target.resolve().parent != (ROOT / "notices").resolve():
                raise ValueError("Upstream notice path outside generated directory")
            target.parent.mkdir(exist_ok=True)
            target.write_bytes(text)
            records.append({"upstreamPath": path, "file": output, "bytes": len(text), "sha256": hashlib.sha256(text).hexdigest()})
    inventory[component] = {"url": url, "archiveBytes": len(data), "archiveSHA256": hashlib.sha256(data).hexdigest(), "notices": records}
    print(component, len(records), "notice/vendor files")
(ROOT / "notice-manifest.json").write_text(json.dumps(inventory, indent=2) + "\n", encoding="utf-8")
retained = {item["file"] for component in inventory.values() for item in component["notices"]}
for component in previous.values():
    for item in component["notices"]:
        if item["file"] not in retained:
            target = (ROOT / "notices" / item["file"]).resolve()
            if target.parent != (ROOT / "notices").resolve():
                raise ValueError("Notice path outside generated directory")
            target.unlink(missing_ok=True)
