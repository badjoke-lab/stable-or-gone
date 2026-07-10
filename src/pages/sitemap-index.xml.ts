import type { APIRoute } from 'astro';
import { guides } from '../data/guideCatalog';
import { getStablecoins, getOrganizations, getEvents } from '../lib/data/registry';

const SITE = 'https://sog.badjoke-lab.com';

function url(path: string) {
  return `${SITE}${path}`;
}

export const GET: APIRoute = () => {
  const staticPaths = [
    '/',
    '/stablecoins/',
    '/compare/',
    '/access-regulation/',
    '/timeline/',
    '/issuers/',
    '/events/',
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
    ...getStablecoins().map((row) => `/stablecoin/${row.slug}/`),
    ...getOrganizations().map((row) => `/issuer/${row.slug}/`),
    ...getEvents().map((row) => `/event/${row.id}/`)
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
