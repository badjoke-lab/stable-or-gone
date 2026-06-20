# Reserve Source-status Review

Updated: 2026-06-20

## Purpose

This review closes the active research pass for the three reserve-context records classified as `source_status_unresolved` after Phase 4B:

```text
FEI
HUSD
EURT
```

The objective is not to force additional reserve-context rows. A canonical row is added only when a durable, product-specific source proves the relevant reserve, redemption, assurance, or execution boundary.

## Result

```text
New canonical reserve-context rows: 0
Source-status records resolved:     0
Source-status records frozen:       3
Context coverage:                   57 / 70 unchanged
```

All three records remain unresolved, but the missing boundary is now explicit and reviewed.

## FEI

### Confirmed

- Fei v2 documented protocol-controlled reserves and 1:1 redemption design.
- TIP-121c documented the final-redemption governance decision.
- An Aave treasury swapper contract shows a concrete mechanism that redeemed aFEI to FEI, redeemed FEI for DAI through the Tribe DAO DAI Peg Stability Module, and returned DAI to Aave.

### Not established

The Aave-specific execution does not prove all of the following:

- completion of the entire FEI final-redemption program
- final distribution of all protocol-controlled value
- universal holder execution
- present availability of the redemption route
- a single durable final execution package covering the full wind-down

### Decision

Retain `source_status_unresolved`.

A future canonical context row requires either an official final execution notice, a complete on-chain execution record tied to the final-redemption program, or an equivalent durable source package. Governance approval and one participant-specific execution path are insufficient to assert universal completion.

## HUSD

### Confirmed

- Stable Universal and Paxos announced monthly attestations for HUSD reserves.
- Archived issuer materials described fiat backing and redemption.
- A 2023 legal study identifies a January 2022 `Accountant's Attestation: Reserve Accounts Report` and states that the report was no longer publicly available.
- The study describes the report as saying Huobi-administered assets were held for the benefit of the company and HUSD token holders.

### Not established

The original accountant report has not been recovered as a durable public document in the registry source set. Secondary descriptions and archived product claims do not preserve:

- the accountant identity and signed report package
- the exact report date and measurement boundary
- reserve amount and token-supply comparison
- complete scope and limitations
- an issuer-controlled or archive-stable source URL

### Decision

Retain `source_status_unresolved` and classify the gap as a confirmed-but-unrecovered historical attestation.

A future canonical context row requires recovery of the original report, a trustworthy archived copy, or an equivalent signed accountant source.

## EURT

### Confirmed

- Tether publishes consolidated reserve reports and independent auditor reports for specified entities and Tether Tokens.
- Tether's current disclosure warns that reserve reports can include assets and liabilities of entities that do not issue or redeem Tether Tokens.
- Official EURT materials establish the historical euro-denominated product identity.
- Official terms state that EURT redemption ceased effective 27 November 2025.

### Not established

No durable source reviewed in this pass separately identifies:

- EURT-specific reserve assets
- EURT liabilities in a product-specific assurance schedule
- the EURT issuer entity and reserve boundary for the relevant historical period
- a final EURT-specific reserve or redemption reconciliation

A consolidated Tether report must not be copied into the EURT record merely because it discusses Tether Tokens generally.

### Decision

Retain `source_status_unresolved`.

A future canonical context row requires a report that explicitly includes EURT, identifies its issuer or liability scope, or otherwise proves the product-specific reserve boundary.

## Research boundary

The following do not justify a canonical reserve-context row by themselves:

- launch claims that a token was fully backed
- secondary articles saying attestations existed
- governance approval without execution evidence
- participant-specific execution presented as universal completion
- consolidated issuer reporting without product-specific scope
- a current general transparency page that does not preserve the historical product boundary

## Queue policy

The three records remain in:

```text
data/quality/reserve-report-applicability.json
```

Their `next_action` remains `investigate_source_status`, meaning they may be reopened only when materially better primary evidence appears. The completed research pass is not repeated without a new source lead.

## Deployment classification

No production deployment is required. Cloudflare access is not used.
