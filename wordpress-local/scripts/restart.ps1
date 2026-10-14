# Restart Local WordPress Environment
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\.."

Write-Host "==> Restarting local WordPress environment containers..." -ForegroundColor Cyan
docker compose restart
Write-Host "==> Environment restarted successfully." -ForegroundColor Green
