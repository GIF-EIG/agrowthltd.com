document.addEventListener('DOMContentLoaded',()=>{
  const main=document.querySelector('main[data-current]');
  const current=main?.dataset.current;
  document.querySelectorAll('.nav-links a[data-page]').forEach(a=>{if(a.dataset.page===current)a.classList.add('active')});

  const hamb=document.querySelector('.hamb'), nav=document.querySelector('.nav-links');
  if(hamb&&nav) hamb.addEventListener('click',()=>{
    const open=nav.classList.toggle('mobile-open');
    hamb.setAttribute('aria-expanded',String(open));
    hamb.querySelector('span').textContent=open?'×':'☰';
  });

  const dd=document.querySelector('.nav-dropdown'), trig=document.querySelector('.dropdown-trigger');
  if(dd&&trig) trig.addEventListener('click',e=>{
    if(window.matchMedia('(max-width:900px)').matches){e.preventDefault();dd.classList.toggle('open')}
  });

  // Motion language: headings rise into view; body copy fades in; visual objects use a light rise.
  // The Home hero's main headline is intentionally immediate and never animated.
  const titleTargets=[...document.querySelectorAll('main h1, main h2, main h3, main h4')]
    .filter(el=>!el.matches('.home-hero h1'));
  const bodyTargets=[...document.querySelectorAll('main p, main li, main .meta, main .eyebrow, main .filter, main label, main .kicker')];
  const objectTargets=[...document.querySelectorAll('main .btn, main .product-card, main .value-card, main .inside-card, main .product-detail, main .what-card, main figure, main .quality-box img, main .story-image, main .vision > img, main .about-who > img, main .map-frame')];

  titleTargets.forEach(el=>el.classList.add('reveal-title'));
  bodyTargets.forEach(el=>el.classList.add('reveal-body'));
  objectTargets.forEach(el=>el.classList.add('reveal-object'));

  const allTargets=[...new Set([...titleTargets,...bodyTargets,...objectTargets])];
  if('IntersectionObserver' in window){
    const obs=new IntersectionObserver(entries=>entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('is-visible');
        obs.unobserve(en.target);
      }
    }),{threshold:.08,rootMargin:'0px 0px -3% 0px'});
    allTargets.forEach(el=>obs.observe(el));
  }else allTargets.forEach(el=>el.classList.add('is-visible'));

  const filters=document.querySelectorAll('.filter');
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    filters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(card=>card.style.display=(f==='all'||card.dataset.category===f)?'':'none');
  }));

  const form=document.querySelector('#enquiry-form');
  if(form) form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return}
    const d=new FormData(form);
    const subject=encodeURIComponent(d.get('subject')||'Business Enquiry');
    const body=encodeURIComponent(`Full name: ${d.get('name')}\nEmail: ${d.get('email')}\nCompany: ${d.get('company')||'-'}\nPhone: ${d.get('phone')}\n\n${d.get('message')}`);
    location.href=`mailto:agrowth.adm@gmail.com?subject=${subject}&body=${body}`;
  });
});
