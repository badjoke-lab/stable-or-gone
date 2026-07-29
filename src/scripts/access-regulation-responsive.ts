type ResponsiveLayerRecord = {
  section: HTMLElement;
  placeholder: Comment;
  details: HTMLDetailsElement;
  content: HTMLDivElement;
  heading: HTMLElement | null;
  summaryText: HTMLElement | null;
};

const explorer = document.querySelector<HTMLElement>('[data-ar-explorer]');

if (explorer) {
  const results = explorer.querySelector<HTMLElement>('[data-ar-results]');
  const media = window.matchMedia('(max-width: 640px)');
  let records: ResponsiveLayerRecord[] = [];

  const collapse = (record: ResponsiveLayerRecord) => {
    if (record.details.isConnected) return;
    record.heading?.setAttribute('hidden', '');
    record.summaryText?.setAttribute('hidden', '');
    record.section.before(record.placeholder);
    record.content.append(record.section);
    record.placeholder.after(record.details);
  };

  const restore = (record: ResponsiveLayerRecord) => {
    if (!record.details.isConnected) return;
    record.placeholder.after(record.section);
    record.details.remove();
    record.placeholder.remove();
    record.heading?.removeAttribute('hidden');
    record.summaryText?.removeAttribute('hidden');
  };

  const sync = () => {
    records = records.filter((record) => record.section.isConnected || record.details.isConnected || record.placeholder.isConnected);
    for (const record of records) {
      if (media.matches) collapse(record);
      else restore(record);
    }
  };

  const prepareCards = () => {
    explorer.querySelectorAll<HTMLElement>('.ar-result-card:not([data-ar-responsive-ready])').forEach((card) => {
      const layers = card.querySelector<HTMLElement>(':scope > .ar-card-layers');
      if (!layers) return;

      const secondaryLayers = Array.from(layers.querySelectorAll<HTMLElement>(':scope > .ar-card-layer')).slice(1);
      for (const section of secondaryLayers) {
        const heading = section.querySelector<HTMLElement>(':scope > h3');
        const summaryText = section.querySelector<HTMLElement>(':scope > .ar-layer-summary');
        const details = document.createElement('details');
        details.className = 'advanced-filter-disclosure ar-card-layer-disclosure';
        details.dataset.arLayerDisclosure = 'true';

        const summary = document.createElement('summary');
        const headingLabel = heading?.textContent?.trim() || 'Additional record layer';
        const stateLabel = summaryText?.textContent?.trim();
        summary.textContent = stateLabel ? `${headingLabel} — ${stateLabel}` : headingLabel;

        const content = document.createElement('div');
        content.className = 'ar-card-layer-disclosure__content';
        details.append(summary, content);

        records.push({
          section,
          placeholder: document.createComment('access-layer-placeholder'),
          details,
          content,
          heading,
          summaryText
        });
      }

      card.dataset.arResponsiveReady = 'true';
    });

    sync();
  };

  if (results) {
    const observer = new MutationObserver(prepareCards);
    observer.observe(results, { childList: true });
  }

  prepareCards();
  media.addEventListener?.('change', sync);
}
