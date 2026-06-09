export function cleanPublicText(value?: string | null, fallback = '—'): string {
  const input = String(value ?? '').trim();
  if (!input) return fallback;

  const sentences = input
    .split('. ')
    .filter((sentence) => !sentence.includes('PR-'))
    .filter((sentence) => !sentence.includes('PR '));

  const cleaned = sentences
    .join('. ')
    .replaceAll('SOG records', 'The archive records')
    .replaceAll('SOG treats', 'The archive classifies')
    .replaceAll('SOG separates', 'The archive distinguishes')
    .replaceAll('SOG keeps', 'The archive keeps')
    .replaceAll('source-backed', 'documented')
    .replaceAll('source-specific review', 'further review')
    .replaceAll('source-level review', 'further review')
    .replaceAll('known unknowns', 'open questions')
    .replaceAll('known unknown', 'open question')
    .replaceAll('lifecycle context', 'history')
    .replaceAll('source-review areas', 'areas needing further review')
    .replaceAll('source review needed', 'public information is incomplete')
    .trim();

  return cleaned || fallback;
}
