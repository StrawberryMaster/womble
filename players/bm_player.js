// This is a modified version of the music player
// used in the mod Bob's Macarena.
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

  const cover = document.getElementById("cover");
  const title = document.getElementById("title");
  const artist = document.getElementById("artist");

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
  const defaultPlaylist = new Playlist("The Senator's Tumble");
  defaultPlaylist.addSong(new Song(
    "Macarena", "Los Del Rio ‧ 1993",
    "https://files.catbox.moe/gfggqq.png",
    "https://files.catbox.moe/msyl1k.mp3"
  ));

  const playlist1 = new Playlist("FM 90.1 (Steady Tunes)");
  playlist1.addSong(new Song(
    "I Believe I Can Fly", "R. Kelly ‧ 1997",
    "https://files.catbox.moe/xrwsna.png",
    "https://files.catbox.moe/0bvsll.mp3"
  ));
  playlist1.addSong(new Song(
    "I Don't Want to Miss a Thing", "Aerosmith ‧ 1998",
    "https://files.catbox.moe/c30ml3.png",
    "https://files.catbox.moe/q20nux.mp3"
  ));
  playlist1.addSong(new Song(
    "I Want It That Way", "Backstreet Boys ‧ 1999",
    "https://files.catbox.moe/dunr4h.png",
    "https://files.catbox.moe/n60qaj.mp3"
  ));
  playlist1.addSong(new Song(
    "I Want to Know What Love Is", "Foreigner ‧ 1999 (Remastered)",
    "https://files.catbox.moe/jp9cfh.png",
    "https://files.catbox.moe/gwsdcz.mp3"
  ));
  playlist1.addSong(new Song(
    "I Knew I Loved You", "Savage Garden ‧ 1999",
    "https://files.catbox.moe/kdhjpj.png",
    "https://files.catbox.moe/3tmsv7.mp3"
  ));
  playlist1.addSong(new Song(
    "Music", "Madonna ‧ 2000",
    "https://files.catbox.moe/v82x55.png",
    "https://files.catbox.moe/lioj4r.mp3"
  ));
  playlist1.addSong(new Song(
    "Smooth", "Santana (feat. Rob Thomas) ‧ 1999",
    "https://files.catbox.moe/et28xr.png",
    "https://files.catbox.moe/zyr4bv.mp3"
  ));  
  playlist1.addSong(new Song(
    "My Heart Will Go On", "Celine Dion ‧ 1997",
    "https://files.catbox.moe/92u8q0.png",
    "https://files.catbox.moe/xrwax1.mp3"
  ));  

  const playlist2 = new Playlist("FM 93.1 (Intense Tunes)");
  playlist2.addSong(new Song(
    "Paranoid Android", "Radiohead ‧ 1997",
    "https://files.catbox.moe/dj4eo9.png",
    "https://files.catbox.moe/9pn2nn.mp3"
  ));
  playlist2.addSong(new Song(
    "99 Red Balloons", "Goldfinger ‧ 2000",
    "https://files.catbox.moe/e9shkj.png",
    "https://files.catbox.moe/v4wxcn.mp3"
  ));
  playlist2.addSong(new Song(
    "Breathe", "The Prodigy ‧ 1996",
    "https://files.catbox.moe/tncm0b.png",
    "https://files.catbox.moe/sddnkz.mp3"
  ));
  playlist2.addSong(new Song(
    "Block Rockin' Beats", "The Chemical Brothers ‧ 1997",
    "https://files.catbox.moe/5zx5rm.png",
    "https://files.catbox.moe/8s0sbi.mp3"
  ));
  playlist2.addSong(new Song(
    "Firestarter", "The Prodigy ‧ 1997",
    "https://files.catbox.moe/w8rdc6.png",
    "https://files.catbox.moe/6roskn.mp3"
  ));
  playlist2.addSong(new Song(
    "Papercut", "Linkin Park ‧ 2000",
    "https://files.catbox.moe/ebriii.png",
    "https://files.catbox.moe/bbg3ho.mp3"
  ));
  playlist2.addSong(new Song(
    "Ocean Man", "Ween ‧ 1997",
    "https://files.catbox.moe/a4xxjh.png",
    "https://files.catbox.moe/rz74mh.mp3"
  ));

  playlists = [defaultPlaylist, playlist1, playlist2];
  activePlaylist = defaultPlaylist;

  // inject css
  const style = document.createElement("style");
  style.textContent = `
    #player98, #player98 * {
      -webkit-font-smoothing: none;
      font-family: "Pixelated MS Sans Serif", Arial, sans-serif;
      font-size: 11px;
      box-sizing: border-box;
    }

    /* window frame */
    .window {
      background: silver;
      box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px #fff;
      padding: 3px;
      width: 350px;
      user-select: none;
      margin-top: 8px;
    }

    .window-body {
      margin: 8px 4px 4px 4px;
    }

    /* title bar & controls */
    .title-bar {
      align-items: center;
      background: linear-gradient(90deg, navy, #1084d0);
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
      padding: 4px;
      margin-bottom: 6px;
    }
    #cover {
      width: 60px;
      height: 60px;
      margin-right: 8px;
      object-fit: cover;
      flex-shrink: 0;
    }
    #info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
    }
    #title {
      font-weight: bold;
      margin-bottom: 2px;
    }

    /* buttons */
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
      min-width: 58px;
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
      margin: 6px auto;
      width: 100%;
      background: silver;
    }
    .progress-indicator > .progress-indicator-bar {
      display: block;
      height: 100%;
      width: 0%;
      background-color: transparent;
      background-image: linear-gradient(90deg, navy 16px, transparent 0 2px);
      background-repeat: repeat;
      background-size: 18px 100%;
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
      margin: 6px 0;
    }
    select:focus {
      outline: none;
      background-color: navy;
      color: #fff;
    }
    select:focus option {
      background-color: #fff;
      color: #000;
    }
    select:active {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='16' height='17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0h16v17H0V0zm1 16h14V1H1v15z' fill='gray'/%3E%3Cpath fill='silver' d='M1 1h14v15H1z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12 7H5v1h1v1h1v1h1v1h1v-1h1V9h1V8h1V7z' fill='%23000'/%3E%3C/svg%3E");
    }

    /* range slider */
    #volumeLabel {
      margin: 6px 0 2px 0;
    }
    input[type=range] {
      -webkit-appearance: none;
      background: transparent;
      width: 100%;
      margin: 6px 0;
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
  titleBar.innerHTML = `<div class="title-bar-text">Windows Media Player</div>
                        <div class="title-bar-controls"><button aria-label="Minimize"></button><button aria-label="Close"></button></div>`;
  player.appendChild(titleBar);

  const windowBody = document.createElement("div");
  windowBody.className = "window-body";

  const display = document.createElement("div");
  display.id = "display";
  display.className = "sunken-panel";
  display.innerHTML = `
    <img id="cover" src="${activePlaylist.getCurrentSong().getCoverLink()}" />
    <div id="info">
      <div id="title">${activePlaylist.getCurrentSong().getTitle()}</div>
      <div id="artist">${activePlaylist.getCurrentSong().getArtist()}</div>
    </div>`;
  windowBody.appendChild(display);

  const controls = document.createElement("div");
  controls.id = "controls";
  controls.innerHTML = `
    <button id="prev">◄◄</button>
    <button id="playPause">▶</button>
    <button id="next">►►</button>
    <button id="loop">↻</button>
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

  const playlistSelector = document.createElement("select");
  playlistSelector.id = "playlistSelector";
  playlists.forEach((pl, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = pl.name;
    playlistSelector.appendChild(opt);
  });
  windowBody.appendChild(playlistSelector);

  const volumeLabel = document.createElement("div");
  volumeLabel.id = "volumeLabel";
  volumeLabel.textContent = "Volume:";
  windowBody.appendChild(volumeLabel);

  const volume = document.createElement("input");
  volume.type = "range";
  volume.id = "volume";
  volume.min = 0;
  volume.max = 1;
  volume.step = 0.01;
  volume.value = currentVolume;
  windowBody.appendChild(volume);

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
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const loopBtn = document.getElementById("loop");

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
  playlistSelector.addEventListener("change", (e) => {
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
      }
    } else if (Number.isFinite(audio.duration)) {
      audio.currentTime = percent * audio.duration;
      progressFill.style.width = (percent * 100) + "%";
    }
  });

  // volume control
  volume.addEventListener("input", (e) => {
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
      }
    }
  }, 250);

  // initial play
  playSongAtIndex();
}

setupMusicPlayer();