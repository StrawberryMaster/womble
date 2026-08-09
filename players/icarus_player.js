// This is a modified version of the music player
// used in the mod Icarus.
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

  addSong(song) { 
    this.songs.push(song); 
  }

  getCurrentSong() { 
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
let currentVolume = 50;

const ASSETS = {
  btnPrev: "https://i.imgur.com/a2skFGw.png",
  btnPlay: "https://i.imgur.com/fCa72EP.png",
  btnPause: "https://i.imgur.com/1qhhG4D.png",
  btnNext: "https://i.imgur.com/DZ7Igxr.png"
};

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.getAudioLink();
    audio.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
    updatePlayPauseIcon(true);
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
  if (!btn) return;

  if (isPlaying) {
    btn.innerHTML = `<img src="${ASSETS.btnPause}" alt="Pause">`;
    btn.classList.add("vista-pause-btn");
    btn.classList.remove("vista-play-btn");
  } else {
    btn.innerHTML = `<img src="${ASSETS.btnPlay}" alt="Play">`;
    btn.classList.add("vista-play-btn");
    btn.classList.remove("vista-pause-btn");
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) {
    console.warn("game_window element not found. Player will not be attached.");
    return;
  }

  if (document.getElementById("player")) return;

  const defaultSongs = [
    ["Resistance", "Muse", "https://i.imgur.com/R1eqBUo.gif", "https://audio.jukehost.co.uk/6tAoejj3zTSwW7GF0dEMY0KUbaclWWIY"],
    ["Take Me Out", "Franz Ferdinand", "https://i.imgur.com/8KKKzar.gif", "https://audio.jukehost.co.uk/rSx6VDEzc1B9Ax4H3Xw4xzKKs4T5zt9B"],
    ["Mr. Brightside", "The Killers", "https://i.imgur.com/kIOK2FE.gif", "https://audio.jukehost.co.uk/rD8tW884kzcHZejcr1tfIK2OgemXbuTF"],
    ["Hot N Cold", "Katy Perry", "https://i.imgur.com/SzCK0uX.gif", "https://audio.jukehost.co.uk/cAUldU7GY3YpJD7Slp8Da49voPk6xKFm"],
    ["Vertigo", "U2", "https://i.imgur.com/C3Lzdfv.gif", "https://audio.jukehost.co.uk/MZZfCLu3oBkAjJGyzHac3Hi6MNVmyoW2"],
    ["Thunder In My Heart", "Meck feat. Leo Slayer", "https://i.imgur.com/WVh9fD3.gif", "https://audio.jukehost.co.uk/CyrL8gEJ965fVCZY8rimZrNslJesE61O"],
    ["In The End", "Linkin Park", "https://i.imgur.com/afW8i15.gif", "https://audio.jukehost.co.uk/EnAFf8JaF1hEzTLyAmBWRPlxi2H8BkSr"],
    ["On Melancholy Hill", "Gorillaz", "https://i.imgur.com/TDAl9HT.gif", "https://audio.jukehost.co.uk/SMMYL9tzVfimUbQAgWeym87kEFE4qziw"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  const style = document.createElement("style");
  style.textContent = `
    .vista-player {
        width: 960px;
        height: 250px;
        position: relative;
        background: linear-gradient(to bottom, #e2e8f5 0%, #b8c7e0 100%) !important;
        border: 1px solid #a5acb5;
        border-radius: 6px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3) !important;
        overflow: hidden;
        font-family: "Segoe UI", Arial, sans-serif;
        display: flex;
        flex-direction: column;
        margin: 10px auto;
    }

    .vista-title-bar {
        background: linear-gradient(to bottom, #4b6bc6 0%, #3a56a0 100%) !important;
        color: white;
        padding: 6px 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        font-weight: bold;
        border-bottom: 1px solid #2c3f7a;
        user-select: none;
    }

    .vista-title-text {
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3);
    }

    .vista-title-controls span {
        margin-left: 8px;
        cursor: pointer;
        font-size: 14px;
        opacity: 0.8;
    }

    .vista-title-controls span:hover {
        opacity: 1;
    }

    .vista-main-content {
        display: flex;
        flex: 1;
        padding: 10px;
    }

    .vista-display-box {
        flex: 1;
        display: flex;
        padding: 10px;
        position: relative;
    }

    .vista-cover {
        width: 180px;
        height: 180px;
        border: 1px solid #a5acb5;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        object-fit: cover;
    }

    .vista-now-playing {
        background: linear-gradient(to bottom, #4b6bc6 0%, #3a56a0 100%);
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        font-weight: bold;
        border-radius: 3px 3px 0 0;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3);
        display: inline-block;
        margin-bottom: -1px;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .vista-info-container {
        position: absolute;
        left: 210px;
        bottom: 20px;
        width: 220px;
    }

    .vista-song-info {
        background: rgba(255, 255, 255, 0.7) !important;
        padding: 10px;
        border-radius: 4px;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        height: 60px;
    }

    .vista-title {
        margin: 0 0 5px 0;
        font-size: 16px;
        color: #2a3f8f;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .vista-artist {
        margin: 0;
        font-size: 14px;
        color: #555;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .vista-controls-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 10px;
        position: relative;
    }

    .vista-progress-container {
        margin-bottom: 15px;
    }

    .vista-progress-track {
        height: 4px;
        background: #c5cdd9;
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        margin-bottom: 5px;
    }

    .vista-progress-fill {
        height: 100%;
        background: linear-gradient(to right, #4b6bc6 0%, #7a9ae2 100%) !important;
        border-radius: 2px;
        width: 0%;
        transition: width 0.1s linear;
    }

    .vista-time-display {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: #555;
    }

    .vista-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px; 
        position: relative;
        padding-bottom: 10px;
    }

    .vista-control-btn {
        background: transparent !important;
        border: none !important;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: none !important;
        padding: 0;
        transition: transform 0.1s ease;
    }

    .vista-control-btn:hover {
        transform: scale(1.05);
    }

    .vista-control-btn:active {
        transform: scale(0.95);
    }

    .vista-prev-btn, .vista-next-btn {
        width: 50px;
        height: 50px;
    }

    .vista-prev-btn img, .vista-next-btn img {
        width: auto !important;
        height: 100% !important;
        max-width: 50px;
        max-height: 50px;
        object-fit: contain;
        filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.3));
    }

    .vista-play-btn, .vista-pause-btn {
        width: 65px;
        height: 65px;
    }

    .vista-play-btn img, .vista-pause-btn img {
        width: auto !important;
        height: 100% !important;
        max-width: 65px;
        max-height: 65px;
        object-fit: contain;
        filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.3));
    }

    .vista-volume-container {
        position: absolute;
        right: 20px;
        bottom: 20px;
        width: 140px;
        height: 50px;
        background: rgba(255, 255, 255, 0.7);
        padding: 8px 10px;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }

    .vista-volume-control {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        gap: 6px;
    }

    .vista-volume-slider {
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 100%;
        height: 6px;
        margin: 0;
        background: linear-gradient(to right, #4b6bc6 0%, #4b6bc6 var(--volume-level, 50%), #c5cdd9 var(--volume-level, 50%), #c5cdd9 100%);
        border-radius: 3px;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    .vista-volume-icons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 2px;
    }

    .vista-volume-icon {
        width: 16px;
        height: 16px;
        color: #4b6bc6;
        opacity: 0.8;
        flex-shrink: 0;
    }

    .vista-volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        background: #fff;
        border-radius: 50%;
        border: 1px solid #a5acb5;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.1s ease;
    }

    .vista-volume-slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        background: #fff;
        border-radius: 50%;
        border: 1px solid #a5acb5;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.1s ease;
    }

    .vista-player .vista-controls button::before,
    .vista-player .vista-controls button::after {
        content: none !important;
    }
    .vista-title-controls button, .vista-main-content button {
        min-width: auto;
    }
  `;
  document.head.appendChild(style);

  const playerContainer = document.createElement("div");
  playerContainer.className = "vista-player";
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <div class="vista-title-bar">
        <div class="vista-title-text">Windows Media Player</div>
        <div class="vista-title-controls">
            <button class="vista-minimize">
                <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg>
            </button>
            <button class="vista-maximize">
                <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor"/></svg>
            </button>
            <button class="vista-close">
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M0,0 L10,10 M10,0 L0,10" stroke="currentColor" stroke-width="1.5"/></svg>
            </button>
        </div>
    </div>
    <div class="vista-main-content">
        <div id="display-box" class="vista-display-box">
            <img id="cover" class="vista-cover" src="" alt="Album cover">
            <div id="info-container" class="vista-info-container">
                <div class="vista-now-playing">Now playing</div>
                <div id="song-info" class="vista-song-info">
                    <h3 id="title" class="vista-title"></h3>
                    <p id="artist" class="vista-artist"></p>
                </div>
            </div>
        </div>
        <div id="controls-container" class="vista-controls-container">
            <div class="vista-progress-container">
                <div class="vista-progress-bar">
                    <div class="vista-progress-track" role="slider" aria-valuemin="0" aria-valuemax="100" tabindex="0">
                        <div class="vista-progress-fill"></div>
                    </div>
                    <div class="vista-time-display">
                        <span class="vista-current-time">0:00</span>
                        <span class="vista-duration">0:00</span>
                    </div>
                </div>
            </div>
            <div id="controls" class="vista-controls">
                <button id="prevButton" class="vista-control-btn vista-prev-btn" aria-label="Previous track">
                    <img src="${ASSETS.btnPrev}" alt="Previous">
                </button>
                <button id="playPauseButton" class="vista-control-btn vista-play-btn" aria-label="Play/Pause">
                    <img src="${ASSETS.btnPlay}" alt="Play">
                </button>
                <button id="nextButton" class="vista-control-btn vista-next-btn" aria-label="Next track">
                    <img src="${ASSETS.btnNext}" alt="Next">
                </button>
            </div>
        </div>
    </div>
    <div id="volume-container" class="vista-volume-container">
        <div class="vista-volume-control">
            <input type="range" id="volumeSlider" min="0" max="100" value="50" class="vista-volume-slider" aria-label="Volume control">
            <div class="vista-volume-icons">
                <svg class="vista-volume-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
                <svg class="vista-volume-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
            </div>
        </div>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.getAudioLink();
  audio.volume = currentVolume / 100;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const volumeSlider = document.getElementById("volumeSlider");
  const progressTrack = playerContainer.querySelector(".vista-progress-track");

  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    const song = activePlaylist.getCurrentSong();
    if (song) {
      audio.src = song.getAudioLink();
      audio.play()
        .then(() => updatePlayPauseIcon(true))
        .catch(e => {
          console.log("Autoplay blocked:", e);
          updatePlayPauseIcon(false);
        });
    }
  };

  playPauseBtn?.addEventListener("click", () => {
    if (audio.paused) {
      audio.play()
        .then(() => updatePlayPauseIcon(true))
        .catch(e => {
          console.log("Playback prevented:", e);
          updatePlayPauseIcon(false);
        });
    } else {
      audio.pause();
      updatePlayPauseIcon(false);
    }
  });

  nextBtn?.addEventListener("click", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  prevBtn?.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playSongAtIndex();
  });

  volumeSlider?.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    audio.volume = currentVolume / 100;
    volumeSlider.style.setProperty('--volume-level', `${currentVolume}%`);
  });

  progressTrack?.addEventListener("click", (e) => {
    if (Number.isFinite(audio.duration)) {
      const rect = progressTrack.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pos * audio.duration;
    }
  });

  audio.addEventListener("timeupdate", () => {
    const progressFill = playerContainer.querySelector(".vista-progress-fill");
    const currentTimeDisplay = playerContainer.querySelector(".vista-current-time");
    const durationDisplay = playerContainer.querySelector(".vista-duration");

    if (progressFill && Number.isFinite(audio.duration)) {
      progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    }

    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
    if (durationDisplay && Number.isFinite(audio.duration)) {
      durationDisplay.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

setupMusicPlayer();