(function () {
  "use strict";

  const catalogue = window.YEAR8_TEXTILES_VIDEOS;
  if (!catalogue) return;

  const esc = (value) => String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  function pathFromHere(path) {
    return document.body.dataset.route === "module" ? `../${path}` : path;
  }

  function closePlayer(shell, restoreFocus) {
    if (!shell) return;
    const launch = shell.parentElement?.querySelector("[data-video-launch]");
    shell.remove();
    if (launch) {
      launch.hidden = false;
      if (restoreFocus !== false) launch.focus();
    }
  }

  function openPlayer(media, launch, item) {
    document.querySelectorAll("[data-video-player]").forEach((shell) => closePlayer(shell, false));
    launch.hidden = true;
    const shell = document.createElement("div");
    shell.className = "video-player-shell";
    shell.dataset.videoPlayer = item.sectionId;
    shell.innerHTML = `<div class="video-player-controls"><button type="button" data-close-video aria-label="Stop and close ${esc(item.title)}">Close / stop</button></div><iframe src="${esc(item.embedUrl)}" title="${esc(item.title)} — video" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>`;
    shell.querySelector("[data-close-video]").addEventListener("click", () => closePlayer(shell));
    media.appendChild(shell);
    shell.querySelector("button").focus();
  }

  function alternative(item) {
    const pathway = item.nonVideoPathway || {};
    return `<section class="non-video-pathway" aria-labelledby="alt-${esc(item.sectionId)}">
      <p class="section-label">Complete equivalent pathway</p>
      <h4 id="alt-${esc(item.sectionId)}">${esc(pathway.title || "Read, notice, apply")}</h4>
      <ol>
        <li><strong>Before:</strong> ${esc(pathway.before)}</li>
        <li><strong>During:</strong> ${esc(pathway.during)}</li>
        <li><strong>After:</strong> ${esc(pathway.after)}</li>
      </ol>
      <p><strong>Evidence prompt:</strong> ${esc(pathway.evidencePrompt)}</p>
    </section>`;
  }

  function renderCard(item, compact) {
    const article = document.createElement("article");
    article.className = `video-card${compact ? " video-card-compact" : ""}${item.status === "exception" ? " video-exception" : ""}`;
    article.id = `${compact ? "section" : "library"}-video-${item.sectionId}`;
    const videoBlock = item.status === "video" ? `<div class="video-media" data-video-media>
      <button class="video-launch" type="button" data-video-launch aria-label="Load video: ${esc(item.title)}">
        <img src="${esc(item.thumbnail)}" alt="Video thumbnail for ${esc(item.title)}" loading="lazy" width="320" height="180">
        <span class="video-play" aria-hidden="true">▶</span><span class="video-launch-label">Load video</span>
      </button>
    </div>` : `<div class="video-exception-mark" aria-hidden="true">Read · Notice · Apply</div>`;
    const videoMeta = item.status === "video" ? `<p class="video-meta">${esc(item.provider)} · ${esc(item.duration)}${item.sampledSegment ? ` · focus ${esc(item.sampledSegment)}` : ""}</p>` : `<p class="video-meta">Purposeful non-video exception</p>`;
    const external = item.status === "video" ? `<a href="${esc(item.watchUrl)}" target="_blank" rel="noopener">Open on YouTube ↗</a>` : "";
    article.innerHTML = `${videoBlock}<div class="video-card-body">
      <p class="video-kicker">Module ${String(item.moduleId).padStart(2, "0")} · ${esc(item.sectionTitle)}</p>
      <h3>${esc(item.title)}</h3>${videoMeta}
      <p><strong>Why it is here:</strong> ${esc(item.studentReason)}</p>
      <p class="video-watch-for"><strong>Notice:</strong> ${esc(item.noticePrompt)}</p>
      ${item.teacherBoundary ? `<p class="teacher-boundary"><strong>Boundary:</strong> ${esc(item.teacherBoundary)}</p>` : ""}
      ${item.exceptionReason ? `<p class="teacher-boundary"><strong>Why no public clip:</strong> ${esc(item.exceptionReason)}</p>` : ""}
      ${alternative(item)}
      <div class="video-links"><a href="${pathFromHere(item.theoryDeepLink)}">Return to the theory section</a>${external}</div>
    </div>`;
    const launch = article.querySelector("[data-video-launch]");
    if (launch) launch.addEventListener("click", () => openPlayer(article.querySelector("[data-video-media]"), launch, item));
    return article;
  }

  function mountLibrary(node) {
    node.replaceChildren();
    for (let moduleId = 1; moduleId <= 10; moduleId += 1) {
      const items = catalogue.items.filter((item) => item.moduleId === moduleId);
      if (!items.length) continue;
      const section = document.createElement("section");
      section.className = "video-module-group";
      section.innerHTML = `<div class="section-heading"><p class="eyebrow">Module ${String(moduleId).padStart(2, "0")}</p><h2>${esc(items[0].moduleTitle)}</h2><p>Each item includes a complete non-video learning pathway.</p></div><div class="video-grid"></div>`;
      items.forEach((item) => section.querySelector(".video-grid").appendChild(renderCard(item, false)));
      node.appendChild(section);
    }
  }

  document.querySelectorAll("[data-video-library]").forEach(mountLibrary);
  document.querySelectorAll("[data-section-video]").forEach((node) => {
    const item = catalogue.bySection?.[node.dataset.sectionVideo];
    if (item) node.replaceChildren(renderCard(item, true));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const shell = [...document.querySelectorAll("[data-video-player]")].at(-1);
    if (shell) {
      event.preventDefault();
      closePlayer(shell);
    }
  });

  window.Year8TextilesVideos = Object.freeze({ renderCard, mountLibrary });
})();
