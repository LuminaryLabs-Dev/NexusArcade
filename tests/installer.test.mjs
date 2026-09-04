import test from "node:test";
import assert from "node:assert/strict";
import { installGame } from "../src/core/install-game.mjs";
import { sha256 } from "../src/core/integrity.mjs";

async function fixture() {
  const files = [new TextEncoder().encode("<h1>Arcade</h1>"), new TextEncoder().encode("body{}")];
  return {
    payloads: files,
    manifest: {
      schemaVersion: 1,
      id: "NXA-000001",
      slug: "fixture",
      version: "1.0.0",
      entry: "index.html",
      offlineReady: true,
      source: { repository: "LuminaryLabs-Dev/NexusArcade-Prototypes", ref: "a".repeat(40), basePath: "prototypes/fixture" },
      files: [
        { path: "index.html", bytes: files[0].byteLength, sha256: await sha256(files[0]) },
        { path: "style.css", bytes: files[1].byteLength, sha256: await sha256(files[1]) },
      ],
    },
  };
}

test("installer downloads sequentially, reports progress and commits", async () => {
  const { manifest, payloads } = await fixture();
  const events = [];
  const storage = { begin: async () => events.push("begin"), write: async (_m, file) => events.push(file.path), commit: async () => ({ active: true }), abort: async () => events.push("abort") };
  let index = 0;
  const progress = [];
  const result = await installGame({ manifest, storage, fetchImpl: async () => new Response(payloads[index++]), onProgress: (value) => progress.push(value.percent) });
  assert.deepEqual(events, ["begin", "index.html", "style.css"]);
  assert.deepEqual(progress, [71.43, 100]);
  assert.equal(result.active, true);
});

test("installer aborts without commit when integrity fails", async () => {
  const { manifest } = await fixture();
  const events = [];
  const storage = { begin: async () => events.push("begin"), write: async () => events.push("write"), commit: async () => events.push("commit"), abort: async () => events.push("abort") };
  await assert.rejects(() => installGame({ manifest, storage, fetchImpl: async () => new Response("corrupt") }), /expected|mismatch/);
  assert.deepEqual(events, ["begin", "abort"]);
});

test("installer aborts an interrupted installation", async () => {
  const { manifest } = await fixture();
  const controller = new AbortController();
  controller.abort(new Error("interrupted"));
  const events = [];
  const storage = { begin: async () => events.push("begin"), write: async () => {}, commit: async () => {}, abort: async () => events.push("abort") };
  await assert.rejects(() => installGame({ manifest, storage, fetchImpl: async () => new Response(), signal: controller.signal }), /interrupted/);
  assert.deepEqual(events, ["begin", "abort"]);
});
