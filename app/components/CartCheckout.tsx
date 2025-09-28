"use client";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "./CartProvider";

type Method = "card"|"paypal";

const ALLOWED_CAPS = ["00188","00189"];
const ALLOWED_TOWNS = [
  "riano","monterotondo","morlupo",
  "castelnuovo","castelnuovo di porto",
  "pontestorto","ponte storto","ponte torto",
  "settebagni"
];

const COUPONS: Record<string, {percent?:number; fixed?:number; freeship?:boolean}> = {
  BENVENUTO10: { percent: 10 },
  MELA5: { fixed: 5 },
  FREESHIP: { freeship: true }
};

const norm = (s:string) => (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
const onlyDigits = (s:string) => (s||"").replace(/\D/g,"");

function isCovered(town:string, cap:string){
  const t = norm(town);
  const c = onlyDigits(cap);
  if (["roma","rome","comune di roma","roma rm"].includes(t)) return ALLOWED_CAPS.includes(c);
  return ALLOWED_TOWNS.some(x => t.includes(x));
}

type Suggest = { id:string; label:string; street:string; houseNumber:string; town:string; cap:string; };

export default function CartCheckout(){
  const { items, remove, setQty, clear, subtotal } = useCart();

  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [phone, setPhone]   = useState("");

  // ricerca indirizzo
  const [query, setQuery]   = useState("");
  const [sugs, setSugs]     = useState<Suggest[]>([]);
  const [picked, setPicked] = useState<Suggest|null>(null);
  const [addrConfirmed, setAddrConfirmed] = useState(false);

  const address = useMemo(()=> picked ? [picked.street, picked.houseNumber].filter(Boolean).join(" ") : "", [picked]);
  const town    = useMemo(()=> picked?.town || "", [picked]);
  const cap     = useMemo(()=> picked?.cap  || "", [picked]);

  const [method, setMethod] = useState<Method>("card");
  const [hasCoupon, setHasCoupon] = useState(false);
  const [coupon, setCoupon]       = useState("");
  const [applied, setApplied]     = useState<{code:string; percent?:number; fixed?:number; freeship?:boolean} | null>(null);
  const [note, setNote]           = useState("");

  useEffect(()=>{ try{ const n=localStorage.getItem("mm-note"); if(n) setNote(n) }catch{} },[]);
  useEffect(()=>{ try{ localStorage.setItem("mm-note",note) }catch{} },[note]);

  // debounce geocode
  useEffect(()=>{
    setAddrConfirmed(false);
    setPicked(null);
    if (query.trim().length < 5){ setSugs([]); return; }
    const id = setTimeout(async ()=>{
      try{
        const r = await fetch("/api/geocode?q="+encodeURIComponent(query.trim()));
        const j = await r.json();
        setSugs(j || []);
      }catch{ setSugs([]); }
    }, 350);
    return ()=> clearTimeout(id);
  }, [query]);

  const covered = useMemo(()=>{
    if(!addrConfirmed || !name.trim() || !email.trim()) return false;
    return isCovered(town, cap);
  },[addrConfirmed, name, email, town, cap]);

  function applyCoupon(){
    const code = coupon.trim().toUpperCase();
    if(COUPONS[code]) setApplied({code, ...COUPONS[code]});
    else { setApplied(null); alert("Coupon non valido"); }
  }

  const discount = useMemo(()=>{
    if(!applied) return 0;
    let d = 0;
    if(applied.percent) d += subtotal * (applied.percent/100);
    if(applied.fixed) d += applied.fixed;
    return +Math.min(d, subtotal).toFixed(2);
  },[applied, subtotal]);

  const delivery = useMemo(()=>{
    if(!items.length) return 0;
    if(!covered) return 0;
    return applied?.freeship ? 0 : 4.9;
  },[applied, covered, items.length]);

  const total = useMemo(()=> +(Math.max(0, subtotal - discount) + delivery).toFixed(2), [subtotal, discount, delivery]);

  async function onCheckout(){
    if (!items.length) return;
    if (!covered) {
      alert("Indirizzo non coperto. Consegniamo a Riano, Monterotondo, Morlupo, Castelnuovo (di Porto), Ponte Storto, Settebagni e Roma CAP 00188–00189.");
      return;
    }
    try{
      const res = await fetch("/api/checkout", {
        method:"POST",
        headers:{ "content-type":"application/json" },
        body: JSON.stringify({
          items, note, method,
          customer:{name,email,phone,address,town,cap},
          coupon: applied?.code, discount, delivery, total
        })
      });
      if(res.ok){
        const data = await res.json();
        if(data?.url){ window.location.href = data.url; return; }
      }
    }catch{}
    alert("Ordine registrato (demo). Attiveremo i pagamenti reali appena configuriamo le chiavi Stripe/PayPal.");
  }

  return (
    <aside className="card md:sticky md:top-24 h-fit">
      <h3 className="text-lg font-semibold mb-2">Checkout</h3>

      {items.length===0 ? (
        <p className="opacity-70 text-sm">Nessun articolo nel carrello.</p>
      ) : (
        <div className="space-y-3">
          {items.map(i=>(
            <div key={i.id} className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{i.name} <span className="opacity-70">{i.size}</span></div>
                <div className="text-sm opacity-70">{i.seasonal ? "Stagionale" : i.fruits.join(" + ")}</div>
                <div className="text-sm mt-1">
                  € {i.price.toFixed(2)} ×{" "}
                  <input type="number" min={1} value={i.qty}
                    onChange={e=>setQty(i.id, Number(e.target.value||1))}
                    className="w-14 ml-2 rounded-md border border-[var(--border)] bg-transparent px-2 py-0.5" />
                </div>
              </div>
              <div className="text-right">
                <button className="text-xs opacity-70 hover:opacity-100" onClick={()=>remove(i.id)}>✕</button>
                <div className="font-semibold mt-6">€ {(i.price*i.qty).toFixed(2)}</div>
              </div>
            </div>
          ))}

          {/* dati cliente */}
          <div className="grid grid-cols-1 gap-2">
            <input className="rounded-lg border border-[var(--border)] bg-transparent p-2 text-sm" placeholder="Nome e cognome" value={name} onChange={e=>setName(e.target.value)} />
            <input className="rounded-lg border border-[var(--border)] bg-transparent p-2 text-sm" placeholder="Email per conferma" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="rounded-lg border border-[var(--border)] bg-transparent p-2 text-sm" placeholder="Telefono" value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>

          {/* cerca indirizzo */}
          <div className="grid gap-2">
            {!addrConfirmed && (
              <>
                <input
                  className="rounded-lg border border-[var(--border)] bg-transparent p-2 text-sm"
                  placeholder="Cerca indirizzo (via e numero, es. Via Flaminia 123)"
                  value={query}
                  onChange={e=>setQuery(e.target.value)}
                />
                {sugs.length>0 && (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] divide-y divide-[var(--border)]">
                    {sugs.map(s=>(
                      <button key={s.id}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-white/5"
                        onClick={()=>{ setPicked(s); setSugs([]); }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
                {picked && (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-2 text-sm">
                    <div><b>Indirizzo trovato:</b> {address}, {town} {cap}</div>
                    <div className="mt-2 flex gap-2">
                      <button className="btn px-3 py-2" onClick={()=>setAddrConfirmed(true)}>Sì, è questo</button>
                      <button className="btn px-3 py-2" onClick={()=>{ setPicked(null); setQuery(""); }}>No, cambia</button>
                    </div>
                  </div>
                )}
              </>
            )}

            {addrConfirmed && (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-2 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div><b>Indirizzo confermato</b> ✓</div>
                    <div className="opacity-80">{address}, {town} {cap}</div>
                  </div>
                  <button className="btn px-3 py-2" onClick={()=>{ setAddrConfirmed(false); setPicked(null); setQuery(""); }}>Modifica</button>
                </div>
                <div className={"mt-2 text-xs " + (isCovered(town,cap) ? "text-emerald-400" : "text-amber-400")}>
                  {isCovered(town,cap)
                    ? "Zona coperta: consegna disponibile."
                    : "Fuori zona: consegniamo Riano, Monterotondo, Morlupo, Castelnuovo (di Porto), Ponte Storto, Settebagni e Roma 00188–00189."}
                </div>
              </div>
            )}
          </div>

          {/* note */}
          <textarea
            value={note} onChange={e=>setNote(e.target.value)}
            placeholder="Note per il corriere (opzionale)"
            className="w-full rounded-lg border border-[var(--border)] bg-transparent p-2 text-sm" />

          {/* coupon */}
          <div className="rounded-lg border border-[var(--border)] p-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={hasCoupon} onChange={e=>setHasCoupon(e.target.checked)} />
              Ho un coupon
            </label>
            {hasCoupon && (
              <div className="mt-2 flex gap-2">
                <input className="flex-1 rounded-lg border border-[var(--border)] bg-transparent p-2 text-sm"
                       placeholder="Inserisci codice (es. BENVENUTO10)" value={coupon} onChange={e=>setCoupon(e.target.value)} />
                <button type="button" onClick={applyCoupon} className="btn px-3 py-2">Applica</button>
              </div>
            )}
            {applied && <p className="text-xs opacity-70 mt-1">Coupon <b>{applied.code}</b> applicato.</p>}
          </div>

          {/* totali */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotale</span><span>€ {subtotal.toFixed(2)}</span></div>
            {applied && (applied.percent || applied.fixed) ? (
              <div className="flex justify-between text-emerald-400">
                <span>Sconto</span>
                <span>-€ {(Math.min(subtotal, (applied.percent? subtotal*(applied.percent/100):0) + (applied.fixed||0))).toFixed(2)}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span>Consegna{covered ? "" : " (fuori zona)"}</span>
              <span>{covered ? `€ ${delivery.toFixed(2)}` : "—"}</span>
            </div>
            <div className="flex justify-between font-semibold text-base"><span>Totale</span><span>€ {total.toFixed(2)}</span></div>
          </div>

          {/* metodi */}
          <div className="flex items-center gap-4 text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="radio" checked={method==="card"} onChange={()=>setMethod("card")} /> Carta
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" checked={method==="paypal"} onChange={()=>setMethod("paypal")} /> PayPal
            </label>
          </div>

          <button onClick={onCheckout} disabled={!covered || !items.length || !addrConfirmed} className="btn btn-primary w-full disabled:opacity-50">
            {covered ? "Conferma ordine" : "Fuori zona: inserisci un indirizzo servito"}
          </button>

          <p className="text-xs opacity-60">
            Consegna €4,90 (gratis con FREESHIP). Copertura: Riano, Monterotondo, Morlupo, Castelnuovo (di Porto),
            Ponte Storto, Settebagni, Roma 00188–00189.
          </p>
          <button className="text-xs opacity-60 hover:opacity-100" onClick={clear}>Svuota carrello</button>
        </div>
      )}
    </aside>
  );
}