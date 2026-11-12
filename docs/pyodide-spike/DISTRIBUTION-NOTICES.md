# Pinned runtime distribution notices

Reviewed 13 October 2026 for the developer-only Pyodide 314.0.7 core preview.
The five runtime assets are redistributed byte-for-byte; no runtime code was
modified by H2Compute. The learner application does not include this runtime.
This review packages notices for local inspection; it does not authorize release
or certify the upstream binary's complete dependency provenance.

## Source availability and licence texts

Pyodide is governed by [MPL-2.0](PYODIDE-LICENSE.txt), including its executable
distribution/source-availability requirements. The preview includes a copy of
the unmodified [314.0.7 source](https://github.com/pyodide/pyodide/tree/314.0.7)
at `/sources/pyodide-314.0.7.tar.gz`. Its build scripts and CPython patches are
included. The preview notice page directly links both source and MPL text;
retain those links and downloads on any authorized distribution. H2Compute
does not restrict recipients' upstream licence rights. CPython 3.14.2 retains
the [combined licence text](CPYTHON-LICENSE.txt) and the additional notices in
its source/documentation. The project MIT licence does not replace these terms.

The [notice manifest](notice-manifest.json) records source archive URLs, observed
SHA-256 hashes, original paths and hashes for each copied text. CPython's source
archive also matches the hash in Pyodide's pinned build configuration. Other
source hashes are observed download pins, not authenticated release signatures.
`collect-notices.py` downloads inert archives and copies complete upstream
notice files and selected vendor/source files containing inline notices.
It installs and executes no upstream code.

## Components reviewed

Versions/commits and linkage come from the tagged
[Pyodide build settings](https://github.com/pyodide/pyodide/blob/314.0.7/Makefile.envs),
[CPython recipe](https://github.com/pyodide/pyodide/blob/314.0.7/cpython/Makefile),
and Emscripten 5.0.3 port recipes, rather than the optional-package lockfile alone.

| Component | Reviewed source | Retained terms/notices |
| --- | --- | --- |
| Pyodide | 314.0.7 | MPL-2.0; full source archive, including patches/build recipes. |
| CPython | 3.14.2 | PSF/Python historical licences and Doc/license.rst's additional acknowledgements. |
| Vendored stackframe/error-stack-parser | Pyodide src/js/vendor | MIT notice and complete vendored files. |
| Emscripten generated glue | 5.0.3 | MIT/NCSA and Node portions; AUTHORS. |
| C/C++ support libraries | Emscripten system directory | musl MIT, compiler-rt/libc++/libc++abi/libunwind/LLVM-libc Apache-2.0 with LLVM exceptions; mimalloc MIT; SDL notice conservatively retained. |
| mini-lz4 | Emscripten third_party/mini-lz4.js | Complete upstream file with inline licence. |
| libffi | f08493d249d2067c8b3207ba46693dd858f95db3 | MIT-style runtime licence; build-tools terms retained separately. |
| hiwire | 6a1e67280a15d929ebeceee54a6358c9c8d5f697 | MIT. |
| liblzma/XZ | 5.2.2 | COPYING explains public-domain/liblzma parts and LGPL parts; GPL command/build-tool texts retained conservatively. |
| Zstandard | cpython-source-deps zstd-1.5.7 | BSD/GPL alternative texts and build notice; retain BSD option for runtime distribution. |
| zlib | 1.3.1, Emscripten port | zlib licence, including header notice. |
| bzip2 | 1.0.6, Emscripten port | Upstream LICENSE. |
| SQLite | 3.39.0 (3390000), Pyodide recipe | Public-domain declaration in sqlite3.h; accompanying source licence file. |
| CPython bundled Expat, mpdecimal, HACL/KreMLin, hashing code | CPython 3.14.2 sources | Expat COPYING, complete selected headers/pyhash.c containing notices and additional documentation acknowledgements. |

Some retained texts cover build tools or optional upstream paths and do not imply
that those components are included in the five shipped assets. No optional
Pyodide package wheels, ws Node package, compiler/tool executable or GPL command
line XZ tool is packaged. Runtime package installation remains denied by CSP.
`pyodide-lock.json` lists upstream optional packages; it is not proof they shipped.

## Maintenance and release review

Review upstream source changes and notice inventory on every runtime update.
Keep notice/source files available independently of execution and preserve
original notices in modules. Generated asset paths are versioned; never replace
bytes under an immutable URL without changing its version/path. Before public
distribution, review this concrete inventory and any upstream binary/provenance
uncertainty, verify notice/source accessibility on the real host, and obtain
owner publication authorization. Nothing here changes the activation gate.
