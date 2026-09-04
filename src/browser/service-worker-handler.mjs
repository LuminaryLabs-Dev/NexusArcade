import { assertGameId, assertSafeRelativePath, assertVersion } from "../core/paths.mjs";
import { gameCacheName } from "./cache-storage.mjs";

export function parseRuntimeRequest(requestUrl, scopePath = "/nexus-arcade/") {
  const url = new URL(requestUrl);
  const scope = `/${String(scopePath).split("/").filter(Boolean).join("/")}/`;
  if (!url.pathname.startsWith(`${scope}runtime/`)) return null;
  const [id, version, ...parts] = url.pathname.slice(`${scope}runtime/`.length).split("/");
  assertGameId(id);
  assertVersion(version);
  const path = parts.join("/");
  assertSafeRelativePath(path);
  return { id, version, path, cacheName: gameCacheName(id, version) };
}

export function createServiceWorkerHandler({ cacheStorage = globalThis.caches, scopePath = "/nexus-arcade/" } = {}) {
  return async function handle(request) {
    let parsed;
    try { parsed = parseRuntimeRequest(request.url, scopePath); }
    catch { return new Response("Invalid Nexus Arcade runtime path", { status: 400 }); }
    if (!parsed) return null;
    const cache = await cacheStorage.open(parsed.cacheName);
    return (await cache.match(request, { ignoreSearch: true })) || new Response("Installed game file not found", { status: 404 });
  };
}

export function installServiceWorkerHandlers(serviceWorkerGlobal, options = {}) {
  const handler = createServiceWorkerHandler(options);
  serviceWorkerGlobal.addEventListener("install", (event) => event.waitUntil(serviceWorkerGlobal.skipWaiting()));
  serviceWorkerGlobal.addEventListener("activate", (event) => event.waitUntil(serviceWorkerGlobal.clients.claim()));
  serviceWorkerGlobal.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;
    let isRuntime = false;
    try { isRuntime = Boolean(parseRuntimeRequest(event.request.url, options.scopePath)); } catch { isRuntime = true; }
    if (isRuntime) event.respondWith(handler(event.request));
  });
}
