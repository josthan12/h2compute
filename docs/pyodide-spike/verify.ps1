$ErrorActionPreference = 'Stop'
$env:NEXT_TELEMETRY_DISABLED = '1'
foreach ($check in @('lint', 'typecheck', 'check:content', 'test', 'test:examples', 'build', 'test:e2e')) {
    Write-Output "Running npm run $check"
    npm run $check
    if ($LASTEXITCODE -ne 0) { throw "$check failed ($LASTEXITCODE)" }
}
python scripts/check-contrast.py
if ($LASTEXITCODE -ne 0) { throw 'Contrast check failed' }
