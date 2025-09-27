'use client';
import { useMemo, useState } from "react";
import { priceMatrix, type Size, type Kind, baseFruits, exoticBaseChoices, exoticMixChoices, standardMixChoices } from "@/lib/pricing";
import { clsx } from "clsx";

export type ItemOptions = {
  selected?: string[];
  size: Size;
  kind: Kind;
  title: string;
};

export default function BasketCard({
  id, title, image, kind, blurb, description, onAdd
}:{
  id: string; title: string; image: string; kind: Kind; blurb: string; description: string;
  onAdd: (opts: ItemOptions)=>void;
}){
  const [size, setSize] = useState<Size>('M');
  const [choices, setChoices] = useState<string[]>([]);

  const {limit, pool, helper} = useMemo(()=>{
    switch(kind){
      case 'base':
        return { limit: 1, pool: baseFruits as readonly string[], helper: 'Scegli 1 frutto' };
      case 'mix':
        return { limit: 3, pool: standardMixChoices as readonly string[], helper: 'Scegli 3 frutti' };
      case 'deluxe':
        return { limit: 0, pool: baseFruits as readonly string[], helper: 'Tutti inclusi' };
      case 'baseExotic':
        return { limit: 1, pool: exoticBaseChoices as readonly string[], helper: 'Scegli 1 frutto esotico' };
      case 'mixExotic':
        return { limit: 3, pool: exoticMixChoices as readonly string[], helper: 'Scegli 3 frutti' };
      case 'deluxeExotic':
        return { limit: 0, pool: ['Mango','Avocado','Papaya','Frutta esotica del giorno'] as readonly string[], helper: 'Tutti inclusi' };
    }
  },[kind]);

  const price = priceMatrix[kind][size];

  function toggle(v: string){
    if(limit === 0) return;
    setChoices(prev => {
      const has = prev.includes(v);
      if(has) return prev.filter(x=>x!==v);
      if(prev.length >= limit) return [...prev.slice(1), v];
      return [...prev, v];
    });
  }

  function add(){
    const selected = limit === 0 ? pool.slice() : choices;
    if(limit > 0 && selected.length < limit) return;
    onAdd({ size, kind, selected, title });
  }

  return (
    <div className="card overflow-hidden">
      <div className="relative h-48 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={title} src={image} className="h-48 w-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold">{title}</div>
            <div className="text-sm opacity-70">{blurb}</div>
          </div>
          <div className="badge">da € {price.toFixed(2)}</div>
        </div>

        <p className="text-sm mt-2 opacity-80">{description}</p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {(['S','M','L'] as Size[]).map(s => (
            <button
              key={s}
              onClick={()=> setSize(s)}
              className={clsx('btn', size===s ? 'btn-primary' : 'btn-ghost')}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <div className="text-xs opacity-70">{helper}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {pool.map(p => (
              <button
                key={p}
                onClick={()=> toggle(p)}
                className={clsx('btn px-3 py-1.5 text-sm', limit===0 || choices.includes(p) ? 'btn-primary' : 'btn-ghost')}
                disabled={limit===0}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button onClick={add} className="btn btn-primary w-full mt-4">
          Aggiungi al carrello • € {price.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
