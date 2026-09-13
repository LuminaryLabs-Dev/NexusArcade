// Local-only exclusion: never echo blocked vocabulary into model correction prompts.
const blockedTerms = ['courier'];
export function hasBlockedText(value) {
  const text = (typeof value === 'string' ? value : JSON.stringify(value) ?? '').normalize('NFKC').toLowerCase();
  return blockedTerms.some(term => text.includes(term));
}
export function assertAllowedText(value) {
  if (hasBlockedText(value)) throw Error('Invalid editorial language. Describe concrete scene actions without assigning a player occupation.');
  return value;
}
