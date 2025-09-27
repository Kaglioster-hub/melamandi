export type Size = 'S' | 'M' | 'L';
export type Kind = 'base' | 'mix' | 'deluxe' | 'baseExotic' | 'mixExotic' | 'deluxeExotic';

export const DELIVERY_FEE = 8.90;

export const priceMatrix: Record<Kind, Record<Size, number>> = {
  base:       { S: 19,  M: 29,  L: 39 },
  mix:        { S: 29,  M: 39,  L: 49 },
  deluxe:     { S: 39,  M: 55,  L: 70 },
  baseExotic: { S: 24,  M: 34,  L: 44 },
  mixExotic:  { S: 34,  M: 49,  L: 65 },
  deluxeExotic:{ S: 49, M: 69,  L: 89 },
};

export const baseFruits = ['Mele','Pere','Banane','Arance','Stagionale'] as const;
export const exoticBaseChoices = ['Mango','Avocado','Frutta esotica del giorno'] as const;
export const exoticMixChoices  = ['Mango','Avocado','Papaya'] as const;
export const exoticDeluxeAll   = ['Mango','Avocado','Papaya','Frutta esotica del giorno'] as const;

export const standardMixChoices = baseFruits;

type Product = {
  id: string;
  title: string;
  kind: Kind;
  image: string;
  blurb: string;
  description: string;
};

export const products: Product[] = [
  {
    id: 'base',
    title: 'Base',
    kind: 'base',
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=1200&auto=format&fit=crop',
    blurb: 'Scegli 1 frutto tra gli standard.',
    description: 'Il nostro cesto essenziale per piccole attenzioni: scegli 1 frutto tra mele, pere, banane, arance o frutta stagionale. Presentazione curata, confezione eco.'
  },
  {
    id: 'mix',
    title: 'Mix',
    kind: 'mix',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1200&auto=format&fit=crop',
    blurb: 'Scegli 3 frutti tra gli standard.',
    description: 'Il best‑seller per casa e ufficio: tre varietà a scelta tra i classici, equilibrato e colorato, ideale per 2–4 persone.'
  },
  {
    id: 'deluxe',
    title: 'Deluxe',
    kind: 'deluxe',
    image: 'https://images.unsplash.com/photo-1546549039-49d80fbf34ea?q=80&w=1200&auto=format&fit=crop',
    blurb: 'Include tutti i frutti standard.',
    description: 'Composizione completa con tutti i frutti standard disponibili, selezionati ogni mattina dal mercato. Perfetto come regalo.'
  },
  {
    id: 'baseExotic',
    title: 'Base Exotic',
    kind: 'baseExotic',
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=1200&auto=format&fit=crop',
    blurb: 'Scegli 1 frutto esotico (mango/avocado/esotico del giorno).',
    description: 'Un tocco tropicale: un solo frutto protagonista, maturo al punto giusto. Consegna in giornata nelle zone servite.'
  },
  {
    id: 'mixExotic',
    title: 'Mix Exotic',
    kind: 'mixExotic',
    image: 'https://images.unsplash.com/photo-1625944523210-3cbaadf52368?q=80&w=1200&auto=format&fit=crop',
    blurb: 'Scegli 3 frutti tra mango, avocado, papaya.',
    description: 'Abbinamenti esotici bilanciati, perfetti anche per smoothie e bowl. Qualità premium e selezione quotidiana.'
  },
  {
    id: 'deluxeExotic',
    title: 'Deluxe Exotic',
    kind: 'deluxeExotic',
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=1200&auto=format&fit=crop',
    blurb: 'Mango, avocado, papaya + esotico del giorno.',
    description: 'Il top di gamma: tutti i frutti esotici principali più la selezione del giorno. Confezione regalo compresa.'
  },
];
