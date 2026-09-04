import { ArcadeLibrary } from "../browser/browser-library.mjs";
import { installGame } from "../core/install-game.mjs";
import { DEFAULT_ALLOWED_GAME_REPOSITORIES } from "../core/source-policy.mjs";
import { FileSystemStorageAdapter } from "./filesystem-storage.mjs";

export class NodeInstaller {
  constructor({ destination, fetchImpl = null, allowedRepositories = DEFAULT_ALLOWED_GAME_REPOSITORIES, latestUrl, registryRef, registryVersion } = {}) {
    fetchImpl ||= (input, init) => globalThis.fetch(input, init);
    this.fetchImpl = fetchImpl;
    this.allowedRepositories = [...allowedRepositories];
    this.library = new ArcadeLibrary({ latestUrl, registryRef, registryVersion, fetchImpl, allowedRepositories });
    this.storage = new FileSystemStorageAdapter({ destination });
  }

  async install(id, onProgress, options = {}) {
    if (!this.library.games.length) await this.library.load();
    const manifest = await this.library.getManifest(id);
    return installGame({
      manifest,
      storage: this.storage,
      fetchImpl: this.fetchImpl,
      allowedRepositories: this.allowedRepositories,
      onProgress,
      signal: options.signal,
    });
  }
}
