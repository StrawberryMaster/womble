class Song {
    constructor(title, artist, coverLink, audioLink) {
        this.title = title;
        this.artist = artist;
        this.coverLink = coverLink;
        this.audioLink = audioLink;
    }
}

class Playlist {
    constructor(songs = []) {
        this.songs = songs;
        this.currentSongIndex = 0;
    }

    addSong(song) {
        this.songs.push(song);
    }

    getCurrentSong() {
        if (this.songs.length === 0) {
            return new Song("No Songs", "Add songs to a playlist", "https://itsastronomical.com/assets/music/buttons.png", "");
        }
        return this.songs[this.currentSongIndex];
    }

    playNext() {
        if (this.songs.length === 0) return;
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    }

    playPrevious() {
        if (this.songs.length === 0) return;
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
    }
}

// player logic
const QuintoPlayer = {
    playlist: null,
    audio: null,
    isPlaying: false,
    dom: {},

    init(targetSelector, initialPlaylist) {
        const targetElement = document.querySelector(targetSelector);
        if (!targetElement) {
            console.error("Music player: target element not found.", targetSelector);
            return;
        }

        this._injectCSS();
        this._createPlayerHTML(targetElement);
        this._cacheDOMElements();

        this.audio = new Audio();
        document.body.appendChild(this.audio);

        this._bindEvents();
        this._setVolume(parseFloat(this.dom.volumeSlider.value));
        this.loadPlaylist(initialPlaylist);
    },
    
    loadPlaylist(newPlaylist) {
        this.playlist = newPlaylist;
        this.playlist.currentSongIndex = 0;
        this._playSongAtIndex(0, false);
    },

    _createPlayerHTML(targetElement) {
        const playerHTML = `
            <div class="player qb-window">
                <div class="qb-title-bar">
                    <span class="qb-title-bar-text">QUINTO BLACK CT</span>
                    <div class="qb-window-controls">
                        <div class="qb-control-button qb-minimize"></div>
                        <div class="qb-control-button qb-close"></div>
                    </div>
                </div>
                <div class="player-body">
                    <div class="player__art-container">
                        <img src="" alt="Album Cover" class="player__album-art">
                    </div>
                    <div class="player__info-panel">
                        <div class="player__song-title"></div>
                        <div class="player__song-artist"></div>
                    </div>
                    <div class="player__main-controls">
                        <div class="player__buttons">
                            <!-- SVG definitions for icon gradients -->
                            <svg width="0" height="0" style="position:absolute;">
                                <defs>
                                    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" style="stop-color:#f0f0f0;" />
                                        <stop offset="100%" style="stop-color:#c0c0c0;" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <button class="player__btn player__btn--prev" title="Previous">
                                <svg viewBox="0 0 24 24" fill="url(#iconGradient)"><path d="M10 5 L5 12 L10 19 Z M18 5 L13 12 L18 19 Z"></path></svg>
                            </button>
                            <button class="player__btn player__btn--play" title="Play">
                                <svg viewBox="0 0 24 24" fill="url(#iconGradient)"><path d="M6 4 L19 12 L6 20 Z"></path></svg>
                            </button>
                            <button class="player__btn player__btn--pause" title="Pause">
                                <svg viewBox="0 0 24 24" fill="url(#iconGradient)"><rect x="6" y="5" width="4" height="14"></rect><rect x="14" y="5" width="4" height="14"></rect></svg>
                            </button>
							<button class="player__btn player__btn--stop" title="Stop">
                                <svg viewBox="0 0 24 24" fill="url(#iconGradient)"><rect x="6" y="6" width="12" height="12"></rect></svg>
                            </button>
                            <button class="player__btn player__btn--next" title="Next">
                                <svg viewBox="0 0 24 24" fill="url(#iconGradient)"><path d="M5 5 L10 12 L5 19 Z M13 5 L18 12 L13 19 Z"></path></svg>
                            </button>
                        </div>
                        <div class="player__progress-container">
                            <div class="player__progress-bar"></div>
                        </div>
                    </div>
                    <div class="player__volume-container">
                        <div class="volume-slider-wrapper">
                            <div class="volume-fill"></div>
                            <input type="range" class="player__volume-slider" min="0" max="1" step="0.01" value="0.5">
                        </div>
                    </div>
                </div>
            </div>
        `;
        targetElement.insertAdjacentHTML('afterend', playerHTML);
    },

    _cacheDOMElements() {
        const player = document.querySelector('.player');
        this.dom = {
            player,
            albumArt: player.querySelector('.player__album-art'),
            songTitle: player.querySelector('.player__song-title'),
            songArtist: player.querySelector('.player__song-artist'),
            prevBtn: player.querySelector('.player__btn--prev'),
            playBtn: player.querySelector('.player__btn--play'),
            pauseBtn: player.querySelector('.player__btn--pause'),			
            stopBtn: player.querySelector('.player__btn--stop'),
            nextBtn: player.querySelector('.player__btn--next'),
            progressBar: player.querySelector('.player__progress-bar'),
            volumeSlider: player.querySelector('.player__volume-slider'),
            volumeFill: player.querySelector('.volume-fill'),
        };
    },

    _bindEvents() {
        this.dom.playBtn.addEventListener('click', () => this.play());
        this.dom.pauseBtn.addEventListener('click', () => this.pause());		
        this.dom.stopBtn.addEventListener('click', () => this.stop());
        this.dom.nextBtn.addEventListener('click', () => this.playNext());
        this.dom.prevBtn.addEventListener('click', () => this.playPrev());
        
        this.audio.addEventListener('timeupdate', () => this._updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this._updateProgress());
        this.audio.addEventListener('ended', () => this.playNext());

        this.dom.volumeSlider.addEventListener('input', (e) => this._setVolume(parseFloat(e.target.value)));
    },

    _playSongAtIndex(index, autoplay = false) {
        this.playlist.currentSongIndex = index;
        const song = this.playlist.getCurrentSong();
        this.audio.src = song.audioLink;
        this._updateUI();

        if (autoplay) {
            this.play();
        } else {
            this.isPlaying = false;
            this.audio.currentTime = 0;
            this._updateControlsState();
            this._updateProgress();
        }
    },
    
    _setVolume(value) {
        this.audio.volume = value;
        const percent = value * 100;
        this.dom.volumeFill.style.height = `${percent}%`;
    },

    _updateUI() {
        const song = this.playlist.getCurrentSong();
        this.dom.albumArt.src = song.coverLink;
        this.dom.songTitle.textContent = song.title;
        this.dom.songArtist.textContent = song.artist;
    },

    play() {
        if (!this.audio.src) return;
        this.isPlaying = true;
        this.audio.play().catch(e => {
            this.isPlaying = false;
            console.warn("Playback failed.", e);
            this._updateControlsState();
        });
        this._updateControlsState();
    },

    pause() {
        this.isPlaying = false;
        this.audio.pause();
        this._updateControlsState();
    },
	
	stop() {
        this.isPlaying = false;
        this.audio.pause();
        this.audio.currentTime = 0;
        this._updateProgress();
        this._updateControlsState();
    },
    
    playNext() {
        this.playlist.playNext();
        this._playSongAtIndex(this.playlist.currentSongIndex, true);
    },

    playPrev() {
        this.playlist.playPrevious();
        this._playSongAtIndex(this.playlist.currentSongIndex, true);
    },
	
	_updateControlsState() {
        this.dom.playBtn.classList.remove('active');
        this.dom.pauseBtn.classList.remove('active');
        this.dom.stopBtn.classList.remove('active');

        if (this.isPlaying) {
            this.dom.pauseBtn.classList.add('active');
        } else {
            this.dom.playBtn.classList.add('active');
        }
    },

    _updateProgress() {
        const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
        const safePercent = isNaN(progressPercent) ? 0 : progressPercent;
        this.dom.progressBar.style.width = `${safePercent}%`;
    },

    _injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
            :root {
                --qb-bg: #4a4a4a;
                --qb-border-light: #7a7a7a;
                --qb-border-dark: #2a2a2a;
                --qb-title-bar-bg: #6a6a6a;
                --qb-text-color: #32ff32;
                --qb-highlight-yellow: #fdd835;
                --qb-noise-texture: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            }
            .player * { box-sizing: border-box; }

            .qb-window {
                font-family: 'VT323', monospace;
                background: var(--qb-noise-texture), var(--qb-bg);
                background-blend-mode: multiply;
                border: 1px solid black;
                box-shadow: 2px 2px 0px 0px var(--qb-border-light) inset, -2px -2px 0px 0px var(--qb-border-dark) inset;
                padding: 3px;
                position: relative;
                width: 938px;
                height: 191px;
                margin: 10px auto 10px;
            }
            .player-body { 
                display: flex;
                height: calc(100% - 24px);
            }
            
            .qb-title-bar {
                background: var(--qb-noise-texture), linear-gradient(to bottom, #8a8a8a, #5a5a5a);
                background-blend-mode: multiply; padding: 2px 4px; margin-bottom: 4px;
                display: flex; justify-content: center; align-items: center;
                height: 20px; font-size: 14px; color: white; text-shadow: 1px 1px #000; position: relative;
            }
            .qb-title-bar-text { flex-grow: 1; text-align: center; }
            .qb-window-controls { display: flex; gap: 3px; position: absolute; right: 4px; top: 50%; transform: translateY(-50%); }
            .qb-control-button { width: 14px; height: 14px; border: 1px solid black; box-shadow: 1px 1px 0px 0px var(--qb-border-light) inset, -1px -1px 0px 0px var(--qb-border-dark) inset; background-color: #c0c0c0; position: relative; }
            .qb-minimize::after { content: ''; position: absolute; bottom: 2px; left: 2px; right: 2px; height: 2px; background: black; }
            .qb-close::before, .qb-close::after { content: ''; position: absolute; top: 50%; left: 2px; right: 2px; height: 2px; background: black; transform-origin: center; }
            .qb-close::before { transform: translateY(-50%) rotate(45deg); }
            .qb-close::after { transform: translateY(-50%) rotate(-45deg); }
            
            .player__art-container { width: 176px; height: 100%; flex-shrink: 0; border-right: 1px solid black; }
            .player__album-art { width: 100%; height: 100%; object-fit: cover; border: 1px solid black; }
            
            .player__info-panel {
                width: 170px; height: 100%; padding: 15px; flex-shrink: 0; 
                display: flex; flex-direction: column; justify-content: flex-start;
                background: var(--qb-noise-texture), #2a2a2a; 
                background-blend-mode: multiply;
                color: var(--qb-text-color); line-height: 1.1; 
                overflow: hidden; border-right: 1px solid black; 
            }
            .player__song-title, .player__song-artist { white-space: normal; overflow: hidden; overflow-wrap: break-word; }
            .player__song-title { font-size: 24px; } .player__song-artist { font-size: 22px; }

            .player__main-controls {
                flex-grow: 1; padding: 10px 20px; display: flex; flex-direction: column;
                justify-content: center; align-items: center; gap: 20px;
                border-right: 1px solid #2a2a2a;
            }
            .player__buttons { display: flex; gap: 6px; }
            .player__btn {
                width: 44px; height: 32px; padding: 0; background: linear-gradient(to bottom, #5a5a5a, #3a3a3a);
                border-top: 1px solid #777; border-left: 1px solid #666; border-right: 1px solid #222; border-bottom: 1px solid #111;
                border-radius: 4px; box-shadow: inset 0 0 8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1);
                cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.05s ease; position: relative;
            }
            .player__btn svg { width: 18px; height: 18px; filter: drop-shadow(0 1px 0px rgba(0,0,0,0.6)); }
            .player__btn:active { background: linear-gradient(to top, #5a5a5a, #3a3a3a); box-shadow: inset 0 2px 8px rgba(0,0,0,0.8); transform: translateY(1px); }
            .player__btn.active { box-shadow: inset 0 0 8px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1), 0 3px 0 -1px var(--qb-highlight-yellow); }
            .player__btn.active svg path, .player__btn.active svg rect { fill: var(--qb-highlight-yellow); }
            
            .player__progress-container {
                width: 100%; height: 20px; background: linear-gradient(to bottom, #1f1f1f, #2a2a2a);
                padding: 2px; box-shadow: inset 1px 1px 3px rgba(0,0,0,0.7); border: none;
            }
            .player__progress-bar { height: 100%; width: 0%; background-color: var(--qb-text-color); }

            .player__volume-container { width: 50px; height: 100%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
            .volume-slider-wrapper { position: relative; width: 10px; height: 150px; display: flex; align-items: center; justify-content: center; }
            .volume-fill {
                position: absolute; bottom: 0; left: 0; width: 100%; height: 50%;
                background: linear-gradient(to top, #008f00, #39ff39); pointer-events: none;
            }
            input[type=range].player__volume-slider { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; width: 150px; height: 10px; transform: rotate(-90deg); position: absolute; z-index: 3; }
            input[type=range].player__volume-slider::-webkit-slider-runnable-track { width: 100%; height: 10px; background: transparent; }
            
            input[type=range].player__volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                height: 22px;
                width: 14px;
                margin-top: -7px;
                border-radius: 0;
                border: 1px solid #111;
                background-image:
                    linear-gradient(to right, transparent 5px, #fff 5px, #fff 6px, #888 6px, #888 7px, transparent 7px),
                    linear-gradient(to right, #e0e0e0, #b0b0b0);
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 100% 70%, 100% 100%;
            }

            input[type=range].player__volume-slider::-moz-range-track { width: 100%; height: 10px; background: transparent; }
            
            input[type=range].player__volume-slider::-moz-range-thumb {
                height: 22px;
                width: 14px;
                border-radius: 0;
                border: 1px solid #111;
                background-image:
                    linear-gradient(to right, transparent 5px, #fff 5px, #fff 6px, #888 6px, #888 7px, transparent 7px),
                    linear-gradient(to right, #e0e0e0, #b0b0b0);
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 100% 70%, 100% 100%;
            }

            input[type=range].player__volume-slider::-moz-range-progress { background: transparent; }
        `;
        document.head.appendChild(style);
    }
};

// the songs.
const mainPlaylist = new Playlist([
    new Song( "St. Chroma", "Tyler, The Creator", "https://upload.wikimedia.org/wikipedia/en/5/5b/Chromakopia_CD_cover.jpg", "https://audio.jukehost.co.uk/OJ5E0ssxcGFM9TQYGmixpt549j95LxeK"),
    new Song( "SIRENS", "Travis Scott", "https://upload.wikimedia.org/wikipedia/en/2/23/Travis_Scott_-_Utopia.png", "https://audio.jukehost.co.uk/tMqMoa9zNtWgKpMJLgBE7iBITA8ivTRo"),
    new Song( "Rich Men North of Richmond", "Oliver Anthony", "https://upload.wikimedia.org/wikipedia/en/d/d4/Oliver_Anthony_-_Rich_Men_North_of_Richmond.png", "https://audio.jukehost.co.uk/Po5eKwlVG0M4wQ3oOG9otBNFevRmkpPC"),
    new Song( "Trance", "Metro Boomin", "https://i.scdn.co/image/ab67616d0000b273c4fee55d7b51479627c31f89", "https://audio.jukehost.co.uk/L5xxytRx8xzIZJGO3mr6fGlVxD3s99BP"),
    new Song( "Sacrifice", "The Weeknd", "https://i.scdn.co/image/ab67616d0000b2734ab2520c2c77a1d66b9ee21d", "https://audio.jukehost.co.uk/OPJ03lifktGkFiDtX6zABItt8gdfqmvn"),
    new Song( "Too Sweet", "Hozier", "https://upload.wikimedia.org/wikipedia/en/9/9a/Hozier_-_Unheard.png", "https://audio.jukehost.co.uk/vM6S0Sokz9qcJ2TPv0R6WcAXhvNFhYoT"),
	new Song(
      "The American Dream Is Killing Me",
      "Green Day",
      "https://upload.wikimedia.org/wikipedia/en/c/c9/Green_Day_-_Saviors.png",
      "https://audio.jukehost.co.uk/xVflzX2agfU70s5rmti5BfQncpqLOCjw"
    ),
	new Song(
      "Welcome To Hell",
      "Black Midi",
      "https://upload.wikimedia.org/wikipedia/en/1/12/Black_Midi_-_Hellfire.png",      
      "https://audio.jukehost.co.uk/UIHdUryJ1XMkYpDsi6uTs9av0NwAy3dX"
    ),
	new Song(
      "São Paulo",
      "The Weeknd, Anitta",
      "https://upload.wikimedia.org/wikipedia/en/7/72/The_Weeknd_and_Anitta_-_S%C3%A3o_Paulo.png",
      "https://audio.jukehost.co.uk/vTA6uZ2eCK9uEB5HLUBzLICYLz3sDKPJ"
    ),
	new Song(
      "Blind",
      "SZA",
      "https://upload.wikimedia.org/wikipedia/en/2/2c/SZA_-_S.O.S.png",
      "https://audio.jukehost.co.uk/wDaCOSFko1S0NGERvwgKOIPWuShRNeOf"
    ),
]);

// kick it off!
QuintoPlayer.init("#game_window", mainPlaylist);