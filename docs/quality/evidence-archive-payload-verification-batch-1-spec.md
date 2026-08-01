# Evidence Archive Payload Verification — Batch 1

Status: authorized bounded private maintenance  
Authority PR: #505  
Implementation PR: #506  
Public output: false

## Objective

Re-review exactly ten Evidence identities that PR #405 left unchanged because exact-source Wayback CDX metadata existed but the archived payload itself was not independently inspected. PR #506 may add an exact dated Wayback URL only when the archived payload is fetched and manually reviewed as preserving the canonical claim scope.

The private outcome artifact must record enough payload-level review detail to distinguish a genuine preserved source body from a redirect shell, error page, generic site frame, or unrelated capture.

## Fixed target set

```text
sog_src_rai_integrations_batch_b
sog_src_rai_oracle_relayer_batch_b
sog_src_rai_ungovernance_batch_b
sog_src_rlusd_docs
sog_src_rlusd_launch_2024
sog_src_rlusd_ripple_page
sog_src_spot_about_batch_b
sog_src_spot_mint_batch_b
sog_src_spot_site_batch_b
sog_src_spot_v2_rollout_batch_b
```

No replacement or eleventh identity is allowed.

## Acceptance rule

A dated archive may be accepted only when all of the following are true:

1. the snapshot is for the exact canonical source URL;
2. the Wayback response is HTTP 200;
3. the archived payload is independently fetched, not inferred from CDX metadata;
4. the payload visibly preserves the Evidence identity's canonical claim scope;
5. the accepted URL includes the exact Wayback timestamp; and
6. the decision is recorded in a private reviewed outcome artifact.

CDX metadata, redirects, domain-level captures, URL existence, or keyword matches without payload review are insufficient.

## Allowed outcomes

- `dated_exact_archive_added`
- `reviewed_no_safe_change`

Source replacement is not authorized in this batch.

## Preserved boundaries

```text
Stable assets: 117
Organizations: 108
Relationships: 129
Events: 192
Evidence identities: 579
Evidence Relations: 579
Deployments: 184
Market Access Records: 8
Detail routes: 417
Metadata-checked routes: 417
Archive recorded before: 450
Archive not recorded before: 129
```

Only `archived_url` fields for accepted target identities and the forward archive-quality checkpoints may change. No public route, UI, schema, Evidence identity, Evidence Relation, source URL, or non-Evidence canonical record may change.

## Exit

PR #506 must stop at `REVIEW GATE` after all ten outcomes and production parity are reviewed. No Batch 2 is authorized automatically.
