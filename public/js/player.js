/* ── Sticky Player ── */
(function () {
  const audio = document.getElementById('sp-audio');
  const player = document.getElementById('sticky-player');
  if (!audio || !player) return;

  const spTitle    = document.getElementById('sp-title');
  const spArtist   = document.getElementById('sp-artist');
  const spPlay     = document.getElementById('sp-play');
  const spPrev     = document.getElementById('sp-prev');
  const spNext     = document.getElementById('sp-next');
  const spBar      = document.getElementById('sp-progress-bar');
  const spFill     = document.getElementById('sp-progress-fill');
  const spCurrent  = document.getElementById('sp-current');
  const spDuration = document.getElementById('sp-duration');
  const spMute     = document.getElementById('sp-mute');
  const spVol      = document.getElementById('sp-volume-slider');

  // Build track list from cards on this page
  const cards = Array.from(document.querySelectorAll('#track-list .music-card'));
  let tracks = cards.map(c => ({
    src:    c.dataset.src,
    title:  c.dataset.title,
    artist: c.dataset.artist,
    id:     c.dataset.id,
    index:  parseInt(c.dataset.index, 10)
  }));

  let currentIdx = -1;

  function fmt(s) {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  }

  function setCardState(idx, playing) {
    cards.forEach(c => c.classList.remove('playing'));
    if (idx >= 0 && idx < cards.length) {
      if (playing) cards[idx].classList.add('playing');
      const btn = cards[idx].querySelector('.play-card-btn');
      if (btn) {
        btn.querySelector('i').className = playing ? 'fas fa-pause' : 'fas fa-play';
        btn.querySelector('span').textContent = playing ? 'Pause' : 'Play';
      }
    }
  }

  function resetCardBtn(idx) {
    if (idx >= 0 && idx < cards.length) {
      const btn = cards[idx].querySelector('.play-card-btn');
      if (btn) {
        btn.querySelector('i').className = 'fas fa-play';
        btn.querySelector('span').textContent = 'Play';
      }
    }
  }

  function loadTrack(idx, autoplay) {
    if (!tracks.length) return;
    idx = ((idx % tracks.length) + tracks.length) % tracks.length;
    const t = tracks[idx];
    resetCardBtn(currentIdx);
    currentIdx = idx;
    audio.src = t.src;
    spTitle.textContent  = t.title;
    spArtist.textContent = t.artist;
    player.classList.remove('hidden');
    document.body.classList.add('has-sticky-player');
    if (autoplay) {
      audio.play().catch(() => {});
    }
    // Persist state
    sessionStorage.setItem('sp_src',    t.src);
    sessionStorage.setItem('sp_title',  t.title);
    sessionStorage.setItem('sp_artist', t.artist);
    sessionStorage.setItem('sp_time',   '0');
  }

  function togglePlay() {
    if (!audio.src) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  audio.addEventListener('play', () => {
    spPlay.innerHTML = '<i class="fas fa-pause"></i>';
    setCardState(currentIdx, true);
    if (window.Visualizer && cards[currentIdx]) window.Visualizer.start(cards[currentIdx]);
  });

  audio.addEventListener('pause', () => {
    spPlay.innerHTML = '<i class="fas fa-play"></i>';
    setCardState(currentIdx, false);
    if (window.Visualizer && cards[currentIdx]) window.Visualizer.stop(cards[currentIdx]);
  });

  audio.addEventListener('ended', () => {
    if (window.Visualizer && cards[currentIdx]) window.Visualizer.stop(cards[currentIdx]);
    resetCardBtn(currentIdx);
    loadTrack(currentIdx + 1, true);
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    spFill.style.width = pct + '%';
    spCurrent.textContent  = fmt(audio.currentTime);
    spDuration.textContent = fmt(audio.duration);
    sessionStorage.setItem('sp_time', audio.currentTime);
  });

  spBar.addEventListener('click', e => {
    const rect = spBar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  });

  spPlay.addEventListener('click', togglePlay);
  spPrev.addEventListener('click', () => loadTrack(currentIdx - 1, true));
  spNext.addEventListener('click', () => loadTrack(currentIdx + 1, true));

  spVol.addEventListener('input', () => {
    audio.volume = spVol.value;
    spMute.innerHTML = audio.volume === 0 ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
  });

  spMute.addEventListener('click', () => {
    audio.muted = !audio.muted;
    spMute.innerHTML = audio.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
  });

  // Card play buttons
  document.querySelectorAll('.play-card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      if (currentIdx === idx && !audio.paused) {
        audio.pause();
      } else if (currentIdx === idx && audio.paused) {
        audio.play().catch(() => {});
      } else {
        loadTrack(idx, true);
      }
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowLeft')  { e.preventDefault(); audio.currentTime = Math.max(0, audio.currentTime - 10); }
    if (e.code === 'ArrowRight') { e.preventDefault(); audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10); }
  });

  // Restore state from sessionStorage (cross-page persistence)
  const savedSrc = sessionStorage.getItem('sp_src');
  if (savedSrc) {
    const savedTime = parseFloat(sessionStorage.getItem('sp_time') || '0');
    audio.src = savedSrc;
    spTitle.textContent  = sessionStorage.getItem('sp_title')  || '—';
    spArtist.textContent = sessionStorage.getItem('sp_artist') || '—';
    player.classList.remove('hidden');
    document.body.classList.add('has-sticky-player');
    audio.addEventListener('loadedmetadata', () => {
      audio.currentTime = savedTime;
    }, { once: true });
    // Match card if on same page
    const match = tracks.findIndex(t => t.src === savedSrc);
    if (match !== -1) currentIdx = match;
  }
})();

/* ── Like Buttons ── */
document.querySelectorAll('.like-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.dataset.id;
    const res = await fetch(`/music/like/${id}`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      btn.classList.toggle('liked', data.liked);
    }
  });
});

/* ── Search ── */
(function () {
  const input    = document.getElementById('global-search');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  let timer;

  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (!q) { dropdown.classList.add('hidden'); dropdown.innerHTML = ''; return; }
    timer = setTimeout(async () => {
      const res = await fetch(`/music/search?q=${encodeURIComponent(q)}`, {
        headers: { Accept: 'application/json' }
      });
      const songs = await res.json();
      if (!songs.length) {
        dropdown.innerHTML = '<div class="sd-empty">No results</div>';
      } else {
        dropdown.innerHTML = songs.slice(0, 6).map(s =>
          `<a class="sd-item" href="/music/search?q=${encodeURIComponent(q)}">
            <span class="sd-title">${s.title}</span>
            <span class="sd-artist">${s.artist}</span>
          </a>`
        ).join('') + (songs.length > 6
          ? `<a class="sd-more" href="/music/search?q=${encodeURIComponent(q)}">See all ${songs.length} results</a>`
          : '');
      }
      dropdown.classList.remove('hidden');
    }, 250);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && input.value.trim()) {
      window.location.href = `/music/search?q=${encodeURIComponent(input.value.trim())}`;
    }
    if (e.key === 'Escape') { dropdown.classList.add('hidden'); }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-box')) dropdown.classList.add('hidden');
  });
})();

/* ── Theme Toggle ── */
(function () {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const body = document.body;
  const icon = toggle.querySelector('i');
  const saved = localStorage.getItem('theme') || 'light';
  body.setAttribute('data-theme', saved);
  if (saved === 'dark') { icon.classList.replace('fa-moon', 'fa-sun'); }

  toggle.addEventListener('click', () => {
    const next = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    icon.classList.replace(next === 'dark' ? 'fa-moon' : 'fa-sun', next === 'dark' ? 'fa-sun' : 'fa-moon');
  });
})();
