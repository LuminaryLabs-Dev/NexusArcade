import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { assemble, hashManifest } from "../../generation/builders/assemble.mjs";
import { staticValidation } from "../../generation/validation/static.mjs";
export const spec = {
  schemaVersion: 1,
  id: "fixture",
  seed: 1,
  title: "Garden Shift",
  premise: "Restore the ceramic garden.",
  setting: "greenhouse",
  mode: "hold",
  palette: "jade",
  objectiveLabel: "Stations",
  hazardLabel: "Sentries",
  duration: 90,
  speed: 5,
  targetCount: 3,
  hazardCount: 1,
  stages: 3,
  interactionSeconds: 0.7,
  controls: "WASD and Space",
};
test("complete offline build is deterministic, syntax checked and bounded", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "arcade-build-"));
  try {
    const a = await assemble(spec, path.join(root, "a"));
    const b = await assemble(spec, path.join(root, "b"));
    assert.equal(hashManifest(a.files), hashManifest(b.files));
    const v = await staticValidation(path.join(root, "a"));
    assert.equal(v.status, "PASS", v.errors.join());
    assert(a.files.some((f) => f.path === "vendor/three/three.core.js"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
