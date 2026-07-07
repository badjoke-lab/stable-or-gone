import type { APIRoute } from 'astro';
import { getPublicStatsHistory } from '../../lib/statsData.mjs';

export const GET: APIRoute = () => {
  const history = getPublicStatsHistory();
  return new Response(JSON.stringify(history, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate'
    }
  });
};
