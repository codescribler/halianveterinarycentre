/* ============================================================
   HALIAN VETERINARY CENTRE — Demo JavaScript
   Handles: scroll animations, hero entrance, sticky nav,
   mobile menu, demo modal
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initHeroAnimation();
    initScrollAnimations();
    initStickyNav();
    initMobileMenu();
    initDemoModal();
  });

  /* ---------- Hero Entrance Animation ---------- */
  function initHeroAnimation() {
    var heroElements = document.querySelectorAll('.anim-hero');
    if (!heroElements.length) return;

    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    heroElements.forEach(function (el) {
      var delay = parseInt(el.getAttribute('data-hero-delay'), 10) || 1;
      var ms = 200 + (delay - 1) * 250;

      setTimeout(function () {
        el.classList.add('is-visible');
      }, ms);
    });
  }

  /* ---------- Scroll Animations (Intersection Observer) ---------- */
  function initScrollAnimations() {
    var targets = document.querySelectorAll('.anim-fade-up');
    if (!targets.length) return;

    // Reduced motion: show everything immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  /* ---------- Sticky Nav Shadow ---------- */
  function initStickyNav() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var scrolled = false;

    function onScroll() {
      var shouldBeScrolled = window.scrollY > 10;
      if (shouldBeScrolled !== scrolled) {
        scrolled = shouldBeScrolled;
        header.classList.toggle('site-header--scrolled', scrolled);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile Menu ---------- */
  function initMobileMenu() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    var focusableElements;
    var firstFocusable;
    var lastFocusable;

    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      // Focus trap
      focusableElements = menu.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable = focusableElements[0];
      lastFocusable = focusableElements[focusableElements.length - 1];

      if (firstFocusable) firstFocusable.focus();
    }

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
      toggle.focus();
    }

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    toggle.addEventListener('click', function () {
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on nav link click (mobile)
    var navLinks = menu.querySelectorAll('.nav__link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (isOpen()) closeMenu();
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        closeMenu();
      }
    });

    // Focus trap within mobile menu
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !isOpen()) return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });

    // Close menu if viewport widens past mobile breakpoint
    var mql = window.matchMedia('(min-width: 768px)');
    mql.addEventListener('change', function (e) {
      if (e.matches && isOpen()) {
        closeMenu();
      }
    });
  }

  /* ---------- Demo Modal ---------- */
  function initDemoModal() {
    var overlay = document.getElementById('demo-modal');
    var closeBtn = document.getElementById('modal-close');
    var triggers = document.querySelectorAll('[data-modal-trigger]');
    if (!overlay || !closeBtn) return;

    var previousFocus = null;
    var focusableInModal;
    var firstFocusable;
    var lastFocusable;

    function openModal() {
      previousFocus = document.activeElement;
      overlay.removeAttribute('hidden');

      // Force reflow before adding class for transition
      void overlay.offsetWidth;
      overlay.classList.add('is-open');

      document.body.style.overflow = 'hidden';

      focusableInModal = overlay.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable = focusableInModal[0];
      lastFocusable = focusableInModal[focusableInModal.length - 1];

      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';

      // Wait for transition to finish before hiding
      setTimeout(function () {
        overlay.setAttribute('hidden', '');
      }, 350);

      if (previousFocus) previousFocus.focus();
    }

    // Trigger buttons
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    // Close button
    closeBtn.addEventListener('click', closeModal);

    // Click outside modal
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeModal();
      }
    });

    // Focus trap
    overlay.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }
})();
