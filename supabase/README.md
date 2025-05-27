
# Melamandi Supabase Backend Setup

## Requisiti
- Account Supabase: https://supabase.com/
- Progetto attivo

## Setup
1. Crea un nuovo progetto su Supabase
2. Copia `schema.sql` nel pannello SQL → Esegui
3. In `.env.local` del frontend inserisci:

VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

## Files inclusi
- schema.sql → crea tabella ordini
- client.js → client Supabase frontend
- saveOrder.js → funzione per salvare un ordine

Pronto all'uso ✅
