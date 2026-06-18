import json
from pathlib import Path

updates = {
    'data/stablecoins.json': {'sog_st_crvusd': '2023-05-14'},
    'data/stablecoins-batch-j.json': {
        'sog_st_eurcv': '2023-04-20',
        'sog_st_euri': '2024-08-26',
        'sog_st_eurq': '2024-11-18'
    },
    'data/stablecoins-batch-h.json': {'sog_st_usdy': '2023-09-07'}
}
for file_name, values in updates.items():
    path = Path(file_name)
    rows = json.loads(path.read_text())
    for row in rows:
        if row.get('id') in values:
            row['launch_date'] = values[row['id']]
            row['notes'] = ((row.get('notes') or '').rstrip() + ' Batch O date verified from first-party evidence.').strip()
    path.write_text(json.dumps(rows, indent=2, ensure_ascii=False) + '\n')
