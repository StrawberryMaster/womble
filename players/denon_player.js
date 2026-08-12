// This is a Denon DCP-30 CD player
// made for 1992: Moonbeam.
class Song {
  constructor(title, artist, coverLink, audioLink) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;
    this.audioLink = audioLink;
  }
  getTitle() { return this.title; }
  getArtist() { return this.artist; }
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
      return new Song("No Songs Loaded", "Please add a playlist", "https://itsastronomical.com/assets/music/buttons.png", "");
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
let currentVolume = 5;

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song && song.getAudioLink()) {
    audio.src = song.getAudioLink();
    audio.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
    updatePlayPauseIcon(true);
  }
}
window.changePlaylist = changePlaylist;

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  const player = document.getElementById("player") || document.querySelector(".denon-player");

  if (!player || !currentSong) return;

  const cover = player.querySelector(".denon-player__album-art");
  const title = player.querySelector(".denon-player__song-title");
  const artist = player.querySelector(".denon-player__song-artist");

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
  const btn = document.querySelector(".denon-player__btn--playpause");
  const cover = document.querySelector(".denon-player__album-art");

  if (btn) {
    if (isPlaying) {
      btn.classList.add("is-playing");
    } else {
      btn.classList.remove("is-playing");
    }
  }

  if (cover) {
    if (isPlaying) {
      cover.classList.add("is-spinning");
    } else {
      cover.classList.remove("is-spinning");
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
  if (document.getElementById("player") || document.querySelector(".denon-player")) return;

  const defaultSongs = [
    ["We Are Sex Bob-Omb", "Nigel Godrich", "https://upload.wikimedia.org/wikipedia/en/5/59/Scott_Pilgrim_soundtrack_cover.jpg", "https://file.garden/Zrv1pPC1HzBK0svl/We%20Are%20Sex%20Bob-Omb%204.mp3"],
    ["Jesus Of Suburbia", "Green Day", "https://m.media-amazon.com/images/I/71Z0rLIvpuL.UF1000,1000_QL80_FMwebp.jpg", "https://audio.jukehost.co.uk/ie5hY1Mg2vFmhLCg6B4SCkLxR7qPJj8X"],
    ["Let Them Eat War", "Bad Religion", "https://m.media-amazon.com/images/I/81degSVgGHL.UF1000,1000_QL80_FMwebp.jpg", "https://file.garden/Zrv1pPC1HzBK0svl/Bad%20Religion%20-%20_Let%20Them%20Eat%20War_%20(Full%20Album%20Stream).mp3"],
    ["I Don't Wanna Be Me", "Type O Negative", "https://i.scdn.co/image/ab67616d0000b273d736b2c5f252f84ad45d5be6", "https://file.garden/Z7qfmQZIZjO_xV5N/TypeONegative.mp3"],
    ["Chemical Warfare", "Dead Kennedys", "https://m.media-amazon.com/images/I/51TCNE6429L.UF1000,1000_QL80_FMwebp.jpg", "https://file.garden/Zrv1pPC1HzBK0svl/Chemical%20Warfare%20%5Br51QBJTjv2U%5D.mp3"],
    ["Street Fighting Man", "Rage Against The Machine", "https://cdn-p.smehost.net/sites/cf12164f913d49c2a55e7ee092b1ed48/wp-content/uploads/2019/01/ratm_renegades.jpg", "https://file.garden/Zrv1pPC1HzBK0svl/Street%20Fighting%20Man.mp3"],
    ["Garbage Truck", "Nigel Godrich", "https://upload.wikimedia.org/wikipedia/en/5/59/Scott_Pilgrim_soundtrack_cover.jpg", "https://file.garden/Zrv1pPC1HzBK0svl/Garbage%20Truck%204.mp3"],
    ["Threshold", "Nigel Godrich", "https://upload.wikimedia.org/wikipedia/en/5/59/Scott_Pilgrim_soundtrack_cover.jpg", "https://file.garden/Zrv1pPC1HzBK0svl/Threshold%204.mp3"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    :root {
      --denon-bg: #4a4a4a; --denon-dark-bg: #3d3d3d; --denon-border: #2b2b2b;
      --denon-text: #d0d0d0; --lcd-bg: #20372f; --lcd-text: #a1d8a3;
    }
    .denon-player {
      display: flex;
      background: var(--denon-dark-bg);
      border-radius: 6px 6px 10px 10px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1);
      width: 100%; max-width: 540px; margin: 40px auto;
      font-family: 'Consolas', 'Courier New', Courier, monospace;
    }
    .denon-player__body {
      flex-grow: 1; background-color: var(--denon-bg);
      border: 1px solid var(--denon-border); border-radius: 6px 0 0 10px;
      padding: 15px;
    }
    .denon-player__lid { text-align: center; }
    .denon-player__branding { color: var(--denon-text); margin-bottom: 10px; }
    .denon-player__brand-name { font-size: 20px; font-weight: bold; letter-spacing: 1px; }
    .denon-player__brand-subtext { font-size: 8px; display: block; letter-spacing: 0.5px; opacity: 0.8; }
    .denon-player__disc-window {
      background: #111; padding: 10px; border-radius: 4px;
      box-shadow: inset 0 2px 5px rgba(0,0,0,0.7);
      margin: 0 auto 15px auto; max-width: 250px;
    }
    .denon-player__disc-container {
      position: relative; padding-top: 100%; border-radius: 50%;
      overflow: hidden; opacity: 0.85;
      -webkit-mask-image: radial-gradient(circle, transparent 0%, transparent 18%, black 19%, black 100%);
      mask-image: radial-gradient(circle, transparent 0%, transparent 18%, black 19%, black 100%);
    }
    .denon-player__album-art {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      animation: spin 10s linear infinite;
      animation-play-state: paused;
    }
    .denon-player__album-art.is-spinning { animation-play-state: running; }

    .denon-player__disc-logo { color: var(--denon-text); font-weight: bold; }
    .denon-player__compact-disc { font-size: 18px; font-style: italic; letter-spacing: -1px; }
    .denon-player__digital-audio { font-size: 10px; display: block; letter-spacing: 3px; }

    .denon-player__controls-panel {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      background-color: var(--denon-dark-bg);
      margin: 15px -15px -15px -15px; padding: 10px;
      border-top: 2px solid var(--denon-border); border-radius: 0 0 0 10px;
    }
    .denon-player__controls-group { display: flex; align-items: center; gap: 8px; }

    .denon-player__lcd {
      flex-grow: 1; background: var(--lcd-bg);
      border: 2px solid #1a2924; border-radius: 4px; padding: 5px 8px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.5); color: var(--lcd-text);
      font-family: 'Consolas', 'Courier New', Courier, monospace;
    }
    .denon-player__song-info {
      text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      padding-bottom: 3px; margin-bottom: 3px;
    }
    .denon-player__song-title { font-size: 14px; font-weight: bold; }
    .denon-player__song-artist { font-size: 10px; opacity: 0.9; }
    .denon-player__progress-container { display: flex; align-items: center; gap: 8px; width: 100%; margin-top: 2px; }

    .progress-bar-stack { position: relative; width: 100%; height: 8px; display: flex; align-items: center; }
    .progress-bar--display, .progress-bar--interactive { position: absolute; top: 0; left: 0; width: 100%; height: 100%; margin: 0; padding: 0; }

    .progress-bar--display { -webkit-appearance: none; appearance: none; border: 1px solid #1a2924; border-radius: 3px; overflow: hidden; }
    .progress-bar--display::-webkit-progress-bar { background-color: #14201c; }
    .progress-bar--display::-webkit-progress-value { background-color: var(--lcd-text); box-shadow: 0 0 4px rgba(161, 216, 163, 0.6); }
    .progress-bar--display::-moz-progress-bar { background-color: var(--lcd-text); box-shadow: 0 0 4px rgba(161, 216, 163, 0.6); }

    .progress-bar--interactive { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; z-index: 2; }
    .progress-bar--interactive::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 8px; height: 8px; background: transparent; }
    .progress-bar--interactive::-moz-range-thumb { width: 0; height: 0; border: none; background: transparent; }
    .progress-bar--interactive::-moz-range-track { background: transparent; border: none; }

    .denon-player__btn {
      border: 1px solid #222; background-color: #383838;
      color: var(--denon-text); font-size: 10px; font-weight: bold;
      cursor: pointer; transition: all 0.1s ease-out;
      box-shadow: 0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
      font-family: 'Consolas', 'Courier New', Courier, monospace;
    }
    .denon-player__btn:not(:disabled):active { transform: translateY(1px); box-shadow: inset 0 1px 2px rgba(0,0,0,0.5); }
    .denon-player__btn--oval { border-radius: 12px; padding: 4px 10px; }
    .denon-player__btn--round { border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; padding: 0; }
    .denon-player__btn svg { width: 60%; height: 60%; fill: var(--denon-text); }
    .denon-player__btn--playpause { width: 42px; height: 42px; }
    .denon-player__btn--playpause .icon-pause { display: none; }
    .denon-player__btn--playpause.is-playing .icon-play { display: none; }
    .denon-player__btn--playpause.is-playing .icon-pause { display: block; }
    .denon-player__btn:disabled { opacity: 0.6; cursor: default; }

    .denon-player__side-panel {
      background: #333; border-left: 2px solid #222;
      border-radius: 0 6px 10px 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center; padding: 10px;
    }
    .denon-player__side-label {
      font-size: 10px; color: var(--denon-text); writing-mode: vertical-rl;
      text-orientation: mixed; letter-spacing: 1px; margin-bottom: 15px;
      font-family: 'Consolas', 'Courier New', Courier, monospace;
    }
    .denon-player__volume-area {
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    input[type=range].denon-player__volume-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 8px;
      height: 130px;
      background: transparent;
      writing-mode: vertical-lr;
      direction: rtl;
      cursor: pointer;
    }
    input[type=range].denon-player__volume-slider::-webkit-slider-runnable-track {
      width: 8px;
      height: 100%;
      background: #1a1a1a;
      border: 1px solid #222;
      border-radius: 4px;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.8);
    }
    input[type=range].denon-player__volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 14px;
      margin-left: -7px;
      background: linear-gradient(180deg, #555 0%, #383838 100%);
      border: 1px solid #111;
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2);
    }
    input[type=range].denon-player__volume-slider::-moz-range-track {
      width: 8px;
      height: 100%;
      background: #1a1a1a;
      border: 1px solid #222;
      border-radius: 4px;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.8);
    }
    input[type=range].denon-player__volume-slider::-moz-range-thumb {
      width: 22px;
      height: 14px;
      background: linear-gradient(180deg, #555 0%, #383838 100%);
      border: 1px solid #111;
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2);
    }
  `;
  document.head.appendChild(style);

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.className = "denon-player";
  playerContainer.innerHTML = `
    <div class="denon-player__body">
      <div class="denon-player__lid">
        <div class="denon-player__branding">
          <span class="denon-player__brand-name">DENON</span>
          <span class="denon-player__brand-subtext">PRECISION AUDIO COMPONENT DCP-30</span>
        </div>
        <div class="denon-player__disc-window">
          <div class="denon-player__disc-container">
            <img src="" alt="Album cover" class="denon-player__album-art">
          </div>
        </div>
        <div class="denon-player__disc-logo">
          <span class="denon-player__compact-disc">COMPACT disc</span>
          <span class="denon-player__digital-audio">DIGITAL AUDIO</span>
        </div>
      </div>
      <div class="denon-player__controls-panel">
        <div class="denon-player__controls-group denon-player__controls-group--left">
          <button class="denon-player__btn denon-player__btn--oval" disabled>MODE</button>
          <button class="denon-player__btn denon-player__btn--oval" disabled>SET</button>
        </div>
        <div class="denon-player__lcd">
          <div class="denon-player__song-info">
            <div class="denon-player__song-title"></div>
            <div class="denon-player__song-artist"></div>
          </div>
          <div class="denon-player__progress-container">
            <div class="progress-bar-stack">
              <progress class="progress-bar--display" value="0" max="100"></progress>
              <input type="range" class="progress-bar--interactive" value="0" min="0" max="100" step="0.1">
            </div>
          </div>
        </div>
        <div class="denon-player__controls-group denon-player__controls-group--right">
          <button class="denon-player__btn denon-player__btn--round denon-player__btn--playpause" id="playPauseButton" title="Play/Pause">
            <svg class="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            <svg class="icon-pause" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
          </button>
          <button class="denon-player__btn denon-player__btn--round denon-player__btn--stop" id="stopButton" title="Stop">
            <svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12"></rect></svg>
          </button>
          <button class="denon-player__btn denon-player__btn--round denon-player__btn--next" id="nextButton" title="Next">
            <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>
          </button>
        </div>
      </div>
    </div>
    <div class="denon-player__side-panel">
      <span class="denon-player__side-label">VOLUME</span>
      <div class="denon-player__volume-area">
        <input type="range" class="denon-player__volume-slider" id="volumeSlider" min="0" max="10" step="1" value="${currentVolume}">
      </div>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong && startSong.getAudioLink()) audio.src = startSong.getAudioLink();
  audio.volume = currentVolume / 10;

  const playPauseBtn = playerContainer.querySelector(".denon-player__btn--playpause");
  const stopBtn = playerContainer.querySelector(".denon-player__btn--stop");
  const nextBtn = playerContainer.querySelector(".denon-player__btn--next");
  const volumeSlider = playerContainer.querySelector(".denon-player__volume-slider");
  const progressBarDisplay = playerContainer.querySelector(".progress-bar--display");
  const progressBarInteractive = playerContainer.querySelector(".progress-bar--interactive");

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

  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    const song = activePlaylist.getCurrentSong();
    if (song && song.getAudioLink()) {
      audio.src = song.getAudioLink();
      audio.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
      updatePlayPauseIcon(true);
    }
  };

  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  stopBtn.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    updatePlayPauseIcon(false);
  });

  // progress bar updates
  const updateProgress = () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      const safePercent = isNaN(progressPercent) ? 0 : progressPercent;
      progressBarDisplay.value = safePercent;
      progressBarInteractive.value = safePercent;
    }
  };

  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("loadedmetadata", updateProgress);

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  progressBarInteractive.addEventListener("input", (e) => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (e.target.value / 100) * audio.duration;
    }
  });

  // volume
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    audio.volume = currentVolume / 10;
  });

  // initial play
  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

// compatibility object wrapper
window.DenonPlayer = {
  init: function(targetSelector, initialPlaylist) {
    if (initialPlaylist) activePlaylist = initialPlaylist;
    setupMusicPlayer();
  },
  loadPlaylist: function(newPlaylist) {
    changePlaylist(newPlaylist);
  }
};

setupMusicPlayer();
