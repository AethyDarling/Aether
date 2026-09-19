# Aether

A hard-magic system for fiction: the Aether Codex (`codex/`, sixteen markdown
files, the source of truth) presented two ways. `index.html` is a galaxy
you fly through, drawn by hand in WebGL with no libraries: the aether
field as a shader beneath everything, the Grand Equation at the core, the
three coupling channels as spiral arms, and every section, equation,
symbol and technique a body in orbit around what defines it, readable in
place. `codex.html` is the same Codex as a textbook, with a searchable
439-entry Spell Directory, a symbol glossary with hover definitions, and a
Spell Workbench for building new techniques from the Codex's own
equations. Every `#/route#anchor` link works on both.

Around the text: a tutor, "Ask the Codex", which answers questions (in
explaining, Socratic, deriving, comparing and in-the-story modes) and sets
and marks quiz questions from the Codex's own text with citations, running
on Cloudflare Workers AI within the free tier with hybrid lexical and
semantic retrieval; a map of every cross-reference as one navigable graph;
a spaced-repetition drill built from every symbol, equation, term and
entry; a spellbook of saved and shareable Workbench workings; and the
whole Codex as one printable page. The site installs on a phone and reads
offline.

The site is generated from the Codex. After editing anything under `codex/`:

```
node tools/build.js
```

No dependencies; Node 18+ is enough. `src/worker.js` is the Cloudflare
Worker behind `/api/*`; it needs no keys, only the Workers AI binding
declared in `wrangler.jsonc`. After a Codex change, once a preview is
deployed, `node tools/embed.mjs <worker-url>` refreshes the tutor's
semantic index (`src/codex-vectors.json`). See `CLAUDE.md` for the
conventions.
