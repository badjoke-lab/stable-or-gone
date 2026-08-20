import type { APIRoute } from 'astro';
import { getLedgerSeriesIndex } from '../../../lib/ledgerSeriesAdapter';

export const GET: APIRoute = () => new Response(
  JSON.stringify(getLedgerSeriesIndex(), null, 2),
  {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate',
    },
  },
);
