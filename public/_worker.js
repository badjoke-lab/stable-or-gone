const LEGACY_HOST = ['sog', 'badjoke-lab', 'com'].join('.');
const CANONICAL_ORIGIN = 'https://www.stableorgone.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === LEGACY_HOST) {
      const target = new URL(`${url.pathname}${url.search}`, CANONICAL_ORIGIN);
      return new Response(null, {
        status: 301,
        headers: {
          Location: target.toString(),
          'Cache-Control': 'public, max-age=3600',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
