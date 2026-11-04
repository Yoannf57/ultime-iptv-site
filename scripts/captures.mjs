// npm run captures [adresse] — captures Playwright (ordinateur 1440 px, iPhone 393 px), en français et en anglais,
// plus un test de la page racine (pays deviné selon la langue et le fuseau horaire du navigateur).
// Par défaut : le site local lancé par « npm run preview » (http://localhost:4321/ultime-iptv-site/).
// Les images vont dans captures/ (non versionné).
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";
const listePays = JSON.parse(readFileSync(new URL("../src/pays.json", import.meta.url), "utf8"));
const nombrePays = listePays.length;
const existe = (code) => listePays.some((p) => p.code === code);

const adresse = (process.argv.slice(2).find((a) => !a.startsWith("--")) || "http://localhost:4321/ultime-iptv-site/").replace(/\/?$/, "/");
const dossier = new URL("../captures/", import.meta.url).pathname;
mkdirSync(dossier, { recursive: true });

const tailles = { ordi: { width: 1440, height: 900 }, iphone: { width: 393, height: 852 } };
const pages = [
  { nom: "fr-fr", chemin: "fr-fr/", locale: "fr-FR", fuseau: "Europe/Paris" },
  { nom: "en", chemin: "en/", locale: "en-GB", fuseau: "Europe/London" },
  { nom: "choix", chemin: "pays/", locale: "fr-FR", fuseau: "Europe/Paris" },
  // Pages obligatoires (S3).
  ...["support", "privacy", "terms", "legal"].flatMap((page) => [
    { nom: `${page}-fr-fr`, chemin: `fr-fr/${page}/`, locale: "fr-FR", fuseau: "Europe/Paris" },
    { nom: `${page}-en`, chemin: `en/${page}/`, locale: "en-GB", fuseau: "Europe/London" },
  ]),
  { nom: "404-fr", chemin: "nexiste-pas/", locale: "fr-FR", fuseau: "Europe/Paris" },
  { nom: "404-en", chemin: "nexiste-pas/", locale: "en-GB", fuseau: "Europe/London" },
  // Autres langues (04/11/2026) : accueil et support en allemand et en néerlandais, s'ils existent.
  ...[["de-de", "de-DE", "Europe/Berlin"], ["nl-nl", "nl-NL", "Europe/Amsterdam"]].filter(([c]) => existe(c)).flatMap(([c, locale, fuseau]) => [
    { nom: c, chemin: `${c}/`, locale, fuseau },
    { nom: `support-${c}`, chemin: `${c}/support/`, locale, fuseau },
  ]),
  // Bandeau : navigateur belge qui arrive sur la page France.
  { nom: "bandeau-fr-be", chemin: "fr-fr/", locale: "fr-BE", fuseau: "Europe/Brussels" },
];

// Fait défiler toute la page pour que les captures « lazy » visibles se chargent avant la photo.
async function chargerImages(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => [...document.images].every((i) => !i.checkVisibility() || (i.complete && i.naturalWidth > 0)), null, { timeout: 15000 }).catch(() => console.log("  (images encore en chargement)"));
}

const navigateur = await chromium.launch();
let echecs = 0;

const seulement = process.argv.find((a) => a.startsWith("--seulement="))?.split("=")[1].split(",");
if (!process.argv.includes("--sans-captures")) {
  for (const p of pages.filter((x) => !seulement || seulement.includes(x.nom))) {
    for (const [taille, viewport] of Object.entries(tailles)) {
      const contexte = await navigateur.newContext({
        viewport, locale: p.locale, timezoneId: p.fuseau, reducedMotion: "reduce",
        deviceScaleFactor: taille === "iphone" ? 3 : 1, isMobile: taille === "iphone", hasTouch: taille === "iphone",
      });
      const page = await contexte.newPage();
      await page.goto(adresse + p.chemin, { waitUntil: "networkidle" });
      await chargerImages(page);
      const fichier = `${dossier}${p.nom}-${taille}.png`;
      await page.screenshot({ path: fichier, fullPage: true });
      console.log("📸 " + fichier);
      await contexte.close();
    }
  }
}

// États cliquables de l'accueil (captures d'éléments, ordinateur 1440 px) et page sans JavaScript.
if (!process.argv.includes("--sans-captures")) {
  const contexte = await navigateur.newContext({ viewport: tailles.ordi, locale: "fr-FR", timezoneId: "Europe/Paris" });
  await contexte.addInitScript(() => localStorage.setItem("ultime-pays", "fr-fr"));
  const page = await contexte.newPage();
  await page.goto(adresse + "fr-fr/", { waitUntil: "networkidle" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const etats = [
    { nom: "apercu", zone: ".apercu", boutons: '[data-cible="apercu"]' },
    { nom: "visite", zone: "#visite", boutons: "[data-onglet]", attribut: "data-onglet" },
    { nom: "formule", zone: "#tarifs", boutons: '[data-cible="formule"]' },
  ];
  for (const e of etats) {
    const boutons = page.locator(e.boutons);
    for (let i = 0; i < (await boutons.count()); i++) {
      const b = boutons.nth(i);
      const vue = await b.getAttribute(e.attribut || "data-vue");
      await b.click();
      await page.waitForLoadState("networkidle");
      await page.waitForFunction((z) => [...document.querySelectorAll(z + " img")].every((i) => !i.checkVisibility() || (i.complete && i.naturalWidth > 0)), e.zone);
      const pressee = await b.getAttribute("aria-pressed");
      if (pressee !== "true") { echecs++; console.log(`✗ ${e.nom}/${vue} : aria-pressed n'est pas passé à true`); }
      const fichier = `${dossier}etat-${e.nom}-${vue}.png`;
      await page.locator(e.zone).screenshot({ path: fichier });
      console.log("📸 " + fichier);
    }
    await boutons.first().click();
  }
  await contexte.close();
  const sansJS = await navigateur.newContext({ viewport: tailles.ordi, locale: "fr-FR", timezoneId: "Europe/Paris", javaScriptEnabled: false });
  const p2 = await sansJS.newPage();
  await p2.goto(adresse + "fr-fr/", { waitUntil: "networkidle" });
  await p2.screenshot({ path: `${dossier}sans-js-fr-fr-ordi.png`, fullPage: true });
  console.log("📸 " + `${dossier}sans-js-fr-fr-ordi.png`);
  await sansJS.close();

  // Pied de page zoomé (×2) : le logo TMDB doit être chargé.
  for (const [taille, viewport] of Object.entries(tailles)) {
    const c = await navigateur.newContext({ viewport, deviceScaleFactor: 2, locale: "fr-FR", timezoneId: "Europe/Paris", reducedMotion: "reduce" });
    const p = await c.newPage();
    await p.goto(adresse + "fr-fr/", { waitUntil: "networkidle" });
    const charge = await p.locator("footer img.tmdb").evaluate((i) => i.complete && i.naturalWidth > 0);
    if (!charge) { echecs++; console.log(`✗ logo TMDB non chargé (${taille})`); }
    await p.locator("footer").screenshot({ path: `${dossier}pied-${taille}.png` });
    console.log("📸 " + `${dossier}pied-${taille}.png`);
    await c.close();
  }
}

// Page 404 : le lien « Accueil » doit suivre le pays enregistré, sinon le pays deviné.
for (const c of [
  { locale: "fr-FR", fuseau: "Europe/Paris", attendu: "fr-fr/" },
  { locale: "en-US", fuseau: "America/New_York", attendu: "en-us/" },
  { locale: "fr-FR", fuseau: "Europe/Paris", deja: "fr-ca", attendu: "fr-ca/" },
]) {
  const contexte = await navigateur.newContext({ locale: c.locale, timezoneId: c.fuseau });
  if (c.deja) await contexte.addInitScript((code) => localStorage.setItem("ultime-pays", code), c.deja);
  const page = await contexte.newPage();
  const reponse = await page.goto(adresse + "nexiste-pas/", { waitUntil: "networkidle" });
  const href = await page.locator("main [data-accueil]").first().getAttribute("href");
  const ok = reponse.status() === 404 && href === new URL(adresse).pathname + c.attendu;
  if (!ok) echecs++;
  console.log(`${ok ? "✓" : "✗"} 404 (${c.locale}${c.deja ? `, choix ${c.deja}` : ""}) → Accueil = ${href} (code ${reponse.status()})`);
  await contexte.close();
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
  { locale: "de-DE", fuseau: "Europe/Berlin", attendu: existe("de-de") ? "de-de/" : "en/" },
  { locale: "de-CH", fuseau: "Europe/Zurich", attendu: existe("de-ch") ? "de-ch/" : "en/" },
  { locale: "nl-BE", fuseau: "Europe/Brussels", attendu: existe("nl-be") ? "nl-be/" : "en/" },
  { locale: "nl-NL", fuseau: "Europe/Amsterdam", attendu: existe("nl-nl") ? "nl-nl/" : "en/" },
  { locale: "nb-NO", fuseau: "Europe/Oslo", attendu: existe("nb-no") ? "nb-no/" : "en/" },
  { locale: "no", fuseau: "Europe/Oslo", attendu: existe("nb-no") ? "nb-no/" : "en/" },
  { locale: "pt-BR", fuseau: "America/Sao_Paulo", attendu: existe("pt-br") ? "pt-br/" : "en/" },
  { locale: "pt-PT", fuseau: "Europe/Lisbon", attendu: existe("pt-pt") ? "pt-pt/" : "en/" },
  { locale: "pt", fuseau: "America/Sao_Paulo", attendu: existe("pt-br") ? "pt-br/" : existe("pt-pt") ? "pt-pt/" : "en/" },
  { locale: "es-ES", fuseau: "Europe/Madrid", attendu: existe("es-es") ? "es-es/" : "en/" },
  { locale: "es-MX", fuseau: "America/Mexico_City", attendu: existe("es-mx") ? "es-mx/" : "es/" },
  // Pays absents de la liste : page internationale de la langue (04/11/2026).
  { locale: "es-AR", fuseau: "America/Argentina/Buenos_Aires", attendu: "es/" },
  { locale: "fr-SN", fuseau: "Africa/Dakar", attendu: "fr/" },
  { locale: "pt-AO", fuseau: "Africa/Luanda", attendu: "pt/" },
  { locale: "de-LU", fuseau: "Europe/Luxembourg", attendu: existe("de-lu") ? "de-lu/" : "de/" },
  { locale: "it-CH", fuseau: "Europe/Zurich", attendu: existe("it-ch") ? "it-ch/" : "it/" },
  { locale: "en-AU", fuseau: "Australia/Sydney", attendu: existe("en-au") ? "en-au/" : "en/" },
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
    ? arrivee === "" && (await page.locator("[data-pays]").count()) === nombrePays
    : arrivee === c.attendu;
  if (!ok) echecs++;
  console.log(`${ok ? "✓" : "✗"} ${c.nom || `${c.locale} + ${c.fuseau} → ${c.attendu}`}${ok ? "" : ` (arrivé sur « ${arrivee} »)`}`);
  await contexte.close();
}
await navigateur.close();
if (echecs) { console.error(`\n✗ ${echecs} cas en échec.`); process.exit(1); }
console.log("\n✓ Tous les cas sont bons.");
