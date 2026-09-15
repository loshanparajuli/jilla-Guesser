// milaune — turning whatever the player typed into a district.

import { JILLA, JILLA_BY_ID, type Jilla } from "./jilla.ts";

/** Lowercase, strip accents and punctuation, drop spaces. "Rukum East" -> "rukumeast" */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/** Every spelling we accept for a district: its name, its map id, its aliases. */
function spellings(jilla: Jilla): string[] {
  const all = [jilla.name, jilla.id.replace(/-/g, " "), ...jilla.aliases];
  return [...new Set(all.map(normalize))].filter(Boolean);
}

const EXACT = new Map<string, string>();
const ALL: Array<{ spelling: string; id: string }> = [];

for (const jilla of JILLA) {
  for (const spelling of spellings(jilla)) {
    if (!EXACT.has(spelling)) EXACT.set(spelling, jilla.id);
    ALL.push({ spelling, id: jilla.id });
  }
}

/** Levenshtein distance, giving up as soon as every path costs more than `max`. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      row.push(value);
      if (value < best) best = value;
    }
    if (best > max) return max + 1;
    prev = row;
  }
  return prev[b.length];
}

/** Closest districts to `text`, and how far off they were. Ties come back together. */
function closest(text: string, max: number): { ids: string[]; off: number } {
  let off = max + 1;
  let ids = new Set<string>();
  for (const { spelling, id } of ALL) {
    const d = distance(text, spelling, off);
    if (d > max) continue;
    if (d < off) {
      off = d;
      ids = new Set([id]);
    } else if (d === off) {
      ids.add(id);
    }
  }
  return { ids: [...ids], off };
}

/** How far off a typo may be before we stop trusting it. Short names get no slack. */
function slack(length: number): number {
  if (length < 5) return 0;
  if (length < 9) return 1;
  return 2;
}

export type Milan =
  | { kind: "pakka"; id: string } // spelled right
  | { kind: "najik"; id: string } // near enough, one district only
  | { kind: "dubidha"; ids: string[] } // near two — we refuse to pick
  | { kind: "kehi-chhaina" }; // nothing close

/**
 * Exact spellings win outright. A typo is only accepted when a single district
 * sits closest to it, so "oolpa" never silently becomes Dolpa when Rolpa is
 * just as near.
 */
export function milau(text: string): Milan {
  const q = normalize(text);
  if (!q) return { kind: "kehi-chhaina" };

  const exact = EXACT.get(q);
  if (exact) return { kind: "pakka", id: exact };

  const max = slack(q.length);
  if (max === 0) return { kind: "kehi-chhaina" };

  const { ids } = closest(q, max);
  if (ids.length === 1) return { kind: "najik", id: ids[0] };
  if (ids.length > 1) return { kind: "dubidha", ids };
  return { kind: "kehi-chhaina" };
}

/**
 * True when the player could still be mid-word: some other district's spelling
 * continues past what they have typed. Guards auto-submit, so a partial entry
 * is never claimed by a district they weren't aiming at.
 */
export function aruBaaki(text: string, except?: string): boolean {
  const q = normalize(text);
  if (!q) return false;
  return ALL.some(
    ({ spelling, id }) => id !== except && spelling.length > q.length && spelling.startsWith(q),
  );
}

/**
 * Districts whose spelling begins with the query — the answer to a half-typed
 * stem like "rukum" or "nawalparasi".
 */
export function shuruHune(text: string, limit = 4): string[] {
  const q = normalize(text);
  if (q.length < 3) return [];
  const ids = new Set<string>();
  for (const { spelling, id } of ALL) {
    if (spelling.startsWith(q)) ids.add(id);
    if (ids.size > limit) return [];
  }
  return [...ids];
}

/**
 * The hint. Far more forgiving than `milau` — it will name a district the
 * player was clearly reaching for even when the spelling is well off, because
 * by the time we call this they have been stuck for a while and telling them
 * is kinder than letting them stall. Still refuses ties, and never points at
 * something already found.
 */
export function najikkoJilla(text: string, bhetiyo: ReadonlySet<string>): string | null {
  const q = normalize(text);
  if (q.length < 4) return null;

  // Roughly half the word may be wrong and we will still take the guess.
  const { ids, off } = closest(q, Math.min(5, Math.floor(q.length / 2) + 1));
  if (ids.length !== 1) return null;
  if (bhetiyo.has(ids[0])) return null;
  if (off === 0) return null; // they spelled it right; that is not a hint

  return JILLA_BY_ID.get(ids[0])?.name ?? null;
}
