import { priceMatrix, type Kind, type Size } from "@/lib/pricing";

export const runtime = "nodejs";

type ItemIn = { title:string, kind: Kind, size: Size, qty: number, selected?: string[] };
type CustomerIn = { name?: string, email?: string, address?: string, zone?: string, couponCode?: string };

export async function POST(req: Request){
  try{
    const body = await req.json();
    const {
      items = [], successUrl = "/success", cancelUrl = "/cancel",
      delivery = 0, couponApplied = false, customer = {}
    } = body as { items: ItemIn[], successUrl?: string, cancelUrl?: string, delivery?: number, couponApplied?: boolean, customer?: CustomerIn };

    const origin = (req.headers.get("origin") || "").replace(/\/$/,"");
    const success = origin + successUrl;
    const cancel = origin + cancelUrl;

    const secret = process.env.STRIPE_SECRET;
    if(secret && secret.startsWith("sk_")){
      const stripeMod = await import("stripe");
      const Stripe = stripeMod.default;
      const stripe = new Stripe(secret, { apiVersion: "2024-06-20" } as any);

      const line_items = (items as ItemIn[]).map(i => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: `Cesto ${i.title} (${i.size})`,
            description: i.selected?.length ? i.selected.join(", ") : undefined,
          },
          unit_amount: Math.round(priceMatrix[i.kind][i.size] * 100),
        },
        quantity: i.qty,
      }));

      if (Number(delivery) > 0){
        line_items.push({
          price_data: {
            currency: "eur",
            product_data: { name: "Consegna" },
            unit_amount: Math.round(Number(delivery) * 100),
          },
          quantity: 1,
        });
      }

      const params: any = {
        mode: "payment",
        success_url: success,
        cancel_url: cancel,
        line_items,
        allow_promotion_codes: true,
        customer_email: customer?.email || undefined,
        metadata: {
          customer_name: customer?.name || "",
          address: customer?.address || "",
          zone: customer?.zone || "",
          coupon_code: customer?.couponCode || "",
          source: "melamandi"
        }
      };

      if (couponApplied && process.env.STRIPE_COUPON_ID){
        params.discounts = [{ coupon: process.env.STRIPE_COUPON_ID }];
      }

      const session = await stripe.checkout.sessions.create(params);
      return new Response(JSON.stringify({ url: session.url }), {
        status: 200, headers: { "content-type":"application/json" }
      });
    }

    // Fallback to Payment Link
    const url = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK
      || "https://buy.stripe.com/test_XxxxxxxxxxxxxxxxxxX";

    return new Response(JSON.stringify({ url }), {
      status: 200, headers: { "content-type":"application/json" }
    });
  }catch(err:any){
    return new Response(JSON.stringify({ error: String(err?.message||err) }), {
      status: 500, headers: { "content-type":"application/json" }
    });
  }
}
