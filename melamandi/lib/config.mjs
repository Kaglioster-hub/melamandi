export const CATALOG = {
  piccolo: {
    key: "piccolo",
    title: "Cesto Piccolo · 3 kg",
    desc: "Frutta fresca selezionata, perfetta per single o coppie.",
    variants: {
      standard: {
        label: "Standard (stagionale)",
        price: 12.20,
        image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&w=1600&q=80"
      },
      exotic: {
        label: "Esotico",
        price: 15.49,
        image: "https://images.unsplash.com/photo-1511689660979-10d2b1aedae8?auto=format&w=1600&q=80"
      },
      mix: {
        label: "Mix Premium",
        price: 15.49,
        image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&w=1600&q=80"
      }
    }
  },
  medio: {
    key: "medio",
    title: "Cesto Medio · 6 kg",
    desc: "Frutta + verdura per 2–3 persone, bilanciato e pratico.",
    variants: {
      standard: {
        label: "Standard (stagionale)",
        price: 21.96,
        image: "https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg?auto=compress&cs=tinysrgb&w=1600"
      },
      exotic: {
        label: "Esotico",
        price: 27.89,
        image: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&w=1600&q=80"
      },
      mix: {
        label: "Mix Premium",
        price: 27.89,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&w=1600&q=80"
      }
    }
  },
  grande: {
    key: "grande",
    title: "Cesto Grande · 10 kg",
    desc: "Box completo per famiglie: tanta varietà e qualità premium.",
    variants: {
      standard: {
        label: "Standard (stagionale)",
        price: 30.50,
        image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&w=1600&q=80"
      },
      exotic: {
        label: "Esotico",
        price: 38.74,
        image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&w=1600&q=80"
      },
      mix: {
        label: "Mix Premium",
        price: 38.74,
        image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&w=1600&q=80"
      }
    }
  }
};

// Mapping Checkout (compilati da .env al build)
export const CHECKOUT = {
  stripe: {
    piccolo: {
      standard: process.env.NEXT_PUBLIC_STRIPE_PICCOLO_STANDARD || "",
      exotic:   process.env.NEXT_PUBLIC_STRIPE_PICCOLO_ESOTICO || "",
      mix:      process.env.NEXT_PUBLIC_STRIPE_PICCOLO_MIX || ""
    },
    medio: {
      standard: process.env.NEXT_PUBLIC_STRIPE_MEDIO_STANDARD || "",
      exotic:   process.env.NEXT_PUBLIC_STRIPE_MEDIO_ESOTICO || "",
      mix:      process.env.NEXT_PUBLIC_STRIPE_MEDIO_MIX || ""
    },
    grande: {
      standard: process.env.NEXT_PUBLIC_STRIPE_GRANDE_STANDARD || "",
      exotic:   process.env.NEXT_PUBLIC_STRIPE_GRANDE_ESOTICO || "",
      mix:      process.env.NEXT_PUBLIC_STRIPE_GRANDE_MIX || ""
    }
  },
  paypal: {
    piccolo: {
      standard: process.env.NEXT_PUBLIC_PAYPAL_PICCOLO_STANDARD || "",
      exotic:   process.env.NEXT_PUBLIC_PAYPAL_PICCOLO_ESOTICO || "",
      mix:      process.env.NEXT_PUBLIC_PAYPAL_PICCOLO_MIX || ""
    },
    medio: {
      standard: process.env.NEXT_PUBLIC_PAYPAL_MEDIO_STANDARD || "",
      exotic:   process.env.NEXT_PUBLIC_PAYPAL_MEDIO_ESOTICO || "",
      mix:      process.env.NEXT_PUBLIC_PAYPAL_MEDIO_MIX || ""
    },
    grande: {
      standard: process.env.NEXT_PUBLIC_PAYPAL_GRANDE_STANDARD || "",
      exotic:   process.env.NEXT_PUBLIC_PAYPAL_GRANDE_ESOTICO || "",
      mix:      process.env.NEXT_PUBLIC_PAYPAL_GRANDE_MIX || ""
    }
  }
};

export const FORMSPREE = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "";

export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "";
