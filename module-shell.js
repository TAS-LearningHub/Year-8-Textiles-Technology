(function () {
  "use strict";

  const config = window.YEAR8_TEXTILES_COURSE;
  const theoryData = window.TEXTILES_TECH_THEORY;
  const checkData = window.YEAR8_TEXTILES_CHECKS;
  const evidenceData = window.YEAR8_TEXTILES_EVIDENCE;
  const visuals = window.YEAR8_TEXTILES_VISUALS;
  const videoData = window.YEAR8_TEXTILES_VIDEOS;
  const presentations = window.YEAR8_TEXTILES_PRESENTATIONS || [];
  const activityData = window.YEAR8_TEXTILES_ACTIVITY_DATA;
  const host = document.querySelector("[data-module-host]");

  if (!host || !config) return;

  const esc = (value) => String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const pad = (value) => String(value).padStart(2, "0");
  const moduleKey = host.dataset.moduleId;
  const moduleId = Number(String(moduleKey).replace(/^m/i, ""));
  const moduleMeta = config.modules.find((item) => item.id === moduleKey || item.number === moduleId);

  function readRecord(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value && typeof value === "object" ? value : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeRecord(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function paragraphList(items) {
    const values = Array.isArray(items) ? items : [items].filter(Boolean);
    return values.map((item) => `<p>${esc(item)}</p>`).join("");
  }

  function slugify(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function renderFailure(message) {
    host.innerHTML = `<div class="page-shell"><div class="notice module-data-error" role="alert">
      <strong>This module could not load its learning package.</strong>
      ${esc(message)} Return to the course page and tell your teacher which module was open.
    </div><p><a href="../index.html#modules">Return to all modules</a></p></div>`;
  }

  if (!moduleMeta) {
    renderFailure("The module number does not match the course map.");
    return;
  }

  const sections = theoryData?.sections
    ?.filter((section) => section?.moduleId === moduleId && typeof section.sectionId === "string")
    .sort((a, b) => a.sectionId.localeCompare(b.sectionId)) || [];
  const sectionChecks = checkData?.checks?.filter((item) => typeof item?.sectionId === "string" && item.sectionId.startsWith(`m${pad(moduleId)}-`)) || [];
  const sectionEvidence = evidenceData?.sequences?.filter((item) => typeof item?.sectionId === "string" && item.sectionId.startsWith(`m${pad(moduleId)}-`)) || [];

  if (!theoryData || !checkData || !evidenceData || !visuals || !videoData || !activityData) {
    renderFailure("One or more course data files are unavailable.");
    return;
  }
  if (sections.length !== 3 || sectionChecks.length !== 3 || sectionEvidence.length !== 3) {
    renderFailure(`Expected three complete section packages but found ${sections.length} theory sections, ${sectionChecks.length} check sets and ${sectionEvidence.length} evidence sequences.`);
    return;
  }

  const visualList = Array.isArray(visuals) ? visuals : (Array.isArray(visuals.assets) ? visuals.assets : []);
  const modulePhotoCandidate = visuals.byModule?.[moduleKey] || visuals.byModule?.[moduleId] || visualList.find((visual) =>
    Number(visual.moduleId ?? visual.module) === moduleId && /hero|module-photo/i.test(String(visual.category || visual.role || visual.kind || ""))
  );
  const modulePhoto = modulePhotoCandidate?.allowedForIntegration === false ? null : modulePhotoCandidate;
  const presentationList = Array.isArray(presentations) ? presentations : (presentations.items || presentations.modules || []);
  const presentation = presentations.byModule?.[moduleKey] || presentations.byModule?.[moduleId] || presentations[moduleKey] || presentationList.find((item) =>
    item.moduleId === moduleId || item.moduleId === moduleKey || item.module === moduleId
  );
  const presentationFile = presentation?.href || presentation?.file || presentation?.downloadPath || presentation?.path || `assets/presentations/Year-8-Textiles-Technology-Module-${pad(moduleId)}-${slugify(moduleMeta.title)}.pptx`;
  const moduleActivities = Array.isArray(activityData.activities) ? activityData.activities.filter((activity) => activity?.module === moduleId) : [];
  const missingSectionParts = sections.filter((section) => {
    const checks = sectionChecks.find((item) => item.sectionId === section.sectionId);
    const evidence = sectionEvidence.find((item) => item.sectionId === section.sectionId);
    const visualCandidate = visuals.bySection?.[section.sectionId] || visualList.find((item) => item.sectionId === section.sectionId);
    const visual = visualCandidate?.allowedForIntegration === false ? null : visualCandidate;
    const activity = moduleActivities.find((item) => item.sectionId === section.sectionId);
    return !checks || checks.questions?.length !== 10 || !evidence?.capstone || !visual || !videoData.bySection?.[section.sectionId] || !activity;
  });

  if (!modulePhoto || !presentation || missingSectionParts.length) {
    renderFailure(`The integrated package is incomplete: ${!modulePhoto ? "module photo; " : ""}${!presentation ? "presentation; " : ""}${missingSectionParts.length ? `section package ${missingSectionParts.map((item) => item.sectionId).join(", ")}` : ""}.`);
    return;
  }

  host.innerHTML = `<div class="page-shell">
    <header class="page-intro module-intro-grid module-hero">
      <div><p class="eyebrow" data-module-kicker></p><h1 data-module-title></h1><p data-module-intro></p></div>
      <figure class="module-hero-visual" data-module-photo></figure>
    </header>
    <section class="presentation-card" id="module-presentation-${esc(moduleKey)}" data-module-presentation aria-labelledby="${esc(moduleKey)}-presentation-title">
      <div><p class="section-label">Editable teaching presentation</p><h2 id="${esc(moduleKey)}-presentation-title">Module ${pad(moduleId)} teaching slides</h2><p>Eight projection-ready slides with presenter notes and source records.</p></div>
      <a class="button" id="module-presentation-download-${esc(moduleKey)}" data-module-presentation-download download>Download PowerPoint</a>
    </section>
    <div class="learning-sections" data-module-content aria-label="Three connected learning sections"></div>
    <section class="module-progress" id="module-${pad(moduleId)}-review" data-module-progress aria-label="Module review and progress"></section>
    <div class="module-actions"><button type="button" data-print-module>Print this module</button><a class="button" href="../folio.html">Open my folio</a></div>
    <nav class="route-links" data-module-navigation aria-label="Module navigation"></nav>
  </div>`;

  document.title = `${moduleMeta.title} | ${config.title}`;
  host.querySelector("[data-module-kicker]").textContent = `Module ${pad(moduleId)} · ${moduleMeta.timing}`;
  host.querySelector("[data-module-title]").textContent = moduleMeta.title;
  host.querySelector("[data-module-intro]").textContent = "Work through the three connected sections in order. Each combines explanation, a purposeful visual, a complete media pathway and a closed learning drawer with ten checks, applied practice and saved written evidence.";

  const presentationLink = host.querySelector("[data-module-presentation-download]");
  presentationLink.href = `../${presentationFile}`;
  presentationLink.textContent = presentation.linkLabel || "Download PowerPoint";
  presentationLink.setAttribute("download", "");

  function renderModulePhoto() {
    const mount = host.querySelector("[data-module-photo]");
    if (!modulePhoto) {
      mount.hidden = true;
      return;
    }
    const file = modulePhoto.file || modulePhoto.destination || modulePhoto.path;
    mount.innerHTML = `
      <a href="../${esc(file)}" target="_blank" rel="noopener" aria-label="Open larger view of ${esc(modulePhoto.title || moduleMeta.title)}"><img src="../${esc(file)}" alt="${esc(modulePhoto.alt)}" width="1536" height="1024"></a>
      <figcaption><strong>${esc(modulePhoto.title || moduleMeta.title)}</strong><span>${esc(modulePhoto.caption || modulePhoto.teachingPurpose || "Open the image and notice the details connected to this module.")}</span>${modulePhoto.notice ? `<span class="module-hero-notice"><b>Notice:</b> ${esc(modulePhoto.notice)}</span>` : ""}<a class="module-hero-open" href="../${esc(file)}" target="_blank" rel="noopener">Open this visual larger ↗</a></figcaption>`;
  }

  function renderConceptBlocks(section) {
    return (section.conceptBlocks || []).map((block) => `
      <section class="theory-concept" id="${esc(block.anchor)}">
        <h3>${esc(block.heading)}</h3>
        ${paragraphList(block.paragraphs)}
      </section>`).join("");
  }

  function renderWorkedExample(example) {
    if (!example) return "";
    return `
      <section class="worked-example">
        <p class="section-label">Worked example</p>
        <h3>${esc(example.title)}</h3>
        ${example.scenario ? `<p>${esc(example.scenario)}</p>` : ""}
        ${Array.isArray(example.steps) ? `<ol>${example.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>` : ""}
        ${example.takeaway ? `<p class="takeaway"><strong>Takeaway:</strong> ${esc(example.takeaway)}</p>` : ""}
      </section>`;
  }

  function renderTheory(section) {
    return `
      <div class="theory-reading" id="${esc(section.sectionId)}-theory">
        ${paragraphList(section.studentIntro)}
        ${renderConceptBlocks(section)}
        ${renderWorkedExample(section.workedExample)}
        ${section.practicalLink ? `<section class="practical-link"><h3>${esc(section.practicalLink.heading)}</h3><p>${esc(section.practicalLink.body)}</p></section>` : ""}
        ${Array.isArray(section.summary) ? `<section class="theory-summary"><h3>Key ideas</h3><ul>${section.summary.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>` : ""}
        ${Array.isArray(section.vocabulary) ? `<section class="vocabulary"><h3>Vocabulary</h3><dl>${section.vocabulary.map((item) => `<div><dt>${esc(item.term)}</dt><dd>${esc(item.meaning)}</dd></div>`).join("")}</dl></section>` : ""}
        ${Array.isArray(section.misconceptions) ? `<section class="misconceptions"><h3>Check the idea</h3>${section.misconceptions.map((item) => `<div><p><strong>Common claim:</strong> ${esc(item.claim)}</p><p><strong>Correction:</strong> ${esc(item.correction)}</p></div>`).join("")}</section>` : ""}
      </div>`;
  }

  function renderSectionVisual(section) {
    const visualCandidate = visuals.bySection?.[section.sectionId] || visualList.find((item) => item.sectionId === section.sectionId);
    const visual = visualCandidate?.allowedForIntegration === false ? null : visualCandidate;
    if (!visual) return "";
    const file = visual.file || visual.destination || visual.path;
    return `
      <figure class="section-visual">
        <a href="../${esc(file)}" target="_blank" rel="noopener">
          <img src="../${esc(file)}" alt="${esc(visual.alt)}" loading="lazy">
        </a>
        <figcaption>
          <strong>${esc(visual.title || section.title)}</strong>
          <span>${esc(visual.caption || visual.teachingPurpose || "Use this image to find the evidence explained in the theory.")}</span>
          ${visual.notice ? `<small><strong>Notice:</strong> ${esc(visual.notice)}</small>` : ""}
          <a class="visual-open-link" href="../${esc(file)}" target="_blank" rel="noopener">Open this visual larger ↗</a>
        </figcaption>
      </figure>`;
  }

  function emptyCheckState(sectionId) {
    return { schemaVersion: 1, sectionId, answers: {}, checkedQuestionIds: [], results: {}, updatedAt: null };
  }

  function getCheckState(checkSet, sequence) {
    const key = sequence.recordSchema?.checkCompletionKey || `${config.storagePrefix}checks:${checkSet.sectionId}`;
    const current = readRecord(key, emptyCheckState(checkSet.sectionId));
    return {
      key,
      value: Object.assign(emptyCheckState(checkSet.sectionId), current, {
        answers: current.answers && typeof current.answers === "object" ? current.answers : {},
        results: current.results && typeof current.results === "object" ? current.results : {},
        checkedQuestionIds: Array.isArray(current.checkedQuestionIds) ? current.checkedQuestionIds : []
      })
    };
  }

  function feedbackMarkup(question, checkState) {
    if (!checkState.checkedQuestionIds.includes(question.id)) return "";
    const selectedId = checkState.answers[question.id];
    const option = question.options.find((item) => item.id === selectedId);
    if (!option) return "";
    return `<p class="check-feedback ${option.correct ? "is-correct" : "needs-review"}" role="status"><strong>${option.correct ? "Correct." : "Not yet."}</strong> ${esc(option.feedback)} <a href="#${esc(option.helpAnchor || question.theoryAnchor)}">Review the exact theory help.</a></p>`;
  }

  function renderChecks(checkSet, sequence) {
    const checkState = getCheckState(checkSet, sequence).value;
    return `
      <section class="knowledge-check" aria-labelledby="${esc(checkSet.knowledgeCheckId)}-title">
        <div class="package-heading">
          <p class="section-label">Formative learning evidence</p>
          <h3 id="${esc(checkSet.knowledgeCheckId)}-title">Ten-part knowledge check</h3>
          <p>Choose one answer, then check it. Feedback appears only after you check your selection.</p>
        </div>
        <div class="check-list">
          ${checkSet.questions.map((question, index) => `
            <fieldset class="check-question" data-question-id="${esc(question.id)}">
              <legend><span>${index + 1}</span>${esc(question.prompt)}</legend>
              <div class="check-options">
                ${question.options.map((option) => `<label><input type="radio" name="${esc(question.id)}" value="${esc(option.id)}"${checkState.answers[question.id] === option.id ? " checked" : ""}> <span>${esc(option.text)}</span></label>`).join("")}
              </div>
              <details class="check-hint"><summary>Need a hint?</summary><p>${esc(question.hint)}</p><a href="#${esc(question.theoryAnchor)}">Go to the exact theory help</a></details>
              <div class="check-actions"><button class="button secondary" type="button" data-check-question>Check this answer</button><span data-check-status aria-live="polite"></span></div>
              <div data-question-feedback>${feedbackMarkup(question, checkState)}</div>
            </fieldset>`).join("")}
        </div>
      </section>`;
  }

  function emptyEvidenceState(sectionId) {
    return { schemaVersion: 1, sectionId, selectedFocus: "", response: "", selfCheck: [], updatedAt: null };
  }

  function getEvidenceState(sequence) {
    const key = sequence.recordSchema?.capstoneKey || `${config.storagePrefix}capstone:${sequence.sectionId}`;
    const current = readRecord(key, emptyEvidenceState(sequence.sectionId));
    return {
      key,
      value: Object.assign(emptyEvidenceState(sequence.sectionId), current, {
        selfCheck: Array.isArray(current.selfCheck) ? current.selfCheck : []
      })
    };
  }

  function renderEvidence(sequence) {
    const state = getEvidenceState(sequence).value;
    const capstone = sequence.capstone;
    return `
      <section class="evidence-sequence" aria-labelledby="${esc(capstone.id)}-title" data-evidence-sequence="${esc(sequence.sectionId)}">
        <div class="package-heading">
          <p class="section-label">Saved formative learning evidence</p>
          <h3 id="${esc(capstone.id)}-title">${esc(capstone.title)}</h3>
          <p>${esc(sequence.disclaimer || evidenceData.disclaimer)}</p>
        </div>
        <div class="evidence-step">
          <span class="evidence-step-number" aria-hidden="true">1</span>
          <div><h4>Read</h4><p>${esc(capstone.prompt)}</p></div>
        </div>
        <fieldset class="evidence-step evidence-select">
          <legend><span class="evidence-step-number" aria-hidden="true">2</span><span><strong>Select</strong><small>Choose the planning step that will anchor your explanation.</small></span></legend>
          ${capstone.scaffold.map((item, index) => `<label><input type="radio" name="focus-${esc(sequence.sectionId)}" value="${index}"${String(state.selectedFocus) === String(index) ? " checked" : ""}> <span>${esc(item)}</span></label>`).join("")}
        </fieldset>
        <label class="evidence-step evidence-explain">
          <span class="evidence-step-number" aria-hidden="true">3</span>
          <span><strong>Explain</strong><small>${esc(capstone.typingNote || "Type your response. No drawing is required.")}</small></span>
          <textarea id="${esc(capstone.id)}" rows="10" data-evidence-response placeholder="${esc(capstone.sentenceStarters?.[0] || "Begin your explanation here…")}">${esc(state.response)}</textarea>
        </label>
        <fieldset class="evidence-step evidence-self-check">
          <legend><span class="evidence-step-number" aria-hidden="true">4</span><span><strong>Check</strong><small>Use every success criterion to review your explanation.</small></span></legend>
          ${capstone.successCriteria.map((criterion, index) => `<label><input type="checkbox" value="${index}"${state.selfCheck.includes(index) ? " checked" : ""}> <span>${esc(criterion)}</span></label>`).join("")}
        </fieldset>
        <div class="evidence-actions">
          <button class="button" type="button" data-save-evidence>Save on this device</button>
          <button class="button secondary" type="button" data-export-evidence>Export this evidence (.txt)</button>
          <button class="button secondary" type="button" data-print-module>Print this module</button>
          <button class="button secondary" type="button" data-reset-section>Reset only this section</button>
          <span data-evidence-status aria-live="polite">${state.updatedAt ? "Saved on this device." : "Not yet saved."}</span>
        </div>
      </section>`;
  }

  function renderSection(section, index) {
    const checks = sectionChecks.find((item) => item.sectionId === section.sectionId);
    const evidence = sectionEvidence.find((item) => item.sectionId === section.sectionId);
    return `
      <article class="learning-section learning-package" id="section-${index + 1}" data-section-container data-section-id="${esc(section.sectionId)}">
        <header class="learning-package-header">
          <p class="eyebrow">Section ${index + 1} of 3</p>
          <h2 id="${esc(section.sectionId)}-title">${esc(section.title)}</h2>
          <p>${esc(section.teachingPurpose)}</p>
        </header>
        ${renderTheory(section)}
        ${renderSectionVisual(section)}
        <div class="section-video-wrap">
          <div class="package-heading"><p class="section-label">Watch, notice and apply</p><h3>Section media pathway</h3></div>
          <div data-section-video="${esc(section.sectionId)}"></div>
        </div>
        <details class="learning-drawer" id="${esc(section.sectionId)}-learning-package">
          <summary>Learning activity ${moduleId}.${index + 1} · 10 questions + applied practice + written response</summary>
          <div class="learning-drawer-body">
            ${renderChecks(checks, evidence)}
            <section class="section-activity-wrap">
              <div class="package-heading"><p class="section-label">Applied learning activity</p><h3>Use the idea</h3></div>
              <div data-section-activity data-module-id="${moduleId}" data-section-title="${esc(section.title)}"></div>
            </section>
            ${renderEvidence(evidence)}
          </div>
        </details>
      </article>`;
  }

  function activityStatus(section) {
    const activity = moduleActivities.find((item) => item.sectionId === section.sectionId);
    const state = readRecord(activityData.storageKey, { checks: {} });
    const result = activity && state.checks ? state.checks[activity.id] : null;
    return result ? { complete: Number(result.correct) === Number(result.total), text: `${result.correct} of ${result.total} correct` } : { complete: false, text: "Not checked" };
  }

  function evidenceStatus(sequence) {
    const state = getEvidenceState(sequence).value;
    const allChecked = sequence.capstone.successCriteria.every((criterion, index) => state.selfCheck.includes(index));
    const complete = state.selectedFocus !== "" && state.response.trim().length > 0 && allChecked;
    return { complete, text: complete ? "Read → Select → Explain → Check complete" : state.response.trim() ? "Saved response to revisit" : "Not started" };
  }

  function updateProgress() {
    let completedParts = 0;
    const totalParts = sections.length * 12;
    const rows = sections.map((section, index) => {
      const checks = sectionChecks.find((item) => item.sectionId === section.sectionId);
      const sequence = sectionEvidence.find((item) => item.sectionId === section.sectionId);
      const checkState = getCheckState(checks, sequence).value;
      const checkedCount = checkState.checkedQuestionIds.filter((id) => checks.questions.some((question) => question.id === id)).length;
      const evidence = evidenceStatus(sequence);
      const activity = activityStatus(section);
      completedParts += checkedCount + Number(evidence.complete) + Number(activity.complete);
      return `<li><a href="#${esc(section.sectionId)}-learning-package" data-open-package="${esc(section.sectionId)}-learning-package">${esc(section.title)}</a><span>${checkedCount}/10 checks · ${esc(evidence.text)} · activity ${esc(activity.text)}</span></li>`;
    }).join("");
    const percent = Math.round((completedParts / totalParts) * 100);
    host.querySelector("[data-module-progress]").innerHTML = `
      <h2>Module progress</h2>
      <div class="progress-track" role="progressbar" aria-label="Module learning progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div>
      <p><strong>${percent}%</strong> of the saved formative steps currently complete on this device.</p>
      <ol class="module-progress-list">${rows}</ol>
      <p class="device-note">Progress is browser-local formative evidence. It is not submission or teacher-observed practical evidence.</p>`;
  }

  function bindChecks() {
    host.querySelectorAll(".learning-package").forEach((article) => {
      const sectionId = article.dataset.sectionId;
      const checks = sectionChecks.find((item) => item.sectionId === sectionId);
      const sequence = sectionEvidence.find((item) => item.sectionId === sectionId);
      const record = getCheckState(checks, sequence);

      article.querySelectorAll(".check-question").forEach((questionNode) => {
        const question = checks.questions.find((item) => item.id === questionNode.dataset.questionId);
        questionNode.addEventListener("change", (event) => {
          if (!event.target.matches('input[type="radio"]')) return;
          record.value.answers[question.id] = event.target.value;
          record.value.checkedQuestionIds = record.value.checkedQuestionIds.filter((id) => id !== question.id);
          delete record.value.results[question.id];
          record.value.updatedAt = new Date().toISOString();
          writeRecord(record.key, record.value);
          questionNode.querySelector("[data-question-feedback]").replaceChildren();
          questionNode.querySelector("[data-check-status]").textContent = "Selection saved. Check it when ready.";
          updateProgress();
        });
        questionNode.querySelector("[data-check-question]").addEventListener("click", () => {
          const selected = questionNode.querySelector('input[type="radio"]:checked');
          const status = questionNode.querySelector("[data-check-status]");
          if (!selected) {
            status.textContent = "Choose an answer first.";
            return;
          }
          const option = question.options.find((item) => item.id === selected.value);
          record.value.answers[question.id] = selected.value;
          if (!record.value.checkedQuestionIds.includes(question.id)) record.value.checkedQuestionIds.push(question.id);
          record.value.results[question.id] = { optionId: selected.value, correct: Boolean(option.correct) };
          record.value.updatedAt = new Date().toISOString();
          const saved = writeRecord(record.key, record.value);
          questionNode.querySelector("[data-question-feedback]").innerHTML = feedbackMarkup(question, record.value);
          status.textContent = saved ? "Checked and saved on this device." : "Checked, but this browser could not save it.";
          updateProgress();
        });
      });
    });
  }

  function bindEvidence() {
    host.querySelectorAll("[data-evidence-sequence]").forEach((panel) => {
      const sectionId = panel.dataset.evidenceSequence;
      const sequence = sectionEvidence.find((item) => item.sectionId === sectionId);
      const record = getEvidenceState(sequence);
      const status = panel.querySelector("[data-evidence-status]");
      const response = panel.querySelector("[data-evidence-response]");
      let saveTimer = null;

      const collect = () => {
        record.value.selectedFocus = panel.querySelector('input[type="radio"]:checked')?.value || "";
        record.value.response = response.value;
        record.value.selfCheck = [...panel.querySelectorAll('.evidence-self-check input[type="checkbox"]:checked')].map((input) => Number(input.value));
        record.value.updatedAt = new Date().toISOString();
      };
      const exportEvidence = () => {
        const capstone = sequence.capstone;
        const focusIndex = Number(record.value.selectedFocus);
        const focus = Number.isInteger(focusIndex) && capstone.scaffold[focusIndex] ? capstone.scaffold[focusIndex] : "Not selected";
        const lines = [
          `${sequence.title} — formative learning evidence`,
          "",
          "Planning focus",
          focus,
          "",
          "Explanation",
          record.value.response || "No response saved.",
          "",
          "Self-check",
          ...capstone.successCriteria.map((criterion, index) => `${record.value.selfCheck.includes(index) ? "[x]" : "[ ]"} ${criterion}`),
          "",
          sequence.disclaimer || evidenceData.disclaimer,
          `Exported: ${new Date().toLocaleString("en-AU")}`
        ];
        const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `year-8-textiles-technology-${sequence.sectionId}-formative-evidence.txt`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 0);
      };
      panel.addEventListener("change", () => {
        collect();
        const saved = writeRecord(record.key, record.value);
        status.textContent = saved ? "Saved on this device." : "This browser could not save the latest change.";
        updateProgress();
      });
      response.addEventListener("input", () => {
        status.textContent = "Saving…";
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(() => {
          collect();
          const saved = writeRecord(record.key, record.value);
          status.textContent = saved ? "Autosaved on this device." : "This browser could not save the latest typing.";
          updateProgress();
        }, 350);
      });
      panel.querySelector("[data-save-evidence]").addEventListener("click", () => {
        collect();
        const saved = writeRecord(record.key, record.value);
        status.textContent = saved ? "Saved on this device. You can revisit and improve it." : "This browser could not save the response. Print it before leaving.";
        updateProgress();
      });
      panel.querySelector("[data-export-evidence]").addEventListener("click", () => {
        collect();
        const saved = writeRecord(record.key, record.value);
        exportEvidence();
        status.textContent = saved ? "Saved and exported as a text file." : "Exported, but this browser could not update its saved copy.";
        updateProgress();
      });
      panel.querySelector("[data-reset-section]").addEventListener("click", () => {
        const confirmed = window.confirm("Reset the knowledge check, applied activity and long response for this section only? Other sections will stay saved.");
        if (!confirmed) return;

        const check = sectionChecks.find((item) => item.sectionId === sectionId);
        if (check) localStorage.removeItem(getCheckState(check, sequence).key);
        localStorage.removeItem(record.key);

        const activity = moduleActivities.find((item) => item.sectionId === sectionId);
        if (activity) {
          const activityState = readRecord(activityData.storageKey, {
            schemaVersion: activityData.schemaVersion,
            courseId: activityData.courseId,
            responses: {},
            checks: {},
            updatedAt: null
          });
          if (activityState.responses && typeof activityState.responses === "object") delete activityState.responses[activity.id];
          if (activityState.checks && typeof activityState.checks === "object") delete activityState.checks[activity.id];
          activityState.updatedAt = new Date().toISOString();
          writeRecord(activityData.storageKey, activityState);
        }

        window.location.reload();
      });
    });
  }

  function renderNavigation() {
    const previous = config.modules.find((item) => item.number === moduleId - 1);
    const next = config.modules.find((item) => item.number === moduleId + 1);
    const links = [];
    if (previous) links.push(`<a href="../${esc(previous.route)}">← Module ${pad(previous.number)} · ${esc(previous.title)}</a>`);
    links.push('<a href="../index.html#modules">All modules</a>');
    if (next) links.push(`<a href="../${esc(next.route)}">Module ${pad(next.number)} · ${esc(next.title)} →</a>`);
    host.querySelector("[data-module-navigation]").innerHTML = links.join("");
  }

  renderModulePhoto();
  host.querySelector("[data-module-content]").innerHTML = sections.map(renderSection).join("");
  renderNavigation();
  bindChecks();
  bindEvidence();
  updateProgress();

  function openRequestedPackage() {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!(target instanceof HTMLDetailsElement) || !target.classList.contains("learning-drawer")) return;
    target.open = true;
    window.requestAnimationFrame(() => target.querySelector("summary")?.focus());
  }
  openRequestedPackage();

  document.addEventListener("click", (event) => {
    const packageLink = event.target.closest("[data-open-package]");
    if (packageLink) {
      const details = document.getElementById(packageLink.dataset.openPackage);
      if (details instanceof HTMLDetailsElement) {
        details.open = true;
        window.requestAnimationFrame(() => details.querySelector("summary")?.focus());
      }
    }
    if (event.target.closest("[data-print-module]")) window.print();
    if (event.target.closest("[data-section-activity]")) window.setTimeout(updateProgress, 80);
  });
  document.addEventListener("change", (event) => {
    if (event.target.closest("[data-section-activity]")) window.setTimeout(updateProgress, 80);
  });
})();
