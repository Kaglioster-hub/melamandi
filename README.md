# MelaMandi – Super Deluxe

Cesti di frutta artigianali (Base / Mix / Deluxe • Standard ed Exotic) con 3 taglie (S, M, L), tema dark/light e carrello con checkout via email.

## Avvio rapido

```bash
pnpm i    # oppure npm install / yarn
pnpm dev  # http://localhost:3000
```

## Deploy
1) Collega il repo a Vercel.
2) Build automatica (`next build`).

### Varianti e logica
- **Base**: scegli 1 frutto standard (mele, pere, banane, arance, stagionale).
- **Mix**: scegli 3 frutti standard.
- **Deluxe**: include tutti i frutti standard.
- **Base Exotic**: scegli 1 tra mango, avocado, esotico del giorno.
- **Mix Exotic**: scegli 3 tra mango, avocado, papaya.
- **Deluxe Exotic**: mango, avocado, papaya + esotico del giorno.

Consegna: 8,90 € nelle zone servite (00188, 00189, Riano, Castelnuovo di Porto, Morlupo, Pontestorto, Monterotondo, Settebagni).


## Email ordini via SMTP
Compila `.env` con le credenziali SMTP (info@vrabo.it). L'API `POST /api/order` invia:
- Email a ORDERS_TO (default `info@vrabo.it`)
- Conferma al cliente se ha inserito l'email

## Pagamenti
- **Carta**: link di pagamento inviato via email / alla consegna (placeholder).
- **PayPal**: apertura `NEXT_PUBLIC_PAYPAL_ME` e riepilogo via email.
- **Crypto**: mostra `NEXT_PUBLIC_CRYPTO_ADDRESS`.


## Coupon via `.env`
Imposta su Vercel o in locale:
```
NEXT_PUBLIC_COUPON_ACTIVE=true
NEXT_PUBLIC_COUPON_CODE=COUPON12
NEXT_PUBLIC_COUPON_DISCOUNT=0.12
```
Il checkout calcola lo **sconto 12%** sul totale (esclusa consegna) se il codice è valido.
La riga coupon è riportata anche nell'email ordine.

## Stripe – placeholders
- `STRIPE_SECRET` = XxxxxxxxxxxxxxxxxxX
- `STRIPE_ENDPOINT_SECRET` = XxxxxxxxxxxxxxxxxxX
Webhook placeholder: `POST /api/webhook/stripe` (da collegare quando attivi Stripe).


## Fatturazione
- Se usi **Stripe Checkout** con `STRIPE_SECRET` e abiliti `ISSUE_INTERNAL_INVOICE=true`, al webhook `checkout.session.completed` generiamo una **fattura PDF** (via pdfkit) e la inviamo via SMTP a te e al cliente.
- Configura i dati fiscali in `.env`:
```
ISSUE_INTERNAL_INVOICE=true
BILLING_ISSUER_NAME=MelaMandi
BILLING_ISSUER_VAT=IT00000000000
BILLING_ISSUER_ADDRESS=Via Esempio 1
BILLING_ISSUER_CITY=00188 Roma (RM)
BILLING_ISSUER_EMAIL=info@vrabo.it
```
> Nota: logica di **aliquote/IVA** semplificata: verifica sempre con il tuo consulente fiscale.
