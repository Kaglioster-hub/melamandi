import os, json, base64, textwrap

PROJECT = "melamandi"

files = {}

# -----------------------------
# Utility per scrivere file
# -----------------------------
def add(path: str, content: str, binary=False):
    files[path] = (content, binary)

def mkdirs_for(path: str):
    d = os.path.dirname(path)
    if d and not os.path.exists(d):
        os.makedirs(d, exist_ok=True)

def write_all():
    for path, (content, binary) in files.items():
        full = os.path.join(PROJECT, path)
        mkdirs_for(full)
        mode = "wb" if binary else "w"
        with open(full, mode, encoding=None if binary else "utf-8") as f:
            if binary:
                f.write(content)
            else:
                f.write(content)
    print(f"✅ Progetto creato in ./{PROJECT}\n")

# -----------------------------
# .gitignore
# -----------------------------
add(".gitignore", textwrap.dedent("""\
node_modules
.next
out
.env
.DS_Store
*.log
.idea
.vscode
"""))

# -----------------------------
# package.json
# -----------------------------
add("package.json", json.dumps({
  "name": "melamandi",
  "version": "1.0.0",
  "private": True,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "classnames": "^2.5.1",
    "framer-motion": "^10.18.0",
    "i18next": "^23.7.0",
    "next": "^14.2.10",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^13.2.2",
    "tailwindcss": "^3.4.13"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}, indent=2))

# -----------------------------
# next.config.js
# -----------------------------
add("next.config.js", textwrap.dedent("""\
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["it", "en"],
    defaultLocale: "it",
  },
  images: { remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "images.pexels.com" }
  ]},
};
module.exports = nextConfig;
"""))

# -----------------------------
# Tailwind / PostCSS
# -----------------------------
add("tailwind.config.js", textwrap.dedent("""\
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,mjs}"],
  theme: { extend: {} },
  plugins: [],
}
"""))

add("postcss.config.js", textwrap.dedent("""\
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }
"""))

# -----------------------------
# env example
# -----------------------------
add(".env.example", textwrap.dedent("""\
# Inserisci i tuoi link reali prima del deploy
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/XXXXXXXXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=

# Checkout Stripe / PayPal per ogni combinazione
# (metti URL completi tipo https://checkout.stripe.com/c/pay/cs_test_...  oppure https://www.paypal.com/checkoutnow?token=...)
NEXT_PUBLIC_STRIPE_PICCOLO_STANDARD=
NEXT_PUBLIC_STRIPE_PICCOLO_ESOTICO=
NEXT_PUBLIC_STRIPE_PICCOLO_MIX=
NEXT_PUBLIC_STRIPE_MEDIO_STANDARD=
NEXT_PUBLIC_STRIPE_MEDIO_ESOTICO=
NEXT_PUBLIC_STRIPE_MEDIO_MIX=
NEXT_PUBLIC_STRIPE_GRANDE_STANDARD=
NEXT_PUBLIC_STRIPE_GRANDE_ESOTICO=
NEXT_PUBLIC_STRIPE_GRANDE_MIX=

NEXT_PUBLIC_PAYPAL_PICCOLO_STANDARD=
NEXT_PUBLIC_PAYPAL_PICCOLO_ESOTICO=
NEXT_PUBLIC_PAYPAL_PICCOLO_MIX=
NEXT_PUBLIC_PAYPAL_MEDIO_STANDARD=
NEXT_PUBLIC_PAYPAL_MEDIO_ESOTICO=
NEXT_PUBLIC_PAYPAL_MEDIO_MIX=
NEXT_PUBLIC_PAYPAL_GRANDE_STANDARD=
NEXT_PUBLIC_PAYPAL_GRANDE_ESOTICO=
NEXT_PUBLIC_PAYPAL_GRANDE_MIX=
"""))

# -----------------------------
# lib/config.mjs  (prezzi finali IVA 22% già inclusa + immagini free)
# -----------------------------
add("lib/config.mjs", textwrap.dedent("""\
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
"""))

# -----------------------------
# lib/i18n.js
# -----------------------------
add("lib/i18n.js", textwrap.dedent("""\
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import it from "../locales/it.json";
import en from "../locales/en.json";

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: { it: { translation: it }, en: { translation: en } },
      lng: "it",
      fallbackLng: "it",
      interpolation: { escapeValue: false },
    });
}
export default i18n;
"""))

# -----------------------------
# lib/zone.mjs (validazione Roma Nord)
# -----------------------------
add("lib/zone.mjs", textwrap.dedent("""\
export const ROME_ZIP_RE = /^001\\d{2}$/;

export const ROMA_NORD_KEYWORDS = [
  "Boccea","Primavalle","Aurelio","Trionfale","Balduina","Montemario","Camilluccia",
  "Cassia","Tomba di Nerone","Grottarossa","Fleming","Vigna Clara","Tor di Quinto",
  "Saxa Rubra","Labaro","Prima Porta","Due Ponti","Ponte Milvio","Flaminio",
  "Villaggio Olimpico","Prati Fiscali","Nuovo Salario","Conca d'Oro","Montesacro",
  "Talenti","Bufalotta","Colle Salario","Settebagni","Nomentana","Batteria Nomentana"
];

export function addressLooksInRomaNord(address) {
  const a = (address || "").toLowerCase();
  return ROMA_NORD_KEYWORDS.some(k => a.includes(k.toLowerCase()));
}
"""))

# -----------------------------
# lib/time.mjs (finestra 18-22 Europe/Rome)
# -----------------------------
add("lib/time.mjs", textwrap.dedent("""\
export function romeNow() {
  const s = new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' });
  return new Date(s);
}
export function isOrderingOpen() {
  const now = romeNow();
  const h = now.getHours();
  return h >= 18 && h < 22;
}
export function nextOpeningCountdown() {
  const now = romeNow();
  const h = now.getHours();
  const next = new Date(now);
  if (h >= 22) next.setDate(next.getDate() + 1);
  next.setHours(18,0,0,0);
  const diff = next - now;
  const H = Math.floor(diff / 3600000);
  const M = Math.floor((diff % 3600000) / 60000);
  return {hours:H, minutes:M};
}
export function tomorrowDeliveryWindowText() {
  const now = romeNow();
  const tomorrow = new Date(now);
  if (now.getHours() >= 22) {
    // ordine valido per dopodomani, ma UX: sempre "domani" dalla chiusura?
  }
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dd = String(tomorrow.getDate()).padStart(2,'0');
  const mm = String(tomorrow.getMonth()+1).padStart(2,'0');
  const yyyy = tomorrow.getFullYear();
  return `${dd}/${mm}/${yyyy} · 10:00–14:00`;
}
"""))

# -----------------------------
# public/logo.svg (M + ciliegia + arco GRA nord stilizzato)
# -----------------------------
add("public/logo.svg", textwrap.dedent("""\
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#fb923c"/>
    </linearGradient>
  </defs>
  <!-- Ciliegia -->
  <circle cx="256" cy="276" r="170" fill="url(#g)" />
  <rect x="246" y="85" width="20" height="60" rx="10" fill="#374151"/>
  <path d="M256 85 C 220 60, 170 60, 140 90" stroke="#22c55e" stroke-width="18" fill="none" stroke-linecap="round"/>
  <!-- Arco GRA nord -->
  <circle cx="256" cy="276" r="115" fill="none" stroke="#111827" stroke-width="22" opacity="0.3"/>
  <path d="M146 246 A115 115 0 0 1 366 246" stroke="#22c55e" stroke-width="22" fill="none" stroke-linecap="round"/>
  <!-- M fusa -->
  <path d="M140 420 L140 320 Q180 260 220 320 Q256 380 292 320 Q332 260 372 320 L372 420" 
        fill="none" stroke="#111827" stroke-width="28" stroke-linecap="round"/>
</svg>
"""))

# -----------------------------
# PWA manifest + icons (PNG 1x1 placeholder per compatibilità)
# -----------------------------
png_1x1 = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7dDgkAAAAASUVORK5CYII="
)
add("public/icons/icon-192x192.png", png_1x1, binary=True)
add("public/icons/icon-512x512.png", png_1x1, binary=True)

add("public/manifest.json", json.dumps({
  "name": "Melamandi",
  "short_name": "Melamandi",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f1115",
  "theme_color": "#0f1115",
  "icons": [
    {"src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png"}
  ]
}, indent=2))

# -----------------------------
# locales
# -----------------------------
add("locales/it.json", json.dumps({
  "brand":"Melamandi",
  "tagline":"Cesti freschi di frutta e verdura · Roma Nord entro il GRA",
  "cta_order":"Ordina ora",
  "how_title":"Come funziona",
  "how_1":"Scegli il tuo cesto",
  "how_2":"Ordinazioni ogni giorno 18:00–22:00",
  "how_3":"Consegna domani 10:00–14:00 (Roma Nord entro GRA)",
  "baskets_title":"I nostri cesti",
  "order_title":"Prenotazione",
  "order_desc":"Compila il modulo: ti consegniamo domani {{window}} entro il GRA (Roma Nord).",
  "name":"Nome",
  "email":"Email",
  "address":"Indirizzo (via + civico + quartiere)",
  "zip":"CAP",
  "notes":"Note",
  "send":"Invia richiesta",
  "only_open":"Gli ordini aprono ogni giorno 18:00–22:00",
  "footer_rights":"© {{year}} Melamandi · Tutti i diritti riservati",
  "out_closed_title":"🌙 Ordini chiusi",
  "out_closed_msg":"Le porte cosmiche si aprono ogni giorno dalle 18:00 alle 22:00.",
  "out_reopen":"Riapriamo tra {{h}}h {{m}}m",
  "pay_stripe":"Paga con Stripe",
  "pay_paypal":"Paga con PayPal",
  "book_form":"Prenota con modulo",
  "variant":"Variante"
}, indent=2))

add("locales/en.json", json.dumps({
  "brand":"Melamandi",
  "tagline":"Fresh fruit & veg baskets · North Rome inside GRA",
  "cta_order":"Order now",
  "how_title":"How it works",
  "how_1":"Pick your basket",
  "how_2":"Ordering every day 6–10 pm",
  "how_3":"Delivery tomorrow 10 am–2 pm (North Rome inside GRA)",
  "baskets_title":"Our baskets",
  "order_title":"Booking",
  "order_desc":"Fill the form: delivery tomorrow {{window}} inside GRA (North Rome).",
  "name":"Name",
  "email":"Email",
  "address":"Address (street + number + district)",
  "zip":"ZIP",
  "notes":"Notes",
  "send":"Send request",
  "only_open":"Ordering window is 6–10 pm daily",
  "footer_rights":"© {{year}} Melamandi · All rights reserved",
  "out_closed_title":"🌙 Ordering closed",
  "out_closed_msg":"The cosmic gates open daily from 6 pm to 10 pm.",
  "out_reopen":"Reopens in {{h}}h {{m}}m",
  "pay_stripe":"Pay with Stripe",
  "pay_paypal":"Pay with PayPal",
  "book_form":"Book with form",
  "variant":"Variant"
}, indent=2))

# -----------------------------
# styles/globals.css  (cosmico + Tailwind)
# -----------------------------
add("styles/globals.css", textwrap.dedent("""\
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark; }
body { @apply bg-[#0f1115] text-gray-100 antialiased; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, 'Noto Sans', 'Helvetica Neue', Arial; }

.glass { @apply bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl; }
.btn { @apply inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold transition; }
.btn-primary { @apply btn bg-green-500 hover:bg-green-600 text-black; }
.btn-ghost { @apply btn bg-white/10 hover:bg-white/20 text-white; }

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.bg-animated {
  background: linear-gradient(270deg, #22c55e, #fb923c, #ef4444);
  background-size: 600% 600%;
  animation: gradientShift 16s ease infinite;
}
.title-glow { text-shadow: 0 0 12px rgba(34,197,94,.6), 0 0 24px rgba(251,146,60,.4); }
.neon-border { box-shadow: 0 0 0 1px rgba(255,255,255,.12), 0 0 40px rgba(251,146,60,.15) inset; }
"""))

# -----------------------------
# components/Nav.js
# -----------------------------
add("components/Nav.js", textwrap.dedent("""\
import Link from "next/link";

export default function Nav(){
  return (
    <nav className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Melamandi" className="h-8 w-8"/>
          <span className="font-bold">Melamandi</span>
        </div>
        <div className="hidden sm:flex gap-6 text-sm">
          <Link href="#how">Come funziona</Link>
          <Link href="#baskets">Cesti</Link>
          <Link href="#order">Ordina</Link>
          <Link href="#contact">Contatti</Link>
        </div>
      </div>
    </nav>
  )
}
"""))

# -----------------------------
# components/Hero.js
# -----------------------------
add("components/Hero.js", textwrap.dedent("""\
import { useTranslation } from "react-i18next";

export default function Hero(){
  const { t } = useTranslation();
  return (
    <header className="relative pt-24">
      <div className="absolute inset-0 -z-10 bg-animated opacity-30"></div>
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <img src="/logo.svg" alt="Melamandi" className="mx-auto h-24 w-24 mb-6"/>
        <h1 className="text-4xl sm:text-5xl font-extrabold title-glow">{t('brand')}</h1>
        <p className="mt-3 text-gray-300">{t('tagline')}</p>
        <a href="#baskets" className="mt-8 btn-primary inline-block">{t('cta_order')}</a>
      </div>
    </header>
  )
}
"""))

# -----------------------------
# components/How.js
# -----------------------------
add("components/How.js", textwrap.dedent("""\
import { useTranslation } from "react-i18next";

export default function How(){
  const { t } = useTranslation();
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">{t('how_title')}</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="glass p-6"><div className="text-3xl mb-3">🥗</div><p>{t('how_1')}</p></div>
        <div className="glass p-6"><div className="text-3xl mb-3">⏰</div><p>{t('how_2')}</p></div>
        <div className="glass p-6"><div className="text-3xl mb-3">🚚</div><p>{t('how_3')}</p></div>
      </div>
    </section>
  )
}
"""))

# -----------------------------
# components/BasketCard.js
# -----------------------------
add("components/BasketCard.js", textwrap.dedent("""\
import { useState } from "react";
import { CHECKOUT } from "../lib/config.mjs";

export default function BasketCard({ item }){
  const [variant, setVariant] = useState("standard");
  const v = item.variants[variant];

  const stripe = CHECKOUT.stripe[item.key]?.[variant] || "";
  const paypal = CHECKOUT.paypal[item.key]?.[variant] || "";

  const go = (url) => {
    if(!url){ alert("Configura i link di checkout in .env"); return; }
    window.location.href = `/api/track?to=${encodeURIComponent(url)}&b=${item.key}&v=${variant}`;
  };

  return (
    <div className="glass p-4 neon-border">
      <img src={v.image} alt={item.title} className="rounded-xl h-40 w-full object-cover"/>
      <div className="mt-4">
        <h3 className="text-lg font-bold">{item.title}</h3>
        <p className="text-sm text-gray-300">{item.desc}</p>
      </div>

      <div className="mt-3 flex gap-2">
        {Object.keys(item.variants).map(k => (
          <button key={k}
            onClick={()=>setVariant(k)}
            className={`px-3 py-1 rounded-lg text-sm ${k===variant?'bg-white/20':'bg-white/10 hover:bg-white/20'}`}>
            {item.variants[k].label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-2xl font-extrabold">€ {v.price.toFixed(2)}</div>
          <div className="text-xs text-gray-400">IVA 22% inclusa</div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={()=>go(stripe)}>Paga con Stripe</button>
          <button className="btn-primary" onClick={()=>go(paypal)}>PayPal</button>
        </div>
      </div>

      <a href="#order" className="mt-3 inline-block text-sm underline opacity-80 hover:opacity-100">
        oppure prenota con modulo
      </a>
    </div>
  )
}
"""))

# -----------------------------
# components/OrderGate.js (overlay orario)
# -----------------------------
add("components/OrderGate.js", textwrap.dedent("""\
import { useEffect, useState } from "react";
import { isOrderingOpen, nextOpeningCountdown } from "../lib/time.mjs";
import { useTranslation } from "react-i18next";

export default function OrderGate({ children }){
  const [open, setOpen] = useState(false);
  const [cd, setCd] = useState({hours:0, minutes:0});
  const { t } = useTranslation();

  useEffect(()=>{
    const tick = ()=>{
      const ok = isOrderingOpen();
      setOpen(ok);
      if(!ok) setCd(nextOpeningCountdown());
    };
    tick();
    const id = setInterval(tick, 60000);
    return ()=>clearInterval(id);
  },[]);

  if(open) return children;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 text-white">
      <div className="glass max-w-md mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">{t('out_closed_title')}</h2>
        <p className="mb-1">{t('out_closed_msg')}</p>
        <p className="mb-4">{t('out_reopen', { h: cd.hours, m: cd.minutes })}</p>
        <a href="#order" className="btn-primary">Lascia i dati per un promemoria</a>
      </div>
    </div>
  )
}
"""))

# -----------------------------
# components/OrderForm.js
# -----------------------------
add("components/OrderForm.js", textwrap.dedent("""\
import { useState } from "react";
import { FORMSPREE } from "../lib/config.mjs";
import { ROME_ZIP_RE, addressLooksInRomaNord } from "../lib/zone.mjs";
import { tomorrowDeliveryWindowText } from "../lib/time.mjs";
import { useTranslation } from "react-i18next";

export default function OrderForm(){
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [ok, setOk] = useState(true);
  const { t } = useTranslation();

  const onValidate = ()=>{
    const zipOk = ROME_ZIP_RE.test(zip || "");
    const distOk = addressLooksInRomaNord(address || "");
    setOk(zipOk && distOk);
    if(!(zipOk && distOk)){
      alert("Al momento consegniamo solo entro il GRA · Roma Nord (da Boccea a Nomentana). Verifica CAP 001xx e quartiere.");
    }
    return zipOk && distOk;
  };

  const windowText = tomorrowDeliveryWindowText();

  return (
    <section id="order" className="mx-auto max-w-3xl px-4 py-12">
      <h2 className="text-2xl font-bold mb-4">{t('order_title')}</h2>
      <p className="text-gray-300 mb-6">{t('order_desc', { window: windowText })}</p>

      <form method="POST" action={FORMSPREE || "#"} onSubmit={(e)=>{ if(!FORMSPREE || !onValidate()) e.preventDefault(); }}>
        <input type="hidden" name="delivery_window" value={windowText}/>
        <div className="grid sm:grid-cols-2 gap-4">
          <input name="name" placeholder={t('name')} required className="glass p-3"/>
          <input name="email" type="email" placeholder={t('email')} required className="glass p-3"/>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <input name="address" placeholder={t('address')} required className="glass p-3"
                 value={address} onChange={e=>setAddress(e.target.value)}/>
          <input name="zip" placeholder={t('zip')} required className="glass p-3"
                 value={zip} onChange={e=>setZip(e.target.value)}/>
        </div>
        <textarea name="notes" placeholder={t('notes')} className="glass p-3 mt-4 w-full min-h-[100px]"></textarea>
        <div className="mt-4 flex items-center gap-3">
          <button className="btn-primary">{t('send')}</button>
          {!FORMSPREE && <span className="text-red-400 text-sm">Configura FORMSPREE in .env</span>}
        </div>
        {!ok && <p className="text-red-400 text-sm mt-2">Zona non valida per la consegna.</p>}
      </form>
    </section>
  )
}
"""))

# -----------------------------
# components/Footer.js
# -----------------------------
add("components/Footer.js", textwrap.dedent("""\
import { useTranslation } from "react-i18next";

export default function Footer(){
  const { t, i18n } = useTranslation();
  const y = new Date().getFullYear();
  return (
    <footer id="contact" className="mt-12 py-8 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm opacity-80">{t('footer_rights', {year: y})}</p>
        <div className="flex items-center gap-4 text-sm">
          <a href="mailto:ordini@melamandi.it" className="underline">ordini@melamandi.it</a>
          <button onClick={()=>i18n.changeLanguage(i18n.language==='it'?'en':'it')}
                  className="btn-ghost">{i18n.language.toUpperCase()}</button>
        </div>
      </div>
    </footer>
  )
}
"""))

# -----------------------------
# pages/_app.js
# -----------------------------
add("pages/_app.js", textwrap.dedent("""\
import "../styles/globals.css";
import "../lib/i18n";
import Head from "next/head";

export default function App({ Component, pageProps }){
  return (<>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Melamandi · Cesti di frutta e verdura · Roma Nord</title>
      <meta name="description" content="Ordini giornalieri 18:00–22:00 · Consegna domani 10:00–14:00 · Solo Roma Nord entro il GRA" />
      <link rel="icon" href="/logo.svg" />
      <link rel="manifest" href="/manifest.json" />
      <meta property="og:title" content="Melamandi" />
      <meta property="og:description" content="Cesti freschi · Roma Nord entro il GRA" />
      <meta property="og:image" content="/logo.svg" />
      <meta name="theme-color" content="#0f1115" />
      <script defer data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ""} src={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?`https://plausible.io/js/script.js`:""} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context":"https://schema.org",
        "@type":"LocalBusiness",
        "name":"Melamandi",
        "image":"/logo.svg",
        "areaServed":"Roma Nord (entro GRA: Boccea–Nomentana)",
        "address":{"@type":"PostalAddress","addressLocality":"Roma","addressRegion":"Lazio","addressCountry":"IT"},
        "openingHours":"Mo-Su 18:00-22:00",
        "url":"https://melamandi.it"
      })}}/>
    </Head>
    <Component {...pageProps} />
  </>);
}
"""))

# -----------------------------
# pages/index.js
# -----------------------------
add("pages/index.js", textwrap.dedent("""\
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import How from "../components/How";
import BasketCard from "../components/BasketCard";
import OrderForm from "../components/OrderForm";
import Footer from "../components/Footer";
import OrderGate from "../components/OrderGate";
import { CATALOG } from "../lib/config.mjs";
import { useTranslation } from "react-i18next";

export default function Page(){
  const { t } = useTranslation();

  return (
    <OrderGate>
      <Nav />
      <main>
        <Hero />
        <section id="baskets" className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">{t('baskets_title')}</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {Object.values(CATALOG).map(item => (<BasketCard item={item} key={item.key}/>))}
          </div>
        </section>
        <How />
        <OrderForm />
      </main>
      <Footer />
    </OrderGate>
  )
}
"""))

# -----------------------------
# pages/api/track.js (logging + redirect sicuro)
# -----------------------------
add("pages/api/track.js", textwrap.dedent("""\
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
"""))

# -----------------------------
# pages/api/ping.js
# -----------------------------
add("pages/api/ping.js", "export default (_,res)=>res.status(200).json({ok:true})")

# -----------------------------
# Done
# -----------------------------
if __name__ == "__main__":
    os.makedirs(PROJECT, exist_ok=True)
    write_all()
    print("👉 Prossimi passi:")
    print("1) cd melamandi")
    print("2) cp .env.example .env  (e compila i link Stripe/PayPal/Formspree)")
    print("3) npm i")
    print("4) npx tailwindcss -v  (già gestito da Next, serve solo dipendenza)")
    print("5) npx vercel  (poi npx vercel --prod)")
