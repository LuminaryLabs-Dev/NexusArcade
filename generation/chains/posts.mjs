import { decision } from "./decision.mjs";
import { object, text } from "../contracts/schemas.mjs";
export async function posts(ctx, spec, evidence) {
  const d = await decision(
    ctx,
    "post",
    "Write a short invitation to try this arcade prototype. Mention only its setting and interaction. No commercial, performance, release, or test claims.",
    object({ invitation: text(180) }),
    { setting: spec.setting, mode: spec.mode },
  );
  return {
    status: "DRAFT",
    modelDraft: d.invitation,
    verifiedDescription: `${spec.title}: a three-stage ${spec.mode} arena game. ${spec.controls}`,
    evidenceHash: evidence.artifactHash,
    published: false,
  };
}
