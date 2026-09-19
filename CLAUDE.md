# Aether

A hard-magic system for fiction: the Aether Codex, plus a site that
presents it as a galaxy to fly through (`index.html`). The site is the
galaxy and nothing else: every part of the Codex is read, searched and
used inside it. `codex.html` still exists, but only as the galaxy's text
and tool source; it is never linked, never shown as a page, and when a
tool from it is docked it wears the galaxy's own dark skin.

## Layout

- `codex/` — the source of truth. Eighteen markdown files, one per area.
  Two are generated: `spell-directory-iii.md` (Directory Expansion III,
  2,061 techniques) and `working-equations.md` (§8, Eq. 8.1–8.2500) are
  written by `node tools/expand.js`, deterministically, and committed;
  edit the generator, not the files.
- `index.html` — the galaxy. One hand-written file, no libraries: the
  aether field as a fragment shader beneath everything, dust tracing three
  spiral arms, and every chapter, section, equation, symbol, technique and
  working form as a body in Keplerian orbit, drawn with WebGL point
  sprites. Its bodies arrive as `galaxy.json`, written by the build and
  fetched at boot (the page carries only the version and body count
  between its `/* BUILD:galaxy */` markers). See "The galaxy" below.
- `galaxy.json` — the 5,204 bodies and 9,059 links, generated; never
  edit it.
- `codex.html` — the textbook, generated, kept as the galaxy's source of
  passages (fetched and parsed once when a body is read) and of the tools
  (docked as `codex.html?embed=1#/…`, which forces the dark galaxy palette
  and hides all chrome via `body.embed`). Every `#/route#anchor` link
  resolves on both files.
- `tools/build.js` — regenerates the Codex-derived parts of `codex.html`,
  `galaxy.json` and the marker in `index.html` from `codex/`. Plain Node,
  no packages. `tools/annotations.js` holds the hand-written reading aids
  it merges in. `tools/expand.js` writes the two generated Codex files.
- `src/worker.js` — the Cloudflare Worker behind `/api/*`: "Ask the Codex"
  (hybrid retrieval over the Codex plus a Workers AI model, streamed with
  citations), quiz questions and marking, model-written Directory drafts
  for the Workbench, and `/api/embed` for the script below.
  `src/codex-index.json` is its lexical retrieval index, written by the
  build; `src/codex-vectors.json` is the semantic half, written by
  `node tools/embed.mjs <deployed-worker-url>` (it embeds every chunk of
  the index with Workers AI's bge-small model through the deployed Worker
  and stores unit vectors as int8). Never edit either by hand. The index
  carries a hash of its text; the Worker checks the vectors against it and
  falls back to lexical search alone when they are stale, so a Codex edit
  is never broken by a forgotten embed step, only slightly less precise
  until `tools/embed.mjs` is re-run. No keys: the `ai` binding in
  `wrangler.jsonc` is the free-tier account binding.
- `sw.js`, `manifest.webmanifest`, `icon.svg`, `icon-maskable.svg`,
  `fonts/` — the site installs as an app and reads offline; the two font
  families are self-hosted (latin subsets only).
- `README.md` — project front matter.
- `wrangler.jsonc` / `.assetsignore` — Cloudflare Workers static-asset
  deploy config. The repo's Workers Builds Git integration (project
  `aether`) picks this up on every push with no dashboard-side build
  command needed: `assets.directory` is the repo root, and
  `.assetsignore` keeps `codex/`, `tools/`, `CLAUDE.md`, and `README.md`
  off the deployed site. The Worker runs first (`run_worker_first`),
  answers `/api/*` itself and hands everything else to the asset layer;
  both routers are hash-based, so the asset layer only ever has to answer
  `/` with `index.html` (the galaxy) and `/codex.html` (the textbook).
- `roblox-reference.md` — a game-implementation digest of the Codex. Not
  canon, not deployed.

## The Codex

Start at `codex/overview.md`: it carries the version, the notation rules, and a
file map naming which sections and equations live in which file. Its reading
order is foundations → grand-equation → power-hierarchy → the technique files in
tier order, with `spell-directory.md` and `glossary.md` as references to consult
rather than read through.

Three conventions matter when editing:

- **Section and equation numbers are global.** "§3.5" and "Eq. 4.7" mean the same
  thing in every file. Never renumber to suit one file's local order — §3.3 sits
  in `power-hierarchy.md` even though §3.2 and §3.4 are in `grand-equation.md`.
- **Equations are plain ASCII.** No Greek letters, hats, daggers or symbols, so
  they can be typed straight into a manuscript. Write `Xi(Ae, g)`, `dAe`,
  `lam_i`, `M_op` — not their typeset equivalents.
- **Extend by appending.** New techniques and derivations go at the end of the
  relevant file, with a version bump and a one-line entry in
  `codex/changelog.md`. New equations continue the running global numbering
  tracked in `codex/glossary.md` (§6).

Cross-references between files are written as `codex/<name>.md` and all resolve
as-is; keep that form if you add more.

The Directory has 2,500 entries: the founding set and Expansions I–II
(439, hand-written) and Expansion III (2,061, generated by
`tools/expand.js` from tier-correct templates, curated vocabulary and a
seeded generator, so the file is reproducible). Every entry, founding or
generated, has a working form in §8 (`codex/working-equations.md`,
Eq. 8.1–8.2500, in Directory order): its tier's base equation specialised
to that entry by a shape factor `eta_<code>` whose meaning the form
states; `eta = 1` recovers the base equation, so nothing in §8 changes
canon. The working-form symbols are §5.3 of the glossary. To change the
generated voice, edit the banks in `tools/expand.js` and re-run it, then
the build, then the embed step.

The build script depends on a few of the Codex's own formatting habits, so
keep them: an equation is a `**Eq. N — Title**` line followed by a fenced
block; a Directory entry is a `**[CODE] Name**` line (optionally followed by
a fenced formula) and then its prose, with Adept entries stating their pair
as `*(EM + Strong)*`; the glossary's tables stay in their current order
(symbols, expansion symbols, expansion terms ×2, equation index).

## The galaxy

`index.html` is the site's front door: the whole Codex as a navigable galaxy,
built to match the system's own premise (aether is the field beneath the
forces; here it is the field beneath everything drawn). No libraries, no
images: two WebGL contexts and a 2D canvas.

- **The field** is a full-screen fragment shader (domain-warped value noise
  flowing slowly, a warm glow at the projected core, and up to eight
  small local ripples that expand from wherever you tap: a caster's tap
  sources a ripple, and bodies flash as the front passes them; keep them
  local, a screen-wide wave reads as a glitch). It renders at 0.6×
  resolution for phones.
- **The layout is the system.** The Grand Equation is the core, because
  everything cites it; Foundations and the Hierarchy sit in the bulge; the
  three spiral arms are the three coupling channels (gauge gold, quark
  ember, metric steel), and each technique chapter sits on its arm at a
  radius set by its tier, so distance from the core is depth in the Power
  Hierarchy; the Ascent is beyond the arms. Sections orbit their chapter,
  equations orbit the section that defines them, symbols orbit the section
  or equation that defines them, the 2,500 techniques form belts around
  their tier's star (wider for the big tiers), each working form is a tiny
  satellite of its technique (visible only up close), the tools are
  stations near the core, the changelog is a comet on an eccentric orbit.
  The flat Map (`#/map`, docked as the chart room) keeps only the founding
  set and Expansions I–II; the galaxy carries everything. Orbital speeds follow Kepler (`w ∝ r^-1.5`); "Hold
  orbits" freezes the simulation. The hierarchy (parent of every body) and
  a short blurb per body come from the build as `GALAXY`; the orbital
  elements are derived deterministically from body ids at load.
- **Level of detail is distance.** Chapters and stations are always drawn
  and labelled; sections, equations, symbols and techniques appear as the
  camera nears them, labels later still, and anything connected to the
  selection is always shown. Labels avoid each other by priority and carry
  a tick once read or visited. Lines
  are the citation graph (the same edges as the Map), drawn inside the
  system you are near and highlighted for the selection, plus the
  selection's orbit rings.
- **Reading happens in the galaxy.** Selecting a body opens the viewport:
  blurb, orbital data, channels (its neighbours, each a jump) and, for a
  section, equation, technique or symbol, its full text at once: the page
  fetches `codex.html` once, parses it, and lifts the exact section,
  figure, entry or definition into the viewport, links and hover symbols
  intact. A chapter opens with its learning layer and offers the whole
  chapter in a widened viewport plus "Mark as read" (the same
  `aether-progress` key the textbook uses); visited bodies are ticked
  (`aether-visited`). The viewport footer walks the book in reading order
  (chapters, then their sections), so the whole Codex can be read without
  leaving the galaxy. Links to bodies fly to them; anything else opens the
  textbook docked (`codex.html?embed=1#/…`, which hides the chrome via
  `body.embed`).
- **The bridge** is the one bar: Chart (overview), Library (the book's
  contents in reading order with the preface and your progress), Archive
  (the Directory, searchable and filterable by tier, every row a flight),
  Lexicon (symbols, terms and the equation index), then the docked tools
  (Workbench, tutor, drill, spellbook), a six-stop Tour and help. Library,
  Archive and Lexicon are native panels (the "deck") fed from the
  textbook's data arrays, parsed out of `codex.html`'s `BUILD:data`
  region on first use; the tools stay iframes in embed mode. The console
  also searches every paragraph of the text once the book has been fetched.
  `#/directory`, `#/glossary`, `#/library` and `#/tour` open the
  matching panel.
- **Controls:** drag turns, shift-drag or two fingers slide, scroll or
  pinch flies, tap selects, tap again or double-tap flies to it, tapping
  the dark sources a ripple, `/` navigates by name, `←` walks back along
  the trail, `Esc` closes, `Space` holds orbits. `#/route#anchor` in the
  URL flies straight there on load and is kept in sync with the selection.
- **Design:** deep indigo, the aether in teal, sector hues carried over
  from the textbook, JetBrains Mono for readouts and Source Serif for
  names and text, translucent panels with hairlines, no icons, no imagery.
  Nothing on the galaxy page is essential: the textbook is linked from
  the brand and from every viewport, and shown outright when WebGL is
  unavailable.

## The textbook

`codex.html` presents the Codex as a multi-page reference. It is one file with
two kinds of content:

- **Generated pages** (between the `<!-- BUILD:pages -->` markers, and the
  data arrays between `/* BUILD:data */`): one page per Codex file, plus the
  `SPELLS`, `GLOSSARY`, `TERMS`, `EQINDEX` and `SYMBOLS` arrays. Never edit
  these by hand; edit `codex/` and run `node tools/build.js`. The build
  turns each `**Eq. …**` block into a numbered, linkable figure, auto-links
  every `§x.y`, `Eq. x.y` and directory code, and wraps every glossary
  symbol so it carries a hover definition.
- **Hand-authored chrome and tools** (everything else): the CSS, the shell
  (top bar, sidebar, search), the Home, Directory, Glossary and Workbench
  templates, and the script.
- **The learning layer** (`tools/annotations.js`, merged in by the build):
  per page, a lede, "Before you read this" (prerequisites, linked), "What
  you will be able to do", "Key ideas", callouts pinned to section ids
  ("In plain terms" for a hard passage, "Going deeper" for an elaboration
  with outside links, "Try it" for the Workbench), and "Background from
  real physics and mathematics" (outside links, each with a note saying
  what carries over). The site is meant to be learned in order, so every
  page should have all of these; keep the outside links to stable
  references (Wikipedia, the Feynman Lectures) and never let one imply
  the Codex is real physics.
- **Cross-references are the structure.** The build computes a reference
  graph and prints it everywhere: under every equation, the symbols it
  uses with their definitions and a "Used in" line (sections and
  Directory entries that cite it); on the Glossary, every equation a
  symbol appears in; in the Directory, the entries each entry mentions
  and is mentioned by; on the home page, a learning path with reading
  times. When adding to the Codex, cite by number (`§3.5`, `Eq. 4.7`,
  `N-EM-01`) and the links, backlinks and symbol lists follow for free.

The tutor (`#/ask`, Appendix D) is the one feature with a server side. The
client posts to `/api/ask`, `/api/quiz` and `/api/draft`; the Worker
ranks the index two ways (BM25 over the words, cosine over the bge-small
vectors, fused by reciprocal rank; an exact code or equation number in the
question is always kept), hands the best passages to a Workers AI model
with a system prompt that forbids answering from anything but those
passages, and streams the answer as server-sent events preceded by a
`sources` event. Two model tiers: *careful* (Llama 3.3 70B first, then
smaller models) and *quick* (Llama 3.1 8B); a retired model ID is skipped
for the life of the isolate, a busy one only for that request. Five modes
change only the system prompt: explain, Socratic (a question back first),
derive (term by term), compare, and in-the-story (what a witness sees,
still cited). The client turns every §, Eq. and code in the answer into a
link, and every equation figure carries an "Ask the tutor" link with the
question pre-filled. Identical questions are served from the Cache API for
a day and a per-IP limiter keeps a personal site inside the free daily
allowance. If the endpoint is missing or the allowance is spent, the page
says so and nothing else on the site depends on it. The model is a reader
of the Codex, not an authority: keep the prompts grounded and cited, never
let it present its own invention as Codex text.

Four more appendices need no server. The **Map** (`#/map`, Appendix E)
draws the reference graph: `MAPDATA` is emitted by the build (chapters,
sections, equations, symbols and Directory entries as nodes; containment,
citation, symbol use, draws-on and mentions as edges) with a seeded
force-directed layout computed in `tools/build.js`, so the page only
draws SVG, pans, zooms and highlights neighbourhoods; every chapter,
equation and entry links into it with `?focus=<node id>` (`c:`, `s:`,
`e:`, `y:`, `p:` prefixes). The **Drill** (`#/drill`, Appendix F) makes
flashcards from the data arrays at runtime (symbols, equations both ways,
terms, entries) and schedules them with SM-2 in localStorage. The
**Spellbook** (`#/spellbook`, Appendix G) stores Workbench workings in
localStorage; a working's URL carries its whole setup (the Workbench
writes every non-default input, the name and the description into the
hash), so a link is a share, and the book exports and imports as JSON.
**The whole book** (`#/book`) clones every chapter template plus the
Directory and Glossary into one page with a print stylesheet, for reading
straight through or saving as a PDF.

Reading progress (chapters marked read, last position), drill schedules,
the spellbook and the colour, text-size and tutor-depth options live in
localStorage only; nothing is sent anywhere.

Routing is hash-based: `#/route`, with optional `?query` for page state
(directory filters, workbench inputs) and `#anchor` for in-page targets, e.g.
`#/grand-equation#eq-3-2` or `#/directory#N-EM-05`. To add a page: add a
`<template id="t-…">`, a sidebar link (`data-r` must equal the route path),
and a `ROUTES` entry — order in `ROUTES` drives the prev/next pager.

The Workbench (`#/workbench`, Appendix C) evaluates the Codex's equations
with live inputs and explains the result. For each working it prints a
verdict (clean, fizzle, bleed, backlash) with an itemised explanation of
*why* and what would fix it; a "What this working does" narrative (what
happens, what a witness sees, what can go wrong); the numbers; the
equation as the Codex writes it (read from `EQTEXT`, generated by the
build) and again with the numbers substituted, plus a step-by-step
breakdown; the working's variations (each with its equation and Directory
examples, applied with one click); a plot; the closest Directory entries;
and three drafted entries in the Directory's voice that can be dropped
into the spell sheet. The equation shapes are canon; the default
constants, the fidelity model (care × steadiness × time, gated by
Eq. 3.4), the prose and the drafts are the Workbench's own and are
labelled as such. If a Codex equation changes, change the matching
`compute()` branch, its substituted-formula string and its variation
entries together. The spell sheet export follows the Directory's entry
format so it can be pasted into `codex/spell-directory.md`; the suggested
code is the next free one for the tier, computed from `SPELLS`.

Design rules, so edits stay coherent:

- **It is a textbook.** Cream paper and near-black ink by default; a warm
  dark scheme (`:root[data-theme="dark"]`) with every token redefined.
  Colour scheme (light / dark / system) and text size (`data-size`
  s / m / l) are set from the Options group at the foot of the sidebar,
  persisted in localStorage; there is no toggle in the top bar. Keep both
  schemes in sync: add a token to both blocks or to neither.
- **Two fonts.** Source Serif 4 for everything you read, including
  navigation, headings, labels and form controls; JetBrains Mono for every
  equation, symbol and directory code. Nothing else is loaded. The only
  label style is serif small caps (`.sc` and friends); no uppercase
  tracked sans labels, no icons, no animation.
- **Textbook environments.** Chapters carry a "Part · Chapter n" kicker.
  Equations are `<figure class="eq">` captioned "Equation n. Title", the
  body on a tinted band with the number in parentheses at the right
  margin, then a run-in *where* list of the symbols and a *used in* line.
  Callouts are run-in environments (an italic bold label, a period, then
  the text on the same line): `plain` for "In plain terms", `deeper` for
  "Going deeper", `try` for the Workbench, `warn`. Hairlines separate
  blocks; the only fills are code bands, table-row hover and the expanded
  directory entry. Square corners.
- **Colour carries information only.** One spot colour (oxblood) for
  links, section and equation numbers and the active state; black for
  selected controls; `--danger`, `--ok`, `--warnc` for the Workbench
  verdicts; one hue per coupling sector for dots and equation rules.
  Every text/background pair is ≥ 4.5:1 in both schemes; check new tokens
  by WCAG relative luminance, not by eye. No gradients or glows; the only
  shadows are on floating popovers.
- **Mobile first.** It is read on phones. Below 700px the Directory table
  becomes a list of entries (CSS only); the Workbench is one column with
  the caster section collapsed; the on-page contents is a details block;
  equation bands scroll horizontally rather than shrinking the type below
  13.5px. `content-visibility:auto` on article blocks keeps long chapters
  cheap to render. No horizontal overflow at 390px: anything holding a
  `<pre>` or a wide table needs `min-width:0` on the grid item and an
  `overflow-x:auto` wrapper. Tap targets are at least 38px tall.
- **Verify before pushing.** Run `node tools/expand.js` if the generator
  changed, then `node tools/build.js`, then load every
  textbook route in a headless browser and check for console errors and
  horizontal overflow at 390px and 1366px (Playwright is fine for this),
  in both schemes; then load the galaxy with software WebGL
  (`--use-gl=swiftshader`) at both sizes, fly to an equation, a section
  and a technique by hash, read each in the viewport, dock a station, and
  check the console (Chromium's own swiftshader deprecation warnings are
  expected; nothing else is). The Worker can be unit-tested in Node with a mocked `AI`
  binding (rewrite the two JSON imports with `with { type: "json" }`);
  the real models can only be exercised on a deployed preview, so after
  pushing, hit `/api/health` (it reports the index hash, whether the
  vectors match it, and the model each tier is using) and `/api/ask` on
  the branch preview URL before merging. If the Codex changed, run
  `node tools/embed.mjs <preview-url>` against that preview and commit
  the new `src/codex-vectors.json` before merging.
