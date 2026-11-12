import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("firefox_cache", Path(__file__).with_name("prepare-firefox-cache.py"))
cache = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cache)


class ArchivePinningTests(unittest.TestCase):
    def test_invalid_archive_is_rejected_before_any_cache_is_created(self):
        original = cache.ROOT
        with tempfile.TemporaryDirectory(prefix="firefox-pin-test-", dir=original / ".runtime") as folder:
            temporary = Path(folder)
            self.assertTrue(temporary.resolve().is_relative_to((original / ".runtime").resolve()))
            (temporary / ".runtime").mkdir()
            (temporary / ".runtime/firefox-1555-official.zip").write_bytes(b"invalid browser archive")
            cache.ROOT = temporary
            try:
                with self.assertRaisesRegex(ValueError, "Pinned Firefox ZIP"):
                    cache.prepare()
                self.assertEqual([p.name for p in (temporary / ".runtime").iterdir()], ["firefox-1555-official.zip"])
            finally:
                cache.ROOT = original


if __name__ == "__main__":
    unittest.main()
