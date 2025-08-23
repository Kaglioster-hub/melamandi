export const ROME_ZIP_RE = /^001\d{2}$/;

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
