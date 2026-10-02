# CATL.site search, semantic and AI retrieval architecture

Status: **architecture and implementation plan; not a claim of rankings, AI citations, query volume, or complete implementation.** Related implementation gaps are in [`MASTER_GAP_MATRIX.md`](MASTER_GAP_MATRIX.md).

## Product objective

Build an entity-centered Ukrainian knowledge-commerce platform for stationary CATL ESS/BESS: commerce, engineering, knowledge, data, and authority. The useful object is a verified answer joined to a product, application, calculation, source, and next action, not a keyword repeated across URLs. Qualified organic opportunities and completed commercial/engineering journeys matter more than raw impressions.

Do not promise position one. Optimize for crawlable, source-backed, useful answers and measure rankings/citations after the relevant search tools are connected.

## Locale and canonical URL policy

Canonical locales remain `uk-UA`, `en`, and `zh-CN`, matching the product and database locale model. The canonical paths are `/uk-UA/`, `/en/`, and `/zh-CN/`. Short forms `/ua/`, `/uk/`, and `/zh-Hans/` are permanent aliases to the canonical locale paths; they must not create duplicate indexable pages. Google alternate-language values should be `uk-UA`, `en`, and `zh-CN` (or verified `zh-Hans` mapping only when chosen consistently). Emit an alternate only when the corresponding human-reviewed page is actually published.

At the unlocalized root only, locale negotiation is: explicit saved user choice → trusted edge country (Ukraine→uk-UA, China→zh-CN) → quality-ranked browser `Accept-Language` → uk-UA default. Explicit locale URLs never change based on IP. A language switch saves a one-year preference and takes the visitor to that locale's home until a page-level alternate is verified. Geo-IP requires the CDN to overwrite `x-vercel-ip-country`/`cf-ipcountry`; the application ignores generic client-supplied country headers. Unit tests and production-server HTTP smoke checks pass for the implemented root selection behavior. Full translated route coverage remains a release blocker.

The semantic plan recommends `/uk-UA/energy-storage/` as the central Ukrainian category and `/uk-UA/products/industrial-bess/`, `/uk-UA/products/container-bess/` for distinct commercial intents. Existing `/uk-UA/bess/` content must be migrated with links, canonical, redirect, sitemap and regression checks before any redirect is made. Until that migration passes, do not expose both pages as indexable duplicates.

Trailing slash policy must be normalized by Next.js and confirmed with redirects/canonical checks. Search, filter, sort, compare-parameter, private and incomplete locale URLs are not sitemap targets.

## Entity-first graph

Stable entity IDs unify languages and pages. Candidate entity types are manufacturer, brand, product family, product, category, technology, application, industry, component, standard, service, regulatory topic, capacity class, and power class.

Example graph (relations remain unverified until sourced):

```text
CATL
└── TENER family
    ├── candidate product: TENER Stack
    ├── category: container BESS
    ├── technology: LFP (fact requires source and product applicability)
    ├── components: PCS, EMS, BMS, transformer, fire safety
    ├── applications: solar, wind, grid services, backup
    └── lifecycle: engineering → procurement/logistics → commissioning → service
```

`knowledge_entities` and `knowledge_entity_relationships` are proposed by migration `0011`. Do not generate verified graph edges just from co-occurring words. `entity_facts` is the source of critical technical claims: each fact points to a source document, locator, validity/revision, review state, verifier, and timestamp. A missing or conflicting fact is unavailable; it is not inferred from another model or a marketing paragraph.

The product family names supplied in the project brief (TENER, TENER Stack, TENER Flex, TENER S/H/Sodium, EnerOne, EnerC/EnerC+, EnerD/EnerD+) are **candidate semantic entities**, not yet reviewed PIM products. The supplied capacities, chemistries, certifications, timing and performance figures are claims pending validation against current CATL primary sources and exact model/configuration. They must not appear as published product facts until that review is complete.

## Query fan-out and page ownership

Each observed or planned query maps to exactly one primary page per locale. `seo_semantic_queries` records the phrase, locale, role, intent, funnel stage, entity, cluster and target page. Similar wording is consolidated when it expresses the same intent; separate pages are approved only when SERP/user intent and page evidence differ. Query observation metrics are time-series records from GSC, Bing, keyword tools, or explicitly labeled AI-citation checks.

Search volume, CPC, difficulty and SERP composition remain `NULL` until obtained from an identified provider/date. The P0/P1 labels below are **provisional editorial/business priority from this brief**, not measured demand. Initial terms are a seed for research and do not imply search-volume validation.

| Macrocluster | Primary page target | Primary intent | Candidate entity/query group | Initial status |
|---|---|---|---|---|
| Stationary ESS/BESS / УЗЕ | `/uk-UA/energy-storage/` | Informational | BESS, ESS, система накопичення енергії, установка зберігання енергії | P0 plan; source/research/content review |
| CATL ESS brand | `/uk-UA/catl-ukraine/` or reviewed brand hub | Commercial investigation | CATL ESS, CATL BESS, CATL Energy Storage Україна | P0 plan; legal status guard |
| Industrial BESS | `/uk-UA/products/industrial-bess/` | Commercial/transactional | промисловий накопичувач енергії, BESS для підприємства | P0 plan; real offer/service evidence required |
| Container BESS | `/uk-UA/products/container-bess/` | Commercial investigation | контейнерний BESS, battery storage container | P0 plan; category PIM and unique value required |
| TENER family | `/uk-UA/products/tener/` | Commercial investigation | CATL TENER, TENER specifications/price/datasheet | P0 plan; PIM facts and legal review |
| TENER Stack | `/uk-UA/products/tener-stack/` | Commercial investigation/comparison | TENER Stack, stated 9 MWh searches | P0 candidate; capacity is not published before source review |
| EnerOne | `/uk-UA/products/enerone/` | Commercial investigation | CATL EnerOne, cabinet, capacity/specification queries | P0 candidate; model/variant facts need primary evidence |
| EnerC | `/uk-UA/products/enerc/` | Commercial investigation | CATL EnerC/EnerC+, container and application queries | P0 candidate; current variant/source review |
| TENER Flex / S / H | Data-driven PIM product routes | Commercial investigation | model, format, configuration and data queries | P1 candidates; do not create incomplete pages |
| TENER Sodium | `/uk-UA/products/tener-sodium/` | Informational/commercial investigation | sodium-ion BESS, TENER Sodium, LFP vs Na-ion | P1 candidate; clearly distinguish announced, orderable, supplied and available states |
| EnerD / EnerD+ | Data-driven PIM product routes | Commercial investigation | model, capacity, certificate queries | P1 candidates; source and model applicability review |
| Solar + BESS | `/uk-UA/solutions/solar-bess/` | Application/commercial | накопичувач для СЕС, solar BESS | P0/P1 provisional; calculator requires profile inputs |
| Backup and peak management | solution-specific canonical URLs | Application/engineering | резерв, peak shaving, load shifting | P0/P1 provisional; keep distinct only where intent/evidence differs |
| Capacity/power/duration | reviewed configuration pages only | Engineering/transactional | e.g. BESS 1 MW / 4 MWh; 4-hour BESS | P1/P2; publish only when a real configuration and unique source-backed calculation exist |
| Components | `/uk-UA/components/{pcs,bms,ems,scada,...}/` | Technical/commercial | BESS PCS, BMS, EMS, SCADA, transformer | P1; only BESS-relevant product/service scope, real compatibility data |
| Ukrainian regulation/import | reviewed regulatory/service pages | Regulatory/transactional | УЗЕ, НКРЕКП, приєднання, BESS import/customs | P1; current primary legal sources and qualified human reviewer required |
| Engineering and knowledge | sizing, LCOS, guides and glossary | Informational/engineering | як розрахувати BESS, MW vs MWh, LCOS | P0/P1; deterministic methodology and assumptions shown |

This initial plan is not an instruction to publish 80–120 pages immediately. That range is a later planning envelope only. The final indexable URL count follows measured demand, verified entities, unique intent and completed content. Likewise, 800–1,500 phrases are not a quota: import them only after normalization, provenance and mapping checks.

## Search-intent ownership

For a concept such as “BESS 5 MWh,” keep one core configuration page for the actual supported configuration. Explain the definition, selection criteria, purchasability and application there unless Search Console/SERP evidence demonstrates a distinct intent deserving a separate page. A separate engineering output can be a private/shareable result, not an indexable programmatic URL by default. Capacity and power are distinct attributes (`MWh` energy vs `MW` power) and must be represented separately in entities and calculations.

Comparisons need sourced rows and limitations for both entities. Do not publish adversarial competitor pages from unsupported or one-sided claims. A comparison scenario can remain `NOINDEX` until both sides have equivalent evidence and editorial review.

## Indexability and programmatic page gate

The page registry is the allow-list for indexable content. A page can be `INDEX` only when it is published, has one reviewed search intent, has a named reviewer/date, contains useful unique content, has citations for material technical claims, resolves to a single canonical URL, and has relevant internal links. Otherwise it is `NOINDEX`, `PLANNED`, or absent. Filter combinations, search results, compare states, empty catalog states, thin locale fallbacks, private portals and generated calculation variants stay noindex.

Programmatic landing pages require at least one of: validated search demand, a real published product/entity, a distinct intent, a useful unique deterministic calculation, or enough first-party source-backed data. Never create numeric URL permutations such as every integer capacity. Proposed technical thresholds live in migration `0011`; it has not yet passed a live PostgreSQL migration test.

## AI-extractable answer and fact assets

Public product, solution, technology, component and engineering pages should begin with server-rendered HTML that answers: what this is, key verified facts, who uses it, when it applies, limits/assumptions, checked date, and primary sources. Tables and explanatory text remain selectable HTML. No answer block may make unverified supplier, price, warranty, certification, safety, or performance claims.

Derived data assets (area/MWh, container count, PCS sizing, throughput, runtime, degradation, or cost/kWh) are published only with:

- reviewed input facts and source IDs;
- deterministic algorithm version, units, input snapshot and assumptions;
- product/variant scope and revision;
- clear estimated/modelled status;
- a recalculation and invalidation path when any fact changes.

Values such as cost per kWh, site area, number of containers, PCS or transformer count cannot be manufactured from a nameplate capacity alone. Do not synthesize product specifications into “unique data” without actual evidence and a validated calculation model.

## Technical search and AI crawler policy

Current Next.js groundwork provides server metadata, a sitemap route based on a reviewed static route allow-list plus published PIM records, robots rules and permanent short-locale redirects. These require build/runtime validation and still need page-registry integration before production. Sitemap generation must exclude draft/noindex/fallback/query URLs and only include a locale alternate when that translation is fully approved and published.

Allow public retrieval agents for public URLs: Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot and Perplexity-User. `GPTBot` is independently disallowed by the current default policy, so search retrieval permission does not imply model-training crawl permission. Private/admin/API paths are disallowed in robots, but robots is not access control. The CDN/WAF, rate limits, HTTP status, bot IP/rules and challenge behavior still require production verification. No Search Console, Bing Webmaster, IndexNow, CDN or AI citation API is configured yet.

No `llms.txt` or special “AI schema” is a release dependency. Use Schema.org only when it truthfully matches visible page content. Use Organization/WebSite/WebPage, BreadcrumbList, Product, Article/TechArticle, Service, ItemList or VideoObject as valid for each page. Keep FAQ visible when useful; do not depend on FAQ rich results or apply QAPage to static FAQs. Do not emit fake ratings/reviews.

## Query exclusions and acquisition hygiene

Exclusions apply to content planning and/or paid targeting; they do not block users from using the site search. Store a reason and scope rather than silently deleting observed query data.

| Excluded topic/query class | Scope | Reason |
|---|---|---|
| EV traction packs, Tesla/Avatr vehicle batteries, starter batteries | CONTENT and PAID_SEARCH | Not stationary ESS/BESS product scope; avoid topical dilution |
| Scooter batteries, phone batteries, powerbanks, 12V/24V automotive | CONTENT and PAID_SEARCH | Consumer/portable intent is outside platform scope |
| EcoFlow/Bluetti portable power stations and residential 2–5 kWh products | CONTENT and PAID_SEARCH | No matching offering; prevent mismatched leads |
| Standalone solar panels | CONTENT and PAID_SEARCH | Not an ESS/BESS offer in this platform scope |
| EV charging as a standalone product business | CONTENT and PAID_SEARCH | EV charging may be discussed only as a BESS application |
| Russian-language product landing pages | CONTENT | Capture Russian queries for internal research/analytics only; no `/ru/` at launch |
| Unsupported “official/exclusive distributor”, availability, price, warranty, certification, customer or ROI claims | ALL_ACQUISITION | Legal/factual integrity; publish only after documentary review |

These are planning defaults; a real observed query may be retained in GSC/Bing research while still being excluded from content/paid targeting.

## Measurement plan

`seo_query_observations` is intended for date-stamped GSC/Bing impressions, clicks, CTR, average position, keyword-tool volume with provider/date, and explicitly labeled AI citation observations. Track qualified lead and engineering completion outcomes alongside visibility. Alerts should cover content decay, query cannibalization, orphan pages, broken links, missing source/fact refresh, high-impression low-CTR pages, useful queries with no target, and crawled-but-unindexed pages.

No volume, CPC, difficulty, competitor position, citation rate, or top ranking is asserted until the corresponding data connector is configured and evidence is stored.
