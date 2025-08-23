export default async function handler(req, res){
  try{
    const to = String(req.query.to || "").trim();
    const b = String(req.query.b || "");
    const v = String(req.query.v || "");
    if(!to) return res.redirect(302, "/");
    const allowed = ["checkout.stripe.com", "www.paypal.com", "paypal.com"];
    const u = new URL(to);
    if(!allowed.includes(u.hostname)) return res.redirect(302, "/");

    console.log("Checkout click", {to, basket:b, variant:v, at: new Date().toISOString()});
    return res.redirect(302, to);
  }catch(e){
    return res.redirect(302, "/");
  }
}
