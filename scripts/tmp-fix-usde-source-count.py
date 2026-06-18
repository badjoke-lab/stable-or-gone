# Temporary audit-alignment patch for Batch N.
import json
from pathlib import Path

path = Path('data/events-pr038.json')
rows = json.loads(path.read_text())
event = next(row for row in rows if row['id'] == 'sog_ev_usde_launch_context')
event['source_count'] = 3
path.write_text(json.dumps(rows, indent=2, ensure_ascii=False) + '\n')
