#!/usr/bin/env node
/*
  tools/embed.mjs — builds src/codex-vectors.json, the semantic half of the
  tutor's retrieval, by asking a deployed copy of the Worker to embed every
  chunk of src/codex-index.json with Workers AI's bge-small model.

    node tools/embed.mjs https://aether.aethersys.workers.dev

  Run it after `node tools/build.js` whenever the Codex changes (the Worker
  checks the index hash and falls back to word search alone if the vectors
  are stale). Vectors are unit-normalised and stored as int8 in base64, so
  753 passages cost about 290 KB. No keys: /api/embed is public but batch-
  limited and behind the same per-IP limiter as every other endpoint.
*/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = (process.argv[2] || "").replace(/\/$/, "");
if (!base) { console.error("usage: node tools/embed.mjs <https://worker-url>"); process.exit(1); }
const INDEX = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "codex-index.json"), "utf8"));
const BATCH = 48;
const out = [];
let model = "", dims = 0;
for (let i = 0; i < INDEX.chunks.length; i += BATCH) {
  const texts = INDEX.chunks.slice(i, i + BATCH).map((c) => (c.t + "\n" + c.x).slice(0, 2400));
  let res, j;
  for (let attempt = 0; attempt < 5; attempt++) {
    res = await fetch(base + "/api/embed", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ texts }) });
    if (res.status === 429) { const wait = 30 * (attempt + 1); console.error("rate limited; waiting " + wait + "s"); await new Promise((r) => setTimeout(r, wait * 1000)); continue; }
    j = await res.json();
    if (res.ok && j.vectors) break;
    console.error("attempt " + (attempt + 1) + " failed: " + (j && j.error || res.status)); await new Promise((r) => setTimeout(r, 3000));
  }
  if (!j || !j.vectors) { console.error("giving up"); process.exit(2); }
  model = j.model; dims = j.dims;
  for (const v of j.vectors) { let n = 0; for (const x of v) n += x * x; n = Math.sqrt(n) || 1; out.push(Int8Array.from(v.map((x) => Math.max(-127, Math.min(127, Math.round(x / n * 127)))))); }
  process.stderr.write("embedded " + Math.min(i + BATCH, INDEX.chunks.length) + "/" + INDEX.chunks.length + "\r");
}
const all = new Int8Array(out.length * dims); out.forEach((v, i) => all.set(v, i * dims));
const q = Buffer.from(all.buffer).toString("base64");
fs.writeFileSync(path.join(ROOT, "src", "codex-vectors.json"), JSON.stringify({ model, dims, n: out.length, hash: INDEX.hash, version: INDEX.version, q }));
console.error("\nwrote src/codex-vectors.json: " + out.length + " × " + dims + " (" + (q.length / 1024).toFixed(0) + " KB) for index " + INDEX.hash);
