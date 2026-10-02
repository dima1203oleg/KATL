-- Initial Ukrainian semantic plan. This creates planning records only:
-- no search volumes, verified facts, published pages, or indexable URLs are asserted.

INSERT INTO knowledge_entities (entity_key, entity_type, canonical_name, lifecycle_status)
VALUES
  ('CATL', 'MANUFACTURER', 'CATL', 'CANDIDATE'),
  ('ESS', 'CATEGORY', 'Energy Storage System (ESS)', 'CANDIDATE'),
  ('BESS', 'CATEGORY', 'Battery Energy Storage System (BESS)', 'CANDIDATE'),
  ('STATIONARY_STORAGE', 'CATEGORY', 'Стаціонарні системи накопичення та зберігання енергії', 'CANDIDATE'),
  ('INDUSTRIAL_BESS', 'CATEGORY', 'Промислові системи накопичення енергії', 'CANDIDATE'),
  ('CONTAINER_BESS', 'CATEGORY', 'Контейнерні системи BESS', 'CANDIDATE'),
  ('CATL_TENER_FAMILY', 'PRODUCT_FAMILY', 'CATL TENER', 'CANDIDATE'),
  ('CATL_TENER', 'PRODUCT', 'CATL TENER', 'CANDIDATE'),
  ('CATL_TENER_STACK', 'PRODUCT', 'CATL TENER Stack', 'CANDIDATE'),
  ('CATL_TENER_FLEX', 'PRODUCT', 'CATL TENER Flex', 'CANDIDATE'),
  ('CATL_TENER_S', 'PRODUCT', 'CATL TENER S', 'CANDIDATE'),
  ('CATL_TENER_H', 'PRODUCT', 'CATL TENER H', 'CANDIDATE'),
  ('CATL_TENER_SODIUM', 'PRODUCT', 'CATL TENER Sodium', 'CANDIDATE'),
  ('CATL_ENERONE', 'PRODUCT', 'CATL EnerOne', 'CANDIDATE'),
  ('CATL_ENERC', 'PRODUCT_FAMILY', 'CATL EnerC / EnerC+', 'CANDIDATE'),
  ('CATL_ENERD', 'PRODUCT_FAMILY', 'CATL EnerD / EnerD+', 'CANDIDATE'),
  ('SOLAR_BESS', 'APPLICATION', 'Solar + BESS', 'CANDIDATE'),
  ('BACKUP_BESS', 'APPLICATION', 'Backup power BESS', 'CANDIDATE'),
  ('PEAK_SHAVING', 'APPLICATION', 'Peak shaving BESS', 'CANDIDATE'),
  ('BESS_SIZING', 'APPLICATION', 'BESS sizing and engineering', 'CANDIDATE'),
  ('PCS_BESS', 'COMPONENT', 'PCS for BESS', 'CANDIDATE'),
  ('UKRAINE_UZE', 'REGULATORY_TOPIC', 'Установка зберігання енергії (УЗЕ) в Україні', 'CANDIDATE')
ON CONFLICT (entity_key) DO NOTHING;

INSERT INTO knowledge_entity_aliases (entity_id, locale, alias, alias_type, search_only)
SELECT e.id, a.locale, a.alias, a.alias_type, a.search_only
FROM (VALUES
  ('STATIONARY_STORAGE','uk-UA','система накопичення енергії','SYNONYM',false),
  ('STATIONARY_STORAGE','uk-UA','система накопичення електроенергії','SYNONYM',false),
  ('STATIONARY_STORAGE','uk-UA','система зберігання енергії','SYNONYM',false),
  ('STATIONARY_STORAGE','uk-UA','система зберігання електроенергії','SYNONYM',false),
  ('STATIONARY_STORAGE','uk-UA','установка зберігання енергії','SYNONYM',false),
  ('STATIONARY_STORAGE','uk-UA','УЗЕ','ABBREVIATION',false),
  ('STATIONARY_STORAGE','uk-UA','промисловий накопичувач енергії','SYNONYM',false),
  ('BESS','uk-UA','акумуляторна система зберігання енергії','SYNONYM',false),
  ('BESS','uk-UA','промисловий BESS','SYNONYM',false),
  ('BESS','en','Battery Energy Storage System','PREFERRED',false),
  ('BESS','en','industrial BESS','SYNONYM',false),
  ('BESS','en','containerized BESS','SYNONYM',false),
  ('CATL_TENER','uk-UA','CATL TENER Україна','SEARCH_VARIANT',false),
  ('CATL_TENER','uk-UA','CATL TENER ціна','SEARCH_VARIANT',false),
  ('CATL_TENER_STACK','en','TENER Stack 9 MWh','SEARCH_VARIANT',false),
  ('CATL_TENER_SODIUM','en','CATL sodium-ion BESS','SYNONYM',false),
  ('CATL','zh-CN','宁德时代','PREFERRED',false),
  ('STATIONARY_STORAGE','zh-CN','储能系统','SYNONYM',false),
  ('CATL_TENER','zh-CN','宁德时代 TENER','PREFERRED',false),
  ('CATL_ENERC','zh-CN','宁德时代 EnerC','SEARCH_VARIANT',false),
  ('UKRAINE_UZE','uk-UA','ліцензія УЗЕ Україна','SEARCH_VARIANT',false),
  ('UKRAINE_UZE','uk-UA','підключення УЗЕ до мережі','SEARCH_VARIANT',false),
  ('STATIONARY_STORAGE','ru','система накопления энергии','SEARCH_VARIANT',true),
  ('STATIONARY_STORAGE','ru','промышленный накопитель энергии','SEARCH_VARIANT',true),
  ('CATL_TENER','ru','CATL TENER купить','SEARCH_VARIANT',true),
  ('CATL_TENER','ru','CATL TENER цена','SEARCH_VARIANT',true)
) AS a(entity_key, locale, alias, alias_type, search_only)
JOIN knowledge_entities e ON e.entity_key = a.entity_key
ON CONFLICT (entity_id, locale, alias) DO NOTHING;

INSERT INTO knowledge_entity_relationships (from_entity_id, relationship, to_entity_id, verification_status)
SELECT source.id, rel.relationship, target.id, 'UNVERIFIED'
FROM (VALUES
  ('CATL_TENER_FAMILY','PART_OF','CATL'),
  ('CATL_TENER','PART_OF','CATL_TENER_FAMILY'),
  ('CATL_TENER_STACK','PART_OF','CATL_TENER_FAMILY'),
  ('CATL_TENER_FLEX','PART_OF','CATL_TENER_FAMILY'),
  ('CATL_TENER_S','PART_OF','CATL_TENER_FAMILY'),
  ('CATL_TENER_H','PART_OF','CATL_TENER_FAMILY'),
  ('CATL_TENER_SODIUM','PART_OF','CATL_TENER_FAMILY'),
  ('CATL_ENERC','PART_OF','CATL'),
  ('CATL_ENERD','PART_OF','CATL'),
  ('INDUSTRIAL_BESS','RELATED_TO','BESS'),
  ('CONTAINER_BESS','RELATED_TO','BESS')
) AS rel(from_key, relationship, to_key)
JOIN knowledge_entities source ON source.entity_key = rel.from_key
JOIN knowledge_entities target ON target.entity_key = rel.to_key
ON CONFLICT (from_entity_id, relationship, to_entity_id) DO NOTHING;

INSERT INTO seo_page_registry (page_key, locale, canonical_path, page_type, lifecycle_status, index_policy, search_intent, primary_entity_id, noindex_reason)
SELECT p.page_key, 'uk-UA', p.canonical_path, p.page_type, 'PLANNED', 'NOINDEX', p.search_intent, e.id,
       'PLANNED_SEMANTIC_TARGET: awaiting demand validation, primary-source review, useful content, localization and release acceptance'
FROM (VALUES
  ('uk-home','/uk-UA','HOME','NAVIGATIONAL','CATL'),
  ('energy-storage','/uk-UA/energy-storage','CATEGORY','INFORMATIONAL','STATIONARY_STORAGE'),
  ('industrial-bess','/uk-UA/products/industrial-bess','CATEGORY','TRANSACTIONAL','INDUSTRIAL_BESS'),
  ('container-bess','/uk-UA/products/container-bess','CATEGORY','COMMERCIAL_INVESTIGATION','CONTAINER_BESS'),
  ('catl-ess','/uk-UA/catl-ukraine','OTHER','COMMERCIAL_INVESTIGATION','CATL'),
  ('tener-family','/uk-UA/products/tener','FAMILY','COMMERCIAL_INVESTIGATION','CATL_TENER_FAMILY'),
  ('tener-stack','/uk-UA/products/tener-stack','PRODUCT','COMMERCIAL_INVESTIGATION','CATL_TENER_STACK'),
  ('tener-flex','/uk-UA/products/tener-flex','PRODUCT','COMMERCIAL_INVESTIGATION','CATL_TENER_FLEX'),
  ('tener-s','/uk-UA/products/tener-s','PRODUCT','COMMERCIAL_INVESTIGATION','CATL_TENER_S'),
  ('tener-h','/uk-UA/products/tener-h','PRODUCT','COMMERCIAL_INVESTIGATION','CATL_TENER_H'),
  ('tener-sodium','/uk-UA/products/tener-sodium','PRODUCT','INFORMATIONAL','CATL_TENER_SODIUM'),
  ('enerone','/uk-UA/products/enerone','PRODUCT','COMMERCIAL_INVESTIGATION','CATL_ENERONE'),
  ('enerc','/uk-UA/products/enerc','FAMILY','COMMERCIAL_INVESTIGATION','CATL_ENERC'),
  ('enerd','/uk-UA/products/enerd','FAMILY','COMMERCIAL_INVESTIGATION','CATL_ENERD'),
  ('solar-bess','/uk-UA/solutions/solar-bess','SOLUTION','ENGINEERING','SOLAR_BESS'),
  ('backup-bess','/uk-UA/solutions/backup-power','SOLUTION','ENGINEERING','BACKUP_BESS'),
  ('peak-shaving','/uk-UA/solutions/peak-shaving','SOLUTION','ENGINEERING','PEAK_SHAVING'),
  ('bess-sizing','/uk-UA/engineering/bess-calculator','CALCULATOR','ENGINEERING','BESS_SIZING'),
  ('pcs-bess','/uk-UA/components/pcs','COMPONENT','COMMERCIAL_INVESTIGATION','PCS_BESS'),
  ('ukraine-uze','/uk-UA/regulation/uze','REGULATORY','REGULATORY','UKRAINE_UZE')
) AS p(page_key, canonical_path, page_type, search_intent, entity_key)
JOIN knowledge_entities e ON e.entity_key = p.entity_key
ON CONFLICT (page_key) DO NOTHING;

INSERT INTO seo_page_registry (page_key, locale, canonical_path, page_type, lifecycle_status, index_policy, search_intent, primary_entity_id, noindex_reason)
SELECT p.page_key, p.locale, p.canonical_path, p.page_type, 'PLANNED', 'NOINDEX', p.search_intent, e.id,
       'PLANNED_SEMANTIC_TARGET: awaiting localized human review, demand validation and release acceptance'
FROM (VALUES
  ('en-energy-storage','en','/en/energy-storage','CATEGORY','INFORMATIONAL','STATIONARY_STORAGE'),
  ('en-container-bess','en','/en/products/container-bess','CATEGORY','COMMERCIAL_INVESTIGATION','CONTAINER_BESS'),
  ('en-tener-stack','en','/en/products/tener-stack','PRODUCT','COMMERCIAL_INVESTIGATION','CATL_TENER_STACK'),
  ('zh-energy-storage','zh-CN','/zh-CN/energy-storage','CATEGORY','INFORMATIONAL','STATIONARY_STORAGE'),
  ('zh-tener','zh-CN','/zh-CN/products/tener','FAMILY','COMMERCIAL_INVESTIGATION','CATL_TENER_FAMILY'),
  ('zh-tener-stack','zh-CN','/zh-CN/products/tener-stack','PRODUCT','COMMERCIAL_INVESTIGATION','CATL_TENER_STACK')
) AS p(page_key, locale, canonical_path, page_type, search_intent, entity_key)
JOIN knowledge_entities e ON e.entity_key = p.entity_key
ON CONFLICT (page_key) DO NOTHING;

INSERT INTO seo_semantic_clusters (cluster_key, locale, cluster_name, primary_query, intent, funnel_stage, priority, primary_page_id)
SELECT c.cluster_key, 'uk-UA', c.cluster_name, c.primary_query, c.intent, c.funnel_stage, c.priority, p.id
FROM (VALUES
  ('core-energy-storage','Системи накопичення та зберігання енергії','система накопичення енергії','INFORMATIONAL','TOFU','P0','energy-storage'),
  ('industrial-bess','Промисловий BESS','промисловий накопичувач енергії','TRANSACTIONAL','BOFU','P0','industrial-bess'),
  ('container-bess','Контейнерні BESS','контейнерний BESS','COMMERCIAL_INVESTIGATION','MOFU','P0','container-bess'),
  ('catl-ess','CATL ESS Україна','CATL ESS Україна','COMMERCIAL_INVESTIGATION','BOFU','P0','catl-ess'),
  ('catl-tener','CATL TENER','CATL TENER','COMMERCIAL_INVESTIGATION','BOFU','P0','tener-family'),
  ('catl-tener-stack','CATL TENER Stack','CATL TENER Stack','COMMERCIAL_INVESTIGATION','MOFU','P0','tener-stack'),
  ('catl-tener-flex','CATL TENER Flex','CATL TENER Flex','COMMERCIAL_INVESTIGATION','MOFU','P1','tener-flex'),
  ('catl-tener-s','CATL TENER S','CATL TENER S','COMMERCIAL_INVESTIGATION','MOFU','P1','tener-s'),
  ('catl-tener-h','CATL TENER H','CATL TENER H','COMMERCIAL_INVESTIGATION','MOFU','P1','tener-h'),
  ('catl-tener-sodium','CATL TENER Sodium','CATL TENER Sodium','INFORMATIONAL','TOFU','P1','tener-sodium'),
  ('catl-enerone','CATL EnerOne','CATL EnerOne','COMMERCIAL_INVESTIGATION','BOFU','P0','enerone'),
  ('catl-enerc','CATL EnerC','CATL EnerC','COMMERCIAL_INVESTIGATION','BOFU','P0','enerc'),
  ('catl-enerd','CATL EnerD','CATL EnerD','COMMERCIAL_INVESTIGATION','MOFU','P1','enerd'),
  ('solar-storage','Накопичувач для СЕС','накопичувач для СЕС','ENGINEERING','MOFU','P0','solar-bess'),
  ('backup-power','Резервне живлення BESS','BESS резервне живлення','ENGINEERING','MOFU','P1','backup-bess'),
  ('peak-shaving','Peak shaving','BESS peak shaving','ENGINEERING','MOFU','P1','peak-shaving'),
  ('bess-sizing','Розрахунок BESS','розрахунок BESS','ENGINEERING','MOFU','P0','bess-sizing'),
  ('pcs','Компоненти PCS для BESS','PCS для BESS','COMMERCIAL_INVESTIGATION','MOFU','P1','pcs-bess'),
  ('regulatory-uze','Українська регуляторика УЗЕ','установка зберігання енергії Україна','REGULATORY','TOFU','P1','ukraine-uze')
) AS c(cluster_key, cluster_name, primary_query, intent, funnel_stage, priority, page_key)
JOIN seo_page_registry p ON p.page_key = c.page_key
ON CONFLICT (cluster_key) DO NOTHING;

INSERT INTO seo_semantic_clusters (cluster_key, locale, cluster_name, primary_query, intent, funnel_stage, priority, primary_page_id)
SELECT c.cluster_key, c.locale, c.cluster_name, c.primary_query, c.intent, c.funnel_stage, c.priority, p.id
FROM (VALUES
  ('en-core-energy-storage','en','Industrial energy storage','energy storage system Ukraine','INFORMATIONAL','TOFU','P1','en-energy-storage'),
  ('en-container-bess','en','Container BESS Ukraine','containerized BESS Ukraine','COMMERCIAL_INVESTIGATION','MOFU','P1','en-container-bess'),
  ('en-tener-stack','en','CATL TENER Stack','CATL TENER Stack','COMMERCIAL_INVESTIGATION','MOFU','P1','en-tener-stack'),
  ('zh-core-energy-storage','zh-CN','乌克兰储能','乌克兰储能','INFORMATIONAL','TOFU','P1','zh-energy-storage'),
  ('zh-catl-tener','zh-CN','宁德时代 TENER','宁德时代 TENER','COMMERCIAL_INVESTIGATION','MOFU','P1','zh-tener'),
  ('zh-tener-stack','zh-CN','CATL TENER Stack 储能','宁德时代 TENER Stack','COMMERCIAL_INVESTIGATION','MOFU','P1','zh-tener-stack')
) AS c(cluster_key, locale, cluster_name, primary_query, intent, funnel_stage, priority, page_key)
JOIN seo_page_registry p ON p.page_key = c.page_key
ON CONFLICT (cluster_key) DO NOTHING;

INSERT INTO seo_semantic_queries (query_text, normalized_query, locale, query_role, intent, funnel_stage, cluster_id, target_page_id, target_entity_id, priority)
SELECT q.query_text, btrim(regexp_replace(lower(q.query_text), '[[:space:]]+', ' ', 'g')), q.locale, q.query_role, q.intent, q.funnel_stage,
       c.id, p.id, e.id, q.priority
FROM (VALUES
  ('система накопичення енергії','uk-UA','PRIMARY','INFORMATIONAL','TOFU','core-energy-storage','energy-storage','STATIONARY_STORAGE','P0'),
  ('система зберігання енергії','uk-UA','SECONDARY','INFORMATIONAL','TOFU','core-energy-storage','energy-storage','STATIONARY_STORAGE','P0'),
  ('система накопичення електроенергії','uk-UA','SECONDARY','INFORMATIONAL','TOFU','core-energy-storage','energy-storage','STATIONARY_STORAGE','P0'),
  ('установка зберігання енергії','uk-UA','SECONDARY','REGULATORY','TOFU','core-energy-storage','energy-storage','UKRAINE_UZE','P0'),
  ('УЗЕ','uk-UA','SYNONYM','REGULATORY','TOFU','core-energy-storage','energy-storage','UKRAINE_UZE','P0'),
  ('Battery Energy Storage System','en','SYNONYM','INFORMATIONAL','TOFU','en-core-energy-storage','en-energy-storage','BESS','P1'),
  ('промисловий накопичувач енергії','uk-UA','PRIMARY','TRANSACTIONAL','BOFU','industrial-bess','industrial-bess','INDUSTRIAL_BESS','P0'),
  ('промисловий накопичувач електроенергії','uk-UA','SECONDARY','TRANSACTIONAL','BOFU','industrial-bess','industrial-bess','INDUSTRIAL_BESS','P0'),
  ('BESS для підприємства','uk-UA','SECONDARY','TRANSACTIONAL','BOFU','industrial-bess','industrial-bess','INDUSTRIAL_BESS','P0'),
  ('промисловий BESS купити','uk-UA','LONG_TAIL','TRANSACTIONAL','BOFU','industrial-bess','industrial-bess','INDUSTRIAL_BESS','P0'),
  ('контейнерний BESS','uk-UA','PRIMARY','COMMERCIAL_INVESTIGATION','MOFU','container-bess','container-bess','CONTAINER_BESS','P0'),
  ('контейнерна система накопичення енергії','uk-UA','SECONDARY','COMMERCIAL_INVESTIGATION','MOFU','container-bess','container-bess','CONTAINER_BESS','P0'),
  ('containerized BESS','en','SYNONYM','COMMERCIAL_INVESTIGATION','MOFU','en-container-bess','en-container-bess','CONTAINER_BESS','P1'),
  ('CATL ESS Україна','uk-UA','PRIMARY','COMMERCIAL_INVESTIGATION','BOFU','catl-ess','catl-ess','CATL','P0'),
  ('CATL BESS Україна','uk-UA','SECONDARY','COMMERCIAL_INVESTIGATION','BOFU','catl-ess','catl-ess','CATL','P0'),
  ('CATL TENER','uk-UA','PRIMARY','COMMERCIAL_INVESTIGATION','BOFU','catl-tener','tener-family','CATL_TENER_FAMILY','P0'),
  ('CATL TENER характеристики','uk-UA','SECONDARY','COMMERCIAL_INVESTIGATION','MOFU','catl-tener','tener-family','CATL_TENER','P0'),
  ('CATL TENER Stack','uk-UA','PRIMARY','COMMERCIAL_INVESTIGATION','MOFU','catl-tener-stack','tener-stack','CATL_TENER_STACK','P0'),
  ('TENER Stack 9 MWh','en','LONG_TAIL','COMMERCIAL_INVESTIGATION','MOFU','en-tener-stack','en-tener-stack','CATL_TENER_STACK','P1'),
  ('CATL TENER Flex','uk-UA','PRIMARY','COMMERCIAL_INVESTIGATION','MOFU','catl-tener-flex','tener-flex','CATL_TENER_FLEX','P1'),
  ('CATL TENER S','uk-UA','PRIMARY','COMMERCIAL_INVESTIGATION','MOFU','catl-tener-s','tener-s','CATL_TENER_S','P1'),
  ('CATL TENER H','uk-UA','PRIMARY','COMMERCIAL_INVESTIGATION','MOFU','catl-tener-h','tener-h','CATL_TENER_H','P1'),
  ('CATL TENER Sodium','uk-UA','PRIMARY','INFORMATIONAL','TOFU','catl-tener-sodium','tener-sodium','CATL_TENER_SODIUM','P1'),
  ('натрій-іонна система зберігання енергії','uk-UA','SECONDARY','INFORMATIONAL','TOFU','catl-tener-sodium','tener-sodium','CATL_TENER_SODIUM','P1'),
  ('CATL EnerOne','uk-UA','PRIMARY','COMMERCIAL_INVESTIGATION','BOFU','catl-enerone','enerone','CATL_ENERONE','P0'),
  ('CATL EnerC','uk-UA','PRIMARY','COMMERCIAL_INVESTIGATION','BOFU','catl-enerc','enerc','CATL_ENERC','P0'),
  ('CATL EnerD','uk-UA','PRIMARY','COMMERCIAL_INVESTIGATION','MOFU','catl-enerd','enerd','CATL_ENERD','P1'),
  ('накопичувач для СЕС','uk-UA','PRIMARY','ENGINEERING','MOFU','solar-storage','solar-bess','SOLAR_BESS','P0'),
  ('BESS для сонячної електростанції','uk-UA','SECONDARY','ENGINEERING','MOFU','solar-storage','solar-bess','SOLAR_BESS','P0'),
  ('BESS резервне живлення','uk-UA','PRIMARY','ENGINEERING','MOFU','backup-power','backup-bess','BACKUP_BESS','P1'),
  ('BESS peak shaving','uk-UA','PRIMARY','ENGINEERING','MOFU','peak-shaving','peak-shaving','PEAK_SHAVING','P1'),
  ('як розрахувати BESS','uk-UA','PRIMARY','ENGINEERING','MOFU','bess-sizing','bess-sizing','BESS_SIZING','P0'),
  ('розрахунок системи накопичення енергії','uk-UA','SECONDARY','ENGINEERING','MOFU','bess-sizing','bess-sizing','BESS_SIZING','P0'),
  ('PCS для BESS','uk-UA','PRIMARY','COMMERCIAL_INVESTIGATION','MOFU','pcs','pcs-bess','PCS_BESS','P1'),
  ('ліцензія УЗЕ Україна','uk-UA','LONG_TAIL','REGULATORY','TOFU','regulatory-uze','ukraine-uze','UKRAINE_UZE','P1'),
  ('система накопления энергии','ru','SYNONYM','INFORMATIONAL',NULL,'core-energy-storage','energy-storage','STATIONARY_STORAGE',NULL),
  ('промышленный накопитель энергии','ru','SYNONYM','TRANSACTIONAL',NULL,'industrial-bess','industrial-bess','INDUSTRIAL_BESS',NULL),
  ('CATL TENER купить','ru','LONG_TAIL','TRANSACTIONAL',NULL,'catl-tener','tener-family','CATL_TENER',NULL),
  ('CATL TENER цена','ru','LONG_TAIL','TRANSACTIONAL',NULL,'catl-tener','tener-family','CATL_TENER',NULL)
) AS q(query_text, locale, query_role, intent, funnel_stage, cluster_key, page_key, entity_key, priority)
JOIN seo_semantic_clusters c ON c.cluster_key = q.cluster_key
LEFT JOIN seo_page_registry p ON p.page_key = q.page_key
JOIN knowledge_entities e ON e.entity_key = q.entity_key
ON CONFLICT (locale, normalized_query) DO NOTHING;

INSERT INTO seo_semantic_queries (query_text, normalized_query, locale, country_code, query_role, intent, funnel_stage, cluster_id, target_page_id, target_entity_id, priority)
SELECT q.query_text, btrim(regexp_replace(lower(q.query_text), '[[:space:]]+', ' ', 'g')), q.locale, 'CN', q.query_role, q.intent, q.funnel_stage,
       c.id, p.id, e.id, q.priority
FROM (VALUES
  ('乌克兰储能','zh-CN','PRIMARY','INFORMATIONAL','TOFU','zh-core-energy-storage','zh-energy-storage','STATIONARY_STORAGE','P1'),
  ('宁德时代储能','zh-CN','SECONDARY','COMMERCIAL_INVESTIGATION','MOFU','zh-core-energy-storage','zh-energy-storage','CATL','P1'),
  ('宁德时代 TENER','zh-CN','PRIMARY','COMMERCIAL_INVESTIGATION','MOFU','zh-catl-tener','zh-tener','CATL_TENER_FAMILY','P1'),
  ('CATL 储能 乌克兰','zh-CN','SECONDARY','COMMERCIAL_INVESTIGATION','MOFU','zh-core-energy-storage','zh-energy-storage','CATL','P1'),
  ('宁德时代 TENER Stack','zh-CN','PRIMARY','COMMERCIAL_INVESTIGATION','MOFU','zh-tener-stack','zh-tener-stack','CATL_TENER_STACK','P1')
) AS q(query_text, locale, query_role, intent, funnel_stage, cluster_key, page_key, entity_key, priority)
JOIN seo_semantic_clusters c ON c.cluster_key = q.cluster_key
JOIN seo_page_registry p ON p.page_key = q.page_key
JOIN knowledge_entities e ON e.entity_key = q.entity_key
ON CONFLICT (locale, normalized_query) DO NOTHING;

INSERT INTO seo_query_exclusions (query_pattern, locale, match_type, exclusion_scope, reason_code, explanation)
VALUES
  ('EV traction batteries, vehicle packs, Tesla/Avatr', 'all', 'PHRASE', 'CONTENT', 'OUT_OF_SCOPE_MOBILE', 'Stationary ESS/BESS only; retain observed query data for research.'),
  ('12V/24V automotive starter batteries, scooter/phone batteries, powerbanks', 'all', 'PHRASE', 'CONTENT', 'OUT_OF_SCOPE_CONSUMER', 'No matching consumer/mobile battery offer.'),
  ('portable power stations EcoFlow/Bluetti; residential 2–5 kWh batteries', 'all', 'PHRASE', 'CONTENT', 'OUT_OF_SCOPE_PORTABLE', 'Avoid unrelated portable and residential product intent.'),
  ('standalone solar panels', 'all', 'PHRASE', 'CONTENT', 'OUT_OF_SCOPE_PV_ONLY', 'Solar generation may be discussed as a BESS application, not as a standalone product line.'),
  ('EV charging as a standalone product', 'all', 'PHRASE', 'CONTENT', 'OUT_OF_SCOPE_EVSE', 'EV charging is in scope only as a BESS application.'),
  ('official/exclusive CATL distributor, unsupported stock, price, warranty, certificate or case claims', 'all', 'PHRASE', 'ALL_ACQUISITION', 'UNVERIFIED_CLAIM', 'Do not publish or target claims until legally and technically verified.')
ON CONFLICT DO NOTHING;
