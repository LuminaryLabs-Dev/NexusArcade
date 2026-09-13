import { cloneSerializableState } from "./serializable-state.js";
import { sha256Integrity } from "./sha256.js";

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
}

export function operationRequestHash(request = {}) {
  const portable = cloneSerializableState(request);
  return sha256Integrity(JSON.stringify(stableValue(portable)));
}

export function createOperationReceipt({ operationId, request = {}, kitId, revision, result = null }) {
  const id = String(operationId ?? "").trim();
  if (!id) throw new TypeError("Operation receipt requires operationId.");
  const owner = String(kitId ?? "").trim();
  if (!owner) throw new TypeError("Operation receipt requires kitId.");
  const nextRevision = Number(revision);
  if (!Number.isSafeInteger(nextRevision) || nextRevision < 1) {
    throw new TypeError("Operation receipt revision must be a positive safe integer.");
  }
  return Object.freeze({
    schema: "nexusengine.operation-receipt/1",
    operationId: id,
    requestHash: operationRequestHash(request),
    kitId: owner,
    revision: nextRevision,
    result: cloneSerializableState(result)
  });
}

export function createIdempotencyLedger(initialRecords = {}) {
  const records = new Map(Object.entries(cloneSerializableState(initialRecords)));
  return {
    claim(key, requestOrFactory = {}, resultFactory = () => ({ accepted: true })) {
      const id = String(key);
      const request = typeof requestOrFactory === "function" ? {} : requestOrFactory;
      const factory = typeof requestOrFactory === "function" ? requestOrFactory : resultFactory;
      const requestHash = operationRequestHash(request);
      if (records.has(id)) {
        const existing = records.get(id);
        if (existing.requestHash !== requestHash) {
          throw new TypeError(`Operation ${id} was already claimed with different content.`);
        }
        return { id, accepted: false, duplicate: true, result: cloneSerializableState(existing.result) };
      }
      const result = cloneSerializableState(factory(id));
      records.set(id, { requestHash, result });
      return { id, accepted: true, duplicate: false, result: cloneSerializableState(result) };
    },
    has(key) {
      return records.has(String(key));
    },
    get(key) {
      return cloneSerializableState(records.get(String(key))?.result);
    },
    snapshot() {
      return cloneSerializableState(Object.fromEntries(records));
    },
    reset(nextRecords = {}) {
      records.clear();
      for (const [key, value] of Object.entries(cloneSerializableState(nextRecords))) records.set(key, value);
      return this.snapshot();
    }
  };
}
