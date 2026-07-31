# PR #498 Record Growth Batch 4 — MNEE Specification

Status: reviewed complete — REVIEW GATE  
Deployment class: canonical data growth without public-surface expansion

## Authority

```text
AGENTS.md
docs/spec-governance.md
docs/roadmap.md
docs/post-351-data-growth-operating-spec.md
docs/roadmap-amendments/2026-07-31-record-growth-batch-4-review-gate.md
docs/quality/record-growth-batch-4-review-gate-pr497-spec.md
config/record-growth-batch-4-review-gate-pr497.json
data/editorial-research/record-growth-batch-4-candidate-audit-pr496.json
docs/migration/record-growth-batch-4-candidate-audit-pr496-handoff.json
data/editorial-research/record-growth-batch-4-mnee-pr498-source-review.json
```

## Selected record

PR #497 authorizes exactly one complete canonical addition:

```text
MNEE / MNEE / sog_st_mnee
Issuer: MNEE Limited / sog_issuer_mnee_limited
```

No replacement candidate is allowed. Figure YLDS remains deferred and is not changed by PR #498.

## Entry-gate result

The fresh 2026-07-31 review confirms:

- MNEE Limited is the named issuer and direct issuance/redemption counterparty in current issuer terms;
- the official launch date on 1Sat Ordinals is 2025-03-03;
- the official `@mnee/ts-sdk` package version 1.2.0 publishes the production 1Sat token ID `ae59f3b898ec61acbdb6cc7a245fabeded0c094bf046f35206a3aec60ef88127_0`;
- current issuer documentation and the Etherscan token page identify Ethereum contract `0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf`;
- issuer terms describe 1:1 reserve backing, verified-customer issuance and redemption, a USD 100,000 fiat-redemption minimum, and a fee equal to the greater of USD 5,000 or 0.5%;
- the official transparency page lists monthly attestations through May 2026;
- no current canonical ID, slug, symbol, name, or deployment identifier match exists.

The deployment identifiers are source-linked canonical identities. The overlay classification remains `identifier_recorded_unverified`; PR #498 does not overstate an independent runtime or control audit.

## Complete-record requirement

MNEE includes every applicable record family:

```text
canonical identity
new issuer organization and legal-issuer relationship
lifecycle and classification
reserve and redemption profile
launch event and typed event detail
eight canonical Evidence records and Evidence Relations
reserve-report context
five explicit known unknowns
two deployment identities
legal profile
two reserve components
income profile
candidate promotion mapping
canonical and statistics checkpoints
release, parity, and reproducible-build baselines
```

## Explicit known unknowns

PR #498 preserves rather than invents:

- exact figures, signed URL, and archive capture for the latest listed attestation report;
- current reserve custodian identity and exact category allocation;
- first public Ethereum issuance date;
- current freeze, blacklist, pause, upgrade, mint, and recovery controls;
- complete current direct-access, customer-type, and jurisdiction inventory.

## Expected counts

```text
Stable assets: 116 -> 117
Organizations: 107 -> 108
Relationships: 128 -> 129
Events: 191 -> 192
Evidence / Evidence Relations: 571 -> 579
Reserve reports: 124 -> 125
Known unknowns: 337 -> 342
Deployments: 182 -> 184
Legal profiles: 116 -> 117
Stable-asset relationships: 5 -> 5
Reserve components: 149 -> 151
Income profiles: 116 -> 117
Market Access Records: 8 -> 8
Archive recorded: 442 -> 450
Archive not recorded: 129 -> 129
Detail routes: 414 -> 417
```

## Hard boundaries

PR #498 may not add a second asset, promote YLDS, substitute another candidate, infer unsupported attestation or reserve figures, mark deployment identifiers as independently verified, add Market Access, change a public route family or UI contract, add a ranking or score, make an endorsement or recommendation, or introduce automatic promotion.

The three new detail routes are data-driven dossier routes for one stable asset, one organization, and one event. They do not constitute a new public route family.

## Validation

The dedicated validator must confirm the sole selected identity, issuer, exact 1Sat token ID, exact Ethereum contract, launch date, redemption terms, eight Evidence records, five known unknowns, exact count deltas, archive partition, v2/v3 loaders and manifests, candidate promotion, deployment overlay classification, checkpoints, immutable statistics history, and `REVIEW GATE` exit.

## Exit state

After PR #498, stop at `REVIEW GATE`. No subsequent canonical addition, YLDS scope change, UI program, or later growth batch is authorized by this specification.
