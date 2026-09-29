// This is a modified version of the music player
// used in the mod All The Way.
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

let activePlaylist = new Playlist();
let audioInstance = null;
let currentVolume = 3;

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
let getAudioAmplitude = (time) => 0;

// assets
const ASSETS = {
  bg: "https://i.imgur.com/57IeWZc.png",
  infoBg: "https://i.imgur.com/BSXotSO.png",
  needle: "https://i.imgur.com/ohd0XR3.png",
  btnPrev: "https://i.imgur.com/Zkk16Uy.png",
  btnPlay: "https://i.imgur.com/Kb4y3wX.png",
  btnPause: "https://i.imgur.com/LxQnVBj.png",
  btnNext: "https://i.imgur.com/P39RRW4.png",
  volIcon: "https://i.imgur.com/jjUzV10.png"
};

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;
  updateUI(activePlaylist);

  // ensure audio exists before trying to access it
  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    backendSetSrcAndLoad(song, audio);
    decodeSongAudio(song);
    startYTProgressPump();
    backendPlay(audio)
      .then(() => updatePlayPauseIcon(true))
      .catch(() => updatePlayPauseIcon(false));
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
  if (btn) btn.src = isPlaying ? ASSETS.btnPause : ASSETS.btnPlay;
}

function decodeSongAudio(song) {
  if (!song || isYouTubeSong(song)) return null;
  return decodeAudio(song.getAudioLink());
}

// audio decoding for needle animation
async function isBraveBrowser() {
  return (window.navigator.brave && await window.navigator.brave.isBrave());
}

async function decodeAudio(audioSrc) {
  try {
    if (await isBraveBrowser()) return null;

    const audioContext = new AudioContext();
    const response = await fetch(audioSrc);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await audioContext.decodeAudioData(arrayBuffer);

    const sampleRate = buffer.sampleRate;
    const totalSamples = buffer.length;
    const numChannels = buffer.numberOfChannels;

    const downsampleFactor = 32;
    const reducedSize = Math.floor(totalSamples / downsampleFactor);

    let amplitudes = new Float32Array(reducedSize);
    let meanAmplitude = 0;

    for (let i = 0; i < reducedSize; i++) {
      let sum = 0;
      for (let channel = 0; channel < numChannels; channel++) {
        sum += buffer.getChannelData(channel)[i * downsampleFactor] ** 2;
      }
      amplitudes[i] = sum / numChannels;
      meanAmplitude += amplitudes[i];
    }

    meanAmplitude /= reducedSize;

    getAudioAmplitude = function (time) {
      const delay = 0.17;
      let index = Math.floor((time + delay) * sampleRate / downsampleFactor);
      index = Math.min(index, reducedSize - 1);
      let amplitudeNorm = amplitudes[index] / (2 * meanAmplitude);
      return Math.min(amplitudeNorm, 1);
    };

    console.log("Audio decoded successfully!");
  } catch (error) {
    console.error("Error decoding audio:", error);
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
    ["Prologue,ㅤㅤㅤㅤAugust 29, 1968", "Chicago", "https://i.imgur.com/b8r5Ra2.png", "https://audio.jukehost.co.uk/XyheafOeHYEYfQDdMelpUxukLIIADylT"],
    ["Time Has Come Today", "The Chambers Brothers", "https://i.imgur.com/6Vp00L3.png", "https://audio.jukehost.co.uk/82lHVMezJxSmxSjnfqc741flU7nh6L80"],
    ["Summertime", "Big Brother & The Holding Company", "https://i.imgur.com/e4RoHcB.png", "https://audio.jukehost.co.uk/KTCoqLZyPDcJem5VThmsV3jY6Msk2bDs"],
    ["Coffee Cold", "Galt MacDermot", "https://i.imgur.com/waC4T60.png", "https://audio.jukehost.co.uk/lLCs02yVw3VQuiIXftCNl92A9E6UgJM8"],
    ["California Dreamin'", "Bobby Womack", "https://i.imgur.com/MiopO4X.png", "https://audio.jukehost.co.uk/8SsMNO7WhAZZFNSqnT5lmGO15zYeG5Zc"],
    ["While My Guitar Gently Weeps", "The Beatles", "https://i.imgur.com/aD89GIe.png", "https://audio.jukehost.co.uk/wpGBWAcoa3ESzqWWsabdDTz2Abgb7m3J"],
    ["If I Can Dream", "Elvis Presley", "https://i.imgur.com/2l1GDRz.png", "https://audio.jukehost.co.uk/SOXH6LMirjYFqNHPLKbWYo7UwkYNAWY9"],
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
    }
    #display-box {
      display: flex;
      align-items: center;
      width: 50%;
    }
    #cover {
      width: 176px;
      height: 176px;
    }
    #info-container {
      display: flex;
      flex-direction: row;
      height: 178px;
      width: 127px;
      margin-top: 3px;
      background-image: url('${ASSETS.infoBg}');
      background-size: cover;
      color: #cfcfcf;
      position: relative;
    }
    #song-info {
      width: 100%;
      padding: 5px;
    }
    #title {
      font-weight: normal;
      font-size: 1.025em;
      line-height: 17px;
    }
    #controls-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
      width: 100%;
      padding-top: 15px;
    }
    #controls {
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 80%;
    }
    #controls img {
      cursor: pointer;
    }
    #controls img:active {
      filter: brightness(0.4);
    }
    #needle {
      position: absolute;
      top: 0;
      left: 0;
      width: 127px;
      height: 352px;
      transform-origin: 50% 50%;
      transform: rotate(-45deg);
      transition: transform 0.3s ease;
      pointer-events: none;
      user-select: none;
      z-index: 9999;
      outline: none;
      border: none;
    }

    input[type=range] {
      appearance: none;
      background: #e0e0e0;
      border-radius: 2px;
      outline: none;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.6);
    }

    #progress-bar-container {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    #progress-bar {
      width: 80%;
      height: 4px;
      margin-top: 20px;
      cursor: pointer;
    }
    #progress-bar::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      background: #333;
      border: 2px solid #f1f1f1;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.7);
    }
    #progress-bar::-moz-range-thumb {
      width: 12px;
      height: 12px;
      background: #333;
      border: 2px solid #f1f1f1;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.7);
    }

    /* Vertical Volume Slider */
    .is-vertical {
      margin-left: -16%;
      height: 126px;
      display: flex;
      justify-content: center;
    }
    #volumeSlider {
      width: 4px;
      height: 100%;
      writing-mode: vertical-rl;
      direction: rtl;
      cursor: pointer;
    }
    #volumeSlider::-webkit-slider-thumb {
      appearance: none;
      width: 22px;
      height: 12px;
      background: #a86b32;
      border: 1px solid #4a2a10;
      border-radius: 2px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.6);
    }
    #volumeSlider::-moz-range-thumb {
      width: 22px;
      height: 10px;
      background: #a86b32;
      border: 1px solid #4a2a10;
      border-radius: 2px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.6);
    }

    #volume-display {
      font-weight: bold;
      display: none;
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
        <img id="needle" src="${ASSETS.needle}">
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
      <div class="is-vertical">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="${currentVolume}">
      </div>
      <span id="volume-display">${currentVolume}</span>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) {
    backendSetSrcAndLoad(startSong, audio);
    decodeSongAudio(startSong);
  }
  backendSetVolume(audio, currentVolume / 9);

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volumeSlider");
  const volDisplay = document.getElementById("volume-display");
  const needle = document.getElementById("needle");

  // play/pause
  playPauseBtn.addEventListener("click", () => {
    if (isYouTubeSong(ytCurrentSong())) {
      const isPlaying = window.YT?.PlayerState
        ? ytPlayer?.getPlayerState?.() === YT.PlayerState.PLAYING
        : false;
      if (isPlaying) {
        backendPause(audio);
        updatePlayPauseIcon(false);
        needle.style.transform = "rotate(-45deg)";
      } else {
        backendPlay(audio);
        updatePlayPauseIcon(true);
      }
      return;
    }

    if (audio.paused) {
      backendPlay(audio);
      updatePlayPauseIcon(true);
    } else {
      backendPause(audio);
      needle.style.transform = "rotate(-45deg)";
      updatePlayPauseIcon(false);
    }
  });

  // next/prev
  const playSongAtIndex = () => {
    const song = activePlaylist.getCurrentSong();
    if (!song) return;
    updateUI(activePlaylist);
    backendSetSrcAndLoad(song, audio);
    decodeSongAudio(song);
    startYTProgressPump();
    backendPlay(audio)
      .then(() => updatePlayPauseIcon(true))
      .catch(() => updatePlayPauseIcon(false));
  };

  ytHooks.onEnded = () => {
    activePlaylist.playNext();
    playSongAtIndex();
  };

  ytHooks.onProgress = (current, duration) => {
    if (duration > 0) progressBar.value = (current / duration) * 100;
  };

  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playSongAtIndex();
  });

  // progress bar & needle update
  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration)) {
      progressBar.value = (audio.currentTime / audio.duration) * 100;
    }

    // needle dynamic rotation based on amplitude
    const MIN_DEG = -45, MAX_DEG = 45;
    let amplitude = audio.paused ? 0 : getAudioAmplitude(audio.currentTime);
    let degrees = MIN_DEG + amplitude * (MAX_DEG - MIN_DEG);
    needle.style.transform = `rotate(${degrees}deg)`;
  });

  const advancePlaylist = () => {
    activePlaylist.playNext();
    playSongAtIndex();
  };

  audio.addEventListener("ended", advancePlaylist);

  progressBar.addEventListener("input", () => {
    const duration = backendGetDuration();
    if (duration > 0) backendSeekTo((progressBar.value / 100) * duration);
  });

  // volume
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    volDisplay.textContent = currentVolume;
    backendSetVolume(audio, currentVolume / 9);
  });

  // initial play
  updateUI(activePlaylist);
  startYTProgressPump();
  backendPlay(audio)
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}
setupMusicPlayer();
