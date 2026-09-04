import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

async function files(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await files(file));
    else if (entry.isFile() && entry.name.endsWith(".mjs")) output.push(file);
  }
  return output;
}

const roots = ["src/core", "src/browser", "dist/browser"];
for (const root of roots) {
  for (const file of await files(root)) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /(?:from\s+|import\s*)["']node:/, `${file} imports a Node-only module`);
  }
}
console.log("browser boundary contains no Node-only imports");
