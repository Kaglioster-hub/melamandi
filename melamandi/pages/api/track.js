export default async function handler(req, res) {
  try {
    const to = String(req.query.to || "").trim();
    const b = String(req.query.b || "").replace(/[^a-z0-9_-]/gi, "");
    const v = String(req.query.v || "").replace(/[^a-z0-9_-]/gi, "");
    const p = String(req.query.p || "").replace(/[^a-z0-9_-]/gi, ""); // provider

    if (!to) return res.redirect(302, "/");

    // ✅ Whitelist domini ammessi
    const allowed = [
      "checkout.stripe.com",
      "www.paypal.com",
      "paypal.com",
      "www.sandbox.paypal.com"
    ];
    let u;
    try {
      u = new URL(to);
    } catch {
      return res.redirect(302, "/");
    }
    if (!allowed.includes(u.hostname)) {
      console.warn("❌ Redirect blocked, invalid host:", u.hostname);
      return res.redirect(302, "/");
    }

    // ✅ Logging strutturato (server console, puoi collegare DB o webhook)
    console.log("✅ Checkout click", {
      dest: to,
      basket: b,
      variant: v,
      provider: p,
      at: new Date().toISOString(),
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      ua: req.headers["user-agent"] || "",
    });

    // ✅ Integrazione opzionale con Plausible
    if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      try {
        await fetch(`https://plausible.io/api/event`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": req.headers["user-agent"] || "",
          },
          body: JSON.stringify({
            name: "Checkout click",
            url: `https://${process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}/track`,
            domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
            props: { basket: b, variant: v, provider: p },
          }),
        });
      } catch (err) {
        console.error("⚠️ Plausible tracking failed", err.message);
      }
    }

    // ✅ Redirect finale
    return res.redirect(302, to);
  } catch (e) {
    console.error("⚠️ Track API error", e);
    return res.redirect(302, "/");
  }
}
