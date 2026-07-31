# Record Growth Batch 4 Candidate Audit — PR #496

Status: reviewed candidate audit complete  
Updated: 2026-07-31

## Purpose

Audit a bounded private candidate set after PR #495 without changing canonical data or public output.

This work item evaluates identity, launch state, source recency, issuer and operator identity, backing, redemption, deployment identity, duplicate and lineage risk, and complete-record feasibility. It stops at a review gate.

## Authority

```text
PR #467 reviewed 116-asset canonical-data checkpoint
PR #492 Statistics and deployment-chain acceptance point
PR #493 official-domain migration
PR #495 post-domain authority synchronization
```

Canonical baseline:

```text
Stable assets: 116
Organizations: 107
Relationships: 128
Events: 191
Evidence: 571
Evidence Relations: 571
Deployments: 182
Market Access Records: 8
Detail routes: 414
```

## Scope

The audit reviews exactly eight candidates:

```text
Open USD
FIUSD
Roughrider Coin
MNEE
Qivalis euro stablecoin
ANZ A$DC
USDF Consortium USDF
Figure YLDS
```

The candidate limit is 12. No additional candidate may be added implicitly.

## Result

```text
Ready for full-record review: 2
- MNEE
- Figure YLDS

Prelaunch or noncanonical: 3
- Open USD
- Roughrider Coin
- Qivalis euro stablecoin

Insufficient current evidence: 3
- FIUSD
- ANZ A$DC
- USDF Consortium USDF

Exact canonical duplicates: 0
Canonical changes: 0
Public changes: 0
Next boundary: REVIEW GATE
```

“Ready for full-record review” is not promotion authorization. It means only that current primary sources appear sufficient to attempt a complete canonical record while preserving unsupported fields as explicit unknowns.

## Candidate findings

### MNEE

Current official terms support MNEE Limited as issuer, direct verified-customer issuance and redemption, 1:1 reserve backing, and Antigua and Barbuda licensing context. Current official transparency material exposes monthly attestations through May 2026. Official technical documentation supports 1Sat Ordinals and Ethereum operation.

A later full-record review must still verify exact network identifiers, first public issuance date, current reserve composition and custodian, current fees and minimums, and current distribution boundaries.

### Figure YLDS

SEC-filed material supports Figure Certificate Company as issuer and YLDS as a transferable, yield-bearing, unsecured registered security with surrender or redemption terms and active blockchain use.

Any later SOG record must preserve the security, income, issuer-asset, and non-deposit semantics. It must not be represented as an ordinary non-yield payment stablecoin.

### Open USD

Open Standard, OnePay, and Visa establish an announced asset and enterprise integration plan. The official Open Standard page still states that launch will occur later in 2026. A complete launched-token record is therefore not supported.

### FIUSD

Fiserv currently markets FIUSD as a fully reserved USD-backed product and has published infrastructure and reserve-funding announcements. The exact legal issuer, first verified circulation, canonical contracts, current reserve assurance, and direct redemption terms remain insufficiently supported.

### Roughrider Coin

The Bank of North Dakota describes an initial beta between financial institutions. Fiserv describes planned availability to North Dakota banks and credit unions in 2026. Production launch, token identity, issuer claim, reserve assurance, and redemption terms remain unresolved.

### Qivalis euro stablecoin

Qivalis is pursuing regulatory authorization and plans a second-half 2026 launch. Final token identity, launch, contracts, reserve assurance, and redemption terms are not yet available.

### ANZ A$DC

ANZ sources support historic pilot and settlement transactions. They do not establish current general availability, active circulation, current contracts, reserve assurance, or current redemption terms.

### USDF Consortium USDF

The current official domain is in maintenance mode. Current primary support is insufficient for active issuer, circulation, reserve, redemption, and deployment claims.

This identity is distinct from canonical Falcon USDf. The shared case-insensitive symbol must never cause automatic deduplication or lineage merging.

## Duplicate and symbol rules

- No exact canonical duplicate was found among the eight candidates.
- USDF Consortium USDF and Falcon USDf are distinct identities despite the symbol collision.
- Open USD uses OUSD, a market symbol also associated with Origin Dollar; any future record requires explicit issuer and lineage disambiguation.
- Name or symbol similarity is never sufficient for automatic deduplication.

## Source boundary

Every source lead in the audit is a primary official or regulatory source. A source lead is not canonical Evidence until a later reviewed canonical PR creates and relates the Evidence record.

A current product page does not by itself prove first issuance, circulating supply, contract identity, reserve custody, assurance, or direct redemption eligibility.

## Prohibited changes

PR #496 must not:

- change canonical stablecoin, organization, event, Evidence, deployment, legal, reserve, income, or Market Access records;
- change public counts, routes, metadata, machine-readable output, UI, CSS, or sitemap;
- create candidate pages;
- automatically promote a candidate;
- create an automatic canonical PR;
- score, rank, recommend, or imply safety;
- authorize a later batch indefinitely.

## Review gate

After PR #496, stop and review:

```text
MNEE complete-record feasibility
YLDS scope and security/income representation
exact contract and deployment support
reserve and redemption support
known-unknown burden
maintenance burden
value of new records versus dossier deepening
maximum of two possible future additions
```

Only a separate reviewed decision may authorize a canonical promotion PR.
