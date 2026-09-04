import { decision } from "./decision.mjs";
import { object, text } from "../contracts/schemas.mjs";
export async function ideation(ctx) {
  const s = ctx.job.supply;
  const ideas = [];
  for (let i = 0; i < 2; i++)
    ideas.push(
      await decision(
        ctx,
        `idea-${i}`,
        `Create a concrete arcade game title and short premise. Setting ${s.settings}, material ${s.materials}, mechanic ${s.modes}. No code or validation claims. Candidate ${i + 1}; differ from previous.`,
        object({ title: text(60), premise: text(240) }),
        { previous: ideas },
      ),
    );
  const choice = await decision(
    ctx,
    "select",
    "Choose the more coherent game candidate. Return its index: 0 or 1.",
    object({ index: { type: "integer", enum: [0, 1] } }),
    { ideas },
  );
  return { ...ideas[choice.index], candidates: ideas };
}
