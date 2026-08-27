(function () {
  "use strict";

  const data = window.YEAR8_TEXTILES_ASSESSMENT_DATA;
  const mount = document.querySelector("[data-assessment-app]");
  if (!data || !mount) return;

  const esc = (value) => String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const capstoneKey = data.capstone.storageKey;
  const ackKey = data.acknowledgement.storageKey;
  const supportVisualByArea = Object.freeze({
    "support-practical-projects": "support-p03",
    "support-design-folio": "support-p10"
  });
  let response = localStorage.getItem(capstoneKey) || "";
  let timer = null;

  function status(message, isError) {
    const node = mount.querySelector("[data-assessment-status]");
    if (!node) return;
    node.textContent = message;
    node.classList.toggle("is-error", Boolean(isError));
  }

  function saveResponse(message) {
    try {
      localStorage.setItem(capstoneKey, response);
      status(message || "Extended response autosaved on this device.");
    } catch (_error) { status("This browser could not save the latest response. Export or print it before leaving.", true); }
  }

  function wordCount(value) { return String(value).trim() ? String(value).trim().split(/\s+/).length : 0; }

  function render() {
    const ack = localStorage.getItem(ackKey);
    mount.innerHTML = `<section class="assessment-boundary notice teacher"><strong>${esc(data.pageStatus)}</strong><p>${esc(data.formalAuthorityBoundary.statement)}</p><p><strong>Do not:</strong> ${esc(data.formalAuthorityBoundary.doNotDo)}</p></section>
      <section class="section assessment-orientation"><div class="section-heading"><p class="eyebrow">What this page does</p><h2>Prepare useful evidence without inventing formal requirements</h2><p>${esc(data.orientation.purpose)}</p></div><div class="highlight-grid"><article class="card"><h3>Next useful action</h3><p>${esc(data.orientation.nextAction)}</p></article><article class="card"><h3>Support boundary</h3><p>${esc(data.orientation.supportBoundary)}</p></article><article class="card"><h3>Practical boundary</h3><p>${esc(data.orientation.practicalBoundary)}</p></article></div></section>
      <section class="section"><div class="section-heading"><p class="eyebrow">Authority check</p><h2>What is confirmed and what is not</h2></div><div class="status-grid">${data.confirmationStatus.map((item) => `<article class="status-card ${item.status === "Confirmed" || item.status.startsWith("Confirmed") ? "is-confirmed" : "needs-confirmation"}"><p>${esc(item.status)}</p><h3>${esc(item.domain)}</h3><span>${esc(item.detail)}</span></article>`).join("")}</div></section>
      <section class="section"><div class="section-heading"><p class="eyebrow">Learning-support categories</p><h2>Evidence worth keeping</h2><p>These are orientation categories, not a task notification or marking schedule.</p></div><div class="assessment-support-grid">${data.supportAreas.map((area) => `<article class="assessment-support-card" id="${esc(area.id)}"><p class="section-label">${esc(area.status)}</p><h3>${esc(area.title)}</h3><p>${esc(area.description)}</p>${supportVisualByArea[area.id] && window.Year8TextilesSupportVisuals ? window.Year8TextilesSupportVisuals.render(supportVisualByArea[area.id], { label: "Evidence organisation model" }) : ""}<h4>Useful evidence</h4><ul>${area.usefulEvidence.map((item) => `<li>${esc(item)}</li>`).join("")}</ul><p class="teacher-boundary"><strong>Boundary:</strong> ${esc(area.boundary)}</p>${area.folioStageIds ? `<p><a href="folio.html#${esc(area.folioStageIds[0])}">Open the related folio stage</a></p>` : ""}</article>`).join("")}</div></section>
      <section class="section assessment-capstone" id="assessment-support-capstone"><p class="section-label">${esc(data.capstone.status)}</p><h2>${esc(data.capstone.title)}</h2><p>${esc(data.capstone.prompt)}</p><ol>${data.capstone.scaffold.map((item) => `<li>${esc(item)}</li>`).join("")}</ol><label class="folio-field"><span>${esc(data.capstone.field.label)}</span><textarea rows="12" data-assessment-response placeholder="${esc(data.capstone.field.placeholder)}">${esc(response)}</textarea><small data-assessment-count>${wordCount(response)} words · aim for at least ${data.capstone.field.minWords}</small></label><div class="success-criteria"><h3>Success criteria</h3><ul>${data.capstone.successCriteria.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div><p class="teacher-boundary"><strong>Boundary:</strong> ${esc(data.capstone.boundary)}</p><div class="button-row"><button type="button" class="button" data-save-assessment>Save on this device</button><button type="button" class="quiet-button" data-export-assessment>Export response (.txt)</button><button type="button" class="quiet-button" data-print-assessment>Print / PDF</button><span data-assessment-status aria-live="polite">${response ? "Saved response restored from this device." : "Not yet started."}</span></div></section>
      <section class="section acknowledgement-panel"><h2>Read this orientation version</h2><label><input type="checkbox" data-assessment-ack ${ack === data.acknowledgement.version ? "checked" : ""}> <span>${esc(data.acknowledgement.label)}</span></label><p>${esc(data.acknowledgement.boundary)}</p></section>
      <section class="section policy-panel"><h2>Official school policy source</h2><p>${esc(data.policy.statement)}</p><p><a class="button" href="${esc(data.policy.sourceUrl)}" target="_blank" rel="noopener">Open ${esc(data.policy.sourceTitle)} ↗</a></p></section>
      <section class="section notice teacher"><strong>Wait for the current task notification</strong><p>${esc(data.teacherNotice)}</p></section>`;
    bind();
  }

  function bind() {
    const textarea = mount.querySelector("[data-assessment-response]");
    textarea.addEventListener("input", () => {
      response = textarea.value;
      mount.querySelector("[data-assessment-count]").textContent = `${wordCount(response)} words · aim for at least ${data.capstone.field.minWords}`;
      status("Saving…");
      clearTimeout(timer);
      timer = setTimeout(() => saveResponse(), 400);
    });
    mount.querySelector("[data-save-assessment]").addEventListener("click", () => saveResponse("Extended response saved on this device."));
    mount.querySelector("[data-export-assessment]").addEventListener("click", exportResponse);
    mount.querySelector("[data-print-assessment]").addEventListener("click", () => window.print());
    mount.querySelector("[data-assessment-ack]").addEventListener("change", (event) => {
      try {
        if (event.target.checked) localStorage.setItem(ackKey, data.acknowledgement.version);
        else localStorage.removeItem(ackKey);
        status(event.target.checked ? "Orientation version noted on this device." : "Browser-local acknowledgement cleared.");
      } catch (_error) { status("This browser could not save the acknowledgement.", true); }
    });
  }

  function exportResponse() {
    saveResponse();
    const lines = [data.capstone.title, "", data.capstone.prompt, "", "Response", response || "No response entered.", "", "Success criteria", ...data.capstone.successCriteria.map((item) => `- ${item}`), "", data.capstone.boundary, `Exported: ${new Date().toLocaleString("en-AU")}`];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "year-8-textiles-assessment-support-response.txt"; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 0);
    status("Response saved and exported.");
  }

  render();
})();
