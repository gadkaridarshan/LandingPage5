/* =========================================================
   Contact form — client-side validation & local submit stub
   LandingPage5
   ---------------------------------------------------------
   - Inline validation on blur and on submit
   - Accessible error messaging via aria-describedby +
     aria-live regions
   - Submit handler is intentionally local (no network call)
   ========================================================= */

(function () {
    'use strict';

    // RFC 5322-lite email pattern — pragmatic, not exhaustive.
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var MAX_NAME = 80;
    var MIN_MESSAGE = 10;
    var MAX_MESSAGE = 2000;

    var VALIDATORS = {
        name: function (value) {
            var trimmed = String(value || '').trim();
            if (trimmed.length === 0) {
                return 'Please enter your name.';
            }
            if (trimmed.length < 2) {
                return 'Name must be at least 2 characters.';
            }
            if (trimmed.length > MAX_NAME) {
                return 'Name must be ' + MAX_NAME + ' characters or fewer.';
            }
            return '';
        },
        email: function (value) {
            var trimmed = String(value || '').trim();
            if (trimmed.length === 0) {
                return 'Please enter your email address.';
            }
            if (!EMAIL_PATTERN.test(trimmed)) {
                return 'Please enter a valid email address (e.g. you@example.com).';
            }
            return '';
        },
        message: function (value) {
            var trimmed = String(value || '').trim();
            if (trimmed.length === 0) {
                return 'Please enter a message.';
            }
            if (trimmed.length < MIN_MESSAGE) {
                return 'Message must be at least ' + MIN_MESSAGE + ' characters.';
            }
            if (trimmed.length > MAX_MESSAGE) {
                return 'Message must be ' + MAX_MESSAGE + ' characters or fewer.';
            }
            return '';
        }
    };

    function getErrorElement(field) {
        var id = field.getAttribute('aria-describedby');
        if (!id) {
            return null;
        }
        return document.getElementById(id);
    }

    function setFieldError(field, message) {
        var errorEl = getErrorElement(field);
        if (errorEl) {
            errorEl.textContent = message;
        }
        if (message) {
            field.setAttribute('aria-invalid', 'true');
        } else {
            field.removeAttribute('aria-invalid');
        }
    }

    function validateField(field) {
        var name = field.getAttribute('name');
        var validator = VALIDATORS[name];
        if (!validator) {
            return true;
        }
        var message = validator(field.value);
        setFieldError(field, message);
        return message === '';
    }

    function clearHint(hint) {
        if (!hint) {
            return;
        }
        hint.textContent = '';
        hint.removeAttribute('data-state');
    }

    function setHint(hint, message, state) {
        if (!hint) {
            return;
        }
        hint.textContent = message;
        if (state) {
            hint.setAttribute('data-state', state);
        } else {
            hint.removeAttribute('data-state');
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        var form = event.currentTarget;
        var hint = form.querySelector('.contact-form__hint');
        var fields = form.querySelectorAll('.contact-form__input');
        var firstInvalid = null;

        fields.forEach(function (field) {
            var ok = validateField(field);
            if (!ok && !firstInvalid) {
                firstInvalid = field;
            }
        });

        if (firstInvalid) {
            setHint(hint, 'Please correct the highlighted fields and try again.', 'error');
            if (typeof firstInvalid.focus === 'function') {
                firstInvalid.focus();
            }
            return;
        }

        // Local stub — no network request. Replace with real submit
        // (e.g. fetch('/api/contact', ...)) when a backend is ready.
        var data = {
            name: form.elements['name'].value.trim(),
            email: form.elements['email'].value.trim(),
            message: form.elements['message'].value.trim()
        };

        try {
            if (typeof console !== 'undefined' && console.info) {
                console.info('[contact-form] Submission captured (local stub).', data);
            }
        } catch (err) {
            // Logging is best-effort; never leak form data via errors.
        }

        setHint(hint, 'Thanks! Your message has been recorded (local stub).', 'success');
        form.reset();
    }

    function init() {
        var form = document.getElementById('contact-form');
        if (!form) {
            return;
        }

        var fields = form.querySelectorAll('.contact-form__input');
        var hint = form.querySelector('.contact-form__hint');

        fields.forEach(function (field) {
            field.addEventListener('blur', function () {
                // Only surface validation for fields the user has touched.
                if (field.value.trim().length > 0 || field.hasAttribute('aria-invalid')) {
                    validateField(field);
                }
            });

            field.addEventListener('input', function () {
                // Clear stale errors as the user corrects them.
                if (field.getAttribute('aria-invalid') === 'true') {
                    var errorEl = getErrorElement(field);
                    if (errorEl && errorEl.textContent && field.value.trim().length > 0) {
                        setFieldError(field, '');
                    }
                }
                clearHint(hint);
            });
        });

        form.addEventListener('submit', handleSubmit);
        form.addEventListener('reset', function () {
            fields.forEach(function (field) {
                setFieldError(field, '');
            });
            clearHint(hint);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();