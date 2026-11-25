/* <hal-publications> : liste de publications tirée de HAL (https://hal.science), filtrable.
 *
 *   <link rel="stylesheet" href="hal.css">
 *   <script src="hal.js" defer></script>
 *   <hal-publications idhal="juliencegarra" highlight="Julien Cegarra" lang="en"></hal-publications>
 *
 * Attributs : idhal ou collection (obligatoire), lang (en, fr), highlight (nom en valeur), limit.
 * Si l'élément contient déjà une liste, elle reste affichée tant que HAL n'a pas répondu, ou s'il est en panne.
 * Le même fichier sert à build.mjs pour écrire cette liste à l'avance. Aucune dépendance.
 */
(function () {
  "use strict";

  var API = "https://api.archives-ouvertes.fr/search/";
  var FIELDS = "halId_s,uri_s,docType_s,title_s,language_s,authFullName_s,journalTitle_s,producedDateY_i," +
    "conferenceTitle_s,bookTitle_s,publisher_s,volume_s,issue_s,page_s,doiId_s,fileMain_s";
  var GROUPS = { ART: "art", ISSUE: "art", COUV: "book", OUV: "book", COMM: "comm", PROCEEDINGS: "comm",
    POSTER: "poster", THESE: "thesis", HDR: "thesis" };  // le reste : "other"
  var ORDER = ["art", "book", "comm", "poster", "thesis", "other"];
  var TEXT = {
    en: { all: "All", art: "Articles", book: "Chapters and books", comm: "Conference papers", poster: "Posters",
      thesis: "Theses", other: "Reports and others", type: "Publication type",
      search: "Title, author, journal, year", none: "No publication matches.", loading: "Loading from HAL…",
      error: "HAL is not responding.", empty: "No publication found on HAL.", see: "See the list on HAL" },
    fr: { all: "Toutes", art: "Articles", book: "Chapitres et ouvrages", comm: "Communications", poster: "Posters",
      thesis: "Thèses", other: "Rapports et autres", type: "Type de publication",
      search: "Titre, auteur, revue, année", none: "Aucune publication ne correspond.",
      loading: "Chargement depuis HAL…", error: "HAL ne répond pas.", empty: "Aucune publication trouvée dans HAL.", see: "Voir la liste sur HAL" }
  };

  // --- Données ------------------------------------------------------------------------------

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function norm(s) {
    return String(s).normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  }

  function typographic(s) { return s.replace(/(?<=[\p{L}\p{N}])'(?=[\p{L}\p{N}])/gu, "’"); }

  function clean(s) {
    s = s.replace(/<\/?[a-z][^>]*>/gi, "").replace(/&(amp|lt|gt|quot|nbsp|#39);/g, function (m, e) {
      return { amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " ", "#39": "'" }[e];
    });
    return typographic(s.replace(/^WIP\s*-\s*/, "").replace(/\s+/g, " ").trim().replace(/\.+$/, "").trim());
  }

  function web(url) { return /^https?:\/\//i.test(url || "") ? url : ""; }

  function doiUrl(doi) { return "https://doi.org/" + encodeURI(doi).replace(/[#?]/g, encodeURIComponent); }

  /** Adresse de la requête HAL pour un chercheur (idhal) ou une collection. */
  function queryUrl(source) {
    var id = source.idhal || source.collection || "";
    if (!/^[\w.-]+$/.test(id)) throw new Error("idhal ou collection manquant");
    var p = new URLSearchParams({ q: source.idhal ? 'authIdHal_s:"' + id + '"' : "*:*", fl: FIELDS,
      rows: "5000", sort: "producedDate_tdate desc,docid desc", wt: "json" });
    return API + (source.idhal ? "" : id + "/") + "?" + p;
  }

  async function load(source) {
    var r = await fetch(queryUrl(source), { signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new Error("HAL : " + r.status);
    var docs = (await r.json()).response.docs;
    if (!docs.length) throw Object.assign(new Error("HAL n'a renvoyé aucune notice"), { empty: true });
    return docs;
  }

  function record(d, aliases) {
    var venue = d.journalTitle_s || d.bookTitle_s || d.conferenceTitle_s || "";
    return { id: d.halId_s || "", group: GROUPS[d.docType_s] || "other", title: clean((d.title_s || [""])[0]),
      lang: (d.language_s || [""])[0], year: d.producedDateY_i || 0,
      authors: (d.authFullName_s || []).map(function (a) { return aliases[a] || a; }),
      venue: venue.replace(/\s+/g, " ").trim().replace(/\.+$/, ""), publisher: venue ? "" : (d.publisher_s || [""])[0],
      volume: d.volume_s || "", issue: (d.issue_s || [""])[0], pages: d.page_s || "",
      doi: d.doiId_s || "", hal: web(d.uri_s), pdf: web(d.fileMain_s) };
  }

  /** Notices HAL -> publications, sans les doubles dépôts (même DOI, ou mêmes titre, type, année et support).
   *  options : extra (notices ajoutées), hidden (identifiants masqués), aliases (noms corrigés). */
  function records(docs, options) {
    var o = options || {}, seen = {}, out = [], hidden = o.hidden || [];
    docs.concat(o.extra || []).forEach(function (d) {
      if (hidden.indexOf(d.halId_s) >= 0) return;
      var r = record(d, o.aliases || {});
      var key = r.doi ? "doi " + r.doi.toLowerCase() : [norm(r.title), r.group, r.year, norm(r.venue)].join("|");
      var first = seen[key];
      if (!first) { seen[key] = r; out.push(r); return; }
      if (r.pdf && !first.pdf) { first.pdf = r.pdf; first.hal = r.hal; }
      ["volume", "issue", "pages", "hal"].forEach(function (f) { first[f] = first[f] || r[f]; });
    });
    return out.sort(function (a, b) {
      return b.year - a.year || ORDER.indexOf(a.group) - ORDER.indexOf(b.group);
    });
  }

  // --- Mise en forme ------------------------------------------------------------------------

  function shortName(full, highlight) {
    var parts = full.split(/\s+/);
    var last = parts.slice(1).filter(function (p) { return !/^\p{L}\.?$/u.test(p); }).join(" ");
    var initials = parts[0].split("-").filter(Boolean).map(function (p) { return p[0] + "."; }).join("-");
    var name = esc(last ? initials + " " + last : full);
    return highlight && norm(full) === norm(highlight) ? "<b>" + name + "</b>" : name;
  }

  function mainUrl(r) { return r.doi ? doiUrl(r.doi) : r.hal; }

  function entry(r, o) {
    var title = esc(r.title), url = mainUrl(r), venue = r.venue ? "<i>" + esc(r.venue) + "</i>" : esc(r.publisher);
    if (url) title = '<a href="' + esc(url) + '">' + title + "</a>";
    if (r.volume && r.group === "art") venue += ", " + esc(r.volume) + (r.issue ? "(" + esc(r.issue) + ")" : "");
    if (/\d\s*[-–]\s*\d/.test(r.pages) && (r.group === "art" || r.group === "book"))
      venue += ", " + esc(r.pages.replace(/\s*[-–]+\s*/g, "–"));
    var links = [[r.pdf, "PDF"], [r.doi && doiUrl(r.doi), "DOI"], [r.hal, "HAL"]]
      .filter(function (l) { return l[0]; })
      .map(function (l) { return '<a href="' + esc(l[0]) + '">' + l[1] + "</a>"; }).join(" ");
    var lang = r.lang && r.lang !== o.lang ? ' lang="' + esc(r.lang) + '"' : "";
    var search = norm([r.title, r.venue, r.year].concat(r.authors).join(" "));
    return '<li data-g="' + r.group + '" data-s="' + esc(search) + '"><span class="hal-t"' + lang + ">" + title +
      '</span><span class="hal-m">' +
      r.authors.map(function (a) { return shortName(a, o.highlight); }).join(", ") +
      '</span><span class="hal-m">' + venue + (venue ? " " : "") + '<span class="hal-l">' + links + "</span></span></li>";
  }

  /** Liste complète en HTML. options : lang, highlight, limit. */
  function render(list, options) {
    var o = options || {}, t = TEXT[o.lang] || TEXT.en, out = "", years = [];
    if (o.limit) list = list.slice(0, o.limit);
    var button = function (g, label, n) {
      return '<button type="button" data-f="' + g + '" aria-pressed="' + !g + '">' + label + " <span>" + n + "</span></button>";
    };
    if (!o.limit) {
      out += '<div class="hal-filters" hidden><div class="hal-types" role="group" aria-label="' + t.type + '">' +
        button("", t.all, list.length) + ORDER.map(function (g) {
          var n = list.filter(function (r) { return r.group === g; }).length;
          return n ? button(g, t[g], n) : "";
        }).join("") + '</div><input type="search" placeholder="' + t.search + '" aria-label="' + t.search +
        '"></div><p class="hal-none" role="status" hidden>' + t.none + "</p>";
    }
    list.forEach(function (r) { if (years.indexOf(r.year) < 0) years.push(r.year); });
    return out + years.map(function (y) {
      return '<section class="hal-year"><h2>' + (y || "") + "</h2><ul>" +
        list.filter(function (r) { return r.year === y; }).map(function (r) { return entry(r, o); }).join("") +
        "</ul></section>";
    }).join("");
  }

  if (typeof HTMLElement !== "undefined") {
    customElements.define("hal-publications", class extends HTMLElement {
      connectedCallback() {
        if (this.started) return;
        this.started = true;
        this.group = "";
        this.addEventListener("click", this.onClick);
        this.addEventListener("input", this.apply);
        if (document.readyState === "loading")
          document.addEventListener("DOMContentLoaded", this.start.bind(this), { once: true });
        else this.start();
      }

      async start() {
        var lang = (this.lang || document.documentElement.lang || "en").slice(0, 2), t = TEXT[lang] || TEXT.en;
        var json = this.querySelector("script[type='application/json']");
        var options = json ? JSON.parse(json.textContent) : {};
        var source = { idhal: this.getAttribute("idhal"), collection: this.getAttribute("collection") };
        var box = this.querySelector(".hal-list");
        if (!box) {
          box = document.createElement("div");
          box.className = "hal-list";
          box.innerHTML = '<p role="status">' + t.loading + "</p>";
          this.append(box);
        }
        this.reveal();
        var before = box.querySelector(".hal-year");
        try {
          var html = render(records(await load(source), options), { lang: lang,
            highlight: this.getAttribute("highlight"), limit: Number(this.getAttribute("limit")) || 0 });
          var next = document.createElement("div");
          next.innerHTML = html;
          this.swap(box, next);
          this.dataset.state = "live";
        } catch (e) {
          this.dataset.state = "error";
          if (before) return;  // la liste écrite à l'avance reste en place
          var id = source.idhal || source.collection || "";
          box.innerHTML = '<p role="status">' + (e.empty ? t.empty : t.error) + (id && !e.empty ? ' <a href="https://' +
            (source.idhal ? "cv.hal.science/" : "hal.science/") + esc(encodeURIComponent(id)) + '">' + t.see + "</a>" : "") + "</p>";
        }
      }

      /** Remplace la liste sans toucher au champ de recherche, pour ne pas gêner une saisie en cours. */
      swap(box, next) {
        var list = function (el) { return [].map.call(el.querySelectorAll(".hal-year"), function (y) { return y.outerHTML; }).join(""); };
        var a = box.cloneNode(true);
        a.querySelectorAll(".hal-year, .hal-year li").forEach(function (el) { el.hidden = false; });
        if (list(a) === list(next)) return;
        var old = box.querySelector(".hal-types"), fresh = next.querySelector(".hal-types");
        if (!old || !fresh) { box.replaceChildren.apply(box, [].slice.call(next.childNodes)); }
        else {
          old.innerHTML = fresh.innerHTML;
          box.querySelectorAll(".hal-year").forEach(function (y) { y.remove(); });
          box.append.apply(box, [].slice.call(next.querySelectorAll(".hal-year")));
          if (!old.querySelector('[data-f="' + this.group + '"]')) this.group = "";
        }
        this.reveal();
        this.press();
        this.apply();
      }

      reveal() {
        var f = this.querySelector(".hal-filters");
        if (f) f.hidden = false;
      }

      press() {
        var g = this.group;
        this.querySelectorAll(".hal-types button").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.f === g));
        });
      }

      onClick(e) {
        var b = e.target.closest(".hal-types button");
        if (!b) return;
        this.group = b.dataset.f;
        this.press();
        this.apply();
      }

      apply() {
        var input = this.querySelector(".hal-filters input"), none = this.querySelector(".hal-none"), g = this.group;
        if (!input) return;
        var words = norm(input.value).split(" "), any = false;
        this.querySelectorAll(".hal-year").forEach(function (y) {
          var left = false;
          y.querySelectorAll("li").forEach(function (li) {
            var ok = (!g || li.dataset.g === g) && words.every(function (w) { return li.dataset.s.indexOf(w) >= 0; });
            li.hidden = !ok;
            left = left || ok;
          });
          y.hidden = !left;
          any = any || left;
        });
        none.hidden = any;
      }
    });
  }

  globalThis.HAL = { load: load, records: records, render: render, mainUrl: mainUrl, esc: esc, typographic: typographic };
})();
