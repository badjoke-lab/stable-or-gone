# Terminal-date and relationship-end review

Status: supporting audit  
Date: 2026-06-28  
Roadmap item: PR #221

## Result

Terminal dates remain unresolved for four assets:

```text
sog_st_bac
sog_st_dsd
sog_st_esd
sog_st_gyen
```

Historical relationship end dates are reduced from seven to four:

```text
sog_rel_husd_stable_universal
sog_rel_esd_empty_set_operator
sog_rel_bac_basis_cash_operator
sog_rel_dsd_protocol_operator
```

## Resolved relationship decisions

- `sog_rel_busd_paxos` is corrected from `ended` to `active`. Paxos stopped new issuance but remains the BUSD reserve and redemption counterparty; the relationship ended in 2023 was the Binance branding relationship, not Paxos's legal issuer responsibility.
- `sog_rel_usdn_neutrino` receives `end_date: 2023-01-31`, matching the first-party start of the USDN-to-XTN onchain rename and the end of the original hard-dollar identity.
- `sog_rel_mountainusdm_mountain_issuer` receives `end_date: 2025-08-22`, when Phase 3 terms ended the ordinary issuer platform and primary redemption relationship. Mountain Protocol remained the wind-down overseer.

## Preserved terminal unknowns

- BAC: no formal shutdown, final settlement, or disabled-contract day was recovered.
- DSD: version transitions and declining activity do not establish a final protocol day.
- ESD: the DSU/ESS migration announcement is not proof that all ESD obligations ended that day.
- GYEN: the wind-down began on 2026-05-15, but redemption remains available through the future Initial Redemption Period ending 2026-11-11. A future deadline is not recorded as a completed terminal date.

## Preserved relationship unknowns

- HUSD: the October 2022 depeg and exchange delisting do not establish the legal issuer termination day.
- ESD, BAC, and DSD: their operator relationships remain `ended` with `end_date: null` until a matching terminal responsibility boundary is found.

## Fixed rules

- Depeg, delisting, last commit, migration opening, or market disappearance is not a default terminal date.
- Issuance stop and issuer responsibility are separate.
- Organization survival and a specific role's end are separate.
- A future redemption deadline remains unresolved until it occurs and the terminal state is verified.
- Unknown values remain `null` without matching day-level evidence.

## Queue state

```text
Terminal-date unresolved: 4
Relationship-end unresolved: 4
```

## Deployment classification

```text
No production deployment required
```
