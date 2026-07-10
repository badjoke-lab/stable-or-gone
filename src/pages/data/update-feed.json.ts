import type { APIRoute } from 'astro';
import { getPublicUpdateFeed } from '../../lib/updateFeedData.mjs';

export const GET: APIRoute = () => {
  const feed = getPublicUpdateFeed();
  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate'
    }
  });
};
