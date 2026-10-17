# CLAUDE.md

Static China-sourcing lead-gen site. Astro → plain HTML, plus a small Node service
that emails the form. Built as a cheaper, faster replacement for a WordPress +
Elementor site (audit in `../Wanxi-Audit/`).

**Hard budget context:** $300 fixed build, ~$30/yr running. Do not propose paid
services, SaaS tiers, or dependencies with a monthly cost without flagging it first.

---

## Commands

```bash
npm run dev        # Astro dev server, hot reload → :4321  (form does NOT work here)
npm run api        # Express mail API → :3000
npm run build      # → dist/
npm test           # 16 checks; provisions a real Ethereal SMTP account
node dev-server.mjs # serves built dist + working form on :3000, prints inbox creds
```

Astro 7 **daemonizes** `astro dev`. The command exits 0 while the server keeps
running. Stop it with `astro dev stop`, not by killing the shell job.

---

## Architecture

```
src/data/site.js           SINGLE SOURCE OF TRUTH
src/data/policy-content.js the 7 policy pages
src/components/            Header, Footer, QuoteForm, Icon
src/layouts/               Base (SEO + JSON-LD), Policy
src/pages/                 index, about-us, contact-us,
                           services/[slug], policies/[slug], 404
api/mailer.js              validation, honeypot, rate limit, Turnstile, templates
api/server.js              Express — VPS or local
api/send.js                serverless handler — Vercel/Netlify
test/smoke.mjs, e2e.mjs
```

### `src/data/site.js` drives everything

Adding a service there gives you: nav entry, footer link, homepage card, services-hub
card, form dropdown option, its own page, and `Service` + `FAQPage` + `BreadcrumbList`
schema. **Never hardcode a service, phone number or address into a page** — it will
drift. Same for `policies` → `policy-content.js`.

### One mail path, two runtimes

`api/mailer.js` holds all logic and is runtime-agnostic. `server.js` (Express) and
`send.js` (serverless) are thin adapters that both call `handleQuote(body, ip)`.
**Put new mail logic in `mailer.js`**, never in an adapter, or the two deploy targets
diverge.

---

## Non-obvious constraints

**Hostinger shared hosting runs PHP, not Node.** `api/` cannot deploy there. Either
put `send.js` on a free serverless tier and point `site.formEndpoint` at its absolute
URL, or use a VPS, or fall back to the PHP handler in `../Wanxi-Audit/BUILD-PLAN-STATIC.md`.
This is the single most common thing to get wrong here.

**The two emails have deliberately different failure semantics.** The business
notification is awaited and failure propagates — that email *is* the lead. The
customer auto-reply is wrapped in try/catch and only logged. Do not "tidy" this into
one `Promise.all`: a bounced confirmation must never lose a lead.

**Honeypot returns 200, not an error.** A bot that trips `website` gets `{ok:true}`
so it learns nothing. Do not change this to 4xx.

**Rate limiting is in-memory** (3 per IP per 10 min). Correct for one process. Behind
multiple instances it silently under-enforces — move to Redis or Cloudflare if the
deploy ever scales out.

**Turnstile fails closed.** No `TURNSTILE_SECRET` set = check skipped entirely;
secret set but verification errors = request rejected.

**`trailingSlash: 'always'`.** Internal links must end in `/` or Astro dev 404s.

---

## Conventions

- **No CSS framework, no UI library.** Design tokens live in `:root` in
  `src/styles/global.css`. Use the existing `--s1..--s9` spacing and `--f-*` type
  scale rather than raw px.
- **Two fonts maximum, one family loaded.** The WordPress site this replaces shipped
  six families at every weight; that was a named finding in the audit. Do not add a
  webfont without removing one.
- **Component styles go in the component's `<style>` block.** Only genuinely global
  primitives belong in `global.css`.
- **Icons are inline SVG in `Icon.astro`.** No icon-font packages.
- **Every `<img>` needs real `alt` text.** All-empty alts was a finding in the audit.
- **Zero client JS by default.** The only scripts are the nav toggle, the stat
  counter, and the form handler — all inline, all progressive enhancement. The
  counters render their true value in HTML and animate only as an upgrade.

### Performance budget

Currently **99.7 KB / 3 requests** on first load. Treat that as a ceiling, not a
starting point. Re-measure after changes:

```bash
npm run build && du -sh dist
```

---

## Placeholder content — must be replaced before launch

- **Testimonials** in `src/pages/index.astro` are written examples, not real clients.
- **`stats`** in `site.js` (years, countries, orders, clients) are invented figures.
- **`policy-content.js`** is a working draft written to match how the business
  operates. It is **not legal advice** and needs a solicitor's review.

Do not present any of these as real in client-facing output.

---

## Before go-live

- [ ] `npm test` passes
- [ ] Real mailbox created in hPanel; SMTP login confirmed
- [ ] Submit the live form — confirm **both** emails arrive
- [ ] Check the customer confirmation against Gmail **and** Outlook spam
- [ ] SPF + DKIM green (automatic when domain and email are both on Hostinger)
- [ ] `ALLOWED_ORIGIN` set to the real domain, not `*`
- [ ] `.env` outside the web root; never committed
- [ ] GA4 + Search Console added (the old site had zero analytics — a top finding)
- [ ] `.htaccess` uploaded with `dist/` (carries HSTS, X-Frame-Options, nosniff, caching)
