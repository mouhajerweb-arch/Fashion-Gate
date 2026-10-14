# Reset Local WordPress Environment (Destructive)
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\.."

Write-Host "=========================================================" -ForegroundColor Red
Write-Host " WARNING: THIS WILL RESET THE LOCAL WORDPRESS ENVIRONMENT" -ForegroundColor Red
Write-Host " All local database tables and uploaded media will be DESTROYED." -ForegroundColor Red
Write-Host " The main repository (Next.js / source code) will NOT be touched." -ForegroundColor Yellow
Write-Host "=========================================================" -ForegroundColor Red

$confirm = Read-Host "Type 'YES' to proceed with resetting the local WordPress environment"
if ($confirm -eq "YES") {
    Write-Host "==> Destroying local WordPress containers and persistent volumes..." -ForegroundColor Red
    docker compose down -v
    Write-Host "==> Local WordPress environment has been completely reset." -ForegroundColor Green
} else {
    Write-Host "==> Reset cancelled." -ForegroundColor Yellow
}
