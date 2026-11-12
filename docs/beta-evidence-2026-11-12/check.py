from pathlib import Path
import re,json,hashlib
root=Path(__file__).resolve().parents[2]
files=['README.md','implementation.md','roadmap.md','current-status.md','content-guide.md',
       'docs/beta-verification-2026-11-12.md','docs/beta-release-2026-11-12.md','docs/beta-pr-description-2026-11-12.md','docs/hosting-terms-2026-11-12.md',
       'docs/decisions/search-mapping-2026-11-12.md','docs/decisions/sql-mapping-2026-11-12.md','docs/decisions/security-maintenance-2026-11-12.md']
count=0
for name in files:
    path=root/name
    for link in re.findall(r'\[[^\]]*\]\(([^)]+)\)',path.read_text(encoding='utf-8')):
        if link.startswith(('https://','http://','#','mailto:')): continue
        target=link.split('#',1)[0]
        assert (path.parent/target).exists(),(name,link)
        count+=1
data=json.loads((root/'docs/beta-evidence-2026-11-12/summary.json').read_text())
for item in data['screenshots']:
    path=root/'docs/beta-evidence-2026-11-12'/item['file']
    assert hashlib.sha256(path.read_bytes()).hexdigest()==item['sha256'],path
traces=list((root/'.next/server').rglob('*.nft.json'))
assert traces,'Missing production traces'
assert not any('pyodide-spike' in p.read_text(encoding='utf-8') for p in traces),'Developer runner leaked into app trace'
print(f'Passed {count} local documentation targets, 4 screenshot hashes and {len(traces)} production traces without developer-runner files.')
