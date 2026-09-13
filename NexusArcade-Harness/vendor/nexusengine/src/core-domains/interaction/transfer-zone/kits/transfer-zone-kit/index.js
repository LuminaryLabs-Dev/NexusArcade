import { createDomainKit } from "../../../../domain-kit.js";
import { createTransferZoneServices } from "./services.js";
import { createTransferZoneState, normalizeTransferZoneConfig } from "./contracts.js";

export { createTransferZoneState, normalizeTransferZoneConfig, pointInTransferZone, queryTransferZones, validateTransferCandidate } from "./contracts.js";

export function createTransferZoneKit(config = {}) {
  const normalized = normalizeTransferZoneConfig(config);
  return createDomainKit({ ...config, manifestId: "transfer-zone-kit", id: config.id ?? "transfer-zone-kit", domain: "transfer-zone", domainPath: "n:interaction:transfer-zone", parentDomainPath: "n:interaction", apiName: "transferZones", requires: ["n:interaction"], provides: ["n:interaction:transfer-zone", "interaction:transfer-zone"], config: normalized, initialState: createTransferZoneState(normalized), eventNames: ["configured", "updated", "reset", "snapshotLoaded", "completed"], createApi({ baseApi }) { return createTransferZoneServices(baseApi); }, metadata: { rendererAgnostic: true, historicalSource: "src/transfer-zone-kit.js@a9adca5" } });
}

export default createTransferZoneKit;
