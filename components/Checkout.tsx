'use client';
import { useMemo, useState } from "react";
import type { CartItem } from "./Cart";
import { DELIVERY_FEE, priceMatrix } from "@/lib/pricing";
import { zoneIsServed } from "@/lib/zones";
import { COUPON_ACTIVE, COUPON_CODE, COUPON_DISCOUNT } from "@/lib/coupon";

const paypalMe = process.env.NEXT_PUBLIC_PAYPAL_ME || "https://paypal.me/vrabocore";
const paypalEmail = process.env.NEXT_PUBLIC_PAYPAL_EMAIL || "pay@vrabo.it";
const cryptoAddr = process.env.NEXT_PUBLIC_CRYPTO_ADDRESS || "0x";
const successUrl = process.env.NEXT_PUBLIC_SUCCESS_URL || "/success";
const cancelUrl = process.env.NEXT_PUBLIC_CANCEL_URL || "/cancel";

export default function Checkout({ items }:{ items: CartItem[] }){
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState("");
  const [method, setMethod] = useState<'card'|'paypal'|'crypto'>('card');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<string>('');

  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMsg, setCouponMsg] = useState<string>('');

  const [hp, setHp] = useState(''); // honeypot

  const subtotal = useMemo(()=> items.reduce((sum, it)=> sum + priceMatrix[it.kind][it.size]*it.qty, 0), [items]);
  const discount = (COUPON_ACTIVE && couponApplied) ? Math.round(subtotal * COUPON_DISCOUNT * 100) / 100 : 0;
  const total = subtotal > 0 ? subtotal + DELIVERY_FEE - discount : 0;
  const enabled = items.length>0 && zoneIsServed(zone) && !!name && !!address && !status.startsWith("Invio");

  function applyCoupon(){
    if(!COUPON_ACTIVE){
      setCouponMsg("Al momento non sono attivi coupon.");
      setCouponApplied(false);
      return;
    }
    const ok = couponInput.trim().toUpperCase() === COUPON_CODE.toUpperCase();
    setCouponApplied(ok);
    setCouponMsg(ok ? `Coupon applicato: -${Math.round(COUPON_DISCOUNT*100)}%` : "Coupon non valido");
  }

  function persistLastOrder(){
    try{
      const data = { name, total, method, zone };
      sessionStorage.setItem('mm-last-order', JSON.stringify(data));
    }catch{}
  }

  async function confirm(){
    setStatus("Invio ordine...");
    try{
      // 1) Email ordine
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "content-type":"application/json" },
        body: JSON.stringify({
          customer: { name, email, phone },
          address, zone, method,
          items,
          totals: { subtotal, delivery: DELIVERY_FEE, discount, total },
          coupon: { code: couponInput, applied: couponApplied, discountPct: COUPON_DISCOUNT },
          hp
        })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data?.error || 'Errore invio');
      setStatus("Ordine inviato! Ti abbiamo mandato una conferma via email.");

      // 2) Payment
      persistLastOrder();
      if(method==='paypal'){
        window.open(paypalMe, "_blank");
        window.location.href = successUrl + "?ref=paypal";
        return;
      }
      if(method==='crypto'){
        alert(`Indirizzo Crypto: ${cryptoAddr}`);
        window.location.href = successUrl + "?ref=crypto";
        return;
      }
      // card: Stripe Session per item + delivery, coupon via STRIPE_COUPON_ID (se impostato)
      const res2 = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type":"application/json" },
        body: JSON.stringify({
          items, successUrl, cancelUrl,
          delivery: DELIVERY_FEE,
          couponApplied,
          customer: { name, email, address, zone, couponCode: couponInput }
        })
      });
      const d2 = await res2.json();
      const url = d2?.url;
      if(url){ window.open(url, "_blank"); }
      window.location.href = successUrl + "?ref=card";
    }catch(e:any){
      setStatus("Errore: " + String(e?.message||e));
    }
  }

  return (
    <div className="card p-4" aria-label="Checkout">
      <div className="font-semibold mb-2">Checkout</div>
      <div className="grid gap-2">
        <label>
          Nome e cognome
          <input aria-label="Nome e cognome" placeholder="Nome e cognome" value={name} onChange={e=> setName(e.target.value)} />
        </label>
        <label>
          Email (per conferma)
          <input aria-label="Email" placeholder="Email (per conferma)" value={email} onChange={e=> setEmail(e.target.value)} />
        </label>
        <label>
          Telefono
          <input aria-label="Telefono" placeholder="Telefono" value={phone} onChange={e=> setPhone(e.target.value)} />
        </label>
        <label>
          Indirizzo
          <input aria-label="Indirizzo" placeholder="Indirizzo" value={address} onChange={e=> setAddress(e.target.value)} />
        </label>
        <label>
          CAP o Zona
          <input aria-label="CAP o Zona (00188, 00189, Riano, ...)" placeholder="CAP o Zona (00188, 00189, Riano, ...)" value={zone} onChange={e=> setZone(e.target.value)} />
        </label>

        {/* honeypot for bots */}
        <div style={{position:'absolute', left:'-10000px', top:'auto', width:'1px', height:'1px', overflow:'hidden'}} aria-hidden="true">
          <label>Lascia vuoto questo campo
            <input tabIndex={-1} value={hp} onChange={e=> setHp(e.target.value)} />
          </label>
        </div>

        {/* Coupon */}
        <div className="flex gap-2">
          <input aria-label="Codice coupon" placeholder="Codice coupon" value={couponInput} onChange={e=> setCouponInput(e.target.value)} />
          <button className="btn btn-ghost" onClick={applyCoupon} type="button">Applica</button>
        </div>
        {!!couponMsg && <div className="text-xs opacity-80">{couponMsg}</div>}

        {/* Metodo */}
        <fieldset className="flex items-center gap-4 text-sm">
          <legend className="sr-only">Metodo di pagamento</legend>
          <label className="flex items-center gap-2"><input type="radio" checked={method==='card'} onChange={()=> setMethod('card')} /> Carta</label>
          <label className="flex items-center gap-2"><input type="radio" checked={method==='paypal'} onChange={()=> setMethod('paypal')} /> PayPal</label>
          <label className="flex items-center gap-2"><input type="radio" checked={method==='crypto'} onChange={()=> setMethod('crypto')} /> Crypto</label>
        </fieldset>

        {/* Totali */}
        <div className="mt-2 text-sm">
          <div className="flex items-center justify-between"><span>Subtotale</span><span>€ {subtotal.toFixed(2)}</span></div>
          <div className="flex items-center justify-between"><span>Consegna</span><span>€ {DELIVERY_FEE.toFixed(2)}</span></div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-emerald-500"><span>Sconto coupon</span><span>-€ {discount.toFixed(2)}</span></div>
          )}
          <div className="flex items-center justify-between font-semibold"><span>Totale</span><span>€ {total.toFixed(2)}</span></div>
        </div>

        <button
          disabled={!enabled}
          className={"btn btn-primary mt-1 " + (!enabled ? "opacity-60 cursor-not-allowed" : "")}
          onClick={confirm}
          type="button"
          title={!zone ? "Inserisci zona" : (!enabled ? "Compila i campi richiesti / zona non servita" : "Conferma")}
        >
          {status.startsWith("Invio") ? "Invio in corso..." : "Conferma ordine"}
        </button>
        {!!status && <div className="text-xs mt-1 opacity-80">{status}</div>}
        <div className="text-xs opacity-70">
          PayPal: {paypalEmail} • Link: {paypalMe} • Crypto: {cryptoAddr}
        </div>
        <div className="text-xs opacity-70">
          Assistenza: <a className="underline" href="mailto:melamandi@vrabo.it">melamandi@vrabo.it</a> • +39 380 583 4799
        </div>
      </div>
    </div>
  );
}
