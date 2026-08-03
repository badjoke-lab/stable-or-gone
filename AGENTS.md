# Stable or Gone Agent Instructions

This file is the mandatory entry point for humans, AI agents, and automation working in this repository.

## Current authority

```text
Repository authority: PR #516 active authority review
Authorized next implementation: PR #517 only
Authorized candidates: Bison Bank EUB and USB
Maximum new canonical assets in PR #517: 2
Maximum new organizations in PR #517: 1
Required exit after PR #517: REVIEW GATE
Replacement candidate: prohibited
```

Current reviewed and production-verified baseline:

```text
Canonical stable assets: 117
Organizations: 108
Relationships: 129
Events: 192
Canonical Evidence: 579
Evidence Relations: 579
Archive recorded: 457
Archive not recorded: 122
Deployments: 184
Market Access Records: 8
Detail routes: 417
Metadata-checked detail routes: 417
Official public origin: https://www.stableorgone.com
Current production checkpoint: e33bed83dead360570ab81907fbf4f237b63d136
Current production canonical hash: sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb
Production convergence attempt: 1
```

## Current authority chain

1. PR #498 remains the current 117-asset canonical addition checkpoint.
2. PR #500 remains the current canonical maintenance and statistics-history checkpoint.
3. PR #493 established `https://www.stableorgone.com` as the official public origin.
4. PR #511 and PR #512 completed Terminal Date Boundary Review Batch 2 without canonical date changes.
5. PR #513 closed that checkpoint and returned the repository to REVIEW GATE.
6. PR #514 fixed the 2026-08-03 through 2026-09-13 operating cycle and authorized Record Growth Batch 5 candidate audit.
7. PR #515 reviewed exactly eight private candidates, retained EUB and USB for full-record review, preserved six candidates at their evidence boundaries, and was production-verified at `e33bed83dead360570ab81907fbf4f237b63d136`.
8. PR #516 authorizes only PR #517 to attempt complete canonical records for Bison Bank EUB and USB.
9. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.

## Mandatory reading order

Before changing canonical data, code, workflows, infrastructure, or documentation, read:

1. `AGENTS.md`
2. `docs/spec-governance.md`
3. `docs/roadmap.md`
4. `docs/deployment-policy.md`
5. `docs/roadmap-amendments/2026-08-03-six-week-operating-cycle-and-record-growth-batch-5.md`
6. `docs/quality/record-growth-batch-5-candidate-audit-pr515-spec.md`
7. `config/record-growth-batch-5-candidate-audit-pr515.json`
8. `data/editorial-research/record-growth-batch-5-candidate-audit-pr515.json`
9. `docs/migration/record-growth-batch-5-candidate-audit-pr515-source-coverage.json`
10. `docs/migration/record-growth-batch-5-candidate-audit-pr515-duplicate-report.json`
11. `docs/migration/record-growth-batch-5-candidate-audit-pr515-handoff.json`
12. `docs/roadmap-amendments/2026-08-03-record-growth-batch-5-review-gate.md`
13. `docs/quality/record-growth-batch-5-review-gate-pr516-spec.md`
14. `config/record-growth-batch-5-review-gate-pr516.json`
15. `docs/migration/record-growth-batch-5-review-gate-pr516.json`
16. `docs/migration/current-canonical-checkpoint.json`
17. `docs/migration/current-review-checkpoint.json`
18. `docs/migration/current-stats-history-checkpoint.json`
19. every named baseline, source, queue, audit, handoff, or prior output required by an authorized work item

Merged repository authority outranks chat memory, handoff prose, issue discussion, generated reports, and unmerged drafts.

## Current workstream

```text
PR #514 six-week cycle and Batch 5 audit authority: complete
PR #515 Record Growth Batch 5 candidate audit: complete and production-verified
PR #516 Record Growth Batch 5 review gate: active authority PR
PR #517 Bison Bank EUB and USB complete-record implementation: authorized only after PR #516 merge and production verification
Later cycle lanes: planned but not implementation-authorized
```

## PR #517 exact scope

PR #517 may attempt only:

```text
Bison Bank Electronic Money Token — Euro (EUB)
Bison Bank Electronic Money Token — US Dollar (USB)
Shared legal issuer: Bison Bank, S.A.
```

Before canonical edits, PR #517 must freshly review identity, duplicate and lineage status, official launch and product pages, MiCA whitepaper payloads, exact Solana mint identities, first issuance or mint evidence, current reserve and assurance evidence, current mint and redemption terms, institutional allowlist restrictions, and issuer relationships.

Every exact deployment identifier requires a second authoritative or direct on-chain confirmation. An issuer-level audit statement must not be promoted into a token-specific reserve attestation without a supporting report body and claim scope.

PR #517 must create every applicable organization, relationship, classification, profile, event, Evidence, Evidence Relation, reserve, legal, income, deployment, and known-unknown record together. Thin records are prohibited. Unsupported facts remain explicit known unknowns.

A candidate that fails its fresh entry gate must be withheld. The other may proceed only if it independently satisfies the complete-record standard. No deferred candidate may be substituted.

## Deferred Batch 5 candidates

The following remain outside current authority:

```text
SoFiUSD / SOFID
USA₮
XrymaCoin / XREUR
JPYSC
Swiss joint CHF stablecoin sandbox
Hazel Network unified token design
```

No automatic recheck or promotion is authorized.

## Canonical-data boundary

- Unknown values remain unknown unless reviewed evidence supports replacement.
- Partial dates must not be coerced into day-level dates.
- Monitoring, candidates, discovery leads, editorial research, and private notes are not canonical data.
- Candidate source leads are not canonical Evidence.
- Canonical counts change only through explicit audited data PRs.
- Rebrands, aliases, wrappers, migrations, and deployments do not become separate canonical assets without scope and lineage review.
- Name or symbol similarity never authorizes automatic deduplication.
- USDF Consortium USDF must not be merged with Falcon USDf.
- Open USD must be disambiguated from Origin Dollar before any future record.
- Figure YLDS must not be treated as an ordinary stablecoin without a separate reviewed scope amendment.
- Automatic promotion, ranking, scoring, recommendation, or implied safety are prohibited.
- No canonical work beyond PR #517 is currently authorized.

## Mandatory UI working rule

Before changing public HTML, components, layouts, CSS, client scripts, UI validators, screenshot workflows, or visual acceptance records, read `docs/ui-v3-remediation-authority.md` and the PR #492 Statistics contract.

Every material UI PR must identify authority, list changed route families, include desktop and mobile screenshots, manually inspect generated images, and preserve canonical data, routes, metadata, and machine-readable output unless separate authority permits change.

PR #516 and PR #517 authorize no material UI redesign or new route family.

## Domain and deployment boundary

The only official origin is:

```text
https://www.stableorgone.com
```

Canonical metadata, hreflang, OGP, JSON-LD, machine-readable files, robots, sitemap, production smoke tests, and deployment reporting must use that origin.

The legacy host `sog.badjoke-lab.com` still resolves to the Pages project. Its redirect is an external Cloudflare configuration task. No current repository work may change or reintroduce that host into canonical output.

Issue #479 remains open for deployment history and the externally blocked redirect. A merge to `main` is not proof of production parity; equality is established by the deployment workflow and Issue #479.
