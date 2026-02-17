;(function () {
  'use strict';

  /* -------------------------------------------------
     1. Scroll-triggered reveal (IntersectionObserver)
     ------------------------------------------------- */
  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(function (el) { observer.observe(el); });
  }

  /* -------------------------------------------------
     2. Nav scroll state
     ------------------------------------------------- */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 40) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* -------------------------------------------------
     3. Smooth anchor scroll (for older browsers)
     ------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* -------------------------------------------------
     4. Form handling
     ------------------------------------------------- */
  function initForm() {
    var form = document.getElementById('signup-form');
    if (!form) return;

    var btnText    = form.querySelector('.signup__btn-text');
    var btnLoading = form.querySelector('.signup__btn-loading');
    var success    = document.getElementById('signup-success');
    var error      = document.getElementById('signup-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = form.querySelector('input[type="email"]');
      if (!email || !email.value.trim()) return;

      // Basic email regex
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email.value.trim())) {
        showMsg(error, 'Por favor, introduce un email válido.');
        return;
      }

      // UI: loading state
      if (btnText) btnText.hidden = true;
      if (btnLoading) btnLoading.hidden = false;
      if (error) error.hidden = true;

      // Simulate send (replace with real endpoint)
      setTimeout(function () {
        if (btnText) btnText.hidden = false;
        if (btnLoading) btnLoading.hidden = true;

        // Show success
        if (success) success.hidden = false;
        form.querySelector('input[type="email"]').value = '';

        // Hide after a while
        setTimeout(function () {
          if (success) success.hidden = true;
        }, 6000);
      }, 1200);
    });

    function showMsg(el, msg) {
      if (!el) return;
      el.textContent = msg;
      el.hidden = false;
      setTimeout(function () { el.hidden = true; }, 5000);
    }
  }

  /* -------------------------------------------------
     5. Init everything on DOM ready
     ------------------------------------------------- */
  function init() {
    initReveals();
    initNav();
    initSmoothScroll();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();