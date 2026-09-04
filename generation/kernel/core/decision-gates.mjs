import { validate } from "../../contracts/schemas.mjs";
import { createHash } from "node:crypto";

export function gateDecision(value, request, priorFingerprints = []) {
  const failures = Object.keys(request.outputSchema ?? {}).length
    ? validate(value, request.outputSchema)
    : [];
  if (!value || typeof value !== "object" || Array.isArray(value))
    failures.push("answer must be a JSON object");
  for (const field of request.requiredFields) {
    const item = value?.[field];
    if (item === undefined || item === null || item === "")
      failures.push(`missing required field: ${field}`);
  }
  const serialized = JSON.stringify(value ?? null);
  if (Buffer.byteLength(serialized) > request.maximumTokens * 8)
    failures.push("answer exceeds bounded output size");
  if (
    !request.allowMarkup &&
    /<\/?(?:html|head|body|script|style|iframe|object)\b/i.test(serialized)
  )
    failures.push("markup is forbidden");
  if (
    !request.allowCode &&
    (/```(?!json)/i.test(serialized) ||
      /\b(?:eval|new Function)\s*\(/.test(serialized))
  )
    failures.push("code is forbidden");
  if (/\bmissing required field\b/i.test(serialized))
    failures.push("answer repeats gate instructions instead of answering");
  if (
    /\b(?:tests?|validation|technical checks?)\s+(?:have\s+)?passed\b/i.test(
      serialized,
    )
  )
    failures.push("model-generated validation claims are forbidden");
  const fingerprint = createHash("sha256").update(serialized).digest("hex");
  if (priorFingerprints.includes(fingerprint))
    failures.push("answer repeats a rejected attempt");
  return { pass: failures.length === 0, failures, fingerprint };
}
