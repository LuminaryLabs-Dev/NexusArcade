const ID_RE = /^NXA-[0-9]{6}$/;
const VERSION_RE = /^[0-9]+\.[0-9]+\.[0-9]+$/;

export function assertGameId(value) {
  if (typeof value !== "string" || !ID_RE.test(value)) throw new TypeError(`Invalid Nexus Arcade game ID: ${value}`);
  return value;
}

export function assertVersion(value) {
  if (typeof value !== "string" || !VERSION_RE.test(value)) throw new TypeError(`Invalid semantic version: ${value}`);
  return value;
}

export function assertSafeRelativePath(value, label = "path") {
  if (typeof value !== "string" || !value || value.length > 1024) throw new TypeError(`${label} must be a non-empty relative path`);
  if (value.includes("\\") || value.startsWith("/") || value.includes("\0") || /[?#]/.test(value)) throw new TypeError(`${label} is not a safe relative path: ${value}`);
  let decoded;
  try { decoded = decodeURIComponent(value); } catch { throw new TypeError(`${label} contains invalid encoding`); }
  if (/(?:^|\/)\.\.?(?:\/|$)/.test(decoded)) throw new TypeError(`${label} contains traversal: ${value}`);
  const segments = value.split("/");
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) throw new TypeError(`${label} contains an unsafe segment: ${value}`);
  return value;
}

export function virtualGamePath(scopePath, manifest, filePath = manifest.entry) {
  assertGameId(manifest.id);
  assertVersion(manifest.version);
  assertSafeRelativePath(filePath);
  const scope = `/${String(scopePath || "/nexus-arcade/").split("/").filter(Boolean).join("/")}/`;
  return `${scope}runtime/${manifest.id}/${manifest.version}/${filePath}`;
}
