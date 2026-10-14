# Start Local WordPress Environment
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\.."

Write-Host "==> Starting local WordPress environment..." -ForegroundColor Cyan
docker compose up -d

Write-Host "==> Running WordPress bootstrap script..." -ForegroundColor Cyan
& "$ScriptDir\bootstrap.ps1"
