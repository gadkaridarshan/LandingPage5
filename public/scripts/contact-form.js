// helix: public/scripts/contact-form.js
/**
 * @helix:story USER-889000
 * Contact form section — inline client-side validation and non-network
 * submission handler stub.
 */
(function () {
    'use strict';

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var form = document.getElementById('contact-form');
    if (!form) {
        return;
    }

    var fields = [
        {
            id: 'contact-name',
            errorId: 'contact-name-error',
            label: 'Name',
            validate: function (value) {
                if (!value) {
                    return 'Please enter your name.';
                }
                if (value.length < 2) {
                    return 'Name must be at least 2 characters.';
                }
                return '';
            }
        },
        {
            id: 'contact-email',
            errorId: 'contact-email-error',
            label: 'Email',
            validate: function (value) {
                if (!value) {
                    return 'Please enter your email address.';
                }
                if (value.length > 254) {
                    return 'Email is too long.';
                }
                if (!EMAIL_PATTERN.test(value)) {
                    return 'Please enter a valid email address (e.g. you@example.com).';
                }
                return '';
            }
        },
        {
            id: 'contact-message',
            errorId: 'contact-message-error',
            label: 'Message',
            validate: function (value) {
                if (!value) {
                    return 'Please enter a message.';
                }
                if (value.trim().length < 10) {
                    return 'Message must be at least 10 characters.';
                }
                return '';
            }
        }
    ];

    var statusEl = document.getElementById('contact-form-status');
    var submitBtn = document.getElementById('contact-submit');

    /**
     * Get the .form-field wrapper for a given input element.
     */
    function getFieldWrapper(input) {
        return input.closest('.form-field');
    }

    /**
     * Set or clear the error message for a field, and toggle aria-invalid.
     */
    function setFieldError(input, errorEl, message) {
        var wrapper = getFieldWrapper(input);
        if (message) {
            errorEl.textContent = message;
            input.setAttribute('aria-invalid', 'true');
            if (wrapper) {
                wrapper.classList.add('has-error');
            }
        } else {
            errorEl.textContent = '';
            input.removeAttribute('aria-invalid');
            if (wrapper) {
                wrapper.classList.remove('has-error');
            }
        }
    }

    /**
     * Validate a single field by id, updating DOM state.
     * Returns true when valid.
     */
    function validateField(field) {
        var input = document.getElementById(field.id);
        var errorEl = document.getElementById(field.errorId);
        if (!input || !errorEl) {
            return true;
        }
        var message = field.validate(String(input.value || '').trim());
        setFieldError(input, errorEl, message);
        return !message;
    }

    /**
     * Validate every field. Returns true if all are valid.
     */
    function validateAll() {
        var firstInvalid = null;
        var allValid = true;
        fields.forEach(function (field) {
            var ok = validateField(field);
            if (!ok) {
                allValid = false;
                if (!firstInvalid) {
                    firstInvalid = document.getElementById(field.id);
                }
            }
        });
        if (firstInvalid && typeof firstInvalid.focus === 'function') {
            firstInvalid.focus();
        }
        return allValid;
    }

    /**
     * Set the form-level status message.
     */
    function setStatus(message, kind) {
        if (!statusEl) {
            return;
        }
        statusEl.textContent = message || '';
        statusEl.classList.remove('is-success', 'is-error');
        if (kind === 'success') {
            statusEl.classList.add('is-success');
        } else if (kind === 'error') {
            statusEl.classList.add('is-error');
        }
    }

    /**
     * Non-network submission handler stub.
     * In a real app this would POST to an API endpoint.
     */
    function handleSubmit(payload) {
        // Stub: log to console and acknowledge.
        // Replace with real network submission when an endpoint is available.
        // eslint-disable-next-line no-console
        console.info('[contact-form] submission stub received payload:', payload);

        return new Promise(function (resolve) {
            window.setTimeout(function () {
                resolve({ ok: true });
            }, 250);
        });
    }

    // Wire up live validation: re-validate on blur, clear errors on input.
    fields.forEach(function (field) {
        var input = document.getElementById(field.id);
        var errorEl = document.getElementById(field.errorId);
        if (!input || !errorEl) {
            return;
        }
        input.addEventListener('blur', function () {
            validateField(field);
        });
        input.addEventListener('input', function () {
            var wrapper = getFieldWrapper(input);
            if (wrapper && wrapper.classList.contains('has-error')) {
                validateField(field);
            }
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        setStatus('', null);

        if (!validateAll()) {
            setStatus('Please fix the highlighted fields and try again.', 'error');
            return;
        }

        var payload = {
            name: String(document.getElementById('contact-name').value || '').trim(),
            email: String(document.getElementById('contact-email').value || '').trim(),
            message: String(document.getElementById('contact-message').value || '').trim(),
            submittedAt: new Date().toISOString()
        };

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-busy', 'true');
        }

        handleSubmit(payload)
            .then(function () {
                setStatus('Thanks! Your message has been sent (stub).', 'success');
                form.reset();
                fields.forEach(function (field) {
                    var input = document.getElementById(field.id);
                    var errorEl = document.getElementById(field.errorId);
                    if (input && errorEl) {
                        setFieldError(input, errorEl, '');
                    }
                });
            })
            .catch(function () {
                setStatus('Something went wrong. Please try again.', 'error');
            })
            .then(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.removeAttribute('aria-busy');
                }
            });
    });
})();