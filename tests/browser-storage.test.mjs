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
}
class MemoryMetadata {
  constructor() { this.value = null; }
  getItem() { return this.value; }
  setItem(_key, value) { this.value = value; }
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
