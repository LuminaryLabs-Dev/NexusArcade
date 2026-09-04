import { assertSchema, specSchema } from "../contracts/schemas.mjs";
export function repair(spec, failures) {
  const next = structuredClone(spec);
  if (failures.some((x) => /timeout|time budget/.test(x)))
    next.duration = Math.min(180, next.duration + 30);
  else return null;
  return assertSchema(next, specSchema);
}
