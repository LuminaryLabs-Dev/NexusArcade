import { decision } from "./decision.mjs";
import { object, text } from "../contracts/schemas.mjs";
export async function brainstorm(ctx, idea) {
  ctx.job.critique = await decision(
    ctx,
    "critique",
    "Identify one concrete gameplay clarity issue to address within the supported mechanic. Keep it specific and do not add new systems.",
    object({
      focus: {
        type: "string",
        enum: ["objective readability", "interaction feedback", "pacing"],
      },
      issue: text(160),
    }),
    { idea, supply: ctx.job.supply },
  );
  return decision(
    ctx,
    "brainstorm",
    "Name the repair or delivery target and moving hazard for this game. Use short concrete nouns. Keep the locked mechanic.",
    object({ objectiveLabel: text(60), hazardLabel: text(60) }),
    { idea, critique: ctx.job.critique, supply: ctx.job.supply },
  );
}
