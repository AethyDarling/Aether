# Aether

A hard-magic system for fiction: the Aether Codex, plus a static site that presents it.

## Layout

- `codex/` — the source of truth. Sixteen markdown files, one per area.
- `index.html` — the site. One self-contained file, no runtime dependencies;
  deployable from the repo root via GitHub Pages or Cloudflare Workers.
- `tools/build.js` — regenerates the Codex-derived parts of `index.html`
  from `codex/`. Plain Node, no packages. `tools/annotations.js` holds the
  hand-written reading aids it merges in.
- `README.md` — project front matter.
- `wrangler.jsonc` / `.assetsignore` — Cloudflare Workers static-asset
  deploy config. The repo's Workers Builds Git integration (project
  `aether`) picks this up on every push with no dashboard-side build
  command needed: `assets.directory` is the repo root, and
  `.assetsignore` keeps `codex/`, `tools/`, `CLAUDE.md`, and `README.md`
  off the deployed site since `index.html` is the only page. There's no
  server script — the router is entirely hash-based (`#/foundations`, …),
  so the Worker only ever has to answer `/` with `index.html`.
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

Routing is hash-based: `#/route`, with optional `?query` for page state
(directory filters, workbench inputs) and `#anchor` for in-page targets, e.g.
`#/grand-equation#eq-3-2` or `#/directory#N-EM-05`. To add a page: add a
`<template id="t-…">`, a sidebar link (`data-r` must equal the route path),
and a `ROUTES` entry — order in `ROUTES` drives the prev/next pager.

The Workbench (`#/workbench`) evaluates the Codex's equations with live inputs.
The equation shapes are canon; the default constants and the fidelity model
(care × steadiness × time, gated by Eq. 3.4) are the Workbench's own and are
labelled as such on the page. If a Codex equation changes, change the matching
`compute()` branch and its substituted-formula string together. The "Spell
sheet" export follows the Directory's entry format so it can be pasted into
`codex/spell-directory.md`; the suggested code is the next free one for the
tier, computed from `SPELLS`.

Design rules, so edits stay coherent:

- **It is a reference, so it looks like one.** Near-white paper and
  near-black ink by default, a dark scheme (`:root[data-theme="dark"]`,
  following `prefers-color-scheme` until the toggle is used) with every
  token redefined. Both schemes must be kept in sync; add a token to both
  blocks or to neither.
- **Simple and sharp.** Hairlines instead of boxes: sections, equations,
  tables, callouts and Workbench panels are separated by 1px rules (a
  black rule where a block starts, a light one elsewhere), not by filled
  cards. Square corners (2px). The only fills are code backgrounds, table
  row hover and the expanded directory entry. Sector chips are a small dot
  plus text, never a pill.
- **Type.** Inter, semibold and tightly tracked, for headings and interface
  text (navigation, tables, chips, forms); Source Serif 4 for prose;
  JetBrains Mono for every equation, symbol and directory code. Body
  18px / 1.6, prose measure 700px.
- **Colour carries information only.** One amber accent for links, equation
  numbers and the active state; black for selected controls; `--danger`
  for backlash and failure; `--ok` for a clean casting; one hue per
  coupling sector for dots and equation rules (`gauge`, `quark`, `metric`,
  `dm` for beyond-Legend, `found` for foundational). Every text/background
  pair is ≥ 4.5:1 in both schemes; check new tokens by WCAG relative
  luminance, not by eye. No gradients, glows or decorative shadows; the
  only shadows are on floating popovers.
- **Structure over decoration.** Numbered equations are `<figure class="eq">`
  with the title on the left and the number right-aligned in the caption,
  followed by the symbol list and the "Used in" line; tables are real
  tables with a caption where it helps; callouts are one of `plain`,
  `deeper`, `try`, `warn`, `note`, each a left rule with a short bold
  label in sentence case. No uppercase tracked labels anywhere: they are
  what makes a page read as a dashboard rather than a book.
  No canvas animation. A figure or chart is only worth adding where moving a
  control changes a quantity the reader can read off (the Workbench plots
  are the pattern: inline SVG, redrawn from the same numbers the results
  show).
- **Cursor, motion, mobile.** Native cursor. Anchor jumps are instant.
  `prefers-reduced-motion` disables the remaining transitions. No horizontal
  overflow at 390px: anything holding a `<pre>` or a wide table needs
  `min-width:0` on the grid item and an `overflow-x:auto` wrapper.
- **Verify before pushing.** Run `node tools/build.js`, then load every route
  in a headless browser and check for console errors and horizontal
  overflow at 390px and 1366px (Playwright is fine for this).
