// Subtle particles background — lightweight and performant
(function(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, particles = [];

  function resize(){
    const dpr = window.devicePixelRatio || 1;
    width = canvas.width = Math.floor(window.innerWidth * dpr);
    height = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }

  function rand(min, max){ return Math.random() * (max - min) + min; }

  function createParticles(){
    particles = [];
    const area = window.innerWidth * window.innerHeight;
    let count = Math.max(12, Math.floor(area / 120000));
    // reduce particles on small screens
    if(window.innerWidth < 760) count = Math.max(6, Math.floor(area / 240000));
    for(let i=0;i<count;i++){
      particles.push({
        x: rand(0, window.innerWidth),
        y: rand(0, window.innerHeight),
        vx: rand(-0.07, 0.07),
        vy: rand(-0.03, 0.03),
        r: rand(0.5, 1.6),
        alpha: rand(0.06, 0.22)
      });
    }
  }

  function step(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    // subtle fog overlay using radial gradients is handled in CSS; here we draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -10) p.x = window.innerWidth + 10;
      if(p.x > window.innerWidth + 10) p.x = -10;
      if(p.y < -10) p.y = window.innerHeight + 10;
      if(p.y > window.innerHeight + 10) p.y = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(160,200,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    });

    // optional: draw faint connecting lines between close particles
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if(d < 100){
          const alpha = (1 - d/100) * 0.05;
          ctx.strokeStyle = `rgba(160,200,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  function init(){
    resize();
    createParticles();
    step();
  }

  window.addEventListener('resize', ()=>{
    // debounce resize
    clearTimeout(window._bgResizeTimer);
    window._bgResizeTimer = setTimeout(()=>{ resize(); createParticles(); }, 120);
  });

  // start when DOM ready
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
