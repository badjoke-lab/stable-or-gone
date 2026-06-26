import fs from 'node:fs';

const protectedByFile = {
  'src/pages/stablecoins/index.astro': ['Reference target', 'Backing model', 'Lifecycle', 'Issuance', 'Reviewed'],
  'src/pages/issuers/index.astro': ['Organization category', 'Regulatory character', 'Jurisdiction', 'Functional roles', 'Relationship state', 'Record confidence'],
  'src/pages/events/index.astro': ['Category', 'Subtype', 'Impact', 'Recovery', 'Sources'],
  'src/components/StablecoinDetailView.astro': ['Reference target', 'Reference kind', 'Comparison category', 'Reference methodology', 'Public backing model', 'Canonical backing types', 'Reserve component categories', 'Primary stabilization mechanism', 'Recorded model description'],
  'src/pages/issuer/[slug].astro': ['Organization category', 'Canonical organization type', 'Legal form', 'Legal-form state', 'Regulatory character', 'Jurisdiction scope', 'Functional roles', 'Relationship states', 'Record confidence'],
  'src/pages/event/[id].astro': ['Public event category', 'Canonical event subtype', 'Structured detail kind', 'Effect on stablecoin lifecycle', 'Recovery or reversal', 'Structured detail coverage', 'Record confidence']
};

const failures = [];
for (const [file, labels] of Object.entries(protectedByFile)) {
  const source = fs.readFileSync(file, 'utf8');
  for (const label of labels) {
    if (!source.includes(`>${label}<`)) failures.push(`${file}: protected field is missing: ${label}`);
  }
}
if (failures.length) throw new Error(failures.join('\n'));
console.log(JSON.stringify({ ok: true, protected_files: Object.keys(protectedByFile).length }, null, 2));
