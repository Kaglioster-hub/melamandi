"use client";
import React, {useState} from "react";
import {useCart, DELIVERY_FEE} from "./CartProvider";

export default function CartCheckout(){
  const {items, remove, clear, subtotal, delivery, total} = useCart();
  const [note, setNote] = useState("");

  async function confirm(){
    try{
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {"content-type":"application/json"},
        body: JSON.stringify({items, note, subtotal, delivery, total})
      });
      if (res.ok){
        const data = await res.json().catch(()=> ({}));
        if (data?.url) { location.href = data.url; return; }
      }
      alert("Ordine registrato (demo). Totale € " + total.toFixed(2));
      clear();
    }catch{
      alert("Ordine registrato localmente. Totale € " + total.toFixed(2));
      clear();
    }
  }

  return (
    <aside className="checkout">
      <h3>Checkout</h3>
      {items.length===0 ? <p className="muted">Nessun articolo nel carrello.</p> : (
        <>
          <ul className="cart-list">
            {items.map(it=>(
              <li key={it.id}>
                <div>
                  <div className="line-name">{it.name} {it.size}</div>
                  <div className="line-sub">{it.seasonal ? "Stagionale" : it.fruits.join(" + ")}</div>
                </div>
                <div className="line-price">€ {(it.price*it.qty).toFixed(2)}</div>
                <button className="chip" onClick={()=>remove(it.id)} aria-label="Rimuovi">×</button>
              </li>
            ))}
          </ul>
          <div className="sum">
            <div><span>Subtotale</span><span>€ {subtotal.toFixed(2)}</span></div>
            <div><span>Consegna</span><span>€ {delivery.toFixed(2)}</span></div>
            <div className="total"><span>Totale</span><span>€ {total.toFixed(2)}</span></div>
          </div>
          <textarea className="note" placeholder="Note per il corriere (opzionale)" value={note} onChange={e=>setNote(e.target.value)} />
          <button className="btn-primary" onClick={confirm}>Conferma ordine</button>
          <p className="muted tiny">Consegna fissa €{DELIVERY_FEE.toFixed(2)}. Pagamenti reali (Stripe/PayPal) attivabili appena fornite le chiavi.</p>
        </>
      )}
    </aside>
  );
}