(function () {
  "use strict";

  const config = window.YEAR8_TEXTILES_COURSE;
  if (!config) {
    console.error("Year 8 Textiles course configuration is unavailable.");
    return;
  }

  document.documentElement.dataset.courseId = config.id;
  document.documentElement.dataset.buildState = config.buildState;

  document.querySelectorAll("[data-course-title]").forEach((node) => {
    node.textContent = config.title;
  });

  document.querySelectorAll("[data-course-subtitle]").forEach((node) => {
    node.textContent = config.subtitle;
  });

  document.querySelectorAll(".build-chip").forEach((node) => {
    node.textContent = "Local course candidate · formal details to confirm";
  });

  const route = document.body.dataset.route;
  if (route) {
    document.querySelectorAll("[data-nav-route]").forEach((link) => {
      if (link.dataset.navRoute === route || (route === "module" && link.dataset.navRoute === "modules")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  const safeStorage = Object.freeze({
    namespace: config.storageNamespace,
    key(name) {
      return `${config.storageNamespace}:${name}`;
    },
    get(name) {
      try {
        return window.localStorage.getItem(this.key(name));
      } catch (_error) {
        return null;
      }
    },
    set(name, value) {
      try {
        window.localStorage.setItem(this.key(name), String(value));
        return true;
      } catch (_error) {
        return false;
      }
    },
    remove(name) {
      try {
        window.localStorage.removeItem(this.key(name));
        return true;
      } catch (_error) {
        return false;
      }
    }
  });

  window.Year8TextilesStorage = safeStorage;

  document.querySelectorAll("[data-package-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.hash);
      if (!(target instanceof HTMLDetailsElement)) return;
      target.open = true;
      window.requestAnimationFrame(() => target.querySelector("summary")?.focus());
    });
  });

  document.querySelectorAll("[data-print-page]").forEach((button) => {
    button.addEventListener("click", () => window.print());
  });
})();
