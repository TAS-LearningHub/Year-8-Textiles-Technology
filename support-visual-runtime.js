(function () {
  "use strict";

  const data = window.YEAR8_TEXTILES_VISUALS;
  if (!data || !Array.isArray(data.support)) return;

  const byId = Object.freeze(Object.fromEntries(data.support.map((visual) => [visual.id, visual])));

  const esc = (value) => String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  function render(id, options) {
    const visual = byId[id];
    if (!visual) return "";
    const prefix = options?.prefix || "";
    const label = options?.label || "Learning support visual";
    const file = `${prefix}${visual.file}`;
    return `<aside class="course-support-visual" data-support-visual="${esc(visual.id)}" aria-labelledby="${esc(visual.id)}-title">
      <header><p class="course-support-visual-label">${esc(label)}</p><h4 id="${esc(visual.id)}-title">${esc(visual.title)}</h4></header>
      <figure><img src="${esc(file)}" alt="${esc(visual.alt)}" loading="lazy" decoding="async"><figcaption>${esc(visual.caption)}</figcaption></figure>
      <p class="course-support-visual-notice"><strong>Notice:</strong> ${esc(visual.notice)}</p>
      <p><a href="${esc(file)}" target="_blank" rel="noopener" aria-label="Open larger view of ${esc(visual.title)}">Open this visual larger ↗</a></p>
    </aside>`;
  }

  window.Year8TextilesSupportVisuals = Object.freeze({ render, byId });
})();
