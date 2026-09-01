/**
 * @helix:story USER-889000
 * Contact form section — inline client-side validation and non-network
 * submission handler stub.
 *
 * Provides:
 *   • Per-field validation (required + email format)
 *   • Accessible inline error messaging (aria-invalid + aria-describedby)
 *   • Submit handler stub (no network) with success/failure feedback
 *   • Live validation on blur + clear-on-input for good UX
 */
(function () {
    'use strict';

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var form = document.getElementById('contact-form');
    if (!form) {
        return;
    }

    /**
     * Field configuration: id of input, id of error message element,
     * label text, and validator that returns an error message or ''.
     */
    var fields = [
        {
            id: 'contact-name',
            errorId: 'contact-name-error',
            label: 'Name',
            validate: function (value) {
                var trimmed = (value || '').trim();
                if (!trimmed) {
                    return 'Please enter your name.';
                }
                if (trimmed.length < 2) {
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
                var trimmed = (value || '').trim();
                if (!trimmed) {
                    return 'Please enter your email address.';
                }
                if (trimmed.length > 254) {
                    return 'Email is too long.';
                }
                if (!EMAIL_PATTERN.test(trimmed)) {
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
                var trimmed = (value || '').trim();
                if (!trimmed) {
                    return 'Please enter a message.';
                }
                if (trimmed.length < 10) {
                    return 'Message must be at least 10 characters.';
                }
                return '';
            }
        }
    ];

    var statusEl = document.getElementById('contact-form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var defaultBtnLabel = submitBtn ? submitBtn.textContent : 'Send message';

    /**
     * Attach validation + accessibility wiring for a single field.
     */
    fields.forEach(function (field) {
        var input = document.getElementById(field.id);
        var errorEl = document.getElementById(field.errorId);
        if (!input) {
            return;
        }

        // Ensure the input references its error message for screen readers.
        var describedBy = input.getAttribute('aria-describedby');
        if (errorEl && (!describedBy || describedBy.indexOf(field.errorId) === -1)) {
            var next = describedBy ? describedBy + ' ' : '';
            input.setAttribute('aria-describedby', next + field.errorId);
        }

        // Validate on blur — only show error if the field has been touched.
        input.addEventListener('blur', function () {
            if (input.dataset.touched === 'true') {
                validateField(field);
            } else {
                input.dataset.touched = 'true';
            }
        });

        // Clear the error as the user fixes the issue.
        input.addEventListener('input', function () {
            if (input.getAttribute('aria-invalid') === 'true') {
                validateField(field);
            }
        });
    });

    /**
     * Validate one field and reflect the result in the DOM + ARIA.
     * Returns true when valid.
     */
    function validateField(field) {
        var input = document.getElementById(field.id);
        var errorEl = document.getElementById(field.errorId);
        if (!input) {
            return true;
        }
        var message = field.validate(input.value);
        if (message) {
            input.setAttribute('aria-invalid', 'true');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.hidden = false;
            }
            return false;
        }
        input.removeAttribute('aria-invalid');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.hidden = true;
        }
        return true;
    }

    /**
     * Validate every configured field. Returns true when all valid.
     */
    function validateAll() {
        var allValid = true;
        fields.forEach(function (field) {
            var input = document.getElementById(field.id);
            if (input) {
                input.dataset.touched = 'true';
            }
            if (!validateField(field)) {
                allValid = false;
            }
        });
        return allValid;
    }

    /**
     * Reset the entire form to its pristine state.
     */
    function resetForm() {
        fields.forEach(function (field) {
            var input = document.getElementById(field.id);
            var errorEl = document.getElementById(field.errorId);
            if (input) {
                input.removeAttribute('aria-invalid');
                input.dataset.touched = 'false';
            }
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.hidden = true;
            }
        });
        if (statusEl) {
            statusEl.textContent = '';
            statusEl.className = 'form-status';
            statusEl.hidden = true;
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = defaultBtnLabel;
        }
    }

    /**
     * Announce a status update to assistive tech and visually.
     */
    function setStatus(message, kind) {
        if (!statusEl) {
            return;
        }
        statusEl.textContent = message;
        statusEl.className = 'form-status form-status--' + (kind || 'info');
        statusEl.hidden = !message;
        // Re-announce for screen readers on repeated identical messages.
        statusEl.setAttribute('aria-live', 'polite');
    }

    /**
     * Submit handler stub. Validates inputs, simulates a non-network
     * send, then resets the form so the visitor can send another message.
     */
    function handleSubmit(event) {
        event.preventDefault();
        setStatus('', 'info');

        if (!validateAll()) {
            setStatus('Please fix the highlighted fields and try again.', 'error');
            // Focus the first invalid field for keyboard users.
            var firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }

        // Collect payload (non-network — kept in memory only).
        var payload = {
            name: form.elements['name'] ? form.elements['name'].value.trim() : '',
            email: form.elements['email'] ? form.elements['email'].value.trim() : '',
            message: form.elements['message'] ? form.elements['message'].value.trim() : '',
            submittedAt: new Date().toISOString()
        };

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
        }

        // Non-network submission stub. Replace with a real fetch() / XHR
        // call when wiring up a backend. Errors are simulated ~10% of the
        // time so the failure path is exercised during development.
        window.setTimeout(function () {
            var simulatedFailure = Math.random() < 0.1;
            if (simulatedFailure) {
                setStatus(
                    "We couldn't send your message just now. Please try again in a moment.",
                    'error'
                );
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = defaultBtnLabel;
                }
                return;
            }

            // For debugging / dev visibility only. Safe to leave on.
            if (window.console && typeof window.console.info === 'function') {
                window.console.info('[contact-form] submission stub payload:', payload);
            }

            setStatus(
                "Thanks, " + payload.name + "! Your message is on its way — we'll be in touch soon.",
                'success'
            );
            form.reset();
            fields.forEach(function (field) {
                var input = document.getElementById(field.id);
                if (input) {
                    input.dataset.touched = 'false';
                    input.removeAttribute('aria-invalid');
                }
                var errorEl = document.getElementById(field.errorId);
                if (errorEl) {
                    errorEl.textContent = '';
                    errorEl.hidden = true;
                }
            });
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = defaultBtnLabel;
            }
        }, 450);
    }

    form.addEventListener('submit', handleSubmit);

    // Reset button (if present) clears everything.
    var resetBtn = form.querySelector('button[type="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            // Defer so default reset clears inputs first.
            window.setTimeout(resetForm, 0);
        });
    }
})();