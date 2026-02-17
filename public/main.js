/* ===================================================
   Hei Norsk online — Apple-style Reactive Scripts
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
            var parent = entry.target.parentElement;
            var siblings = parent ? parent.querySelectorAll('.reveal') : [];
            var idx = Array.prototype.indexOf.call(siblings, entry.target);
            var stagger = Math.max(0, idx) * 90;

            setTimeout(function () {
              entry.target.classList.add('visible');
            }, stagger);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(function (el) { observer.observe(el); });
  }

  /* -------------------------------------------------
     2. NAV — frosted glass scroll state
     ------------------------------------------------- */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          nav.classList.toggle('scrolled', window.scrollY > 40);
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
     4. COUNTER — animated number count
     ------------------------------------------------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = el.dataset.count; });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });

    function animateCounter(el) {
      var target = parseInt(el.dataset.count, 10);
      var duration = 1600;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  /* -------------------------------------------------
     5. GLASS CARD TILT — reactive mouse effect
     ------------------------------------------------- */
  function initTilt() {
    var cards = document.querySelectorAll('[data-tilt]');
    if (!cards.length || window.matchMedia('(hover: none)').matches) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotateX = (y - 0.5) * -8;
        var rotateY = (x - 0.5) * 8;
        card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* -------------------------------------------------
     6. PARALLAX — subtle bg movement
     ------------------------------------------------- */
  function initParallax() {
    var bg = document.querySelector('.hero__bg');
    if (!bg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrolled = window.scrollY;
          var rate = scrolled * 0.25;
          bg.style.transform = 'translateY(' + rate + 'px) scale(1.02)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* -------------------------------------------------
     7. FORM — email signup
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

      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email.value.trim())) {
        showMsg(error, 'Por favor, introduce un email válido.');
        return;
      }

      if (btnText) btnText.hidden = true;
      if (btnLoading) btnLoading.hidden = false;
      if (error) error.hidden = true;

      setTimeout(function () {
        if (btnText) btnText.hidden = false;
        if (btnLoading) btnLoading.hidden = true;
        if (success) success.hidden = false;
        email.value = '';
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
     8. INIT
     ------------------------------------------------- */
  function init() {
    initReveals();
    initNav();
    initSmoothScroll();
    initCounters();
    initTilt();
    initParallax();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();