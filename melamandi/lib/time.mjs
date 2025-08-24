// ============================================================================
// Melamandi – Utilities temporali (TZ Roma)
// ============================================================================

/**
 * Restituisce un oggetto Date "ora di Roma"
 */
export function romeNow() {
  // toLocaleString forza la conversione in fuso orario Europa/Rome
  const s = new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" });
  return new Date(s);
}

/**
 * Controlla se la fascia ordini è aperta (18:00–22:00 ora di Roma)
 */
export function isOrderingOpen() {
  const now = romeNow();
  const h = now.getHours();
  return h >= 18 && h < 22;
}

/**
 * Countdown al prossimo opening (in ore, minuti, secondi)
 */
export function nextOpeningCountdown() {
  const now = romeNow();
  const h = now.getHours();

  // prossimo slot apertura
  const next = new Date(now);
  if (h >= 22) {
    next.setDate(next.getDate() + 1); // domani
  }
  next.setHours(18, 0, 0, 0); // apertura 18:00

  const diff = next - now;
  const H = Math.floor(diff / 3600000);
  const M = Math.floor((diff % 3600000) / 60000);
  const S = Math.floor((diff % 60000) / 1000);

  return { hours: H, minutes: M, seconds: S };
}

/**
 * Restituisce testo finestra consegna per "domani"
 * Sempre 10:00–14:00, ma gestisce se ordine è dopo le 22.
 */
export function tomorrowDeliveryWindowText() {
  const now = romeNow();
  const tomorrow = new Date(now);

  if (now.getHours() >= 22) {
    // UX: dopo chiusura, è in realtà dopodomani, ma mostriamo "domani"
    tomorrow.setDate(tomorrow.getDate() + 2);
  } else {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }

  return `${formatDateRome(tomorrow)} · 10:00–14:00`;
}

/**
 * Helper: formatta data in DD/MM/YYYY (TZ Roma)
 */
export function formatDateRome(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Restituisce testo finestra consegna custom (es. "10:00–14:00")
 */
export function getDeliveryWindow(date, from = "10:00", to = "14:00") {
  return `${formatDateRome(date)} · ${from}–${to}`;
}
