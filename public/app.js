// LaunchPad — Hero interactions (USER-87000)
// Minimal, framework-free enhancements. Graceful no-op if features aren't supported.

(function () {
  "use strict";

  // Smooth in-page anchor scrolling with reduced-motion respect.
  document.addEventListener("click", function (event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });

    // Update focus for keyboard users without disrupting scroll position.
    if (target.hasAttribute("tabindex") === false) {
      target.setAttribute("tabindex", "-1");
    }
    target.focus({ preventScroll: true });
  });

  // Subtle parallax for background glow on pointer move (desktop only).
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (!reduceMotion && !isCoarsePointer) {
    const glowA = document.querySelector(".hero__bg-glow--a");
    const glowB = document.querySelector(".hero__bg-glow--b");
    const hero = document.querySelector(".hero");

    if (hero && glowA && glowB) {
      let rafId = null;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      const onMove = function (event) {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        targetX = x;
        targetY = y;
        if (rafId === null) {
          rafId = requestAnimationFrame(tick);
        }
      };

      const tick = function () {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        glowA.style.transform =
          "translate3d(" + currentX * 30 + "px, " + currentY * 30 + "px, 0)";
        glowB.style.transform =
          "translate3d(" + currentX * -40 + "px, " + currentY * -40 + "px, 0)";

        if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = null;
        }
      };

      hero.addEventListener("mousemove", onMove, { passive: true });
      hero.addEventListener("mouseleave", function () {
        targetX = 0;
        targetY = 0;
        if (rafId === null) rafId = requestAnimationFrame(tick);
      });
    }
  }

  // CTA click telemetry hook — wire to your analytics provider later.
  document.addEventListener("click", function (event) {
    const cta = event.target.closest("[data-cta]");
    if (!cta) return;
    const name = cta.getAttribute("data-cta");
    if (window.console && typeof window.console.info === "function") {
      window.console.info("[LaunchPad] CTA clicked:", name);
    }
  });
})();