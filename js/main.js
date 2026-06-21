// ===== Ruel et Frère — shared interactions =====
(function(){
  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  const solid = header && header.classList.contains('solid');

  // scrolled header (only for transparent/hero headers)
  function onScroll(){
    if(!header || solid) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // mobile menu
  if(burger){
    burger.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      burger.classList.toggle('x', open);
      document.body.classList.toggle('nav-open', open);
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open'); burger.classList.remove('x'); document.body.classList.remove('nav-open');
    }));
  }

  // reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // product brand tabs
  document.querySelectorAll('[data-tab]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const group = btn.closest('.brand-section');
      group.querySelectorAll('[data-tab]').forEach(b=>b.classList.remove('active'));
      group.querySelectorAll('.brand-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      group.querySelector('#'+btn.dataset.tab).classList.add('active');
    });
  });

  // lightbox gallery
  const items = [...document.querySelectorAll('[data-lightbox]')];
  if(items.length){
    const lb = document.createElement('div');
    lb.className='lightbox';
    lb.innerHTML='<button class="close" aria-label="Fermer">&times;</button><button class="nav-btn prev" aria-label="Précédent">&#8249;</button><img alt=""><button class="nav-btn next" aria-label="Suivant">&#8250;</button><div class="lb-cap"></div>';
    document.body.appendChild(lb);
    const img = lb.querySelector('img'), cap = lb.querySelector('.lb-cap');
    let idx = 0;
    function show(i){
      idx=(i+items.length)%items.length;
      const el=items[idx];
      img.src=el.dataset.lightbox;
      cap.innerHTML='<h3 style="color:#fff;font-family:var(--font-head)">'+(el.dataset.title||'')+'</h3>'+(el.dataset.loc?'<span>'+el.dataset.loc+'</span>':'');
    }
    items.forEach((el,i)=>el.addEventListener('click',()=>{show(i);lb.classList.add('open')}));
    lb.querySelector('.close').addEventListener('click',()=>lb.classList.remove('open'));
    lb.querySelector('.prev').addEventListener('click',e=>{e.stopPropagation();show(idx-1)});
    lb.querySelector('.next').addEventListener('click',e=>{e.stopPropagation();show(idx+1)});
    lb.addEventListener('click',e=>{if(e.target===lb)lb.classList.remove('open')});
    document.addEventListener('keydown',e=>{
      if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')lb.classList.remove('open');
      if(e.key==='ArrowLeft')show(idx-1);
      if(e.key==='ArrowRight')show(idx+1);
    });
  }

  // simple form handler (demo)
  document.querySelectorAll('form[data-demo]').forEach(f=>{
    f.addEventListener('submit',e=>{
      e.preventDefault();
      const note=f.querySelector('.form-note');
      if(note){note.textContent='Merci ! Votre demande a bien été envoyée. Nous vous répondrons sous peu.';note.style.display='block';}
      f.reset();
    });
  });
})();
