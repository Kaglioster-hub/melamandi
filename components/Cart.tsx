'use client';
import { DELIVERY_FEE, type Size, type Kind, priceMatrix } from "@/lib/pricing";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";

export type CartItem = {
  id: string; // uuid-ish
  title: string;
  kind: Kind;
  size: Size;
  selected?: string[];
  qty: number;
};

export default function Cart({
  items, setItems
}:{
  items: CartItem[];
  setItems: (f: (prev: CartItem[])=>CartItem[])=>void;
}){
  const subtotal = useMemo(()=> items.reduce((sum, it)=> sum + priceMatrix[it.kind][it.size]*it.qty, 0), [items]);
  const total = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

  function rm(id:string){ setItems(prev => prev.filter(x=>x.id!==id)); }
  function inc(id:string){ setItems(prev => prev.map(x=> x.id===id ? {...x, qty:x.qty+1} : x)); }
  function dec(id:string){ setItems(prev => prev.map(x=> x.id===id ? {...x, qty: Math.max(1, x.qty-1)} : x)); }

  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Carrello</div>
      {items.length===0 ? (
        <div className="text-sm opacity-70">Nessun articolo nel carrello.</div>
      ) : (
        <div className="space-y-3">
          {items.map(it => (
            <div key={it.id} className="p-3 rounded-xl border border-[var(--border)] flex items-center gap-3">
              <div className="text-sm font-medium">{it.title} <span className="opacity-70">({it.size})</span></div>
              {!!it.selected?.length && (
                <div className="text-xs opacity-70">• {it.selected.join(', ')}</div>
              )}
              <div className="ml-auto flex items-center gap-2">
                <button className="btn btn-ghost" onClick={()=> dec(it.id)}>-</button>
                <div className="w-8 text-center">{it.qty}</div>
                <button className="btn btn-ghost" onClick={()=> inc(it.id)}>+</button>
                <div className="w-24 text-right">€ {(priceMatrix[it.kind][it.size]*it.qty).toFixed(2)}</div>
                <button className="btn btn-ghost" onClick={()=> rm(it.id)}><Trash2 size={16}/></button>
              </div>
            </div>
          ))}

          <hr className="my-2"/>
          <div className="flex items-center justify-between text-sm">
            <span>Consegna</span><span>€ {DELIVERY_FEE.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Totale</span><span>€ {total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
