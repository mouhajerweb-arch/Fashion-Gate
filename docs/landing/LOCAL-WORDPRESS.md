# Local WordPress Development & Testing Workflow

This guide details how to run, test, and manage the local WordPress, Astra, Elementor, and Fashion Gate landing page environment on Windows using Docker Compose.

---

## A. Prerequisites

1. **Docker Desktop**: Must be installed and active (`docker run hello-world` passed).
2. **PowerShell**: Used for running management scripts.

---

## B. How to Start the Local Environment

Open PowerShell from the repository root (`Fashion-Gate`) and execute:

```powershell
Set-Location wordpress-local
.\scripts\start.ps1
```

Or from the root directory:

```powershell
.\wordpress-local\scripts\start.ps1
```

This will automatically spin up the WordPress and MariaDB containers, run WP-CLI to install core WordPress, configure permalinks (`/%postname%/`), activate Astra, activate the Fashion Gate child theme, activate Elementor, activate the Fashion Gate Elementor Experience plugin, and import the Elementor templates.

---

## C. How to Stop the Environment

To stop containers while preserving database state and uploaded files:

```powershell
.\wordpress-local\scripts\stop.ps1
```

---

## D. How to Restart the Environment

```powershell
.\wordpress-local\scripts\restart.ps1
```

---

## E. How to Check Container Status

```powershell
.\wordpress-local\scripts\status.ps1
```

---

## F. How to View Container Logs

```powershell
.\wordpress-local\scripts\logs.ps1
```

---

## G. How to Reset the Local Environment

> [!WARNING]
> Resetting destroys the local database and uploaded files. The Next.js / source repository remains untouched.

```powershell
.\wordpress-local\scripts\reset.ps1
```

---

## H. Local Browser URLs

- **Frontend Homepage**: [http://localhost:8080](http://localhost:8080)
- **WordPress Admin**: [http://localhost:8080/wp-admin](http://localhost:8080/wp-admin)
  - **Username**: `fgadmin`
  - **Password**: `fgpassword123!`
- **Landing Page**: [http://localhost:8080/landing](http://localhost:8080/landing)

---

## I. Astra Theme Setup

- **Parent Theme**: Astra (installed automatically via WP-CLI).
- **Child Theme**: Fashion Gate Astra Child Theme (located at `wordpress/themes/fashiongate-astra-child`, bind-mounted into `/wp-content/themes/fashiongate-astra-child` and activated).

---

## J. Elementor Free Setup

- **Plugin**: Elementor Free (installed automatically from the official WordPress plugin repository via WP-CLI).

---

## K. Elementor Pro Manual Installation (Optional)

Elementor Pro requires a licensed ZIP file:
1. Log into `http://localhost:8080/wp-admin`.
2. Go to **Plugins** -> **Add New Plugin** -> **Upload Plugin**.
3. Select your official `elementor-pro.zip` package and click **Install Now**.
4. Activate the plugin and connect your account license.

---

## L. Fashion Gate Child Theme Activation

The child theme is located at `wordpress/themes/fashiongate-astra-child` and activated automatically during bootstrap (`wp theme activate fashiongate-astra-child`).

---

## M. Fashion Gate Elementor Experience Plugin Activation

The custom extension is located at `wordpress/plugins/fashiongate-elementor-experience` and activated automatically during bootstrap (`wp plugin activate fashiongate-elementor-experience`).

---

## N. Elementor Template Import

The bootstrap script automatically imports all JSON templates using `wp fashiongate import --globals`.

### Available Template Files:
- **Full English Landing Page**: `wordpress/plugins/fashiongate-elementor-experience/templates/immersive-landing-en.json`
- **Full Arabic Landing Page**: `wordpress/plugins/fashiongate-elementor-experience/templates/immersive-landing-ar.json`
- **Global Kit Settings**: `wordpress/plugins/fashiongate-elementor-experience/templates/global-settings.json`
- **Section Templates**:
  - `luxury-hero-en.json` / `luxury-hero-ar.json`
  - `category-cards-en.json` / `category-cards-ar.json`
  - `horizontal-showcase-en.json` / `horizontal-showcase-ar.json`
  - `editorial-intro-en.json` / `editorial-intro-ar.json`
  - `benefits-en.json` / `benefits-ar.json`
  - `authority-en.json` / `authority-ar.json`
  - `lead-form-en.json` / `lead-form-ar.json`
  - `dark-footer-en.json` / `dark-footer-ar.json`

### Manual Import Instructions (Fallback):
1. Log into WordPress Admin (`http://localhost:8080/wp-admin`).
2. Navigate to **Templates** -> **Saved Templates**.
3. Click **Import Templates**.
4. Upload `immersive-landing-en.json` or `immersive-landing-ar.json`.
5. Create a new page (**Pages** -> **Add New**), title it **Landing**, set page layout to **Elementor Canvas**, and click **Edit with Elementor**.
6. Click the folder icon in the Elementor editor, go to **My Templates**, and insert `Immersive Landing (EN)` or `Immersive Landing (AR)`.

---

## O. How to Edit the Landing Page in Elementor

1. Go to **Pages** -> **Landing** -> **Edit with Elementor**.
2. Select any section to modify copy, images, colors, typography, or responsive settings.
3. Custom Fashion Gate widgets are located in the left sidebar under the **Fashion Gate Experience** category:
   - *Fashion Gate Animated Hero*
   - *Fashion Gate Horizontal Showcase*
   - *Fashion Gate Reveal Heading*
   - *Fashion Gate Editorial Media*
   - *Fashion Gate Luxury Cards*
   - *Fashion Gate Marquee*
   - *Fashion Gate Lead Experience*
4. Select any element, navigate to **Advanced** -> **Fashion Gate Motion** to adjust GSAP animation parameters (Preset, Trigger, Duration, Delay, Scrub, Pinning).
5. Click **Update** to save changes.

---

## P. How to Test Frontend Animations

- GSAP animations and ScrollTrigger pins are active on the **frontend** (`http://localhost:8080/landing`).
- Some scroll and pin animations are disabled inside the Elementor editor to prevent editing interference.
- Always view `http://localhost:8080/landing` in an incognito or non-editor browser tab to verify GSAP motion performance, mobile responsiveness, and RTL direction.

---

## Q. Troubleshooting PHP & WordPress Logs

- Debugging is enabled via `WP_DEBUG = true` and `WP_DEBUG_LOG = true`.
- To view PHP warnings/errors in real time:
  ```powershell
  docker compose exec wordpress tail -f /var/www/html/wp-content/debug.log
  ```
- Or run `.\wordpress-local\scripts\logs.ps1` to see container output.

---

## R. Resetting the Local Environment

To clear all database contents and start fresh:
```powershell
.\wordpress-local\scripts\reset.ps1
```
Then start again with `.\wordpress-local\scripts\start.ps1`.
