import { buildCdnUrl, DEFAULT_ALLOWED_GAME_REPOSITORIES } from "./source-policy.mjs";
import { verifyFile } from "./integrity.mjs";
import { createProgress } from "./progress.mjs";

export async function installGame({ manifest, storage, fetchImpl = null, onProgress = () => {}, allowedRepositories = DEFAULT_ALLOWED_GAME_REPOSITORIES, signal } = {}) {
  if (!manifest || !storage) throw new TypeError("manifest and storage are required");
  fetchImpl ||= (input, init) => globalThis.fetch(input, init);
  if (typeof fetchImpl !== "function") throw new TypeError("A fetch implementation is required");
  const progress = createProgress(manifest);
  await storage.begin(manifest);
  try {
    for (const file of manifest.files) {
      if (signal?.aborted) throw signal.reason || new DOMException("Install aborted", "AbortError");
      const url = buildCdnUrl(manifest.source, file.path, { allowedRepositories });
      const response = await fetchImpl(url, { cache: "force-cache", signal });
      if (!response.ok) throw new Error(`${manifest.id}/${file.path}: HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      await verifyFile(bytes, file, `${manifest.id}/${file.path}`);
      await storage.write(manifest, file, bytes, response.headers.get("content-type"));
      onProgress(progress.complete(file));
    }
    const result = await storage.commit(manifest);
    return { manifest, ...result };
  } catch (error) {
    await storage.abort(manifest, error);
    throw error;
  }
}
