// This is a modified version of the music player
// used in the mod American Carnage.
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
  bg: "https://i.imgur.com/Ok791w6.png",
  infoBg: "https://i.imgur.com/BB1ejv6.png",
  btnPrev: "https://i.imgur.com/imIqTEA.png",
  btnPlay: "https://i.imgur.com/ttdoyfG.png",
  btnPause: "https://i.imgur.com/oQbfTxw.png",
  btnNext: "https://i.imgur.com/7TtaN04.png",
  volIcon: "https://i.imgur.com/0BJYsXt.png"
};

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  // ensure audio exists before trying to access it
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
    ["Little Dark Age", "MGMT", "https://i.imgur.com/d2ctDiz.png", "https://audio.jukehost.co.uk/LQF5RB2PrVcCeObaqQafC2FTwkysnWdT"],
    ["Arrest the President", "Ice Cube", "https://i.imgur.com/BBOMLln.png", "https://audio.jukehost.co.uk/c2cWOAnjSfzh2YI3OhW923cClDn3Iqic"],
    ["This is America", "Childish Gambino", "https://i.imgur.com/cBtRj9K.png", "https://audio.jukehost.co.uk/ZaGEkUEbz72UP4IMnC01mwSxwqX4gen6"],
    ["Troubled Times", "Green Day", "https://i.imgur.com/unNGqOH.png", "https://audio.jukehost.co.uk/CeVuU7lokNQcuzCWWR2cJ6I6qJuSffzT"],
    ["Is This the Life We Really Want", "Roger Waters", "https://i.imgur.com/3NCgTGN.png", "https://audio.jukehost.co.uk/ng58tjZYGQSrNKrGgmH5pFp4wobiaUPe"],
    ["The Kids are Alt-Right", "Bad Religion", "https://i.imgur.com/KzlAiiO.png", "https://audio.jukehost.co.uk/f9HDWEKzRO8NtI5ePOLgh0Nn6pz4nXmQ"],
    ["Vigilante Man", "Glen Hansard", "https://i.imgur.com/SvUzGQH.png", "https://audio.jukehost.co.uk/MasC7udHqmabHGNLCJdlD9sSHIx9gpnV"],
    ["Real American", "Rick Derringer", "https://i.imgur.com/CalYXXW.png", "https://audio.jukehost.co.uk/5aZ2PQqoNvJN2kPuLCaOoGSHmkmI95lk"],
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player {
      border: 3px solid rgba(246, 67, 67, 0.5);
      display: flex;
      flex-direction: row;
      height: 191px;
      background-image: url("${ASSETS.bg}");
      font-family: sans-serif;
	  padding: 0 .5em;
    }
    #display-box { display: flex; align-items: center; width: 50%; }
    #cover { width: 176px; height: 176px; object-fit: cover; }
    #info-container {
      display: flex;
      height: 178px; width: 127px; margin-top: 3px;
      background-image: url("${ASSETS.infoBg}");
      background-size: cover; color: white;
    }
    #song-info { width: 100%; padding: 5px; box-sizing: border-box; }
    #artist { margin: 0; font-size: 12px; opacity: 0.9; }
    #controls-container {
      display: flex; flex-direction: column; align-items: center;
      margin: 10px; width: 100%; padding-top: 15px;
    }
    #controls { display: flex; flex-direction: row; justify-content: center; gap: 10px; cursor: pointer; }
    #controls img { transition: transform 0.1s; }
    #controls img:active { transform: scale(0.95); }
    #progress-bar-container { width: 100%; margin-top: 15px; text-align: center; }
    #progress-bar { width: 80%; cursor: pointer; }
    #volume-container { display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: -1em; }
    .vol-wrapper { position: relative; height: 126px; margin-top: 5px; }
    #volumeSlider {
      width: 8px; height: 100%;
	  writing-mode: vertical-lr;
	  direction: rtl;
    }
    #volume-display { font-weight: bold; display: none; }
  `;
  document.head.appendChild(style);

  // create HTML
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
        <img id="playPauseButton" src="${ASSETS.btnPlay}" alt="Play/Pause">
        <img id="nextButton" src="${ASSETS.btnNext}" alt="Next">
      </div>
      <div id="progress-bar-container">
        <input type="range" id="progress-bar" value="0" max="100" step="0.1">
      </div>
    </div>
    <div id="volume-container">
      <img src="${ASSETS.volIcon}" alt="Volume">
      <div class="vol-wrapper">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="1" orient="vertical">
      </div>
      <span id="volume-display">1</span>
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
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volumeSlider");
  const volDisplay = document.getElementById("volume-display");

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
  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    audio.src = activePlaylist.getCurrentSong().audioLink;
    audio.play();
    updatePlayPauseIcon(true);
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
    if (Number.isFinite(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
  });

  // volume
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    volDisplay.textContent = currentVolume;
    audio.volume = currentVolume / 9;
  });

  // initial play
  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}
setupMusicPlayer();
