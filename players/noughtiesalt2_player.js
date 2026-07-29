// This is a recreation of the music player
// showcased in the mod Red Dusk sneak peeks.
class Song {
  constructor(title, artist, coverLink, audioOrYouTube) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;

    // detect and parse YouTube IDs, otherwise treat as a standard audio link
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
  addSong(song) {
    this.songs.push(song);
  }
  getCurrentSong() {
    return this.songs[this.currentSongIndex];
  }
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

let playlist = null;
let currentPlaylistIndex = 0;
let isRepeat = false;

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

const SVGS = {
  wmpLogo: `<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="12" fill="#C0C0C0" stroke="#000" stroke-width="1"/><rect x="3" y="4" width="10" height="8" fill="#000"/><path d="M5 6L11 8L5 10V6Z" fill="#00FF00"/><rect x="11" y="4" width="2" height="8" fill="#FF0000"/></svg>`,
  min: `<svg width="6" height="6" viewBox="0 0 6 6"><rect x="0" y="4" width="5" height="2" fill="#000"/></svg>`,
  max: `<svg width="7" height="7" viewBox="0 0 7 7"><rect x="0" y="0" width="7" height="7" fill="none" stroke="#000" stroke-width="1"/><rect x="0" y="0" width="7" height="2" fill="#000"/></svg>`,
  close: `<svg width="7" height="7" viewBox="0 0 7 7"><path d="M0 0L7 7M7 0L0 7" stroke="#000" stroke-width="1.2"/></svg>`,
  arrowLeft: `<svg width="5" height="7" viewBox="0 0 5 7"><path d="M5 0L0 3.5L5 7V0Z" fill="#000"/></svg>`,
  arrowRight: `<svg width="5" height="7" viewBox="0 0 5 7"><path d="M0 0L5 3.5L0 7V0Z" fill="#000"/></svg>`,
  arrowDown: `<svg width="7" height="5" viewBox="0 0 7 5"><path d="M0 0L3.5 5L7 0H0Z" fill="#000"/></svg>`,
  play: `<svg width="8" height="9" viewBox="0 0 8 9"><path d="M0 0L8 4.5L0 9V0Z" fill="#000"/></svg>`,
  pause: `<svg width="8" height="9" viewBox="0 0 8 9"><rect x="0" y="0" width="3" height="9" fill="#000"/><rect x="5" y="0" width="3" height="9" fill="#000"/></svg>`,
  prev: `<svg width="9" height="9" viewBox="0 0 9 9"><rect x="0" y="0" width="2" height="9" fill="#000"/><path d="M9 0L2 4.5L9 9V0Z" fill="#000"/></svg>`,
  rewind: `<svg width="10" height="9" viewBox="0 0 10 9"><path d="M5 0L0 4.5L5 9V0Z" fill="#000"/><path d="M10 0L5 4.5L10 9V0Z" fill="#000"/></svg>`,
  fastForward: `<svg width="10" height="9" viewBox="0 0 10 9"><path d="M0 0L5 4.5L0 9V0Z" fill="#000"/><path d="M5 0L10 4.5L5 9V0Z" fill="#000"/></svg>`,
  next: `<svg width="9" height="9" viewBox="0 0 9 9"><path d="M0 0L7 4.5L0 9V0Z" fill="#000"/><rect x="7" y="0" width="2" height="9" fill="#000"/></svg>`,
  playlist: `<svg width="9" height="9" viewBox="0 0 9 9"><rect x="0" y="0" width="2" height="2" fill="#000"/><rect x="3.5" y="0" width="2" height="2" fill="#000"/><rect x="7" y="0" width="2" height="2" fill="#000"/><rect x="0" y="3.5" width="2" height="2" fill="#000"/><rect x="3.5" y="3.5" width="2" height="2" fill="#000"/><rect x="7" y="3.5" width="2" height="2" fill="#000"/><rect x="0" y="7" width="2" height="2" fill="#000"/><rect x="3.5" y="7" width="2" height="2" fill="#000"/><rect x="7" y="7" width="2" height="2" fill="#000"/></svg>`,
  repeat: `<svg width="10" height="9" viewBox="0 0 10 9" fill="none"><path d="M2 3H8V5M8 6H2V4" stroke="#000" stroke-width="1.2"/><path d="M6 1L8 3L6 5" stroke="#000" stroke-width="1.2"/><path d="M4 8L2 6L4 4" stroke="#000" stroke-width="1.2"/></svg>`,
  radio: `<svg width="11" height="10" viewBox="0 0 11 10" fill="none" stroke="#000"><rect x="1" y="3" width="9" height="6" fill="#c0c0c0" stroke-width="1"/><circle cx="3.5" cy="6" r="1.5" fill="#000"/><line x1="6" y1="5" x2="8.5" y2="5" stroke-width="1"/><line x1="6" y1="7" x2="8.5" y2="7" stroke-width="1"/><line x1="2" y1="3" x2="7" y2="0.5" stroke-width="1"/></svg>`,
  music: `<svg width="10" height="10" viewBox="0 0 10 10" fill="#000"><path d="M3 8C3 9.1 2.1 10 1 10C-0.1 10 -0.1 8 1 8C1.6 8 2 8.2 2 8.5V2L8 0.5V6.5C8 7.6 7.1 8.5 6 8.5C4.9 8.5 4.9 6.5 6 6.5C6.6 6.5 7 6.7 7 7V2.2L3 3.2V8Z"/></svg>`,
  guide: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1" y="1" width="8" height="8" fill="#fff" stroke="#000"/><rect x="2" y="2" width="6" height="2" fill="#000080"/><line x1="2" y1="5" x2="8" y2="5" stroke="#000"/><line x1="2" y1="7" x2="6" y2="7" stroke="#000"/></svg>`,
  volume: `<svg width="11" height="10" viewBox="0 0 11 10" fill="#000"><path d="M0 3V7H2.5L6 10V0L2.5 3H0ZM8 2V8C9.2 7 9.2 3 8 2Z"/></svg>`
};

const allPlaylists = [
  [
    new Song("The State Of The Union", "Thievery Corporation", "https://yt3.googleusercontent.com/RdoyfnzTcOhFR7C9At40axIbGql-zmiLXaPMMPPgUlsV5PA2Ds0S42yLYdG1f_9rPVEQfV-CnXtCPS4=w544-h544-l90-rj", "https://music.youtube.com/watch?v=0tF4UFkTyTI"),
    new Song("Hell Is Round The Corner", "Tricky, Martina Topley-Bird", "https://yt3.googleusercontent.com/AoxW27x7l9dcD571bmEed32XNG6Jq24mRZmeYQ6H2pG2rnHlueqg4aWKTsOhojq3pdDUkwa0ONQA81w=w544-h544-l90-rj", "https://music.youtube.com/watch?v=eRAJL1KErb0"),
	new Song("Scorn", "Portishead", "https://yt3.googleusercontent.com/3vCZl9EtfUzsSX8bXMHEFH3jGZYCtWdyDfeT6Kz2ap1ZXboeFZZ5BNjP9lSwh5T1y_L8ZAPJoMIHxjiTfQ=w544-h544-l90-rj", "https://music.youtube.com/watch?v=uHKTuMup36A"),
	new Song("Otherwise", "Morcheeba", "https://yt3.googleusercontent.com/GopTaNjmiO0ACJYVrK9X1pz5GINLMtiioWTqktW3I7YuvFTehvI713wCiJ6-5D7aC_8pd_j5ZlAjCZQ=w544-h544-l90-rj", "https://music.youtube.com/watch?v=se-lbi_YdAU")
  ]
];

function isYouTubeSong(song) {
  return !!song?.getYouTubeId?.();
}

function getScaledVolume(volumeStep) {
  const normalized = volumeStep / 9;
  return Math.pow(normalized, 3);
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
    progressBar.style.background = `linear-gradient(to right, #000080 ${progress}%, #ffffff ${progress}%)`;
  }, 250);
}

function syncYTVolumeFromSlider() {
  const volumeSlider = document.getElementById("volumeSlider");
  if (!volumeSlider || !ytPlayer) return;

  const volumeStep = parseInt(volumeSlider.value, 10);
  const scaled = getScaledVolume(volumeStep);

  ytPlayer.setVolume(Math.round(scaled * 100));
  if (scaled === 0) ytPlayer.mute();
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
            window._spotifyOnYTEnded?.();
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
  const song = playlist?.getCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ensureYTPlayer(() => {
      ytPlayer?.playVideo?.();
    });
  } else {
    if (!song.getAudioLink()) {
      console.warn("No audio link provided for song:", song.getTitle());
      setPlayPauseUIState(false);
      return;
    }
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.warn("Direct playback deferred or source unplayable:", e);
        setPlayPauseUIState(false);
      });
    }
  }
}

function backendPause(audio) {
  const song = playlist?.getCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ytPlayer?.pauseVideo?.();
  } else {
    audio.pause();
  }
}

function backendSetVolume(audio, volume) {
  audio.volume = volume;
  const song = playlist?.getCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    ytPlayer.setVolume(Math.round(volume * 100));
    if (volume === 0) ytPlayer.mute();
    else ytPlayer.unMute();
  }
}

function backendGetCurrentTime() {
  const song = playlist?.getCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    return ytPlayer.getCurrentTime?.() || 0;
  }
  const audio = document.getElementById("audio");
  return audio ? audio.currentTime || 0 : 0;
}

function backendGetDuration() {
  const song = playlist?.getCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    return ytPlayer.getDuration?.() || 0;
  }
  const audio = document.getElementById("audio");
  return audio ? audio.duration || 0 : 0;
}

function backendSeekTo(seconds) {
  const song = playlist?.getCurrentSong();
  const audio = document.getElementById("audio");
  if (isYouTubeSong(song) && ytPlayer) {
    ytPlayer.seekTo(seconds, true);
  } else if (audio && audio.duration > 0) {
    audio.currentTime = seconds;
  }
}

function setPlayPauseUIState(isPlaying) {
  const playPauseButton = document.getElementById("playPauseButton");
  if (!playPauseButton) return;
  if (isPlaying) {
    playPauseButton.innerHTML = SVGS.pause;
    playPauseButton.title = "Pause";
  } else {
    playPauseButton.innerHTML = SVGS.play;
    playPauseButton.title = "Play";
  }
}

function updateUI(activePlaylist) {
  const currentSong = activePlaylist.getCurrentSong();
  const player = document.getElementById("player");
  if (!player || !currentSong) return;

  player.querySelector("#cover").src = currentSong.getCoverLink() || "";
  player.querySelector("#title").textContent = currentSong.getTitle();
  player.querySelector("#artist").textContent = currentSong.getArtist();

  const titlebarText = document.getElementById("wmp-titlebar-text");
  if (titlebarText) {
    titlebarText.textContent = `${currentSong.getTitle()}.mp3 - Windows Media Player`;
  }
}
window.updateUI = updateUI;

function changePlaylist(newPlaylist) {
  playlist = newPlaylist;
  playlist.currentSongIndex = 0;
  updateUI(playlist);

  const audio = document.getElementById("audio");
  const progressBar = document.getElementById("progress-bar");

  if (audio && progressBar) {
    backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
    backendPlay(audio);
    setPlayPauseUIState(true);
  }
}
window.changePlaylist = changePlaylist;

function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) return;
  if (document.getElementById("player")) return;

  isRepeat = localStorage.getItem("IC_repeat_mode") === "true";
  currentPlaylistIndex = parseInt(localStorage.getItem("IC_selected_playlist") || "0", 10);
  const savedSongIndex = parseInt(localStorage.getItem("IC_selected_song") || "0", 10);
  const savedVolume = localStorage.getItem("IC_music_volume");
  const initialVolume = savedVolume !== null ? parseInt(savedVolume, 10) : 1;

  playlist = new Playlist();
  allPlaylists[currentPlaylistIndex].forEach(data => playlist.addSong(data));
  playlist.currentSongIndex = (savedSongIndex >= 0 && savedSongIndex < playlist.songs.length) ? savedSongIndex : 0;

  const style = document.createElement("style");
  style.textContent = `
    #player {
      border: 2px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      box-shadow: inset -1px -1px #000000, inset 1px 1px #dfdfdf;
      display: flex;
      flex-direction: column;
      height: 240px;
      background-color: #d4d0c8;
      font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;
      box-sizing: border-box;
      overflow: hidden;
      user-select: none;
      width: 100%;
    }

    /* Titlebar */
    #wmp-titlebar {
      background: linear-gradient(to right, #000080, #1084d0);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1px 3px;
      height: 18px;
      font-size: 11px;
      font-weight: bold;
      box-sizing: border-box;
      flex-shrink: 0;
    }
    #wmp-titlebar-left {
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
      white-space: nowrap;
    }
    .wmp-icon {
      display: inline-flex;
      align-items: center;
    }
    #wmp-titlebar-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #wmp-titlebar-right {
      display: flex;
      gap: 2px;
    }
    .wmp-win-btn {
      background: #d4d0c8;
      border-top: 1px solid #ffffff;
      border-left: 1px solid #ffffff;
      border-right: 1px solid #404040;
      border-bottom: 1px solid #404040;
      box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf;
      width: 14px;
      height: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
    }
    .wmp-win-btn:active {
      border-top: 1px solid #404040;
      border-left: 1px solid #404040;
      border-right: 1px solid #ffffff;
      border-bottom: 1px solid #ffffff;
      box-shadow: inset 1px 1px #808080;
    }

    /* Menubar */
    #wmp-menubar {
      background: #d4d0c8;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 1px 6px;
      font-size: 11px;
      color: #000000;
      border-bottom: 1px solid #808080;
      box-sizing: border-box;
      height: 18px;
      flex-shrink: 0;
    }
    #wmp-menubar span {
      cursor: pointer;
    }

    /* Main Body Layout */
    #wmp-main-body {
      flex: 1;
      display: flex;
      flex-direction: row;
      padding: 3px;
      gap: 3px;
      box-sizing: border-box;
      min-height: 0;
      background: #d4d0c8;
    }

    /* Left Column: Album Cover Box */
    #wmp-cover-box {
      height: 100%;
      aspect-ratio: 1 / 1;
      border-top: 2px solid #808080;
      border-left: 2px solid #808080;
      border-right: 2px solid #ffffff;
      border-bottom: 2px solid #ffffff;
      background: #000000;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    #cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Right Column: Controls + Track Info Screen */
    #wmp-right-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    /* Controls Panel */
    #wmp-controls-area {
      background: #d4d0c8;
      padding: 2px 4px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      box-sizing: border-box;
      border: 1px solid #808080;
      border-right-color: #ffffff;
      border-bottom-color: #ffffff;
      flex-shrink: 0;
    }
    .wmp-controls-top-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .wmp-arrow-group {
      display: flex;
      gap: 2px;
    }

    /* Buttons */
    .wmp-btn {
      background: #d4d0c8;
      border-top: 1px solid #ffffff;
      border-left: 1px solid #ffffff;
      border-right: 1px solid #404040;
      border-bottom: 1px solid #404040;
      box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf;
      color: #000000;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      box-sizing: border-box;
      user-select: none;
    }
    .wmp-btn:active {
      border-top: 1px solid #404040;
      border-left: 1px solid #404040;
      border-right: 1px solid #ffffff;
      border-bottom: 1px solid #ffffff;
      box-shadow: inset 1px 1px #808080;
    }
    .wmp-sm-btn {
      width: 16px;
      height: 14px;
    }
    .wmp-ctrl-btn {
      height: 20px;
      min-width: 20px;
      padding: 0 4px;
    }
    .wmp-inner-btn {
      height: 18px;
      min-width: 18px;
      border: none;
      background: transparent;
      box-shadow: none;
      cursor: pointer;
    }
    .wmp-inner-btn:active {
      background: #b0aca5;
    }

    /* Seekbar */
    .wmp-seekbar-container {
      flex: 1;
      display: flex;
      align-items: center;
    }
    #progress-bar {
      width: 100%;
      appearance: none;
      -webkit-appearance: none;
      height: 4px;
      background: #ffffff;
      border-top: 1px solid #808080;
      border-left: 1px solid #808080;
      border-bottom: 1px solid #dfdfdf;
      border-right: 1px solid #dfdfdf;
      outline: none;
      cursor: pointer;
      margin: 0;
    }
    #progress-bar::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 10px;
      height: 14px;
      background: #d4d0c8;
      border-top: 1px solid #ffffff;
      border-left: 1px solid #ffffff;
      border-right: 1px solid #404040;
      border-bottom: 1px solid #404040;
      box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf;
      cursor: pointer;
    }
    #progress-bar::-moz-range-thumb {
      width: 10px;
      height: 14px;
      background: #d4d0c8;
      border-top: 1px solid #ffffff;
      border-left: 1px solid #ffffff;
      border-right: 1px solid #404040;
      border-bottom: 1px solid #404040;
      box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf;
      cursor: pointer;
    }

    /* Links & Volume */
    .wmp-guide-links {
      display: flex;
      gap: 8px;
      font-size: 10px;
      color: #000000;
      white-space: nowrap;
    }
    .wmp-guide-links span {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
    .wmp-controls-bottom-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
    }
    .wmp-transport-container {
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .wmp-transport-inset-box {
      display: flex;
      align-items: center;
      border-top: 1px solid #808080;
      border-left: 1px solid #808080;
      border-bottom: 1px solid #ffffff;
      border-right: 1px solid #ffffff;
      background: #d4d0c8;
      padding: 0 1px;
    }
    .wmp-volume-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1px;
    }
    .wmp-volume-slider-row {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .wmp-vol-icon {
      display: inline-flex;
      align-items: center;
    }
    #volumeSlider {
      appearance: none;
      -webkit-appearance: none;
      width: 60px;
      height: 4px;
      background: #ffffff;
      border-top: 1px solid #808080;
      border-left: 1px solid #808080;
      border-bottom: 1px solid #dfdfdf;
      border-right: 1px solid #dfdfdf;
      outline: none;
      cursor: pointer;
      margin: 0;
    }
    #volumeSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 8px;
      height: 12px;
      background: #d4d0c8;
      border-top: 1px solid #ffffff;
      border-left: 1px solid #ffffff;
      border-right: 1px solid #404040;
      border-bottom: 1px solid #404040;
      box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf;
      cursor: pointer;
    }
    #volumeSlider::-moz-range-thumb {
      width: 8px;
      height: 12px;
      background: #d4d0c8;
      border-top: 1px solid #ffffff;
      border-left: 1px solid #ffffff;
      border-right: 1px solid #404040;
      border-bottom: 1px solid #404040;
      box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf;
      cursor: pointer;
    }
    .wmp-dropdown-arrow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding-right: 2px;
    }

    /* Lower Right: Black Info Screen */
    #wmp-info-screen {
      flex: 1;
      border-top: 2px solid #808080;
      border-left: 2px solid #808080;
      border-right: 2px solid #ffffff;
      border-bottom: 2px solid #ffffff;
      background: #000000;
      color: #ffffff;
      padding: 10px 14px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
    }
    #title {
      font-size: 14px;
      font-weight: normal;
      margin: 0 0 8px 0;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;
    }
    #artist {
      font-size: 12px;
      color: #ffffff;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;
    }
  `;
  document.head.appendChild(style);

  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <div id="wmp-titlebar">
      <div id="wmp-titlebar-left">
        <span class="wmp-icon">${SVGS.wmpLogo}</span>
        <span id="wmp-titlebar-text">Windows Media Player</span>
      </div>
      <div id="wmp-titlebar-right">
        <button class="wmp-win-btn">${SVGS.min}</button>
        <button class="wmp-win-btn">${SVGS.max}</button>
        <button class="wmp-win-btn">${SVGS.close}</button>
      </div>
    </div>
    <div id="wmp-menubar">
      <span><u>F</u>ile</span>
      <span><u>V</u>iew</span>
      <span><u>P</u>lay</span>
      <span>F<u>a</u>vorites</span>
      <span><u>G</u>o</span>
      <span><u>H</u>elp</span>
    </div>
    <div id="wmp-main-body">
      <div id="wmp-cover-box">
        <img id="cover" src="" alt="Album Cover">
      </div>
      <div id="wmp-right-column">
        <div id="wmp-controls-area">
          <div class="wmp-controls-top-row">
            <div class="wmp-arrow-group">
              <button class="wmp-btn wmp-sm-btn" title="Back">${SVGS.arrowLeft}</button>
              <button class="wmp-btn wmp-sm-btn" title="Forward">${SVGS.arrowRight}</button>
            </div>
            <div class="wmp-seekbar-container">
              <input type="range" id="progress-bar" min="0" max="100" value="0" step="0.1">
            </div>
            <div class="wmp-guide-links">
              <span>${SVGS.radio} Radio</span>
              <span>${SVGS.music} Music</span>
              <span>${SVGS.guide} Media Guide</span>
            </div>
          </div>
          <div class="wmp-controls-bottom-row">
            <div class="wmp-transport-container">
              <button id="playPauseButton" class="wmp-btn wmp-ctrl-btn" title="Pause">${SVGS.pause}</button>
              <div class="wmp-transport-inset-box">
                <button id="prevButton" class="wmp-btn wmp-inner-btn" title="Previous">${SVGS.prev}</button>
                <button class="wmp-btn wmp-inner-btn" title="Rewind">${SVGS.rewind}</button>
                <button class="wmp-btn wmp-inner-btn" title="Fast Forward">${SVGS.fastForward}</button>
                <button id="nextButton" class="wmp-btn wmp-inner-btn" title="Next">${SVGS.next}</button>
                <button id="playlistSwitcher" class="wmp-btn wmp-inner-btn" title="Playlist Switcher">${SVGS.playlist}</button>
              </div>
              <button id="repeatButton" class="wmp-btn wmp-ctrl-btn" title="Repeat Mode">${SVGS.repeat}</button>
            </div>
            <div class="wmp-volume-container">
              <div class="wmp-volume-slider-row">
                <span class="wmp-vol-icon">${SVGS.volume}</span>
                <input type="range" id="volumeSlider" min="0" max="9" step="1">
              </div>
              <div class="wmp-dropdown-arrow">${SVGS.arrowDown}</div>
            </div>
          </div>
        </div>
        <div id="wmp-info-screen">
          <div id="title"></div>
          <div id="artist"></div>
        </div>
      </div>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  const playPauseButton = document.getElementById("playPauseButton");
  const playlistSwitcher = document.getElementById("playlistSwitcher");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const repeatButton = document.getElementById("repeatButton");
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volumeSlider");

  Object.defineProperty(playPauseButton, "src", {
    set: function (val) {
      if (typeof val === "string" && val.includes("pause")) {
        setPlayPauseUIState(true);
      } else {
        setPlayPauseUIState(false);
      }
    },
    get: function () {
      return this.title === "Pause" ? "pause" : "play";
    }
  });

  const audio = document.createElement("audio");
  audio.id = "audio";
  document.body.appendChild(audio);

  audio.addEventListener("error", (e) => {
    console.warn("Audio element encountered source error:", e);
    setPlayPauseUIState(false);
  });

  volumeSlider.value = initialVolume;
  const initialVolumePercent = (initialVolume / 9) * 100;
  volumeSlider.style.background = `linear-gradient(to right, #000080 ${initialVolumePercent}%, #ffffff ${initialVolumePercent}%)`;
  audio.volume = getScaledVolume(initialVolume);

  repeatButton.style.opacity = isRepeat ? "0.5" : "1.0";

  window._spotifyOnYTEnded = function () {
    if (isRepeat) {
      backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
      backendPlay(audio);
      setPlayPauseUIState(true);
    } else {
      playlist.playNext();
      updateUI(playlist);
      backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
      backendPlay(audio);
      setPlayPauseUIState(true);
      localStorage.setItem("IC_selected_song", playlist.currentSongIndex);
    }
  };

  audio.addEventListener("timeupdate", () => {
    const duration = backendGetDuration();
    const current = backendGetCurrentTime();
    const progress = duration > 0 ? (current / duration) * 100 : 0;
    progressBar.value = progress;
    progressBar.style.background = `linear-gradient(to right, #000080 ${progress}%, #ffffff ${progress}%)`;
  });

  audio.addEventListener("ended", () => {
    window._spotifyOnYTEnded();
  });

  progressBar.addEventListener("input", () => {
    const duration = backendGetDuration();
    const seekTime = (progressBar.value / 100) * duration;
    backendSeekTo(seekTime);
  });

  volumeSlider.addEventListener("input", () => {
    const volumeStep = parseInt(volumeSlider.value, 10);
    const scaled = getScaledVolume(volumeStep);
    backendSetVolume(audio, scaled);

    const percent = (volumeStep / 9) * 100;
    volumeSlider.style.background = `linear-gradient(to right, #000080 ${percent}%, #ffffff ${percent}%)`;
    localStorage.setItem("IC_music_volume", volumeStep);
  });

  playPauseButton.addEventListener("click", () => {
    const song = playlist.getCurrentSong();
    let isPaused = true;

    if (isYouTubeSong(song)) {
      const state = ytPlayer?.getPlayerState?.();
      isPaused = !(state === YT.PlayerState.PLAYING);
    } else {
      isPaused = audio.paused;
    }

    if (isPaused) {
      backendPlay(audio);
      setPlayPauseUIState(true);
    } else {
      backendPause(audio);
      setPlayPauseUIState(false);
    }
  });

  prevButton.addEventListener("click", () => {
    playlist.playPrevious();
    updateUI(playlist);
    backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
    backendPlay(audio);
    setPlayPauseUIState(true);
    localStorage.setItem("IC_selected_song", playlist.currentSongIndex);
  });

  nextButton.addEventListener("click", () => {
    playlist.playNext();
    updateUI(playlist);
    backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
    backendPlay(audio);
    setPlayPauseUIState(true);
    localStorage.setItem("IC_selected_song", playlist.currentSongIndex);
  });

  playlistSwitcher.addEventListener("click", () => {
    currentPlaylistIndex = (currentPlaylistIndex + 1) % allPlaylists.length;
    playlist = new Playlist();
    allPlaylists[currentPlaylistIndex].forEach(data => playlist.addSong(data));
    playlist.currentSongIndex = 0;

    updateUI(playlist);
    backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
    backendPlay(audio);
    setPlayPauseUIState(true);

    localStorage.setItem("IC_selected_playlist", currentPlaylistIndex);
    localStorage.setItem("IC_selected_song", 0);
  });

  repeatButton.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatButton.style.opacity = isRepeat ? "0.5" : "1.0";
    localStorage.setItem("IC_repeat_mode", isRepeat);
  });

  updateUI(playlist);
  backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
  backendPlay(audio);
}

setupMusicPlayer();