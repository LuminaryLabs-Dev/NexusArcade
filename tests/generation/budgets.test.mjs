import test from "node:test";
import assert from "node:assert/strict";
import { Budget } from "../../generation/runtime/budget.mjs";
import { runCore } from "../../generation/kernel/index.mjs";
test("nested retries cannot reset global budget; reservations persist before inference", async () => {
  const saved = [];
  const b = new Budget({
    maxCalls: 2,
    onChange: async (s) => saved.push(s.calls),
  });
  let actual = 0;
  await assert.rejects(
    runCore({
      request: { task: "answer", maximumCalls: 3 },
      runtime: {
        complete: async () => {
          await b.reserve();
          actual++;
          throw Error("network timeout");
        },
      },
    }),
    (e) => e.code === "BUDGET",
  );
  assert.equal(actual, 2);
  assert.deepEqual(saved, [1, 2]);
});
test("resumed budget, elapsed timeout and cancellation stop before inference", async () => {
  for (const opts of [
    { maxCalls: 2, calls: 2 },
    { deadlineAt: Date.now() - 1 },
    { elapsedMilliseconds: 100, maxMilliseconds: 1 },
    { cancelled: async () => true },
  ])
    await assert.rejects(new Budget(opts).reserve());
});
