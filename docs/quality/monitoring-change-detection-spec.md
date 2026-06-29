# Stable or Gone baseline-aware change detection

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #235, amended by PR #237

## Purpose

PR #235 introduced baseline-aware review candidate generation. PR #237 separates metadata-only differences from normalized-content changes.

The monitor answers:

```text
1. Did normalized official-source content differ from the accepted baseline?
2. Did tracked response metadata differ while normalized content stayed the same?
3. Does the current response contain an allowlisted SOG review signal?
```

A difference is an operational review signal, not proof that a stablecoin fact changed.

## Inputs and write boundary

The monitor reads:

```text
scripts/monitoring/sources/official-sources.json
scripts/monitoring/baselines/official-source-baselines.json
```

Monitoring remains read-only. It cannot update or accept a baseline and cannot write canonical or public data.

## Digests

Every successful response records:

```text
body_sha256
normalized_content_sha256
```

Raw and normalized response text are not stored. `body_sha256` identifies exact fetched bytes. `normalized_content_sha256` identifies normalized text used for content comparison.

## Comparison states

Every observation uses one state:

```text
new_source
unchanged
metadata_changed
content_changed
fetch_failed
```

Detailed semantics are defined in `docs/quality/monitoring-observation-classification-spec.md`.

### new_source

Used when no accepted comparison point exists. A signal-bearing new source may create a private candidate, but the run cannot accept its own baseline.

### unchanged

Used when normalized content and tracked metadata match the accepted baseline.

An unchanged source must create zero candidates even when standing page language contains configured keywords.

### metadata_changed

Used when normalized content is identical but exact bytes, final URL, content type, ETag, or Last-Modified differs.

Metadata-only changes create zero content-change candidates. They remain visible in private observation output and aggregate counts.

### content_changed

Used when `normalized_content_sha256` differs from the accepted baseline.

A content change creates a private candidate only when the current normalized text also matches a configured signal. It does not establish what changed, whether it is material, or which canonical record should change.

### fetch_failed

Used when a successful observation is unavailable. A fetch failure creates zero content-change candidates.

## Candidate rule

A candidate is emitted only when:

```text
fetch_status == ok
AND matched_signal_types is not empty
AND baseline_comparison.state is new_source or content_changed
```

Therefore:

```text
unchanged + keyword match        -> zero candidates
metadata_changed + keyword match -> zero candidates
content_changed + signal match   -> private candidate
content_changed + no signal      -> zero candidates
new_source + signal match        -> private candidate
fetch_failed                     -> zero candidates
```

Candidates include:

```text
change_state
classification_reason
baseline_comparison
status: needs_human_review
canonical_action: none
```

No candidate authorizes canonical data, public output, a baseline mutation, a pull request, or production publication.

## Aggregate counts

Private reports record:

```text
change_counts.unchanged
change_counts.metadata_changed
change_counts.content_changed
change_counts.new_source
change_counts.fetch_failed
```

The sum must equal `observation_count`. Existing five-file and review-enabled nine-file output sets remain unchanged.

## Deterministic validation

Offline fixtures must prove:

- pending baselines yield `new_source` review candidates;
- exact accepted-baseline matches yield `unchanged` and zero candidates;
- metadata-only differences yield `metadata_changed` and zero candidates;
- normalized-content differences with signal matches yield `content_changed` candidates;
- content changes without signal matches yield no candidate;
- fetch failures yield `fetch_failed` and zero candidates;
- prior and current digests are retained without raw content;
- canonical files remain unchanged;
- PR #231 and PR #232 output contracts remain compatible.

## Deployment classification

```text
No production deployment required
```