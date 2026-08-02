from pathlib import Path
import re

ROOT = Path('.')
PRODUCTION_COMMIT = '23804561ab544aa54426d595df5bbb4283e791dd'
PRODUCTION_HASH = 'sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb'

def read(path):
    return (ROOT / path).read_text(encoding='utf-8')

def write(path, content):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding='utf-8')

def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{label}: expected one anchor, found {count}')
    return text.replace(old, new, 1)

agents = read('AGENTS.md')
agents = replace_once(agents, 'Current production checkpoint: d33eda34830905e0fc7301dd55e1efd167f47efa', f'Current production checkpoint: {PRODUCTION_COMMIT}', 'AGENTS production')
agents = replace_once(agents, '20. PR #512 reviewed both fixed targets, preserved both canonical terminal dates as null, and is under review.\n21. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.', '20. PR #512 reviewed both fixed targets, preserved both canonical terminal dates as null, and was production-verified.\n21. PR #513 synchronizes the completed PR #512 checkpoint and returns repository authority to REVIEW GATE.\n22. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.', 'AGENTS chain')
agents = replace_once(agents, 'PR #511 Terminal Date Boundary Review — Batch 2 authorization: complete and production-verified\nPR #512 Terminal Date Boundary Review — Batch 2: implementation under review\nRequired exit after PR #512 merge and production verification: REVIEW GATE', 'PR #511 Terminal Date Boundary Review — Batch 2 authorization: complete and production-verified\nPR #512 Terminal Date Boundary Review — Batch 2: complete and production-verified\nRequired exit after PR #512 merge and production verification: REVIEW GATE — satisfied\nPR #513 post-PR #512 authority synchronization: active\nCurrent repository authority: REVIEW GATE', 'AGENTS workstream')
agents = replace_once(agents, 'After PR #512 merge and production verification, stop at REVIEW GATE. No third terminal-date batch is authorized automatically.\n\n## PR #511 authorized terminal-date review — Batch 2', f'''Production verification:\n\n```text\nsource commit: {PRODUCTION_COMMIT}\ncanonical hash: {PRODUCTION_HASH}\nconvergence attempt: 1\nstable assets: 117\norganizations: 108\nevents: 192\ndetail routes: 417\nmetadata-checked detail routes: 417\narchive recorded: 457\narchive not recorded: 122\n```\n\nRepository authority is now REVIEW GATE. No third terminal-date batch is authorized automatically.\n\n## PR #511 authorized terminal-date review — Batch 2''', 'AGENTS production result')
write('AGENTS.md', agents)

roadmap = read('docs/roadmap.md')
roadmap = replace_once(roadmap, 'Status: PR #512 Terminal Date Boundary Review — Batch 2 under review; exit boundary REVIEW GATE', 'Status: PR #512 complete and production-verified; REVIEW GATE', 'roadmap status')
roadmap = replace_once(roadmap, 'Current production checkpoint: d33eda34830905e0fc7301dd55e1efd167f47efa', f'Current production checkpoint: {PRODUCTION_COMMIT}', 'roadmap production')
roadmap = replace_once(roadmap, 'Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. PR #511 production converged with exact count, route, metadata, provenance, archive-partition, and canonical-hash parity.', 'Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. PR #512 production converged with exact count, route, metadata, provenance, archive-partition, and canonical-hash parity.', 'roadmap production paragraph')
roadmap = replace_once(roadmap, 'PR #511 Terminal Date Boundary Review — Batch 2 authorization: complete and production-verified\nPR #512 Terminal Date Boundary Review — Batch 2: implementation under review', 'PR #511 Terminal Date Boundary Review — Batch 2 authorization: complete and production-verified\nPR #512 Terminal Date Boundary Review — Batch 2: complete and production-verified\nPR #513 post-PR #512 authority synchronization: active', 'roadmap acceptance')
roadmap = replace_once(roadmap, 'After merge and production verification, return to REVIEW GATE.', f'''Production result:\n\n```text\nsource commit: {PRODUCTION_COMMIT}\ncanonical hash: {PRODUCTION_HASH}\nconvergence attempt: 1\nstable assets: 117\norganizations: 108\nevents: 192\ndetail routes: 417\nmetadata-checked detail routes: 417\narchive recorded: 457\narchive not recorded: 122\n```\n\nThe repository is at REVIEW GATE.''', 'roadmap PR512 production')
roadmap = replace_once(roadmap, 'PR #512 implementation under review, then REVIEW GATE', 'REVIEW GATE', 'roadmap boundary')
roadmap = replace_once(roadmap, 'Terminal Date Boundary Review — Batch 1\nAuthority PR: #508\nImplementation PR: #509\nAuthority synchronization PR: #510', 'Terminal Date Boundary Review — Batch 2\nAuthority PR: #511\nImplementation PR: #512\nAuthority synchronization PR: #513', 'roadmap completed current item')
write('docs/roadmap.md', roadmap)

governance = read('docs/spec-governance.md')
governance = replace_once(governance, 'PR #512 Terminal Date Boundary Review — Batch 2 implementation under review', 'REVIEW GATE — PR #512 complete and production-verified', 'governance current item')
governance = replace_once(governance, 'PR #511 Terminal Date Boundary Review — Batch 2 authority complete and production-verified\nproduction commit: d33eda34830905e0fc7301dd55e1efd167f47efa\nproduction canonical hash: sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb\nconvergence attempt: 1\nPR #512 exact targets: sog_st_bac, sog_st_dsd', f'PR #512 Terminal Date Boundary Review — Batch 2 complete and production-verified\nproduction commit: {PRODUCTION_COMMIT}\nproduction canonical hash: {PRODUCTION_HASH}\nconvergence attempt: 1\nPR #512 exact targets: sog_st_bac, sog_st_dsd', 'governance decision')
governance = replace_once(governance, 'next boundary after PR #512: REVIEW GATE', 'current boundary: REVIEW GATE', 'governance boundary')
governance = replace_once(governance, 'PR #512 is the only authorized implementation and is now under review.', 'No work beyond this checkpoint is pre-authorized.', 'governance stop')
governance = replace_once(governance, 'PR #512 adds no Evidence identity or Relation, alters no Market Access record, route family, material UI, or legacy redirect, and must exit to REVIEW GATE after production verification.', f'PR #512 added no Evidence identity or Relation, altered no Market Access record, route family, material UI, or legacy redirect. Production commit `{PRODUCTION_COMMIT}` verified canonical hash `{PRODUCTION_HASH}`, canonical counts 117/108/129/192/579/579/184/8, 417 detail routes, 417 metadata-checked routes, and archive partition 457/122. The repository is at REVIEW GATE. No work beyond this checkpoint is pre-authorized.', 'governance production paragraph')
governance = re.sub(r'## 19\. Review gate\n\nPR #512 is the current implementation under review\. Before merge and production acceptance, review:\n\n```text\n.*?\n```\n\nAfter PR #512 merge and production verification, return to REVIEW GATE\. No later terminal-date batch, archive batch, launch-date batch, record-growth batch, Figure YLDS amendment, Market Access change, public route family, or material UI work is authorized automatically\.', '''## 19. Review gate\n\nPR #512 is complete and production-verified. The repository is at:\n\n```text\nREVIEW GATE\n```\n\nNo later terminal-date batch, archive batch, launch-date batch, record-growth batch, Figure YLDS amendment, Market Access change, public route family, or material UI work is authorized automatically. Only a later separate reviewed decision may authorize another work item.''', governance, count=1, flags=re.S)
write('docs/spec-governance.md', governance)

validator = f"""import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => {{ if (!condition) failures.push(message); }};
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const review = readJson('data/editorial-research/terminal-date-boundary-review-batch-2-pr512-source-review.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();
const productionCommit = '{PRODUCTION_COMMIT}';
const productionHash = '{PRODUCTION_HASH}';
expect(review.status === 'reviewed_bounded_no_canonical_date_change', 'PR #512 review status changed');
expect(review.target_count === 2 && review.exact_terminal_day_resolved_count === 0 && review.reviewed_null_preserved_count === 2, 'PR #512 outcomes changed');
expect(review.canonical_evidence_added_count === 0 && review.canonical_evidence_relation_added_count === 0, 'Evidence boundary changed');
expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'archive partition changed');
expect(agents.includes('Current production checkpoint: ' + productionCommit), 'AGENTS production commit missing');
expect(agents.includes('PR #512 Terminal Date Boundary Review — Batch 2: complete and production-verified'), 'AGENTS completion missing');
expect(agents.includes('Current repository authority: REVIEW GATE'), 'AGENTS review gate missing');
expect(roadmap.includes('Status: PR #512 complete and production-verified; REVIEW GATE'), 'roadmap status missing');
expect(roadmap.includes('Current production checkpoint: ' + productionCommit), 'roadmap production commit missing');
expect(governance.includes('REVIEW GATE — PR #512 complete and production-verified'), 'governance state missing');
expect(governance.includes('production commit: ' + productionCommit), 'governance production commit missing');
expect(governance.includes('production canonical hash: ' + productionHash), 'governance production hash missing');
expect(governance.includes('No work beyond this checkpoint is pre-authorized.'), 'governance stop boundary missing');
expect(active === \"import './validate-post-pr512-authority-sync-pr513.mjs';\", 'active workstream is not wired to PR #513');
for (const temp of ['.github/workflows/pr513-authority-sync-finalize.yml', 'scripts/finalize-post-pr512-authority-sync.py']) expect(!fs.existsSync(path.join(root, temp)), `temporary file remains: ${{temp}}`);
if (failures.length) {{ console.error('PR #513 authority sync failed:'); failures.forEach((f) => console.error('- ' + f)); process.exit(1); }}
console.log(JSON.stringify({{ok:true, production_commit:productionCommit, production_hash:productionHash, exact_terminal_day_resolved:0, reviewed_null_preserved:2, canonical_counts_preserved:true, legacy_redirect_changes:0, current_boundary:'REVIEW_GATE'}}, null, 2));
"""
write('scripts/validate-post-pr512-authority-sync-pr513.mjs', validator)
write('scripts/validate-active-workstream.mjs', "import './validate-post-pr512-authority-sync-pr513.mjs';\n")
for temp in ['.github/workflows/pr513-authority-sync-finalize.yml', 'scripts/finalize-post-pr512-authority-sync.py']:
    p = ROOT / temp
    if p.exists(): p.unlink()
