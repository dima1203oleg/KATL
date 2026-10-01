/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLocale = 'uk' | 'en' | 'zh-cn';

export interface GlossaryTerm {
  key: string;
  category: 'electrical' | 'bess' | 'commercial' | 'safety';
  uk: string;
  en: string;
  zhCn: string;
  definitionUk: string;
}

export const BESS_GLOSSARY: GlossaryTerm[] = [
  {
    key: 'bess',
    category: 'bess',
    uk: 'Система накопичення енергії акумуляторного типу (СНЕА / BESS)',
    en: 'Battery Energy Storage System (BESS)',
    zhCn: '电池储能系统 (BESS)',
    definitionUk: 'Комплексна інженерна система акумуляторних блоків, інверторів (PCS) та системи керування (EMS).'
  },
  {
    key: 'lcos',
    category: 'commercial',
    uk: 'Нормована вартість зберігання енергії (LCOS)',
    en: 'Levelized Cost of Storage (LCOS)',
    zhCn: '平准化度电储能成本 (LCOS)',
    definitionUk: 'Сумарна вартість зберігання та віддачі однієї кіловат-години енергії за весь життєвий цикл.'
  },
  {
    key: 'c_rate',
    category: 'electrical',
    uk: 'Швидкість розряду/заряду (C-rate)',
    en: 'Discharge/Charge Rate (C-rate)',
    zhCn: '充放电倍率 (C-rate)',
    definitionUk: 'Відношення сили струму заряду або розряду до номінальної ємності акумулятора.'
  },
  {
    key: 'rte',
    category: 'electrical',
    uk: 'ККД повного циклу (Round Trip Efficiency)',
    en: 'Round Trip Efficiency (RTE)',
    zhCn: '系统往返效率 (RTE)',
    definitionUk: 'Відношення кількості корисної енергії на розряді до кількості енергії на заряді.'
  },
  {
    key: 'grid_forming',
    category: 'electrical',
    uk: 'Режим формування мережі (Grid-Forming)',
    en: 'Grid-Forming Control',
    zhCn: '构网型控制 (Grid-Forming)',
    definitionUk: 'Здатність інвертора самостійно генерувати стабільну синусоїду напруги та частоти без зовнішньої мережі.'
  }
];

export interface TranslationRecord {
  id: string;
  sourceText: string;
  sourceLocale: SupportedLocale;
  targetLocale: SupportedLocale;
  translatedText: string;
  status: 'DRAFT' | 'MACHINE_TRANSLATED' | 'HUMAN_REVIEW' | 'APPROVED' | 'OUTDATED';
  verifiedBy?: string;
  verifiedAt?: string;
  usageCount: number;
}
