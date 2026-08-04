import fs from 'node:fs';

const robots = fs.readFileSync('public/robots.txt', 'utf8');
const sitemap = fs.readFileSync('src/pages/sitemap.xml.ts', 'utf8');
const sitemapIndex = fs.readFileSync('src/pages/sitemap-index.xml.ts', 'utf8');
const detailRoute = fs.readFileSync('src/pages/stablecoin/[slug].astro', 'utf8');

const checks = [
  [robots.includes('https://www.stableorgone.com/sitemap.xml'), 'robots must reference the canonical sitemap'],
  [sitemap.includes('<lastmod>'), 'sitemap must publish lastmod values'],
  [sitemap.includes('/stablecoin/${row.slug}/'), 'sitemap must include stablecoin detail routes'],
  [sitemapIndex.includes('<sitemapindex'), 'legacy sitemap-index endpoint must be a real sitemap index'],
  [detailRoute.includes('BreadcrumbList'), 'stablecoin detail must publish breadcrumbs'],
  [detailRoute.includes('isAccessibleForFree'), 'stablecoin detail must publish dataset access metadata'],
];
for (const [condition, message] of checks) {
  if (!condition) throw new Error(message);
}
console.log('SOG SEO discovery audit: pass');
