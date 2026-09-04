import { assertSafeRelativePath } from "./paths.mjs";

export const CDN_ORIGIN = "https://cdn.jsdelivr.net";
export const REGISTRY_REPOSITORY = "LuminaryLabs-Dev/NexusArcade-Prototypes";
export const DEFAULT_LATEST_URL = `${CDN_ORIGIN}/gh/${REGISTRY_REPOSITORY}@main/registry/latest.json`;
export const DEFAULT_ALLOWED_GAME_REPOSITORIES = Object.freeze([
  REGISTRY_REPOSITORY,
  "LuminaryLabs-Publish/TheLongHaul",
]);

const REPOSITORY_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const SHA_RE = /^[a-f0-9]{40}$/i;
const REGISTRY_REF_RE = /^(?:registry-v[0-9]+\.[0-9]+\.[0-9]+|[a-f0-9]{40})$/i;

export function assertLatestUrl(value) {
  const url = new URL(value);
  if (url.href !== DEFAULT_LATEST_URL) throw new TypeError(`Registry pointer must be exactly ${DEFAULT_LATEST_URL}`);
  return url.href;
}

export function assertRepository(repository, allowedRepositories = DEFAULT_ALLOWED_GAME_REPOSITORIES) {
  if (typeof repository !== "string" || !REPOSITORY_RE.test(repository)) throw new TypeError(`Invalid source repository: ${repository}`);
  if (!allowedRepositories.includes(repository)) throw new TypeError(`Source repository is not allowed: ${repository}`);
  return repository;
}

function assertRef(ref, kind) {
  const valid = kind === "registry" ? REGISTRY_REF_RE.test(ref) : SHA_RE.test(ref);
  if (!valid) throw new TypeError(kind === "registry" ? `Invalid immutable registry ref: ${ref}` : `Game source ref must be a full commit SHA: ${ref}`);
  return ref;
}

export function buildCdnUrl(source, filePath, options = {}) {
  const kind = options.kind || "game";
  const allowedRepositories = kind === "registry" ? [REGISTRY_REPOSITORY] : (options.allowedRepositories || DEFAULT_ALLOWED_GAME_REPOSITORIES);
  const repository = assertRepository(source?.repository, allowedRepositories);
  const ref = assertRef(source?.ref, kind);
  const basePath = source?.basePath === "." ? "" : assertSafeRelativePath(source?.basePath, "source.basePath");
  const relative = assertSafeRelativePath(filePath, "file.path");
  const url = new URL(`/gh/${repository}@${ref}/${basePath ? `${basePath}/` : ""}${relative}`, CDN_ORIGIN);
  if (url.origin !== CDN_ORIGIN) throw new TypeError("CDN origin changed unexpectedly");
  return url.href;
}

export function buildRegistryUrl(ref, path) {
  const relative = assertSafeRelativePath(path, "registry path").replace(/^registry\//, "");
  return buildCdnUrl({ repository: REGISTRY_REPOSITORY, ref, basePath: "registry" }, relative, { kind: "registry" });
}
