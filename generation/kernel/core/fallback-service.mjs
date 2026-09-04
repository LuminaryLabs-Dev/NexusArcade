import { gateDecision } from "./decision-gates.mjs";

export function resolveFallback(request) {
  if (request.fallback === null)
    return { ok: false, reason: "no fallback supplied" };
  const gate = gateDecision(request.fallback, request, []);
  return gate.pass
    ? { ok: true, value: structuredClone(request.fallback), gate }
    : {
        ok: false,
        reason: `invalid fallback: ${gate.failures.join("; ")}`,
        gate,
      };
}
