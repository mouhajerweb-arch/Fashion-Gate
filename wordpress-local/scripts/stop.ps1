# Stop Local WordPress Environment
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\.."

Write-Host "==> Stopping local WordPress environment containers..." -ForegroundColor Cyan
docker compose stop
Write-Host "==> Containers stopped safely. Data preserved in volumes." -ForegroundColor Green
