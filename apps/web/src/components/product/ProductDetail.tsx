/**
 * Product detail page — "Spec-first" layout.
 * Server component: all meaningful content (specs, sources, documents) is in the initial HTML
 * for search engines, AI retrieval and fast LCP. Only the CSV export is client-side.
 */
import Link from 'next/link';
import type { KatlProduct } from '@katl/shared-types';
import type { KatlDocument } from '../../lib/pim/pimRepository';
import { ArrowRight, ArrowUpRight, FileText, Calculator, GitCompare, ShieldCheck, Info } from 'lucide-react';
import { BRAND } from '../../lib/brand';
import {
  asLang, label, specGroups, splitValue, energyKwh, powerKw, percent, tempRange, standards, isSystem, csv, type Lang,
} from './productSpec';
import { SpecExport } from './SpecExport';

const COPY = {
  'uk-UA': {
    home: 'Головна', catalog: 'Каталог',
    status: 'Попередні дані', statusNote: 'Остаточні значення фіксуються в ТКП за чинним datasheet виробника.',
    source: 'Джерело виробника', updated: 'Оновлено',
    rfq: 'Запросити ТКП', datasheet: 'Запросити datasheet', calc: 'Розрахувати систему', compare: 'Порівняти',
    visual: 'Концептуальна візуалізація — не фотографія виробу.',
    nav: { overview: 'Огляд', specs: 'Характеристики', safety: 'Безпека', integration: 'Інтеграція', docs: 'Документи', sources: 'Джерела' },
    overviewTitle: 'Ключові параметри', overviewBody: 'Головне про систему на одному екрані. Повні дані — у специфікації нижче.',
    energy: 'Енергія', power: 'Потужність', duration: 'Тривалість розряду', derived: 'розрахунково: ємність ÷ потужність',
    usableShare: 'корисна частка', rte: 'ККД циклу', life: 'Ресурс', cells: 'Комірки', thermal: 'Клімат', enclosure: 'Корпус', safety: 'Безпека',
    tempScale: 'Робочий діапазон на шкалі −40…+60 °C',
    specsTitle: 'Технічна специфікація', specsBody: 'Параметри з продуктової бази. Терміни з підкресленням ведуть у глосарій.',
    export: 'Завантажити CSV', groups: 'Розділи',
    safetyTitle: 'Безпека та відповідність',
    safetyBody: 'Стандарти нижче заявлені в джерелі даних про продукт. Копії чинних сертифікатів і протоколів випробувань для конкретної поставки надаються разом із ТКП — без них ми не стверджуємо відповідність.',
    standardsLink: (n: number) => `Заявлені стандарти: ${n}`,
    stated: 'заявлено', noStandards: 'Стандарти для цієї моделі уточнюються за запитом.',
    integrationTitle: 'Як система вбудовується в об’єкт',
    integrationBody: 'Типовий ланцюг для системи такого класу. Схема підключення, PCS, трансформатор і захисти визначаються проєктом під конкретну точку приєднання.',
    chain: [['Мережа / СЕС', 'точка приєднання'], ['Трансформатор', 'НН / СН'], ['PCS', 'AC ⇄ DC'], ['Батарейна система', 'BMS · клімат · пожежогасіння'], ['EMS', 'алгоритми й диспетчеризація']],
    docsTitle: 'Документи', docsBody: 'Посилання ведуть на сайт виробника. Актуальну редакцію документа підтверджуємо в ТКП.',
    open: 'Відкрити', noDocs: 'Документи для цієї модифікації надаємо за інженерним запитом.',
    sourcesTitle: 'Звідки ці дані', sourcesBody: 'Ключові параметри прив’язані до першоджерела. Якщо значення розходиться з datasheet — пріоритет має datasheet.',
    param: 'Параметр', value: 'Значення', ref: 'Джерело',
    ctaTitle: 'Підберемо конфігурацію під ваш профіль навантаження',
    ctaBody: 'Інженер перевірить, чи підходить ця модель вашому об’єкту, і підготує ТКП з розрахунком економіки та логістики.',
    datasheetDetails: (n: string) => `Прошу надіслати datasheet і технічну документацію на ${n}.`,
  },
  en: {
    home: 'Home', catalog: 'Catalogue',
    status: 'Preliminary data', statusNote: 'Final values are fixed in the proposal against the current manufacturer datasheet.',
    source: 'Manufacturer source', updated: 'Updated',
    rfq: 'Request a proposal', datasheet: 'Request datasheet', calc: 'Size a system', compare: 'Compare',
    visual: 'Concept visualisation — not a product photograph.',
    nav: { overview: 'Overview', specs: 'Specifications', safety: 'Safety', integration: 'Integration', docs: 'Documents', sources: 'Sources' },
    overviewTitle: 'Key parameters', overviewBody: 'The essentials on one screen. Full data is in the specification below.',
    energy: 'Energy', power: 'Power', duration: 'Discharge duration', derived: 'derived: energy ÷ power',
    usableShare: 'usable share', rte: 'Round-trip efficiency', life: 'Lifetime', cells: 'Cells', thermal: 'Climate', enclosure: 'Enclosure', safety: 'Safety',
    tempScale: 'Operating range on a −40…+60 °C scale',
    specsTitle: 'Technical specification', specsBody: 'Parameters from the product database. Underlined terms link to the glossary.',
    export: 'Download CSV', groups: 'Sections',
    safetyTitle: 'Safety and compliance',
    safetyBody: 'The standards below are stated in the product data source. Copies of valid certificates and test reports for a specific delivery come with the proposal — without them we do not claim compliance.',
    standardsLink: (n: number) => `Stated standards: ${n}`,
    stated: 'stated', noStandards: 'Standards for this model are confirmed on request.',
    integrationTitle: 'How the system fits your site',
    integrationBody: 'A typical chain for a system of this class. Connection scheme, PCS, transformer and protection are defined by the project for the specific grid connection point.',
    chain: [['Grid / PV', 'connection point'], ['Transformer', 'LV / MV'], ['PCS', 'AC ⇄ DC'], ['Battery system', 'BMS · climate · fire suppression'], ['EMS', 'control & dispatch']],
    docsTitle: 'Documents', docsBody: 'Links open the manufacturer website. We confirm the current revision of each document in the proposal.',
    open: 'Open', noDocs: 'Documents for this variant are provided on engineering request.',
    sourcesTitle: 'Where this data comes from', sourcesBody: 'Key parameters are linked to a primary source. Where a value differs from the datasheet, the datasheet prevails.',
    param: 'Parameter', value: 'Value', ref: 'Source',
    ctaTitle: 'We will size a configuration for your load profile',
    ctaBody: 'An engineer checks whether this model fits your site and prepares a proposal with economics and logistics.',
    datasheetDetails: (n: string) => `Please send the datasheet and technical documentation for ${n}.`,
  },
  'zh-CN': {
    home: '首页', catalog: '产品目录',
    status: '初步数据', statusNote: '最终参数以现行制造商规格书为准，并写入正式方案。',
    source: '制造商来源', updated: '更新于',
    rfq: '获取方案报价', datasheet: '索取规格书', calc: '测算配置', compare: '对比',
    visual: '概念示意图，非产品实拍。',
    nav: { overview: '概览', specs: '技术参数', safety: '安全', integration: '系统集成', docs: '文档', sources: '数据来源' },
    overviewTitle: '关键参数', overviewBody: '一屏掌握核心信息，完整数据见下方规格表。',
    energy: '能量', power: '功率', duration: '放电时长', derived: '推算：容量 ÷ 功率',
    usableShare: '可用比例', rte: '往返效率', life: '寿命', cells: '电芯', thermal: '环境', enclosure: '箱体', safety: '安全',
    tempScale: '工作温度区间（标尺 −40…+60 °C）',
    specsTitle: '技术规格', specsBody: '参数来自产品数据库。带下划线的术语链接至术语表。',
    export: '下载 CSV', groups: '章节',
    safetyTitle: '安全与合规',
    safetyBody: '以下标准为产品数据来源中的声明。具体批次的有效证书与测试报告副本随正式方案提供；未提供前，我们不作合规承诺。',
    standardsLink: (n: number) => `声明标准：${n} 项`,
    stated: '声明', noStandards: '该型号的标准信息可按需确认。',
    integrationTitle: '系统如何接入项目现场',
    integrationBody: '此类系统的典型链路。接线方案、PCS、变压器及保护配置均按具体并网点在项目设计中确定。',
    chain: [['电网 / 光伏', '并网点'], ['变压器', '低压 / 中压'], ['PCS', 'AC ⇄ DC'], ['电池系统', 'BMS · 温控 · 消防'], ['EMS', '控制与调度']],
    docsTitle: '文档', docsBody: '链接指向制造商网站。各文件的现行版本将在正式方案中确认。',
    open: '打开', noDocs: '该型号文档可通过工程咨询获取。',
    sourcesTitle: '数据来源', sourcesBody: '关键参数均关联原始来源。如与规格书不一致，以规格书为准。',
    param: '参数', value: '数值', ref: '来源',
    ctaTitle: '根据您的负荷曲线确定配置',
    ctaBody: '工程师将评估该型号是否适合您的项目，并提供含经济性与物流的正式方案。',
    datasheetDetails: (n: string) => `请提供 ${n} 的规格书及技术文档。`,
  },
} as const;

const GLOSSARY_STANDARDS: Record<string, string> = { 'UL 9540A': 'ul-9540a', 'IEC 62619': 'iec-62619' };

function Readout({ label: l, value, note, big }: { label: string; value?: string; note?: string; big?: boolean }) {
  const v = splitValue(value);
  if (!value) return null;
  return (
    <div className={`kx-readout${big ? ' is-big' : ''}`}>
      <dt>{l}</dt>
      <dd>
        {v ? (<><span className="kx-num">{/^[≥≤~≈]/.test(v.num) ? <><span className="kx-num-op">{v.num[0]}</span>{v.num.slice(1).trim()}</> : v.num}</span><span className="kx-unit">{v.unit}</span></>) : <span className="kx-num-text">{value}</span>}
        {v?.rest ? <small className="kx-rest">{v.rest}</small> : null}
        {note ? <small className="kx-derived">{note}</small> : null}
      </dd>
    </div>
  );
}

export function ProductDetail({ product, locale, documents = [] }: { product: KatlProduct; locale: string; documents?: KatlDocument[] }) {
  const lang: Lang = asLang(locale);
  const t = COPY[lang];
  const root = `/${lang}`;
  const id = encodeURIComponent(product.id);
  const e = (product.energySpecs ?? {}) as unknown as Record<string, string>;
  const c = product.cellSpecs ?? ({} as KatlProduct['cellSpecs']);
  const th = product.thermalSpecs ?? ({} as KatlProduct['thermalSpecs']);
  const m = product.mechanicalSpecs ?? ({} as KatlProduct['mechanicalSpecs']);
  const s = product.safetySpecs ?? ({} as KatlProduct['safetySpecs']);

  const groups = specGroups(product, lang);
  const stds = standards(product);
  const system = isSystem(product);

  // Deterministic derived values — shown only when both inputs exist.
  const eKwh = energyKwh(e.nominalCapacity);
  const uKwh = energyKwh(e.usableCapacity);
  const pKw = powerKw(e.maxContinuousPowerKw);
  const duration = eKwh && pKw ? eKwh / pKw : null;
  const usableShare = eKwh && uKwh && uKwh <= eKwh ? Math.round((uKwh / eKwh) * 100) : null;
  const rte = percent(e.efficiencyRoundTrip);
  const temps = tempRange(th.operatingTempRange);
  const fmt = (n: number, d = 1) => n.toLocaleString(lang, { maximumFractionDigits: d });

  const facts = Object.entries(product.provenance?.facts ?? {});
  const factValue = (path: string) => {
    const [grp, key] = path.split('.');
    const v = (product as unknown as Record<string, Record<string, unknown>>)[grp]?.[key];
    return Array.isArray(v) ? v.join(', ') : v == null ? '' : String(v);
  };
  const updated = product.provenance?.verifiedAt || product.provenance?.lastUpdated;
  const datasheetHref = `${root}/rfq?product=${id}&details=${encodeURIComponent(t.datasheetDetails(product.name))}`;
  const rfqHref = `${root}/rfq?product=${id}${eKwh ? `&capacityKwh=${Math.round(eKwh)}` : ''}${pKw ? `&powerKw=${Math.round(pKw)}` : ''}`;
  const calcHref = `${root}/engineering/bess-calculator?product=${id}`;

  const nav: Array<[string, string]> = [
    ['overview', t.nav.overview], ['specs', t.nav.specs], ['safety', t.nav.safety],
    ...(system ? [['integration', t.nav.integration] as [string, string]] : []),
    ['docs', t.nav.docs], ...(facts.length ? [['sources', t.nav.sources] as [string, string]] : []),
  ];

  return (
    <main className="kx-pdp">
      {/* ------------------------------------------------------------ HERO */}
      <section className="kx-pdp-hero" aria-labelledby="pdp-title">
        <div className="kx-wrap">
          <nav className="kx-crumbs" aria-label="Breadcrumb">
            <Link href={root}>{t.home}</Link><span aria-hidden="true">/</span>
            <Link href={`${root}/products`}>{t.catalog}</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>

          <div className="kx-pdp-hero-grid">
            <div className="kx-pdp-hero-copy">
              <p className="kx-kicker">CATL · {product.category}</p>
              <h1 id="pdp-title">{product.name}</h1>
              {product.shortDesc ? <p className="kx-pdp-lede">{product.shortDesc}</p> : null}

              <div className="kx-pdp-status">
                <span className="kx-badge kx-badge-pending"><Info size={13} aria-hidden="true" />{t.status}</span>
                <span>{t.statusNote}</span>
              </div>

              <div className="kx-actions">
                <Link className="kx-btn kx-btn-primary" href={rfqHref}>{t.rfq}<ArrowRight size={16} aria-hidden="true" /></Link>
                <Link className="kx-btn kx-btn-ghost" href={datasheetHref}><FileText size={16} aria-hidden="true" />{t.datasheet}</Link>
              </div>
              <div className="kx-pdp-sublinks">
                <Link href={calcHref}><Calculator size={15} aria-hidden="true" />{t.calc}</Link>
                <Link href={`${root}/compare?products=${id}`}><GitCompare size={15} aria-hidden="true" />{t.compare}</Link>
                {product.provenance?.sourceUrl ? (
                  <a href={product.provenance.sourceUrl} target="_blank" rel="noreferrer noopener">{t.source}<ArrowUpRight size={13} aria-hidden="true" /></a>
                ) : null}
              </div>
            </div>

            <figure className="kx-pdp-visual">
              <div className="kx-pdp-stage">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/design/products/${id}.webp`} alt={product.name} width={640} height={420} fetchPriority="high" decoding="async" />
              </div>
              <dl className="kx-pdp-readouts">
                <Readout label={eKwh ? t.energy : label('nominalCapacity', lang)} value={e.nominalCapacity} />
                <Readout label={t.power} value={e.maxContinuousPowerKw} />
                {duration ? <Readout label={t.duration} value={`${fmt(duration)} ${lang === 'en' ? 'h' : lang === 'zh-CN' ? '小时' : 'год'}`} /> : <Readout label={label('chemistry', lang)} value={c.chemistry} />}
              </dl>
              <figcaption>{t.visual}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ LOCAL NAV */}
      <nav className="kx-pdp-nav" aria-label={product.name}>
        <div className="kx-wrap">
          <ul>{nav.map(([href, text]) => <li key={href}><a href={`#${href}`}>{text}</a></li>)}</ul>
          <Link className="kx-btn kx-btn-primary kx-btn-sm" href={rfqHref}>{t.rfq}</Link>
        </div>
      </nav>

      {/* ------------------------------------------------------------ OVERVIEW / BENTO */}
      <section id="overview" className="kx-pdp-section" aria-labelledby="overview-h">
        <div className="kx-wrap">
          <header className="kx-pdp-head">
            <h2 id="overview-h">{t.overviewTitle}</h2>
            <p>{t.overviewBody}</p>
          </header>

          <div className="kx-bento">
            {e.nominalCapacity ? (
              <article className="kx-tile kx-tile-hero">
                <h3>{eKwh ? t.energy : label('nominalCapacity', lang)}</h3>
                <dl>
                  <Readout big label={label('nominalCapacity', lang)} value={e.nominalCapacity} />
                  <Readout label={label('usableCapacity', lang)} value={e.usableCapacity} />
                </dl>
                {usableShare ? (
                  <div className="kx-meter" role="img" aria-label={`${t.usableShare} ${usableShare}%`}>
                    <span style={{ width: `${usableShare}%` }} />
                    <small className="kx-mono">{t.usableShare} · {usableShare}%</small>
                  </div>
                ) : null}
              </article>
            ) : null}

            {e.maxContinuousPowerKw || e.cRate ? (
              <article className="kx-tile">
                <h3>{t.power}</h3>
                <dl>
                  <Readout label={label('maxContinuousPowerKw', lang)} value={e.maxContinuousPowerKw} />
                  <Readout label="C-rate" value={e.cRate} />
                  {duration ? <Readout label={t.duration} value={`${fmt(duration)} ${lang === 'en' ? 'h' : lang === 'zh-CN' ? '小时' : 'год'}`} note={t.derived} /> : null}
                </dl>
              </article>
            ) : null}

            {e.efficiencyRoundTrip ? (
              <article className="kx-tile">
                <h3>{t.rte}</h3>
                <dl><Readout big label="RTE" value={e.efficiencyRoundTrip} /></dl>
                {rte ? <div className="kx-meter" role="img" aria-label={`RTE ${rte}%`}><span style={{ width: `${Math.min(100, rte)}%` }} /></div> : null}
              </article>
            ) : null}

            {c.cycleLife || c.degradationFirstYears ? (
              <article className="kx-tile">
                <h3>{t.life}</h3>
                <dl>
                  <Readout label={label('cycleLife', lang)} value={c.cycleLife} />
                  {c.degradationFirstYears ? <div className="kx-readout"><dt>{label('degradationFirstYears', lang)}</dt><dd><span className="kx-num-text">{c.degradationFirstYears}</span></dd></div> : null}
                </dl>
              </article>
            ) : null}

            {c.chemistry || c.cellModel ? (
              <article className="kx-tile">
                <h3>{t.cells}</h3>
                <dl>
                  {c.chemistry ? <div className="kx-readout"><dt>{label('chemistry', lang)}</dt><dd><span className="kx-num-text">{c.chemistry}</span></dd></div> : null}
                  {c.cellModel ? <div className="kx-readout"><dt>{label('cellModel', lang)}</dt><dd><span className="kx-num-text">{c.cellModel}</span></dd></div> : null}
                  <Readout label={label('cellCapacity', lang)} value={c.cellCapacity} />
                </dl>
              </article>
            ) : null}

            {th.coolingMethod || th.operatingTempRange ? (
              <article className="kx-tile">
                <h3>{t.thermal}</h3>
                <dl>
                  {th.coolingMethod ? <div className="kx-readout"><dt>{label('coolingMethod', lang)}</dt><dd><span className="kx-num-text">{th.coolingMethod}</span></dd></div> : null}
                  {th.operatingTempRange ? <div className="kx-readout"><dt>{label('operatingTempRange', lang)}</dt><dd><span className="kx-num-text kx-mono">{th.operatingTempRange}</span></dd></div> : null}
                </dl>
                {temps ? (
                  <div className="kx-scale" role="img" aria-label={`${t.tempScale}: ${temps[0]}…${temps[1]} °C`}>
                    <span style={{ left: `${((Math.max(-40, temps[0]) + 40) / 100) * 100}%`, right: `${100 - ((Math.min(60, temps[1]) + 40) / 100) * 100}%` }} />
                    <i style={{ left: '40%' }} aria-hidden="true" />
                    <small className="kx-mono" aria-hidden="true"><b>−40</b><b>0</b><b>+60 °C</b></small>
                  </div>
                ) : null}
              </article>
            ) : null}

            {m.dimensions || m.protectionRating || m.weight ? (
              <article className="kx-tile">
                <h3>{t.enclosure}</h3>
                <dl>
                  {m.protectionRating ? <div className="kx-readout"><dt>{label('protectionRating', lang)}</dt><dd><span className="kx-num-text">{m.protectionRating}</span></dd></div> : null}
                  {m.dimensions ? <div className="kx-readout"><dt>{label('dimensions', lang)}</dt><dd><span className="kx-num-text kx-mono">{m.dimensions}</span></dd></div> : null}
                  <Readout label={label('weight', lang)} value={m.weight} />
                </dl>
              </article>
            ) : null}

            {s.fireSuppression || stds.length ? (
              <article className="kx-tile">
                <h3>{t.safety}</h3>
                {s.fireSuppression ? <p className="kx-tile-text">{s.fireSuppression}</p> : null}
                {stds.length ? <p className="kx-tile-foot"><a href="#safety">{t.standardsLink(stds.length)} →</a></p> : null}
              </article>
            ) : null}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ SPEC SHEET */}
      <section id="specs" className="kx-pdp-section kx-pdp-specs" aria-labelledby="specs-h">
        <div className="kx-wrap">
          <header className="kx-pdp-head kx-pdp-head-row">
            <div>
              <h2 id="specs-h">{t.specsTitle}</h2>
              <p>{t.specsBody}</p>
            </div>
            {groups.length ? <SpecExport csv={csv(groups, product)} filename={`${product.id}-spec.csv`} label={t.export} /> : null}
          </header>

          <div className="kx-sheet">
            <nav className="kx-sheet-index" aria-label={t.groups}>
              <ol>{groups.map((g) => <li key={g.id}><a href={`#spec-${g.id}`}>{g.title}<span className="kx-mono">{g.rows.length}</span></a></li>)}</ol>
            </nav>
            <div className="kx-sheet-body">
              {groups.map((g) => (
                <section key={g.id} id={`spec-${g.id}`} className="kx-sheet-group" aria-labelledby={`spec-${g.id}-h`}>
                  <h3 id={`spec-${g.id}-h`}>{g.title}</h3>
                  <dl>
                    {g.rows.map((r) => (
                      <div key={r.key}>
                        <dt>{r.glossary ? <Link href={`${root}/resources/glossary#${r.glossary}`} className="kx-term-link">{r.label}</Link> : r.label}</dt>
                        <dd>{r.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ SAFETY */}
      <section id="safety" className="kx-pdp-section" aria-labelledby="safety-h">
        <div className="kx-wrap kx-pdp-split">
          <header className="kx-pdp-head">
            <h2 id="safety-h">{t.safetyTitle}</h2>
            <p>{t.safetyBody}</p>
          </header>
          <div>
            {stds.length ? (
              <ul className="kx-standards">
                {stds.map((std) => {
                  const slug = Object.entries(GLOSSARY_STANDARDS).find(([k]) => std.toUpperCase().startsWith(k.toUpperCase()))?.[1];
                  return (
                    <li key={std}>
                      <ShieldCheck size={16} aria-hidden="true" />
                      {slug ? <Link href={`${root}/resources/glossary#${slug}`}>{std}</Link> : <span>{std}</span>}
                      <em>{t.stated}</em>
                    </li>
                  );
                })}
              </ul>
            ) : <p className="kx-muted">{t.noStandards}</p>}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ INTEGRATION (systems only) */}
      {system ? (
        <section id="integration" className="kx-pdp-section kx-pdp-ink" aria-labelledby="integration-h">
          <div className="kx-wrap">
            <header className="kx-pdp-head">
              <h2 id="integration-h">{t.integrationTitle}</h2>
              <p>{t.integrationBody}</p>
            </header>
            <ol className="kx-chain">
              {t.chain.map(([name, sub], i) => (
                <li key={name} className={i === 3 ? 'is-focus' : undefined}>
                  <span className="kx-mono">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{name}</strong>
                  <small>{sub}</small>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ DOCUMENTS */}
      <section id="docs" className="kx-pdp-section" aria-labelledby="docs-h">
        <div className="kx-wrap kx-pdp-split">
          <header className="kx-pdp-head">
            <h2 id="docs-h">{t.docsTitle}</h2>
            <p>{t.docsBody}</p>
          </header>
          {documents.length ? (
            <ul className="kx-docs">
              {documents.map((d) => (
                <li key={d.id}>
                  <FileText size={20} aria-hidden="true" />
                  <div>
                    <strong>{d.title}</strong>
                    <small className="kx-mono">{[d.document_type, d.version && (/^v/i.test(d.version) ? d.version : `v${d.version}`), d.size_bytes && `${(Number(d.size_bytes) / 1048576).toFixed(1)} MB`, 'PDF'].filter(Boolean).join(' · ')}</small>
                  </div>
                  <a href={d.source_url} target="_blank" rel="noreferrer noopener" aria-label={`${t.open}: ${d.title}`}>{t.open}<ArrowUpRight size={14} aria-hidden="true" /></a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="kx-empty">
              <p>{t.noDocs}</p>
              <Link className="kx-link" href={datasheetHref}>{t.datasheet} →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ SOURCES */}
      {facts.length ? (
        <section id="sources" className="kx-pdp-section" aria-labelledby="sources-h">
          <div className="kx-wrap kx-pdp-split">
            <header className="kx-pdp-head">
              <h2 id="sources-h">{t.sourcesTitle}</h2>
              <p>{t.sourcesBody}</p>
              {updated ? <p className="kx-fine">{t.updated}: <time dateTime={updated}>{new Date(updated).toLocaleDateString(lang)}</time></p> : null}
            </header>
            <div className="kx-table-scroll">
              <table className="kx-table">
                <thead><tr><th scope="col">{t.param}</th><th scope="col">{t.value}</th><th scope="col">{t.ref}</th></tr></thead>
                <tbody>
                  {facts.map(([path, f]) => (
                    <tr key={path}>
                      <th scope="row">{label(path.split('.')[1] ?? path, lang)}</th>
                      <td>{factValue(path) || '—'}</td>
                      <td>{f.sourceUrl ? <a href={f.sourceUrl} target="_blank" rel="noreferrer noopener">{f.pageSection || t.ref}<ArrowUpRight size={12} aria-hidden="true" /></a> : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------ CTA */}
      <section className="kx-pdp-cta" aria-labelledby="cta-h">
        <div className="kx-wrap">
          <div>
            <h2 id="cta-h">{t.ctaTitle}</h2>
            <p>{t.ctaBody}</p>
          </div>
          <div className="kx-actions">
            <Link className="kx-btn kx-btn-primary" href={rfqHref}>{t.rfq}<ArrowRight size={16} aria-hidden="true" /></Link>
            <Link className="kx-btn kx-btn-ghost" href={calcHref}><Calculator size={16} aria-hidden="true" />{t.calc}</Link>
          </div>
          <p className="kx-fine kx-fine-light">{BRAND.disclosure[lang]}</p>
        </div>
      </section>
    </main>
  );
}
