// This music player was made
// for 2028: An Old Cycle.
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
let currentVolume = 11;

const playerRefs = {
  player: null,
  cover: null,
  title: null,
  artist: null,
  playPauseBtn: null,
  prevBtn: null,
  nextBtn: null,
  progressBar: null,
  progressBarContainer: null,
  currentTimeEl: null,
  durationEl: null,
  volumeSlider: null,
  volumeIcon: null,
  volumeDisplay: null
};

// assets
const svgToDataUri = (svg) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const ASSETS = {
  btnPrev: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill="#fff" d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7z"/>
    </svg>
  `),

  btnPlay: svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill="#1DB954"/>
    <g transform="translate(14.8 14.8) scale(1.15)">
      <path fill="#fff" d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z"/>
    </g>
  </svg>
`),

  btnPause: svgToDataUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill="#1DB954"/>
    <g transform="translate(14.8 14.8) scale(1.15)">
      <path fill="#fff" d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"/>
    </g>
  </svg>
`),

  btnNext: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill="#fff" d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"/>
    </svg>
  `),

  volMute: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill="#fff" d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06"/>
      <path fill="#fff" d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.64 3.64 0 0 0-1.33 4.967 3.64 3.64 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.7 4.7 0 0 1-1.5-.694v1.3L2.817 9.852a2.14 2.14 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694z"/>
    </svg>
  `),

  volLow: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill="#fff" d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88"/>
    </svg>
  `),

  volMedium: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill="#fff" d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a3 3 0 0 1 0 5.175z"/>
    </svg>
  `),

  volHigh: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill="#fff" d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88"/>
      <path fill="#fff" d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127z"/>
    </svg>
  `)
};

function setRangeFill(el, direction = "horizontal", fillColor = "#1DB954", restColor = "#4d4d4d") {
  if (!el) return;

  const min = Number(el.min || 0);
  const max = Number(el.max || 100);
  const value = Number(el.value || 0);
  const percent = ((value - min) / (max - min)) * 100;
  const safePercent = Math.max(0, Math.min(100, percent));

  el.style.background =
    direction === "vertical"
      ? `linear-gradient(to top, ${fillColor} 0%, ${fillColor} ${safePercent}%, ${restColor} ${safePercent}%, ${restColor} 100%)`
      : `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${safePercent}%, ${restColor} ${safePercent}%, ${restColor} 100%)`;
}

function isProgressBarInteractive() {
  const bar = document.getElementById("progress-bar");
  const container = document.getElementById("progress-bar-container");

  if (!bar) return false;

  return (
    bar.matches(":hover") ||
    bar.matches(":active") ||
    bar.matches(":focus") ||
    document.activeElement === bar ||
    (container && container.matches(":hover"))
  );
}

let lastProgressPercent = null;
let lastProgressInteractive = null;

function paintProgressBar(force = false) {
  const bar = playerRefs.progressBar || document.getElementById("progress-bar");
  if (!bar) return;

  const min = Number(bar.min || 0);
  const max = Number(bar.max || 100);
  const value = Number(bar.value || 0);
  const percent = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const interactive = isProgressBarInteractive();

  if (!force &&
    percent === lastProgressPercent &&
    interactive === lastProgressInteractive) {
    return;
  }

  lastProgressPercent = percent;
  lastProgressInteractive = interactive;

  setRangeFill(
    bar,
    "horizontal",
    interactive ? "#1DB954" : "#ffffff",
    "#4d4d4d"
  );
}

function repaintProgressBarSoon() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      paintProgressBar();
    });
  });
}

function paintVolumeBar() {
  setRangeFill(document.getElementById("volumeSlider"), "vertical", "#1DB954", "#4d4d4d");
}

function getVolumeIconByLevel(level) {
  if (level <= 0) return ASSETS.volMute;
  if (level <= 33) return ASSETS.volLow;
  if (level <= 66) return ASSETS.volMedium;
  return ASSETS.volHigh;
}

function updateVolumeIcon(level = currentVolume) {
  const icon = document.getElementById("volumeIcon");
  if (!icon) return;

  icon.src = getVolumeIconByLevel(level);
  icon.alt = level <= 0 ? "Muted" : "Volume";
}

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  // ensure audio exists before trying to access it
  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.audioLink;

    const progressBar = document.getElementById("progress-bar");
    const currentTimeEl = document.getElementById("current-time");
    const durationEl = document.getElementById("duration");

    if (progressBar) {
      progressBar.value = 0;
      paintProgressBar();
    }

    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (durationEl) durationEl.textContent = "0:00";

    audio.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
    updatePlayPauseIcon(true);
  }
}
window.changePlaylist = changePlaylist;

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  if (!currentSong || !playerRefs.player) return;

  playerRefs.cover.src = currentSong.getCoverLink();
  playerRefs.title.textContent = currentSong.getTitle();
  playerRefs.artist.textContent = currentSong.getArtist();
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

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");

  return hrs > 0
    ? `${hrs}:${String(mins).padStart(2, "0")}:${secs}`
    : `${mins}:${secs}`;
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
    ["Jesus Walks", "Kanye West", "https://i.discogs.com/0cuV2JitAM7XPXkgYP7syTign62tuxrden2HRiRb0wo/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTExNDc0/MjQtMTUzMjQwMjMz/Ni03NjUzLnBuZw.jpeg", "https://file.garden/aNtAfG887DiA_7lO/2028AOC/Jesus%20Walks%20-%20Kanye%20West.ogg"],
    ["I'm Better", "Kendrick Lamar", "https://images.genius.com/43c7fc30a6d9fd31b239bb47cf1533f4.1000x1000x1.png", "https://file.garden/aNtAfG887DiA_7lO/2028AOC/I'm%20Better%20-%20Kendrick%20Lamar.mp3"],
    ["Soldier of Love", "Sade", "https://i.discogs.com/vntsNIVveCmaocTGQP6hXo18bg4KuyTjB1jvOcCx83g/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIxMjc2/MzMtMTI2NTkwOTA0/OC5qcGVn.jpeg", "https://file.garden/aNtAfG887DiA_7lO/2028AOC/Soldier%20of%20Love%20-%20Sade.ogg"],
    ["The Room Where It Happens", "Original Broadway Cast of “Hamilton”", "https://images.genius.com/3d49fcb34aa21fccd06f2b3c818146fd.1000x1000x1.png", "https://file.garden/aNtAfG887DiA_7lO/2028AOC/The%20Room%20Where%20It%20Happens%20-%20Leslie%20Odom%20Jr..ogg"],
    ["LO QUE LE PASÓ A HAWAii", "Bad Bunny", "https://images.genius.com/66f08db4c1d9d323ab441ab6c04a034a.1000x1000x1.png", "https://file.garden/aNtAfG887DiA_7lO/2028AOC/LO%20QUE%20LE%20PAS%C3%93%20A%20HAWAii%20-%20Bad%20Bunny.ogg"],
    ["Kaleidoscope", "Chappell Roan", "https://i.scdn.co/image/ab67616d0000b27300ba233051308498954daf7c", "https://file.garden/aNtAfG887DiA_7lO/2028AOC/Kaleidoscope%20-%20Chappell%20Roan.ogg"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // inject CSS
  if (!document.getElementById("spotify-player-style")) {
    const style = document.createElement("style");
    style.id = "spotify-player-style";
    style.textContent = `
      #player, #player * { box-sizing: border-box; }

      #player {
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: row;
        height: 191px;
        padding: 0 .5em;
        color: white;
        font-family: Inter, "Helvetica Neue", Helvetica, Arial, sans-serif;
        background:
          radial-gradient(circle at 12% 14%, rgba(29, 185, 84, 0.18), transparent 32%),
          linear-gradient(180deg, #1d1d1d 0%, #121212 100%);
        border-radius: 14px;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
        overflow: hidden;
      }

      #display-box {
        display: flex;
        align-items: center;
        width: 50%;
        gap: 8px;
        min-width: 0;
      }

      #cover {
        width: 176px;
        height: 176px;
        object-fit: cover;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.28);
      }

      #info-container {
	  display: flex;
	  height: 178px;
	  width: 127px;
	  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
	  border: 1px solid rgba(255,255,255,0.05);
	  border-radius: 12px;
	  color: white;
	  backdrop-filter: blur(4px);
	  min-width: 0;
	}

	#song-info {
	  width: 100%;
	  min-width: 0;
	  overflow: hidden;
	  padding: 10px 8px 8px;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	}

	#now-playing-label {
	  font-size: 10px;
	  font-weight: 700;
	  letter-spacing: 0.14em;
	  color: #1DB954;
	  opacity: 0.95;
	  margin-bottom: 8px;
	}

	#title {
	  width: 100%;
	  min-width: 0;
	  margin: 0 0 6px 0;
	  font-size: 15px;
	  font-weight: 700;
	  line-height: 1.18;
	  color: #fff;
	  display: block;
	  white-space: normal;
	  overflow: hidden;
	  overflow-wrap: anywhere;
	  word-break: break-word;
	  hyphens: auto;
	  max-height: 72px;
	}

	#artist {
	  width: 100%;
	  min-width: 0;
	  margin: 0;
	  font-size: 11.5px;
	  line-height: 1.32;
	  color: #b3b3b3;
	  display: block;
	  white-space: normal;
	  overflow: hidden;
	  overflow-wrap: anywhere;
	  word-break: break-word;
	  max-height: 48px;
	}

      #controls-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 10px 0;
        width: 100%;
        min-width: 0;
      }

      #controls {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 16px;
      }

	#controls img {
	  cursor: pointer;
	  transition: transform 0.12s ease, opacity 0.12s ease, filter 0.12s ease;
	  user-select: none;
	  display: block;
	}

	#controls img:hover {
	  transform: scale(1.08);
	}

	#controls img:active {
	  transform: scale(0.95);
	}

	#prevButton,
	#nextButton {
	  width: 24px;
	  height: 24px;
	  opacity: 0.72;
	}

	#prevButton:hover,
	#nextButton:hover,
	#prevButton:focus-visible,
	#nextButton:focus-visible {
	  opacity: 1;
	}

	#playPauseButton {
	  width: 48px;
	  height: 48px;
	  opacity: 1;
	  filter: drop-shadow(0 4px 10px rgba(29,185,84,0.25));
	}

	#volumeIcon {
	  width: 16px;
	  height: 16px;
	  opacity: 0.72;
	  display: block;
	  cursor: pointer;
	  user-select: none;
	  transition: transform 0.12s ease, opacity 0.12s ease, filter 0.12s ease;
	}

	#volumeIcon:hover,
	#volumeIcon:focus-visible {
	  transform: scale(1.08);
	  opacity: 1;
	}

	#volumeIcon:active {
	  transform: scale(0.95);
	}

	#progress-bar-container {
	  width: 80%;
	  margin-top: 18px;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  gap: 8px;
	  padding: 8px 0;
	}

	#current-time,
	#duration {
	  font-size: 11px;
	  line-height: 1;
	  color: #b3b3b3;
	  min-width: 36px;
	  text-align: center;
	  font-variant-numeric: tabular-nums;
	  user-select: none;
	}

	#progress-bar,
	#volumeSlider {
	  appearance: none;
	  -webkit-appearance: none;
	  border: none;
	  outline: none;
	  background: #4d4d4d;
	}

	#progress-bar {
	  flex: 1;
	  width: auto;
	  height: 5px;
	  border-radius: 999px;
	  cursor: pointer;
	}

	#progress-bar::-webkit-slider-runnable-track {
	  height: 5px;
	  background: transparent;
	  border-radius: 999px;
	}

	#progress-bar::-webkit-slider-thumb {
	  -webkit-appearance: none;
	  appearance: none;
	  width: 12px;
	  height: 12px;
	  border-radius: 50%;
	  background: #fff;
	  border: none;
	  margin-top: -4px;
	  box-shadow: 0 0 0 2px rgba(0,0,0,0.15);
	  opacity: 0;
	  transition: opacity 0.12s ease;
	}

	#progress-bar-container:hover #progress-bar::-webkit-slider-thumb,
	#progress-bar:hover::-webkit-slider-thumb,
	#progress-bar:active::-webkit-slider-thumb,
	#progress-bar:focus-visible::-webkit-slider-thumb {
	  opacity: 1;
	}

	#progress-bar::-moz-range-track {
	  height: 5px;
	  background: transparent;
	  border: none;
	  border-radius: 999px;
	}

	#progress-bar::-moz-range-thumb {
	  width: 12px;
	  height: 12px;
	  border-radius: 50%;
	  background: #fff;
	  border: none;
	  box-shadow: 0 0 0 2px rgba(0,0,0,0.15);
	  opacity: 0;
	  transition: opacity 0.12s ease;
	}

	#progress-bar-container:hover #progress-bar::-moz-range-thumb,
	#progress-bar:hover::-moz-range-thumb,
	#progress-bar:active::-moz-range-thumb,
	#progress-bar:focus-visible::-moz-range-thumb {
	  opacity: 1;
	}

      #volume-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 44px;
        padding-right: 10px;
      }

	#volume-container img {
	  width: 16px;
	  height: 16px;
	  opacity: 0.9;
	  display: block;
	}

      .vol-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 126px;
        margin-top: 8px;
        padding: 10px 0;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 999px;
      }

      #volumeSlider {
	  --vol-track-size: 8px;
	  --vol-thumb-size: 12px;

	  width: var(--vol-track-size);
	  height: 100%;
	  writing-mode: vertical-lr;
	  direction: rtl;
	  border-radius: 999px;
	  cursor: pointer;
	  display: block;
	}

	#volumeSlider::-webkit-slider-runnable-track {
	  width: var(--vol-track-size);
	  background: transparent;
	  border-radius: 999px;
	}

	#volumeSlider::-webkit-slider-thumb {
	  -webkit-appearance: none;
	  appearance: none;
	  width: var(--vol-thumb-size);
	  height: var(--vol-thumb-size);
	  border-radius: 50%;
	  background: #fff;
	  border: none;
	  box-shadow: 0 0 0 2px rgba(0,0,0,0.15);
	  margin-left: calc((var(--vol-track-size) - var(--vol-thumb-size)) / 2);
	}

	#volumeSlider::-moz-range-track {
	  width: var(--vol-track-size);
	  background: transparent;
	  border: none;
	  border-radius: 999px;
	}

	#volumeSlider::-moz-range-thumb {
	  width: var(--vol-thumb-size);
	  height: var(--vol-thumb-size);
	  border-radius: 50%;
	  background: #fff;
	  border: none;
	}

      #volume-display {
        font-weight: bold;
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <div id="display-box">
      <img id="cover" src="" alt="Album cover">
      <div id="info-container">
        <div id="song-info">
          <span id="now-playing-label">NOW PLAYING</span>
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
	    <span id="current-time">0:00</span>
	    <input type="range" id="progress-bar" value="0" max="100" step="0.1">
	    <span id="duration">0:00</span>
	  </div>
    </div>

    <div id="volume-container">
      <img id="volumeIcon" src="${getVolumeIconByLevel(currentVolume)}" alt="Volume">
      <div class="vol-wrapper">
        <input type="range" id="volumeSlider" min="0" max="100" step="0.1" value="${currentVolume}" orient="vertical">
      </div>
      <span id="volume-display">${currentVolume}</span>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  playerRefs.player = playerContainer;
  playerRefs.cover = playerContainer.querySelector("#cover");
  playerRefs.title = playerContainer.querySelector("#title");
  playerRefs.artist = playerContainer.querySelector("#artist");
  playerRefs.playPauseBtn = playerContainer.querySelector("#playPauseButton");
  playerRefs.prevBtn = playerContainer.querySelector("#prevButton");
  playerRefs.nextBtn = playerContainer.querySelector("#nextButton");
  playerRefs.progressBar = playerContainer.querySelector("#progress-bar");
  playerRefs.progressBarContainer = playerContainer.querySelector("#progress-bar-container");
  playerRefs.currentTimeEl = playerContainer.querySelector("#current-time");
  playerRefs.durationEl = playerContainer.querySelector("#duration");
  playerRefs.volumeSlider = playerContainer.querySelector("#volumeSlider");
  playerRefs.volumeIcon = playerContainer.querySelector("#volumeIcon");
  playerRefs.volumeDisplay = playerContainer.querySelector("#volume-display");

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.audioLink;
  audio.volume = currentVolume / 100;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBar = document.getElementById("progress-bar");
  const progressBarContainer = document.getElementById("progress-bar-container");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");
  const volumeSlider = document.getElementById("volumeSlider");
  const volDisplay = document.getElementById("volume-display");
  const volumeIcon = document.getElementById("volumeIcon");

  ["pointerenter", "pointerleave", "focus", "blur"].forEach(evt => {
    progressBar.addEventListener(evt, repaintProgressBarSoon);
  });

  if (progressBarContainer) {
    ["pointerenter", "pointerleave"].forEach(evt => {
      progressBarContainer.addEventListener(evt, repaintProgressBarSoon);
    });
  }

  ["pointerup", "mouseup", "touchend", "touchcancel"].forEach(evt => {
    document.addEventListener(evt, repaintProgressBarSoon);
  });

  volumeSlider.value = currentVolume;
  volDisplay.textContent = currentVolume;
  paintProgressBar();
  paintVolumeBar();
  updateVolumeIcon(currentVolume);


  // play/pause
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play()
        .then(() => updatePlayPauseIcon(true))
        .catch(() => updatePlayPauseIcon(false));
    } else {
      audio.pause();
      updatePlayPauseIcon(false);
    }
  });

  // next/prev
  const playSongAtIndex = () => {
    const song = activePlaylist.getCurrentSong();
    if (!song) return;

    updateUI(activePlaylist);
    audio.src = song.audioLink;
    progressBar.value = 0;
    paintProgressBar();
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";

    audio.play()
      .then(() => updatePlayPauseIcon(true))
      .catch(() => updatePlayPauseIcon(false));
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
    const currentText = formatTime(audio.currentTime);
    if (playerRefs.currentTimeEl && playerRefs.currentTimeEl.textContent !== currentText) {
      playerRefs.currentTimeEl.textContent = currentText;
    }

    if (Number.isFinite(audio.duration)) {
      const durationText = formatTime(audio.duration);
      if (playerRefs.durationEl && playerRefs.durationEl.textContent !== durationText) {
        playerRefs.durationEl.textContent = durationText;
      }

      const progress = (audio.currentTime / audio.duration) * 100;
      if (playerRefs.progressBar) playerRefs.progressBar.value = progress;
    } else {
      if (playerRefs.durationEl && playerRefs.durationEl.textContent !== "0:00") {
        playerRefs.durationEl.textContent = "0:00";
      }
      if (playerRefs.progressBar) playerRefs.progressBar.value = 0;
    }

    paintProgressBar();
  });

  audio.addEventListener("loadedmetadata", () => {
    currentTimeEl.textContent = formatTime(audio.currentTime || 0);
    durationEl.textContent = formatTime(audio.duration);
    paintProgressBar();
  });

  audio.addEventListener("durationchange", () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("play", () => updatePlayPauseIcon(true));
  audio.addEventListener("pause", () => updatePlayPauseIcon(false));

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
      paintProgressBar();
    }
  });

  // volume
  let lastNonZeroVolume = currentVolume > 0 ? currentVolume : 50;

  volumeIcon.addEventListener("click", () => {
    if (currentVolume === 0) {
      currentVolume = lastNonZeroVolume;
    } else {
      lastNonZeroVolume = currentVolume;
      currentVolume = 0;
    }

    volumeSlider.value = currentVolume;
    volDisplay.textContent = currentVolume;
    audio.volume = currentVolume / 100;
    paintVolumeBar();
    updateVolumeIcon(currentVolume);
  });

  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseFloat(e.target.value);
    volDisplay.textContent = Math.round(currentVolume);
    audio.volume = currentVolume / 100;
    paintVolumeBar();
    updateVolumeIcon(currentVolume);
  });

  // initial play
  updateUI(activePlaylist);

  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}
setupMusicPlayer();
