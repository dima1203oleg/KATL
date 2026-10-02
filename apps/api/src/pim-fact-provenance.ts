export type TechnicalFact = { path: string; value: unknown };

function escapePointerSegment(value: string): string {
  return value.replace(/~/g, '~0').replace(/\//g, '~1');
}

export function extractTechnicalFacts(groups: Record<string, unknown>): TechnicalFact[] {
  const facts: TechnicalFact[] = [];
  const visit = (path: string, value: unknown) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      if (!value.length) return;
      value.forEach((item, index) => visit(`${path}/${index}`, item));
      return;
    }
    if (typeof value === 'object') {
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        visit(`${path}/${escapePointerSegment(key)}`, child);
      }
      return;
    }
    facts.push({ path, value });
  };
  for (const [group, value] of Object.entries(groups)) visit(`/${escapePointerSegment(group)}`, value);
  if (facts.length > 500) throw new Error('TOO_MANY_TECHNICAL_FACTS');
  return facts;
}

export function normalizeSourceEvidence(value: string): string {
  const decodeCodePoint = (candidate: number) => Number.isInteger(candidate) && candidate >= 0 && candidate <= 0x10ffff
    && (candidate < 0xd800 || candidate > 0xdfff) ? String.fromCodePoint(candidate) : ' ';
  return value
    .normalize('NFKC')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;|&#xA0;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_match, code: string) => decodeCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_match, code: string) => decodeCodePoint(parseInt(code, 16)))
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase();
}

function normalizedNumber(value: number): string {
  return String(value);
}

export function evidenceContainsFactValue(excerpt: string, value: unknown): boolean {
  const normalizedExcerpt = normalizeSourceEvidence(excerpt);
  if (typeof value === 'number') {
    const number = normalizedNumber(value);
    const escaped = number.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^\\d.,])${escaped}($|[^\\d.,])`).test(normalizedExcerpt);
  }
  if (typeof value === 'string') return normalizedExcerpt.includes(normalizeSourceEvidence(value));
  if (typeof value === 'boolean') return normalizedExcerpt.length > 0;
  return false;
}

export function sameJsonValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
