export function createInteractionResult(config = {}) {
  return Object.freeze({
    id: config.id ?? "interaction-result",
    targetId: config.targetId ?? null,
    action: config.action ?? "interact",
    accepted: config.accepted !== false,
    reason: config.reason ?? null,
    payload: Object.freeze({ ...(config.payload ?? {}) }),
    metadata: Object.freeze({ ...(config.metadata ?? {}) })
  });
}
