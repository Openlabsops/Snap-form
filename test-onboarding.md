# Onboarding Flow — Test Guide

Complete end-to-end steps to spin up the stack and test the `/onboarding` feature from scratch.

---

## Prerequisites

- Docker installed and running
- `bun` installed (`bun --version`)
- Repo cloned and dependencies installed

---

## Step 1 — Start the Database (Docker)

The project uses a local Postgres container named `snapform-postgres-new`.

```bash
docker start snapform-postgres-new
```

**Verify it's running:**

```bash
docker ps | grep snapform-postgres-new
```

You should see `Up X seconds` in the status column.

> **If the container doesn't exist yet**, create it:
> ```bash
> docker run --name snapform-postgres-new \
>   -e POSTGRES_USER=postgres \
>   -e POSTGRES_PASSWORD=postgres \
>   -e POSTGRES_DB=snapform \
>   -p 5432:5432 \
>   -d postgres:16-alpine
> ```

---

## Step 2 — Apply Database Migrations

Run from the `packages/db` directory. This applies all migrations including `add_onboarding_fields`.

```bash
cd packages/db
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/snapform?schema=public" \
  bun --bun run prisma migrate deploy
cd ../..
```

> **If you hit a schema drift error** (DB out of sync with migrations), reset the dev DB:
> ```bash
> cd packages/db
> bun --bun run prisma migrate reset --force
> cd ../..
> ```

---

## Step 3 — Install Dependencies

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/snapform?schema=public" \
  bun install
```

The `DATABASE_URL` env var is needed because `@repo/db`'s postinstall script runs `prisma generate`.

---

## Step 4 — Start the Dev Servers

From the monorepo root:

```bash
bun run dev
```

This starts all apps via Turborepo:

| App | URL |
|---|---|
| **API** (Express) | `http://localhost:3000` |
| **Web** (Next.js) | `http://localhost:3001` |

Expected output:
```
api:dev: Express API running on port 3000
web:dev: ▲ Next.js 16.2.9 (Turbopack)
web:dev: - Local: http://localhost:3001
```

> The API uses `bun --watch`, so any changes to API source files will auto-reload without restarting.

---

## Step 5 — Create a Test User (Register)

Run this in your terminal:

```bash
curl -X POST http://localhost:3000/api/v1/auth/manual/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'
```

**Expected response:**
```json
{
  "token": "...",
  "user": {
    "name": "Test User",
    "email": "test@test.com",
    "emailVerified": false,
    "username": null,
    "id": "..."
  }
}
```

---

## Step 6 — Log In from the Browser (to set the session cookie)

Open **`http://localhost:3001/onboarding`** in your browser, then paste this in the **DevTools Console** (`F12` → Console tab):

```js
await fetch("http://localhost:3000/api/v1/auth/manual/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ email: "test@test.com", password: "password123" })
}).then(r => r.json()).then(console.log)
```

You should see the user object logged. The session cookie is now set on `localhost:3001`.

---

## Step 7 — Test the Onboarding Form

Navigate to **`http://localhost:3001/onboarding`**.

### ✅ Happy path

| Field | Value |
|---|---|
| Username | `testuser` |
| X (Twitter) | `https://x.com/testuser` *(optional)* |
| LinkedIn | `https://linkedin.com/in/testuser` *(optional)* |
| Instagram | `https://instagram.com/testuser` *(optional)* |

Click **Continue to dashboard →**

**Expected:** Redirects to `/dashboard` (page may be empty — that's fine, the redirect means success). Check the network tab for a `200` response from `/api/v1/user/onboarding`.

---

### ❌ Error cases to verify

| Scenario | Expected behaviour |
|---|---|
| Empty username | Red inline error: *"Username is required"* |
| Username too short (e.g. `ab`) | Error: *"3–30 chars, lowercase letters, numbers, underscores only"* |
| Username with uppercase/spaces | Same format error |
| Invalid URL in a social field | Red inline error: *"Must be a valid URL"* |
| Duplicate username (same name, different account) | `409` from API, error shown: *"This username is already taken"* |

---

## Step 8 — Verify in the Database

```bash
cd packages/db
bun --bun run prisma studio
```

This opens Prisma Studio at `http://localhost:5555`. Navigate to the **users** table and confirm:
- `username` is set
- `onboardingCompleted` is `true`
- Social URL fields are populated (or `null` if left blank)

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Can't reach database server at localhost:5432` | `docker start snapform-postgres-new` |
| `Cannot find module '.prisma/client/default'` | `cp -r node_modules/.bun/@prisma+client@*/node_modules/.prisma node_modules/.prisma` |
| `401 Unauthorized` on form submit | You're not logged in — redo Step 6 |
| `Network error` on form submit | CORS issue — make sure the API restarted after `app.ts` changes |
| Port 3000 already in use | Kill old process: `lsof -ti:3000 \| xargs kill` |
