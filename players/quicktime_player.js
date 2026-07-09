// A QuickTime player implementation, initially
// made for 2019 DOTP, a remake of 2019NK.
class Song {
  constructor(title, artist, album, coverLink, audioLink) {
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.coverLink = coverLink;
    this.audioLink = audioLink;
  }
  getTitle() { return this.title; }
  getArtist() { return this.artist; }
  getAlbum() { return this.album; }
  getCoverLink() { return this.coverLink; }
  getAudioLink() { return this.audioLink; }
}

class Playlist {
  constructor(songs = []) {
    this.songs = songs;
    this.currentSongIndex = 0;
  }
  addSong(song) { this.songs.push(song); }
  getCurrentSong() {
    if (this.songs.length === 0) {
      return new Song("No Songs", "N/A", "Unknown Album", "https://itsastronomical.com/assets/music/buttons.png", "");
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

let activePlaylist = new Playlist();
let audioInstance = null;
let currentVolume = 0.7;

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.audioLink;
    audio.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
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
  const album = player.querySelector(".player__song-album");

  if (cover) cover.src = currentSong.getCoverLink();
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();
  if (album) album.textContent = currentSong.getAlbum();
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
  const btn = document.getElementById("playPauseButton");
  const icon = document.querySelector(".player__toggle-icon");
  if (btn && icon) {
    if (isPlaying) {
      btn.title = "Pause";
      icon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>';
    } else {
      btn.title = "Play";
      icon.innerHTML = '<path d="M8 5v14l11-7z"></path>';
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
    ["St. Chroma", "Tyler, The Creator", "Chromakopia", "https://upload.wikimedia.org/wikipedia/en/5/5b/Chromakopia_CD_cover.jpg", "https://audio.jukehost.co.uk/OJ5E0ssxcGFM9TQYGmixpt549j95LxeK"],
    ["SIRENS", "Travis Scott", "Utopia", "https://upload.wikimedia.org/wikipedia/en/2/23/Travis_Scott_-_Utopia.png", "https://audio.jukehost.co.uk/tMqMoa9zNtWgKpMJLgBE7iBITA8ivTRo"],
    ["Rich Men North of Richmond", "Oliver Anthony", "Single", "https://upload.wikimedia.org/wikipedia/en/d/d4/Oliver_Anthony_-_Rich_Men_North_of_Richmond.png", "https://audio.jukehost.co.uk/Po5eKwlVG0M4wQ3oOG9otBNFevRmkpPC"],
    ["Trance", "Metro Boomin", "Heroes & Villains", "https://i.scdn.co/image/ab67616d0000b273c4fee55d7b51479627c31f89", "https://audio.jukehost.co.uk/L5xxytRx8xzIZJGO3mr6fGlVxD3s99BP"],
    ["Sacrifice", "The Weeknd", "Dawn FM", "https://i.scdn.co/image/ab67616d0000b2734ab2520c2c77a1d66b9ee21d", "https://audio.jukehost.co.uk/OPJ03lifktGkFiDtX6zABItt8gdfqmvn"],
    ["Too Sweet", "Hozier", "Unheard", "https://upload.wikimedia.org/wikipedia/en/9/9a/Hozier_-_Unheard.png", "https://audio.jukehost.co.uk/vM6S0Sokz9qcJ2TPv0R6WcAXhvNFhYoT"],
    ["The American Dream Is Killing Me", "Green Day", "Saviors", "https://upload.wikimedia.org/wikipedia/en/c/c9/Green_Day_-_Saviors.png", "https://audio.jukehost.co.uk/xVflzX2agfU70s5rmti5BfQncpqLOCjw"],
    ["Welcome To Hell", "Black Midi", "Hellfire", "https://upload.wikimedia.org/wikipedia/en/1/12/Black_Midi_-_Hellfire.png", "https://audio.jukehost.co.uk/UIHdUryJ1XMkYpDsi6uTs9av0NwAy3dX"],
    ["São Paulo", "The Weeknd, Anitta", "Single", "https://upload.wikimedia.org/wikipedia/en/7/72/The_Weeknd_and_Anitta_-_S%C3%A3o_Paulo.png", "https://audio.jukehost.co.uk/vTA6uZ2eCK9uEB5HLUBzLICYLz3sDKPJ"],
    ["Blind", "SZA", "SOS", "https://upload.wikimedia.org/wikipedia/en/2/2c/SZA_-_S.O.S.png", "https://audio.jukehost.co.uk/wDaCOSFko1S0NGERvwgKOIPWuShRNeOf"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  window.defaultPlaylist = activePlaylist;

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player * { box-sizing: border-box; }

    #player.qt-window {
      width: 760px;
      margin: 20px auto;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #6e6e6e;
      background:
        linear-gradient(to bottom, #f6f6f6 0%, #dddddd 8%, #cfcfcf 50%, #bebebe 100%);
      box-shadow:
        0 10px 28px rgba(0,0,0,0.35),
        inset 0 1px 0 rgba(255,255,255,0.85);
      font-family: "Lucida Grande", "Segoe UI", Arial, sans-serif;
      color: #222;
    }

    .qt-title-bar {
      position: relative;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(to bottom, #efefef, #cfcfcf);
      border-bottom: 1px solid #9d9d9d;
      user-select: none;
      font-size: 12px;
      font-weight: bold;
      color: #3a3a3a;
      text-shadow: 0 1px 0 rgba(255,255,255,0.7);
    }

    .qt-title-bar-text {
      pointer-events: none;
    }

    .qt-window-controls {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      gap: 6px;
    }

    .qt-control-button {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.25);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
    }

    .qt-close { background: #ff5f57; }
    .qt-minimize { background: #ffbd2e; }
    .qt-maximize { background: #28c840; }

    .qt-menu-bar {
      display: flex;
      gap: 18px;
      padding: 4px 10px 5px;
      font-size: 12px;
      background: linear-gradient(to bottom, #ececec, #d9d9d9);
      border-bottom: 1px solid #b3b3b3;
      color: #1f1f1f;
      user-select: none;
    }

    .player__chrome {
      padding: 14px;
      background:
        linear-gradient(to bottom, rgba(255,255,255,0.28), rgba(0,0,0,0.04)),
        linear-gradient(to bottom, #d7d7d7, #bfbfbf);
    }

    .player__top-row {
      display: flex;
      gap: 14px;
      align-items: stretch;
      margin-bottom: 14px;
    }

    .player__art-container {
      width: 110px;
      height: 110px;
      flex-shrink: 0;
      padding: 4px;
      background: linear-gradient(to bottom, #f2f2f2, #bdbdbd);
      border: 1px solid #8c8c8c;
      border-radius: 6px;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.75),
        0 1px 2px rgba(0,0,0,0.15);
    }

    .player__album-art {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      border-radius: 3px;
      border: 1px solid #5f5f5f;
      background: #111;
    }

    .player__info-panel {
      flex: 1;
      display: flex;
      align-items: stretch;
    }

    .player__lcd {
      width: 100%;
      min-height: 110px;
      padding: 12px 14px;
      border-radius: 7px;
      border: 1px solid #5b5f52;
      background:
        linear-gradient(to bottom, #3f4a35, #1f281a);
      box-shadow:
        inset 0 2px 6px rgba(0,0,0,0.45),
        inset 0 1px 0 rgba(255,255,255,0.05);
      color: #d8f2b8;
      text-shadow: 0 0 4px rgba(170,255,120,0.18);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
      overflow: hidden;
    }

    .player__song-title,
    .player__song-artist,
    .player__song-album {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .player__song-title {
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 0.2px;
    }

    .player__song-artist {
      font-size: 14px;
      color: #c8e7a6;
    }

    .player__song-album {
      font-size: 12px;
      color: #a9c98d;
    }

    .player__progress-section {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      padding: 0 2px;
    }

    .player__timecode {
      width: 64px;
      flex-shrink: 0;
      font-size: 11px;
      font-family: Consolas, IBM Courier, Couriew New, monospace;
      color: #2d2d2d;
      text-align: right;
      user-select: none;
    }

    .progress-bar-wrapper {
      position: relative;
      flex: 1;
      height: 12px;
      padding: 2px;
      border-radius: 999px;
      border: 1px solid #7f7f7f;
      background: linear-gradient(to bottom, #8e8e8e, #cfcfcf);
      box-shadow:
        inset 0 1px 3px rgba(0,0,0,0.35),
        0 1px 0 rgba(255,255,255,0.5);
    }

    .player__progress-bar {
      position: relative;
      width: 0%;
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(to bottom, #c6ecff, #4fa4df);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.55);
    }

    .player__progress-bar::after {
      content: '';
      position: absolute;
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(to bottom, #ffffff, #dcdcdc);
      border: 1px solid #777;
      box-shadow: 0 1px 1px rgba(0,0,0,0.25);
    }

    .player__bottom-row {
      display: grid;
      grid-template-columns: 140px 1fr 140px;
      align-items: center;
      gap: 10px;
    }

    .player__volume-container {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .volume-icon {
      width: 16px;
      height: 16px;
      fill: #4f4f4f;
      flex-shrink: 0;
    }

    input[type=range].player__volume-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100px;
      height: 6px;
      border-radius: 999px;
      border: 1px solid #7f7f7f;
      background: linear-gradient(to bottom, #8e8e8e, #d1d1d1);
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
      outline: none;
    }

    input[type=range].player__volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      border: 1px solid #7f7f7f;
      background: linear-gradient(to bottom, #ffffff, #d8d8d8);
      box-shadow: 0 1px 1px rgba(0,0,0,0.25);
      cursor: pointer;
    }

    input[type=range].player__volume-slider::-moz-range-thumb {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      border: 1px solid #7f7f7f;
      background: linear-gradient(to bottom, #ffffff, #d8d8d8);
      box-shadow: 0 1px 1px rgba(0,0,0,0.25);
      cursor: pointer;
    }

    .player__buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .player__btn {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid #7b7b7b;
      background: linear-gradient(to bottom, #fefefe, #d3d3d3);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.8),
        0 1px 2px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .player__btn:hover {
      filter: brightness(1.03);
    }

    .player__btn:active {
      background: linear-gradient(to bottom, #cdcdcd, #f3f3f3);
      box-shadow: inset 0 2px 3px rgba(0,0,0,0.22);
    }

    .player__btn svg {
      width: 14px;
      height: 14px;
      fill: #4f4f4f;
    }

    .player__btn--main {
      width: 40px;
      height: 40px;
    }

    .player__btn--main svg {
      width: 18px;
      height: 18px;
    }

    .player__btn--play {
      background: linear-gradient(to bottom, #ffffff, #cfcfcf);
    }

    @media (max-width: 820px) {
      #player.qt-window {
        width: 95%;
      }

      .player__bottom-row {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .player__volume-container {
        justify-content: center;
      }

      .player__top-row {
        flex-direction: column;
      }

      .player__art-container {
        width: 120px;
        height: 120px;
        margin: 0 auto;
      }
    }
  `;
  document.head.appendChild(style);

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.className = "qt-window";
  playerContainer.innerHTML = `
    <div class="qt-title-bar">
      <div class="qt-window-controls">
        <div class="qt-control-button qt-close"></div>
        <div class="qt-control-button qt-minimize"></div>
        <div class="qt-control-button qt-maximize"></div>
      </div>
      <span class="qt-title-bar-text">QuickTime Player</span>
    </div>

    <div class="qt-menu-bar">
      <span>File</span>
      <span>Edit</span>
      <span>View</span>
      <span>Window</span>
      <span>Help</span>
    </div>

    <div class="player__chrome">
      <div class="player__top-row">
        <div class="player__art-container">
          <img src="" alt="Album Cover" class="player__album-art">
        </div>

        <div class="player__info-panel">
          <div class="player__lcd">
            <div class="player__song-title"></div>
            <div class="player__song-artist"></div>
            <div class="player__song-album"></div>
          </div>
        </div>
      </div>

      <div class="player__progress-section">
        <span class="player__timecode">00:00:00</span>
        <div class="progress-bar-wrapper">
          <div class="player__progress-bar"></div>
        </div>
      </div>

      <div class="player__bottom-row">
        <div class="player__volume-container">
          <svg viewBox="0 0 24 24" class="volume-icon">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
          </svg>
          <input type="range" class="player__volume-slider" min="0" max="1" step="0.01" value="0.7">
        </div>

        <div class="player__buttons">
          <button class="player__btn player__btn--start" title="Go to Start">
            <svg viewBox="0 0 24 24"><path d="M6 6 H 8 V 18 H 6 Z M 18 12 L 10 18 V 6 Z"></path></svg>
          </button>
          <button class="player__btn player__btn--prev" title="Previous">
            <svg viewBox="0 0 24 24"><path d="M18 6 L 18 18 L 13 12 Z M 11 6 L 11 18 L 6 12 Z"></path></svg>
          </button>
          <button class="player__btn player__btn--toggle player__btn--main" id="playPauseButton" title="Play/Pause">
            <svg viewBox="0 0 24 24" class="player__toggle-icon">
              <path d="M8 5v14l11-7z"></path>
            </svg>
          </button>
          <button class="player__btn player__btn--next" title="Next">
            <svg viewBox="0 0 24 24"><path d="M6 18 l 5 -6 l -5 -6 z M 13 18 l 5 -6 l -5 -6 z"></path></svg>
          </button>
          <button class="player__btn player__btn--stop" title="Stop">
            <svg viewBox="0 0 24 24"><path d="M7 7h10v10H7z"></path></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.audioLink;
  audio.volume = currentVolume;

  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    audio.src = activePlaylist.getCurrentSong().audioLink;
    audio.play();
    updatePlayPauseIcon(true);
  };

  function addAndPlaySong(song) {
    activePlaylist.addSong(song);
    activePlaylist.currentSongIndex = activePlaylist.songs.length - 1;
    playSongAtIndex();
  }
  window.addAndPlaySong = addAndPlaySong;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = playerContainer.querySelector(".player__btn--prev");
  const nextBtn = playerContainer.querySelector(".player__btn--next");
  const stopBtn = playerContainer.querySelector(".player__btn--stop");
  const startBtn = playerContainer.querySelector(".player__btn--start");
  const progressBar = playerContainer.querySelector(".player__progress-bar");
  const progressWrapper = playerContainer.querySelector(".progress-bar-wrapper");
  const volumeSlider = playerContainer.querySelector(".player__volume-slider");
  const timecode = playerContainer.querySelector(".player__timecode");

  // play/pause
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      updatePlayPauseIcon(true);
    } else {
      audio.pause();
      updatePlayPauseIcon(false);
    }
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

  // stop
  stopBtn.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    updatePlayPauseIcon(false);
    updateProgress();
  });

  // start
  startBtn.addEventListener("click", () => {
    audio.currentTime = 0;
    updateProgress();
  });

  // progress bar
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const updateProgress = () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const progressPercent = (currentTime / duration) * 100;
    const safePercent = isNaN(progressPercent) ? 0 : progressPercent;

    progressBar.style.width = `${safePercent}%`;
    timecode.textContent = formatTime(isNaN(currentTime) ? 0 : currentTime);
  };

  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("loadedmetadata", updateProgress);

  audio.addEventListener("ended", () => {
    updatePlayPauseIcon(false);
    activePlaylist.playNext();
    playSongAtIndex();
  });

  audio.addEventListener("play", () => updatePlayPauseIcon(true));
  audio.addEventListener("pause", () => updatePlayPauseIcon(false));

  // scrubbing progress bar functionality
  let isScrubbing = false;

  const seek = (clientX) => {
    const rect = progressWrapper.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = percent * audio.duration;
    }
  };

  progressWrapper.addEventListener("mousedown", (e) => {
    isScrubbing = true;
    seek(e.clientX);
  });

  document.addEventListener("mousemove", (e) => {
    if (!isScrubbing) return;
    seek(e.clientX);
  });

  document.addEventListener("mouseup", () => {
    isScrubbing = false;
  });

  progressWrapper.addEventListener("click", (e) => {
    seek(e.clientX);
  });

  // volume
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseFloat(e.target.value);
    audio.volume = currentVolume;
  });

  // initial play
  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

setupMusicPlayer();
