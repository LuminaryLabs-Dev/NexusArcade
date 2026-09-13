import { createDomainKit } from "../../../domain-kit.js";

export function createRuntimeLifecycleKit(config = {}) {
  return createDomainKit({
    ...config,
    manifestId: "runtime-lifecycle-kit",
    id: "runtime-lifecycle-kit",
    domain: "runtime",
    domainPath: "n:runtime",
    apiName: "runtime",
    provides: ["n:runtime", "runtime:lifecycle", "runtime:kit-installation"],
    purpose: "Own deterministic runtime lifecycle and Kit installation receipts.",
    initialState: {
      status: "ready",
      installationReceipts: []
    },
    createApi({ baseApi }) {
      return {
        getStatus: () => baseApi.getState().status,
        recordInstallation(receipt = {}) {
          const state = baseApi.getState();
          const normalized = structuredClone(receipt);
          const receipts = [...state.installationReceipts];
          const existing = receipts.find((entry) => entry.id === normalized.id);
          if (existing) {
            if (JSON.stringify(existing) === JSON.stringify(normalized)) return structuredClone(existing);
            throw new Error(`Runtime installation receipt ${normalized.id} already exists with different content.`);
          }
          receipts.push(normalized);
          receipts.sort((left, right) => String(left.id).localeCompare(String(right.id)));
          baseApi.update({ installationReceipts: receipts }, "updated");
          return structuredClone(normalized);
        },
        listInstallations: () => structuredClone(baseApi.getState().installationReceipts)
      };
    }
  });
}

export default createRuntimeLifecycleKit;
