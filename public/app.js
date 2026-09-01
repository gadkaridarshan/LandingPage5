// helix: public/app.js
(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Smooth-scroll for in-page anchors (with sticky-header offset)
  var header = document.querySelector(".site-header");
  function getHeaderOffset() {
    return header ? header.offsetHeight : 0;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top =
        target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset() - 12;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  // Contact form: basic client-side handling + status feedback
  var form = document.querySelector(".contact-form");
  if (form) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var note = form.querySelector(".form-note");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.elements["name"] || {}).value || "";
      var email = (form.elements["email"] || {}).value || "";
      var message = (form.elements["message"] || {}).value || "";

      if (!name.trim() || !email.trim() || !message.trim()) {
        if (note) {
          note.textContent = "Please fill in every field before sending.";
          note.style.color = "#fecaca";
        }
        return;
      }

      // Very light email shape check
      var emailLooksOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailLooksOk) {
        if (note) {
          note.textContent = "That email address doesn't look right — mind checking it?";
          note.style.color = "#fecaca";
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      // Simulate submission. Wire to your endpoint here.
      window.setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        }
        form.reset();
        if (note) {
          note.textContent = "Thanks " + name.split(" ")[0] + " — we'll reply within one business day.";
          note.style.color = "#bbf7d0";
        }
      }, 700);
    });
  }
})();