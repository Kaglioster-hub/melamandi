// ============================================================================
// Melamandi – Validazione zone consegna (Roma Nord entro GRA)
// ============================================================================

// Regex: solo CAP "001xx" di Roma
// NB: esclude 00100 (usato genericamente per Poste/Comune)
export const ROME_ZIP_RE = /^001[1-9]\d$/;

// Quartieri di Roma Nord entro GRA
export const ROMA_NORD_KEYWORDS = [
  "Boccea", "Primavalle", "Aurelio", "Trionfale", "Balduina", "Montemario", "Camilluccia",
  "Cassia", "Tomba di Nerone", "Grottarossa", "Fleming", "Vigna Clara", "Tor di Quinto",
  "Saxa Rubra", "Labaro", "Prima Porta", "Due Ponti", "Ponte Milvio", "Flaminio",
  "Villaggio Olimpico", "Prati Fiscali", "Nuovo Salario", "Conca d'Oro", "Montesacro",
  "Talenti", "Bufalotta", "Colle Salario", "Settebagni", "Nomentana", "Batteria Nomentana",
];

// Sinonimi/abbreviazioni comuni
const ROMA_NORD_ALIASES = {
  "p. milvio": "Ponte Milvio",
  "via cassia": "Cassia",
  "monti sacri": "Montesacro",
  "via nomentana": "Nomentana",
  "flam.": "Flaminio",
};

/**
 * Restituisce true se l'indirizzo contiene quartieri di Roma Nord
 */
export function addressLooksInRomaNord(address) {
  const a = (address || "").toLowerCase();

  // match diretto
  if (ROMA_NORD_KEYWORDS.some((k) => a.includes(k.toLowerCase()))) return true;

  // match alias
  for (const alias in ROMA_NORD_ALIASES) {
    if (a.includes(alias)) return true;
  }
  return false;
}

/**
 * Calcola uno score di confidenza (0–100)
 */
export function scoreAddressRomaNord(address) {
  const a = (address || "").toLowerCase();
  let score = 0;

  ROMA_NORD_KEYWORDS.forEach((k) => {
    if (a.includes(k.toLowerCase())) score += 30;
  });
  Object.keys(ROMA_NORD_ALIASES).forEach((alias) => {
    if (a.includes(alias)) score += 20;
  });

  // CAP valido aggiunge +50
  if (ROME_ZIP_RE.test(a)) score += 50;

  return Math.min(score, 100);
}

/**
 * Validazione completa zona di consegna
 * @returns { valid: boolean, reason: string }
 */
export function validateDeliveryZone(address, zip) {
  if (!zip || !ROME_ZIP_RE.test(zip)) {
    return { valid: false, reason: "CAP non valido o fuori Roma (001xx richiesto)" };
  }

  if (!addressLooksInRomaNord(address)) {
    return { valid: false, reason: "Zona non coperta: consegniamo solo entro il GRA · Roma Nord (da Boccea a Nomentana)" };
  }

  return { valid: true, reason: "Zona coperta" };
}
