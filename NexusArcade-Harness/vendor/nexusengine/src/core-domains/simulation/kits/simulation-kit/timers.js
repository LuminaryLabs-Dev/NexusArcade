export { createProgressTimer } from "../../../../foundation/progress-timer.js";

export function createCooldownTimer(config = {}) {
  const durationSeconds = Math.max(0, Number(config.durationSeconds ?? config.duration ?? 1));
  let remainingSeconds = Math.max(0, Number(config.remainingSeconds ?? 0));
  return {
    trigger() {
      remainingSeconds = durationSeconds;
      return this.snapshot();
    },
    tick(deltaSeconds = 0) {
      remainingSeconds = Math.max(0, remainingSeconds - Math.max(0, Number(deltaSeconds) || 0));
      return this.snapshot();
    },
    ready() {
      return remainingSeconds <= 0;
    },
    snapshot() {
      return {
        id: config.id ?? "cooldown",
        durationSeconds,
        remainingSeconds,
        ready: remainingSeconds <= 0
      };
    }
  };
}
