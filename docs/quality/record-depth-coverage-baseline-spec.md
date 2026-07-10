# SOG Record Depth & Coverage Baseline specification

Status: canonical specification for PR #353  
Updated: 2026-07-10

## 1. Purpose

PR #353 measures reviewed record depth across the current 110 canonical stable assets so subsequent dossier deepening and Market Access work can be selected from evidence rather than intuition.

The baseline is an internal planning instrument.

It is not:

- a safety score;
- a risk score;
- a quality ranking;
- a transparency ranking;
- an investment recommendation;
- a public asset leaderboard.

## 2. Source boundary

The baseline may derive only from reviewed repository data and reviewed derived contracts.

Allowed sources include:

```text
canonical stable-asset records
canonical organization and relationship records
canonical classification records
canonical reserve/redemption profiles
canonical events
canonical evidence and evidence relations
canonical known unknowns
canonical deployments
canonical legal profiles
canonical regulatory notes
canonical reserve components
canonical income profiles
Comparison Readiness output
facet freshness output
canonical Market Access Records
reviewed Compare preset configuration for product-leverage membership only
```

Compare preset membership may influence Tier A planning selection because it identifies assets already used by an existing public research surface. It must not change any dimension state, canonical value, readiness state, or freshness state.

Forbidden planning inputs:

```text
unreviewed candidates
monitoring artifacts
news discovery leads
private notes
editorial research rows not promoted to canonical data
candidate URLs
private source queues
```

## 3. Required dimensions

Every canonical asset must receive a planning state for each dimension:

```text
identity
lifecycle
organization_relationships
mechanism_classification
reserve_structure
redemption
issuance
deployment
legal_profile
regulatory_notes
events
evidence_depth
known_unknowns
comparison_readiness
facet_freshness_support
canonical_market_access
```

## 4. Planning states

Allowed states:

```text
strong
usable
partial
sparse
absent
not_applicable
```

These states describe planning coverage only.

They do not make claims such as:

```text
safe
unsafe
low risk
high risk
good
bad
compliant
non-compliant
available
unavailable
```

## 5. State semantics

### strong

The dimension has multiple reviewed records or sufficiently complete reviewed structure for the intended SOG research surfaces, with evidence support appropriate to the record family.

### usable

The dimension is materially useful in current research surfaces but has identifiable depth or recency gaps.

### partial

The dimension has some reviewed canonical support but is incomplete for comparison, timeline, regulatory, or dossier use.

### sparse

The dimension has minimal reviewed support and should be considered a high-priority research gap.

### absent

No applicable canonical record support is present.

### not_applicable

The dimension is explicitly inapplicable under reviewed model semantics. This state must not be used as a substitute for missing research.

## 6. Deterministic derivation requirement

PR #353 must define deterministic rules for every dimension/state assignment.

A state may be derived from:

- record presence;
- applicable field completeness;
- evidence relation count or scope;
- known-unknown presence;
- Comparison Readiness state;
- freshness support state;
- canonical Market Access record presence.

Thresholds must be documented and validated.

No manual one-off override may be hidden in the generator.

If an override mechanism is required, it must be explicit, reviewed, and auditable.

## 7. Output requirements

PR #353 must produce a deterministic internal artifact containing at least:

```text
asset_slug
asset_name
symbol
dimension_states
priority_gaps
product_leverage_flags
input_digest
```

The artifact must also include summary counts by dimension and planning state.

PR #353 commits two reviewed handoff checkpoints:

```text
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
```

The summary checkpoint binds:

```text
110 assets
16 dimensions
1,760 planning cells
planning state distribution
dimension-level state distribution
source contract identities
reviewed input digest
```

The queue checkpoint binds:

```text
18 reviewed Tier A candidates
non-ranking slug order
explicit candidate reasons
priority gaps
material dossier gaps
product leverage flags
reviewed input digest
```

Both checkpoints are internal planning inputs, not public product outputs.

A parity validator must prove that regenerating the reviewed baseline from the same repository state reproduces both committed checkpoints exactly.

## 8. Product leverage flags

The baseline may derive non-ranking planning flags such as:

```text
compare_leverage
timeline_leverage
access_regulation_leverage
evidence_maintenance_leverage
historical_importance
regional_relevance
comparison_preset_member
```

`comparison_preset_member` is derived only from the reviewed Compare preset configuration. It is a product-leverage flag, not a statement of market importance or asset quality.

Flags must be boolean or categorical planning signals, not numeric composite scores.

## 9. Tier A selection output

PR #353 must prepare a proposed Tier A priority queue for PR #354, #355, and #357.

The queue must explain selection through explicit gap and leverage reasons.

Queue membership may use deterministic conditions based on:

```text
material dossier gaps
historical importance with material gaps
comparison and evidence-maintenance leverage
reviewed Compare preset membership with material gaps
regional relevance with material gaps
```

Common cross-registry gaps must not automatically make every asset a Tier A candidate. In particular, universal absence of canonical Market Access Records or broad freshness/deployment gaps must not by themselves make the queue non-selective.

Queue order must be deterministic and non-ranking. Slug order is permitted for stable output ordering.

Example reason structure:

```text
asset: example
reasons:
  - comparison preset member with material dossier gap
  - historical importance with multiple material dossier gaps
```

The queue does not become canonical public data.

## 10. Validation requirements

PR #353 must prove:

1. exactly 110 canonical assets are evaluated;
2. every asset has exactly the required dimension set;
3. only allowed planning states are emitted;
4. every state is deterministically derivable;
5. forbidden private/candidate/monitoring inputs are not read;
6. no numeric composite score is emitted;
7. no asset rank is emitted;
8. repeated builds from identical inputs are byte-identical;
9. summary counts reconcile with asset rows;
10. priority queue membership cites explicit gap/leverage reasons;
11. reviewed Compare preset membership is derived exactly from the preset config;
12. reviewed Tier A queue remains selective and bounded;
13. committed reviewed summary snapshot matches regenerated baseline summary exactly;
14. committed reviewed queue snapshot matches regenerated reviewed queue exactly;
15. canonical data remains unchanged;
16. public route behavior remains unchanged.

## 11. PR #353 non-goals

PR #353 does not:

- deepen dossiers;
- add canonical stable assets;
- create canonical Market Access Records;
- modify Comparison Readiness;
- modify facet freshness;
- change Compare preset membership or behavior;
- change Timeline projection semantics;
- change Update Feed entries;
- change Maintenance Log month records;
- add a public ranking page;
- add a new public product surface.

## 12. Handoff

After PR #353 merges, PR #354 selects the first Tier A dossier batch from the reviewed baseline outputs.

PR #354 must read:

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md
docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md
docs/quality/record-depth-coverage-baseline-spec.md
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
```

PR #354 must cite the selected assets' explicit queue reasons and material dossier gaps from the committed reviewed queue snapshot.
