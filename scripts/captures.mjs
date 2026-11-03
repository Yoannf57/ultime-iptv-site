// npm run captures [adresse] — captures Playwright (ordinateur 1440 px, iPhone 393 px), en français et en anglais,
// plus un test de la page racine (pays deviné selon la langue et le fuseau horaire du navigateur).
// Par défaut : le site local lancé par « npm run preview » (http://localhost:4321/ultime-iptv-site/).
// Les images vont dans captures/ (non versionné).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const adresse = (process.argv[2] || "http://localhost:4321/ultime-iptv-site/").replace(/\/?$/, "/");
const dossier = new URL("../captures/", import.meta.url).pathname;
mkdirSync(dossier, { recursive: true });

const tailles = { ordi: { width: 1440, height: 900 }, iphone: { width: 393, height: 852 } };
const pages = [
  { nom: "fr-fr", chemin: "fr-fr/", locale: "fr-FR", fuseau: "Europe/Paris" },
  { nom: "en", chemin: "en/", locale: "en-GB", fuseau: "Europe/London" },
  { nom: "choix", chemin: "pays/", locale: "fr-FR", fuseau: "Europe/Paris" },
  // Bandeau : navigateur belge qui arrive sur la page France.
  { nom: "bandeau-fr-be", chemin: "fr-fr/", locale: "fr-BE", fuseau: "Europe/Brussels" },
];

const navigateur = await chromium.launch();
let echecs = 0;

if (!process.argv.includes("--sans-captures")) {
  for (const p of pages) {
    for (const [taille, viewport] of Object.entries(tailles)) {
      const contexte = await navigateur.newContext({
        viewport, locale: p.locale, timezoneId: p.fuseau,
        deviceScaleFactor: taille === "iphone" ? 3 : 1, isMobile: taille === "iphone", hasTouch: taille === "iphone",
      });
      const page = await contexte.newPage();
      await page.goto(adresse + p.chemin, { waitUntil: "networkidle" });
      const fichier = `${dossier}${p.nom}-${taille}.png`;
      await page.screenshot({ path: fichier, fullPage: true });
      console.log("📸 " + fichier);
      await contexte.close();
    }
  }
}

// Page racine : où arrive-t-on ?
const cas = [
  { locale: "fr-FR", fuseau: "Europe/Paris", attendu: "fr-fr/" },
  { locale: "fr-BE", fuseau: "Europe/Brussels", attendu: "fr-be/" },
  { locale: "fr-FR", fuseau: "Europe/Brussels", attendu: "fr-be/" },
  { locale: "fr-CH", fuseau: "Europe/Zurich", attendu: "fr-ch/" },
  { locale: "fr-CA", fuseau: "America/Toronto", attendu: "fr-ca/" },
  { locale: "en-CA", fuseau: "America/Toronto", attendu: "en-ca/" },
  { locale: "en-US", fuseau: "America/New_York", attendu: "en-us/" },
  { locale: "en-GB", fuseau: "Europe/London", attendu: "en-gb/" },
  { locale: "en-US", fuseau: "Asia/Tokyo", attendu: "en-us/" },
  { locale: "en", fuseau: "Asia/Tokyo", attendu: "en/" },
  { locale: "de-DE", fuseau: "Europe/Berlin", attendu: "en/" },
  { locale: "fr-FR", fuseau: "Asia/Tokyo", attendu: "fr-fr/" },
  { locale: "fr-FR", fuseau: "Europe/Paris", attendu: "pays/", js: false, nom: "JavaScript coupé → la racine reste la page de choix" },
  { locale: "fr-FR", fuseau: "Europe/Paris", attendu: "en-gb/", deja: "en-gb", nom: "choix déjà enregistré (en-gb) → en-gb" },
];
console.log("\nPage racine " + adresse);
for (const c of cas) {
  const contexte = await navigateur.newContext({ locale: c.locale, timezoneId: c.fuseau, javaScriptEnabled: c.js !== false });
  if (c.deja) await contexte.addInitScript((code) => localStorage.setItem("ultime-pays", code), c.deja);
  const page = await contexte.newPage();
  await page.goto(adresse, { waitUntil: "networkidle" });
  const arrivee = page.url().slice(adresse.length);
  // Sans JavaScript, on reste sur la racine, qui doit montrer la liste des pays.
  const ok = c.js === false
    ? arrivee === "" && (await page.locator("[data-pays]").count()) === 10
    : arrivee === c.attendu;
  if (!ok) echecs++;
  console.log(`${ok ? "✓" : "✗"} ${c.nom || `${c.locale} + ${c.fuseau} → ${c.attendu}`}${ok ? "" : ` (arrivé sur « ${arrivee} »)`}`);
  await contexte.close();
}
await navigateur.close();
if (echecs) { console.error(`\n✗ ${echecs} cas en échec.`); process.exit(1); }
console.log("\n✓ Tous les cas sont bons.");
