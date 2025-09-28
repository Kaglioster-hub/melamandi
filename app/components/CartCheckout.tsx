'use client';
import React, {useState} from 'react';
import {useCart, DELIVERY} from './CartProvider';
import {euro} from './ProductCard';

export default function CartCheckout(){
  const {items, subtotal, delivery, total, remove, clear} = useCart();
  const [pay, setPay] = useState<'card'|'paypal'|'crypto'>('paypal');

  async function confirm(){
    // Tentativo POST API (se esiste).
    try{
      const res = await fetch('/api/checkout', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body: JSON.stringify({pay, items})
      });
      if (res.ok){
        const data = await res.json().catch(()=> ({}));
        if (data?.url) { location.href = data.url; return; }
        alert('Ordine inviato! Grazie 🙌');
        clear();
        return;
      }
    }catch{}
    alert('Ordine registrato localmente (demo). Sorgente carrello ok.');
  }

  return (
    <div className="checkout-sticky rounded-2xl p-4 border border-[var(--border)] bg-[var(--panel)]">
      <div className="text-lg font-semibold mb-3">Checkout</div>

      <div className="text-sm mb-2">Carrello</div>
      {items.length===0 && <div className="text-sm opacity-60">Nessun articolo nel carrello.</div>}
      {items.length>0 && (
        <ul className="space-y-2 mb-3">
          {items.map(it=>(
            <li key={it.id} className="flex items-start gap-2">
              <div className="text-sm flex-1">
                <div className="font-medium">{it.name} • {it.size} × {it.qty}</div>
                <div className="opacity-70 text-xs">{it.fruits.join(', ')}</div>
              </div>
              <div className="text-sm">{euro(it.unit*it.qty)}</div>
              <button onClick={()=>remove(it.id)} className="text-xs opacity-70 hover:opacity-100 underline">rimuovi</button>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-[var(--border)] my-3"></div>
      <div className="text-sm space-y-1">
        <div className="flex justify-between"><span>Subtotale</span><span>{euro(subtotal)}</span></div>
        <div className="flex justify-between"><span>Consegna</span><span>{items.length? euro(DELIVERY): euro(0)}</span></div>
        <div className="flex justify-between font-semibold"><span>Totale</span><span>{euro(total)}</span></div>
      </div>

      <div className="mt-3 text-sm">
        <div className="mb-1">Pagamento</div>
        <div className="flex gap-3">
          <label className="flex items-center gap-1"><input type="radio" checked={pay==='card'} onChange={()=>setPay('card')}/> Carta</label>
          <label className="flex items-center gap-1"><input type="radio" checked={pay==='paypal'} onChange={()=>setPay('paypal')}/> PayPal</label>
          <label className="flex items-center gap-1"><input type="radio" checked={pay==='crypto'} onChange={()=>setPay('crypto')}/> Crypto</label>
        </div>
      </div>

      <button disabled={items.length===0}
        onClick={confirm}
        className="mt-4 w-full btn btn-primary bg-gradient-to-r from-brand-green to-brand-orange rounded-xl px-4 py-2 disabled:opacity-50">
        Conferma ordine
      </button>
    </div>
  );
}
