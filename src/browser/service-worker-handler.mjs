import { assertGameId, assertSafeRelativePath, assertVersion } from "../core/paths.mjs";
import { gameCacheName } from "./cache-storage.mjs";

export const RELEASE_GAME_MESSAGE = "NEXUS_ARCADE_RELEASE_GAME";
export const RELEASE_SESSION_MESSAGE = "NEXUS_ARCADE_RELEASE_SESSION";

function validateGameReference(value) {
  if (!value || typeof value !== "object") throw new TypeError("Invalid Nexus Arcade game reference");
  assertGameId(value.id);
  assertVersion(value.version);
  return { id: value.id, version: value.version };
}

export function parseCleanupMessage(value) {
  if (!value || typeof value !== "object") return null;
  if (value.type === RELEASE_GAME_MESSAGE) return { type: value.type, games: [validateGameReference(value)] };
  if (value.type !== RELEASE_SESSION_MESSAGE) return null;
  if (typeof value.sessionId !== "string" || !/^[a-zA-Z0-9_-]{16,128}$/.test(value.sessionId)) throw new TypeError("Invalid Nexus Arcade session ID");
  if (!Array.isArray(value.games) || value.games.length > 100) throw new TypeError("Invalid Nexus Arcade session game list");
  const games = value.games.map(validateGameReference);
  if (new Set(games.map((game) => `${game.id}@${game.version}`)).size !== games.length) throw new TypeError("Duplicate Nexus Arcade session game");
  return { type: value.type, sessionId: value.sessionId, games };
}

export async function releaseGameCaches(cacheStorage, message) {
  const parsed = parseCleanupMessage(message);
  if (!parsed) return { handled: false, released: [] };
  const released = [];
  for (const game of parsed.games) {
    if (await cacheStorage.delete(gameCacheName(game.id, game.version))) released.push(game);
  }
  return { handled: true, released };
}

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
  serviceWorkerGlobal.addEventListener("message", (event) => {
    let sourceIsTrusted = false;
    try {
      const source = new URL(event.source?.url);
      const scope = `/${String(options.scopePath || "/nexus-arcade/").split("/").filter(Boolean).join("/")}/`;
      sourceIsTrusted = source.origin === serviceWorkerGlobal.location.origin && source.pathname.startsWith(scope);
    } catch { sourceIsTrusted = false; }
    if (!sourceIsTrusted) return;
    let parsed;
    try { parsed = parseCleanupMessage(event.data); }
    catch { return; }
    if (!parsed) return;
    event.waitUntil(releaseGameCaches(serviceWorkerGlobal.caches, event.data));
  });
}
