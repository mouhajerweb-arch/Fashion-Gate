# Show Local WordPress Status
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\.."

Write-Host "==> Local WordPress Docker Compose Status:" -ForegroundColor Cyan
docker compose ps
