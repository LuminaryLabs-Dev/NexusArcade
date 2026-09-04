export function hashSeed(seed = "nexusengine") {
  const text = String(seed);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed = "nexusengine") {
  let state = hashSeed(seed) || 1;
  return {
    seed,
    nextUint32() {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      return state >>> 0;
    },
    next() {
      return this.nextUint32() / 0x100000000;
    },
    snapshot() {
      return { seed, state: state >>> 0 };
    },
    restore(snapshot = {}) {
      state = Number(snapshot.state ?? hashSeed(snapshot.seed ?? seed)) >>> 0;
      return this.snapshot();
    }
  };
}

export function createScopedSeed(parentSeed, scopeId) {
  return `${String(parentSeed)}:${String(scopeId)}`;
}

export function sampleRange(rng, min = 0, max = 1) {
  return min + (max - min) * rng.next();
}

export function chooseSeeded(rng, items = []) {
  if (!items.length) return undefined;
  return items[Math.floor(rng.next() * items.length) % items.length];
}

export function shuffleSeeded(rng, items = []) {
  const output = [...items];
  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng.next() * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}
