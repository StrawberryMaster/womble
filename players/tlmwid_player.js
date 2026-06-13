// This is a recreation of the music player
// showcased in the mod They'll Love Me When I'm Dead sneak peeks.
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
    playNext() { this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length; }
    playPrevious() { this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length; }
}
window.Playlist = Playlist;
window.Song = Song;

// globals
let playlist = new Playlist();
let playlistA = new Playlist();
let playlistB = new Playlist();
let activePlaylist = null;
let audioInstance = null;
let currentVolume = 1;

const prevIconSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M11 6 L2 12 L11 18 Z M20 6 L11 12 L20 18 Z"/></svg>`;
const playIconSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M8 5 L19 12 L8 19 Z"/></svg>`;
const pauseIconSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const nextIconSVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M4 6 L13 12 L4 18 Z M13 6 L22 12 L13 18 Z"/></svg>`;

// button toggle tracking
let ppBTN = playIconSVG;
let ppBTN_pause = pauseIconSVG;

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
    if (btn) btn.src = isPlaying ? ppBTN_pause : ppBTN;

    const vinyl = document.getElementById("vinyl");
    if (vinyl) {
        if (isPlaying) {
            vinyl.classList.add("spinning");
        } else {
            vinyl.classList.remove("spinning");
        }
    }
}

function safePlay(audioElement) {
    let playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            updatePlayPauseIcon(true);
        }).catch(error => {
            if (error.name !== "AbortError") {
                console.error("audio play error:", error);
                updatePlayPauseIcon(false);
            }
        });
    }
}

function changePlaylist(newPlaylist) {
    playlist = newPlaylist;
    playlist.currentSongIndex = 0;
    updateUI(playlist);

    // ensure audio exists before trying to access it
    const audio = getAudioElement();
    audio.src = playlist.getCurrentSong().audioLink;
    safePlay(audio);
}
window.changePlaylist = changePlaylist;

function updateUI(playlist) {
    const currentSong = playlist.getCurrentSong();
    const player = document.getElementById("player");
    if (!player || !currentSong) return;

    player.querySelector("#cover").src = currentSong.getCoverLink();
    player.querySelector("#title").textContent = currentSong.getTitle();
    player.querySelector("#artist").textContent = currentSong.getArtist();
}
window.updateUI = updateUI;

function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function playCurrentSong() {
    updateUI(playlist);
    const audio = getAudioElement();
    audio.src = playlist.getCurrentSong().audioLink;

    // reset duration display temporarily
    const durationDisplay = document.getElementById("duration-display");
    if (durationDisplay) durationDisplay.textContent = "0:00";

    safePlay(audio);
}

// setup
function setupMusicPlayer() {
    const gameWindow_player = document.getElementById("game_window");
    if (!gameWindow_player) return;

    // prevent duplicate players
    const existingPlayer = document.getElementById("player");
    if (existingPlayer) existingPlayer.remove();

    playlist = new Playlist();
    playlistA = new Playlist();
    playlistB = new Playlist();

    const commonSongs = [
        ["Dear Boy", "Paul McCartney", "https://i.imgur.com/cMRraQk.png", "https://audio.jukehost.co.uk/ZZVLpos0tLqOCSi0CSKFdlSoAbfbfRZl"],
        ["Uncle Albert/Admiral Halsey", "Paul McCartney", "https://i.imgur.com/cMRraQk.png", "https://audio.jukehost.co.uk/bKLFsbsVrlir9M2QXxm27CMzdW85113U"],
        ["I'm Still in Love with You", "Al Green", "https://i.imgur.com/Pw9Jidu.png", "https://audio.jukehost.co.uk/Be83hVY5wR1x2xcjVLaxHguuZ2Quyy0A"],
        ["My Whole World Ended", "David Ruffin", "https://i.imgur.com/qVVtZuR.png", "https://audio.jukehost.co.uk/GLV4WY4TywEf4sA1n4nOdVk9zqTaWkjO"],
        ["Nights In White Satin", "The Moody Blues", "https://i.imgur.com/0FbXJ7e.png", "https://audio.jukehost.co.uk/UP4ZQQVhMJXrRIJEkIdoCDOAKGAPdYsB"]
    ];

    const songUniqueA = new Song("Company", "Dean Jones", "https://i.imgur.com/4aRIys9.png", "https://audio.jukehost.co.uk/1MrAYcjHVGI1ldMQoLvEFkByR0qNtldI");
    const songUniqueB = new Song("I Believe in You", "Robert Morse", "https://i.imgur.com/Ets8X5z.png", "https://audio.jukehost.co.uk/mADm02cj0T8ouVlDG94zb9BxGN2yx6Tr");

    playlistA.addSong(songUniqueA);
    playlistB.addSong(songUniqueB);

    commonSongs.forEach(data => {
        let s = new Song(data[0], data[1], data[2], data[3]);
        playlistA.addSong(s);
        playlistB.addSong(s);
    });

    activePlaylist = playlistA;

    // create HTML
    const playerContainer = document.createElement("div");
    playerContainer.id = "player";
    playerContainer.innerHTML = `
    <div id="cover-wrapper">
      <img id="cover" title="Double click to switch playlist">
      <div id="vinyl"></div>
    </div>

    <div id="center-column">
      <div id="song-info">
        <h3 id="song-title-artist">
          <span id="title"></span> - <span id="artist"></span>
        </h3>
      </div>

      <div id="progress-bar-container">
        <span id="duration-display">0:00</span>
        <progress id="progress-bar" value="0" max="100"></progress>
      </div>

      <div id="controls">
        <img id="prevButton" alt="Previous">
        <img id="playPauseButton" alt="Play/Pause">
        <img id="nextButton" alt="Next">
      </div>
    </div>

    <div id="volume-container">
      <div class="is-vertical">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="${currentVolume}">
      </div>
    </div>
  `;

    gameWindow_player.insertAdjacentElement("afterend", playerContainer);

    // set up audio & logic
    const audio = getAudioElement();
    audio.volume = currentVolume / 9;

    const playPauseBtn = document.getElementById("playPauseButton");
    const prevBtn = document.getElementById("prevButton");
    const nextBtn = document.getElementById("nextButton");
    const progressBar = document.getElementById("progress-bar");
    const volumeSlider = document.getElementById("volumeSlider");
    const coverImg = document.getElementById("cover");

    // playlist switching via cover double-click
    coverImg.addEventListener("dblclick", () => {
        if (activePlaylist === playlistA) {
            activePlaylist = playlistB;
            changePlaylist(playlistB);
            changePlayerStyle("#02A6CF");
        } else {
            activePlaylist = playlistA;
            changePlaylist(playlistA);
            changePlayerStyle("#B42D1B");
        }
    });

    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) safePlay(audio);
        else { audio.pause(); updatePlayPauseIcon(false); }
    });

    nextBtn.addEventListener("click", () => { playlist.playNext(); playCurrentSong(); });
    prevBtn.addEventListener("click", () => { playlist.playPrevious(); playCurrentSong(); });

    // progress bars
    progressBar.addEventListener("click", function (e) {
        if (!audio.duration || isNaN(audio.duration)) return;
        const rect = this.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    audio.addEventListener("timeupdate", () => {
        if (audio.duration && !isNaN(audio.duration)) {
            progressBar.value = (audio.currentTime / audio.duration) * 100;
            const durationDisplay = document.getElementById("duration-display");
            if (durationDisplay) {
                durationDisplay.textContent = formatTime(audio.duration);
            }
        }
    });

    audio.addEventListener("loadedmetadata", () => {
        const durationDisplay = document.getElementById("duration-display");
        if (durationDisplay && audio.duration) {
            durationDisplay.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener("ended", () => {
        playlist.playNext();
        playCurrentSong();
    });

    volumeSlider.addEventListener("input", function () {
        currentVolume = parseInt(this.value, 10);
        audio.volume = currentVolume / 9;
    });

    // inject CSS
    if (!document.getElementById("tape-base-style")) {
        document.documentElement.style.setProperty('--theme-color', "#B42D1B");
        const style = document.createElement("style");
        style.id = "tape-base-style";
        style.textContent = `
    #player {
      position: relative;
      border: 1px solid #ffffff;
      outline: 1px solid #ffffff;
      outline-offset: -4px;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 191px;
      background-color: #364155;
      font-family: Arial, sans-serif;
      padding: 10px;
      box-sizing: border-box;
    }

    #cover-wrapper {
      position: relative;
      width: 240px;
      height: 176px;
      display: flex;
      align-items: center;
      z-index: 2;
    }

    #cover {
      width: 176px;
      height: 176px;
      cursor: pointer;
      z-index: 3;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    #vinyl {
      width: 176px;
      height: 176px;
      background: radial-gradient(circle, #000 30%, #333 31%, #000 40%, #111 41%, #000 70%);
      border-radius: 50%;
      position: absolute;
      left: 50px;
      z-index: 1;
      border: 1px solid #111;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #vinyl::after {
      content: '';
      width: 45px;
      height: 45px;
      background-color: var(--theme-color);
      border-radius: 50%;
      transition: background-color 0.3s ease;
    }

    .spinning {
      animation: spin 3.5s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    #center-column {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      height: 100%;
      padding-left: 20px;
      padding-right: 40px;
    }

    #song-info {
      display: flex;
      flex-direction: column;
      color: #ffffff;
      margin-bottom: 2px;
      margin-top: 5px;
    }

    #song-title-artist {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
      white-space: nowrap;
    }

	#title {
	  margin-right: 14px;
	}
	#artist {
	  margin-left: 14px;
	}

    #progress-bar-container {
      position: relative;
      width: 100%;
      max-width: 660px;
      height: 14px;
      margin-top: 6px;
      margin-bottom: 4px;
    }

    #duration-display {
      position: absolute;
      right: 0;
      top: -20px;
      color: #ffffff;
      font-size: 15px;
      font-weight: bold;
    }

    #progress-bar {
      width: 100%;
      height: 100%;
      appearance: none;
      -webkit-appearance: none;
      border: 1px solid #ffffff;
      cursor: pointer;
      background-color: transparent;
    }

    #progress-bar::-webkit-progress-bar { background-color: transparent; }
    #progress-bar::-webkit-progress-value { background-color: #ffffff; }
    #progress-bar::-moz-progress-bar { background-color: #ffffff; }
    #progress-bar::-ms-fill { background-color: #ffffff; }

    #controls {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-top: 5px;
    }

    #controls img {
      cursor: pointer;
      height: 30px;
    }

    #prevButton, #nextButton { width: 30px; }

    #volume-container {
      position: absolute;
      right: 5px;
      top: 0;
      bottom: 0;
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .is-vertical {
      height: 140px;
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: rotate(-90deg);
      transform-origin: center;
    }

    #volumeSlider {
      width: 140px;
      height: 10px;
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      border-left: 2px solid #ffffff;
      border-right: 2px solid #ffffff;
      padding: 0 3px;
    }

    #volumeSlider::-webkit-slider-runnable-track { width: 100%; height: 2px;  border-radius: 0px; }
    #volumeSlider::-moz-range-track { width: 100%; height: 2px; border-radius: 0px; }
    #volumeSlider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; background: #ffffff; border: none; width: 12px; height: 6px; margin-top: -2px; border-radius: 0px; }
    #volumeSlider::-moz-range-thumb { background: #ffffff; border: 1px solid #ffffff; width: 12px; height: 6px; border-radius: 0px; }
    `;
        document.head.appendChild(style);
    }

    // start player
    changePlaylist(playlistA);
    changePlayerStyle("#B42D1B");
}

function changePlayerStyle(txtColor) {
    document.documentElement.style.setProperty('--theme-color', txtColor);

    const prevBtn = document.getElementById("prevButton");
    const ppBtn = document.getElementById("playPauseButton");
    const ffBtn = document.getElementById("nextButton");

    if (prevBtn) prevBtn.src = prevIconSVG;
    if (ffBtn) ffBtn.src = nextIconSVG;

    ppBTN = playIconSVG;
    ppBTN_pause = pauseIconSVG;

    const audio = getAudioElement();
    updatePlayPauseIcon(!audio.paused);
}
setupMusicPlayer();
