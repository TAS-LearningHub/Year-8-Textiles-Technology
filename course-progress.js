(function () {
  "use strict";

  const mount = document.querySelector("[data-course-progress]");
  const course = window.YEAR8_TEXTILES_COURSE;
  const evidenceData = window.YEAR8_TEXTILES_EVIDENCE;
  const activityData = window.YEAR8_TEXTILES_ACTIVITY_DATA;
  const folioData = window.YEAR8_TEXTILES_FOLIO_DATA;
  if (!mount || !course || !evidenceData || !activityData || !folioData) return;

  const esc = (value) => String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  function read(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function sectionStatus(sequence, activityState) {
    const checkKey = sequence.recordSchema?.checkCompletionKey || `${course.storagePrefix}checks:${sequence.sectionId}`;
    const capstoneKey = sequence.recordSchema?.capstoneKey || `${course.storagePrefix}capstone:${sequence.sectionId}`;
    const checkState = read(checkKey, { checkedQuestionIds: [] });
    const capstoneState = read(capstoneKey, { selectedFocus: "", response: "", selfCheck: [] });
    const checked = new Set(Array.isArray(checkState.checkedQuestionIds) ? checkState.checkedQuestionIds : []).size;
    const criteriaCount = sequence.capstone?.successCriteria?.length || 0;
    const responseComplete = String(capstoneState.selectedFocus ?? "") !== ""
      && String(capstoneState.response || "").trim().length > 0
      && Array.isArray(capstoneState.selfCheck)
      && criteriaCount > 0
      && criteriaCount === new Set(capstoneState.selfCheck).size;
    const activity = activityData.activities.find((item) => item.sectionId === sequence.sectionId);
    const activityResult = activity ? activityState.checks?.[activity.id] : null;
    const activityComplete = Boolean(activityResult && Number(activityResult.correct) === Number(activityResult.total));
    return { checked: Math.min(10, checked), responseComplete, activityComplete };
  }

  function render() {
    const activityState = read(activityData.storageKey, { checks: {} });
    const folioState = read(folioData.textStorageKey, { fields: {}, capstone: "" });
    const sequences = evidenceData.sequences || [];
    let checksComplete = 0;
    let responsesComplete = 0;
    let activitiesComplete = 0;
    let next = null;

    const moduleRows = course.modules.map((module) => {
      const moduleSequences = sequences.filter((item) => item.sectionId.startsWith(`m${String(module.number).padStart(2, "0")}-`));
      let moduleParts = 0;
      const totalModuleParts = moduleSequences.length * 12;
      moduleSequences.forEach((sequence) => {
        const status = sectionStatus(sequence, activityState);
        checksComplete += status.checked;
        responsesComplete += Number(status.responseComplete);
        activitiesComplete += Number(status.activityComplete);
        moduleParts += status.checked + Number(status.responseComplete) + Number(status.activityComplete);
        if (!next && (status.checked < 10 || !status.responseComplete || !status.activityComplete)) {
          next = {
            href: `${module.route}#${sequence.sectionId}-learning-package`,
            label: `Resume ${module.title}: ${sequence.sectionId.toUpperCase()}`
          };
        }
      });
      const percent = totalModuleParts ? Math.round((moduleParts / totalModuleParts) * 100) : 0;
      return `<li><a href="${esc(module.route)}">Module ${String(module.number).padStart(2, "0")} · ${esc(module.title)}</a><span>${percent}%</span></li>`;
    }).join("");

    let folioFieldsStarted = 0;
    folioData.stages.forEach((stage) => {
      const stageValues = folioState.fields?.[stage.id] || {};
      const started = stage.fields.filter((field) => String(stageValues[field.id] || "").trim()).length;
      folioFieldsStarted += started;
      if (!next && started < stage.fields.length) next = { href: `folio.html#${stage.id}`, label: `Continue folio Stage ${stage.number}: ${stage.title}` };
    });
    const folioCapstoneStarted = String(folioState.capstone || "").trim().length > 0;
    if (!next && !folioCapstoneStarted) next = { href: "folio.html#folio-capstone", label: "Continue the folio evaluation" };

    const totalSteps = 300 + 30 + 30 + 42 + 1;
    const completedSteps = checksComplete + responsesComplete + activitiesComplete + folioFieldsStarted + Number(folioCapstoneStarted);
    const percent = Math.round((completedSteps / totalSteps) * 100);

    mount.innerHTML = `<div class="section-heading"><p class="eyebrow">Saved on this device</p><h2 id="course-progress-title">Course progress and next step</h2><p>This overview counts every knowledge check, section response, applied activity and folio writing field in the local learning system.</p></div>
      <div class="course-progress-summary">
        <div class="progress-track" role="progressbar" aria-label="Whole-course formative progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div>
        <p><strong>${percent}%</strong> · ${completedSteps} of ${totalSteps} saved formative steps complete or started.</p>
        <a class="button" data-resume-course href="${esc(next?.href || "folio.html")}">${esc(next?.label || "Review the completed course")}</a>
      </div>
      <div class="course-progress-detail">
        <div><h3>Learning evidence</h3><ul><li>${checksComplete}/300 knowledge checks completed</li><li>${responsesComplete}/30 section responses complete</li><li>${activitiesComplete}/30 applied activities mastered</li><li>${folioFieldsStarted}/42 folio fields started</li><li>Folio evaluation ${folioCapstoneStarted ? "started" : "not started"}</li></ul></div>
        <div><h3>Module overview</h3><ol class="course-module-progress">${moduleRows}</ol></div>
      </div>
      <p class="device-note">This progress is browser-local formative evidence. It is not submission, a mark or teacher-observed practical evidence.</p>`;
  }

  render();
  window.addEventListener("storage", render);
  window.addEventListener("pageshow", render);
})();
