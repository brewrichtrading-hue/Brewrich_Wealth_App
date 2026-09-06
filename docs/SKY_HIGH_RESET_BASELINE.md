# BREWRICH AI — BASELINE SNAPSHOT & SAFETY RECORD

**Date Recorded**: September 5, 2026  
**Environment**: macOS / Next.js 15.1.7 / Supabase Cloud  
**Status**: CLEAN PRODUCTION BASELINE ESTABLISHED

---

## 1. Git Repository State

| Property | Value |
| :--- | :--- |
| **Current Commit** | `2fefc64` (and clean working tree `main`) |
| **Uncommitted Changes** | None (clean repository state) |
| **Remote Branch** | `origin/main` (`github.com:brewrichtrading-hue/Brewrich_Wealth_App.git`) |
| **Last Verification Build** | Exit code 0 (`npm run build` — 19 routes compiled) |
| **Last Parser Test Suite** | 5/5 PASSED (`npx tsx tests/skyhigh/definedgeParser.test.ts`) |

---

## 2. Platform Architecture Baseline

| Layer | Implementation / Location |
| :--- | :--- |
| **Frontend Entrypoint** | `app/layout.tsx` (RootLayout) $\rightarrow$ `app/sky-high/page.tsx` |
| **Target Route** | `/sky-high` $\longrightarrow$ `components/SkyHighPage.tsx` |
| **Reference Experience** | `https://brewrich.in/aiinvesting` |
| **Backend Entrypoint** | Next.js App Router Route Handlers (`app/api/*`) |
| **Database Provider** | Supabase (PostgreSQL with RLS) |
| **Market Data Ingestion** | Definedge SDS API (`lib/skyhigh/definedgeService.ts`, `lib/skyhigh/definedgeAuth.ts`) |
| **Broker Integration Layer** | Server-side Broker Adapters (`Dhan`, `Firstock`) with **LIVE TRADING 🔒 LOCKED** |
| **Paper Portfolio Engine** | Server-side execution layer with atomic state updates, idempotency guards, and zero live execution |
| **Strategy Engine Location** | Pure server-side engine service boundary (Brewrich 400 Proprietary Engine) |

---

## 3. Build & Test Commands

- **TypeScript Verification**: `npx tsc --noEmit`
- **Unit & Parser Tests**: `npx tsx tests/skyhigh/definedgeParser.test.ts`
- **Production Next.js Build**: `npm run build`
- **Development Server**: `npm run dev`

---

## 4. Active Environment Variable Names (Protected)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `RESEND_API_KEY`

*(Values remain strictly isolated in `.env.local` and Vercel production environment; zero secrets exposed to client bundles or git.)*

---

## 5. Live Route Health Baseline

All primary platform routes are verified active and returning **HTTP 200 OK**:
- `https://brewrich.in/` $\longrightarrow$ 200 OK
- `https://brewrich.in/mfd` $\longrightarrow$ 200 OK
- `https://brewrich.in/miip` $\longrightarrow$ 200 OK
- `https://brewrich.in/sky-high` $\longrightarrow$ 200 OK
