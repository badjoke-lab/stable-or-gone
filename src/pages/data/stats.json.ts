import type { APIRoute } from 'astro';
import { getPublicStats } from '../../lib/statsData.mjs';

export const GET: APIRoute = () => {
  const stats = getPublicStats();
  return new Response(JSON.stringify(stats, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate'
    }
  });
};
