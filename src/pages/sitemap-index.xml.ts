import type { APIRoute } from 'astro';
import { getStablecoins, getOrganizations, getEvents } from '../lib/data/registry';

const SITE = 'https://sog.badjoke-lab.com';

function url(path: string) {
  return `${SITE}${path}`;
}

export const GET: APIRoute = () => {
  const staticPaths = [
    '/',
    '/stablecoins/',
    '/issuers/',
    '/events/',
    '/models/',
    '/guides/',
    '/guides/what-is-a-depeg/',
    '/guides/status-vs-event/',
    '/guides/reserve-disclosure-basics/',
    '/guides/stablecoin-lifecycle-terms/',
    '/glossary/',
    '/methodology/',
    '/updates/',
    '/about/',
    '/support/',
    '/contact/'
  ];

  const dynamicPaths = [
    ...getStablecoins().map((row) => `/stablecoin/${row.slug}/`),
    ...getOrganizations().map((row) => `/issuer/${row.slug}/`),
    ...getEvents().map((row) => `/event/${row.id}/`)
  ];

  const urls = [...staticPaths, ...dynamicPaths]
    .map((path) => `<url><loc>${url(path)}</loc></url>`)
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
