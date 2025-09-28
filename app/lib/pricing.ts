export type Size = "S" | "M" | "L";
export type Kind = "base" | "mix" | "deluxe" | "baseExotic" | "mixExotic" | "deluxeExotic";

export const DELIVERY_FEE = 4.90;

export const priceMatrix: Record<Kind, Record<Size, number>> = {
  base:         { S: 12, M: 17, L: 23 },
  mix:          { S: 17, M: 22, L: 28 },
  deluxe:       { S: 22, M: 27, L: 33 },
  baseExotic:   { S: 16, M: 21, L: 27 },
  mixExotic:    { S: 21, M: 26, L: 32 },
  deluxeExotic: { S: 26, M: 31, L: 37 },
};

export const baseFruits = ["Mele","Pere","Banane","Arance","Stagionale"] as const;
export const exoticBaseChoices = ["Mango","Avocado","Frutta esotica del giorno"] as const;
export const exoticMixChoices  = ["Mango","Avocado","Papaya"] as const;
export const exoticDeluxeAll   = ["Mango","Avocado","Papaya","Frutta esotica del giorno"] as const;

export const standardMixChoices = baseFruits;