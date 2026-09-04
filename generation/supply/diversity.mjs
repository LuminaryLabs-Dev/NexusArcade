export function fingerprint(s) {
  return [s.settings, s.modes, s.palettes, s.materials].join("|");
}
export function distinct(s, history) {
  return !history.some((x) => fingerprint(x) === fingerprint(s));
}
