# QA report — 2026-09-10

This report distinguishes source checks, isolated WordPress checks and production acceptance. The platform is not declared production-accepted until the remaining gates below pass.

## Completed source checks

* Root `npm run typecheck`: passed after routing/robots changes.
* `npm test --prefix wordpress`: six tests passed. Covers all authored plugin/theme/config PHP parsed as PHP 8.1, both editable template trees, unique element IDs, one H1, semantic main/anchors, configurable fields, no fabricated customer quote in default pages, no origin URLs, GSAP-unavailable fallback, opt-in/fail-closed proxy, query preservation, admin entry rewrite and analytics payload allowlisting.
* Both frontend scripts passed `node --check`.
* The real `Leads.php` executed in bundled PHP **8.3.33** with WordPress database/mail test doubles: foreign origin 403; invalid email, honeypot, unpublished page, invalid token and missing required consent 400; one confirmed mock delivery 200; replay 409 with no second delivery; rate limit 429. No message was sent. This validates handler branches, not MySQL concurrency or external delivery.
* `git diff --check`: passed; Windows line-ending normalization notices only.
* Local build generated 37 JSON files (two full pages, 32 section templates, two draft testimonial templates, one global kit), GSAP/ScrollTrigger and optimized hero media.
* Desktop hero is 52,014 bytes; mobile hero is 18,170 bytes. Other starter images reuse existing Fashion Gate repository assets. These figures are file sizes, not a Core Web Vitals claim.
* Installable plugin/theme ZIP generation succeeded. Rebuild after source edits; FILES.md lists deliverables.

## Isolated WordPress observations

Dependencies inspected: WordPress 7.1, Elementor 4.2.4, Astra 4.13.11, Polylang 3.8.9, Yoast SEO 28.4. Playground requested PHP 8.3 and used its bundled runtime. This is a SQLite development environment, not the production MySQL/Vercel topology.

Initial rendered English fixture returned HTTP 200, displayed all seven custom widget types used by the default page, one H1 and one form. No JavaScript errors were observed. All requested widths were checked in headless Chrome: 1920, 1600, 1440, 1280, 1024, 834, 768, 430, 414, 390, 375 and 360 px. Document scroll width equaled viewport width at every size. Reduced-motion produced zero pin spacers. A valid form with no configured destination returned HTTP 503 and the editable controlled error message.

Runtime checks caught and fixed: a global-kit permission requirement, the Elementor `_element_id` anchor key, hero contrast, and root-only canonical normalization. Initial setup failures were in the development fixture (Yoast minimum WordPress version, Polylang admin context, copied SQLite drop-in and Playground constants). A prebuilt Windows dependency was incompatible with installed Node 26; local Node 22 runs Playground.

Screenshots and raw local results are in `wordpress/.qa/` (ignored, not deployment content). The final bilingual/editor run did **not** complete: the copied Playground SQLite installation failed after restarts. A paired Arabic language link was observed before the fixture failure, but the full AR width matrix and Marketing editor acceptance are pending. The earlier English width matrix predates the final anchor/hero refinements, so final rendered regression remains a staging gate. Do not interpret a fixture setup failure as a passed acceptance test.

## Required staging acceptance

| Area | Required evidence before launch |
| --- | --- |
| Proxy | `/landing`, `/landing/`, campaign, language pages, query/UTM, POST, multipart media upload, CSS/JS/fonts/images, REST and AJAX work on public URL; no redirect loop or origin Location leakage. |
| Admin | Login/session/logout, Elementor iframe preview, responsive editor, saved templates and Update work at public `/landing/wp-admin`; origin direct requests denied including static files; secret absent from browser response headers. |
| Marketing role | Complete all 16 actions below using the actual role and installed Elementor version. |
| Publishing/cache | Change hero text/image/color > Update > public refresh sees change without Next/Git/Sanity/Vercel deployment; repeat after cache warmup. |
| Leads | Real SMTP/CRM or authenticated webhook acceptance; provider failure, timeout, invalid input, honeypot, fast submit, replay, rate limiting and optional Turnstile. Verify no real PII in logs or analytics. |
| SEO | One H1, independent AR/EN titles/descriptions/canonical/OG, valid social image, reciprocal hreflang, deliberate x-default, public sitemap, truthful schema, staging noindex, origin blocked. |
| Consent/analytics | Deny emits no analytics; accept dispatches expected events; withdraw stops dispatch. One tag owner. Only confirmed delivery triggers conversion. Test attribution survives language navigation with consent. |
| Accessibility | Keyboard navigation, visible focus, form labels/errors, skip link, gallery focus, native accordion semantics, contrast, text zoom and screen reader; reduced-motion and failed JS remain usable. |
| Performance | Measure LCP/INP/CLS on deployed pages with production media, fonts, consent and tags. No numeric CWV or Lighthouse certification is claimed. |
| Browsers | Chrome, Edge, Firefox, Safari desktop/iOS and Chrome Android; all requested widths in AR and EN, including mobile Safari viewport/pinning behavior. |

Marketing acceptance checklist: edit hero; replace hero image; add container; add new section; reorder; delete; duplicate; change colors; change typography; change responsive layout; create button; create/change form; insert FG template; apply FG Motion; create campaign; publish. Record tester, version, date, URL and result for each. Pro Theme Builder/Forms/Popups/Custom CSS require the licensed installation and their own checks.

## Infrastructure limitations

No production WordPress origin, DNS/TLS, SMTP/CRM destination, Turnstile keys or Vercel routing variables were supplied/configured. No production deployment occurred. No external email or message was sent by tests. Local mock delivery, when used, is explicitly intercepted before wp_mail sends anything.

Automatic approval review rejected an additional privileged source download because the session reached a usage limit. Remaining local work continued using already available source files. This is separate from the production credentials/infrastructure requirements.
