(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* nav solid on scroll */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 20);
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  const toggle = $('#navToggle'), mobile = $('#navMobile');
  if (toggle && mobile) {
    const set = (open) => {
      mobile.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => set(!mobile.classList.contains('open')));
    $$('a', mobile).forEach((a) => a.addEventListener('click', () => set(false)));
  }

  /* faq accordion */
  $$('.faq__item').forEach((item) => {
    const q = $('.faq__q', item), a = $('.faq__a', item);
    q.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
    });
  });

  /* reveal */
  const reveals = new Set($$('.reveal'));
  const show = (el) => { el.classList.add('in'); reveals.delete(el); };
  if (reduced) { reveals.forEach(show); }
  else {
    const check = () => { const vh = innerHeight; reveals.forEach((el) => { if (el.getBoundingClientRect().top < vh * 0.9) show(el); }); };
    requestAnimationFrame(check);
    addEventListener('scroll', check, { passive: true });
    addEventListener('resize', check);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), { threshold: 0.08 });
      reveals.forEach((el) => io.observe(el));
    }
  }
})();
