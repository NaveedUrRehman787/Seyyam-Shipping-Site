// Shared mail logic. Runtime-agnostic: Express and serverless both call handleQuote().
import nodemailer from 'nodemailer';

const BRAND = {
  name: 'YIWU NOVASOURE IMPORT AND EXPORT CO.,LTD',
  site: 'https://seyyam-shipping-site.vercel.app',
  phone: '+86 131 5790 8374',
  accent: '#c9a227',
  ink: '#071422',
};

/* ------------------------------------------------------------------ *
 * Validation
 * ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(body = {}) {
  const clean = (v, max) => String(v ?? '').trim().slice(0, max);

  const data = {
    name:    clean(body.name, 100),
    email:   clean(body.email, 150).toLowerCase(),
    phone:   clean(body.phone, 40),
    service: clean(body.service, 100),
    message: clean(body.message, 4000),
    website: clean(body.website, 100), // honeypot
  };

  const errors = [];
  if (data.name.length < 2)          errors.push('Please enter your name.');
  if (!EMAIL_RE.test(data.email))    errors.push('Please enter a valid email address.');
  if (data.message.length < 5)       errors.push('Please tell us what you need.');
  // Newline injection into headers
  if (/[\r\n]/.test(data.name + data.email)) errors.push('Invalid characters submitted.');

  return { data, errors };
}

/* ------------------------------------------------------------------ *
 * Cloudflare Turnstile — skipped when no secret is configured
 * ------------------------------------------------------------------ */

export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return true;

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token ?? '', remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json();
    return json.success === true;
  } catch (err) {
    console.error('[turnstile] verification error:', err.message);
    return false; // fail closed
  }
}

/* ------------------------------------------------------------------ *
 * In-memory rate limit — 3 submissions per IP per 10 minutes.
 * Good enough for a single-process deploy. Behind multiple instances,
 * swap for Redis or let Cloudflare handle it.
 * ------------------------------------------------------------------ */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 3;
const hits = new Map();

export function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);

  if (hits.size > 5000) {                       // crude cleanup, keeps memory bounded
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return list.length > MAX_HITS;
}

/* ------------------------------------------------------------------ *
 * Transport
 * ------------------------------------------------------------------ */

let cached;
export function transport() {
  if (cached) return cached;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP is not configured — set SMTP_HOST, SMTP_USER and SMTP_PASS.');
  }

  const port = Number(SMTP_PORT ?? 465);
  cached = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,          // 465 = implicit TLS, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    pool: true,
    maxConnections: 3,
  });
  return cached;
}

/* ------------------------------------------------------------------ *
 * Templates
 * ------------------------------------------------------------------ */

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const nl2br = (s) => esc(s).replace(/\n/g, '<br>');

const shell = (inner) => `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f6f9fc;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:${BRAND.ink};line-height:1.6">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
    <tr><td style="background:${BRAND.ink};padding:20px 28px">
      <span style="color:#fff;font-size:17px;font-weight:700;letter-spacing:-.02em">${BRAND.name}</span>
    </td></tr>
    <tr><td style="padding:28px">${inner}</td></tr>
    <tr><td style="padding:16px 28px;background:#f6f9fc;border-top:1px solid #e2e8f0;font-size:12px;color:#6b7c93">
      ${BRAND.name} · ${BRAND.phone} · <a href="${BRAND.site}" style="color:#1b6ca8">${BRAND.site.replace('https://','')}</a>
    </td></tr>
  </table>
</body></html>`;

const row = (label, value) => value
  ? `<tr>
       <td style="padding:7px 0;color:#6b7c93;font-size:13px;width:118px;vertical-align:top">${esc(label)}</td>
       <td style="padding:7px 0;font-size:14px;font-weight:600">${nl2br(value)}</td>
     </tr>`
  : '';

function internalEmail(d) {
  return shell(`
    <h1 style="margin:0 0 4px;font-size:19px">New quote request</h1>
    <p style="margin:0 0 20px;color:#6b7c93;font-size:13px">Reply directly to this email to reach ${esc(d.name)}.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      ${row('Name', d.name)}
      ${row('Email', d.email)}
      ${row('Phone', d.phone)}
      ${row('Service', d.service)}
    </table>
    <div style="margin-top:20px;padding:16px;background:#f6f9fc;border-left:3px solid ${BRAND.accent};border-radius:6px">
      <strong style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:#6b7c93;margin-bottom:6px">Message</strong>
      <div style="font-size:14px">${nl2br(d.message)}</div>
    </div>`);
}

function customerEmail(d) {
  return shell(`
    <h1 style="margin:0 0 12px;font-size:19px">Thanks, ${esc(d.name)} — we have your request</h1>
    <p style="margin:0 0 16px;font-size:14px">
      A member of our team will review it and reply <strong>within one business day</strong>
      (Mon–Sat, 09:00–18:00 China Standard Time).
    </p>
    <p style="margin:0 0 8px;font-size:13px;color:#6b7c93">Here is what you sent us:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
           style="background:#f6f9fc;border-radius:8px;padding:6px 14px">
      ${row('Service', d.service || 'Not specified')}
      ${row('Message', d.message)}
    </table>
    <p style="margin:22px 0 0;font-size:14px">
      Need us sooner? Call <a href="tel:+8615677662780" style="color:#1b6ca8;font-weight:600">${BRAND.phone}</a>
      or reply to this email.
    </p>
    <p style="margin:18px 0 0;font-size:13px;color:#6b7c93">— The ${BRAND.name} team</p>`);
}

const textVersion = (d) =>
  `New quote request\n\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || '—'}\n` +
  `Service: ${d.service || '—'}\n\nMessage:\n${d.message}\n`;

/* ------------------------------------------------------------------ *
 * Main handler — framework-independent
 * ------------------------------------------------------------------ */

export async function handleQuote(body, ip) {
  const { data, errors } = validate(body);

  // Honeypot: pretend success so the bot does not learn anything.
  if (data.website) {
    console.warn('[spam] honeypot tripped from', ip);
    return { status: 200, payload: { ok: true } };
  }

  if (errors.length) {
    return { status: 422, payload: { ok: false, error: errors[0] } };
  }

  if (rateLimited(ip)) {
    return { status: 429, payload: { ok: false, error: 'Too many requests. Please try again in a few minutes.' } };
  }

  const token = body['cf-turnstile-response'] ?? body.turnstileToken;
  if (!(await verifyTurnstile(token, ip))) {
    return { status: 422, payload: { ok: false, error: 'Verification failed. Please reload and try again.' } };
  }

  const from = `"${BRAND.name} Website" <${process.env.SMTP_USER}>`;
  const inbox = process.env.INBOX || process.env.SMTP_USER;
  const mail = transport();

  // 1. Notify the business. This one must succeed — it is the actual lead.
  await mail.sendMail({
    from,
    to: inbox,
    replyTo: `"${data.name}" <${data.email}>`,
    subject: `New quote request — ${data.name}${data.service ? ` (${data.service})` : ''}`,
    text: textVersion(data),
    html: internalEmail(data),
  });

  // 2. Confirm to the customer. A failure here must not lose the lead,
  //    so it is caught and logged rather than thrown.
  try {
    await mail.sendMail({
      from: `"${BRAND.name}" <${process.env.SMTP_USER}>`,
      to: `"${data.name}" <${data.email}>`,
      replyTo: inbox,
      subject: 'We received your sourcing request',
      text: `Hi ${data.name},\n\nThanks for contacting ${BRAND.name}. We have your request and will reply within one business day.\n\nWhat you sent:\nService: ${data.service || 'Not specified'}\nMessage: ${data.message}\n\n${BRAND.name} · ${BRAND.phone}\n`,
      html: customerEmail(data),
    });
  } catch (err) {
    console.error('[mail] customer auto-reply failed:', err.message);
  }

  return { status: 200, payload: { ok: true } };
}
