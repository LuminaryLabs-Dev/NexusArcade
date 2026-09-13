import { createDomainKit } from "../../../../domain-kit.js";
import { createEnvironmentalAffordanceServices } from "./services.js";
import { createEnvironmentalAffordanceState, normalizeEnvironmentalAffordanceConfig } from "./contracts.js";

export { createEnvironmentalAffordanceState, normalizeEnvironmentalAffordanceConfig, queryNearbyAffordances } from "./contracts.js";

export function createEnvironmentalAffordanceKit(config = {}) {
  const normalized = normalizeEnvironmentalAffordanceConfig(config);
  return createDomainKit({ ...config, manifestId: "environmental-affordance-kit", id: config.id ?? "environmental-affordance-kit", domain: "environmental-affordance", domainPath: "n:interaction:environmental-affordance", parentDomainPath: "n:interaction", apiName: "environmentalAffordances", requires: ["n:interaction"], provides: ["n:interaction:environmental-affordance", "interaction:environmental-affordance"], config: normalized, initialState: createEnvironmentalAffordanceState(normalized), eventNames: ["configured", "updated", "reset", "snapshotLoaded", "activated", "completed"], createApi({ baseApi }) { return createEnvironmentalAffordanceServices(baseApi); }, metadata: { rendererAgnostic: true, historicalSource: "src/environmental-affordance-kit.js@a9adca5" } });
}

export default createEnvironmentalAffordanceKit;
