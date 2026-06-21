# Batch 12 Research Review

Updated: 2026-06-20

## Scope

This review covers the five pending candidates introduced for controlled growth from 70 to 75 canonical stable assets:

- M
- Falcon USD (USDf)
- dForce USX
- Anzen USDz
- Avalon USDa

No candidate is promoted by this review. Canonical stable assets remain at 70.

## Review outcome

All five candidates remain in scope as distinct stable-asset identities. Promotion is blocked until each candidate has a complete required-layer draft and the unresolved identity, organization, deployment, legal, reserve, redemption, and income boundaries are either resolved or represented as explicit known unknowns.

| Candidate | Identity result | Key reviewed boundary | Promotion state |
|---|---|---|---|
| M | Keep as M0 base token | Selective earning balances rebase; M0 Extensions are separate | Needs full layer draft |
| USDf | Keep as Falcon base token | sUSDf is separate; direct redemption is restricted and minimum-based | Needs full layer draft |
| USX | Keep one token identity provisionally | dForce/USX Finance lineage and base-token income need resolution; sUSX is separate | Needs identity and income resolution |
| USDz | Keep as Anzen base token | Institutional direct redemption; sUSDz is separate | Needs full layer draft |
| USDa | Keep as Avalon base token | Base USDa is non-accruing; sUSDa is the separate yield representation | Needs legal and deployment resolution |

## Safety decisions

- Candidate research cannot write canonical stable-asset records.
- Unsupported day-level launch precision is forbidden.
- Yield wrappers, staked representations, and application extensions are not aliases of base assets.
- A documented debt repayment or protocol burn path is not automatically treated as a universal holder redemption claim.
- Cross-chain copies are not promoted as independent stable assets; deployment canonicality must be reviewed.
- Reaching 75 canonical assets still triggers the production-parity gate. No 75-to-80 work may start while Cloudflare operator access remains unavailable.

## Machine-readable contract

```text
data/candidate-research-batch-12.json
scripts/validate-batch12-research.mjs
npm run validate:batch12-research
```

The validator enforces five-candidate parity with the intake file, proposed ID consistency, unique identities, source minimums, launch-precision safety, explicit blocking unknowns, and a zero-promotion state.

## Next work

1. Build the complete Batch 12 canonical-layer draft.
2. Resolve USX organization lineage and income semantics.
3. Normalize legal and custody relationships for M, USDf, USDz, and USDa.
4. Normalize canonical deployments and bridge boundaries for all five candidates.
5. Add evidence records and explicit known unknowns.
6. Promote only after the full build and normal CI chain pass.
