export const uiRedesignV4Tokens = Object.freeze({
  colors: Object.freeze({
    background: '#05090f',
    backgroundRaised: '#09111b',
    surface: '#0d1722',
    surfaceRaised: '#111e2b',
    surfaceStrong: '#162635',
    line: '#25384a',
    lineStrong: '#385267',
    text: '#f2f7fa',
    copy: '#c7d2da',
    muted: '#8fa2af',
    quiet: '#6f8492',
    link: '#68d7ff',
    linkHover: '#a6e9ff',
    focus: '#ffd76a',
    active: '#58d7a0',
    limited: '#f0c75e',
    impaired: '#ff9c63',
    failed: '#ff727b',
    migrated: '#9a8cff',
    discontinued: '#91a0aa',
    unknown: '#c0acd9'
  }),
  typography: Object.freeze({
    interface: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    data: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
    bodyPx: 16,
    compactPx: 14,
    metadataPx: 12
  }),
  width: Object.freeze({ shellPx: 1480, readingCh: 76 }),
  radius: Object.freeze({ smallPx: 8, panelPx: 12, pillPx: 999 }),
  controlMinHeightPx: 44,
  spacingPx: Object.freeze([4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80])
});

export const uiRedesignV4LifecycleTones = Object.freeze({
  active: 'active',
  limited: 'limited',
  restricted: 'limited',
  impaired: 'impaired',
  failed: 'failed',
  migrated: 'migrated',
  discontinued: 'discontinued',
  unknown: 'unknown'
});
