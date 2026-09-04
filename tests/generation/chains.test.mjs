import test from "node:test";
import assert from "node:assert/strict";
import { ideation } from "../../generation/chains/ideation.mjs";
import { brainstorm } from "../../generation/chains/brainstorm.mjs";
import { specification } from "../../generation/chains/specification.mjs";
import { sample } from "../../generation/supply/sampler.mjs";
test("design chain preserves mechanic, records decisions and resumes without model calls", async () => {
  let calls = 0;
  const ctx = {
    job: { id: "test", supply: await sample(13) },
    save: async () => {},
    runtime: {
      complete: async (prompt, { responseSchema: s }) => {
        calls++;
        const out = {};
        for (const [k, v] of Object.entries(s.properties))
          out[k] =
            v.enum?.[0] ??
            {
              title: "Ceramic Tide",
              premise: "Restore the greenhouse.",
              objectiveLabel: "Valves",
              hazardLabel: "Patrols",
            }[k] ??
            "Example";
        return JSON.stringify(out);
      },
    },
  };
  const idea = await ideation(ctx),
    detail = await brainstorm(ctx, idea),
    spec = await specification(ctx, idea, detail);
  assert.equal(spec.mode, ctx.job.supply.modes);
  assert.equal(calls, 6);
  await ideation(ctx);
  await brainstorm(ctx, idea);
  await specification(ctx, idea, detail);
  assert.equal(calls, 6);
});
