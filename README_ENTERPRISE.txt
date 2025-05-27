
MELAMANDI – VERSIONE FINALE BLINDATA

✔ Protezioni avanzate incluse:
- Validazione forte input (da integrare: zod)
- Possibilità CAPTCHA (da attivare: Google reCAPTCHA v2)
- Logging errori (tabella Supabase orders_failed)
- Tracking stato ordine
- Dashboard con login e gestione ordini
- Coupon e clienti ricorrenti
- Schema Supabase completo e sicuro (con RLS)

📁 Struttura:
- /src/       → App frontend React
- /admin/     → Dashboard gestore
- /utils/     → Supabase client + helper
- /supabase/  → schema.sql + funzioni
- .env.local.example
- README_ENTERPRISE.txt

Come usare:
1. Setup Supabase con `schema.sql`
2. Copia `.env.local.example` → `.env.local`
3. Inserisci chiavi reali (PayPal, EmailJS, Supabase, ecc.)
4. npm install && npm run dev

👉 Dashboard accessibile via `/admin`
