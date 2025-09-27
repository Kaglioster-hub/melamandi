import Stripe from "stripe";
import nodemailer from "nodemailer";
import { buildInvoicePDF } from "@/lib/invoice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function textEmail({number, total}:{number:string,total:number}){
  return `Pagamento ricevuto. Fattura #${number}
Totale: € ${ (total/100).toFixed(2) }`;
}

export async function POST(req: Request){
  const secret = process.env.STRIPE_SECRET || "";
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET || "";
  if(!secret || !endpointSecret){
    // Cannot verify; accept but skip invoicing
    return new Response("missing keys", { status: 200 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" } as any);
  const sig = req.headers.get("stripe-signature") || "";
  const raw = await req.text();

  let event: Stripe.Event;
  try{
    event = stripe.webhooks.constructEvent(raw, sig, endpointSecret);
  }catch(err:any){
    return new Response("invalid signature", { status: 400 });
  }

  if(event.type === "checkout.session.completed" && process.env.ISSUE_INTERNAL_INVOICE === "true"){
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionFull = await stripe.checkout.sessions.retrieve(session.id, { expand: ["line_items"] });
    const lineItems = sessionFull.line_items?.data || [];
    const total = sessionFull.amount_total || 0;
    const currency = (sessionFull.currency || "eur").toUpperCase();
    const buyerName = sessionFull.customer_details?.name || "";
    const buyerEmail = sessionFull.customer_details?.email || "";
    const couponDiscount = sessionFull.total_details?.amount_discount || 0;

    // Compose invoice number
    const now = new Date();
    const number = `MM-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}-${session.id.slice(-6).toUpperCase()}`;

    // Build items
    const items = lineItems.map(li => ({
      name: `${li.description}`,
      qty: Number(li.quantity||1),
      unitAmount: (Number(li.amount_total||0) / Number(li.quantity||1)) / 100,
    }));

    // Delivery row is already in items if included during checkout session
    const delivery = 0; // included as line item already
    const discount = (couponDiscount||0)/100;

    // Seller info from env
    const seller = {
      name: process.env.BILLING_ISSUER_NAME || "MelaMandi",
      vat: process.env.BILLING_ISSUER_VAT || "",
      address: process.env.BILLING_ISSUER_ADDRESS || "",
      city: process.env.BILLING_ISSUER_CITY || "",
      email: process.env.BILLING_ISSUER_EMAIL || "info@vrabo.it",
    };

    const pdf = await buildInvoicePDF({
      number,
      issueDate: now.toLocaleDateString("it-IT"),
      seller,
      buyer: { name: buyerName, email: buyerEmail },
      items: items as any,
      delivery,
      discount,
      total: total/100,
    });

    // Send email with PDF attachment
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE||"true")==="true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    const to = process.env.ORDERS_TO || "info@vrabo.it";
    const from = process.env.ORDERS_FROM || "MelaMandi <info@vrabo.it>";

    const message = {
      from,
      to,
      subject: `Pagamento ricevuto – Fattura ${number}`,
      text: textEmail({ number, total }),
      attachments: [{
        filename: `Fattura-${number}.pdf`,
        content: pdf,
        contentType: "application/pdf"
      }]
    } as any;

    // CC customer if email present
    if(buyerEmail){
      message.cc = buyerEmail;
    }

    await transporter.sendMail(message);
  }

  return new Response("ok", { status: 200 });
}
