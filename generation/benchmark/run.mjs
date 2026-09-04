import { readFile } from "node:fs/promises";
import { LocalModel } from "../runtime/local-model.mjs";
import { Budget } from "../runtime/budget.mjs";
import { runCore } from "../kernel/index.mjs";
import { object } from "../contracts/schemas.mjs";
export async function benchmark(options = {}) {
  const runtime = new LocalModel(options, new Budget({ maxCalls: 60 }));
  await runtime.health();
  const cases = JSON.parse(
    await readFile(new URL("./cases.json", import.meta.url)),
  );
  const results = [];
  for (const c of cases) {
    const r = await runCore({
      request: {
        id: c.id,
        task: c.task,
        requiredFields: ["index"],
        outputSchema: object({ index: { type: "integer", enum: [0, 1, 2] } }),
        maximumCalls: 3,
        maximumTokens: 40,
        fallback: null,
      },
      runtime,
    });
    results.push({
      id: c.id,
      expected: c.expected,
      correct: r.status === "ACCEPT" && r.value.index === c.expected,
      ...r,
    });
  }
  return {
    capability: "schema-constrained three-option selection only",
    count: results.length,
    correct: results.filter((r) => r.correct).length,
    firstAttemptCorrect: results.filter((r) => r.correct && r.callCount === 1)
      .length,
    calls: results.reduce((n, r) => n + r.callCount, 0),
    fallbacks: results.filter((r) => r.fallbackUsed).length,
    results,
    modelRecords: runtime.records,
  };
}
