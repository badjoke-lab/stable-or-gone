# SOG Comparison Readiness Audit — PR #337

Status: canonical implementation specification  
Updated: 2026-07-09  
Contract: `data/quality/comparison-readiness-contract-v1.json`  
Checkpoint: `sog_controlled_growth_110_checkpoint_pr335_2026_07_09`

## 1. Purpose

PR #337 applies the PR #336 Comparison Readiness contract to all 110 canonical stable assets.

The audit produces:

- one reviewed deterministic audit artifact;
- one categorical overall readiness state per asset;
- nineteen dimension-level states per asset;
- dimension-level summary counts;
- a normalization queue for PR #338;
- no numeric score and no ranking.

## 2. Canonical input boundary

The audit reads only the source families allowed by the PR #336 contract:

```text
stable assets
organizations
relationships
classifications
reserve/redemption profiles
reserve reports
legal profiles
reserve components
deployments
events and event details
evidence and evidence relations
known unknowns
regulatory notes
stable-asset relationships
income profiles
current canonical checkpoint
launch-date unresolved queue
```

Candidate, monitoring, news-discovery, editorial, private, and live-market inputs are excluded.

## 3. Per-dimension method

### Identity consistency

- missing canonical identity fields or duplicate identity references -> `integrity_blocked`;
- explicit unresolved symbol/alias state -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Issuer/asset boundary

- no organization relationship or broken organization reference -> `integrity_blocked`;
- relationship exists but role is unresolved -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Lifecycle semantics

- missing classification or invalid lifecycle field -> `integrity_blocked`;
- lifecycle `unknown` -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Reference target and currency

- missing peg-reference structure -> `needs_normalization`;
- explicit unknown reference -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Asset class

- missing asset class -> `needs_normalization`;
- explicit unknown -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Backing model

- missing backing-type array -> `needs_normalization`;
- explicit unknown or unclear backing -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Stabilization mechanism

- missing mechanism -> `needs_normalization`;
- explicit unknown -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Reserve disclosure

- missing reserve profile -> `integrity_blocked`;
- invalid latest-report reference -> `integrity_blocked`;
- unresolved disclosure state -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Reserve report date semantics

- no reserve report row -> `ready_with_unknowns`;
- invalid date format or contradictory report-date structure -> `needs_normalization`;
- report row without day-level date remains `ready_with_unknowns`;
- otherwise -> `ready`.

### Issuance comparability

- missing issuance status -> `needs_normalization`;
- explicit unknown/source-review-needed -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Redemption comparability

- missing redemption profile or status -> `integrity_blocked`;
- unknown/source-review-needed eligibility or state -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Legal classification

- missing legal profile -> `integrity_blocked`;
- broken evidence reference -> `integrity_blocked`;
- unresolved legal fields or empty jurisdiction-scoped classification inventory -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Regulatory-action scope

- broken referenced asset/organization -> `integrity_blocked`;
- no canonical regulatory-note row -> `ready_with_unknowns`, never a negative claim;
- otherwise -> `ready`.

### Market-access applicability

Every asset receives:

```text
state: ready_with_unknowns
readiness_scored: false
reason_code: deferred_canonical_schema
```

No monitoring or editorial access research is read.

### Launch-date semantics

- canonical date present and valid -> `ready`;
- null date with queue record -> `ready_with_unknowns`;
- null date without queue record -> `needs_normalization`;
- invalid date -> `integrity_blocked`.

### Verification-date semantics

- canonical review/verification date present and valid -> `ready`;
- missing review metadata -> `needs_normalization`;
- invalid date -> `integrity_blocked`.

### Unknown-state semantics

- unresolved comparison-critical state is explicit and traceable -> `ready_with_unknowns`;
- no unresolved critical state -> `ready`;
- hidden or untracked unresolved state -> `needs_normalization`.

### Evidence scope and relation depth

- no evidence for asset -> `integrity_blocked`;
- broken evidence reference -> `integrity_blocked`;
- one evidence row only -> `ready_with_unknowns`;
- otherwise -> `ready`.

### Known-unknown visibility

- canonical known-unknown rows exist -> `ready_with_unknowns`;
- none exist -> `ready`;
- broken asset reference -> `integrity_blocked`.

## 4. Asset-level categorical state

The audit may produce one categorical `overall_state` for operational triage. It is not a score.

Precedence:

```text
integrity_blocked
> needs_normalization
> ready_with_unknowns
> ready
```

The overall state does not hide the nineteen dimension states and is not exposed as a public ranking.

## 5. Normalization queue

The queue contains only dimensions in:

```text
needs_normalization
integrity_blocked
```

Each queue row must include:

```text
asset_id
dimension_id
state
severity
reason_code
```

PR #338 may use this queue to organize reviewed normalization work. Queue order is deterministic by state precedence, asset ID, then dimension ID.

## 6. Determinism

The builder must:

- sort assets by canonical ID;
- sort dimension results by contract order;
- sort findings deterministically;
- emit a canonical JSON shape;
- derive summary counts from per-asset rows;
- produce the same bytes for the same repository inputs.

The audit artifact must carry an input digest over:

- contract JSON;
- current checkpoint JSON;
- all canonical source files used by the audit;
- launch-date unresolved queue.

## 7. Validation

PR #337 validation must prove:

- checkpoint ID is exact;
- asset denominator is exactly 110;
- every canonical asset appears exactly once;
- every asset has exactly nineteen unique dimension results;
- every dimension ID is defined by the contract;
- every state is one of the four contract states;
- market access is unscored and deferred for all 110 assets;
- summary counts equal recomputed per-asset and per-dimension counts;
- normalization queue equals all blocked/normalization dimension rows exactly;
- no numeric score or ranking field exists;
- no excluded source family is referenced;
- artifact equals deterministic regeneration byte-for-byte.

## 8. Explicit non-goals

PR #337 does not:

- modify canonical stable-asset records;
- fill missing values;
- normalize records;
- create comparison projection output;
- implement `/compare/`;
- create Market Access Records;
- publish readiness results publicly;
- score safety, risk, transparency, or quality;
- rank or recommend assets.

## 9. Deployment classification

Internal reviewed audit artifact, deterministic builder, validator, and read-only CI workflow only. No public route, public API output, canonical data mutation, monitoring publication, or Cloudflare configuration change is authorized.
