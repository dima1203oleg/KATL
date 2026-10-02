import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { selectEntryLocale } from '../../apps/web/src/lib/i18n/locale-routing';

describe('root locale negotiation', () => {
  it('defaults visitors in Ukraine to Ukrainian even when browser language differs', () => {
    assert.equal(selectEntryLocale({ country: 'ua', acceptLanguage: 'en-US,en;q=0.9' }), 'uk-UA');
  });

  it('uses Simplified Chinese for visitors in China', () => {
    assert.equal(selectEntryLocale({ country: 'CN', acceptLanguage: 'en-US,en;q=0.9' }), 'zh-CN');
  });

  it('uses the saved language preference ahead of geolocation', () => {
    assert.equal(selectEntryLocale({ preference: 'en', country: 'UA', acceptLanguage: 'uk' }), 'en');
  });

  it('uses the highest quality supported browser language outside UA and CN', () => {
    assert.equal(selectEntryLocale({ country: 'DE', acceptLanguage: 'en;q=0.7, zh-CN;q=0.9, uk;q=0.1' }), 'zh-CN');
  });

  it('ignores unsupported and zero-quality languages and falls back to Ukrainian', () => {
    assert.equal(selectEntryLocale({ country: 'DE', acceptLanguage: 'ru;q=1, en;q=0' }), 'uk-UA');
  });
});
