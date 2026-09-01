// helix: public/scripts/contact-form.js — non-network submit handler with inline validation
(function () {
    'use strict';

    const form = document.querySelector('.contact-form');
    if (!form) return;

    const status = form.querySelector('.contact-form__status');
    const fields = [
        {
            input: form.querySelector('#cf-name'),
            error: form.querySelector('#cf-name-error'),
            validate(value) {
                const trimmed = value.trim();
                if (!trimmed) return 'Please enter your name.';
                if (trimmed.length < 2) return 'Name must be at least 2 characters.';
                return '';
            }
        },
        {
            input: form.querySelector('#cf-email'),
            error: form.querySelector('#cf-email-error'),
            validate(value) {
                const trimmed = value.trim();
                if (!trimmed) return 'Please enter your email.';
                // Practical email check: non-empty local, '@', domain with a dot.
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (!re.test(trimmed)) return 'Please enter a valid email address.';
                return '';
            }
        },
        {
            input: form.querySelector('#cf-message'),
            error: form.querySelector('#cf-message-error'),
            validate(value) {
                const trimmed = value.trim();
                if (!trimmed) return 'Please enter a message.';
                if (trimmed.length < 10) return 'Message must be at least 10 characters.';
                return '';
            }
        }
    ];

    function setFieldState(field, message) {
        if (!field.input || !field.error) return;
        if (message) {
            field.error.textContent = message;
            field.input.setAttribute('aria-invalid', 'true');
        } else {
            field.error.textContent = '';
            field.input.removeAttribute('aria-invalid');
        }
    }

    function validateField(field) {
        const message = field.validate(field.input.value);
        setFieldState(field, message);
        return !message;
    }

    function validateAll() {
        let firstInvalid = null;
        let allValid = true;
        fields.forEach((field) => {
            const ok = validateField(field);
            if (!ok) {
                allValid = false;
                if (!firstInvalid) firstInvalid = field.input;
            }
        });
        return { allValid, firstInvalid };
    }

    function setStatus(message, state) {
        if (!status) return;
        status.textContent = message;
        if (state) {
            status.setAttribute('data-state', state);
        } else {
            status.removeAttribute('data-state');
        }
    }

    fields.forEach((field) => {
        if (!field.input) return;
        field.input.addEventListener('blur', () => {
            if (field.input.value.trim().length > 0) {
                validateField(field);
            }
        });
        field.input.addEventListener('input', () => {
            if (field.input.getAttribute('aria-invalid') === 'true') {
                validateField(field);
            }
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const { allValid, firstInvalid } = validateAll();

        if (!allValid) {
            setStatus('Please fix the highlighted fields and try again.', 'error');
            if (firstInvalid && typeof firstInvalid.focus === 'function') {
                firstInvalid.focus();
            }
            return;
        }

        const payload = {
            name: form.querySelector('#cf-name').value.trim(),
            email: form.querySelector('#cf-email').value.trim(),
            message: form.querySelector('#cf-message').value.trim(),
            submittedAt: new Date().toISOString()
        };

        // Non-network submit handler stub: log payload and acknowledge locally.
        // Integrate a real endpoint by replacing the body of this block.
        if (typeof window !== 'undefined' && window.console) {
            window.console.info('[LandingPage5] Contact form submission:', payload);
        }

        setStatus('Thanks! Your message has been received locally.', 'success');
        form.reset();
    });
})();