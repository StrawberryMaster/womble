// This is a modified version of the music player
// used in the mod Duke.
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

const ASSETS = {
  bg: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Solid_white.png",
  infoBg: "https://raw.githubusercontent.com/FlongydOlson/OlsonMods/refs/heads/main/Y./transparent.png",
  btnPrev: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Cpolygon points='13,4.5 4.5,12 13,19.5' stroke='black' stroke-width='2' stroke-linejoin='round'/%3E%3Crect x='16.5' y='4' width='3' height='16' rx='1.5'/%3E%3C/svg%3E",
  btnPlay: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Cpolygon points='6,4.5 18,12 6,19.5' stroke='black' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E",
  btnPause: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Crect x='6' y='4' width='3.5' height='16' rx='1.5'/%3E%3Crect x='14.5' y='4' width='3.5' height='16' rx='1.5'/%3E%3C/svg%3E",
  btnNext: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'%3E%3Crect x='4.5' y='4' width='3' height='16' rx='1.5'/%3E%3Cpolygon points='11,4.5 19.5,12 11,19.5' stroke='black' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E",
  volIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='miter'%3E%3Cpath d='M2 8h4l5-5v18l-5-5H2z' fill='white'/%3E%3Cline x1='6' y1='8' x2='6' y2='16'/%3E%3Cpath d='M14 7c2.5 2.5 2.5 7.5 0 10'/%3E%3Cpath d='M18 5c3.5 3.5 3.5 10.5 0 14'/%3E%3C/svg%3E"
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
  if (artist) {
    artist.textContent = currentSong.getArtist() + " | " + currentSong.getAlbum();
  }
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
  if (btn) {
    btn.src = isPlaying ? ASSETS.btnPause : ASSETS.btnPlay;
  }
}

function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) {
    console.warn("game_window element not found. Player will not be attached.");
    return;
  }

  if (document.getElementById("player")) return;

  if (activePlaylist.songs.length === 0) {
    const defaultSongs = [
      new Song("Batdance", "Prince", "Batman (1989)", "https://itsastronomical.com/assets/1992Duke/imgur/3ezTb83.png", "https://audio.jukehost.co.uk/SfWXRKTGLRTq0peoUB2jLxbHr2h77WlM"),
      new Song("World In My Eyes", "Depeche Mode", "Violator (1990)", "https://itsastronomical.com/assets/1992Duke/imgur/DJP8i6K.png", "https://audio.jukehost.co.uk/uFm1cFwYEqgz7ukQlkBBiPGisYck3GvD"),
      new Song("The Race", "Yello", "Flag (1988)", "https://itsastronomical.com/assets/1992Duke/imgur/HQObjJN.png", "https://audio.jukehost.co.uk/CRB1PAg8QRjc1epZbKh3ZmNhV1pFHFbK"),
      new Song("Rhythm Nation", "Janet Jackson", "Janet Jackson's Rhythm Nation 1814 (1989)", "https://itsastronomical.com/assets/1992Duke/imgur/St8tSn7.png", "https://audio.jukehost.co.uk/ZSzellopvIPe4MDGitJcqZUHt8PFB8Al"),
      new Song("The Swing of Things", "a-ha", "Scoundrel Days (1986)", "https://itsastronomical.com/assets/1992Duke/imgur/UAwVIBi.jpeg", "https://audio.jukehost.co.uk/DoqeGy7xZFodO5ekFZKNRstA6tEa90lY"),
      new Song("Vanishing Point", "New Order", "Technique (1989)", "https://itsastronomical.com/assets/1992Duke/imgur/YGuEytm.png", "https://audio.jukehost.co.uk/rI6KB1bqocQYIIq6EZSo8KDYBRl0syZE"),
      new Song("Domino Dancing", "Pet Shop Boys", "Introspective (1988)", "https://itsastronomical.com/assets/1992Duke/imgur/wd7PR38.png", "https://audio.jukehost.co.uk/yuxCzAnwwwZd3EXnnl5sbNr1VOCskPkM"),
      new Song("Waiting For Mary", "Pere Ubu", "Cloudland (1989)", "https://itsastronomical.com/assets/1992Duke/imgur/T9FWmSg.jpeg", "https://audio.jukehost.co.uk/Nedv5zbSvNbAwpQylhQ7Y4CRvD0bOOfp"),
      new Song("Friday I’m In Love", "The Cure", "Wish (1992)", "https://itsastronomical.com/assets/1992Duke/imgur/L9qiqZa.png", "https://audio.jukehost.co.uk/uwlpqxevjqTduUmGbcYzSM6Ek8Yjx6fE"),
      new Song("Fight the Power", "Public Enemy", "Fear of a Black Planet (1989)", "https://itsastronomical.com/assets/1992Duke/imgur/SXLSYyq.png", "https://audio.jukehost.co.uk/cGIv1UlOAy1UA2Rl953t0RtU7YUgi5Se")
    ];
    defaultSongs.forEach(song => activePlaylist.addSong(song));
  }

  const style = document.createElement("style");
  style.textContent = `
    #player {
      border: 3px solid #000000;
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
      height: auto;
      width: 380px;
      background-image: url("${ASSETS.infoBg}");
      background-size: cover;
      color: #000000;
    }
    #song-info {
      width: 100%;
      padding: 5px;
    }
    #song-info h3 {
      font-family: Geneva, Verdana, sans-serif;
      font-weight: bold;
      margin: 0;
    }
    #song-info p {
      font-family: Geneva, Verdana, sans-serif;
      font-size: 12px;
      margin: 1em 0 0;
    }
    #controls-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 5px;
      width: 100%;
    }
    #controls {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
    }
    #controls img {
      width: 28px;
      height: 28px;
      cursor: pointer;
      object-fit: contain;
      user-select: none;
    }
    #progress-bar-container {
      width: 200%;
    }
    #progress-bar {
      -webkit-appearance: none;
      appearance: none;
      width: 80%;
      height: 12px;
      background: transparent;
      cursor: pointer;
      margin: 20px;
    }
    #progress-bar::-webkit-slider-runnable-track {
      height: 4px;
      background: #000;
      border-radius: 999px;
    }
    #progress-bar::-moz-range-track {
      height: 4px;
      background: #000;
      border-radius: 999px;
    }
    #progress-bar::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      background: #fff;
      border: 2px solid #000;
      border-radius: 50%;
      margin-top: -4px;
    }
    #progress-bar::-moz-range-thumb {
      width: 12px;
      height: 12px;
      background: #fff;
      border: 2px solid #000;
      border-radius: 1%;
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
      margin-top: 18px;
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
      background-color: #ffffff;
      border: 2px solid #000000;
      border-radius: 25%;
      cursor: pointer;
      box-sizing: border-box;
      margin-top: -2px;
    }
    #volume-slider::-moz-range-thumb {
      width: 13px;
      height: 13px;
      background: buttonface;
      background-color: #ffffff;
      border: 2px solid #000000;
      border-radius: 25%;
      cursor: pointer;
      box-sizing: border-box;
    }
    #menu_container {
      background-color: transparent;
    }
    .footer {
      border-color: #ffffff;
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
      <img src="${ASSETS.volIcon}" alt="Volume" style="width: 10%; margin-top: 12px;">
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
    if (Number.isFinite(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playActiveTrack();
  });

  progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
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