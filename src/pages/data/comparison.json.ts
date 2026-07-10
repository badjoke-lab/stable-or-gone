import type { APIRoute } from 'astro';
import { getPublicComparisonProjection } from '../../lib/comparisonData.mjs';

export const GET: APIRoute = () => {
  const projection = getPublicComparisonProjection();
  return new Response(JSON.stringify(projection, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate'
    }
  });
};
