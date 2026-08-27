(function () {
  "use strict";

  const data = window.YEAR8_TEXTILES_ACTIVITY_DATA;
  if (!data) return;

  const supportVisualByActivity = Object.freeze({
    "act-02-m01-s02": "support-p01",
    "act-06-m02-s03": "support-p02",
    "act-18-m06-s03": "support-p04",
    "act-21-m07-s03": "support-p07",
    "act-24-m08-s03": "support-p08"
  });

  const state = loadState();
  let activeFilter = "all";
  let searchTerm = "";

  function emptyState() {
    return {
      schemaVersion: data.schemaVersion,
      courseId: data.courseId,
      responses: {},
      checks: {},
      updatedAt: null
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(data.storageKey) || "null");
      if (!parsed || parsed.courseId !== data.courseId || Number(parsed.schemaVersion) !== data.schemaVersion) return emptyState();
      return Object.assign(emptyState(), parsed, {
        responses: parsed.responses && typeof parsed.responses === "object" ? parsed.responses : {},
        checks: parsed.checks && typeof parsed.checks === "object" ? parsed.checks : {}
      });
    } catch (error) {
      return emptyState();
    }
  }

  function saveState(message) {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(data.storageKey, JSON.stringify(state));
      updateSummary(message || "Practice saved in this browser.");
    } catch (error) {
      updateSummary("This browser could not save the latest practice. Export or print any work you need to keep.", true);
    }
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderActivitySupportVisual(activity, embedded) {
    if (embedded) return "";
    const visualId = supportVisualByActivity[activity.id];
    if (!visualId || !window.Year8TextilesSupportVisuals) return "";
    return window.Year8TextilesSupportVisuals.render(visualId, { label: "Visual evidence prompt" });
  }

  function responseFor(activityId) {
    if (!state.responses[activityId] || typeof state.responses[activityId] !== "object") state.responses[activityId] = {};
    return state.responses[activityId];
  }

  function normalise(value) {
    return String(value || "").trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, " ");
  }

  function activityById(id) {
    return data.activities.find((activity) => activity.id === id);
  }

  function renderChoices(activity, item) {
    const current = responseFor(activity.id)[item.id] || "";
    const choices = item.choices || activity.choices || [];
    if (activity.mechanic === "scenario") {
      return `<fieldset class="ala-choice-set"><legend>${esc(item.prompt)}</legend>${choices.map((choice) => `<label><input type="radio" name="${esc(activity.id)}-${esc(item.id)}" data-activity="${esc(activity.id)}" data-item="${esc(item.id)}" value="${esc(choice)}"${current === choice ? " checked" : ""}> <span>${esc(choice)}</span></label>`).join("")}<p class="ala-item-feedback" data-feedback="${esc(item.id)}" aria-live="polite"></p></fieldset>`;
    }
    return `<label class="ala-field"><span>${esc(item.prompt)}</span><select data-activity="${esc(activity.id)}" data-item="${esc(item.id)}"><option value="">Choose…</option>${choices.map((choice) => `<option value="${esc(choice)}"${current === choice ? " selected" : ""}>${esc(choice)}</option>`).join("")}</select><small class="ala-item-feedback" data-feedback="${esc(item.id)}" aria-live="polite"></small></label>`;
  }

  function renderSequence(activity) {
    const response = responseFor(activity.id);
    const order = Array.isArray(response.order) && response.order.length === activity.items.length ? response.order : activity.startOrder.slice();
    response.order = order;
    const itemMap = Object.fromEntries(activity.items.map((item) => [item.id, item]));
    return `<ol class="ala-sequence" data-sequence="${esc(activity.id)}">${order.map((id, index) => `<li data-sequence-item="${esc(id)}"><span>${esc(itemMap[id].text)}</span><span class="ala-move"><button type="button" data-move="up" aria-label="Move step ${index + 1} up"${index === 0 ? " disabled" : ""}>↑</button><button type="button" data-move="down" aria-label="Move step ${index + 1} down"${index === order.length - 1 ? " disabled" : ""}>↓</button></span></li>`).join("")}</ol><p class="ala-item-feedback" data-sequence-feedback aria-live="polite"></p>`;
  }

  function renderRetrieve(activity) {
    const response = responseFor(activity.id);
    return `<div class="ala-fields">${activity.items.map((item) => `<label class="ala-field"><span>${esc(item.prompt)}</span><input type="text" inputmode="decimal" autocomplete="off" data-activity="${esc(activity.id)}" data-item="${esc(item.id)}" value="${esc(response[item.id] || "")}"><small class="ala-item-feedback" data-feedback="${esc(item.id)}" aria-live="polite"></small></label>`).join("")}</div>`;
  }

  function renderChecklist(activity) {
    const response = responseFor(activity.id);
    return `<fieldset class="ala-checklist"><legend>${esc(activity.prompt)}</legend>${activity.items.map((item) => `<label><input type="checkbox" data-activity="${esc(activity.id)}" data-item="${esc(item.id)}"${response[item.id] === true ? " checked" : ""}> <span>${esc(item.text)}</span></label><small class="ala-item-feedback" data-feedback="${esc(item.id)}" aria-live="polite"></small>`).join("")}</fieldset>`;
  }

  function renderInteraction(activity) {
    if (activity.mechanic === "sequence") return renderSequence(activity);
    if (activity.mechanic === "retrieve") return renderRetrieve(activity);
    if (activity.mechanic === "checklist") return renderChecklist(activity);
    return `<div class="ala-fields">${activity.items.map((item) => renderChoices(activity, item)).join("")}</div>`;
  }

  function renderCard(activity, options) {
    const embedded = Boolean(options && options.embedded);
    const result = state.checks[activity.id];
    return `<article class="ala-card" id="${esc(activity.id)}" data-module="${activity.module}">
      <header class="ala-card-head">
        <div><p class="ala-meta">Module ${activity.module} · ${esc(activity.section)}</p><h3>${esc(activity.title)}</h3></div>
        <span class="ala-mechanic">${esc(activity.mechanic)}</span>
      </header>
      <p><strong>Practise:</strong> ${esc(activity.practises)}</p>
      <p class="ala-instructions">${esc(activity.instructions)}</p>
      ${renderActivitySupportVisual(activity, embedded)}
      ${renderInteraction(activity)}
      <div class="ala-actions"><button class="button" type="button" data-action="check" data-activity-id="${esc(activity.id)}">Check practice</button><button type="button" class="ala-quiet" data-action="print" data-activity-id="${esc(activity.id)}">Print this activity</button><button type="button" class="ala-quiet" data-action="reset" data-activity-id="${esc(activity.id)}">Reset</button></div>
      <p class="ala-result${result ? (result.correct === result.total ? " is-success" : " needs-review") : ""}" data-result aria-live="polite">${result ? `${result.correct} of ${result.total} correct on the latest check.` : "Not checked yet."}</p>
      <details class="ala-support"><summary>Lesson placement and printable option</summary><p><strong>Where:</strong> ${esc(activity.placement)}</p><p><strong>Printable alternative:</strong> ${esc(activity.printable)}</p></details>
      ${embedded ? `<p class="ala-bank-return"><a href="${window.location.pathname.includes("/modules/") ? "../" : ""}${esc(data.bankRoute)}#${esc(activity.id)}">Open this activity in the complete course bank</a></p>` : ""}
    </article>`;
  }

  function visibleActivities() {
    return data.activities.filter((activity) => {
      const moduleMatch = activeFilter === "all" || String(activity.module) === activeFilter;
      const haystack = `${activity.title} ${activity.section} ${activity.practises}`.toLowerCase();
      return moduleMatch && (!searchTerm || haystack.includes(searchTerm));
    });
  }

  function renderBank() {
    const slot = document.querySelector('[data-owner="stage-10"]');
    if (!slot) return;
    slot.classList.remove("integration-slot");
    slot.classList.add("ala-bank");
    slot.innerHTML = `<div class="ala-orientation"><span class="slot-label">Applied learning</span><h2>Practise the concept, then apply it</h2><p>These short activities rehearse the exact ideas used in lessons and the textiles projects. Results save only in this browser and remain formative practice.</p><div class="notice"><strong>Evidence boundary</strong>${esc(data.recordBoundary)}</div></div>
      <div class="ala-toolbar"><label>Module filter<select id="ala-module-filter"><option value="all">All modules</option>${Array.from({ length: 10 }, (_, index) => `<option value="${index + 1}">Module ${index + 1}</option>`).join("")}</select></label><label>Find an activity<input id="ala-search" type="search" placeholder="e.g. pattern or materials"></label><button type="button" class="ala-quiet" data-action="reset-all">Reset all practice</button></div>
      <p id="ala-summary" class="ala-summary" role="status"></p><div id="ala-cards" class="ala-cards"></div>`;
    document.getElementById("ala-module-filter").value = activeFilter;
    document.getElementById("ala-search").value = searchTerm;
    renderCards();
    bindBank();
    updateSummary();
  }

  function renderCards() {
    const cards = document.getElementById("ala-cards");
    if (!cards) return;
    const list = visibleActivities();
    cards.innerHTML = list.length ? list.map((activity) => renderCard(activity, { embedded: false })).join("") : '<div class="notice"><strong>No matching activity</strong>Clear the search or choose another module.</div>';
  }

  function bindInteractiveRoot(root) {
    if (!root || root.dataset.activityRuntimeBound === "true") return;
    root.dataset.activityRuntimeBound = "true";
    root.addEventListener("input", handleInput);
    root.addEventListener("change", handleInput);
    root.addEventListener("click", handleClick);
  }

  function bindBank() {
    bindInteractiveRoot(document.querySelector(".ala-bank"));
  }

  function handleInput(event) {
    if (event.target.id === "ala-module-filter") {
      activeFilter = event.target.value;
      renderCards();
      return;
    }
    if (event.target.id === "ala-search") {
      searchTerm = event.target.value.trim().toLowerCase();
      renderCards();
      return;
    }
    const activityId = event.target.dataset.activity;
    const itemId = event.target.dataset.item;
    if (!activityId || !itemId) return;
    const response = responseFor(activityId);
    response[itemId] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    saveState();
  }

  function handleClick(event) {
    const moveButton = event.target.closest("button[data-move]");
    if (moveButton) {
      moveSequence(moveButton);
      return;
    }
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const activityId = button.dataset.activityId;
    if (action === "check") checkActivity(activityId);
    if (action === "reset") resetActivity(activityId);
    if (action === "print") printActivity(activityId);
    if (action === "reset-all") resetAll();
  }

  function moveSequence(button) {
    const list = button.closest("ol[data-sequence]");
    const row = button.closest("li");
    if (!list || !row) return;
    const activityId = list.dataset.sequence;
    const rows = Array.from(list.children);
    const index = rows.indexOf(row);
    const nextIndex = button.dataset.move === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= rows.length) return;
    if (nextIndex < index) list.insertBefore(row, rows[nextIndex]);
    else list.insertBefore(rows[nextIndex], row);
    responseFor(activityId).order = Array.from(list.children).map((item) => item.dataset.sequenceItem);
    Array.from(list.children).forEach((item, itemIndex, allItems) => {
      const up = item.querySelector('button[data-move="up"]');
      const down = item.querySelector('button[data-move="down"]');
      if (up) {
        up.disabled = itemIndex === 0;
        up.setAttribute("aria-label", `Move step ${itemIndex + 1} up`);
      }
      if (down) {
        down.disabled = itemIndex === allItems.length - 1;
        down.setAttribute("aria-label", `Move step ${itemIndex + 1} down`);
      }
    });
    saveState();
    const moved = list.querySelector(`[data-sequence-item="${CSS.escape(row.dataset.sequenceItem)}"]`);
    if (moved) moved.querySelector("button")?.focus();
  }

  function checkActivity(activityId) {
    const activity = activityById(activityId);
    const card = document.getElementById(activityId);
    if (!activity || !card) return;
    const response = responseFor(activityId);
    let correct = 0;
    let total = activity.items.length;

    if (activity.mechanic === "sequence") {
      const order = Array.from(card.querySelectorAll("[data-sequence-item]")).map((item) => item.dataset.sequenceItem);
      response.order = order;
      correct = order.filter((id, index) => id === activity.correctOrder[index]).length;
      const feedback = card.querySelector("[data-sequence-feedback]");
      feedback.textContent = correct === total ? activity.success : activity.review;
      feedback.className = `ala-item-feedback ${correct === total ? "is-correct" : "needs-review"}`;
    } else {
      activity.items.forEach((item) => {
        let itemCorrect = false;
        if (activity.mechanic === "retrieve") {
          const accepted = item.answers.map(normalise);
          itemCorrect = accepted.includes(normalise(response[item.id]));
        } else if (activity.mechanic === "checklist") {
          itemCorrect = Boolean(response[item.id]) === Boolean(item.correct);
        } else {
          itemCorrect = response[item.id] === item.answer;
        }
        if (itemCorrect) correct += 1;
        const feedback = card.querySelector(`[data-feedback="${CSS.escape(item.id)}"]`);
        if (feedback) {
          feedback.textContent = itemCorrect ? "Correct." : `Review: ${item.hint}`;
          feedback.className = `ala-item-feedback ${itemCorrect ? "is-correct" : "needs-review"}`;
        }
      });
    }

    state.checks[activityId] = { correct, total, attemptedAt: new Date().toISOString() };
    const result = card.querySelector("[data-result]");
    result.textContent = correct === total ? activity.success : `${correct} of ${total} correct. ${activity.review}`;
    result.className = `ala-result ${correct === total ? "is-success" : "needs-review"}`;
    saveState();
  }

  function resetActivity(activityId) {
    const activity = activityById(activityId);
    if (!activity || !window.confirm(`Reset the saved formative practice for “${activity.title}”?`)) return;
    delete state.responses[activityId];
    delete state.checks[activityId];
    saveState("This activity was reset on this device.");
    rerenderActivity(activityId);
  }

  function resetAll() {
    if (!window.confirm("Reset all saved applied-learning practice on this device? Folio and assessment records are separate and will not be changed.")) return;
    state.responses = {};
    state.checks = {};
    saveState("All formative practice was reset on this device.");
    renderCards();
  }

  function printActivity(activityId) {
    const target = document.getElementById(activityId);
    if (!target) return;
    target.classList.add("ala-print-target");
    document.body.dataset.printActivity = activityId;
    document.body.classList.add("ala-print-one");
    window.print();
    window.setTimeout(() => {
      document.body.classList.remove("ala-print-one");
      delete document.body.dataset.printActivity;
      target.classList.remove("ala-print-target");
    }, 250);
  }

  function preparePrintDetails() {
    document.querySelectorAll(".ala-support").forEach((details) => {
      details.dataset.wasOpenBeforePrint = details.open ? "true" : "false";
      details.open = true;
    });
  }

  function restorePrintDetails() {
    document.querySelectorAll(".ala-support").forEach((details) => {
      if (details.dataset.wasOpenBeforePrint === "false") details.open = false;
      delete details.dataset.wasOpenBeforePrint;
    });
  }

  function updateSummary(message, isError) {
    const summary = document.getElementById("ala-summary");
    if (!summary) return;
    const attempted = Object.keys(state.checks).length;
    const mastered = Object.values(state.checks).filter((result) => result.correct === result.total).length;
    summary.textContent = message || `${attempted} of ${data.activities.length} activities checked · ${mastered} currently fully correct · browser-local formative record only.`;
    summary.classList.toggle("is-error", Boolean(isError));
  }

  function renderModuleSummary(container, moduleId) {
    if (!container) return;
    const list = data.activities.filter((activity) => activity.module === Number(moduleId));
    container.innerHTML = `<section class="ala-module-links"><h3>Applied practice</h3><p>Try these before the longer lesson response.</p><ul>${list.map((activity) => `<li><a href="../activities.html#${esc(activity.id)}">${esc(activity.title)}</a> <span>${esc(activity.mechanic)}</span></li>`).join("")}</ul><p class="ala-boundary">${esc(data.recordBoundary)}</p></section>`;
  }

  function normaliseSection(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function findSectionActivity(moduleId, sectionTitle) {
    const moduleNumber = Number(moduleId);
    const wanted = normaliseSection(sectionTitle);
    return data.activities.find((activity) => activity.module === moduleNumber && normaliseSection(activity.section) === wanted) || null;
  }

  function renderSectionActivity(container, moduleId, sectionTitle) {
    if (!container) return null;
    const activity = findSectionActivity(moduleId, sectionTitle);
    container.classList.add("ala-embedded");
    if (!activity) {
      container.innerHTML = `<div class="notice teacher"><strong>Activity not mapped</strong>No applied activity matches Module ${esc(moduleId)} · ${esc(sectionTitle)}. Check the frozen section title rather than substituting generic practice.</div>`;
      return null;
    }
    container.dataset.activityId = activity.id;
    container.innerHTML = renderCard(activity, { embedded: true });
    bindInteractiveRoot(container);
    return activity.id;
  }

  function rerenderActivity(activityId) {
    const current = document.getElementById(activityId);
    const embeddedMount = current?.closest("[data-section-activity]");
    if (embeddedMount) {
      const activity = activityById(activityId);
      embeddedMount.innerHTML = renderCard(activity, { embedded: true });
      return;
    }
    renderCards();
  }

  function mountEmbeddedActivities() {
    document.querySelectorAll("[data-section-activity]").forEach((container) => {
      const moduleId = container.dataset.moduleId;
      const sectionTitle = container.dataset.sectionTitle;
      renderSectionActivity(container, moduleId, sectionTitle);
    });
  }

  function injectStyles() {
    if (document.getElementById("ala-owned-styles")) return;
    const style = document.createElement("style");
    style.id = "ala-owned-styles";
    style.textContent = `
      .ala-bank{margin-top:3rem}.ala-embedded{margin:1.4rem 0}.ala-embedded .ala-card{border-top:6px solid var(--gold)}.ala-bank-return{margin:.8rem 0 0;font-weight:780}.ala-orientation{max-width:80ch}.ala-toolbar{display:grid;grid-template-columns:minmax(170px,.45fr) minmax(220px,1fr) auto;gap:1rem;align-items:end;margin:1.5rem 0;padding:1rem;background:#faedf3;border:1px solid var(--line);border-radius:var(--radius-md)}
      .process-visuals{margin:1.5rem 0 2rem;padding-top:1.2rem;border-top:1px solid var(--line)}.process-visuals-intro{max-width:82ch}.process-visuals-intro h3{margin:.2rem 0;font-size:1.65rem}.process-visual-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin-top:1rem}.process-visual-card{display:flex;min-width:0;flex-direction:column;padding:1rem;border:1px solid var(--line);border-radius:var(--radius-md);background:#fff;box-shadow:0 6px 18px rgba(35,60,45,.06)}.process-visual-card header h3{margin:.15rem 0;font-size:1.25rem}.process-visual-meta{margin:0;color:var(--muted);font-size:.78rem;font-weight:850;letter-spacing:.04em;text-transform:uppercase}.process-visual-purpose{margin:.55rem 0}.process-visual-figure{margin:.5rem 0}.process-visual-figure img{display:block;width:100%;height:auto;border:1px solid var(--line);border-radius:10px;background:#fff}.process-visual-figure figcaption{margin-top:.45rem;color:var(--muted);font-size:.88rem}.process-visual-notice{margin:.45rem 0;padding:.7rem;border-left:5px solid var(--gold);background:#fffaf0}.process-visual-open{align-self:flex-start;min-height:44px;margin-top:auto;padding:.6rem 0;font-weight:800}
      .ala-toolbar label,.ala-field{display:grid;gap:.35rem;font-weight:750}.ala-toolbar input,.ala-toolbar select,.ala-field input,.ala-field select{width:100%;min-height:46px;padding:.58rem .7rem;border:1px solid #8aa295;border-radius:10px;background:#fff;color:var(--ink);font:inherit}
      .ala-summary{padding:.75rem 1rem;border-left:5px solid var(--sage);background:#f7faf7}.ala-summary.is-error{border-left-color:var(--berry)}.ala-cards{display:grid;gap:1.2rem}.ala-card{padding:1.25rem;background:#fff;border:1px solid var(--line);border-radius:var(--radius-md);box-shadow:0 7px 22px rgba(67,21,45,.07)}
      .ala-card-head{display:flex;gap:1rem;align-items:start;justify-content:space-between}.ala-card h3{margin:.2rem 0;font-size:1.5rem}.ala-meta{margin:0;color:var(--muted);font-size:.82rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em}.ala-mechanic{padding:.25rem .55rem;border-radius:999px;background:#faedf3;color:var(--wine-800);font-size:.78rem;font-weight:850;text-transform:capitalize}.ala-instructions{padding:.8rem 1rem;border-left:5px solid var(--gold);background:#fffaf0}
      .ala-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.9rem}.ala-field{padding:.8rem;border:1px solid var(--line);border-radius:12px;background:#f9fbf9}.ala-choice-set,.ala-checklist{display:grid;gap:.55rem;margin:.8rem 0;padding:1rem;border:1px solid var(--line);border-radius:12px}.ala-choice-set legend,.ala-checklist legend{padding:0 .35rem;font-weight:800}.ala-choice-set label,.ala-checklist label{display:flex;gap:.55rem;align-items:flex-start;min-height:40px;padding:.35rem}.ala-choice-set input,.ala-checklist input{width:1.2rem;height:1.2rem;margin-top:.15rem}
      .ala-sequence{display:grid;gap:.55rem;padding-left:2rem}.ala-sequence li{padding:.65rem .7rem .65rem .25rem;border:1px solid var(--line);border-radius:10px;background:#f9fbf9}.ala-sequence li::marker{font-weight:850;color:var(--wine-800)}.ala-sequence li{display:list-item}.ala-sequence li>span:first-child{display:inline}.ala-move{float:right;display:inline-flex;gap:.3rem;margin-left:.5rem}.ala-move button,.ala-quiet{min-height:42px;padding:.45rem .7rem;border:1px solid #a98b9a;border-radius:9px;color:var(--wine-800);background:#fff;font:inherit;font-weight:750;cursor:pointer}.ala-move button{min-width:42px;padding:.3rem}.ala-move button:disabled{opacity:.35;cursor:not-allowed}
      .ala-actions{display:flex;flex-wrap:wrap;gap:.65rem;margin-top:1rem}.ala-actions .button{border:0;cursor:pointer;font:inherit}.ala-result{min-height:1.5rem;margin:.8rem 0 0;font-weight:800}.ala-result.is-success,.ala-item-feedback.is-correct{color:#16603f}.ala-result.needs-review,.ala-item-feedback.needs-review{color:#8a4b12}.ala-item-feedback{display:block;min-height:1.2rem;margin-top:.2rem;font-weight:700}.ala-support{margin-top:.8rem;border-top:1px solid var(--line);padding-top:.7rem}.ala-support summary{cursor:pointer;color:var(--wine-800);font-weight:800}.ala-support p{margin:.55rem 0}.ala-module-links{padding:1rem;border:1px solid var(--line);border-radius:12px;background:#f7faf7}.ala-module-links li{margin:.45rem 0}.ala-module-links li span{margin-left:.35rem;color:var(--muted);font-size:.78rem}.ala-boundary{font-size:.85rem;color:var(--muted)}
      @media(max-width:760px){.process-visual-grid,.ala-toolbar,.ala-fields{grid-template-columns:1fr}.ala-card-head{display:block}.ala-mechanic{display:inline-block}.ala-actions>*{width:100%}.ala-move{float:none;display:flex;margin:.55rem 0 0}.ala-sequence li{padding-left:.4rem}}
      @media print{.process-visual-open,.ala-toolbar,.ala-summary,.ala-actions,.ala-result,.ala-item-feedback{display:none!important}.process-visual-grid{display:block}.process-visual-card,.ala-card{box-shadow:none;break-inside:avoid;margin:0 0 1rem}.ala-support{display:block}.ala-support>summary{display:none}.ala-choice-set label,.ala-checklist label{min-height:auto}.ala-bank{margin-top:1rem}body.ala-print-one .ala-card:not(.ala-print-target){display:none}}
    `;
    document.head.appendChild(style);
  }

  function init() {
    injectStyles();
    if (document.querySelector('[data-owner="stage-10"]')) renderBank();
    mountEmbeddedActivities();
    window.addEventListener("beforeprint", preparePrintDetails);
    window.addEventListener("afterprint", restorePrintDetails);
  }

  window.Year8TextilesActivities = Object.freeze({ renderBank, renderModuleSummary, renderSectionActivity, data });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
