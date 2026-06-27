export const uiV2BrandAssets = Object.freeze({
  lockup_on_dark: '/brand/sog-lockup-on-dark.svg',
  lockup_on_light: '/brand/sog-lockup-on-light.svg',
  mark_on_dark: '/brand/sog-mark-on-dark.svg',
  mark_on_light: '/brand/sog-mark-on-light.svg'
});

export const uiV2Tokens = Object.freeze({
  colors: Object.freeze({
    background: '#030B16',
    background_subtle: '#061221',
    surface: '#081727',
    surface_raised: '#0D2136',
    surface_emphasis: '#112A43',
    line: '#245071',
    line_subtle: '#17344D',
    text: '#F2F7FB',
    text_muted: '#A8BAC9',
    text_quiet: '#73899C',
    accent: '#18B6FF',
    accent_strong: '#058EE8',
    focus: '#35C4FF',
    logo_teal: '#73AEB3',
    logo_coral: '#EF6A55',
    positive: '#59D89B',
    warning: '#F0B94C',
    critical: '#F06B6B',
    unknown: '#A88BFF',
    inactive: '#8094A3'
  }),
  content_width_px: Object.freeze({ reading: 760, registry: 1240, wide: 1440 }),
  radius_px: Object.freeze({ compact: 8, panel: 12, prominent: 18, pill: 999 }),
  spacing_px: Object.freeze([4, 8, 12, 16, 20, 24, 32, 48, 64]),
  control_min_height_px: 44,
  focus_ring_px: 3
});

export const uiV2SharedComponents = Object.freeze([
  'src/components/BrandLockup.astro',
  'src/components/TickerBadge.astro',
  'src/components/OrganizationBadge.astro',
  'src/components/PageHero.astro',
  'src/components/MetricCard.astro',
  'src/components/SupportBanner.astro'
]);

export const uiV2RequiredClasses = Object.freeze([
  'ui-panel',
  'ui-button',
  'ui-button--primary',
  'ui-field',
  'ui-chip',
  'ticker-badge',
  'organization-badge',
  'page-hero',
  'metric-card',
  'support-banner'
]);

export const uiV2ForbiddenBrandPatterns = Object.freeze([
  'stacked-cube',
  'stacked cube',
  'blue cube logo'
]);
