const photoButton = document.querySelector('.sector-photo-button');

if (photoButton) {
  const hero = document.querySelector('.sector-hero');
  const photo = document.querySelector('.sector-photo');
  const photoKey = photoButton.dataset.photo;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 1;
  let paused = motion.matches;
  let timer = null;
  let inView = true;
  let request = 0;

  const controls = document.createElement('div');
  controls.className = 'sector-photo-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Controles das fotos desta especialidade');
  controls.innerHTML = `
    <button type="button" class="sector-slide-prev" aria-label="Foto anterior">←</button>
    <span class="sector-slide-counter" aria-hidden="true">01 / 02</span>
    <span class="sector-slide-status sr-only" aria-live="polite" aria-atomic="true">Foto 1 de 2</span>
    <button type="button" class="sector-slide-next" aria-label="Próxima foto">→</button>
    <button type="button" class="sector-slide-pause" aria-label="Pausar apresentação" aria-pressed="false">Ⅱ</button>
  `;
  photoButton.replaceWith(controls);

  const prev = controls.querySelector('.sector-slide-prev');
  const next = controls.querySelector('.sector-slide-next');
  const pause = controls.querySelector('.sector-slide-pause');
  const counter = controls.querySelector('.sector-slide-counter');
  const status = controls.querySelector('.sector-slide-status');

  const assetFor = index => `/assets/especialidades/${photoKey}-${index}`;

  const preload = index => new Promise(resolve => {
    const img = new Image();
    img.srcset = `${assetFor(index)}-800.webp 800w, ${assetFor(index)}-1536.webp 1536w`;
    img.src = `${assetFor(index)}-1536.webp`;
    if (img.complete) resolve(true);
    else {
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    }
  });

  const sync = () => {
    counter.textContent = `${String(current).padStart(2,'0')} / 02`;
    status.textContent = `Foto ${current} de 2`;
    pause.setAttribute('aria-label', paused ? 'Retomar apresentação' : 'Pausar apresentação');
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? '▶' : 'Ⅱ';
  };

  const show = async index => {
    const sequence = ++request;
    if (!await preload(index) || sequence !== request) return;
    photo.classList.add('is-changing');
    setTimeout(() => {
      if (sequence !== request) return;
      const asset = assetFor(index);
      photo.srcset = `${asset}-800.webp 800w, ${asset}-1536.webp 1536w`;
      photo.src = `${asset}-1536.webp`;
      current = index;
      sync();
      requestAnimationFrame(() => photo.classList.remove('is-changing'));
      if (!paused && !document.hidden && inView) void preload(current === 1 ? 2 : 1);
    }, motion.matches ? 0 : 240);
  };

  const stop = () => {
    clearInterval(timer);
    timer = null;
  };

  const run = () => {
    stop();
    if (!paused && !document.hidden && inView && !controls.matches(':focus-within')) {
      void preload(current === 1 ? 2 : 1);
      timer = setInterval(() => void show(current === 1 ? 2 : 1), 6500);
    }
  };

  const move = direction => {
    paused = true;
    const target = direction > 0 ? (current === 1 ? 2 : 1) : (current === 1 ? 2 : 1);
    sync();
    run();
    void show(target);
  };

  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  pause.addEventListener('click', () => {
    paused = !paused;
    sync();
    run();
  });
  controls.addEventListener('focusin', stop);
  controls.addEventListener('focusout', event => {
    if (!event.relatedTarget || !controls.contains(event.relatedTarget)) run();
  });
  document.addEventListener('visibilitychange', run);
  motion.addEventListener('change', () => {
    if (motion.matches) paused = true;
    sync();
    run();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      run();
    }, { threshold: 0 }).observe(hero);
  }

  sync();
  run();
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


/* Header motion aligned with the home */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.sector-header');
  if (!header) return;

  const items = [
    header.querySelector('.sector-brand'),
    ...header.querySelectorAll('nav a'),
    header.querySelector('.sector-header-cta')
  ].filter(Boolean);

  items.forEach((el, index) => {
    el.classList.add('sector-header-motion');
    el.style.setProperty('--header-delay', (index * 70) + 'ms');
  });

  if (reduce.matches) {
    items.forEach(el => el.classList.add('sector-header-motion-visible'));
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      items.forEach(el => el.classList.add('sector-header-motion-visible'));
    });
  });
})();


/* Responsive hamburger menu for internal pages. */
(() => {
  const toggle = document.querySelector('.sector-menu-toggle');
  const nav = document.querySelector('#sector-navigation');
  if (!toggle || !nav) return;

  const close = () => {
    toggle.setAttribute('aria-expanded','false');
    nav.classList.remove('is-open');
    document.body.classList.remove('sector-menu-open');
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
    document.body.classList.toggle('sector-menu-open', !open);
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

  addEventListener('resize', () => {
    if (innerWidth > 760) close();
  }, {passive:true});

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      close();
      toggle.focus();
    }
  });
})();


/* Basic source-view deterrence for public pages.
   Note: client-side source cannot be made truly inaccessible once delivered to a browser. */
(() => {
  const block = event => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  document.addEventListener('contextmenu', block, { capture:true });

  document.addEventListener('keydown', event => {
    const key = String(event.key || '').toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;

    const blocked =
      key === 'f12' ||
      (ctrl && key === 'u') ||
      (ctrl && shift && ['i','j','c'].includes(key));

    if (blocked) block(event);
  }, { capture:true });
})();
