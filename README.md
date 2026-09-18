# Aether

A hard-magic system for fiction: the Aether Codex (`codex/`, sixteen markdown
files, the source of truth) and a single-file reference site (`index.html`)
that presents it, with a searchable 439-entry Spell Directory, a symbol
glossary with hover definitions, and a Spell Workbench for building new
techniques from the Codex's own equations.

It also carries a tutor, "Ask the Codex", which answers questions and sets
quiz questions from the Codex's own text with citations, running on
Cloudflare Workers AI within the free tier; the Workbench can ask the same
model to draft Directory entries. The site installs on a phone and reads
offline.

The site is generated from the Codex. After editing anything under `codex/`:

```
node tools/build.js
```

No dependencies; Node 18+ is enough. `src/worker.js` is the Cloudflare
Worker behind `/api/*`; it needs no keys, only the Workers AI binding
declared in `wrangler.jsonc`. See `CLAUDE.md` for the conventions.
