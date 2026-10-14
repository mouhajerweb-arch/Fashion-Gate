# Deployment and WordPress setup

The repository contains an installable platform, not a running production WordPress host. Keep `/landing` routing disabled until staging acceptance succeeds. Main-site routes and data remain independent.

## Build and package

From the repository root:

```powershell
npm.cmd ci --prefix wordpress --ignore-scripts
npm.cmd run build --prefix wordpress
npm.cmd test --prefix wordpress
powershell -ExecutionPolicy Bypass -File wordpress/scripts/package.ps1
```

The output ZIPs contain the plugin and child theme at their correct top-level folder paths. Astra, Elementor, Polylang and an SEO plugin are separately installed from WordPress.org; no paid license is included. Playground is development-only and not part of either ZIP.

## Host preparation

1. Provision independent HTTPS WordPress with PHP 8.1+ (8.3 recommended), MariaDB/MySQL, real cron, backups, SMTP, and a writable uploads directory. Place WordPress at physical `/landing`, not at origin root. Use `config/nginx.conf.example` as the hosting contract.
2. Set the variables in `wordpress/config/hosting.env.example` using the host's secret manager. Generate a unique random proxy secret of at least 32 characters. Stage with `WP_ENVIRONMENT_TYPE=staging`; production must explicitly set `production`.
3. Include `wp-config-landing.php` from wp-config.php **after ABSPATH is defined and before wp-settings.php loads**. Do not overwrite database configuration or salts. This sets public WP_HOME/WP_SITEURL, SSL and cookie paths. Both use `https://www.fashiongatemall.com/landing` in production; staging uses its actual public proxy URL ending in `/landing`.
4. Require the proxy credential at the web server for every request including static assets. The PHP guard alone does not protect static files. Allow local CLI administration. Never allow an arbitrary request header to bypass this rule. Set the client-IP policy described below before enabling rate limits publicly.
5. Install Astra, Elementor, the child theme, and the Fashion Gate plugin. Activate Astra child theme. The platform activation creates the rate-limit table and Marketing Manager role; configure real cron so expired hashed gate rows are removed hourly.
6. Install one SEO plugin, preferably Yoast when none exists; install Polylang when no translation system exists. Preserve an already configured WPML/SEO system instead of installing duplicates.
7. Set permalink structure to `/%postname%`. Enable Elementor containers. Use 767px mobile and 1024px tablet kit breakpoints; controls support the active Elementor breakpoint values. Disable Elementor native entrance animations on elements using Fashion Gate Motion to avoid simultaneous transforms.
8. Run `wp fashiongate import --globals --user=<administrator-login>` once to import the library and configure global colors/fonts. The command skips previously imported templates. `--globals` intentionally changes active kit typography/colors, so use only on this dedicated landing installation. Alternatively import individual JSON files through Templates > Saved Templates; configure Site Settings using global-settings.json as the token reference.
9. Create Arabic and English languages in Polylang. Use language directories with Arabic as the default, and show the default language code. Landing URLs are `/landing/ar/...` and `/landing/en/...`, independent of main-site suffix conventions. Create paired pages and configure the translated front pages. Verify root resolution and one canonical per language. Do not publish unpaired language links.
10. Create a new page using Elementor Canvas, insert `immersive-landing-ar` or `-en`, and replace imagery through Media Library to obtain native WordPress srcsets. Starter image URLs reference existing small Fashion Gate site images. Review alt descriptions against selected images. Global font loading is handled by Elementor; for production self-host Cairo/Cormorant Garamond/EB Garamond WOFF2 files using Elementor Custom Fonts if licensed, or approved local `@font-face` rules. Do not copy personal-use-only Griphorium.
11. Set the Arabic page as the homepage and connect its English translation. The page templates include editable in-page header/footer. Pro Theme Builder is optional: save the supplied header/footer containers as Theme Builder header/footer templates, set only landing-page conditions, remove in-page equivalents, then choose Elementor Full Width instead of Canvas. Canvas intentionally bypasses Theme Builder.
12. Configure a lead destination and verify real delivery. If selecting `existing-contact`, retain `name` and `email` field IDs, optional `phone`. The adapter sends custom fields/attribution as message text to the unchanged Next API. Its 5,000-character limit and shared origin-IP rate limit make webhook/email preferable for higher volume or long forms. Existing-contact success reflects the current Sanity/Resend endpoint behavior, including its potential stored-lead/email-failure ambiguity.
13. Configure optional Turnstile **both** site key and secret and allow the public hostname; expected action is `fg_lead`. Configure SMTP for email mode; `wp_mail` success confirms handoff to the configured mail transport, not inbox receipt. Use provider delivery monitoring.

## Vercel cutover

Set `FG_WORDPRESS_ORIGIN=https://your-origin-host` (no path or trailing components) and the identical `FG_PROXY_SECRET` as server-only environment variables. Deploy once. `middleware.ts` matches only `/landing` and its descendants, preserves path/query and rewrites externally. `next.config.ts` overrides X-Frame-Options to SAMEORIGIN only there, allowing Elementor's same-origin preview. Main site remains DENY.

Administration: `https://www.fashiongatemall.com/landing/wp-admin/`. Do not direct Marketing to the blocked origin. This is a deliberate same-origin editor architecture; verify Vercel preserves request cookies, response Set-Cookie, multipart uploads, AJAX POST and redirect Location before acceptance. If your hosting/Vercel combination cannot support this, keep cutover disabled and change the architecture explicitly; do not mask failures with dual-origin URL replacements.

Vercel's trusted `x-vercel-forwarded-for` is used for client rate limits. It is copied to `x-fg-client-ip` by the middleware after overwriting any visitor value. WordPress accepts that value only when the shared proxy credential matches. When using another edge, supply an equivalent trusted policy; do not accept the leftmost arbitrary X-Forwarded-For. Direct local QA falls back to REMOTE_ADDR.

## Cache and update publishing

All proxied responses currently use no-store to prioritize editor publishing correctness. WordPress HTML/admin/REST also sends no-store. Origin static assets use revalidation, not immutable caching of mutable Elementor CSS. Once verified, host-level versioned fonts/vendor assets may receive longer cache lifetimes, but update middleware caching only with tests that exclude HTML/API/admin and cover replaced media. Do not enable a WordPress page cache without save-time invalidation.

Marketing Update > public refresh must show the change without Git, Next, Sanity or Vercel deployment. Test generated CSS and replaced images as well as text. If stale, purge origin cache and Elementor Files & Data, inspect response headers, then retest.

## SEO and tags

SEO plugin owns titles, descriptions, canonical, OG, social image, WebPage schema and sitemaps. All URLs should derive from public WP_HOME. Polylang owns paired hreflang. Verify x-default at the language-neutral root if supplied by your SEO/multilingual configuration; do not invent untranslated alternates. The main site's robots response adds the landing sitemap only after routing is enabled. Submit `/landing/sitemap_index.xml` separately in Search Console if using Yoast/Rank Math.

Rewritten HTML does not include the Next.js layout. Choose exactly one WordPress tag owner: existing tag plugin/GTM, **or** FG_GA4_ID set to the audited property `G-0GRFDMJBV6`. The latter loads GA only after consent and uses canonical page_location with no query/referrer. If using GTM, leave FG_GA4_ID empty and map the allowlisted dataLayer events. Keep enhanced measurement/automatic form tracking off or review it for PII. Consent uses the shared main-site storage key and may be changed through Privacy preferences. Meta/Ads/LinkedIn conversions are tag-manager configuration, triggered by `fg_form_success` only, never CTA clicks.

## Release gate and rollback

Complete QA.md on staging, back up WordPress database/uploads and record plugin versions. Review draft testimonials/events before publication. Set production environment type and check robots/canonical once more. To roll back the application routing, remove FG_WORDPRESS_ORIGIN and redeploy; this returns `/landing` to existing Next behavior (usually not-found), leaving all main routes unchanged. To roll back content use Elementor revisions. To roll back plugins restore the prior package plus compatible database backup. Do not point at an unverified origin.
