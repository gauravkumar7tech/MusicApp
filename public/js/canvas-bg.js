(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const PARTICLE_COUNT = 42;
  let animationId = null;
  let pulseStrength = 0;

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2.4 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.65 + 0.15
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const glow = 0.18 + pulseStrength * 0.2;
    const gradient = ctx.createRadialGradient(
      window.innerWidth / 2,
      window.innerHeight / 2,
      20,
      window.innerWidth / 2,
      window.innerHeight / 2,
      Math.max(window.innerWidth, window.innerHeight) * 0.8
    );
    gradient.addColorStop(0, `rgba(124, 58, 237, ${glow})`);
    gradient.addColorStop(0.35, `rgba(59, 130, 246, ${glow * 0.75})`);
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    const lineAlpha = 0.18 + pulseStrength * 0.2;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(148, 163, 184, ${lineAlpha * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    pulseStrength *= 0.94;
    animationId = requestAnimationFrame(draw);
  }

  window.bgBeat = function (strength) {
    pulseStrength = Math.min(1.2, strength || 0.25);
  };

  resizeCanvas();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
})();
