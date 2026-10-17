# Sourcing Site — static Astro front end + Node mail API

15-page lead-generation site. Builds to plain HTML, ships **99.7 KB and 3 requests**
on first load, and posts the quote form to a small Node service that sends **two**
emails: the lead to the business, and a confirmation to the customer.

---

## Requirements

Node 20 or newer (built and tested on Node 24).

## Quick start

```bash
npm install
cp .env.example .env        # fill in SMTP credentials
npm run dev                 # site        → http://localhost:4321
npm run api                 # mail API    → http://localhost:3000
npm test                    # 16 checks against a real SMTP server
```

## Layout

```
src/
  data/site.js            ← EDIT THIS: nav, services, phone, address, form endpoint
  data/policy-content.js  ← the seven policy pages
  components/             Header, Footer, QuoteForm, Icon
  layouts/                Base (SEO + schema), Policy
  pages/                  index, about-us, contact-us, services/[slug], policies/[slug], 404
api/
  mailer.js               validation, honeypot, rate limit, Turnstile, both email templates
  server.js               Express — for a VPS, or local dev
  send.js                 serverless handler — Vercel / Netlify
test/
  smoke.mjs               mail logic against a real SMTP server
  e2e.mjs                 boots the Express server, posts over HTTP
public/
  .htaccess               Apache caching, compression, HTTPS redirect, security headers
```

`src/data/site.js` is the single source of truth. Add a service there and it appears
in the nav, the footer, the services grid, the form dropdown, and gets its own page
with schema — no other file to touch.

## Environment

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465                       # 465 implicit TLS, or 587 STARTTLS
SMTP_USER=md@seyyamshippingline.com # a real mailbox, created in hPanel
SMTP_PASS=...
INBOX=md@seyyamshippingline.com     # where leads land
TURNSTILE_SECRET=                   # optional; blank disables the captcha
ALLOWED_ORIGIN=https://seyyamshippingline.com
PORT=3000
```

Never commit `.env`. On a VPS keep it outside the web root.

---

## Deploying

The static site and the API are independent. Pick a row.

### Option A — Hostinger static + free serverless API (recommended, $0 extra)

Hostinger's shared plans run PHP, **not** Node, so the API cannot live there.
Put it on a free serverless tier instead:

1. `npm run build`
2. Upload everything inside `dist/` to `public_html/` (include `.htaccess`)
3. Deploy `api/` to Vercel (free) — it picks up `api/send.js` automatically
4. Set the same env vars in the Vercel dashboard
5. In `src/data/site.js` set:
   ```js
   formEndpoint: 'https://your-api.vercel.app/api/send',
   ```
6. Set `ALLOWED_ORIGIN=https://seyyamshippingline.com` so only your site can post
7. Rebuild and re-upload

### Option B — Hostinger VPS, one process

```bash
npm ci && npm run build
node api/server.js          # serves dist/ AND /api/send on the same origin
```
Keep `formEndpoint: '/api/send'`. Put it behind pm2 or a systemd unit, with
nginx terminating TLS.

### Option C — keep it all on shared hosting

If you would rather not run Node at all, the same two-email flow works as a single
PHP file — see `BUILD-PLAN-STATIC.md` in `../Wanxi-Audit/`. Same behaviour, no
serverless account needed.

---

## Before go-live

- [ ] Create the mailbox in hPanel and confirm SMTP login works
- [ ] `npm test` passes
- [ ] Submit the real form once — confirm **both** emails arrive
- [ ] Check the customer confirmation against Gmail **and** Outlook spam folders
- [ ] Verify SPF and DKIM are green (Hostinger sets these when domain + email are both there)
- [ ] Add the Turnstile keys if the honeypot alone is not holding spam back
- [ ] Replace the placeholder testimonials with real, attributable ones
- [ ] Swap the `stats` in `site.js` for true figures
- [ ] Add GA4 and Search Console
- [ ] Have a solicitor review `policy-content.js` — it is a working draft, not legal advice

## Measured output

| | This build | The WordPress site it replaces |
|---|---|---|
| First load | **99.7 KB** | ~2.2 MB |
| Requests | **3** | 60+ |
| CSS files | **1 (11.5 KB)** | 42 (576 KB) |
| JS | **5.4 KB inline, 0 files** | 22 files (488 KB) |
| Fonts | **1 family, 47 KB** | 6 families, all weights |
| Build time | 1.8 s | n/a |
| Whole site on disk | 540 KB | n/a |
