import Link from 'next/link';

const COPY = [
  { l: 'uk-UA', h: 'Сторінку не знайдено', p: 'Можливо, адресу змінено. Почніть із розрахунку резервного живлення або каталогу систем.', a: 'На головну', b: 'Каталог' },
  { l: 'en', h: 'Page not found', p: 'The address may have changed. Start from the backup-power calculator or the systems catalogue.', a: 'Home', b: 'Catalogue' },
  { l: 'zh-CN', h: '页面未找到', p: '地址可能已更改。请从备用电源计算器或产品目录开始。', a: '返回首页', b: '产品目录' },
];

export default function NotFound() {
  return (
    <main className="kx-404" id="main">
      <div className="kx-wrap">
        <svg viewBox="0 0 320 120" className="kx-404-svg" aria-hidden="true">
          <rect x="10" y="30" width="260" height="60" rx="6" className="kx-404-body" />
          <rect x="270" y="48" width="16" height="24" rx="3" className="kx-404-body" />
          <rect x="20" y="40" width="40" height="40" rx="3" className="kx-404-cell" />
          <rect x="68" y="40" width="40" height="40" rx="3" className="kx-404-cell kx-404-blink" />
          <rect x="116" y="40" width="40" height="40" rx="3" className="kx-404-empty" />
          <rect x="164" y="40" width="40" height="40" rx="3" className="kx-404-empty" />
          <rect x="212" y="40" width="40" height="40" rx="3" className="kx-404-empty" />
        </svg>
        <p className="kx-mono kx-404-code">404</p>
        {COPY.map((c) => (
          <section key={c.l} lang={c.l} className="kx-404-block">
            <h1>{c.h}</h1>
            <p>{c.p}</p>
            <p className="kx-404-actions">
              <Link className="kx-btn kx-btn-primary" href={`/${c.l}`}>{c.a}</Link>
              <Link className="kx-btn" href={`/${c.l}/products`}>{c.b}</Link>
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
