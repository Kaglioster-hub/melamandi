'use client';
import { useEffect, useState } from "react";
import BasketCard, { type ItemOptions } from "@/components/BasketCard";
import Cart, { type CartItem } from "@/components/Cart";
import QuoteForm from "@/components/QuoteForm";
import Checkout from "@/components/Checkout";
import { products, priceMatrix } from "@/lib/pricing";

function uuid(){ return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

export default function Page(){
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(()=>{
    const raw = localStorage.getItem('mm-cart');
    if(raw) try{ setItems(JSON.parse(raw)); }catch{}
  }, []);

  useEffect(()=>{
    localStorage.setItem('mm-cart', JSON.stringify(items));
  }, [items]);

  function onAdd(opts: ItemOptions){
    setItems(prev => [...prev, { id: uuid(), title: opts.title, kind: opts.kind, size: opts.size, selected: opts.selected, qty: 1 }]);
    const el = document.getElementById('carrello'); el?.scrollIntoView({behavior:'smooth'});
  }

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MelaMandi",
    "url": typeof window !== "undefined" ? window.location.origin : "https://melamandi.local",
    "logo": "/mela.png",
    "sameAs": []
  };

  const productsLd = {
    "@context": "https://schema.org",
    "@graph": products.map(p => ({
      "@type": "Product",
      "name": `Cesto ${p.title}`,
      "image": p.image,
      "description": p.description,
      "brand": { "@type":"Brand", "name":"MelaMandi" },
      "offers": {
        "@type":"AggregateOffer",
        "priceCurrency":"EUR",
        "lowPrice": Math.min(...Object.values(priceMatrix[p.kind])),
        "highPrice": Math.max(...Object.values(priceMatrix[p.kind])),
        "offerCount": 3,
        "availability": "https://schema.org/InStock"
      }
    }))
  };

  return (
    <main>
      <section className="container py-10 text-center">
        <div className="flex items-center justify-center gap-3">
          <img src="/mela.png" alt="" className="h-10 w-10 rounded-xl border border-[var(--border)]" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand.green to-brand.purple inline-block text-transparent bg-clip-text">
            MelaMandi
          </h1>
        </div>
        <p className="opacity-70 mt-2">Cesti di frutta rivisitati. Consegna Roma Nord.</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <a className="btn btn-primary" href="#catalogo">Ordina</a>
          <a className="btn btn-ghost" href="#preventivo">Preventivo</a>
        </div>
        {/* SEO JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(productsLd)}} />
      </section>

      <section id="catalogo" className="container pb-10">
        <h2 className="text-2xl font-semibold mb-4">Catalogo</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {products.map(p => (
            <BasketCard
              key={p.id}
              id={p.id}
              title={p.title}
              image={p.image}
              kind={p.kind}
              blurb={p.blurb}
              description={p.description}
              onAdd={onAdd}
            />
          ))}
        </div>
      </section>

      <section id="carrello" className="container grid md:grid-cols-2 gap-6">
        <Cart items={items} setItems={setItems} />
        <Checkout items={items} />
      </section>

      <section className="container my-10">
        <QuoteForm />
      </section>

      <section className="container my-10">
        <div className="card p-4">
          <div className="font-semibold mb-1">Zone servite</div>
          <p className="text-sm opacity-80">
            00188 • 00189 • Riano • Castelnuovo di Porto • Morlupo • Pontestorto • Monterotondo • Settebagni
          </p>
        </div>
      </section>
    </main>
  );
}
