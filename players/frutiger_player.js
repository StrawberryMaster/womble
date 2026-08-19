// This is a recreation of the music player
// showcased in the mockup Get It BiDone.
class Song {
  constructor(title, artist, coverLink, audioLink, album = "", lengthStr = "0:00", sizeStr = "0.0mb", isFavorite = false) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;
    this.audioLink = audioLink;
    this.album = album;
    this.lengthStr = lengthStr;
    this.sizeStr = sizeStr;
    this.isFavorite = isFavorite;
  }
  getTitle() { return this.title; }
  getArtist() { return this.artist; }
  getCoverLink() { return this.coverLink; }
  getAudioLink() { return this.audioLink; }
  getAlbum() { return this.album; }
  getLengthStr() { return this.lengthStr; }
  getSizeStr() { return this.sizeStr; }
}

class Playlist {
  constructor(name = "Playlist") {
    this.name = name;
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
let mainPlaylist = new Playlist("The Mix!");
let activePlaylist = mainPlaylist;
let loopSong = false;

let audioInstance = null;
let currentVolume = 0.85;
let isCurrentYT = false;

let ytPlayer = null;
let isYTReady = false;

// assets / icons
const SVG_ICONS = {
  disc: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <defs>
            <radialGradient id="discGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="45%" stop-color="#9dd0f8"/>
              <stop offset="100%" stop-color="#2d6fb4"/>
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="10" fill="url(#discGrad)" stroke="#528fcb" stroke-width="1.2"/>
          <circle cx="12" cy="12" r="3.2" fill="#eaf4fc" stroke="#68a8e8" stroke-width="0.8"/>
          <path d="M11 7.2v5.8a1.6 1.6 0 1 0 1.4 1.55V9.4l3.1-.9V7.2z" fill="#133d6e"/>
        </svg>`,
  winMin: `<svg width="10" height="10" viewBox="0 0 24 24"><path d="M4 12h16" stroke="white" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  winMax: `<svg width="10" height="10" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" fill="none" stroke="white" stroke-width="3" rx="1"/></svg>`,
  winClose: `<svg width="10" height="10" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" stroke="white" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  minus: `<svg width="13" height="13" viewBox="0 0 24 24"><path d="M5 12h14" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>`,
  prev: `<svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M5 5a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1zm3.8 6.134a1 1 0 0 1 0-1.732l8.5-4.907A1 1 0 0 1 18.8 5.36v13.28a1 1 0 0 1-1.5.866l-8.5-4.907z"/></svg>`,
  play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="white" style="margin-left: 2px;"><polygon points="6 4 20 12 6 20"/></svg>`,
  pause: `<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M7 5h3.2v14H7zm6.8 0H17v14h-3.2z"/></svg>`,
  next: `<svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M19 5a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1zm-3.8 6.134a1 1 0 0 1 0 1.732l-8.5 4.907A1 1 0 0 1 5.2 18.64V5.36a1 1 0 0 1 1.5-.866l8.5 4.907z"/></svg>`,
  plus: `<svg width="13" height="13" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>`,
  speaker: `<svg width="16" height="15" viewBox="0 0 18 16" fill="none">
              <path d="M1.5 5.5H3.5L6.5 2.5V13.5L3.5 10.5H1.5C0.95 10.5 0.5 10.05 0.5 9.5V6.5C0.5 5.95 0.95 5.5 1.5 5.5Z" fill="#204576"/>
              <path d="M9 5.5C9.8 6.3 10.2 7.1 10.2 8C10.2 8.9 9.8 9.7 9 10.5" stroke="#204576" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M11.5 3.5C13 4.8 13.8 6.3 13.8 8C13.8 9.7 13 11.2 11.5 12.5" stroke="#204576" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M14.2 1.5C16.3 3.3 17.5 5.5 17.5 8C17.5 10.5 16.3 12.7 14.2 14.5" stroke="#204576" stroke-width="1.8" stroke-linecap="round"/>
            </svg>`
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
    audioInstance = document.getElementById("audio") || document.createElement("audio");
    audioInstance.id = "audio";
    if (!document.body.contains(audioInstance)) {
      document.body.appendChild(audioInstance);
    }
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
  const btn = document.getElementById("aeroPlayPause");
  if (btn) btn.innerHTML = isPlaying ? SVG_ICONS.pause : SVG_ICONS.play;
}

// UI update
function updateUI(playlist) {
  const currentPlaylist = playlist || activePlaylist;
  if (!currentPlaylist) return;

  const currentSong = currentPlaylist.getCurrentSong();
  if (!currentSong) return;

  const cover = document.getElementById("aeroCover");
  const title = document.getElementById("aeroTitle");
  const artist = document.getElementById("aeroArtist");
  const totalDuration = document.getElementById("aeroTotalDuration");

  if (cover) cover.src = currentSong.getCoverLink();
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();
  if (totalDuration) totalDuration.textContent = currentSong.getLengthStr();

  // highlight active table row
  const rows = document.querySelectorAll("#aeroTable tbody tr");
  rows.forEach((row, idx) => {
    if (idx === currentPlaylist.currentSongIndex) {
      row.classList.add("active-row");
    } else {
      row.classList.remove("active-row");
    }
  });
}
window.updateUI = updateUI;

// playlist switching
function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;
  updateUI(activePlaylist);
  playSongAtIndex();
}
window.changePlaylist = changePlaylist;

// YT iframe api integration
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
          if (loopSong) {
            ytPlayer.seekTo(0, true);
            ytPlayer.playVideo();
          } else {
            activePlaylist.playNext();
            playSongAtIndex();
          }
        }
      }
    }
  });
};

// play song handler
function playSongAtIndex() {
  if (!activePlaylist) return;
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
    audio.loop = loopSong;
    audio.play().then(() => updatePlayPauseIcon(true)).catch(() => updatePlayPauseIcon(false));
  }
}

// setup music player
function setupMusicPlayer() {
  if (document.getElementById("aeroPlayer")) return;

  setupYouTubeAPI();

  const defaultSongs = [
    new Song("LEASE", "阿保 剛", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGdYEDFbQvrD9r-5BDqVVnMHA7T32uGKmzkLxjgT0Y8OvlqD6ft0mfJA0D&s=10", "tjlvmb8SGEs", "My Merry May be", "1:43", "1.7mb"),
    new Song("Eple", "Röyksopp", "https://images.genius.com/c25ee3600d78def6a437e9972bbde3d0.440x440x1.jpg", "S-xW8y_pbdk", "Melody A.M.", "3:38", "3.5mb"),
    new Song("Sleeping In", "The Radio Dept.", "https://images.genius.com/371928946294e0feb9cc739d70bbfa82.640x640x1.jpg", "QoCdAnKMp0o", "Pet Grief", "3:31", "3.0mb"),
    new Song("SEITEN Junior High School", "阿保 剛", "https://i.scdn.co/image/ab67616d0000b273536bfb964e90146a29ca0cfc", "Bm32hrzjhSU", "My Merry May be", "3:06", "3.0mb"),
    new Song("Cherry Blossom Girl", "Air", "https://images.rapgenius.com/3c9d3805f5b0f47c20f51f4a1a88dce5.1000x1000x1.jpg", "ZBVK7Z9AyNM", "Talkie Walkie", "3:40", "3.9mb"),
    new Song("I Thought I Saw Your Face Today", "She & Him", "https://images.genius.com/02536cfd852046da53621835e510f559.1000x1000x1.jpg", "pyGU-UudvrM", "Volume One", "2:50", "2.5mb"),
    new Song("Of Moons, Birds & Monsters", "MGMT", "https://images.genius.com/1ab7dfa41afaccbe0649fe0e4a9c829d.1000x1000x1.png", "5bh2Wx0KJaI", "Oracular Spectacular", "4:46", "4.5mb"),
    new Song("If I Ever Feel Better", "Phoenix", "https://images.genius.com/c2e6a3f633214289e4eb21b04aee8dc9.1000x1000x1.jpg", "fJALBK5YD3c", "United", "4:26", "4.3mb"),
    new Song("In The Morning", "Junior Boys", "https://images.genius.com/b9f7d2edf5ceecb370a59577a2be29fc.600x597x1.jpg", "klzCB45e0_E", "So This Is Goodbye", "4:46", "4.5mb"),
    new Song("Porcelain", "Moby", "https://images.genius.com/265eca4df2977dcdafc651222d1cf0d3.1000x1000x1.png", "Mw3LlFb0rRA", "Play", "4:01", "4.3mb"),
    new Song("A Warm Place", "Nine Inch Nails", "https://images.genius.com/e75c4ea378efc18c49ae54e6acfd0aa7.1000x1000x1.png", "pw3PQEw6O4U", "The Downward Spiral", "3:22", "3.3mb"),
    new Song("Cybele's Reverie", "Stereolab", "https://images.genius.com/e36b06316d2e0215ac7d16590c5af80c.1000x1000x1.png", "HtUceMv3wjk", "Emperor Tomato Ketchup", "4:42", "4.5mb"),
    new Song("Heaven or Las Vegas", "Cocteau Twins", "https://images.genius.com/e0ca36fdae09db5522836e89eec4d71b.1000x1000x1.png", "LRFWkkIXBxM", "Heaven or Las Vegas", "4:58", "4.6mb")
  ];

  if (mainPlaylist.songs.length === 0) {
    defaultSongs.forEach(song => mainPlaylist.addSong(song));
  }
  activePlaylist = mainPlaylist;

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #aeroPlayer {
      width: 780px;
      margin: 12px auto;
      background: #fdfdfd;
      border: 3px solid #6b94c7;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 45, 110, 0.25);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Lucida Grande", Tahoma, sans-serif;
      user-select: none;
      box-sizing: border-box;
      overflow: hidden;
    }

    /* title bar */
    #aeroTitleBar {
      background: linear-gradient(180deg, #eef5fc 0%, #d4e4f7 48%, #bdd5f0 52%, #d7e7f8 100%);
      border-bottom: 1px solid #8caed4;
      padding: 6px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 38px;
    }

    .aero-app-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25));
    }

    .aero-window-controls {
      display: flex;
      gap: 6px;
    }

    .aero-win-btn {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid #4f82b8;
      background: radial-gradient(circle at 35% 30%, #ffffff 0%, #68a8e8 45%, #2c6db4 90%);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      outline: none;
    }

    /* main split content */
    #aeroContent {
      display: flex;
      padding: 14px 12px 10px 14px;
      gap: 16px;
    }

    /* left playing pane */
    #aeroLeftPane {
      width: 215px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    #aeroCoverContainer {
      width: 175px;
      height: 175px;
      border: 2px solid #2d62a3;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      background: #000;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #aeroCover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .aero-now-playing-label {
      font-size: 17px;
      color: #2b558f;
      margin-top: 6px;
      font-weight: 500;
    }

    #aeroTitle {
      font-size: 18px;
      font-weight: bold;
      color: #1e3f70;
      margin: 2px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }

    #aeroArtist {
      font-size: 17px;
      color: #2b558f;
      margin-bottom: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }

    /* progress seeker */
    .aero-progress-row {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      font-size: 12px;
      color: #3b5f92;
    }

    #aeroProgressContainer {
      flex: 1;
      height: 10px;
      background: #d8e5f2;
      border: 1px solid #a4c0dc;
      border-radius: 2px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    #aeroProgressFill {
      height: 100%;
      width: 0%;
      background: linear-gradient(180deg, #4d84c4 0%, #2b578c 100%);
    }

    /* playback transport controls */
    .aero-controls-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 10px 0 6px 0;
      width: 100%;
    }

    .aero-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid #3c72aa;
      background: radial-gradient(circle at 50% 25%, #a8d5fb 0%, #468cd4 45%, #2361a6 55%, #3d80c6 100%);
      box-shadow: inset 0 1px 1px #ffffff, 0 2px 4px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      outline: none;
      transition: filter 0.1s, transform 0.1s;
    }

    .aero-btn:hover {
      filter: brightness(1.08);
    }

    .aero-btn:active {
      background: radial-gradient(circle at 50% 75%, #2361a6 0%, #468cd4 55%, #a8d5fb 100%);
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.4);
      transform: scale(0.96);
    }

    #aeroPlayPause {
      width: 36px;
      height: 36px;
    }

    /* volume row */
    .aero-volume-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 85%;
      margin-top: 5px;
    }

    #aeroVolume {
      -webkit-appearance: none;
      appearance: none;
      width: 110px;
      height: 3px;
      background: #c5d7ea;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
      margin: 0;
    }

    #aeroVolume::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #386299;
      border: 1px solid #ffffff;
      box-shadow: 0 1px 2px rgba(0,0,0,0.35);
      cursor: pointer;
    }

    #aeroVolume::-moz-range-thumb {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #386299;
      border: 1px solid #ffffff;
      box-shadow: 0 1px 2px rgba(0,0,0,0.35);
      cursor: pointer;
    }

    .aero-vol-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    /* right table pane */
    #aeroRightPane {
      flex: 1;
      border: 1px solid #7c9fca;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      max-height: 290px;
      overflow-y: scroll;
      background: #ffffff;
    }

    #aeroTable {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      text-align: left;
    }

    #aeroTable thead th {
      background: #dfd8c1;
      color: #4a473d;
      font-weight: 500;
      padding: 4px 6px;
      border-right: 1px solid #c9c0a5;
      border-bottom: 1px solid #b8af94;
      position: sticky;
      top: 0;
      z-index: 2;
    }

    #aeroTable tbody tr {
      cursor: pointer;
      color: #1e3f70;
      height: 20px;
    }

    #aeroTable tbody tr:nth-child(even) {
      background: #f4f8fc;
    }

    #aeroTable tbody tr:hover {
      background: #dbe9f6;
    }

    #aeroTable tbody tr.active-row {
      background: #2b5c9e !important;
      color: #ffffff !important;
    }

    #aeroTable td {
      padding: 2px 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 110px;
    }

    .td-num {
      text-align: right;
      width: 26px;
      font-size: 16px;
    }

    /* bottom footer status bar */
    #aeroFooter {
      background: linear-gradient(180deg, #e4effa 0%, #c4dbf2 100%);
      border-top: 1px solid #92b5db;
      padding: 6px 14px;
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      color: #274b7e;
    }

    .playlist-name-link {
      color: #274b7e;
      text-decoration: underline wavy red;
      cursor: pointer;
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);

  // create HTML
  const player = document.createElement("div");
  player.id = "aeroPlayer";
  player.innerHTML = `
    <div id="aeroTitleBar">
      <div class="aero-app-icon">${SVG_ICONS.disc}</div>
      <div class="aero-window-controls">
        <button class="aero-win-btn" aria-label="Minimize">${SVG_ICONS.winMin}</button>
        <button class="aero-win-btn" aria-label="Maximize">${SVG_ICONS.winMax}</button>
        <button class="aero-win-btn" aria-label="Close">${SVG_ICONS.winClose}</button>
      </div>
    </div>
    <div id="aeroContent">
      <div id="aeroLeftPane">
        <div id="aeroCoverContainer">
          <img id="aeroCover" src="${activePlaylist.getCurrentSong().getCoverLink()}" alt="Cover">
        </div>
        <div class="aero-now-playing-label">Now Playing</div>
        <div id="aeroTitle">${activePlaylist.getCurrentSong().getTitle()}</div>
        <div id="aeroArtist">${activePlaylist.getCurrentSong().getArtist()}</div>

        <div class="aero-progress-row">
          <span id="aeroCurrentTime">0:00</span>
          <div id="aeroProgressContainer">
            <div id="aeroProgressFill"></div>
          </div>
          <span id="aeroTotalDuration">${activePlaylist.getCurrentSong().getLengthStr()}</span>
        </div>

        <div class="aero-controls-row">
          <button id="aeroMinus" class="aero-btn">${SVG_ICONS.minus}</button>
          <button id="aeroPrev" class="aero-btn">${SVG_ICONS.prev}</button>
          <button id="aeroPlayPause" class="aero-btn">${SVG_ICONS.play}</button>
          <button id="aeroNext" class="aero-btn">${SVG_ICONS.next}</button>
          <button id="aeroPlus" class="aero-btn">${SVG_ICONS.plus}</button>
        </div>

        <div class="aero-volume-row">
          <input type="range" id="aeroVolume" min="0" max="1" step="0.01" value="${currentVolume}">
          <span class="aero-vol-icon">${SVG_ICONS.speaker}</span>
        </div>
      </div>

      <div id="aeroRightPane">
        <table id="aeroTable">
          <thead>
            <tr>
              <th style="width:26px;"></th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Length</th>
              <th>Size</th>
            </tr>
          </thead>
          <tbody>
            ${activePlaylist.songs.map((song, idx) => `
              <tr class="${idx === 0 ? 'active-row' : ''}" data-index="${idx}">
                <td class="td-num">${idx + 1}</td>
                <td>${song.getTitle()}</td>
                <td>${song.getArtist()}</td>
                <td>${song.getAlbum()}</td>
                <td>${song.getLengthStr()}</td>
                <td>${song.getSizeStr()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div id="aeroFooter">
      <span>13 items in playlist</span>
      <span>Select playlist: <span class="playlist-name-link">The Mix!</span></span>
      <span>iPod</span>
      <span>56.9mb</span>
    </div>
  `;

  const gameWindow = document.getElementById("game_window");
  if (gameWindow) {
    gameWindow.insertAdjacentElement("afterend", player);
  } else {
    document.body.appendChild(player);
  }

  // setup audio & logic
  const audio = getAudioElement();
  audio.volume = currentVolume;

  const playPauseBtn = document.getElementById("aeroPlayPause");
  const prevBtn = document.getElementById("aeroPrev");
  const nextBtn = document.getElementById("aeroNext");
  const loopBtn = document.getElementById("aeroPlus");
  const progressContainer = document.getElementById("aeroProgressContainer");
  const progressFill = document.getElementById("aeroProgressFill");
  const currentTimeText = document.getElementById("aeroCurrentTime");
  const durationTimeText = document.getElementById("aeroTotalDuration");
  const volumeSlider = document.getElementById("aeroVolume");

  // table row clicks
  document.querySelectorAll("#aeroTable tbody tr").forEach(row => {
    row.addEventListener("click", () => {
      activePlaylist.currentSongIndex = parseInt(row.getAttribute("data-index"), 10);
      playSongAtIndex();
    });
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

  // loop / shuffle toggle
  loopBtn.addEventListener("click", () => {
    loopSong = !loopSong;
    audio.loop = loopSong;
    loopBtn.style.filter = loopSong ? "brightness(1.2) drop-shadow(0 0 3px #88c0f5)" : "none";
  });

  // seek progress
  progressContainer.addEventListener("click", (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    if (isCurrentYT && ytPlayer && isYTReady && ytPlayer.getDuration) {
      const duration = ytPlayer.getDuration();
      if (duration) {
        ytPlayer.seekTo(percent * duration, true);
        progressFill.style.width = (percent * 100) + "%";
        currentTimeText.textContent = formatTime(percent * duration);
      }
    } else if (Number.isFinite(audio.duration)) {
      audio.currentTime = percent * audio.duration;
      progressFill.style.width = (percent * 100) + "%";
      currentTimeText.textContent = formatTime(audio.currentTime);
    }
  });

  // volume control
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseFloat(e.target.value);
    audio.volume = currentVolume;
    if (ytPlayer && isYTReady && ytPlayer.setVolume) {
      ytPlayer.setVolume(currentVolume * 100);
    }
  });

  // audio events
  audio.addEventListener("timeupdate", () => {
    if (!isCurrentYT && Number.isFinite(audio.duration)) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = percent + "%";
      currentTimeText.textContent = formatTime(audio.currentTime);
      durationTimeText.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("ended", () => {
    if (!isCurrentYT && !loopSong) {
      activePlaylist.playNext();
      playSongAtIndex();
    }
  });

  // ticker for YT progress
  setInterval(() => {
    if (isCurrentYT && ytPlayer && isYTReady && ytPlayer.getPlayerState && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      const duration = ytPlayer.getDuration();
      const currentTime = ytPlayer.getCurrentTime();
      if (duration && duration > 0) {
        const percent = (currentTime / duration) * 100;
        progressFill.style.width = percent + "%";
        currentTimeText.textContent = formatTime(currentTime);
        durationTimeText.textContent = formatTime(duration);
      }
    }
  }, 250);

  // initial play
  playSongAtIndex();
}

setupMusicPlayer();