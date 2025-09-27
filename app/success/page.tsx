'use client';
import { useEffect, useState } from "react";

type LastOrder = {
  name?: string;
  total?: number;
  method?: string;
  zone?: string;
};

export default function SuccessPage(){
  const [order, setOrder] = useState<LastOrder|null>(null);
  useEffect(()=>{
    try{
      const raw = sessionStorage.getItem('mm-last-order');
      if(raw) setOrder(JSON.parse(raw));
    }catch{}
  }, []);

  return (
    <main className="container py-12">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold">Ordine confermato ✅</h1>
        <p className="opacity-80 mt-2">Grazie! Ti abbiamo inviato una mail di conferma. Ti contatteremo per la consegna.</p>
        {order && (
          <div className="mt-4 text-sm">
            <div><span className="opacity-70">Cliente:</span> {order.name}</div>
            <div><span className="opacity-70">Metodo:</span> {order.method}</div>
            <div><span className="opacity-70">Zona:</span> {order.zone}</div>
            <div className="font-semibold mt-1">Totale: € {Number(order.total||0).toFixed(2)}</div>
          </div>
        )}
        <a className="btn btn-primary mt-6 inline-block" href="/">Torna alla home</a>
      </div>
    </main>
  );
}
