// node scripts/captures-offre.mjs <dossier> [adresse] [--sans-captures] — offre Black Friday (site.config.mjs).
// 1. Captures (JPEG) des pages fr-fr, en-gb, en-us, de-de et en, à 1440 et 393 px, avec ?date= au 25/11, au 30/11
//    et au 01/12 : haut de page (bandeau, pastille, titre), section #offre, tarifs « Pour moi » et « Pour la
//    famille », question de la FAQ.
// 2. Contrôles sans image, sur toutes les pages d'accueil : l'offre est visible jusqu'à la date de fin, absente le
//    lendemain et sans JavaScript ; rien ne dépasse la largeur de l'écran à 320 et 393 px.
// Par défaut : le site local lancé par « npm run preview », construit avec blackFriday.actif à true.
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import config from "../site.config.mjs";

const args = process.argv.slice(2);
const dossier = args.find((a) => !a.startsWith("--") && !a.startsWith("http"));
if (!dossier) { console.error("Usage : node scripts/captures-offre.mjs <dossier> [adresse] [--sans-captures]"); process.exit(1); }
const adresse = (args.find((a) => a.startsWith("http")) || "http://localhost:4321/ultime-iptv-site/").replace(/\/?$/, "/");
const sansCaptures = args.includes("--sans-captures");
mkdirSync(dossier, { recursive: true });

const fin = config.blackFriday.fin;
const lendemain = new Date(new Date(`${fin}T12:00:00Z`).getTime() + 86400000).toISOString().slice(0, 10);
const pages = ["fr-fr", "en-gb", "en-us", "de-de", "en"];
const dates = ["2026-11-25", fin, lendemain];
const tailles = { "1440": { width: 1440, height: 900 }, "393": { width: 393, height: 852 } };
const tous = JSON.parse(readFileSync(new URL("../src/pays.json", import.meta.url), "utf8")).map((p) => p.code);
const navigateur = await chromium.launch();
let echecs = 0;
const verifier = (ok, message) => { if (!ok) { echecs++; console.error("✗ " + message); } };

async function ouvrir(code, largeur, date, options = {}) {
  const c = await navigateur.newContext({ viewport: tailles[largeur] || { width: Number(largeur), height: 800 }, deviceScaleFactor: largeur === "1440" ? 1 : 2, isMobile: largeur !== "1440", hasTouch: largeur !== "1440", ...options });
  await c.addInitScript((p) => localStorage.setItem("ultime-pays", p), code); // pas de bandeau « Vous êtes en… ? »
  const page = await c.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" }); // rien ne bouge pendant les photos
  await page.goto(`${adresse}${code}/?date=${date}`, { waitUntil: "networkidle" });
  return { c, page };
}
async function photo(page, cible, nom, masquerEntete = true) {
  if (masquerEntete) await page.addStyleTag({ content: ".entete { visibility: hidden !important; }" });
  const fichier = join(dossier, `${nom}.jpg`);
  if (cible) await page.locator(cible).screenshot({ path: fichier, type: "jpeg", quality: 80 });
  else await page.screenshot({ path: fichier, type: "jpeg", quality: 80 });
  console.log("📸 " + fichier);
}

if (!sansCaptures) {
  for (const code of pages) for (const largeur of Object.keys(tailles)) for (const date of dates) {
    const { c, page } = await ouvrir(code, largeur, date);
    const nom = `${code}-${largeur}-${date}`;
    await photo(page, null, `${nom}-1-haut`, false);
    if (await page.locator("#offre").isVisible()) await photo(page, "#offre", `${nom}-2-offre`);
    for (const f of ["solo", "famille"]) {
      await page.locator(`[data-cible="formule"][data-vue="${f}"]`).click();
      await page.waitForTimeout(300);
      await photo(page, "#tarifs", `${nom}-3-tarifs-${f}`);
    }
    if (date === dates[0]) {
      const question = page.locator("#questions details.bf-offre");
      await question.locator("summary").click();
      await photo(page, "#questions", `${nom}-4-questions`);
    }
    await c.close();
  }
  // Les deux bandeaux ensemble : visiteur belge sur la page France.
  for (const largeur of Object.keys(tailles)) {
    const c = await navigateur.newContext({ viewport: tailles[largeur], locale: "fr-BE", timezoneId: "Europe/Brussels", deviceScaleFactor: largeur === "1440" ? 1 : 2 });
    const page = await c.newPage();
    await page.goto(`${adresse}fr-fr/?date=${dates[0]}`, { waitUntil: "networkidle" });
    await photo(page, null, `deux-bandeaux-fr-fr-${largeur}`, false);
    await c.close();
  }
}

// Contrôles sur toutes les pages d'accueil.
const elements = [".bandeau-offre", ".pastille-offre", "#offre", "#tarifs .offre.bf-offre", "#questions details.bf-offre"];
for (const code of tous) {
  for (const [date, attendu] of [[dates[0], true], [fin, true], [lendemain, false]]) {
    const { c, page } = await ouvrir(code, "393", date);
    for (const e of elements) verifier((await page.locator(e).first().isVisible()) === attendu, `${code} au ${date} : ${e} devrait être ${attendu ? "visible" : "caché"}`);
    verifier((await page.locator("#tarifs .offre.bf-normal").first().isVisible()) === !attendu, `${code} au ${date} : carte « à vie » normale`);
    await c.close();
  }
  const sansJs = await ouvrir(code, "393", dates[0], { javaScriptEnabled: false });
  for (const e of elements) verifier(!(await sansJs.page.locator(e).first().isVisible()), `${code} sans JavaScript : ${e} devrait être caché`);
  await sansJs.c.close();
  for (const largeur of ["320", "393"]) {
    const { c, page } = await ouvrir(code, largeur, dates[0]);
    const mesure = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, ecran: document.documentElement.clientWidth }));
    verifier(mesure.page <= mesure.ecran, `${code} à ${largeur} px : la page fait ${mesure.page} px de large pour un écran de ${mesure.ecran} px`);
    await c.close();
  }
}
await navigateur.close();
if (echecs) { console.error(`✗ ${echecs} contrôle(s) en échec.`); process.exit(1); }
console.log(`✓ Offre visible jusqu'au ${fin}, absente le ${lendemain} et sans JavaScript ; rien ne dépasse à 320 et 393 px (${tous.length} pages).`);
