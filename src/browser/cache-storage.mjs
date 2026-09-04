import { assertSafeRelativePath, virtualGamePath } from "../core/paths.mjs";

export const CACHE_PREFIX = "nexus-arcade-game-";

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
  constructor({ cacheStorage = globalThis.caches, origin = globalThis.location?.origin, scopePath = "/nexus-arcade/", metadataStorage = globalThis.localStorage } = {}) {
    if (!cacheStorage || !origin) throw new TypeError("Cache Storage and an origin are required");
    this.caches = cacheStorage;
    this.origin = origin;
    this.scopePath = scopePath;
    this.metadataStorage = metadataStorage;
    this.stagingName = null;
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
    installed[manifest.id] = { version: manifest.version, entry: manifest.entry, installedAt: new Date().toISOString() };
    this.metadataStorage?.setItem("nexus-arcade-installed", JSON.stringify(installed));
    return { cacheName: finalName, launchPath: virtualGamePath(this.scopePath, manifest) };
  }

  async abort() {
    if (this.stagingName) await this.caches.delete(this.stagingName);
    this.stagingName = null;
  }

  listInstalled() {
    try { return JSON.parse(this.metadataStorage?.getItem("nexus-arcade-installed") || "{}"); }
    catch { return {}; }
  }

  isInstalled(manifest) {
    return this.listInstalled()[manifest.id]?.version === manifest.version;
  }
}

export function gameCacheName(id, version) {
  return `${CACHE_PREFIX}${id}-${version}`;
}
