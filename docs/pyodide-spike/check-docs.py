from pathlib import Path
import re
root = Path(__file__).resolve().parents[2]
files = ['README.md', 'implementation.md', 'roadmap.md', 'current-status.md', 'docs/architecture.md', 'docs/testing.md', 'docs/decisions/runner-provider.md', 'docs/milestone-workflow.md', 'docs/milestone-2-verification.md', 'docs/milestone-3-verification.md', 'docs/pyodide-spike/README.md']
count = 0
files.extend(['docs/pyodide-spike/PREVIEW.md', 'docs/pyodide-spike/DISTRIBUTION-NOTICES.md'])
files.extend(['docs/hosting-terms-2026-10-13.md', 'docs/vercel-setup-2026-10-13.md'])
for file in files:
    path = root / file
    text = path.read_text(encoding='utf-8')
    for line_number, line in enumerate(text.splitlines(), 1):
        assert line.rstrip() == line, f'{file}:{line_number} trailing whitespace'
    for target in re.findall(r'\]\(([^)]+)\)', text):
        if target.startswith(('https:', 'http:', '#', 'mailto:')):
            continue
        target = target.split('#')[0]
        assert (path.parent / target).exists(), f'{file}: missing {target}'
        count += 1
assert not (root / 'app' / 'api' / 'run').exists()
assert not any((root / 'public').rglob('*pyodide*'))
print(f'{len(files)} Markdown files passed whitespace/local-link checks ({count} links); no app runner route/public runtime.')
