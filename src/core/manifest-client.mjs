import { assertGameId, assertSafeRelativePath, assertVersion } from "./paths.mjs";
import { assertRepository, buildRegistryUrl, DEFAULT_ALLOWED_GAME_REPOSITORIES } from "./source-policy.mjs";

export function validateManifest(manifest, expectedGame, allowedRepositories = DEFAULT_ALLOWED_GAME_REPOSITORIES) {
  if (!manifest || manifest.schemaVersion !== 1) throw new TypeError("Unsupported game manifest schema");
  assertGameId(manifest.id);
  assertVersion(manifest.version);
  assertSafeRelativePath(manifest.entry, "entry");
  if (manifest.id !== expectedGame.id || manifest.version !== expectedGame.version || manifest.slug !== expectedGame.slug) {
    throw new TypeError(`${expectedGame.id}: catalog and manifest identity differ`);
  }
  assertRepository(manifest.source?.repository, allowedRepositories);
  if (!/^[a-f0-9]{40}$/i.test(manifest.source?.ref || "")) throw new TypeError(`${manifest.id}: source ref must be a full commit SHA`);
  if (manifest.source?.basePath !== ".") assertSafeRelativePath(manifest.source?.basePath, "source.basePath");
  if (manifest.runtimeDependencies !== undefined) {
    if (!Array.isArray(manifest.runtimeDependencies)) throw new TypeError(`${manifest.id}: runtimeDependencies must be an array`);
    for (const dependency of manifest.runtimeDependencies) {
      const url = new URL(dependency);
      if (url.protocol !== "https:") throw new TypeError(`${manifest.id}: runtime dependency must use HTTPS`);
    }
  }
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) throw new TypeError(`${manifest.id}: manifest files must not be empty`);
  const paths = new Set();
  for (const file of manifest.files) {
    assertSafeRelativePath(file.path, "file.path");
    if (!Number.isSafeInteger(file.bytes) || file.bytes < 0) throw new TypeError(`${manifest.id}/${file.path}: invalid byte length`);
    if (!/^[a-f0-9]{64}$/i.test(file.sha256 || "")) throw new TypeError(`${manifest.id}/${file.path}: invalid SHA-256`);
    if (paths.has(file.path)) throw new TypeError(`${manifest.id}: duplicate file path ${file.path}`);
    paths.add(file.path);
  }
  if (!paths.has(manifest.entry)) throw new TypeError(`${manifest.id}: entry is not present in files`);
  return manifest;
}

export class ManifestClient {
  constructor({ fetchImpl = globalThis.fetch, allowedRepositories = DEFAULT_ALLOWED_GAME_REPOSITORIES } = {}) {
    if (typeof fetchImpl !== "function") throw new TypeError("A fetch implementation is required");
    this.fetchImpl = fetchImpl;
    this.allowedRepositories = [...allowedRepositories];
  }

  async load(game, registryRef) {
    const url = buildRegistryUrl(registryRef, game.manifestPath);
    const response = await this.fetchImpl(url, { cache: "force-cache", headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Could not fetch manifest for ${game.id}: HTTP ${response.status}`);
    let manifest;
    try { manifest = await response.json(); }
    catch (error) { throw new Error(`Invalid manifest JSON for ${game.id}: ${error.message}`); }
    return validateManifest(manifest, game, this.allowedRepositories);
  }
}
