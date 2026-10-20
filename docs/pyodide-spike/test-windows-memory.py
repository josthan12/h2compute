import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("memory_probe", Path(__file__).with_name("windows-memory.py"))
probe = importlib.util.module_from_spec(spec)
spec.loader.exec_module(probe)


class ProcessScopeTests(unittest.TestCase):
    def test_process_scope_is_bounded_and_deduplicated(self):
        self.assertEqual(probe.validate_ids([12, 12, 42]), [12, 42])
        for values in [None, {}, [True], [0], [-1], [2**32], [1.0], list(range(1, 66))]:
            with self.assertRaises(ValueError):
                probe.validate_ids(values)


if __name__ == "__main__":
    unittest.main()
