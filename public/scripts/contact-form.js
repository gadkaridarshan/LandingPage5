/* helix: public/scripts/contact-form.js */
/**
 * Contact form behavior:
 * - Inline client-side validation with error messages.
 * - Success / error states rendered into an aria-live status region.
 * - Simulated async submit (no backend in this template) so the UX is
 *   fully verifiable end-to-end in the browser.
 */
(function () {
    'use strict';

    var form = document.getElementById('contact-form');
    if (!form) return;

    var statusEl = document.getElementById('contact-form-status');
    var submitBtn = document.getElementById('contact-submit');
    var fields = {
        name: document.getElementById('contact-name'),
        email: document.getElementById('contact-email'),
        message: document.getElementById('contact-message')
    };

    var errors = {
        name: document.getElementById('contact-name-error'),
        email: document.getElementById('contact-email-error'),
        message: document.getElementById('contact-message-error')
    };

    // RFC 5322-lite — good enough for client-side guard rails.
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setError(field, message) {
        var input = fields[field];
        var errEl = errors[field];
        if (!input || !errEl) return;
        if (message) {
            input.setAttribute('aria-invalid', 'true');
            errEl.textContent = message;
        } else {
            input.removeAttribute('aria-invalid');
            errEl.textContent = '';
        }
    }

    function validateField(field) {
        var value = (fields[field].value || '').trim();

        if (!value) {
            setError(field, 'This field is required.');
            return false;
        }

        if (field === 'name') {
            if (value.length < 2) {
                setError(field, 'Please enter at least 2 characters.');
                return false;
            }
            if (value.length > 80) {
                setError(field, 'Name is too long (max 80 characters).');
                return false;
            }
        }

        if (field === 'email') {
            if (value.length > 120) {
                setError(field, 'Email is too long (max 120 characters).');
                return false;
            }
            if (!EMAIL_RE.test(value)) {
                setError(field, 'Please enter a valid email address.');
                return false;
            }
        }

        if (field === 'message') {
            if (value.length < 10) {
                setError(field, 'Message must be at least 10 characters.');
                return false;
            }
            if (value.length > 2000) {
                setError(field, 'Message is too long (max 2000 characters).');
                return false;
            }
        }

        setError(field, '');
        return true;
    }

    function validateAll() {
        var ok = true;
        Object.keys(fields).forEach(function (field) {
            if (!validateField(field)) ok = false;
        });
        return ok;
    }

    function clearStatus() {
        if (!statusEl) return;
        statusEl.removeAttribute('data-state');
        statusEl.innerHTML = '';
    }

    function setStatus(state, message) {
        if (!statusEl) return;
        var iconChar = state === 'success' ? '✓' : '!';
        statusEl.setAttribute('data-state', state);
        statusEl.innerHTML =
            '<span class="form-status-icon" aria-hidden="true">' + iconChar + '</span>' +
            '<p class="form-status-text">' + message + '</p>';
    }

    function setLoading(loading) {
        if (!submitBtn) return;
        if (loading) {
            submitBtn.setAttribute('data-loading', 'true');
            submitBtn.setAttribute('disabled', 'disabled');
        } else {
            submitBtn.removeAttribute('data-loading');
            submitBtn.removeAttribute('disabled');
        }
    }

    // Live-clear errors as the user fixes them.
    Object.keys(fields).forEach(function (field) {
        var input = fields[field];
        if (!input) return;
        input.addEventListener('input', function () {
            if (input.getAttribute('aria-invalid') === 'true') {
                validateField(field);
            }
            clearStatus();
        });
        input.addEventListener('blur', function () {
            if (input.value.trim().length > 0) {
                validateField(field);
            }
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearStatus();

        if (!validateAll()) {
            setStatus('error', 'Please fix the highlighted fields and try again.');
            // Focus the first invalid field for keyboard users.
            var firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid && typeof firstInvalid.focus === 'function') {
                firstInvalid.focus();
            }
            return;
        }

        setLoading(true);

        // Simulated network call. Replace with a real fetch() to your endpoint.
        window.setTimeout(function () {
            setLoading(false);

            // For demonstration: randomize success vs. transient failure
            // so both states are easy to verify. A real backend would
            // return a real status here.
            var succeed = Math.random() > 0.15;
            if (succeed) {
                setStatus(
                    'success',
                    "Thanks, " + fields.name.value.trim().split(' ')[0] +
                    "! Your message has been sent. We'll get back to you within one business day."
                );
                form.reset();
            } else {
                setStatus(
                    'error',
                    "Something went wrong on our end. Please try again in a moment."
                );
            }
        }, 900);
    });
})();