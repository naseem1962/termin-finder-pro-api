import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment");
  process.exit(1);
}

// On Vercel: connect at cold start so the app is ready for serverless invocations
if (process.env.VERCEL) {
  mongoose.connect(MONGODB_URI).catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
}

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
  app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
}

// Local: run server; Vercel: only export the app
if (!process.env.VERCEL) {
  start().catch(console.error);
}

export default app;
