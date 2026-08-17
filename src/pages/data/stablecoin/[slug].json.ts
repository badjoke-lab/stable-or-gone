import type { APIRoute, GetStaticPaths } from 'astro';
import { getStablecoins } from '../../../lib/data/registry';
import { getStablecoinRecordDossier } from '../../../lib/stablecoinRecordData';

export const getStaticPaths: GetStaticPaths = () => getStablecoins().map((stablecoin) => ({
  params: { slug: stablecoin.slug },
  props: { slug: stablecoin.slug },
}));

export const GET: APIRoute = ({ props }) => {
  const slug = String(props.slug ?? '');
  const dossier = getStablecoinRecordDossier(slug);
  if (!dossier) return new Response('Not found', { status: 404 });

  return new Response(JSON.stringify(dossier, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600, must-revalidate',
    },
  });
};
