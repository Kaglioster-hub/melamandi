const Z = [
  '00188','00189','Riano','Castelnuovo di Porto','Morlupo','Pontestorto','Monterotondo','Settebagni'
] as const;

export const SERVED_ZONES = Z;

function normalize(s: string){
  return s.normalize('NFD').replace(/\p{Diacritic}/gu,'').trim().toLowerCase();
}

export function zoneIsServed(input: string){
  if(!input) return false;
  const v = normalize(input);
  return Z.some(z => {
    const n = normalize(z);
    return v === n || v.includes(n) || n.includes(v);
  });
}
