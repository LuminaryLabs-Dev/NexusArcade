import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  seen = new Set();
async function walk(file) {
  file = path.resolve(file);
  if (seen.has(file)) return;
  seen.add(file);
  assert(
    !file.includes(path.sep + "generation" + path.sep),
    "Browser reaches generation: " + file,
  );
  const s = await readFile(file, "utf8");
  const imports = [
    ...s.matchAll(
      /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*|\brequire\s*\(\s*)["']([^"']+)["']/g,
    ),
  ].map((x) => x[1]);
  for (const id of imports) {
    assert(!id.startsWith("node:"), "Browser imports Node: " + id);
    assert(id.startsWith("."), "Unexpected external browser dependency: " + id);
    await walk(path.resolve(path.dirname(file), id));
  }
}
for (const dir of ["src/core", "src/browser", "dist/browser"])
  for (const e of await readdir(dir, { withFileTypes: true }))
    if (e.isFile() && e.name.endsWith(".mjs"))
      await walk(path.join(root, dir, e.name));
console.log(
  `Browser boundary: ${seen.size} transitive modules, no Node/generation imports`,
);
