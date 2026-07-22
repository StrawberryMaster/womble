// This is a modified version of a music player
// made by Thatchmaster.
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
window.playlist = activePlaylist;
let audioInstance = null;
let currentVolume = 1;

// assets
const ASSETS = {
  bg: "https://i.ibb.co/Wx9NBmQ/qls0kd.png",
  infoBg: "https://i.ibb.co/s2csF3n/67repx.png",
  btnPrev: "https://i.ibb.co/NNZ77Jp/0ns58l.png",
  btnPlay: "https://i.ibb.co/JRBFbfb/3o92rh.png",
  btnPause: "https://i.ibb.co/8xqqpsz/9phz8w.png",
  btnNext: "https://i.ibb.co/k1Nrky1/vaacmd.png"
};

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  window.playlist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  // ensure audio exists before trying to access it
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
    [
      "Lights and Sounds",
      "Yellowcard",
      "https://i.discogs.com/ufiibW7nHyS4vtC1dKaAKHjYtRB0abTCma0uHQfRCtk/rs:fit/g:sm/q:90/h:588/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIwMDE2/NTgtMTU5MTQzOTYx/MS03MDUyLmpwZWc.jpeg",
      "https://audio.jukehost.co.uk/8lH4ShUfOh6ydN0KywHJLVLgPdQlS97g"
    ],
    [
      "Requiem in D Minor, K. 626 VIII. Lacrimosa",
      "Wolfgang Amadeus Mozart",
      "https://i.ibb.co/dJkz682/image.png",
      "https://audio.jukehost.co.uk/l0S7LJQqyx2xhw3Bb4Vid8azEAGZDEpP"
    ],
    [
      "The Thieving Magpie (Abridged)",
      "Gioachino Rossini / A Clockwork Orange",
      "https://i.discogs.com/Z8PL_SLklUZIxInGuvDxzLM-fx8JYgXAZjBJUu63ROE/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM3MDAx/NS0xMzA4MTcyOTMz/LmpwZWc.jpeg",
      "https://audio.jukehost.co.uk/XUJShDXikBaorTSdZwNlPATFb52RNhr1"
    ],
    [
      "I Walk The Line",
      "Johnny Cash",
      "https://i.discogs.com/frAo_jFpvADbLkA1sIOGd1ZcwvqOxcZ8wnQwkP-QINo/rs:fit/g:sm/q:90/h:541/w:563/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTk0Mzg5/Ni0xMTc1NjgwNTE0/LmpwZWc.jpeg",
      "https://audio.jukehost.co.uk/SCDltsYbrsPSuduqNCpq5McZsxzNCN1p"
    ],
    [
      "Folsom Prison Blues",
      "Johnny Cash",
      "https://i.discogs.com/Mtv689BuDtno-LLtnI6B_rjP_gpmJMEaOF60YXi8hZI/rs:fit/g:sm/q:90/h:570/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEzNDA3/NDEtMTQ4NjY5NDY0/MC0zOTA4LmpwZWc.jpeg",
      "https://audio.jukehost.co.uk/4VZsE9f5mjDyJBkTqsozrlNOxQRZgNoV"
    ],
    [
      "1812 Overture",
      "Pyotr Ilyich Tchaikovsky",
      "https://i.discogs.com/0H3W7VhUlOtHQXaG7ZgRLBgwL3oh3HZArdiD8whHL2E/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMxODM0/MzQzLTE3MjczNjUz/OTAtMTI3MS5qcGVn.jpeg",
      "https://audio.jukehost.co.uk/MT5gEkIqdx0J1UGU2uKDjD473miHVDHg"
    ]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player {
      border: 3px solid #C9C9C9;
      display: flex;
      flex-direction: row;
      height: 191px;
      background-image: url("${ASSETS.bg}");
      font-family: Tahoma, "Segoe UI", Helvetica, sans-serif;
      padding: 0 .5em;
    }
    #display-box { display: flex; align-items: center; width: 50%; }
    #cover { width: 176px; height: 176px; object-fit: cover; }
    #info-container {
      display: flex;
      height: 178px; width: 127px; margin-top: 3px;
      background-image: url("${ASSETS.infoBg}");
      background-size: cover; color: black;
    }
    #song-info { width: 100%; padding: 5px; box-sizing: border-box; }
    #title { font-weight: normal; margin: 20px 0 5px 0; font-size: 14px; }
    #artist { margin: 0; font-size: 12px; opacity: 0.9; }
    #controls-container {
      display: flex; flex-direction: column; align-items: flex-start;
      margin: 10px; width: 100%; padding-top: 15px; padding-left: 5px;
    }
    #controls { display: flex; flex-direction: row; justify-content: flex-start; gap: 5px; cursor: pointer; width: 100%; }
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
      margin-top: 15px;
      overflow: hidden;
      width: 80%;
      cursor: pointer;
    }

    #progress {
      background-color: #707070;
      background-image: linear-gradient(180deg, #f3f3f3af, #fcfcfcaf 3px, #dbdbdbaf 6px, transparent 0),
                        radial-gradient(circle at 0 50%, #0000002f 10px, transparent 30px),
                        radial-gradient(circle at 100% 50%, #0000002f 10px, transparent 30px),
                        linear-gradient(180deg, transparent 65%, #ffffff55),
                        linear-gradient(180deg, transparent 6px, #cacaca33 0, #d5d5d533);
      box-shadow: inset 0 0 0 1px #ffffff1f;
      height: 100%;
      width: 0%;
      overflow: hidden;
    }

    #volume-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: -10px;
      padding: 0 12px;
    }

    .vol-icon {
      fill: #444;
      filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.8));
    }

    .vol-wrapper {
      position: relative;
      width: 100px;
      display: flex;
      align-items: center;
    }

    #volumeSlider {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background: transparent;
      width: 100%;
      margin: 0;
      padding: 0;
      cursor: pointer;
    }

    #volumeSlider:focus {
      outline: none;
    }

    #volumeSlider::-webkit-slider-runnable-track {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(180deg, #6a6a6a 0%, #9e9e9e 40%, #d4d4d4 100%);
      border: 1px solid #555;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    #volumeSlider::-moz-range-track {
      width: 100%;
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(180deg, #6a6a6a 0%, #9e9e9e 40%, #d4d4d4 100%);
      border: 1px solid #555;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.8);
    }

    #volumeSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-top: -5px;
      background: 
        radial-gradient(circle at center, #333 0%, #333 22%, transparent 24%),
        linear-gradient(180deg, #ffffff 0%, #e0e0e0 40%, #a2a2a2 50%, #d4d4d4 100%);
      border: 1px solid #555;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    #volumeSlider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: 
        radial-gradient(circle at center, #333 0%, #333 22%, transparent 24%),
        linear-gradient(180deg, #ffffff 0%, #e0e0e0 40%, #a2a2a2 50%, #d4d4d4 100%);
      border: 1px solid #555;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    #volumeSlider:active::-webkit-slider-thumb {
      background: 
        radial-gradient(circle at center, #111 0%, #111 22%, transparent 24%),
        linear-gradient(180deg, #d0d0d0 0%, #bebebe 40%, #888888 50%, #b0b0b0 100%);
    }

    #volumeSlider:active::-moz-range-thumb {
      background: 
        radial-gradient(circle at center, #111 0%, #111 22%, transparent 24%),
        linear-gradient(180deg, #d0d0d0 0%, #bebebe 40%, #888888 50%, #b0b0b0 100%);
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
      <svg class="vol-icon" width="12" height="12" viewBox="0 0 24 24">
        <path d="M3 9v6h4l5 5V4L7 9H3z"/>
      </svg>

      <div class="vol-wrapper">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="9">
      </div>

      <svg class="vol-icon" width="16" height="16" viewBox="0 0 24 24">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
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

  volumeSlider.value = currentVolume;
  audio.volume = currentVolume / 9;

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
