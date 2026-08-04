import type { APIRoute } from 'astro';
import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';
import { guides } from '../data/guideCatalog';
import { getStablecoins, getOrganizations, getEvents } from '../lib/data/registry';

const SITE = PUBLIC_ORIGIN;
const PAGE_SIZE = 20;

function absolute(pathname: string) {
  return new URL(pathname.replace(/^\//, ''), `${SITE}/`).toString();
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function validDate(value: unknown): string | null {
  const text = String(value ?? '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

function latestDate(values: unknown[]) {
  return values.map(validDate).filter((value): value is string => Boolean(value)).sort().at(-1) ?? '2026-08-05';
}

function paginatedPaths(basePath: string, recordCount: number) {
  const totalPages = Math.ceil(recordCount / PAGE_SIZE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => `${basePath}page/${index + 2}/`);
}

function urlEntry(pathname: string, lastmod: string, changefreq = 'weekly', priority = '0.7') {
  return [
    '  <url>',
    `    <loc>${escapeXml(absolute(pathname))}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

export const GET: APIRoute = () => {
  const stablecoins = getStablecoins();
  const organizations = getOrganizations();
  const events = getEvents();
  const registryLastmod = latestDate([
    ...stablecoins.map((row) => row.last_verified_at),
    ...organizations.map((row) => row.last_verified_at),
    ...events.map((row) => row.last_verified_at ?? row.event_date),
  ]);

  const staticPaths = [
    '/',
    '/stablecoins/',
    ...paginatedPaths('/stablecoins/', stablecoins.length),
    '/compare/',
    '/access-regulation/',
    '/timeline/',
    '/issuers/',
    ...paginatedPaths('/issuers/', organizations.length),
    '/events/',
    ...paginatedPaths('/events/', events.length),
    '/stats/',
    '/models/',
    '/guides/',
    ...guides.map((guide) => `/guides/${guide.slug}/`),
    '/glossary/',
    '/methodology/',
    '/updates/',
    '/maintenance/',
    '/about/',
    '/support/',
    '/contact/',
  ];

  const entries = [
    ...staticPaths.map((pathname) => urlEntry(pathname, registryLastmod, pathname === '/maintenance/' ? 'monthly' : 'weekly', pathname === '/' ? '1.0' : '0.7')),
    ...stablecoins.map((row) => urlEntry(`/stablecoin/${row.slug}/`, validDate(row.last_verified_at) ?? registryLastmod, 'monthly', '0.8')),
    ...organizations.map((row) => urlEntry(`/issuer/${row.slug}/`, validDate(row.last_verified_at) ?? registryLastmod, 'monthly', '0.7')),
    ...events.map((row) => urlEntry(`/event/${row.id}/`, validDate(row.last_verified_at ?? row.event_date) ?? registryLastmod, 'monthly', '0.7')),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
