import { defineCoreDomainManifest } from "../domain-manifest.js";
import { atomicKit, domainNode, manifestShell } from "../manifest-input.js";

const proof = ["tests/core-kits/core-assets-async-smoke.mjs", "tests/core-kits/core-assets-cache-smoke.mjs", "tests/core-kits/core-assets-deduplication-smoke.mjs"];

export const assetDomainManifest = defineCoreDomainManifest(manifestShell({
  root: domainNode({ id: "asset-domain", domainPath: "n:asset", label: "Asset", responsibility: "Own asset identity, manifests, bundles, content-addressed jobs, readiness, and provider contracts.", owns: ["asset descriptors", "asset manifests", "asset bundles", "asset dependency graphs", "content-addressed receipts"], forbiddenResponsibilities: ["network fetching", "filesystem access", "browser cache implementation", "renderer resource creation"], provides: ["n:asset", "asset:manifest", "asset:bundle", "asset:job", "asset:provider-contract"], proofReferences: proof }),
  publicEntry: { subpath: "./domains/asset", module: "./src/core-domains/asset/index.js" },
  publicKits: [atomicKit({ id: "asset-registry-kit", responsibility: "Resolve asset manifests and bundles through content-addressed provider jobs.", domainPath: "n:asset", apiName: "asset", provides: ["n:asset", "asset:manifest", "asset:bundle", "asset:job", "asset:provider-contract"], module: "./src/core-domains/asset/kits/asset-kit/index.js", exportName: "createAssetRegistryKit", publicSubpath: "./domains/asset/registry", proofReferences: proof })]
}));

export default assetDomainManifest;
