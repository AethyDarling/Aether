# THE AETHER CODEX — Changelog
### §7 Version History & Extension Conventions

*Part of the Aether Codex reference set — see `codex/overview.md` for the file map.*

---

## 7. Changelog

*New techniques, refinements, and derivations are appended to the relevant Codex file with a version bump and a one-line summary here, then given their own subsection under the relevant Part. New equations continue the running numbering in §6 (`codex/glossary.md`).*

**v2.7 — Directory Expansion III and the Working Forms**
- Added Directory Expansion III (`codex/spell-directory-iii.md`): 2,061 further named techniques, bringing the Spell Directory to 2,500 entries. Codes continue each tier's numbering; prevalence weighting follows §3.3 (Novice 800, Journeyman 300, Adept 360, Artisan 260, Master 160, Warden 120, Legend 40, Beyond Legend 21). Every Journeyman entry names its two Novice components, every Adept entry its pair, every Artisan entry its material and unmodelled neighbours, every Warden entry its proven geometry.
- Added §8, Working Forms (`codex/working-equations.md`): Eq. 8.1–8.2500, one per Directory entry in Directory order, each the tier's base equation specialised to that entry by a shape factor `eta_<code>` whose meaning the form states. Nothing in a working form alters a base equation.
- Added §5.3, the working-form symbols (`eta_<code>`, `S_<code>`, `G_site`, `D_cycle`, `theta_arc`, `T_pulse`, `R_reach`, `N_rep`, `w_1`/`w_2`, target quantities).
- No changes to existing entries or equations; Sovereign remains uncatalogued.

**v2.6 — Spell Directory Expansion II**
- Spell Directory Expansion II — 200 further catalogued techniques across every directory tier (Novice 60, Journeyman 40, Adept 34, Artisan 26, Master 16, Warden 12, Legend 8, Beyond Legend 4), appended to §4.4 as Directory Expansion II, plus §5 trade-vocabulary additions. No new global equation numbers; no changes to existing entries

**v2.5 — Spell Directory Expansion I**
- Spell Directory Expansion I — 200 new catalogued techniques across every directory tier (Novice 60, Journeyman 40, Adept 34, Artisan 26, Master 16, Warden 12, Legend 8, Beyond Legend 4), appended to §4.4 as Directory Expansion I, plus §5 glossary additions for directory-local notation (`t_hold`, *reverse-sign casting*) and trade vocabulary. No new global equation numbers; no changes to existing entries

**v2.4 — Cross-Reference Audit & Consistency Pass**
- Full cross-reference audit of all 16 files (equation/section citations, glossary coverage, Spell Directory codes, structural claims); no equations renumbered, no §/Eq. global numbering changed
- Fixed §-vs-Eq. citation swaps: "Eq. 3.4's Unsolved Ceiling" → "§3.4's" (§3.3), "Eq. 3.4 forbids" → "§3.4 forbids" (§4.11), the Sim[...] believed-vs-proven warning re-attributed §3.5 → §3.7 (§3.3), `Xi(Ae, g)` development pointer corrected to (§3.3, §4.3, §4.9) in §3.1, and §4.5's closing citation corrected from "Eq. 3.1c's combination pattern" to the Adept Combination Pattern (Eq. 4.15, §4.6); §4.11's closeness-auditability framing re-attributed §3.3 → §3.4 (here and in the v2.3 entry below)
- Updated stale ranges left by v2.3's own additions: J-01–J-06 → J-01–J-07 and AR-01–AR-06 → AR-01–AR-07 wherever they described the current directory (§4.5, §4.7, and the v2.3 entry below); §4.4's intro now counts §4.0's four worked examples and carves out N-EM-05 from the "every entry sources a distortion" claim
- Renamed the Eq. 4.10/4.12 background constant `k_grav` → `k_newton` to end the collision with the solvable gauge coupling `k_grav` (Eq. 3.1c, Eq. 4.0b); glossary updated, and §4.0's "same `k_grav`" throughline reworded to "gravity, at opposite ends of the hierarchy"
- Added an explicit direction parameter `s = +/-1` to Eq. 4.19, replacing prose that reversed the sign of `Fid` (bounded to [0,1] by Eq. 3.2); M-01/M-02 updated to match, and M-02 re-anchored from Eq. 4.18 to Eq. 4.19 (its described effects are property nudges, not identity rewrites)
- Re-paired J-05 (Two-Handed Smith) as Eq. 4.0a + Eq. 4.0c so AD-01 (Flash-Forge, EM+Strong) genuinely supersedes it; §4.5's echo updated; §4.4's Journeyman preamble now covers either/or entries (J-03) and same-force pairs (J-02, J-06); §4.5's `tau_switch` training examples now cite J-07 rather than J-03
- §3.3 tidy-up: subclass claim now names the Sovereign→Legend step as the exception that admits no partial rung; "three gauge-and-matter tiers" corrected to five; the Unsolved Ceiling moved out of the tier table into a footnote (it is a limit, not a tier — keeping §3.3's "not a ninth tier" arithmetic honest); Warden's `Xi_1` no longer hedged as "often" (Eq. 4.20 is identically zero without it), matching the tier definition "first-order"
- §4.2's fold fizzle no longer costs "minor fatigue" — aligned with §1.3/§3.5/§3.6's zero-cost quiet failure; §4.9's header now cites Legend's actual home (§4.10); §4.0's closing tier ladder now includes Journeyman and Artisan; §4.4's Eq. 4.15 block is now explicitly a restatement of §4.6's definition; §4.4 now names its one uncatalogued rank (Sovereign) and points to §4.1–§4.3
- Glossary: added missing rows (`A_op`, `Loop_dM[...]`, `Dpath(Ae)`, `hbar`, `X_ideal`/`X_eff`, `t_rel`, `eta`, `m_obj`/`g_local`/`F_net`, `P_out`/`E_per_decay`/`N_unstable`, `Effect_i`, `dAe_local`, `E_back_mat`, `E_back_pert`, `s`); fixed `t_dom_legend`'s defined-in pointer (Eq. 4.22/4.23, not Eq. 3.1g); marked `C_sel` as a legacy symbol appearing in no equation; `eta` also added to Eq. 4.6's inline symbol table; `V_out`/`L_out`/Eq. 4.0d's output symbols now named inline in §4.4
- Corrected ledger arithmetic in earlier entries: v2.1's Novice count 15 → 11; v2.3's new-directory-entry count 12 → 10

**v2.3 — Full Hierarchy Coverage**
- Closed every remaining gap in the Power Hierarchy's applied-technique coverage: every rank from Novice through Legend now has a dedicated technique file and at least one formalized equation, and the four Ascent Beyond Legend paths each have a checkable closeness metric
- Added `codex/techniques-journeyman.md` (§4.5, Eq. 4.13 — Sequential Invocation Overhead): formalizes the disjoint activation windows and switching cost (`tau_switch`) between two solved `k_f` terms held without a cross-coupling, giving the existing J-01–J-07 directory entries a shared mathematical backbone
- Added `codex/techniques-adept.md` (§4.6, Eq. 4.14–4.15): formally defines `Chi(f1,f2)`, previously a named-but-undefined placeholder, as a real overlap measure (Eq. 4.14), and promotes the Spell Directory's informal Adept Combination Pattern to a numbered equation (Eq. 4.15)
- Added `codex/techniques-artisan.md` (§4.7, Eq. 4.16–4.17): a quark-sector analogue of Eq. 4.0a (Eigenvector Draw) giving AR-01–AR-07 a shared formal backbone, plus a quark-sector analogue of Eq. 4.7's backlash integral (Off-Basis Extrapolation) confirming §1.3's claim that the fizzle/backlash mechanism is universal across all three coupling channels
- Added `codex/techniques-master.md` (§4.8, Eq. 4.18–4.19): Full Transmutation (a unitary operator over the complete `M_op` eigenbasis) and Universal Binding & Decay Control (generalizing Eq. 4.0c/4.0d to any material once `c_M` is unrestricted by a partial `S`)
- Added `codex/techniques-warden.md` (§4.9, Eq. 4.20–4.21): the first metric-sector (`delta(g)`) applied technique below Sovereign — a perturbative curvature effect confined to a single validated geometry (`R_proven`), plus the backlash mode for extrapolating past it
- Split the former combined Sovereign/Legend technique file: `codex/techniques-sovereign.md` now covers Sovereign scope only (§4.1–§4.3, Eq. 4.1–4.12, unchanged); new `codex/techniques-legend.md` (§4.10, Eq. 4.22–4.23) extends the same mathematics — explicitly not re-derived — to Legend's standing, generational scale, introducing `t_drift` and `t_recert` as the operative upkeep constraints at that scale
- Added `codex/techniques-ascension.md` (§4.11, Eq. 4.24–4.27): one closeness/progress equation per Ascent Beyond Legend path (Tetrarch, Demiurge, Cosmographer, Communion), honoring §3.4's own framing that closeness is auditable even though completion never is
- Added one new Novice equation, Eq. 4.0e (Ripple Sense): a passive, risk-free detection use of the `k_EM` channel in reverse, rounding out Novice tier with a technique that reads rather than sources
- Added 10 new Spell Directory entries across the newly-formalized ranks: N-EM-05, J-07, AR-07, M-01, M-02, W-01, LG-01, LG-02, AS-01, AS-02, plus the retitled AD- pattern block (now Eq. 4.15) — see §4.4 for the full list; new directory code prefixes `M-`, `W-`, `LG-`, `AS-` introduced alongside the existing `N-`, `J-`, `AD-`, `AR-`
- Added corresponding glossary (§5) entries for every new symbol, filled a pre-existing gap (`c_M` was used in §1.3 but never glossed), and added all 16 new rows to the Equation Index (§6)
- Updated `codex/overview.md`'s file map, reading order, and extension conventions to reflect the now-complete hierarchy

**v2.2 — Split into Reference Files**
- Split the single `v1.md` document into nine files under `codex/`: `overview.md` (file map, reading order, extension conventions), `foundations.md` (§1–§2), `grand-equation.md` (§3.1–§3.2, §3.4–§3.7), `power-hierarchy.md` (§3.3), `techniques-novice.md` (§4 preamble, §4.0), `techniques-sovereign.md` (§4.1–§4.3), `spell-directory.md` (§4.4), `glossary.md` (§5–§6), `changelog.md` (§7)
- All § and Eq. numbering is global and unchanged; each file carries a short header noting what it houses and where its neighbors live
- No equations, symbols, or technical content changed — structural reorganization only
- `v1.md` deleted after verification; the split files are now the canonical Codex

**v2.1 — The Spell Directory**
- Added Eq. 4.0d (Decay Nudge), completing the four-force set of Novice worked examples begun in §4.0
- Added §4.4, The Spell Directory: a coded catalog (`N-`, `J-`, `AD-`, `AR-`) of Common and Uncommon techniques — 11 Novice entries across all four forces, 6 Journeyman entries demonstrating unblended alternation, 6 Adept entries (one per unordered force pair, introducing the shared `Chi(f1, f2)` cross-coupling pattern), and 6 Artisan signature-material entries
- Directory entries are deliberately not added to the Equation Index individually — they draw on already-indexed base equations rather than each requiring new global numbering, keeping the catalog easy to extend
- Added corresponding glossary (§5) entries for `Gamma_0`/`Gamma_eff` and `Chi(f1, f2)`

**v2.0 — Subclasses & The Ascent Beyond Legend**
- Expanded the Power Hierarchy (§3.3) with three intermediate subclasses — Journeyman (between Novice/Adept), Artisan (between Adept/Master), Warden (between Master/Sovereign) — each defined by a genuine but incomplete solution to the next tier's term, not a new term of its own
- Split the former combined "Sovereign / Legend" row into two sequential tiers, distinguished by how far a solved `Xi(Ae, g)` reaches rather than by different mathematics (Eq. 3.1g)
- Added Eq. 3.1e (Partial Diagonalization), Eq. 3.1f (Perturbative Aether-Geometry Coupling), and Eq. 3.1g (Domain Persistence), each extending an existing Eq. 3.1 sub-term rather than introducing a new one
- Added "The Ascent Beyond Legend" (§3.3): four divergent, historically-attested paths toward apotheosis — Tetrarch (gauge unification), Demiurge (matter-generation), Cosmographer (unbounded geometry), Communion (pooled comprehension) — each pushing one piece of `L_total` or `dM` to its limit while remaining provably incomplete per §3.4
- Added corresponding glossary (§5) and Equation Index (§6) entries

**v1.9 — Simulated Invocation**
- Added §3.7 and Eq. 3.5 (Simulated Invocation): a `Sim[...]` prefix that evaluates any equation's fidelity readout — projected output, projected backlash energy — without passing the result into Eq. 3.1's `Loop_dM[...]` selection, so nothing is actually manifested
- Established that `Sim[...]` reps count fully toward `prac(x)` (§3.6), making fidelity practice free of real-world risk regardless of a technique's tier
- Established the deliberate limit: `Sim[...]` scores execution against the caster's *believed* `phi_ideal`, so it cannot validate an unproven or misjudged claim — comprehension-driven backlash risk (§2, §3.6) is untouched by this mechanic
- Cross-linked §2, §3.5, and §3.6 to the new section; added glossary entries for `Sim[...]`, `X_eff_proj`, `E_back_proj` and an Equation Index row for Eq. 3.5

**v1.8 — Novice Techniques & Course Structure**
- Added §4.0, the first Novice-tier worked examples: Eq. 4.0a (Thermal Excitation — "boiling water"), Eq. 4.0b (Minor Levitation), Eq. 4.0c (Minor Cohesion Boost), each a single closed-form `k_f` term
- Clarified the distinction between `k_grav` (a simple force-coupling, exercised directly for the first time in Eq. 4.0b) and `Xi(Ae, g)` (true metric curvature, §4.3) — same underlying force, opposite ends of the Power Hierarchy
- Added a Tier column to the Equation Index (§6) so the document can start functioning as a course syllabus; flagged that Adept and Master tiers have no applied techniques yet
- Linked the Novice row of the Power Hierarchy (§3.3) to its new worked examples

**v1.7 — Study Guide Restructure**
- Removed the Worldbuilding Hooks & Open Threads section entirely; this document is now scoped as a study guide and glossary for the mechanics of the magic system, not a source of narrative/story hooks
- Renumbered the Equation Index to §6 and the Changelog to §7; updated the subtitle and all internal cross-references accordingly
- No equations, symbols, or technical content changed

**v1.6 — Grand Equation Tidy-Up**
- Decomposed Eq. 3.1 into a top-level path integral plus four named sub-equations (Eq. 3.1a–3.1d: Aether Action, Total Lagrangian Density, Gauge Term, Quark Term), replacing the single deeply nested one-line form
- Updated the Term Reference (§3.2) and Glossary (§5) to point each symbol at its precise sub-equation rather than the whole of Eq. 3.1
- Added the corresponding rows to the Equation Index (§6)
- Readability pass only — no physical content changed from earlier versions

**v1.5 — Condensed Form**
- Added Eq. 4.12, folding the well source, counter-curvature shell, and residual outreach (Eq. 4.8, 4.9, 4.11) into a single piecewise expression using `Bump`, `Shell`, and `Step` as radius-selecting switches
- Kept the horizon/lapse condition (Eq. 4.10) as an explicit companion constraint rather than merging it into the main line, since it governs proper time rather than curvature

**v1.4 — The Bound Singularity**
- Added a Sovereign/Legend-tier technique (§4.3) for generating a localized, aether-sourced gravity well with an engineered containment boundary
- Introduced Eq. 4.8 (well source), Eq. 4.9 (counter-curvature shell / anti-gravity field), Eq. 4.10 (containment lapse and horizon tuning — the time-dilation component), and Eq. 4.11 (residual outreach from imperfect shell fidelity)
- Distinguished two independent failure modes: shell rupture (a Fidelity Principle failure) vs. horizon migration (a subtler failure that can pass every static measurement while remaining causally unsealed)
- Added three worldbuilding hooks reflecting the new technique (later removed, see v1.7)

**v1.3 — Notation Overhaul & Unassisted Invocation**
- Replaced every symbol in the document with a plain-ASCII equivalent for ease of typing in the manuscript. Legacy mapping, for cross-referencing older drafts:

  | Old | New | Old | New |
  |---|---|---|---|
  | Ψ / Ψ† | `Ae` / `Ae*` | Γ_decohere | `G_dec` |
  | κ_f | `k_f` | σ_interference | `s_int` |
  | F_f^μν | `F_f` | η | `eta` |
  | M̂ | `M_op` | 𝔉 / 𝔉_min | `Fid` / `Fid_min` |
  | Ξ(Ψ,g_μν) | `Xi(Ae, g)` | φ_ideal / φ_actual | `phi_ideal` / `phi_actual` |
  | ∂ℳ | `dM` | τ / τ_ins / τ_rel | `t` / `t_ins` / `t_rel` |
  | Û(x_A→x_B) | `U_op(A, B)` | α(τ), β(τ) | `a(t)`, `b(t)` |
  | Ω²(x) | `Om2(x)` | ⟨a\|b⟩ | `<a|b>` (unchanged — already typeable) |
  | δ(...) | `Delta(...)` | ∮, 𝒟Ψ, ∫ | `Loop[...]`, `Dpath(Ae)`, `Int[...]` |
  | x_A, x_B | `A`, `B` | γ (transition path) | `traj` |

- Added Unassisted Invocation (§3.6): a per-term mastery threshold, `prac_min`, past which a solved equation can be cast through visualization alone, with no physical medium — including live, in-`dM` recomposition of already-solved terms. Introduced Eq. 3.4.
- Added one worldbuilding hook reflecting the new mechanic (later removed, see v1.7).

**v1.2 — The Fidelity Principle**
- Retired any implication that aether is a finite, consumable, or storable resource; established it as an ambient, inexhaustible field (§3.5)
- Introduced execution fidelity as a second, independent axis alongside comprehension: Eq. 3.2 (Fidelity-Weighted Output), Eq. 3.3 (Minimum Resolution Threshold)
- Cross-linked the Fidelity Principle into the Overlay Fold and Collapse Condition (§4.1, §4.2) to distinguish fidelity failures (quiet fizzle) from comprehension failures (backlash, Eq. 4.7)
- Added two worldbuilding hooks reflecting the new craftsmanship axis (later removed, see v1.7)

**v1.1 — Voice & Reference Pass**
- Rewrote document prose for a consistent explanatory register
- Introduced sequential equation numbering (Eq. 3.1–4.7) and the Equation Index (§6)
- Added §-style cross-references throughout; no equations altered in substance from v1.0

**v1.0 — Initial Compilation**
- Grand Unified Aether Equation established (§3)
- Power hierarchy tiers defined (§3.3)
- Overlay Fold technique derived — mass-neutral relocation via metric identification (§4.1)
- Collapse Condition derived — resolution mechanic and three failure modes (§4.2)
- Master symbol glossary compiled (§5)
