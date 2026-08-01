#!/usr/bin/env python3
"""Fetch exact-source Wayback captures and preserve payload-level review material for PR #506."""

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
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "config/evidence-archive-payload-verification-batch-1.json"
OUTPUT_PATH = ROOT / "data/editorial-research/evidence-archive-payload-verification-batch-1-pr506-probe.json"
PAYLOAD_ROOT = ROOT / ".tmp/pr506-wayback-payloads"
USER_AGENT = "StableOrGoneArchiveReview/1.0 (+https://www.stableorgone.com)"

KEYWORDS: dict[str, list[str]] = {
    "sog_src_rai_integrations_batch_b": ["rai", "integrations", "partners", "token address"],
    "sog_src_rai_oracle_relayer_batch_b": ["oracle relayer", "redemption price", "redemption rate"],
    "sog_src_rai_ungovernance_batch_b": ["governance minimization", "ungovernance", "governance"],
    "sog_src_rlusd_docs": ["rlusd", "stablecoin", "developer", "integration"],
    "sog_src_rlusd_launch_2024": ["ripple usd", "rlusd", "december 17", "launches globally"],
    "sog_src_rlusd_ripple_page": ["ripple usd", "rlusd", "fully backed", "redeemable"],
    "sog_src_spot_about_batch_b": ["spot", "perpetual note", "ampl"],
    "sog_src_spot_mint_batch_b": ["mint spot", "spot", "button", "tranche"],
    "sog_src_spot_site_batch_b": ["spot", "ampleforth", "protocol"],
    "sog_src_spot_v2_rollout_batch_b": ["spot v2", "signal vote", "upgrade", "migration"],
}


def request_bytes(url: str, timeout: int = 45) -> tuple[int, str, str, bytes]:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.8",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return (
                int(response.status),
                response.geturl(),
                response.headers.get("Content-Type", ""),
                response.read(),
            )
    except urllib.error.HTTPError as exc:
        body = exc.read() if exc.fp else b""
        return int(exc.code), exc.geturl(), exc.headers.get("Content-Type", ""), body


def html_to_text(payload: bytes) -> str:
    text = payload.decode("utf-8", errors="replace")
    text = re.sub(r"(?is)<script\b[^>]*>.*?</script>", " ", text)
    text = re.sub(r"(?is)<style\b[^>]*>.*?</style>", " ", text)
    text = re.sub(r"(?is)<noscript\b[^>]*>.*?</noscript>", " ", text)
    text = re.sub(r"(?is)<!--.*?-->", " ", text)
    text = re.sub(r"(?is)<[^>]+>", " ", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def excerpts(text: str, terms: list[str], radius: int = 220) -> list[dict[str, str]]:
    lower = text.lower()
    found: list[dict[str, str]] = []
    for term in terms:
        idx = lower.find(term.lower())
        if idx < 0:
            continue
        start = max(0, idx - radius)
        end = min(len(text), idx + len(term) + radius)
        found.append({"term": term, "excerpt": text[start:end]})
    return found


def iter_evidence_rows() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for path in sorted((ROOT / "data").glob("evidence*.json")):
        try:
            value = json.loads(path.read_text())
        except Exception:
            continue
        candidates = value if isinstance(value, list) else value.get("records", []) if isinstance(value, dict) else []
        if not isinstance(candidates, list):
            continue
        for row in candidates:
            if isinstance(row, dict) and isinstance(row.get("id"), str) and isinstance(row.get("url"), str):
                row = dict(row)
                row["_source_file"] = str(path.relative_to(ROOT))
                rows.append(row)
    return rows


def cdx_captures(source_url: str) -> tuple[str, list[dict[str, str]], str | None]:
    params = urllib.parse.urlencode(
        {
            "url": source_url,
            "matchType": "exact",
            "output": "json",
            "filter": ["statuscode:200", "mimetype:text/html"],
            "fl": "timestamp,original,statuscode,mimetype,digest",
            "collapse": "digest",
            "limit": "40",
        },
        doseq=True,
    )
    cdx_url = f"https://web.archive.org/cdx/search/cdx?{params}"
    status, final_url, content_type, body = request_bytes(cdx_url)
    if status != 200:
        return cdx_url, [], f"HTTP {status} from {final_url} ({content_type})"
    try:
        data = json.loads(body)
    except Exception as exc:
        return cdx_url, [], f"invalid CDX JSON: {exc}"
    if not isinstance(data, list) or not data:
        return cdx_url, [], None
    header = data[0]
    captures = [dict(zip(header, row)) for row in data[1:] if isinstance(row, list)]
    return cdx_url, captures, None


def select_captures(captures: list[dict[str, str]], maximum: int = 8) -> list[dict[str, str]]:
    if len(captures) <= maximum:
        return captures
    indexes = sorted({0, 1, 2, len(captures) // 2 - 1, len(captures) // 2, len(captures) - 3, len(captures) - 2, len(captures) - 1})
    return [captures[index] for index in indexes if 0 <= index < len(captures)]


def main() -> None:
    config = json.loads(CONFIG_PATH.read_text())
    targets: list[str] = config["target_evidence_ids"]
    rows = iter_evidence_rows()
    by_id: dict[str, dict[str, Any]] = {}
    for row in rows:
        if row["id"] in targets and row["id"] not in by_id:
            by_id[row["id"]] = row

    missing = [target for target in targets if target not in by_id]
    if missing:
        raise SystemExit(f"Missing target Evidence rows: {missing}")

    PAYLOAD_ROOT.mkdir(parents=True, exist_ok=True)
    review_rows: list[dict[str, Any]] = []

    for index, target in enumerate(targets, start=1):
        row = by_id[target]
        source_url = row["url"]
        terms = KEYWORDS[target]
        cdx_url, captures, cdx_error = cdx_captures(source_url)
        selected = select_captures(captures)
        capture_reviews: list[dict[str, Any]] = []

        for capture in selected:
            timestamp = capture["timestamp"]
            exact_archive_url = f"https://web.archive.org/web/{timestamp}/{source_url}"
            raw_archive_url = f"https://web.archive.org/web/{timestamp}id_/{source_url}"
            status, final_url, content_type, payload = request_bytes(raw_archive_url, timeout=60)
            if status != 200 or not payload:
                status, final_url, content_type, payload = request_bytes(exact_archive_url, timeout=60)
            text = html_to_text(payload) if payload else ""
            hit_rows = excerpts(text, terms)
            payload_dir = PAYLOAD_ROOT / target
            payload_dir.mkdir(parents=True, exist_ok=True)
            suffix = ".html" if "html" in content_type.lower() else ".bin"
            payload_file = payload_dir / f"{timestamp}{suffix}"
            payload_file.write_bytes(payload)
            (payload_dir / f"{timestamp}.txt").write_text(text[:200000])
            capture_reviews.append(
                {
                    "timestamp": timestamp,
                    "cdx_original": capture.get("original"),
                    "cdx_digest": capture.get("digest"),
                    "exact_archive_url": exact_archive_url,
                    "raw_archive_url": raw_archive_url,
                    "fetch_status": status,
                    "fetch_final_url": final_url,
                    "content_type": content_type,
                    "payload_bytes": len(payload),
                    "payload_sha256": hashlib.sha256(payload).hexdigest() if payload else None,
                    "text_characters": len(text),
                    "keyword_hits": [item["term"] for item in hit_rows],
                    "keyword_excerpts": hit_rows,
                    "text_prefix": text[:1200],
                    "payload_file": str(payload_file.relative_to(ROOT)),
                }
            )
            time.sleep(1.25)

        review_rows.append(
            {
                "evidence_id": target,
                "source_file": row["_source_file"],
                "title": row.get("title"),
                "canonical_source_url": source_url,
                "claim_scope": row.get("claim_scope"),
                "claim_scopes": row.get("claim_scopes"),
                "notes": row.get("notes"),
                "current_archived_url": row.get("archived_url"),
                "review_keywords": terms,
                "cdx_query_url": cdx_url,
                "cdx_error": cdx_error,
                "cdx_exact_200_html_capture_count": len(captures),
                "selected_capture_count": len(selected),
                "capture_reviews": capture_reviews,
                "probe_disposition": "manual_payload_review_required",
            }
        )
        print(f"[{index}/{len(targets)}] {target}: CDX={len(captures)} selected={len(selected)}")
        time.sleep(1.5)

    output = {
        "schema_version": "1.0",
        "probe_id": "sog_evidence_archive_payload_verification_batch_1_pr506_probe_2026_08_01",
        "status": "private_probe_requires_manual_review",
        "public_output": False,
        "authority_pr": 505,
        "implementation_pr": 506,
        "generated_at": "2026-08-01",
        "target_count": len(targets),
        "target_evidence_ids": targets,
        "acceptance_boundary": {
            "exact_canonical_source_url": True,
            "wayback_http_status_200": True,
            "dated_snapshot_url": True,
            "archived_payload_independently_fetched": True,
            "claim_scope_preserved_in_payload": True,
            "redirect_only_or_cdx_metadata_only_insufficient": True,
        },
        "results": review_rows,
    }
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {OUTPUT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
