import { useState } from "react";
import { FORMSPREE } from "../lib/config.mjs";
import { ROME_ZIP_RE, addressLooksInRomaNord } from "../lib/zone.mjs";
import { tomorrowDeliveryWindowText } from "../lib/time.mjs";
import { useTranslation } from "react-i18next";

export default function OrderForm(){
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [ok, setOk] = useState(true);
  const { t } = useTranslation();

  const onValidate = ()=>{
    const zipOk = ROME_ZIP_RE.test(zip || "");
    const distOk = addressLooksInRomaNord(address || "");
    setOk(zipOk && distOk);
    if(!(zipOk && distOk)){
      alert("Al momento consegniamo solo entro il GRA · Roma Nord (da Boccea a Nomentana). Verifica CAP 001xx e quartiere.");
    }
    return zipOk && distOk;
  };

  const windowText = tomorrowDeliveryWindowText();

  return (
    <section id="order" className="mx-auto max-w-3xl px-4 py-12">
      <h2 className="text-2xl font-bold mb-4">{t('order_title')}</h2>
      <p className="text-gray-300 mb-6">{t('order_desc', { window: windowText })}</p>

      <form method="POST" action={FORMSPREE || "#"} onSubmit={(e)=>{ if(!FORMSPREE || !onValidate()) e.preventDefault(); }}>
        <input type="hidden" name="delivery_window" value={windowText}/>
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="name" placeholder={t('name')} required className="glass p-3"/>
          <input name="email" type="email" placeholder={t('email')} required className="glass p-3"/>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <input name="address" placeholder={t('address')} required className="glass p-3"
                 value={address} onChange={e=>setAddress(e.target.value)}/>
          <input name="zip" placeholder={t('zip')} required className="glass p-3"
                 value={zip} onChange={e=>setZip(e.target.value)}/>
        </div>
        <textarea name="notes" placeholder={t('notes')} className="glass p-3 mt-4 w-full min-h-[100px]"></textarea>
        <div className="mt-4 flex items-center gap-3">
          <button className="btn-primary">{t('send')}</button>
          {!FORMSPREE && <span className="text-red-400 text-sm">Configura FORMSPREE in .env</span>}
        </div>
        {!ok && <p className="text-red-400 text-sm mt-2">Zona non valida per la consegna.</p>}
      </form>
    </section>
  )
}
