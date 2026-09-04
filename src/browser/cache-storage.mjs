import { assertGameId, assertSafeRelativePath, assertVersion, virtualGamePath } from "../core/paths.mjs";

export const CACHE_PREFIX = "nexus-arcade-game-";
export const INSTALLED_METADATA_KEY = "nexus-arcade-installed";

const FINAL_CACHE_PATTERN = /^nexus-arcade-game-(NXA-\d{6})-(\d+\.\d+\.\d+)$/;
const STAGING_CACHE_PATTERN = /^nexus-arcade-game-(NXA-\d{6})-(\d+\.\d+\.\d+)-staging-\d+-[a-f0-9]+$/;

export function assertSessionId(value) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{16,128}$/.test(value)) throw new TypeError("Invalid Nexus Arcade session ID");
  return value;
}

function cacheName(manifest) {
  return `${CACHE_PREFIX}${manifest.id}-${manifest.version}`;
}

function contentType(path, declared) {
  const extension = path.split(".").pop()?.toLowerCase();
  const known = ({
    html: "text/html; charset=utf-8",
    css: "text/css; charset=utf-8",
    js: "text/javascript; charset=utf-8",
    mjs: "text/javascript; charset=utf-8",
    json: "application/json; charset=utf-8",
    png: "image/png",
    webp: "image/webp",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    wav: "audio/wav",
    mp3: "audio/mpeg",
    wasm: "application/wasm",
  })[extension];
  return known || (declared && declared !== "application/octet-stream" ? declared : "application/octet-stream");
}

export class CacheStorageAdapter {
  constructor({ cacheStorage = globalThis.caches, origin = globalThis.location?.origin, scopePath = "/nexus-arcade/", metadataStorage = globalThis.localStorage, sessionId = null } = {}) {
    if (!cacheStorage || !origin) throw new TypeError("Cache Storage and an origin are required");
    this.caches = cacheStorage;
    this.origin = origin;
    this.scopePath = scopePath;
    this.metadataStorage = metadataStorage;
    this.sessionId = sessionId === null ? null : assertSessionId(sessionId);
    this.stagingName = null;
  }

  setSession(sessionId) {
    this.sessionId = assertSessionId(sessionId);
  }

  async begin(manifest) {
    this.stagingName = `${cacheName(manifest)}-staging-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    await this.caches.open(this.stagingName);
  }

  async write(manifest, file, bytes, declaredType) {
    assertSafeRelativePath(file.path);
    const cache = await this.caches.open(this.stagingName);
    const url = new URL(virtualGamePath(this.scopePath, manifest, file.path), this.origin).href;
    await cache.put(url, new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType(file.path, declaredType),
        "Content-Length": String(bytes.byteLength),
        "X-Nexus-Arcade-Integrity": file.sha256,
      },
    }));
  }

  async commit(manifest) {
    const staged = await this.caches.open(this.stagingName);
    const finalName = cacheName(manifest);
    if (!(await this.caches.has(finalName))) {
      const finalCache = await this.caches.open(finalName);
      for (const request of await staged.keys()) await finalCache.put(request, await staged.match(request));
    }
    await this.caches.delete(this.stagingName);
    this.stagingName = null;
    const installed = this.listInstalled();
    installed[manifest.id] = {
      version: manifest.version,
      entry: manifest.entry,
      installedAt: new Date().toISOString(),
      sessionId: this.sessionId,
      temporary: true,
    };
    this.writeInstalled(installed);
    return { cacheName: finalName, launchPath: virtualGamePath(this.scopePath, manifest) };
  }

  async abort() {
    if (this.stagingName) await this.caches.delete(this.stagingName);
    this.stagingName = null;
  }

  listInstalled() {
    try { return JSON.parse(this.metadataStorage?.getItem(INSTALLED_METADATA_KEY) || "{}"); }
    catch { return {}; }
  }

  writeInstalled(installed) {
    this.metadataStorage?.setItem(INSTALLED_METADATA_KEY, JSON.stringify(installed));
  }

  isInstalled(manifest) {
    return this.listInstalled()[manifest.id]?.version === manifest.version;
  }

  installedForSession(sessionId) {
    assertSessionId(sessionId);
    return Object.entries(this.listInstalled())
      .filter(([, value]) => value?.sessionId === sessionId)
      .map(([id, value]) => ({ id, version: value.version }));
  }

  releaseSessionMetadata(sessionId) {
    const games = this.installedForSession(sessionId);
    if (!games.length) return games;
    const installed = this.listInstalled();
    for (const game of games) delete installed[game.id];
    this.writeInstalled(installed);
    return games;
  }

  async remove(manifest) {
    assertGameId(manifest.id);
    assertVersion(manifest.version);
    const deleted = await this.caches.delete(cacheName(manifest));
    const installed = this.listInstalled();
    if (installed[manifest.id]?.version === manifest.version) {
      delete installed[manifest.id];
      this.writeInstalled(installed);
    }
    return deleted;
  }

  async removeSession(sessionId) {
    const games = this.releaseSessionMetadata(sessionId);
    await Promise.all(games.map((game) => this.caches.delete(gameCacheName(game.id, game.version))));
    return games;
  }

  async removeStagingCaches() {
    const names = await this.caches.keys();
    const staging = names.filter((name) => STAGING_CACHE_PATTERN.test(name));
    await Promise.all(staging.map((name) => this.caches.delete(name)));
    return staging;
  }

  async reconcileInstalled() {
    const names = await this.caches.keys();
    const available = new Set(names.filter((name) => FINAL_CACHE_PATTERN.test(name)));
    const installed = this.listInstalled();
    const retained = {};
    for (const [id, record] of Object.entries(installed)) {
      try {
        assertGameId(id);
        assertVersion(record?.version);
        if (available.has(gameCacheName(id, record.version))) retained[id] = record;
      } catch { /* Invalid installation metadata is discarded. */ }
    }
    this.writeInstalled(retained);
    const retainedCaches = new Set(Object.entries(retained).map(([id, record]) => gameCacheName(id, record.version)));
    const orphaned = [...available].filter((name) => !retainedCaches.has(name));
    await Promise.all(orphaned.map((name) => this.caches.delete(name)));
    return { installed: retained, removedCaches: orphaned };
  }

  async removeStaleSessions(currentSessionId) {
    assertSessionId(currentSessionId);
    const installed = this.listInstalled();
    const stale = [];
    for (const [id, record] of Object.entries(installed)) {
      if (record?.sessionId !== currentSessionId) {
        try {
          assertGameId(id);
          assertVersion(record?.version);
          stale.push({ id, version: record.version });
        } catch { /* Invalid metadata is removed below without constructing a cache name. */ }
        delete installed[id];
      }
    }
    this.writeInstalled(installed);
    await Promise.all(stale.map((game) => this.caches.delete(gameCacheName(game.id, game.version))));
    const staging = await this.removeStagingCaches();
    const reconciled = await this.reconcileInstalled();
    return { stale, staging, orphaned: reconciled.removedCaches };
  }

  async removeAllGames() {
    const names = await this.caches.keys();
    const owned = names.filter((name) => FINAL_CACHE_PATTERN.test(name) || STAGING_CACHE_PATTERN.test(name));
    await Promise.all(owned.map((name) => this.caches.delete(name)));
    this.writeInstalled({});
    return owned;
  }
}

export function gameCacheName(id, version) {
  return `${CACHE_PREFIX}${id}-${version}`;
}
