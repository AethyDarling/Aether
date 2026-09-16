/*
  tools/annotations.js — the site's reading-aid layer.

  The Codex text itself is generated from codex/*.md by tools/build.js.
  This file holds the hand-written material that sits around it on each
  page: a one-line lede, an "In brief" summary, and plain-language
  callouts pinned to section anchors. Keys are the site route; callout
  keys are "start:<id>" (right after that heading) or "end:<id>" (at the
  end of that section, before the next heading). Section ids are
  "sec-3-5" for §3.5; equation ids are "eq-4-7" for Eq. 4.7.

  Keep these short. They are a way in, not a second copy of the text.
*/
"use strict";

const plain = (title, body) => '<aside class="callout plain"><p class="co-h">' + title + "</p>" + body + "</aside>";
const tryit = (body, href) => '<aside class="callout try"><p class="co-h">Try it in the Workbench</p><p>' + body + ' <a class="btn small" href="' + href + '">Open the Workbench →</a></p></aside>';
const warn = (title, body) => '<aside class="callout warn"><p class="co-h">' + title + "</p>" + body + "</aside>";

module.exports = {
  /* ───────── Foundations ───────── */
  "foundations": {
    lede: "Why the system works the way it does: aether as a hidden layer beneath the four forces, the ripple that carries a casting, the three channels it can push through, and the one channel that is different in kind.",
    brief: [
      "Aether is a separate field <em>beneath</em> electromagnetism, the weak and strong forces, and gravity. Nobody ever sees aether; they see one of those four fields wearing a shape it would not have taken on its own.",
      "A casting is a <strong>ripple</strong>: the caster disturbs the aether layer, the disturbance spreads, and it pushes an upper field through one of exactly three channels: gauge (the forces), quark (matter), or metric (spacetime).",
      "There is <strong>no mana</strong>. The ambient field <code class=\"sym\" data-sym=\"Ae_0\">Ae_0</code> is never spent; only the ripple <code class=\"sym\" data-sym=\"dAe\">dAe</code> does anything.",
      "Two kinds of failure: a <strong>fizzle</strong> (the ripple was too weak, nothing happens, no harm) and a <strong>backlash</strong> (the ripple was fine but aimed through a channel the caster never actually solved; the mismatch reflects back into the caster).",
      "The metric channel is different: bending spacetime changes the medium the ripple is travelling through, mid-cast. That single fact is why the top half of the Power Hierarchy is so much harder than the bottom half.",
      "Three independent axes describe any caster: <strong>comprehension</strong> (the ceiling), <strong>fidelity</strong> (how cleanly this casting was executed) and <strong>practice depth</strong> (whether a technique can be cast with no glyph or gesture).",
    ],
    callouts: {
      "end:sec-1-1": plain("In plain terms", "<p>The aether field is a still pond that never runs dry. A caster taps its surface, and the tap spreads as a ripple. Everything a spell ever does is downstream of one well-shaped tap. Notice what is <em>not</em> in this equation: no reservoir, no cost, no fuel. That absence is deliberate, and the rest of the system is built on it.</p>"),
      "end:sec-1-2": plain("In plain terms", "<p>The tap is <code class=\"sym\" data-sym=\"J_cast\">J_cast</code>; the ripple is <code class=\"sym\" data-sym=\"dAe\">dAe</code>; the propagator <code class=\"sym\" data-sym=\"G\">G</code> decides how far and how fast the ripple travels through the surrounding geometry. A sloppy tap makes a weak ripple no matter how much theory the caster knows. That is fidelity, made physical.</p>"),
      "end:sec-1-3": plain("In plain terms", "<p>A ripple can push on reality through exactly three doors: the <strong>gauge</strong> door (light, heat, lightning, weight, cohesion, decay), the <strong>quark</strong> door (what a thing is made of), and the <strong>metric</strong> door (the shape of space and time). Each door needs its own key, a solved piece of mathematics. A caster who guesses at a key is not opening the door slightly. They are forcing a lock, and the lock forces back. That is the difference between a fizzle and a backlash.</p>"),
      "end:sec-1-4": plain("In plain terms", "<p>Bending space is like repainting the floor you are standing on: every stroke changes the surface the next stroke has to land on. The other two channels hold still while you work. This one does not, and that single fact is why the entire upper half of the Power Hierarchy is devoted to just this door.</p>"),
      "end:sec-2": tryit("The three axes are the inputs of every calculation on the Workbench: what is solved sets the ceiling, fidelity scales the result, and practice depth decides whether an unassisted casting resolves at all.", "#/workbench?mode=fidelity"),
    },
  },

  /* ───────── Grand Equation ───────── */
  "grand-equation": {
    lede: "The formal core. One path integral selects which configuration of reality becomes real, and everything a caster does is a claim about which pieces of it they have solved and how faithfully they can execute them.",
    brief: [
      "The Grand Equation is a stack of named pieces: a path integral (Eq. 3.1) over an action (3.1a) built from one density (3.1b), which is the sum of a <strong>gauge</strong> term (3.1c), a <strong>quark</strong> term (3.1d), and the aether-to-spacetime coupling <code class=\"sym\" data-sym=\"Xi(Ae, g)\">Xi(Ae, g)</code>.",
      "Only configurations inside the caster's proven understanding <code class=\"sym\" data-sym=\"dM\">dM</code> are on the ballot. Nothing outside what has been solved can ever be selected.",
      "The whole integral can never be solved by a finite mind. That is the <strong>Unsolved Ceiling</strong> (§3.4): a property of the mathematics, not a rule anyone imposed.",
      "<strong>Fidelity</strong> (Eq. 3.2) scales every output between 0 and 1. Below a threshold (Eq. 3.3) a casting simply fails quietly.",
      "<strong>Unassisted invocation</strong> (Eq. 3.4) is earned per technique, not per tier: drill a term past <code class=\"sym\" data-sym=\"prac_min\">prac_min</code> and it can be cast with no glyph or cadence.",
      "<strong>Simulated invocation</strong> <code class=\"sym\" data-sym=\"Sim[...]\">Sim[...]</code> (Eq. 3.5) rehearses a casting without committing it to reality. It makes execution free to perfect. It cannot tell you your mathematics is wrong.",
    ],
    callouts: {
      "end:sec-3-1": plain("In plain terms", "<p>Of all the shapes reality could take around a caster, the one that becomes real is chosen by weighing every possibility, and only possibilities inside the caster's proven understanding are on the ballot. The stack of sub-equations just names what does the weighing: the four forces, matter, and the one place aether touches spacetime directly. Every tier of the Power Hierarchy is a claim about which of those three pieces a caster has opened, and how far.</p>"),
      "end:sec-3-5": plain("In plain terms", "<p>A spell's strength is its ideal strength times how cleanly you performed it, and a sloppy-enough performance simply does nothing at all. There is no overcasting and no burning extra power for extra effect: the ceiling is fixed by the mathematics, and execution only decides how close you get to it.</p>") +
        tryit("Set a fidelity, an anchor and a practice depth and watch a Novice working scale, then drop below the threshold and see it fizzle.", "#/workbench?mode=fidelity"),
      "end:sec-3-7": plain("In plain terms", "<p><code class=\"sym\" data-sym=\"Sim[...]\">Sim[...]</code> is a flight simulator. It grades your performance perfectly, and the skill it builds is real, but it grades you against the mathematics you brought, and it has no way of telling you that mathematics is wrong. Rehearsal makes execution safe to perfect. It cannot make a wrong idea safe to cast.</p>"),
    },
  },

  /* ───────── Power Hierarchy ───────── */
  "hierarchy": {
    lede: "Who can do what, and why. Eight tiers of comprehension, three subclasses defined by holding an incomplete piece of the next tier's term, and the four paths beyond Legend that no one has ever completed.",
    brief: [
      "Tier measures <strong>comprehension only</strong>: which pieces of the Grand Equation a caster has solved. A careful Novice can out-cast a careless Adept.",
      "<strong>Novice → Journeyman → Adept</strong> live in the gauge channel: one force, then several, then several blended through a solved cross-term <code class=\"sym\" data-sym=\"Chi(f1, f2)\">Chi</code>.",
      "<strong>Artisan → Master</strong> live in the quark channel: a few solved materials (a partial eigenbasis of <code class=\"sym\" data-sym=\"M_op\">M_op</code>), then all of them.",
      "<strong>Warden → Sovereign → Legend</strong> live in the metric channel: a perturbative slice valid in proven places, then a closed form over a bounded domain, then the same closed form held at effectively permanent scale.",
      "Journeyman, Artisan and Warden are each a <em>partial</em> version of the next tier's term. Sovereign → Legend is the same mathematics at larger <code class=\"sym\" data-sym=\"R_dom\">R_dom</code> and <code class=\"sym\" data-sym=\"t_dom\">t_dom</code>, so it admits no partial rung.",
      "Beyond Legend is a fork of four paths (Tetrarch, Demiurge, Cosmographer, Communion). Each can be approached forever and completed never.",
    ],
    callouts: {
      "start:sec-3-3": plain("How to read the ladder", "<p>The table below is a map of which of the three doors from §1.3 a caster has opened, and how far. The first three rungs live entirely in the forces door, the next two in the matter door, and the last three in the space-time door. A higher tier never means a bigger reserve of power. It means a genuinely new piece of solved mathematics that lower tiers simply do not have.</p>"),
    },
  },

  /* ───────── Novice ───────── */
  "techniques/novice": {
    lede: "Where casting begins: one solved force coupling, in closed form, with no combination and no metric involvement. The page also walks the full ripple-to-result chain once, so every later equation can be read as shorthand for it.",
    brief: [
      "Every Novice technique uses exactly <strong>one</strong> <code class=\"sym\" data-sym=\"k_f\">k_f</code> term from Eq. 3.1c.",
      "Four worked examples, one per force: heat (EM, Eq. 4.0a), lift (gravity, 4.0b), cohesion (strong, 4.0c) and decay (weak, 4.0d, defined in the Directory), plus a passive read (Ripple Sense, 4.0e).",
      "The output always scales linearly with fidelity. The worst failure at this tier is lukewarm water.",
      "Lifting a pebble and binding a singularity both trace back to gravity. One is a single closed-form coupling; the other is a partial solution of an entirely different term.",
    ],
    callouts: {
      "end:sec-4-0": plain("In plain terms", "<p>The five entries here are one trick pointed at four different forces, plus a listening version of the first: concentrate a ripple where you want it, and let a single solved coupling do the rest. The electromagnetic one is taught first because its worst failure is lukewarm water.</p>") +
        tryit("Load Thermal Excitation, pick a force, set a fidelity and a mass of water, and read off the heating rate. Then export the result as a Directory-style entry.", "#/workbench?mode=novice"),
    },
  },

  /* ───────── Journeyman ───────── */
  "techniques/journeyman": {
    lede: "Two or more solved forces, held one at a time. The tier is defined by an absence: no cross-term, so no blending, only switching, and a dead time between windows.",
    brief: [
      "A Journeyman holds two or more closed-form <code class=\"sym\" data-sym=\"k_f\">k_f</code> terms, each a Novice equation in its own right.",
      "Output is a sum of <strong>non-overlapping</strong> windows (Eq. 4.13). At no instant are both channels producing.",
      "<code class=\"sym\" data-sym=\"tau_switch\">tau_switch</code> is the dead time between windows: real cost, shrinks with drill, never reaches zero.",
      "A true zero-gap alternation is not a fast Journeyman. It is the Adept transition itself.",
    ],
    callouts: {
      "end:sec-4-5": plain("In plain terms", "<p>A Journeyman knows two spells but has, in effect, one pair of hands: each casting must be fully released before the next can begin, and the fumble between them is where things go wrong under pressure. Practice shortens the fumble. Only genuinely new mathematics, the Adept's cross-term, removes it.</p>") +
        tryit("Lay two Novice castings on a timeline with a switching gap and see how much of the working time is dead.", "#/workbench?mode=journeyman"),
    },
  },

  /* ───────── Adept ───────── */
  "techniques/adept": {
    lede: "One ripple, two forces. The Adept has solved how a single disturbance can satisfy two gauge channels at once, and pays for it with a fidelity penalty that enters squared.",
    brief: [
      "<code class=\"sym\" data-sym=\"Chi(f1, f2)\">Chi(f1, f2)</code> (Eq. 4.14) measures how coherently one ripple can serve two channels. Zero is the Journeyman condition; one is a limit no technique reaches.",
      "Combined output (Eq. 4.15) is the product of both couplings, times <code class=\"sym\" data-sym=\"Chi(f1, f2)\">Chi</code>, times <strong>fidelity squared</strong>.",
      "Fidelity is squared because both channels read the same ripple: one wobble is taxed twice.",
      "Four forces make exactly six unordered pairs, all six already catalogued (AD-01 to AD-06). Tier is a per-pair fact: a caster can be Adept for one pair and Journeyman for another.",
    ],
    callouts: {
      "end:sec-4-6": plain("In plain terms", "<p>An Adept has solved how two forces can share one ripple. Four forces can only be paired six ways, so the entire Adept foundation fits in six cells. The price of sharing is the squared fidelity: one shared ripple means one shared point of failure.</p>") +
        tryit("Compare a blend against the same two forces cast in sequence, and watch the gap widen as fidelity drops.", "#/workbench?mode=adept"),
    },
  },

  /* ───────── Artisan ───────── */
  "techniques/artisan": {
    lede: "The first step into matter. An Artisan has solved a few specific eigenvectors of the mass operator, one material each, and everything outside that set is not weaker but unmodeled.",
    brief: [
      "An Artisan's solved set <code class=\"sym\" data-sym=\"S\">S</code> is a small, finite subset of <code class=\"sym\" data-sym=\"M_op\">M_op</code>'s eigenvectors (Eq. 3.1e). Careers pass with two or three.",
      "Eq. 4.16 is the quark-sector twin of the Novice heating equation: effect = eigenvalue × fidelity × ripple.",
      "Eq. 4.17 is what happens when a caster reasons by resemblance (bronze from iron): the guessed and true eigenvalues differ, and the difference integrates over the working volume as backlash.",
      "That backlash integral has exactly the same shape as the Overlay Fold's (Eq. 4.7). The mechanism is universal, not technique-specific.",
    ],
    callouts: {
      "end:sec-4-7": plain("In plain terms", "<p>Matter, in this system, is a locked instrument with a finite number of strings. An Artisan has learned to play a few specific strings perfectly: salt, iron, bone. A material whose string they never learned is not harder to play; it is not on their instrument at all. Reaching for it anyway, on the strength of a resemblance, is the backlash equation waiting to fire.</p>") +
        tryit("Pick a material inside the solved set and see the effect; pick one outside it and see the backlash energy instead.", "#/workbench?mode=artisan"),
    },
  },

  /* ───────── Master ───────── */
  "techniques/master": {
    lede: "Nothing new is learned at Master tier. The solved set closes over the whole eigenbasis, and transmutation, whole-body healing and decay control arrive together because they were always one equation.",
    brief: [
      "A Master's <code class=\"sym\" data-sym=\"S\">S</code> is the complete eigenbasis of <code class=\"sym\" data-sym=\"M_op\">M_op</code>. No new operator, just no boundary.",
      "Full transmutation (Eq. 4.18) rewrites which material a quantity of matter <em>is</em>, via a unitary over the completed basis.",
      "Universal binding and decay control (Eq. 4.19) generalises the Novice cohesion boost and decay nudge to any material, with a direction switch <code class=\"sym\" data-sym=\"s\">s</code> = ±1.",
      "Healing, hastened decay, arrested decay and reinforcement are the same equation pointed at different targets.",
    ],
    callouts: {
      "end:sec-4-8": plain("In plain terms", "<p>An Artisan knows some of the strings; a Master has finished learning all of them. Nothing new was added to the instrument, which is exactly why transmutation, whole-body healing and decay control arrive together at this tier: they were always one skill, waiting behind the same complete catalogue.</p>") +
        tryit("Set the direction switch and the matter coupling and read off the boosted or arrested rate for any material.", "#/workbench?mode=master"),
    },
  },

  /* ───────── Warden ───────── */
  "techniques/warden": {
    lede: "The first metric-sector technique below Sovereign: a small, provable nudge to curvature, valid only inside a geometry that has already been tested, and lethal to extrapolate.",
    brief: [
      "A Warden has solved the first two terms of a perturbation series around flat space (Eq. 3.1f). The higher terms are simply unknown.",
      "Eq. 4.20 confines the effect to a named, previously validated geometry <code class=\"sym\" data-sym=\"R_proven\">R_proven</code>: a doorway, a stair, a mapped stretch of road.",
      "Eq. 4.21: push the departure from flat space <code class=\"sym\" data-sym=\"eps\">eps</code> past what that site was ever tested to, and the truncated series stops tracking reality. The gap reflects back as backlash.",
      "Warden discipline is bookkeeping: which geometries are proven, to what <code class=\"sym\" data-sym=\"eps_valid(R_proven)\">eps_valid</code>, and refusing to reuse a result somewhere merely similar.",
    ],
    callouts: {
      "end:sec-4-9": plain("In plain terms", "<p>A Warden's spacetime mathematics is an approximation that has been tested in a few specific places, like a rope bridge certified for one particular canyon. Inside those places it is genuinely, provably safe. Carrying the same rope bridge to a similar-looking canyon, because it looks like it should hold, is how Wardens die.</p>") +
        tryit("Dial the departure from flat space toward and past the proven limit, and watch the effect give way to backlash.", "#/workbench?mode=warden"),
    },
  },

  /* ───────── Sovereign ───────── */
  "techniques/sovereign": {
    lede: "The two canonical Sovereign workings, derived in full: the Overlay Fold, which relocates a caster by arguing two points are the same, and the Bound Singularity, a caster-made gravity well sealed inside its own horizon.",
    brief: [
      "The <strong>Overlay Fold</strong> (Eq. 4.1–4.2) identifies two points conformally; no mass moves and no momentum carries through.",
      "While the fold is held the caster is a superposition of <em>here</em> and <em>there</em> (Eq. 4.3–4.4). Probability drains from A to B as the fold is held.",
      "Release timing decides everything (Eq. 4.5–4.6): too early is a harmless fizzle, mid-oscillation is a bleed, and a spike in decoherence is a backlash collapse whose energy (Eq. 4.7) scales with how badly the destination was known.",
      "The <strong>Bound Singularity</strong> (Eq. 4.8–4.12) is a well, a counter-curvature shell that cancels it outside, and a lapse tuning that makes the shell a real horizon.",
      "Two distinct disasters: <strong>shell rupture</strong> (fidelity failure, the well snaps outward) and <strong>horizon migration</strong> (the shell reads clean but the interior was never causally sealed).",
    ],
    callouts: {
      "end:sec-4-2": plain("In plain terms", "<p>A Fold does not move you. It argues that here and there are briefly the same place, and lets your probability drain from one to the other while the argument holds. The argument decays as it is held, and the worse you know your destination, the faster it rots. Release while the weight of probability sits at B and you arrive; misjudge the moment and the other outcomes are all that is left.</p>") +
        tryit("Hold a fold for a chosen time against a chosen knowledge of the destination and read the arrival probability, the outcome, and the backlash energy if it collapses.", "#/workbench?mode=fold"),
      "end:sec-4-3": plain("In plain terms", "<p>The Bound Singularity is a pet black hole in a soundproof box: a well of real gravity, a shell carrying the equal-and-opposite charge that cancels every outside trace of it, and a clock trick at the boundary so that nothing inside can ever cross out in any finite outside time. The catch is §1.4 again: each of the three pieces bends the stage the other two are performing on, so they can only be validated together, never separately.</p>") +
        tryit("Tune the core, the shell and the enclosed aether-mass; check whether the horizon lands on the shell, and see how much field leaks for an imperfect shell.", "#/workbench?mode=singularity"),
    },
  },

  /* ───────── Legend ───────── */
  "techniques/legend": {
    lede: "The same mathematics as Sovereign, held for a generation instead of an afternoon. What changes is that the world drifts out from under the working, so the operative quantity becomes a maintenance interval.",
    brief: [
      "Legend solves nothing Sovereign has not. Per Eq. 3.1g the difference is scale: <code class=\"sym\" data-sym=\"R_dom\">R_dom</code> and <code class=\"sym\" data-sym=\"t_dom\">t_dom</code> pushed to effective permanence.",
      "A standing fold (Eq. 4.22) needs its destination re-surveyed on a cadence <code class=\"sym\" data-sym=\"t_drift\">t_drift</code> before the assumed conformal factor drifts far enough to drive decoherence toward failure.",
      "A standing singularity (Eq. 4.23) needs its shell re-inscribed on an interval <code class=\"sym\" data-sym=\"t_recert\">t_recert</code> before the residual leak rises above background.",
      "A Legend is, mechanically, a Sovereign whose institution has learned to keep re-solving the same equation on schedule.",
    ],
    callouts: {
      "end:sec-4-10": plain("In plain terms", "<p>Legend-scale magic is infrastructure. The spell is the very one a Sovereign casts. What is new is that the world drifts out from under anything held for a generation, so someone must keep re-measuring and re-certifying on a schedule. Miss the schedule, and the failure is an ordinary Sovereign-tier failure, with a town inside it.</p>"),
    },
  },

  /* ───────── Ascension ───────── */
  "techniques/ascension": {
    lede: "The four paths beyond Legend cannot be finished, but they can be measured. Each fragment reduces \"how close\" to a number built only from mathematics a lower tier has already proven.",
    brief: [
      "<strong>Tetrarch</strong> (Eq. 4.24): average the six solved cross-couplings. Approaches 1; never becomes the single unified coupling.",
      "<strong>Demiurge</strong> (Eq. 4.25): count verified predictions from one proven extrapolation rule. Can grow without bound inside its family and says nothing outside it.",
      "<strong>Cosmographer</strong> (Eq. 4.26): domain achieved over a typical Legend's domain. Each increment costs more than the last, because of §1.4.",
      "<strong>Communion</strong> (Eq. 4.27): pooled comprehension over a typical Legend's. The only fragment that can exceed 1, and it measures the size of the pool, never its depth.",
    ],
    callouts: {
      "end:sec-4-11": plain("In plain terms", "<p>These are four different bets on how to keep growing once solving one term at a time runs out of road: unify the four forces into one, generalise matter itself, unbound geometry, or pool many minds' comprehension into a single boundary. Each has a meter of how far it has ever been pushed, and every meter stops short of its limit. That is not a rendering choice. The paths are real, measurable, and provably endless.</p>"),
    },
  },

  /* ───────── Changelog ───────── */
  "changelog": {
    lede: "Version history and the conventions for extending the Codex. New material is appended, never renumbered; new equations continue the global numbering tracked in the Equation Index.",
    brief: [
      "Extend by appending. New techniques and derivations go at the end of the relevant file, with a version bump and a one-line entry here.",
      "Section and equation numbers are global and never change. §3.3 lives in the hierarchy file even though §3.2 and §3.4 are elsewhere.",
      "Equations are plain ASCII so they can be typed straight into a manuscript. The v1.3 entry carries the legacy symbol mapping.",
    ],
    callouts: {},
  },
};
