"""Prepare the dated local candidate without replacing historical evidence."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import uuid

root = Path(__file__).resolve().parent
copy = root / '.runtime' / ('stdlib-package-' + uuid.uuid4().hex)
spike = copy / 'docs/pyodide-spike'
spike.mkdir(parents=True)
shutil.copyfile(root.parents[1] / 'LICENSE', copy / 'LICENSE')
for name in ['build-preview.py', 'asset-manifest.json', 'notice-manifest.json', 'preview-policy.json', 'DISTRIBUTION-NOTICES.md', 'PYODIDE-LICENSE.txt', 'CPYTHON-LICENSE.txt', 'index.html', 'host.mjs', 'frame.html', 'worker.mjs']:
    shutil.copyfile(root / name, spike / name)
shutil.copytree(root / 'notices', spike / 'notices')
(spike / '.runtime').mkdir()
for name in list(json.loads((root / 'asset-manifest.json').read_text())['files']) + ['pyodide-source.tar.gz']:
    shutil.copyfile(root / '.runtime' / (name + '.bin'), spike / '.runtime' / (name + '.bin'))
result = subprocess.run([sys.executable, str(spike / 'build-preview.py')], capture_output=True, text=True, encoding='utf-8', timeout=60)
assert result.returncode == 0, result.stderr
summary = json.loads(result.stdout)
baseline = json.loads((root / 'preview-summary.json').read_text())
old, new = Path(baseline['directory']), Path(summary['directory'])
old_files = {p.relative_to(old).as_posix(): p.read_bytes() for p in old.rglob('*') if p.is_file()}
new_files = {p.relative_to(new).as_posix(): p.read_bytes() for p in new.rglob('*') if p.is_file()}
assert old_files.keys() == new_files.keys()
changed = [name for name in old_files if old_files[name] != new_files[name]]
assert set(changed) == {'public/worker.mjs', 'package-manifest.json'}, changed
old_manifest = json.loads(old_files['package-manifest.json'])
new_manifest = json.loads(new_files['package-manifest.json'])
assert old_manifest['files']['worker.mjs']['headers'] == new_manifest['files']['worker.mjs']['headers']
destination = root / '.preview' / new.name
assert not destination.exists(), 'Preserve any previous generated candidate'
shutil.copytree(new, destination)
archive = destination.parent / (destination.name + '.zip')
with archive.open('xb') as target:
    target.write(Path(summary['zip']).read_bytes())
summary['directory'] = str(destination)
summary['zip'] = str(archive)
summary['baselineContentSHA256'] = baseline['contentSHA256']
summary['changedPackageFiles'] = changed
summary['workerSHA256'] = hashlib.sha256((root / 'worker.mjs').read_bytes()).hexdigest()
with (root / 'stdlib-preview-summary-20261015.json').open('x', encoding='utf-8') as target:
    target.write(json.dumps(summary, indent=2) + '\n')
print(json.dumps(summary, indent=2))
