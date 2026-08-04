import type { APIRoute } from 'astro';
import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';

export const GET: APIRoute = () => {
  const sitemapUrl = `${PUBLIC_ORIGIN}/sitemap.xml`;
  const body = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${sitemapUrl}</loc></sitemap></sitemapindex>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate'
    }
  });
};
