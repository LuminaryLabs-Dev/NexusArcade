export const DECISION_STATES = Object.freeze([
  "ACCEPT",
  "REASK",
  "FALLBACK",
  "STOP",
]);

export function assertResult(result) {
  if (!result || typeof result !== "object" || Array.isArray(result))
    throw new Error("result must be an object");
  if (!DECISION_STATES.includes(result.status))
    throw new Error(`invalid result status: ${result.status}`);
  if (
    !Number.isInteger(result.callCount) ||
    result.callCount < 0 ||
    result.callCount > 3
  ) {
    throw new Error("result.callCount must be an integer from 0 to 3");
  }
  if (!Array.isArray(result.attempts))
    throw new Error("result.attempts must be an array");
  if (result.attempts.length !== result.callCount)
    throw new Error("attempt count must equal callCount");
  return result;
}
