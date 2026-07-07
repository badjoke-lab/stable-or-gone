# Stable or Gone 100-asset monitoring baseline synchronization specification

Status: canonical implementation specification — PR #321  
Updated: 2026-07-07

## 1. Purpose

PR #321 synchronizes the reviewed monitoring source/baseline configuration with the audited 100-asset registry checkpoint.

Synchronization means:

```text
100 canonical stable assets are represented in the coverage calculation
+ 94 canonical organizations are represented
+ 24 reviewed official-source rows are represented
+ 24 baseline rows exist with exact source-ID parity
+ every source-to-asset and source-to-organization reference resolves
+ every asset receives an explicit registered-source coverage state
+ current pending/accepted baseline state is recorded honestly
+ deterministic synchronization digests are fixed for review
```

PR #321 does not accept live baselines, fetch external pages, add monitoring sources, add platform-policy monitoring, add regulatory-register monitoring, expand market-access schema, schedule monitoring, write canonical data, or publish monitoring output.

## 2. Binding inputs

Synchronization derives from:

```text
docs/migration/audited-100-asset-canonical-checkpoint.json
scripts/monitoring/sources/official-sources.json
scripts/monitoring/baselines/official-source-baselines.json
scripts/monitoring/audits/build-coverage-report.mjs
```

The source allowlist and baseline set remain internal monitoring configuration. They are not canonical evidence and are not public machine-readable registry data.

## 3. Binding synchronization snapshot

The binding synchronization snapshot is:

```text
scripts/monitoring/baselines/monitoring-baseline-sync-100-assets.json
```

It records:

- audited checkpoint ID;
- normalization version;
- canonical asset, organization, and relationship counts;
- source and baseline counts;
- exact source/baseline ID parity;
- pending, accepted, and missing baseline counts;
- registered asset reach and uncovered asset count;
- covered organization count;
- accepted monitoring asset reach;
- source-family counts and asset-family reach;
- deterministic asset synchronization digest;
- deterministic organization synchronization digest;
- deterministic source/baseline synchronization digest;
- deterministic uncovered-asset queue digest;
- exact source allowlist file digest;
- exact baseline file digest;
- fixed read-only/private safety policy.

The snapshot is a synchronization contract. It is not a baseline acceptance record and is not canonical evidence.

## 4. Current reviewed boundary

PR #321 preserves the current reviewed monitoring boundary:

```text
canonical stable assets: 100
canonical organizations: 94
canonical relationships: 110
registered sources: 24
baseline rows: 24
registered asset reach: 16
uncovered assets: 84
covered organizations: 12
accepted sources: 0
accepted asset reach: 0
pending_initial_acceptance: 24
accepted baselines: 0
missing baselines: 0
```

Current source-family reach remains:

```text
reserve_assurance: 9 sources / 11 assets
redemption_terms: 6 sources / 7 assets
issuer_lifecycle: 5 sources / 5 assets
regulatory: 5 sources / 5 assets
```

These values describe registered review-only source reach. They are not completeness scores and do not imply accepted monitoring coverage.

## 5. Per-asset synchronization semantics

The generator must derive exactly one synchronization state for each canonical stable asset.

Each asset projection includes:

```text
stablecoin_id
source_ids
source_families
baseline_status_counts
coverage_class
accepted_monitoring_coverage
```

Allowed coverage classes remain:

```text
no_registered_source
single_family_coverage
multi_family_coverage
```

An uncovered asset is a valid explicit synchronization result. It must not be dropped from the projection or filled by inference.

`accepted_monitoring_coverage` remains false for all 100 assets in PR #321 because all 24 baseline rows remain pending initial acceptance.

## 6. Source/baseline synchronization semantics

For each enabled official source:

- exactly one baseline row must exist;
- source ID must match baseline source ID;
- baseline source URL must match the reviewed source configuration URL;
- baseline status remains `pending_initial_acceptance` unless a separate reviewed baseline-acceptance PR provides the required live observation provenance;
- every accepted-only field remains null while pending;
- no raw body, normalized text, HTML, cookie, credential, or private content may enter the baseline file.

PR #321 must not change a pending row to accepted.

## 7. Generator

The deterministic observation generator is:

```text
scripts/generate-monitoring-baseline-sync-100-assets.mjs
```

It derives current synchronization state from the audited checkpoint, current allowlist, current baseline set, and deterministic coverage report.

The generator performs no network access and writes only to an explicit artifact/output path.

## 8. Validator

The binding validator is:

```text
scripts/validate-monitoring-baseline-sync-100-assets.mjs
```

It regenerates current synchronization state and fails on:

- canonical checkpoint ID mismatch;
- canonical count mismatch;
- source count or baseline count mismatch;
- source/baseline ID parity failure;
- accepted baseline count above zero;
- accepted asset reach above zero;
- pending count other than 24;
- missing baseline count above zero;
- registered reach other than 16 assets;
- uncovered count other than 84 assets;
- covered organization count other than 12;
- source-family count drift;
- asset-family reach drift;
- asset synchronization digest drift;
- organization synchronization digest drift;
- source/baseline synchronization digest drift;
- uncovered queue digest drift;
- allowlist file digest drift;
- baseline file digest drift;
- unsafe monitoring policy values;
- network/public/canonical action authorization.

## 9. Configuration validator update

PR #321 updates the current monitoring configuration validator from the old lower-bound guard:

```text
canonical registry must not fall below 92 assets
```

to the exact audited synchronization boundary:

```text
canonical registry must contain 100 stable assets
```

Later controlled growth will require a deliberate synchronization/checkpoint update rather than silently inheriting the 100-asset synchronization snapshot.

## 10. Monitoring baseline specification correction

`docs/quality/monitoring-baseline-spec.md` must be aligned with current reality:

- 24 reviewed source rows exist;
- 24 baseline rows exist;
- all 24 remain pending initial acceptance;
- zero accepted baselines is an explicit reviewed state;
- PR #321 synchronizes configuration state to the 100-asset checkpoint without accepting live page digests.

## 11. Safety boundary

PR #321 preserves:

```text
human_review_required: true
monitoring_write_allowed: false
canonical_evidence: false
public_output: false
automatic_pull_request: false
production_publication: false
network_access_used: false
canonical_action: none
```

Monitoring execution may continue reading the baseline set but may not mutate or accept it.

## 12. Explicit non-goals

PR #321 does not:

- add monitoring sources;
- remove monitoring sources;
- accept any baseline;
- fetch live pages for acceptance;
- change normalization version;
- change signal taxonomy;
- add reserve/redemption source coverage;
- add lifecycle/regulatory source coverage;
- add platform-policy sources;
- add regulatory-register sources;
- add EU/EEA function-level market-access observation schema;
- schedule monitoring;
- create automatic branches or pull requests;
- write canonical data;
- edit guides automatically;
- publish monitoring output;
- change public machine-readable count surfaces.

Source expansion remains PR #322-#323. Scheduled read-only monitoring remains PR #324.

## 13. Completion condition

PR #321 is complete when:

```text
binding 100-asset synchronization snapshot exists
generator exists
validator exists
baseline specification reflects 24 pending rows
current monitoring configuration requires exactly 100 assets
source/baseline IDs match exactly
all 24 baselines remain pending
all accepted-only fields remain null
100 asset states are included in deterministic synchronization digest
registered reach remains 16 and uncovered queue remains 84
accepted coverage remains zero
CI runs synchronization validation
roadmap and authority show PR #321 active / PR #322 next
full CI and monitoring-related workflows are green
```
