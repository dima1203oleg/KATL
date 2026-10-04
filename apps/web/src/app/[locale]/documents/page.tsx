import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FileText, Search, Download, Eye, ShieldCheck, Filter } from 'lucide-react';
import { pimRepository } from '../../../lib/pim/pimRepository';
import { AnimatedSection, AnimatedStaggerGroup, AnimatedStaggerItem } from '../../../components/AnimatedSection';

export const dynamic = 'force-dynamic';

const ui = {
  'uk-UA': {
    title: 'Технічна документація CATL ESS | Сертифікати, паспорти, інструкції',
    description: 'Офіційні паспорти обладнання (Datasheets), інструкції користувача, сертифікати TÜV Rheinland / UL 9540A для систем накопичення CATL.',
    home: 'Головна',
    docs: 'Документація',
    heading: 'Технічна документація та сертифікати',
    intro: 'Офіційна інженерна бібліотека: технічні специфікації (Datasheets), схеми підключення, керівництва з експлуатації та сертифікати міжнародних лабораторій.',
    searchPlaceholder: 'Пошук за назвою, моделлю (TENER, EnerOne) або типом документа...',
    searchBtn: 'Знайти',
    allTab: 'Всі документи',
    viewPdf: 'Переглянути PDF',
    downloadPdf: 'Завантажити PDF',
    emptyTitle: 'Документів за вашим запитом не знайдено',
    emptyText: 'Якщо вам потрібен специфічний сертифікат або креслення для ДАБІ / НЕК Укренерго, надішліть інженерний запит.',
    rfqBtn: 'Надіслати запит на документацію →',
    unavailable: 'Бібліотека документів тимчасово недоступна.',
  },
  en: {
    title: 'CATL ESS Technical Documentation | Datasheets, Manuals & Certificates',
    description: 'Official manufacturer datasheets, user manuals, installation guides, and TÜV / UL 9540A compliance certificates for CATL storage systems.',
    home: 'Home',
    docs: 'Documentation',
    heading: 'Technical Documentation & Certificates',
    intro: 'Official engineering repository: technical specifications, wiring manuals, operation guides, and international compliance certificates.',
    searchPlaceholder: 'Search by title, model (TENER, EnerOne) or document type...',
    searchBtn: 'Search',
    allTab: 'All Documents',
    viewPdf: 'View PDF',
    downloadPdf: 'Download PDF',
    emptyTitle: 'No documents match your query',
    emptyText: 'If you need project-specific drawings or compliance certificates for grid interconnection, please submit an engineering request.',
    rfqBtn: 'Request documentation →',
    unavailable: 'Documentation repository is temporarily unavailable.',
  },
  'zh-CN': {
    title: 'CATL 储能技术资料中心 | 规格书、操作手册与国际认证',
    description: 'CATL 储能系统官方技术规格书 (Datasheets)、用户手册、安装指南及 TÜV / UL 9540A 认证证书。',
    home: '首页',
    docs: '技术文档',
    heading: '技术文档与认证中心',
    intro: '官方工程技术资料中心：包含产品技术规格书、电气接线图、施工操作手册以及权威实验室认证证书。',
    searchPlaceholder: '按文件名称、型号 (天恒 TENER、EnerOne) 或类型搜索...',
    searchBtn: '搜索',
    allTab: '全量文件',
    viewPdf: '预览 PDF',
    downloadPdf: '下载 PDF',
    emptyTitle: '未找到符合条件的技术文档',
    emptyText: '如需特定工程图纸或并网合规文件，请提交工程资料申请。',
    rfqBtn: '提交资料申请 →',
    unavailable: '资料库暂时无法访问。',
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = ui[locale as keyof typeof ui] || ui['uk-UA'];
  return {
    title: t.title,
    description: t.description,
  };
}

export default async function DocumentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string; product?: string }>;
}) {
  const [{ locale }, { q = '', type = '', product = '' }] = await Promise.all([params, searchParams]);
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();

  const t = ui[locale as keyof typeof ui] || ui['uk-UA'];

  let docs: Array<any> | null = null;
  try {
    docs = await pimRepository.getDocuments(locale, product || undefined);
  } catch {
    docs = null;
  }

  const filtered = (docs || []).filter((doc) => {
    const matchesQ =
      !q ||
      `${doc.title} ${doc.product_name || ''} ${doc.document_type}`
        .toLowerCase()
        .includes(q.toLowerCase());
    const matchesType = !type || doc.document_type === type;
    return matchesQ && matchesType;
  });

  return (
    <main className="documents-page">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href={`/${locale}`}>{t.home}</Link> / {t.docs}
          </div>
          <div className="eyebrow">CATL TECHNICAL ARCHIVE</div>
          <AnimatedSection direction="up" delay={0.05}>
            <h1>{t.heading}</h1>
            <p>{t.intro}</p>
          </AnimatedSection>

          <form action={`/${locale}/documents`} className="search-box" style={{ maxWidth: 700, marginTop: 22 }}>
            <input
              name="q"
              defaultValue={q}
              placeholder={t.searchPlaceholder}
              aria-label="Search documents"
            />
            <button className="button">
              <Search size={15} /> {t.searchBtn}
            </button>
          </form>
        </div>
      </section>

      <AnimatedSection className="content-section" delay={0.2}>
        <div className="container">
          {/* Document Types Filter */}
          <div className="catalog-tabs" style={{ marginBottom: 24 }}>
            <Link
              className={`catalog-tab ${!type ? 'is-active' : ''}`}
              href={`/${locale}/documents${q ? `?q=${encodeURIComponent(q)}` : ''}`}
            >
              {t.allTab}
            </Link>
            {['DATASHEET', 'CERTIFICATE', 'MANUAL'].map((docType) => (
              <Link
                key={docType}
                className={`catalog-tab ${type === docType ? 'is-active' : ''}`}
                href={`/${locale}/documents?type=${docType}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              >
                {docType}
              </Link>
            ))}
          </div>

          {docs === null ? (
            <div className="error-note">{t.unavailable}</div>
          ) : filtered.length ? (
            <AnimatedStaggerGroup className="documents-card-grid">
              {filtered.map((doc) => (
                <AnimatedStaggerItem key={doc.id}>
                  <article className="doc-item-card">
                    <div className="doc-icon-wrap">
                      <FileText size={26} />
                    </div>
                  <div className="doc-meta">
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span className="doc-type-badge">{doc.document_type}</span>
                      <span className="provenance-tag">
                        <ShieldCheck size={11} /> {doc.locale}
                      </span>
                    </div>
                    <h4>{doc.title}</h4>
                    <small>
                      {doc.product_name ? `${doc.product_name} · ` : ''}
                      Версія: {doc.version} · Розмір: {(Number(doc.size_bytes) / 1024 / 1024).toFixed(1)} MB
                    </small>
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
                </article>
              </AnimatedStaggerItem>
              ))}
            </AnimatedStaggerGroup>
          ) : (
            <div className="empty-state">
              <FileText color="#005bff" size={32} />
              <div>
                <h3>{t.emptyTitle}</h3>
                <p>{t.emptyText}</p>
                <Link className="text-link" href={`/${locale}/rfq`}>
                  {t.rfqBtn}
                </Link>
              </div>
            </div>
          )}
        </div>
      </AnimatedSection>
    </main>
  );
}
