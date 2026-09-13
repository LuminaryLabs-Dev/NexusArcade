export function createActivationProgress(config = {}) {
  const target = Math.max(1, Number(config.target ?? config.required ?? 1));
  const progress = Math.max(0, Number(config.progress ?? 0));
  return Object.freeze({
    id: config.id ?? "activation",
    targetId: config.targetId ?? null,
    progress,
    target,
    complete: progress >= target,
    metadata: Object.freeze({ ...(config.metadata ?? {}) })
  });
}
