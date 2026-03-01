import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_NAME = "TerminPro";
const FROM_EMAIL = process.env.SMTP_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "zafarzaeemmern@gmail.com";

function getBaseHtml(title, preheader) {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
  </noscript>
  <![endif]-->
  <style type="text/css">
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
    table { border-collapse: collapse; }
    .preheader { display: none !important; visibility: hidden; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 24px 16px; }
    .card { background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .heading { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 22px; font-weight: 600; color: #1a1a1a; margin: 0 0 16px 0; line-height: 1.3; }
    .text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #4a4a4a; line-height: 1.6; margin: 0 0 12px 0; }
    .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .value { font-size: 15px; color: #1a1a1a; margin-bottom: 16px; }
    .footer { font-size: 12px; color: #888; margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; }
    .brand { font-weight: 600; color: #2563eb; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5;">
  <span class="preheader">${preheader}</span>
  <div class="wrapper">
    <div class="card">
`;
}

function getBaseHtmlEnd() {
  return `
    </div>
    <p class="footer">Diese Nachricht wurde von TerminPro gesendet. Bei Fragen antworten Sie einfach auf diese E-Mail.</p>
  </div>
</body>
</html>`;
}

/** Contact form submission: notify admin */
export function buildContactAdminHtml(payload) {
  const { name, email, phone, message } = payload;
  const title = "Neue Kontaktanfrage – TerminPro";
  const preheader = `Neue Nachricht von ${name} (${email})`;
  let html = getBaseHtml(title, preheader);
  html += `<h1 class="heading">Neue Kontaktanfrage</h1>`;
  html += `<p class="text">Sie haben eine neue Nachricht über das Kontaktformular erhalten.</p>`;
  html += `<p class="label">Name</p><p class="value">${escapeHtml(name)}</p>`;
  html += `<p class="label">E-Mail</p><p class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`;
  if (phone) html += `<p class="label">Telefon</p><p class="value">${escapeHtml(phone)}</p>`;
  html += `<p class="label">Nachricht</p><p class="value" style="white-space:pre-wrap;">${escapeHtml(message)}</p>`;
  html += getBaseHtmlEnd();
  return html;
}

/** Newsletter welcome: confirm subscription */
export function buildNewsletterWelcomeHtml(email) {
  const title = "Willkommen beim TerminPro Newsletter";
  const preheader = "Sie haben sich erfolgreich angemeldet.";
  let html = getBaseHtml(title, preheader);
  html += `<h1 class="heading">Willkommen beim Newsletter</h1>`;
  html += `<p class="text">Vielen Dank für Ihre Anmeldung. Sie erhalten von uns künftig Updates zu TerminPro und nützliche Tipps rund um Terminbuchungen.</p>`;
  html += `<p class="text">Ihre E-Mail-Adresse: <strong>${escapeHtml(email)}</strong></p>`;
  html += `<p class="text">Wenn Sie sich nicht angemeldet haben, können Sie diese E-Mail ignorieren.</p>`;
  html += getBaseHtmlEnd();
  return html;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getPlainFallback(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function sendMail({ to, subject, html, text }) {
  const mailOptions = {
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    text: text || getPlainFallback(html),
    html,
    headers: {
      "X-Priority": "3",
      "X-Mailer": "TerminPro",
      "List-Unsubscribe": "<mailto:" + FROM_EMAIL + ">",
    },
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
}

export async function sendContactNotificationToAdmin(payload) {
  const subject = `[TerminPro] Neue Kontaktanfrage von ${payload.name}`;
  const html = buildContactAdminHtml(payload);
  await sendMail({
    to: ADMIN_EMAIL,
    subject,
    html,
  });
}

export async function sendNewsletterWelcome(toEmail) {
  const subject = "Ihre Anmeldung zum TerminPro Newsletter";
  const html = buildNewsletterWelcomeHtml(toEmail);
  await sendMail({
    to: toEmail,
    subject,
    html,
  });
}
