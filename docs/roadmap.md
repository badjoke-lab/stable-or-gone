# Stable or Gone Roadmap

Updated: 2026-06-29
Status: canonical execution schedule

Active plan: `docs/quality/non-ui-quality-program.md`
Paused UI plan: `docs/ui-redesign/implementation-plan.md`

## Current position

```text
Latest completed: PR #246
Active: PR #247
Next: PR #248
Stable assets: 92
Gate V2-F: not passed
Record growth: Growth A authorized for selected candidates only
Production publication: deferred
```

UI review remains unavailable. Gate V2-F remains not passed. Normal work must not approve the UI, deploy production, publish monitoring output, or write monitoring output directly to canonical records.

## Completed milestones

```text
PR #207 approved v2 contract and governance
PR #208 shared visual foundation
PR #209 Home
PR #210 Stablecoins index
PR #211 Stablecoin detail
PR #212 Organizations index and detail
PR #213 Events index and detail
PR #214 Editorial and project pages
PR #215 Mobile and accessibility hardening
PR #216 Visual-mark correction
PR #217-#225 record quality
PR #226-#229 deployment quality
PR #230-#239 monitoring foundation and safety
PR #240 monitoring feasibility audit for 92 assets
PR #241 reserve and assurance source expansion
PR #242 redemption and terms source expansion
PR #243 issuer lifecycle source expansion
PR #244 regulatory-source monitoring boundary
PR #245 monitoring coverage report and validator
PR #246 final-eight candidate audit and selection
```

## Monitoring state

```text
Enabled official sources: 24
Unique source URLs: 23
Covered stable assets: 16
Uncovered stable assets: 76
Multi-family covered assets: 7
Covered canonical organizations: 12
Pending baselines: 24
Accepted baselines: 0
Automatic canonical write: false
Automatic pull request: false
Public monitoring output: false
Production publication: false
```

## Final eight selection

```text
sog_cand_000093 DOLA
sog_cand_000094 Origin Dollar / OUSD
sog_cand_000095 Inter Stable Token / IST
sog_cand_000096 NEAR USN
sog_cand_000097 Venus VAI
sog_cand_000098 Djed
sog_cand_000099 Kava USDX
sog_cand_000100 Berachain HONEY
```

Selection is not canonical promotion. Each growth PR must still verify identity, dates, events, evidence, relationships, reserves, redemption, and deployments.

Audit: `data/final-eight-candidate-audit-pr246.json`  
Specification: `docs/quality/final-eight-candidate-audit-spec.md`

## Phase C — reviewed growth

```text
PR #246 final-eight candidate audit and selection — complete
PR #247 Growth A: 92 -> 94 — DOLA, OUSD
PR #248 Growth B: 94 -> 96 — IST, USN
PR #249 Growth C: 96 -> 98 — VAI, Djed
PR #250 Growth D: 98 -> 100 — USDX, HONEY
```

Each growth PR is limited to two selected stable assets. Unknown values remain unknown. Non-applicable record groups must not receive invented placeholders.

## Phase D — 100-record audit

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

## Phase E — non-UI release preparation

```text
PR #259 Registry v2/v3 and machine-readable parity
PR #260 counts, manifest, version, and provenance integrity
PR #261 reproducible build and generated-output audit
PR #262 100-record canonical data freeze
PR #263 non-UI release-candidate material
```

PR #263 does not authorize production publication.

## Publication gate

```text
owner visual review
-> Gate V2-F correction PRs
-> Gate V2-F pass
-> explicit publication approval
-> manual deployment
-> public parity verification
```
