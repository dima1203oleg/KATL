import { BRAND } from '../../lib/brand';
import { glossary } from '../../data/glossary';
import { solutions } from '../../data/solutions';

// llms.txt — a plain-text map of the site for AI assistants and retrieval systems (llmstxt.org).
export const dynamic = 'force-static';

export function GET() {
  const u = BRAND.siteUrl;
  const lines = [
    `# ${BRAND.name} — Energy Storage Platform for Ukraine`,
    '',
    `> ${BRAND.disclosure.en}`,
    '> Engineering-led battery energy storage (BESS/ESS) projects in Ukraine: load-profile analysis, sizing, financial modelling (LCOS/TCO), logistics from China, customs clearance, installation and O&M. Languages: Ukrainian (primary), English, Simplified Chinese.',
    '',
    'Product specifications on catalog pages are preliminary; final figures are fixed in a commercial proposal against the current manufacturer datasheet. Calculators use deterministic formulas and show their assumptions.',
    '',
    '## Core pages',
    `- [Home (Ukrainian)](${u}/uk-UA): overview, energy-flow model, peak-shaving lab, project path`,
    `- [Home (English)](${u}/en)`,
    `- [Home (Chinese)](${u}/zh-CN): market-entry layer for manufacturers from China`,
    `- [Product catalog](${u}/uk-UA/products)`,
    `- [Request a proposal](${u}/uk-UA/rfq)`,
    '',
    '## Engineering tools',
    `- [BESS Designer](${u}/uk-UA/bess-designer): size power and energy for a site`,
    `- [BESS calculator](${u}/uk-UA/engineering/bess-calculator)`,
    `- [LCOS calculator](${u}/uk-UA/engineering/lcos): levelized cost of storage with degradation`,
    `- [Single-line diagram](${u}/uk-UA/engineering/single-line-diagram)`,
    '',
    '## Solutions',
    ...solutions.map((s) => `- [${s.title.en}](${u}/en/solutions/${s.slug}): ${s.summary.en}`),
    '',
    '## Glossary',
    `- [Energy storage glossary](${u}/en/resources/glossary): ${glossary.length} terms`,
    ...glossary.map((g) => `- [${g.term}](${u}/en/resources/glossary#${g.slug})`),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
