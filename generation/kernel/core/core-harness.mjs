import { normalizeRequest } from "../contracts/request-contract.mjs";
import { assertResult } from "../contracts/result-contract.mjs";
import { parseAnswer } from "./answer-parser.mjs";
import { gateDecision } from "./decision-gates.mjs";
import { resolveFallback } from "./fallback-service.mjs";
import { CallLedger } from "./call-ledger.mjs";

export async function runCore({
  request: requestInput,
  runtime,
  ledger = null,
} = {}) {
  const request = normalizeRequest(requestInput);
  const localLedger = ledger ?? new CallLedger(request.id);
  const attempts = [];
  const fingerprints = [];
  const started = performance.now();

  if (runtime?.available !== false && typeof runtime?.complete === "function") {
    for (
      let attemptNumber = 1;
      attemptNumber <= request.maximumCalls;
      attemptNumber += 1
    ) {
      const prompt = buildPrompt(
        request,
        attemptNumber,
        attempts.at(-1)?.gate?.failures ?? [],
      );
      const entry = localLedger.start(request.id);
      try {
        const raw = await runtime.complete(prompt, {
          maxTokens: request.maximumTokens,
          responseSchema: request.outputSchema,
          system:
            "Return exactly one compact JSON object. Never claim that tests passed.",
        });
        const value = parseAnswer(raw);
        const gate = gateDecision(value, request, fingerprints);
        fingerprints.push(gate.fingerprint);
        const status = gate.pass ? "ACCEPT" : "REASK";
        attempts.push({ number: attemptNumber, status, raw, gate });
        localLedger.finish(entry, status, { failures: gate.failures });
        if (gate.pass) {
          return assertResult({
            id: request.id,
            status: "ACCEPT",
            value,
            attempts,
            callCount: attempts.length,
            fallbackUsed: false,
            durationMilliseconds: Math.round(performance.now() - started),
            ledger: localLedger.snapshot(),
          });
        }
      } catch (error) {
        if (["BUDGET", "CANCELLED"].includes(error.code)) throw error;
        const gate = {
          pass: false,
          failures: [String(error?.message ?? error)],
        };
        attempts.push({ number: attemptNumber, status: "REASK", gate });
        localLedger.finish(entry, "REASK", { failures: gate.failures });
      }
    }
  }

  const fallback = resolveFallback(request);
  const status = fallback.ok ? "FALLBACK" : "STOP";
  return assertResult({
    id: request.id,
    status,
    value: fallback.ok ? fallback.value : null,
    reason: fallback.ok
      ? attempts.length
        ? "model attempts failed gates"
        : "runtime unavailable"
      : fallback.reason,
    attempts,
    callCount: attempts.length,
    fallbackUsed: fallback.ok,
    durationMilliseconds: Math.round(performance.now() - started),
    ledger: localLedger.snapshot(),
  });
}

function buildPrompt(request, attemptNumber, failures) {
  const repair =
    attemptNumber > 1
      ? `\nRepair only these failures: ${failures.join("; ")}.`
      : "";
  return [
    `Task: ${request.task}`,
    `Context: ${JSON.stringify(request.context)}`,
    `Required fields: ${request.requiredFields.join(", ") || "none"}`,
    `Output schema hints: ${JSON.stringify(request.outputSchema)}`,
    `Rules: JSON object only; ${request.allowCode ? "code allowed" : "no code"}; ${request.allowMarkup ? "markup allowed" : "no markup"}.`,
    repair,
  ].join("\n");
}
