// This is a recreation of the music player
// showcased in the mod Final Cut sneak peeks.
class Song {
  constructor(title, artist, coverLink, audioOrYouTube) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;

    // detect and parse YouTube IDs, otherwise treat as standard audio link
    const ytMatch = audioOrYouTube?.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/
    );

    if (ytMatch) {
      this.youtubeId = ytMatch[1];
      this.audioLink = null;
    } else {
      this.youtubeId = null;
      this.audioLink = audioOrYouTube || null;
    }
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

let ytApiReady = false;
let ytPlayer = null;
let ytPlayerReady = false;
let ytProgressTimer = null;
let ytAutoAdvancing = false;

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

// assets
const ASSETS = {
  bg: "https://raw.githubusercontent.com/StrawberryMaster/womble/refs/heads/main/images/fc_background.png",
  infoBg: "https://i.imgur.com/BSXotSO.png",
  btnPrev: "https://i.imgur.com/Zkk16Uy.png",
  btnPlay: "https://i.imgur.com/Kb4y3wX.png",
  btnPause: "https://i.imgur.com/LxQnVBj.png",
  btnNext: "https://i.imgur.com/P39RRW4.png",
  volIcon: "https://i.imgur.com/jjUzV10.png"
};

// YouTube & Audio Backend Helpers
function isYouTubeSong(song) {
  return !!song?.getYouTubeId?.();
}

function stopYTProgressPump() {
  if (ytProgressTimer) {
    clearInterval(ytProgressTimer);
    ytProgressTimer = null;
  }
}

function startYTProgressPump(progressBar) {
  stopYTProgressPump();
  ytProgressTimer = setInterval(() => {
    if (!progressBar) return;
    const duration = backendGetDuration();
    const current = backendGetCurrentTime();
    const progress = duration > 0 ? (current / duration) * 100 : 0;
    progressBar.value = progress;
  }, 250);
}

function syncYTVolumeFromSlider() {
  if (!ytPlayer) return;
  const volumePercent = Math.round((currentVolume / 9) * 100);
  ytPlayer.setVolume(volumePercent);
  if (currentVolume === 0) ytPlayer.mute();
  else ytPlayer.unMute();
}

function ensureYTPlayer(onReady) {
  const createPlayer = () => {
    if (ytPlayer) {
      onReady?.();
      return;
    }

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
          ytPlayerReady = true;
          syncYTVolumeFromSlider();
          onReady?.();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) {
            ytAutoAdvancing = true;
            window._onSongEnded?.();
          }
          if (e.data === YT.PlayerState.PLAYING && ytAutoAdvancing) {
            syncYTVolumeFromSlider();
            ytAutoAdvancing = false;
          }
        }
      }
    });
  };

  if (!ytApiReady || !window.YT || !window.YT.Player) {
    const timer = setInterval(() => {
      if (ytApiReady && window.YT && window.YT.Player) {
        clearInterval(timer);
        createPlayer();
      }
    }, 50);
  } else {
    createPlayer();
  }
}

function backendSetSrcAndLoad(song, audio, progressBar) {
  if (!song) return;

  if (isYouTubeSong(song)) {
    ensureYTPlayer(() => {
      const id = song.getYouTubeId();
      if (ytAutoAdvancing) {
        try { ytPlayer.mute(); } catch (e) {}
        ytPlayer?.loadVideoById?.(id);
      } else {
        ytPlayer?.loadVideoById?.(id);
        syncYTVolumeFromSlider();
      }
      if (progressBar) startYTProgressPump(progressBar);
    });

    audio.pause();
    audio.src = "";
    audio.load();
  } else {
    stopYTProgressPump();
    if (ytPlayer) ytPlayer.stopVideo?.();
    audio.src = song.getAudioLink() || "";
    audio.load();
  }
}

function backendPlay(audio) {
  const song = activePlaylist.getCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ensureYTPlayer(() => {
      ytPlayer?.playVideo?.();
    });
  } else {
    audio.play().catch(e => console.log("Playback deferred for user interaction.", e));
  }
}

function backendPause(audio) {
  const song = activePlaylist.getCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ytPlayer?.pauseVideo?.();
  } else {
    audio.pause();
  }
}

function backendSetVolume(audio, volumeFraction) {
  audio.volume = volumeFraction;
  if (ytPlayer) {
    ytPlayer.setVolume(Math.round(volumeFraction * 100));
    if (volumeFraction === 0) ytPlayer.mute();
    else ytPlayer.unMute();
  }
}

function backendGetCurrentTime() {
  const song = activePlaylist.getCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    return ytPlayer.getCurrentTime?.() || 0;
  }
  const audio = document.getElementById("audio");
  return audio ? audio.currentTime || 0 : 0;
}

function backendGetDuration() {
  const song = activePlaylist.getCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    return ytPlayer.getDuration?.() || 0;
  }
  const audio = document.getElementById("audio");
  return audio ? audio.duration || 0 : 0;
}

function backendSeekTo(seconds) {
  const song = activePlaylist.getCurrentSong();
  const audio = document.getElementById("audio");
  if (isYouTubeSong(song) && ytPlayer) {
    ytPlayer.seekTo(seconds, true);
  } else if (audio && audio.duration > 0) {
    audio.currentTime = seconds;
  }
}

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  const player = document.getElementById("player");

  if (!player || !currentSong) return;

  const cover = player.querySelector("#cover");
  const title = player.querySelector("#title");
  const artist = player.querySelector("#artist");

  if (cover) cover.src = currentSong.getCoverLink() || "";
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();
}
window.updateUI = updateUI;

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;
  updateUI(activePlaylist);

  const audio = getAudioElement();
  const progressBar = document.getElementById("progress-bar");
  const playPauseButton = document.getElementById("playPauseButton");

  backendSetSrcAndLoad(activePlaylist.getCurrentSong(), audio, progressBar);
  backendPlay(audio);
  if (playPauseButton) playPauseButton.src = ASSETS.btnPause;
}
window.changePlaylist = changePlaylist;

// helper to get or create HTML5 audio element
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
      border: 3px solid #2D1803;
      display: flex;
      flex-direction: row;
      height: 191px;
      background-image: url("${ASSETS.bg}");
      background-size: contain;
      box-sizing: border-box;
    }
    #display-box {
      display: flex;
      align-items: center;
      width: auto;
      margin-left: 145px;
    }
    #cover {
      width: 176px;
      height: 176px;
    }
    #info-container {
      display: flex;
      flex-direction: row;
      height: 178px;
      width: 130px;
      margin-left: 2px;
      margin-top: 5px;
      background-size: cover;
      color: #090000;
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
      margin: 10px 0 0 10px;
      width: 33%;
    }
    #progress-bar-container {
      width: 100%;
      display: flex;
      margin-top: 3px;
      margin-bottom: 22px;
    }
    #progress-bar {
      width: 95%;
      height: 4px;
      cursor: pointer;
    }
    #controls {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      gap: 12px;
      margin-left: 70px;
      margin-top: -20px;
    }
    #controls img {
      cursor: pointer;
    }
    #controls img:active {
      filter: brightness(0.4);
    }

    input[type=range] {
      appearance: none;
      background: #e0e0e0;
      border-radius: 2px;
      outline: none;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.6);
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

    /* Volume Slider */
    #volume-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .is-vertical {
      height: 126px;
      display: flex;
      justify-content: center;
      margin-top: 4px;
    }
    #volumeSlider {
      width: 7px;
      height: 100%;
      writing-mode: vertical-rl;
      direction: rtl;
      cursor: pointer;
      background: #dedede;
      border-radius: 1px;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);
    }
    #volumeSlider::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 6px;
      background: #232323;
      border: 1px solid #111;
      border-radius: 1px;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.7);
    }
    #volumeSlider::-moz-range-thumb {
      width: 16px;
      height: 6px;
      background: #232323;
      border: 1px solid #111;
      border-radius: 1px;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.7);
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
        <div id="song-info">
          <h3 id="title"></h3>
          <p id="artist"></p>
        </div>
      </div>
    </div>
    <div id="controls-container">
      <div id="progress-bar-container">
        <input type="range" id="progress-bar" value="0" max="100" step="0.1">
      </div>
      <div id="controls">
        <img id="prevButton" src="${ASSETS.btnPrev}" alt="Previous">
        <img id="playPauseButton" src="${ASSETS.btnPause}" alt="Play/Pause">
        <img id="nextButton" src="${ASSETS.btnNext}" alt="Next">
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

  const audio = getAudioElement();
  audio.volume = currentVolume / 9;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volumeSlider");
  const volDisplay = document.getElementById("volume-display");

  // advance song handler
  window._onSongEnded = function () {
    activePlaylist.playNext();
    updateUI(activePlaylist);
    backendSetSrcAndLoad(activePlaylist.getCurrentSong(), audio, progressBar);
    backendPlay(audio);
    updatePlayPauseIcon(true);
  };

  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    backendSetSrcAndLoad(activePlaylist.getCurrentSong(), audio, progressBar);
    backendPlay(audio);
    updatePlayPauseIcon(true);
  };

  // play/pause
  playPauseBtn.addEventListener("click", () => {
    const song = activePlaylist.getCurrentSong();
    let isPaused = true;

    if (isYouTubeSong(song)) {
      const state = ytPlayer?.getPlayerState?.();
      isPaused = !(state === YT.PlayerState.PLAYING);
    } else {
      isPaused = audio.paused;
    }

    if (isPaused) {
      backendPlay(audio);
      updatePlayPauseIcon(true);
    } else {
      backendPause(audio);
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

  // audio progress & end events
  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  audio.addEventListener("ended", () => {
    window._onSongEnded();
  });

  // scrubbing
  progressBar.addEventListener("input", () => {
    const duration = backendGetDuration();
    if (duration > 0) {
      const seekTime = (progressBar.value / 100) * duration;
      backendSeekTo(seekTime);
    }
  });

  // volume control
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    volDisplay.textContent = currentVolume;
    backendSetVolume(audio, currentVolume / 9);
  });

  // initial load and play
  updateUI(activePlaylist);
  backendSetSrcAndLoad(activePlaylist.getCurrentSong(), audio, progressBar);
  backendPlay(audio);
  updatePlayPauseIcon(true);
}

setupMusicPlayer();