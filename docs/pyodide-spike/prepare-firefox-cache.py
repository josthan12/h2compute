"""Extract pinned Firefox to a new private cache; never modify the installed cache."""
import hashlib
import json
import os
from pathlib import Path
import uuid
import zipfile

ROOT = Path(__file__).resolve().parent
ARCHIVE_SHA256 = "410e14bca6099c089c2092df67803320aab70433a754aae356c4c2e990cf6b77"


def prepare():
    archive = ROOT / ".runtime/firefox-1555-official.zip"
    if hashlib.sha256(archive.read_bytes()).hexdigest() != ARCHIVE_SHA256:
        raise ValueError("Pinned Firefox ZIP does not match the reviewed archive")
    package = json.loads((ROOT.parents[1] / "node_modules/playwright-core/browsers.json").read_text(encoding="utf-8"))
    firefox = next(b for b in package["browsers"] if b["name"] == "firefox")
    assert str(firefox["revision"]) == "1555" and firefox["browserVersion"] == "157.0"
    helper = Path(os.environ["LOCALAPPDATA"]) / "ms-playwright/winldd-1007/PrintDeps.exe"
    helper_bytes = helper.read_bytes()
    cache = ROOT / ".runtime" / ("firefox-cache-" + uuid.uuid4().hex)
    destination = cache / "firefox-1555"
    files = {}
    with zipfile.ZipFile(archive) as bundle:
        assert sum(i.file_size for i in bundle.infolist()) < 512 * 1024**2
        for item in bundle.infolist():
            target = (destination / item.filename).resolve()
            assert target.is_relative_to(destination.resolve()) and item.filename.startswith("firefox/")
            assert not (item.external_attr >> 16) & 0o170000 == 0o120000, "No symlink entries"
            if item.is_dir():
                continue
            data = bundle.read(item)
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open("xb") as output:
                output.write(data)
            files[item.filename] = hashlib.sha256(data).hexdigest()
    helper_target = cache / "winldd-1007/PrintDeps.exe"
    helper_target.parent.mkdir(parents=True)
    with helper_target.open("xb") as output:
        output.write(helper_bytes)
    record = {"cache": str(cache), "executable": str(destination / "firefox/firefox.exe"),
              "archiveSHA256": ARCHIVE_SHA256, "browserVersion": "157.0", "revision": "1555",
              "helperSHA256": hashlib.sha256(helper_bytes).hexdigest(), "files": files,
              "installedCacheModified": False, "networkAccess": False}
    with (cache / "provenance.json").open("x", encoding="utf-8") as output:
        output.write(json.dumps(record, indent=2) + "\n")
    return record


if __name__ == "__main__":
    print(json.dumps(prepare(), indent=2))
