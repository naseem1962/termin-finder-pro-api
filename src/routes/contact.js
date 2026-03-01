import { Router } from "express";
import validator from "validator";
import Contact from "../models/Contact.js";
import { sendContactNotificationToAdmin } from "../lib/email.js";
import { sendWhatsAppReminder, formatContactReminder } from "../lib/whatsapp.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email || typeof email !== "string" || !validator.isEmail(email.trim())) {
      return res.status(400).json({ error: "Valid email is required" });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const doc = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      message: message.trim(),
    });

    const payload = { name: doc.name, email: doc.email, phone: doc.phone, message: doc.message };

    await sendContactNotificationToAdmin(payload);

    const whatsappText = formatContactReminder(payload);
    const wa = await sendWhatsAppReminder(whatsappText);
    if (!wa.sent) {
      console.log("[Contact] WhatsApp not sent:", wa.reason || wa.error);
    }

    res.status(201).json({ success: true, id: doc._id });
  } catch (err) {
    console.error("Contact submit error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
