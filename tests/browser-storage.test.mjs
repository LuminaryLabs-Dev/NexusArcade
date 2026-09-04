import test from "node:test";
import assert from "node:assert/strict";
import { CacheStorageAdapter, gameCacheName } from "../src/browser/cache-storage.mjs";

class MemoryCache {
  constructor() { this.entries = new Map(); }
  async put(request, response) { this.entries.set(String(request), response.clone()); }
  async keys() { return [...this.entries.keys()]; }
  async match(request) { return this.entries.get(String(request))?.clone(); }
}
class MemoryCaches {
  constructor() { this.values = new Map(); }
  async open(name) { if (!this.values.has(name)) this.values.set(name, new MemoryCache()); return this.values.get(name); }
  async has(name) { return this.values.has(name); }
  async delete(name) { return this.values.delete(name); }
  async keys() { return [...this.values.keys()]; }
}
class MemoryMetadata {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
}

const manifest = { id: "NXA-000001", version: "1.0.0", entry: "index.html" };

test("browser storage stages files before activating an immutable version cache", async () => {
  const caches = new MemoryCaches();
  const metadata = new MemoryMetadata();
  const storage = new CacheStorageAdapter({ cacheStorage: caches, metadataStorage: metadata, origin: "https://luminarylabs.dev" });
  await storage.begin(manifest);
  const stage = storage.stagingName;
  await storage.write(manifest, { path: "index.html", sha256: "a".repeat(64) }, new TextEncoder().encode("<h1>Game</h1>"), "text/plain");
  assert(await caches.has(stage));
  assert(!(await caches.has(gameCacheName(manifest.id, manifest.version))));
  const result = await storage.commit(manifest);
  assert(!(await caches.has(stage)));
  assert(await caches.has(gameCacheName(manifest.id, manifest.version)));
  const installed = await caches.open(gameCacheName(manifest.id, manifest.version));
  const cached = await installed.match("https://luminarylabs.dev/nexus-arcade/runtime/NXA-000001/1.0.0/index.html");
  assert.equal(cached.headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(result.launchPath, "/nexus-arcade/runtime/NXA-000001/1.0.0/index.html");
  assert.equal(storage.isInstalled(manifest), true);
});

test("browser storage abort removes only the staging cache", async () => {
  const caches = new MemoryCaches();
  const storage = new CacheStorageAdapter({ cacheStorage: caches, metadataStorage: new MemoryMetadata(), origin: "https://luminarylabs.dev" });
  await storage.begin(manifest);
  const stage = storage.stagingName;
  await storage.abort();
  assert(!(await caches.has(stage)));
});

test("removing a game deletes only its asset cache and installation metadata", async () => {
  const caches = new MemoryCaches();
  const metadata = new MemoryMetadata();
  metadata.setItem("game-save:NXA-000001", JSON.stringify({ score: 42 }));
  const storage = new CacheStorageAdapter({ cacheStorage: caches, metadataStorage: metadata, origin: "https://luminarylabs.dev", sessionId: "session_1234567890" });
  await storage.begin(manifest);
  await storage.write(manifest, { path: "index.html", sha256: "a".repeat(64) }, new TextEncoder().encode("game"));
  await storage.commit(manifest);
  await caches.open("website-shell-cache");
  await storage.remove(manifest);
  assert(!(await caches.has(gameCacheName(manifest.id, manifest.version))));
  assert(await caches.has("website-shell-cache"));
  assert.equal(storage.isInstalled(manifest), false);
  assert.deepEqual(JSON.parse(metadata.getItem("game-save:NXA-000001")), { score: 42 });
});

test("startup recovery removes stale sessions, orphaned assets and staging caches", async () => {
  const caches = new MemoryCaches();
  const metadata = new MemoryMetadata();
  const storage = new CacheStorageAdapter({ cacheStorage: caches, metadataStorage: metadata, origin: "https://luminarylabs.dev", sessionId: "old_session_123456" });
  await storage.begin(manifest);
  await storage.write(manifest, { path: "index.html", sha256: "a".repeat(64) }, new TextEncoder().encode("game"));
  await storage.commit(manifest);
  await caches.open("nexus-arcade-game-NXA-000002-1.0.0");
  await caches.open("nexus-arcade-game-NXA-000003-1.0.0-staging-123-abcdef");
  await caches.open("unrelated-cache");
  const result = await storage.removeStaleSessions("new_session_123456");
  assert.deepEqual(result.stale, [{ id: "NXA-000001", version: "1.0.0" }]);
  assert(!(await caches.has("nexus-arcade-game-NXA-000001-1.0.0")));
  assert(!(await caches.has("nexus-arcade-game-NXA-000002-1.0.0")));
  assert(!(await caches.has("nexus-arcade-game-NXA-000003-1.0.0-staging-123-abcdef")));
  assert(await caches.has("unrelated-cache"));
  assert.deepEqual(storage.listInstalled(), {});
});

test("session metadata release returns only validated cache coordinates", async () => {
  const caches = new MemoryCaches();
  const metadata = new MemoryMetadata();
  const storage = new CacheStorageAdapter({ cacheStorage: caches, metadataStorage: metadata, origin: "https://luminarylabs.dev", sessionId: "session_1234567890" });
  await storage.begin(manifest);
  await storage.write(manifest, { path: "index.html", sha256: "a".repeat(64) }, new TextEncoder().encode("game"));
  await storage.commit(manifest);
  assert.deepEqual(storage.releaseSessionMetadata("session_1234567890"), [{ id: "NXA-000001", version: "1.0.0" }]);
  assert.deepEqual(storage.listInstalled(), {});
  assert(await caches.has(gameCacheName(manifest.id, manifest.version)));
});
