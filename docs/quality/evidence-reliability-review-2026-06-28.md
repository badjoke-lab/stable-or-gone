# Evidence reliability review

Status: supporting audit  
Date: 2026-06-28  
Roadmap item: PR #223

## Scope

This review covers the 36 canonical evidence records that normalized to `reliability: unknown` before PR #223.

The raw values were not genuine uncertainty labels. They were values from other evidence dimensions that had been written into the reliability field:

```text
primary:                         28
explorer:                         3
primary_repository:               2
primary_repository_index:         1
primary_or_ecosystem_dashboard:   1
primary_interface:                1
```

## Result

```text
Reviewed records: 36
High:             18
Medium:           18
Low:               0
Unknown:           0
```

Registry-wide reliability counts after the review:

```text
High:    376
Medium:   81
Low:       0
Unknown:   0
Total:   457
```

## Decision rule

Reliability is kept separate from provenance and primary-source status.

- `high` is used for direct legal terms, official technical documentation, official launch records, official reserve or transparency archives, official implementation repositories, and narrowly scoped explorer contract identity.
- `medium` is used for subject-controlled overview pages, issuer or product marketing pages, live protocol interfaces, dashboards, and generic entry points whose claims require more specific supporting material.
- `low` is reserved for weak or materially unreliable sources. None of the 36 records met that condition.
- `unknown` is preserved only when the source identity or document provenance cannot be resolved. None remained unresolved after reviewing the actual publisher, URL, title, claim scope, and notes.

Source type alone was not used as the decision. The same source type may receive a different value when the URL is only a generic entry point rather than a direct report or document.

## High reliability records

```text
sog_src_rlusd_transparency_reports
sog_src_rlusd_user_terms
sog_src_rlusd_docs
sog_src_rlusd_implementation_repo
sog_src_eurc_transparency
sog_src_eurc_developer_docs
sog_src_usdp_transparency
sog_src_usdp_etherscan
sog_src_usdp_contracts_github
sog_src_usdp_solscan
sog_src_usds_developer_docs
sog_src_usds_sky_github
sog_src_husd_etherscan
sog_src_rlusd_launch_2024
sog_src_eurc_launch_2022
sog_src_frax_docs
sog_src_tusd_attestation_entry
sog_src_pyusd_transparency
```

## Medium reliability records

```text
sog_src_rlusd_ripple_page
sog_src_eurc_circle_page
sog_src_eurc_mint_page
sog_src_usdp_paxos_page
sog_src_usdg_global_dollar_page
sog_src_usdg_paxos_page
sog_src_usdg_network_terms
sog_src_usds_sky_page
sog_src_usds_susds_page
sog_src_usds_info_dashboard
sog_src_frax_app
sog_src_tusd_site
sog_src_fdusd_site
sog_src_fdusd_reserve_entry
sog_src_pyusd_paypal_page
sog_src_pyusd_paxos_page
sog_src_usdd_site
sog_src_usdd_tron_dao_reserve
```

## Data changes

Only the `reliability` field changes in:

```text
data/evidence-extra.json
data/evidence-pr033.json
```

Evidence IDs, URLs, titles, publishers, claim scopes, relations, counts, routes, and public source identities remain unchanged.

## Validation requirements

- all 36 reviewed IDs must remain canonical evidence records;
- the manifest high/medium sets must be disjoint and total 36;
- each reviewed record must match its manifest value;
- no canonical evidence record may normalize to unknown reliability;
- no polluted reliability value may remain;
- registry-wide counts must remain `high 376 / medium 81 / low 0 / unknown 0`;
- evidence count remains 457;
- duplicate public URL invariants remain unchanged.

## Follow-up

PR #224 reviews the 112 direct-workflow placeholders and separates replaceable placeholders, intentionally unknown values, and invalid records.

## Deployment classification

```text
No production deployment required
```
