# THE AETHER CODEX — Overview & File Map
### Master index for the Aether Power System reference files

**Version:** 2.7
**Status:** Living document — see `codex/changelog.md` for how to extend it
**Notation:** All equations use plain ASCII (no Greek letters, hats, daggers, or special symbols) so they can be typed directly into a manuscript. See the changelog (v1.3 entry) for the legacy symbol mapping if cross-referencing earlier drafts.

---

## How this reference is organized

The Codex was originally a single document; as of v2.2 it is split into files under `codex/` so each area can be edited and extended independently. **All section (§) and equation (Eq.) numbers are global and unchanged from the single-document versions** — a cross-reference like "§3.5" or "Eq. 4.7" means the same thing everywhere, regardless of which file it appears in. Use the map below to find which file houses any given section.

| File | Contents | Sections | Equations defined |
|---|---|---|---|
| `codex/overview.md` | This file — version, notation, file map, reading order | — | — |
| `codex/foundations.md` | Premise (the layered-field mechanism) and Core Philosophy | §1 (1.1–1.4), §2 | Eq. 1.1–1.4 |
| `codex/grand-equation.md` | The Grand Unified Aether Equation, term reference, the Unsolved Ceiling, Fidelity, Unassisted Invocation, Simulated Invocation | §3.1, §3.2, §3.4–§3.7 | Eq. 3.1–3.1d, 3.2–3.5 |
| `codex/power-hierarchy.md` | The Power Hierarchy, subclasses, and the Ascent Beyond Legend | §3.3 | Eq. 3.1e–3.1g |
| `codex/techniques-novice.md` | Part 4 preamble (the ripple-to-result chain) and Novice worked examples | §4 intro, §4.0 | Eq. 4.0a–4.0c, 4.0e |
| `codex/techniques-journeyman.md` | Journeyman techniques — formalizing sequential, un-cross-coupled casting | §4.5 | Eq. 4.13 |
| `codex/techniques-adept.md` | Adept techniques — formal definition of the `Chi(f1,f2)` cross-coupling function | §4.6 | Eq. 4.14–4.15 |
| `codex/techniques-artisan.md` | Artisan techniques — the quark-sector analogue of a Novice worked example, and its backlash mode | §4.7 | Eq. 4.16–4.17 |
| `codex/techniques-master.md` | Master techniques — full transmutation and universal binding/decay control | §4.8 | Eq. 4.18–4.19 |
| `codex/techniques-warden.md` | Warden techniques — the first metric-sector effect below Sovereign | §4.9 | Eq. 4.20–4.21 |
| `codex/techniques-sovereign.md` | The Overlay Fold, the Collapse Condition, the Bound Singularity (Sovereign scope) | §4.1–§4.3 | Eq. 4.1–4.12 |
| `codex/techniques-legend.md` | Legend-scale extensions of the Overlay Fold and Bound Singularity — the same mathematics, held across a standing domain | §4.10 | Eq. 4.22–4.23 |
| `codex/techniques-ascension.md` | The Ascent Beyond Legend — closeness/progress equations for the four unattainable paths | §4.11 | Eq. 4.24–4.27 |
| `codex/spell-directory.md` | The Spell Directory — coded catalog of named techniques, Novice through Beyond Legend (every rank except Sovereign, whose canonical workings live in §4.1–§4.3) | §4.4 | Eq. 4.0d |
| `codex/spell-directory-iii.md` | Directory Expansion III — 2,061 further named techniques, bringing the catalogue to 2,500 | §4.4 (cont.) | — |
| `codex/working-equations.md` | Working Forms — every Directory entry's base equation specialised to it, one per technique | §8 | Eq. 8.1–8.2500 |
| `codex/glossary.md` | Symbol & Term Glossary and the Equation Index | §5, §6 | — |
| `codex/changelog.md` | Version history and extension conventions | §7 | — |

## Reading order

For a first read, or for onboarding a collaborator: `foundations.md` (why the system works the way it does), then `grand-equation.md` (the formal core and the three axes), then `power-hierarchy.md` (who can do what), then the technique files in tier order — `techniques-novice.md`, `techniques-journeyman.md`, `techniques-adept.md`, `techniques-artisan.md`, `techniques-master.md`, `techniques-warden.md`, `techniques-sovereign.md`, `techniques-legend.md`, `techniques-ascension.md` — with `spell-directory.md` and `glossary.md` as references to consult rather than read straight through.

## Extension conventions

New techniques, refinements, and derivations are appended to the relevant file with a version bump and a one-line summary in `codex/changelog.md`. New equations continue the running global numbering tracked in `codex/glossary.md` (§6). As of v2.3, every rank in the Power Hierarchy — Novice through Legend — has at least one dedicated applied-technique file and at least one formalized equation, and the four Ascent Beyond Legend paths each have a closeness/progress equation in `codex/techniques-ascension.md`. Future growth from here is depth (more Spell Directory entries per rank, deeper derivations) rather than filling gaps in the hierarchy's coverage.
