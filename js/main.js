/**
 * main.js — Portafolio Ivania Quintana UX/UI
 * ─────────────────────────────────────────────────
 * 1. Navbar scroll effect
 * 2. Active nav link on scroll
 * 3. Scroll reveal (IntersectionObserver)
 * 4. Close mobile menu on link click
 * 5. Contact form validation & feedback
 * 6. Smooth anchor scroll (offset para navbar fijo)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR scroll ─────────────────────────── */
  const nav = document.getElementById('mainNav');

  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ── 2. ACTIVE nav link ───────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.iq-navbar .nav-link');

  const updateActive = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) {
        current = sec.getAttribute('id');
      }
    });
    // mapear sobre-mi al link de Sobre Mí
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const match =
        href === `#${current}` ||
        (href === '#sobre-mi' && current === 'sobre-mi');
      link.classList.toggle('active', match);
    });
  };
  window.addEventListener('scroll', updateActive, { passive: true });


  /* ── 3. SCROLL REVEAL ────────────────────────── */
  const revealTargets = [
    '.iq-card',
    '.iq-icard',
    '.iq-tool',
    '.iq-learn-list li',
    '.iq-tag',
    '.iq-title',
    '.iq-body',
    '.iq-case-title',
    '.iq-contact-title',
    '.iq-question-label',
  ];

  document.querySelectorAll(revealTargets.join(',')).forEach((el, idx) => {
    el.classList.add('reveal');
    // stagger for siblings
    const siblings = [...(el.parentElement?.children || [])].filter(c =>
      c.classList.contains('reveal')
    );
    const pos = siblings.indexOf(el);
    if (pos === 1) el.classList.add('delay-r1');
    if (pos === 2) el.classList.add('delay-r2');
    if (pos >= 3)  el.classList.add('delay-r3');
  });

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  /* ── 4. CLOSE mobile menu on link click ─────── */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navMenu');
      if (collapse.classList.contains('show')) {
        document.querySelector('.navbar-toggler')?.click();
      }
    });
  });


  /* ── 5. CONTACT FORM ─────────────────────────── */
  const form    = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (form) {

    // clear invalid on input
    form.querySelectorAll('.iq-input').forEach(input => {
      input.addEventListener('input', () => input.classList.remove('is-invalid'));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre  = form.nombre.value.trim();
      const email   = form.email.value.trim();
      const mensaje = form.mensaje.value.trim();

      // reset
      formMsg.className = 'iq-form-feedback d-none';
      form.querySelectorAll('.iq-input').forEach(i => i.classList.remove('is-invalid'));

      // validate
      let valid = true;
      if (!nombre)               { form.nombre.classList.add('is-invalid');  valid = false; }
      if (!emailRe.test(email))  { form.email.classList.add('is-invalid');   valid = false; }
      if (!mensaje)              { form.mensaje.classList.add('is-invalid'); valid = false; }

      if (!valid) {
        formMsg.textContent = 'Por favor, completa todos los campos correctamente.';
        formMsg.classList.remove('d-none');
        formMsg.classList.add('error');
        return;
      }

      // sending state
      const btn = form.querySelector('.iq-btn-send');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Enviando… <span class="spinner-border spinner-border-sm ms-2" role="status"></span>';

      // — Aquí conecta tu endpoint real o EmailJS —
      await new Promise(r => setTimeout(r, 1400));

      btn.disabled  = false;
      btn.innerHTML = original;
      form.reset();

      formMsg.textContent = '¡Mensaje enviado! Me pondré en contacto muy pronto. 😊';
      formMsg.classList.remove('d-none', 'error');
      formMsg.classList.add('success');

      setTimeout(() => {
        formMsg.classList.add('d-none');
        formMsg.className = 'iq-form-feedback d-none';
      }, 5500);
    });
  }


  /* ── 6. SMOOTH SCROLL (offset navbar) ───────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 78;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth',
      });
    });
  });

});