// Local preview: serves the built site AND a working mail API on one origin,
// backed by a real throwaway SMTP inbox so you can test the form for real.
import nodemailer from 'nodemailer';
import { spawn } from 'node:child_process';

const acct = await nodemailer.createTestAccount();

console.log('\n' + '='.repeat(66));
console.log('  PREVIEW SERVER + WORKING FORM');
console.log('='.repeat(66));
console.log('\n  Site:  http://localhost:3000\n');
console.log('  The quote form really sends. Both emails land in a throwaway');
console.log('  inbox — open it to read them:\n');
console.log('    Inbox:    https://ethereal.email/login');
console.log(`    User:     ${acct.user}`);
console.log(`    Password: ${acct.pass}`);
console.log('\n' + '='.repeat(66) + '\n');

spawn('node', ['api/server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    SMTP_HOST: acct.smtp.host,
    SMTP_PORT: String(acct.smtp.port),
    SMTP_USER: acct.user,
    SMTP_PASS: acct.pass,
    INBOX: 'novasource72@gmail.com',
    ALLOWED_ORIGIN: 'http://localhost:3000',
    PORT: '3000',
    TURNSTILE_SECRET: '',
  },
});
