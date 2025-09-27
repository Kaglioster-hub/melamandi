'use client';
import { useState } from "react";

export default function QuoteForm(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [request, setRequest] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  function send(){
    const body = [
      'Richiesta preventivo MelaMandi',
      `Nome: ${name}`,
      `Email: ${email}`,
      `Telefono: ${phone}`,
      `Cesto richiesto / persone: ${request}`,
      `Data: ${date}`,
      `Note: ${notes}`,
    ].join('\n');
    window.location.href = `mailto:melamandi@vrabo.it?subject=${encodeURIComponent('Preventivo MelaMandi')}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="card p-4" id="preventivo">
      <div className="font-semibold mb-2">Richiesta Preventivo</div>
      <div className="grid gap-2">
        <input placeholder="Nome e cognome" value={name} onChange={e=> setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=> setEmail(e.target.value)} />
        <input placeholder="Telefono" value={phone} onChange={e=> setPhone(e.target.value)} />
        <input placeholder="Cesto richiesto / per quante persone" value={request} onChange={e=> setRequest(e.target.value)} />
        <input placeholder="gg/mm/aaaa" value={date} onChange={e=> setDate(e.target.value)} />
        <textarea placeholder="Note" rows={5} value={notes} onChange={e=> setNotes(e.target.value)} />
        <button className="btn btn-primary" onClick={send}>Invia richiesta</button>
        <div className="text-xs opacity-70">Email ricezione: melamandi@vrabo.it</div>
      </div>
    </div>
  );
}
