export const uiV3BrandAssets = Object.freeze({
  lockup_on_dark: '/brand/sog-lockup-on-dark.svg',
  lockup_on_light: '/brand/sog-lockup-on-light.svg',
  mark_on_dark: '/brand/sog-mark-on-dark.svg',
  mark_on_light: '/brand/sog-mark-on-light.svg'
});

export const uiV3Tokens = Object.freeze({
  colors: Object.freeze({
    background: '#071018',
    background_deep: '#040A0F',
    background_subtle: '#0A151F',
    surface: '#0D1A25',
    surface_raised: '#122534',
    surface_emphasis: '#183346',
    surface_selected: '#16374A',
    line: '#315164',
    line_subtle: '#1D3948',
    text: '#EDF6F8',
    text_muted: '#A6BAC3',
    text_faint: '#7F98A4',
    link: '#7AD9FF',
    link_hover: '#B9ECFF',
    focus: '#FFD276',
    logo_teal: '#153F4A',
    logo_coral: '#EF6A55',
    positive: '#7EE0B1',
    warning: '#F0CB72',
    critical: '#FF9696',
    unknown: '#C8B5EF',
    inactive: '#B4C1C7'
  }),
  content_width_px: Object.freeze({ reading: 740, dossier: 1220, registry: 1280, shell: 1480 }),
  radius_px: Object.freeze({ compact: 8, panel: 14, prominent: 18, pill: 999 }),
  spacing_px: Object.freeze([4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80]),
  control_min_height_px: 44,
  body_min_px: 16,
  table_min_px: 14,
  focus_ring_px: 3,
  typography: Object.freeze({
    interface: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    data: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace'
  })
});

export const uiV3RequiredClasses = Object.freeze([
  'site-header',
  'site-header-primary',
  'site-search',
  'site-search-control',
  'grouped-navigation',
  'utility-navigation',
  'mobile-navigation',
  'site-main',
  'site-footer',
  'site-footer-navigation',
  'ui-panel',
  'ui-button',
  'ui-field',
  'ui-chip'
]);

export const uiV3ForbiddenVisualPatterns = Object.freeze([
  'font-size: 10px',
  'font-size: 0.625rem',
  'class="site-primary-navigation"',
  'class="site-about-menu"',
  'editorial/newspaper-first',
  'automated_capture_counts_as_approval: true'
]);

export const uiV3ForbiddenBrandPatterns = Object.freeze([
  'stacked-cube',
  'stacked cube',
  'blue cube logo',
  'generated replacement logo'
]);
