// This is a modified version of the music player
// used in the mod 1992: Moonbeam.
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
  const player = document.getElementById("player") || document.querySelector(".player");

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
  const btn = document.querySelector(".player__btn--playpause");
  if (btn) {
    if (isPlaying) {
      btn.classList.add("is-playing");
      btn.title = "Pause";
    } else {
      btn.classList.remove("is-playing");
      btn.title = "Play";
    }
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// setup
function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) {
    console.warn("game_window element not found. Player will not be attached.");
    return;
  }

  // prevent duplicate players
  if (document.getElementById("player") || document.querySelector(".player")) return;

  const defaultSongs = [
    ["California Über Alles", "Dead Kennedys", "https://i.imgur.com/f2VqI0S.jpeg", "https://file.garden/aKoRqbLZKBsHizSA/moonbeam/Dead%20Kennedys%20-%20California%20%C3%9Cber%20Alles.mp3"],
    ["100%", "Sonic Youth", "https://i.imgur.com/OV76VvQ.jpeg", "https://file.garden/aKoRqbLZKBsHizSA/moonbeam/Sonic%20Youth%20-%20100%20(Official%20Music%20Video).mp3"],
    ["Who Wrote Holden Caulfield", "Green Day", "https://i.imgur.com/y636VVk.jpeg", "https://file.garden/aKoRqbLZKBsHizSA/moonbeam/Who%20Wrote%20Holden%20Caulfield_%20-%20Green%20Day%20-%20HQ.mp3"],
    ["In Bloom", "Nirvana", "https://i.imgur.com/21gOVWE.jpeg", "https://file.garden/aKoRqbLZKBsHizSA/moonbeam/In%20Bloom%20-%20Nirvana.mp3"],
    ["Only Shallow", "My Bloody Valentine", "https://i.imgur.com/J9uKRNc.jpeg", "https://file.garden/aKoRqbLZKBsHizSA/moonbeam/my%20bloody%20valentine%20%20only%20shallow%20(official%20video).mp3"],
    ["Gratitude", "Beastie Boys", "https://i.imgur.com/RaFQsZz.jpeg", "https://file.garden/aUjAupxGEFbQH4RI/YTDown.com_YouTube_Beastie-Boys-Gratitude_Media_ZdJ5e70Q8mw_001_1080p.mp4"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  const savedLayout = localStorage.getItem('walkman_layout');
  const isHorizontal = savedLayout === 'horizontal';
  const playerClass = isHorizontal ? 'player player--horizontal' : 'player';
  const lockClass = isHorizontal ? 'player__lock-switch active' : 'player__lock-switch';

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --player-bg: #212121;
      --player-border: #1a1a1a;
      --lcd-bg: #20372f;
      --lcd-text: #a1d8a3;
      --text-primary: #d1d1d1;
      --text-secondary: #888;
      --accent-color: #e0e0e0;
      --button-bg: #4d4d4d;
      --button-border: #353535;
      --icon-color: #d1d1d1;
    }
    .player {
      display: flex;
      background: var(--player-bg);
      border: 2px solid var(--player-border);
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.1);
      font-family: 'Consolas', IBM Courier, Arial, sans-serif;
      width: 100%;
      max-width: 360px;
      margin: 15px auto;
      color: var(--text-primary);
      overflow: hidden;
      transition: max-width 0.3s ease, height 0.3s ease;
    }
    .player__body {
      flex-grow: 1; padding: 8px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .player__header {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 9px; color: var(--text-secondary);
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .player__brand-sony { font-weight: bold; font-size: 14px; color: var(--accent-color); }
    .player__features { display: flex; gap: 8px; }
    .player__features span {
      border: 1px solid #3b3d44;
      border-radius: 2px;
      padding: 1px 4px;
      background: rgba(0, 0, 0, 0.2);
    }
    .player__window {
      background: #111; border: 1px solid #000;
      border-radius: 4px; padding: 10px;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
    }
    .player__window-inner { background: #333; border: 1px solid #444; width: 100%; }
    .player__album-art { display: block; width: 100%; height: auto; object-fit: cover; max-height: 260px; }

    .player__lcd-display {
      background: var(--lcd-bg); border: 2px solid #1a2924;
      border-radius: 4px; padding: 6px 10px;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.5); color: var(--lcd-text);
    }
    .player__song-info {
      text-align: center; padding-bottom: 4px;
      border-bottom: 1px solid #2a4b3e; margin-bottom: 4px;
    }
    .player__song-title { font-size: 14px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .player__song-artist { font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .player__progress-container { display: flex; align-items: baseline; gap: 6px; width: 100%; }
    .player__time-current, .player__time-duration { font-size: 11px; min-width: 35px; text-align: center; }

    .progress-bar-stack { position: relative; width: 100%; height: 8px; display: flex; align-items: center; }
    .progress-bar--display, .progress-bar--interactive { position: absolute; top: 0; left: 0; width: 100%; height: 100%; margin: 0; padding: 0; }
    .progress-bar--display { -webkit-appearance: none; appearance: none; }
    .progress-bar--display::-webkit-progress-bar { background-color: #1a2924; border-radius: 4px; }
    .progress-bar--display::-webkit-progress-value { background-color: var(--lcd-text); border-radius: 4px; }
    .progress-bar--interactive { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; z-index: 2; }
    .progress-bar--interactive::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 0; height: 8px; }
    .progress-bar--interactive::-moz-range-thumb { width: 0; height: 0; border: 0; background: transparent; }
    .progress-bar--interactive::-moz-range-track { background: transparent; border: none; }
    .progress-bar--display::-moz-progress-bar { background-color: #195905; }

    .player__controls-area { margin-top: 3px; text-align: center; }
    .player__brand-walkman {
      font-size: 12px; font-style: italic; font-weight: bold; color: var(--text-secondary);
      letter-spacing: 1.5px; margin-bottom: 8px;
    }
    .player__controls { display: flex; align-items: center; justify-content: center; gap: 12px; }
    .player__btn {
      border: none; padding: 0;
      width: 32px; height: 32px;
      cursor: pointer; background: var(--button-bg);
      border-radius: 50%; border: 2px solid var(--button-border);
      box-shadow: 0 2px 2px #111, inset 0 -1px 1px rgba(255,255,255,0.1);
      transition: all 0.1s ease-out;
      display: flex; align-items: center; justify-content: center;
    }
    .player__btn:hover { background-color: #606060; }
    .player__btn:active { transform: translateY(1px); box-shadow: 0 1px 1px #111, inset 0 1px 2px rgba(0,0,0,0.5); }
    .player__btn svg { width: 60%; height: 60%; fill: var(--icon-color); transition: fill 0.2s; }
    .player__btn:hover svg { fill: #fff; }
    .player__btn--playpause { width: 38px; height: 38px; }
    .player__btn--playpause .icon-pause { display: none; }
    .player__btn--playpause.is-playing .icon-play { display: none; }
    .player__btn--playpause.is-playing .icon-pause { display: block; }

    .player__side-panel {
      background: #1c1c1c; border-left: 2px solid #111;
      display: flex; flex-direction: column; align-items: center;
      justify-content: space-between;
      padding: 15px 6px;
      width: 50px; box-sizing: border-box;
    }
    .player__volume-group {
      display: flex; flex-direction: column;
      align-items: center; gap: 8px;
      flex-grow: 1;
    }
    .player__side-label {
      font-size: 9px; color: var(--text-secondary);
      transform: rotate(90deg);
      letter-spacing: 0.5px;
      margin: 0.5em 0 1.5em 0;
    }
    .player__volume-area {
      width: 100%; height: 170px;
      display: flex; align-items: center; justify-content: center; position: relative;
    }

    input[type=range].player__volume-slider {
      -webkit-appearance: none; appearance: none;
      width: 150px; height: 20px;
      background: transparent; transform: rotate(-90deg); cursor: pointer;
    }
    input[type=range].player__volume-slider::-webkit-slider-runnable-track {
      width: 100%; height: 6px; background: #050505;
      border: 1px solid #333; border-radius: 3px;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.05);
    }
    input[type=range].player__volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none; height: 16px; width: 24px; margin-top: -6px;
      background: repeating-linear-gradient(90deg, #4a4a4a, #4a4a4a 2px, #2a2a2a 3px, #2a2a2a 4px);
      border: 1px solid #111; border-radius: 2px; box-shadow: 0 2px 4px #000;
    }
    input[type=range].player__volume-slider::-moz-range-track {
      width: 100%; height: 6px; background: #050505; border: 1px solid #333; border-radius: 3px;
    }
    input[type=range].player__volume-slider::-moz-range-thumb {
      height: 16px; width: 24px; border: 1px solid #111; border-radius: 2px;
      background: repeating-linear-gradient(90deg, #4a4a4a, #4a4a4a 2px, #2a2a2a 3px, #2a2a2a 4px);
    }

    .player__lock { text-align: center; margin-bottom: 5px; cursor: pointer; }
    .player__lock-label { font-size: 9px; color: var(--text-secondary); }

    .player__lock-switch {
      width: 22px; height: 10px; background: #000;
      border-radius: 8px; border: 1px solid #333;
      margin: 3px auto 0; position: relative;
      transition: background 0.2s;
    }
    .player__lock-switch::after {
      content: ''; position: absolute;
      width: 10px; height: 10px; background: #d32f2f;
      border-radius: 50%; top: -1px; left: -1px;
      border: 1px solid #555; box-shadow: 0 1px 2px rgba(0,0,0,0.5);
      transition: left 0.2s, background 0.2s;
    }

    .player__lock-switch.active::after {
      left: 11px;
      background: #4caf50;
    }

    .player.player--horizontal { max-width: 600px; }

    .player.player--horizontal .player__body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto 1fr;
      gap: 12px;
      grid-template-areas:
        "window header"
        "window lcd"
        "window controls";
      align-items: center;
      padding-right: 15px;
    }

    .player.player--horizontal .player__window { grid-area: window; height: 100%; margin: 0; }
    .player.player--horizontal .player__header { grid-area: header; align-self: end; border-bottom: 1px solid #333; padding-bottom: 5px; }
    .player.player--horizontal .player__lcd-display { grid-area: lcd; }
    .player.player--horizontal .player__controls-area { grid-area: controls; align-self: start; }
    .player.player--horizontal .player__album-art { max-height: 100%; aspect-ratio: 1/1; }
  `;
  document.head.appendChild(style);

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.className = playerClass;
  playerContainer.innerHTML = `
    <div class="player__body">
      <div class="player__header">
        <span class="player__brand-sony">SONY</span>
        <div class="player__features">
          <span>DOLBY B NR</span>
          <span>EX DBB</span>
        </div>
      </div>
      <div class="player__window">
        <div class="player__window-inner">
          <img src="" alt="Album Cover" class="player__album-art">
        </div>
      </div>
      <div class="player__lcd-display">
        <div class="player__song-info">
          <div class="player__song-title"></div>
          <div class="player__song-artist"></div>
        </div>
        <div class="player__progress-container">
          <span class="player__time-current">00:00</span>
          <div class="progress-bar-stack">
            <progress class="progress-bar--display" value="0" max="100"></progress>
            <input type="range" class="progress-bar--interactive" value="0" min="0" max="100" step="0.1">
          </div>
          <span class="player__time-duration">00:00</span>
        </div>
      </div>
      <div class="player__controls-area">
        <div class="player__brand-walkman">WALKMAN</div>
        <div class="player__controls">
          <button class="player__btn player__btn--prev" id="prevButton" title="Previous">
            <svg class="icon-prev" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
          </button>
          <button class="player__btn player__btn--playpause" id="playPauseButton" title="Play/Pause">
            <svg class="icon-play" viewBox="0 0 24 24"><path d="M7.5 5v15l11-7z"></path></svg>
            <svg class="icon-pause" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
          </button>
          <button class="player__btn player__btn--next" id="nextButton" title="Next">
            <svg class="icon-next" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>
          </button>
          <button class="player__btn player__btn--stop" id="stopButton" title="Stop">
            <svg class="icon-stop" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12"></rect></svg>
          </button>
        </div>
      </div>
    </div>
    <div class="player__side-panel">
      <div class="player__volume-group">
        <span class="player__side-label">VOLUME</span>
        <div class="player__volume-area">
          <input type="range" class="player__volume-slider" id="volumeSlider" min="0" max="10" step="1" value="${currentVolume}">
        </div>
      </div>
      <div class="player__lock">
        <span class="player__lock-label">HOLD</span>
        <div class="${lockClass}"></div>
      </div>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong && startSong.getAudioLink()) audio.src = startSong.getAudioLink();
  audio.volume = currentVolume / 10;

  const playPauseBtn = playerContainer.querySelector(".player__btn--playpause");
  const prevBtn = playerContainer.querySelector(".player__btn--prev");
  const nextBtn = playerContainer.querySelector(".player__btn--next");
  const stopBtn = playerContainer.querySelector(".player__btn--stop");
  const volumeSlider = playerContainer.querySelector(".player__volume-slider");
  const progressBarDisplay = playerContainer.querySelector(".progress-bar--display");
  const progressBarInteractive = playerContainer.querySelector(".progress-bar--interactive");
  const currentTimeDisplay = playerContainer.querySelector(".player__time-current");
  const durationTimeDisplay = playerContainer.querySelector(".player__time-duration");
  const lockSwitchArea = playerContainer.querySelector(".player__lock");
  const lockSwitch = playerContainer.querySelector(".player__lock-switch");

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

  // next/prev helper
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

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playSongAtIndex();
  });

  stopBtn.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    updatePlayPauseIcon(false);
  });

  // layout switch
  lockSwitchArea.addEventListener("click", () => {
    const isNowHorizontal = playerContainer.classList.toggle("player--horizontal");
    lockSwitch.classList.toggle("active");
    localStorage.setItem("walkman_layout", isNowHorizontal ? "horizontal" : "vertical");
  });

  // progress bar & time updates
  const updateProgress = () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      const safePercent = isNaN(progressPercent) ? 0 : progressPercent;
      progressBarDisplay.value = safePercent;
      progressBarInteractive.value = safePercent;
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
      durationTimeDisplay.textContent = formatTime(audio.duration);
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
window.WalkmanPlayer = {
  init: function(targetSelector, initialPlaylist) {
    if (initialPlaylist) activePlaylist = initialPlaylist;
    setupMusicPlayer();
  },
  loadPlaylist: function(newPlaylist) {
    changePlaylist(newPlaylist);
  }
};

setupMusicPlayer();
