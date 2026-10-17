/**
 * How well `query` matches `text`, from 0 (no match) to 1 (exact). Ranks, best first: exact,
 * prefix, the start of a word, a substring, then the query's characters in order (fuzzy).
 */
export function commandScore(text: string, query: string): number {
  const haystack = text.toLowerCase();
  const needle = query.trim().toLowerCase();
  if (!needle) return 1;
  if (haystack === needle) return 1;
  if (haystack.startsWith(needle)) return 0.9;
  if (haystack.split(/[\s\-_/]+/).some((word) => word.startsWith(needle))) return 0.8;
  if (haystack.includes(needle)) return 0.6;
  // Fuzzy: every query character appears in order. Tighter matches score higher.
  let position = -1;
  let gaps = 0;
  for (const character of needle) {
    const next = haystack.indexOf(character, position + 1);
    if (next === -1) return 0;
    if (position !== -1) gaps += next - position - 1;
    position = next;
  }
  return Math.max(0.1, 0.5 - gaps / (haystack.length * 2));
}

/** The best score across a label and its keywords. */
export const bestScore = (label: string, keywords: string[] | undefined, query: string) =>
  Math.max(commandScore(label, query), ...(keywords ?? []).map((keyword) => commandScore(keyword, query) * 0.95));
