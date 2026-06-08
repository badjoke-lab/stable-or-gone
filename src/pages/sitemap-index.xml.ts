import type { APIRoute } from 'astro';
import stablecoins from '../../data/stablecoins.json';
import stablecoinsExtra from '../../data/stablecoins-extra.json';
import issuers from '../../data/issuers.json';
import issuersExtra from '../../data/issuers-extra.json';
import events from '../../data/events.json';
import eventsPr036 from '../../data/events-pr036.json';

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
    ...([...(stablecoins as Array<{ slug: string }>), ...(stablecoinsExtra as Array<{ slug: string }>)]).map((row) => `/stablecoin/${row.slug}/`),
    ...([...(issuers as Array<{ slug: string }>), ...(issuersExtra as Array<{ slug: string }>)]).map((row) => `/issuer/${row.slug}/`),
    ...([...(events as Array<{ id: string }>), ...(eventsPr036 as Array<{ id: string }>)]).map((row) => `/event/${row.id}/`)
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
