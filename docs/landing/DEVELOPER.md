# Developer guide

Read IMPLEMENTATION-PLAN.md for audit and DEPLOYMENT.md for infrastructure. Keep the existing Next.js/Sanity site isolated. Plugin source is namespaced `FashionGate\ElementorExperience` and requires PHP 8.1+.

## Components

* `middleware.ts`: external rewrite with a server-only proxy credential and trusted Vercel client IP. No client fetch proxy, iframe, or React landing page. Matchers scope all behavior to `/landing`.
* `Platform.php`: activation/rate-gate schema, narrow Marketing role, staging noindex, language shortcode, privacy controls, WP-CLI import, readiness notices.
* `Assets.php`: locally packaged GSAP/ScrollTrigger and shared JS/CSS, public REST configuration, active breakpoints, optional GA property.
* `MotionControls.php`: injects Advanced controls on standard elements and adds escaped `data-fg-*` attributes before render.
* `ExperienceWidget.php`: seven registered capability widgets, conditional content controls, repeater cards/forms, typography/color/responsive controls, accessible server-rendered markup. Elementor's native Advanced tab remains available. Constructor resolves saved widgetType so imported elements preserve their identity.
* `Leads.php`: public challenge and submit endpoints, saved-page field definitions, validation, replay/rate gates, optional Turnstile and configured destination. Gate table stores hashes/counts/expiry, not submissions or IP addresses. Failed delivery returns a controlled 503, never a conversion.
* `motion-engine.js`: GSAP matchMedia context, preset bounds, cleanup, native mobile galleries, RTL travel, keyboard focus reveal, editor/reduced-motion fallback. Content is visible without GSAP. Text reveal supports explicit lines; English words are optional. Arabic is not split into characters/words because that can break joining.
* `frontend.js`: first-interaction timing challenge, delivery state, consent, current-visit attribution, fixed analytics payload, marquee pause.
* `templates.mjs`: deterministic build source for editable Elementor JSON, bilingual defaults and global kit. No PHP page composition. Generated JSON is committed for direct imports.

## Local workflow

Use `npm ci --prefix wordpress --ignore-scripts`, `npm run build --prefix wordpress`, `npm test --prefix wordpress`. The main Next application has separate dependencies; do not install WordPress packages into its package.json. Run `npm run typecheck` at root after routing edits.

`tests/blueprint.json` provisions free Elementor/Astra/SEO/Polylang in WordPress Playground. It mounts the plugin/theme and creates test pages. This is an isolated development fixture; it does not prove the Vercel or MySQL production paths. Playground's native dependency needs a supported Node ABI (Node 22 was used on this Windows host; installed Node 26 was incompatible). The test helper at `tests/browser.mjs` uses local Chrome headless and records screenshots under ignored `.qa`.

Run Playground server with `--blueprint=wordpress/tests/blueprint.json` and `--mount-dir` pairs pointing the plugin and child theme directories into `/wordpress/wp-content/plugins/fashiongate-elementor-experience` and `/wordpress/wp-content/themes/fashiongate-astra-child`. See QA.md for observed versions/results. Never use the test fixture's auto-login on a public host.

## Extension and troubleshooting

To add a widget, prefer its own subclass when behavior diverges materially; register it through Elementor widgets/register, expose Content/Style/responsive controls, and render escaped semantic markup. Keep layout composition in containers. Update templates, dependency declarations and staging editor tests.

To add a motion preset, add a bounded option in MotionControls and its start state in motion-engine.js. Implement teardown and reduced-motion behavior. Do not introduce another scroll library. Pin only desktop and measure distance after fonts/media; do not hardcode gallery track width.

For a blank editor inspect the PHP error log and network panel, confirm Elementor active, inspect public WP_HOME/SITEURL, check SAMEORIGIN, origin credential, REST response and generated CSS. The source has no default hidden content. For a missing custom widget check its widgetType/constructor and Elementor version compatibility.

For form failure inspect response status, host destination configuration, field IDs, challenge age, Turnstile hostname/action and provider status. Do not log raw submissions or secrets. Validating a draft/private/password-protected page through the public endpoint intentionally fails. After errors a new challenge is issued; wait at least two seconds before retry. A timeout can leave delivery uncertain; providers should deduplicate Idempotency-Key. There is no durable retry queue in this release.

## Lead contract

Webhook payload includes UUID, campaign, canonical page URL, language, timestamp, fields keyed by stable IDs with labels/values, and allowlisted attribution. `X-FG-Signature` is `sha256=` plus HMAC-SHA256 over the exact JSON body using FG_LEAD_WEBHOOK_SECRET; verify before parsing. Idempotency-Key is the UUID. Only HTTPS configured server destinations are accepted; redirects are disabled. A 2xx is the provider's acceptance contract. No CRM vendor SDK/secrets are installed.

Email sends the same structured data through wp_mail/SMTP. Existing-contact maps onto the existing Next endpoint and keeps additional data in its message; schema-specific attribution is available only in email/webhook. Forms embedded through shortcode or Pro global templates need an explicit document resolver; use direct lead widgets inside editable page containers for this release.

Native Elementor Pro Forms retain their own actions and spam controls. This release does not claim to add custom endpoint guarantees to Pro Forms. Theme Builder, popups, dynamic Pro content and Custom CSS require a license and separate staging validation. No Pro purchase or activation is automated.

## Analytics contract

Events: fg_landing_view, fg_hero_cta_click, fg_section_cta_click, fg_form_start, fg_form_submit, fg_form_success, fg_form_error, fg_phone_click, fg_email_click, fg_whatsapp_click, fg_language_change. Payload contains event name, numeric WordPress page ID and en/ar language only. Consent gates dispatch; a denied visit emits no analytics. Attribution stays out of analytics and is collected from the current URL only after marketing consent. No cross-session attribution persistence is introduced.

The optional FG_GA4_ID path sanitizes automatic page metadata and disables automatic page view. GTM users must leave that variable empty and map events in their existing container with consent checks. Do not map both dataLayer and gtag bridges to the same GA tag. Disable automatic form tracking that could capture PII. Main-site existing GA/Meta code and consent behavior are intentionally unchanged. Consented attribution persists within the tab for a rolling 30-minute window so language/campaign navigation retains it; rejecting consent clears it. There is no cross-session attribution storage.

## Source references

Audit: [Arabic main site](https://www.fashiongatemall.com/ar), [English main site](https://www.fashiongatemall.com/en).
APIs: [NextResponse](https://nextjs.org/docs/app/api-reference/functions/next-response), [Vercel request headers](https://vercel.com/docs/headers/request-headers), [Elementor control injection](https://developers.elementor.com/docs/hooks/injecting-controls/), [Elementor frontend rendering](https://developers.elementor.com/docs/hooks/render-frontend-elements/), [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [WordPress config](https://developer.wordpress.org/apis/wp-config-php/), [Playground CLI](https://wordpress.github.io/wordpress-playground/developers/local-development/wp-playground-cli/).
