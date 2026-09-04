import { readFile } from "node:fs/promises";
import { runCore } from "../kernel/index.mjs";
export async function decision(ctx, id, task, schema, context = {}) {
  const key = id;
  const old = ctx.job.decisions?.[key];
  if (old?.status === "ACCEPT") return old.value;
  const promptName =
    id.startsWith("idea") || id === "select"
      ? "ideation"
      : ["brainstorm", "critique"].includes(id)
        ? "brainstorm"
        : id === "pacing"
          ? "specification"
          : id === "post"
            ? "posts"
            : "repair";
  const guidance = await readFile(
    new URL("../prompts/" + promptName + ".md", import.meta.url),
    "utf8",
  );
  task = guidance + "\n" + task;
  const result = await runCore({
    request: {
      id,
      task,
      context,
      requiredFields: schema.required,
      outputSchema: schema,
      maximumCalls: 3,
      maximumTokens: 200,
      allowCode: false,
      fallback: null,
    },
    runtime: ctx.runtime,
  });
  ctx.job.decisions ??= {};
  ctx.job.decisions[key] = result;
  await ctx.save();
  if (result.status !== "ACCEPT") throw Error(`${id}: ${result.status}`);
  return result.value;
}
