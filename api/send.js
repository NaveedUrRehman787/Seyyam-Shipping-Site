// Serverless handler (Vercel / Netlify Functions). Same logic as server.js.
// Deploy this alone if the static site lives on Hostinger and you want the API free.
import { handleQuote } from './mailer.js';

export default async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN ?? '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const ip =
    (req.headers['cf-connecting-ip'] ??
     req.headers['x-forwarded-for']?.split(',')[0] ??
     'unknown').trim();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { status, payload } = await handleQuote(body ?? {}, ip);
    return res.status(status).json(payload);
  } catch (err) {
    console.error('[send] failed:', err);
    return res.status(500).json({
      ok: false,
      error: 'We could not send your message. Please email md@seyyamshippingline.com directly.',
    });
  }
}
