// This is a modified version of the music player
// used in the mockup 1996: A New Age.
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
let currentVolume = 1;

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  // ensure audio exists before trying to access it
  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.getAudioLink ? song.getAudioLink() : song.audioLink;
    audio.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
    updatePlayPauseIcon(true);
  }
}
window.changePlaylist = changePlaylist;

function populatePlaylistList(playlist, root) {
  const playlistList = root.querySelector("#playlist-list");
  if (!playlistList) return;
  playlistList.innerHTML = "";
  playlist.songs.forEach((song, i) => {
    const li = document.createElement("li");
    li.textContent = `${song.getTitle()} - ${song.getArtist()}`;
    if (i === playlist.currentSongIndex) {
      li.classList.add("active");
    }
    li.addEventListener("click", () => {
      playlist.currentSongIndex = i;
      const audio = getAudioElement();
      audio.src = song.getAudioLink ? song.getAudioLink() : song.audioLink;
      audio.play().then(() => updatePlayPauseIcon(true)).catch(() => updatePlayPauseIcon(false));
      updateUI(playlist);
    });
    playlistList.appendChild(li);
  });
}

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  const player = document.getElementById("player");

  if (!player || !currentSong) return;
  const root = player.shadowRoot || player;

  const cover = root.querySelector("#cover");
  const title = root.querySelector("#title");
  const artist = root.querySelector("#artist");

  if (cover) cover.src = currentSong.getCoverLink();
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();

  const playlistList = root.querySelector("#playlist-list");
  if (playlistList) {
    if (playlistList.children.length !== playlist.songs.length) {
      populatePlaylistList(playlist, root);
    } else {
      playlistList.querySelectorAll("li").forEach((li, i) => {
        li.classList.toggle("active", i === playlist.currentSongIndex);
      });
    }
  }
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
  const player = document.getElementById("player");
  if (!player) return;
  const root = player.shadowRoot || player;
  const btn = root.querySelector("#playPauseButton");
  if (btn) {
    btn.textContent = isPlaying ? "❚❚" : "▶";
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

  // load Chicago font globally
  if (!document.getElementById("chicago-font-style")) {
    const fontStyle = document.createElement("style");
    fontStyle.id = "chicago-font-style";
    fontStyle.textContent = `
      @font-face {
        font-family: 'Chicago';
        src: url('https://raw.githubusercontent.com/KingDuane/Chicago-Kare/refs/heads/main/ChicagoKare-Regular.woff2') format('woff2'),
             url('https://raw.githubusercontent.com/KingDuane/Chicago-Kare/refs/heads/main/ChicagoKare-Regular.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(fontStyle);
  }

  const defaultSongs = [
    ["Pressure", "Billy Joel", "https://upload.wikimedia.org/wikipedia/en/e/e8/PressureBillyJoel.jpg", "https://files.catbox.moe/59ikq4.mp3"],
    ["Walkin' On The Sun", "Smash Mouth", "https://i.scdn.co/image/ab67616d0000b27366ec7d795b727cd90bd09690", "https://file.garden/Zrv1pPC1HzBK0svl/Walkin'%20On%20The%20Sun%204.mp3"],
    ["Man In The Box", "Alice In Chains", "https://upload.wikimedia.org/wikipedia/en/4/43/Alice_In_Chains-Facelift.jpg", "https://files.catbox.moe/2yhy6l.mp3"],
    ["Burnout", "Green Day", "https://upload.wikimedia.org/wikipedia/en/4/4b/Green_Day_-_Dookie_cover.jpg", "https://files.catbox.moe/6fmlsj.mp3"],
    ["Mailman", "Soundgarden", "https://upload.wikimedia.org/wikipedia/en/3/3a/Superunknown.jpg", "https://files.catbox.moe/3s6s6n.mp3"],
    ["Man On A Mission", "Bad Religion", "https://upload.wikimedia.org/wikipedia/en/c/c3/BadReligionRecipeForHate.jpg", "https://files.catbox.moe/ewofcg.mp3"],
    ["Love Me, I'm A Liberal", "Jello Biafra, Mojo Nixon", "https://i.scdn.co/image/ab67616d0000b273b79cc4b3ecfbb32b8ca78c6a", "https://audio.jukehost.co.uk/9oOaNn0HQwCSGnTjzwCXnybZnnClVZ99"],
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  const shadow = playerContainer.attachShadow({ mode: "open" });

  shadow.innerHTML = `
  <style>
    @font-face {
      font-family: 'Chicago';
      src: url('https://raw.githubusercontent.com/KingDuane/Chicago-Kare/refs/heads/main/ChicagoKare-Regular.woff2') format('woff2'),
           url('https://raw.githubusercontent.com/KingDuane/Chicago-Kare/refs/heads/main/ChicagoKare-Regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }

    #mac-window {
      font-family: 'Chicago', 'Geneva', sans-serif;
      color: #000;
      background: #dddddd;
      border: 1px solid #000;
      box-shadow: 2px 2px 0px #000;
      width: 520px;
      margin: 20px auto;
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
    }

    #mac-title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 18px;
      background: repeating-linear-gradient(
        to bottom,
        #000 0px,
        #000 1px,
        #fff 1px,
        #fff 2px
      );
      border-bottom: 1px solid #000;
      padding: 0 4px;
      position: relative;
    }

    .mac-title-btn {
      width: 11px;
      height: 11px;
      background: #fff;
      border: 1px solid #000;
      box-sizing: border-box;
      z-index: 2;
    }

    .mac-title-btn.zoom {
      box-shadow: inset -1px -1px 0 #000;
    }

    #mac-title-text {
      background: #dddddd;
      padding: 0 8px;
      font-size: 14px;
      font-weight: bold;
      color: #000;
      z-index: 2;
      line-height: 14px;
      border-left: 1px solid #000;
      border-right: 1px solid #000;
    }

    #mac-content {
      display: flex;
      flex-direction: row;
      background: #dddddd;
      padding: 8px;
      gap: 8px;
    }

    #playlist-box {
      width: 210px;
      height: 270px;
      overflow-y: auto;
      background: #fff;
      border: 1px solid #000;
      box-shadow: inset 1px 1px 0 #888;
      font-size: 11px;
    }

    #playlist-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    #playlist-list li {
      padding: 4px 6px;
      border-bottom: 1px solid #e0e0e0;
      cursor: pointer;
      background: #fff;
      color: #000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
    }

    #playlist-list li:hover {
      background: #e0e0e0;
    }

    #playlist-list li.active {
      background: #000;
      color: #fff;
    }

    #display-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      padding: 10px;
      background: #fff;
      border: 1px solid #000;
      box-shadow: inset 1px 1px 0 #888;
    }

    #cover {
      width: 110px;
      height: 110px;
      border: 1px solid #000;
      box-shadow: 1px 1px 0 #000;
      object-fit: cover;
      background: #eee;
    }

    #info {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    #info h3 {
      margin: 4px 0 2px 0;
      font-size: 18px;
      font-weight: bold;
      color: #000;
      max-width: 220px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #info p {
      margin: 0 0 8px 0;
      font-size: 16px;
      color: #444;
      max-width: 220px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #controls {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-top: 4px;
    }

    #controls button {
      font-family: 'Chicago', sans-serif;
      background: linear-gradient(180deg, #ffffff 0%, #e6e6e6 100%);
      border: 1px solid #000;
      border-radius: 5px;
      padding: 2px 0;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      width: 44px;
      height: 24px;
      color: #000;
      box-shadow: 1px 1px 0 #000;
    }

    #controls button:active {
      background: #000;
      color: #fff;
      box-shadow: none;
    }

    #progress-shell {
      width: 95%;
      height: 12px;
      border: 1px solid #000;
      margin-top: 10px;
      background: #fff;
      position: relative;
      cursor: pointer;
      box-shadow: inset 1px 1px 0 #888;
    }

    #progress-fill {
      background: #000;
      height: 100%;
      width: 0%;
      pointer-events: none;
    }

    #volume-box {
      margin-top: 10px;
      font-size: 13px;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    #volumeSlider {
      width: 100px;
      height: 10px;
      appearance: none;
      -webkit-appearance: none;
      background: #fff;
      border: 1px solid #000;
      outline: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }

    #volumeSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 14px;
      background: #dddddd;
      border: 1px solid #000;
      box-shadow: inset 1px 1px 0 #fff, 1px 1px 0 #000;
      cursor: pointer;
    }

    #volumeSlider::-moz-range-thumb {
      width: 12px;
      height: 14px;
      background: #dddddd;
      border: 1px solid #000;
      border-radius: 0;
      cursor: pointer;
    }
  </style>

  <div id="mac-window">
    <div id="mac-title-bar">
      <div class="mac-title-btn"></div>
      <span id="mac-title-text">Macintosh Player</span>
      <div class="mac-title-btn zoom"></div>
    </div>
    <div id="mac-content">
      <div id="playlist-box"><ul id="playlist-list"></ul></div>
      <div id="display-box">
        <img id="cover">
        <div id="info">
          <h3 id="title"></h3>
          <p id="artist"></p>
          <div id="controls">
            <button id="prevButton">◀◀</button>
            <button id="playPauseButton">▶</button>
            <button id="nextButton">▶▶</button>
          </div>
          <div id="progress-shell"><div id="progress-fill"></div></div>
          <div id="volume-box">
            <label>VOL</label>
            <input id="volumeSlider" type="range" min="0" max="9" value="1">
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.getAudioLink ? startSong.getAudioLink() : startSong.audioLink;
  audio.volume = currentVolume / 9;

  const playPauseBtn = shadow.querySelector("#playPauseButton");
  const prevBtn = shadow.querySelector("#prevButton");
  const nextBtn = shadow.querySelector("#nextButton");
  const progressShell = shadow.querySelector("#progress-shell");
  const progressFill = shadow.querySelector("#progress-fill");
  const volumeSlider = shadow.querySelector("#volumeSlider");

  // play/pause
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      updatePlayPauseIcon(true);
    } else {
      audio.pause();
      updatePlayPauseIcon(false);
    }
  });

  // next/prev
  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    updateUI(activePlaylist);
    const song = activePlaylist.getCurrentSong();
    if (song) {
      audio.src = song.getAudioLink ? song.getAudioLink() : song.audioLink;
      audio.play();
      updatePlayPauseIcon(true);
    }
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    updateUI(activePlaylist);
    const song = activePlaylist.getCurrentSong();
    if (song) {
      audio.src = song.getAudioLink ? song.getAudioLink() : song.audioLink;
      audio.play();
      updatePlayPauseIcon(true);
    }
  });

  // progress bar seeking
  const seek = (e) => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const rect = progressShell.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      audio.currentTime = pct * audio.duration;
      if (progressFill) progressFill.style.width = (pct * 100) + "%";
    }
  };

  let isSeeking = false;
  progressShell.addEventListener("mousedown", (e) => {
    isSeeking = true;
    seek(e);
  });

  window.addEventListener("mousemove", (e) => {
    if (isSeeking) seek(e);
  });

  window.addEventListener("mouseup", () => {
    isSeeking = false;
  });

  // progress bar time update
  audio.addEventListener("timeupdate", () => {
    if (!isSeeking && Number.isFinite(audio.duration) && audio.duration > 0) {
      const progress = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = progress + "%";
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    updateUI(activePlaylist);
    const song = activePlaylist.getCurrentSong();
    if (song) {
      audio.src = song.getAudioLink ? song.getAudioLink() : song.audioLink;
      audio.play();
      updatePlayPauseIcon(true);
    }
  });

  // volume
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    audio.volume = currentVolume / 9;
  });

  // initial play
  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}
setupMusicPlayer();