// This is a recreation of the alt music player
// showcased in the mod Project 2024 sneak peeks.
class Song {
  constructor(title, artist, coverLink, audioLink, isFavorite = false) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;
    this.audioLink = audioLink;
    this.isFavorite = isFavorite;
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

// globals
let mainPlaylist = new Playlist();
let activePlaylist = mainPlaylist;
let isFavoritesMode = false;

let audioInstance = null;
let currentVolume = 0.5;
let isCurrentYT = false;

let ytPlayer = null;
let isYTReady = false;

// assets
const ASSETS = {
  btnPrev: `<svg width="32" height="28" viewBox="0 0 32 28" fill="currentColor" style="transform: scaleX(-1);"><path d="M18.14 20.68c.365 0 .672-.107 1.038-.323l8.508-4.997c.623-.365.938-.814.938-1.37 0-.564-.307-.988-.938-1.361l-8.508-4.997c-.366-.216-.68-.324-1.046-.324-.73 0-1.337.556-1.337 1.569v4.773c-.108-.399-.406-.73-.904-1.021L7.382 7.632c-.357-.216-.672-.324-1.037-.324-.73 0-1.345.556-1.345 1.569v10.235c0 1.013.614 1.569 1.345 1.569.365 0 .68-.108 1.037-.324l8.509-4.997c.49-.29.796-.631.904-1.038v4.79c0 1.013.615 1.569 1.345 1.569z" fill-rule="nonzero"></path></svg>`,
  btnNext: `<svg width="32" height="28" viewBox="0 0 32 28" fill="currentColor"><path d="M18.14 20.68c.365 0 .672-.107 1.038-.323l8.508-4.997c.623-.365.938-.814.938-1.37 0-.564-.307-.988-.938-1.361l-8.508-4.997c-.366-.216-.68-.324-1.046-.324-.73 0-1.337.556-1.337 1.569v4.773c-.108-.399-.406-.73-.904-1.021L7.382 7.632c-.357-.216-.672-.324-1.037-.324-.73 0-1.345.556-1.345 1.569v10.235c0 1.013.614 1.569 1.345 1.569.365 0 .68-.108 1.037-.324l8.509-4.997c.49-.29.796-.631.904-1.038v4.79c0 1.013.615 1.569 1.345 1.569z" fill-rule="nonzero"></path></svg>`,
  btnPlay: `<svg width="32" height="28" viewBox="0 0 32 28" fill="currentColor"><path d="M10.345 23.287c.415 0 .763-.15 1.22-.407l12.742-7.404c.838-.481 1.178-.855 1.178-1.46 0-.599-.34-.972-1.178-1.462L11.565 5.158c-.457-.265-.805-.407-1.22-.407-.789 0-1.345.606-1.345 1.57V21.71c0 .971.556 1.577 1.345 1.577z" fill-rule="nonzero"></path></svg>`,
  btnPause: `<svg width="32" height="28" viewBox="0 0 32 28" fill="currentColor"><path d="M13.293 22.772c.955 0 1.436-.481 1.436-1.436V6.677c0-.98-.481-1.427-1.436-1.427h-2.457c-.954 0-1.436.473-1.436 1.427v14.66c-.008.954.473 1.435 1.436 1.435h2.457zm7.87 0c.954 0 1.427-.481 1.427-1.436V6.677c0-.98-.473-1.427-1.428-1.427h-2.465c-.955 0-1.428.473-1.428 1.427v14.66c0 .954.473 1.435 1.428 1.435h2.465z" fill-rule="nonzero"></path></svg>`,
  star: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  starFilled: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
};

// helpers
function extractYouTubeId(url) {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getAudioElement() {
  if (!audioInstance) {
    audioInstance = document.createElement("audio");
    audioInstance.id = "audio";
    document.body.appendChild(audioInstance);
  }
  return audioInstance;
}

function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updatePlayPauseIcon(isPlaying) {
  const btn = document.getElementById("playPauseButton");
  if (btn) btn.innerHTML = isPlaying ? ASSETS.btnPause : ASSETS.btnPlay;
}

function updateStarIcon(isFavorite) {
  const starBtn = document.getElementById("star-icon");
  if (starBtn) {
    starBtn.innerHTML = isFavorite ? ASSETS.starFilled : ASSETS.star;
    starBtn.style.color = isFavorite ? "#FFD700" : "rgba(255, 255, 255, 0.6)";
  }
}

function getFavoritesPlaylist() {
  const favPlaylist = new Playlist();
  mainPlaylist.songs.forEach(song => {
    if (song.isFavorite) {
      favPlaylist.addSong(song);
    }
  });
  return favPlaylist;
}

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  const player = document.getElementById("player");

  if (!player || !currentSong) return;

  const cover = player.querySelector("#cover");
  const bg = player.querySelector("#player-bg");
  const title = player.querySelector("#title");
  const artist = player.querySelector("#artist");

  if (cover) {
    cover.src = currentSong.getCoverLink();
    cover.title = isFavoritesMode ? "Playing Favorites (Double-click to return to Main Playlist)" : "Double-click to play Favorites";
  }
  if (bg) bg.style.backgroundImage = `url("${currentSong.getCoverLink()}")`;
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();

  updateStarIcon(currentSong.isFavorite);
}
window.updateUI = updateUI;

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  playSongAtIndex();
}
window.changePlaylist = changePlaylist;

function setSliderFill(slider, cssVar) {
  const val = (slider.value - slider.min) / (slider.max - slider.min) * 100;
  slider.style.setProperty(cssVar, `${val}%`);
}

function updateTimePosition(progressPercentage, currentTimeText) {
  if (!currentTimeText) return;
  currentTimeText.style.left = `${progressPercentage}%`;
  currentTimeText.style.transform = `translateX(-${progressPercentage}%)`;
}

// youtube iframe api integration
function setupYouTubeAPI() {
  if (document.getElementById("yt-player-container")) return;

  const ytDiv = document.createElement("div");
  ytDiv.id = "yt-player-container";
  ytDiv.style.cssText = "position:absolute; width:1px; height:1px; opacity:0; pointer-events:none; overflow:hidden; top:-9999px; left:-9999px;";
  document.body.appendChild(ytDiv);

  if (!window.YT) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player("yt-player-container", {
    height: "1",
    width: "1",
    playerVars: {
      "autoplay": 0,
      "controls": 0,
      "disablekb": 1,
      "rel": 0
    },
    events: {
      "onReady": () => { isYTReady = true; },
      "onStateChange": (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          activePlaylist.playNext();
          playSongAtIndex();
        }
      }
    }
  });
};

function playSongAtIndex() {
  const song = activePlaylist.getCurrentSong();
  if (!song) return;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  const ytId = extractYouTubeId(song.getAudioLink());

  if (ytId) {
    isCurrentYT = true;
    audio.pause();
    audio.currentTime = 0;

    const loadYT = () => {
      if (ytPlayer && ytPlayer.loadVideoById) {
        ytPlayer.loadVideoById(ytId);
        ytPlayer.setVolume(currentVolume * 100);
        updatePlayPauseIcon(true);
      } else {
        setTimeout(loadYT, 300);
      }
    };
    loadYT();
  } else {
    isCurrentYT = false;
    if (ytPlayer && isYTReady && ytPlayer.pauseVideo) {
      ytPlayer.pauseVideo();
    }
    audio.src = song.getAudioLink();
    audio.volume = currentVolume;
    audio.play().then(() => updatePlayPauseIcon(true)).catch(() => updatePlayPauseIcon(false));
  }
}

// setup music player
function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) {
    console.warn("game_window element not found. Player will not be attached.");
    return;
  }

  if (document.getElementById("player")) return;

  setupYouTubeAPI();

  const defaultSongs = [
    ["Kickline", "2021 London Cast of Cabaret", "https://yt3.googleusercontent.com/O0UqsdQPPD7fSvvW_TtxVTz1xeqa7tfsmlUC0BvOJyzsgZxNqAzIpzN3cIzBnFebqbEwm7y7tlmuthvF=w544-h544-l90-rj", "https://www.youtube.com/watch?v=axbQkbe0wPg"],
    ["Houdini", "Dua Lipa", "https://yt3.googleusercontent.com/3yJxQ6FIkFcDOCD7u-9154oBWSRQFiyIinE8w5QM9-Hh0hPhcEXBPnoQj9-O_hccPHcqlT-jAnJDzkEX=w544-h544-l90-rj", "https://www.youtube.com/watch?v=cCfPDrRQp9k"],
    ["Diet Pepsi", "Addison Rae", "https://yt3.googleusercontent.com/qobmikqU1G4DZhbfeLzvpBtslO7agtTs_5hvO0Ler2bo3YUo9s0NSiARVMEz4QjZtCPdD2QvGVvi37Ek=w544-h544-l90-rj", "https://www.youtube.com/watch?v=KS3lA6_-I7U"],
    ["Sexy to Someone", "Clairo", "https://yt3.googleusercontent.com/vfiGLJgeFrBEYlfEbTZS4F6YC0P4LHGbYS-e03p5fbGkLpKGwOOhy0-zExznWLqmqtAT4As1v92es9w0=w544-h544-l90-rj", "https://www.youtube.com/watch?v=wQ7OIpVgN8s"]
  ];

  if (mainPlaylist.songs.length === 0) {
    defaultSongs.forEach(data => mainPlaylist.addSong(new Song(...data)));
  }
  activePlaylist = mainPlaylist;

  // inject css
  const style = document.createElement("style");
  style.textContent = `
    @keyframes bgWave {
      0% {
        transform: scale(1.3) translate(0px, 0px) rotate(0deg);
      }
      33% {
        transform: scale(1.45) translate(-18px, 12px) rotate(3deg);
      }
      66% {
        transform: scale(1.4) translate(15px, -15px) rotate(-3deg);
      }
      100% {
        transform: scale(1.3) translate(0px, 0px) rotate(0deg);
      }
    }

    #player {
      position: relative;
      width: 100%;
      height: 179px;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid rgb(100 100 100 / 20%);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      user-select: none;
      box-sizing: border-box;
    }

    #player-bg {
      position: absolute;
      top: -60px;
      left: -60px;
      right: -60px;
      bottom: -60px;
      background-size: cover;
      background-position: center;
      filter: blur(45px) brightness(0.48) saturate(1.3);
      z-index: 1;
      transition: background-image 0.5s ease;
      animation: bgWave 18s ease-in-out infinite alternate;
      will-change: transform;
    }

    #player-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
      padding: 6px;
      gap: 14px;
      box-sizing: border-box;
    }

    #cover {
      width: 163px;
      height: 163px;
      border-radius: 8px;
      object-fit: cover;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      flex-shrink: 0;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    #cover:hover {
      opacity: 0.9;
    }

    #player-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding: 4px 0;
      box-sizing: border-box;
    }

    #player-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      width: 100%;
    }

    #song-info {
      display: flex;
      flex-direction: column;
      max-width: 50%;
      margin-top: 4px;
      margin-left: .5em;
    }

    #title {
      font-size: 16px;
      font-weight: 700;
      margin: 0 0 10px 0;
      color: #ffffff;
      line-height: 1.2;
    }

    #artist {
      font-size: 13px;
      margin: 0;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 400;
    }

    #center-controls {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      top: 24px;
    }

    #controls {
      display: flex;
      align-items: center;
      gap: 0;
    }

    .transport-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s ease, transform 0.1s ease;
    }
    .transport-btn svg {
      width: 30px;
      height: 26px;
    }
    .transport-btn:hover { color: #ffffff; }
    .transport-btn:active { transform: scale(0.92); }

    #star-icon {
      position: absolute;
      right: 0;
      top: -3px;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      transition: color 0.15s ease, transform 0.1s ease;
    }
    #star-icon:hover {
      transform: scale(1.15);
    }

    input[type=range] {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      outline: none;
      cursor: pointer;
      margin: 0;
    }

    #volumeSlider {
      width: 120px;
      height: 12px;
    }
    #volumeSlider::-webkit-slider-runnable-track {
      height: 5px;
      border-radius: 3px;
      background: linear-gradient(to right, #B8B8B8 var(--vol-pos, 50%), #4C4C4C var(--vol-pos, 50%));
    }
    #volumeSlider::-moz-range-track {
      height: 5px;
      border-radius: 3px;
      background: linear-gradient(to right, #B8B8B8 var(--vol-pos, 50%), #4C4C4C var(--vol-pos, 50%));
    }
    #volumeSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ffffff;
      margin-top: -2.5px;
    }

    #progress-section {
      display: flex;
      flex-direction: column;
      width: 90%;
      margin: 0 auto 2px auto;
    }

    #progress-bar {
      width: 100%;
      height: 12px;
    }
    #progress-bar::-webkit-slider-runnable-track {
      height: 6px;
      border-radius: 3px;
      background: linear-gradient(to right, #B8B8B8 var(--prog-pos, 0%), #E6E6E6 var(--prog-pos, 0%));
    }
    #progress-bar::-moz-range-track {
      height: 6px;
      border-radius: 3px;
      background: linear-gradient(to right, #B8B8B8 var(--prog-pos, 0%), #E6E6E6 var(--prog-pos, 0%));
    }
    #progress-bar::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ffffff;
      margin-top: -3px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }

    #time-display {
      position: relative;
      width: 100%;
      height: 14px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 3px;
      font-weight: 500;
    }

    #current-time {
      position: absolute;
      top: 0;
      left: 0%;
      transform: translateX(0%);
      white-space: nowrap;
    }

    #duration-time {
      position: absolute;
      top: 0;
      right: 0;
    }
  `;
  document.head.appendChild(style);

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <div id="player-bg"></div>
    <div id="player-content">
      <img id="cover" src="" alt="Album Cover">
      <div id="player-right">
        <div id="player-top">
          <div id="song-info">
            <h3 id="title"></h3>
            <p id="artist"></p>
          </div>
          <div id="center-controls">
            <div id="controls">
              <button id="prevButton" class="transport-btn">${ASSETS.btnPrev}</button>
              <button id="playPauseButton" class="transport-btn">${ASSETS.btnPlay}</button>
              <button id="nextButton" class="transport-btn">${ASSETS.btnNext}</button>
            </div>
            <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="${currentVolume}">
          </div>
          <div id="star-icon">${ASSETS.star}</div>
        </div>
        <div id="progress-section">
          <input type="range" id="progress-bar" value="0" max="100" step="0.1">
          <div id="time-display">
            <span id="current-time">0:00</span>
            <span id="duration-time">0:00</span>
          </div>
        </div>
      </div>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // setup audio & logic
  const audio = getAudioElement();
  audio.volume = currentVolume;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const starBtn = document.getElementById("star-icon");
  const coverEl = document.getElementById("cover");
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volumeSlider");
  const currentTimeText = document.getElementById("current-time");
  const durationTimeText = document.getElementById("duration-time");

  setSliderFill(volumeSlider, '--vol-pos');

  // favorite click listener
  starBtn.addEventListener("click", () => {
    const currentSong = activePlaylist.getCurrentSong();
    if (currentSong) {
      currentSong.isFavorite = !currentSong.isFavorite;
      updateStarIcon(currentSong.isFavorite);
    }
  });

  // double click cover listener
  coverEl.addEventListener("dblclick", () => {
    if (isFavoritesMode) {
      isFavoritesMode = false;
      activePlaylist = mainPlaylist;
      playSongAtIndex();
    } else {
      const favPlaylist = getFavoritesPlaylist();
      if (favPlaylist.songs.length === 0) {
        alert("No favorite songs added yet! Click the star icon (★) to favorite songs.");
        return;
      }
      isFavoritesMode = true;
      activePlaylist = favPlaylist;
      playSongAtIndex();
    }
  });

  // play/pause
  playPauseBtn.addEventListener("click", () => {
    if (isCurrentYT && ytPlayer && isYTReady) {
      const state = ytPlayer.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        ytPlayer.pauseVideo();
        updatePlayPauseIcon(false);
      } else {
        ytPlayer.playVideo();
        updatePlayPauseIcon(true);
      }
    } else {
      if (audio.paused) {
        audio.play();
        updatePlayPauseIcon(true);
      } else {
        audio.pause();
        updatePlayPauseIcon(false);
      }
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

  // audio events
  audio.addEventListener("loadedmetadata", () => {
    if (!isCurrentYT) {
      durationTimeText.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (!isCurrentYT && Number.isFinite(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
      setSliderFill(progressBar, '--prog-pos');
      currentTimeText.textContent = formatTime(audio.currentTime);
      durationTimeText.textContent = formatTime(audio.duration);
      updateTimePosition(progress, currentTimeText);
    }
  });

  audio.addEventListener("ended", () => {
    if (!isCurrentYT) {
      activePlaylist.playNext();
      playSongAtIndex();
    }
  });

  // ticker for YT timeupdate
  setInterval(() => {
    if (isCurrentYT && ytPlayer && isYTReady && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      const duration = ytPlayer.getDuration();
      const currentTime = ytPlayer.getCurrentTime();
      if (duration && duration > 0) {
        const progress = (currentTime / duration) * 100;
        progressBar.value = progress;
        setSliderFill(progressBar, '--prog-pos');
        currentTimeText.textContent = formatTime(currentTime);
        durationTimeText.textContent = formatTime(duration);
        updateTimePosition(progress, currentTimeText);
      }
    }
  }, 250);

  // progress bar input
  progressBar.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    if (isCurrentYT && ytPlayer && isYTReady && ytPlayer.getDuration) {
      const duration = ytPlayer.getDuration();
      if (duration) {
        const newTime = (val / 100) * duration;
        ytPlayer.seekTo(newTime, true);
        currentTimeText.textContent = formatTime(newTime);
        updateTimePosition(val, currentTimeText);
      }
    } else if (Number.isFinite(audio.duration)) {
      audio.currentTime = (val / 100) * audio.duration;
      currentTimeText.textContent = formatTime(audio.currentTime);
      updateTimePosition(val, currentTimeText);
    }
    setSliderFill(progressBar, '--prog-pos');
  });

  // volume input
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseFloat(e.target.value);
    audio.volume = currentVolume;
    if (ytPlayer && isYTReady && ytPlayer.setVolume) {
      ytPlayer.setVolume(currentVolume * 100);
    }
    setSliderFill(volumeSlider, '--vol-pos');
  });

  // initial play
  playSongAtIndex();
}

setupMusicPlayer();