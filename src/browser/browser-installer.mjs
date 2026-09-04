import { installGame } from "../core/install-game.mjs";
import { DEFAULT_ALLOWED_GAME_REPOSITORIES } from "../core/source-policy.mjs";
import { CacheStorageAdapter } from "./cache-storage.mjs";
import { requestPersistentStorage } from "./persistent-storage.mjs";

export class BrowserInstaller {
  constructor({ storage, fetchImpl = globalThis.fetch, allowedRepositories = DEFAULT_ALLOWED_GAME_REPOSITORIES, requestPersistence = true } = {}) {
    this.storage = storage || new CacheStorageAdapter();
    this.fetchImpl = fetchImpl;
    this.allowedRepositories = [...allowedRepositories];
    this.requestPersistence = requestPersistence;
  }

  async install(manifest, onProgress, options = {}) {
    if (this.requestPersistence) await requestPersistentStorage().catch(() => ({ supported: true, persisted: false }));
    return installGame({
      manifest,
      storage: this.storage,
      fetchImpl: this.fetchImpl,
      allowedRepositories: this.allowedRepositories,
      onProgress,
      signal: options.signal,
    });
  }

  isInstalled(manifest) {
    return this.storage.isInstalled(manifest);
  }
}
