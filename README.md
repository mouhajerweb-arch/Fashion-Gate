# Fashion Gate

## Contact Email Setup

The contact forms save each valid enquiry to Sanity and send an internal email through Resend.

### Local Development

Create `.env.local` and add:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=4y6hfnze
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-07-03
SANITY_API_WRITE_TOKEN=<sanity write token>
RESEND_API_KEY=<resend sending key>
EMAIL_FROM="Fashion Gate Mall <noreply@fashiongatemall.com>"
EMAIL_TO="support@fashiongatemall.com"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EMAIL_PUBLIC_ASSET_URL="https://fashiongatemall.com"
```

Do not commit `.env.local`; local env files are gitignored.

### Production / Vercel

Add these variables in Vercel Project -> Settings -> Environment Variables:

```env
SANITY_API_WRITE_TOKEN=
RESEND_API_KEY=
EMAIL_FROM="Fashion Gate Mall <noreply@fashiongatemall.com>"
EMAIL_TO="support@fashiongatemall.com"
NEXT_PUBLIC_SITE_URL="https://fashiongatemall.com"
EMAIL_PUBLIC_ASSET_URL="https://fashiongatemall.com"
NEWSLETTER_ADMIN_EMAIL="support@fashiongatemall.com"
```

Create the Resend API key with sending access only. Restrict it to `fashiongatemall.com` if Resend provides that option.

Use `NEWSLETTER_ADMIN_EMAIL` to decide where dashboard access tokens are sent. If it is not set, tokens are sent to `EMAIL_TO`.

### Rate Limiting

The contact endpoint currently applies a 5 submissions per IP per 10 minutes best-effort server-side limiter. Because Vercel serverless instances are distributed, connect a shared Redis/KV limiter before high-traffic production use for fully consistent limits across instances.

Optional stronger bot protection can be added later with Cloudflare Turnstile.

## Newsletter Setup

Footer newsletter subscriptions are saved in Sanity under `Newsletter Subscribers`. Duplicate emails are prevented by a deterministic subscriber document ID. If an unsubscribed email subscribes again, it is reactivated.

New or reactivated subscribers receive a branded welcome email from `EMAIL_FROM`. The email includes a one-click unsubscribe link and does not send a support notification for every subscription. Support monitoring stays inside Sanity under `Newsletter Subscribers`.

Newsletter drafts can be prepared in Sanity under `Newsletter Campaigns`. Sending campaigns should be connected only through an admin-protected flow.

Marketing users can use `/newsletter-dashboard` without Sanity Studio access. The dashboard supports:

- Email-generated access token verification
- Draft and Sent tabs
- Loading old drafts back into the editor
- Saving new drafts or updating selected drafts
- Uploading newsletter images to Sanity assets
- Sending a test email
- Sending to subscribed users only

The subscribe endpoint uses:

```env
SANITY_API_WRITE_TOKEN=
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_TO=
REDIS_URL=
NEXT_PUBLIC_SITE_URL=
EMAIL_PUBLIC_ASSET_URL=
```

Every subscriber stores an unsubscribe token so future newsletter emails can include an unsubscribe link.
