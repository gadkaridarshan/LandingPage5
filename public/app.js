/* =========================================================
   LandingPage5 — App bootstrap
   Reserved for cross-cutting page behavior. Intentionally
   minimal so individual section scripts (hero / features /
   contact-form) remain independently shippable.
   ========================================================= */

(function () {
    'use strict';

    function init() {
        // Placeholder for shared behavior (e.g. analytics, focus
        // restoration, intersection observers). Sections register
        // their own listeners via their dedicated scripts.
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();