import json
from pathlib import Path

path = Path('docs/migration/registry-v2-baseline.json')
data = json.loads(path.read_text())
additions = {
    'events': ['data/events-date-batch-o.json'],
    'event_details': ['data/event-details-date-batch-o-a.json', 'data/event-details-date-batch-o-b.json'],
    'evidence': ['data/evidence-date-batch-o-a.json', 'data/evidence-date-batch-o-b.json', 'data/evidence-date-batch-o-c.json'],
    'evidence_relations': ['data/evidence-date-batch-o-a.json', 'data/evidence-date-batch-o-b.json', 'data/evidence-date-batch-o-c.json']
}
for group, names in additions.items():
    for name in names:
        if name not in data['data_groups'][group]:
            data['data_groups'][group].append(name)
data['source_commit'] = 'date-batch-o'
path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
