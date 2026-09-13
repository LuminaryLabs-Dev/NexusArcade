import renderResourceContract from "./kits/render-resource-contract-kit/kit.manifest.js";
import resourceIdentity from "./kits/resource-identity-kit/kit.manifest.js";
import resourceState from "./kits/resource-state-kit/kit.manifest.js";
import resourceReference from "./kits/resource-reference-kit/kit.manifest.js";
import resourceIntegrity from "./kits/resource-integrity-kit/kit.manifest.js";
import resourceCache from "./kits/resource-cache-kit/kit.manifest.js";
import resourceBudget from "./kits/resource-budget-kit/kit.manifest.js";
import resourceUpload from "./kits/resource-upload-kit/kit.manifest.js";
import resourceRelease from "./kits/resource-release-kit/kit.manifest.js";
import resourceLifecycle from "./kits/resource-lifecycle-kit/kit.manifest.js";

export const RENDER_RESOURCE_KIT_MANIFESTS = Object.freeze([
  renderResourceContract,
  resourceIdentity,
  resourceState,
  resourceReference,
  resourceIntegrity,
  resourceCache,
  resourceBudget,
  resourceUpload,
  resourceRelease,
  resourceLifecycle
]);
