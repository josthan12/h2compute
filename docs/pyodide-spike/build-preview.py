"""Build a local static review package; this script cannot deploy anything."""
import hashlib
import html
import json
import re
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parent
sha = lambda data: hashlib.sha256(data).hexdigest()
manifest = json.loads((ROOT / "asset-manifest.json").read_text())
notices = json.loads((ROOT / "notice-manifest.json").read_text())
policy = json.loads((ROOT / "preview-policy.json").read_text())
version = manifest["version"]
assert version == "314.0.7"
assert set(manifest["files"]) == {"pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"}
runtime_path = f"runtime/{version}"
files = {}
mime = {}


def add(path, data, content_type):
    files[path] = data
    mime[path] = content_type


for name, record in manifest["files"].items():
    data = (ROOT / ".runtime" / (name + ".bin")).read_bytes()
    assert len(data) == record["bytes"] and sha(data) == record["sha256"], name
    kind = "text/javascript" if name.endswith(".mjs") else "application/wasm" if name.endswith(".wasm") else "application/json" if name.endswith(".json") else "application/zip"
    add(f"{runtime_path}/{name}", data, kind)
for name in ("index.html", "host.mjs", "frame.html", "worker.mjs"):
    data = (ROOT / name).read_bytes()
    if name == "host.mjs":
        assert data.count(b"'/runtime/'") == 1
        data = data.replace(b"'/runtime/'", f"'/{runtime_path}/'".encode())
    if name == "index.html":
        data = data.replace(b"</html>", b'<p><a href="/notices/index.html">Runtime licences and source availability</a></p></html>')
    add(name, data, "text/javascript" if name.endswith(".mjs") else "text/html")
for name in ("PYODIDE-LICENSE.txt", "CPYTHON-LICENSE.txt", "DISTRIBUTION-NOTICES.md", "asset-manifest.json", "notice-manifest.json"):
    add("notices/" + name, (ROOT / name).read_bytes(), "application/json" if name.endswith(".json") else "text/plain; charset=utf-8")
add("notices/PROJECT-LICENSE.txt", (ROOT.parents[1] / "LICENSE").read_bytes(), "text/plain; charset=utf-8")
links = []
for component, record in notices.items():
    for item in record["notices"]:
        data = (ROOT / "notices" / item["file"]).read_bytes()
        assert len(data) == item["bytes"] and sha(data) == item["sha256"], item["file"]
        add("notices/" + item["file"], data, "text/plain; charset=utf-8")
        links.append(f'<li><a href="{html.escape(item["file"])}">{html.escape(component + ": " + item["upstreamPath"])}</a></li>')
source = (ROOT / ".runtime/pyodide-source.tar.gz.bin").read_bytes()
assert sha(source) == notices["pyodide"]["archiveSHA256"]
add("sources/pyodide-314.0.7.tar.gz", source, "application/gzip")
add("notices/index.html", ('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Runtime notices</title><h1>Runtime notices and source</h1><p>Developer test preview. Learner execution remains disabled.</p><p>Pyodide is governed by MPL-2.0. Obtain its unmodified source, including CPython patches and build recipes, from <a href="/sources/pyodide-314.0.7.tar.gz">this source archive</a>. No charge or authentication is required by this package.</p><p><a href="DISTRIBUTION-NOTICES.md">Component review and source links</a> · <a href="PYODIDE-LICENSE.txt">MPL-2.0</a> · <a href="CPYTHON-LICENSE.txt">CPython licences</a> · <a href="PROJECT-LICENSE.txt">H2Compute MIT licence</a></p><ul>' + "".join(links) + '</ul></html>').encode(), "text/html")
add("robots.txt", b"User-agent: *\nDisallow: /\n", "text/plain")
headers = []
entries = {}
for path, data in files.items():
    values = {
        "Content-Type": mime[path],
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": policy["runtimeCache"] if path.startswith(runtime_path + "/") else policy["otherCache"],
        "Content-Security-Policy": policy["frameCSP"] if path == "frame.html" else policy["hostCSP"],
        "Referrer-Policy": "no-referrer",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
    }
    entries[path] = {"bytes": len(data), "sha256": sha(data), "headers": values}
    headers.append({"source": "/" if path == "index.html" else "/" + path, "headers": [{"key": key, "value": value} for key, value in values.items()]})
    if path == "index.html":
        headers.append({"source": "/index.html", "headers": [{"key": key, "value": value} for key, value in values.items()]})
# Response transforms remove the CDN's default wildcard; an empty header did not.
routes = [{"src": "/.*", "continue": True, "transforms": [{"type": "response.headers", "op": "delete", "target": {"key": "Access-Control-Allow-Origin"}}]}]
routes += [{"src": "^" + re.escape(rule["source"]) + "$", "continue": True, "headers": {h["key"]: h["value"] for h in rule["headers"]}} for rule in headers]
config = {"$schema": "https://openapi.vercel.sh/vercel.json", "framework": None, "buildCommand": "", "installCommand": "", "outputDirectory": "public", "routes": routes}
package = {"runtimeVersion": version, "learnerExecutionEnabled": False, "runtimeBytes": sum(item["bytes"] for item in manifest["files"].values()), "files": entries}
generated = {"public/" + path: data for path, data in files.items()}
generated["vercel.json"] = (json.dumps(config, indent=2) + "\n").encode()
generated["package-manifest.json"] = (json.dumps(package, indent=2) + "\n").encode()
digest = sha(b"".join(path.encode() + bytes.fromhex(sha(data)) for path, data in sorted(generated.items())))
output = ROOT / ".preview" / (version + "-" + digest[:12])
if output.exists():
    existing = {str(p.relative_to(output)).replace("\\", "/"): p.read_bytes() for p in output.rglob("*") if p.is_file()}
    assert existing == generated, "Existing package changed; preserve it and investigate"
else:
    for path, data in generated.items():
        target = output / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
archive = output.parent / (output.name + ".zip")
with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as bundle:
    for path, data in sorted(generated.items()):
        info = zipfile.ZipInfo(path, date_time=(2026, 10, 13, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        bundle.writestr(info, data)
summary = {"directory": str(output), "zip": str(archive), "zipBytes": archive.stat().st_size, "zipSHA256": sha(archive.read_bytes()), "contentSHA256": digest, "publicBytes": sum(map(len, files.values())), "publicFiles": len(files), "runtimeBytes": package["runtimeBytes"]}
(ROOT / "preview-summary.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
print(json.dumps(summary, indent=2))
