# Aether

A hard-magic system for fiction: the Aether Codex (`codex/`, sixteen markdown
files, the source of truth) and a single-file reference site (`index.html`)
that presents it, with a searchable 439-entry Spell Directory, a symbol
glossary with hover definitions, and a Spell Workbench for building new
techniques from the Codex's own equations.

The site is generated from the Codex. After editing anything under `codex/`:

```
node tools/build.js
```

No dependencies; Node 18+ is enough. See `CLAUDE.md` for the conventions.
