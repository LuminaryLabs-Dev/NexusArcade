export function createInteractionPrompt(config = {}) {
  return Object.freeze({
    id: config.id ?? "interaction-prompt",
    targetId: config.targetId ?? null,
    action: config.action ?? "interact",
    label: config.label ?? config.action ?? "Interact",
    icon: config.icon ?? null,
    visible: config.visible !== false,
    metadata: Object.freeze({ ...(config.metadata ?? {}) })
  });
}
