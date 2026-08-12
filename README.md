# PennyWise AI — Finance Expense Tracker + AI Chatbot

Copyright (c) 2026 Piyush Barua

Full-stack expense tracker: React + TypeScript + Vite + Tailwind + Recharts on the front, Express + SQLite with JWT auth on the back. Every user only ever sees their own data.

This project is licensed under the MIT License. See the LICENSE file for details.

## Rate limiting

The API applies in-memory fixed-window rate limits. Authentication endpoints have strict per-IP and per-account limits, `/api/health` has a moderate public per-IP limit, and authenticated data routes have higher per-user and per-IP limits. AI chat has a lower authenticated limit to control model costs. Limits reset when the server restarts; use a shared store such as Redis before running multiple production server instances.

## Run it

https://cyperflow.vercel.app/dashboard

## Pages

| Route | Page | Contents |
| --- | --- | --- |
| `/login` | Login / Sign up | Real signup + login against the API, JWT stored in localStorage |
| `/dashboard` | Dashboard | Served by `GET /api/dashboard`: totals, category filter, budget progress, pie + bar charts, recent expenses |
| `/add` | Add Expense | Creates an expense via `POST /api/expenses` |
| `/history` | Expense History | Table with search, category/month filters, sorting and delete |
| `/budget` | Budget | Per-category monthly limits, upserted via `POST /api/budgets` |
| `/chat` | AI Chat | Chat persisted in `chat_messages`; replies computed from your own data |

## API

All routes except signup/login require `Authorization: Bearer <token>`, and every query is scoped to the token's user id.

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/auth/signup` | `{ name, email, password }` → `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` → `{ token, user }` |
| GET | `/api/auth/me` | current profile |
| GET | `/api/expenses` | filters: `category`, `month=YYYY-MM`, `search`, `limit` |
| POST | `/api/expenses` | `{ amount, category, description, date, method? }` |
| PATCH | `/api/expenses/:id` | partial update |
| DELETE | `/api/expenses/:id` | 204 on success |
| GET | `/api/budgets` | `?month=YYYY-MM` (defaults to current month) |
| POST | `/api/budgets` | upsert `{ category, amount, month? }` |
| GET | `/api/dashboard` | monthly total, trend, category split, 6-month series, budget progress |
| GET / POST | `/api/chat` | history / send a message and get a reply |

## Database (SQLite, `server/data/PennyWise AI.db`)

- **profiles** — `id, name, email (unique), password_hash, created_at`
- **expenses** — `id, user_id → profiles.id, amount, category, description, date, method, created_at`
- **budgets** — `id, user_id, month, category, amount, created_at`, unique per `(user_id, month, category)`
- **chat_messages** — `id, user_id, role ('user' | 'assistant'), message, created_at`

Passwords are bcrypt-hashed, tokens are JWTs (7-day expiry), and rows cascade-delete with their profile.

## AI chat

`POST /api/chat` uses your configured AI provider with your month's totals, budgets and latest expenses as grounding context plus the last 10 messages of the conversation. Set provider keys only in `server/.env`; never put them in frontend files or Git:

```env
GROQ_API_KEY=your-provider-key
GROQ_MODEL=llama-3.3-70b-versatile

```

Without a key — or if the API call fails or times out — it falls back to the rule-based assistant in `server/src/chatbot.js`, so chat always works. `GET /api/health` reports which mode is active.
