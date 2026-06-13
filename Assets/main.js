/* =============================
   PORTFOLIO — main.js
   ============================= */

(function () {
  'use strict';

  /* ── Navbar: scroll behaviour ── */
  const nav = document.getElementById('mainNav');
  function handleNavScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ── Active nav link on scroll (Intersection Observer) ── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar-nav .nav-link');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.navbar-nav .nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach(s => sectionObserver.observe(s));

  /* ── Close mobile navbar on link click ── */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const bsCollapse = document.getElementById('navbarNav');
      if (bsCollapse && bsCollapse.classList.contains('show')) {
        const toggler = document.querySelector('.navbar-toggler');
        if (toggler) toggler.click();
      }
    });
  });

  /* ── Scroll-reveal (Intersection Observer) ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach(el => revealObs.observe(el));

  /* ── Skill bars animation ── */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = fill.dataset.pct + '%';
          skillObs.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );
  skillFills.forEach(f => skillObs.observe(f));

  /* ── Lightweight Carousel / Slider ── */
  function initSlider() {
    const track   = document.querySelector('.slider-track');
    const cards   = document.querySelectorAll('.slider-track .project-card-wrap');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dots    = document.querySelectorAll('.swiper-dot');

    if (!track || !cards.length) return;

    /* How many columns visible at current breakpoint */
    function colsVisible() {
      if (window.innerWidth >= 992) return 3;
      if (window.innerWidth >= 576) return 2;
      return 1;
    }

    let current = 0;

    function maxIndex() { return Math.max(0, cards.length - colsVisible()); }

    function goTo(idx) {
      current = Math.min(Math.max(idx, 0), maxIndex());
      const pct = (100 / colsVisible()) * current;
      track.style.transform = `translateX(-${pct}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    /* Recalculate on resize */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => goTo(current), 200);
    });

    /* Touch / drag swipe */
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    }, { passive: true });

    goTo(0);
  }
  initSlider();

  /* ── Animated counters in About stats ── */
  function animateCount(el, target, duration = 1800) {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statEls = document.querySelectorAll('.stat-num[data-count]');
  const statObs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target, parseInt(entry.target.dataset.count));
          statObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.7 }
  );
  statEls.forEach(e => statObs.observe(e));

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 80;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

})();
