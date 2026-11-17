const photoButton = document.querySelector('.sector-photo-button');

if (photoButton) {
  const photo = document.querySelector('.sector-photo');
  let current = 1;
  photoButton.hidden = false;

  photoButton.addEventListener('click', () => {
    current = current === 1 ? 2 : 1;
    const next = 3 - current;
    const asset = `/assets/especialidades/${photoButton.dataset.photo}-${current}`;
    photo.srcset = `${asset}-800.webp 800w, ${asset}-1536.webp 1536w`;
    photo.src = `${asset}-1536.webp`;
    photoButton.firstChild.textContent = `${current} / 2 `;
    photoButton.setAttribute('aria-label', `Mostrar foto ${next} de 2`);
  });
}


/* Motion system shared with the home: subtle reveals, parallax and tactile hover. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;

  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const revealTargets = [
    ...document.querySelectorAll(
      '.sector-hero-content > *, .sector-section-heading > *, .profession-group, .sector-related a, .sector-contact .sector-wrap > *, .sector-footer-top > *, .sector-footer-bottom > *'
    )
  ];

  revealTargets.forEach((el, index) => {
    el.classList.add('sector-motion-ready');
    el.style.setProperty('--sector-delay', (Math.min(index % 5, 4) * 70) + 'ms');
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sector-motion-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  const hero = document.querySelector('.sector-hero');
  const photo = document.querySelector('.sector-photo');
  let raf = 0;

  const update = () => {
    raf = 0;
    if (!hero || !photo) return;
    const rect = hero.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < innerHeight;
    if (!visible) return;
    const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - (rect.top + rect.height / 2)) / innerHeight));
    photo.style.setProperty('--sector-photo-y', (progress * 18) + 'px');
    photo.style.setProperty('--sector-photo-scale', String(1.035 + Math.abs(progress) * .02));
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', queue, { passive:true });
  addEventListener('resize', queue, { passive:true });
  update();

  if (fine) {
    document.querySelectorAll('.profession-group, .sector-related a, .sector-button').forEach(el => {
      el.classList.add('sector-motion-tactile');
      el.addEventListener('pointermove', event => {
        const r = el.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width;
        const y = (event.clientY - r.top) / r.height;
        el.style.setProperty('--sector-x', ((x - .5) * 5) + 'px');
        el.style.setProperty('--sector-y', ((y - .5) * 4) + 'px');
      }, { passive:true });
      el.addEventListener('pointerleave', () => {
        el.style.removeProperty('--sector-x');
        el.style.removeProperty('--sector-y');
      });
    });
  }
})();
