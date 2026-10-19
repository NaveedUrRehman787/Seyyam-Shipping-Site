import nodemailer from 'nodemailer';

// Real SMTP server (Ethereal) so we exercise the actual send path, not a mock.
const acct = await nodemailer.createTestAccount();
process.env.SMTP_HOST = acct.smtp.host;
process.env.SMTP_PORT = String(acct.smtp.port);
process.env.SMTP_USER = acct.user;
process.env.SMTP_PASS = acct.pass;
process.env.INBOX     = 'novasource72@gmail.com';
delete process.env.TURNSTILE_SECRET;   // captcha disabled for this run
console.log(`SMTP: ${acct.smtp.host}:${acct.smtp.port} as ${acct.user}\n`);

const { handleQuote } = await import('../api/mailer.js');

const t = async (label, body, ip) => {
  const r = await handleQuote(body, ip);
  const pass = r.status === body.__expect;
  console.log(`${pass ? '✓' : '✗'}  ${label.padEnd(42)} → ${r.status} ${JSON.stringify(r.payload)}`);
  return pass;
};

const valid = {
  name: 'Sarah Chen', email: 'sarah@example.com', phone: '+44 7700 900123',
  service: 'Factory Audit & Verification',
  message: 'Need an audit of a bag factory in Guangzhou.\n2,000 units, shipping to Manchester UK by November.',
};

let ok = 0, n = 0;
const run = async (...a) => { n++; if (await t(...a)) ok++; };

await run('valid submission sends both emails', { ...valid, __expect: 200 }, '10.0.0.1');
await run('honeypot filled → silent 200',        { ...valid, website: 'http://spam.ru', __expect: 200 }, '10.0.0.2');
await run('missing name → 422',                  { ...valid, name: '', __expect: 422 }, '10.0.0.3');
await run('bad email → 422',                     { ...valid, email: 'not-an-email', __expect: 422 }, '10.0.0.4');
await run('empty message → 422',                 { ...valid, message: '', __expect: 422 }, '10.0.0.5');
await run('header injection in name → 422',      { ...valid, name: 'X\r\nBcc: a@b.c', __expect: 422 }, '10.0.0.6');

console.log('\n-- rate limit: 4 rapid posts from one IP --');
for (let i = 1; i <= 4; i++) {
  n++;
  const r = await handleQuote(valid, '10.9.9.9');
  const expect = i <= 3 ? 200 : 429;
  const pass = r.status === expect;
  if (pass) ok++;
  console.log(`${pass ? '✓' : '✗'}  attempt ${i} → ${r.status} (expected ${expect})`);
}

console.log(`\n${ok}/${n} checks passed`);
process.exit(ok === n ? 0 : 1);
