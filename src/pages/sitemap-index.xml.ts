import type { APIRoute } from 'astro';
import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';
import { guides } from '../data/guideCatalog';
import { getStablecoins, getOrganizations, getEvents } from '../lib/data/registry';

const SITE = PUBLIC_ORIGIN;
const PAGE_SIZE = 20;

function url(path: string) {
  return `${SITE}${path}`;
}

function paginatedPaths(basePath: string, recordCount: number) {
  const totalPages = Math.ceil(recordCount / PAGE_SIZE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => `${basePath}page/${index + 2}/`);
}

export const GET: APIRoute = () => {
  const stablecoins = getStablecoins();
  const organizations = getOrganizations();
  const events = getEvents();
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

  const dynamicPaths = [
    ...stablecoins.map((row) => `/stablecoin/${row.slug}/`),
    ...organizations.map((row) => `/issuer/${row.slug}/`),
    ...events.map((row) => `/event/${row.id}/`)
  ];

  const urls = [...new Set([...staticPaths, ...dynamicPaths])]
    .map((path) => `<url><loc>${url(path)}</loc></url>`)
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
