"use client";
import { useEffect, useState } from "react";

/** Finestra ordini attiva 18:00–22:00 ogni giorno (ora locale). */
function isWithinWindow(d = new Date()){
  const m = d.getHours()*60 + d.getMinutes();
  return m >= 18*60 && m < 22*60;
}

export default function OrderGate(){
  const compute = () => !isWithinWindow();
  const [locked, setLocked] = useState<boolean>(compute);

  // aggiorna ogni 15s per aprirsi/chiudersi da solo
  useEffect(()=>{ const id = setInterval(()=>setLocked(compute()), 15000); return ()=>clearInterval(id); },[]);
  // blocca scroll sotto overlay
  useEffect(()=>{ if(!locked) return; const prev=document.body.style.overflow; document.body.style.overflow="hidden"; return ()=>{document.body.style.overflow=prev}; },[locked]);

  if(!locked) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-[101] flex items-center justify-center h-full p-4">
        <article role="dialog" aria-modal="true"
          className="w-[min(92vw,520px)] rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 text-center shadow-2xl">
          <img src="/logo.png" onError={(e)=>{(e.target as HTMLImageElement).src='/mela.png'}} alt="MelaMandi" className="mx-auto mb-3 w-10 h-10" />
          <h2 className="text-xl font-semibold">Ordini non disponibili ora</h2>
          <p className="opacity-80 mt-2 text-sm">
            Il sito è attivo per gli ordini <b>tutti i giorni 18:00–22:00</b> (ora locale).
            Gli ordini effettuati in quella fascia vengono consegnati <b>il giorno successivo</b> nella fascia <b>14:00–18:00</b>.
          </p>
          <p className="opacity-70 mt-2 text-xs">
            Torna tra le <b>18:00</b> e le <b>22:00</b> per ordinare. Sotto vedi il sito in sola consultazione.
          </p>
        </article>
      </div>
    </div>
  );
}