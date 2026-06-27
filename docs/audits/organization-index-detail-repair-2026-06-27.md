# Organization Index and Detail Repair

Date: 2026-06-27  
Plan unit: PR 25  
Implementation pull request: PR #198

PR #197 merged supporting components, styles, workflow, and audit files without connecting the organization index and detail pages. PR #198 is the corrective implementation.

Implemented scope:

```text
Organization index multi-value filters: 5
Organization index sort modes: 5
Index desktop table columns: 8
Index compact representation: organization-index
Detail sections: overview, relationships, events, evidence, known unknowns, corrections
Detail compact representations: organization-overview, organization-relationships, organization-events, organization-sources
Implemented indexes after merge: 2
Protected table transformations after merge: 6 of 25
Routes changed: 0
Canonical records changed: 0
```

Relationship state uses canonical `ended` plus a recorded end date to identify historical relationships. Public copy may describe these as historical, but the stored taxonomy value is not changed.

Primary display remains a navigation and summary choice only. Current and ended relationships remain visible together with functional role, dates, display priority, and stablecoin lifecycle.

PR #198 supersedes the implementation-status claim in `organization-index-detail-implementation-2026-06-27.md` while preserving that document as the original plan record.
