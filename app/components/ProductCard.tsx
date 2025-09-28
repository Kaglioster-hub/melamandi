"use client";
import { useMemo, useState } from "react";
import { useCart } from "./CartProvider";

type Props = { name:string; listPrice:number; image:string; description:string; fruits:string[] };
const SIZES:( "S"|"M"|"L")[] = ["S","M","L"];
const MULT:Record<"S"|"M"|"L",number> = { S:1, M:1.5, L:2 };

export default function ProductCard({ name, listPrice, image, description, fruits }:Props){
  // @pricing-patched
  const nameToKind = (n:string) => {
    const s = (n||"").toLowerCase();
    if (s.includes("esot")) return "mixExotic";
    if (s.includes("deluxe")) return "deluxe";
    return "base";
  } as (n:string)=>keyof typeof priceMatrix;

  const kind = nameToKind(name);
  const priceS = priceMatrix[kind].S;
  const priceM = priceMatrix[kind].M;
  const priceL = priceMatrix[kind].L;
  const { add } = useCart();
  const [size,setSize] = useState<"S"|"M"|"L">("M");
  const [sel,setSel] = useState<string[]>([]);
  const [seasonal,setSeasonal] = useState(false);

  const base = useMemo(()=> +(listPrice * 0.6).toFixed(2), [listPrice]);   // -40%
  const price = useMemo(()=> +(base * MULT[size]).toFixed(2), [base,size]);

  function toggleFruit(f:string){
    if(seasonal) setSeasonal(false);
    setSel(prev=>{
      const has = prev.includes(f);
      if(has) return prev.filter(x=>x!==f);
      if(prev.length===2) return [prev[1], f];
      return [...prev, f];
    });
  }
  function onAdd(){ if(!seasonal && sel.length!==2) return; add({ name, size, fruits:sel, seasonal, price }); }
  const valid = seasonal || sel.length===2;

  return (
    <article className="card">
      <img src={image} alt={name} className="w-full h-44 object-cover rounded-xl mb-3"/>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{name}</h3>
        <span className="text-sm opacity-70">da € {priceS.toFixed(2)}</span>
      </div>
      <p className="text-sm opacity-70 mt-1">{description}</p>

      <div className="mt-3 flex gap-2">
        {SIZES.map(s=>(
          <button key={s} onClick={()=>setSize(s)} className={`pill ${size===s ? "ring-2 ring-green-500" : ""}`}>{s}</button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {fruits.map(f=>(
          <button key={f} onClick={()=>toggleFruit(f)} className={`pill ${sel.includes(f) ? "ring-2 ring-green-500" : ""}`}>{f}</button>
        ))}
        <button onClick={()=>{ setSeasonal(!seasonal); setSel([]); }} className={`pill ${seasonal ? "ring-2 ring-green-500" : ""}`}>Stagionale</button>
      </div>

      <button onClick={onAdd} disabled={!valid} className="btn btn-primary w-full mt-4 disabled:opacity-50">
        Aggiungi al carrello • € {price.toFixed(2)}
      </button>
    </article>
  );
}