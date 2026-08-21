import type { APIRoute } from 'astro';
import { getLedgerSeriesRelationships } from '../../../lib/ledgerSeriesAdapter';

export const GET: APIRoute = () => new Response(
  JSON.stringify(getLedgerSeriesRelationships(), null, 2),
  {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate',
    },
  },
);
