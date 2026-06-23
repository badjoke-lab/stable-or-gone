# Launch-date Category C Lineage Batch Plan

Recorded: 2026-06-23

## Purpose

The next launch-date quality pass is limited to four Category C records whose unresolved dates are caused by lineage or version boundaries rather than simple source absence.

## Selected records

### Angle EURA

Current conflict:

```text
agEUR original launch
→ later EURA rename
```

Decision required:

- preserve the original economic asset launch if continuity is demonstrated
- record the EURA rename as a separate event
- do not substitute the rename date for the original launch date

### Synthetix sUSD

Current conflict:

```text
eUSD
→ nUSD
→ sUSD
```

Decision required:

- determine whether HEI-style canonical identity continuity applies across all three names
- separate original system launch, token rename, and current-symbol activation
- do not force a day-level date until the lineage rule and primary sources agree

### Lista lisUSD

Current conflict:

```text
Helio HAY
→ Lista lisUSD
```

Decision required:

- distinguish original HAY launch from the Lista migration and lisUSD rebrand
- decide whether the canonical entity records continuous economic identity or a successor asset
- keep migration and rebrand events separate from launch

### Nuon

Current conflict:

```text
Nuon v1 guarded mainnet: 2023-02-02
Nuon v2 public opening: 2025-03-03
```

Decision required:

- establish whether v2 is continuous with v1 or a successor product
- choose a launch boundary only after continuity is resolved
- retain both dates as separate lifecycle events if one canonical launch cannot safely represent the record

## Review order

```text
1. EURA
2. lisUSD
3. sUSD
4. Nuon
```

The first two have clearer rebrand or migration structures. sUSD and Nuon require broader identity-policy decisions and may remain unresolved.

## Completion rule

A record leaves the launch-date queue only when:

- the canonical identity boundary is explicit
- a day-level primary source supports the selected launch boundary
- rebrand, migration, version activation, and public availability are not collapsed into one date

Unresolved records remain `launch_date: null` with an improved review note.

## Production status

This is GitHub-only quality planning. It does not authorize Cloudflare changes or production deployment.
