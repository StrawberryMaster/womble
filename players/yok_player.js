// This is a modified version of the music player
// used in the mod Y. of Korea.

class Song {
  constructor(title, artist, coverLink, audioOrYouTube) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;

    // detect and parse YouTube IDs, otherwise treat as a standard audio link
    this.youtubeId = extractYouTubeId(audioOrYouTube);
    this.audioLink = this.youtubeId ? null : (audioOrYouTube || null);
  }
  getTitle() { return this.title; }
  getArtist() { return this.artist; }
  getCoverLink() { return this.coverLink; }
  getAudioLink() { return this.audioLink; }
  getYouTubeId() { return this.youtubeId; }
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

// YouTube URL support
let ytApiReady = false;
let ytPlayer = null;
let ytPlayerReady = false;
let ytConstructing = false;
let ytReadyPending = false;
let ytProgressTimer = null;
let backendVolume = 1;

const ytHooks = {
  onEnded: null,
  onProgress: null
};

const ytCallbacks = [];

function flushYTCallbacks() {
  while (ytCallbacks.length) {
    const cb = ytCallbacks.shift();
    try {
      cb?.();
    } catch (e) {
      console.log("YouTube player callback failed.", e);
    }
  }
}

function extractYouTubeId(url) {
  if (typeof url !== "string") return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

function isYouTubeSong(song) {
  return !!song?.getYouTubeId?.();
}

(function injectYouTubeAPI() {
  if (document.getElementById("yt-iframe-api")) return;
  const tag = document.createElement("script");
  tag.id = "yt-iframe-api";
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
})();

window.onYouTubeIframeAPIReady = function () {
  ytApiReady = true;
};

function applyVolumeToYT() {
  if (!ytPlayer) return;
  try {
    ytPlayer.setVolume(Math.round(backendVolume * 100));
    if (backendVolume === 0) ytPlayer.mute();
    else ytPlayer.unMute();
  } catch (e) {}
}

function ensureYTPlayer(onReady) {
  if (onReady) ytCallbacks.push(onReady);
  if (ytPlayer && ytPlayerReady) {
    flushYTCallbacks();
    return;
  }
  if (ytConstructing) return;

  const createPlayer = () => {
    const holder = document.getElementById("ytplayer") || (() => {
      const el = document.createElement("div");
      el.id = "ytplayer";
      el.style.width = "0px";
      el.style.height = "0px";
      el.style.position = "absolute";
      el.style.overflow = "hidden";
      el.style.pointerEvents = "none";
      document.body.appendChild(el);
      return el;
    })();

    ytConstructing = true;
    try {
      ytPlayer = new YT.Player(holder, {
        height: "0",
        width: "0",
        videoId: "",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          playsinline: 1
        },
        events: {
          onReady: () => {
            if (ytConstructing) {
              ytReadyPending = true;
              return;
            }
            ytPlayerReady = true;
            applyVolumeToYT();
            flushYTCallbacks();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) {
              ytHooks.onEnded?.();
            }
            if (e.data === YT.PlayerState.PLAYING) {
              applyVolumeToYT();
            }
          }
        }
      });
    } catch (e) {
      ytConstructing = false;
      console.log("Could not create the YouTube player.", e);
      return;
    }
    ytConstructing = false;

    if (ytReadyPending) {
      ytReadyPending = false;
      ytPlayerReady = true;
      applyVolumeToYT();
      flushYTCallbacks();
    }
  };

  if (ytApiReady && window.YT && window.YT.Player) {
    createPlayer();
  } else {
    const timer = setInterval(() => {
      if (ytApiReady && window.YT && window.YT.Player) {
        clearInterval(timer);
        createPlayer();
      }
    }, 50);
  }
}

function stopYTProgressPump() {
  if (ytProgressTimer) {
    clearInterval(ytProgressTimer);
    ytProgressTimer = null;
  }
}

function startYTProgressPump() {
  stopYTProgressPump();
  ytProgressTimer = setInterval(() => {
    ytHooks.onProgress?.(backendGetCurrentTime(), backendGetDuration());
  }, 250);
}

function backendSetSrcAndLoad(song, audio) {
  if (!song) return;

  if (isYouTubeSong(song)) {
    stopYTProgressPump();
    ensureYTPlayer(() => {
      ytPlayer.loadVideoById(song.getYouTubeId());
      applyVolumeToYT();
    });
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  } else {
    stopYTProgressPump();
    if (ytPlayer) {
      try { ytPlayer.stopVideo(); } catch (e) {}
    }
    audio.src = song.getAudioLink() || "";
    audio.load();
  }
}

function ytCurrentSong() { return activePlaylist.getCurrentSong(); }
function ytAudioElement() { return getAudioElement(); }

function backendPlay(audio) {
  const song = ytCurrentSong();
  if (!song) return Promise.resolve();

  if (isYouTubeSong(song)) {
    return new Promise((resolve) => {
      ensureYTPlayer(() => {
        ytPlayer.playVideo();
        resolve();
      });
    });
  }

  return audio.play().catch(e => {
    console.log("Playback deferred for user interaction.", e);
  });
}

function backendPause(audio) {
  const song = ytCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ytPlayer?.pauseVideo?.();
  } else {
    audio.pause();
  }
}

function backendSetVolume(audio, volume) {
  backendVolume = volume;
  audio.volume = volume;
  if (isYouTubeSong(ytCurrentSong())) applyVolumeToYT();
}

function backendGetCurrentTime() {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) return ytPlayer.getCurrentTime?.() || 0;
  const audio = ytAudioElement();
  return audio ? audio.currentTime || 0 : 0;
}

function backendGetDuration() {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) return ytPlayer.getDuration?.() || 0;
  const audio = ytAudioElement();
  return audio ? audio.duration || 0 : 0;
}

function backendSeekTo(seconds) {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    ytPlayer.seekTo(seconds, true);
  } else {
    const audio = ytAudioElement();
    if (audio && Number.isFinite(audio.duration)) audio.currentTime = seconds;
  }
}

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
    backendSetSrcAndLoad(song, audio);
    startYTProgressPump();
    backendPlay(audio)
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
  if (startSong) backendSetSrcAndLoad(startSong, audio);
  backendSetVolume(audio, currentVolume / 9);

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volume-slider");
  const volDisplay = document.getElementById("volume-display");

  playPauseBtn.addEventListener("click", () => {
    if (isYouTubeSong(ytCurrentSong())) {
      const playing = window.YT?.PlayerState
        ? ytPlayer?.getPlayerState?.() === YT.PlayerState.PLAYING
        : false;
      if (playing) {
        backendPause(audio);
        updatePlayPauseIcon(false);
      } else {
        backendPlay(audio);
        updatePlayPauseIcon(true);
      }
      return;
    }

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
    backendSetSrcAndLoad(activePlaylist.getCurrentSong(), audio);
    startYTProgressPump();
    updateProgressBarFill(progressBar, 0);
    backendPlay(audio)
      .then(() => updatePlayPauseIcon(true))
      .catch(err => console.log("Playback action deferred", err));
  };

  ytHooks.onEnded = () => {
    activePlaylist.playNext();
    playActiveTrack();
  };

  ytHooks.onProgress = () => {
    const duration = backendGetDuration();
    if (Number.isFinite(duration) && duration > 0) {
      const progress = (backendGetCurrentTime() / duration) * 100;
      progressBar.value = progress;
      updateProgressBarFill(progressBar, progress);
    }
  };

  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playActiveTrack();
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playActiveTrack();
  });

  const paintProgress = () => {
    const duration = backendGetDuration();
    if (Number.isFinite(duration) && duration > 0) {
      const progress = (backendGetCurrentTime() / duration) * 100;
      progressBar.value = progress;
      updateProgressBarFill(progressBar, progress);
    }
  };

  audio.addEventListener("timeupdate", paintProgress);

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playActiveTrack();
  });

  progressBar.addEventListener("input", () => {
    const duration = backendGetDuration();
    if (Number.isFinite(duration) && duration > 0) {
      backendSeekTo((progressBar.value / 100) * duration);
      updateProgressBarFill(progressBar, progressBar.value);
    }
  });

  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    volDisplay.textContent = currentVolume;
    backendSetVolume(audio, currentVolume / 9);
  });

  updateUI(activePlaylist);
  startYTProgressPump();
  backendPlay(audio)
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

setupMusicPlayer();