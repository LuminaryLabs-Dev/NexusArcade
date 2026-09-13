import { createDomainKit } from "../../../../domain-kit.js";
import { createAssistanceTargetServices } from "./services.js";
import { createAssistanceTargetState, normalizeAssistanceTargetConfig } from "./contracts.js";

export { countAssistanceTargets, createAssistanceTargetState, normalizeAssistanceTarget, normalizeAssistanceTargetConfig, queryNearestAssistanceTarget } from "./contracts.js";

export function createAssistanceTargetKit(config = {}) {
  const normalized = normalizeAssistanceTargetConfig(config);
  return createDomainKit({ ...config, manifestId: "assistance-target-kit", id: config.id ?? "assistance-target-kit", domain: "assistance-target", domainPath: "n:interaction:assistance-target", parentDomainPath: "n:interaction", apiName: "assistanceTargets", requires: ["n:interaction"], provides: ["n:interaction:assistance-target", "interaction:assistance-target"], config: normalized, initialState: createAssistanceTargetState(normalized), eventNames: ["configured", "updated", "reset", "snapshotLoaded", "stabilized", "attached", "completed"], createApi({ baseApi }) { return createAssistanceTargetServices(baseApi); }, metadata: { rendererAgnostic: true, historicalSource: "src/assistance-target-kit.js@a9adca5" } });
}

export default createAssistanceTargetKit;
