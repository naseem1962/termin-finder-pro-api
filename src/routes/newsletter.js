import { Router } from "express";
import validator from "validator";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import { sendNewsletterWelcome } from "../lib/email.js";

const router = Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string" || !validator.isEmail(email.trim())) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const normalized = email.trim().toLowerCase();
    const existing = await NewsletterSubscriber.findOne({ email: normalized });
    if (existing) {
      return res.status(200).json({ success: true, message: "Already subscribed" });
    }

    await NewsletterSubscriber.create({
      email: normalized,
      source: req.body.source || "website",
    });

    await sendNewsletterWelcome(normalized);

    res.status(201).json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ success: true, message: "Already subscribed" });
    }
    console.error("Newsletter subscribe error:", err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

export default router;







