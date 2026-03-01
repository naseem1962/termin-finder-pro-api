/**
 * WhatsApp notification via CallMeBot (free).
 * Register your number at: https://www.callmebot.com/blog/free-whatsapp-api/
 * You'll get an API key to add as CALLMEBOT_API_KEY in .env
 */
const WHATSAPP_NUMBER = (process.env.WHATSAPP_NUMBER || "923343338690").replace(/\D/g, "");
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY;
const BASE_URL = "https://api.callmebot.com/whatsapp.php";

export async function sendWhatsAppReminder(text) {
  if (!CALLMEBOT_API_KEY) {
    console.log("[WhatsApp] CALLMEBOT_API_KEY not set – skipping. Get key at https://www.callmebot.com/blog/free-whatsapp-api/");
    return { sent: false, reason: "no_api_key" };
  }
  try {
    const url = new URL(BASE_URL);
    url.searchParams.set("phone", WHATSAPP_NUMBER);
    url.searchParams.set("text", text);
    url.searchParams.set("apikey", CALLMEBOT_API_KEY);
    const res = await fetch(url.toString());
    const ok = res.ok;
    const body = await res.text();
    if (!ok) console.warn("[WhatsApp] CallMeBot error:", res.status, body);
    return { sent: ok, body };
  } catch (err) {
    console.warn("[WhatsApp] Error:", err.message);
    return { sent: false, error: err.message };
  }
}

/** Format contact submission for WhatsApp reminder */
export function formatContactReminder(payload) {
  const { name, email, phone, message } = payload;
  const lines = [
    "TerminPro – Neue Kontaktanfrage",
    "",
    `Name: ${name}`,
    `E-Mail: ${email}`,
    phone ? `Telefon: ${phone}` : null,
    "",
    `Nachricht: ${message}`,
  ].filter(Boolean);
  return lines.join("\n");
}
