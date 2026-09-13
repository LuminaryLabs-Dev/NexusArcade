import renderDomainContract from "./kits/render-domain-contract-kit/kit.manifest.js";
import renderProviderContract from "./kits/render-provider-contract-kit/kit.manifest.js";
import renderResourceSchema from "./kits/render-resource-schema-kit/kit.manifest.js";
import renderFrameSchema from "./kits/render-frame-schema-kit/kit.manifest.js";
import renderPassSchema from "./kits/render-pass-schema-kit/kit.manifest.js";
import shaderSchema from "./kits/shader-schema-kit/kit.manifest.js";
import renderEventSchema from "./kits/render-event-schema-kit/kit.manifest.js";

export const RENDER_CONTRACT_KIT_MANIFESTS = Object.freeze([
  renderDomainContract,
  renderProviderContract,
  renderResourceSchema,
  renderFrameSchema,
  renderPassSchema,
  shaderSchema,
  renderEventSchema
]);
