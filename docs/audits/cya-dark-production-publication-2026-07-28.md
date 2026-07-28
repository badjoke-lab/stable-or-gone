# CYA Dark Production Publication — 2026-07-28

## Purpose

Force a fresh production publication from `main` after merging PR #474.

## Intended source

- UI merge: `f9ec182ae739f2a8663bec4188810baf1effd2cc`
- Visual family: CYA-derived dark flat registry
- Canonical data impact: none

## Required production result

- homepage uses the CYA-derived registry structure;
- rounded SaaS cards, shadows, filled pills, header search, and the mobile menu are absent;
- mobile `/stablecoin/mainstreet-msusd/` and `/stats/` have no document-level horizontal overflow;
- deployed version matches this `main` publication commit;
- production smoke verification passes.
