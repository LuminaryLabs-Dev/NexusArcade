function assertPortable(value, path, stack) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError(`${path} must contain only finite numbers.`);
    return;
  }
  if (typeof value !== "object") {
    throw new TypeError(`${path} must contain only JSON-portable values.`);
  }
  if (stack.has(value)) throw new TypeError(`${path} must not contain cyclic references.`);
  stack.add(value);
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertPortable(entry, `${path}[${index}]`, stack));
    stack.delete(value);
    return;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError(`${path} must use plain objects instead of ${value.constructor?.name ?? "custom values"}.`);
  }
  for (const [key, entry] of Object.entries(value)) assertPortable(entry, `${path}.${key}`, stack);
  stack.delete(value);
}

export function assertSerializableState(value, path = "state") {
  assertPortable(value, path, new WeakSet());
  return value;
}

export function cloneSerializableState(value) {
  assertSerializableState(value);
  return structuredClone(value);
}

export function createSerializableState(initialState = {}) {
  let state = cloneSerializableState(initialState);
  return {
    getState() {
      return cloneSerializableState(state);
    },
    setState(next = {}) {
      state = cloneSerializableState(next);
      return this.getState();
    },
    patchState(patch = {}) {
      state = cloneSerializableState({ ...state, ...patch });
      return this.getState();
    }
  };
}
