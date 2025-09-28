'use client';
import React, {useMemo, useState} from 'react';
import {useCart, type Size, type Fruit} from './CartProvider';

const SIZE_MULT: Record<Size, number> = { S:1, M:1.5, L:2 };

export function euro(n:number){
  return new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(n);
}

type Props = {
  name: 'Base'|'Esotico'|'Deluxe';
  // prezzo di listino (prima dello sconto); lo sconto 40% si applica in runtime
  listPrice: number;
  image: string;
  description: string;
};

function discount(p:number){ return Math.round(p * 0.6 * 100) / 100; }

const ALL_FRUITS: Fruit[] = ['Mele','Pere','Banane','Arance','Stagionale'];

export default function ProductCard({name,listPrice,image,description}:Props){
  const {add} = useCart();
  const [size,setSize] = useState<Size>('M');
  const [fruits,setFruits] = useState<Fruit[]>(['Stagionale']);
  const [qty,setQty] = useState(1);

  const unit = useMemo(()=> discount(listPrice) * SIZE_MULT[size], [listPrice,size]);
  const canAdd = fruits.length>0 && (fruits.includes('Stagionale') || fruits.length===2);

  function toggleFruit(f:Fruit){
    setFruits(prev=>{
      // Se scegli Stagionale, si azzera e resta solo Stagionale
      if (f==='Stagionale'){
        return ['Stagionale'];
      }
      // se c'è Stagionale, toglilo e parte da zero
      if (prev.includes('Stagionale')) prev = [];
      if (prev.includes(f)) return prev.filter(x=>x!==f);
      if (prev.length>=2) return prev; // max due
      return [...prev,f];
    });
  }

  return (
    <div className="card-slim rounded-2xl p-4 border border-[var(--border)] bg-[var(--panel)] shadow-sm">
      <div className="overflow-hidden rounded-xl mb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={name} className="w-full h-44 object-cover" />
      </div>
      <div className="title text-lg">{name}</div>
      <p className="text-sm opacity-80 mt-1">{description}</p>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs line-through opacity-50">{euro(listPrice)}</span>
        <span className="price text-base">{euro(unit)}</span>
      </div>

      <div className="mt-3">
        <div className="opts">
          {(['S','M','L'] as Size[]).map(s=>(
            <button key={s}
              onClick={()=>setSize(s)}
              className={chip }>{s}</button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm mb-1">Scegli 2 frutti <span className="opacity-60">(oppure Stagionale)</span></div>
        <div className="opts">
          {ALL_FRUITS.map(f=>(
            <button key={f} onClick={()=>toggleFruit(f)}
              className={chip }>{f}</button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1, parseInt(e.target.value||'1',10)))} className="w-16 rounded-lg px-2 py-1 bg-transparent border border-[var(--border)]"/>
        <button disabled={!canAdd}
          onClick={()=> add({name, size, fruits, unit, qty})}
          className="cta btn btn-primary w-full bg-gradient-to-r from-brand-green to-brand-orange rounded-xl px-4 py-2">
          Aggiungi al carrello • {euro(unit*qty)}
        </button>
      </div>
    </div>
  );
}
