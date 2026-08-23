# SOG material concerns and retroactive audit specification

Status: canonical implementation specification
Parent issue: #597

## Purpose

SOG is a historical stable-asset registry, not a whitelist, endorsement list, or safety ranking. Canonical inclusion means that an asset is in scope and sufficiently evidenced to record. It does not mean that the asset is safe, solvent, redeemable, fully backed, legally protected, or recommended.

`active` is a lifecycle fact only: the principal issuance or protocol function remains operational. It must never be rendered or described as a safety conclusion. Evidence verification means that a cited claim is supported by the reviewed source; it does not verify the safety of the asset as a whole.

## Public material-concern summary

Every canonical asset detail page must be able to expose a concise, evidence-backed summary of material concerns and known unknowns. The summary is derived from canonical records and evidence; it must not invent a proprietary safety score.

The public summary must support at least these dimensions:

- reserve/backing verification and the quality/date of supporting disclosure;
- redemption availability, eligibility, process and material restrictions;
- identified issuer and, where different, the legal redemption obligor;
- holder legal claim where the reviewed evidence establishes one, or an explicit unknown where material;
- centralized administrative controls where evidenced and material to holder outcomes;
- material yield or incentive promotions associated with issuance, distribution, custody or redemption;
- regulatory actions, fraud/scam findings, fraud/scam allegations, insolvency, depeg, suspension and recovery events;
- material known unknowns that prevent a stronger conclusion.

The UI must distinguish `confirmed`, `reported/alleged`, `unknown/not independently verified`, and `not applicable`. Allegations must not be rendered as findings. Findings supported by competent primary evidence must not be weakened into generic concerns.

## List and detail presentation

The registry/list view must expose enough concern information that two `active` assets are not implicitly presented as equally safe merely because their lifecycle status matches. At minimum, reserve/backing verification or redemption clarity and the presence of material concern flags must be visible or directly discoverable without treating lifecycle status as a risk badge.

The detail page must place material concerns and known unknowns near the identity/lifecycle summary, before long-form history. Timeline events and evidence remain the authority for the underlying claims.

## Retroactive canonical audit

This specification applies to every existing canonical asset, not only new records.

For every canonical asset, audit the dimensions above and classify each field as:

1. `derivable` — existing canonical evidence is sufficient to populate or derive the public summary;
2. `research_required` — the question is material but current reviewed evidence is insufficient;
3. `not_applicable` — the dimension genuinely does not apply.

Do not convert absence of data into a favorable state. Material uncertainty must remain explicit.

Audit output must be reviewable and deterministic. Corrections should be batched so existing records are brought to the same standard before the new presentation is considered complete.

## JPYR first application

JPYR is the first new intake governed by this specification, but no rule in this document is JPYR-specific. Its intake must separately evidence identity/reference target, contract/deployment, supply, backing/reserve claims, redemption structure, issuer/legal obligor, administrative controls, IZAKA-YA/CryptoPanda relationships, material yield promotions and unresolved questions.

Cross-registry links may connect JPYR to the related IZAKA-YA records in CYA, WLR and HEI. A cross-registry link does not transfer classifications between registries; each registry remains authoritative for its own subject.

## Completion gate

Issue #597 is not complete until:

- the applicable methodology/classification/public-UI documentation references this specification;
- all existing canonical assets have been audited under the retroactive audit contract;
- required correction batches are reviewed and merged;
- concern/known-unknown presentation is implemented and validated;
- JPYR is reviewed under the same rules;
- repository validators/build and required production parity checks pass.
