// This is a modified version of the music player
// used in Quaylee.

class Song {
  constructor(title, artist, coverLink, audioOrYouTube) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;

    // detect and parse YouTube IDs, otherwise treat as a standard audio link
    this.youtubeId = extractYouTubeId(audioOrYouTube);
    this.audioLink = this.youtubeId ? null : (audioOrYouTube || null);
  }
  getTitle() { return this.title; }
  getArtist() { return this.artist; }
  getCoverLink() { return this.coverLink; }
  getAudioLink() { return this.audioLink; }
  getYouTubeId() { return this.youtubeId; }
}

class Playlist {
  constructor(songs = []) {
    this.songs = songs;
    this.currentSongIndex = 0;
  }
  addSong(song) { this.songs.push(song); }
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

window.Playlist = Playlist;
window.Song = Song;

// YouTube URL support
let ytApiReady = false;
let ytPlayer = null;
let ytPlayerReady = false;
let ytConstructing = false;
let ytReadyPending = false;
let ytProgressTimer = null;
let backendVolume = 1;

const ytHooks = {
  onEnded: null,
  onProgress: null
};

const ytCallbacks = [];

function flushYTCallbacks() {
  while (ytCallbacks.length) {
    const cb = ytCallbacks.shift();
    try {
      cb?.();
    } catch (e) {
      console.log("YouTube player callback failed.", e);
    }
  }
}

function extractYouTubeId(url) {
  if (typeof url !== "string") return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

function isYouTubeSong(song) {
  return !!song?.getYouTubeId?.();
}

(function injectYouTubeAPI() {
  if (document.getElementById("yt-iframe-api")) return;
  const tag = document.createElement("script");
  tag.id = "yt-iframe-api";
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
})();

window.onYouTubeIframeAPIReady = function () {
  ytApiReady = true;
};

function applyVolumeToYT() {
  if (!ytPlayer) return;
  try {
    ytPlayer.setVolume(Math.round(backendVolume * 100));
    if (backendVolume === 0) ytPlayer.mute();
    else ytPlayer.unMute();
  } catch (e) {}
}

function ensureYTPlayer(onReady) {
  if (onReady) ytCallbacks.push(onReady);
  if (ytPlayer && ytPlayerReady) {
    flushYTCallbacks();
    return;
  }
  if (ytConstructing) return;

  const createPlayer = () => {
    const holder = document.getElementById("ytplayer") || (() => {
      const el = document.createElement("div");
      el.id = "ytplayer";
      el.style.width = "0px";
      el.style.height = "0px";
      el.style.position = "absolute";
      el.style.overflow = "hidden";
      el.style.pointerEvents = "none";
      document.body.appendChild(el);
      return el;
    })();

    ytConstructing = true;
    try {
      ytPlayer = new YT.Player(holder, {
        height: "0",
        width: "0",
        videoId: "",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          playsinline: 1
        },
        events: {
          onReady: () => {
            if (ytConstructing) {
              ytReadyPending = true;
              return;
            }
            ytPlayerReady = true;
            applyVolumeToYT();
            flushYTCallbacks();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) {
              ytHooks.onEnded?.();
            }
            if (e.data === YT.PlayerState.PLAYING) {
              applyVolumeToYT();
            }
          }
        }
      });
    } catch (e) {
      ytConstructing = false;
      console.log("Could not create the YouTube player.", e);
      return;
    }
    ytConstructing = false;

    if (ytReadyPending) {
      ytReadyPending = false;
      ytPlayerReady = true;
      applyVolumeToYT();
      flushYTCallbacks();
    }
  };

  if (ytApiReady && window.YT && window.YT.Player) {
    createPlayer();
  } else {
    const timer = setInterval(() => {
      if (ytApiReady && window.YT && window.YT.Player) {
        clearInterval(timer);
        createPlayer();
      }
    }, 50);
  }
}

function stopYTProgressPump() {
  if (ytProgressTimer) {
    clearInterval(ytProgressTimer);
    ytProgressTimer = null;
  }
}

function startYTProgressPump() {
  stopYTProgressPump();
  ytProgressTimer = setInterval(() => {
    ytHooks.onProgress?.(backendGetCurrentTime(), backendGetDuration());
  }, 250);
}

function backendSetSrcAndLoad(song, audio) {
  if (!song) return;

  if (isYouTubeSong(song)) {
    stopYTProgressPump();
    ensureYTPlayer(() => {
      ytPlayer.loadVideoById(song.getYouTubeId());
      applyVolumeToYT();
    });
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  } else {
    stopYTProgressPump();
    if (ytPlayer) {
      try { ytPlayer.stopVideo(); } catch (e) {}
    }
    audio.src = song.getAudioLink() || "";
    audio.load();
  }
}

function ytCurrentSong() { return activePlaylist.getCurrentSong(); }
function ytAudioElement() { return getAudioElement(); }

function backendPlay(audio) {
  const song = ytCurrentSong();
  if (!song) return Promise.resolve();

  if (isYouTubeSong(song)) {
    return new Promise((resolve) => {
      ensureYTPlayer(() => {
        ytPlayer.playVideo();
        resolve();
      });
    });
  }

  return audio.play().catch(e => {
    console.log("Playback deferred for user interaction.", e);
  });
}

function backendPause(audio) {
  const song = ytCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ytPlayer?.pauseVideo?.();
  } else {
    audio.pause();
  }
}

function backendSetVolume(audio, volume) {
  backendVolume = volume;
  audio.volume = volume;
  if (isYouTubeSong(ytCurrentSong())) applyVolumeToYT();
}

function backendGetCurrentTime() {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) return ytPlayer.getCurrentTime?.() || 0;
  const audio = ytAudioElement();
  return audio ? audio.currentTime || 0 : 0;
}

function backendGetDuration() {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) return ytPlayer.getDuration?.() || 0;
  const audio = ytAudioElement();
  return audio ? audio.duration || 0 : 0;
}

function backendSeekTo(seconds) {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    ytPlayer.seekTo(seconds, true);
  } else {
    const audio = ytAudioElement();
    if (audio && Number.isFinite(audio.duration)) audio.currentTime = seconds;
  }
}

let activePlaylist = new Playlist();
let audioInstance = null;
let currentVolume = 0.5;

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    backendSetSrcAndLoad(song, audio);
    startYTProgressPump();
    backendPlay(audio).catch(e => console.log("Autoplay blocked or waiting for interaction", e));
    updatePlayPauseIcon(true);
  }
}
window.changePlaylist = changePlaylist;

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  const player = document.getElementById("player");

  if (!player || !currentSong) return;

  const cover = player.querySelector(".player__album-art");
  const title = player.querySelector(".player__song-title");
  const artist = player.querySelector(".player__song-artist");

  if (cover) cover.src = currentSong.getCoverLink();
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();
}
window.updateUI = updateUI;

// helpers
function getAudioElement() {
  if (!audioInstance) {
    audioInstance = document.createElement("audio");
    audioInstance.id = "audio";
    document.body.appendChild(audioInstance);
  }
  return audioInstance;
}

function updatePlayPauseIcon(isPlaying) {
  const playBtn = document.querySelector(".player__btn--play");
  const pauseBtn = document.querySelector(".player__btn--pause");
  const stopBtn = document.querySelector(".player__btn--stop");

  if (playBtn && pauseBtn && stopBtn) {
    playBtn.classList.remove("active");
    pauseBtn.classList.remove("active");
    stopBtn.classList.remove("active");

    if (isPlaying) {
      pauseBtn.classList.add("active");
    } else {
      playBtn.classList.add("active");
    }
  }
}

// setup
function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) {
    console.warn("game_window element not found. Player will not be attached.");
    return;
  }

  // prevent duplicate players
  if (document.getElementById("player")) return;

  const defaultSongs = [
    ["St. Chroma", "Tyler, The Creator", "https://upload.wikimedia.org/wikipedia/en/5/5b/Chromakopia_CD_cover.jpg", "https://audio.jukehost.co.uk/OJ5E0ssxcGFM9TQYGmixpt549j95LxeK"],
    ["SIRENS", "Travis Scott", "https://upload.wikimedia.org/wikipedia/en/2/23/Travis_Scott_-_Utopia.png", "https://audio.jukehost.co.uk/tMqMoa9zNtWgKpMJLgBE7iBITA8ivTRo"],
    ["Rich Men North of Richmond", "Oliver Anthony", "https://upload.wikimedia.org/wikipedia/en/d/d4/Oliver_Anthony_-_Rich_Men_North_of_Richmond.png", "https://audio.jukehost.co.uk/Po5eKwlVG0M4wQ3oOG9otBNFevRmkpPC"],
    ["Trance", "Metro Boomin", "https://i.scdn.co/image/ab67616d0000b273c4fee55d7b51479627c31f89", "https://audio.jukehost.co.uk/L5xxytRx8xzIZJGO3mr6fGlVxD3s99BP"],
    ["Sacrifice", "The Weeknd", "https://i.scdn.co/image/ab67616d0000b2734ab2520c2c77a1d66b9ee21d", "https://audio.jukehost.co.uk/OPJ03lifktGkFiDtX6zABItt8gdfqmvn"],
    ["Too Sweet", "Hozier", "https://upload.wikimedia.org/wikipedia/en/9/9a/Hozier_-_Unheard.png", "https://audio.jukehost.co.uk/vM6S0Sokz9qcJ2TPv0R6WcAXhvNFhYoT"],
    ["The American Dream Is Killing Me", "Green Day", "https://upload.wikimedia.org/wikipedia/en/c/c9/Green_Day_-_Saviors.png", "https://audio.jukehost.co.uk/xVflzX2agfU70s5rmti5BfQncpqLOCjw"],
    ["Welcome To Hell", "Black Midi", "https://upload.wikimedia.org/wikipedia/en/1/12/Black_Midi_-_Hellfire.png", "https://audio.jukehost.co.uk/UIHdUryJ1XMkYpDsi6uTs9av0NwAy3dX"],
    ["São Paulo", "The Weeknd, Anitta", "https://upload.wikimedia.org/wikipedia/en/7/72/The_Weeknd_and_Anitta_-_S%C3%A3o_Paulo.png", "https://audio.jukehost.co.uk/vTA6uZ2eCK9uEB5HLUBzLICYLz3sDKPJ"],
    ["Blind", "SZA", "https://upload.wikimedia.org/wikipedia/en/2/2c/SZA_-_S.O.S.png", "https://audio.jukehost.co.uk/wDaCOSFko1S0NGERvwgKOIPWuShRNeOf"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  window.defaultPlaylist = activePlaylist;

  // inject CSS
  const style = document.createElement("style");
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
    #player * { box-sizing: border-box; }

    #player.qb-window {
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
      padding: 2px; box-shadow: inset 1px 1px 3px rgba(0,0,0,0.7); border: none; cursor: pointer;
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

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.className = "qb-window";
  playerContainer.innerHTML = `
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
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) backendSetSrcAndLoad(startSong, audio);
  backendSetVolume(audio, currentVolume);

  const playBtn = playerContainer.querySelector(".player__btn--play");
  const pauseBtn = playerContainer.querySelector(".player__btn--pause");
  const stopBtn = playerContainer.querySelector(".player__btn--stop");
  const nextBtn = playerContainer.querySelector(".player__btn--next");
  const prevBtn = playerContainer.querySelector(".player__btn--prev");
  const progressBar = playerContainer.querySelector(".player__progress-bar");
  const progressContainer = playerContainer.querySelector(".player__progress-container");
  const volumeSlider = playerContainer.querySelector(".player__volume-slider");
  const volumeFill = playerContainer.querySelector(".volume-fill");

  volumeFill.style.height = `${currentVolume * 100}%`;

  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    backendSetSrcAndLoad(activePlaylist.getCurrentSong(), audio);
    startYTProgressPump();
    backendPlay(audio).then(() => updatePlayPauseIcon(true));
  };

  function addAndPlaySong(song) {
    activePlaylist.addSong(song);
    activePlaylist.currentSongIndex = activePlaylist.songs.length - 1;
    playSongAtIndex();
  }
  window.addAndPlaySong = addAndPlaySong;

  // play/pause/stop
  playBtn.addEventListener("click", () => {
    backendPlay(audio);
    updatePlayPauseIcon(true);
  });

  pauseBtn.addEventListener("click", () => {
    backendPause(audio);
    updatePlayPauseIcon(false);
  });

  stopBtn.addEventListener("click", () => {
    backendPause(audio);
    backendSeekTo(0);
    updatePlayPauseIcon(false);
    progressBar.style.width = "0%";
  });

  // next/prev
  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playSongAtIndex();
  });

  // progress bar
  const paintProgress = () => {
    const duration = backendGetDuration();
    if (Number.isFinite(duration)) {
      progressBar.style.width = `${(backendGetCurrentTime() / duration) * 100}%`;
    }
  };

  audio.addEventListener("timeupdate", paintProgress);

  ytHooks.onProgress = () => paintProgress();

  ytHooks.onEnded = () => {
    updatePlayPauseIcon(false);
    activePlaylist.playNext();
    playSongAtIndex();
  };

  audio.addEventListener("play", () => updatePlayPauseIcon(true));
  audio.addEventListener("pause", () => updatePlayPauseIcon(false));

  // click-to-seek progress bar functionality
  progressContainer.addEventListener("click", (e) => {
    const duration = backendGetDuration();
    if (Number.isFinite(duration)) {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = progressContainer.offsetWidth;
      backendSeekTo((clickX / width) * duration);
    }
  });

  // volume
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseFloat(e.target.value);
    backendSetVolume(audio, currentVolume);
    volumeFill.style.height = `${currentVolume * 100}%`;
  });

  // initial play
  updateUI(activePlaylist);
  startYTProgressPump();
  backendPlay(audio)
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

setupMusicPlayer();
