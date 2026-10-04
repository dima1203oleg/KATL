import type { MetadataRoute } from 'next';

const origin = (process.env.PUBLIC_SITE_URL || 'https://catl.site').replace(/\/$/, '');
// Search routes carry a crawlable noindex directive; disallowing them here would
// prevent crawlers from seeing that directive. This list is not access control.
const privatePaths = ['/api/', '/admin', '/account/', '/partner/', '/customer/'];

export default function robots(): MetadataRoute.Robots {
  const publicSearchAgents = ['Googlebot', 'Bingbot', 'Applebot', 'Baiduspider', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'Claude-User'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: privatePaths },
      ...publicSearchAgents.map((userAgent) => ({ userAgent, allow: '/', disallow: privatePaths })),
      // Keep model-development crawling an independent choice from search citations.
      { userAgent: 'GPTBot', disallow: '/' },
    ],
    sitemap: `${origin}/sitemap.xml`,
  };
}
