# PR #429 Record Growth Batch 2 Specification

Status: reviewed canonical growth on merge  
Deployment class: canonical data growth without public-surface expansion

## Authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-18-pr426-post-ui-v3-data-growth-reset.md
docs/quality/record-growth-candidate-audit-v2-pr427-spec.md
config/record-growth-candidate-audit-v2-pr427.json
data/editorial-research/record-growth-candidate-audit-v2-pr427.json
docs/migration/record-growth-candidate-audit-v2-pr427-handoff.json
docs/migration/record-growth-candidate-audit-v2-pr427-validation.json
docs/roadmap-amendments/2026-07-18-pr428-post-pr427-review-gate.md
docs/quality/post-pr427-review-gate-pr428-spec.md
config/post-pr427-review-gate-pr428.json
docs/migration/post-pr427-review-gate-pr428.json
docs/migration/post-pr427-review-gate-pr428-validation.json
```

## Selected records

PR #428 authorizes exactly two records:

```text
AllUnity CHF / CHFAU / sog_st_chfau
AllUnity SEK / SEKAU / sog_st_sekau
```

The pair is a coherent AllUnity regulated non-EUR context. The selection is not a ranking, safety judgment, endorsement, or recommendation.

## Identity and issuer rules

Both records must pass a fresh duplicate review against all 112 pre-promotion canonical assets. The existing AllUnity organization `sog_issuer_allunity` must be reused as the legal issuer. No duplicate issuer organization may be created without separately reviewed evidence of a distinct legal entity.

## Complete-record requirement

Each asset must include all applicable layers:

```text
canonical identity
issuer relationship
lifecycle and classification
reserve and redemption profile
launch event and typed event detail
primary-source Evidence and Evidence Relations
reserve context
known unknowns
verified deployments only
legal profile
reserve component
income profile
candidate promotion mapping
canonical checkpoint
statistics history
release-integrity baseline
```

A complete record may preserve explicit unknowns. It may not replace missing evidence with invented values.

## Reviewed operational meaning

CHFAU is recorded as an active Swiss-franc electronic-money token launched on 2026-02-26. SEKAU is recorded as an active Swedish-krona electronic-money token launched on 2026-06-19. AllUnity states that both are fully backed 1:1 by segregated fiat reserves and subject to statutory par redemption. Direct mint-platform access is restricted to onboarded business, institutional, or professional clients.

The registry keeps statutory holder redemption rights separate from direct platform onboarding and operational fees, limits, settlement, and jurisdictional controls.

## Deployment rule

Only exact identifiers linked from the reviewed AllUnity product pages are canonicalized.

```text
CHFAU: Ethereum, Tempo
SEKAU: Ethereum, Polygon, Base, Solana
```

Unverified network identifiers remain known unknowns. Network announcements alone do not create a contract record.

## Expected counts

```text
Stable assets: 112 -> 114
Organizations: 107 -> 107
Relationships: 124 -> 126
Events: 187 -> 189
Evidence: 559 -> 565
Evidence Relations: 559 -> 565
Reserve reports: 120 -> 122
Known unknowns: 325 -> 331
Deployments: 174 -> 180
Legal profiles: 112 -> 114
Stable-asset relationships: 5 -> 5
Reserve components: 145 -> 147
Income profiles: 112 -> 114
Market Access Records: 8 -> 8
```

## Hard boundaries

PR #429 may not add a third asset, PLNQ, GBPQ, Open USD, FIUSD, Roughrider Coin, an existing duplicate candidate, a new public route, a new product surface, a UI change, a metadata-contract change, a Market Access Record, a ranking, score, endorsement, recommendation, or automatic promotion path.

It may not rewrite prior statistics snapshots or historical candidate-audit outputs.

## Validation

The dedicated validator must confirm exact selected identities, exact count deltas, complete record families, source and Evidence integrity, verified deployment identifiers, loader and manifest wiring, immutable statistics-history prefix, canonical/public output consistency, and the review-gate exit.

## Exit state

After PR #429, stop at `REVIEW GATE`. No subsequent work item is authorized by this specification.
