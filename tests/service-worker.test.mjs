import test from "node:test";
import assert from "node:assert/strict";
import {
  RELEASE_GAME_MESSAGE,
  RELEASE_SESSION_MESSAGE,
  installServiceWorkerHandlers,
  parseCleanupMessage,
  parseRuntimeRequest,
  releaseGameCaches,
} from "../src/browser/service-worker-handler.mjs";

test("service worker only parses the scoped runtime route", () => {
  assert.deepEqual(parseRuntimeRequest("https://luminarylabs.dev/nexus-arcade/runtime/NXA-000001/1.0.0/assets/game.js"), {
    id: "NXA-000001", version: "1.0.0", path: "assets/game.js", cacheName: "nexus-arcade-game-NXA-000001-1.0.0",
  });
  assert.equal(parseRuntimeRequest("https://luminarylabs.dev/index.html"), null);
  assert.throws(() => parseRuntimeRequest("https://luminarylabs.dev/nexus-arcade/runtime/nope/1.0.0/index.html"), /game ID/);
});

test("cleanup messages accept only calculated game cache coordinates", () => {
  assert.deepEqual(parseCleanupMessage({ type: RELEASE_GAME_MESSAGE, id: "NXA-000001", version: "1.0.0", cacheName: "victim" }), {
    type: RELEASE_GAME_MESSAGE,
    games: [{ id: "NXA-000001", version: "1.0.0" }],
  });
  assert.deepEqual(parseCleanupMessage({ type: RELEASE_SESSION_MESSAGE, sessionId: "session_1234567890", games: [{ id: "NXA-000001", version: "1.0.0" }] }), {
    type: RELEASE_SESSION_MESSAGE,
    sessionId: "session_1234567890",
    games: [{ id: "NXA-000001", version: "1.0.0" }],
  });
  assert.throws(() => parseCleanupMessage({ type: RELEASE_GAME_MESSAGE, id: "../../private", version: "1.0.0" }), /game ID/);
  assert.throws(() => parseCleanupMessage({ type: RELEASE_SESSION_MESSAGE, sessionId: "short", games: [] }), /session ID/);
  assert.equal(parseCleanupMessage({ type: "UNRELATED_MESSAGE", cacheName: "victim" }), null);
});

test("cleanup deletes only the cache name derived from a validated message", async () => {
  const deleted = [];
  const cacheStorage = { async delete(name) { deleted.push(name); return true; } };
  const result = await releaseGameCaches(cacheStorage, { type: RELEASE_GAME_MESSAGE, id: "NXA-000001", version: "1.0.0", cacheName: "victim" });
  assert.deepEqual(deleted, ["nexus-arcade-game-NXA-000001-1.0.0"]);
  assert.deepEqual(result.released, [{ id: "NXA-000001", version: "1.0.0" }]);
});

test("service worker ignores cleanup messages outside its own scope", async () => {
  const listeners = new Map();
  const deleted = [];
  const serviceWorker = {
    location: { origin: "https://luminarylabs.dev" },
    caches: { async delete(name) { deleted.push(name); return true; } },
    clients: { claim: async () => {} },
    skipWaiting: async () => {},
    addEventListener(type, listener) { listeners.set(type, listener); },
  };
  installServiceWorkerHandlers(serviceWorker, { scopePath: "/nexus-arcade/" });
  let pending = null;
  listeners.get("message")({
    source: { url: "https://luminarylabs.dev/private/" },
    data: { type: RELEASE_GAME_MESSAGE, id: "NXA-000001", version: "1.0.0" },
    waitUntil(value) { pending = value; },
  });
  assert.equal(pending, null);
  listeners.get("message")({
    source: { url: "https://luminarylabs.dev/nexus-arcade/" },
    data: { type: RELEASE_GAME_MESSAGE, id: "NXA-000001", version: "1.0.0" },
    waitUntil(value) { pending = value; },
  });
  await pending;
  assert.deepEqual(deleted, ["nexus-arcade-game-NXA-000001-1.0.0"]);
});
