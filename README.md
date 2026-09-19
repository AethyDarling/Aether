# Aether

A hard-magic system for fiction: the Aether Codex (`codex/`, eighteen
markdown files, the source of truth) presented as a galaxy you fly through
(`index.html`), drawn by hand in WebGL with no libraries: the aether field
as a shader beneath everything, the Grand Equation at the core, the three
coupling channels as spiral arms, and every section, equation, symbol,
technique (2,500 of them) and working form (Eq. 8.1–8.2500, one per
technique) a body in orbit around what defines it, readable in place. The
bridge bar holds the library, the archive, the lexicon, the Workbench, the
tutor, the drill and the spellbook, all inside the galaxy. `codex.html`
is the generated textbook the galaxy reads its passages and tools from.

Around the text: a tutor, "Ask the Codex", which answers questions (in
explaining, Socratic, deriving, comparing and in-the-story modes) and sets
and marks quiz questions from the Codex's own text with citations, running
on Cloudflare Workers AI within the free tier with hybrid lexical and
semantic retrieval; a map of every cross-reference as one navigable graph;
a spaced-repetition drill built from every symbol, equation, term and
entry; a spellbook of saved and shareable Workbench workings; and the
whole Codex as one printable page. The site installs on a phone and reads
offline.

The site is generated from the Codex. After editing anything under `codex/`
(or `tools/expand.js`, which writes the generated Directory expansion and
the working forms; run it first if it changed):

```
node tools/build.js
```

No dependencies; Node 18+ is enough. `src/worker.js` is the Cloudflare
Worker behind `/api/*`; it needs no keys, only the Workers AI binding
declared in `wrangler.jsonc`. After a Codex change, once a preview is
deployed, `node tools/embed.mjs <worker-url>` refreshes the tutor's
semantic index (`src/codex-vectors.json`). See `CLAUDE.md` for the
conventions.
