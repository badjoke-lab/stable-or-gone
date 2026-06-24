#!/usr/bin/env python3
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
counts = {
    'stablecoins': 82, 'organizations': 73, 'relationships': 86,
    'classifications': 82, 'profiles': 82, 'events': 128,
    'event_details': 128, 'evidence': 386, 'reserve_reports': 90,
    'known_unknowns': 200, 'regulatory_notes': 9, 'deployments': 116,
    'legal_profiles': 82, 'stable_asset_relationships': 4,
    'reserve_components': 115, 'income_profiles': 82,
}

def read_json(path):
    return json.loads((root / path).read_text())

def write_json(path, value):
    (root / path).write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')

# Correct Registry v3 enum values for the trust-issued JPYSC profile.
legal_path = 'data/legal-profiles-v3-batch-growth-n.json'
legal = read_json(legal_path)
for row in legal:
    if row.get('id') == 'sog_st_jpysc':
        row['classifications'][0]['classification'] = 'fiat_backed_stablecoin'
        row['holder_claim_type'] = 'beneficial_interest_in_reserve'
        row['reserve_ownership'] = 'trust_or_custodial'
        row['reserve_segregation'] = 'legally_segregated'
        row['bankruptcy_remoteness'] = 'stated'
write_json(legal_path, legal)

components_path = 'data/reserve-components-v3-batch-n.json'
components = read_json(components_path)
for row in components:
    if row.get('id') == 'sog_rc_jpysc_cash_batch_n':
        row['maturity_bucket'] = 'on_demand'
write_json(components_path, components)

v2_path = 'docs/migration/registry-v2-baseline.json'
v2 = read_json(v2_path)
v2['baseline_id'] = 'sog_registry_v2_jpysc_launch_2026_06_24'
v2['captured_at'] = '2026-06-24'
v2['source_commit'] = 'jpysc-launch'
for key, value in counts.items():
    if key in v2.get('minimum_counts', {}):
        v2['minimum_counts'][key] = value
if not any(row.get('id') == 'sog_st_jpysc' for row in v2['protected_stablecoins']):
    v2['protected_stablecoins'].append({'id': 'sog_st_jpysc', 'slug': 'jpysc'})
write_json(v2_path, v2)

v3_path = 'docs/migration/registry-v3-baseline.json'
v3 = read_json(v3_path)
v3['baseline_id'] = 'sog_registry_v3_jpysc_launch_2026_06_24'
v3['recorded_at'] = '2026-06-24'
v3['data_checkpoint_commit'] = 'jpysc-launch'
v3['expected_counts'] = counts
for key in ['classifications', 'profiles', 'relationships', 'evidence', 'known_unknowns', 'deployments', 'events', 'legal_profiles', 'reserve_components', 'income_profiles']:
    v3['expected_coverage'][key] = 82
v3['expected_coverage']['reserve_reports'] = 70
v3['quality'].update({
    'canonical_assets': 82,
    'candidate_promotions': 82,
    'pending_candidates': 0,
    'critical_findings': 0,
    'warnings': 3,
    'canonical_name_collisions': 0,
    'alias_collision_warnings': 0,
    'stale_or_missing_last_verified': 0,
    'all_unknown_income_profiles': 0,
    'launch_date_unresolved': 23,
    'terminal_date_unresolved': 4,
    'reserve_report_applicability_queue': 12,
    'reserve_report_not_applicable_by_design': 10,
    'reserve_report_source_status_unresolved': 2,
    'reserve_report_expected_but_missing': 0,
})
write_json(v3_path, v3)

income_path = 'docs/migration/registry-v3-income-profiles.json'
income = read_json(income_path)
income['minimum_count'] = 82
write_json(income_path, income)

replacements = {
    '81 stable assets': '82 stable assets',
    '70 organizations': '73 organizations',
    '83 stablecoin-organization relationships': '86 stablecoin-organization relationships',
    '81 classification records': '82 classification records',
    '81 reserve/redemption profiles': '82 reserve/redemption profiles',
    '126 events': '128 events',
    '126 Event v2 detail records': '128 Event v2 detail records',
    '382 evidence records': '386 evidence records',
    '382 evidence relation projections': '386 evidence relation projections',
    '89 reserve-report or reserve-context records': '90 reserve-report or reserve-context records',
    '197 known unknowns': '200 known unknowns',
    '115 deployments': '116 deployments',
    '81 legal profiles': '82 legal profiles',
    '113 reserve components': '115 reserve components',
    '81 income profiles': '82 income profiles',
    '81-record GitHub canonical baseline': '82-record GitHub canonical baseline',
}
for relative in ['README.md', 'docs/roadmap.md']:
    path = root / relative
    text = path.read_text()
    for old, new in replacements.items():
        text = text.replace(old, new)
    path.write_text(text)

roadmap = root / 'docs/roadmap.md'
text = roadmap.read_text()
text = text.replace(
    'Current quality position:\n\n```text\nNo open canonical quality PR\nLatest resolved record: Cashio Dollar\nNext bounded record: DOLA\n```',
    'Current quality position:\n\n```text\nPR #128 open — JPYSC launch and RLUSD Japan handling\nLatest resolved record: Cashio Dollar\nNext planned work after PR #128: dated Guides foundation and GENIUS Act article\n```'
)
text = text.replace('## Current canonical registry after Cashio Dollar launch resolution', '## Current canonical registry after JPYSC launch branch changes')
text = text.replace(
    '2. Audit DOLA as the next bounded Category C launch-boundary record.\n3. Separate initial token deployment, first mint, public release, FiRM issuance, and later product integrations.\n4. Assign no DOLA launch date without day-level first-party or on-chain public-availability evidence.\n5. Keep launch and terminal queues, generated outputs, integrity audit, Registry v3 baseline, README, and roadmap synchronized in every quality PR.\n6. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes.',
    '2. Complete PR #128 with synchronized JPYSC and RLUSD Japan event data, generated outputs, baselines, README, and roadmap.\n3. After PR #128 merges, implement the dated Guides foundation and publish the GENIUS Act article as the next PR.\n4. Follow with the MiCA article, then the JPYC versus JPYSC comparison article.\n5. Keep article publication dates unset until the pages are actually live in production; use information-current-through dates during GitHub-only work.\n6. When Cloudflare access returns, publish latest merged main manually and verify production parity before controlled record growth resumes.'
)
roadmap.write_text(text)

# Restore the normal validation workflows after using the temporary regeneration path.
(root / '.github/workflows/registry-stats.yml').write_text('''name: Registry stats\n\non:\n  pull_request:\n  push:\n    branches: [main]\n\npermissions:\n  contents: read\n\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - name: Validate current output\n        run: node scripts/validate-registry-stats.mjs\n      - name: Rebuild output\n        run: node scripts/generate-registry-stats.mjs\n      - name: Validate rebuilt output\n        run: node scripts/validate-registry-stats.mjs\n      - uses: actions/upload-artifact@v4\n        with:\n          name: registry-stats\n          path: data/generated/registry-stats.json\n''')
(root / '.github/workflows/registry-integrity.yml').write_text('''name: Registry integrity\n\non:\n  pull_request:\n  push:\n    branches:\n      - main\n\njobs:\n  audit:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout\n        uses: actions/checkout@v4\n      - name: Setup Node\n        uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - name: Install dependencies\n        run: npm install\n      - name: Validate generated integrity audit\n        run: npm run validate:integrity\n''')

# Remove the one-shot synchronizer from the final branch state.
(root / '.github/workflows/sync-jpysc-checkpoint.yml').unlink(missing_ok=True)
Path(__file__).unlink(missing_ok=True)
