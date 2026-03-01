import "dotenv/config";
import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contact.js";
import newsletterRoutes from "./routes/newsletter.js";

const app = express();
// Allow frontend from any origin (local + Vercel); origin: true reflects request origin
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);

app.get("/api/health", (_, res) => res.json({ ok: true }));

export default app;
