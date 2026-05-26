#!/usr/bin/env node
// Generate preview.html by injecting carousel data into the template.
//
// Usage:
//   node tools/generate-preview.mjs [data.json] [out.html]
// Defaults:
//   data  = data/carousels.json
//   out   = preview.html
//
// Edit the JSON, re-run this, refresh the browser. Never hand-edit the
// generated preview.html — your changes get overwritten on the next run.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const dataPath = resolve(root, process.argv[2] || "data/carousels.json");
const outPath = resolve(root, process.argv[3] || "preview.html");
const tplPath = resolve(root, "templates/preview.template.html");
const TOKEN = "/* __INJECTED_DATA__ */";

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(dataPath, "utf8"));
} catch (e) {
  fail(`Could not read/parse ${dataPath}: ${e.message}`);
}

const project = data.project || {
  client: "Untitled",
  generatedAt: new Date().toISOString().slice(0, 10),
};
const carousels = Array.isArray(data.carousels) ? data.carousels : [];

// Validate shape early so reviewers never open a broken file.
const ids = new Set();
carousels.forEach((c, i) => {
  if (!c.id) fail(`carousel #${i + 1} is missing "id"`);
  if (ids.has(c.id)) fail(`duplicate carousel id "${c.id}"`);
  ids.add(c.id);
  if (!Array.isArray(c.slides) || c.slides.length === 0)
    fail(`carousel "${c.id}" has no slides`);
});

const tpl = readFileSync(tplPath, "utf8");
if (!tpl.includes(TOKEN)) fail(`template ${tplPath} is missing ${TOKEN}`);

// Escape "<" so a heading containing "</script>" can't break out of the tag.
const safe = (obj) => JSON.stringify(obj, null, 2).replace(/</g, "\\u003c");
const injected =
  `const PROJECT = ${safe(project)};\n\n` +
  `const CAROUSELS = ${safe(carousels)};`;

writeFileSync(outPath, tpl.replace(TOKEN, injected));

const slideCount = carousels.reduce((n, c) => n + c.slides.length, 0);
console.log(
  `✓ Wrote ${outPath}\n  ${carousels.length} carousels · ${slideCount} slides · client "${project.client}"`
);
