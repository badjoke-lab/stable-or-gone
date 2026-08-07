import worker from '../public/_worker.js';

const fail = (message) => {
  throw new Error(message);
};

const assetCalls = [];
const env = {
  ASSETS: {
    async fetch(request) {
      assetCalls.push(request.url);
      return new Response('asset-pass-through', {
        status: 200,
        headers: { 'x-test-asset': 'true' }
      });
    }
  }
};

const legacyHost = ['sog', 'badjoke-lab', 'com'].join('.');
const legacy = await worker.fetch(
  new Request(`https://${legacyHost}/stablecoin/usdt/?network=erc20&ref=legacy`),
  env
);
if (legacy.status !== 301) fail(`legacy status ${legacy.status}`);
if (legacy.headers.get('location') !== 'https://www.stableorgone.com/stablecoin/usdt/?network=erc20&ref=legacy') {
  fail(`legacy location ${legacy.headers.get('location')}`);
}
if (assetCalls.length !== 0) fail('legacy request reached ASSETS');

const canonicalUrl = 'https://www.stableorgone.com/stablecoin/usdt/?network=erc20';
const canonical = await worker.fetch(new Request(canonicalUrl), env);
if (canonical.status !== 200) fail(`canonical status ${canonical.status}`);
if (canonical.headers.get('x-test-asset') !== 'true') fail('canonical request did not return ASSETS response');
if (assetCalls.length !== 1 || assetCalls[0] !== canonicalUrl) fail('canonical ASSETS request mismatch');

const pagesDevUrl = 'https://stable-or-gone.pages.dev/events/';
const pagesDev = await worker.fetch(new Request(pagesDevUrl), env);
if (pagesDev.status !== 200) fail(`pages.dev status ${pagesDev.status}`);
if (assetCalls.length !== 2 || assetCalls[1] !== pagesDevUrl) fail('pages.dev ASSETS request mismatch');

console.log('Legacy-host worker contract: pass');
console.log('Legacy host -> exact 301 with path/query preservation');
console.log('Canonical and pages.dev hosts -> ASSETS pass-through');
