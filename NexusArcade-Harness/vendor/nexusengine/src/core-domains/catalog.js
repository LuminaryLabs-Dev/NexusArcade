import manifest0 from "./actor/domain.manifest.js";
import manifest1 from "./agent/domain.manifest.js";
import manifest2 from "./asset/domain.manifest.js";
import manifest3 from "./authoring/domain.manifest.js";
import manifest4 from "./build/domain.manifest.js";
import manifest5 from "./composition/domain.manifest.js";
import manifest6 from "./compute/domain.manifest.js";
import manifest7 from "./diagnostics/domain.manifest.js";
import manifest8 from "./host/domain.manifest.js";
import manifest9 from "./interaction/domain.manifest.js";
import manifest10 from "./mcp/domain.manifest.js";
import manifest11 from "./network/domain.manifest.js";
import manifest12 from "./object/domain.manifest.js";
import manifest13 from "./physics/domain.manifest.js";
import manifest14 from "./policy/domain.manifest.js";
import manifest15 from "./presentation/domain.manifest.js";
import manifest16 from "./render/domain.manifest.js";
import manifest17 from "./runtime/domain.manifest.js";
import manifest18 from "./simulation/domain.manifest.js";
import manifest19 from "./spatial/domain.manifest.js";
import manifest20 from "./world/domain.manifest.js";
import { flattenCoreDomainManifests } from "./domain-manifest.js";

export const CORE_REGISTRY_SHA256 = "d2b8af8d1d542bdb125d33b8a4ff5a32de1cf73da399e57e9a29b5ae35d4a8f5";

export const CORE_DOMAIN_MANIFESTS = Object.freeze([
  manifest0,
  manifest1,
  manifest2,
  manifest3,
  manifest4,
  manifest5,
  manifest6,
  manifest7,
  manifest8,
  manifest9,
  manifest10,
  manifest11,
  manifest12,
  manifest13,
  manifest14,
  manifest15,
  manifest16,
  manifest17,
  manifest18,
  manifest19,
  manifest20
]);

export const CORE_DOMAIN_CATALOG = flattenCoreDomainManifests(CORE_DOMAIN_MANIFESTS);

export default CORE_DOMAIN_CATALOG;
