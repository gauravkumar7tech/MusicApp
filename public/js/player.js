// Enhanced Audio Player Functionality
document.addEventListener('DOMContentLoaded', function() {
    const audioElements = document.querySelectorAll('.song-audio');
    let currentlyPlaying = null;

    audioElements.forEach(audio => {
        // Add play/pause functionality
        audio.addEventListener('play', function() {
            // Pause other audio elements when one starts playing
            if (currentlyPlaying && currentlyPlaying !== this) {
                currentlyPlaying.pause();
            }
            currentlyPlaying = this;
            
            // Add visual feedback
            const card = this.closest('.music-card');
            card.classList.add('playing');
            
            // Add playing icon to title
            const title = card.querySelector('h4');
            if (!title.querySelector('.playing-icon')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-volume-up playing-icon';
                icon.style.marginLeft = '8px';
                icon.style.color = '#667eea';
                icon.style.animation = 'pulse 1.5s infinite';
                title.appendChild(icon);
            }
        });

        audio.addEventListener('pause', function() {
            const card = this.closest('.music-card');
            card.classList.remove('playing');
            
            // Remove playing icon
            const playingIcon = card.querySelector('.playing-icon');
            if (playingIcon) {
                playingIcon.remove();
            }
        });

        audio.addEventListener('ended', function() {
            const card = this.closest('.music-card');
            card.classList.remove('playing');
            currentlyPlaying = null;
            
            // Remove playing icon
            const playingIcon = card.querySelector('.playing-icon');
            if (playingIcon) {
                playingIcon.remove();
            }
        });

        // Add loading state
        audio.addEventListener('loadstart', function() {
            const card = this.closest('.music-card');
            card.classList.add('loading');
        });

        audio.addEventListener('canplay', function() {
            const card = this.closest('.music-card');
            card.classList.remove('loading');
        });

        // Add error handling
        audio.addEventListener('error', function() {
            const card = this.closest('.music-card');
            card.classList.remove('loading');
            
            // Show error message
            const audioPlayer = card.querySelector('.audio-player');
            if (audioPlayer && !audioPlayer.querySelector('.error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Unable to load audio file';
                errorMsg.style.cssText = `
                    background: #ff6b6b;
                    color: white;
                    padding: 0.5rem;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                `;
                audioPlayer.appendChild(errorMsg);
            }
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (currentlyPlaying && !e.target.matches('input, textarea')) {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    if (currentlyPlaying.paused) {
                        currentlyPlaying.play();
                    } else {
                        currentlyPlaying.pause();
                    }
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    currentlyPlaying.currentTime = Math.max(0, currentlyPlaying.currentTime - 10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    currentlyPlaying.currentTime = Math.min(currentlyPlaying.duration, currentlyPlaying.currentTime + 10);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    currentlyPlaying.volume = Math.min(1, currentlyPlaying.volume + 0.1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    currentlyPlaying.volume = Math.max(0, currentlyPlaying.volume - 0.1);
                    break;
            }
        }
    });

    // Add music card hover effects
    const musicCards = document.querySelectorAll('.music-card');
    musicCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('playing')) {
                this.style.transform = 'translateY(-5px)';
            }
        });
    });

    // Add floating music notes animation for playing cards
    function createMusicNote(card) {
        const note = document.createElement('div');
        note.innerHTML = '♪';
        note.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 1.5rem;
            color: #667eea;
            animation: float 3s ease-in-out infinite;
            pointer-events: none;
            z-index: 5;
        `;
        
        card.style.position = 'relative';
        card.appendChild(note);
        
        // Remove after animation
        setTimeout(() => {
            if (note.parentNode) {
                note.parentNode.removeChild(note);
            }
        }, 3000);
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
            25% { transform: translateY(-10px) rotate(5deg); opacity: 1; }
            50% { transform: translateY(-20px) rotate(-5deg); opacity: 0.8; }
            75% { transform: translateY(-15px) rotate(3deg); opacity: 0.9; }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .music-card.playing {
            background: linear-gradient(135deg, #667eea, #764ba2) !important;
            color: white !important;
            animation: glow 2s infinite alternate;
        }
        
        @keyframes glow {
            0% { box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3); }
            100% { box-shadow: 0 20px 40px rgba(102, 126, 234, 0.5); }
        }
        
        .music-card.playing .music-info p,
        .music-card.playing .description {
            color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .music-card.playing .rating .fas.fa-star.filled {
            color: #ffd700 !important;
        }
    `;
    document.head.appendChild(style);

    // Create floating notes for playing cards
    setInterval(() => {
        const playingCard = document.querySelector('.music-card.playing');
        if (playingCard && currentlyPlaying && !currentlyPlaying.paused) {
            createMusicNote(playingCard);
        }
    }, 2000);
});