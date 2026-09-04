import test from "node:test";
import assert from "node:assert/strict";
import { createProgress } from "../src/core/progress.mjs";

test("progress is byte-accurate", () => {
  const progress = createProgress({ id: "NXA-000001", version: "1.0.0", files: [{ path: "a", bytes: 1 }, { path: "b", bytes: 3 }] });
  assert.equal(progress.complete({ path: "a", bytes: 1 }).percent, 25);
  assert.deepEqual(progress.complete({ path: "b", bytes: 3 }), { id: "NXA-000001", version: "1.0.0", file: "b", completedBytes: 4, totalBytes: 4, completedFiles: 2, totalFiles: 2, percent: 100 });
});
