// This is a modified version of the music player
// used in Things That Never Were.

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
    playNext() { this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length; }
    playPrevious() { this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length; }
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

function ytCurrentSong() { return playlist.getCurrentSong(); }
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

// globals
let playlist = new Playlist();
let rfk_playlist = new Playlist();
let rep_playlist = new Playlist();
let audioInstance = null;
let currentVolume = 1;
let currentTheme = "RFK"; // tracks active playlist theme

// button toggle tracking
let ppBTN = "https://i.imgur.com/KRddgx9.png";
let ppBTN_pause = "https://i.imgur.com/IO44pbG.png";

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
    backendSetSrcAndLoad(playlist.getCurrentSong(), audio);
    startYTProgressPump();
    backendPlay(audio).then(() => updatePlayPauseIcon(true));
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

function playCurrentSong() {
    updateUI(playlist);
    const audio = getAudioElement();
    backendSetSrcAndLoad(playlist.getCurrentSong(), audio);
    startYTProgressPump();
    backendPlay(audio).then(() => updatePlayPauseIcon(true));
}

// setup
function setupMusicPlayer() {
    const gameWindow_player = document.getElementById("game_window");
    if (!gameWindow_player) return;

    // prevent duplicate players
    const existingPlayer = document.getElementById("player");
    if (existingPlayer) existingPlayer.remove();

    playlist = new Playlist();
    rfk_playlist = new Playlist();
    rep_playlist = new Playlist();

    const commonSongs = [
        ["Dear Boy", "Paul McCartney", "https://i.imgur.com/cMRraQk.png", "https://audio.jukehost.co.uk/ZZVLpos0tLqOCSi0CSKFdlSoAbfbfRZl"],
        ["Uncle Albert/Admiral Halsey", "Paul McCartney", "https://i.imgur.com/cMRraQk.png", "https://audio.jukehost.co.uk/bKLFsbsVrlir9M2QXxm27CMzdW85113U"],
        ["I'm Still in Love with You", "Al Green", "https://i.imgur.com/Pw9Jidu.png", "https://audio.jukehost.co.uk/Be83hVY5wR1x2xcjVLaxHguuZ2Quyy0A"],
        ["My Whole World Ended", "David Ruffin", "https://i.imgur.com/qVVtZuR.png", "https://audio.jukehost.co.uk/GLV4WY4TywEf4sA1n4nOdVk9zqTaWkjO"],
        ["Nights In White Satin", "The Moody Blues", "https://i.imgur.com/0FbXJ7e.png", "https://audio.jukehost.co.uk/UP4ZQQVhMJXrRIJEkIdoCDOAKGAPdYsB"]
    ];

    const songRFK = new Song("Company", "Dean Jones", "https://i.imgur.com/4aRIys9.png", "https://audio.jukehost.co.uk/1MrAYcjHVGI1ldMQoLvEFkByR0qNtldI");
    const songREP = new Song("I Believe in You", "Robert Morse", "https://i.imgur.com/Ets8X5z.png", "https://audio.jukehost.co.uk/mADm02cj0T8ouVlDG94zb9BxGN2yx6Tr");

    rfk_playlist.addSong(songRFK);
    rep_playlist.addSong(songREP);

    commonSongs.forEach(data => {
        let s = new Song(data[0], data[1], data[2], data[3]);
        rfk_playlist.addSong(s);
        rep_playlist.addSong(s);
    });

    // create HTML
    const playerContainer = document.createElement("div");
    playerContainer.id = "player";
    playerContainer.innerHTML = `
    <img id="cover" title="Click to switch playlist">

    <div id="center-column">
      <div id="song-info">
        <p id="artist"></p>
        <h3 id="title"></h3>
      </div>

      <div id="progress-bar-container">
        <!-- quirk: using progress element instead of input range -->
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
    backendSetVolume(audio, currentVolume / 9);

    const playPauseBtn = document.getElementById("playPauseButton");
    const prevBtn = document.getElementById("prevButton");
    const nextBtn = document.getElementById("nextButton");
    const progressBar = document.getElementById("progress-bar");
    const volumeSlider = document.getElementById("volumeSlider");
    const coverImg = document.getElementById("cover");

    // playlist switching via cover click
    coverImg.addEventListener("click", () => {
        if (currentTheme === "RFK") {
            currentTheme = "REP";
            changePlaylist(rep_playlist);
            changePlayerStyle("https://i.imgur.com/8SKzKLX.png", "#02A6CF");
        } else {
            currentTheme = "RFK";
            changePlaylist(rfk_playlist);
            changePlayerStyle("https://i.imgur.com/nNt9E10.png", "#B42D1B");
        }
    });

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

        if (audio.paused) safePlay(audio);
        else { audio.pause(); updatePlayPauseIcon(false); }
    });

    nextBtn.addEventListener("click", () => { playlist.playNext(); playCurrentSong(); });
    prevBtn.addEventListener("click", () => { playlist.playPrevious(); playCurrentSong(); });

    ytHooks.onEnded = () => {
        playlist.playNext();
        playCurrentSong();
    };

    // progress bars
    progressBar.addEventListener("click", function (e) {
        const duration = backendGetDuration();
        if (!duration || isNaN(duration)) return;
        const rect = this.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        backendSeekTo(percent * duration);
    });

    const paintProgress = () => {
        const duration = backendGetDuration();
        if (duration && !isNaN(duration)) {
            progressBar.value = (backendGetCurrentTime() / duration) * 100;
        }
    };

    audio.addEventListener("timeupdate", paintProgress);

    ytHooks.onProgress = () => paintProgress();

    audio.addEventListener("ended", () => {
        playlist.playNext();
        playCurrentSong();
    });

    volumeSlider.addEventListener("input", function () {
        currentVolume = parseInt(this.value, 10);
        backendSetVolume(audio, currentVolume / 9);
    });

    // inject CSS
    if (!document.getElementById("tape-base-style")) {
        document.documentElement.style.setProperty('--theme-color', "#B42D1B");
        const style = document.createElement("style");
        style.id = "tape-base-style";
        style.textContent = `
    #player {
      position: relative;
      border: 1px solid #C9C9C9;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 191px;
      background-size: cover;
      background-position: center;
      font-family: Arial, sans-serif;
    }

    #cover {
      width: 176px;
      height: 176px;
      margin-left: 11px;
      cursor: pointer;
      z-index: 2;
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
      color: var(--theme-color);
      margin-bottom: 2px;
	  margin-left: 100px;
      margin-top: 5px;
    }

    #artist {
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 2px 0;
      white-space: nowrap;
    }

    #title {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
      white-space: nowrap;
    }

    #progress-bar-container {
      width: 560px;
      height: 18px;
      margin-bottom: 8px;
	  margin-left: 100px;
      border-radius: 5px;
    }

    #progress-bar {
      width: 100%;
      height: 100%;
      appearance: none;
      -webkit-appearance: none;
      border: none;
      cursor: pointer;
      background-color: transparent;
      background-size: 100% 100%;
    }

    #progress-bar::-webkit-progress-bar { background-color: transparent; }
    #progress-bar::-webkit-progress-value { background-color: var(--theme-color); }
    #progress-bar::-moz-progress-bar { background-color: var(--theme-color); }
    #progress-bar::-ms-fill { background-color: var(--theme-color); }

    #controls {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 18px;
    }

    #controls img {
      cursor: pointer;
      height: 35px;
    }

    #prevButton, #nextButton { width: 38px; }
    #playPauseButton { width: 57px; }

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
      height: 173px;
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: rotate(-90deg);
      transform-origin: center;
    }

    #volumeSlider {
      width: 173px;
      height: 10px;
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      border-left: 3px solid var(--theme-color);
      border-right: 3px solid var(--theme-color);
      padding: 0 3px;
    }

    #volumeSlider::-webkit-slider-runnable-track { width: 100%; height: 4px;  border-radius: 0px; }
    #volumeSlider::-moz-range-track { width: 100%; height: 4px; border-radius: 0px; }
    #volumeSlider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; background: var(--theme-color); border: none; width: 15px; height: 4px; margin-top: -4px; border-radius: 0px; }
    #volumeSlider::-moz-range-thumb { background: var(--theme-color); border: 1px solid var(--theme-color); width: 15px; height: 4px; border-radius: 0px; }
    `;
        document.head.appendChild(style);
    }

    // start player
    changePlaylist(rfk_playlist);
    changePlayerStyle("https://i.imgur.com/nNt9E10.png", "#B42D1B");
}

// player style swapper
function changePlayerStyle(bgImage, txtColor) {
    document.documentElement.style.setProperty('--theme-color', txtColor);

    const playerElement = document.getElementById("player");
    const progBar = document.getElementById("progress-bar");
    const prevBtn = document.getElementById("prevButton");
    const ppBtn = document.getElementById("playPauseButton");
    const ffBtn = document.getElementById("nextButton");

    if (playerElement) playerElement.style.backgroundImage = `url("${bgImage}")`;

    if (bgImage === "https://i.imgur.com/8SKzKLX.png") { // blue theme
        if (progBar) progBar.style.backgroundImage = `url("https://i.imgur.com/rnjhNUP.png")`;
        if (prevBtn) prevBtn.src = "https://i.imgur.com/ve5zlYr.png";
        if (ppBtn) ppBtn.src = "https://i.imgur.com/JvAtC7d.png";
        if (ffBtn) ffBtn.src = "https://i.imgur.com/AEr4q3y.png";
        ppBTN = "https://i.imgur.com/JvAtC7d.png";
        ppBTN_pause = "https://i.imgur.com/XbvsrNf.png";
    } else { // red theme
        if (progBar) progBar.style.backgroundImage = `url("https://i.imgur.com/eFPTv7f.png")`;
        if (prevBtn) prevBtn.src = "https://i.imgur.com/JacXKcT.png";
        if (ppBtn) ppBtn.src = "https://i.imgur.com/KRddgx9.png";
        if (ffBtn) ffBtn.src = "https://i.imgur.com/btmG7j2.png";
        ppBTN = "https://i.imgur.com/KRddgx9.png";
        ppBTN_pause = "https://i.imgur.com/IO44pbG.png";
    }

    const audio = getAudioElement();
    updatePlayPauseIcon(!audio.paused);
}
setupMusicPlayer();
