/*
   LandingPage5 — Contact form validation & submit handler
   Card: USER-120000 (Populate index contact section)

   Responsibilities:
     • Validate name, email, and message fields on submit and on blur.
     • Render inline error messages tied to inputs via aria-describedby.
     • Prevent default submission and render an inline success status.
     • Keep all handling local — no network requests.
*/

(function () {
    'use strict';

    var FORM_ID = 'contact-form';
    var STATUS_ID = 'contact-form-status';

    // RFC 5322-lite — practical email regex for client-side validation.
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    /**
     * @typedef {Object} FieldRule
     * @property {HTMLInputElement|HTMLTextAreaElement} input
     * @property {HTMLElement} error
     * @property {(value: string) => string} validate  Returns '' when valid,
     *  otherwise a human-readable error message.
     */

    /**
     * Build validation rules for each form field.
     * @param {HTMLFormElement} form
     * @returns {FieldRule[]}
     */
    function buildRules(form) {
        var fields = [
            {
                input: form.querySelector('#contact-name'),
                error: form.querySelector('#contact-name-error'),
                validate: function (value) {
                    var v = (value || '').trim();
                    if (!v) return 'Please enter your name.';
                    if (v.length < 2) return 'Name must be at least 2 characters.';
                    return '';
                }
            },
            {
                input: form.querySelector('#contact-email'),
                error: form.querySelector('#contact-email-error'),
                validate: function (value) {
                    var v = (value || '').trim();
                    if (!v) return 'Please enter your email address.';
                    if (!EMAIL_RE.test(v)) return 'Please enter a valid email address.';
                    return '';
                }
            },
            {
                input: form.querySelector('#contact-message'),
                error: form.querySelector('#contact-message-error'),
                validate: function (value) {
                    var v = (value || '').trim();
                    if (!v) return 'Please enter a message.';
                    if (v.length < 10) return 'Message must be at least 10 characters.';
                    return '';
                }
            }
        ];

        return fields.filter(function (f) { return f.input && f.error; });
    }

    /**
     * Apply an error message and visual state to a field.
     * @param {FieldRule} rule
     * @param {string} message
     */
    function setFieldError(rule, message) {
        if (!rule.input || !rule.error) return;
        if (message) {
            rule.error.textContent = message;
            rule.error.hidden = false;
            rule.input.setAttribute('aria-invalid', 'true');
            rule.input.classList.add('field__input--invalid');
        } else {
            rule.error.textContent = '';
            rule.error.hidden = true;
            rule.input.removeAttribute('aria-invalid');
            rule.input.classList.remove('field__input--invalid');
        }
    }

    /**
     * Run a single field's validation, write the error, and return validity.
     * @param {FieldRule} rule
     * @returns {boolean}
     */
    function validateRule(rule) {
        var message = rule.validate(rule.input.value);
        setFieldError(rule, message);
        return message === '';
    }

    /**
     * Reset the form status banner.
     * @param {HTMLElement} status
     */
    function clearStatus(status) {
        if (!status) return;
        status.textContent = '';
        status.classList.remove('contact-form__status--success', 'contact-form__status--error');
    }

    /**
     * Initialize the contact form once the DOM is ready.
     */
    function init() {
        var form = document.getElementById(FORM_ID);
        if (!form) return;

        var status = document.getElementById(STATUS_ID);
        var rules = buildRules(form);
        if (rules.length === 0) return;

        // Live, forgiving validation: re-check a field after the user leaves it
        // and clear stale errors as soon as they start typing again.
        rules.forEach(function (rule) {
            rule.input.addEventListener('blur', function () {
                if (rule.input.value.trim().length > 0) {
                    validateRule(rule);
                }
            });

            rule.input.addEventListener('input', function () {
                if (rule.input.getAttribute('aria-invalid') === 'true') {
                    validateRule(rule);
                }
            });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            clearStatus(status);

            var firstInvalid = null;
            var allValid = rules.every(function (rule) {
                var ok = validateRule(rule);
                if (!ok && !firstInvalid) firstInvalid = rule.input;
                return ok;
            });

            if (!allValid) {
                if (status) {
                    status.textContent = 'Please fix the highlighted fields and try again.';
                    status.classList.add('contact-form__status--error');
                }
                if (firstInvalid && typeof firstInvalid.focus === 'function') {
                    firstInvalid.focus();
                }
                return;
            }

            // Local-only submit handler stub — no network call.
            var payload = {
                name: form.querySelector('#contact-name').value.trim(),
                email: form.querySelector('#contact-email').value.trim(),
                message: form.querySelector('#contact-message').value.trim(),
                submittedAt: new Date().toISOString()
            };

            // Surface a friendly success message in the live region.
            if (status) {
                status.textContent =
                    'Thanks, ' + payload.name + '! Your message has been received locally.';
                status.classList.add('contact-form__status--success');
            }

            // Reset the form while keeping the success message visible.
            form.reset();
            rules.forEach(function (rule) { setFieldError(rule, ''); });

            // Expose payload for debugging / future integration without
            // accidentally sending anything over the network.
            if (typeof window !== 'undefined') {
                window.__lastContactSubmission = payload;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();