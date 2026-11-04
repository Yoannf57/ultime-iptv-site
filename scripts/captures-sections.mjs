// npm run captures-sections -- <dossier> [adresse] — captures de sections de l'accueil pour un compte rendu
// (JPEG compressés, ordinateur 1440 px et iPhone 393 px), plus une courte vidéo de la visite iPad.
// Pages : fr-fr, en, de-de (grand visuel, visite iPad à 3 moments, tarifs « Pour moi » puis « Pour la famille »),
// et les tarifs de quelques pays (option --tarifs=en-us,fr-ch,…).
// Par défaut : le site local lancé par « npm run preview ».
import { chromium } from "playwright";
import { mkdirSync, renameSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const dossier = args.find((a) => !a.startsWith("--") && !a.startsWith("http"));
if (!dossier) { console.error("Usage : npm run captures-sections -- <dossier> [adresse] [--tarifs=en-us,fr-ch]"); process.exit(1); }
const adresse = (args.find((a) => a.startsWith("http")) || "http://localhost:4321/ultime-iptv-site/").replace(/\/?$/, "/");
const pages = (args.find((a) => a.startsWith("--pages="))?.split("=")[1] || "fr-fr,en,de-de").split(",").filter(Boolean);
const tarifs = (args.find((a) => a.startsWith("--tarifs="))?.split("=")[1] || "").split(",").filter(Boolean);
const sansVideo = args.includes("--sans-video");
mkdirSync(dossier, { recursive: true });
const tailles = { "1440": { width: 1440, height: 900 }, "393": { width: 393, height: 852 } };
const navigateur = await chromium.launch();

async function photo(page, zone, nom) {
  // La barre du haut reste fixe en haut de l'écran : masquée pour ne pas recouvrir la section photographiée.
  await page.addStyleTag({ content: "body > header, .entete { visibility: hidden !important; }" });
  const fichier = join(dossier, `${nom}.jpg`);
  await page.locator(zone).screenshot({ path: fichier, type: "jpeg", quality: 78 });
  console.log("📸 " + fichier);
}
async function imagesPretes(page, zone) {
  await page.waitForFunction((z) => [...document.querySelectorAll(z + " img")].every((i) => !i.checkVisibility() || (i.complete && i.naturalWidth > 0)), zone, { timeout: 15000 }).catch(() => {});
}
async function contexte(code, taille) {
  const c = await navigateur.newContext({ viewport: tailles[taille], deviceScaleFactor: taille === "393" ? 2 : 1, isMobile: taille === "393", hasTouch: taille === "393" });
  await c.addInitScript((p) => localStorage.setItem("ultime-pays", p), code); // pas de bandeau « Vous êtes en… ? »
  return c;
}

for (const code of pages) {
  for (const taille of Object.keys(tailles)) {
    const c = await contexte(code, taille);
    const page = await c.newPage();
    await page.goto(adresse + code + "/", { waitUntil: "networkidle" });
    await imagesPretes(page, ".apercu");
    await photo(page, ".apercu", `${code}-${taille}-1-grand-visuel`);
    // Visite iPad : la section est amenée à l'écran, la souris reste en dehors, puis 3 moments.
    await page.locator("#visite").scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    for (const [n, attente] of [[1, 1200], [2, 4800], [3, 4800]]) {
      await page.waitForTimeout(attente);
      await imagesPretes(page, "#visite");
      await photo(page, "#visite", `${code}-${taille}-2-visite-${n}`);
    }
    for (const [n, f] of [[1, "solo"], [2, "famille"]]) {
      await page.locator(`[data-cible="formule"][data-vue="${f}"]`).click();
      await page.waitForTimeout(400);
      await photo(page, "#tarifs", `${code}-${taille}-3-tarifs-${n}-${f}`);
    }
    await c.close();
  }
}

for (const code of tarifs) {
  for (const taille of Object.keys(tailles)) {
    const c = await contexte(code, taille);
    const page = await c.newPage();
    await page.goto(adresse + code + "/#tarifs", { waitUntil: "networkidle" });
    for (const f of ["solo", "famille"]) {
      if (await page.locator(`[data-cible="formule"][data-vue="${f}"]`).count()) await page.locator(`[data-cible="formule"][data-vue="${f}"]`).click();
      await page.waitForTimeout(400);
      await photo(page, "#tarifs", `tarifs-${code}-${taille}-${f}`);
    }
    await c.close();
  }
}

// Courte vidéo (≈ 16 s, 1440 px, français) de la visite iPad qui avance seule.
if (!sansVideo) {
  const dossierVideo = join(dossier, "video-tmp");
  const c = await navigateur.newContext({ viewport: { width: 1280, height: 860 }, recordVideo: { dir: dossierVideo, size: { width: 1280, height: 860 } } });
  await c.addInitScript(() => localStorage.setItem("ultime-pays", "fr-fr"));
  const page = await c.newPage();
  await page.goto(adresse + "fr-fr/", { waitUntil: "networkidle" });
  await page.evaluate(() => { const v = document.querySelector("#visite"); window.scrollTo(0, v.getBoundingClientRect().top + scrollY + 40); });
  await page.mouse.move(0, 0);
  await page.waitForTimeout(16000);
  await c.close();
  const [video] = readdirSync(dossierVideo);
  renameSync(join(dossierVideo, video), join(dossier, "visite-ipad-fr.webm"));
  rmSync(dossierVideo, { recursive: true });
  console.log("🎬 " + join(dossier, "visite-ipad-fr.webm"));
}
await navigateur.close();
