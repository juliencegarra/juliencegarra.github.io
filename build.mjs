/* Construit le site dans _site/ : accueil et publications, en anglais (racine) et en français (fr/).
 *
 *     node build.mjs            interroge HAL, met à jour data/hal.json, construit le site
 *     node build.mjs --offline  construit avec data/hal.json, sans réseau
 *
 * Aucune dépendance. Les textes sont dans content.mjs ; la liste des publications vient de static/hal.js,
 * qui la remet à jour depuis HAL à l'ouverture de la page.
 */
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALIASES, EXTRA, HAL_ID, HIDDEN, NAME, SELECTED, T } from "./content.mjs";
import "./static/hal.js";

const { load, records, render, mainUrl, esc, typographic } = globalThis.HAL;
const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "_site");
const CACHE = join(ROOT, "data", "hal.json");
const OPTIONS = { extra: EXTRA, hidden: HIDDEN, aliases: ALIASES };

/** Notices HAL ; en cas de panne de HAL, la dernière copie enregistrée. */
async function notices() {
  if (!process.argv.includes("--offline")) {
    try {
      const docs = await load({ idhal: HAL_ID });
      mkdirSync(dirname(CACHE), { recursive: true });
      writeFileSync(CACHE, JSON.stringify(docs, null, 1) + "\n");
      return docs;
    } catch (e) {
      console.error(`HAL injoignable (${e.message}) : copie locale utilisée`);
    }
  }
  return JSON.parse(readFileSync(CACHE, "utf8"));
}

/** Apostrophe courbe dans les textes, hors balises. */
function curly(x) {
  if (typeof x === "string") return x.split(/(<[^>]*>)/).map((s, i) => (i % 2 ? s : typographic(s))).join("");
  if (Array.isArray(x)) return x.map(curly);
  if (x && typeof x === "object") return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, curly(v)]));
  return x;
}

/* Compaction des fichiers envoyés ; les sources restent lisibles dans le dépôt. */
const compact = {
  html: (s) => s.replace(/>\s*\n\s*</g, "><").replace(/\s*\n\s*/g, " ").trim(),
  css: (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/ ?([{};,]) ?/g, "$1")
    .replace(/: /g, ":").replace(/;}/g, "}").trim(),
  // Commentaires et retraits seulement : les fins de ligne restent, pour ne rien changer au sens
  js: (s) => s.replace(/^\s*\/\*[\s\S]*?\*\/\s*$/gm, "").replace(/^\s*\/\/.*$/gm, "").replace(/ {2}\/\/ .*$/gm, "")
    .replace(/^\s+|[ \t]+$/gm, "").replace(/\n{2,}/g, "\n").trim(),
};

const rows = (list) =>
  `<dl class="rows">${list.map(([d, t]) => `<div><dt>${d}</dt><dd>${t}</dd></div>`).join("")}</dl>`;

function page(lang, name, title, body, t, head = "") {
  const root = lang === "fr" ? "../" : "";
  const other = (lang === "fr" ? "../" : "fr/") + name;
  const nav = [["index.html", t.home], ["publications.html", t.pubs]]
    .map(([n, label]) => `<a href="${n}"${n === name ? ' aria-current="page"' : ""}>${esc(label)}</a>`).join("");
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(t.description)}">
<link rel="alternate" hreflang="${t.other_lang}" href="${other}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%231f4e5f'/%3E%3Ctext x='16' y='22' font-family='Georgia' font-size='17' fill='white' text-anchor='middle'%3EJC%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="${root}style.css">
${head.replaceAll("{root}", root)}</head>
<body>
<header><a class="name" href="index.html">${esc(NAME)}</a>
<nav>${nav}<a href="${other}" hreflang="${t.other_lang}" lang="${t.other_lang}">${t.other_label}</a></nav></header>
<main>
${body}
</main>
</body>
</html>
`;
}

function home(lang, t, list) {
  const papers = SELECTED.flatMap((id) => {
    const r = list.find((x) => x.id === id);
    if (!r) { console.error(`Sélection : ${id} introuvable`); return []; }
    const hl = r.lang && r.lang !== lang ? ` lang="${r.lang}"` : "";
    const pdf = r.pdf ? ` <a class="aside" href="${esc(r.pdf)}">(pdf)</a>` : "";
    return [[r.year, `<a href="${esc(mainUrl(r))}"${hl}>${esc(r.title)}</a>. <i class="j">${esc(r.venue)}</i>.${pdf}`]];
  });
  const photo = readdirSync(join(ROOT, "static")).find((f) => /^photo\./.test(f));
  const portrait = photo
    ? `<img src="${lang === "fr" ? "../" : ""}${photo}" alt="${esc(NAME)}" width="150" height="150">`
    : '<div class="mono" aria-hidden="true">JC</div>';
  const body = `<div class="home"><div class="portrait">${portrait}</div><div class="text">` +
    t.bio.map((p) => `<p>${p}</p>`).join("") + `<p class="links">${t.links.join(" / ")}</p>` +
    `<h2>${esc(t.selected)}</h2>${rows(papers)}` +
    `<p class="more"><a href="publications.html">${esc(t.all_pubs)}</a></p>` +
    t.sections.map(([h, list]) => `<h2>${esc(h)}</h2>${rows(list)}`).join("") + "</div></div>";
  return page(lang, "index.html", NAME, body, t);
}

function publications(lang, t, list) {
  const options = JSON.stringify(OPTIONS).replaceAll("<", "\\u003c");
  const body = `<div class="pubs"><h1>${esc(t.pubs)}</h1>
<hal-publications idhal="${HAL_ID}" highlight="${esc(NAME)}" lang="${lang}">
<script type="application/json">${options}</script>
<div class="hal-list">${render(list, { lang, highlight: NAME })}</div>
</hal-publications></div>`;
  return page(lang, "publications.html", `${t.pubs} · ${NAME}`, body, t,
    '<link rel="stylesheet" href="{root}hal.css">\n<script src="{root}hal.js" defer></script>\n');
}

const docs = await notices();
const list = records(docs, OPTIONS);
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) rmSync(join(OUT, f), { recursive: true });
cpSync(join(ROOT, "static"), OUT, { recursive: true });
for (const f of readdirSync(OUT)) {
  const type = compact[f.split(".").pop()];
  if (type) writeFileSync(join(OUT, f), type(readFileSync(join(OUT, f), "utf8").replace(/\r/g, "")));
}
writeFileSync(join(OUT, ".nojekyll"), "");
for (const [lang, folder] of [["en", OUT], ["fr", join(OUT, "fr")]]) {
  mkdirSync(folder, { recursive: true });
  const t = curly(T[lang]);
  writeFileSync(join(folder, "index.html"), compact.html(home(lang, t, list)));
  writeFileSync(join(folder, "publications.html"), compact.html(publications(lang, t, list)));
}
console.log(`${docs.length} notices HAL, ${list.length} publications affichées -> ${OUT}`);
