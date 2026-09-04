import test from "node:test";
import assert from "node:assert/strict";
import { sample } from "../../generation/supply/sampler.mjs";
import { distinct } from "../../generation/supply/diversity.mjs";
test("same seed and history replay sampling; three sequential samples cover three modes", async () => {
  assert.deepEqual(await sample(100), await sample(100));
  const h = [];
  for (let i = 0; i < 3; i++) h.push(await sample(73019 + i * 101, h));
  assert.equal(new Set(h.map((s) => s.modes)).size, 3);
  assert.equal(distinct(h[0], h), false);
});
