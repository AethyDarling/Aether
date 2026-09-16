#!/usr/bin/env node
/*
  tools/build.js — regenerates the Codex-derived parts of index.html.

  The site is still one self-contained file with no runtime dependencies.
  This script only exists so the pages stay a faithful rendering of the
  markdown under codex/ instead of a hand transcription that drifts. Run
  it after editing anything in codex/ (or tools/annotations.js):

      node tools/build.js

  It rewrites two marked regions of index.html in place:

      <!-- BUILD:pages -->  ...generated <template> pages...  <!-- /BUILD:pages -->
      (and a matching BUILD:data / /BUILD:data pair of JS comments around
      the generated data arrays inside the script block)

  Everything outside those markers (CSS, shell, home page, workbench,
  scripts) is hand-authored and untouched.
*/
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CODEX = path.join(ROOT, "codex");
const INDEX = path.join(ROOT, "index.html");
const ANN = require("./annotations.js");

const read = (f) => fs.readFileSync(path.join(CODEX, f + ".md"), "utf8");

/* ───────────────────────── page table ───────────────────────── */
// One site page per Codex file. `part` labels the running head.
const PAGES = [
  { file: "foundations",          route: "foundations",          part: "Part I",   nav: "Foundations",        tier: "found" },
  { file: "grand-equation",       route: "grand-equation",       part: "Part II",  nav: "The Grand Equation", tier: "found" },
  { file: "power-hierarchy",      route: "hierarchy",            part: "Part III", nav: "The Power Hierarchy",tier: "found" },
  { file: "techniques-novice",    route: "techniques/novice",    part: "Part IV",  nav: "Novice",             tier: "gauge" },
  { file: "techniques-journeyman",route: "techniques/journeyman",part: "Part IV",  nav: "Journeyman",         tier: "gauge" },
  { file: "techniques-adept",     route: "techniques/adept",     part: "Part IV",  nav: "Adept",              tier: "gauge" },
  { file: "techniques-artisan",   route: "techniques/artisan",   part: "Part IV",  nav: "Artisan",            tier: "quark" },
  { file: "techniques-master",    route: "techniques/master",    part: "Part IV",  nav: "Master",             tier: "quark" },
  { file: "techniques-warden",    route: "techniques/warden",    part: "Part IV",  nav: "Warden",             tier: "metric" },
  { file: "techniques-sovereign", route: "techniques/sovereign", part: "Part IV",  nav: "Sovereign",          tier: "metric" },
  { file: "techniques-legend",    route: "techniques/legend",    part: "Part IV",  nav: "Legend",             tier: "metric" },
  { file: "techniques-ascension", route: "techniques/ascension", part: "Part IV",  nav: "The Ascent",         tier: "dm" },
  { file: "changelog",            route: "changelog",            part: "Reference",nav: "Changelog",          tier: "found" },
];
const FILE_ROUTE = {
  "overview": "", "foundations": "foundations", "grand-equation": "grand-equation",
  "power-hierarchy": "hierarchy", "techniques-novice": "techniques/novice",
  "techniques-journeyman": "techniques/journeyman", "techniques-adept": "techniques/adept",
  "techniques-artisan": "techniques/artisan", "techniques-master": "techniques/master",
  "techniques-warden": "techniques/warden", "techniques-sovereign": "techniques/sovereign",
  "techniques-legend": "techniques/legend", "techniques-ascension": "techniques/ascension",
  "spell-directory": "directory", "glossary": "glossary", "changelog": "changelog",
};

/* ───────────────────────── helpers ───────────────────────── */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const eqId = (n) => "eq-" + n.replace(/\./g, "-");
const secId = (n) => "sec-" + n.replace(/\./g, "-");

/* ───────────────────────── glossary ───────────────────────── */
function parseTable(lines) {
  // lines: array of `| a | b |` rows incl. header + separator
  const rows = lines.map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
  const head = rows[0];
  const body = rows.slice(2);
  return { head, body };
}
function tablesIn(md) {
  const out = [];
  const lines = md.split("\n");
  let cur = null;
  for (const l of lines) {
    if (/^\s*\|/.test(l)) { (cur = cur || []).push(l); }
    else if (cur) { out.push(cur); cur = null; }
  }
  if (cur) out.push(cur);
  return out.map(parseTable);
}

const glossaryMd = read("glossary");
const glossTables = tablesIn(glossaryMd);
// §5 symbol table (first), §5.1 new symbols (2nd), §5.1 terms (3rd), §5.2 terms (4th), §6 eq index (5th)
const SYMROWS = glossTables[0].body.concat(glossTables[1].body);
const TERMROWS = glossTables[2].body.map((r) => r.concat(["v2.5"])).concat(glossTables[3].body.map((r) => r.concat(["v2.6"])));
const EQROWS = glossTables[4].body;

// Extra symbols the glossary defers to §1 for, so tooltips cover them too.
const EXTRA_SYMS = [
  ["`Ae_0`", "The ambient, uniform, inexhaustible value of the aether field — inert on its own; never drawn down by a casting", "Eq. 1.1"],
  ["`dAe`, `dAe(x, t)`", "The local perturbation (ripple) superimposed on `Ae_0` at the moment and place of a casting — the only part of the field that ever does anything", "Eq. 1.1"],
  ["`J_cast`, `J_cast(x', t')`", "The source current the caster's invocation injects into the aether field — `phi_actual` in its role as a physical source", "Eq. 1.2"],
  ["`G`, `G(x, x'; t, t'; g)`", "The propagator: how strongly and after what delay a disturbance sourced at one point is felt at another, given the geometry `g`", "Eq. 1.2"],
  ["`delta(F_f)`, `delta(M_op)`, `delta(g)`", "The three coupling channels: gauge-sector, quark-sector and metric-sector distortions produced by a ripple", "Eq. 1.3"],
  ["`k_EM`", "The electromagnetic coupling constant — one of the four `k_f` terms; the first any student solves", "Eq. 3.1c"],
  ["`k_grav`", "The gravitational coupling constant — one of the four `k_f` terms; a force-coupling, not the metric itself", "Eq. 3.1c"],
  ["`k_strong`", "The strong-force coupling constant — one of the four `k_f` terms", "Eq. 3.1c"],
  ["`k_weak`", "The weak-force coupling constant — smallest of the four `k_f` terms by a wide margin", "Eq. 3.1c"],
  ["`L_total`, `L_gauge`, `L_quark`", "The total Lagrangian density and its gauge and quark pieces", "Eq. 3.1b"],
  ["`Action`", "The aether action: `L_total` integrated over all of spacetime", "Eq. 3.1a"],
  ["`Xi_0`, `Xi_1`", "The leading terms of a Warden's perturbative expansion of `Xi(Ae, g)` around flat space", "Eq. 3.1f"],
  ["`Xi_valid`", "Where and when a solved `Xi(Ae, g)` remains valid: inside `R_dom`, before `t_dom`", "Eq. 3.1g"],
  ["`X_1`, `X_2`", "Any two solved Novice-tier expressions held in sequence by a Journeyman", "Eq. 4.13"],
  ["`X_seq`", "Total Journeyman output over time — a sum of non-overlapping contributions", "Eq. 4.13"],
  ["`X_combo`", "An Adept's combined output from one ripple satisfying two gauge channels", "Eq. 4.15"],
  ["`mismatch(Om2)`", "Mismatch between the caster's assumed and the true conformal factor of the destination", "Eq. 4.6"],
  ["`P_arrive`", "Probability of clean arrival at the moment a fold is released", "Eq. 4.5"],
  ["`t_hold`", "Sustain duration of a held (rather than discharged) casting — distinct from `t_ins`", "§5.1"],
];

// symbol lookup: full-string key and base-identifier key → {def, src}
const SYM = {};
function addSym(cell, def, src) {
  const parts = cell.split(/`\s*,\s*`/).map((p) => p.replace(/`/g, "").trim()).filter(Boolean);
  for (const p of parts) {
    const base = p.replace(/[\(\[].*$/, "").trim();
    if (!SYM[p]) SYM[p] = { s: p, d: def, src };
    if (base && !SYM[base]) SYM[base] = { s: p, d: def, src };
  }
}
for (const r of SYMROWS) addSym(r[0], r[1], r[2]);
for (const r of EXTRA_SYMS) addSym(r[0], r[1], r[2]);

/* eq number → route, section → route (filled while converting pages) */
const EQ_ROUTE = {}, SEC_ROUTE = {};
// pre-seed from the equation index so cross-links resolve even on first pass
const SEC_FILE_HINT = { "4.4": "directory", "5": "glossary", "5.1": "glossary", "5.2": "glossary", "6": "glossary", "7": "changelog", "4": "techniques/novice", "4.0": "techniques/novice", "4.0d": "directory" };
for (const r of EQROWS) {
  const sec = r[2].replace("§", "");
  EQ_ROUTE[r[0]] = null; // filled below
}
// Equation Index rows → EQINDEX data with tier class
const TIER_CLASS = (t) => /Foundational/.test(t) ? "found" : /Beyond/.test(t) ? "dm" : /Novice|Journeyman|Adept/.test(t) ? "gauge" : /Artisan|Master/.test(t) ? "quark" : "metric";
const EQ_META = {};
for (const r of EQROWS) EQ_META[r[0]] = { name: r[1], sec: r[2], tier: r[3], desc: r[4], cls: TIER_CLASS(r[3]) };
EQ_META["1.1"] = { name: "Aether Field Decomposition", sec: "§1.1", tier: "Foundational", desc: "Splits the field into an inert ambient value and the ripple that does the work", cls: "found" };
EQ_META["1.2"] = { name: "Ripple Sourcing and Propagation", sec: "§1.2", tier: "Foundational", desc: "How a caster's source current spreads through the aether layer", cls: "found" };
EQ_META["1.3"] = { name: "Surface Coupling", sec: "§1.3", tier: "Foundational", desc: "The three channels through which a ripple pushes on the upper fields", cls: "found" };
EQ_META["1.4"] = { name: "Propagator Self-Dependence", sec: "§1.4", tier: "Foundational", desc: "Why the metric channel reshapes the medium its own ripple travels through", cls: "found" };

/* ───────────────────────── inline markdown ───────────────────────── */
function codeSpan(txt) {
  const t = txt.trim();
  const hit = SYM[t] || SYM[t.replace(/[\(\[].*$/, "").trim()];
  if (hit) return '<code class="sym" data-sym="' + esc(hit.s) + '">' + esc(t) + "</code>";
  return "<code>" + esc(t) + "</code>";
}
const CODE_RE = /\b([A-Z]{1,2}(?:-[A-Z]{2})?-\d{2,3})\b/g; // N-EM-05, AD-01, J-07, LG-01
function linkRefs(html) {
  // Eq. refs: "Eq. 4.7", "Eq. 4.0a–4.0c", "Eq. 3.1e–3.1g", "Eq. 4.22–4.23"
  html = html.replace(/Eq\.\s(\d\.\d+[a-g]?)(?:(–|-|,\s)(\d\.\d+[a-g]?))?/g, (m, a, sep, b) => {
    const la = eqLink(a);
    if (!b) return la;
    return la.replace(/<\/a>$/, "") + "</a>" + sep + eqLink(b, true);
  });
  // §-refs: "§3.5", "§1.1–§1.4", "§4.1–§4.3"
  html = html.replace(/§(\d(?:\.\d+)?)/g, (m, s) => secLink(s));
  // codex/file.md
  html = html.replace(/<code>codex\/([a-z-]+)\.md<\/code>/g, (m, f) => {
    const r = FILE_ROUTE[f];
    return r === undefined ? m : '<a class="xref" href="#/' + r + '">' + PAGE_TITLE[f] + "</a>";
  });
  // directory codes
  html = html.replace(CODE_RE, (m) => (DIRCODES.has(m) ? '<a class="code-ref" href="#/directory#' + m + '">' + m + "</a>" : m));
  return html;
}
function eqLink(n, bare) {
  const r = EQ_ROUTE[n];
  const label = bare ? n : "Eq. " + n;
  if (r === undefined || r === null) return label;
  return '<a class="eqref" href="#/' + r + "#" + eqId(n) + '">' + label + "</a>";
}
function secLink(s) {
  const r = SEC_ROUTE[s] !== undefined ? SEC_ROUTE[s] : SEC_FILE_HINT[s];
  if (r === undefined) return "§" + s;
  const anchor = SEC_ROUTE[s] !== undefined ? "#" + secId(s) : "";
  return '<a class="secref" href="#/' + r + anchor + '">§' + s + "</a>";
}
function inline(md) {
  // protect code spans first
  const codes = [];
  let s = md.replace(/`([^`]+)`/g, (m, c) => { codes.push(c); return " " + (codes.length - 1) + " "; });
  s = esc(s);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(—\-–>"])\*([^*\n]+?)\*(?=[\s.,;:)!?—\-–"<]|$)/g, "$1<em>$2</em>");
  s = s.replace(/ (\d+) /g, (m, i) => codeSpan(codes[+i]));
  s = linkRefs(s);
  return s;
}

/* ───────────────────────── block markdown ───────────────────────── */
function convert(md, route, opts) {
  opts = opts || {};
  const lines = md.split("\n");
  const out = [];
  const toc = [];
  const eqs = [];
  let i = 0;
  let subtitle = "";
  const sectionStack = []; // for callouts at section end
  const callouts = (ANN[route] && ANN[route].callouts) || {};
  const used = new Set();

  function flushSectionEnd(level) {
    // emit 'end:' callouts for sections being closed
    while (sectionStack.length && sectionStack[sectionStack.length - 1].level >= level) {
      const s = sectionStack.pop();
      const k = "end:" + s.id;
      if (callouts[k] && !used.has(k)) { out.push(callouts[k]); used.add(k); }
    }
  }

  while (i < lines.length) {
    let l = lines[i];
    if (!l.trim()) { i++; continue; }
    // title / subtitle / file note / rule
    if (/^# /.test(l)) { i++; continue; }
    if (/^### §/.test(l) || (/^### /.test(l) && i < 4)) { subtitle = l.replace(/^### /, ""); i++; continue; }
    if (/^\*Part of the Aether Codex/.test(l)) { i++; continue; }
    if (/^---\s*$/.test(l)) { i++; continue; }

    // headings
    let m;
    if ((m = l.match(/^(#{2,4}) (.+)$/))) {
      const level = m[1].length;
      let text = m[2].trim();
      let id, num = null;
      const nm = text.match(/^(\d+(?:\.\d+)?)\.?\s+(.+)$/);
      if (nm) { num = nm[1]; text = nm[2]; id = secId(num); SEC_ROUTE[num] = route; }
      else id = "h-" + slug(text);
      flushSectionEnd(level);
      const tag = "h" + level;
      out.push("<" + tag + ' id="' + id + '" class="hd">' + (num ? '<span class="secnum">§' + num + "</span> " : "") + inline(text) + '<a class="anchor" href="#/' + route + "#" + id + '" aria-label="Link to this section">#</a></' + tag + ">");
      toc.push({ id, text: (num ? "§" + num + " " : "") + text.replace(/[`*]/g, ""), level });
      sectionStack.push({ id, level });
      if (callouts["start:" + id] && !used.has("start:" + id)) { out.push(callouts["start:" + id]); used.add("start:" + id); }
      i++; continue;
    }
    // equation figure: **Eq. X — Title** [note]  then fenced block
    if ((m = l.match(/^\*\*Eq\. (\d\.\d+[a-g]?) — (.+?)\*\*(.*)$/))) {
      const n = m[1], title = m[2], note = m[3].trim();
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      if (lines[j] && /^```/.test(lines[j])) {
        const body = [];
        j++;
        while (j < lines.length && !/^```/.test(lines[j])) { body.push(lines[j]); j++; }
        j++;
        EQ_ROUTE[n] = route;
        const meta = EQ_META[n] || { cls: "found", tier: "" };
        eqs.push({ id: eqId(n), n, title: title.replace(/[`*]/g, "") });
        out.push('<figure class="eq ' + meta.cls + '" id="' + eqId(n) + '">' +
          '<figcaption><span class="eq-n">Eq. ' + n + '</span><span class="eq-t">' + inline(title) + "</span>" +
          (note ? '<span class="eq-note">' + inline(note) + "</span>" : "") +
          '<a class="anchor" href="#/' + route + "#" + eqId(n) + '" aria-label="Link to this equation">#</a></figcaption>' +
          "<pre>" + eqBody(body.join("\n")) + "</pre></figure>");
        toc.push({ id: eqId(n), text: "Eq. " + n + " " + title.replace(/[`*]/g, ""), level: 9 });
        i = j; continue;
      }
    }
    // fenced code (not an equation)
    if (/^```/.test(l)) {
      const body = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) { body.push(lines[i]); i++; }
      i++;
      out.push('<pre class="code">' + eqBody(body.join("\n")) + "</pre>");
      continue;
    }
    // table
    if (/^\s*\|/.test(l)) {
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      out.push(tableHtml(rows));
      continue;
    }
    // blockquote
    if (/^> /.test(l)) {
      const q = [];
      while (i < lines.length && /^> ?/.test(lines[i])) { q.push(lines[i].replace(/^> ?/, "")); i++; }
      out.push('<blockquote class="pull"><p>' + inline(q.join(" ")) + "</p></blockquote>");
      continue;
    }
    // list (with indented continuation, fences and tables inside items)
    if (/^- /.test(l)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i])) {
        let item = [lines[i].replace(/^- /, "")];
        const extra = [];
        i++;
        while (i < lines.length && (/^\s{2,}\S/.test(lines[i]) || (!lines[i].trim() && /^\s{2,}\S/.test(lines[i + 1] || "")))) {
          if (lines[i].trim()) extra.push(lines[i].replace(/^\s{2}/, ""));
          i++;
        }
        items.push({ head: item.join(" "), extra });
      }
      out.push("<ul>" + items.map((it) => {
        let h = "<li>" + inline(it.head);
        let k = 0;
        while (k < it.extra.length) {
          const e = it.extra[k];
          if (/^```/.test(e)) {
            const body = []; k++;
            while (k < it.extra.length && !/^```/.test(it.extra[k])) { body.push(it.extra[k]); k++; }
            k++;
            h += '<pre class="code">' + eqBody(body.join("\n")) + "</pre>";
          } else if (/^\|/.test(e)) {
            const rows = [];
            while (k < it.extra.length && /^\|/.test(it.extra[k])) { rows.push(it.extra[k]); k++; }
            h += tableHtml(rows);
          } else { h += "<p>" + inline(e) + "</p>"; k++; }
        }
        return h + "</li>";
      }).join("") + "</ul>");
      continue;
    }
    // paragraph
    const p = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4} |```|\||> |- |\*\*Eq\. )/.test(lines[i])) { p.push(lines[i]); i++; }
    if (p.length) {
      const txt = p.join(" ");
      // a lone italic line is a note
      if (/^\*[^*].*\*$/.test(txt.trim()) && !/\*\*/.test(txt)) out.push('<p class="note">' + inline(txt.trim().replace(/^\*|\*$/g, "")) + "</p>");
      else out.push("<p>" + inline(txt) + "</p>");
    } else { i++; }
  }
  flushSectionEnd(0);
  return { html: out.join("\n"), toc, eqs, subtitle };
}
function tableHtml(rows) {
  const t = parseTable(rows);
  return '<div class="tbl"><table><thead><tr>' + t.head.map((h) => "<th>" + inline(h) + "</th>").join("") + "</tr></thead><tbody>" +
    t.body.map((r) => "<tr>" + r.map((c, ci) => "<td" + (ci === 0 ? ' class="first"' : "") + ">" + inline(c) + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
}
// equation body: escape, then wrap known symbols for tooltips and dim trailing "-- comments"
function eqBody(txt) {
  return txt.split("\n").map((line) => {
    let cmt = "";
    const ci = line.indexOf("--");
    if (ci > 0) { cmt = line.slice(ci); line = line.slice(0, ci); }
    let h = esc(line).replace(/(?<![\d.])[A-Za-z_][A-Za-z0-9_']*/g, (id) => {
      const hit = SYM[id];
      return hit ? '<span class="sym" data-sym="' + esc(hit.s) + '">' + id + "</span>" : id;
    });
    if (cmt) {
      // long lines: drop the trailing comment onto its own line so the equation itself never needs to scroll
      if (line.length + cmt.length > 68) h = h.replace(/\s+$/, "") + '\n<span class="cmt">    ' + esc(cmt) + "</span>";
      else h += '<span class="cmt">' + esc(cmt) + "</span>";
    }
    return h;
  }).join("\n");
}

/* ───────────────────────── spell directory ───────────────────────── */
const TIER_OF = { N: "Novice", J: "Journeyman", AD: "Adept", AR: "Artisan", M: "Master", W: "Warden", LG: "Legend", AS: "Beyond Legend" };
const CH_OF = { N: "gauge", J: "gauge", AD: "gauge", AR: "quark", M: "quark", W: "metric", LG: "metric", AS: "dm" };
const FORCE_OF = { EM: "EM", GR: "Gravity", ST: "Strong", WK: "Weak" };
const DIRCODES = new Set();
function parseDirectory(md) {
  const lines = md.split("\n");
  const spells = [];
  let expansion = 0;
  let cur = null;
  const flush = () => { if (cur) { spells.push(cur); cur = null; } };
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    let m;
    if ((m = l.match(/^### Directory Expansion (I+)/))) { flush(); expansion = m[1].length; continue; }
    if (/^#{2,4} /.test(l)) { flush(); continue; }
    if ((m = l.match(/^\*\*\[([A-Z]+-(?:[A-Z]+-)?\d+)\] (.+?)\*\*(.*)$/))) {
      flush();
      const code = m[1];
      const parts = code.split("-");
      const pre = parts[0];
      cur = { c: code, n: m[2].trim(), t: TIER_OF[pre], ch: CH_OF[pre], x: expansion, eq: "", body: [] , pair: "", force: "", mat: "" };
      if (pre === "N") cur.force = FORCE_OF[parts[1]];
      if (pre === "AR") { const mm = cur.n.match(/^Artisan of (.+)$/); if (mm) cur.mat = mm[1]; }
      let rest = m[3].trim();
      if (rest) cur.body.push(rest.replace(/^—\s*/, ""));
      continue;
    }
    if (!cur) continue;
    if (/^```/.test(l)) {
      const b = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) { b.push(lines[i]); i++; }
      cur.eq = b.join("\n");
      continue;
    }
    if (l.trim()) cur.body.push(l.trim());
  }
  flush();
  for (const s of spells) {
    let body = s.body.join(" ");
    const pm = body.match(/^\*\((EM|Gravity|Strong|Weak) \+ (EM|Gravity|Strong|Weak)\)\*\s*—?\s*/);
    if (pm) { s.pair = pm[1] + "+" + pm[2]; body = body.slice(pm[0].length); }
    else if (s.t === "Adept") { const pm2 = body.match(/\((EM|Gravity|Strong|Weak) \+ (EM|Gravity|Strong|Weak)\)/); if (pm2) s.pair = pm2[1] + "+" + pm2[2]; }
    // equation references "— Eq. 4.0e." etc live in body already
    s.dmd = body.charAt(0).toUpperCase() + body.slice(1);
    delete s.body;
    DIRCODES.add(s.c);
  }
  return spells;
}
const dirMd = read("spell-directory");
const SPELLS_RAW = parseDirectory(dirMd);
// Eq. 4.0d lives in the directory file; record it for cross-links
EQ_ROUTE["4.0d"] = "directory";
// count checks
if (SPELLS_RAW.length !== 439) console.warn("WARNING: expected 439 directory entries, parsed " + SPELLS_RAW.length);

/* ───────────────────────── convert pages ───────────────────────── */
const PAGE_TITLE = {};
for (const p of PAGES) PAGE_TITLE[p.file] = p.nav;
PAGE_TITLE["overview"] = "Overview"; PAGE_TITLE["spell-directory"] = "Spell Directory"; PAGE_TITLE["glossary"] = "Glossary & Index";
PAGE_TITLE["techniques-novice"] = "Novice Techniques"; PAGE_TITLE["techniques-journeyman"] = "Journeyman Techniques";
PAGE_TITLE["techniques-adept"] = "Adept Techniques"; PAGE_TITLE["techniques-artisan"] = "Artisan Techniques";
PAGE_TITLE["techniques-master"] = "Master Techniques"; PAGE_TITLE["techniques-warden"] = "Warden Techniques";
PAGE_TITLE["techniques-sovereign"] = "Sovereign Workings"; PAGE_TITLE["techniques-legend"] = "Legend-Scale Techniques";
PAGE_TITLE["techniques-ascension"] = "The Ascent Beyond Legend"; PAGE_TITLE["power-hierarchy"] = "The Power Hierarchy";

// Two passes: the first fills EQ_ROUTE / SEC_ROUTE so cross-links resolve in the second.
for (let pass = 0; pass < 2; pass++) {
  for (const p of PAGES) {
    const r = convert(read(p.file), p.route);
    p.html = r.html; p.toc = r.toc; p.eqs = r.eqs; p.subtitle = r.subtitle;
  }
}
// overview: the file-map table + reading order, embedded on the home page
const OVERVIEW = convert(read("overview"), "");
// glossary intro notes (the italic lines) are hand-written on the page

/* ───────────────────────── data arrays ───────────────────────── */
const SPELLS = SPELLS_RAW.map((s) => {
  const dHtml = inline(s.dmd);
  const dText = s.dmd.replace(/[`*]/g, "");
  const eqs = Array.from(new Set((s.dmd + " " + s.eq).match(/Eq\.\s\d\.\d+[a-g]?/g) || [])).map((e) => e.replace("Eq. ", ""));
  const codes = Array.from(new Set(dText.match(CODE_RE) || [])).filter((c) => c !== s.c && DIRCODES.has(c));
  return { c: s.c, n: s.n, t: s.t, ch: s.ch, x: s.x, f: s.force, p: s.pair, m: s.mat, eq: s.eq, d: dHtml, s: dText, eqs, codes };
});
const GLOSSARY = SYMROWS.map((r) => ({ s: r[0].replace(/`/g, ""), d: inline(r[1]), src: inline(r[2]), txt: (r[0] + " " + r[1] + " " + r[2]).replace(/[`*]/g, "") }))
  .concat(EXTRA_SYMS.map((r) => ({ s: r[0].replace(/`/g, ""), d: inline(r[1]), src: inline(r[2]), txt: (r[0] + " " + r[1] + " " + r[2]).replace(/[`*]/g, ""), extra: true })));
const TERMS = TERMROWS.map((r) => ({ s: r[0].replace(/`/g, ""), d: inline(r[1]), src: inline(r[2]), v: r[3], txt: (r[0] + " " + r[1] + " " + r[2]).replace(/[`*]/g, "") }));
const EQINDEX = [];
for (const n of ["1.1", "1.2", "1.3", "1.4"]) EQINDEX.push({ n, name: EQ_META[n].name, sec: EQ_META[n].sec, tier: EQ_META[n].tier, cls: "found", d: inline(EQ_META[n].desc), r: EQ_ROUTE[n] || "foundations" });
for (const r of EQROWS) EQINDEX.push({ n: r[0], name: r[1].replace(/[`*]/g, ""), sec: r[2], tier: r[3], cls: TIER_CLASS(r[3]), d: inline(r[4]), r: EQ_ROUTE[r[0]] || "" });
const SYMDATA = {};
for (const k of Object.keys(SYM)) SYMDATA[k] = { s: SYM[k].s, d: inline(SYM[k].d), src: inline(SYM[k].src) };
const SECMAP = Object.assign({}, SEC_FILE_HINT, SEC_ROUTE);

/* ───────────────────────── page templates ───────────────────────── */
function pageTemplate(p) {
  const ann = ANN[p.route] || {};
  const brief = ann.brief ? '<aside class="brief"><h2 class="brief-h">In brief</h2><ul>' + ann.brief.map((b) => "<li>" + b + "</li>").join("") + "</ul></aside>" : "";
  const keyEqs = p.eqs.length ? '<nav class="keyeqs" aria-label="Equations on this page"><span class="keyeqs-h">Equations on this page</span><ul>' +
    p.eqs.map((e) => '<li><a href="#/' + p.route + "#" + e.id + '"><span class="kn">Eq. ' + e.n + "</span> " + esc(e.title) + "</a></li>").join("") + "</ul></nav>" : "";
  const toc = p.toc.filter((t) => t.level <= 4).map((t) => '<li class="l' + t.level + '"><a href="#/' + p.route + "#" + t.id + '">' + esc(t.text) + "</a></li>").join("");
  return '<template id="t-' + slug(p.route) + '">\n<div class="page ' + p.tier + '" data-route="' + p.route + '">' +
    '<header class="pagehead"><p class="kicker">' + esc(p.part) + " · " + esc(p.subtitle.replace(/§/g, "§")) + "</p><h1>" + esc(PAGE_TITLE[p.file]) + "</h1>" +
    (ann.lede ? '<p class="lede">' + ann.lede + "</p>" : "") + "</header>" +
    '<div class="layout"><article class="article">' + brief + keyEqs + p.html + "</article>" +
    '<aside class="toc" aria-label="On this page"><div class="toc-in"><span class="toc-h">On this page</span><ul>' + toc + "</ul></div></aside></div></div>\n</template>";
}
const fileMap = (OVERVIEW.html.match(/<div class="tbl">[\s\S]*?<\/div>/) || [""])[0];
const pagesHtml = PAGES.map(pageTemplate).join("\n") +
  '\n<template id="t-overview-filemap">' + fileMap + "</template>";

const dataJs = [
  "var SPELLS = " + JSON.stringify(SPELLS) + ";",
  "var GLOSSARY = " + JSON.stringify(GLOSSARY) + ";",
  "var TERMS = " + JSON.stringify(TERMS) + ";",
  "var EQINDEX = " + JSON.stringify(EQINDEX) + ";",
  "var SYMBOLS = " + JSON.stringify(SYMDATA) + ";",
  "var SECMAP = " + JSON.stringify(SECMAP) + ";",
  "var EQMAP = " + JSON.stringify(EQ_ROUTE) + ";",
  "var CODEX_VERSION = " + JSON.stringify((read("overview").match(/\*\*Version:\*\*\s*([\d.]+)/) || [0, "?"])[1]) + ";",
].join("\n");

/* ───────────────────────── inject ───────────────────────── */
let html = fs.readFileSync(INDEX, "utf8");
function replaceBetween(src, open, close, body) {
  const a = src.indexOf(open), b = src.indexOf(close);
  if (a < 0 || b < 0 || b < a) throw new Error("markers not found: " + open);
  return src.slice(0, a + open.length) + "\n" + body + "\n" + src.slice(b);
}
html = replaceBetween(html, "<!-- BUILD:pages -->", "<!-- /BUILD:pages -->", pagesHtml);
html = replaceBetween(html, "/* BUILD:data */", "/* /BUILD:data */", dataJs);
fs.writeFileSync(INDEX, html);

const bytes = Buffer.byteLength(html);
console.log("built index.html: " + (bytes / 1024).toFixed(0) + " KB · " + SPELLS.length + " directory entries · " + EQINDEX.length + " equations · " + GLOSSARY.length + " symbols · " + PAGES.length + " generated pages");
const missing = EQINDEX.filter((e) => !e.r).map((e) => e.n);
if (missing.length) console.warn("equations without a resolved page: " + missing.join(", "));
