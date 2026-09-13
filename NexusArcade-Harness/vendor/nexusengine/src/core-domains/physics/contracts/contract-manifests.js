import physicsDomainContract from "./kits/physics-domain-contract-kit/kit.manifest.js";
import physicsProviderContract from "./kits/physics-provider-contract-kit/kit.manifest.js";
import physicsStateSchema from "./kits/physics-state-schema-kit/kit.manifest.js";
import physicsCommandSchema from "./kits/physics-command-schema-kit/kit.manifest.js";
import physicsEventSchema from "./kits/physics-event-schema-kit/kit.manifest.js";
import physicsQuerySchema from "./kits/physics-query-schema-kit/kit.manifest.js";

export const PHYSICS_CONTRACT_KIT_MANIFESTS = Object.freeze([
  physicsDomainContract,
  physicsProviderContract,
  physicsStateSchema,
  physicsCommandSchema,
  physicsEventSchema,
  physicsQuerySchema
]);
