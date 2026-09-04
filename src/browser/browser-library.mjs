import { CatalogClient } from "../core/catalog-client.mjs";
import { ManifestClient } from "../core/manifest-client.mjs";
import { DEFAULT_ALLOWED_GAME_REPOSITORIES, DEFAULT_LATEST_URL } from "../core/source-policy.mjs";

export class ArcadeLibrary {
  constructor({ latestUrl = DEFAULT_LATEST_URL, registryRef = null, registryVersion = null, fetchImpl = globalThis.fetch, allowedRepositories = DEFAULT_ALLOWED_GAME_REPOSITORIES } = {}) {
    this.catalogClient = new CatalogClient({ latestUrl, registryRef, registryVersion, fetchImpl });
    this.manifestClient = new ManifestClient({ fetchImpl, allowedRepositories });
    this.games = [];
  }

  async load() {
    const catalog = await this.catalogClient.load();
    this.games = catalog.games;
    return this.games;
  }

  async getManifest(gameOrId) {
    if (!this.catalogClient.latest) throw new Error("Load the library before requesting a manifest");
    const game = typeof gameOrId === "string" ? this.games.find((item) => item.id === gameOrId) : gameOrId;
    if (!game) throw new Error(`Unknown Nexus Arcade game: ${gameOrId}`);
    return this.manifestClient.load(game, this.catalogClient.latest.ref);
  }
}
