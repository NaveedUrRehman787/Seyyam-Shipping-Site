// End-to-end: real Express server + real SMTP + real HTTP POST from the form's shape.
import nodemailer from 'nodemailer';
import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';

const acct = await nodemailer.createTestAccount();
const env = {
  ...process.env,
  SMTP_HOST: acct.smtp.host, SMTP_PORT: String(acct.smtp.port),
  SMTP_USER: acct.user, SMTP_PASS: acct.pass,
  INBOX: 'md@seyyamshippingline.com',
  ALLOWED_ORIGIN: 'https://seyyamshippingline.com',
  PORT: '4321',
};
delete env.TURNSTILE_SECRET;

const srv = spawn('node', ['api/server.js'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
srv.stdout.on('data', (d) => process.stdout.write('  [server] ' + d));
srv.stderr.on('data', (d) => process.stdout.write('  [server:err] ' + d));

for (let i = 0; i < 40; i++) {
  try { await fetch('http://localhost:4321/api/health'); break; } catch { await wait(250); }
}

const post = (body) => fetch('http://localhost:4321/api/send', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

let ok = 0, n = 0;
const check = (label, cond, extra = '') => {
  n++; if (cond) ok++;
  console.log(`${cond ? '✓' : '✗'}  ${label}${extra ? '  ' + extra : ''}`);
};

const health = await (await fetch('http://localhost:4321/api/health')).json();
check('GET /api/health responds', health.ok === true);

const res = await post({
  name: 'Sarah Chen', email: 'sarah@example.com', phone: '+44 7700 900123',
  service: 'Quality Inspection & Control',
  message: 'Pre-shipment inspection for 5,000 units in Ningbo, AQL 2.5.',
});
const body = await res.json();
check('POST /api/send accepts a valid lead', res.status === 200 && body.ok === true, `→ ${res.status}`);
check('CORS origin is locked to the site',
  res.headers.get('access-control-allow-origin') === 'https://seyyamshippingline.com',
  `→ ${res.headers.get('access-control-allow-origin')}`);

const bad = await post({ name: 'X', email: 'nope', message: '' });
check('POST rejects invalid input with 422', bad.status === 422, `→ ${bad.status}`);

const opt = await fetch('http://localhost:4321/api/send', { method: 'OPTIONS' });
check('OPTIONS preflight returns 204', opt.status === 204, `→ ${opt.status}`);

const wrong = await fetch('http://localhost:4321/api/send', { method: 'GET' });
check('GET /api/send is not routed as send', wrong.status !== 200, `→ ${wrong.status}`);

srv.kill();
console.log(`\n${ok}/${n} checks passed`);
process.exit(ok === n ? 0 : 1);
