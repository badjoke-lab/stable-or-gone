export const uiV3BrandAssets = Object.freeze({
  lockup_on_dark: '/brand/sog-lockup-on-dark.svg',
  lockup_on_light: '/brand/sog-lockup-on-light.svg',
  mark_on_dark: '/brand/sog-mark-on-dark.svg',
  mark_on_light: '/brand/sog-mark-on-light.svg'
});

export const uiV3Tokens = Object.freeze({
  colors: Object.freeze({
    paper: '#F4F1E9',
    paper_subtle: '#ECE7DC',
    paper_emphasis: '#E2DCCF',
    ink: '#1B1A18',
    ink_muted: '#5C5851',
    ink_quiet: '#7A746B',
    rule: '#C4BDB1',
    rule_strong: '#5D5850',
    accent: '#7F242A',
    accent_strong: '#641A1F',
    focus: '#1D5F85',
    logo_teal: '#153F4A',
    logo_coral: '#EF6A55',
    positive: '#2F6B4F',
    warning: '#93651B',
    critical: '#8B2B2B',
    unknown: '#655C79',
    inactive: '#6B6862'
  }),
  content_width_px: Object.freeze({ reading: 740, dossier: 1220, registry: 1360, wide: 1440 }),
  radius_px: Object.freeze({ compact: 2, control: 4, pill: 999 }),
  spacing_px: Object.freeze([4, 8, 12, 16, 24, 32, 48, 64, 88]),
  control_min_height_px: 44,
  focus_ring_px: 3,
  typography: Object.freeze({
    display: 'Georgia, Cambria, Times New Roman, serif',
    body: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  })
});

export const uiV3RequiredClasses = Object.freeze([
  'site-header',
  'site-primary-navigation',
  'site-search',
  'site-about-menu',
  'site-main',
  'site-footer',
  'ledger-section',
  'ledger-summary',
  'ledger-meta',
  'ledger-rule',
  'ui-panel',
  'ui-button',
  'ui-field',
  'ui-chip'
]);

export const uiV3ForbiddenVisualPatterns = Object.freeze([
  'radial-gradient(',
  '#030b16',
  '#061221',
  '#081727',
  '#18b6ff',
  'box-shadow: var(--sog-shadow-panel)',
  'box-shadow: var(--sog-shadow-accent)'
]);

export const uiV3ForbiddenBrandPatterns = Object.freeze([
  'stacked-cube',
  'stacked cube',
  'blue cube logo',
  'generated replacement logo'
]);
