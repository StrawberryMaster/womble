// This is a modified version of the music player
// used in the mod Y. of Korea.
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

let activePlaylist = new Playlist();
let audioInstance = null;
let currentVolume = 1;

// assets
const ASSETS = {
  bg: "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/2025%20Korea/soundback.png",
  infoBg: "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./transparent.png",
  btnPrev: "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/2025%20Korea/backward.png",
  btnPlay: "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/2025%20Korea/play.png",
  btnPause: "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/2025%20Korea/pause.png",
  btnNext: "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/2025%20Korea/forward.png",
  volIcon: "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/2025%20Korea/volume.png"
};

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.audioLink;
    audio.play()
      .then(() => updatePlayPauseIcon(true))
      .catch(e => console.log("Autoplay action deferred or blocked until user interaction", e));
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
  if (btn) {
    btn.src = isPlaying ? ASSETS.btnPause : ASSETS.btnPlay;
  }
}

function updateProgressBarFill(progressBar, percent) {
  if (progressBar) {
    progressBar.style.background = `linear-gradient(to right, #00CD3B ${percent}%, #E3E3E3 ${percent}%)`;
  }
}

// setup
function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) {
    console.warn("game_window element not found. Player will not be attached.");
    return;
  }

  if (document.getElementById("player")) return;

  if (activePlaylist.songs.length === 0) {
    const defaultSongs = [
      new Song("Turn on the radio loudly", "Sinawe", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track1.png", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track1.mp3"),
      new Song("Why Earth spin", "Sanullim", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track2.png", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track2.mp3"),
      new Song("Dynamite Girl", "Inhee", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track4.png", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track4.mp3"),
      new Song("Train to the world", "Deulgukhwa", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track5.png", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track5.mp3"),
      new Song("Heeya", "Boohwal", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track3.png", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track3.mp3"),
      new Song("Delight", "Jung Soo-ra", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track6.png", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track6.mp3"),
      new Song("Hand in Hand", "Koreana", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track7.png", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track7.mp3"),
      new Song("Beautiful Rivers and Mountains", "Lee Sun-hee", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track9.png", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track9.mp3"),
      new Song("Wake Up", "Kim Soo-chul", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track8.png", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track8.mp3"),
      new Song("Uhuya Doongi Doongi", "Lee Moon-sae", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track10.png", "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./track10.mp3")
    ];
    defaultSongs.forEach(song => activePlaylist.addSong(song));
  }

  const style = document.createElement("style");
  style.textContent = `
    #player {
      border: 3px solid #00CD3B;
      display: flex;
      flex-direction: row;
      height: 60px;
      background-image: url("${ASSETS.bg}");
    }
    #display-box {
      display: flex;
      align-items: center;
      width: 50%;
    }
    #cover {
      width: 60px;
      height: 60px;
    }
    #info-container {
      display: flex;
      flex-direction: row;
      width: 240px;
      margin-top: 3px;
      background-image: url("${ASSETS.infoBg}");
      background-size: cover;
      color: #00CD3B;
    }
    #song-info {
      width: 100%;
      padding: 5px;
    }
    #song-info h3 {
      font-weight: bold;
      margin: 0;
    }
    #song-info p {
      margin: 0;
    }
    #controls-container {
      display: flex;
      flex-direction: row;
      align-items: left;
      margin: 5px;
      width: 100%;
    }
    #controls {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      width: 80%;
    }
    #controls img {
      cursor: pointer;
      user-select: none;
    }
    #progress-bar-container {
      width: 300%;
    }
    #progress-bar {
      -webkit-appearance: none;
      appearance: none;
      width: 80%;
      height: 5px;
      border-radius: 3px;
      background: #E3E3E3;
      background-image: linear-gradient(to right, #00CD3B 0%, #E3E3E3 0%);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      cursor: pointer;
      margin: auto;
      margin-top: 23px;
      display: flex;
    }
    #progress-bar::-webkit-slider-runnable-track {
      height: 5px;
      background: transparent;
      border-radius: 3px;
    }
    #progress-bar::-moz-range-track {
      height: 5px;
      background: transparent;
      border-radius: 3px;
    }
    #progress-bar::-moz-range-progress {
      background-color: #00CD3B;
      height: 5px;
      border-radius: 3px;
    }
    #progress-bar::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 11px;
      height: 11px;
      background: #121212;
      border: 2px solid #00CD3B;
      border-radius: 50%;
      margin-top: -3px;
    }
    #progress-bar::-moz-range-thumb {
      width: 11px;
      height: 11px;
      background: #121212;
      border: 2px solid #00CD3B;
      border-radius: 50%;
    }
    #volume-container {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      margin: 5px;
      margin-top: 10px;
      width: 50%;
    }
    #volume-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 150px;
      height: 5px;
      margin-top: 19px;
      background-color: #E3E3E3;
      border: 0px solid buttonborder;
      border-radius: 3px;
      display: flex;
      padding: 0;
      box-sizing: border-box;
      cursor: pointer;
    }
    #volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 13px;
      height: 13px;
      background: buttonface;
      background-color: #121212;
      border: 2px solid #00CD3B;
      border-radius: 25%;
      cursor: pointer;
      box-sizing: border-box;
      margin-top: -2px;
    }
    #volume-slider::-moz-range-thumb {
      width: 13px;
      height: 13px;
      background: buttonface;
      background-color: #121212;
      border: 2px solid #00CD3B;
      border-radius: 25%;
      cursor: pointer;
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(style);

  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <div id="display-box">
      <img id="cover" src="">
      <div id="info-container">
        <div id="song-info">
          <h3 id="title"></h3>
          <p id="artist"></p>
        </div>
      </div>
    </div>
    <div id="controls-container">
      <div id="controls">
        <img id="prevButton" src="${ASSETS.btnPrev}" alt="Previous">
        <img id="playPauseButton" src="${ASSETS.btnPause}" alt="Play/Pause">
        <img id="nextButton" src="${ASSETS.btnNext}" alt="Next">
      </div>
      <div id="progress-bar-container">
        <input type="range" id="progress-bar" value="0" max="100" step="0.1">
      </div>
    </div>
    <div id="volume-container">
      <img src="${ASSETS.volIcon}" alt="Volume">
      <div class="is-horizontal" style="margin-left: 1%; height: 126px;">
        <input id="volume-slider" type="range" min="0" max="9" step="1" value="1">
      </div>
      <span id="volume-display" style="font-weight: bold; display: none;">1</span>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.audioLink;
  audio.volume = currentVolume / 9;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volume-slider");
  const volDisplay = document.getElementById("volume-display");

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play()
        .then(() => updatePlayPauseIcon(true))
        .catch(err => console.log("Playback interaction error", err));
    } else {
      audio.pause();
      updatePlayPauseIcon(false);
    }
  });

  const playActiveTrack = () => {
    updateUI(activePlaylist);
    audio.src = activePlaylist.getCurrentSong().audioLink;
    updateProgressBarFill(progressBar, 0);
    audio.play()
      .then(() => updatePlayPauseIcon(true))
      .catch(err => console.log("Playback action deferred", err));
  };

  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playActiveTrack();
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playActiveTrack();
  });

  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
      updateProgressBarFill(progressBar, progress);
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playActiveTrack();
  });

  progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const seekTime = (progressBar.value / 100) * audio.duration;
      audio.currentTime = seekTime;
      updateProgressBarFill(progressBar, progressBar.value);
    }
  });

  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    volDisplay.textContent = currentVolume;
    audio.volume = currentVolume / 9;
  });

  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

setupMusicPlayer();