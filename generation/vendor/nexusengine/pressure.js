function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function classify(value, warningAt, failAt) {
  if (value >= failAt) return "failed";
  if (value >= warningAt) return "warning";
  return "normal";
}

export function createPressureChannel(config = {}) {
  const min = Number(config.min ?? 0);
  const max = Number(config.max ?? 100);
  const warningAt = Number(config.warningAt ?? max * 0.7);
  const failAt = Number(config.failAt ?? max);
  let value = clamp(Number(config.initial ?? config.value ?? min), min, max);
  const id = config.id ?? "pressure";
  return {
    adjust(amount = 0, reason = "adjust") {
      const before = value;
      value = clamp(value + Number(amount || 0), min, max);
      return { id, before, after: value, amount: value - before, reason, status: classify(value, warningAt, failAt) };
    },
    recover(amount = 0, reason = "recover") {
      return this.adjust(-Math.max(0, Number(amount) || 0), reason);
    },
    snapshot() {
      return { id, min, max, value, warningAt, failAt, status: classify(value, warningAt, failAt) };
    }
  };
}
