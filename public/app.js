/* helix: public/app.js */
/**
 * Lightweight global enhancements for the landing page.
 * - Smooth in-page anchor scrolling with reduced-motion respect.
 * - Dynamic footer year.
 */
(function () {
    'use strict';

    // Footer year
    var yearEl = document.getElementById('footer-year');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    // Smooth anchor scrolling
    var prefersReduced = false;
    if (typeof window.matchMedia === 'function') {
        prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    document.addEventListener('click', function (event) {
        var target = event.target;
        if (!target || typeof target.closest !== 'function') return;
        var link = target.closest('a[href^="#"]');
        if (!link) return;

        var href = link.getAttribute('href');
        if (!href || href === '#') return;

        var dest = document.querySelector(href);
        if (!dest) return;

        event.preventDefault();
        dest.scrollIntoView({
            behavior: prefersReduced ? 'auto' : 'smooth',
            block: 'start'
        });

        // Move focus for accessibility without disrupting screen reader flow.
        dest.setAttribute('tabindex', '-1');
        dest.focus({ preventScroll: true });
    });
})();