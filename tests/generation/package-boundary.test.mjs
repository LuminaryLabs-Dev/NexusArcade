import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
test("generation is an explicit Node subpath; original exports remain", async () => {
  const p = JSON.parse(
    await readFile(new URL("../../package.json", import.meta.url)),
  );
  assert.equal(p.exports["./generation"], "./generation/index.mjs");
  assert.equal(p.exports["./browser"], "./dist/browser/nexus-arcade.mjs");
  assert(p.files.includes("generation"));
});
