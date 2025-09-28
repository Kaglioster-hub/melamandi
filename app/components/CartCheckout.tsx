"use client";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

export default function CartCheckout(){
  const { items, remove, setQty, clear, subtotal, delivery, total } = useCart();
  const [note, setNote] = useState(""); const [method,setMethod] = useState<"card"|"paypal">("card");
  useEffect(()=>{ try{ const n = localStorage.getItem("mm-note"); if(n) setNote(n) }catch{} },[]);
  useEffect(()=>{ try{ localStorage.setItem("mm-note", note) }catch{} },[note]);

  const empty = items.length===0;
  async function onCheckout(){
    if(empty) return;
    try{
      const r = await fetch("/api/checkout",{ method:"POST", headers:{ "content-type":"application/json" }, body:JSON.stringify({items,note,method}) });
      if(r.ok){ const d = await r.json(); if(d?.url){ window.location.href = d.url; return; } }
    }catch{}
    alert("Ordine registrato (demo). Attiveremo i pagamenti reali quando inseriremo le chiavi Stripe/PayPal.");
  }

  return (
    <aside className="card md:sticky md:top-24 h-fit">
      <h3 className="text-lg font-semibold mb-2">Checkout</h3>
      {empty ? <p className="opacity-70 text-sm">Nessun articolo nel carrello.</p> : (
        <div className="space-y-3">
          {items.map(i=>(
            <div key={i.id} className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{i.name} <span className="opacity-70">{i.size}</span></div>
                <div className="text-sm opacity-70">{i.seasonal ? "Stagionale" : i.fruits.join(" + ")}</div>
                <div className="text-sm mt-1">€ {i.price.toFixed(2)} ×{" "}
                  <input type="number" min={1} value={i.qty}
                    onChange={e=>setQty(i.id, Number(e.target.value || 1))}
                    className="w-14 ml-2 rounded-md border border-[var(--border)] bg-transparent px-2 py-0.5"/>
                </div>
              </div>
              <div className="text-right">
                <button className="text-xs opacity-70 hover:opacity-100" onClick={()=>remove(i.id)}>✕</button>
                <div className="font-semibold mt-6">€ {(i.price*i.qty).toFixed(2)}</div>
              </div>
            </div>
          ))}
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Note per il corriere (opzionale)"
            className="mt-2 w-full rounded-lg border border-[var(--border)] bg-transparent p-2 text-sm" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotale</span><span>€ {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Consegna</span><span>€ {delivery.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-base"><span>Totale</span><span>€ {total.toFixed(2)}</span></div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <label className="inline-flex items-center gap-2"><input type="radio" checked={method==="card"} onChange={()=>setMethod("card")} /> Carta</label>
            <label className="inline-flex items-center gap-2"><input type="radio" checked={method==="paypal"} onChange={()=>setMethod("paypal")} /> PayPal</label>
          </div>
          <button onClick={onCheckout} disabled={empty} className="btn btn-primary w-full disabled:opacity-50">Conferma ordine</button>
          <p className="text-xs opacity-60">Consegna fissa €4.90. Pagamenti reali attivabili appena fornite le chiavi.</p>
          <button className="text-xs opacity-60 hover:opacity-100" onClick={clear}>Svuota carrello</button>
        </div>
      )}
    </aside>
  );
}