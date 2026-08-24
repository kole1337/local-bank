# Verdant Bank

A demo SaaS portal for onboarding and managing bank customers, built as a portfolio piece. Two sides of one product:

- **Customers** submit an application (personal details → identity document), get notified when it's reviewed, and manage their account (balance, transactions, profile) once approved.
- **Bank staff** review applications in a card-based view (details + identity document), verify document fields, request resubmission, approve or decline — and monitor any customer's profile and transaction history.

## Stack

- **Next.js 16** (App Router, TypeScript, React 19) — Server Components + Server Actions, no separate API layer.
- **Tailwind CSS** — custom green/gray design tokens (`src/app/globals.css`).
- **Prisma + SQLite** — a local file database (`dev.db` at the project root), no external services required.
- **Auth** — hand-rolled: `bcryptjs` for password hashing, `jose` for a signed JWT session cookie, `src/proxy.ts` (Next's middleware convention) for route/role gating.
- **Identity photos** are stored as base64 data URLs directly in SQLite — no file storage or bucket needed, so the whole app is self-contained.

## Getting started

```bash
npm install
npm run db:push   # create the SQLite schema
npm run db:seed   # seed demo accounts and data
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Demo accounts

All seeded accounts use the password `Password123!`.

| Role | Email | Notes |
|---|---|---|
| Bank staff | `employee@verdant.bank` | Reviews applications, monitors customers |
| Customer | `jordan@example.com` | Approved, with transaction history |
| Customer | `priya@example.com` | Approved, with transaction history |
| Customer | `sam@example.com` | Pending — shows up in the staff review queue |
| Customer | `alex@example.com` | Declined, with a resubmission request — try uploading a new document from their profile |

Or open [`/onboarding`](http://localhost:3000/onboarding) to submit a brand-new application and walk it through review as staff yourself.

## Project structure

- `src/app` — routes: public (`/`, `/login`, `/onboarding`), customer (`/dashboard`, `/profile`), staff (`/admin`, `/admin/review/[userId]`, `/admin/customers`).
- `src/lib/actions` — Server Actions for onboarding, auth, application review, and notifications.
- `src/lib/auth.ts` / `src/proxy.ts` — session issuance/verification and route gating.
- `src/components` — `ui/` primitives, plus `onboarding/`, `admin/`, `customer/`, `layout/`.
- `prisma/schema.prisma` / `prisma/seed.ts` — data model and demo data.

## Notes

This is a fictional bank for demo purposes — no real financial data or integrations are involved.

## To do

[ ] introduce security layer

[ ] deploy demo

[ ] mobile app
