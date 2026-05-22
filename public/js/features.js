/* features.js — Vibe Matcher | Auto-Queue | Genre Explorer | Live Filter | Chaos-to-Calm */

/* ══════════════════════════════════════════
   Feature 1: Vibe Matcher
   ══════════════════════════════════════════ */
(function () {
  const btns    = document.querySelectorAll('.vibe-btn');
  const results = document.getElementById('vibe-results');
  const message = document.getElementById('vibe-message');
  const list    = document.getElementById('vibe-list');
  if (!btns.length) return;

  // Client-side mood map (fallback when DB mood field is empty)
  const GENRE_MOOD = {
    rock: 'intense', electronic: 'upbeat', jazz: 'chill',
    classical: 'melancholic', pop: 'upbeat', hiphop: 'intense',
    ballad: 'melancholic', punjabi: 'upbeat', haryanvi: 'intense'
  };
  const TITLE_MOOD = {
    'solitude': 'contemplative', 'neruda': 'contemplative',
    'highschool funeral': 'melancholic', 'brother': 'powerful',
    'victims of chaos': 'intense', 'throne': 'powerful',
    'billo bagge': 'upbeat', 'get away': 'upbeat',
    'j5': 'intense', 'manimal': 'intense', 'scarwhores': 'intense',
    'ateraxia': 'chill'
  };

  btns.forEach(btn => {
    btn.addEventListener('click', async () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const vibe = btn.dataset.vibe;

      // Try server first
      try {
        const res  = await fetch(`/music/vibe?mood=${vibe}`);
        const data = await res.json();
        renderVibeResults(data.songs, data.message, vibe);
      } catch (_) {
        // Fallback: filter cards already on page
        const cards = Array.from(document.querySelectorAll('#track-list .music-card'));
        const matched = cards.filter(c => {
          const genre = (c.querySelector('.music-info p:nth-child(3)')?.textContent || '').toLowerCase().trim();
          const title = (c.dataset.title || '').toLowerCase();
          const m = TITLE_MOOD[title] || GENRE_MOOD[genre] || 'chill';
          return m === vibe;
        });
        renderVibeResults(matched.map(c => ({ title: c.dataset.title, artist: c.dataset.artist, _id: c.dataset.id })),
          matched.length ? '' : `No tracks found for "${vibe}". Try another vibe!`, vibe);
      }
    });
  });

  function renderVibeResults(songs, msg, vibe) {
    results.classList.remove('hidden');
    message.textContent = msg || `${songs.length} track${songs.length !== 1 ? 's' : ''} match "${vibe}"`;
    if (!songs.length) { list.innerHTML = ''; return; }
    list.innerHTML = songs.map(s =>
      `<div class="vibe-track-item">
        <i class="fas fa-music"></i>
        <span class="vt-title">${s.title}</span>
        <span class="vt-artist">${s.artist}</span>
        <button class="vt-play-btn" data-id="${s._id}" title="Play"><i class="fas fa-play"></i></button>
      </div>`
    ).join('');

    // Wire play buttons to sticky player
    list.querySelectorAll('.vt-play-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = document.querySelector(`#track-list .music-card[data-id="${btn.dataset.id}"]`);
        if (card) card.querySelector('.play-card-btn')?.click();
      });
    });
  }
})();

/* ══════════════════════════════════════════
   Feature 2: Auto-Queue (genre-similar next track)
   Hooks into the sticky player's 'ended' event via a custom event
   ══════════════════════════════════════════ */
(function () {
  const audio = document.getElementById('sp-audio');
  if (!audio) return;

  // Expose so player.js 'ended' handler can call it
  window.autoQueueNext = async function (currentId) {
    if (!currentId) return null;
    try {
      const res  = await fetch(`/music/auto-queue?currentId=${currentId}`);
      const next = await res.json();
      return next;
    } catch (_) { return null; }
  };
})();

/* ══════════════════════════════════════════
   Feature 4: Live Filter toggle in nav
   ══════════════════════════════════════════ */
(function () {
  const liveBtn = document.getElementById('live-filter-btn');
  if (!liveBtn) return;
  let liveOnly = false;

  liveBtn.addEventListener('click', () => {
    liveOnly = !liveOnly;
    liveBtn.classList.toggle('active', liveOnly);
    document.querySelectorAll('#track-list .music-card').forEach(card => {
      const isLive = card.querySelector('.live-badge') !== null;
      card.style.display = liveOnly && !isLive ? 'none' : '';
    });
  });
})();

/* ══════════════════════════════════════════
   Feature 5: Chaos-to-Calm slider
   ══════════════════════════════════════════ */
(function () {
  const slider  = document.getElementById('chaos-slider');
  const sortBtn = document.getElementById('chaos-sort-btn');
  const grid    = document.getElementById('track-list');
  if (!slider || !grid) return;

  const ENERGY_MAP = {
    'victims of chaos': 10, 'brother': 9, 'manimal': 9, 'scarwhores': 8,
    'throne': 8, 'ateraxia': 7, 'j5': 7, 'billo bagge': 6,
    'get away': 5, 'highschool funeral': 4, 'neruda': 3, 'solitude': 2
  };

  function getEnergy(card) {
    return parseInt(card.dataset.energy, 10) ||
      ENERGY_MAP[(card.dataset.title || '').toLowerCase()] || 5;
  }

  // Slider: filter cards below energy threshold
  slider.addEventListener('input', () => {
    const threshold = parseInt(slider.value, 10);
    Array.from(grid.children).forEach(card => {
      const e = getEnergy(card);
      card.style.opacity  = e >= threshold ? '1' : '0.25';
      card.style.transform = e >= threshold ? '' : 'scale(0.96)';
    });
  });

  // Sort button: reorder DOM cards high→low energy
  if (sortBtn) {
    let sorted = false;
    sortBtn.addEventListener('click', async () => {
      sorted = !sorted;
      sortBtn.classList.toggle('active', sorted);
      sortBtn.title = sorted ? 'Restore original order' : 'Sort by energy';

      if (sorted) {
        // Try server sort first
        try {
          const res   = await fetch('/music/chaos-to-calm');
          const songs = await res.json();
          const idOrder = songs.map(s => s._id.toString());
          const cards   = Array.from(grid.children);
          cards.sort((a, b) => {
            const ai = idOrder.indexOf(a.dataset.id);
            const bi = idOrder.indexOf(b.dataset.id);
            return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
          });
          cards.forEach(c => grid.appendChild(c));
        } catch (_) {
          // Client fallback
          const cards = Array.from(grid.children);
          cards.sort((a, b) => getEnergy(b) - getEnergy(a));
          cards.forEach(c => grid.appendChild(c));
        }
      } else {
        // Restore by data-index
        const cards = Array.from(grid.children);
        cards.sort((a, b) => parseInt(a.dataset.index) - parseInt(b.dataset.index));
        cards.forEach(c => grid.appendChild(c));
      }
    });
  }
})();
