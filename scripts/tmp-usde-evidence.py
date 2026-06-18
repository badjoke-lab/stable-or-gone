import json
from pathlib import Path

path = Path('data/evidence-events-pr038.json')
rows = json.loads(path.read_text())
source_id = 'sog_src_usde_public_launch_2024'
if not any(row['id'] == source_id for row in rows):
    rows.append({
        'id': source_id,
        'stablecoin_id': 'sog_st_usde',
        'issuer_id': 'sog_issuer_ethena_labs',
        'event_id': 'sog_ev_usde_launch_context',
        'source_type': 'official_statement',
        'title': 'Ethena Shard Campaign: Epoch 1',
        'url': 'https://mirror.xyz/0xF99d0E4E3435cc9C9868D1C6274DfaB3e2721341/lJHZjwoyS7k2UqfrMeOItH_JqRlmk3yJ8_SkrISGpmA',
        'publisher': 'Ethena Labs',
        'published_at': '2024-02-19',
        'accessed_at': '2026-06-18',
        'reliability': 'high',
        'claim_scope': 'official_public_launch_date',
        'notes': 'Signed Ethena Labs publication states that 2024-02-19 marked USDe’s official launch to the public.'
    })
path.write_text(json.dumps(rows, indent=2, ensure_ascii=False) + '\n')

Path('docs/audits/usde-launch-date-review.md').write_text(
    '# USDe launch-date review\n\n'
    'The canonical USDe launch date is `2024-02-19`.\n\n'
    'Evidence: `sog_src_usde_public_launch_2024`, a signed Ethena Labs publication stating that the date marked USDe’s official public launch.\n\n'
    'The former `2024-02-01` event date was an approximate low-confidence context date and is replaced.\n'
)
