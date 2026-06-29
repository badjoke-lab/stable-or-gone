# Stable or Gone baseline-aware change detection

Status: canonical specification  
Updated: 2026-06-29  
Roadmap item: PR #235

## Purpose

PR #235 changes official-source monitoring from recurring keyword detection to baseline-aware review candidate generation.

The monitor now answers two separate questions:

```text
1. Did the normalized official-source response differ from the accepted baseline?
2. Does the current response contain an allowlisted signal relevant to SOG review?
```

A private candidate is created only when both conditions justify review. A difference is not proof that any stablecoin fact changed.

## Inputs

The monitor reads:

```text
scripts/monitoring/sources/official-sources.json
scripts/monitoring/baselines/official-source-baselines.json
```

The enabled source set and baseline source set must match exactly for a normal full run. Deterministic fixture runs may use an explicit source subset with the matching baseline subset.

Monitoring remains read-only. The observation run cannot update, accept, or replace a baseline.

## Observation digests

Every successful response records:

```text
body_sha256
normalized_content_sha256
```

`body_sha256` identifies the exact fetched bytes. `normalized_content_sha256` identifies the normalized text used for the PR #235 comparison.

The normalized text itself is not stored. Raw bodies, normalized bodies, HTML fragments, and page text remain prohibited in monitoring artifacts.

PR #235 reuses the existing conservative normalization behavior: script and style elements, HTML tags, and whitespace-only differences are removed before hashing. Broader noise suppression and source-specific exception governance remain assigned to PR #238.

## Comparison states

Every observation includes `baseline_comparison` with one of:

```text
new_source
unchanged
content_changed
fetch_failed
```

### new_source

Used when the baseline is `pending_initial_acceptance` or absent from an explicit fixture set.

A `new_source` observation may create a private candidate when allowlisted signal keywords are present. The candidate asks a human reviewer to inspect and decide whether an initial baseline should later be accepted. The monitoring run does not accept it automatically.

### unchanged

Used when an accepted baseline and the current observation have the same `normalized_content_sha256`.

An unchanged source must create zero candidates even when standing page language still contains reserve, assurance, redemption, backing, or other configured keywords.

An exact byte digest may differ while normalized content remains unchanged. PR #235 preserves that fact in comparison metadata but does not classify it as a material content change.

### content_changed

Used when an accepted baseline and current observation have different normalized-content digests.

A `content_changed` observation creates a private candidate only when the current normalized text also matches at least one configured signal type. The candidate remains:

```text
status: needs_human_review
canonical_action: none
```

The state means only that the monitored normalized response changed. It does not establish what changed, when it became effective, whether it is material, or which canonical record should change.

### fetch_failed

Used for network errors, rejected redirects, size-limit failures, and non-success HTTP responses.

A fetch failure creates zero content-change candidates. It remains an operational observation and must not be represented as a reserve, redemption, issuer, regulatory, migration, or lifecycle change.

## Comparison metadata

`baseline_comparison` records:

```text
state
baseline_status
baseline_body_sha256
baseline_normalized_content_sha256
observed_body_sha256
observed_normalized_content_sha256
exact_body_changed
normalized_content_changed
accepted_observed_at
accepted_repository_commit
accepted_review_reference
```

For `new_source` and `fetch_failed`, change booleans may be `null` because no accepted successful comparison exists.

## Candidate rule

A candidate is emitted only when:

```text
fetch_status == ok
AND matched_signal_types is not empty
AND baseline_comparison.state is new_source or content_changed
```

Therefore:

```text
unchanged + keyword match      -> zero candidates
content_changed + signal match -> private candidate
content_changed + no signal    -> zero candidates
new_source + signal match      -> private candidate
fetch_failed                   -> zero candidates
```

Candidates add:

```text
change_state
baseline_comparison
```

Candidate IDs remain deterministic for identical source bytes and matched signal types.

## Aggregate counts

The official-source result, manifest, observation report, candidate report, and summary record:

```text
baseline_set_id
change_counts.unchanged
change_counts.content_changed
change_counts.new_source
change_counts.fetch_failed
```

The existing five-file and review-enabled nine-file output sets do not change.

## Review boundary

A private candidate is only an instruction to inspect the official source. Human review must still determine:

- whether the difference is material rather than presentation or recurring content;
- the effective date, report period, or publication date;
- whether the affected stablecoin and organization targets are correct;
- whether an existing canonical evidence or event record already covers it;
- whether to promote, hold, reject, or accept a new comparison baseline in a separate PR.

No candidate authorizes canonical data, public output, a baseline mutation, a pull request, or production publication.

## Deterministic validation

Offline fixtures must prove:

- pending baselines yield `new_source` review candidates;
- accepted baselines with identical normalized content yield `unchanged` and zero candidates;
- one materially changed fixture yields exactly one `content_changed` candidate;
- fetch failure yields `fetch_failed` and zero candidates;
- exact baseline and observed digests are retained without raw content;
- canonical files remain unchanged;
- existing PR #231 and PR #232 output contracts remain compatible.

## Deployment classification

```text
No production deployment required
```