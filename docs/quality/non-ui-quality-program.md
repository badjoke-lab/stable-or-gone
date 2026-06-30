# Stable or Gone non-UI quality program

Status: canonical implementation plan  
Updated: 2026-06-29  
Registry checkpoint: 92 canonical stable assets

## Purpose

This program advances SOG while detailed visual review is temporarily unavailable. It does not approve the current UI, pass Gate V2-F, or permit monitored findings to enter canonical data automatically. Gate V2-F is not a publication blocker for ordinary merged changes under `docs/deployment-policy.md`.

The UI implementation merged through PR #216 remains an intermediate repository state. Further visual corrections and the full all-route visual audit resume only when owner review is practical, but that paused review does not block automatic publication of ordinary merged changes.

PR #233 amends the earlier 92-record-only program. It authorizes a bounded non-UI continuation through material-change monitoring, monitored-source coverage, reviewed growth to 100, a 100-record integrity audit, and non-UI release preparation. The continuation stops before UI approval and publication.

## Required reading order

Before changing canonical data, evidence, workflows, monitoring, or quality documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. this plan
6. the relevant canonical data or monitoring specification
7. `docs/migration/registry-v3-baseline.json`
8. the queue, validator, fixture, and supporting audit named by the active PR

Relevant canonical specifications include:

```text
docs/stable-asset-scope.md
docs/classification-spec.md
docs/data-model-v3-spec.md
docs/stats-spec.md
docs/quality/monitoring-pipeline-spec.md
docs/quality/monitoring-official-source-spec.md
docs/quality/monitoring-official-source-schema.md
docs/quality/monitoring-review-material-spec.md
```

## Fixed operating rules

- Repository specifications remain the source of truth.
- Every non-trivial PR cites the exact queue, audit, schema, fixture, baseline, and validator it changes.
- Unknown values remain unknown unless reviewed evidence supports a canonical value.
- Month- or year-level evidence is not coerced into a day-level date.
- UI work must not clear quality queues through hiding, defaults, or relabeling.
- Candidate monitoring output never writes directly to canonical public data.
- Monitoring baselines are accepted only through a separate human-reviewed repository change.
- Monitoring executions remain read-only and do not update their own baseline.
- Normal pull requests do not wait for production, but merged ordinary changes publish automatically from `main`.
- Growth is allowed only through PR #246-#250 and only after candidate audit.
- No growth PR may contain more than two new stable assets.
- Production publication is governed by `docs/deployment-policy.md` and is not deferred by this quality sequence.

## Completed foundation

### PR #217-#225 — date, reserve, and evidence quality

The sequence aligned launch-date, terminal-date, relationship-end, reserve-applicability, evidence-reliability, placeholder, source-identity, and evidence-relation queues with canonical data.

### PR #226-#229 — deployment quality

The sequence reviewed deployment canonicality, verification, and source status without treating chain presence as proof of issuer endorsement.

### PR #230-#232 — review-only monitoring pipeline

The implemented sequence is:

```text
official-source observation
-> private candidate record
-> duplicate and lineage checks
-> evidence draft
-> reviewable PR material
-> human approval before canonical publication
```

The workflow is manual-only, read-only, private-artifact-only, and prohibited from automatic branch, commit, pull-request, canonical-data, public-output, deployment, or publication actions.

## PR #233 — continuation amendment

PR #233:

- records that owner-led visual review is temporarily unavailable;
- keeps Gate V2-F pending and the UI program paused;
- authorizes PR #234-#263 as the bounded non-UI sequence;
- authorizes reviewed growth only after PR #246;
- keeps UI approval separate from publication while relying on the automatic main publication policy;
- preserves all current canonical records and generated public output.

Deployment classification:

```text
Automatic production deployment on main
```

## Phase A — material-change monitoring

### PR #234 — monitoring baseline specification

Define the accepted-baseline record for each official source. At minimum it must cover:

```text
source_id
canonical source URL
accepted final URL
body digest
normalized-content digest
content type
ETag when supplied
Last-Modified when supplied
accepted observation timestamp
accepted repository commit
baseline status
```

The specification must distinguish an accepted review baseline from a live observation. A baseline is not evidence that a canonical stablecoin fact is true; it is only the comparison point for later monitoring.

### PR #235 — baseline-aware material-change detection

Compare each live official-source observation with the accepted baseline. Required outcomes:

```text
unchanged
content_changed
metadata_changed
fetch_failed
new_source
```

An unchanged source must not create a monitoring candidate. `content_changed` remains a review prompt, not proof that a reserve, redemption, issuer, regulatory, migration, or lifecycle fact changed.

### PR #236 — human-approved baseline update flow

Create a deterministic command and validator for preparing baseline updates after human review. Monitoring execution must remain read-only and must never commit or replace its baseline.

A baseline update PR must state which observations were accepted, which were rejected, and why the new comparison point is safe.

### PR #237 — observation change classification

Separate material content changes, metadata-only changes, new sources, and operational failures. Candidate material must cite the exact classification and the prior/current digests used.

### PR #238 — content normalization and noise suppression

Normalize only demonstrably non-semantic page noise, such as unstable whitespace, script/style payloads, generated request identifiers, and approved volatile fragments. Raw source bodies remain prohibited.

Normalization rules must be source-independent unless a source-specific exception is documented, tested, and approved. Normalization must not erase dates, quantities, reserve composition, redemption terms, issuer identity, regulatory language, contract addresses, or lifecycle statements.

### PR #239 — deterministic monitoring audit and safety closure

Offline fixtures must prove:

- identical normalized content yields no candidate;
- material fixture change yields one private candidate;
- metadata-only change is classified separately;
- fetch failure does not masquerade as a content change;
- a new source requires review before baseline acceptance;
- canonical and public files remain unchanged;
- no automatic pull request or production behavior exists.

## Phase B — monitored-source coverage

### PR #240 — monitoring feasibility audit for all 92 assets

Classify every canonical stable asset as:

```text
automatable
partially_automatable
manual_only
no_official_source_identified
```

The audit must record available official source types, target organization, expected signal scope, access constraints, and reason for any manual-only classification.

### PR #241 — reserve and assurance sources

Add reviewed official reserve, transparency, assurance, attestation, or collateral-reporting sources where applicable. Algorithmic or otherwise non-applicable designs must not receive invented reserve sources.

### PR #242 — redemption and terms sources

Add reviewed official redemption, mint/redeem access, eligibility, fee, and terms sources. Standing descriptive language must not be interpreted as a change without baseline comparison.

### PR #243 — issuer, migration, and shutdown sources

Add reviewed official sources for issuer identity, contract replacement, token migration, issuance shutdown, redemption wind-down, and rebrand signals.

### PR #244 — regulatory-source monitoring boundary

Define when issuer-published regulatory material and regulator-published primary material may be monitored. Regulatory monitoring must remain distinct from issuer claims and must not convert press language into a canonical legal conclusion automatically.

### PR #245 — monitoring coverage report and validator

Publish a repository-internal coverage report for the 92 assets and validate that every monitored source has:

```text
official ownership
allowlisted HTTPS host
canonical stablecoin targets
canonical organization targets
signal scope
baseline state
review-only output
canonical_action: none
```

## Phase C — reviewed growth from 92 to 100

### PR #246 — final-eight candidate audit and selection

Audit candidates before promotion. Required checks:

```text
name, symbol, slug, domain, and alias duplication
issuer or protocol identity
launch boundary and precision
lifecycle status
reference target
backing or stabilization design
redemption design and access
reserve applicability
deployments and chain identity
events and historical significance
primary-source availability
existing-record lineage
```

The selected set must improve registry coverage without lowering evidence requirements or promoting a deployment, wrapped representation, alias, rebrand, or migration continuation as a separate asset incorrectly.

### PR #247-#250 — two assets per PR

```text
PR #247: 92 -> 94
PR #248: 94 -> 96
PR #249: 96 -> 98
PR #250: 98 -> 100
```

Each PR must add the stable assets and all applicable supporting records across organizations, relationships, classifications, profiles, events, event details, evidence, reserve context, known unknowns, deployments, legal profiles, reserve components, and income profiles.

A non-applicable group remains absent and is documented as non-applicable. Missing information remains explicit rather than inferred.

## Phase D — 100-record registry audit

```text
PR #251 ID, slug, alias, and symbol uniqueness
PR #252 organization, issuer, and relationship integrity
PR #253 evidence URL, source identity, and duplication integrity
PR #254 reserve, redemption, and backing applicability
PR #255 deployment, contract, and chain identity
PR #256 launch, terminal, migration, and relationship boundaries
PR #257 known-unknown and placeholder integrity
PR #258 monitoring coverage recalculation for 100 assets
```

The audit may resolve a value, preserve it as unknown, record that no official source is available, or record a bounded unresolved conflict. It must not reduce uncertainty by guessing.

## Phase E — non-UI release preparation

```text
PR #259 Registry v2/v3 and machine-readable parity
PR #260 counts, manifest, version, and provenance integrity
PR #261 reproducible build and generated-output audit
PR #262 100-record canonical data freeze
PR #263 non-UI release-candidate material
```

PR #263 may create:

```text
100-record count summary
change history
quality-audit result
known-unknown inventory
monitoring coverage summary
deployment checklist
rollback checklist
release-note draft
candidate commit reference
```

It must state visibly that UI review and Gate V2-F remain outstanding while production publication follows `docs/deployment-policy.md`.

## UI resumption gate

After PR #263, continuation stops. The deferred UI audit resumes only after the owner can inspect representative desktop and mobile pages. The roadmap then assigns separate correction PRs and a Gate V2-F decision.

Production publication is not blocked by this UI resumption gate. Ordinary merged changes publish automatically from `main`; owner all-route visual review, Gate V2-F corrections, and an explicit Gate V2-F pass remain UI-quality gates only.

## Deployment classification

All PRs in this program default to:

```text
Automatic production deployment on main
```

Emergency publication remains governed exclusively by `docs/deployment-policy.md`.