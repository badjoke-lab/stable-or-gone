import type { APIRoute } from 'astro';
import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';

export const GET: APIRoute = () => {
  const sitemapUrl = new URL('/sitemap.xml', PUBLIC_ORIGIN).toString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${sitemapUrl}</loc>\n  </sitemap>\n</sitemapindex>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
