# DOLA Launch-Boundary Review

Recorded: 2026-06-25

Result: RESOLVED FOR CANONICAL IMPLEMENTATION

Stablecoin: `sog_st_dola`

Current canonical launch date: `null`

Recommended canonical launch date: `2021-02-25`

## Question

DOLA currently remains in the unresolved launch-date queue because its token deployment, first mint, Anchor/Frontier release, DOLA Stabilizer availability, and later FiRM issuance model are different boundaries.

This review determines which boundary represents the original public launch of the continuing DOLA asset.

## Reviewed boundaries

| Boundary | Date | Evidence status | Canonical treatment |
| --- | --- | --- | --- |
| Ethereum DOLA token contract creation | 2021-02-23 | Day-level on-chain evidence | Deployment boundary only |
| Anchor public launch under the protocol now called Frontier | 2021-02-25 | Day-level first-party documentation | Original public launch boundary |
| DOLA issuance through Anchor/Frontier | 2021-02-25 | First-party documentation ties the launched protocol to DOLA issuance | Supports canonical launch |
| Exact first DOLA mint transaction | Unresolved | Not established in the reviewed source set | Preserve as a known unknown if needed |
| DOLA Stabilizer introduction | February 2021 | First-party month-level retrospective | Supporting product history, not needed to replace the day-level launch boundary |
| FiRM launch and migration of the main backing model | Late 2022 | First-party documentation | Later protocol/model boundary, not original DOLA launch |

## Primary evidence

### 1. Original protocol launch

Inverse Finance's current legacy-product documentation states that Frontier facilitates lending and borrowing through issuance of synthetic tokens including DOLA, and that Frontier launched on 2021-02-25 under the name Anchor.

Source:

```text
https://docs.inverse.finance/inverse-finance/inverse-finance/legacy-products/frontier-anchor
```

This is a first-party, day-level statement connecting the launch of the original public money market to DOLA issuance.

### 2. DOLA identity at the 2021 launch

Inverse Finance's FiRM whitepaper announcement retrospectively states that in February 2021 it launched both Anchor and DOLA. This confirms that the DOLA asset belongs to the same original launch lineage rather than originating with FiRM.

Source:

```text
https://www.inverse.finance/blog/posts/en-US/fresh-whitepaper-firm-a-new-way-to-do-fixed-rate-borrowing
```

### 3. Ethereum token deployment

The canonical DOLA Ethereum contract was created on 2021-02-23, two days before the documented Anchor launch.

Contract:

```text
0x865377367054516e17014ccded1e7d814edc9ce4
```

Creation transaction:

```text
https://etherscan.io/tx/0x22c2e58044be9d96b22f7e4350a812d007eb7fdba4be24967815cf6bd5ecda06
```

The contract-creation date is retained as a deployment boundary. It is not used as the public launch date because deployment alone does not establish public protocol availability.

### 4. Later FiRM boundary

Inverse Finance documentation describes the launch of FiRM in late 2022 as a change to DOLA's backing model. FiRM therefore represents a later protocol and issuance-model transition, not the original launch of DOLA.

Source:

```text
https://docs.inverse.finance/inverse-finance/inverse-finance/products/tokens/dola/dola-peg-mechanism
```

## Decision

Set DOLA's canonical `launch_date` to:

```text
2021-02-25
```

Reason:

- the source is first-party
- the date is day-level
- the launched protocol explicitly facilitated DOLA issuance
- an independent first-party retrospective confirms Anchor and DOLA share the February 2021 origin
- the earlier contract creation is preserved separately
- FiRM is correctly treated as a later model transition

## Implementation requirements

The follow-up canonical implementation must:

1. set `data/stablecoins-batch-g.json` DOLA `launch_date` to `2021-02-25`
2. preserve the 2021-02-23 Ethereum contract creation as a deployment boundary
3. add a dated DOLA launch event for 2021-02-25
4. add first-party launch evidence and on-chain deployment evidence
5. update Event v2 and evidence relations
6. remove DOLA from `data/quality/launch-date-unresolved.json`
7. reduce the unresolved launch queue from 23 to 22 and Category C from 17 to 16
8. preserve the exact first mint as unresolved unless transaction-level evidence is separately established
9. synchronize baselines, generated outputs, README counts, and roadmap

## Scope boundary

This review does not claim that the first mint occurred on 2021-02-25. It resolves the canonical public launch boundary using the original protocol's documented public launch date.
