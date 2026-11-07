// Adresse de la fiche App Store d'Ulti pour un pays, calculée depuis site.config.mjs (appStore: { id, nom }).
// Pays « fr-be » → https://apps.apple.com/be/app/ulti-iptv-player/id6829902519
// Page internationale (/en/, /es/…) → adresse sans pays : Apple envoie le visiteur vers son propre App Store.
// Exception : si « lienAppStore » est rempli pour ce pays dans src/pays.json, c'est lui qui gagne.
import config from "../../site.config.mjs";
import { estInternational, type Pays } from "./pays";

export function lienAppStore(p: Pays): string {
  if (p.lienAppStore) return p.lienAppStore;
  const { id, nom } = config.appStore;
  const pays = estInternational(p) ? "" : `${p.code.split("-")[1]}/`;
  return `https://apps.apple.com/${pays}app/${nom}/id${id}`;
}
