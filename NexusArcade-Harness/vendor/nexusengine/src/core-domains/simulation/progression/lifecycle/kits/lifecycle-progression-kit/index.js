import { createDomainKit } from "../../../../../domain-kit.js";
import { createLifecycleProgressionServices } from "./services.js";
import { createLifecycleProgressionState, normalizeLifecycleProgressionConfig } from "./contracts.js";

export { advanceLifecycleProgression, createLifecycleProgressionState, normalizeLifecycleItem, normalizeLifecycleProgressionConfig, prerequisitesMet } from "./contracts.js";

export function createLifecycleProgressionKit(config = {}) {
  const normalized = normalizeLifecycleProgressionConfig(config);
  return createDomainKit({ ...config, manifestId: "lifecycle-progression-kit", id: config.id ?? "lifecycle-progression-kit", domain: "lifecycle-progression", domainPath: "n:simulation:progression:lifecycle", parentDomainPath: "n:simulation:progression", apiName: "lifecycleProgression", requires: ["n:simulation"], provides: ["n:simulation:progression:lifecycle", "progression:lifecycle"], config: normalized, initialState: createLifecycleProgressionState(normalized), eventNames: ["configured", "updated", "reset", "snapshotLoaded", "started", "completed"], createApi({ baseApi }) { return createLifecycleProgressionServices(baseApi); }, metadata: { rendererAgnostic: true, effectIndependent: true, historicalSource: "src/lifecycle-progression-kit.js@a9adca5" } });
}

export default createLifecycleProgressionKit;
