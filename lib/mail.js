// Sends the "Your Atlas key" email through Resend (resend.com). Needs RESEND_API_KEY.
// From address must be on the domain verified in Resend (get-atlas.com.au).
const FROM = () => (process.env.MAIL_FROM || 'Atlas <hello@get-atlas.com.au>').trim();
const REPLY_TO = () => (process.env.MAIL_REPLY_TO || 'hello@get-atlas.com.au').trim();
export const mailReady = () => Boolean((process.env.RESEND_API_KEY || '').trim());

export async function sendKeyEmail(to, key) {
  const link = 'https://app.get-atlas.com.au/activate.html';
  // Subject and preview stay neutral: inboxes get seen by other people.
  const text = [
    'Here is your Atlas key:',
    '',
    key,
    '',
    `Use it to open Atlas on any phone or computer: ${link}`,
    '',
    'Keep this email, or save the key somewhere safe. Atlas doesn\'t know who you are, so this key is how you get back in.',
    '',
    'Not useful? Reply within 30 days for a full refund.',
    '',
    'Atlas',
  ].join('\n');
  const html = `<!doctype html><html><body style="margin:0;background:#f7f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111">
<div style="max-width:480px;margin:0 auto;padding:32px 16px">
<div style="background:#fff;border:1px solid #e7e7e4;border-radius:20px;padding:28px 24px">
<p style="font-weight:700;font-size:18px;margin:0 0 16px">Atlas</p>
<p style="font-size:15px;line-height:1.55;color:#5f5f5b;margin:0 0 12px">Here is your Atlas key:</p>
<p style="font:600 18px/1.4 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.02em;background:#d4f062;border-radius:12px;padding:14px;text-align:center;margin:0 0 16px">${key}</p>
<p style="font-size:15px;line-height:1.55;color:#5f5f5b;margin:0 0 16px">Use it to open Atlas on any phone or computer.</p>
<p style="margin:0 0 20px"><a href="${link}" style="display:inline-block;background:#2743ff;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:999px">Open Atlas</a></p>
<p style="font-size:13.5px;line-height:1.55;color:#5f5f5b;margin:0 0 8px">Keep this email, or save the key somewhere safe. Atlas doesn't know who you are, so this key is how you get back in.</p>
<p style="font-size:13.5px;line-height:1.55;color:#5f5f5b;margin:0">Not useful? Reply within 30 days for a full refund.</p>
</div></div></body></html>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM(), to: [to], reply_to: REPLY_TO(), subject: 'Your Atlas key', text, html }),
  });
  if (!r.ok) throw new Error('mail: ' + r.status + ' ' + (await r.text()).slice(0, 200));
}
