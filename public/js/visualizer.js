/* visualizer.js — Card visualizer bars + optional Web Audio API analyser */
(function () {
  let analyser = null, dataArray = null, audioCtx = null;
  let vizActive = false;
  let currentCardEl = null;

  /* ── Build Web Audio analyser from the sticky player <audio> ── */
  function initAnalyser() {
    const audioEl = document.getElementById('sp-audio');
    if (!audioEl || audioCtx) return;
    try {
      audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
      const src = audioCtx.createMediaElementSource(audioEl);
      analyser  = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      src.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch (e) {
      analyser = null; // fallback to mock
    }
  }

  /* ── Create bar elements inside a card ── */
  function buildBars(card) {
    let viz = card.querySelector('.card-visualizer');
    if (viz) return viz;
    viz = document.createElement('div');
    viz.className = 'card-visualizer';
    for (let i = 0; i < 20; i++) {
      const bar = document.createElement('span');
      bar.className = 'viz-bar';
      viz.appendChild(bar);
    }
    card.appendChild(viz);
    return viz;
  }

  /* ── Animate bars ── */
  let rafId = null;

  function animateBars(viz) {
    const bars = viz.querySelectorAll('.viz-bar');
    const BAR_COUNT = bars.length;

    function frame() {
      if (!vizActive) {
        bars.forEach(b => { b.style.height = '3px'; });
        return;
      }

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        const step = Math.floor(dataArray.length / BAR_COUNT);
        bars.forEach((bar, i) => {
          const val = dataArray[i * step] || 0;
          const h   = Math.max(3, (val / 255) * 60);
          bar.style.height = h + 'px';
          // Beat hook for canvas bg
          if (i === 2 && val > 180 && window.bgBeat) window.bgBeat(val / 255);
        });
      } else {
        // Mock: random heights with smooth lerp
        bars.forEach(bar => {
          const current = parseFloat(bar.style.height) || 3;
          const target  = Math.random() * 55 + 5;
          bar.style.height = (current + (target - current) * 0.3) + 'px';
        });
        // Occasional mock beat pulse
        if (Math.random() < 0.03 && window.bgBeat) window.bgBeat(0.35);
      }
      rafId = requestAnimationFrame(frame);
    }
    cancelAnimationFrame(rafId);
    frame();
  }

  /* ── Public API ── */
  window.Visualizer = {
    start(cardEl) {
      if (currentCardEl && currentCardEl !== cardEl) {
        this.stop(currentCardEl);
      }
      currentCardEl = cardEl;
      vizActive = true;
      initAnalyser();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      const viz = buildBars(cardEl);
      viz.classList.add('active');
      animateBars(viz);
    },
    stop(cardEl) {
      vizActive = false;
      cancelAnimationFrame(rafId);
      if (cardEl) {
        const viz = cardEl.querySelector('.card-visualizer');
        if (viz) {
          viz.classList.remove('active');
          viz.querySelectorAll('.viz-bar').forEach(b => { b.style.height = '3px'; });
        }
      }
      currentCardEl = null;
    }
  };
})();
