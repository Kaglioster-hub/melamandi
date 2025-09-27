import nodemailer from "nodemailer";

export const runtime = "nodejs";

type CartItem = {
  title: string;
  size: "S"|"M"|"L";
  qty: number;
  selected?: string[];
  kind: string;
};

function htmlEscape(s:string){ return s.replace(/[&<>"]/g, (c)=>({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;" }[c] as string)); }

function orderHtml({
  orderId, customer, address, zone, method, items, totals, coupon
}: any){
  const rows = items.map((i:CartItem)=>{
    const opts = i.selected?.length ? ` • ${i.selected.join(", ")}` : "";
    return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${htmlEscape(i.title)} ${htmlEscape(`(${i.size})`)}${htmlEscape(opts)}</td>
        <td style="padding:8px 12px;text-align:center;border-bottom:1px solid #eee;">${i.qty}</td>
      </tr>`;
  }).join("");

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0b0b0b">
    <div style="max-width:640px;margin:0 auto;border:1px solid #eee;border-radius:14px;overflow:hidden">
      <div style="display:flex;align-items:center;gap:10px;padding:16px 18px;background:linear-gradient(135deg,#16a34a,#f59e0b);color:#0b0b0b">
        <div style="width:32px;height:32px;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">M</div>
        <div>
          <div style="font-weight:700">MelaMandi</div>
          <div style="font-size:12px;opacity:.8">Ordine #${orderId}</div>
        </div>
      </div>
      <div style="padding:18px">
        <p style="margin:0 0 8px 0"><strong>Cliente:</strong> ${htmlEscape(customer?.name||"")}${customer?.email?` &lt;${htmlEscape(customer.email)}&gt;`:""}${customer?.phone?` • ${htmlEscape(customer.phone)}`:""}</p>
        <p style="margin:0 0 8px 0"><strong>Indirizzo:</strong> ${htmlEscape(address||"")}</p>
        <p style="margin:0 0 8px 0"><strong>Zona/CAP:</strong> ${htmlEscape(zone||"")}</p>
        <p style="margin:0 0 8px 0"><strong>Metodo:</strong> ${htmlEscape(method||"")}</p>

        <table style="width:100%;border-collapse:collapse;margin-top:8px">
          <thead>
            <tr style="background:#fafafa">
              <th style="text-align:left;padding:8px 12px;border-bottom:1px solid #eee;">Articolo</th>
              <th style="text-align:center;padding:8px 12px;border-bottom:1px solid #eee;">Qty</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div style="margin-top:12px;border-top:1px dashed #ddd;padding-top:12px">
          <div><strong>Subtotale:</strong> € ${Number(totals?.subtotal||0).toFixed(2)}</div>
          <div><strong>Consegna:</strong> € ${Number(totals?.delivery||0).toFixed(2)}</div>
          ${totals?.discount ? `<div><strong>Sconto:</strong> -€ ${Number(totals?.discount||0).toFixed(2)} ${coupon?.applied?`(${htmlEscape(coupon?.code||"")})`:""}</div>` : ""}
          <div style="font-weight:700;font-size:16px;margin-top:4px">Totale: € ${Number(totals?.total||0).toFixed(2)}</div>
        </div>

        <p style="font-size:12px;color:#555;margin-top:16px">Grazie! Per assistenza: <a href="mailto:melamandi@vrabo.it">melamandi@vrabo.it</a>.</p>
      </div>
    </div>
  </div>`;
}

export async function POST(req: Request){
  try{
    const body = await req.json();
    const {
      customer, address, zone, method, items, totals, coupon, hp
    } = body as any;

    if (hp && String(hp).trim() !== ""){
      return new Response(JSON.stringify({ ok:true }), { status: 200, headers:{ "content-type":"application/json" }});
    }

    const orderId = Math.random().toString(36).slice(2,7).toUpperCase();

    const textLines = [
      `Nuovo ordine MelaMandi #${orderId}`,
      `Metodo: ${method}`,
      `Cliente: ${customer?.name||""} ${customer?.email?`<${customer.email}>`:""} ${customer?.phone?`tel: ${customer.phone}`:""}`,
      `Indirizzo: ${address}`,
      `Zona/CAP: ${zone}`,
      ``,
      `Articoli:`,
      ...(Array.isArray(items)?items:[]).map((i:CartItem)=>`- ${i.title} (${i.size}) x${i.qty}` + (i.selected?.length?` • ${i.selected.join(", ")}`:"")),
      ``,
      coupon?.applied ? `Coupon applicato: ${coupon.code} (-${Math.round((coupon.discountPct||0)*100)}%)` : `Coupon: non applicato`,
      `Totali:`,
      `  Subtotale € ${Number(totals?.subtotal||0).toFixed(2)}`,
      `  Consegna  € ${Number(totals?.delivery||0).toFixed(2)}`,
      totals?.discount ? `  Sconto    -€ ${Number(totals.discount).toFixed(2)}` : undefined,
      `  Totale    € ${Number(totals?.total||0).toFixed(2)}`,
    ].filter(Boolean).join("\n");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE||"true")==="true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    const to = process.env.ORDERS_TO || "info@vrabo.it";
    const from = process.env.ORDERS_FROM || "MelaMandi <info@vrabo.it>";

    const html = orderHtml({ orderId, customer, address, zone, method, items, totals, coupon });

    await transporter.sendMail({
      from, to,
      subject: `Nuovo ordine MelaMandi #${orderId}`,
      text: textLines,
      html
    });

    if(customer?.email){
      await transporter.sendMail({
        from,
        to: customer.email,
        subject: `Conferma ordine MelaMandi #${orderId}`,
        text: textLines + `\n\nGrazie! Ti contatteremo per la consegna.`,
        html
      });
    }

    return new Response(JSON.stringify({ ok: true, orderId }), { status: 200, headers: { "content-type":"application/json" } });
  }catch(err:any){
    console.error(err);
    return new Response(JSON.stringify({ ok:false, error: String(err?.message||err) }), { status: 500, headers: { "content-type":"application/json" } });
  }
}
