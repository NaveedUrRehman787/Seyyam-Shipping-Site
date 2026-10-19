// Express server — for a VPS, or `npm run api` alongside `npm run dev`.
// For serverless (Vercel/Netlify), use api/send.js instead; both share mailer.js.
import 'dotenv/config';
import express from 'express';
import { handleQuote } from './mailer.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const ORIGIN = process.env.ALLOWED_ORIGIN ?? '*';

app.set('trust proxy', 1);                       // correct client IP behind a proxy/CDN
app.use(express.json({ limit: '32kb' }));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', ORIGIN);
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

app.post('/api/send', async (req, res) => {
  try {
    const { status, payload } = await handleQuote(req.body, req.ip);
    res.status(status).json(payload);
  } catch (err) {
    console.error('[send] failed:', err);
    res.status(500).json({
      ok: false,
      error: 'We could not send your message. Please email novasource72@gmail.com directly.',
    });
  }
});

// Serve the built site too, so a VPS can run everything from one process.
app.use(express.static('dist', { extensions: ['html'] }));

app.listen(PORT, () => console.log(`Mail API listening on http://localhost:${PORT}`));
