// ============================================================================
// Melamandi – Config globale
// ============================================================================
// Tutto ciò che dipende da variabili di ambiente o che definisce il catalogo
// ============================================================================

// ------------------------------
// Catalogo prodotti
// ------------------------------
// NB: prezzi sempre come Number (due decimali) → UI li renderizza formattati

export const CATALOG = Object.freeze({
  piccolo: {
    key: "piccolo",
    title: "Cesto Piccolo · 3 kg",
    desc: "Frutta fresca selezionata, perfetta per single o coppie.",
    weightKg: 3,
    servings: "1–2 persone",
    tags: ["frutta", "light", "veloce"],
    variants: {
      standard: {
        label: "Standard (stagionale)",
        price: 12.2,
        image:
          "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&w=1600&q=80",
      },
      exotic: {
        label: "Esotico",
        price: 15.49,
        image:
          "https://images.unsplash.com/photo-1511689660979-10d2b1aedae8?auto=format&w=1600&q=80",
      },
      mix: {
        label: "Mix Premium",
        price: 15.49,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&w=1600&q=80",
      },
    },
  },
  medio: {
    key: "medio",
    title: "Cesto Medio · 6 kg",
    desc: "Frutta + verdura per 2–3 persone, bilanciato e pratico.",
    weightKg: 6,
    servings: "2–3 persone",
    tags: ["frutta", "verdura", "bilanciato"],
    variants: {
      standard: {
        label: "Standard (stagionale)",
        price: 21.96,
        image:
          "https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg?auto=compress&cs=tinysrgb&w=1600",
      },
      exotic: {
        label: "Esotico",
        price: 27.89,
        image:
          "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&w=1600&q=80",
      },
      mix: {
        label: "Mix Premium",
        price: 27.89,
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&w=1600&q=80",
      },
    },
  },
  grande: {
    key: "grande",
    title: "Cesto Grande · 10 kg",
    desc: "Box completo per famiglie: tanta varietà e qualità premium.",
    weightKg: 10,
    servings: "3–5 persone",
    tags: ["famiglia", "premium", "varietà"],
    variants: {
      standard: {
        label: "Standard (stagionale)",
        price: 30.5,
        image:
          "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&w=1600&q=80",
      },
      exotic: {
        label: "Esotico",
        price: 38.74,
        image:
          "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&w=1600&q=80",
      },
      mix: {
        label: "Mix Premium",
        price: 38.74,
        image:
          "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&w=1600&q=80",
      },
    },
  },
});

// ------------------------------
// Helper per checkout
// ------------------------------
// Le chiavi arrivano da .env.local, es:
// NEXT_PUBLIC_STRIPE_PICCOLO_STANDARD=https://checkout.stripe.com/...
// NEXT_PUBLIC_PAYPAL_MEDIO_ESOTICO=https://paypal.com/...

const env = (name) => process.env[name] || "";

export const CHECKOUT = Object.freeze({
  stripe: {
    piccolo: {
      standard: env("NEXT_PUBLIC_STRIPE_PICCOLO_STANDARD"),
      exotic: env("NEXT_PUBLIC_STRIPE_PICCOLO_ESOTICO"),
      mix: env("NEXT_PUBLIC_STRIPE_PICCOLO_MIX"),
    },
    medio: {
      standard: env("NEXT_PUBLIC_STRIPE_MEDIO_STANDARD"),
      exotic: env("NEXT_PUBLIC_STRIPE_MEDIO_ESOTICO"),
      mix: env("NEXT_PUBLIC_STRIPE_MEDIO_MIX"),
    },
    grande: {
      standard: env("NEXT_PUBLIC_STRIPE_GRANDE_STANDARD"),
      exotic: env("NEXT_PUBLIC_STRIPE_GRANDE_ESOTICO"),
      mix: env("NEXT_PUBLIC_STRIPE_GRANDE_MIX"),
    },
  },
  paypal: {
    piccolo: {
      standard: env("NEXT_PUBLIC_PAYPAL_PICCOLO_STANDARD"),
      exotic: env("NEXT_PUBLIC_PAYPAL_PICCOLO_ESOTICO"),
      mix: env("NEXT_PUBLIC_PAYPAL_PICCOLO_MIX"),
    },
    medio: {
      standard: env("NEXT_PUBLIC_PAYPAL_MEDIO_STANDARD"),
      exotic: env("NEXT_PUBLIC_PAYPAL_MEDIO_ESOTICO"),
      mix: env("NEXT_PUBLIC_PAYPAL_MEDIO_MIX"),
    },
    grande: {
      standard: env("NEXT_PUBLIC_PAYPAL_GRANDE_STANDARD"),
      exotic: env("NEXT_PUBLIC_PAYPAL_GRANDE_ESOTICO"),
      mix: env("NEXT_PUBLIC_PAYPAL_GRANDE_MIX"),
    },
  },
});

// ------------------------------
// Servizi terzi
// ------------------------------
export const FORMSPREE =
  env("NEXT_PUBLIC_FORMSPREE_ENDPOINT") || ""; // endpoint form
export const PLAUSIBLE_DOMAIN =
  env("NEXT_PUBLIC_PLAUSIBLE_DOMAIN") || ""; // dominio analytics
