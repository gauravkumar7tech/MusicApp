/* mood-filter.js */
(function () {
  const pills = document.querySelectorAll('.mood-pill');
  const cards = document.querySelectorAll('#track-list .music-card');
  if (!pills.length || !cards.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const mood = pill.dataset.mood;
      cards.forEach(card => {
        const show = mood === 'all' || card.dataset.mood === mood;
        card.style.transition = 'opacity 0.25s, transform 0.25s';
        if (show) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.display = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { if (card.dataset.mood !== mood && mood !== 'all') card.style.display = 'none'; }, 250);
        }
      });
    });
  });
})();
