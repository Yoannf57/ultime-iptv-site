// Adresse de la fiche Google Play d'Ulti pour un pays, calculée depuis site.config.mjs (googlePlay: { id }).
// « hl » : langue de la fiche ; « gl » : pays (absent pour une page internationale, Google prend alors celui du visiteur).
// Pays « fr-be » → https://play.google.com/store/apps/details?id=com.yoannfebvre.ultimeiptv&hl=fr&gl=BE
import config from "../../site.config.mjs";
import { estInternational, type Pays } from "./pays";

// true quand le site parle de Google Play (badge, liens, textes, marque) : l'app est publiée ET la fiche Google Play
// existe. Une seule valeur, utilisée partout.
export const googlePlayAffiche = Boolean(config.disponible && config.googlePlay.disponible);

// Codes de langue de Google Play quand ils diffèrent de ceux du site.
const languesGoogle: Record<string, string> = { "pt-br": "pt-BR", pt: "pt-PT", nb: "no" };

export function lienGooglePlay(p: Pays): string {
  const hl = languesGoogle[p.langue] ?? p.langue;
  const gl = estInternational(p) ? "" : `&gl=${p.code.split("-")[1].toUpperCase()}`;
  return `https://play.google.com/store/apps/details?id=${config.googlePlay.id}&hl=${hl}${gl}`;
}
