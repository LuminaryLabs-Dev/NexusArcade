function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createResourceMeter(config = {}) {
  const min = Number(config.min ?? 0);
  const max = Number(config.max ?? 100);
  let value = clamp(Number(config.initial ?? config.value ?? max), min, max);
  const id = config.id ?? "resource";
  return {
    spend(amount = 0, reason = "spend") {
      const before = value;
      value = clamp(value - Math.max(0, Number(amount) || 0), min, max);
      return { id, before, after: value, amount: value - before, reason };
    },
    restore(amount = 0, reason = "restore") {
      const before = value;
      value = clamp(value + Math.max(0, Number(amount) || 0), min, max);
      return { id, before, after: value, amount: value - before, reason };
    },
    set(nextValue = value, reason = "set") {
      const before = value;
      value = clamp(Number(nextValue), min, max);
      return { id, before, after: value, amount: value - before, reason };
    },
    snapshot() {
      return { id, min, max, value, empty: value <= min, full: value >= max };
    }
  };
}
