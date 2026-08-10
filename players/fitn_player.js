// This is a recreation of the music player
// showcased in the mod Flowers in Their Nightmare sneak peeks.
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
  constructor() {
    this.songs = [];
    this.currentSongIndex = 0;
  }
  addSong(song) { this.songs.push(song); }
  getCurrentSong() { return this.songs[this.currentSongIndex]; }
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

// globals
let activePlaylist = new Playlist();
window.playlist = activePlaylist;
let audioInstance = null;
let currentVolume = 5;

// assets
const ASSETS = {
  bg: "https://file.garden/aNtAfG887DiA_7lO/others/fitn.png",
  volThumb: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAVCAYAAACzK0UYAAACSklEQVR4nLWVQU/jMBCFvxk7aUi5bQUVEoILqOLGhX/B397eEXvgSBFIjZbtHlpwkzjeQ2UrsLCsUHnSKIntzJt547Hl/Pw8lGWJc46DgwPG4zFnZ2ecnJywu7tL27asVisGgwFlWVIUBdPplMvLS1SVrusIITCbzbi6uuLm5obZbEZVVdR1zfPzM/bi4oL9/X2qquL09JTDw0Mmkwl7e3ssl0vu7+95enoihICqMhwOqesa7z3GGIqiwFrLeDymLEsmkwnz+RyA4XDI7e0tFqDrOuLTe58shACAqmKMAcA5B4AxBmst3nsARISmaWjbFlVFRMiyjKIo0OhcRIgQkRffcaw/JyIpiDzPU6bRuq5LwetrZ9tEUqJPEge3DQX+kmbrJF9NAKDGmBdF7aNf3E8TqKLW2uT8K2qiqmhd16lrtw0RwXuPhhC+LJMQwoYkNk1sos84ei84VSXLsk1NPlocM1XVTWSqhBBSV7/3X5z7cAtHXWMgkUBE0hkVCd/Df/VJPBxjNjHCfznuB2k/XAX069Y0DYPB4AVJ/5R+C4mkX5P+e5TDOUfrW3Z2Co6Pj/n58xcqQrGzucy892/uUhHBvtb3tTm3ZrH4zWq1RBUCHoLh4WEOBEajbxRFQdu2ScZo0a+tqgrnHKvVKt1oAHd3dzw+PnJ9/YP5fE7T1EBHFzyC4H1AjSII0+l3RqMReZ7TdR3OuXSLLhYL5OjoKMTdk2UZWZZhjEmL1+t1yjIfZIhA2zbUdYMxBhWTZFE15Hme+sNaS13X/AFKG2atU2M+TwAAAABJRU5ErkJggg=="
};

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
  const startStopBtn = document.getElementById("playPauseButton");
  if (startStopBtn) {
    if (isPlaying) startStopBtn.classList.add("active");
    else startStopBtn.classList.remove("active");
  }
}

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  window.playlist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.audioLink;
    audio.volume = currentVolume / 9;
    audio.play()
      .then(() => updatePlayPauseIcon(true))
      .catch(e => {
        console.log("Autoplay blocked or waiting for interaction", e);
        updatePlayPauseIcon(false);
      });
  }
}
window.changePlaylist = changePlaylist;

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  const player = document.getElementById("player");

  if (!player || !currentSong) return;

  const cover = player.querySelector("#cover");
  const title = player.querySelector("#title");
  const artist = player.querySelector("#artist");

  if (cover) cover.src = currentSong.getCoverLink();
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();
}
window.updateUI = updateUI;

function formatTime(secs) {
  if (isNaN(secs)) return "0:00";
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
    ["Dear Boy", "Paul McCartney", "https://i.imgur.com/cMRraQk.png", "https://audio.jukehost.co.uk/ZZVLpos0tLqOCSi0CSKFdlSoAbfbfRZl"],
    ["Uncle Albert/Admiral Halsey", "Paul McCartney", "https://i.imgur.com/cMRraQk.png", "https://audio.jukehost.co.uk/bKLFsbsVrlir9M2QXxm27CMzdW85113U"],
    ["I'm Still in Love with You", "Al Green", "https://i.imgur.com/Pw9Jidu.png", "https://audio.jukehost.co.uk/Be83hVY5wR1x2xcjVLaxHguuZ2Quyy0A"],
    ["My Whole World Ended", "David Ruffin", "https://i.imgur.com/qVVtZuR.png", "https://audio.jukehost.co.uk/GLV4WY4TywEf4sA1n4nOdVk9zqTaWkjO"],
    ["Nights In White Satin", "The Moody Blues", "https://i.imgur.com/0FbXJ7e.png", "https://audio.jukehost.co.uk/UP4ZQQVhMJXrRIJEkIdoCDOAKGAPdYsB"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player {
      position: relative;
      border: 3px solid #222;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 975px;
      height: 191px;
      background-image: url("${ASSETS.bg}");
      background-size: cover;
      font-family: Arial, "Helvetica Neue", sans-serif;
      box-sizing: border-box;
      margin: 10px auto;
      overflow: hidden;
      user-select: none;
    }

    /* Left Cover Art */
    #cover-wrapper {
      position: absolute;
      left: 10px;
      top: 2px;
      width: 180px;
      height: 180px;
      z-index: 2;
    }

    #cover {
      width: 180px;
      height: 180px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 2px 0 8px rgba(0,0,0,0.6);
      object-fit: cover;
    }

    /* Vanilla Start / Stop Button */
    #start-stop-container {
      position: absolute;
      left: 282px;
      top: 25px;
      z-index: 5;
    }

    #playPauseButton {
      width: 110px;
      height: 55px;
      background: linear-gradient(180deg, #ffffff 0%, #f2f2f2 60%, #d8d8d8 100%);
      border: 3px solid #222222;
	  outline: 2px solid #505050;
      border-radius: 2px;
      color: #111111;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: inset 0 1px 0 #ffffff, 0 2px 4px rgba(0,0,0,0.5);
      letter-spacing: 0.5px;
      transition: all 0.08s ease;
    }

    #playPauseButton:hover {
      background: linear-gradient(180deg, #ffffff 0%, #ffffff 60%, #e0e0e0 100%);
    }

    #playPauseButton:active, #playPauseButton.active {
      background: linear-gradient(180deg, #d0d0d0 0%, #c0c0c0 100%);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
      transform: translateY(1px);
    }

    #transport-buttons {
      position: absolute;
      left: 285px;
      top: 136px;
      display: flex;
      gap: 10px;
      z-index: 5;
    }

    .technics-btn {
      background: linear-gradient(180deg, #f0f0f0 0%, #d0d0d0 50%, #999999 100%);
      border: 1px solid #444;
	  outline: 1px solid #505050;
      border-radius: 3px;
      color: #111;
      font-size: 11px;
      font-weight: bold;
      padding: 6px 14px;
      cursor: pointer;
      box-shadow: inset 0 1px 0 #fff, 0 2px 4px rgba(0,0,0,0.4);
      transition: all 0.1s;
      letter-spacing: 0.5px;
    }

    .technics-btn:hover {
      background: linear-gradient(180deg, #ffffff 0%, #e0e0e0 50%, #aaaaaa 100%);
    }

    .technics-btn:active {
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.6);
      transform: translateY(1px);
    }

    #center-column {
      position: absolute;
      left: 425px;
      top: 20px;
      width: 440px;
      display: flex;
      flex-direction: column;
      z-index: 10;
    }

    #song-info {
      color: #ffffff;
      margin-bottom: 12px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    }

    #title {
      font-size: 18px;
      font-weight: bold;
      color: #f0f0f0;
      letter-spacing: 0.5px;
    }

    #artist {
      font-size: 14px;
      color: #ccc;
      margin-top: 4px;
    }

    /* Progress Bar */
    #progress-bar-container {
      position: relative;
      width: 100%;
      height: 16px;
      background: #181818;
      border: 1px solid #555;
      border-radius: 2px;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.8);
      cursor: pointer;
      margin-top: 8px;
      overflow: hidden;
      z-index: 10;
    }

    #progress {
      height: 100%;
      width: 0%;
      background: linear-gradient(180deg, #ffffff 0%, #cccccc 50%, #999999 100%);
      box-shadow: 0 0 6px rgba(255,255,255,0.6);
    }

    #time-display {
      display: flex;
      justify-content: space-between;
      color: #bbb;
      font-size: 12px;
      font-family: monospace;
      margin-top: 6px;
    }

    #volume-container {
      position: absolute;
      right: 42px;
      top: 10px;
      width: 30px;
      height: 170px;
      z-index: 5;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #volumeSlider {
      writing-mode: vertical-lr;
      direction: rtl;
      width: 25px;
      height: 165px;
      background: transparent;
      cursor: pointer;
      margin: 0;
      padding: 0;
    }

    #volumeSlider:focus { outline: none; }

    #volumeSlider::-webkit-slider-runnable-track {
      width: 3px;
      height: 100%;
      background: transparent;
    }

    #volumeSlider::-moz-range-track {
      width: 3px;
      height: 100%;
      background: transparent;
    }

    #volumeSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 25px;
      height: 21px;
      background-image: url("${ASSETS.volThumb}");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      border: none;
      cursor: pointer;
    }

    #volumeSlider::-moz-range-thumb {
      width: 25px;
      height: 21px;
      background-image: url("${ASSETS.volThumb}");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      border: none;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <div id="cover-wrapper">
      <img id="cover" alt="Album cover">
    </div>

    <div id="start-stop-container">
      <div id="playPauseButton" title="Start / Stop">start • stop</div>
    </div>

    <div id="transport-buttons">
      <button id="prevButton" class="technics-btn">◄ previous</button>
      <button id="nextButton" class="technics-btn">next ►</button>
    </div>

    <div id="center-column">
      <div id="song-info">
        <div id="title"></div>
        <div id="artist"></div>
      </div>

      <div id="progress-bar-container">
        <div id="progress"></div>
      </div>

      <div id="time-display">
        <span id="current-time">0:00</span>
        <span id="duration-display">0:00</span>
      </div>
    </div>

    <div id="volume-container">
      <div class="is-vertical">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="${currentVolume}">
      </div>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.audioLink;
  audio.volume = currentVolume / 9;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBarContainer = document.getElementById("progress-bar-container");
  const progressBar = document.getElementById("progress");
  const currentTimeDisplay = document.getElementById("current-time");
  const durationDisplay = document.getElementById("duration-display");
  const volumeSlider = document.getElementById("volumeSlider");

  // play/pause
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play()
        .then(() => updatePlayPauseIcon(true))
        .catch(e => console.log("Play error:", e));
    } else {
      audio.pause();
      updatePlayPauseIcon(false);
    }
  });

  // next/prev
  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    audio.src = activePlaylist.getCurrentSong().audioLink;
    audio.volume = currentVolume / 9;
    audio.play()
      .then(() => updatePlayPauseIcon(true))
      .catch(e => updatePlayPauseIcon(false));
  };

  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playSongAtIndex();
  });

  // progress bar
  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = percent + "%";
      if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(audio.currentTime);
      if (durationDisplay) durationDisplay.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    if (durationDisplay && Number.isFinite(audio.duration)) {
      durationDisplay.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  // click scrub progress
  progressBarContainer.addEventListener("click", (e) => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const rect = progressBarContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = clickX / rect.width;
      audio.currentTime = percent * audio.duration;
    }
  });

  // volume slider
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    audio.volume = currentVolume / 9;
  });

  // initial setup & play
  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

setupMusicPlayer();