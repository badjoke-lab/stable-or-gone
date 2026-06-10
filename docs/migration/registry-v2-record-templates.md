# Registry v2 Record Templates

These examples are documentation only. Copy them into a reviewed data change and replace every placeholder before use.

## Organization

```json
{
  "id": "sog_org_replace_me",
  "slug": "replace-me",
  "name": "Replace Me",
  "organization_type": "company",
  "jurisdiction": "unknown",
  "official_url": null,
  "summary": "",
  "confidence": "low",
  "last_verified_at": null,
  "notes": ""
}
```

## Relationship

```json
{
  "id": "sog_rel_replace_me",
  "stablecoin_id": "sog_st_replace_me",
  "organization_id": "sog_org_replace_me",
  "role": "legal_issuer",
  "start_date": null,
  "end_date": null,
  "status": "unknown",
  "evidence_ids": [],
  "notes": ""
}
```

## Event

```json
{
  "id": "sog_ev_replace_me",
  "subject_stablecoin_ids": [],
  "subject_organization_ids": [],
  "event_type": "launch",
  "event_date": null,
  "title": "",
  "description": "",
  "impact_level": "medium",
  "event_status_effect": "none",
  "confidence": "low",
  "evidence_ids": [],
  "notes": ""
}
```

For a depeg event, add only source-supported values:

```json
{
  "depeg_detail": {
    "peg_reference": "USD 1.00",
    "direction": "below_peg",
    "extreme_price": null,
    "maximum_deviation_bps": null,
    "duration_minutes": null,
    "recovery_status": "unknown",
    "recovery_date": null,
    "cause_summary": "",
    "price_source_ids": []
  }
}
```

For a regulatory event:

```json
{
  "regulatory_detail": {
    "jurisdiction": "",
    "authority": "",
    "action_type": "",
    "case_reference": "",
    "effective_date": null,
    "resolution_date": null
  }
}
```

## Evidence

```json
{
  "id": "sog_evd_replace_me",
  "stablecoin_ids": [],
  "organization_ids": [],
  "event_ids": [],
  "source_type": "issuer_statement",
  "title": "",
  "url": "https://example.invalid/replace-me",
  "publisher": "",
  "published_at": null,
  "archived_url": null,
  "accessed_at": null,
  "reliability": "medium",
  "claim_scopes": [],
  "notes": ""
}
```

## Rules

- Never invent dates, prices, durations, roles, or legal relationships to satisfy a template.
- Use `null`, `unknown`, or an explicit known-unknown record when the public evidence is incomplete.
- Keep stablecoin, organization, event, and evidence IDs stable after publication.
- During the compatibility period, old fields may coexist with v2 fields only when the compatibility validator accepts them.
