import test from "node:test";
import assert from "node:assert/strict";
import { sha256, verifyFile } from "../src/core/integrity.mjs";

test("SHA-256 and byte length are verified", async () => {
  const bytes = new TextEncoder().encode("nexus arcade");
  const digest = await sha256(bytes);
  assert.equal(digest, "ea0f28afcc135d32fe6ca9fe3df491acd542eddfa3d0b8a7b17a162c30f80ce5");
  await verifyFile(bytes, { path: "index.html", bytes: 12, sha256: digest });
  await assert.rejects(() => verifyFile(bytes, { path: "index.html", bytes: 12, sha256: "0".repeat(64) }), /mismatch/);
  await assert.rejects(() => verifyFile(bytes, { path: "index.html", bytes: 13, sha256: digest }), /expected 13 bytes/);
});
