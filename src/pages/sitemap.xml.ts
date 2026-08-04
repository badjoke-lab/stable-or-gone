import type { APIRoute } from 'astro';
import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';
import { guides } from '../data/guideCatalog';
import { getStablecoins, getOrganizations, getEvents } from '../lib/data/registry';

const SITE = PUBLIC_ORIGIN;
const PAGE_SIZE = 20;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type ReviewedRecord = { last_verified_at?: string; updated_at?: string; published_at?: string };

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function url(path: string) {
  return `${SITE}${path}`;
}

function reviewedDate(record: ReviewedRecord, fallback: string) {
  for (const candidate of [record.last_verified_at, record.updated_at, record.published_at]) {
    if (candidate && DATE_PATTERN.test(candidate)) return candidate;
  }
  return fallback;
}

function paginatedPaths(basePath: string, recordCount: number) {
  const totalPages = Math.ceil(recordCount / PAGE_SIZE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => `${basePath}page/${index + 2}/`);
}

function sitemapEntry(path: string, lastmod: string) {
  return `<url><loc>${escapeXml(url(path))}</loc><lastmod>${escapeXml(lastmod)}</lastmod></url>`;
}

export const GET: APIRoute = () => {
  const stablecoins = getStablecoins();
  const organizations = getOrganizations();
  const events = getEvents();
  const reviewedDates = [...stablecoins, ...organizations, ...events]
    .flatMap((record) => {
      const value = reviewedDate(record as ReviewedRecord, '');
      return value ? [value] : [];
    })
    .sort();
  const latestReviewed = reviewedDates.at(-1) ?? '2026-08-05';

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
    '/contact/'
  ];

  const staticEntries = staticPaths.map((path) => sitemapEntry(path, latestReviewed));
  const dynamicEntries = [
    ...stablecoins.map((row) => sitemapEntry(`/stablecoin/${row.slug}/`, reviewedDate(row as ReviewedRecord, latestReviewed))),
    ...organizations.map((row) => sitemapEntry(`/issuer/${row.slug}/`, reviewedDate(row as ReviewedRecord, latestReviewed))),
    ...events.map((row) => sitemapEntry(`/event/${row.id}/`, reviewedDate(row as ReviewedRecord, latestReviewed)))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set([...staticEntries, ...dynamicEntries])].join('')}</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate'
    }
  });
};
