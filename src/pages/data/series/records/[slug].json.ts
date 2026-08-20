import type { APIRoute, GetStaticPaths } from 'astro';
import { getStablecoins } from '../../../../lib/data/registry';
import { getLedgerSeriesRecordEnvelope } from '../../../../lib/ledgerSeriesAdapter';

export const getStaticPaths: GetStaticPaths = () => getStablecoins().map((stablecoin) => ({
  params: { slug: stablecoin.slug },
  props: { slug: stablecoin.slug },
}));

export const GET: APIRoute = ({ props }) => {
  const slug = String(props.slug ?? '');
  const envelope = getLedgerSeriesRecordEnvelope(slug);
  if (!envelope) return new Response('Not found', { status: 404 });

  return new Response(JSON.stringify(envelope, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate',
    },
  });
};
