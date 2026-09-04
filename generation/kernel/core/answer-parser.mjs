export function parseAnswer(raw) {
  const text = String(raw ?? "").trim();
  if (!text) throw new Error("model output is empty");
  const unwrapped = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(unwrapped);
  } catch (firstError) {
    const candidate = firstBalancedObject(unwrapped);
    if (!candidate) throw firstError;
    return JSON.parse(candidate);
  }
}

function firstBalancedObject(text) {
  let start = -1;
  let depth = 0;
  let string = false;
  let escaped = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (string) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') string = false;
      continue;
    }
    if (char === '"') {
      string = true;
      continue;
    }
    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
    } else if (char === "}" && depth > 0) {
      depth -= 1;
      if (depth === 0) return text.slice(start, index + 1);
    }
  }
  return null;
}
