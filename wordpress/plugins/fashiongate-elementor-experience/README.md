# Fashion Gate Elementor Experience 1.0.0

Requires WordPress 6.6+, PHP 8.1+, Elementor and the independent Fashion Gate landing host. Tested dependency versions and acceptance status are recorded in the repository's docs/landing/QA.md. Install Astra and the Fashion Gate Astra Child theme separately.

Seven widgets: Animated Hero, Horizontal Showcase, Reveal Heading, Editorial Media, Luxury Cards, Marquee, Lead Experience. Standard Elementor widgets and containers remain fully available. Select an element > Advanced > Fashion Gate Motion to add premium motion without JavaScript.

Import the JSON templates through Elementor Saved Templates, or run `wp fashiongate import --globals --user=<admin>` on a new dedicated landing installation. The globals option updates active Site Settings. Arabic/English page and section templates are independent. Testimonials marked DRAFT require approved content before publication. Elementor Pro is optional and is not bundled.

Hosting configuration: FG_PUBLIC_URL, FG_PROXY_SECRET, FG_LEAD_DESTINATION (email/webhook/existing-contact), FG_LEAD_EMAIL, FG_LEAD_WEBHOOK_URL, FG_LEAD_WEBHOOK_SECRET, optional FG_TURNSTILE_SITE_KEY and FG_TURNSTILE_SECRET, optional FG_GA4_ID when this plugin is the sole analytics owner. No secrets belong in Elementor. Use the repository's guarded wp-config and web-server configuration.

Lead Experience fields are editable repeaters. Use unique stable field IDs, configure a real destination, and test server-confirmed delivery. Pro Forms retain their own integrations. Marketing updates do not require a Vercel deployment.

GSAP 3.13.0 and ScrollTrigger are bundled locally; see assets/vendor/GSAP-README.md and source copyright notices for licensing terms. No unrelated animation frameworks, paid Pro code or restricted brand fonts are bundled.
