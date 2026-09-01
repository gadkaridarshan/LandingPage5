// helix: public/script.js
/* Lumen — landing page interactions (hero section)
 * Card: USER-527000 (Populate index hero section)
 *
 * Keeps behavior minimal: smooth in-page navigation, header shadow on
 * scroll, and a graceful fallback when users prefer reduced motion.
 */
(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Smooth in-page anchor scrolling for any same-page links.
    function smoothScroll(targetId) {
        var target = document.getElementById(targetId);
        if (!target) return;
        target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
        });
    }

    document.addEventListener("click", function (event) {
        var link = event.target.closest('a[href^="#"]');
        if (!link) return;
        var href = link.getAttribute("href");
        if (!href || href.length < 2) return;
        smoothScroll(href.slice(1));
    });

    // Subtle elevation on the header once the user scrolls.
    var header = document.querySelector(".site-header");
    if (header) {
        var updateHeader = function () {
            if (window.scrollY > 8) {
                header.classList.add("site-header--scrolled");
            } else {
                header.classList.remove("site-header--scrolled");
            }
        };
        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
    }
})();