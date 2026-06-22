import fs from 'node:fs';

const file = 'docs/migration/registry-v2-baseline.json';
const baseline = JSON.parse(fs.readFileSync(file, 'utf8'));

baseline.minimum_counts.evidence_relations = 328;

if (!baseline.protected_stablecoins.some((row) => row.id === 'sog_st_msusd')) {
  baseline.protected_stablecoins.push({
    id: 'sog_st_msusd',
    slug: 'mainstreet-msusd'
  });
}

if (!baseline.protected_organizations.some((row) => row.id === 'sog_issuer_mainstreet_finance')) {
  baseline.protected_organizations.push({
    id: 'sog_issuer_mainstreet_finance',
    slug: 'mainstreet-finance'
  });
}

fs.writeFileSync(file, `${JSON.stringify(baseline, null, 2)}\n`);
console.log('msUSD baseline protection and evidence relation count synchronized');
