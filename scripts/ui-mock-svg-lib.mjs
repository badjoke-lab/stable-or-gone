import { visualTokens } from '../config/visual-system-contract.mjs';

export const colors = visualTokens.colors;

export function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function rect(x, y, width, height, fill = colors.surface, stroke = colors.line_subtle, radius = 10) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`;
}

export function line(x1, y1, x2, y2, stroke = colors.line_subtle) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}"/>`;
}

export function text(x, y, value, size = 14, fill = colors.text, weight = 400, anchor = 'start') {
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}">${escapeXml(value)}</text>`;
}

export function chip(x, y, value, tone = 'neutral', width = Math.max(64, value.length * 7 + 22)) {
  const tones = {
    positive: [colors.positive, '#0C2A20'],
    warning: [colors.warning, '#2B2410'],
    critical: [colors.critical, '#301719'],
    unknown: [colors.unknown, '#241E33'],
    neutral: [colors.text_muted, colors.background_subtle],
    link: [colors.link, '#102630']
  };
  const [foreground, background] = tones[tone] ?? tones.neutral;
  return `${rect(x, y, width, 28, background, foreground, 14)}${text(x + width / 2, y + 19, value, 11, foreground, 600, 'middle')}`;
}

export function heading(x, y, eyebrow, title, subtitle = '') {
  return `${text(x, y, eyebrow.toUpperCase(), 11, colors.positive, 700)}${text(x, y + 42, title, 34, colors.text, 700)}${subtitle ? text(x, y + 70, subtitle, 14, colors.text_muted) : ''}`;
}

export function panelTitle(x, y, title, meta = '') {
  return `${text(x, y, title, 16, colors.text, 700)}${meta ? text(x, y + 22, meta, 11, colors.text_muted) : ''}`;
}

export function header(width, mobile = false, current = 'Registry') {
  if (mobile) {
    return `${rect(16, 14, width - 32, 62, colors.surface, colors.line, 10)}${text(34, 42, 'STABLE OR GONE', 14, colors.text, 800)}${text(34, 61, 'Historical stablecoin registry', 10, colors.text_muted)}${rect(width - 72, 28, 38, 34, colors.surface_raised, colors.line, 8)}${text(width - 53, 50, 'MENU', 9, colors.text, 700, 'middle')}`;
  }
  const items = ['Stablecoins', 'Organizations', 'Events', 'Guides', 'Methodology', 'Updates'];
  return `${rect(32, 20, width - 64, 68, colors.surface, colors.line, 10)}${text(54, 49, 'STABLE OR GONE', 16, colors.text, 800)}${text(54, 69, 'Historical stablecoin registry', 10, colors.text_muted)}${items.map((item, index) => text(width - 680 + index * 98, 59, item, 12, item === current ? colors.focus : colors.text_muted, item === current ? 700 : 500)).join('')}${chip(width - 126, 40, 'Corrections', 'link', 82)}`;
}

export function footer(width, height) {
  return `${line(32, height - 50, width - 32, height - 50)}${text(32, height - 25, 'Historical information · Methodology · Data access · Corrections', 11, colors.text_muted)}${text(width - 32, height - 25, 'Representative UI mock', 11, colors.text_muted, 400, 'end')}`;
}

export function mobileShell(width, height, title, subtitle, bodyContent) {
  return `${header(width, true)}${text(20, 112, title, 28, colors.text, 750)}${text(20, 140, subtitle, 12, colors.text_muted)}${bodyContent}${footer(width, height)}`;
}

export function svgDocument(width, height, title, requiredElements, body) {
  const metadata = escapeXml(JSON.stringify({ required_elements: requiredElements }));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">\n<title id="title">${escapeXml(title)}</title>\n<desc id="desc">${escapeXml(requiredElements.join(', '))}</desc>\n<metadata>${metadata}</metadata>\n<rect width="100%" height="100%" fill="${colors.background}"/>\n<style>text{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}</style>\n${body}\n</svg>`;
}
