"""Read counters only for explicit CDP process IDs; no process enumeration/mutation."""
import ctypes
from ctypes import wintypes
import json
import sys


class ProcessCounters(ctypes.Structure):
    _fields_ = [("cb", wintypes.DWORD), ("faults", wintypes.DWORD)] + [
        (name, ctypes.c_size_t) for name in (
            "peakWorkingSetBytes", "workingSetBytes", "peakPagedPool", "pagedPool",
            "peakNonPagedPool", "nonPagedPool", "privateBytes", "peakPrivateBytes", "privateUsage")]


class SystemCounters(ctypes.Structure):
    _fields_ = [("length", wintypes.DWORD), ("load", wintypes.DWORD)] + [
        (name, ctypes.c_ulonglong) for name in (
            "totalPhysicalBytes", "availablePhysicalBytes", "totalPageFile", "availablePageFile",
            "totalVirtual", "availableVirtual", "availableExtendedVirtual")]


def validate_ids(values):
    if not isinstance(values, list) or len(values) > 64 or any(
            type(value) is not int or not 0 < value < 2**32 for value in values):
        raise ValueError("Expected at most 64 positive Windows process IDs")
    return list(dict.fromkeys(values))


def main():
    if sys.platform != "win32":
        raise RuntimeError("Windows counters only")
    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
    kernel.OpenProcess.restype = wintypes.HANDLE
    kernel.CloseHandle.argtypes = [wintypes.HANDLE]
    kernel.K32GetProcessMemoryInfo.argtypes = [wintypes.HANDLE, ctypes.POINTER(ProcessCounters), wintypes.DWORD]
    kernel.K32GetProcessMemoryInfo.restype = wintypes.BOOL
    kernel.GlobalMemoryStatusEx.argtypes = [ctypes.POINTER(SystemCounters)]
    kernel.GlobalMemoryStatusEx.restype = wintypes.BOOL
    for line in sys.stdin:
        if len(line) > 4096:
            raise ValueError("Oversized diagnostic input")
        processes = []
        for pid in validate_ids(json.loads(line)):
            handle = kernel.OpenProcess(0x1000, False, pid)  # Query-limited only.
            record = {"pid": pid}
            try:
                counters = ProcessCounters()
                counters.cb = ctypes.sizeof(counters)
                if not handle or not kernel.K32GetProcessMemoryInfo(handle, ctypes.byref(counters), counters.cb):
                    record["queryError"] = ctypes.get_last_error()
                else:
                    for name in ("workingSetBytes", "privateUsage", "peakWorkingSetBytes", "peakPrivateBytes"):
                        record[name] = getattr(counters, name)
            finally:
                if handle:
                    kernel.CloseHandle(handle)
            processes.append(record)
        system = SystemCounters()
        system.length = ctypes.sizeof(system)
        if not kernel.GlobalMemoryStatusEx(ctypes.byref(system)):
            raise ctypes.WinError(ctypes.get_last_error())
        print(json.dumps({"processes": processes, "totalPhysicalBytes": system.totalPhysicalBytes,
                          "availablePhysicalBytes": system.availablePhysicalBytes}), flush=True)


if __name__ == "__main__":
    main()
