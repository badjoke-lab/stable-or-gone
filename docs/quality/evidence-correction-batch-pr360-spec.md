# PR #360 Evidence and Correction Batch Specification

Status: active work-item specification  
Updated: 2026-07-14

## 1. Roadmap item

PR #360 — Evidence and Correction Batch.

PR #359 is complete and merged at:

```text
043faab38160d693fb226c2955e2b6062d56946f
```

Its reviewed handoff is:

```text
docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json
```

## 2. Purpose

PR #360 is a bounded quality-maintenance batch. It improves existing canonical records and Evidence without increasing asset count or creating a new public product surface.

Priority correction families are:

```text
broken-link repair
archive supplementation
official-source replacement
Evidence Relation correction
Evidence source-identity maintenance
record wording correction
date correction
organization-relationship correction
known-unknown resolution
```

## 3. Starting checkpoint

```text
canonical assets: 112
canonical Evidence: 557
Evidence Relations: 557
archive indexes recorded: 380
archive not recorded: 177
Market Access Records: 8
```

## 4. Bounded scope

PR #360 may touch no more than:

```text
10 canonical Evidence records
5 non-Evidence canonical records
```

The initial internal queue is selected deterministically from the current 557-record Evidence set. Queue order is maintenance priority followed by `evidence_id` ascending. Queue selection is not automatic canonical correction.

## 5. Evidence correction rules

An archive may be added only when the reviewed capture represents the same source identity and supports the same claim scope.

A replacement source must preserve or improve the supported claim. A current homepage must not replace a dated historical source merely because it is live.

URL cleanup must not merge different documents that happen to share a domain or similar title.

Evidence Relation corrections must preserve explicit stablecoin, organization, event, and claim-scope subjects. Public source-identity unions must continue to equal canonical relation unions.

## 6. Record correction rules

Wording corrections may remove overstatement, clarify historical/current scope, or distinguish issuer, operator, custodian, distributor, platform, and regulator roles.

Date corrections must preserve the strongest supported precision. Month-only or year-only evidence must not be converted into a day-level date.

Organization relationships may change only when reviewed Evidence supports the role and effective period.

A known unknown may be resolved only when reviewed Evidence directly supports the value. Otherwise it remains unresolved.

## 7. Required preservation

PR #360 must preserve:

```text
112 canonical assets
8 canonical Market Access Records
PR #353 historical planning snapshots
PR #354–#359 reviewed handoffs
Comparison Readiness semantics
Facet Freshness semantics
Timeline historical-date semantics
Update Feed publication-date semantics
canonical-only public output
no automatic monitoring or editorial-research promotion
no asset ranking
no composite score
```

## 8. Validation

The dedicated workflow must validate:

```text
reviewed PR #359 handoff
bounded queue and touched-record counts
canonical data
Evidence and Evidence Relation integrity
source-identity deduplication
archive-state count transition
organization and relationship integrity
lifecycle and date boundaries
Registry v2/v3 parity
release integrity
deterministic statistics and immutable history
Astro check and build
public-layer safety
```

A deterministic correction report must list each touched record, previous value, new value, reason, Evidence basis, and remaining uncertainty.

## 9. Exit criteria

PR #360 completes when:

1. the deterministic queue has been reviewed;
2. only evidence-supported corrections are committed;
3. unsupported candidates are recorded as reviewed with no change;
4. correction and impact reports are deterministic;
5. all validation and CI are green;
6. the post-PR review gate can evaluate the next bounded roadmap sequence.
