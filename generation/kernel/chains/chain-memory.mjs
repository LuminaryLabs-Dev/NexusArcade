export function createChainMemory(initial = {}) {
  const values = structuredClone(initial);
  return {
    values,
    read(key) {
      return values[key];
    },
    write(key, value) {
      values[key] = structuredClone(value);
    },
    snapshot() {
      return structuredClone(values);
    },
  };
}

export function injectMemory(value, memory) {
  if (typeof value === "string") {
    return value.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, key) => {
      const resolved = key
        .trim()
        .split(".")
        .reduce((item, part) => item?.[part], memory);
      return resolved === undefined
        ? ""
        : typeof resolved === "string"
          ? resolved
          : JSON.stringify(resolved);
    });
  }
  if (Array.isArray(value))
    return value.map((item) => injectMemory(item, memory));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        injectMemory(item, memory),
      ]),
    );
  return value;
}
