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

  const allHeadings=[...document.querySelectorAll('main h1, main h2, main h3, main h4')]
    .filter(el=>!el.matches('.home-hero h1, .product-intro h2'));
  const fadeCopy=[...document.querySelectorAll(
    'main p, main li, main .meta, main .eyebrow, main .filter, main label, main .kicker, main .btn, main .product-intro h2'
  )];
  const cardObjects=[...document.querySelectorAll(
    'main .product-card, main .value-card, main .inside-card, main .product-detail, main .what-card'
  )];

  allHeadings.forEach(el=>el.classList.add('reveal-title'));
  fadeCopy.forEach(el=>el.classList.add('reveal-body'));
  cardObjects.forEach(el=>el.classList.add('reveal-object'));
  document.querySelector('.home-hero h1')?.classList.add('is-visible','hero-static');

  const targets=[...new Set([...allHeadings,...fadeCopy,...cardObjects])];
  if('IntersectionObserver' in window){
    const obs=new IntersectionObserver(entries=>entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('is-visible');
        obs.unobserve(en.target);
      }
    }),{threshold:.06,rootMargin:'0px 0px -2% 0px'});
    targets.forEach(el=>obs.observe(el));
  } else targets.forEach(el=>el.classList.add('is-visible'));

  const filters=document.querySelectorAll('.filter');
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    filters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(card=>card.style.display=(f==='all'||card.dataset.category===f)?'':'none');
  }));

  const form=document.querySelector('#enquiry-form');
  if(form){
    const button=form.querySelector('.submit');
    const status=document.querySelector('#form-status');
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return}
      button.disabled=true; button.textContent='Submitting...';
      status.className='form-status'; status.textContent='';
      const data=Object.fromEntries(new FormData(form).entries());
      try{
        const res=await fetch('/api/enquiry',{
          method:'POST',
          headers:{'Content-Type':'application/json','Accept':'application/json'},
          body:JSON.stringify(data)
        });
        const payload=await res.json().catch(()=>({}));
        if(!res.ok||!payload.success) throw new Error(payload.error||'Submission failed');
        form.reset();
        status.classList.add('success');
        status.innerHTML='<strong>Thank you. Your enquiry has been submitted.</strong><br>Our team will get back to you shortly.';
      }catch(err){
        status.classList.add('error');
        status.textContent='Something went wrong. Please try again or email agrowth.adm@gmail.com.';
      }finally{
        button.disabled=false; button.textContent='Submit';
      }
    });
  }
});
