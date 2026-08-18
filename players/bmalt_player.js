// core classes
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
let playlists = [];
let activePlaylist = null;
let loopSong = false;

let audioInstance = null;
let currentVolume = 1.0;
let isCurrentYT = false;

let ytPlayer = null;
let isYTReady = false;

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
  const btn = document.getElementById("playPause");
  if (btn) btn.textContent = isPlaying ? "❚❚" : "▶";
}

// UI update
function updateUI(playlist) {
  const currentPlaylist = playlist || activePlaylist;
  if (!currentPlaylist) return;

  const currentSong = currentPlaylist.getCurrentSong();
  if (!currentSong) return;

  const cover = document.getElementById("coverArt");
  const title = document.getElementById("songTitle");
  const artist = document.getElementById("artistName");

  if (cover) cover.src = currentSong.getCoverLink();
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();
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
  if (document.getElementById("player98")) return;

  setupYouTubeAPI();

  // default playlists setup
  const introPlaylist = new Playlist("Intro");
  introPlaylist.addSong(new Song(
    "Macarena", "Los Del Rio",
    "https://i.imgur.com/7LPwF4h.gif",
    "https://files.catbox.moe/msyl1k.mp3"
  ));

  const surplusPlaylist = new Playlist("Surplus, Pepsi, & Viagra");
  surplusPlaylist.addSong(new Song("God Bless the USA", "Lee Greenwood", "https://i.imgur.com/6ls9OE6.gif", "https://files.catbox.moe/13yxpo.mp3"));
  surplusPlaylist.addSong(new Song("Born in the USA", "Bruce Springsteen", "https://i.imgur.com/6ls9OE6.gif", "https://files.catbox.moe/4ypsyl.mp3"));
  surplusPlaylist.addSong(new Song("Sweet Home Alabama", "Lynyrd Skynyrd", "https://i.imgur.com/vd1dit1.gif", "https://files.catbox.moe/d8iugc.mp3"));
  surplusPlaylist.addSong(new Song("Happy Together", "The Turtles", "https://i.imgur.com/LWY2K2B.gif", "https://files.catbox.moe/r89y4t.mp3"));
  surplusPlaylist.addSong(new Song("Piano Man", "Billy Joel", "https://i.imgur.com/79p2Idi.gif", "https://files.catbox.moe/idwvm8.mp3"));
  surplusPlaylist.addSong(new Song("Take On Me", "a-ha", "https://i.imgur.com/SC77Ecy.gif", "https://files.catbox.moe/33w7iu.mp3"));
  surplusPlaylist.addSong(new Song("YMCA", "Village People", "https://i.imgur.com/3WJFM3C.gif", "https://files.catbox.moe/uwvzoi.mp3"));
  surplusPlaylist.addSong(new Song("Summer of 69", "Bryan Adams", "https://i.imgur.com/zjiCd3u.gif", "https://files.catbox.moe/on0e7g.mp3"));
  surplusPlaylist.addSong(new Song("Some Kind of Wonderful", "Grand Funk Railroad", "https://i.imgur.com/2633LVx.gif", "https://files.catbox.moe/jys3ug.mp3"));
  surplusPlaylist.addSong(new Song("Forever Young", "Alphaville", "https://i.imgur.com/AfI6K7u.gif", "https://files.catbox.moe/fztals.mp3"));
  surplusPlaylist.addSong(new Song("We Didn't Start the Fire", "Billy Joel", "https://i.imgur.com/XnL73wY.gif", "https://files.catbox.moe/25aewh.mp3"));

  const flipFloppingPlaylist = new Playlist("Flip-Flopping Tunes");
  flipFloppingPlaylist.addSong(new Song("Eye of the Tiger", "Survivor", "https://i.imgur.com/6q3TY5M.gif", "https://files.catbox.moe/mnvibk.mp3"));
  flipFloppingPlaylist.addSong(new Song("We're Not Gonna Take It", "Twisted Sister", "https://i.imgur.com/NclcWET.gif", "https://files.catbox.moe/vkrehs.mp3"));
  flipFloppingPlaylist.addSong(new Song("[I Just] Died In Your Arms", "Cutting Crew", "https://i.imgur.com/9qvb05K.gif", "https://files.catbox.moe/l4s41m.mp3"));
  flipFloppingPlaylist.addSong(new Song("I'm Still Standing", "Elton John", "https://i.imgur.com/0ex1GYH.gif", "https://files.catbox.moe/dphfmy.mp3"));
  flipFloppingPlaylist.addSong(new Song("Don't Stop Believin'", "Journey", "https://i.imgur.com/XSG1G6M.gif", "https://files.catbox.moe/iabevh.mp3"));
  flipFloppingPlaylist.addSong(new Song("Chapel of Love", "The Dixie Cups", "https://i.imgur.com/sQGzqYF.gif", "https://files.catbox.moe/gz8j36.mp3"));
  flipFloppingPlaylist.addSong(new Song("Africa", "TOTO", "https://i.imgur.com/PUsiqSe.gif", "https://files.catbox.moe/k62qk1.mp3"));
  flipFloppingPlaylist.addSong(new Song("Sir Duke", "Stevie Wonder", "https://i.imgur.com/dVKo5Gb.gif", "https://files.catbox.moe/bn546f.mp3"));
  flipFloppingPlaylist.addSong(new Song("Where the Streets Have No Name", "U2", "https://i.imgur.com/GkK2HQE.gif", "https://files.catbox.moe/3u9jgf.mp3"));
  flipFloppingPlaylist.addSong(new Song("No Surrender", "Bruce Springsteen", "https://i.imgur.com/JvXlIVr.gif", "https://files.catbox.moe/yhin9s.mp3"));
  flipFloppingPlaylist.addSong(new Song("Bohemian Rhapsody", "Queen", "https://i.imgur.com/bKsVMbt.gif", "https://files.catbox.moe/8m78ln.mp3"));

  playlists = [introPlaylist, surplusPlaylist, flipFloppingPlaylist];
  activePlaylist = introPlaylist;

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player98, #player98 * {
      -webkit-font-smoothing: none;
      font-family: "Pixelated MS Sans Serif", Arial, sans-serif;
      font-size: 11px;
      box-sizing: border-box;
    }

    /* window frame */
    .window#player98 {
      background: silver;
      box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff;
      padding: 3px;
      width: 360px;
      user-select: none;
      margin: 10px auto;
    }

    .window-body {
      margin: 6px;
    }

    /* title bar & controls */
    .title-bar {
      align-items: center;
      background: linear-gradient(90deg, #7C9CCC, #1084d0);
      display: flex;
      justify-content: space-between;
      padding: 3px 2px 3px 3px;
    }
    .title-bar-text {
      color: #fff;
      font-weight: 700;
      letter-spacing: 0;
      margin-right: 24px;
    }
    .title-bar-controls {
      display: flex;
    }
    .title-bar-controls button {
      display: block;
      min-height: 14px;
      min-width: 16px;
      padding: 0;
      border: none;
      border-radius: 0;
      background: silver;
      box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;
      cursor: pointer;
    }
    .title-bar-controls button:active {
      padding: 0;
      box-shadow: inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px grey;
    }
    .title-bar-controls button:focus {
      outline: none;
    }
    .title-bar-controls button[aria-label=Minimize] {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='6' height='2' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23000' d='M0 0h6v2H0z'/%3E%3C/svg%3E");
      background-position: bottom 3px left 4px;
      background-repeat: no-repeat;
    }
    .title-bar-controls button[aria-label=Close] {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='8' height='7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0h2v1h1v1h2V1h1V0h2v1H7v1H6v1H5v1h1v1h1v1h1v1H6V6H5V5H3v1H2v1H0V6h1V5h1V4h1V3H2V2H1V1H0V0z' fill='%23000'/%3E%3C/svg%3E");
      background-position: top 3px left 4px;
      background-repeat: no-repeat;
      margin-left: 2px;
    }

    /* sunken panel */
    .sunken-panel {
      border: 2px groove transparent;
      border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='5' height='5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='gray' d='M0 0h4v1H0z'/%3E%3Cpath fill='gray' d='M0 0h1v4H0z'/%3E%3Cpath fill='%230a0a0a' d='M1 1h2v1H1z'/%3E%3Cpath fill='%230a0a0a' d='M1 1h1v2H1z'/%3E%3Cpath fill='%23fff' d='M0 4h5v1H0z'/%3E%3Cpath fill='%23fff' d='M4 0h1v5H4z'/%3E%3Cpath fill='%23dfdfdf' d='M3 1h1v3H3z'/%3E%3Cpath fill='%23dfdfdf' d='M1 3h3v1H1z'/%3E%3C/svg%3E") 2;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: 6px;
      margin-bottom: 6px;
    }
    #coverArt {
      width: 72px;
      height: 72px;
      margin-right: 10px;
      object-fit: cover;
      flex-shrink: 0;
      border: 1px solid #808080;
    }
    #info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
    }
    #songTitle {
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 3px;
      color: #000;
    }
    #artistName {
      color: #444;
      font-style: italic;
    }

    /* standard buttons */
    #controls {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin: 6px 0;
    }
    #controls button {
      background: silver;
      border: none;
      border-radius: 0;
      box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;
      color: transparent;
      min-height: 23px;
      min-width: 60px;
      padding: 0 8px;
      text-shadow: 0 0 #222;
      cursor: pointer;
    }
    #controls button:not(:disabled):active {
      box-shadow: inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px grey;
      text-shadow: 1px 1px #222;
    }
    #controls button:focus {
      outline: 1px dotted #000;
      outline-offset: -4px;
    }

    /* progress indicator */
    .progress-indicator {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      border: none;
      border-radius: 0;
      box-shadow: inset -2px -2px #dfdfdf, inset 2px 2px grey;
      height: 18px;
      padding: 2px;
      position: relative;
      cursor: pointer;
      margin: 6px 0 2px 0;
      width: 100%;
      background: silver;
    }
    .progress-indicator > .progress-indicator-bar {
      display: block;
      height: 100%;
      width: 0%;
      background-color: transparent;
      background-image: linear-gradient(90deg, #7C9CCC 16px, transparent 0 2px);
      background-repeat: repeat;
      background-size: 18px 100%;
    }
    #timeDisplay {
      display: block;
      text-align: right;
      font-size: 10px;
      color: #333;
      margin-bottom: 6px;
    }

    /* select dropdown */
    select {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-color: #fff;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 0H0v16h1V1h14V0z' fill='%23DFDFDF'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 1H1v14h1V2h12V1H2z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 17H0v-1h15V0h1v17z' fill='%23000'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 1h-1v14H1v1h14V1z' fill='gray'/%3E%3Cpath fill='silver' d='M2 2h12v13H2z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11 6H4v1h1v1h1v1h1v1h1V9h1V8h1V7h1V6z' fill='%23000'/%3E%3C/svg%3E");
      background-position: top 2px right 2px;
      background-repeat: no-repeat;
      border: none;
      border-radius: 0;
      box-shadow: inset -1px -1px #fff, inset 1px 1px grey, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a;
      height: 21px;
      padding: 3px 4px;
      padding-right: 32px;
      position: relative;
      width: 100%;
      margin: 4px 0 6px 0;
    }
    select:focus {
      outline: none;
      background-color: #7C9CCC;
      color: #fff;
    }
    select:focus option {
      background-color: #fff;
      color: #000;
    }

    /* range slider */
    .slider-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 4px 0;
    }
    input[type=range] {
      -webkit-appearance: none;
      background: transparent;
      flex: 1;
      margin: 0 8px;
    }
    input[type=range]:focus {
      outline: none;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0v16h2v2h2v2h1v-1H3v-2H1V1h9V0z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1 1v15h1v1h1v1h1v1h2v-1h1v-1h1v-1h1V1z' fill='%23C0C7C8'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 1h1v15H8v2H6v2H5v-1h2v-2h2z' fill='%2387888F'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10 0h1v16H9v2H7v2H5v1h1v-2h2v-2h2z' fill='%23000'/%3E%3C/svg%3E");
      border: none;
      box-shadow: none;
      height: 21px;
      transform: translateY(-8px);
      width: 11px;
      cursor: pointer;
    }
    input[type=range]::-moz-range-thumb {
      background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='21' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0v16h2v2h2v2h1v-1H3v-2H1V1h9V0z' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1 1v15h1v1h1v1h1v1h2v-1h1v-1h1v-1h1V1z' fill='%23C0C7C8'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9 1h1v15H8v2H6v2H5v-1h2v-2h2z' fill='%2387888F'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10 0h1v16H9v2H7v2H5v1h1v-2h2v-2h2z' fill='%23000'/%3E%3C/svg%3E");
      border: 0;
      border-radius: 0;
      height: 21px;
      transform: translateY(2px);
      width: 11px;
      cursor: pointer;
    }
    input[type=range]::-webkit-slider-runnable-track {
      background: #000;
      border-bottom: 1px solid grey;
      border-right: 1px solid grey;
      box-shadow: 1px 0 0 #fff, 1px 1px 0 #fff, 0 1px 0 #fff, -1px 0 0 #a9a9a9, -1px -1px 0 #a9a9a9, 0 -1px 0 #a9a9a9, -1px 1px 0 #fff, 1px -1px #a9a9a9;
      height: 2px;
      width: 100%;
    }
    input[type=range]::-moz-range-track {
      background: #000;
      border-bottom: 1px solid grey;
      border-right: 1px solid grey;
      box-shadow: 1px 0 0 #fff, 1px 1px 0 #fff, 0 1px 0 #fff, -1px 0 0 #a9a9a9, -1px -1px 0 #a9a9a9, 0 -1px 0 #a9a9a9, -1px 1px 0 #fff, 1px -1px #a9a9a9;
      height: 2px;
      width: 100%;
    }
  `;
  document.head.appendChild(style);

  // create HTML
  const player = document.createElement("div");
  player.id = "player98";
  player.className = "window";

  const titleBar = document.createElement("div");
  titleBar.className = "title-bar";
  titleBar.innerHTML = `<div class="title-bar-text">ArmyTwoPointOh's TCT Music Player</div>
                        <div class="title-bar-controls"><button aria-label="Minimize"></button><button aria-label="Close"></button></div>`;
  player.appendChild(titleBar);

  const windowBody = document.createElement("div");
  windowBody.className = "window-body";

  const soundtrackSelector = document.createElement("select");
  soundtrackSelector.id = "soundtrackSelector";
  playlists.forEach((pl, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = pl.name;
    soundtrackSelector.appendChild(opt);
  });
  windowBody.appendChild(soundtrackSelector);

  const display = document.createElement("div");
  display.id = "display";
  display.className = "sunken-panel";
  display.innerHTML = `
    <img id="coverArt" src="${activePlaylist.getCurrentSong().getCoverLink()}" />
    <div id="info">
      <div id="songTitle">${activePlaylist.getCurrentSong().getTitle()}</div>
      <div id="artistName">${activePlaylist.getCurrentSong().getArtist()}</div>
    </div>`;
  windowBody.appendChild(display);

  const controls = document.createElement("div");
  controls.id = "controls";
  controls.innerHTML = `
    <button id="prevTrack">◄◄</button>
    <button id="playPause">▶</button>
    <button id="nextTrack">►►</button>
    <button id="loopTrack">↻</button>
  `;
  windowBody.appendChild(controls);

  const progressContainer = document.createElement("div");
  progressContainer.id = "progressContainer";
  progressContainer.className = "progress-indicator segmented";
  const progressFill = document.createElement("span");
  progressFill.id = "progressFill";
  progressFill.className = "progress-indicator-bar";
  progressContainer.appendChild(progressFill);
  windowBody.appendChild(progressContainer);

  const timeDisplay = document.createElement("span");
  timeDisplay.id = "timeDisplay";
  timeDisplay.textContent = "0:00 / 0:00";
  windowBody.appendChild(timeDisplay);

  const volumeRow = document.createElement("div");
  volumeRow.className = "slider-row";
  volumeRow.innerHTML = `
    <span>Vol:</span>
    <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="${currentVolume}">
    <span id="volumeDisplay">100%</span>
  `;
  windowBody.appendChild(volumeRow);

  player.appendChild(windowBody);

  const gameWindow = document.getElementById("game_window");
  if (gameWindow) {
    gameWindow.insertAdjacentElement("afterend", player);
  } else {
    document.body.appendChild(player);
  }

  // setup audio & logic
  const audio = getAudioElement();
  audio.volume = currentVolume;

  const playPauseBtn = document.getElementById("playPause");
  const prevBtn = document.getElementById("prevTrack");
  const nextBtn = document.getElementById("nextTrack");
  const loopBtn = document.getElementById("loopTrack");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeDisplay = document.getElementById("volumeDisplay");

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

  // loop toggle
  loopBtn.addEventListener("click", () => {
    loopSong = !loopSong;
    audio.loop = loopSong;
    loopBtn.textContent = loopSong ? "⇆" : "↻";
  });

  // playlist change
  soundtrackSelector.addEventListener("change", (e) => {
    changePlaylist(playlists[e.target.value]);
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
        timeDisplay.textContent = `${formatTime(percent * duration)} / ${formatTime(duration)}`;
      }
    } else if (Number.isFinite(audio.duration)) {
      audio.currentTime = percent * audio.duration;
      progressFill.style.width = (percent * 100) + "%";
      timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
  });

  // volume control
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseFloat(e.target.value);
    audio.volume = currentVolume;
    volumeDisplay.textContent = `${Math.round(currentVolume * 100)}%`;
    if (ytPlayer && isYTReady && ytPlayer.setVolume) {
      ytPlayer.setVolume(currentVolume * 100);
    }
  });

  // audio events
  audio.addEventListener("timeupdate", () => {
    if (!isCurrentYT && Number.isFinite(audio.duration)) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = percent + "%";
      timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
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
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
      }
    }
  }, 250);

  // initial play
  playSongAtIndex();
}

setupMusicPlayer();