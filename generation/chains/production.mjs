import { assemble } from "../builders/assemble.mjs";
import { validateGame } from "../validation/report.mjs";
export async function production(ctx, spec, root, evidence) {
  await assemble(spec, root);
  return validateGame(root, evidence, { record: ctx.config.record });
}
