/* ===================================================
   Hei Norsk online — Landing v2 Scripts
   Minimal, performant, no dependencies
   =================================================== */

;(function () {
  'use strict';

  /* -------------------------------------------------
     1. REVEAL — IntersectionObserver with stagger
     ------------------------------------------------- */
  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger siblings
            var parent = entry.target.parentElement;
            var siblings = parent ? Array.from(parent.querySelectorAll(':scope > .reveal')) : [];
            var idx = siblings.indexOf(entry.target);
            var stagger = Math.max(0, idx) * 80;

            setTimeout(function () {
              entry.target.classList.add('visible');
            }, stagger);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    els.forEach(function (el) { observer.observe(el); });
  }

  /* -------------------------------------------------
     2. NAV — scroll state
     ------------------------------------------------- */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          nav.classList.toggle('scrolled', window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* -------------------------------------------------
     3. SMOOTH SCROLL
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
     4. FORM — email signup
     ------------------------------------------------- */
  function initForm() {
    var form = document.getElementById('signup-form');
    if (!form) return;

    var btnText = form.querySelector('.btn-text');
    var btnLoading = form.querySelector('.btn-loading');
    var success = document.getElementById('signup-success');
    var error = document.getElementById('signup-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = form.querySelector('input[type="email"]');
      if (!email || !email.value.trim()) return;

      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email.value.trim())) {
        showMsg(error, 'Por favor, introduce un email válido.');
        return;
      }

      // Show loading
      if (btnText) btnText.hidden = true;
      if (btnLoading) btnLoading.hidden = false;
      if (error) error.hidden = true;

      // Simulate submission (replace with actual endpoint)
      setTimeout(function () {
        if (btnText) btnText.hidden = false;
        if (btnLoading) btnLoading.hidden = true;
        if (success) success.hidden = false;
        email.value = '';
        setTimeout(function () {
          if (success) success.hidden = true;
        }, 5000);
      }, 1000);
    });

    function showMsg(el, msg) {
      if (!el) return;
      el.textContent = msg;
      el.hidden = false;
      setTimeout(function () { el.hidden = true; }, 4000);
    }
  }

  /* -------------------------------------------------
     5. FAQ — smooth open/close
     ------------------------------------------------- */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (this.open) {
          // Close other items
          items.forEach(function (other) {
            if (other !== item && other.open) {
              other.removeAttribute('open');
            }
          });
        }
      });
    });
  }

  /* -------------------------------------------------
     6. PARALLAX — subtle aurora movement
     ------------------------------------------------- */
  function initParallax() {
    var aurora = document.getElementById('aurora');
    if (!aurora || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var rate = window.scrollY * 0.15;
          aurora.style.transform = 'translateY(' + rate + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* -------------------------------------------------
     INIT
     ------------------------------------------------- */
  function init() {
    initReveals();
    initNav();
    initSmoothScroll();
    initForm();
    initFaq();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();