import { createDomainKit } from "../../../../../domain-kit.js";
import { createActionLocomotionServices } from "./services.js";
import { createActionLocomotionState, normalizeActionLocomotionConfig } from "./contracts.js";

export { advanceActionLocomotion, createActionLocomotionState, normalizeActionLocomotionConfig } from "./contracts.js";

export function createActionLocomotionKit(config = {}) {
  const normalized = normalizeActionLocomotionConfig(config);
  return createDomainKit({
    ...config,
    manifestId: "action-locomotion-kit",
    id: config.id ?? "action-locomotion-kit",
    domain: "action-locomotion",
    domainPath: "n:simulation:motion:locomotion",
    parentDomainPath: "n:simulation:motion",
    apiName: "actionLocomotion",
    requires: ["n:simulation:motion"],
    provides: ["n:simulation:motion:locomotion", "motion:locomotion-intent"],
    config: normalized,
    initialState: createActionLocomotionState(normalized),
    eventNames: ["configured", "updated", "reset", "snapshotLoaded", "jumpstarted", "dashstarted", "glidestarted", "glideended", "landed"],
    createApi({ baseApi }) { return createActionLocomotionServices(baseApi, normalized); },
    metadata: { rendererAgnostic: true, physicsIndependent: true, historicalSource: "src/action-movement-kit.js@a9adca5" }
  });
}

export default createActionLocomotionKit;
