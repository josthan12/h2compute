"""Test asset pinning and preservation using disposable copies, never live work."""
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent


class PreviewSafetyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temporary = tempfile.TemporaryDirectory(prefix="preview-test-", dir=ROOT / ".runtime")
        cls.project = Path(cls.temporary.name)
        cls.spike = cls.project / "docs/pyodide-spike"
        cls.spike.mkdir(parents=True)
        shutil.copyfile(ROOT.parents[1] / "LICENSE", cls.project / "LICENSE")
        for name in ("build-preview.py", "asset-manifest.json", "notice-manifest.json", "preview-policy.json", "DISTRIBUTION-NOTICES.md", "PYODIDE-LICENSE.txt", "CPYTHON-LICENSE.txt", "index.html", "host.mjs", "frame.html", "worker.mjs"):
            shutil.copyfile(ROOT / name, cls.spike / name)
        shutil.copytree(ROOT / "notices", cls.spike / "notices")
        (cls.spike / ".runtime").mkdir()
        for name in json.loads((ROOT / "asset-manifest.json").read_text())["files"]:
            shutil.copyfile(ROOT / ".runtime" / (name + ".bin"), cls.spike / ".runtime" / (name + ".bin"))
        shutil.copyfile(ROOT / ".runtime/pyodide-source.tar.gz.bin", cls.spike / ".runtime/pyodide-source.tar.gz.bin")
        baseline = cls.run_builder()
        if baseline.returncode:
            raise RuntimeError(baseline.stderr)

    @classmethod
    def tearDownClass(cls):
        assert cls.project.resolve().is_relative_to((ROOT / ".runtime").resolve())
        cls.temporary.cleanup()

    @classmethod
    def run_builder(cls):
        return subprocess.run([sys.executable, str(cls.spike / "build-preview.py")], capture_output=True, text=True, timeout=60)

    def test_corrupted_core_is_rejected(self):
        asset = self.spike / ".runtime/pyodide.mjs.bin"
        original = asset.read_bytes()
        try:
            asset.write_bytes(original + b"corruption")
            result = self.run_builder()
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("pyodide.mjs", result.stderr)
        finally:
            asset.write_bytes(original)

    def test_changed_output_is_preserved(self):
        summary = json.loads((self.spike / "preview-summary.json").read_text())
        frame = Path(summary["directory"]) / "public/frame.html"
        changed = frame.read_bytes() + b"reviewer's local change"
        frame.write_bytes(changed)
        result = self.run_builder()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Existing package changed", result.stderr)
        self.assertEqual(frame.read_bytes(), changed)


if __name__ == "__main__":
    unittest.main()
