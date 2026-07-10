import type { APIRoute } from 'astro';
import { getPublicAccessRegulationIndex } from '../../lib/accessRegulationData.mjs';

export const GET: APIRoute = () => {
  const index = getPublicAccessRegulationIndex();
  return new Response(JSON.stringify(index, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate'
    }
  });
};
