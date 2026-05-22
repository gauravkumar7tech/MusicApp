/* canvas-bg.js — Neon particle field with mouse attraction + audio beat pulse */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLORS = ['#00f5ff', '#ff00ff', '#7b2fff', '#ff6ec7', '#00ffcc'];
  const COUNT  = window.innerWidth < 600 ? 55 : 110;
  const MAX_DIST = 130;

  let W, H, particles = [], mouse = { x: -999, y: -999 };
  let beatScale = 1; // pumped by Web Audio hook

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function Particle() {
    this.reset = function () {
      this.x  = rand(0, W);
      this.y  = rand(0, H);
      this.vx = rand(-0.4, 0.4);
      this.vy = rand(-0.4, 0.4);
      this.r  = rand(1.5, 3.5);
      this.baseR = this.r;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = rand(0.5, 1);
    };
    this.reset();

    this.update = function () {
      // Gentle mouse attraction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        this.vx += dx / dist * 0.04;
        this.vy += dy / dist * 0.04;
      }
      // Speed cap
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.8) { this.vx *= 1.8 / speed; this.vy *= 1.8 / speed; }

      this.x += this.vx;
      this.y += this.vy;

      // Beat pulse radius
      this.r = this.baseR * beatScale;

      // Wrap edges
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    };

    this.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      const p = new Particle();
      particles.push(p);
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    // Slowly decay beat scale back to 1
    beatScale += (1 - beatScale) * 0.08;
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  // Touch support
  window.addEventListener('touchmove', e => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  // Public hook: call window.bgBeat() from player.js on audio timeupdate peaks
  window.bgBeat = function (intensity) {
    beatScale = 1 + (intensity || 0.4) * 1.2;
  };

  init();
  loop();
})();
