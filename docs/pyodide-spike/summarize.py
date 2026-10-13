"""Review generated browser evidence without executing any Python submissions."""
import json
from pathlib import Path
import re
import statistics
root = Path(__file__).resolve().parent
r = json.loads((root / 'results.json').read_text(encoding='utf-8'))
extra = json.loads((root / 'protocol-results.json').read_text(encoding='utf-8'))
assert len(extra) == 6
checked = 0
for run in r['runs']:
    match = re.fullmatch(r'authored (.+) model (\d+) case (\d+)', run['name'])
    if match:
        content = (root.parents[1] / 'content' / 'exercises' / match[1]).read_text(encoding='utf-8')
        meta = json.loads(content.split('---')[1])
        assert run['state'] == 'completed'
        assert run['stdout'] == meta['examples'][int(match[3])]['output']
        checked += 1
assert checked == 40
summary = {'date': r['date'], 'environment': r['environment'], 'browser': r['browser'], 'authoredExactComparisons': checked, 'mainRecords': len(r['runs']), 'supplementalChecks': len(extra), 'modes': {}}
for mode in ['desktop', 'mobile-emulation']:
    runs = [x for x in r['runs'] if x['mode'] == mode]
    summary['modes'][mode] = {'jobResults': len([x for x in runs if 'state' in x]), 'cold': runs[0], 'warm': runs[1], 'medianLoadMs': statistics.median(x['loadMs'] for x in runs if x.get('loadMs')), 'outcomes': {x['name']: x.get('state', {k:v for k,v in x.items() if k not in ['mode','name']}) for x in runs}}
summary['throttled'] = r['runs'][-1]
summary['supplemental'] = extra
(root / 'evidence-summary.json').write_text(json.dumps(summary, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'browser':r['browser'], 'mainRecords':len(r['runs']), 'exactAuthoredCases':checked, 'medianLoadMs':{mode:round(summary['modes'][mode]['medianLoadMs']) for mode in summary['modes']}, 'coldMs':{mode:round(summary['modes'][mode]['cold']['loadMs']) for mode in summary['modes']}, 'warmMs':{mode:round(summary['modes'][mode]['warm']['loadMs']) for mode in summary['modes']}, 'throttledMs':round(summary['throttled']['loadMs']), 'warmTransfers':{mode:sum(x['transferSize'] for x in summary['modes'][mode]['warm']['assets']) for mode in summary['modes']}}, indent=2))
