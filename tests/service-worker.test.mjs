import test from "node:test";
import assert from "node:assert/strict";
import { parseRuntimeRequest } from "../src/browser/service-worker-handler.mjs";

test("service worker only parses the scoped runtime route", () => {
  assert.deepEqual(parseRuntimeRequest("https://luminarylabs.dev/nexus-arcade/runtime/NXA-000001/1.0.0/assets/game.js"), {
    id: "NXA-000001", version: "1.0.0", path: "assets/game.js", cacheName: "nexus-arcade-game-NXA-000001-1.0.0",
  });
  assert.equal(parseRuntimeRequest("https://luminarylabs.dev/index.html"), null);
  assert.throws(() => parseRuntimeRequest("https://luminarylabs.dev/nexus-arcade/runtime/nope/1.0.0/index.html"), /game ID/);
});
