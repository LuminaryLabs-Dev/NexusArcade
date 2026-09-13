export function createHazardDescriptor(config = {}) {
  return Object.freeze({
    id: config.id ?? "hazard",
    kind: config.kind ?? "generic",
    severity: Number(config.severity ?? 1),
    volumeId: config.volumeId ?? null,
    pressureChannelId: config.pressureChannelId ?? null,
    active: config.active !== false,
    metadata: Object.freeze({ ...(config.metadata ?? {}) })
  });
}
