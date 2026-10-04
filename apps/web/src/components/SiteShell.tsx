'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BatteryCharging, BookOpen, BriefcaseBusiness, ChevronDown, Globe2, Menu, Search, X, Zap } from 'lucide-react';

const translations: Record<string, Record<string, string>> = {
  'uk-UA': {
    products: 'Продукція',
    catalog: 'Каталог систем CATL',
    compare: 'Порівняння BESS',
    documents: 'Технічна документація',
    solutions: 'Рішення',
    industries: 'Галузі',
    engineering: 'Інженерія',
    bessCalculator: 'Калькулятор ємності BESS',
    lcosCalculator: 'LCOS & Окупність',
    sldDiagram: 'Однолінійні схеми (SLD)',
    knowledge: 'База знань',
    partners: 'Партнерам',
    about: 'Про нас',
    quote: 'Отримати ТКП',
    account: 'Кабінет',
    search: 'Пошук',
    all: 'Усі сертифіковані системи',
    designer: 'BESS Designer',
  },
  en: {
    products: 'Products',
    catalog: 'CATL Systems Catalog',
    compare: 'BESS Comparison',
    documents: 'Technical Documents',
    solutions: 'Solutions',
    industries: 'Industries',
    engineering: 'Engineering',
    bessCalculator: 'BESS Sizing Calculator',
    lcosCalculator: 'LCOS & Payback ROI',
    sldDiagram: 'Single-Line Diagrams (SLD)',
    knowledge: 'Knowledge',
    partners: 'Partners',
    about: 'About',
    quote: 'Request TKP',
    account: 'Account',
    search: 'Search',
    all: 'All certified systems',
    designer: 'BESS Designer',
  },
  'zh-CN': {
    products: '产品',
    catalog: 'CATL 系统产品目录',
    compare: '系统规格对比',
    documents: '技术图纸与文档',
    solutions: '解决方案',
    industries: '行业',
    engineering: '工程工具',
    bessCalculator: 'BESS 容量选型计算',
    lcosCalculator: 'LCOS 度电成本与回报',
    sldDiagram: '单线电气原理图 (SLD)',
    knowledge: '知识库',
    partners: '合作伙伴',
    about: '关于我们',
    quote: '获取技术方案',
    account: '账户',
    search: '搜索',
    all: '全系列认证产品',
    designer: 'BESS 设计器',
  },
};

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    const resize = () => { if (window.innerWidth > 1200) setOpen(false); };
    window.addEventListener('keydown', close); window.addEventListener('resize', resize);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', close); window.removeEventListener('resize', resize); };
  }, [open]);
  const locale = pathname.split('/')[1] || 'uk-UA';
  const root = `/${locale}`;
  const t = translations[locale] || translations['uk-UA'];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={root} className="brand" aria-label="CATL — на головну">
          <span className="brand-wordmark">CATL</span>
          <span className="brand-caption">ENERGY STORAGE<br/>SOLUTIONS</span>
        </Link>
        <nav className="primary-nav" aria-label="Головна навігація">
          {/* Products Nav Item with Mega Menu */}
          <div className="nav-item">
            <Link className={`nav-link ${isActive(`${root}/products`) ? 'is-active' : ''}`} href={`${root}/products`}>
              {t.products} <ChevronDown size={13} />
            </Link>
            <div className="mega-menu">
              <div>
                <div className="mega-heading">Каталог та порівняння</div>
                <Link className="mega-link" href={`${root}/products`}>
                  {t.catalog}
                  <span>{locale === 'en' ? 'Tener, EnerOne, EnerC+, EnerX, Commercial' : locale === 'zh-CN' ? 'Tener, EnerOne, EnerC+ 等原厂系统' : 'Tener, EnerOne, EnerC+, EnerX, Комерційні'}</span>
                </Link>
                <Link className="mega-link" href={`${root}/compare`}>
                  {t.compare}
                  <span>{locale === 'en' ? 'Side-by-side technical and financial specs' : locale === 'zh-CN' ? '多维度参数与性能指标对照' : 'Порівняння характеристик, C-rate, ємності'}</span>
                </Link>
                <Link className="mega-link" href={`${root}/documents`}>
                  {t.documents}
                  <span>{locale === 'en' ? 'Certificates, datasheets, manuals & drawings' : locale === 'zh-CN' ? '认证证书、技术规格表、用户手册' : 'Паспорти, сертифікати, габаритні креслення'}</span>
                </Link>
              </div>
              <div className="mega-cta">
                <div>
                  <div className="mega-heading">Швидкий підбір</div>
                  <strong>{locale === 'en' ? 'Interactive 3D Configurator' : locale === 'zh-CN' ? '交互式 3D 储能配置器' : 'Інтерактивний конфігуратор'}</strong>
                  <p style={{ fontSize: 12, color: '#667085', margin: '4px 0 12px' }}>
                    {locale === 'en' ? 'Generate single-line diagrams, rack layouts and CAPEX.' : locale === 'zh-CN' ? '快速生成系统单线图与预估投资。' : 'Сформуйте конфігурацію, SLD та кошторис за 2 хвилини.'}
                  </p>
                </div>
                <Link className="text-link" href={`${root}/bess-designer`}>{t.designer} →</Link>
              </div>
            </div>
          </div>

          <Link className={`nav-link ${isActive(`${root}/solutions`) ? 'is-active' : ''}`} href={`${root}/solutions`}>
            {t.solutions}
          </Link>
          <Link className={`nav-link ${isActive(`${root}/industries`) ? 'is-active' : ''}`} href={`${root}/industries`}>
            {t.industries}
          </Link>

          {/* Engineering Nav Item with Mega Menu */}
          <div className="nav-item">
            <Link className={`nav-link ${isActive(`${root}/engineering`) ? 'is-active' : ''}`} href={`${root}/engineering`}>
              {t.engineering} <ChevronDown size={13} />
            </Link>
            <div className="mega-menu">
              <div>
                <div className="mega-heading">Інженерний комплекс</div>
                <Link className="mega-link" href={`${root}/bess-designer`}>
                  {t.designer}
                  <span>{locale === 'en' ? 'Visual layout & sizing calculator' : locale === 'zh-CN' ? '可视化系统设计与选型' : 'Візуальний підбір компонування та обладнання'}</span>
                </Link>
                <Link className="mega-link" href={`${root}/engineering/bess-calculator`}>
                  {t.bessCalculator}
                  <span>{locale === 'en' ? 'Power kW and energy MWh sizing tool' : locale === 'zh-CN' ? '功率与容量精准匹配工具' : 'Розрахунок пікових навантажень та ємності'}</span>
                </Link>
                <Link className="mega-link" href={`${root}/engineering/lcos`}>
                  {t.lcosCalculator}
                  <span>{locale === 'en' ? 'Levelized cost of storage & payback ROI' : locale === 'zh-CN' ? '度电储能成本与投资回报期' : 'Розрахунок вартості циклу та терміну окупності'}</span>
                </Link>
                <Link className="mega-link" href={`${root}/engineering/single-line-diagram`}>
                  {t.sldDiagram}
                  <span>{locale === 'en' ? 'Electrical schematic & PCS/BMS topology' : locale === 'zh-CN' ? '电气原理图与拓扑结构' : 'Електрична топологія та підключення до мережі'}</span>
                </Link>
              </div>
              <div className="mega-cta">
                <div>
                  <div className="mega-heading">Офіційне ТКП</div>
                  <strong>{locale === 'en' ? 'Project Feasibility Study' : locale === 'zh-CN' ? '项目可行性研究与正式报价' : 'ТЕО та комерційна пропозиція'}</strong>
                  <p style={{ fontSize: 12, color: '#667085', margin: '4px 0 12px' }}>
                    {locale === 'en' ? 'Get engineered proposal with Ukraine tariff analysis.' : locale === 'zh-CN' ? '结合乌克兰最新电价政策量身定制。' : 'Отримайте розрахунок під графік тарифів та ліміти мережі вашого підприємства.'}
                  </p>
                </div>
                <Link className="text-link" href={`${root}/rfq`}>{t.quote} →</Link>
              </div>
            </div>
          </div>

          <Link className={`nav-link ${isActive(`${root}/resources`) ? 'is-active' : ''}`} href={`${root}/resources`}>
            {t.knowledge}
          </Link>
          <Link className={`nav-link ${isActive(`${root}/partner`) ? 'is-active' : ''}`} href={`${root}/partner`}>
            {t.partners}
          </Link>
          <Link className={`nav-link ${isActive(`${root}/about`) ? 'is-active' : ''}`} href={`${root}/about`}>
            {t.about}
          </Link>
        </nav>

        <div className="header-actions">
          <Link href={`${root}/search`} className="header-search" aria-label="Пошук"><Search size={17}/></Link>
          <Globe2 className="header-globe" size={14} aria-hidden="true" />
          <nav className="language-switch" aria-label={locale === 'en' ? 'Language' : locale === 'zh-CN' ? '语言' : 'Мова'}>
            {[
              ['uk-UA', 'UA'],
              ['en', 'EN'],
              ['zh-CN', '中'],
            ].map(([target, label]) => (
              <Link
                key={target}
                aria-current={locale === target ? 'page' : undefined}
                href={`/${target}`}
                onClick={() => rememberLocale(target)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link className="account-link" href={`${root}/portal`}>{t.account}</Link>
          <Link className="button" href={`${root}/rfq`}>{t.quote}</Link>
          <button
            className="mobile-menu-button"
            aria-label={open ? (locale === 'en' ? 'Close menu' : locale === 'zh-CN' ? '关闭菜单' : 'Закрити меню') : (locale === 'en' ? 'Open menu' : locale === 'zh-CN' ? '打开菜单' : 'Відкрити меню')}
            aria-expanded={open}
            aria-controls="mobile-site-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={19}/> : <Menu size={19}/>}
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Drawer */}
      <nav id="mobile-site-navigation" className="mobile-nav" data-open={open} aria-label="Мобільна навігація">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 0' }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#005bff', letterSpacing: '0.08em', padding: '0 16px' }}>
            {t.products}
          </div>
          <Link href={`${root}/products`} onClick={() => setOpen(false)}>{t.catalog}</Link>
          <Link href={`${root}/compare`} onClick={() => setOpen(false)}>{t.compare}</Link>
          <Link href={`${root}/documents`} onClick={() => setOpen(false)}>{t.documents}</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 0', borderTop: '1px solid #eef2f6' }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#005bff', letterSpacing: '0.08em', padding: '0 16px' }}>
            {t.engineering}
          </div>
          <Link href={`${root}/bess-designer`} onClick={() => setOpen(false)}>{t.designer}</Link>
          <Link href={`${root}/engineering/bess-calculator`} onClick={() => setOpen(false)}>{t.bessCalculator}</Link>
          <Link href={`${root}/engineering/lcos`} onClick={() => setOpen(false)}>{t.lcosCalculator}</Link>
          <Link href={`${root}/engineering/single-line-diagram`} onClick={() => setOpen(false)}>{t.sldDiagram}</Link>
          <Link href={`${root}/engineering`} onClick={() => setOpen(false)}>{t.engineering} (Огляд)</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 0', borderTop: '1px solid #eef2f6' }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#005bff', letterSpacing: '0.08em', padding: '0 16px' }}>
            Інформація
          </div>
          <Link href={`${root}/solutions`} onClick={() => setOpen(false)}>{t.solutions}</Link>
          <Link href={`${root}/industries`} onClick={() => setOpen(false)}>{t.industries}</Link>
          <Link href={`${root}/resources`} onClick={() => setOpen(false)}>{t.knowledge}</Link>
          <Link href={`${root}/partner`} onClick={() => setOpen(false)}>{t.partners}</Link>
          <Link href={`${root}/about`} onClick={() => setOpen(false)}>{t.about}</Link>
          <Link href={`${root}/search`} onClick={() => setOpen(false)}>{t.search}</Link>
          <Link href={`${root}/portal`} onClick={() => setOpen(false)}>{t.account}</Link>
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #eef2f6' }}>
          <Link className="button" style={{ width: '100%' }} href={`${root}/rfq`} onClick={() => setOpen(false)}>
            {t.quote}
          </Link>
        </div>
      </nav>
    </header>
  );
}

function rememberLocale(locale:string){
  if(typeof document==='undefined')return;
  const secure=window.location.protocol==='https:'?'; Secure':'';
  document.cookie=`KATL_LOCALE=${encodeURIComponent(locale)}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
}

export function SiteFooter() {
  const pathname=usePathname();const locale=pathname.split('/')[1]||'uk-UA';const en=locale==='en';const zh=locale==='zh-CN';
  return <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand"><Link href={`/${locale}`} className="brand"><span className="brand-wordmark">CATL</span><span className="brand-caption">ENERGY STORAGE<br/>SOLUTIONS</span></Link><p>{en?'Information, tools and project requests for CATL energy storage systems in Ukraine.':zh?'乌克兰 CATL 储能系统的信息、工具与项目咨询。':'Інформація, інструменти та запити щодо систем накопичення енергії CATL для проєктів в Україні.'}</p></div>
        <FooterColumn title={en?'Products':zh?'产品':'Продукція'} links={[[en?'Catalog':zh?'产品目录':'Каталог систем', `/${locale}/products`],[en?'Compare':zh?'对比':'Порівняння', `/${locale}/compare`],[en?'Documents':zh?'文档':'Документи', `/${locale}/documents`]]} />
        <FooterColumn title={en?'Solutions':zh?'解决方案':'Рішення'} links={[[en?'All solutions':zh?'全部解决方案':'Усі рішення', `/${locale}/solutions`],[en?'Industries':zh?'行业':'Для галузей', `/${locale}/industries`],[en?'BESS in Ukraine':zh?'乌克兰储能':'BESS в Україні', `/${locale}/energy-storage-ukraine`]]} />
        <FooterColumn title={en?'Engineering':zh?'工程':'Інженерія'} links={[["BESS Designer", `/${locale}/bess-designer`],[en?'Calculators':zh?'计算器':'Калькулятори', `/${locale}/engineering`],[en?'Knowledge':zh?'知识库':'База знань', `/${locale}/resources`]]} />
        <FooterColumn title={en?'Company':zh?'公司':'Компанія'} links={[[en?'About this site':zh?'关于本站':'Про сайт', `/${locale}/about`],[en?'Partners':zh?'合作伙伴':'Партнерам', `/${locale}/partner`],[en?'Contact':zh?'联系':'Контакти', `/${locale}/contact`],[en?'Request a proposal':zh?'提交需求':'Запит пропозиції', `/${locale}/rfq`]]} />
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} catl.site · {en?'KATL platform':zh?'KATL 平台':'платформа KATL'}</span><span>{en?'CATL is the product manufacturer. Partnership status and legal details are published only when confirmed.':zh?'CATL 为产品制造商。合作状态和法律信息仅在确认后发布。':'CATL є виробником продукції. Статус партнерства та юридичні реквізити вказуються лише після підтвердження.'}</span><span><Link href={`/${locale}/privacy`}>{en?'Privacy':zh?'隐私':'Приватність'}</Link> · <Link href={`/${locale}/terms`}>{en?'Terms':zh?'条款':'Умови'}</Link></span></div>
    </div>
  </footer>;
}

export function MobileCta() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'uk-UA';
  if (pathname.endsWith('/rfq') || pathname.endsWith('/bess-designer')) return null;
  const en=locale==='en';const zh=locale==='zh-CN';return <div className="mobile-cta"><Link className="button button-secondary" href={`/${locale}/bess-designer`}>{en?'Calculate':zh?'计算':'Розрахувати'}</Link><Link className="button" href={`/${locale}/rfq`}>{en?'Request a proposal':zh?'获取方案':'Отримати пропозицію'}</Link></div>;
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (/^\/(uk-UA|en|zh-CN)\/admin(?:\/|$)/.test(pathname)) return <>{children}</>;
  return <><SiteHeader/>{children}<MobileCta/><SiteFooter/></>;
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return <div className="footer-col"><h3>{title}</h3>{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>;
}

export function HeroBessIllustration() {
  return <svg className="bess-illustration" viewBox="0 0 780 460" role="img" aria-label="Схематична ілюстрація промислової системи накопичення енергії">
    <defs>
      <linearGradient id="hero-sky" x2="0" y2="1"><stop stopColor="#19375a"/><stop offset=".55" stopColor="#7997b5"/><stop offset="1" stopColor="#efc18a"/></linearGradient>
      <linearGradient id="hero-ground" x2="0" y2="1"><stop stopColor="#243e5b"/><stop offset="1" stopColor="#0b1727"/></linearGradient>
      <linearGradient id="front" x1="0" x2="1"><stop stopColor="#edf3f8"/><stop offset="1" stopColor="#bdcad6"/></linearGradient>
      <linearGradient id="side" x1="0" x2="1"><stop stopColor="#a5b5c4"/><stop offset="1" stopColor="#657d95"/></linearGradient>
      <linearGradient id="sun" x2="0" y2="1"><stop stopColor="#ffe2a7" stopOpacity=".9"/><stop offset="1" stopColor="#f1a974" stopOpacity="0"/></linearGradient>
    </defs>
    <rect width="780" height="460" fill="url(#hero-sky)"/>
    <circle cx="594" cy="128" r="110" fill="url(#sun)"/><circle cx="594" cy="128" r="24" fill="#ffe7bf"/>
    <path d="m0 245 99-100 68 61 96-108 89 112 74-84 102 120 84-91 99 94 69-71v127H0Z" fill="#283d56"/>
    <path d="m0 250 99-100 36 35 32 21 96-108 50 63 39 49 74-84 50 58 52 62 84-91 46 43 53 51 69-71v78H0Z" fill="#536c83" opacity=".7"/>
    <path d="m99 150 16 16 14-7 15 19 22 8 61-68 15 19 18-7 22 29 16 7 19 39 22 22" fill="none" stroke="#dae2e8" strokeWidth="4" opacity=".62"/>
    <path d="M0 271h780v189H0Z" fill="url(#hero-ground)"/>
    <path d="m0 340 780-21M0 389l780-20M65 271 0 460m190-189L125 460m180-189L240 460m180-189L365 460m180-189L490 460m180-189L615 460" stroke="#8097ad" strokeWidth="1" opacity=".3"/>
    <g fill="#dbe4eb" stroke="#788da1" strokeWidth="2">
      <path d="M48 265 78 248h88l-30 17v86l-88 4Z"/><path d="M136 265 166 248h88l-30 17v85l-88 3Z"/>
      <path d="M595 263 618 250h73l-23 13v70l-73 3Z"/>
    </g>
    <g stroke="#92a5b7" strokeWidth="2" fill="url(#front)">
      <path d="m195 200 50-27h354l-49 27Z"/><path d="m550 200 49-27v157l-49 25Z" fill="url(#side)"/><path d="M195 200h355v157l-355 5Z"/>
    </g>
    <g stroke="#aebdca" strokeWidth="3"><path d="M215 217v126m48-126v126m48-126v126m48-126v126m48-126v126m48-126v126m48-126v126"/><path d="M202 238h332m-332 20h332m-332 20h332m-332 20h332m-332 20h332" opacity=".55"/></g>
    <rect x="518" y="224" width="11" height="118" rx="4" fill="#1882e8"/><rect x="513" y="210" width="21" height="9" rx="3" fill="#1882e8"/>
    <text x="291" y="305" fill="#22609c" fontSize="19" fontWeight="700" fontFamily="sans-serif" letterSpacing="2">BESS</text>
    <path d="M168 373h455" stroke="#95a7b8" strokeWidth="4"/><path d="M196 362v23m395-23v23" stroke="#95a7b8" strokeWidth="7"/>
    <g stroke="#d9e5f1" strokeWidth="4" fill="none" opacity=".8"><path d="M710 257v-82m-24 44 24-14 23 14m-23-14 18-20m-18 20-17-24"/><path d="M739 272v-55m-17 30 17-11 17 11m-17-11 13-14m-13 14-12-17"/></g>
    <text x="24" y="431" fill="#cbd8e5" fontSize="11" fontFamily="sans-serif" letterSpacing="1.7">СХЕМАТИЧНА ІЛЮСТРАЦІЯ СИСТЕМИ НАКОПИЧЕННЯ</text>
  </svg>;
}

export const PageIcons = { BatteryCharging, BookOpen, BriefcaseBusiness, Zap };
