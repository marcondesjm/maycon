const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
navigation.addEventListener('click', event => { if (event.target.closest('a')) { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); } });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); } });
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { document.querySelector('#especialidade').value = link.dataset.service; }));
const form = document.querySelector('#briefing');
let briefing = '';
form.addEventListener('submit', event => {
 event.preventDefault(); if (!form.reportValidity()) return;
 const data = new FormData(form);
 briefing = `Briefing — Maycon Vieira Services\n\nNome: ${data.get('nome').trim()}\nEmpresa: ${data.get('empresa').trim()}\nE-mail: ${data.get('email').trim()}\nEspecialidade: ${data.get('especialidade')}\n\nDemanda:\n${data.get('demanda').trim()}`;
 document.querySelector('#briefing-preview').textContent = briefing;
 document.querySelector('#form-result').hidden = false;
});
document.querySelector('#download').addEventListener('click', () => { const url = URL.createObjectURL(new Blob(['\uFEFF' + briefing], {type:'text/plain;charset=utf-8'})); const link = document.createElement('a'); link.href = url; link.download = 'briefing-maycon-vieira.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });

// Effects are local and dependency-free; the page remains usable without them.
(() => {
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 const fine = matchMedia('(hover: hover) and (pointer: fine)');
 let dispose = () => {};
 function start() {
  dispose();
  dispose = () => {};
  if (reduce.matches) return;
  const controller = new AbortController();
  const signal = controller.signal;
  const cleanups = [];
  const hero = document.querySelector('.hero');
  const scene = hero.querySelector('.hero-scene');
  const progress = document.createElement('div');
  progress.className = 'motion-progress'; progress.setAttribute('aria-hidden','true'); document.body.append(progress);
  const headings = [...document.querySelectorAll('h1,h2')];
  headings.forEach(el => {
   const original = [...el.childNodes];
   const lines = [[]];
   original.forEach(node => {if (node.nodeName === 'BR') lines.push([]);else lines.at(-1).push(node.cloneNode(true));});
   const fragment = document.createDocumentFragment();
   lines.forEach((nodes,i) => { const line=document.createElement('span');line.className='motion-line';const inner=document.createElement('span');nodes.forEach(n=>inner.append(n));line.append(inner);line.style.setProperty('--reveal-delay',`${i*100}ms`);fragment.append(line); });
   el.replaceChildren(fragment);el.classList.add('motion-heading');
   cleanups.push(() => {el.replaceChildren(...original);el.classList.remove('motion-heading');});
  });
  const targets = [...document.querySelectorAll('h1,h2,.hero-content>.eyebrow,.hero-description,.actions,.section-heading>p,.service,.values article,.company .body-copy,.statement,.founder .body-copy,blockquote,.split figure,.contact-copy>p,.contact-signature,#briefing,.client-logos')];
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
   if (entry.isIntersecting) {entry.target.classList.add('is-visible');entry.target.classList.remove('motion-pending');observer.unobserve(entry.target);}
  }),{threshold:.08,rootMargin:'0px 0px -20px 0px'});
  targets.forEach(el => {
   if (el.matches('.service,.values article')) el.style.setProperty('--reveal-delay',`${[...el.parentElement.children].indexOf(el)*85}ms`);
   el.classList.add('motion-ready','motion-pending');observer.observe(el);
  });
  // Reveals never keep a keyboard destination or an anchor destination hidden.
  const show = el => {if(!el) return;targets.filter(t=>t===el||el.contains(t)||t.contains(el)).forEach(t=>{t.classList.remove('motion-pending');t.classList.add('is-visible');observer.unobserve(t);});};
  document.addEventListener('focusin',e=>show(e.target),{signal});
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a)show(document.getElementById(a.hash.slice(1)));},{signal});
  if(location.hash) show(document.getElementById(location.hash.slice(1)));
  const photos = [...document.querySelectorAll('.split figure img:not(.brand-signature)')];
  const photoFrames = photos.map(img => {
   const frame = document.createElement('div'); frame.className = 'photo-frame motion-photo';
   img.before(frame); frame.append(img);
   if (fine.matches) {
    frame.addEventListener('pointermove', e => {
     const r = frame.getBoundingClientRect();
     img.style.setProperty('--photo-x', `${((e.clientX-r.left)/r.width-.5)*-16}px`);
     img.style.setProperty('--photo-mouse-y', `${((e.clientY-r.top)/r.height-.5)*-12}px`);
    }, {passive:true,signal});
    frame.addEventListener('pointerleave', () => {img.style.removeProperty('--photo-x');img.style.removeProperty('--photo-mouse-y');}, {signal});
   }
   return frame;
  });
  const animatedPhotos = [scene, ...photoFrames];
  const photoObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('photo-in-view',entry.isIntersecting)), {threshold:0});
  animatedPhotos.forEach(el => photoObserver.observe(el));
  document.addEventListener('visibilitychange', () => animatedPhotos.forEach(el => el.classList.toggle('photo-paused',document.hidden)), {signal});
  let scrollFrame=0;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function updateScroll(){
   scrollFrame=0;
   const max=document.documentElement.scrollHeight-innerHeight;
   progress.style.setProperty('--reading-progress',max>0?clamp(scrollY/max,0,1):0);
   if(fine.matches){scene.style.setProperty('--scene-scale',1.035+clamp(scrollY/hero.offsetHeight,0,1)*.045);photos.forEach(img=>{const r=img.parentElement.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)img.style.setProperty('--photo-y',`${clamp((innerHeight/2-r.top-r.height/2)*.045,-16,16)}px`);});}
  }
  const queueScroll=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);};
  addEventListener('scroll',queueScroll,{passive:true,signal});addEventListener('resize',queueScroll,{passive:true,signal});updateScroll();
  let pointerFrame=0;
  if(fine.matches){
   const cursor=document.createElement('div');cursor.className='motion-cursor';cursor.innerHTML='<span></span>';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);cleanups.push(()=>cursor.remove());
   let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y,hx=0,hy=0,px=0,py=0;
   function tick(){cx+=(x-cx)*.24;cy+=(y-cy)*.24;px+=(hx-px)*.075;py+=(hy-py)*.075;cursor.style.transform=`translate3d(${cx}px,${cy}px,0)`;scene.style.setProperty('--scene-x',`${px}px`);scene.style.setProperty('--scene-y',`${py}px`);if(Math.abs(cx-x)+Math.abs(cy-y)+Math.abs(px-hx)+Math.abs(py-hy)>.08)pointerFrame=requestAnimationFrame(tick);else pointerFrame=0;}
   const wake=()=>{if(!pointerFrame)pointerFrame=requestAnimationFrame(tick);};
   document.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;x=e.clientX;y=e.clientY;cursor.style.opacity=e.target.closest('input,textarea,select')?'0':'1';cursor.classList.toggle('is-active',!!e.target.closest('a,button'));cursor.classList.toggle('is-photo',!!e.target.closest('.motion-photo'));wake();},{passive:true,signal});
   document.documentElement.addEventListener('pointerleave',()=>{cursor.style.opacity='0';hx=hy=0;wake();},{signal});
   addEventListener('blur',()=>{cursor.style.opacity='0';},{signal});
   hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();hx=(e.clientX/r.width-.5)*-14;hy=((e.clientY-r.top)/r.height-.5)*-12;wake();},{passive:true,signal});
   hero.addEventListener('pointerleave',()=>{hx=hy=0;wake();},{signal});
   document.querySelectorAll('.actions .button,.nav-cta').forEach(el=>{
    el.classList.add('motion-magnetic');
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--magnet-x',`${clamp((e.clientX-r.left-r.width/2)*.08,-9,9)}px`);el.style.setProperty('--magnet-y',`${clamp((e.clientY-r.top-r.height/2)*.15,-6,6)}px`);},{passive:true,signal});
    const reset=()=>{el.style.removeProperty('--magnet-x');el.style.removeProperty('--magnet-y');};el.addEventListener('pointerleave',reset,{signal});el.addEventListener('blur',reset,{signal});cleanups.push(()=>{reset();el.classList.remove('motion-magnetic');});
   });
   document.querySelectorAll('.service').forEach(el=>{
    el.classList.add('motion-card');
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),u=(e.clientX-r.left)/r.width,v=(e.clientY-r.top)/r.height;el.style.setProperty('--tilt-x',`${(v-.5)*-5}deg`);el.style.setProperty('--tilt-y',`${(u-.5)*5}deg`);el.style.setProperty('--light-x',`${u*100}%`);el.style.setProperty('--light-y',`${v*100}%`);},{passive:true,signal});
    const reset=()=>['--tilt-x','--tilt-y','--light-x','--light-y'].forEach(k=>el.style.removeProperty(k));el.addEventListener('pointerleave',reset,{signal});cleanups.push(()=>{reset();el.classList.remove('motion-card');});
   });
  }
  dispose=()=>{controller.abort();observer.disconnect();cancelAnimationFrame(scrollFrame);cancelAnimationFrame(pointerFrame);targets.forEach(el=>{el.classList.remove('motion-ready','motion-pending','is-visible');el.style.removeProperty('--reveal-delay');});photoObserver.disconnect();photos.forEach(img=>{const frame=img.parentElement;frame.replaceWith(img);['--photo-y','--photo-x','--photo-mouse-y'].forEach(k=>img.style.removeProperty(k));});cleanups.reverse().forEach(fn=>fn());progress.remove();};
 }
 start(); reduce.addEventListener('change',start);fine.addEventListener('change',start);
})();

// Header slideshow: keep manual controls available even with reduced motion.
(() => {
 const hero = document.querySelector('.hero');
 const slides = [...hero.querySelectorAll('.hero-slide')];
 const prev = hero.querySelector('.slide-prev'), next = hero.querySelector('.slide-next');
 const pause = hero.querySelector('.slide-pause'), counter = hero.querySelector('.slide-counter');
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 let current = 0, paused = motion.matches, timer = null, inView = true;
 const sync = () => {
  slides.forEach((slide,i) => slide.classList.toggle('is-current', i === current));
  counter.textContent = `${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  pause.setAttribute('aria-label',paused ? 'Retomar apresentação' : 'Pausar apresentação');
  pause.setAttribute('aria-pressed',String(paused)); pause.textContent = paused ? '▶' : 'Ⅱ';
 };
 const stop = () => { clearInterval(timer); timer = null; };
 const run = () => { stop(); if (!paused && !document.hidden && inView && !document.activeElement.closest('.hero-controls')) timer = setInterval(() => { current=(current+1)%slides.length; sync(); },6500); };
 const move = direction => { current=(current+direction+slides.length)%slides.length; paused=true; sync(); run(); };
 prev.addEventListener('click',()=>move(-1)); next.addEventListener('click',()=>move(1));
 pause.addEventListener('click',()=>{paused=!paused;sync();run();});
 hero.addEventListener('focusin', event=>{if (event.target.closest('.hero-controls')) stop();});
 hero.addEventListener('focusout', event=>{if (event.target.closest('.hero-controls') && !event.relatedTarget?.closest('.hero-controls')) run();});
 document.addEventListener('visibilitychange',run);
 motion.addEventListener('change',()=>{if(motion.matches){paused=true;sync();}run();});
 if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;run();},{threshold:0}).observe(hero);
 sync();run();
})();
