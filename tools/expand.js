#!/usr/bin/env node
/*
  tools/expand.js — writes Directory Expansion III and the §8 working forms.

    node tools/expand.js

  Deterministic (seeded): running it twice writes the same files. It reads
  codex/spell-directory.md for the founding entries and the two earlier
  expansions, then writes

    codex/spell-directory-iii.md   2,061 further named techniques, in the
                                   Directory's own format and voice, so the
                                   catalogue totals 2,500
    codex/working-equations.md     §8: one working form per technique,
                                   Eq. 8.1–8.2500, in Directory order

  Every new entry is tier-correct: a Novice entry is one delta(F_f)
  distortion or a passive read; a Journeyman entry names two Novice
  components under Eq. 4.13; an Adept entry names one of the six solved
  pairs under Eq. 4.15; an Artisan entry names one material and its
  unmodelled neighbours (Eq. 4.16–4.17); Master, Warden, Legend and
  Ascension entries follow Eq. 4.18–4.19, 4.20–4.21, 4.22–4.23 and
  4.24–4.27. A working form specialises the tier's base equation to the
  entry with a shape factor eta_<code> whose meaning the form states.
*/
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, "codex", f), "utf8");

/* ───────── deterministic randomness ───────── */
let seed = 0x5EEDA7;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ───────── the existing directory ───────── */
const DIR = read("spell-directory.md");
const EXISTING = [];
{ const re = /^\*\*\[([A-Z]+-(?:[A-Z]+-)?\d+)\] (.+?)\*\*(.*)$/gm; let m; while ((m = re.exec(DIR))) EXISTING.push({ c: m[1], n: m[2].trim(), rest: m[3] }); }
const NAMES = new Set(EXISTING.map((e) => e.n.toLowerCase()));
const CODES = new Set(EXISTING.map((e) => e.c));
const MAXN = {}; EXISTING.forEach((e) => { const p = e.c.replace(/-\d+$/, ""); const n = +e.c.match(/(\d+)$/)[1]; MAXN[p] = Math.max(MAXN[p] || 0, n); });
const MATERIALS_USED = new Set(EXISTING.filter((e) => /^AR-/.test(e.c)).map((e) => e.n.replace(/^Artisan of /, "").toLowerCase()));
const bodyOf = (code) => { const i = DIR.indexOf("**[" + code + "]"); if (i < 0) return ""; return DIR.slice(i, i + 900); };
const NOVICE_EXISTING = { EM: [], GR: [], ST: [], WK: [] };
EXISTING.forEach((e) => { const m = e.c.match(/^N-(EM|GR|ST|WK)-/); if (m) NOVICE_EXISTING[m[1]].push(e.c); });

/* ───────── vocabulary ───────── */
const V = {
  EM: { adj: ["Ember", "Lamp", "Frost", "Hearth", "Glaze", "Filament", "Kiln", "Candle", "Beacon", "Spark", "Tallow", "Amber", "Dawn", "Cinder", "Lantern", "Glass", "Furnace", "Signal", "Wick", "Coal", "Tinder", "Copper", "Winter", "Noon", "Forge", "Ash", "Quiet", "Sun", "Steady", "Bright", "Warm", "Cold", "Grey", "Still", "Long", "Low", "Slow", "Small", "Kind", "Honest"],
    noun: ["Thread", "Breath", "Hand", "Patience", "Watch", "Round", "Whisper", "Coax", "Draw", "Hold", "Glow", "Touch", "Line", "Pane", "Halo", "Bloom", "Kiss", "Tide", "Thaw", "Sleeve", "Cradle", "Hour", "Vigil", "Eye", "Palm", "Ring", "Crown", "Blush", "Cure", "Lamp", "Flicker", "Ledger", "Key", "Bell", "Road", "Word", "Turn", "Seam", "Wake", "Rest"] },
  GR: { adj: ["Plumb", "Keel", "Ballast", "Feather", "Anvil", "Wagon", "River", "Mill", "Quarry", "Ferry", "Crane", "Mason", "Quiet", "Level", "Slack", "Heavy", "Light", "Deep", "High", "Even", "Patient", "Stone", "Lead", "Cart", "Barge", "Gentle", "Long", "Steady", "Hollow", "Fair", "Low", "Kind", "Grey", "Still", "Old"],
    noun: ["Load", "Step", "Rest", "Hand", "Lift", "Fall", "Weight", "Balance", "Keel", "Cradle", "Sling", "Plumb", "Drift", "Settle", "Poise", "Hoist", "Stair", "Bridge", "Lean", "Sway", "Seat", "Carry", "Ease", "Yoke", "Pour", "Drop", "Turn", "Wake", "Road", "Ledge", "Pace", "Trust", "Measure", "Tally"] },
  ST: { adj: ["Grain", "Seam", "Rivet", "Cooper", "Fletcher", "Mason", "Oak", "Hemp", "Iron", "Clay", "Shingle", "Hull", "Keel", "Tenon", "Wheel", "Cord", "Loom", "Hard", "Sound", "Whole", "Close", "Tight", "Fair", "Patient", "Honest", "Old", "Quiet", "Slow", "Deep", "Long", "Dry", "Green", "True", "Kind"],
    noun: ["Bind", "Hold", "Weld", "Seam", "Knot", "Splice", "Edge", "Set", "Grip", "Stay", "Clench", "Peg", "Clamp", "Bond", "Weave", "Latch", "Brace", "Cleave", "Split", "Score", "Shear", "Fault", "Temper", "Proof", "Mend", "Patience", "Hand", "Word", "Ledger", "Tally", "Turn", "Rest", "Watch", "Trust"] },
  WK: { adj: ["Faint", "Ward", "Tally", "Ripe", "Orchard", "Cellar", "Cask", "Malt", "Tarnish", "Assay", "Lichen", "Quiet", "Slow", "Patient", "Grey", "Dim", "Late", "Early", "Long", "Kind", "Honest", "Small", "Old", "Autumn", "Harvest", "Ledger", "Vintner", "Tanner", "Dyer", "Salt", "Amber", "Low", "Pale", "Soft"],
    noun: ["Glow", "Watch", "Cure", "Ripening", "Count", "Rest", "Ward", "Vigil", "Ember", "Tally", "Season", "Hour", "Patience", "Hand", "Breath", "Bloom", "Mellow", "Age", "Turn", "Stay", "Hold", "Draw", "Reckoning", "Lamp", "Sleep", "Wake", "Trust", "Measure", "Word", "Round", "Thread", "Key"] }
};
const TRADES = { EM: ["cooks", "glassblowers", "lamplighters", "smiths", "brewers", "dyers", "bakers", "night-watches", "couriers", "surgeons", "printers", "fishmongers", "innkeepers", "scribes", "potters", "chandlers", "signal-crews", "launderers", "vintners", "midwives", "tinsmiths", "confectioners", "apothecaries", "ferrymen", "charcoal-burners"],
  GR: ["masons", "stevedores", "millers", "ferrymen", "quarry-hands", "coopers", "carters", "riggers", "scaffolders", "surveyors", "nurses", "gravediggers", "wheelwrights", "shepherds", "bell-ringers", "turners", "housewrights", "bargees", "hod-carriers", "ostlers", "ropewalkers", "roofers", "well-diggers", "porters"],
  ST: ["coopers", "fletchers", "shipwrights", "cordwainers", "ropewalkers", "wheelwrights", "carpenters", "sailmakers", "saddlers", "masons", "bookbinders", "thatchers", "weavers", "netmakers", "boatbuilders", "joiners", "armourers", "basketmakers", "smiths", "turners", "coachbuilders", "millwrights", "farriers", "glaziers"],
  WK: ["vintners", "cheesemongers", "tanners", "brewers", "apothecaries", "orchard-keepers", "cellarers", "archivists", "dyers", "grain-factors", "fishwives", "assayers", "herbalists", "maltsters", "curers", "gardeners", "florists", "night-watches", "lamplighters", "sextons", "hospitallers", "salt-boilers", "fowlers", "coopers"] };
const PLACES = ["a market town", "the river ports", "coaching country", "the hill parishes", "garrison towns", "the fen villages", "mining districts", "the orchard valleys", "harbour quarters", "the wool towns", "the northern marches", "cathedral cities", "the salt coast", "the timber counties", "canal country", "the lake settlements", "the dye-works quarter", "border towns", "the sheep uplands", "quarry villages"];

/* ───────── Novice effect classes: what a working form looks like, and what it means ───────── */
/* each class: out = the quantity the form solves for; form(mode, X) = ASCII lines; meaning = what eta_X encodes; mech(target) = the mechanism sentence */
const CLASSES = {
  EM: [
    { k: "warm", base: "4.0a", w: 4, targets: ["a kettle", "a bread oven", "a bathhouse cistern", "a glue-pot", "a dye vat", "a wash-copper", "a soldering iron", "a foot-warmer", "a brewing mash", "a sick-room", "a saddle blanket", "a forge's last coal", "a milk pan", "a wax pot", "a stone floor", "a bench of tools", "a nursery wall", "a wagon's iron tyre"],
      out: "dT/dt", form: (X, m) => m === "held" ? ["P_in = k_EM * Fid * Ae_local^2 * eta_" + X, "T(t_hold) = T_0 + P_in * t_hold * D_cycle / (m_t * c_p)"] : ["P_in = k_EM * Fid * Ae_local^2 * eta_" + X, "t_reach = m_t * c_p * (T_target - T_0) / P_in"],
      meaning: "how much of the sourced power the target's shape actually takes up (a thin-walled vessel takes nearly all of it; a stone floor, a fraction)",
      mech: (t) => "Eq. 4.0a laid into " + t + ": heat put in where it is wanted and nowhere else" },
    { k: "chill", base: "4.0a", w: 2, targets: ["a dairy pan", "a fish-crate", "a surgeon's tray", "a wine flask", "a fevered brow", "a wax seal", "a mould of tallow", "a hot axle", "a sweating cellar wall", "a jelly", "a butcher's slab", "a pastry board"],
      out: "P_in", form: (X, m) => ["P_in = -k_EM * Fid * Ae_local^2 * eta_" + X + "      -- reverse-sign casting", m === "held" ? "T(t_hold) = T_0 - |P_in| * t_hold * D_cycle / (m_t * c_p)" : "T_eq = T_amb - |P_in| / h_loss"],
      meaning: "the fraction of the drawn heat the target can give up without frosting, which is what keeps the casting honest",
      mech: (t) => "Eq. 4.0a run in reverse over " + t + ": heat drawn out, gently, for as long as the caster holds it" },
    { k: "light", base: "4.0a", w: 3, targets: ["a reading desk", "a stairwell", "a sickbed", "a mine gallery", "a night market", "a chart table", "a byre", "a lantern's dead wick", "a road-marker", "a loom", "a cellar stair", "a nursery", "a chapel aisle", "a ship's binnacle"],
      out: "L_out", form: (X, m) => m === "directional" ? ["L_out(theta) = k_EM * Fid * Ae_local * eta_" + X + " * Step(theta_arc - |theta|)"] : m === "pulsed" ? ["L_out(t) = k_EM * Fid * Ae_local * eta_" + X + " * Win_p(t; T_pulse)"] : ["L_out = k_EM * Fid * Ae_local(t) * eta_" + X + "      -- held, not discharged"],
      meaning: "how much of the distortion comes out as visible light rather than warmth, which the caster sets by how narrowly the glow is shaped",
      mech: (t) => "Lumen Thread's held glow (N-EM-03) shaped for " + t },
    { k: "spark", base: "4.0a", w: 2, targets: ["damp kindling", "a signal lamp", "a stubborn lock", "a fouled flint", "a flock of crows", "a lantern across a yard", "a beacon on a headland", "a startled horse", "a bell-wire", "a cold engine's pan"],
      out: "V_out", form: (X, m) => m === "pulsed" ? ["V_out(t) = k_EM * Fid * Ae_local * eta_" + X + " * Win_p(t; T_pulse)"] : ["V_out = k_EM * Fid * Ae_local * eta_" + X, "R_reach = V_out / V_break"],
      meaning: "how much of the discharge reaches the target rather than leaking to the caster's own sleeve, which is to say the aim",
      mech: (t) => "Spark Draw's discharge (N-EM-01) sized and aimed for " + t },
    { k: "read", base: "4.0e", w: 1, targets: ["a locked room", "a market crowd", "a ward at night", "a border post", "a sealed cask", "a rival's workshop", "a stretch of road", "a sickbed", "a tomb", "a harbour mouth"],
      out: "S_detect", form: (X) => ["S_detect(x, t) = k_EM * dAe_nearby(x, t) * eta_" + X + "      -- read-only; nothing is sourced"],
      meaning: "the caster's trained sensitivity in one setting; a passive read costs nothing and this is the only number in it that can be improved",
      mech: (t) => "Ripple Sense (N-EM-05) tuned to " + t },
    { k: "dry", base: "4.0a", w: 2, targets: ["a wet net", "a wall of green plaster", "a stack of hides", "a printer's sheet", "a sodden cloak", "a hank of dyed wool", "a stand of lath", "a fresh fresco", "a bundle of herbs", "a rick of hay", "a boat's bilge"],
      out: "dm_w/dt", form: (X, m) => ["P_in = k_EM * Fid * Ae_local^2 * eta_" + X, "dm_w/dt = -P_in / h_vap" + (m === "held" ? "      over t_hold, at duty D_cycle" : "")],
      meaning: "how much of the heat goes into driving off water rather than warming the thing itself",
      mech: (t) => "Eq. 4.0a held low and long over " + t + " until it is dry through" },
    { k: "warmhold", base: "4.0a", w: 2, targets: ["a night-watch post", "a sentry's greatcoat", "a lambing pen", "a hospice ward", "a bee-skep in a hard frost", "a coach's foot-well", "a chart room", "a lock-keeper's hut", "a shrine's votary", "a nursery cot"],
      out: "T_eq", form: (X) => ["P_in = k_EM * Fid * Ae_local^2 * eta_" + X, "T_eq = T_amb + P_in / h_loss      -- held steady at duty D_cycle"],
      meaning: "the target's share of a low, standing warmth against what the room leaks",
      mech: (t) => "a low Eq. 4.0a held for hours over " + t + ", judged by what does not get cold" }
  ],
  GR: [
    { k: "lift", base: "4.0b", w: 4, targets: ["a loaded hod", "a millstone", "a keg", "a coffin", "a stone lintel", "a full cask", "a wagon's rear axle", "a bell", "a bale of wool", "a barge's bow", "a cart-horse's collar", "a surgeon's patient", "a bridge timber", "a market awning"],
      out: "F_net", form: (X, m) => m === "held" ? ["F_net = m_t * g_local * (1 - k_grav * Fid * eta_" + X + ")      -- held over t_hold"] : ["F_net = m_t * g_local * (1 - k_grav * Fid * eta_" + X + ")"],
      meaning: "how much of the target's weight the ripple actually addresses, which for a bulky load is never all of it",
      mech: (t) => "Eq. 4.0b laid under " + t + ": weight partly cancelled for the length of the carry" },
    { k: "weigh", base: "4.0b", w: 2, targets: ["a tent peg", "a boat's anchor", "a wobbling ladder", "a paperweight in a gale", "a loose shutter", "a fence post", "a nervous scaffold", "a stack of hides", "a raft's corner", "a mooring stone"],
      out: "F_net", form: (X) => ["F_net = m_t * g_local * (1 + k_grav * Fid * eta_" + X + ")      -- reverse-sign casting"],
      meaning: "how much of the added weight lands on the target's footing rather than its middle, which is what makes it hold",
      mech: (t) => "Eq. 4.0b in reverse over " + t + ": weight added where it is wanted, briefly" },
    { k: "slowfall", base: "4.0b", w: 2, targets: ["a dropped tool", "a child off a hayloft", "a falling slate", "a lowered lamp", "a cask down a cellar chute", "a bucket down a well", "a rescued cat", "a sack off a cart", "a dismounting rider", "a glass in a tavern"],
      out: "v_term", form: (X) => ["F_net = m_t * g_local * (1 - k_grav * Fid * eta_" + X + ")", "v_term = sqrt(2 * F_net * h_drop / m_t)"],
      meaning: "the share of the fall the caster catches, set by how soon the ripple reaches the thing",
      mech: (t) => "Feather Fall's logic under " + t + ": the drop eased, not stopped" },
    { k: "steady", base: "4.0b", w: 2, targets: ["a potter's wheel", "a surveyor's staff", "a rope bridge", "a spinning top", "a ferry deck", "a grindstone", "a loaded tray", "a ladder in wind", "a carried lantern", "a fainting patient"],
      out: "tau_sway", form: (X) => ["F_net = m_t * g_local * (1 + k_grav * Fid * eta_" + X + ")      -- at the base only", "tau_sway = tau_0 * sqrt(1 / (1 + k_grav * Fid * eta_" + X + "))"],
      meaning: "how much of the added weight sits where sway begins rather than where it is felt",
      mech: (t) => "a whisper of Eq. 4.0b under " + t + " so it settles rather than sways" },
    { k: "flow", base: "4.0b", w: 2, targets: ["a stubborn drain", "a mill-leat", "a cask being racked", "a font being filled", "a grain chute", "a gutter in a downpour", "a sluice", "an oil press", "a bath being emptied", "a mash tun"],
      out: "dV/dt", form: (X) => ["F_net = m_t * g_local * (1 - k_grav * Fid * eta_" + X + ")      -- on the standing column", "dV/dt = A_t * sqrt(2 * (F_net / m_t) * h_head)"],
      meaning: "how much of the head of liquid the ripple reaches, which is why a deep tun answers less than a shallow one",
      mech: (t) => "Eq. 4.0b laid along " + t + " so what should run, runs" },
    { k: "hover", base: "4.0b", w: 1, targets: ["a marker buoy", "a lamp over a table", "a censer", "a chart weight", "a dowsing bob", "a grave-marker's wreath", "a festival lantern", "a bell-clapper", "a compass card", "a child's toy"],
      out: "h_rest", form: (X) => ["F_net = m_t * g_local * (1 - k_grav * Fid * eta_" + X + ")      -- held", "h_rest = h_0 + (k_grav * Fid * eta_" + X + " - 1) * g_local * t_hold^2 / 2"],
      meaning: "how much of the object's weight the held casting carries; Grave Lantern's hover (AD-06) with the glow left out",
      mech: (t) => "Eq. 4.0b held just short of full cancellation under " + t }
  ],
  ST: [
    { k: "bind", base: "4.0c", w: 4, targets: ["a barrel's hoops", "a fletching seam", "a cracked rafter", "a rope's splice", "a boot sole", "a hull plank", "a chair's joint", "a hedge-stake", "a cart wheel's felloe", "a bookbinder's spine", "a scaffold lashing", "a fishing net", "a wattle panel", "a wine press's frame"],
      out: "E_bind_eff", form: (X, m) => ["E_bind_eff = E_bind * (1 + k_strong * Fid * eta_" + X + ")" + (m === "held" ? "      -- held over t_hold" : "")],
      meaning: "how much of the boost lands on the seam that fails first rather than the whole piece",
      mech: (t) => "Eq. 4.0c laid into " + t + ": binding energy raised where the strain gathers" },
    { k: "brittle", base: "4.0c", w: 2, targets: ["a felled trunk", "a slab of slate", "a stubborn knot", "a seized bolt", "a frozen hinge", "a spent cask", "a length of bar iron", "a sheet of horn", "a sugar loaf", "a block of salt"],
      out: "E_bind_eff", form: (X) => ["E_bind_eff = E_bind * (1 - k_strong * Fid * eta_" + X + ")      -- reverse-sign casting, along the grain"],
      meaning: "how well the weakened line follows the grain rather than crossing it; a good caster scores, a poor one shatters",
      mech: (t) => "Brittle Ease's reverse casting (N-ST-02) drawn along " + t + " so it parts where it should" },
    { k: "seal", base: "4.0c", w: 2, targets: ["a cask stave", "a ship's seam", "a roof's ridge", "a jar's wax", "a cistern crack", "a boat's caulking", "a window lead", "a drum head", "a well's lining", "a tent's seam", "a bellows' leather"],
      out: "E_bind_eff", form: (X) => ["E_bind_eff = E_bind * (1 + k_strong * Fid * eta_" + X + ")      -- over the seam's area A_t only"],
      meaning: "the seam's area against the whole object's; the boost is spent on the line that leaks",
      mech: (t) => "Eq. 4.0c laid along " + t + " so it holds water, wind or weather" },
    { k: "edge", base: "4.0c", w: 2, targets: ["a scythe", "a chisel", "a surgeon's blade", "a plough share", "a glass-cutter", "an axe bit", "a razor", "a saw's teeth", "a harpoon", "a shear blade"],
      out: "E_bind_eff", form: (X) => ["E_bind_eff = E_bind * (1 + k_strong * Fid * eta_" + X + " * Step(d_edge - r))      -- within d_edge of the edge"],
      meaning: "how thin a band the boost is confined to; the thinner, the longer the edge lasts and the more precise the casting",
      mech: (t) => "Eq. 4.0c confined to the working edge of " + t },
    { k: "holdfast", base: "4.0c", w: 2, targets: ["a scaffold in a gale", "a mine prop", "a bridge under a drove", "a mast in a squall", "a dam board", "a siege ladder", "a crane's jib", "a stage under dancers", "a bell-frame", "a wagon on a ford"],
      out: "E_bind_eff", form: (X) => ["E_bind_eff(t) = E_bind * (1 + k_strong * Fid * eta_" + X + ")      for t < t_hold, then released"],
      meaning: "how much of the standing load the boosted bind carries, held for exactly as long as the danger lasts",
      mech: (t) => "Eq. 4.0c held over " + t + " for the length of the strain and let go the moment it passes" },
    { k: "temper", base: "4.0c", w: 1, targets: ["a spring", "a bow stave", "a fishing rod", "a bell", "a cart spring", "a lute's neck", "a sword", "a clock's mainspring", "a barrel hoop", "a whalebone stay"],
      out: "E_bind_eff", form: (X) => ["E_bind_eff = E_bind * (1 + k_strong * Fid * eta_" + X + " * (1 - D_cycle))      -- pulsed, never held"],
      meaning: "the pulse duty; a bind boosted and released in rhythm sets, the trade says, like a thing that has been used for years",
      mech: (t) => "Eq. 4.0c pulsed through " + t + " rather than held, to set rather than stiffen" }
  ],
  WK: [
    { k: "glow", base: "4.0d", w: 3, targets: ["a ward-post", "a stair's edge", "a fog-buoy", "a nursery", "a sentry's cuff", "a cellar door", "a boundary stone", "a road-marker", "a grave", "a chart's margin", "a well-head", "a ferry's bow"],
      out: "P_out", form: (X, m) => ["Gamma_eff = Gamma_0 * (1 + k_weak * Fid * eta_" + X + ")", "P_out = Gamma_eff * E_per_decay * N_unstable" + (m === "held" ? "      -- held over t_hold; faint by nature" : "      -- faint by nature")],
      meaning: "how much of the trace unstable material in the target is actually within reach of the nudge",
      mech: (t) => "Faint Ward-Light's glow (N-WK-02) set over " + t + ", faint and dependable" },
    { k: "ripen", base: "4.0d", w: 3, targets: ["a cheese", "a cask of cider", "a hank of dyed wool", "a hide in the tan-pit", "a ham", "a barrel of malt", "a rick of hay", "a jar of pickles", "a bolt of linen", "a tobacco leaf", "a compost heap", "a vat of indigo"],
      out: "t_cure", form: (X) => ["Gamma_eff = Gamma_0 * (1 + k_weak * Fid * eta_" + X + ")", "t_cure = t_cure_0 * Gamma_0 / Gamma_eff"],
      meaning: "how much of the cure's slow chemistry answers to the nudge; some processes barely do, and the entry says so",
      mech: (t) => "Eq. 4.0d laid patiently over " + t + " so it comes on a few days early and no worse for it" },
    { k: "arrest", base: "4.0d", w: 3, targets: ["a manuscript", "a wreath", "a wound's edge", "a ledger's ink", "a keg of fish", "a cut flower", "a rope in salt air", "a bride's cake", "a sample in a jar", "a mural", "a fruit crate", "a leather harness"],
      out: "Gamma_eff", form: (X) => ["Gamma_eff = Gamma_0 * (1 - k_weak * Fid * eta_" + X + ")      -- reverse-sign casting", "t_spoil = t_spoil_0 * Gamma_0 / Gamma_eff"],
      meaning: "how much of the target's decay the nudge can reach; a whole cask answers less than a single seal",
      mech: (t) => "Eq. 4.0d run in reverse over " + t + ": decay slowed for an evening, a week at most" },
    { k: "age", base: "4.0d", w: 1, targets: ["a new fence", "a stage prop", "a forged patina", "a cheese rind", "a leather boot", "a violin's varnish", "a wine's edge", "a garden wall", "a ledger's binding", "a sword's fittings"],
      out: "Gamma_eff", form: (X) => ["Gamma_eff = Gamma_0 * (1 + k_weak * Fid * eta_" + X + ")      -- on the surface only; d_skin deep"],
      meaning: "how thin a skin the nudge is confined to; the trade calls the number the depth of the lie",
      mech: (t) => "Eq. 4.0d hastened over the surface of " + t + " so it wears years in an afternoon" },
    { k: "warmfaint", base: "4.0d", w: 1, targets: ["a chick brooder", "a sick lamb", "a seed tray", "a winter hive", "a bread proof", "a sourdough crock", "a hatching box", "a cold frame", "a swaddled infant", "a kennel"],
      out: "P_out", form: (X) => ["Gamma_eff = Gamma_0 * (1 + k_weak * Fid * eta_" + X + ")", "P_out = Gamma_eff * E_per_decay * N_unstable      -- as warmth; held at duty D_cycle"],
      meaning: "how much of the faint radiant output is kept as warmth rather than lost as glow",
      mech: (t) => "Eq. 4.0d's faint warmth held under " + t + " through a cold night" }
  ]
};
const MODES = { warm: ["burst", "held", "held"], chill: ["burst", "held"], light: ["held", "directional", "pulsed"], spark: ["burst", "pulsed"], read: ["read"], dry: ["held", "burst"], warmhold: ["held"], lift: ["burst", "held"], weigh: ["burst"], slowfall: ["burst"], steady: ["held"], flow: ["held"], hover: ["held"], bind: ["burst", "held"], brittle: ["burst"], seal: ["burst"], edge: ["burst"], holdfast: ["held"], temper: ["pulsed"], glow: ["held", "held", "burst"], ripen: ["held"], arrest: ["held"], age: ["burst"], warmfaint: ["held"] };
const FORCE_NAME = { EM: "EM", GR: "Gravity", ST: "Strong", WK: "Weak" };
const FORCE_EQ = { EM: "4.0a", GR: "4.0b", ST: "4.0c", WK: "4.0d" };

/* ───────── prose banks ───────── */
const USE = {
  EM: ["{Trades} in {place} cast it daily and would sooner lose a knife.", "A {trade}'s first working after Spark Draw, and the one they are still casting at sixty.", "Common in {place}; examiners set it because it is easy to attempt and hard to do well.", "{Trades} pay for it by the hour and complain about the price with real affection.", "Taught to every apprentice in {place}, and mastered by fewer than the guild admits.", "The technique behind half the warm rooms in {place} and none of the stories about them.", "{Trades} keep a holder on retainer through the winter and forget them by spring.", "Cast, in {place}, more often by children than the guild would like.", "A {trade}'s technique, and a {trade2}'s, and disputed between them at every fair."],
  GR: ["{Trades} in {place} rank it above a second pair of hands.", "Standard among {trades}; the examination is a loaded cart and a steep lane.", "Cast in {place} wherever something heavy has to go somewhere awkward.", "{Trades} call it by a plainer name and cast it without ceremony.", "The reason {trades} in {place} are older, on average, than anywhere else.", "A {trade}'s daily working, and a {trade2}'s occasional one.", "Hired in {place} by the load; the rate is posted at the yard gate.", "Taught to {trades} early, since the alternative is a bad back by thirty."],
  ST: ["{Trades} in {place} will not sell work that has not had it.", "A {trade}'s signature, and the reason their seams outlast their customers.", "Examined by every guild of {trades}, on a joint they are not allowed to see made.", "Common in {place}, where the weather tests every bind it can find.", "{Trades} cast it at the bench and again at the door, out of habit.", "The technique behind the reputation of {place} for things that do not come apart.", "A {trade}'s routine; a {trade2}'s emergency.", "Cast in {place} on anything that will be trusted with a life."],
  WK: ["{Trades} in {place} cast it and say nothing, which is the tier's way.", "Faint, as every weak-force working is at this tier, and prized by {trades} for exactly that.", "A {trade}'s technique, unshowy enough that customers assume it is luck.", "Cast in {place} through the whole of the cold season, and nowhere else.", "{Trades} examine for it in the dark, since in daylight there is nothing to see.", "The reason the {trades} of {place} keep better stock than their neighbours and cannot say why.", "A {trade}'s quiet working; a {trade2}'s open secret.", "Taught late, held long, and never the technique a Novice boasts of."]
};
const ASIDE_NOV = ["A Journeyman can chain it with {code} under Eq. 4.13; a Novice should not try.", "Holders of {code} learn it in an afternoon; the reverse is not true.", "Examiners pair it with {code} and mark the transition, not the castings.", "{code} is the same casting on a different target, and the guilds treat them as one."];
const ASIDE = ["The working form is Eq. {eq}; the shape factor does the rest.", "Its working form (Eq. {eq}) is the one most apprentices learn to read first.", "Related, in practice if not in mechanism, to {code}.", "Compare {code}, examined in the same hour and confused with it by nobody who has cast either.", "The directory files it beside {code} and lets the two argue.", "Everything the entry does is in Eq. {eq}; everything it does not do is in the shape factor.", "Eq. {eq} gives the number; the trade gives the name.", "Its shape factor is small, and the entry is honest about it.", "Not to be confused with {code}, which is louder and less useful.", "The working form, Eq. {eq}, is short; the practice behind it is not."];
const LIMIT = { EM: { any: ["A fizzle here is quiet and cold, exactly as Eq. 3.3 promises.", "Past the target's edge the distortion is simply not there.", "Nothing it does would count as heating at any real scale."], warm: ["It does not cook, forge or cure; it warms, and stops.", "Nothing it does would count as heating at any real scale."], chill: ["It chills; it does not freeze, and a holder who tries learns why Fid_min exists.", "Nothing it does would count as preservation at any real timescale."], light: ["It lights; it does not burn, and holders who try both learn why Fid_min exists.", "The glow is honest about its source: a held ripple, not a flame."], spark: ["It startles and kindles; it has never once wounded, and the entry is proud of that.", "Past the reach of the discharge there is nothing at all."], read: ["It reads; it sources nothing, and a caster who tries to push through it finds there is nothing there to push.", "Costless, as every passive read is, and worth exactly the attention paid to it."], dry: ["It dries; it does not cure or season, whatever the trade hopes.", "Past the target's edge the distortion is simply not there."], warmhold: ["It keeps warm; it does not make warm, and a cold room stays a cold room.", "A fizzle here is quiet and cold, exactly as Eq. 3.3 promises."] },
  GR: { any: ["It lightens; it never lifts, and the difference is a broken foot.", "The weight returns the instant the hold ends, and the trade plans for it.", "Nothing about it is flight; the directory has said so since N-GR-01.", "It carries the load's edge, not the load, and the caster still sweats.", "A dropped hold is a dropped load; the examination includes one.", "Past the ripple's reach the thing weighs what it weighs."] },
  ST: { any: ["It strengthens what is already joined; it makes nothing new.", "A seam it did not touch fails exactly as before.", "The boost outlasts the hold by nothing at all.", "It is not a weld, whatever the trade calls it.", "Cast on rot, it strengthens rot; the entry is not a cure.", "The line it draws is the line the material offered."], brittle: ["It weakens along a line; it does not cut, and the saw is still needed.", "The line it draws is the line the material offered."] },
  WK: { any: ["Faint by nature; a Novice who expects more has misread the tier.", "It hastens or slows; it never stops, and cannot.", "A week is its horizon, and the guilds that pretend otherwise lose stock.", "Nothing about it preserves; it delays, and honestly.", "Cast too eagerly, it does nothing at all, which is the tier's usual mercy."], glow: ["The glow is a glow. It has never once been a lamp.", "Faint by nature; a Novice who expects more has misread the tier."] } };
const aside = (ctx, novice) => fill(pick(novice ? ASIDE.concat(ASIDE_NOV) : ASIDE), ctx);
function fill(t, ctx){ return t.replace(/\{(\w+)\}/g, (m, k) => ctx[k] != null ? ctx[k] : m); }

/* ───────── names ───────── */
function novName(force){
  const b = V[force]; for (let tries = 0; tries < 200; tries++) {
    const p = rnd(); let n;
    if (p < 0.45) n = pick(b.adj) + " " + pick(b.noun);
    else if (p < 0.7) n = pick(b.adj) + "'s " + pick(b.noun);
    else if (p < 0.85) n = "The " + pick(b.adj) + " " + pick(b.noun);
    else n = pick(b.noun) + " of " + pick(b.adj) + "s";
    if (!NAMES.has(n.toLowerCase())) { NAMES.add(n.toLowerCase()); return n; }
  } throw new Error("names exhausted for " + force);
}
function uniqueName(fn){ for (let t = 0; t < 400; t++) { const n = fn(); if (!NAMES.has(n.toLowerCase())) { NAMES.add(n.toLowerCase()); return n; } } throw new Error("names exhausted"); }
function code(prefix){ MAXN[prefix] = (MAXN[prefix] || 0) + 1; const c = prefix + "-" + String(MAXN[prefix]).padStart(2, "0"); CODES.add(c); return c; }
const X = (c) => c.replace(/-/g, "");

/* ───────── the entries ───────── */
const OUT = []; // { c, n, t, pair, mat, prose, form: [lines], desc, base, refs }
const COUNTS = { EM: 220, GR: 200, ST: 200, WK: 180 };
const NEW_NOVICE = { EM: [], GR: [], ST: [], WK: [] };
for (const f of ["EM", "GR", "ST", "WK"]) {
  const classes = []; CLASSES[f].forEach((c) => { for (let i = 0; i < c.w; i++) classes.push(c); });
  for (let i = 0; i < COUNTS[f]; i++) {
    const cls = pick(classes), mode = pick(MODES[cls.k]), target = pick(cls.targets), c = code("N-" + f), n = novName(f);
    const trades = TRADES[f], trade = pick(trades), trade2 = pick(trades.filter((t) => t !== trade));
    const related = pick(NOVICE_EXISTING[f].concat(NEW_NOVICE[f].slice(-20)));
    const eqn = "8." + (EXISTING.length + OUT.length + 1);
    const ctx = { Trades: cap(trade), trades: trade, trade: trade.replace(/s$/, ""), trade2: trade2.replace(/s$/, ""), place: pick(PLACES), eq: eqn, code: related };
    const prose = cap(cls.mech(target)) + (mode === "held" ? ", held over `t_hold`" : mode === "directional" ? ", shaped to an arc `theta_arc` and dark outside it" : mode === "pulsed" ? ", pulsed on a period `T_pulse` rather than held" : "") + ". " + fill(pick(USE[f]), ctx) + " " + pick(LIMIT[f][cls.k] || LIMIT[f].any) + " " + aside(ctx, true);
    OUT.push({ c, n, t: "Novice", force: FORCE_NAME[f], cls: cls.k, mode, target, prose, form: cls.form(X(c), mode), base: cls.base, desc: "Working form of Eq. " + cls.base + " for " + n + " (" + c + "): `eta_" + X(c) + "` is " + cls.meaning + "." });
    NEW_NOVICE[f].push(c);
  }
}
/* Journeyman: two Novice components */
const ALL_NOVICE = [].concat(...Object.values(NOVICE_EXISTING), ...Object.values(NEW_NOVICE));
const J_FRAMES = ["{A} then {B}, in that order and never blended: {what}.", "{A} or {B}, chosen on the spot by what the day offers: {what}.", "{A} held ready behind {B}, cast only if the first goes wrong: {what}.", "{A} across the morning, {B} across the afternoon, with `tau_switch` spent on the walk between: {what}.", "{A} and {B} in strict alternation, {N} rounds to the working: {what}."];
const J_WHAT = ["a {trade}'s whole shift in two castings", "the round that keeps the {trades} of {place} employed", "a {trade}'s answer to a bad week", "the working {place} names its inns after", "a ferry crossing's two halves", "a night-watch's two kinds of trouble", "what a {trade} does when the apprentice is ill", "the pairing every guild of {trades} examines first", "a market day's two demands met by one caster", "a {trade}'s emergency, rehearsed until it is routine"];
const J_TAIL = ["The switching discipline is the technique; the components are Novice work and say so.", "Eq. 4.13's dead time between them is where the skill lives, and the examiners time it.", "A Novice can cast either half; the Journeyman is the one who does not try both at once.", "The two windows never overlap; a caster who lets them overlap has, briefly, attempted Adept work, and Eq. 3.3 has an opinion about that.", "Timed, as every entry at this tier is timed, by `tau_switch` and nothing else.", "Named by the trade for the pause in the middle, which is the part that took years."];
const J_NAMES = { adj: ["Ferry", "Market", "Harvest", "Watch", "Mill", "Quarter", "Coach", "Kitchen", "Lock", "Shore", "Yard", "Gate", "Bell", "Chapel", "Bridge", "Well", "Barn", "Cellar", "Lantern", "Harbour", "Orchard", "Forge", "Wool", "Salt", "Winter", "Dawn", "Noon", "Evening", "Sabbath", "Fair"], noun: ["Round", "Watch", "Shift", "Turn", "Hour", "Pair", "Rota", "Beat", "Day", "Circuit", "Change", "Passage", "Crossing", "Errand", "Duty", "Tally", "Ledger", "Chorus", "Reckoning", "Bargain"] };
for (let i = 0; i < 300; i++) {
  const a = pick(ALL_NOVICE); let b = pick(ALL_NOVICE); while (b === a) b = pick(ALL_NOVICE);
  const c = code("J"), n = uniqueName(() => rnd() < 0.5 ? pick(J_NAMES.adj) + " " + pick(J_NAMES.noun) : "The " + pick(J_NAMES.adj) + "'s " + pick(J_NAMES.noun));
  const f = pick(["EM", "GR", "ST", "WK"]), trade = pick(TRADES[f]);
  const N = 2 + Math.floor(rnd() * 5);
  const eqn = "8." + (EXISTING.length + OUT.length + 1);
  const prose = fill(pick(J_FRAMES), { A: a, B: b, N: N, what: fill(pick(J_WHAT), { trade: trade.replace(/s$/, ""), trades: trade, place: pick(PLACES) }) }) + " " + pick(J_TAIL) + " " + aside({ eq: eqn, code: pick(EXISTING.filter((e) => /^J-/.test(e.c)).map((e) => e.c)) });
  OUT.push({ c, n, t: "Journeyman", prose, comps: [a, b], form: ["X_seq(t) = X_" + X(a) + "(t) * Win_1(t) + X_" + X(b) + "(t) * Win_2(t)", "Win_1(t) . Win_2(t) = 0", "t_round = N_rep * (w_1 + w_2) + (2 * N_rep - 1) * tau_switch      -- N_rep = " + N], base: "4.13", desc: "Working form of Eq. 4.13 for " + n + " (" + c + "): the two windows carry " + a + " and " + b + "; `w_1`, `w_2` are their live durations and the round is timed by `tau_switch` alone." });
}
/* Adept: six pairs */
const PAIRS = [["EM", "Strong", "AD-01", "Flash-Forge"], ["EM", "Gravity", "AD-02", "Storm-Step"], ["EM", "Weak", "AD-03", "Cinder-Fall"], ["Gravity", "Strong", "AD-04", "Sunder Weight"], ["Strong", "Weak", "AD-05", "Quiet Mend"], ["Gravity", "Weak", "AD-06", "Grave Lantern"]];
const PAIR_WORK = { "EM+Strong": ["heat and cohesion blended through {obj} in one pass", "a chill and a brittle line blended along {obj}", "a gather's warmth and its bind held together while {obj} is worked", "warmth walked with the hammer through {obj}, hard everywhere the blow is not"],
  "EM+Gravity": ["a lightened stance and a spark blended into one leap over {obj}", "{obj} lowered burning through its own hall, weight feathered, flame steady", "charged spray lifted into a standing column above {obj}", "a thin melt-line warmed under a lightened stride across {obj}"],
  "EM+Weak": ["heat and a decay nudge blended so {obj} burns self-fed from poor fuel", "a warmth-read and a decay-read blended into one passing touch over {obj}", "a lamp kindled now to brighten at a chosen hour over {obj}", "smoke-house heat and a cure's slow chemistry blended through {obj}"],
  "Gravity+Strong": ["{obj} lightened for the throw and bind-proofed at the lashings", "the burden of {obj} eased into its props while prop and rock are bind-boosted as one", "a load made heavier and more fragile in the same casting, for {obj}", "{obj} held lighter and tighter through the whole of a crossing"],
  "Strong+Weak": ["a cohesion boost blended with decay slowed, to steady {obj} in its age", "a bind and a ripening held together so {obj} sets and cures in one season", "{obj} kept whole and kept fresh under one renewing blend", "old rope's logic carried to {obj}: strengthened and slowed together"],
  "Gravity+Weak": ["{obj} held just off true rest while glowing faintly", "a fielded pattern of hovering lights drawn over {obj}", "{obj} lightened and warmed through a cold night by one blend", "a marker eased off the ground and lit over {obj} for a vigil"] };
const AD_OBJ = ["a shipyard's rivet-line", "a glasshouse floor", "a coach road", "a mine cage", "a harbour mouth", "a cathedral's great lamp", "a smokehouse", "a field bridge", "a gallery of props", "a burial buoy", "a festival square", "a lifeboat station", "a frontier beacon", "an anchor chain", "a winter ferry", "a foundry's sprues", "a fen crossing", "a rope-walk", "a quarry face", "a granary"];
const AD_TAIL = ["Fid enters squared, as it must at this tier: a wobble that a Journeyman's switching would absorb degrades both halves at once.", "The pair's `Chi` is the solved one; the entry only sets what the blend is pointed at.", "No seventh pair exists, and the entry does not pretend to one.", "Examined, like every deepening of the pair, on the `Fid^2` test: the blend must move without widening.", "The Journeyman version takes twice as long and half the skill; the trade pays for the difference.", "Its working form carries the pair's `Chi` unchanged and a shape factor for what the blend is aimed at."];
const AD_NAMES = { adj: ["Rivet", "Harbour", "Cage", "Beacon", "Lamp", "Tide", "Forge", "Storm", "Ember", "Quiet", "Bright", "Deep", "Long", "Iron", "Salt", "Winter", "Festival", "Vault", "Chain", "Glass", "Coal", "Grave", "Signal", "Cinder", "Anchor", "Shore", "Bridge", "Furnace", "Lantern", "Sea"], noun: ["Step", "Fall", "Weight", "Mend", "Lantern", "Song", "Kiss", "Crossing", "Pillar", "Vigil", "Descent", "Glide", "Column", "Chorus", "Patience", "Stroke", "Cure", "Watch", "Draw", "Hold", "Bloom", "Line", "Constellation", "Reckoning", "Turn"] };
PAIRS.forEach((p) => {
  const key = p[0] + "+" + p[1];
  for (let i = 0; i < 60; i++) {
    const c = code("AD"), n = uniqueName(() => rnd() < 0.6 ? pick(AD_NAMES.adj) + " " + pick(AD_NAMES.noun) : pick(AD_NAMES.adj) + "'s " + pick(AD_NAMES.noun));
    const eqn = "8." + (EXISTING.length + OUT.length + 1);
    const prose = "*(" + p[0] + " + " + p[1] + ")* — " + fill(pick(PAIR_WORK[key]), { obj: pick(AD_OBJ) }) + ". The " + p[3] + " pair (" + p[2] + ") deepened for " + pick(TRADES[p[0] === "Gravity" ? "GR" : p[0] === "Strong" ? "ST" : p[0] === "Weak" ? "WK" : "EM"]) + " in " + pick(PLACES) + ". " + pick(AD_TAIL) + " " + aside({ eq: eqn, code: p[2] });
    OUT.push({ c, n, t: "Adept", pair: key, prose, form: ["X_combo = k_" + (p[0] === "EM" ? "EM" : p[0].toLowerCase()) + " * k_" + (p[1] === "EM" ? "EM" : p[1].toLowerCase()) + " * Fid^2 * Chi(" + p[0] + ", " + p[1] + ") * eta_" + X(c) + " * dAe_local"], base: "4.15", desc: "Working form of Eq. 4.15 for " + n + " (" + c + "), on the " + key.replace("+", " + ") + " pair: `eta_" + X(c) + "` is how much of the blended distortion reaches what the entry aims it at; `Chi` is the pair's solved value and is not the entry's to change." });
  }
});
/* Artisan: one material each */
const MATS = ["Tin", "Lead", "Zinc", "Nickel", "Brass", "Pewter", "Steel", "Wrought Iron", "Cast Iron", "Sea Salt", "Rock Salt", "Chalk", "Flint", "Slate", "Marble", "Granite", "Sandstone", "Limestone", "Basalt", "Pumice", "Obsidian", "Jet", "Amber", "Coral", "Pearl", "Ivory", "Horn", "Antler", "Tortoiseshell", "Whalebone", "Sinew", "Gut", "Rawhide", "Vellum", "Parchment", "Paper", "Rag Paper", "Linen", "Hemp", "Jute", "Flax", "Cotton", "Silk", "Wool", "Felt", "Fur", "Down", "Beeswax", "Tallow", "Lard", "Butter", "Honey", "Sugar", "Molasses", "Malt", "Yeast", "Vinegar", "Wine", "Ale", "Cider", "Mead", "Milk", "Cream", "Whey", "Curd", "Rennet", "Blood", "Bone Char", "Charcoal", "Peat", "Coal", "Coke", "Pitch", "Tar", "Resin", "Turpentine", "Lacquer", "Shellac", "Varnish", "Linseed", "Walnut Oil", "Olive Oil", "Fish Oil", "Whale Oil", "Lamp Oil", "Saltpetre", "Sulphur", "Alum", "Lime", "Quicklime", "Mortar", "Plaster", "Gypsum", "Terracotta", "Stoneware", "Porcelain", "Earthenware", "Fire-Clay", "River Clay", "Brick", "Tile", "Glaze", "Enamel", "Green Glass", "Lead Glass", "Bottle Glass", "Window Glass", "Mirror Silver", "Gilt", "Gold Leaf", "Electrum", "Solder", "Bell Metal", "Gun Metal", "Bog Iron", "Meteoric Iron", "Ash Wood", "Elm", "Beech", "Birch", "Yew", "Holly", "Boxwood", "Walnut", "Cherry", "Apple Wood", "Pear Wood", "Pine", "Fir", "Larch", "Cedar", "Cypress", "Willow", "Hazel", "Alder", "Poplar", "Chestnut", "Lime Wood", "Bog Oak", "Driftwood", "Cork", "Bamboo", "Reed", "Rush", "Straw", "Thatch", "Osier", "Bark", "Sap", "Rubber", "Gutta", "Ebony", "Rosewood", "Mahogany", "Teak", "Sandalwood", "Camphor", "Myrrh", "Frankincense", "Indigo", "Madder", "Woad", "Saffron", "Cochineal", "Ochre", "Umber", "Verdigris", "Vermilion", "Lampblack", "Chalk White", "Ink", "Sizing", "Gesso", "Tempera", "Egg", "Gelatine", "Glue", "Starch", "Flour", "Bran", "Oats", "Barley", "Rye", "Wheat", "Rice", "Millet", "Bean", "Pea", "Lentil", "Hops", "Tea", "Tobacco", "Snuff", "Soap Lye", "Potash", "Soda", "Borax", "Nitre", "Quartz", "Agate", "Jasper", "Garnet", "Rock Crystal", "Feldspar", "Mica", "Talc", "Asbestos", "Clay Slip", "Kaolin", "Sand", "Gravel", "Loam", "Silt", "Turf", "Moss", "Lichen", "Kelp", "Sponge", "Cuttlebone", "Mother-of-Pearl", "Shell Lime", "Eggshell", "Feather", "Quill", "Hair", "Bristle", "Catgut", "Snakeskin", "Eelskin", "Fishskin", "Shagreen", "Chamois", "Cordovan", "Morocco", "Buff", "Parchment Size", "Bone Glue", "Hide Glue", "Fish Glue", "Wax Cloth", "Oilcloth", "Canvas", "Sailcloth", "Tarpaulin", "Sackcloth", "Lace", "Velvet", "Brocade", "Damask", "Fustian", "Broadcloth", "Tweed", "Serge", "Frieze", "Baize", "Ticking", "Muslin", "Cambric", "Lawn", "Gauze", "Crepe", "Taffeta", "Satin", "Ribbon", "Thread", "Twine", "Cable", "Chain", "Wire", "Foil", "Sheet Lead", "Sheet Copper", "Sheet Tin", "Nail Iron", "Spring Steel", "Blister Steel", "Crucible Steel", "Damascus", "Shear Steel", "Tool Steel", "Horseshoe Iron", "Anchor Iron", "Ship's Copper", "Bell Bronze", "Cannon Bronze", "Mirror Bronze", "Coin Silver", "Sterling", "Plate", "Britannia", "Type Metal", "White Metal", "Speculum", "Amalgam", "Quicksilver", "Whetstone", "Millstone Grit", "Sea Coal", "Fuller's Earth", "Bone Ash", "Pot Metal", "Latten", "Tombac"];
const MAT_LIST = shuffle(MATS.filter((m) => !MATERIALS_USED.has(m.toLowerCase()))).slice(0, 260);
if (MAT_LIST.length < 260) throw new Error("not enough materials: " + MAT_LIST.length);
const AR_WORK = ["purification, truing, or selective reformation of {m}-based work without heat or hammer", "{m} shifted in temper, grain or set from within, as the trade needs it", "{m}'s structure eased, steadied or cleared of fault along one solved family", "flaws found and closed in {m}, or opened deliberately along the solved grain", "{m} worked to a finish no tool reaches, one eigenvector deep"];
const AR_TAIL = ["Does not extend to {n1} or {n2}, whatever their surface likeness; each is an Eq. 4.17 backlash waiting on a caster who reasons by resemblance.", "The neighbours it pointedly does not cover are {n1} and {n2}; both have cost careless holders a season's work.", "{n1} and {n2} are unmodelled and are not touched, and the guild's examination includes an offer of each.", "Narrow by construction, as §3.3 requires: {n1} is a different eigenvector and {n2} a different world."];
MAT_LIST.forEach((m) => {
  const c = code("AR"), n = "Artisan of " + m; NAMES.add(n.toLowerCase());
  const others = MATS.filter((x) => x !== m); const n1 = pick(others), n2 = pick(others.filter((x) => x !== n1));
  const eqn = "8." + (EXISTING.length + OUT.length + 1);
  const prose = "solved for one " + m.toLowerCase() + " structure: " + fill(pick(AR_WORK), { m: m.toLowerCase() }) + ". " + fill(pick(AR_TAIL), { n1: n1.toLowerCase(), n2: n2.toLowerCase() }) + " " + fill(pick(["Common in {place}; the proof is older than the guild that holds it.", "Rare outside {place}, where the trade that needs it is.", "Held in {place} by a family line, which the directory records without comment.", "The tier's usual bargain: one material, wholly, and nothing else at all."]), { place: pick(PLACES) }) + " " + aside({ eq: eqn, code: pick(EXISTING.filter((e) => /^AR-/.test(e.c)).map((e) => e.c)) });
  OUT.push({ c, n, t: "Artisan", mat: m, prose, form: ["Effect_i = lam_i * Fid * dAe_local * eta_" + X(c) + ",      e_i in S_" + X(c) + "   (S per Eq. 3.1e)", "E_back_mat = Int_V[ | lam_guess - lam_true |^2 ] dV   for " + n1.replace(/ /g, "_") + ", " + n2.replace(/ /g, "_") + "   (Eq. 4.17)"], base: "4.16", desc: "Working form of Eq. 4.16 for " + n + " (" + c + "): `S_" + X(c) + "` is the solved eigenvector family for " + m.toLowerCase() + " and `eta_" + X(c) + "` how much of the workpiece lies within it; the second line is the backlash waiting on its named neighbours." });
});
/* Master: complete-S workings */
const M_WORK = ["the ambient hazards of {scope} kept re-expressed inert through the working day", "the whole of {scope} bind-raised (`s = +1`) at once, seam by seam, in one standing presence", "the slow ruin of {scope} arrested (`s = -1`) across every material in it for the length of a contract", "one quantity of matter in {scope} rewritten across the complete eigenbasis (Eq. 4.18) into what the work requires", "{scope} aged or steadied to order, any material, no proof per material needed", "the injuries in {scope} closed broadly rather than seam by seam, Full Mend's logic (M-01) at scale"];
const M_SCOPE = ["a working forge", "a hospital ward", "a grain fleet", "a mine's whole gallery", "a cathedral's roof", "a siege line", "a shipyard slip", "a city's aqueduct", "an archive", "a foundry floor", "a plague street", "a bridge's every joint", "a granary district", "a harbour's pilings", "a royal mint", "a battlefield hospital", "a salt-works", "a vineyard's cellars", "a river's lock-gates", "a dockyard's rope-store"];
const M_TAIL = ["Civic first, extraordinary later, spectacle never; the entry keeps M-02's founding observation.", "Retained, where it is retained, as infrastructure, and accounted so.", "The complete `S` behind it is the tier's whole definition; the entry only says what it was pointed at.", "Towns that can keep a holder of it stop mentioning the fact, which is how the directory knows they can.", "Eq. 4.19's `s` is chosen at inscription and the entry names which; the other sign is a different entry."];
const M_NAMES = { adj: ["Founder", "Warden", "Steward", "Keeper", "Chancellor", "Bailiff", "Provost", "Mason", "Physician", "Almoner", "Harbourmaster", "Quartermaster", "Reeve", "Abbot", "Surveyor", "Mintmaster", "Shipwright", "Vintner", "Archivist", "Bridgemaster"], noun: ["Silence", "Patience", "Ledger", "Hour", "Standing", "Peace", "Season", "Word", "Charge", "Keeping", "Tenure", "Watch", "Grace", "Measure", "Surety", "Mercy", "Order", "Warrant", "Care", "Long Day"] };
for (let i = 0; i < 160; i++) {
  const c = code("M"), n = uniqueName(() => pick(M_NAMES.adj) + "'s " + pick(M_NAMES.noun)); const s = rnd() < 0.55 ? "+1" : "-1"; const scope = pick(M_SCOPE);
  const eqn = "8." + (EXISTING.length + OUT.length + 1);
  const prose = fill(pick(M_WORK), { scope }) + ", a Master's standing presence worn like the place's own held breath. " + pick(M_TAIL) + " " + aside({ eq: eqn, code: pick(EXISTING.filter((e) => /^M-/.test(e.c)).map((e) => e.c)) });
  OUT.push({ c, n, t: "Master", prose, form: ["E_bind_eff(x) = E_bind(x) * (1 + s * c_M * Fid * eta_" + X(c) + "),   any x in " + scope.replace(/^an? /, "").replace(/[^a-z]+/gi, "_"), "Gamma_eff(x)   = Gamma_0(x) * (1 + s * c_M * Fid * eta_" + X(c) + "),      s = " + s + "   (S complete)"], base: "4.19", desc: "Working form of Eq. 4.19 for " + n + " (" + c + "), with `s = " + s + "`: `eta_" + X(c) + "` is the share of the domain the standing presence actually covers, which for a Master is nearly all of it." });
}
/* Warden: one proven geometry each */
const W_GEO = ["a mapped tower stair", "a standard harbour step", "a published bridge span", "a guild-pattern well shaft", "a chartered ford", "a cathedral's nave floor", "a mine shaft sunk to the old bore", "a coaching road's hairpin", "a lock chamber of the canal gauge", "a granary ramp", "a lighthouse gallery", "a city gate's threshold", "a standard mill-race", "a hospice's long ward", "a chapel's crypt stair", "a quarry incline built to the survey", "a tithe barn's threshing floor", "a fortress sally-port", "a market cross's steps", "a customs-house quay"];
const W_WORK = ["the climb eased for the infirm along the proven flights, and only there", "a fall along its line made survivably slow", "the crossing's cost gentled between the two proven ends", "weight eased on the loaded ascent, exactly to the published dimensions", "a sway damped to stillness within the mapped bounds", "a load's descent steadied along the surveyed line"];
const W_TAIL = ["The proof transfers only where the geometry does, which is why the entry is catalogable at all.", "Ends, like all Warden work, exactly at `eps_valid(R_proven)`'s edge (Eq. 4.21); a step past it is Eq. 4.7 in miniature.", "The order that holds it re-surveys the geometry on a calendar and casts nowhere the survey has not been.", "W-13's open-ledger example is cited in its charter; the directory notes the citation.", "Built to the published dimensions or not cast; the examiners carry a rule."];
const W_NAMES = { adj: ["Pilgrim", "Stair", "Ford", "Quay", "Gate", "Lock", "Shaft", "Nave", "Well", "Bridge", "Ramp", "Gallery", "Threshold", "Cross", "Barn", "Ward", "Crypt", "Incline", "Race", "Port"], noun: ["Grace", "Mercy", "Rest", "Ease", "Patience", "Keeping", "Whisper", "Kindness", "Measure", "Quiet", "Trust", "Passage", "Comfort", "Stillness", "Charity"] };
for (let i = 0; i < 120; i++) {
  const c = code("W"), n = uniqueName(() => pick(W_NAMES.adj) + "'s " + pick(W_NAMES.noun)); const geo = pick(W_GEO);
  const eqn = "8." + (EXISTING.length + OUT.length + 1);
  const prose = geo + ": " + pick(W_WORK) + ". " + pick(W_TAIL) + " " + aside({ eq: eqn, code: pick(EXISTING.filter((e) => /^W-/.test(e.c)).map((e) => e.c)) });
  OUT.push({ c, n, t: "Warden", prose, form: ["delta(g)_" + X(c) + " = eps * Xi_1 * Bump(r, R_proven) * G_site,      R_proven = " + geo.replace(/^an? /, "").replace(/[^a-z]+/gi, "_"), "eps <= eps_valid(R_proven)   (Eq. 4.21)"], base: "4.20", desc: "Working form of Eq. 4.20 for " + n + " (" + c + "): `G_site` is the geometry's site factor, fixed by the survey; `R_proven` is " + geo + " and no other." });
}
/* Legend: standing works */
const LG_FOLD = ["a standing fold linking {a} and {b}, held open across `t_dom_legend`", "a river carried through {a} in a standing channel of eased weight", "a pass over {a} where the climb weighs half what geology insists", "a standing ease along the whole length of {a}, resurveyed on a `t_drift` cadence"];
const LG_STAR = ["a held singularity kept as the landmark and hearth of {a} for generations", "a bound star above {a}, its shell re-inscribed on `t_recert`", "a standing light over {a} that three generations have navigated by and none has had to relight"];
const LG_PLACES = ["the salt coast", "the northern marches", "the ridge road", "the cathedral city", "the fen capital", "the twin ports", "the mountain hospice", "the river's mouth", "the old frontier", "the vineyard duchies", "the iron valleys", "the winter capital", "the tin islands", "the lake cantons", "the great causeway", "the glass city", "the mill provinces", "the amber shore", "the shepherd kingdoms", "the delta"];
const LG_TAIL = ["Every entry at this tier is an institution, because Eq. 4.22–4.23's upkeep permits nothing less; the maintenance interval is the operative constraint.", "The mathematics is Sovereign's unchanged (§4.1–§4.3), held at Eq. 3.1g's furthest dials, which the jurists cite with visible resentment.", "Its hereditary order keeps the `t_drift` bookkeeping; the working itself is one line.", "Recorded by the directory as it records all Legends: by what it costs to keep."];
const LG_NAMES = ["The Raised Causeway", "The Long Ford", "The Standing Lamp", "The Held Tide", "The Quiet Pass", "The Winter Bridge", "The Steadfast Star", "The Twin Gate", "The Salt Road", "The Amber Fold", "The Kept Fire", "The River Stair", "The Mountain Door", "The Fen Light", "The Iron Crossing", "The Vintner's Fold", "The Shepherd's Star", "The Glass Road", "The Delta Lamp", "The Tin Bridge", "The Harbour Fold", "The Ridge Lamp", "The Lake Passage", "The Frontier Star", "The Causeway Fold", "The Mill Fold", "The Hospice Stair", "The Capital Lamp", "The Island Road", "The Old Crossing", "The Northern Fold", "The Cathedral Star", "The Valley Fold", "The Kept Ford", "The Long Lamp", "The Duchy Bridge", "The Canton Fold", "The Shore Star", "The Held Pass", "The Steady Road"];
LG_NAMES.forEach((n) => {
  const c = code("LG"); NAMES.add(n.toLowerCase()); const a = pick(LG_PLACES); let b = pick(LG_PLACES); while (b === a) b = pick(LG_PLACES);
  const fold = /fold|bridge|crossing|road|pass|stair|ford|door|passage|causeway|gate/i.test(n);
  const eqn = "8." + (EXISTING.length + OUT.length + 1);
  const prose = fill(pick(fold ? LG_FOLD : LG_STAR), { a, b }) + ". " + pick(LG_TAIL) + " " + aside({ eq: eqn, code: pick(EXISTING.filter((e) => /^LG-/.test(e.c)).map((e) => e.c)) });
  OUT.push({ c, n, t: "Legend", prose, form: fold ? ["Xi_overlay_" + X(c) + "(A, B) = Xi_overlay(A, B)   [Eq. 4.1],   R_dom, t_dom -> t_dom_legend   (Eq. 3.1g)", "t_drift = L_dom / v_survey * eta_" + X(c) + "      -- the order's re-validation cadence"] : ["Curv(g)_" + X(c) + "(r) = Curv(g)(r)   [Eq. 4.12],   t_dom -> t_dom_legend   (Eq. 3.1g)", "t_recert = t_recert_0 * eta_" + X(c) + "      -- re-inscription interval for Fid_shell"], base: fold ? "4.22" : "4.23", desc: "Working form of Eq. " + (fold ? "4.22" : "4.23") + " for " + n + " (" + c + "): `eta_" + X(c) + "` is the standing work's upkeep factor, the one number its order actually argues about." });
});
/* Beyond Legend: fragments toward the four paths */
const AS_PATHS = [["Tetrarch", "4.24", "Coh_tetrarch_" + "{X} = average of Chi(f1, f2) over the pairs the aspirant held,   -> 1 never reached"], ["Demiurge", "4.25", "N_family_{X} = |Gen_partial(dM)| along one proven rule r"], ["Cosmographer", "4.26", "rho_cosmo_{X} = R_dom_achieved / R_dom_legend_typical"], ["Communion", "4.27", "N_comm_{X} = | dM_total | / | dM_legend_typical |"]];
const AS_WORK = { Tetrarch: ["an aspirant who expressed one effect through each force in turn until witnesses could not say which served", "a signature working chaining the solved pairs so tightly that the seams showed only to Eq. 4.24's audit"], Demiurge: ["a life spent driving one extrapolation rule along a single family past every verification anyone would count", "an aspirant who originated, by a proven rule, a substance no assay had seen and no assay could fault"], Cosmographer: ["a campaign to push one closed-form domain outward ring by re-proven ring, each ring dearer than the last", "a standing work's `t_dom` pressed past Legend's until the resurveys outran the surveyors"], Communion: ["several practitioners' proven `dM` pooled for one collective casting, and the cost recorded honestly", "a merge of comprehension domains that produced one great working and, the records note, fewer practitioners than it began with"] };
const AS_NAMES = ["The Fifth Servant", "The Unfinished Alloy", "The Outer Ring", "The Shared Boundary", "The Four-Fold Vigil", "The Rule of One Family", "The Far Survey", "The Bound Assembly", "The Rotation of Forces", "The Thousandth Proof", "The Widening Year", "The Pooled Word", "The Even Hand", "The New Salt", "The Last Ring", "The Silent Council", "The Facet Working", "The Origin Rule", "The Unbounded Map", "The Merged Ledger", "The Distance Kept"];
AS_NAMES.forEach((n, i) => {
  const p = AS_PATHS[i % 4]; const c = code("AS"); NAMES.add(n.toLowerCase());
  const eqn = "8." + (EXISTING.length + OUT.length + 1);
  const prose = "a " + p[0] + " fragment: " + pick(AS_WORK[p[0]]) + ". Quantified after the fact by Eq. " + p[1] + ", and catalogued, as every entry at this tier is, for what it proves about the distance rather than as a route across it. " + aside({ eq: eqn, code: pick(EXISTING.filter((e) => /^AS-/.test(e.c)).map((e) => e.c)) });
  OUT.push({ c, n, t: "Beyond Legend", prose, form: [p[2].replace("{X}", X(c))], base: p[1], desc: "Working form of Eq. " + p[1] + " for " + n + " (" + c + "): the fragment's own measured value of the path's closeness proxy, recorded once and never bettered." });
});
if (OUT.length !== 2061) throw new Error("expected 2061 new entries, made " + OUT.length);

/* ───────── working forms for the founding 439 ───────── */
function inferForm(e){
  const body = bodyOf(e.c).toLowerCase(); const x = X(e.c);
  const m = e.c.match(/^N-(EM|GR|ST|WK)-/);
  if (m) {
    const f = m[1]; let cls;
    if (f === "EM") cls = /sense|read|listen|detect/.test(body) ? "read" : /chill|cold|frost|cool/.test(body) ? "chill" : /spark|discharge|signal|flash/.test(body) ? "spark" : /glow|light|lamp|lumen|shine/.test(body) ? "light" : /dry|cure/.test(body) ? "dry" : "warm";
    else if (f === "GR") cls = /heav|weigh|ballast|anchor/.test(body) ? "weigh" : /fall|drop|descen/.test(body) ? "slowfall" : /stead|sway|wheel|balance/.test(body) ? "steady" : /flow|pour|drain/.test(body) ? "flow" : /hover|float/.test(body) ? "hover" : "lift";
    else if (f === "ST") cls = /brittle|split|shear|cleave|part/.test(body) ? "brittle" : /seal|caulk|leak/.test(body) ? "seal" : /edge|blade|sharp/.test(body) ? "edge" : /temper|spring/.test(body) ? "temper" : /hold|gale|prop/.test(body) ? "holdfast" : "bind";
    else cls = /slow|arrest|preserv|reverse/.test(body) ? "arrest" : /ripen|cure|mellow|age/.test(body) ? "ripen" : /tarnish|patina|weather/.test(body) ? "age" : /warm/.test(body) ? "warmfaint" : "glow";
    const C = CLASSES[f].find((k) => k.k === cls); const mode = /held|hold|t_hold|sustain/.test(body) && MODES[cls].indexOf("held") >= 0 ? "held" : MODES[cls][0];
    return { form: C.form(x, mode), base: C.base, desc: "Working form of Eq. " + C.base + " for " + e.n + " (" + e.c + "): `eta_" + x + "` is " + C.meaning + "." };
  }
  if (/^J-/.test(e.c)) { const comps = (bodyOf(e.c).match(/\b(N-(?:EM|GR|ST|WK)-\d+|Eq\. 4\.0[a-e])\b/g) || []).slice(0, 2); const a = comps[0] || "N-EM-01", b = comps[1] || "N-GR-01"; return { form: ["X_seq(t) = X_" + X(a.replace("Eq. ", "Eq")) + "(t) * Win_1(t) + X_" + X(b.replace("Eq. ", "Eq")) + "(t) * Win_2(t)", "Win_1(t) . Win_2(t) = 0", "t_round = N_rep * (w_1 + w_2) + (2 * N_rep - 1) * tau_switch"], base: "4.13", desc: "Working form of Eq. 4.13 for " + e.n + " (" + e.c + "): the two windows carry " + a + " and " + b + "; the round is timed by `tau_switch` alone." }; }
  if (/^AD-/.test(e.c)) { const pm = bodyOf(e.c).match(/\((EM|Gravity|Strong|Weak) \+ (EM|Gravity|Strong|Weak)\)/); const a = pm ? pm[1] : "EM", b = pm ? pm[2] : "Strong"; return { form: ["X_combo = k_" + (a === "EM" ? "EM" : a.toLowerCase()) + " * k_" + (b === "EM" ? "EM" : b.toLowerCase()) + " * Fid^2 * Chi(" + a + ", " + b + ") * eta_" + x + " * dAe_local"], base: "4.15", desc: "Working form of Eq. 4.15 for " + e.n + " (" + e.c + "), on the " + a + " + " + b + " pair: `eta_" + x + "` is how much of the blended distortion reaches what the entry aims it at." }; }
  if (/^AR-/.test(e.c)) return { form: ["Effect_i = lam_i * Fid * dAe_local * eta_" + x + ",      e_i in S_" + x + "   (S per Eq. 3.1e)"], base: "4.16", desc: "Working form of Eq. 4.16 for " + e.n + " (" + e.c + "): `S_" + x + "` is the entry's solved eigenvector family and `eta_" + x + "` how much of the workpiece lies within it." };
  if (/^M-/.test(e.c)) { const s = /s = -1|arrest|slow/.test(bodyOf(e.c)) ? "-1" : "+1"; return { form: ["E_bind_eff(x) = E_bind(x) * (1 + s * c_M * Fid * eta_" + x + ")", "Gamma_eff(x)   = Gamma_0(x) * (1 + s * c_M * Fid * eta_" + x + "),      s = " + s + "   (S complete)"], base: "4.19", desc: "Working form of Eq. 4.19 for " + e.n + " (" + e.c + "): `eta_" + x + "` is the share of the domain the standing presence covers." }; }
  if (/^W-/.test(e.c)) return { form: ["delta(g)_" + x + " = eps * Xi_1 * Bump(r, R_proven) * G_site", "eps <= eps_valid(R_proven)   (Eq. 4.21)"], base: "4.20", desc: "Working form of Eq. 4.20 for " + e.n + " (" + e.c + "): `G_site` is the proven geometry's site factor, fixed by its survey." };
  if (/^LG-/.test(e.c)) { const fold = /fold|overlay|stair|road|pass|river|bridge/i.test(bodyOf(e.c)); return { form: fold ? ["Xi_overlay_" + x + "(A, B) = Xi_overlay(A, B)   [Eq. 4.1],   t_dom -> t_dom_legend", "t_drift = L_dom / v_survey * eta_" + x] : ["Curv(g)_" + x + "(r) = Curv(g)(r)   [Eq. 4.12],   t_dom -> t_dom_legend", "t_recert = t_recert_0 * eta_" + x], base: fold ? "4.22" : "4.23", desc: "Working form of Eq. " + (fold ? "4.22" : "4.23") + " for " + e.n + " (" + e.c + "): `eta_" + x + "` is the standing work's upkeep factor." }; }
  const p = /tetrarch|four/i.test(bodyOf(e.c)) ? AS_PATHS[0] : /demiurge|alloy|family/i.test(bodyOf(e.c)) ? AS_PATHS[1] : /cosmograph|ring|domain/i.test(bodyOf(e.c)) ? AS_PATHS[2] : AS_PATHS[3];
  return { form: [p[2].replace("{X}", x)], base: p[1], desc: "Working form of Eq. " + p[1] + " for " + e.n + " (" + e.c + "): the fragment's measured closeness proxy." };
}
const WF = EXISTING.map((e) => Object.assign({ c: e.c, n: e.n, t: null }, inferForm(e))).concat(OUT.map((o) => ({ c: o.c, n: o.n, form: o.form, base: o.base, desc: o.desc })));
if (WF.length !== 2500) throw new Error("expected 2500 working forms, made " + WF.length);

/* ───────── write the directory expansion ───────── */
const tierOf = (t) => OUT.filter((o) => o.t === t);
let md = `### Directory Expansion III (v2.7) — 2,061 Further Named Techniques

*Added in v2.7, and the last expansion the directory needs: with it the catalogue stands at 2,500 named techniques. Entry codes continue from Expansion II: Novice from N-EM-${MAXN["N-EM"] - 219} / N-GR-${MAXN["N-GR"] - 199} / N-ST-${MAXN["N-ST"] - 199} / N-WK-${MAXN["N-WK"] - 179}, Journeyman from J-${MAXN.J - 299}, Adept from AD-${MAXN.AD - 359}, Artisan from AR-${MAXN.AR - 259}, Master from M-${MAXN.M - 159}, Warden from W-${MAXN.W - 119}, Legend from LG-${MAXN.LG - 39}, Ascension from AS-${MAXN.AS - 20}. Prevalence weighting follows §3.3's rarity table as before: Novice 800, Journeyman 300, Adept 360, Artisan 260, Master 160, Warden 120, Legend 40, Beyond Legend 21. Sovereign remains uncatalogued by design (§4.1–§4.3). One thing is new: every entry in the directory, founding and expansion alike, now has a* working form *— its tier's base equation specialised to it — numbered Eq. 8.1–8.2500 in directory order and housed in \`codex/working-equations.md\` (§8). Each entry below cites its own.*

#### How to read this expansion

All the earlier reading rules carry forward unchanged: single-channel \`delta(F_f)\` distortions (or sourceless passive reads) at Novice; Eq. 4.13's disjoint windows at Journeyman, each entry naming its two Novice components; only the six \`Chi(f1,f2)\` pairs at Adept, each entry naming its pair; one signature material per Artisan entry (Eq. 3.1e, 4.16) with its Eq. 4.17 neighbours named; complete-\`S\` workings at Master (Eq. 4.18–4.19); one proven geometry per Warden entry (Eq. 4.20–4.21); institutions at Legend (Eq. 4.22–4.23); fragments toward the four paths at Beyond Legend (Eq. 4.24–4.27). A working form adds one thing to its base equation: a shape factor \`eta_<code>\` (defined in §5) whose meaning the form states in words. Where an entry mentions \`t_hold\`, \`theta_arc\`, \`T_pulse\` or \`D_cycle\`, those are §5's directory-local symbols.

---

`;
const byForce = (f) => tierOf("Novice").filter((o) => o.force === f);
md += "#### Novice (Common) — 800 entries\n\n";
[["EM", "*Electromagnetic (`k_EM`)* — extends Eq. 4.0a; passive reads extend Eq. 4.0e."], ["Gravity", "*Gravity (`k_grav`)* — extends Eq. 4.0b."], ["Strong", "*Strong (`k_strong`)* — extends Eq. 4.0c."], ["Weak", "*Weak (`k_weak`)* — extends Eq. 4.0d. Faint by nature, as ever; every entry below says so in its own way."]].forEach((f) => { md += f[1] + "\n\n"; byForce(f[0]).forEach((o) => { md += "**[" + o.c + "] " + o.n + "**\n" + o.prose + "\n\n"; }); });
md += "#### Journeyman (Common) — 300 entries\n\n*Two closed-form castings held without blending under Eq. 4.13's disjoint windows; every entry names its two components by code, and the components are Novice work.*\n\n";
tierOf("Journeyman").forEach((o) => { md += "**[" + o.c + "] " + o.n + "** — " + o.prose + "\n\n"; });
md += "#### Adept (Uncommon) — 360 entries\n\n*Sixty deepenings of each of the six solved `Chi(f1,f2)` pairs, under Eq. 4.15's `Fid^2` accounting; still no seventh pair.*\n\n";
PAIRS.forEach((p) => { md += "*(" + p[0] + " + " + p[1] + " — the " + p[3] + " pair, " + p[2] + ")*\n\n"; tierOf("Adept").filter((o) => o.pair === p[0] + "+" + p[1]).forEach((o) => { md += "**[" + o.c + "] " + o.n + "**\n" + o.prose + "\n\n"; }); });
md += "#### Artisan (Uncommon) — 260 entries\n\n*One signature material per entry, one solved eigenvector family in `S` (Eq. 3.1e) worked through Eq. 4.16, and the neighbours it does not cover named, in the tradition of AR-01 through AR-07.*\n\n";
tierOf("Artisan").forEach((o) => { md += "**[" + o.c + "] " + o.n + "** — " + o.prose + "\n\n"; });
md += "#### Master (Rare) — 160 entries\n\n*Complete-`S` workings (Eq. 4.18–4.19), each naming the sign it was inscribed with.*\n\n";
tierOf("Master").forEach((o) => { md += "**[" + o.c + "] " + o.n + "** — " + o.prose + "\n\n"; });
md += "#### Warden (Very Rare) — 120 entries\n\n*Each entry names its proven geometry and ends at `eps_valid(R_proven)` (Eq. 4.20–4.21); catalogable only because the geometry is a published class.*\n\n";
tierOf("Warden").forEach((o) => { md += "**[" + o.c + "] " + o.n + "** — " + o.prose + "\n\n"; });
md += "#### Legend (A Handful Across Recorded History) — 40 entries\n\n*Standing works under Eq. 4.22–4.23; every one an institution.*\n\n";
tierOf("Legend").forEach((o) => { md += "**[" + o.c + "] " + o.n + "** — " + o.prose + "\n\n"; });
md += "#### Beyond Legend (Historical Fragments) — 21 entries\n\n*Fragments toward the four paths of §3.3, quantified by Eq. 4.24–4.27.*\n\n";
tierOf("Beyond Legend").forEach((o) => { md += "**[" + o.c + "] " + o.n + "** — " + o.prose + "\n\n"; });
fs.writeFileSync(path.join(ROOT, "codex", "spell-directory-iii.md"), md);

/* ───────── write the working forms ───────── */
let wq = `# THE AETHER CODEX — Working Forms
### §8 Working Forms of the Spell Directory · Eq. 8.1–8.2500

*Part of the Aether Codex reference set — see \`codex/overview.md\` for the file map. All § and Eq. numbers are global across the Codex. Added in v2.7.*

---

## 8. Working Forms

A Directory entry names a technique; its *working form* is the tier's base equation written for that one technique, so that a manuscript can put a number to it without re-deriving the mechanics. Every form here is the base equation of its tier (Eq. 4.0a–4.0e at Novice, 4.13 at Journeyman, 4.15 at Adept, 4.16–4.17 at Artisan, 4.19 at Master, 4.20–4.21 at Warden, 4.22–4.23 at Legend, 4.24–4.27 at Beyond Legend) with exactly one thing added: a shape factor \`eta_<code>\`, a dimensionless number between 0 and 1 fixed by the geometry of the technique's usual target, whose meaning the form states in words. Where the base equation already carries a direction (\`s\`), a duration (\`t_hold\`), a duty (\`D_cycle\`), an arc (\`theta_arc\`) or a pulse period (\`T_pulse\`), the form says which applies. Nothing in a working form changes the base equation; a working form with \`eta = 1\` *is* the base equation.

The forms are numbered Eq. 8.1–8.2500 in Directory order: the founding entries and Expansions I–III first as the Directory lists them, then Expansion III. The symbols they introduce (\`eta_<code>\`, \`S_<code>\`, \`G_site\`, \`D_cycle\`, \`theta_arc\`, \`T_pulse\`, \`R_reach\`, \`N_rep\`, \`w_1\`, \`w_2\`, \`m_t\`, \`A_t\`, \`T_target\`, \`T_amb\`, \`h_loss\`, \`h_vap\`, \`V_break\`, \`L_dom\`, \`v_survey\`) are defined in §5.

---

`;
let lastTier = "";
const TIER_HEAD = { N: "8.1 Novice working forms", J: "8.2 Journeyman working forms", AD: "8.3 Adept working forms", AR: "8.4 Artisan working forms", M: "8.5 Master working forms", W: "8.6 Warden working forms", LG: "8.7 Legend working forms", AS: "8.8 Beyond Legend working forms" };
WF.forEach((w, i) => {
  const pre = w.c.split("-")[0]; const n = "8." + (i + 1);
  w.eq = n;
  wq += "**Eq. " + n + " — " + w.n + " (" + w.c + "), working form**\n```\n" + w.form.join("\n") + "\n```\n" + w.desc + " Base: Eq. " + w.base + "; entry: " + w.c + ".\n\n";
});
// insert tier headings by first occurrence
for (const pre of Object.keys(TIER_HEAD)) { const first = WF.find((w) => w.c.split("-")[0] === pre); if (!first) continue; const marker = "**Eq. " + first.eq + " — "; wq = wq.replace(marker, "#### " + TIER_HEAD[pre] + "\n\n" + marker); }
fs.writeFileSync(path.join(ROOT, "codex", "working-equations.md"), wq);
console.log("wrote codex/spell-directory-iii.md: " + OUT.length + " entries (" + ["Novice", "Journeyman", "Adept", "Artisan", "Master", "Warden", "Legend", "Beyond Legend"].map((t) => t + " " + tierOf(t).length).join(", ") + ")");
console.log("wrote codex/working-equations.md: " + WF.length + " working forms, Eq. 8.1–8." + WF.length);
