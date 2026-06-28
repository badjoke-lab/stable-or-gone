# UI v2 editorial and project family audit

Date: 2026-06-28  
Program: Modern Data Product UI v2  
Plan item: PR #214

The Guides, Glossary, Models, Methodology, Updates, About, Contact/Corrections, and Support route families now share a route-aware editorial presentation layer. Existing source-backed content, tables, guide catalogs, contact paths, support disclosure, and machine-readable links remain unchanged.

The shared layer provides the approved dark-navy and bright-blue hero hierarchy, metric treatment, section headings, cards, compact table reachability, keyboard focus, reduced-motion behavior, and forced-colors borders without introducing mock-only facts or account features.

`scripts/validate-ui-v2-editorial.mjs` is chained into the existing full/site v2 validation entry point.

Deployment classification: No production deployment required.
