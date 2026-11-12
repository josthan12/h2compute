from pathlib import Path
import re,subprocess,json
root=Path(__file__).resolve().parents[2]
names=subprocess.check_output(['git','-C',str(root),'ls-files','-z']).decode().split('\0')
patterns={
  'github-token':re.compile(rb'(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})'),
  'aws-access-key':re.compile(rb'AKIA[0-9A-Z]{16}'),
  'private-key':re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
}
findings=[]
for name in filter(None,names):
    p=root/name
    if p.name.startswith('.env') and p.name!='.env.example': findings.append({'file':name,'kind':'tracked-environment-file'})
    if '/.runtime/' in name or '/.preview/' in name or p.suffix in {'.wasm','.whl'}: findings.append({'file':name,'kind':'tracked-runtime-distribution'})
    if not p.is_file(): continue
    data=p.read_bytes()
    for kind,pattern in patterns.items():
        for match in pattern.finditer(data): findings.append({'file':name,'line':data[:match.start()].count(b'\n')+1,'kind':kind})
print(json.dumps({'tracked_files':len(list(filter(None,names))),'findings':findings},indent=2))
raise SystemExit(bool(findings))
