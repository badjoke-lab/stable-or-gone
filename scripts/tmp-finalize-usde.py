# Temporary canonical/event/detail patch for launch-date Batch N.
import json
from pathlib import Path


def load(path):
    return json.loads(Path(path).read_text())


def save(path, rows):
    Path(path).write_text(json.dumps(rows, indent=2, ensure_ascii=False) + '\n')

coins = load('data/stablecoins.json')
coin = next(x for x in coins if x['id'] == 'sog_st_usde')
coin['launch_date'] = '2024-02-19'
coin['notes'] = 'Seed record, strengthened in launch-date Batch N from Ethena Labs official public-launch material.'
save('data/stablecoins.json', coins)

events = load('data/events-pr038.json')
event = next(x for x in events if x['id'] == 'sog_ev_usde_launch_context')
event.update({
    'event_type': 'launch',
    'event_date': '2024-02-19',
    'title': 'Ethena USDe launches publicly',
    'description': 'Ethena Labs marked 19 February 2024 as USDe’s official public launch.',
    'event_status_effect': 'active',
    'failure_mechanism': 'product_launch',
    'confidence': 'high',
    'source_count': 2,
    'notes': 'Official public-launch evidence replaces the earlier approximate 2024-02-01 context date.'
})
save('data/events-pr038.json', events)

details = load('data/event-details-v2.json')
detail = next(x for x in details if x['id'] == 'sog_ev_usde_launch_context')
detail.pop('migration_detail', None)
detail.update({
    'evidence_ids': ['sog_src_usde_public_launch_2024', 'sog_src_usde_ethena_lifecycle_event'],
    'event_detail_kind': 'launch',
    'launch_detail': {'summary': 'USDe official public launch on 2024-02-19.', 'status': 'active'}
})
save('data/event-details-v2.json', details)
