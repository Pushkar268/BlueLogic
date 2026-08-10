(function () {
  document.documentElement.classList.add('js-ready');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 680px)').matches;

  /* ---------------- Navigation ---------------- */
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  const onScroll = () => {
    header.classList.toggle('is-compact', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      mobileNav.hidden = false;
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });
  mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  /* ---------------- Capability accordion ---------------- */
  function setBodyHeight(row, open) {
    const body = row.querySelector('.capability-body');
    body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
  }
  const capabilityRows = document.querySelectorAll('.capability-row');
  document.querySelectorAll('.capability-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.capability-row');
      const open = row.classList.contains('is-open');
      capabilityRows.forEach((r) => {
        if (r !== row && r.classList.contains('is-open')) {
          r.classList.remove('is-open');
          r.querySelector('.capability-trigger').setAttribute('aria-expanded', 'false');
          setBodyHeight(r, false);
        }
      });
      row.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
      setBodyHeight(row, !open);
    });
  });
  // Recompute the open row's height on resize (text reflow changes scrollHeight).
  let capResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(capResizeTimer);
    capResizeTimer = setTimeout(() => {
      const openRow = document.querySelector('.capability-row.is-open');
      if (openRow) setBodyHeight(openRow, true);
    }, 150);
  });

  /* ---------------- Magnetic buttons ---------------- */
  if (!prefersReduced && !isMobile && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = 14;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
        const my = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
        el.style.setProperty('--mx', mx + 'px');
        el.style.setProperty('--my', my + 'px');
      });
      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      });
    });
  }

  /* ---------------- Enquiry form: validation + loading/success/error states ----
     The only real "backend" here is a mailto: submission — there is no server
     to confirm delivery, so the success state honestly says "opening your
     email client" rather than claiming the message was sent. ---------------- */
  const form = document.getElementById('enquiryForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('enquirySubmit');

  function setFieldError(field, message) {
    const wrapper = field.closest('.field');
    const errorEl = document.getElementById(field.getAttribute('aria-describedby'));
    if (wrapper) wrapper.classList.toggle('has-error', Boolean(message));
    if (errorEl) errorEl.textContent = message || '';
  }

  function validateEnquiryForm() {
    let valid = true;
    let firstInvalid = null;

    const name = form.elements.name;
    if (!name.value.trim()) {
      setFieldError(name, 'Please enter your name.');
      valid = false;
      firstInvalid = firstInvalid || name;
    } else {
      setFieldError(name, '');
    }

    const email = form.elements.email;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      setFieldError(email, 'Please enter your work email.');
      valid = false;
      firstInvalid = firstInvalid || email;
    } else if (!emailPattern.test(email.value.trim())) {
      setFieldError(email, 'Enter a valid email address.');
      valid = false;
      firstInvalid = firstInvalid || email;
    } else {
      setFieldError(email, '');
    }

    const phone = form.elements.phone;
    const digits = phone.value.replace(/\D/g, '');
    if (!phone.value.trim()) {
      setFieldError(phone, 'Please enter your phone number.');
      valid = false;
      firstInvalid = firstInvalid || phone;
    } else if (digits.length < 7) {
      setFieldError(phone, 'Enter a valid phone number.');
      valid = false;
      firstInvalid = firstInvalid || phone;
    } else {
      setFieldError(phone, '');
    }

    return { valid, firstInvalid };
  }

  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { valid, firstInvalid } = validateEnquiryForm();

      if (!valid) {
        status.classList.remove('is-success');
        status.classList.add('is-error');
        status.textContent = 'Please fix the highlighted fields before submitting.';
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      status.classList.remove('is-error');
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      status.textContent = 'Preparing your enquiry…';

      window.setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        status.classList.add('is-success');
        status.textContent = 'Opening your email client — send the message there to complete your enquiry.';
        form.submit();
      }, 450);
    });

    form.querySelectorAll('[required]').forEach((field) => {
      field.addEventListener('input', () => setFieldError(field, ''));
    });
  }

  /* ---------------- GSAP / ScrollTrigger / Lenis ---------------- */
  const hasGSAP = window.gsap && window.ScrollTrigger;
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Smooth scroll — skip on mobile and reduced-motion for native touch feel & accessibility.
  let lenis = null;
  if (!prefersReduced && !isMobile && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', hasGSAP ? ScrollTrigger.update : undefined);
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Anchor links: keep native jump if Lenis is off, else use Lenis scrollTo.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -70 });
      } else {
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      }
      closeMenu();
    });
  });

  if (!hasGSAP) return;

  /* ---- Hero entrance timeline ---- */
  if (prefersReduced) {
    // Skip the staged entrance — show final state immediately, no motion.
    gsap.set('.hero-title .word', { yPercent: 0, opacity: 1, display: 'inline-block' });
    gsap.set(['.hero-lead', '.hero-actions', '.hero-stats', '.eyebrow[data-hero-in]'], { opacity: 1, y: 0 });
  } else {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .to('.hero-title .word', { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.1)
      .to('.hero-lead', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to('.hero-actions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.45')
      .to('.hero-stats', { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
      .to('.eyebrow[data-hero-in]', { opacity: 1, duration: 0.5 }, 0);

    gsap.set('.hero-title .word', { yPercent: 110, opacity: 0, display: 'inline-block' });
    gsap.set(['.hero-lead', '.hero-actions', '.hero-stats'], { opacity: 0, y: 18 });
  }

  /* ---- Scroll reveals (batched) ---- */
  if (window.ScrollTrigger.batch) {
    ScrollTrigger.batch('.reveal-up', {
      start: 'top 88%',
      onEnter: (batch) => batch.forEach((el) => el.classList.add('is-visible')),
      once: true,
    });
  }

  /* ---- Nav active state on scroll ---- */
  const navLinks = document.querySelectorAll('.primary-nav a');
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  sections.forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        navLinks.forEach((a) => a.removeAttribute('aria-current'));
        const match = document.querySelector(`.primary-nav a[href="#${sec.id}"]`);
        if (match) match.setAttribute('aria-current', 'page');
      },
    });
  });

  /* ---- Capability rail active state on scroll ---- */
  const railLinks = document.querySelectorAll('.capability-rail a');
  const railGroups = Array.from(railLinks)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  railGroups.forEach((group) => {
    ScrollTrigger.create({
      trigger: group,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (!self.isActive) return;
        railLinks.forEach((a) => a.classList.remove('is-active'));
        const match = document.querySelector(`.capability-rail a[href="#${group.id}"]`);
        if (match) match.classList.add('is-active');
      },
    });
  });

  /* ---- Process pinned scene: stages stack absolutely inside one pinned
     viewport and crossfade as the user scrolls through it. ---- */
  const processScene = document.getElementById('processScene');
  const stages = gsap.utils.toArray('.process-stage');
  if (stages.length && processScene && !isMobile && !prefersReduced) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: processScene,
        start: 'top top',
        end: `+=${(stages.length - 1) * 100}%`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });
    for (let i = 0; i < stages.length - 1; i++) {
      tl.to(stages[i], { opacity: 0, duration: 1 })
        .to(stages[i + 1], { opacity: 1, duration: 1 }, '<');
    }
  } else if (stages.length) {
    // Mobile: skip pinning/scrub entirely — a static stacked layout is more
    // reliable than a scroll-triggered fade, and reduces motion on-device.
    gsap.set('.process-scene', { height: 'auto' });
    gsap.set(stages, {
      opacity: 1, position: 'relative', inset: 'auto',
      height: 'auto', minHeight: '0',
    });
  }

  ScrollTrigger.addEventListener('refreshInit', () => {
    if (lenis) lenis.resize();
  });
})();
