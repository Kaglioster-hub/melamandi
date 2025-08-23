import { useEffect, useState } from "react";
import { isOrderingOpen, nextOpeningCountdown } from "../lib/time.mjs";
import { useTranslation } from "react-i18next";

export default function OrderGate({ children }){
  const [open, setOpen] = useState(false);
  const [cd, setCd] = useState({hours:0, minutes:0});
  const { t } = useTranslation();

  useEffect(()=>{
    const tick = ()=>{
      const ok = isOrderingOpen();
      setOpen(ok);
      if(!ok) setCd(nextOpeningCountdown());
    };
    tick();
    const id = setInterval(tick, 60000);
    return ()=>clearInterval(id);
  },[]);

  if(open) return children;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 text-white">
      <div className="glass max-w-md mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">{t('out_closed_title')}</h2>
        <p className="mb-1">{t('out_closed_msg')}</p>
        <p className="mb-4">{t('out_reopen', { h: cd.hours, m: cd.minutes })}</p>
        <a href="#order" className="btn-primary">Lascia i dati per un promemoria</a>
      </div>
    </div>
  )
}
