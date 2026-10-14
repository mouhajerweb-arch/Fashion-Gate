# View Container Logs
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\.."

Write-Host "==> Tailing WordPress container logs (Ctrl+C to exit)..." -ForegroundColor Cyan
docker compose logs -f --tail=100
