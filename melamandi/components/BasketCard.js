import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { CHECKOUT } from "../lib/config.mjs";

/**
 * BasketCard Ultra Supreme 100x
 * - Compatibile con la tua struttura item: { key, title, desc, variants: { [variantKey]: { label, price, image, compareAtPrice? } } }
 * - Usa /api/track?to=...&b=...&v=...&p=... (come il tuo backend attuale)
 */
export default function BasketCard({ item }) {
  const defaultVariant = useMemo(() => {
    const keys = Object.keys(item?.variants || {});
    return keys.includes("standard") ? "standard" : keys[0];
  }, [item]);

  const [variant, setVariant] = useState(defaultVariant);
  const v = item?.variants?.[variant] || {};

  // Checkout links (compatibili col tuo config)
  const stripe = CHECKOUT?.stripe?.[item.key]?.[variant] || "";
  const paypal = CHECKOUT?.paypal?.[item.key]?.[variant] || "";

  // Helpers
  const isClient = typeof window !== "undefined";
  const price = Number.isFinite(v?.price) ? v.price : 0;
  const compareAt = Number.isFinite(v?.compareAtPrice) ? v.compareAtPrice : null;
  const hasDiscount = compareAt && compareAt > price;
  const savingsPct = hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  // Plausible (opzionale, non rompe se non presente)
  const trackPlausible = useCallback((event, props = {}) => {
    if (isClient && typeof window.plausible === "function") {
      try { window.plausible(event, { props }); } catch {}
    }
  }, [isClient]);

  // Redirect sicuro con tracking compatibile
  const go = useCallback((url, provider) => {
    if (!url) {
      console.error(`⚠️ Checkout non configurato per ${provider} (${item.key}/${variant})`);
      alert("Configura i link di checkout in .env");
      return;
    }
    trackPlausible("checkout_click", { provider, item: item.key, variant });
    // Compatibile con il tuo /api/track?to=
    if (isClient) {
      window.location.href =
        `/api/track?to=${encodeURIComponent(url)}&b=${encodeURIComponent(item.key)}&v=${encodeURIComponent(variant)}&p=${encodeURIComponent(provider)}`;
    }
  }, [isClient, item?.key, trackPlausible, variant]);

  // Accessibilità: cambio variante con ← →
  const variantKeys = useMemo(() => Object.keys(item?.variants || {}), [item]);
  const buttonsRef = useRef([]);
  useEffect(() => { buttonsRef.current = buttonsRef.current.slice(0, variantKeys.length); }, [variantKeys.length]);

  const onVariantKeyDown = (e, idx) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (idx + 1) % variantKeys.length;
      setVariant(variantKeys[next]);
      buttonsRef.current[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (idx - 1 + variantKeys.length) % variantKeys.length;
      setVariant(variantKeys[prev]);
      buttonsRef.current[prev]?.focus();
    }
  };

  return (
    <article
      className="glass p-5 neon-border hover-float transition-all focus-within:shadow-2xl"
      itemScope
      itemType="https://schema.org/Product"
      aria-label={`Cesto ${item?.title || ""}`}
    >
      {/* Immagine prodotto (ottimizzata) */}
      <div className="relative rounded-xl overflow-hidden h-44 w-full">
        {v?.image ? (
          <Image
            src={v.image}
            alt={`Cesto ${item.title} – ${v.label || variant}`}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="h-full w-full bg-white/5 flex items-center justify-center text-sm text-gray-400">
            immagine non disponibile
          </div>
        )}
      </div>

      {/* Info */}
      <header className="mt-4">
        <h3 className="text-lg font-bold title-glow" itemProp="name">
          {item?.title || "Cesto"}
        </h3>
        {item?.desc && (
          <p className="text-sm text-gray-300" itemProp="description">
            {item.desc}
          </p>
        )}
      </header>

      {/* Varianti */}
      {variantKeys.length > 0 && (
        <div className="mt-4 flex gap-2 flex-wrap" role="group" aria-label="Seleziona variante">
          {variantKeys.map((k, idx) => {
            const selected = k === variant;
            const disabled = item?.variants?.[k]?.disabled;
            const label = item?.variants?.[k]?.label || k;
            return (
              <button
                key={k}
                ref={(el) => (buttonsRef.current[idx] = el)}
                onClick={() => !disabled && setVariant(k)}
                onKeyDown={(e) => onVariantKeyDown(e, idx)}
                aria-pressed={selected}
                aria-label={`Variante ${label}`}
                disabled={!!disabled}
                className={[
                  "px-3 py-1 rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-green-400/60",
                  disabled
                    ? "bg-white/5 text-gray-500 cursor-not-allowed"
                    : selected
                      ? "bg-green-500/85 text-black font-semibold"
                      : "bg-white/10 hover:bg-white/20 text-white",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Prezzo + CTA */}
      <div className="mt-5 flex items-end justify-between">
        <div>
          <div
            className="text-2xl font-extrabold text-gradient"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            € {price.toFixed(2)}
            <meta itemProp="price" content={price.toFixed(2)} />
            <meta itemProp="priceCurrency" content="EUR" />
            <link itemProp="availability" href="https://schema.org/InStock" />
          </div>
          {hasDiscount && (
            <div className="text-xs text-gray-400">
              <span className="line-through mr-2">€ {compareAt.toFixed(2)}</span>
              <span className="text-green-400 font-semibold">-{savingsPct}%</span>
            </div>
          )}
          <div className="text-xs text-gray-400">IVA 22% inclusa</div>
        </div>

        <div className="flex gap-2">
          <button
            className="btn-ghost hover-pulse"
            aria-label="Paga con Stripe"
            onClick={() => go(stripe, "stripe")}
          >
            Stripe
          </button>
          <button
            className="btn-primary hover-pulse"
            aria-label="Paga con PayPal"
            onClick={() => go(paypal, "paypal")}
          >
            PayPal
          </button>
        </div>
      </div>

      {/* Prenotazione alternativa */}
      <a
        href="#order"
        className="mt-3 inline-block text-sm underline opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-400/60"
      >
        oppure prenota con modulo
      </a>
    </article>
  );
}
