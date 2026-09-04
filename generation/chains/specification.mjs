import { decision } from "./decision.mjs";
import { object, specSchema, assertSchema } from "../contracts/schemas.mjs";
export async function specification(ctx, idea, detail) {
  const pacing = await decision(
    ctx,
    "pacing",
    "Choose readable pacing for a three-stage arena game. duration is seconds per stage. More targets should get more time.",
    object({
      duration: { type: "integer", enum: [60, 90, 120] },
      targetCount: { type: "integer", enum: [3, 4, 5] },
      hazardCount: { type: "integer", enum: [1, 2, 3] },
    }),
    { mode: ctx.job.supply.modes },
  );
  const s = ctx.job.supply;
  return assertSchema(
    {
      schemaVersion: 1,
      id: ctx.job.id,
      seed: s.seed,
      title: idea.title,
      premise: idea.premise,
      setting: s.settings,
      mode: s.modes,
      palette: s.palettes,
      ...detail,
      ...pacing,
      speed: 5,
      stages: 3,
      interactionSeconds: 0.7,
      controls:
        "Move: WASD / arrows. Interact: Space / E / gamepad A. Start: Enter. Restart: R. Pause: Escape.",
    },
    specSchema,
  );
}
