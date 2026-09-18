# Aether

A hard-magic system for fiction: the Aether Codex, plus a static site that presents it.

## Layout

- `codex/` — the source of truth. Sixteen markdown files, one per area.
- `index.html` — the site. One self-contained file, no runtime dependencies;
  deployable from the repo root via GitHub Pages or Cloudflare Workers.
- `tools/build.js` — regenerates the Codex-derived parts of `index.html`
  from `codex/`. Plain Node, no packages. `tools/annotations.js` holds the
  hand-written reading aids it merges in.
- `src/worker.js` — the Cloudflare Worker behind `/api/*`: "Ask the Codex"
  (retrieval over the Codex plus a Workers AI model, streamed with
  citations), quiz questions and marking, and model-written Directory
  drafts for the Workbench. `src/codex-index.json` is its retrieval index,
  written by the build; never edit it by hand. No keys: the `ai` binding in
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
  the router is hash-based (`#/foundations`, …), so the asset layer only
  ever has to answer `/` with `index.html`.
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

The build script depends on a few of the Codex's own formatting habits, so
keep them: an equation is a `**Eq. N — Title**` line followed by a fenced
block; a Directory entry is a `**[CODE] Name**` line (optionally followed by
a fenced formula) and then its prose, with Adept entries stating their pair
as `*(EM + Strong)*`; the glossary's tables stay in their current order
(symbols, expansion symbols, expansion terms ×2, equation index).

## The site

`index.html` presents the Codex as a multi-page reference. It is one file with
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
client posts to `/api/ask`, `/api/quiz` and `/api/draft`; the Worker does
BM25 retrieval over the index, hands the best passages to Llama 3.1 8B on
Workers AI with a system prompt that forbids answering from anything but
those passages, and streams the answer as server-sent events preceded by a
`sources` event. The client turns every §, Eq. and code in the answer into
a link. Identical questions are served from the Cache API for a day and a
per-IP limiter keeps a personal site inside the free daily allowance. If
the endpoint is missing or the allowance is spent, the page says so and
nothing else on the site depends on it. The model is a reader of the
Codex, not an authority: keep the prompts grounded and cited, never let it
present its own invention as Codex text.

Reading progress (chapters marked read, last position) and the colour and
text-size options live in localStorage only; nothing is sent anywhere.

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
- **Verify before pushing.** Run `node tools/build.js`, then load every
  route in a headless browser and check for console errors and horizontal
  overflow at 390px and 1366px (Playwright is fine for this), in both
  schemes. The Worker can be unit-tested in Node with a mocked `AI`
  binding (rewrite the JSON import with `with { type: "json" }`); the real
  model can only be exercised on a deployed preview, so after pushing,
  hit `/api/health` and `/api/ask` on the branch preview URL before
  merging.
