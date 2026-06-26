import fs from 'node:fs';
import { publicValueStateValues } from '../config/value-states.mjs';

const requiredStates = [
  'known',
  'unknown_after_review',
  'not_recorded',
  'not_applicable',
  'not_public',
  'unverified',
  'disputed',
  'approximate'
];

const requiredUsage = {
  'src/components/ValueStateText.astro': ['data-value-state', 'value-state--'],
  'src/components/ValueStateMethodology.astro': ['publicValueStates', 'data-value-state', 'short_definition'],
  'src/components/EvidenceRows.astro': ['ValueStateText', 'published_at', 'publisher', 'claim_scopes'],
  'src/components/DeploymentTable.astro': ['ValueStateText', 'canonical_status_raw', 'freeze_capability', 'blacklist_capability'],
  'src/components/StructuredEventDetail.astro': ['valueStatePresentation', 'data-value-state'],
  'src/components/EventValueStateRows.astro': ['ValueStateText', 'recoveryNullState', 'unknown_after_review', 'not_applicable'],
  'src/pages/event/[id].astro': ['EventValueStateRows'],
  'src/pages/issuer/[slug].astro': ['ValueStateText', 'start_date', 'end_date', 'last_verified_at'],
  'src/components/StablecoinDetailView.astro': ['ValueStateText', 'StablecoinValueStateSections', 'start_date', 'end_date'],
  'src/components/StablecoinValueStateSections.astro': ['ValueStateText', 'unknown', 'published_at', 'report_date', 'last_checked_at']
};

const forbiddenPublicLiterals = [
  'source_review_needed',
  'not_applicable_or_source_review_needed'
];

const failures = [];
if (JSON.stringify(publicValueStateValues) !== JSON.stringify(requiredStates)) {
  failures.push('approved public value-state set or order differs from specification');
}

for (const [file, requiredTerms] of Object.entries(requiredUsage)) {
  if (!fs.existsSync(file)) {
    failures.push(`${file}: required public value-state surface is missing`);
    continue;
  }
  const source = fs.readFileSync(file, 'utf8');
  for (const term of requiredTerms) {
    if (!source.includes(term)) failures.push(`${file}: required value-state usage is missing: ${term}`);
  }
  if (file !== 'src/components/ValueStateText.astro') {
    for (const literal of forbiddenPublicLiterals) {
      if (source.includes(`>${literal}<`) || source.includes(`'${literal}'`) || source.includes(`"${literal}"`)) {
        failures.push(`${file}: internal workflow literal appears in a protected public surface: ${literal}`);
      }
    }
  }
}

if (failures.length > 0) throw new Error(failures.join('\n'));
console.log(JSON.stringify({
  ok: true,
  approved_states: requiredStates,
  protected_surfaces: Object.keys(requiredUsage).length,
  forbidden_public_literals: forbiddenPublicLiterals
}, null, 2));
