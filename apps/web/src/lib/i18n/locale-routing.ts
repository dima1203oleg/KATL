export const supportedLocales = ['uk-UA', 'en', 'zh-CN'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export interface LocaleSelectionInput {
  preference?: string | null;
  country?: string | null;
  acceptLanguage?: string | null;
}

/** Resolves only the unprefixed entry route. Explicit locale URLs remain canonical. */
export function selectEntryLocale(input: LocaleSelectionInput): SupportedLocale {
  if (input.preference && supportedLocales.includes(input.preference as SupportedLocale)) {
    return input.preference as SupportedLocale;
  }

  const country = input.country?.trim().toUpperCase();
  if (country === 'UA') return 'uk-UA';
  if (country === 'CN') return 'zh-CN';

  const ranked = (input.acceptLanguage || '')
    .split(',')
    .map((item, index) => {
      const [tag = '', ...params] = item.trim().split(';');
      const qParam = params.find((param) => /^\s*q=/i.test(param));
      const quality = qParam ? Number(qParam.split('=')[1]) : 1;
      return { tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter((item) => item.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const { tag } of ranked) {
    if (tag === 'zh' || tag.startsWith('zh-')) return 'zh-CN';
    if (tag === 'en' || tag.startsWith('en-')) return 'en';
    if (tag === 'uk' || tag.startsWith('uk-')) return 'uk-UA';
  }
  return 'uk-UA';
}
