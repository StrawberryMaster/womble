// This is a generic 90s-looking music player.
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
let currentVolume = 5;

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.getAudioLink();
    audio.play()
      .then(() => updatePlayPauseButton(true))
      .catch(e => console.log("Playback interaction pending", e));
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

function updatePlayPauseButton(isPlaying) {
  const btn = document.getElementById("playPauseButton");
  if (btn) {
    btn.textContent = isPlaying ? "Pause" : "Play";
  }
}

function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) {
    console.warn("game_window element not found. Player will not be attached.");
    return;
  }

  if (document.getElementById("player")) return;

  const defaultSongs = [
      ["Sabbath Bloody Sabbath", "The Cardigans", "https://files.catbox.moe/0gdec5.jpg", "https://files.catbox.moe/9oihg9.mp3"],
      ["Paid For Loving", "Love Jones", "https://fastly-s3.allmusic.com/release/mr0001505330/front/400/GAKLSQcqxWWEldpmhvQ3xN_M69_UI9rrJSVvWL2-yAg=.jpg", "https://files.catbox.moe/706lt0.mp3"],
      ["This Charming Man", "Death Cab for Cutie", "https://upload.wikimedia.org/wikipedia/en/a/ae/Death_Cab_for_Cutie_-_You_Can_Play_These_Songs_With_Chords.jpg", "https://files.catbox.moe/fuz6kt.mp3"],
      ["Heaven or Las Vegas", "Cocteau Twins", "https://e.snmc.io/i/300/w/ca39d13d49f3f9ea31f5815ee93444f3/11766199", "https://files.catbox.moe/xy3lyz.mp3"],
      ["Dog New Tricks", "Garbage", "https://upload.wikimedia.org/wikipedia/en/4/42/GarbageSTinternational.png", "https://files.catbox.moe/5zta22.mp3"],
      ["Last Goodbye", "Jeff Buckley", "https://upload.wikimedia.org/wikipedia/en/e/e4/Jeff_Buckley_grace.jpg", "https://files.catbox.moe/fpzydt.mp3"]
  ];
  if (activePlaylist.songs.length === 0) {
      defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --aol-gray: #d4d0c8;
      --aol-border: #808080;
      --aol-blue: #000080;
    }
    #player {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--aol-gray);
      border: 3px double var(--aol-border);
      height: 86px;
      margin-bottom: 6.5px;
      padding-right: 13px;
      font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;
      box-sizing: border-box;
    }
    #display-box {
      display: flex;
      align-items: center;
      padding-left: 13px;
      width: 50%;
    }
    #cover {
      width: 60px;
      height: 60px;
      border: 2px double var(--aol-border);
      margin-right: 13px;
      object-fit: cover;
    }
    #info-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    #title {
      font-size: 13px;
      margin: 0;
      font-weight: bold;
      color: #000;
    }
    #artist {
      font-size: 11px;
      margin: 2px 0 0 0;
      color: #333;
    }
    #controls-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 30%;
    }
    #controls {
      display: flex;
      gap: 8px;
      margin-bottom: 6.5px;
    }
    button.futuristic-btn {
      color: black !important;
      background-color: var(--aol-gray);
      border: 2px outset #fff;
      font-size: 11px;
      font-weight: bold;
      padding: 2px 8px;
      cursor: pointer;
      font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;
    }
    button.futuristic-btn:active {
      border: 2px inset #fff;
    }
    #progress-bar-container {
      width: 90%;
      margin-top: 4px;
    }
    #progress-bar {
      width: 100%;
      height: 8px;
      -webkit-appearance: none;
      background-color: #fff;
      border: 1px solid var(--aol-border);
    }
    #progress-bar::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 8px;
      height: 12px;
      background: var(--aol-blue);
      border: 1px solid #000;
      cursor: pointer;
    }
    #volume-container {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 20%;
      padding-right: 13px;
    }
    #volume-container span {
      font-size: 11px;
      margin-right: 5px;
      color: #000;
      font-weight: bold;
    }
    #volume-slider {
      -webkit-appearance: none;
      width: 90px;
      height: 5px;
      background-color: #fff;
      border: 1px solid var(--aol-border);
    }
    #volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 10px;
      height: 12px;
      background: var(--aol-blue);
      border: 1px solid #000;
      cursor: pointer;
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
        <button id="prevButton" class="futuristic-btn">Back</button>
        <button id="playPauseButton" class="futuristic-btn">Pause</button>
        <button id="nextButton" class="futuristic-btn">Next</button>
      </div>
      <div id="progress-bar-container">
        <input type="range" id="progress-bar" value="0" max="100" step="0.1">
      </div>
    </div>
    <div id="volume-container">
      <span>Vol</span>
      <input type="range" id="volume-slider" min="0" max="10" step="0.1" value="5">
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.getAudioLink();
  audio.volume = currentVolume / 10;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volume-slider");

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      updatePlayPauseButton(true);
    } else {
      audio.pause();
      updatePlayPauseButton(false);
    }
  });

  const loadAndPlayTrack = () => {
    updateUI(activePlaylist);
    audio.src = activePlaylist.getCurrentSong().getAudioLink();
    audio.play()
      .then(() => updatePlayPauseButton(true))
      .catch(() => updatePlayPauseButton(false));
  };

  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    loadAndPlayTrack();
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    loadAndPlayTrack();
  });

  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
    }
  });

  progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    loadAndPlayTrack();
  });

  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseFloat(e.target.value);
    audio.volume = currentVolume / 10;
  });

  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseButton(true))
    .catch(() => updatePlayPauseButton(false));
}

setupMusicPlayer();
