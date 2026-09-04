import { assertGameId, assertSafeRelativePath, assertVersion } from "./paths.mjs";
import { assertLatestUrl, buildRegistryUrl, DEFAULT_LATEST_URL } from "./source-policy.mjs";

async function fetchJson(url, fetchImpl, cache = "default") {
  const response = await fetchImpl(url, { cache, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Could not fetch ${url}: HTTP ${response.status}`);
  try { return await response.json(); }
  catch (error) { throw new Error(`Invalid JSON from ${url}: ${error.message}`); }
}

export function validateLatest(latest) {
  if (!latest || latest.schemaVersion !== 1) throw new TypeError("Unsupported registry pointer schema");
  if (!/^\d+\.\d+\.\d+$/.test(latest.registryVersion)) throw new TypeError("Invalid registry version");
  if (!/^(?:registry-v\d+\.\d+\.\d+|[a-f0-9]{40})$/i.test(latest.ref)) throw new TypeError("Invalid registry ref");
  if (latest.indexPath !== "registry/index.json") throw new TypeError("Unexpected registry index path");
  return latest;
}

export function validateCatalog(catalog, expectedVersion) {
  if (!catalog || catalog.schemaVersion !== 1) throw new TypeError("Unsupported catalog schema");
  if (catalog.registryVersion !== expectedVersion) throw new TypeError("Registry pointer and catalog versions differ");
  if (!Array.isArray(catalog.games)) throw new TypeError("Catalog games must be an array");
  const ids = new Set();
  let previous = "";
  for (const game of catalog.games) {
    assertGameId(game.id);
    assertVersion(game.version);
    assertSafeRelativePath(game.manifestPath, "manifestPath");
    if (game.manifestPath !== `registry/games/${game.id}.json`) throw new TypeError(`${game.id}: manifest path does not match ID`);
    if (typeof game.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.slug)) throw new TypeError(`${game.id}: invalid slug`);
    if (typeof game.title !== "string" || !game.title.trim()) throw new TypeError(`${game.id}: missing title`);
    if (ids.has(game.id)) throw new TypeError(`Duplicate game ID: ${game.id}`);
    if (previous && game.id.localeCompare(previous) <= 0) throw new TypeError("Catalog games must be sorted by ID");
    ids.add(game.id);
    previous = game.id;
  }
  return catalog;
}

export class CatalogClient {
  constructor({ latestUrl = DEFAULT_LATEST_URL, registryRef = null, registryVersion = null, fetchImpl = null } = {}) {
    fetchImpl ||= globalThis.fetch?.bind(globalThis);
    if (typeof fetchImpl !== "function") throw new TypeError("A fetch implementation is required");
    this.latestUrl = assertLatestUrl(latestUrl);
    if (registryRef !== null && !/^(?:registry-v\d+\.\d+\.\d+|[a-f0-9]{40})$/i.test(registryRef)) throw new TypeError("Invalid pinned registry ref");
    if (registryRef !== null && !/^\d+\.\d+\.\d+$/.test(registryVersion || "")) throw new TypeError("A pinned registry requires its semantic version");
    this.registryRef = registryRef;
    this.registryVersion = registryVersion;
    this.fetchImpl = fetchImpl;
    this.latest = null;
    this.catalog = null;
  }

  async load() {
    this.latest = this.registryRef
      ? { schemaVersion: 1, registryVersion: this.registryVersion, ref: this.registryRef, indexPath: "registry/index.json" }
      : validateLatest(await fetchJson(this.latestUrl, this.fetchImpl, "no-store"));
    const indexUrl = buildRegistryUrl(this.latest.ref, this.latest.indexPath);
    this.catalog = validateCatalog(await fetchJson(indexUrl, this.fetchImpl, "force-cache"), this.latest.registryVersion);
    return this.catalog;
  }
}
