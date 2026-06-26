import fs from 'node:fs';

const requiredUsage = {
  'src/pages/stablecoins/index.astro': [
    'resolvePrimaryRelationshipForStablecoin',
    'Primary display organization',
    'Primary display role',
    'All connected organizations',
    'data-organization-ids',
    'additional relationship'
  ],
  'src/components/StablecoinDetailView.astro': [
    'resolvePrimaryRelationshipForStablecoin',
    'Primary display organization',
    'Primary display role',
    'Display selection mode',
    'Primary display is a navigation and summary choice only',
    'Additional relationship'
  ],
  'src/pages/issuer/[slug].astro': [
    'resolvePrimaryRelationshipForStablecoin',
    'Primary displays',
    'Primary display relationships',
    'Display priority',
    'Additional relationship'
  ],
  'src/lib/machine-readable.ts': [
    'getPrimaryDisplayRelationshipBreakdown',
    'getPrimaryDisplayRelationshipBreakdown()'
  ],
  'scripts/verify-public-layer.mjs': [
    'buildPrimaryDisplayRelationshipStats',
    'primary_display_relationships',
    'primary_display_ambiguities',
    'primary_display_selection_mode'
  ],
  'scripts/validate-primary-display-relationships.mjs': [
    'reverse',
    'rotate',
    'ambiguous primary display selections',
    'historical_end_dates_not_recorded'
  ]
};

const forbiddenUsage = {
  'src/components/StablecoinDetailView.astro': [
    'const primaryRelationship = relationships[0]'
  ],
  'src/pages/stablecoins/index.astro': [
    'getPrimaryRelationship'
  ]
};

const failures = [];
for (const [file, requiredTerms] of Object.entries(requiredUsage)) {
  const source = fs.readFileSync(file, 'utf8');
  for (const term of requiredTerms) {
    if (!source.includes(term)) failures.push(`${file}: required primary-display usage is missing: ${term}`);
  }
}

for (const [file, forbiddenTerms] of Object.entries(forbiddenUsage)) {
  const source = fs.readFileSync(file, 'utf8');
  for (const term of forbiddenTerms) {
    if (source.includes(term)) failures.push(`${file}: array-order or legacy primary selection remains: ${term}`);
  }
}

if (failures.length > 0) throw new Error(failures.join('\n'));
console.log(JSON.stringify({
  ok: true,
  protected_surfaces: Object.keys(requiredUsage).length,
  forbidden_array_order_patterns: Object.values(forbiddenUsage).flat().length
}, null, 2));
