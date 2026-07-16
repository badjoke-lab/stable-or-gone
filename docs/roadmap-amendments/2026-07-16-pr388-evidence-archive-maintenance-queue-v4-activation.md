# PR #388 Evidence Archive Maintenance Queue v4 Activation

Date: 2026-07-16  
Status: active internal queue refresh  
Public output: no

## Authority

Merged PR #386 authorizes exactly:

```text
PR #387 Evidence Archive Review-History Contract v3 Update
PR #388 Evidence Archive Maintenance Queue v4 Refresh
REVIEW GATE
```

PR #387 is complete. PR #388 must consume the reviewed History v3 contract, manifest, and audit.

## Scope

PR #388 must start from the current 153 archive-not-recorded canonical Evidence identities and:

1. exclude alias identities;
2. exclude source URLs already pointing to Web Archive;
3. exclude identities without a source URL;
4. exclude all twelve reviewed History v3 suppressions;
5. include `sog_src_fdusd_site` as the sole reviewed-reactivated identity in selection tier 0;
6. order ordinary unreviewed gaps by the existing non-ranking source-priority buckets and Evidence ID;
7. select at most ten identities;
8. emit a new versioned Queue v4 and delta;
9. stop at `REVIEW GATE`.

## Boundaries

PR #388 may change only internal authority, queue configuration, deterministic builder, versioned queue/delta outputs, validator, and workflow files.

It may not change canonical data, statistics, checkpoints, release baselines, public surfaces, prior queues, history versions, or reviewed outcomes.

## Exit condition

PR #388 must produce a deterministic fresh manual-review queue and delta, preserve all canonical/public boundaries, and stop at `REVIEW GATE`.