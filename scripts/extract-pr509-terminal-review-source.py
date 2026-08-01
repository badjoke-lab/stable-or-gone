#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'data/editorial-research/terminal-date-boundary-review-batch-1-pr509-extraction.json'
TARGETS = ['sog_st_fei', 'sog_st_nearusn', 'sog_st_esd']
ID_PATTERN = re.compile(r'\b(?:sog|SOG)_[A-Za-z0-9_:-]+\b')
TEXT_TERMS = {
    'sog_st_fei': ['FEI', 'Fei Protocol', 'Tribe DAO', 'final redemption', 'TIP-121'],
    'sog_st_nearusn': ['NEAR USN', 'USN', 'Protection Programme', 'Decentral Bank'],
    'sog_st_esd': ['Empty Set Dollar', 'ESD', 'V1', 'V2 migration'],
}


def walk_objects(value: Any, path: str = '$'):
    if isinstance(value, dict):
        yield path, value
        for key, child in value.items():
            yield from walk_objects(child, f'{path}.{key}')
    elif isinstance(value, list):
        for index, child in enumerate(value):
            yield from walk_objects(child, f'{path}[{index}]')


def collect_ids(value: Any) -> set[str]:
    ids: set[str] = set()
    if isinstance(value, str):
        ids.update(ID_PATTERN.findall(value))
    elif isinstance(value, dict):
        for child in value.values():
            ids.update(collect_ids(child))
    elif isinstance(value, list):
        for child in value:
            ids.update(collect_ids(child))
    return ids


def contains_any(value: Any, needles: set[str]) -> bool:
    if isinstance(value, str):
        return any(needle in value for needle in needles)
    if isinstance(value, dict):
        return any(contains_any(child, needles) for child in value.values())
    if isinstance(value, list):
        return any(contains_any(child, needles) for child in value)
    return False


def load_json_records():
    records = []
    for base in ['data', 'docs', 'config']:
        for file in sorted((ROOT / base).rglob('*.json')):
            try:
                value = json.loads(file.read_text())
            except Exception:
                continue
            for json_path, obj in walk_objects(value):
                records.append({
                    'file': str(file.relative_to(ROOT)),
                    'json_path': json_path,
                    'row': obj,
                    'ids': sorted(collect_ids(obj)),
                })
    return records


def text_snippets():
    snippets = []
    allowed = {'.md', '.mjs', '.js', '.ts', '.tsx', '.astro', '.yml', '.yaml', '.txt'}
    skip_parts = {'.git', 'node_modules', 'dist', '.astro'}
    for file in sorted(ROOT.rglob('*')):
        if not file.is_file() or file.suffix.lower() not in allowed:
            continue
        if any(part in skip_parts for part in file.parts):
            continue
        try:
            lines = file.read_text(errors='replace').splitlines()
        except Exception:
            continue
        for line_number, line in enumerate(lines, start=1):
            lower = line.lower()
            matched_targets = []
            matched_terms = []
            for target, terms in TEXT_TERMS.items():
                hits = [term for term in terms if term.lower() in lower]
                if target.lower() in lower or hits:
                    matched_targets.append(target)
                    matched_terms.extend(hits)
            if not matched_targets:
                continue
            snippets.append({
                'file': str(file.relative_to(ROOT)),
                'line': line_number,
                'targets': sorted(set(matched_targets)),
                'terms': sorted(set(matched_terms)),
                'text': line[:1200],
            })
    return snippets


def main() -> None:
    records = load_json_records()
    target_set = set(TARGETS)
    direct = [record for record in records if contains_any(record['row'], target_set)]

    referenced_ids = set(TARGETS)
    for record in direct:
        referenced_ids.update(record['ids'])

    related = []
    for record in records:
        if record in direct:
            continue
        row_ids = set(record['ids'])
        shared = sorted(row_ids & referenced_ids)
        if not shared:
            continue
        related.append({**record, 'shared_ids': shared})

    # Bound duplicate nested objects while retaining file/path provenance.
    seen = set()
    bounded_direct = []
    for record in direct:
        key = (record['file'], json.dumps(record['row'], sort_keys=True, ensure_ascii=False))
        if key in seen:
            continue
        seen.add(key)
        bounded_direct.append(record)

    seen_related = set()
    bounded_related = []
    for record in related:
        key = (record['file'], json.dumps(record['row'], sort_keys=True, ensure_ascii=False))
        if key in seen_related:
            continue
        seen_related.add(key)
        bounded_related.append(record)

    output = {
        'schema_version': '1.0',
        'extraction_id': 'sog_terminal_date_boundary_review_batch_1_pr509_extraction_2026_08_01',
        'status': 'private_source_extraction_requires_manual_review',
        'public_output': False,
        'authority_pr': 508,
        'implementation_pr': 509,
        'generated_at': '2026-08-01',
        'targets': TARGETS,
        'direct_record_count': len(bounded_direct),
        'related_record_count': len(bounded_related),
        'referenced_ids': sorted(referenced_ids),
        'direct_records': bounded_direct,
        'related_records': bounded_related,
        'text_snippets': text_snippets(),
        'boundary_note': 'Extraction is private review material only. It does not establish a terminal day or authorize canonical change.',
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(output, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({
        'ok': True,
        'targets': TARGETS,
        'direct_record_count': len(bounded_direct),
        'related_record_count': len(bounded_related),
        'referenced_id_count': len(referenced_ids),
        'text_snippet_count': len(output['text_snippets']),
        'output': str(OUTPUT.relative_to(ROOT)),
    }, indent=2))


if __name__ == '__main__':
    main()
