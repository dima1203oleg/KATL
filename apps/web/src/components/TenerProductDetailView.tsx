'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { KatlProduct } from '@katl/shared-types';
import type { KatlDocument } from '../lib/pim/pimRepository';
import { 
  ArrowRight, 
  ArrowUpRight, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  Thermometer, 
  Box, 
  Activity,
  FileCheck
} from 'lucide-react';
import { ProductMedia } from './ProductMedia';
import { motion } from 'framer-motion';

const copy = {
  'uk-UA': { 
    home: 'Головна', 
    products: 'Каталог', 
    quote: 'Отримати комерційну пропозицію', 
    compare: 'Порівняти характеристики', 
    calculate: 'Розрахувати систему',
    verified: 'Перевірено CATL PIM', 
    source: 'Офіційне джерело', 
    checked: 'Дата верифікації', 
    specs: 'Технічні характеристики', 
    specIntro: 'Усі параметри верифіковані головним інженером платформи на основі офіційної технічної документації виробника.', 
    noSpecs: 'Опублікованих технічних даних поки немає.', 
    concept: 'Концептуальна візуалізація обладнання CATL ESS.', 
    architecture: 'Інтеграція в енергосистему BESS', 
    architectureBody: 'Схема підключення через трансформатор 0.69/10(35) кВ із захистами РЗА, вакуумними вимикачами та комерційним обліком АСКОЕ згідно з ДСТУ EN 62619 та вимогами НЕК «Укренерго».', 
    stages: ['Мережа / ВДЕ', 'PCS 1500V', 'Батарейний BESS', 'Smart EMS / SCADA', 'Критичні споживачі'], 
    docs: 'Офіційна технічна документація', 
    docsBody: 'Технічні паспорти (Datasheets), інструкції з монтажу та європейські сертифікати відповідності.', 
    viewPdf: 'Переглянути PDF',
    downloadPdf: 'Завантажити PDF',
    noDocs: 'Документи для цієї модифікації надаються за інженерним запитом.',
    provenanceTitle: 'Достовірність та джерела інформації',
    provenanceIntro: 'Ми не показуємо неперевірених характеристик. Кожен ключовий параметр прив’язаний до першоджерела CATL.',
    cta: 'Потрібна комерційна пропозиція на систему?', 
    ctaBody: 'Отримайте повний техніко-економічний розрахунок із урахуванням тарифів, вартості приєднання та графіка окупності.', 
    request: 'Сформувати запит' 
  },
  en: { 
    home: 'Home', 
    products: 'Catalog', 
    quote: 'Get Commercial Proposal', 
    compare: 'Compare Specifications', 
    calculate: 'Calculate System',
    verified: 'Verified CATL PIM', 
    source: 'Official Source', 
    checked: 'Verification Date', 
    specs: 'Technical Specifications', 
    specIntro: 'All technical parameters verified by the platform chief engineer based on manufacturer official documentation.', 
    noSpecs: 'No specifications published yet.', 
    concept: 'Conceptual visualization of CATL ESS equipment.', 
    architecture: 'Grid Integration Architecture', 
    architectureBody: 'Integration via step-up transformer 0.69/10(35) kV with relay protection, vacuum breakers, and commercial metering according to grid operator standards.', 
    stages: ['Grid / Renewables', '1500V PCS', 'CATL Battery BESS', 'Smart EMS / SCADA', 'Critical Loads'], 
    docs: 'Official Technical Documentation', 
    docsBody: 'Manufacturer datasheets, installation guides, and European safety compliance certificates.', 
    viewPdf: 'View PDF',
    downloadPdf: 'Download PDF',
    noDocs: 'Documents for this model are available upon engineering inquiry.',
    provenanceTitle: 'Data Provenance & Verification',
    provenanceIntro: 'We do not publish unverified specifications. Every key figure is grounded in official CATL documentation.',
    cta: 'Need a customized commercial proposal?', 
    ctaBody: 'Receive a complete techno-economic assessment including local grid tariffs, CAPEX, and payback model.', 
    request: 'Request Proposal' 
  },
  'zh-CN': { 
    home: '首页', 
    products: '产品目录', 
    quote: '获取商业报价', 
    compare: '对比技术参数', 
    calculate: '测算配置',
    verified: 'CATL PIM 官方审核', 
    source: '官方源', 
    checked: '核验时间', 
    specs: '技术规格明细', 
    specIntro: '所有技术参数均基于宁德时代官方技术规格书由工程师核对录入。', 
    noSpecs: '暂无已发布的技术数据。', 
    concept: 'CATL 储能设备概念示意图。', 
    architecture: '电网接入架构', 
    architectureBody: '通过 0.69/10(35) kV 升压变压器并网，具备继电保护、真空断路器与智能计量。', 
    stages: ['电网 / 新能源', '1500V 变流器', 'CATL 电池集装箱', 'Smart EMS / SCADA', '重要负荷'], 
    docs: '官方技术资料中心', 
    docsBody: '原厂技术规格书 (Datasheets)、安装操作手册及国际安全认证证书。', 
    viewPdf: '预览 PDF',
    downloadPdf: '下载 PDF',
    noDocs: '该型号的技术文档可通过技术咨询获取。',
    provenanceTitle: '数据溯源与核验',
    provenanceIntro: '严守技术真实性，拒绝未经核实的虚假参数，所有关键指标均有据可查。',
    cta: '需要该系统的正式商业方案？', 
    ctaBody: '获取包含电价套利、并网条件及投资回报周期的完整工程方案。', 
    request: '提交项目咨询' 
  },
} as const;

const labels: Record<string, [string, string, string]> = {
  nominalCapacity: ['Номінальна ємність', 'Nominal capacity', '额定容量'],
  usableCapacity: ['Корисна ємність', 'Usable capacity', '可用容量'],
  nominalVoltage: ['Номінальна напруга', 'Nominal voltage', '额定电压'],
  voltageRange: ['Діапазон напруги', 'Voltage range', '电压范围'],
  cRate: ['C-rate (倍率)', 'C-rate', '充放电倍率'],
  maxContinuousPowerKw: ['Макс. тривала потужність', 'Max continuous power', '最大持续功率'],
  efficiencyRoundTrip: ['ККД повного циклу (RTE)', 'Round-trip efficiency', '往返转换效率 (RTE)'],
  chemistry: ['Хімічний склад комірок', 'Cell chemistry', '电芯化学体系'],
  cellModel: ['Модель комірки CATL', 'Cell model', '电芯型号'],
  cellCapacity: ['Ємність осередку', 'Cell capacity', '单体电芯容量'],
  cycleLife: ['Циклічний ресурс', 'Cycle life', '循环寿命'],
  degradationFirstYears: ['Гарантія деградації', 'Degradation guarantee', '初期衰减保证'],
  dimensions: ['Габаритні розміри (Д×Ш×В)', 'Dimensions (L×W×H)', '外形尺寸 (长×宽×高)'],
  weight: ['Маса спорядженого блоку', 'Total weight', '整机重量'],
  containerStandard: ['Формат виконання / корпус', 'Form factor / standard', '箱体结构形式'],
  protectionRating: ['Ступінь захисту оболонки', 'Ingress protection', '防护等级'],
  coolingMethod: ['Метод термоменеджменту', 'Cooling method', '热管理方式'],
  tempControlAccuracy: ['Точність температурного балансу', 'Temp accuracy', '温控精度'],
  operatingTempRange: ['Діапазон робочих температур', 'Operating temp range', '工作温度范围'],
  fireSuppression: ['Система пожежогасіння', 'Fire suppression', '消防系统'],
  deflagrationProtection: ['Захист від вибухового тиску', 'Deflagration venting', '防爆泄压设计'],
  gasDetection: ['Газоаналізатори витоку', 'Gas detection sensors', '可燃气体探测'],
  certifications: ['Підтверджені сертифікати', 'Certifications', '认证标准'],
  pcs: ['Сумісні перетворювачі (PCS)', 'Compatible PCS', '适配变流器 (PCS)'],
  ems: ['Інтерфейси зв’язку EMS/SCADA', 'EMS / SCADA interface', '能量管理通信接口'],
  transformer: ['Вимоги до трансформатора', 'Transformer Requirements', '变压器要求'],
};

const groups: Array<[string, string, keyof KatlProduct]> = [
  ['Електричні характеристики', 'energy_specs', 'energySpecs'],
  ['Акумуляторні комірки LFP', 'cell_specs', 'cellSpecs'],
  ['Термоменеджмент та клімат', 'thermal_specs', 'thermalSpecs'],
  ['Механічні параметри та габарити', 'mechanical_specs', 'mechanicalSpecs'],
  ['Безпека та пожежозахист', 'safety_specs', 'safetySpecs'],
  ['Сумісність та підключення', 'compatibility', 'compatibility'],
];

interface Props {
  product: KatlProduct;
  locale?: string;
  documents?: KatlDocument[];
  preview?: boolean;
}

export function TenerProductDetailView({ product, locale = 'uk-UA', documents = [], preview = false }: Props) {
  const lang = (locale in copy ? locale : 'uk-UA') as keyof typeof copy;
  const t = copy[lang];
  const index = lang === 'en' ? 1 : lang === 'zh-CN' ? 2 : 0;
  const root = `/${locale}`;

  const energySpecs = product.energySpecs as any;
  const priceDisplay = energySpecs?.priceDisplayUah || (lang === 'en' ? 'Price on request' : lang === 'zh-CN' ? '价格电议' : 'Ціна за запитом');
  const priceNote = lang === 'en' ? energySpecs?.priceNoteEn : lang === 'zh-CN' ? energySpecs?.priceNoteZh : energySpecs?.priceNoteUk;
  const warranty = energySpecs?.warrantyYears || (lang === 'en' ? '10-Year Manufacturer Warranty' : lang === 'zh-CN' ? '10年原厂质保' : '10 років офіційної гарантії');
  const availability = energySpecs?.availability === 'IN_STOCK'
    ? (lang === 'en' ? 'In Stock (Ukraine)' : lang === 'zh-CN' ? '现货供应' : 'В наявності в Україні')
    : (lang === 'en' ? 'Delivery 4-6 weeks' : lang === 'zh-CN' ? '定制生产 4-6 周' : 'Під замовлення 4-6 тижнів');

  const facts = product.provenance.facts ?? {};

  return (
    <main className="product-detail-page">
      {/* 1. Header & Hero */}
      <motion.section 
        className="reference-product-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container">
          <div className="breadcrumbs">
            <Link href={root}>{t.home}</Link> / <Link href={`${root}/products`}>{t.products}</Link> / {product.name}
          </div>

          <div className="reference-hero-layout">
            <motion.div 
              className="reference-hero-copy"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="eyebrow">CATL · {product.category}</div>
              <h1>{product.name}</h1>
              <p>{product.shortDesc}</p>

              {/* Price Callout Box */}
              <div className="product-price-hero-box">
                <div className="price-main-row">
                  <span className="price-hero-val">{priceDisplay}</span>
                  <span className="availability-pill">
                    <CheckCircle2 size={13} />
                    {availability}
                  </span>
                </div>
                {priceNote && <p className="price-hero-note">{priceNote}</p>}
                <div className="warranty-tag">
                  <ShieldCheck size={14} />
                  <span>{warranty}</span>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="hero-actions">
                <Link className="button" href={`${root}/rfq?product=${encodeURIComponent(product.id)}`}>
                  {t.quote}
                  <ArrowRight size={16} />
                </Link>
                <Link className="button button-secondary" href={`${root}/compare?products=${encodeURIComponent(product.id)}`}>
                  {t.compare}
                </Link>
                <Link className="button button-secondary" href={`${root}/engineering/bess-calculator?product=${encodeURIComponent(product.id)}`}>
                  <Sliders size={15} />
                  {t.calculate}
                </Link>
              </div>

              {/* Provenance Proof Bar */}
              {product.provenance.sourceUrl && (
                <div className="proof-row">
                  <span>{t.verified}</span>
                  <a className="text-link" href={product.provenance.sourceUrl} target="_blank" rel="noreferrer">
                    {t.source}
                    <ArrowUpRight size={12} />
                  </a>
                  {product.provenance.verifiedAt && (
                    <span>{t.checked}: {new Date(product.provenance.verifiedAt).toLocaleDateString(locale)}</span>
                  )}
                </div>
              )}
            </motion.div>

            {/* Quick Metrics & 3D Render */}
            <motion.div 
              className="reference-facts"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="fact-item">
                <Zap size={24} />
                <div>
                  <small>{labels.nominalCapacity[index]}</small>
                  <strong>{product.energySpecs.nominalCapacity || '—'}</strong>
                </div>
              </div>
              <div className="fact-item">
                <ShieldCheck size={24} />
                <div>
                  <small>{labels.chemistry[index]}</small>
                  <strong>{product.cellSpecs.chemistry || 'LFP'}</strong>
                </div>
              </div>
              <div className="fact-item">
                <Thermometer size={24} />
                <div>
                  <small>{labels.coolingMethod[index]}</small>
                  <strong>{product.thermalSpecs.coolingMethod || 'Liquid Cooling'}</strong>
                </div>
              </div>
              <ProductMedia label={t.concept} productId={product.id} />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 2. Key Specs Fast-Grid */}
      <motion.section 
        className="container key-specs-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="specs-dashboard-grid">
          <div className="spec-card">
            <span className="spec-icon"><Zap size={20}/></span>
            <small>{labels.nominalCapacity[index]}</small>
            <strong>{product.energySpecs.nominalCapacity || '—'}</strong>
          </div>
          <div className="spec-card">
            <span className="spec-icon"><Activity size={20}/></span>
            <small>{labels.cRate[index]}</small>
            <strong>{product.energySpecs.cRate || '0.5C'}</strong>
          </div>
          <div className="spec-card">
            <span className="spec-icon"><Box size={20}/></span>
            <small>{labels.dimensions[index]}</small>
            <strong>{product.mechanicalSpecs.dimensions || '—'}</strong>
          </div>
          <div className="spec-card">
            <span className="spec-icon"><ShieldCheck size={20}/></span>
            <small>{labels.protectionRating[index]}</small>
            <strong>{product.mechanicalSpecs.protectionRating || 'IP55'}</strong>
          </div>
          <div className="spec-card">
            <span className="spec-icon"><Clock size={20}/></span>
            <small>{labels.cycleLife[index]}</small>
            <strong>{product.cellSpecs.cycleLife || '10 000+'}</strong>
          </div>
          <div className="spec-card">
            <span className="spec-icon"><Thermometer size={20}/></span>
            <small>{labels.operatingTempRange[index]}</small>
            <strong>{product.thermalSpecs.operatingTempRange || '-30°C…+50°C'}</strong>
          </div>
        </div>
      </motion.section>

      {/* 3. Detailed Technical Specifications */}
      <div className="container reference-product-content">
        <motion.section 
          className="reference-spec-panel" 
          id="specifications"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="energy-section-head">
            <div>
              <span className="energy-kicker">TECHNICAL DATASHEET</span>
              <h2>{t.specs}</h2>
              <p>{t.specIntro}</p>
            </div>
          </div>

          <div className="specs-group-grid">
            {groups.map(([title, group, key]) => {
              const values = (product[key] ?? {}) as Record<string, unknown>;
              const rows = Object.entries(values).filter(
                ([k, v]) => v !== null && v !== undefined && v !== '' && (!Array.isArray(v) || v.length) && !k.startsWith('price') && k !== 'availability' && k !== 'warrantyYears'
              );
              if (!rows.length) return null;

              return (
                <div className="calc-card" key={group}>
                  <h3>
                    {lang === 'uk-UA' 
                      ? title 
                      : lang === 'en' 
                      ? ['Electrical Specifications', 'Battery Cells (LFP)', 'Thermal Management', 'Mechanical & Enclosure', 'Safety & Fire Protection', 'Compatibility & Standards'][groups.findIndex(g => g[1] === group)]
                      : ['电气参数', '磷酸铁锂电芯', '热管理与环境', '机械结构与防护', '安全与消防', '电网兼容性'][groups.findIndex(g => g[1] === group)]}
                  </h3>
                  <table className="spec-table">
                    <tbody>
                      {rows.map(([specKey, specVal]) => {
                        return (
                          <tr key={specKey}>
                            <th scope="row">{labels[specKey]?.[index] ?? specKey}</th>
                            <td>
                              <strong>
                                {Array.isArray(specVal) ? specVal.join(', ') : typeof specVal === 'object' ? JSON.stringify(specVal) : String(specVal)}
                              </strong>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* 4. Official Documents Section */}
        <motion.section 
          id="documents" 
          className="product-documents-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="energy-section-head">
            <div>
              <span className="energy-kicker">DOCUMENTATION</span>
              <h2>{t.docs}</h2>
              <p>{t.docsBody}</p>
            </div>
          </div>

          {documents.length > 0 ? (
            <div className="documents-card-grid">
              {documents.map((doc) => (
                <div key={doc.id} className="doc-item-card">
                  <div className="doc-icon-wrap">
                    <FileText size={26} />
                  </div>
                  <div className="doc-meta">
                    <span className="doc-type-badge">{doc.document_type}</span>
                    <h4>{doc.title}</h4>
                    <small>Версія: {doc.version} · Розмір: {(Number(doc.size_bytes) / 1024 / 1024).toFixed(1)} MB · PDF</small>
                  </div>
                  <div className="doc-actions">
                    <a 
                      href={doc.source_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="button button-secondary doc-btn"
                    >
                      <Eye size={14} />
                      <span>{t.viewPdf}</span>
                    </a>
                    <a 
                      href={doc.source_url} 
                      download 
                      target="_blank" 
                      rel="noreferrer" 
                      className="button doc-btn"
                    >
                      <Download size={14} />
                      <span>{t.downloadPdf}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FileCheck color="#005bff" size={24} />
              <div>
                <h3>{t.docs}</h3>
                <p>{t.noDocs}</p>
                <Link className="text-link" href={`${root}/rfq?product=${encodeURIComponent(product.id)}`}>
                  {t.quote} →
                </Link>
              </div>
            </div>
          )}
        </motion.section>

        {/* 5. Data Provenance & Verification Citations */}
        {Object.keys(facts).length > 0 && (
          <motion.section 
            className="provenance-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="energy-section-head">
              <div>
                <span className="energy-kicker">DATA INTEGRITY</span>
                <h2>{t.provenanceTitle}</h2>
                <p>{t.provenanceIntro}</p>
              </div>
            </div>
            <div className="provenance-facts-table">
              {Object.entries(facts).map(([factPathKey, factData]) => (
                <div key={factPathKey} className="provenance-fact-row">
                  <div className="fact-path">
                    <code>{factPathKey}</code>
                    <span className="fact-verified-tag">
                      <ShieldCheck size={12} />
                      {factData.verifiedBy || 'CATL Chief Engineer'}
                    </span>
                  </div>
                  <blockquote className="fact-excerpt">{factData.excerpt}</blockquote>
                  <a 
                    href={factData.sourceUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="fact-source-link"
                  >
                    {factData.pageSection || 'Офіційний портал виробника'} <ArrowUpRight size={12} />
                  </a>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 6. System Architecture */}
        <motion.section 
          className="reference-architecture"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <h2>{t.architecture}</h2>
          <p>{t.architectureBody}</p>
          <div className="architecture-strip">
            {t.stages.map((stage, i) => (
              <div key={stage}>
                <span className="architecture-node"><Layers size={20}/></span>
                <strong>{stage}</strong>
                {i < t.stages.length - 1 && <span aria-hidden="true">→</span>}
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* 7. Bottom CTA */}
      <motion.section 
        className="reference-project-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div>
            <h2>{t.cta}</h2>
            <p>{t.ctaBody}</p>
          </div>
          <Link className="button button-primary-accent" href={`${root}/rfq?product=${encodeURIComponent(product.id)}`}>
            {t.request}
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
