# Fashion Gate landing platform — engineering handover

**Status: implementation and installation packages delivered; production deployment and full acceptance are pending.** No production site was changed. The existing Next.js/Sanity application remains the main website. The new platform is isolated under `/landing` and becomes active only when its WordPress origin is configured.

## A. Audit findings

Next.js 15.5.20 installed, React 19, App Router, Sanity, Vercel next.config.ts. Existing contact API validates with Zod, persists Sanity enquiries and sends through Resend; existing Redis contact limiter remains unchanged. Main layout installs GA4 G-0GRFDMJBV6 and Meta Pixel 1535285561613867; no GTM found. Main URLs use language suffixes and default to Arabic. No WordPress installation, Astra, Elementor or PHP CLI existed in the repository. Full findings and 17-part plan: IMPLEMENTATION-PLAN.md.

## B. Architecture

Visitor > existing Vercel app > `/landing` middleware external rewrite > independent HTTPS WordPress physically mounted at `/landing` > Astra child theme + Elementor + Fashion Gate extension. WP_HOME/SITEURL use the public domain. Editor uses the same public WordPress URL to keep previews, REST, cookies and generated assets consistent. Static and dynamic origin requests require a shared proxy credential.

## C. Files created

Exact manifest: FILES.md. Includes middleware, WordPress plugin/theme/config, 37 Elementor JSON files, optimized media, local GSAP assets, build/package/test tooling and engineering/Marketing documentation. Ignored `.qa` and `node_modules` are development artifacts, not release content.

## D. Files modified

`.env.local.example`: opt-in origin and proxy secret configuration. `next.config.ts`: SAMEORIGIN header only for landing paths. `app/robots.ts`: landing sitemap advertisement only when routing is configured. No existing UI, Sanity schema, email handler or main analytics implementation was edited. Unrelated script deletions appeared concurrently in the shared tree and were left untouched.

## E. Astra

Installable lightweight child theme, inherited Astra hooks, brand fallbacks, skip link, focus styling, RTL foundation and utility classes. Parent theme is untouched. Elementor Canvas owns starter pages. Pro Theme Builder is optional and uses Full Width pages after removing the in-page header/footer.

## F. Elementor

Modern container composition with independent editable sections. Two complete AR/EN templates, 32 section templates, two clearly marked draft testimonial templates and a global kit. Header/footer, typography, media, spacing, forms, CTA, section order and responsive layout are editable. One semantic main landmark and one H1 in each starter. `wp fashiongate import --globals --user=<admin>` imports the library; global application is explicit and existing templates are skipped.

## G. Fashion Gate extension

Seven capability widgets: Animated Hero, Horizontal Showcase, Reveal Heading, Editorial Media, Luxury Cards, Marquee and Lead Experience. They expose content, style, responsive and motion controls alongside standard Elementor Advanced controls. Repeaters support cards and arbitrary configured form fields. Widget render errors fall back to escaped readable copy instead of leaving partial markup.

## H. GSAP

Locally bundled GSAP 3.13.0 + ScrollTrigger. Shared presets cover fade/up/down, left/right reveal, masks, scale, blur, parallax and text reveal. On-load, viewport and progress triggers; duration, delay, stagger, easing, start/end, scrub, desktop pin, strength, devices and reduced-motion settings. Native mobile swipe/stack, measured desktop gallery travel, RTL direction, keyboard focus handling, cleanup and editor bypass. Intro lasts about 0.9 seconds and is skipped on subsequent tab views. No forced smooth-scroll library.

## I. `/landing` routing

Only matching requests are rewritten. Queries and method are preserved. Invalid configured origin/secret returns 503; absent origin leaves current routing alone. Middleware overwrites the proxy token/client-IP headers. `/landing/wp-admin` resolves to its entry file to avoid directory-slash loops. WordPress canonical normalization matches existing Next trailing-slash behavior; production redirect/cookie/upload checks remain required.

## J. WordPress origin

Hosting examples provide guarded wp-config and nginx contracts. Required values are FG_PUBLIC_URL and FG_PROXY_SECRET, plus hosting database/SSL configuration. Public admin is `/landing/wp-admin/`; direct origin access is denied. Production hosting, DNS, TLS, backups and deployment have not been provisioned.

## K. Marketing workflow

Pages > Add New > choose language > Elementor Canvas > insert Fashion Gate template > edit > Preview > Publish. Use Navigator for move/delete/duplicate, Site Settings for global styles and Advanced > Fashion Gate Motion for effects. Add any native widgets/containers freely. Restore through Elementor revisions. Normal Update/Publish requires no Git, Next, Sanity or Vercel deployment. Practical instructions: MARKETING.md.

## L. Lead flow

Lead Experience submits to a WordPress REST endpoint. Saved Elementor settings define server validation. Available destinations: wp_mail/SMTP, authenticated HTTPS webhook/CRM/automation, or an adapter to the existing contact API. Existing-contact requires name/email field IDs and retains extra fields/attribution in message text within its existing size/rate limits. No destination is enabled by default. Elementor Pro Forms remain available with their native independent actions; no untested Pro adapter is claimed.

## M. Analytics

Eleven allowlisted dataLayer events cover landing view, hero/section CTA, form start/submit/success/error, phone/email/WhatsApp and language changes. Only page ID and language accompany event names. No form values or query parameters enter those events. Optional GA4 loading is consent-gated and must be the sole WordPress tag owner; GTM users leave it disabled. Main-site tags are unchanged. Actual account conversion mappings remain deployment configuration.

## N. Attribution

All requested UTM and advertising click IDs are captured after marketing consent, retained within the tab for 30 minutes, and attached to accepted leads. Rejecting consent clears retained attribution. Values are bounded and never sent as analytics event parameters. No cross-session attribution store was introduced.

## O. SEO

An established SEO plugin owns editable metadata, social image, canonical, OG, WebPage schema and sitemap. Integration normalizes public canonical/OG/sitemap paths; Polylang owns language alternates. Staging emits noindex; direct origin is protected. Default copy includes no fake ratings/reviews/events. Page-level SEO values, x-default, schema and Search Console submission need the deployed installation review.

## P. Arabic/English

Native Polylang language directories under `/landing`, actual translated starter content, WordPress lang/dir, logical CSS, Arabic typography, email/phone LTR controls and non-destructive Arabic text grouping. This deliberately avoids reimplementing main-site suffix routing inside WordPress. Paired page creation is documented. Full Arabic browser/editor acceptance remains pending.

## Q. Performance

Optimized desktop hero 52,014 bytes and mobile hero 18,170 bytes; eager/high-priority hero, lazy lower imagery, local GSAP, reserved media ratios, native mobile scrolling, reduced-motion bypass and no hero video auto-download. Media Library images get native srcset. Brand fonts need approved hosted files or Elementor's configured font loading. No Lighthouse/CWV score is claimed.

## R. Accessibility

Semantic headings/main, skip link, visible focus, labels, required fields, status announcements, focus on submission feedback, meaningful buttons, native Elementor accordion, pauseable marquee, gallery keyboard handling and reduced-motion fallbacks. Final contrast, screen-reader, zoom and browser review are launch gates, particularly after Marketing redesigns.

## S. Security

Server-only secrets, escaped output, saved-definition validation, origin check, bounded payloads, honeypot, HMAC timing challenge, replay gate, database-backed rate limit, optional Turnstile hostname/action verification and safe HTTPS webhooks without redirects. Marketing role excludes plugin/PHP administration. No submission PII is logged/stored by the plugin; configured delivery provider is the record owner. No durable retry queue is implemented.

## T. Testing

Root typecheck and six source tests pass. Real PHP 8.3.33 handler tests pass for validation, origin rejection, simulated accepted delivery, replay and rate limit. Earlier local WordPress/Chrome rendering passed one H1, seven widgets, 12 English viewport widths, no JS errors, reduced-motion no pinning and controlled unconfigured-destination failure. Final bilingual/editor regression could not finish because the copied Playground SQLite environment failed. These limitations and all formal acceptance gates are explicit in QA.md.

## U. Production steps required

Provision WordPress origin/database/TLS; configure edge secret and hosting guard; install/configure approved Astra/Elementor/SEO/translation versions; import globals/templates; pair languages; supply approved SEO/campaign/media/contact details; set a tested destination and SMTP/CRM credentials; optionally set Turnstile and one analytics owner; complete Marketing, publishing, proxy and browser acceptance; then configure Vercel variables and deploy once. Elementor Pro features require the organization's license. No purchase was made.

## V. Risks and limitations

This is a staging candidate, not a verified live campaign. Production proxy headers/cookies/multipart/redirect chains and MySQL concurrency still require testing. Pro features are not licensed/tested here. Generic webhook/email integration is provided instead of a vendor-specific CRM. A provider timeout can create uncertain delivery; webhook consumers should deduplicate. Source-level breakpoint tests and earlier screenshots do not replace final Arabic/mobile Safari or Marketing-role acceptance. Plugin deactivation removes its custom widgets; GSAP failure itself leaves content readable. The main-site's existing consent behavior was not changed.

Automatic approval review rejected an additional privileged Polylang source download due to a session usage limit. Already installed source files allowed continued offline work. No production credential or deployment approval was inferred from that failure.
