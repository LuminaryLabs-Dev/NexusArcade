function toHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function sha256(bytes) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const data = view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
  if (!globalThis.crypto?.subtle) throw new Error("Web Crypto SHA-256 is unavailable");
  return toHex(new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256", data)));
}

export async function verifyFile(bytes, expected, label = expected.path) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (view.byteLength !== expected.bytes) throw new Error(`${label}: expected ${expected.bytes} bytes, received ${view.byteLength}`);
  const digest = await sha256(view);
  if (digest !== expected.sha256.toLowerCase()) throw new Error(`${label}: SHA-256 mismatch`);
  return true;
}
