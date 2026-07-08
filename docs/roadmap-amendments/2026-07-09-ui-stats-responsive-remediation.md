# UI remediation: statistics contrast and responsive readability

Status: active

## Scope

This remediation work fixes UI defects found through full-page screenshot review without changing canonical registry data or deterministic statistics.

Ordered scope:

1. Restore statistics-page contrast under the global dark theme.
2. Separate chart fill colors from inherited text colors.
3. Align statistics borders and panel surfaces with global theme tokens.
4. Improve narrow-screen statistics tables and disclosure of horizontally scrollable content.
5. Reduce excessively long mobile statistics presentation through progressive disclosure while preserving full data access.
6. Add visual/contrast regression checks for critical statistics selectors.
7. Improve mobile readability of long definition tables on About and Methodology.

## Safety boundary

- No canonical data changes.
- No statistics calculation changes.
- No record count changes.
- No lifecycle or classification rule changes.
- All fixes are presentation and UI validation only.
