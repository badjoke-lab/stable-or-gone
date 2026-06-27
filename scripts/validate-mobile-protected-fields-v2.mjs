import fs from 'node:fs';

const protectedByFile = {
  'src/pages/stablecoins/index.astro': ['Primary display organization', 'Primary display role', 'Reference target', 'Backing model', 'Lifecycle', 'Issuance', 'Evidence'],
  'src/pages/issuers/index.astro': ['Organization category', 'Regulatory character', 'Jurisdiction', 'Functional roles', 'Relationship state', 'Record confidence'],
  'src/pages/events/index.astro': ['Category', 'Subtype', 'Impact', 'Recovery', 'Sources'],
  'src/components/StablecoinDetailView.astro': ['Reference target', 'Reference kind', 'Comparison category', 'Reference methodology', 'Public backing model', 'Canonical backing types', 'Reserve component categories', 'Primary stabilization mechanism', 'Recorded model description'],
  'src/components/StablecoinOrganizationsControl.astro': ['Primary display organization', 'Primary display role', 'Display selection mode', 'Display priority', 'Relationship status'],
  'src/components/StablecoinValueStateSections.astro': ['Disclosure status', 'Backing types', 'As of', 'Profile confidence', 'Settlement asset', 'Eligible parties', 'Retail access', 'Institutional access', 'Minimum amount', 'Settlement time', 'Regional limits', 'Assets covered', 'Authority / publisher', 'Value state', 'Last checked'],
  'src/components/DeploymentTable.astro': ['Network record state', 'Public deployment category', 'Canonical deployment type', 'Operational state', 'Recorded status', 'Change or proposal state', 'Canonicality', 'Canonicality record state', 'Verification state', 'Contract identity state', 'Contract or identifier', 'Freeze', 'Blacklist', 'Control events'],
  'src/pages/issuer/[slug].astro': ['Organization category', 'Canonical organization type', 'Legal form', 'Legal-form state', 'Regulatory character', 'Jurisdiction scope', 'Functional roles', 'Relationship states', 'Primary display relationships', 'Display priority', 'Relationship state', 'Record confidence'],
  'src/components/EventValueStateRows.astro': ['Public event category', 'Canonical event subtype', 'Structured detail kind', 'Effect on stablecoin lifecycle', 'Recovery or reversal', 'Structured detail coverage', 'Record confidence'],
  'src/components/EvidenceSourceTable.astro': ['Supported claims', 'Archive', 'Reliability'],
  'src/components/EvidenceRows.astro': ['Published']
};

const failures = [];
for (const [file, labels] of Object.entries(protectedByFile)) {
  const source = fs.readFileSync(file, 'utf8');
  for (const label of labels) {
    if (!source.includes(`>${label}<`) && !source.includes(`${label} `)) failures.push(`${file}: protected field is missing: ${label}`);
  }
}
if (failures.length) throw new Error(failures.join('\n'));
console.log(JSON.stringify({ ok: true, protected_files: Object.keys(protectedByFile).length }, null, 2));
