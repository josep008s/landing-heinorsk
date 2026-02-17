/* ===================================================
   Hei Norsk online — Premium Arctic Landing Scripts
   =================================================== */

;(function () {
  'use strict';

  /* -------------------------------------------------
     1. STARS — animated background
     ------------------------------------------------- */
  function initStars() {
    var canvas = document.getElementById('stars');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var stars = [];
    var count = 120;
    var dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width  = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    }

    function createStars() {
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 1.2 + 0.3,
          alpha: Math.random() * 0.6 + 0.1,
          speed: Math.random() * 0.0008 + 0.0003,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = s.alpha * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,214,229,' + a.toFixed(3) + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    createStars();
    requestAnimationFrame(draw);

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        createStars();
      }, 200);
    }, { passive: true });
  }

  /* -------------------------------------------------
     2. REVEAL — IntersectionObserver with stagger
     ------------------------------------------------- */
  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var delay = 0;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger siblings
            var parent = entry.target.parentElement;
            var siblings = parent ? parent.querySelectorAll('.reveal') : [];
            var idx = Array.prototype.indexOf.call(siblings, entry.target);
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
     3. NAV — scroll state
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
     4. SMOOTH SCROLL
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
     5. COUNTER — animated number count
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
      var duration = 1800;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  /* -------------------------------------------------
     6. FORM — email signup
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

      // Simulate send (replace with real endpoint)
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
     7. INIT
     ------------------------------------------------- */
  function init() {
    initStars();
    initReveals();
    initNav();
    initSmoothScroll();
    initCounters();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();