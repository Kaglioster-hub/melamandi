import PDFDocument from "pdfkit";

export type InvoiceItem = {
  name: string;
  qty: number;
  unitAmount: number; // in major units (EUR)
};

export function formatEUR(v:number){
  return `€ ${v.toFixed(2)}`;
}

export async function buildInvoicePDF({
  number, issueDate, seller, buyer, items, delivery, discount=0, total
}:{
  number: string;
  issueDate: string;
  seller: { name: string; vat?: string; address?: string; city?: string; email?: string };
  buyer: { name?: string; email?: string };
  items: InvoiceItem[];
  delivery?: number;
  discount?: number;
  total: number;
}): Promise<Buffer>{
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const chunks: Buffer[] = [];
  return await new Promise((resolve)=>{
    doc.on("data", (c)=> chunks.push(c as Buffer));
    doc.on("end", ()=> resolve(Buffer.concat(chunks)));

    doc.fontSize(18).text("MelaMandi – Fattura", { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`N° ${number} — Emessa il ${issueDate}`);
    doc.moveDown(0.5);

    doc.fontSize(12).text("Cedente/Prestatore", { underline: true });
    doc.fontSize(10).text(`${seller.name}`);
    if(seller.vat) doc.text(`P.IVA: ${seller.vat}`);
    if(seller.address) doc.text(seller.address);
    if(seller.city) doc.text(seller.city);
    if(seller.email) doc.text(seller.email);
    doc.moveDown(0.8);

    doc.fontSize(12).text("Cessionario/Committente", { underline: true });
    doc.fontSize(10).text(`${buyer.name||""}`);
    if(buyer.email) doc.text(buyer.email);
    doc.moveDown(1);

    // Table header
    doc.fontSize(11).text("Descrizione", 40, doc.y, { continued: true });
    doc.text("Qty", 360, undefined, { continued: true });
    doc.text("Prezzo", 420, undefined, { continued: true });
    doc.text("Totale", 500);
    doc.moveTo(40, doc.y+2).lineTo(555, doc.y+2).stroke();

    let sum = 0;
    items.forEach(it=>{
      const line = it.unitAmount * it.qty;
      sum += line;
      doc.fontSize(10).text(it.name, 40, doc.y+8, { continued: true });
      doc.text(String(it.qty), 360, undefined, { continued: true });
      doc.text(formatEUR(it.unitAmount), 420, undefined, { continued: true });
      doc.text(formatEUR(line), 500);
    });

    if(delivery && delivery>0){
      sum += delivery;
      doc.fontSize(10).text("Consegna", 40, doc.y+8, { continued: true });
      doc.text("1", 360, undefined, { continued: true });
      doc.text(formatEUR(delivery), 420, undefined, { continued: true });
      doc.text(formatEUR(delivery), 500);
    }

    if(discount && discount>0){
      sum -= discount;
      doc.fontSize(10).text("Sconto", 40, doc.y+8, { continued: true });
      doc.text("-", 360, undefined, { continued: true });
      doc.text(formatEUR(discount), 420, undefined, { continued: true });
      doc.text(`- ${formatEUR(discount)}`, 500);
    }

    doc.moveDown(1);
    doc.fontSize(12).text(`TOTALE: ${formatEUR(total)}`, { align: "right" });

    doc.moveDown(2);
    doc.fontSize(9).fillColor("#666").text("Documento generato automaticamente. L'aliquota IVA e i dettagli fiscali sono configurabili. Verificare con il proprio consulente fisc/la normativa vigente.", { align: "left" });

    doc.end();
  });
}
