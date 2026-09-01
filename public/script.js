/* =========================================================
   LandingPage5 — Footer copyright year
   Tiny helper that keeps the footer year current.
   ========================================================= */

(function () {
    'use strict';

    function setYear() {
        var el = document.getElementById('copyright-year');
        if (!el) {
            return;
        }
        try {
            el.textContent = String(new Date().getFullYear());
        } catch (err) {
            el.textContent = '—';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setYear);
    } else {
        setYear();
    }
})();