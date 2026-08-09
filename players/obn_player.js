// This is a modified version of the music player
// used in the Deluxe Update of 2012: Obamanation.
class Song {
  constructor(title, artist, genre, coverLink, audioLink) {
    this.title = title;
    this.artist = artist;
    this.genre = genre;
    this.coverLink = coverLink;
    this.audioLink = audioLink;
  }
  getTitle() { return this.title; }
  getArtist() { return this.artist; }
  getGenre() { return this.genre; }
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
let currentVolume = 2;

// assets
const ASSETS = {
  btnPrev: "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/tbB2NMq.png",
  btnPlay: "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/gZME5QC.png",
  btnPause: "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/qLb9UqQ.png",
  btnNext: "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/e69GXWV.png",
  volIcon: "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/fvct8dN.png"
};

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

  const cover = player.querySelector("#cover");
  const title = player.querySelector("#title");
  const artist = player.querySelector("#artist");
  const genre = player.querySelector("#genre");

  if (cover) cover.src = currentSong.getCoverLink();
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();
  if (genre) genre.textContent = currentSong.getGenre();
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
    ["Queen of Hearts", "Fucked Up", "Punk", "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/y1p4zEg.jpeg", "https://file.garden/ZjghkE74SkXuNmZh/Queen%20of%20Hearts.mp3"],
    ["Millennium of the Blind", "Megadeth", "Metal", "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/Six3bC3.jpeg", "https://file.garden/ZlwBsQzAvyz0wLEA/Millennium%20of%20The%20Blind.mp3"],
    ["Hussein", "Blue Scholars", "Hip-Hop", "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/jCzb20O.jpeg", "https://file.garden/ZjghkE74SkXuNmZh/Hussein.mp3"],
    ["Terrorist Threats", "Ab-Soul (ft. Danny Brown, Jhene Aiko)", "Rap", "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/Uarvapg.jpeg", "https://file.garden/ZkYlpFmp3wv99L22/Ab-Soul.mp3"],
    ["Headlines", "Drake", "Rap", "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/NNMiAp3.jpeg", "https://file.garden/aGMtX3HRbS8W-RJ6/Drake%20%20%20Headlines%20Explicit%20HD.mp3"],
    ["Words I Never Said", "Lupe Fiasco (ft. Skylar Grey)", "Rap", "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/fGT2dTk.jpeg", "https://file.garden/ZjwDHsS1nDDehStj/Words%20I%20Never%20Said.mp3"],
    ["Illuminati", "Korn (ft. Excision, Downlink)", "Metal", "https://file.garden/aNtAfG887DiA_7lO/Obamanation/Code1/I3RwsaS.jpeg", "https://file.garden/ZlwBsQzAvyz0wLEA/Illuminati.mp3"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  window.defaultPlaylist = activePlaylist;

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

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player {
      font-family: 'Segoe UI', sans-serif;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 15px;
      padding: 0 10px;
      height: 191px;
      background: linear-gradient(to bottom, #0e3583, #02143b);
      border-radius: 5px;
      border: 1px solid #4a6a9b;
      box-shadow: 0 0 10px rgba(74, 106, 155, 0.5);
      color: white;
      overflow: hidden;
    }

    #cover {
      width: 180px;
      height: 180px;
      border: 2px solid #fff;
      box-shadow: 5px 5px 10px rgba(0,0,0,0.4);
      flex-shrink: 0;
    }

    #rightPanel {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }

    #info-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-grow: 1;
      padding-left: 5px;
    }

    #song-info #title {
      font-size: 1.4em;
      font-weight: 600;
      margin: 0 0 5px 0;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #song-info #artist, #song-info #genre {
      font-size: 1em;
      margin: 0;
      color: #d0e0ff;
    }

    #controls-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.25);
      margin-top: .5em;
      padding: 8px;
      border-radius: 4px;
    }

    #bottom-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    #controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    #controls img {
      cursor: pointer;
      opacity: 0.9;
      transition: opacity 0.2s;
    }

    #prevButton, #nextButton {
      height: 36px;
    }

    #controls img:hover {
      opacity: 1;
    }

    #progress-bar-container {
      width: 100%;
      height: 6px;
      background-color: #001f5c;
      border-radius: 3px;
      cursor: pointer;
      margin-bottom: 8px;
    }

    #progress {
      height: 100%;
      width: 0%;
      background-color: #7db700;
      border-radius: 3px;
    }

    #volume-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    #volumeSlider {
      -webkit-appearance: none;
      appearance: none;
      width: 100px;
      height: 4px;
      outline: none;
      border-radius: 2px;
      opacity: 0.8;
      transition: opacity .2s;
      margin: 0 .25em 0 0;
    }

    #volumeSlider:hover {
      opacity: 1;
    }

    #volumeSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      background: #ffffff;
      cursor: pointer;
      border-radius: 50%;
      border: 1px solid #777;
      margin-top: 2px;
      position: relative;
      z-index: 2;
    }

    #volumeSlider::-moz-range-thumb {
      width: 14px;
      height: 14px;
      background: #ffffff;
      cursor: pointer;
      border-radius: 50%;
      border: 1px solid #777;
    }

    #volumeSlider::-moz-range-track {
      height: 4px;
      background: #ffffff;
      border-radius: 2px;
    }
  `;
  document.head.appendChild(style);

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <img id="cover" />
    <div id="rightPanel">
      <div id="info-container">
        <div id="song-info">
          <h3 id="title"></h3>
          <p id="artist"></p>
          <p id="genre"></p>
        </div>
      </div>
      <div id="controls-container">
        <div id="progress-bar-container">
          <div id="progress"></div>
        </div>
        <div id="bottom-controls">
          <div id="controls">
            <img id="prevButton" src="${ASSETS.btnPrev}" alt="Previous">
            <img id="playPauseButton" src="${ASSETS.btnPlay}" alt="Play/Pause">
            <img id="nextButton" src="${ASSETS.btnNext}" alt="Next">
          </div>
          <div id="volume-container">
            <img src="${ASSETS.volIcon}" alt="Volume">
            <input type="range" id="volumeSlider" min="0" max="9" step="1" value="2">
          </div>
        </div>
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
  const progressBar = document.getElementById("progress");
  const progressBarContainer = document.getElementById("progress-bar-container");
  const volumeSlider = document.getElementById("volumeSlider");

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

  // progress bar
  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = progress + "%";
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  // native progress click-to-seek functionality
  progressBarContainer.addEventListener("click", (e) => {
    if (Number.isFinite(audio.duration)) {
      const rect = progressBarContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = progressBarContainer.offsetWidth;
      const seekTime = (clickX / width) * audio.duration;
      audio.currentTime = seekTime;
    }
  });

  // volume
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    audio.volume = currentVolume / 9;
  });

  // initial play
  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

setupMusicPlayer();
