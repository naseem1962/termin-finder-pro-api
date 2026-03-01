# TerminPro API (Express + MongoDB)

Standalone API for TerminPro. Deploy to Vercel or run locally.

## Setup (local)

1. Copy `.env.example` to `.env` and fill in values.
2. `npm install` then `npm run dev` or `npm start`.

## Deploy to Vercel

1. Install Vercel CLI (optional): `npm i -g vercel`
2. From this directory: `vercel` (or connect the repo in [Vercel Dashboard](https://vercel.com))
3. Add environment variables in Vercel: **Project → Settings → Environment Variables**
   - `MONGODB_URI` (required)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - `ADMIN_EMAIL`, `WHATSAPP_NUMBER`, `CALLMEBOT_API_KEY` (optional)
4. After deploy, set the frontend env `VITE_API_URL` to your API URL (e.g. `https://your-project.vercel.app/api`).

Local dev: `vercel dev` runs the API locally with Vercel’s dev server.

## Connecting frontend (local and Vercel)

- **Local:** Run this API with `npm run dev` (port 3001). In the frontend, leave `VITE_API_URL` unset so the Vite proxy forwards `/api` to `http://localhost:3001`.
- **Vercel:** Deploy this API, then in the frontend Vercel project set `VITE_API_URL` to your API URL (e.g. `https://your-api.vercel.app/api`). CORS allows the frontend origin.

## Environment

- `PORT` – API port (default 3001; Vercel sets this)
- `MONGODB_URI` – MongoDB Atlas connection string (required)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` – SMTP for emails
- `ADMIN_EMAIL` – Receives contact form submissions
- `WHATSAPP_NUMBER` – Number for WhatsApp reminders
- `CALLMEBOT_API_KEY` – Optional. [CallMeBot](https://www.callmebot.com/blog/free-whatsapp-api/) key for WhatsApp reminders.

## Endpoints

- `POST /api/contact` – Contact form (name, email, phone?, message)
- `POST /api/newsletter/subscribe` – Newsletter signup (email)
- `GET /api/health` – Health check
