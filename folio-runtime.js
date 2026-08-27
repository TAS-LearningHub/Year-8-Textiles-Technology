(function () {
  "use strict";

  const data = window.YEAR8_TEXTILES_FOLIO_DATA;
  const mount = document.querySelector("[data-folio-app]");
  if (!data || !mount) return;

  const esc = (value) => String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const emptyText = () => ({ schemaVersion: data.schemaVersion, courseId: data.courseId, projectId: data.projectId, fields: {}, capstone: "", updatedAt: null });
  const emptyImages = () => ({ schemaVersion: data.schemaVersion, courseId: data.courseId, projectId: data.projectId, images: {}, updatedAt: null });
  const supportVisualByStage = Object.freeze({
    "stage-01-inspiration": "support-p06",
    "stage-03-front-back-design": "support-p05",
    "stage-07-progress-evidence": "support-p09"
  });

  function read(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      return parsed && parsed.courseId === data.courseId && parsed.projectId === data.projectId && Number(parsed.schemaVersion) === Number(data.schemaVersion) ? Object.assign(fallback(), parsed) : fallback();
    } catch (_error) { return fallback(); }
  }

  let textState = read(data.textStorageKey, emptyText);
  let imageState = read(data.imageStorageKey, emptyImages);
  textState.fields = textState.fields && typeof textState.fields === "object" ? textState.fields : {};
  imageState.images = imageState.images && typeof imageState.images === "object" ? imageState.images : {};
  let saveTimer = null;

  function store(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_error) { return false; }
  }

  function saveText(message) {
    textState.updatedAt = new Date().toISOString();
    const saved = store(data.textStorageKey, textState);
    status(message || (saved ? "Autosaved on this device." : "This browser could not save the latest writing."), !saved);
    updateProgress();
    return saved;
  }

  function saveImages(message) {
    imageState.updatedAt = new Date().toISOString();
    const saved = store(data.imageStorageKey, imageState);
    status(message || (saved ? "Image saved on this device." : "This browser could not save the image. Try a smaller file or export your work."), !saved);
    updateProgress();
    return saved;
  }

  function fieldValue(stageId, fieldId) {
    return textState.fields?.[stageId]?.[fieldId] || "";
  }

  function renderStage(stage) {
    const image = imageState.images[stage.id];
    const supportVisual = supportVisualByStage[stage.id] && window.Year8TextilesSupportVisuals
      ? window.Year8TextilesSupportVisuals.render(supportVisualByStage[stage.id], { label: "Folio evidence model" })
      : "";
    return `<details class="folio-stage" id="${esc(stage.id)}">
      <summary><span>Stage ${stage.number}</span><strong>${esc(stage.title)}</strong><small data-stage-summary="${esc(stage.id)}"></small></summary>
      <div class="folio-stage-body">
        <div class="folio-stage-orientation"><p><strong>Action:</strong> ${esc(stage.action)}</p><p><strong>Why:</strong> ${esc(stage.why)}</p><p><strong>Keep:</strong> ${esc(stage.evidence)}</p><p><strong>Think about:</strong> ${esc(stage.prompt)}</p></div>
        ${supportVisual}
        <div class="folio-field-grid">${stage.fields.map((field) => `<label class="folio-field"><span>${esc(field.label)}</span><textarea rows="5" data-folio-field data-stage-id="${esc(stage.id)}" data-field-id="${esc(field.id)}" data-min-words="${Number(field.minWords || 0)}" placeholder="${esc(field.placeholder)}">${esc(fieldValue(stage.id, field.id))}</textarea><small data-word-count>${wordCount(fieldValue(stage.id, field.id))} words${field.minWords ? ` · aim for at least ${field.minWords}` : ""}</small></label>`).join("")}</div>
        ${stage.image ? `<section class="folio-image-panel" data-image-stage="${esc(stage.id)}"><h3>${esc(stage.imageLabel || "Selected visual evidence")}</h3><p>${esc(data.orientation.imagePrivacy)}</p><label class="image-import">Choose a privacy-safe image<input type="file" accept="${esc(data.acceptedImageTypes.join(","))}" data-folio-image data-stage-id="${esc(stage.id)}"></label><div class="folio-image-preview">${image ? `<img src="${esc(image.dataUrl)}" alt="Imported evidence preview for ${esc(stage.title)}"><p>${esc(image.name)} · ${Math.round(image.size / 1024)} KB</p><button type="button" class="quiet-button" data-remove-image="${esc(stage.id)}">Remove this image</button>` : "<p>No image saved for this stage.</p>"}</div></section>` : ""}
        <details class="folio-support"><summary>Sentence support, theory and linked practice</summary><ul>${stage.support.map((item) => `<li>${esc(item)}</li>`).join("")}</ul><p><strong>Source boundary:</strong> ${esc(stage.source)}</p><p>${(stage.activityIds || []).map((id) => `<a href="activities.html#${esc(id)}">Open linked activity</a>`).join(" · ")}</p></details>
      </div>
    </details>`;
  }

  function wordCount(value) { return String(value || "").trim() ? String(value).trim().split(/\s+/).length : 0; }

  function render() {
    mount.innerHTML = `<section class="folio-orientation"><div><p class="eyebrow">Apparel project evidence</p><h2>Build a concise design story</h2><p>${esc(data.orientation.purpose)}</p><p>${esc(data.projectContext.folioFocus)}</p></div><div class="notice teacher"><strong>Working folio boundary</strong>${esc(data.orientation.assessmentBoundary)}</div></section>
      <section class="folio-toolbar" aria-label="Folio actions"><div><strong data-folio-progress>0 of 42 fields started</strong><span data-folio-status aria-live="polite">${textState.updatedAt ? "Saved work restored from this device." : "Not yet started."}</span></div><div class="button-row"><button type="button" class="button" data-save-folio>Save now</button><button type="button" class="quiet-button" data-export-backup>Download editable backup</button><label class="quiet-button file-button">Restore backup<input type="file" accept="application/json,.json" data-restore-backup></label><button type="button" class="quiet-button" data-export-html>Export self-contained folio</button><button type="button" class="quiet-button" data-print-folio>Print / PDF</button><button type="button" class="quiet-button danger" data-reset-folio>Reset folio</button></div></section>
      <nav class="folio-stage-nav" aria-label="Folio stages">${data.stages.map((stage) => `<a href="#${esc(stage.id)}">${stage.number}. ${esc(stage.title)}</a>`).join("")}</nav>
      <div class="folio-stages">${data.stages.map(renderStage).join("")}</div>
      <section class="folio-capstone" id="folio-capstone"><p class="section-label">${esc(data.capstone.label)}</p><h2>${esc(data.capstone.title)}</h2><p>${esc(data.capstone.prompt)}</p><ol>${data.capstone.scaffold.map((item) => `<li>${esc(item)}</li>`).join("")}</ol><label class="folio-field"><span>${esc(data.capstone.field.label)}</span><textarea rows="12" data-folio-capstone data-min-words="${data.capstone.field.minWords}" placeholder="${esc(data.capstone.field.placeholder)}">${esc(textState.capstone)}</textarea><small data-word-count>${wordCount(textState.capstone)} words · aim for at least ${data.capstone.field.minWords}</small></label><div class="success-criteria"><h3>Success criteria</h3><ul>${data.capstone.successCriteria.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div></section>
      <section class="notice teacher"><strong>Teacher to confirm</strong><ul>${data.teacherToConfirm.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>`;
    bind();
    updateProgress();
  }

  function collectField(target) {
    const stageId = target.dataset.stageId;
    const fieldId = target.dataset.fieldId;
    textState.fields[stageId] = textState.fields[stageId] || {};
    textState.fields[stageId][fieldId] = target.value;
    const count = wordCount(target.value);
    target.parentElement.querySelector("[data-word-count]").textContent = `${count} words${target.dataset.minWords ? ` · aim for at least ${target.dataset.minWords}` : ""}`;
  }

  function bind() {
    mount.addEventListener("input", (event) => {
      if (event.target.matches("[data-folio-field]")) collectField(event.target);
      if (event.target.matches("[data-folio-capstone]")) {
        textState.capstone = event.target.value;
        event.target.parentElement.querySelector("[data-word-count]").textContent = `${wordCount(event.target.value)} words · aim for at least ${event.target.dataset.minWords}`;
      }
      if (!event.target.matches("textarea")) return;
      status("Saving…");
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => saveText(), 400);
    });
    mount.addEventListener("change", (event) => {
      if (event.target.matches("[data-folio-image]")) importImage(event.target);
      if (event.target.matches("[data-restore-backup]")) restoreBackup(event.target.files?.[0]);
    });
    mount.addEventListener("click", (event) => {
      if (event.target.closest("[data-save-folio]")) saveText("Folio saved on this device.");
      if (event.target.closest("[data-export-backup]")) exportBackup();
      if (event.target.closest("[data-export-html]")) exportHtml();
      if (event.target.closest("[data-print-folio]")) window.print();
      if (event.target.closest("[data-reset-folio]")) resetFolio();
      const remove = event.target.closest("[data-remove-image]");
      if (remove) removeImage(remove.dataset.removeImage);
    });
  }

  function importImage(input) {
    const file = input.files?.[0];
    if (!file) return;
    if (!data.acceptedImageTypes.includes(file.type)) { status("Use a JPEG, PNG or WebP image.", true); input.value = ""; return; }
    if (file.size > data.maxImageBytes) { status(`That image is too large. Use a file under ${Math.round(data.maxImageBytes / 1024)} KB.`, true); input.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      imageState.images[input.dataset.stageId] = { name: file.name, type: file.type, size: file.size, dataUrl: reader.result };
      saveImages("Privacy-safe image saved on this device.");
      render();
      document.getElementById(input.dataset.stageId)?.setAttribute("open", "");
    };
    reader.readAsDataURL(file);
  }

  function removeImage(stageId) {
    if (!window.confirm("Remove this browser-local image from the folio stage? Your writing will stay.")) return;
    delete imageState.images[stageId];
    saveImages("Image removed from this device.");
    render();
    document.getElementById(stageId)?.setAttribute("open", "");
  }

  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a"); link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function exportBackup() {
    saveText();
    download("year-8-textiles-folio-editable-backup.json", JSON.stringify({ format: "year8textiles-folio-backup", exportedAt: new Date().toISOString(), text: textState, images: imageState }, null, 2), "application/json;charset=utf-8");
    status("Editable backup downloaded.");
  }

  function restoreBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const backup = JSON.parse(reader.result);
        if (backup.format !== "year8textiles-folio-backup" || backup.text?.courseId !== data.courseId || backup.text?.projectId !== data.projectId || Number(backup.text?.schemaVersion) > Number(data.schemaVersion)) throw new Error("wrong course or unsupported version");
        for (const image of Object.values(backup.images?.images || {})) {
          if (!data.acceptedImageTypes.includes(image.type) || Number(image.size) > data.maxImageBytes || !String(image.dataUrl || "").startsWith(`data:${image.type};base64,`)) throw new Error("invalid image record");
        }
        textState = Object.assign(emptyText(), backup.text); imageState = Object.assign(emptyImages(), backup.images || {});
        store(data.textStorageKey, textState); store(data.imageStorageKey, imageState); render(); status("Backup restored on this device.");
      } catch (_error) { status("This backup does not belong to the supported Year 8 Textiles folio or contains an invalid image.", true); }
    };
    reader.readAsText(file);
  }

  function exportHtml() {
    saveText();
    const stages = data.stages.map((stage) => {
      const image = imageState.images[stage.id];
      return `<section><h2>Stage ${stage.number}: ${esc(stage.title)}</h2><p><strong>Evidence:</strong> ${esc(stage.evidence)}</p>${stage.fields.map((field) => `<h3>${esc(field.label)}</h3><p>${esc(fieldValue(stage.id, field.id)).replace(/\n/g, "<br>") || "Not entered."}</p>`).join("")}${image ? `<img src="${esc(image.dataUrl)}" alt="Selected evidence for ${esc(stage.title)}">` : ""}</section>`;
    }).join("");
    const html = `<!doctype html><html lang="en-AU"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Year 8 Textiles folio export</title><style>body{max-width:900px;margin:auto;padding:32px;font:16px/1.55 Arial;color:#2f2330}section{margin:30px 0;padding:20px;border:1px solid #ddd;break-inside:avoid}img{max-width:100%;height:auto}h1,h2{color:#6f1f45}.boundary{padding:14px;background:#fff4d9}</style><body><h1>Year 8 Textiles Technology — folio export</h1><p class="boundary">${esc(data.orientation.assessmentBoundary)}</p>${stages}<section><h2>${esc(data.capstone.title)}</h2><p>${esc(textState.capstone).replace(/\n/g, "<br>") || "Not entered."}</p></section><p>Exported ${esc(new Date().toLocaleString("en-AU"))}. This file is not proof of submission.</p></body></html>`;
    download("year-8-textiles-folio-export.html", html, "text/html;charset=utf-8"); status("Self-contained folio export downloaded.");
  }

  function resetFolio() {
    const phrase = window.prompt(`Type ${data.persistenceAndExport.guardedResetPhrase} to clear this browser-local folio.`);
    if (phrase !== data.persistenceAndExport.guardedResetPhrase) { status("Reset cancelled. Nothing was changed."); return; }
    textState = emptyText(); imageState = emptyImages(); localStorage.removeItem(data.textStorageKey); localStorage.removeItem(data.imageStorageKey); render(); status("Browser-local folio reset.");
  }

  function status(message, isError) {
    const node = mount.querySelector("[data-folio-status]");
    if (!node) return;
    node.textContent = message; node.classList.toggle("is-error", Boolean(isError));
  }

  function updateProgress() {
    const fieldTotal = data.stages.reduce((sum, stage) => sum + stage.fields.length, 0);
    let started = 0;
    data.stages.forEach((stage) => {
      const done = stage.fields.filter((field) => fieldValue(stage.id, field.id).trim()).length;
      started += done;
      const node = mount.querySelector(`[data-stage-summary="${stage.id}"]`);
      if (node) node.textContent = `${done}/${stage.fields.length} fields · ${imageState.images[stage.id] ? "image saved" : stage.image ? "no image" : "text stage"}`;
    });
    const node = mount.querySelector("[data-folio-progress]");
    if (node) node.textContent = `${started} of ${fieldTotal} fields started · ${Object.keys(imageState.images).length} images · capstone ${textState.capstone.trim() ? "started" : "not started"}`;
  }

  render();
  if (window.location.hash) {
    const requested = document.querySelector(window.location.hash);
    if (requested instanceof HTMLDetailsElement && requested.classList.contains("folio-stage")) {
      requested.open = true;
      window.requestAnimationFrame(() => requested.querySelector("summary")?.focus());
    } else if (requested) {
      requested.setAttribute("tabindex", "-1");
      window.requestAnimationFrame(() => requested.focus());
    }
  }
})();
