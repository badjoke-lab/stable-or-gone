import type { APIRoute } from 'astro';
import stablecoins from '../../data/stablecoins.json';
import issuers from '../../data/issuers.json';
import events from '../../data/events.json';

const SITE = 'https://stable-or-gone.pages.dev';

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
    '/glossary/',
    '/methodology/',
    '/about/',
    '/support/',
    '/contact/'
  ];

  const dynamicPaths = [
    ...(stablecoins as Array<{ slug: string }>).map((row) => `/stablecoin/${row.slug}/`),
    ...(issuers as Array<{ slug: string }>).map((row) => `/issuer/${row.slug}/`),
    ...(events as Array<{ id: string }>).map((row) => `/event/${row.id}/`)
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
