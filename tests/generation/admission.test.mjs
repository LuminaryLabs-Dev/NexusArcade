import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, appendFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { assemble, hashManifest } from "../../generation/builders/assemble.mjs";
import { admit } from "../../generation/library/admit.mjs";
import { catalog } from "../../generation/library/catalog.mjs";
const spec = {
  schemaVersion: 1,
  id: "admit-test",
  seed: 1,
  title: "Garden Shift",
  premise: "Restore stations.",
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
  controls: "WASD",
};
test("admission rejects failures and stale evidence; repeated commit is idempotent", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "arcade-admit-"));
  try {
    const source = path.join(root, "source");
    const built = await assemble(spec, source);
    const report = {
      status: "PASS",
      browser: { playthrough: { pass: true } },
      artifactHash: hashManifest(built.files),
    };
    await assert.rejects(
      admit(root, spec, source, { ...report, status: "FAIL" }),
    );
    await admit(root, spec, source, report);
    await admit(root, spec, source, report);
    assert.equal((await catalog(root)).games.length, 1);
    await appendFile(path.join(source, "game.js"), "\n// changed");
    await assert.rejects(admit(root, spec, source, report), /stale/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
