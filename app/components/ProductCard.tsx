"use client";
import React, {useMemo, useState} from "react";
import {useCart} from "./CartProvider";

type Size = "S"|"M"|"L";
const MULT: Record<Size, number> = { S: 1, M: 1.5, L: 2 };

export default function ProductCard(props:{
  name: string;
  listPrice: number;   // prezzo "pieno" – applichiamo -40%
  image: string;
  description: string;
  fruits: string[];
}){
  const {add} = useCart();
  const [size,setSize] = useState<Size>("M");
  const [seasonal,setSeasonal] = useState(false);
  const [selected,setSelected] = useState<string[]>([]);

  const discounted = useMemo(()=> Math.round(props.listPrice * 60) / 100, [props.listPrice]); // -40%
  const unitPrice = useMemo(()=> +(discounted * MULT[size]).toFixed(2), [discounted, size]);

  function toggleFruit(f:string){
    if (seasonal) return;
    setSelected(prev=>{
      if (prev.includes(f)) return prev.filter(x=>x!==f);
      if (prev.length >= 2) return [prev[1], f];
      return [...prev, f];
    });
  }

  function addToCart(){
    add({
      name: props.name,
      size,
      seasonal,
      fruits: seasonal ? [] : selected.slice(0,2),
      price: unitPrice
    });
  }

  return (
    <article className="product-card">
      <figure className="thumb"><img src={props.image} alt={props.name} /></figure>
      <header className="title">
        <div className="name">{props.name}</div>
        <div className="price">da € {unitPrice.toFixed(2)}</div>
      </header>
      <p className="desc">{props.description}</p>

      <div className="sizes">
        {(["S","M","L"] as Size[]).map(s => (
          <button key={s} onClick={()=>setSize(s)} className={`chip ${size===s?"active":""}`}>{s}</button>
        ))}
      </div>

      <div className="fruit-grid">
        {props.fruits.map(f => (
          <button key={f}
            className={`chip ${!seasonal && selected.includes(f) ? "active":""}`}
            onClick={()=>toggleFruit(f)}
            disabled={seasonal}
            aria-pressed={!seasonal && selected.includes(f)}
          >
            {f}
          </button>
        ))}
        <button
          className={`chip ${seasonal?"active":""}`}
          onClick={()=>{ setSeasonal(v=>!v); if (!seasonal) setSelected([]); }}
          aria-pressed={seasonal}
        >
          Stagionale
        </button>
      </div>

      <button className="btn-primary" onClick={addToCart}>
        Aggiungi al carrello • € {unitPrice.toFixed(2)}
      </button>
    </article>
  );
}