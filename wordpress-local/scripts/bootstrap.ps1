# WordPress Local Bootstrap Script for Fashion Gate
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\.."

Write-Host "==> Checking local WordPress database status..." -ForegroundColor Cyan

$maxRetries = 30
$count = 0
while ($count -lt $maxRetries) {
    $dbCheck = docker compose exec -T db mariadb-admin ping -h 127.0.0.1 -u fg_wp_user -pfg_wp_pass_123! 2>&1
    if ($dbCheck -like "*mysqld is alive*") {
        Write-Host "==> MariaDB database is ready." -ForegroundColor Green
        break
    }
    Write-Host "==> Waiting for MariaDB database container... ($count/$maxRetries)" -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    $count++
}

# Check WordPress Core Installation
$installed = docker compose run --rm -T cli wp core is-installed 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "==> Installing WordPress core..." -ForegroundColor Cyan
    docker compose run --rm -T cli wp core install `
        --url="http://localhost:8080" `
        --title="Fashion Gate Landing Local" `
        --admin_user="fgadmin" `
        --admin_password="fgpassword123!" `
        --admin_email="admin@fashiongatemall.local" `
        --skip-email
} else {
    Write-Host "==> WordPress core is already installed." -ForegroundColor Green
}

Write-Host "==> Configuring pretty permalinks (/%postname%/)..." -ForegroundColor Cyan
docker compose run --rm -T cli wp rewrite structure '/%postname%/' --hard

Write-Host "==> Installing and activating Astra parent theme..." -ForegroundColor Cyan
docker compose run --rm -T cli wp theme install astra --activate

Write-Host "==> Activating Fashion Gate Astra child theme..." -ForegroundColor Cyan
docker compose run --rm -T cli wp theme activate fashiongate-astra-child

Write-Host "==> Installing and activating Elementor free plugin..." -ForegroundColor Cyan
docker compose run --rm -T cli wp plugin install elementor --activate

Write-Host "==> Activating Fashion Gate Elementor Experience plugin..." -ForegroundColor Cyan
docker compose run --rm -T cli wp plugin activate fashiongate-elementor-experience

Write-Host "==> Checking for custom WP-CLI import command..." -ForegroundColor Cyan
$cmdCheck = (docker compose run --rm -T cli wp help fashiongate 2>&1) -join "`n"
if ($cmdCheck -like "*import*") {
    Write-Host "==> Running Fashion Gate template & kit import..." -ForegroundColor Cyan
    docker compose run --rm -T cli wp fashiongate import --globals --user=fgadmin
} else {
    Write-Host "[NOTICE] Custom 'wp fashiongate import' command not registered or Elementor initializing. Run import manually if needed." -ForegroundColor Yellow
}

Write-Host "==> Verifying '/landing' page..." -ForegroundColor Cyan
$landingCheck = docker compose run --rm -T cli wp post list --post_type=page --name=landing --field=ID 2>&1
if ($LASTEXITCODE -ne 0 -or -not $landingCheck) {
    Write-Host "==> Creating '/landing' page..." -ForegroundColor Cyan
    docker compose run --rm -T cli wp post create --post_type=page --post_title="Landing" --post_name="landing" --post_status="publish"
} else {
    Write-Host "==> '/landing' page exists." -ForegroundColor Green
}

Write-Host "==> Applying luxury Elementor Canvas template to '/landing'..." -ForegroundColor Cyan
docker compose run --rm -T cli wp eval-file /var/www/html/wp-content/plugins/fashiongate-elementor-experience/apply_template.php

Write-Host "==> Flushing rewrite rules..." -ForegroundColor Cyan
docker compose run --rm -T cli wp rewrite flush

Write-Host "==> Local WordPress Bootstrap Complete!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Admin:    http://localhost:8080/wp-admin" -ForegroundColor Cyan
Write-Host "Landing:  http://localhost:8080/landing" -ForegroundColor Cyan
