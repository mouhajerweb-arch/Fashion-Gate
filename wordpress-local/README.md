# Local WordPress Development Environment

This directory contains the Docker Compose environment and management scripts for running Fashion Gate's WordPress, Astra, and Elementor landing setup locally.

## Architecture

- **WordPress Container**: Runs official `wordpress:latest` (PHP 8.3) on `http://localhost:8080`
- **Database Container**: Runs official `mariadb:11.4` on private internal port 3306
- **WP-CLI Service**: Runs `wordpress:cli-php8.3` for automated bootstrap
- **Bind Mounts**:
  - Theme source: `../wordpress/themes/fashiongate-astra-child` -> `/var/www/html/wp-content/themes/fashiongate-astra-child`
  - Plugin source: `../wordpress/plugins/fashiongate-elementor-experience` -> `/var/www/html/wp-content/plugins/fashiongate-elementor-experience`

## Management Commands (PowerShell)

From repository root or `wordpress-local/`:

- Start environment & bootstrap: `.\scripts\start.ps1`
- Stop environment (keep data): `.\scripts\stop.ps1`
- Restart containers: `.\scripts\restart.ps1`
- View container status: `.\scripts\status.ps1`
- View live logs: `.\scripts\logs.ps1`
- Reset environment & database: `.\scripts\reset.ps1`

## Credentials

- **WordPress Admin**: `http://localhost:8080/wp-admin`
  - Username: `fgadmin`
  - Password: `fgpassword123!`
- **Database**:
  - Name: `fashiongate_wp`
  - User: `fg_wp_user`
  - Password: `fg_wp_pass_123!`
