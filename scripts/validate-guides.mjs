import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const check = (condition, message) => { if (!condition) throw new Error(message); };

const catalog = read('src/data/guideCatalog.ts');
const page = read('src/pages/guides/eu-stablecoin-access-after-mica/index.astro');
const updates = JSON.parse(read('data/registry-updates.json'));

for (const marker of [
  "slug: 'eu-stablecoin-access-after-mica'",
  "publishedAt: '2026-07-06'",
  "informationCurrentThrough: '2026-07-06'",
  "regionLabel: 'European Union / EEA'"
]) check(catalog.includes(marker), `Guide catalog missing: ${marker}`);

for (const marker of [
  'This guide is a reviewed snapshot current through July 6, 2026.',
  'Scope note:',
  'Direct mint',
  'Direct redemption',
  'Bank or payment rail',
  'Network support',
  'grandfathering could end earlier when authorization was granted or refused',
  'RLUSD: one asset, four separate layers',
  'Specific regional policy outranks a generic product page.',
  'EURe',
  'Web3 IBAN',
  'CHFAU',
  'SEKAU',
  'At least nine layers can move independently',
  'supported blockchain network or deployment',
  'payment-services authorization layer'
]) check(page.includes(marker), `EU market access guide missing marker: ${marker}`);

for (const url of [
  'https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica',
  'https://www.binance.com/en/support/announcement/detail/bcaa1f68d6a6450099056ff694ad6c46',
  'https://support.kraken.com/articles/stablecoin-offerings-for-eea-clients',
  'https://www.kraken.com/prices/usds',
  'https://ripple.com/legal/stablecoin/',
  'https://monerium.com/',
  'https://www.paxos.com/eu',
  'https://globaldollar.com/',
  'https://allunity.com/chfau',
  'https://allunity.com/sekau',
  'https://www.oddo-bhf.com/eurod-stablecoin/',
  'https://qivalis.eu/',
  'https://sky.money/'
]) check(page.includes(url), `EU market access guide missing source URL: ${url}`);

const euAccessUpdate = updates.find((entry) => entry.id === 'sog_update_2026_07_05_eu_stablecoin_access_guide');
check(Boolean(euAccessUpdate), 'EU stablecoin access guide registry update entry missing');
check(euAccessUpdate.related_paths.includes('/guides/eu-stablecoin-access-after-mica/'), 'EU guide update route missing');

console.log(JSON.stringify({
  ok: true,
  eu_market_access_final_corrections_applied: true,
  information_current_through: '2026-07-06',
  merge_gate: 'human approval required'
}, null, 2));
