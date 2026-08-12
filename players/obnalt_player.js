// This is a modified version of the music player
// used in the mod 2012: Obamanation.
class Song {
  constructor(title, artist, genre, year, coverLink, audioLink) {
    this.title = title;
    this.artist = artist;
    this.genre = genre;
    this.year = year;
    this.coverLink = coverLink;
    this.audioLink = audioLink;
  }
  getTitle() { return this.title; }
  getArtist() { return this.artist; }
  getGenre() { return this.genre; }
  getYear() { return this.year; }
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
window.playlist = activePlaylist;
let audioInstance = null;
let currentVolume = 1;

// assets
const ASSETS = {
  bg: "https://i.imgur.com/l2YqtSl.png",
  btnPrev: "https://i.imgur.com/tbB2NMq.png",
  btnPlay: "https://i.imgur.com/gZME5QC.png",
  btnPause: "https://i.imgur.com/qLb9UqQ.png",
  btnNext: "https://i.imgur.com/e69GXWV.png",
  volIcon: "https://i.imgur.com/fvct8dN.png"
};

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
  const year = player.querySelector("#year");

  if (cover) cover.src = currentSong.getCoverLink();
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();
  if (genre) genre.textContent = currentSong.getGenre ? currentSong.getGenre() : "";
  if (year) year.textContent = currentSong.getYear ? currentSong.getYear() : "";
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
    [
      "I Fought The Law",
      "Green Day",
      "Punk",
      "2009",
      "https://i1.sndcdn.com/artworks-AAoxgfMrji0L-0-t500x500.jpg",
      "https://file.garden/Zrv1pPC1HzBK0svl/Green%20Day%20%20%20I%20Fought%20The%20Law%204.mp3"
    ],
    [
      "The Dark Of The Matinee",
      "Franz Ferdinand",
      "Rock",
      "2004",
      "https://upload.wikimedia.org/wikipedia/en/b/bf/Franzferdinand_matinee.jpg",
      "https://file.garden/Zrv1pPC1HzBK0svl/The%20Dark%20Of%20The%20Matin%C3%A9e%204.mp3"
    ],
    [
      "Fame < Infamy",
      "Fall Out Boy",
      "Punk",
      "2007",
      "https://m.media-amazon.com/images/I/71J+QkOmAKL._UF1000,1000_QL80_FMwebp_.jpg",
      "https://file.garden/Zrv1pPC1HzBK0svl/Fame%20%E1%90%B8%20Infamy.mp3"
    ],
    [
      "Karma Police",
      "Radiohead",
      "Alternative Rock",
      "1997",
      "https://files.catbox.moe/9vx49d.jpeg",
      "https://file.garden/Zrv1pPC1HzBK0svl/Karma%20Police%204.mp3"
    ],
    [
      "Time Is Running Out",
      "Muse",
      "Alternative Rock",
      "2003",
      "https://m.media-amazon.com/images/I/91olQTLED-L._UF1000,1000_QL80_FMwebp_.jpg",
      "https://file.garden/Zrv1pPC1HzBK0svl/Time%20is%20Running%20Out%204.mp3"
    ],
    [
      "Usual Suspects",
      "Rick Ross",
      "Hip-Hop",
      "2009",
      "https://upload.wikimedia.org/wikipedia/en/8/8d/Deeper_than_rap.jpeg",
      "https://file.garden/Zrv1pPC1HzBK0svl/Usual%20Suspects.mp3"
    ],
    [
      "Want You Gone",
      "Jonathan Coulton",
      "Soundtrack",
      "2011",
      "https://i.postimg.cc/Xv9NBF7X/P2songstotestbyv1cover.webp",
      "https://file.garden/Zrv1pPC1HzBK0svl/Want%20You%20Gone.mp3"
    ]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player {
      border: 3px solid #687daf;
      display: flex;
      flex-direction: row;
      height: 191px;
      background-image: url("${ASSETS.bg}");
	  background-size: cover;
      font-family: Segoe UI, sans-serif;
    }
    #display-box { display: flex; align-items: center; width: 50%; }
    #cover { width: 176px; height: 176px; margin: .2em; object-fit: cover; }
    #info-container {
      display: flex;
      flex-direction: row;
      height: 185px;
      width: 185px;
      margin-top: 3px;
      color: black;
    }
    #song-info { width: 100%; padding: 5px; box-sizing: border-box; }
    #title { font-weight: bold; margin: 5px 0; font-size: 15px; }
    #artist, #genre, #year { margin: 3px 0; font-size: 12px; }
	#artist { font-weight: 600; }

    #controls-container {
      display: flex; flex-direction: column; align-items: center;
      margin: 10px; width: 100%; padding-top: 15px;
    }
    #controls { display: flex; flex-direction: row; justify-content: center; width: 80%; gap: 5px; cursor: pointer; }
    #controls img { transition: transform 0.1s; }
    #controls img:active { transform: scale(0.95); }

    /* progress bar */
    #progress-bar-container {
      background: radial-gradient(circle at 0 50%, #0000001f 10px, transparent 30px),
                  radial-gradient(circle at 100% 50%, #0000001f 10px, transparent 30px),
                  linear-gradient(180deg, #f3f3f3af, #fcfcfcaf 3px, #dbdbdbaf 6px, #cacacaaf 0, #d5d5d5af),
                  #ddd;
      border: 1px solid #8e8f8f;
      border-radius: 3px;
      box-shadow: inset 0 0 0 1px #f3f3f388, 0 0 0 1px #eaeaea88;
      height: 15px;
      margin-top: 20px;
      overflow: hidden;
      width: 80%;
      cursor: pointer;
    }

    #progress {
      background-color: #2563eb;
      background-image: linear-gradient(180deg, #93c5fda2, #bfdbfea2 3px, #3b82fea2 6px, transparent 0),
                        radial-gradient(circle at 0 50%, #0000002f 10px, transparent 30px),
                        radial-gradient(circle at 100% 50%, #0000002f 10px, transparent 30px),
                        linear-gradient(180deg, transparent 65%, #ffffff55),
                        linear-gradient(180deg, transparent 6px, #1d4ed833 0, #1e40af33);
      box-shadow: inset 0 0 0 1px #ffffff1f;
      height: 100%;
      width: 0%;
      overflow: hidden;
    }

    #volume-container { display: flex; flex-direction: column; align-items: center; justify-content: center; }
    #volume-display { font-weight: bold; display: none; }

    :root {
      --w7-sdt-w: 10px;
      --w7-sdt-h: 18px;
      --w7-surface: #f0f0f0;
      --w7-sdt-icon: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC7SURBVHgBlZLBCYQwEEVj9CDYgRfbswF7sRAbsArPdhBICDmEzPoDE9CdXeKH0eHP48fINOrSPM+k/mhd16YDtCyLmqZJhM7zxIs6PAF570WQAzJIRLkksd89DUl939eB1Ym3b0wpiQBmIYSXiTFGZYwRgWEY6o8uIPQLZGlu2rYtP54L3g3c912N45gHSEahh4dZERZj2zZyztFxHLnQw/vaLIattbmeULkMdg6XxLFaa3WB7MlCirTIHxVUkxicbwSEAAAAAElFTkSuQmCC");
      --w7-sdt-icon-h: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAMAAABVab95AAAAWlBMVEUAAAAAjf8AVpo8f7G44/v5/f7l9P3g8/za8Pzp9v32+/7u+f695v2z4PmWvdjr9/1onMKu3vjQ4e2Zv9l+pcJLc5GTu9eMtNGCqseLrcVhlbt0l7BWfptOdpOMIi2BAAAAA3RSTlMADUenYG6gAAAAWklEQVQI113GRwKAIAwEwCBBRaUo9vL/b0qWG3MaaqKG2FBcDCw3aWPB6NwW6nYgHUoHaQ9VxwlGKUPVwC7joOlIgeeZQ3pJnd46Z/2miNTqbZl8918efj2yH/8dBY1fB+zGAAAAAElFTkSuQmCC");
      --w7-sdt-icon-a: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACsSURBVHgB3ZKxCoMwEIYvJWOn0r10LHTuVDp1KIU+RN+gT9FZ6AP0LYqDY+nQWXAScXMQdRYh+ouRqEF0cPGHHJfcl7sbfkaFroYlqEefx5lxQK/blu6rjRZ6R34RLcFxAWSkmRZEbUkeLWigZgVymZhuoid264lGjwMvTkhmtYsqvKEGMQQY43jYNwoy//7t0j31b8DPXyBOcVYe5Kr9mDpKdoY6ndoCrDNyDnRZRNbxQWFyAAAAAElFTkSuQmCC");
    }

    input[type=range] {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background: transparent;
      padding: 10px 1px;
      width: 100%;
    }
    input[type=range]:focus-visible { outline: 1px dotted #000; }

    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      background: var(--w7-sdt-icon);
      filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.125));
      height: var(--w7-sdt-h);
      transform: translateY(-7px);
      width: var(--w7-sdt-w);
    }
    input[type=range]::-webkit-slider-thumb:hover { background: var(--w7-sdt-icon-h); }
    input[type=range]::-webkit-slider-thumb:active { background: var(--w7-sdt-icon-a); }

    input[type=range]::-moz-range-thumb {
      background: var(--w7-sdt-icon);
      border: 0;
      border-radius: 0;
      filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.125));
      height: var(--w7-sdt-h);
      width: var(--w7-sdt-w);
    }
    input[type=range]::-moz-range-thumb:hover { background: var(--w7-sdt-icon-h); }
    input[type=range]::-moz-range-thumb:active { background: var(--w7-sdt-icon-a); }

    input[type=range]::-webkit-slider-runnable-track {
      background: var(--w7-surface);
      box-shadow: inset 1px 1px 1px #999, inset -1px 0 #999, 0 1px #fff;
      box-sizing: border-box;
      height: 3px;
      width: 100%;
    }
    input[type=range]::-moz-range-track {
      background: var(--w7-surface);
      box-shadow: inset 1px 1px 1px #999, inset -1px 0 #999, 0 1px #fff;
      box-sizing: border-box;
      height: 3px;
      width: 100%;
    }

    .is-vertical {
      display: inline-block;
      height: 126px;
	  margin: 0 1em 1em 0;
      transform: translateY(50%);
      width: 4px;
    }
    .is-vertical > input[type=range] {
      height: 4px;
      margin: 0 16px 0 10px;
      transform: rotate(270deg) translateX(calc(-50% + 8px));
      transform-origin: left;
      width: 125px;
    }
    .is-vertical > input[type=range]::-webkit-slider-thumb {
      transform: translateY(-8px) scaleX(-1);
    }
    .is-vertical > input[type=range]::-moz-range-thumb {
      transform: translateY(2px) scaleX(-1);
    }
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
          <p id="genre"></p>
          <p id="year"></p>
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
        <div id="progress"></div>
      </div>
    </div>
    <div id="volume-container">
      <img src="${ASSETS.volIcon}" alt="Volume">
      <div class="is-vertical">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="1">
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
  const progressBarContainer = document.getElementById("progress-bar-container");
  const progressBar = document.getElementById("progress");
  const volumeSlider = document.getElementById("volumeSlider");
  const volDisplay = document.getElementById("volume-display");

  volumeSlider.value = currentVolume;

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
    audio.volume = currentVolume / 9;
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
      progressBar.style.width = progress + "%";
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  // click to scrub progress
  progressBarContainer.addEventListener("click", (e) => {
    if (Number.isFinite(audio.duration)) {
      const rect = progressBarContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      if (width > 0) {
        audio.currentTime = (clickX / width) * audio.duration;
      }
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

const gameWindow_player = document.getElementById("game_window");
setupMusicPlayer();
