import { useState } from "react";
import { CHECKOUT } from "../lib/config.mjs";

export default function BasketCard({ item }){
  const [variant, setVariant] = useState("standard");
  const v = item.variants[variant];

  const stripe = CHECKOUT.stripe[item.key]?.[variant] || "";
  const paypal = CHECKOUT.paypal[item.key]?.[variant] || "";

  const go = (url) => {
    if(!url){ alert("Configura i link di checkout in .env"); return; }
    window.location.href = `/api/track?to=${encodeURIComponent(url)}&b=${item.key}&v=${variant}`;
  };

  return (
    <div className="glass p-4 neon-border">
      <img src={v.image} alt={item.title} className="rounded-xl h-40 w-full object-cover"/>
      <div className="mt-4">
        <h3 className="text-lg font-bold">{item.title}</h3>
        <p className="text-sm text-gray-300">{item.desc}</p>
      </div>

      <div className="mt-3 flex gap-2">
        {Object.keys(item.variants).map(k => (
          <button key={k}
            onClick={()=>setVariant(k)}
            className={`px-3 py-1 rounded-lg text-sm ${k===variant?'bg-white/20':'bg-white/10 hover:bg-white/20'}`}>
            {item.variants[k].label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-2xl font-extrabold">€ {v.price.toFixed(2)}</div>
          <div className="text-xs text-gray-400">IVA 22% inclusa</div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={()=>go(stripe)}>Paga con Stripe</button>
          <button className="btn-primary" onClick={()=>go(paypal)}>PayPal</button>
        </div>
      </div>

      <a href="#order" className="mt-3 inline-block text-sm underline opacity-80 hover:opacity-100">
        oppure prenota con modulo
      </a>
    </div>
  )
}
