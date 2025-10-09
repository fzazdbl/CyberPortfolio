/* main.js - Liquid Glass interactions
   - page transitions, reveal, CTA ripple, custom cursor
   - requestAnimationFrame driven, mobile/reduced-motion guards
*/

(function(){
  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // page enter class
  document.documentElement.classList.add('page-enter');
  window.addEventListener('DOMContentLoaded', ()=>{
    requestAnimationFrame(()=> document.documentElement.classList.add('page-enter-ready'));
    document.querySelectorAll('.header').forEach(h=>h.classList.add('in-view'));
  });

  // intercept internal links with data-link -> fade then navigate
  document.addEventListener('click', (ev)=>{
    const a = ev.target.closest('a[data-link]');
    if(!a) return;
    if(ev.metaKey || ev.ctrlKey) return; // allow new tab
    ev.preventDefault();
    const href = a.getAttribute('href');
    document.documentElement.classList.add('page-exit');
    setTimeout(()=> window.location.href = href, 420);
  });

  // reveal elements
  if(!reduced){
    const obs = new IntersectionObserver((entries, obsr)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in-view'); obsr.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view'));
  }

  // CTA ripple
  document.addEventListener('pointerdown', (ev)=>{
    const btn = ev.target.closest('.ripple'); if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const span = document.createElement('span'); span.className='ripple-el';
    const size = Math.max(rect.width, rect.height) * 2;
    Object.assign(span.style,{position:'absolute',width:size+'px',height:size+'px',left:(ev.clientX-rect.left-size/2)+'px',top:(ev.clientY-rect.top-size/2)+'px',borderRadius:'50%',background:'rgba(255,255,255,0.12)',transform:'scale(0)',pointerEvents:'none',transition:'transform 420ms cubic-bezier(.2,.9,.3,1),opacity 420ms ease'});
    btn.appendChild(span);
    requestAnimationFrame(()=>{ span.style.transform='scale(1)'; span.style.opacity='0'; });
    setTimeout(()=> span.remove(), 520);
  });

  // custom cursor
  if(!isMobile && !reduced){
    const dot = document.createElement('div'); dot.className='cursor-dot';
    Object.assign(dot.style,{position:'fixed',left:'0',top:'0',width:'12px',height:'12px',borderRadius:'50%',background:'rgba(255,255,255,0.95)',boxShadow:'0 6px 18px rgba(0,180,216,0.12), inset 0 0 6px rgba(255,255,255,0.6)',pointerEvents:'none',transform:'translate(-50%,-50%)'});
    document.body.appendChild(dot);
    let mx=window.innerWidth/2,my=window.innerHeight/2,cx=mx,cy=my;
    document.addEventListener('mousemove', (e)=>{ mx=e.clientX; my=e.clientY; });
    (function loop(){ cx += (mx-cx)*0.18; cy += (my-cy)*0.18; dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
    document.addEventListener('mousedown', ()=>{ dot.style.transform += ' scale(0.85)'; setTimeout(()=> dot.style.transform = dot.style.transform.replace(' scale(0.85)',''), 120); });
  }

  // ensure bg canvas doesn't intercept pointer
  const bg = document.getElementById('bg-canvas'); if(bg) bg.style.pointerEvents = 'none';

})();

document.addEventListener('DOMContentLoaded', function() {

 // Add nav item click handler
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      navItems.forEach(navItem => navItem.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
