export function validate(value, schema, at = "$") {
  const errors = [];
  if (!schema || typeof schema !== "object") return ["missing schema"];
  const type = Array.isArray(value)
    ? "array"
    : value === null
      ? "null"
      : typeof value;
  if (
    schema.type &&
    !(schema.type === "integer"
      ? Number.isSafeInteger(value)
      : type === schema.type)
  )
    return [`${at}: expected ${schema.type}`];
  if (schema.enum && !schema.enum.includes(value))
    errors.push(`${at}: unsupported value`);
  if (
    typeof value === "number" &&
    (!Number.isFinite(value) ||
      value < (schema.minimum ?? -Infinity) ||
      value > (schema.maximum ?? Infinity))
  )
    errors.push(`${at}: outside range`);
  if (
    typeof value === "string" &&
    (value.length < (schema.minLength ?? 0) ||
      value.length > (schema.maxLength ?? Infinity) ||
      /[<>\x00-\x08]/.test(value) ||
      (schema.pattern && !new RegExp(schema.pattern).test(value)))
  )
    errors.push(`${at}: invalid text`);
  if (type === "object") {
    for (const k of schema.required ?? [])
      if (!Object.hasOwn(value, k)) errors.push(`${at}.${k}: required`);
    for (const [k, v] of Object.entries(value)) {
      if (["__proto__", "constructor", "prototype"].includes(k))
        errors.push(`${at}: unsafe key`);
      else if (schema.properties?.[k])
        errors.push(...validate(v, schema.properties[k], `${at}.${k}`));
      else if (schema.additionalProperties === false)
        errors.push(`${at}.${k}: unexpected`);
    }
  }
  if (type === "array") {
    if (
      value.length < (schema.minItems ?? 0) ||
      value.length > (schema.maxItems ?? Infinity)
    )
      errors.push(`${at}: array size`);
    if (schema.items)
      value.forEach((v, i) =>
        errors.push(...validate(v, schema.items, `${at}[${i}]`)),
      );
  }
  return errors;
}
export const text = (max = 160) => ({
  type: "string",
  minLength: 1,
  maxLength: max,
});
export const object = (properties) => ({
  type: "object",
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});
export function assertSchema(value, schema) {
  const e = validate(value, schema);
  if (e.length) throw Error(e.join("; "));
  return value;
}
export const specSchema = object({
  schemaVersion: { type: "integer", enum: [1] },
  id: { ...text(60), pattern: "^[a-z0-9-]+$" },
  seed: { type: "integer" },
  title: text(60),
  premise: text(240),
  setting: { type: "string", enum: ["greenhouse", "harbor", "observatory"] },
  mode: { type: "string", enum: ["hold", "deliver", "sequence"] },
  palette: { type: "string", enum: ["jade", "amber", "indigo"] },
  objectiveLabel: text(60),
  hazardLabel: text(60),
  duration: { type: "integer", minimum: 45, maximum: 180 },
  speed: { type: "number", minimum: 3, maximum: 7 },
  targetCount: { type: "integer", minimum: 3, maximum: 6 },
  hazardCount: { type: "integer", minimum: 1, maximum: 4 },
  stages: { type: "integer", enum: [3] },
  interactionSeconds: { type: "number", minimum: 0.4, maximum: 2 },
  controls: text(200),
});
