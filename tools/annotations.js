/*
  tools/annotations.js — the site's learning layer.

  The Codex text itself is generated from codex/*.md by tools/build.js.
  This file holds the hand-written material that sits around it on each
  page so the system can be learned in order rather than only looked up:

    lede        one sentence under the title
    prereq      "Before you read this": what to have read, with links
    outcomes    "What you will be able to do": the page's payoff
    brief       "Key ideas": the summary, three to six bullets
    callouts    notes pinned to section anchors — "In plain terms" for a
                hard passage, "Going deeper" for an elaboration with links
                to outside resources, "Try it" for the Workbench
    background  "Background from real physics and mathematics": outside
                links, each with a note saying what to take from it

  Keys are the site route; callout keys are "start:<id>" (right after the
  heading) or "end:<id>" (at the end of that section). Section ids are
  "sec-3-5" for §3.5; equation ids are "eq-4-7" for Eq. 4.7.

  The Codex is fiction. Every outside link points at the real idea an
  invented one is modelled on; the notes say what carries over and what
  does not. Keep it that way: a link should make the system easier to
  learn, never imply it is real physics.
*/
"use strict";

const plain = (title, body) => '<aside class="callout plain"><p class="co-h">' + title + "</p>" + body + "</aside>";
const deeper = (title, body) => '<aside class="callout deeper"><p class="co-h">Going deeper · ' + title + "</p>" + body + "</aside>";
const tryit = (body, href) => '<aside class="callout try"><p class="co-h">Try it in the Workbench</p><p>' + body + ' <a href="' + href + '">Open the Workbench →</a></p></aside>';
const ext = (href, label) => '<a href="' + href + '" target="_blank" rel="noopener">' + label + "</a>";
const W = (page, label) => ext("https://en.wikipedia.org/wiki/" + page, label);

module.exports = {
  /* ───────── Foundations ───────── */
  "foundations": {
    lede: "Why the system works the way it does: aether as a hidden layer beneath the four forces, the ripple that carries a casting, the three channels it can push through, and the one channel that is different in kind.",
    prereq: [
      { label: "Nothing from the Codex. This is the first page.", note: "" },
      { label: "It helps to know that physics describes the world as fields (electric, magnetic, gravitational) that fill space and carry forces.", href: "https://en.wikipedia.org/wiki/Field_(physics)", note: "five minutes on Wikipedia is enough" },
    ],
    outcomes: [
      "Explain, in one breath, what a caster actually does and why nobody ever sees aether.",
      "Name the three channels a casting can use and say which tiers of the Hierarchy live in each.",
      "Tell a fizzle from a backlash, and say which one is dangerous and why.",
      "Explain why bending spacetime is harder <em>in kind</em>, not just in degree, than lighting a fire.",
      "Describe a caster with the three axes: comprehension, fidelity, practice depth.",
    ],
    brief: [
      "Aether is a separate field <em>beneath</em> electromagnetism, the weak and strong forces, and gravity. Nobody ever sees aether; they see one of those four fields wearing a shape it would not have taken on its own.",
      "A casting is a <strong>ripple</strong>: the caster disturbs the aether layer, the disturbance spreads, and it pushes an upper field through one of exactly three channels: gauge (the forces), quark (matter), or metric (spacetime).",
      "There is <strong>no mana</strong>. The ambient field <code class=\"sym\" data-sym=\"Ae_0\">Ae_0</code> is never spent; only the ripple <code class=\"sym\" data-sym=\"dAe\">dAe</code> does anything.",
      "Two kinds of failure: a <strong>fizzle</strong> (the ripple was too weak, nothing happens, no harm) and a <strong>backlash</strong> (the ripple was fine but aimed through a channel the caster never actually solved; the mismatch reflects back into the caster).",
      "The metric channel is different: bending spacetime changes the medium the ripple is travelling through, mid-cast. That single fact is why the top half of the Power Hierarchy is so much harder than the bottom half.",
      "Three independent axes describe any caster: <strong>comprehension</strong> (the ceiling), <strong>fidelity</strong> (how cleanly this casting was executed) and <strong>practice depth</strong> (whether a technique can be cast with no glyph or gesture).",
    ],
    callouts: {
      "end:sec-1-1": plain("In plain terms", "<p>The aether field is a still pond that never runs dry. A caster taps its surface, and the tap spreads as a ripple. Everything a spell ever does is downstream of one well-shaped tap. Notice what is <em>not</em> in this equation: no reservoir, no cost, no fuel. That absence is deliberate, and the rest of the system is built on it.</p>") +
        deeper("why the split into a background and a ripple matters", "<p>Splitting a field into a constant background plus a small disturbance is the standard first move in real physics: it is how sound is treated as a small pressure ripple on still air, and how the Higgs field is treated as a constant value everywhere plus small excitations. The point of the move is that the background never appears in any equation of motion, only the disturbance does. That is exactly the property the Codex wants: " + W("Higgs_mechanism", "the Higgs field") + " is present everywhere in equal measure and is not used up by anything that couples to it, and Eq. 1.1 gives aether the same character. When you meet <code>Ae_local</code> in the technique pages, it is this <code>dAe</code>, measured at the working site.</p>"),
      "end:sec-1-2": plain("In plain terms", "<p>The tap is <code class=\"sym\" data-sym=\"J_cast\">J_cast</code>; the ripple is <code class=\"sym\" data-sym=\"dAe\">dAe</code>; the propagator <code class=\"sym\" data-sym=\"G\">G</code> decides how far and how fast the ripple travels through the surrounding geometry. A sloppy tap makes a weak ripple no matter how much theory the caster knows. That is fidelity, made physical.</p>") +
        deeper("what a propagator is", "<p>Eq. 1.2 has the shape of a real tool called a " + W("Green%27s_function", "Green's function") + " (physicists say " + W("Propagator", "propagator") + "): a function that answers the question <em>if I poke the field here and now, how much of the poke arrives there and then?</em> You then add up the effect of every poke to get the whole disturbance; that is what the integral over <code>x'</code> does. Two things to carry forward: the propagator depends on the medium, and the answer is a sum over every source point, not just the one the caster is standing on. The first fact becomes §1.4; the second is why the Overlay Fold's difficulty (§4.1) grows with the distance in geometry between origin and destination.</p>"),
      "end:sec-1-3": plain("In plain terms", "<p>A ripple can push on reality through exactly three doors: the <strong>gauge</strong> door (light, heat, lightning, weight, cohesion, decay), the <strong>quark</strong> door (what a thing is made of), and the <strong>metric</strong> door (the shape of space and time). Each door needs its own key, a solved piece of mathematics. A caster who guesses at a key is not opening the door slightly. They are forcing a lock, and the lock forces back. That is the difference between a fizzle and a backlash.</p>") +
        deeper("reading the three lines of Eq. 1.3", "<p>Each line says <em>a distortion of an upper field equals a coupling strength times the ripple</em>. The first two are linear: double the ripple, double the distortion, and the coupling (<code>k_f</code>, <code>c_M</code>) is just a number. The third line is not: <code>Xi(Ae, g)</code> is a function of the metric itself, so its strength changes with what it acts on. Keep that asymmetry in mind and §1.4 will read as an obvious consequence rather than a new rule. If you want the real-world flavour of the first line, " + W("Linear_response_function", "linear response") + " is the physics term for \"small push, proportional answer\".</p>"),
      "end:sec-1-4": plain("In plain terms", "<p>Bending space is like repainting the floor you are standing on: every stroke changes the surface the next stroke has to land on. The other two channels hold still while you work. This one does not, and that single fact is why the entire upper half of the Power Hierarchy is devoted to just this door.</p>") +
        deeper("self-dependence in real physics", "<p>The real counterpart is " + W("Back-reaction", "back-reaction") + ": in general relativity the gravitational field is not a fixed stage, because the energy of the field itself curves spacetime, so Einstein's equations are non-linear and have to be solved self-consistently. That is why exact solutions are rare and why physicists reach for either " + W("Linearized_gravity", "linearised gravity") + " (small departures from flat space, the Warden's strategy in Eq. 3.1f) or a handful of exact solutions valid in a bounded, symmetric situation (the Sovereign's strategy in Eq. 3.1g). The Codex's two ways of touching the metric are the same two ways physicists have.</p>"),
      "end:sec-2": tryit("The three axes are the inputs of every calculation on the Workbench: what is solved sets the ceiling, fidelity scales the result, and practice depth decides whether an unassisted casting resolves at all.", "#/workbench?mode=fidelity"),
    },
    background: [
      { label: "Field (physics)", href: "https://en.wikipedia.org/wiki/Field_(physics)", note: "what it means for something to be a field rather than a substance; the Codex's aether is a field in exactly this sense." },
      { label: "Fundamental interaction", href: "https://en.wikipedia.org/wiki/Fundamental_interaction", note: "the four forces the upper layer is made of, and why gravity is the odd one out in real physics too." },
      { label: "Propagator", href: "https://en.wikipedia.org/wiki/Propagator", note: "the real object behind G in Eq. 1.2; read the first two paragraphs only." },
      { label: "Higgs mechanism", href: "https://en.wikipedia.org/wiki/Higgs_mechanism", note: "the model for an ambient field that is everywhere, never depleted, and only noticed through what couples to it (§3.5 makes this comparison explicitly)." },
      { label: "Back-reaction", href: "https://en.wikipedia.org/wiki/Back-reaction", note: "the real name for the metric channel's self-dependence in §1.4." },
      { label: "Feynman Lectures, Vol. II, ch. 1: Electromagnetism", href: "https://www.feynmanlectures.caltech.edu/II_01.html", note: "the friendliest introduction to thinking in fields; the first two sections are enough." },
    ],
  },

  /* ───────── Grand Equation ───────── */
  "grand-equation": {
    lede: "The formal core. One path integral selects which configuration of reality becomes real, and everything a caster does is a claim about which pieces of it they have solved and how faithfully they can execute them.",
    prereq: [
      { label: "Foundations, §1.1–§1.3", href: "#/foundations#sec-1-1", note: "you need the ripple, the three channels, and the fizzle/backlash distinction." },
      { label: "The idea of an equation you never solve outright but only solve pieces of.", note: "that is the whole shape of this page." },
    ],
    outcomes: [
      "Read Eq. 3.1 top-down and say what each of its five pieces is responsible for.",
      "Explain what the comprehension boundary <code class=\"sym\" data-sym=\"dM\">dM</code> is and why nothing outside it can ever happen.",
      "State why the whole equation can never be solved, and why that is a property of the mathematics rather than a rule.",
      "Compute an effective output from an ideal one and a fidelity, and say when a casting fizzles instead.",
      "Say what practice depth buys a caster, what simulation buys, and the one thing simulation can never certify.",
    ],
    brief: [
      "The Grand Equation is a stack of named pieces: a path integral (Eq. 3.1) over an action (3.1a) built from one density (3.1b), which is the sum of a <strong>gauge</strong> term (3.1c), a <strong>quark</strong> term (3.1d), and the aether-to-spacetime coupling <code class=\"sym\" data-sym=\"Xi(Ae, g)\">Xi(Ae, g)</code>.",
      "Only configurations inside the caster's proven understanding <code class=\"sym\" data-sym=\"dM\">dM</code> are on the ballot. Nothing outside what has been solved can ever be selected.",
      "The whole integral can never be solved by a finite mind. That is the <strong>Unsolved Ceiling</strong> (§3.4): a property of the mathematics, not a rule anyone imposed.",
      "<strong>Fidelity</strong> (Eq. 3.2) scales every output between 0 and 1. Below a threshold (Eq. 3.3) a casting simply fails quietly.",
      "<strong>Unassisted invocation</strong> (Eq. 3.4) is earned per technique, not per tier: drill a term past <code class=\"sym\" data-sym=\"prac_min\">prac_min</code> and it can be cast with no glyph or cadence.",
      "<strong>Simulated invocation</strong> <code class=\"sym\" data-sym=\"Sim[...]\">Sim[...]</code> (Eq. 3.5) rehearses a casting without committing it to reality. It makes execution free to perfect. It cannot tell you your mathematics is wrong.",
    ],
    callouts: {
      "end:sec-3-1": plain("In plain terms", "<p>Of all the shapes reality could take around a caster, the one that becomes real is chosen by weighing every possibility, and only possibilities inside the caster's proven understanding are on the ballot. The stack of sub-equations just names what does the weighing: the four forces, matter, and the one place aether touches spacetime directly. Every tier of the Power Hierarchy is a claim about which of those three pieces a caster has opened, and how far.</p>") +
        deeper("how to read a path integral without the mathematics", "<p>Eq. 3.1 is modelled on the " + W("Path_integral_formulation", "path integral formulation") + " of quantum mechanics. The idea, stripped down: instead of asking which single history the world follows, you assign every possible history a weight, <code>exp(i/hbar * Action)</code>, and add them all up. Histories with wildly different actions cancel each other out; the ones that survive are the ones near the action's minimum, which is why the classical world looks so definite. The Codex keeps that structure and adds one thing physics does not have: the sum runs only over histories inside <code>dM</code>. That restriction is the whole mechanism of comprehension, and it is why every later equation can be read as \"which part of the sum has this caster opened up?\" The pieces of the action are borrowed too: a " + W("Lagrangian_(field_theory)", "Lagrangian density") + " for the forces (Eq. 3.1c has the form of the real " + W("Yang%E2%80%93Mills_theory", "Yang–Mills") + " term), and one for matter (Eq. 3.1d is the shape of the " + W("Dirac_equation", "Dirac Lagrangian") + " with a mass <em>matrix</em> instead of a mass number, which is what makes diagonalising it a meaningful task in §3.3).</p>"),
      "end:sec-3-4": deeper("why the Ceiling is a theorem, not a setting rule", "<p>The argument in §3.4 is the shape of " + W("Cantor%27s_diagonal_argument", "Cantor's diagonal argument") + ": a finite list can never enumerate an uncountable set, so a finite mind can never hold the full sum over field configurations. The Codex then stacks a second, structural obstacle on top of that for the metric channel alone (§1.4). What matters for a story is the consequence spelled out in the last paragraph: progress is <em>cumulative</em>. An order that has solved more terms hands its students a larger <code>dM</code> to start from, which is why institutions matter in this world and why stealing an archive is worth more than stealing a caster.</p>"),
      "end:sec-3-5": plain("In plain terms", "<p>A spell's strength is its ideal strength times how cleanly you performed it, and a sloppy-enough performance simply does nothing at all. There is no overcasting and no burning extra power for extra effect: the ceiling is fixed by the mathematics, and execution only decides how close you get to it.</p>") +
        deeper("the overlap in Eq. 3.2", "<p><code>|&lt;phi_ideal | phi_actual&gt;|^2</code> is written in " + W("Bra%E2%80%93ket_notation", "bra–ket notation") + ", and it is the same quantity physicists call the " + W("Fidelity_of_quantum_states", "fidelity") + " of two quantum states: 1 when they are identical, 0 when they have nothing in common. So \"fidelity\" in the Codex is not a metaphor; it is the standard measure of how close one state is to another, applied to the caster's invocation versus the ideal one. Two practical consequences: it is bounded above by 1 (no overcasting), and it is a <em>squared</em> overlap, so small errors cost very little and large errors cost almost everything, which is what the kettle example is showing.</p>") +
        tryit("Set a fidelity, an anchor and a practice depth and watch a Novice working scale, then drop below the threshold and see it fizzle.", "#/workbench?mode=fidelity"),
      "end:sec-3-6": deeper("the step function, and why unassisted casting \"clicks\"", "<p><code>Step(...)</code> is the " + W("Heaviside_step_function", "Heaviside step function") + ": 0 below zero, 1 at or above it. Putting it in Eq. 3.4 is a modelling decision with story consequences. Because it is a step and not a slope, there is no such thing as \"half able\" to cast a technique unassisted. Below <code>prac_min</code> an unassisted attempt fizzles; at it, the full practised fidelity applies. That is why a character can have a single silent technique and need a glyph for everything else, and why the moment a technique clicks is a scene rather than a gradual improvement.</p>"),
      "end:sec-3-7": plain("In plain terms", "<p><code class=\"sym\" data-sym=\"Sim[...]\">Sim[...]</code> is a flight simulator. It grades your performance perfectly, and the skill it builds is real, but it grades you against the mathematics you brought, and it has no way of telling you that mathematics is wrong. Rehearsal makes execution safe to perfect. It cannot make a wrong idea safe to cast.</p>"),
    },
    background: [
      { label: "Path integral formulation", href: "https://en.wikipedia.org/wiki/Path_integral_formulation", note: "the real structure Eq. 3.1 borrows: weigh every possible history, add them up." },
      { label: "Action (physics)", href: "https://en.wikipedia.org/wiki/Action_(physics)", note: "what an action is and why nature minimises it; Eq. 3.1a is one." },
      { label: "Lagrangian (field theory)", href: "https://en.wikipedia.org/wiki/Lagrangian_(field_theory)", note: "the density L_total is summed from three of these; the article shows the real electromagnetic and Dirac examples." },
      { label: "Gauge theory", href: "https://en.wikipedia.org/wiki/Gauge_theory", note: "why the four forces share one mathematical shape, which is what lets Eq. 3.1c write them as one sum with four couplings." },
      { label: "Electromagnetic tensor", href: "https://en.wikipedia.org/wiki/Electromagnetic_tensor", note: "F_f for the electromagnetic case: the field-strength tensor is the object a Novice's ripple distorts." },
      { label: "Dirac equation", href: "https://en.wikipedia.org/wiki/Dirac_equation", note: "the shape of the quark term; the Codex replaces the mass number with the matrix M_op." },
      { label: "Fidelity of quantum states", href: "https://en.wikipedia.org/wiki/Fidelity_of_quantum_states", note: "the overlap in Eq. 3.2 is exactly this quantity." },
      { label: "Cantor's diagonal argument", href: "https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument", note: "the style of argument the Unsolved Ceiling rests on." },
    ],
  },

  /* ───────── Power Hierarchy ───────── */
  "hierarchy": {
    lede: "Who can do what, and why. Eight tiers of comprehension, three subclasses defined by holding an incomplete piece of the next tier's term, and the four paths beyond Legend that no one has ever completed.",
    prereq: [
      { label: "Foundations, §1.3 Surface Coupling", href: "#/foundations#sec-1-3", note: "the three channels are the three bands of the ladder." },
      { label: "The Grand Equation, §3.1", href: "#/grand-equation#sec-3-1", note: "each tier names a piece of Eq. 3.1b it has opened." },
      { label: "Comfort with the word \"eigenvector\", or five minutes on the link in the background list.", note: "Artisan and Master are defined by it." },
    ],
    outcomes: [
      "Place any caster on the ladder from a description of what they have solved.",
      "Explain why a careful Novice can out-cast a careless Adept.",
      "Say what makes Journeyman, Artisan and Warden \"partial\" tiers and why there is no partial rung between Sovereign and Legend.",
      "Name the four paths beyond Legend, what each reaches for, and why none can be completed.",
    ],
    brief: [
      "Tier measures <strong>comprehension only</strong>: which pieces of the Grand Equation a caster has solved. A careful Novice can out-cast a careless Adept.",
      "<strong>Novice → Journeyman → Adept</strong> live in the gauge channel: one force, then several, then several blended through a solved cross-term <code class=\"sym\" data-sym=\"Chi(f1, f2)\">Chi</code>.",
      "<strong>Artisan → Master</strong> live in the quark channel: a few solved materials (a partial eigenbasis of <code class=\"sym\" data-sym=\"M_op\">M_op</code>), then all of them.",
      "<strong>Warden → Sovereign → Legend</strong> live in the metric channel: a perturbative slice valid in proven places, then a closed form over a bounded domain, then the same closed form held at effectively permanent scale.",
      "Journeyman, Artisan and Warden are each a <em>partial</em> version of the next tier's term. Sovereign → Legend is the same mathematics at larger <code class=\"sym\" data-sym=\"R_dom\">R_dom</code> and <code class=\"sym\" data-sym=\"t_dom\">t_dom</code>, so it admits no partial rung.",
      "Beyond Legend is a fork of four paths (Tetrarch, Demiurge, Cosmographer, Communion). Each can be approached forever and completed never.",
    ],
    callouts: {
      "start:sec-3-3": plain("How to read the ladder", "<p>The table below is a map of which of the three doors from §1.3 a caster has opened, and how far. The first three rungs live entirely in the forces door, the next two in the matter door, and the last three in the space-time door. A higher tier never means a bigger reserve of power. It means a genuinely new piece of solved mathematics that lower tiers simply do not have. Each row's \"what is solved\" column names the equation that defines it; follow the links to the technique page for the rung.</p>"),
      "end:sec-3-3": deeper("eigenvectors, and what \"diagonalising M_op\" means", "<p>Eq. 3.1d makes mass a <em>matrix</em>, <code>M_op</code>, rather than a number. A matrix mixes things together; its " + W("Eigenvalues_and_eigenvectors", "eigenvectors") + " are the special directions it does <em>not</em> mix, and the eigenvalue <code>lam_i</code> is how strongly it acts along each. To " + W("Diagonalizable_matrix", "diagonalise") + " a matrix is to find all of those directions, after which the matrix is just a list of numbers and every question about it is easy. The Codex turns that into a career: each material is one eigenvector, an Artisan has found a few (Eq. 3.1e), a Master has found them all (Eq. 4.18). The reason an Artisan cannot \"partly\" do bronze from iron is that an eigenvector is either in the solved set or it is not; there is no nearby eigenvector, only a different one.</p><p>The Warden's <code>eps</code> in Eq. 3.1f comes from " + W("Perturbation_theory", "perturbation theory") + ": write the hard answer as an easy answer plus a small correction, and drop everything smaller than the correction. It works only while the correction really is small, which is the entire content of \"already-proven special cases\".</p>"),
      "end:h-the-ascent-beyond-legend": deeper("the four paths against real physics", "<p>Three of the four have a direct model. The Tetrarch Path is a " + W("Grand_Unified_Theory", "grand unified theory") + ": one coupling in place of several; real physics has candidates and no confirmed one. The Demiurge Path asks for the rule that generates the mass matrix's eigenvectors rather than a list of them, which is the still-open question of why particles have the masses they do. The Cosmographer Path is an exact metric solution with no boundary, which is forbidden by §1.4 for the same reason exact solutions in relativity are rare. The Communion Path has no physics model at all: it targets <code>dM</code>, the caster's own comprehension boundary, and is modelled on the " + W("Union_(set_theory)", "union of sets") + ". Its horror is that the sets being joined are minds.</p>"),
    },
    background: [
      { label: "Eigenvalues and eigenvectors", href: "https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors", note: "the one piece of linear algebra the quark channel is built on; the introduction and the pictures are enough." },
      { label: "Diagonalizable matrix", href: "https://en.wikipedia.org/wiki/Diagonalizable_matrix", note: "what \"full eigenbasis\" (Master) versus \"partial diagonalisation\" (Artisan) means." },
      { label: "Perturbation theory", href: "https://en.wikipedia.org/wiki/Perturbation_theory", note: "the Warden's method in Eq. 3.1f, and why it only works close to where it was expanded." },
      { label: "Grand Unified Theory", href: "https://en.wikipedia.org/wiki/Grand_Unified_Theory", note: "the real analogue of the Tetrarch Path." },
      { label: "Mass generation", href: "https://en.wikipedia.org/wiki/Mass_generation", note: "the real open question behind the Demiurge Path: where do the entries of the mass matrix come from?" },
    ],
  },

  /* ───────── Novice ───────── */
  "techniques/novice": {
    lede: "Where casting begins: one solved force coupling, in closed form, with no combination and no metric involvement. The page also walks the full ripple-to-result chain once, so every later equation can be read as shorthand for it.",
    prereq: [
      { label: "Foundations, §1.2–§1.3", href: "#/foundations#sec-1-2", note: "the worked chain on this page is those two sections applied to a kettle." },
      { label: "The Fidelity Principle, §3.5", href: "#/grand-equation#sec-3-5", note: "every equation here carries a Fid." },
      { label: "The Hierarchy's Novice row", href: "#/hierarchy#sec-3-3", note: "" },
    ],
    outcomes: [
      "Trace a casting from tap to result through Eq. 1.2, Eq. 1.3 and Eq. 3.2 without skipping a step.",
      "Write down the Novice equation for any of the four forces and say what each symbol is.",
      "Explain why the electromagnetic working is taught first and why the weak-force one is easy to underestimate.",
      "Explain why lifting a feather and holding a singularity both \"trace back to gravity\" yet sit at opposite ends of the ladder.",
    ],
    brief: [
      "Every Novice technique uses exactly <strong>one</strong> <code class=\"sym\" data-sym=\"k_f\">k_f</code> term from Eq. 3.1c.",
      "Four worked examples, one per force: heat (EM, Eq. 4.0a), lift (gravity, 4.0b), cohesion (strong, 4.0c) and decay (weak, 4.0d, defined in the Directory), plus a passive read (Ripple Sense, 4.0e).",
      "The output always scales linearly with fidelity. The worst failure at this tier is lukewarm water.",
      "Lifting a pebble and binding a singularity both trace back to gravity. One is a single closed-form coupling; the other is a partial solution of an entirely different term.",
    ],
    callouts: {
      "end:sec-4-0": plain("In plain terms", "<p>The five entries here are one trick pointed at four different forces, plus a listening version of the first: concentrate a ripple where you want it, and let a single solved coupling do the rest. The electromagnetic one is taught first because its worst failure is lukewarm water.</p>") +
        deeper("a worked number for Eq. 4.0a", "<p>Take a litre of water (mass 1 kg, " + W("Specific_heat_capacity", "specific heat") + " 4186 J per kg per degree). Bringing it from 20 °C to the boil needs 80 × 4186 ≈ 335 kJ. If a full-fidelity casting injects 1500 W, that is about 3 minutes 45 seconds, which is roughly what a small stove flame manages, and is the calibration the Codex's own example in §3.5 implies. Halve the fidelity and the same kettle takes twice as long; nothing else changes. The Workbench uses exactly these numbers as its defaults so you can check the arithmetic yourself. Eq. 4.0d's weak-force working is different only in scale: " + W("Radioactive_decay", "decay rates") + " of the trace unstable material in ordinary matter are tiny, and <code>k_weak</code> is the smallest coupling, so the product is a faint warmth at best.</p>") +
        tryit("Load Thermal Excitation, pick a force, set a fidelity and a mass of water, and read off the heating rate. Then export the result as a Directory-style entry.", "#/workbench?mode=novice"),
    },
    background: [
      { label: "Specific heat capacity", href: "https://en.wikipedia.org/wiki/Specific_heat_capacity", note: "the c_p in Eq. 4.0a; the table of values lets you try substances other than water." },
      { label: "Binding energy", href: "https://en.wikipedia.org/wiki/Binding_energy", note: "the E_bind that Eq. 4.0c nudges; the Codex uses it loosely for how strongly a material holds together." },
      { label: "Radioactive decay", href: "https://en.wikipedia.org/wiki/Radioactive_decay", note: "Gamma_0 in Eq. 4.0d is a decay constant; the article explains why the number is tiny for ordinary matter." },
      { label: "Weight", href: "https://en.wikipedia.org/wiki/Weight", note: "m_obj × g_local is weight; Eq. 4.0b cancels a fraction of it." },
    ],
  },

  /* ───────── Journeyman ───────── */
  "techniques/journeyman": {
    lede: "Two or more solved forces, held one at a time. The tier is defined by an absence: no cross-term, so no blending, only switching, and a dead time between windows.",
    prereq: [
      { label: "Novice Techniques, §4.0", href: "#/techniques/novice#sec-4-0", note: "the X_1 and X_2 in Eq. 4.13 are Novice equations." },
      { label: "Unassisted Invocation, §3.6", href: "#/grand-equation#sec-3-6", note: "the switching cost is the time spent re-inscribing." },
    ],
    outcomes: [
      "Write a Journeyman working as two windows and a gap, and compute how much of it is live.",
      "Explain why a Journeyman can never do a Storm-Step no matter how fast they switch.",
      "Say what the limit tau_switch → 0 actually is (the Adept transition), and why.",
    ],
    brief: [
      "A Journeyman holds two or more closed-form <code class=\"sym\" data-sym=\"k_f\">k_f</code> terms, each a Novice equation in its own right.",
      "Output is a sum of <strong>non-overlapping</strong> windows (Eq. 4.13). At no instant are both channels producing.",
      "<code class=\"sym\" data-sym=\"tau_switch\">tau_switch</code> is the dead time between windows: real cost, shrinks with drill, never reaches zero.",
      "A true zero-gap alternation is not a fast Journeyman. It is the Adept transition itself.",
    ],
    callouts: {
      "end:sec-4-5": plain("In plain terms", "<p>A Journeyman knows two spells but has, in effect, one pair of hands: each casting must be fully released before the next can begin, and the fumble between them is where things go wrong under pressure. Practice shortens the fumble. Only genuinely new mathematics, the Adept's cross-term, removes it.</p>") +
        deeper("what the window functions are doing", "<p><code>Win_1(t)</code> and <code>Win_2(t)</code> are " + W("Indicator_function", "indicator functions") + ": 1 while a technique is running, 0 otherwise. The constraint <code>Win_1 · Win_2 = 0</code> is the compact way to say the two are never 1 at the same moment. If you have met a " + W("Duty_cycle", "duty cycle") + " in electronics, that is the quantity the Workbench reports as \"live output\": the fraction of the working during which anything is happening at all.</p>") +
        tryit("Lay two Novice castings on a timeline with a switching gap and see how much of the working time is dead.", "#/workbench?mode=journeyman"),
    },
    background: [
      { label: "Indicator function", href: "https://en.wikipedia.org/wiki/Indicator_function", note: "what Win_1(t) and Win_2(t) are." },
      { label: "Duty cycle", href: "https://en.wikipedia.org/wiki/Duty_cycle", note: "the live fraction of a switched working, in engineering terms." },
    ],
  },

  /* ───────── Adept ───────── */
  "techniques/adept": {
    lede: "One ripple, two forces. The Adept has solved how a single disturbance can satisfy two gauge channels at once, and pays for it with a fidelity penalty that enters squared.",
    prereq: [
      { label: "Journeyman Techniques, §4.5", href: "#/techniques/journeyman#sec-4-5", note: "Adept is defined as the removal of the Journeyman's switching cost for one pair." },
      { label: "The Fidelity Principle, §3.5", href: "#/grand-equation#sec-3-5", note: "you need to know why Fid is bounded by 1 to see why squaring it hurts." },
    ],
    outcomes: [
      "Explain what Chi(f1, f2) measures and why Chi = 0 is exactly the Journeyman condition.",
      "Compute a blended output from two couplings, a cross-coupling and a fidelity.",
      "Explain, from the mechanism, why fidelity enters squared rather than linearly.",
      "List the six force pairs and say why there can never be a seventh.",
    ],
    brief: [
      "<code class=\"sym\" data-sym=\"Chi(f1, f2)\">Chi(f1, f2)</code> (Eq. 4.14) measures how coherently one ripple can serve two channels. Zero is the Journeyman condition; one is a limit no technique reaches.",
      "Combined output (Eq. 4.15) is the product of both couplings, times <code class=\"sym\" data-sym=\"Chi(f1, f2)\">Chi</code>, times <strong>fidelity squared</strong>.",
      "Fidelity is squared because both channels read the same ripple: one wobble is taxed twice.",
      "Four forces make exactly six unordered pairs, all six already catalogued (AD-01 to AD-06). Tier is a per-pair fact: a caster can be Adept for one pair and Journeyman for another.",
    ],
    callouts: {
      "end:sec-4-6": plain("In plain terms", "<p>An Adept has solved how two forces can share one ripple. Four forces can only be paired six ways, so the entire Adept foundation fits in six cells. The price of sharing is the squared fidelity: one shared ripple means one shared point of failure.</p>") +
        deeper("why six, and what an overlap is", "<p>Six is " + W("Combination", "4 choose 2") + ": the number of ways to pick two things from four when order does not matter. The Codex leans on that small number hard, because it makes the Adept tier finite and auditable: a caster's \"pair-sheet\" (§5.1) lists at most six entries. <code>Overlap[...]</code> in Eq. 4.14 is the same kind of quantity as the fidelity overlap in Eq. 3.2, an " + W("Inner_product_space", "inner product") + " between two shapes, here the two distortions one ripple is being asked to produce. That is why its range is 0 to 1 and why it behaves like a coherence: two channels either agree on the ripple's shape or they fight over it.</p>") +
        tryit("Compare a blend against the same two forces cast in sequence, and watch the gap widen as fidelity drops.", "#/workbench?mode=adept"),
    },
    background: [
      { label: "Combination", href: "https://en.wikipedia.org/wiki/Combination", note: "why four forces give exactly six pairs." },
      { label: "Coherence (physics)", href: "https://en.wikipedia.org/wiki/Coherence_(physics)", note: "the flavour of what Chi measures: how well two things stay in step." },
    ],
  },

  /* ───────── Artisan ───────── */
  "techniques/artisan": {
    lede: "The first step into matter. An Artisan has solved a few specific eigenvectors of the mass operator, one material each, and everything outside that set is not weaker but unmodelled.",
    prereq: [
      { label: "The Hierarchy, Eq. 3.1e and the eigenvector note", href: "#/hierarchy#eq-3-1e", note: "S, the solved set, is defined there." },
      { label: "Foundations, §1.3 on fizzle versus backlash", href: "#/foundations#sec-1-3", note: "Eq. 4.17 is that distinction with numbers." },
    ],
    outcomes: [
      "Write the Artisan's working equation and see that it is the Novice heating equation in a different channel.",
      "Predict what happens when an Artisan of Iron reaches for bronze, and compute how badly.",
      "Explain why Eq. 4.17 having the same shape as Eq. 4.7 proves the backlash mechanism is universal.",
    ],
    brief: [
      "An Artisan's solved set <code class=\"sym\" data-sym=\"S\">S</code> is a small, finite subset of <code class=\"sym\" data-sym=\"M_op\">M_op</code>'s eigenvectors (Eq. 3.1e). Careers pass with two or three.",
      "Eq. 4.16 is the quark-sector twin of the Novice heating equation: effect = eigenvalue × fidelity × ripple.",
      "Eq. 4.17 is what happens when a caster reasons by resemblance (bronze from iron): the guessed and true eigenvalues differ, and the difference integrates over the working volume as backlash.",
      "That backlash integral has exactly the same shape as the Overlay Fold's (Eq. 4.7). The mechanism is universal, not technique-specific.",
    ],
    callouts: {
      "end:sec-4-7": plain("In plain terms", "<p>Matter, in this system, is a locked instrument with a finite number of strings. An Artisan has learned to play a few specific strings perfectly: salt, iron, bone. A material whose string they never learned is not harder to play; it is not on their instrument at all. Reaching for it anyway, on the strength of a resemblance, is the backlash equation waiting to fire.</p>") +
        deeper("why resemblance is the trap", "<p>Bronze is mostly copper, and iron and steel look alike, but a " + W("Crystal_structure", "crystal structure") + " is a discrete thing: the lattice is one arrangement or another, not a blend, and in the Codex each arrangement is its own eigenvector with its own <code>lam_i</code>. Eq. 4.17 is the cost of " + W("Extrapolation", "extrapolating") + " from a solved case to an unsolved one: the error is the <em>square</em> of the eigenvalue mistake, integrated over everything the caster was working on, so a small misjudgement on a large casting can still hurt badly. Notice that fidelity does not appear in Eq. 4.17 at all. A perfectly executed wrong guess still backlashes; that is the definition of a comprehension failure.</p>") +
        tryit("Pick a material inside the solved set and see the effect; pick one outside it and see the backlash energy instead.", "#/workbench?mode=artisan"),
    },
    background: [
      { label: "Crystal structure", href: "https://en.wikipedia.org/wiki/Crystal_structure", note: "why materials are discrete kinds rather than a continuum, which is what makes \"one eigenvector per material\" a sensible fiction." },
      { label: "Extrapolation", href: "https://en.wikipedia.org/wiki/Extrapolation", note: "the general reason Eq. 4.17 exists." },
    ],
  },

  /* ───────── Master ───────── */
  "techniques/master": {
    lede: "Nothing new is learned at Master tier. The solved set closes over the whole eigenbasis, and transmutation, whole-body healing and decay control arrive together because they were always one equation.",
    prereq: [
      { label: "Artisan Techniques, §4.7", href: "#/techniques/artisan#sec-4-7", note: "Master is the Artisan's S with no boundary." },
      { label: "Novice Eq. 4.0c and Eq. 4.0d", href: "#/techniques/novice#eq-4-0c", note: "Eq. 4.19 is both of them generalised at once." },
    ],
    outcomes: [
      "State what a Master has that an Artisan lacks, and why it is \"nothing new\".",
      "Explain what U_transmute does in Eq. 4.18 by analogy with U_op in the Overlay Fold.",
      "Use the direction switch s in Eq. 4.19 to describe healing, hastened decay and arrested decay as one equation.",
    ],
    brief: [
      "A Master's <code class=\"sym\" data-sym=\"S\">S</code> is the complete eigenbasis of <code class=\"sym\" data-sym=\"M_op\">M_op</code>. No new operator, just no boundary.",
      "Full transmutation (Eq. 4.18) rewrites which material a quantity of matter <em>is</em>, via a unitary over the completed basis.",
      "Universal binding and decay control (Eq. 4.19) generalises the Novice cohesion boost and decay nudge to any material, with a direction switch <code class=\"sym\" data-sym=\"s\">s</code> = ±1.",
      "Healing, hastened decay, arrested decay and reinforcement are the same equation pointed at different targets.",
    ],
    callouts: {
      "end:sec-4-8": plain("In plain terms", "<p>An Artisan knows some of the strings; a Master has finished learning all of them. Nothing new was added to the instrument, which is exactly why transmutation, whole-body healing and decay control arrive together at this tier: they were always one skill, waiting behind the same complete catalogue.</p>") +
        deeper("what a unitary operator is, and why the Codex keeps using them", "<p>A " + W("Unitary_operator", "unitary operator") + " is a transformation that moves a state to another state without losing or creating anything: lengths and overlaps are preserved, and it can always be undone. Physics uses unitaries for every change that conserves probability. The Codex uses them at both ends of the ladder for the same reason: <code>U_op</code> in Eq. 4.1 moves a caster between places, <code>U_transmute</code> in Eq. 4.18 moves matter between identities, and in both cases nothing is created or destroyed, only re-expressed. Real " + W("Nuclear_transmutation", "transmutation") + " changes one element into another by changing the nucleus; the Codex's version changes which solution of <code>M_op</code> a body of matter is, which is a broader and more literary claim, but the conservation flavour is borrowed honestly.</p>") +
        tryit("Set the direction switch and the matter coupling and read off the boosted or arrested rate for any material.", "#/workbench?mode=master"),
    },
    background: [
      { label: "Unitary operator", href: "https://en.wikipedia.org/wiki/Unitary_operator", note: "U_transmute and U_op are both this kind of object." },
      { label: "Nuclear transmutation", href: "https://en.wikipedia.org/wiki/Nuclear_transmutation", note: "the real thing Eq. 4.18 is named after, and how much narrower it is." },
    ],
  },

  /* ───────── Warden ───────── */
  "techniques/warden": {
    lede: "The first metric-sector technique below Sovereign: a small, provable nudge to curvature, valid only inside a geometry that has already been tested, and lethal to extrapolate.",
    prereq: [
      { label: "Foundations, §1.4", href: "#/foundations#sec-1-4", note: "why the metric channel moves under the caster." },
      { label: "The Hierarchy, Eq. 3.1f", href: "#/hierarchy#eq-3-1f", note: "the perturbative expansion this page applies." },
      { label: "Eq. 4.8's Bump function", href: "#/techniques/sovereign#eq-4-8", note: "Eq. 4.20 reuses it; the Sovereign page defines it." },
    ],
    outcomes: [
      "Describe a Warden technique as a term, a size, and a place, and say which of the three the proof is tied to.",
      "Say what eps_valid is and why it is a demonstrated number rather than a theoretical one.",
      "Explain why pushing eps past the tested limit is a backlash rather than a bigger effect.",
    ],
    brief: [
      "A Warden has solved the first two terms of a perturbation series around flat space (Eq. 3.1f). The higher terms are simply unknown.",
      "Eq. 4.20 confines the effect to a named, previously validated geometry <code class=\"sym\" data-sym=\"R_proven\">R_proven</code>: a doorway, a stair, a mapped stretch of road.",
      "Eq. 4.21: push the departure from flat space <code class=\"sym\" data-sym=\"eps\">eps</code> past what that site was ever tested to, and the truncated series stops tracking reality. The gap reflects back as backlash.",
      "Warden discipline is bookkeeping: which geometries are proven, to what <code class=\"sym\" data-sym=\"eps_valid(R_proven)\">eps_valid</code>, and refusing to reuse a result somewhere merely similar.",
    ],
    callouts: {
      "end:sec-4-9": plain("In plain terms", "<p>A Warden's spacetime mathematics is an approximation that has been tested in a few specific places, like a rope bridge certified for one particular canyon. Inside those places it is genuinely, provably safe. Carrying the same rope bridge to a similar-looking canyon, because it looks like it should hold, is how Wardens die.</p>") +
        deeper("truncated series and where they stop working", "<p>Eq. 3.1f writes the metric coupling as <code>Xi_0 + eps·Xi_1 + O(eps^2)</code>, the first two terms of a " + W("Taylor_series", "power series") + ". A truncated series is accurate only while the dropped terms are small, and how small \"small\" has to be is not obvious from the series itself; it has to be measured. That is <code>eps_valid(R_proven)</code>: not a " + W("Radius_of_convergence", "radius of convergence") + " computed on paper, but the largest departure a particular site has been shown to tolerate. The same logic is why " + W("Linearized_gravity", "linearised gravity") + " predicts gravitational waves beautifully and says nothing useful about the inside of a black hole. <code>Bump(r, R_proven)</code> is a " + W("Bump_function", "bump function") + ": one inside the region, zero outside, smooth in between, so the effect has a definite edge without a discontinuity.</p>") +
        tryit("Dial the departure from flat space toward and past the proven limit, and watch the effect give way to backlash.", "#/workbench?mode=warden"),
    },
    background: [
      { label: "Perturbation theory", href: "https://en.wikipedia.org/wiki/Perturbation_theory", note: "the method; the introduction explains \"small parameter\" and why the series is usually cut short." },
      { label: "Linearized gravity", href: "https://en.wikipedia.org/wiki/Linearized_gravity", note: "the real version of a first-order metric perturbation and the situations it is valid in." },
      { label: "Bump function", href: "https://en.wikipedia.org/wiki/Bump_function", note: "the shape of Bump(r, R): a smooth switch that is exactly zero outside a region." },
    ],
  },

  /* ───────── Sovereign ───────── */
  "techniques/sovereign": {
    lede: "The two canonical Sovereign workings, derived in full: the Overlay Fold, which relocates a caster by arguing two points are the same, and the Bound Singularity, a caster-made gravity well sealed inside its own horizon.",
    prereq: [
      { label: "Foundations, §1.4", href: "#/foundations#sec-1-4", note: "both workings are exercises in the metric channel's self-dependence." },
      { label: "The Hierarchy, Eq. 3.1g", href: "#/hierarchy#eq-3-1g", note: "the bounded domain a Sovereign's solution is valid in." },
      { label: "Fidelity and unassisted invocation, §3.5–§3.6", href: "#/grand-equation#sec-3-5", note: "release timing and live adjustment of the three dials depend on them." },
      { label: "A tolerance for bra–ket notation; the Grand Equation page's \"Going deeper\" on Eq. 3.2 covers what you need.", href: "#/grand-equation#eq-3-2", note: "" },
    ],
    outcomes: [
      "Describe a fold as a superposition that drains from A to B, and predict the outcome from when it is released.",
      "Compute the decoherence rate from mismatch, knowledge and interference, and say which of the three the caster controls in advance.",
      "Name the three components of a Bound Singularity and say what each fails as.",
      "Explain why the horizon condition, not the cancellation, is what makes the containment real.",
    ],
    brief: [
      "The <strong>Overlay Fold</strong> (Eq. 4.1–4.2) identifies two points conformally; no mass moves and no momentum carries through.",
      "While the fold is held the caster is a superposition of <em>here</em> and <em>there</em> (Eq. 4.3–4.4). Probability drains from A to B as the fold is held.",
      "Release timing decides everything (Eq. 4.5–4.6): too early is a harmless fizzle, mid-oscillation is a bleed, and a spike in decoherence is a backlash collapse whose energy (Eq. 4.7) scales with how badly the destination was known.",
      "The <strong>Bound Singularity</strong> (Eq. 4.8–4.12) is a well, a counter-curvature shell that cancels it outside, and a lapse tuning that makes the shell a real horizon.",
      "Two distinct disasters: <strong>shell rupture</strong> (fidelity failure, the well snaps outward) and <strong>horizon migration</strong> (the shell reads clean but the interior was never causally sealed).",
    ],
    callouts: {
      "end:sec-4-1": deeper("conformal factors and stress-energy", "<p>Two metrics are <em>conformally</em> related when one is the other scaled by a position-dependent factor: angles agree, sizes do not. That is what <code>Om2(x)</code> absorbs in Eq. 4.1, and it is why a fold between similar places is easier than one between a valley and a summit: the scale factor between them is closer to 1. Mapmakers meet the same idea as a " + W("Conformal_map", "conformal map") + ". The " + W("Stress%E2%80%93energy_tensor", "stress–energy tensors") + " in Eq. 4.2 are the objects that tell spacetime how much energy and momentum are present; requiring the aether's and the body's to cancel along the path is the precise way of saying that nothing is carried through the fold.</p>"),
      "end:sec-4-2": plain("In plain terms", "<p>A Fold does not move you. It argues that here and there are briefly the same place, and lets your probability drain from one to the other while the argument holds. The argument decays as it is held, and the worse you know your destination, the faster it rots. Release while the weight of probability sits at B and you arrive; misjudge the moment and the other outcomes are all that is left.</p>") +
        deeper("the fold is a two-level quantum system", "<p>Eq. 4.3 and Eq. 4.4 are, symbol for symbol, a " + W("Two-state_quantum_system", "two-state quantum system") + " driven by a coupling: the same mathematics as a spin flipping in a magnetic field or an atom driven by a laser. The solution is a " + W("Rabi_cycle", "Rabi oscillation") + ": the probability of being at B goes as <code>sin²(U·t)</code>, rising to 1, falling back to 0, and repeating for as long as the coupling is held. That is why release timing matters so much, and why the Workbench plot for a fold is a sine wave. Eq. 4.5's exponential factor is " + W("Quantum_decoherence", "decoherence") + ": the environment (here, a badly measured destination or an interfering caster) leaks information out of the superposition and the clean oscillation dies away. Everything §4.2 says about fizzles, bleeds and collapses is a statement about where on that decaying sine wave the caster lets go.</p>") +
        tryit("Hold a fold for a chosen time against a chosen knowledge of the destination and read the arrival probability, the outcome, and the backlash energy if it collapses.", "#/workbench?mode=fold"),
      "end:sec-4-3": plain("In plain terms", "<p>The Bound Singularity is a pet black hole in a soundproof box: a well of real gravity, a shell carrying the equal-and-opposite charge that cancels every outside trace of it, and a clock trick at the boundary so that nothing inside can ever cross out in any finite outside time. The catch is §1.4 again: each of the three pieces bends the stage the other two are performing on, so they can only be validated together, never separately.</p>") +
        deeper("the three pieces against general relativity", "<p><code>Curv(g)</code> plays the part of the " + W("Einstein_tensor", "Einstein tensor") + ", the curvature that sources respond to. Eq. 4.9's argument that cancelling the enclosed \"curvature-charge\" flattens the outside is " + W("Birkhoff%27s_theorem_(relativity)", "Birkhoff's theorem") + ": outside a spherical body, gravity depends only on the total mass inside, so a shell of negative charge equal to the well's makes the exterior flat. Eq. 4.10 is the " + W("Schwarzschild_metric", "Schwarzschild") + " lapse: <code>sqrt(1 − 2GM/r)</code> is the rate at which a clock at radius <code>r</code> runs compared with one far away, and it reaches zero at the " + W("Event_horizon", "event horizon") + " <code>r = 2GM</code>. Tuning the shell so that zero lands exactly at <code>R_shell</code> is what \"causally sealed\" means. Eq. 4.11's <code>r⁻³</code> leak is a " + W("Multipole_expansion", "multipole") + " statement: a cancelled monopole leaves only the faster-fading higher terms, so a sloppy shell betrays a tidal echo rather than the well's true mass.</p>") +
        tryit("Tune the core, the shell and the enclosed aether-mass; check whether the horizon lands on the shell, and see how much field leaks for an imperfect shell.", "#/workbench?mode=singularity"),
    },
    background: [
      { label: "Two-state quantum system", href: "https://en.wikipedia.org/wiki/Two-state_quantum_system", note: "Eq. 4.3–4.4 exactly; the article's \"Rabi problem\" section is the fold." },
      { label: "Rabi cycle", href: "https://en.wikipedia.org/wiki/Rabi_cycle", note: "why probability sloshes between A and B as a sine wave while a fold is held." },
      { label: "Quantum decoherence", href: "https://en.wikipedia.org/wiki/Quantum_decoherence", note: "the G_dec of Eq. 4.6: how a superposition is destroyed by information leaking to the environment." },
      { label: "Conformal map", href: "https://en.wikipedia.org/wiki/Conformal_map", note: "the meaning of \"up to a conformal factor\" in Eq. 4.1." },
      { label: "Schwarzschild metric", href: "https://en.wikipedia.org/wiki/Schwarzschild_metric", note: "the source of the lapse in Eq. 4.10 and of the horizon condition." },
      { label: "Birkhoff's theorem", href: "https://en.wikipedia.org/wiki/Birkhoff%27s_theorem_(relativity)", note: "why cancelling the enclosed charge cancels the exterior field (Eq. 4.9)." },
      { label: "Multipole expansion", href: "https://en.wikipedia.org/wiki/Multipole_expansion", note: "why an imperfect shell leaks as r⁻³ rather than r⁻² (Eq. 4.11)." },
      { label: "ADM formalism (lapse function)", href: "https://en.wikipedia.org/wiki/ADM_formalism", note: "where the word \"lapse\" comes from; skim only." },
    ],
  },

  /* ───────── Legend ───────── */
  "techniques/legend": {
    lede: "The same mathematics as Sovereign, held for a generation instead of an afternoon. What changes is that the world drifts out from under the working, so the operative quantity becomes a maintenance interval.",
    prereq: [
      { label: "Sovereign Workings, §4.1–§4.3", href: "#/techniques/sovereign#sec-4-1", note: "nothing here is derived; every equation refers back." },
      { label: "The Hierarchy, Eq. 3.1g", href: "#/hierarchy#eq-3-1g", note: "Legend is that equation's dials turned far." },
    ],
    outcomes: [
      "Explain why Legend solves nothing new and what it adds instead.",
      "Say what t_drift and t_recert bound, and what fails if each is missed.",
      "Describe why every Legend-scale working in the Directory is an institution.",
    ],
    brief: [
      "Legend solves nothing Sovereign has not. Per Eq. 3.1g the difference is scale: <code class=\"sym\" data-sym=\"R_dom\">R_dom</code> and <code class=\"sym\" data-sym=\"t_dom\">t_dom</code> pushed to effective permanence.",
      "A standing fold (Eq. 4.22) needs its destination re-surveyed on a cadence <code class=\"sym\" data-sym=\"t_drift\">t_drift</code> before the assumed conformal factor drifts far enough to drive decoherence toward failure.",
      "A standing singularity (Eq. 4.23) needs its shell re-inscribed on an interval <code class=\"sym\" data-sym=\"t_recert\">t_recert</code> before the residual leak rises above background.",
      "A Legend is, mechanically, a Sovereign whose institution has learned to keep re-solving the same equation on schedule.",
    ],
    callouts: {
      "end:sec-4-10": plain("In plain terms", "<p>Legend-scale magic is infrastructure. The spell is the very one a Sovereign casts. What is new is that the world drifts out from under anything held for a generation, so someone must keep re-measuring and re-certifying on a schedule. Miss the schedule, and the failure is an ordinary Sovereign-tier failure, with a town inside it.</p>") +
        deeper("drift, recertification and why this is an engineering page", "<p>Anything measured once and relied on for years needs " + W("Calibration", "recalibration") + ", because the thing measured changes and the instrument ages. Eq. 4.22's <code>t_drift</code> is a re-survey interval in the sense a " + W("Surveying", "surveyor") + " would recognise: the destination's true conformal factor is re-measured before the stored value is wrong enough to matter. Eq. 4.23's <code>t_recert</code> is a " + W("Preventive_maintenance", "preventive maintenance") + " interval: re-inscribe the shell before the leak grows past the noise floor, not after. That is why the Directory's Legend entries (LG-01 onward) are named for the orders that keep them rather than the casters who founded them.</p>"),
    },
    background: [
      { label: "Calibration", href: "https://en.wikipedia.org/wiki/Calibration", note: "the general practice t_drift and t_recert are instances of." },
      { label: "Preventive maintenance", href: "https://en.wikipedia.org/wiki/Preventive_maintenance", note: "re-inscribing a shell before it fails rather than after." },
    ],
  },

  /* ───────── Ascension ───────── */
  "techniques/ascension": {
    lede: "The four paths beyond Legend cannot be finished, but they can be measured. Each fragment reduces \"how close\" to a number built only from mathematics a lower tier has already proven.",
    prereq: [
      { label: "The Hierarchy, \"The Ascent Beyond Legend\"", href: "#/hierarchy#h-the-ascent-beyond-legend", note: "the four paths are defined there; this page measures them." },
      { label: "Adept Eq. 4.14, Artisan Eq. 3.1e, Sovereign Eq. 3.1g", href: "#/techniques/adept#eq-4-14", note: "each fragment is built from one of these." },
    ],
    outcomes: [
      "Write down the closeness metric for each path and say what lower-tier quantity it is built from.",
      "Explain why a metric can approach its limit forever without the path being completed.",
      "Say which fragment can exceed 1, and why that does not make it a shortcut.",
    ],
    brief: [
      "<strong>Tetrarch</strong> (Eq. 4.24): average the six solved cross-couplings. Approaches 1; never becomes the single unified coupling.",
      "<strong>Demiurge</strong> (Eq. 4.25): count verified predictions from one proven extrapolation rule. Can grow without bound inside its family and says nothing outside it.",
      "<strong>Cosmographer</strong> (Eq. 4.26): domain achieved over a typical Legend's domain. Each increment costs more than the last, because of §1.4.",
      "<strong>Communion</strong> (Eq. 4.27): pooled comprehension over a typical Legend's. The only fragment that can exceed 1, and it measures the size of the pool, never its depth.",
    ],
    callouts: {
      "end:sec-4-11": plain("In plain terms", "<p>These are four different bets on how to keep growing once solving one term at a time runs out of road: unify the four forces into one, generalise matter itself, unbound geometry, or pool many minds' comprehension into a single boundary. Each has a meter of how far it has ever been pushed, and every meter stops short of its limit. That is not a rendering choice. The paths are real, measurable, and provably endless.</p>") +
        deeper("asymptotes and diminishing returns", "<p>Three of the four metrics behave like an " + W("Asymptote", "asymptote") + ": they get closer to a limit forever and never touch it. That is a stronger claim than \"very hard\": it says the remaining distance is never zero at any finite effort. The Cosmographer's metric is worse still, because §1.4 makes each step cost more than the last, the shape economists call " + W("Diminishing_returns", "diminishing returns") + ". Only the Communion metric has no ceiling, and the page is careful to say why that is not a loophole: a union of sets is only as deep as its deepest member.</p>"),
    },
    background: [
      { label: "Asymptote", href: "https://en.wikipedia.org/wiki/Asymptote", note: "the shape of \"approaches, never reaches\" in Eq. 4.24 and Eq. 4.26." },
      { label: "Diminishing returns", href: "https://en.wikipedia.org/wiki/Diminishing_returns", note: "the Cosmographer's cost curve." },
      { label: "Union (set theory)", href: "https://en.wikipedia.org/wiki/Union_(set_theory)", note: "what a Communion does to comprehension domains, and why it cannot exceed its members." },
    ],
  },

  /* ───────── Changelog ───────── */
  "changelog": {
    lede: "Version history and the conventions for extending the Codex. New material is appended, never renumbered; new equations continue the global numbering tracked in the Equation Index.",
    prereq: [
      { label: "Nothing. Read this when you want to add to the Codex, or to see how a piece of it came to be.", note: "" },
    ],
    outcomes: [
      "Add a technique or equation without breaking any existing cross-reference.",
      "Find the version in which a rule was introduced or corrected.",
      "Translate an older draft's Greek-letter notation into the current ASCII one (v1.3 table).",
    ],
    brief: [
      "Extend by appending. New techniques and derivations go at the end of the relevant file, with a version bump and a one-line entry here.",
      "Section and equation numbers are global and never change. §3.3 lives in the hierarchy file even though §3.2 and §3.4 are elsewhere.",
      "Equations are plain ASCII so they can be typed straight into a manuscript. The v1.3 entry carries the legacy symbol mapping.",
    ],
    callouts: {},
  },
};
