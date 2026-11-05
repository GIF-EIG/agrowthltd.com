const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

const clean = (value, max = 2000) => String(value ?? '').trim().slice(0, max);
const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/enquiry') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return json({ success:false, error:'Method not allowed' }, 405);

    let data;
    try { data = await request.json(); }
    catch { return json({ success:false, error:'Invalid request' }, 400); }

    // Honeypot: bots often fill hidden fields.
    if (clean(data.website, 100)) return json({ success:true });

    const name = clean(data.name, 120);
    const email = clean(data.email, 160);
    const company = clean(data.company, 160);
    const phone = clean(data.phone, 80);
    const subject = clean(data.subject, 180);
    const message = clean(data.message, 5000);

    if (!name || !email || !phone || !subject || !message) return json({ success:false, error:'Please complete all required fields.' }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ success:false, error:'Please enter a valid email address.' }, 400);

    const safe = Object.fromEntries(Object.entries({name,email,company,phone,subject,message}).map(([k,v])=>[k,escapeHtml(v)]));
    const text = [
      'New AGrowth website enquiry', '',
      `Name: ${name}`, `Email: ${email}`, `Company: ${company || '-'}`, `Phone: ${phone}`,
      `Subject: ${subject}`, '', 'Message:', message
    ].join('\n');
    const html = `
      <h2>New AGrowth website enquiry</h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <tr><td><strong>Name</strong></td><td>${safe.name}</td></tr>
        <tr><td><strong>Email</strong></td><td>${safe.email}</td></tr>
        <tr><td><strong>Company</strong></td><td>${safe.company || '-'}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${safe.phone}</td></tr>
        <tr><td><strong>Subject</strong></td><td>${safe.subject}</td></tr>
      </table>
      <h3>Message</h3><p style="white-space:pre-wrap">${safe.message}</p>`;

    try {
      const result = await env.EMAIL.send({
        from: { email:'website@agrowth.rw', name:'AGrowth Website' },
        to: 'agrowth.adm@gmail.com',
        replyTo: { email, name },
        subject: `[AGrowth Website] ${subject}`,
        text,
        html,
      });
      return json({ success:true, messageId:result.messageId });
    } catch (error) {
      console.error('Email send failed', error?.code, error?.message);
      return json({ success:false, error:'Email service is not configured or temporarily unavailable.' }, 503);
    }
  },
};
