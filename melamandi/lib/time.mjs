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
