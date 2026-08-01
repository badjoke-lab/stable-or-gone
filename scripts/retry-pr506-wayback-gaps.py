#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import html
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'data/editorial-research/evidence-archive-payload-verification-batch-1-pr506-gap-retry.json'
PAYLOADS = ROOT / '.tmp/pr506-wayback-gap-retry'
UA = 'StableOrGoneArchiveReview/1.0 (+https://www.stableorgone.com)'

TARGETS = {
    'sog_src_rai_ungovernance_batch_b': {
        'url': 'https://docs.reflexer.finance/ungovernance/governance-minimization-guide',
        'terms': ['governance minimization', 'ungovernance', 'stages', 'governance'],
    },
    'sog_src_rlusd_docs': {
        'url': 'https://docs.ripple.com/products/stablecoin',
        'terms': ['rlusd', 'stablecoin', 'developer', 'integration'],
    },
    'sog_src_rlusd_launch_2024': {
        'url': 'https://ripple.com/ripple-press/raising-the-standard-for-stablecoins-ripple-usd-launches-globally/',
        'terms': ['ripple usd', 'rlusd', 'december 17', 'launches globally'],
    },
    'sog_src_rlusd_ripple_page': {
        'url': 'https://ripple.com/solutions/stablecoin/',
        'terms': ['ripple usd', 'rlusd', 'fully backed', 'redeemable'],
    },
    'sog_src_spot_about_batch_b': {
        'url': 'https://docs.ampleforth.org/learn/about-spot',
        'terms': ['spot', 'perpetual note', 'ampl', 'collateral'],
    },
    'sog_src_spot_mint_batch_b': {
        'url': 'https://docs.ampleforth.org/how-to-guides/how-to-mint-spot',
        'terms': ['mint spot', 'redeem', 'button', 'tranche'],
    },
    'sog_src_spot_site_batch_b': {
        'url': 'https://www.ampleforth.org/',
        'terms': ['spot', 'ampleforth', 'protocol', 'perpetual'],
    },
    'sog_src_spot_v2_rollout_batch_b': {
        'url': 'https://forum.ampleforth.org/t/proposal-initiate-rollout-of-spot-v2/738',
        'terms': ['spot v2', 'signal vote', 'upgrade', 'migration'],
    },
}


def get(url: str, timeout: int = 15, attempts: int = 4) -> dict:
    errors = []
    for attempt in range(1, attempts + 1):
        request = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'text/html,application/json;q=0.9,*/*;q=0.8'})
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return {
                    'status': int(response.status),
                    'final_url': response.geturl(),
                    'content_type': response.headers.get('Content-Type', ''),
                    'body': response.read(),
                    'attempt': attempt,
                    'errors': errors,
                }
        except urllib.error.HTTPError as exc:
            body = exc.read() if exc.fp else b''
            errors.append(f'attempt {attempt}: HTTP {exc.code}')
            if exc.code not in (429, 500, 502, 503, 504):
                return {'status': int(exc.code), 'final_url': exc.geturl(), 'content_type': exc.headers.get('Content-Type', ''), 'body': body, 'attempt': attempt, 'errors': errors}
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            errors.append(f'attempt {attempt}: {exc}')
        time.sleep(min(10, attempt * 2.5))
    return {'status': 0, 'final_url': url, 'content_type': '', 'body': b'', 'attempt': attempts, 'errors': errors}


def text_from(body: bytes) -> str:
    value = body.decode('utf-8', errors='replace')
    value = re.sub(r'(?is)<script\b[^>]*>.*?</script>', ' ', value)
    value = re.sub(r'(?is)<style\b[^>]*>.*?</style>', ' ', value)
    value = re.sub(r'(?is)<[^>]+>', ' ', value)
    return re.sub(r'\s+', ' ', html.unescape(value)).strip()


def snippets(text: str, terms: list[str]) -> list[dict[str, str]]:
    lower = text.lower()
    output = []
    for term in terms:
        pos = lower.find(term.lower())
        if pos >= 0:
            output.append({'term': term, 'excerpt': text[max(0, pos - 260):min(len(text), pos + len(term) + 360)]})
    return output


def cdx(url: str) -> tuple[str, dict, list[dict]]:
    query = urllib.parse.urlencode({
        'url': url,
        'matchType': 'exact',
        'output': 'json',
        'filter': ['statuscode:200', 'mimetype:text/html'],
        'fl': 'timestamp,original,statuscode,mimetype,digest',
        'collapse': 'digest',
        'limit': '80',
    }, doseq=True)
    endpoint = 'https://web.archive.org/cdx/search/cdx?' + query
    response = get(endpoint, timeout=20, attempts=5)
    captures = []
    if response['status'] == 200:
        try:
            data = json.loads(response['body'])
            if data:
                header = data[0]
                captures = [dict(zip(header, row)) for row in data[1:]]
        except Exception as exc:
            response['errors'].append(f'JSON parse: {exc}')
    return endpoint, response, captures


def main() -> None:
    PAYLOADS.mkdir(parents=True, exist_ok=True)
    results = []
    for index, (evidence_id, item) in enumerate(TARGETS.items(), start=1):
        endpoint, cdx_response, captures = cdx(item['url'])
        chosen = []
        if captures:
            chosen = [captures[0]] if len(captures) == 1 else [captures[0], captures[-1]]
        reviews = []
        for capture in chosen:
            ts = capture['timestamp']
            exact = f"https://web.archive.org/web/{ts}/{item['url']}"
            raw = f"https://web.archive.org/web/{ts}id_/{item['url']}"
            response = get(raw, timeout=18, attempts=3)
            if response['status'] != 200 or not response['body']:
                response = get(exact, timeout=18, attempts=3)
            text = text_from(response['body']) if response['body'] else ''
            hit_rows = snippets(text, item['terms'])
            folder = PAYLOADS / evidence_id
            folder.mkdir(parents=True, exist_ok=True)
            (folder / f'{ts}.bin').write_bytes(response['body'])
            (folder / f'{ts}.txt').write_text(text[:250000])
            reviews.append({
                'timestamp': ts,
                'exact_archive_url': exact,
                'raw_archive_url': raw,
                'fetch_status': response['status'],
                'fetch_final_url': response['final_url'],
                'content_type': response['content_type'],
                'fetch_attempt': response['attempt'],
                'fetch_errors': response['errors'],
                'payload_bytes': len(response['body']),
                'payload_sha256': hashlib.sha256(response['body']).hexdigest() if response['body'] else None,
                'text_characters': len(text),
                'keyword_hits': [row['term'] for row in hit_rows],
                'keyword_excerpts': hit_rows,
                'text_prefix': text[:1500],
            })
            time.sleep(1.5)
        results.append({
            'evidence_id': evidence_id,
            'canonical_source_url': item['url'],
            'review_terms': item['terms'],
            'cdx_endpoint': endpoint,
            'cdx_status': cdx_response['status'],
            'cdx_attempt': cdx_response['attempt'],
            'cdx_errors': cdx_response['errors'],
            'cdx_capture_count': len(captures),
            'selected_capture_count': len(chosen),
            'capture_reviews': reviews,
        })
        print(f'[{index}/{len(TARGETS)}] {evidence_id}: cdx={cdx_response["status"]}/{len(captures)} payloads={len(reviews)}', flush=True)
        time.sleep(2.0)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({
        'schema_version': '1.0',
        'status': 'private_targeted_retry_requires_manual_review',
        'authority_pr': 505,
        'implementation_pr': 506,
        'generated_at': '2026-08-01',
        'target_count': len(TARGETS),
        'results': results,
    }, indent=2, ensure_ascii=False) + '\n')
    print(f'Wrote {OUTPUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
