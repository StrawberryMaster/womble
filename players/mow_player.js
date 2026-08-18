// This is a modified version of the music player
// used in the mod 1936: March on Washington.
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
let currentVolume = 6;

// assets
const ASSETS = {
  bg: "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Radio%20Assets/MOW%20Radio%20Texture%20Background.png",
  infoBg: "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Radio%20Assets/MOW%20Radio%20Info%20Lable.png",
  lipOverlay: "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Radio%20Assets/MOW%20Radio%20Texture%20Foreground.png",
  volDown: "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Radio%20Assets/MOW%20Radio%20Dial%20Left.png",
  btnPrev: "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Radio%20Assets/MOW%20Radio%20Dial%20Left.png",
  btnPlay: "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Radio%20Assets/MOW%20Radio%20Dial%20On.png",
  btnPause: "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Radio%20Assets/MOW%20Radio%20Dial%20Off.png",
  btnNext: "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Radio%20Assets/MOW%20Radio%20Dial%20Right.png",
  volUp: "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Radio%20Assets/MOW%20Radio%20Dial%20Right.png"
};

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  // ensure audio exists before trying to access it
  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.audioLink;
    audio.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
    updatePlayPauseIcon(true);
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

function rotateButton(button, direction) {
  if (!button) return;
  const rotationAngle = direction === "left" ? "rotate(-15deg)" : "rotate(15deg)";
  button.style.transform = rotationAngle;
  setTimeout(() => {
    button.style.transform = "rotate(0deg)";
  }, 200);
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
    ["Which Side Are You On?", "Pete Seeger, The Almanac Singers", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20Almanac%20Singers.png", "https://audio.jukehost.co.uk/njztnzwgc4FWa2cPgZPSO6ZwcvSOiGEA"],
    ["In a Shanty in Old Shanty Town", "The Ink Spots", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20Ink%20Spots.png", "https://audio.jukehost.co.uk/o8dkA6LpnVzcENI03aLxjWit8AnQtdyh"],
    ["We're In The Money", "Bing Crosby", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20We're%20In%20Da%20Money%20Baybee.png", "https://audio.jukehost.co.uk/q5tBCBn9ksmelqZrtx2V1pZW9Wdeowe7"],
    ["Give Me Liberty Or Give Me Love", "Mildred Bailey", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20Mildred%20Bailey.png", "https://audio.jukehost.co.uk/lpWKdRv8lEO1Em1tW4vgK9Ymby4GH1U3"],
    ["Anything Goes", "Cole Porter", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20Anything%20Goes.png", "https://audio.jukehost.co.uk/1ZFEdOCUlv5ifq1B0o748T9pm3LeN411"],
    ["Can’t Teach My Old Heart New Tricks", "Benny Goodman, Martha Tilton", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20Benny%20Goodman%20Jumpscare.png", "https://audio.jukehost.co.uk/luWM971dOG0re3BqUSDpZ1cpTSuWiSGN"],
    ["Brother, Can You Spare A Dime?", "Bing Crosby", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20Can%20You%20Spare%20A%20Dime.png", "https://audio.jukehost.co.uk/APDB9RqSmUeppOWSMD3yPWEFpXVJtd7b"],
    ["Bank Failures", "Bob Miller", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20Bob%20MIller.png", "https://audio.jukehost.co.uk/TIhxbDbzY4AoVhv0MWgzACgMhqWvCFhq"],
    ["The Bourgeois Blues", "Lead Belly", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20Lead%20Belly.png", "https://audio.jukehost.co.uk/dS15xXisEWoTxlT4SrH5DbL2xziZvUXW"],
    ["All You Fascists", "Woody Guthrie", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20Woody%20Guthrie.png", "https://audio.jukehost.co.uk/Zbr7cUAOA5ep4GCDAJVat62C6mDIqVXQ"],
    ["I Don't Want Your Millions, Mister", "Pete Seeger, The Almanac Singers", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20Almanac%20Singers.png", "https://audio.jukehost.co.uk/hjULxw3tbuREOLCLXmcoiz6yuqq21xY9"],
    ["This Land is Your Land", "Woody Guthrie", "https://file.garden/aI9Kl6CdkxABOmSP/1936%20MOW/Album%20Covers/MOW%20Woody%20Guthrie.png", "https://audio.jukehost.co.uk/2P9hXyQPFPDtKHKd34yE1tPaoSlii36I"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player {
      position: relative;
      border: 3px solid #5e2f0d;
      display: flex;
      flex-direction: row;
      height: 191px;
      background-image: url("${ASSETS.bg}");
      transition: transform 0.2s ease;
    }
    #lip-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      pointer-events: none;
      background-image: url("${ASSETS.lipOverlay}");
      background-size: cover;
    }
    #display-box {
      display: flex;
      align-items: center;
      width: 50%;
    }
    #cover {
      width: 176px;
      height: 176px;
      margin-left: 14px;
      object-fit: cover;
    }
    #info-container {
      display: flex;
      flex-direction: row;
      height: 178px;
      width: 127px;
      margin-top: 3px;
      background-image: url("${ASSETS.infoBg}");
      background-size: cover;
      color: #cda758;
    }
    #song-info {
      width: 100%;
      padding: 10px 10px 0 10px;
      box-sizing: border-box;
    }
    #song-info h3 {
      font-weight: normal;
      margin: 0;
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
      cursor: pointer;
      margin: 1em;
    }
    #controls img {
      max-width: 54px;
      max-height: 54px;
      transition: transform 0.2s ease;
    }
    #progress-bar-container {
      width: 100%;
    }
    #progress-bar {
      width: 80%;
      margin: auto;
      display: flex;
      margin-top: 20px;
      height: 8px;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
      overflow: hidden;
      cursor: pointer;
    }
    #progress-bar::-webkit-progress-bar {
      background-color: rgba(0, 0, 0, 0.5);
    }
    #progress-bar::-webkit-progress-value {
      background-color: rgba(255, 255, 255, 0.5);
    }
    #progress-bar::-moz-progress-bar {
      background-color: rgba(255, 255, 255, 0.5);
    }
  `;
  document.head.appendChild(style);

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <div id="display-box">
      <img id="cover" src="" alt="Cover">
      <div id="info-container">
        <div id="song-info">
          <h3 id="title"></h3>
          <p id="artist"></p>
        </div>
      </div>
    </div>
    <div id="controls-container">
      <div id="controls">
        <img id="volumeDownButton" src="${ASSETS.volDown}" alt="Volume Down">
        <img id="prevButton" src="${ASSETS.btnPrev}" alt="Previous">
        <img id="playPauseButton" src="${ASSETS.btnPause}" alt="Play/Pause">
        <img id="nextButton" src="${ASSETS.btnNext}" alt="Next">
        <img id="volumeUpButton" src="${ASSETS.volUp}" alt="Volume Up">
      </div>
      <div id="progress-bar-container">
        <progress id="progress-bar" value="0" max="100"></progress>
      </div>
    </div>
    <div id="lip-overlay"></div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.audioLink;
  audio.volume = currentVolume / 20;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const volumeUpBtn = document.getElementById("volumeUpButton");
  const volumeDownBtn = document.getElementById("volumeDownButton");
  const progressBar = document.getElementById("progress-bar");

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

  // next/prev helper
  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    audio.src = activePlaylist.getCurrentSong().audioLink;
    audio.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
    updatePlayPauseIcon(true);
  };

  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playSongAtIndex();
    rotateButton(nextBtn, "right");
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playSongAtIndex();
    rotateButton(prevBtn, "left");
  });

  // volume controls
  volumeUpBtn.addEventListener("click", () => {
    if (currentVolume < 20) {
      currentVolume++;
      audio.volume = currentVolume / 20;
      rotateButton(volumeUpBtn, "left");
    }
  });

  volumeDownBtn.addEventListener("click", () => {
    if (currentVolume > 0) {
      currentVolume--;
      audio.volume = currentVolume / 20;
      rotateButton(volumeDownBtn, "right");
    }
  });

  // progress bar
  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  progressBar.addEventListener("click", (e) => {
    if (Number.isFinite(audio.duration)) {
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pos * audio.duration;
    }
  });

  progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
  });

  // initial play
  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

setupMusicPlayer();
