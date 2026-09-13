function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createProgressTimer(config = {}) {
  const durationSeconds = Math.max(0.0001, Number(config.durationSeconds ?? config.duration ?? 1));
  let elapsedSeconds = Math.max(0, Number(config.elapsedSeconds ?? 0));
  let active = config.active !== false;
  return {
    tick(deltaSeconds = 0) {
      if (active) elapsedSeconds = clamp(elapsedSeconds + Math.max(0, Number(deltaSeconds) || 0), 0, durationSeconds);
      return this.snapshot();
    },
    reset(payload = {}) {
      elapsedSeconds = Math.max(0, Number(payload.elapsedSeconds ?? 0));
      active = payload.active ?? config.active !== false;
      return this.snapshot();
    },
    complete() {
      elapsedSeconds = durationSeconds;
      return this.snapshot();
    },
    pause() {
      active = false;
      return this.snapshot();
    },
    resume() {
      active = true;
      return this.snapshot();
    },
    snapshot() {
      return {
        id: config.id ?? "progress-timer",
        durationSeconds,
        elapsedSeconds,
        remainingSeconds: Math.max(0, durationSeconds - elapsedSeconds),
        progress: clamp(elapsedSeconds / durationSeconds, 0, 1),
        active,
        complete: elapsedSeconds >= durationSeconds
      };
    }
  };
}
