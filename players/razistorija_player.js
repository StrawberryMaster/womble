// This is a modified version of the music player
// used in 2012: Razistorija.
// classes
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

// assets
const IMG_BASE = "https://file.garden/YfskK7H8Sw3Gtah5/";
const AUDIO_BASE = "https://audio.jukehost.co.uk/";

const ASSETS = {
  bg: IMG_BASE + "REGIMERRADIO.png",
  infoBg: IMG_BASE + "EIMELODIJA.png",
  btnPrev: IMG_BASE + "skipbackbutton.png",
  btnPlay: IMG_BASE + "playbutton.png",
  btnPause: IMG_BASE + "starbutton.png",
  btnNext: IMG_BASE + "skipbutton.png"
};

// state
let activePlaylist = new Playlist();
let audioInstance = null;
let currentVolume = 9;

// track data
const MAIN_TRACKS = [
  ["Razistorija Opening", "Sibila and RTS", "REGIME.png", "cvllb60ARmmYBpLPz7T4ewdisoM6ZXF0"],
  ["Ljubav je San (1991)", "Vampiri", "VAMPIRI.png", "F7rR6gssR0mns7Jwd1Xw1X6yG3mEH7Gg"],
  ["Nitko Kao Ti (2004)", "Songkillers", "SONGKILLERS.png", "JuHcZi0uiXfSXrJU4OVyp19s2tBrrRCf"],
  ["Nestajem (2004)", "Yammat", "BELGRADECALLING.jpg", "bY69jYOf4K1U2lSgCuqNPEj1RQifecJv"],
  ["Regioni (2004)", "Darkwood Dub", "DARKWOODUB.jpg", "vRF3CzV0T8lrJ3VXLL0PkQ01WU35UHqn"],
  ["Samo za Sebe (1993)", "Odvojena Stvarnost", "SAMOZASEBE.jpg", "nf5rj9kMWLhNi9rf9BZtmjnH0zoZt3Ya"],
  ["Idemo u kracu setnju, moramo da razgovaramo (2001)", "Virvel", "VIRVEL.jpg", "GtRhb1IzOOzg625bNRzeEtqOnLeN7lAT"],
  ["Opet Sam Sam (2001)", "Crvena Jabuka", "CRVENAJABUKA.jpg", "5T0zzmNOgkYFEC2gRSD7PKKhDAFzXQwF"],
  ["Američka Noć (1999)", "Jarboli", "JARBOLI.jpg", "SriJwmw74DZ6kvSSc4qz6AKpc3SAhTdr"],
  ["Prah (1986)", "Karstof", "https://file.garden/YRa6FQczOTYxCsTk/image-80.png", "ii84jiqn7A4Ei44QsKMibQ5prb0FbPQ8"],
  ["Gospodar Snova (1986-1999)", "Max Vincent", "Moskva.jpg", "yD9JJvChZHe45RAhTub9U2sraTdmd1vw"]
];

const INSTRUMENTAL_TRACKS = [
  ["Excerpt (1989)", "Kula Vavilonska", "excerpt.png", "84XAVvyRWkfPikgmQ2XBcvF9zU754Bqn"],
  ["Život počinje u 30oj (2002)", "Darkwood Dub", "whabamf.png", "JnoAz0MhZBmCdWA6SwAodivlUGgTvx12"],
  ["Šetnja Kroz Park (2006)", "Tena Novak", "NOVAK.jpg", "RNtTO9txnmRZGxZLHMiw8KMIRX8sL8Rh"],
  ["Untitled (1982)", "Autopsia", "autopsiauntitle.png", "tIOl6kvkm8PZJFNnrWMbXBSYBF2Zsl96"],
  ["Icon (1987)", "Sanja & Sloba", "PROJECT.jpg", "MdMWgR9zkJgENylGymJnn4gCHaJbnkLl"],
  ["Kqstyz 2000 (2024)", "Tachyon", "TACHYON.jpg", "f2usLsVTw1meqTYSRWjZyG862RmTNcRh"],
  ["Osma uganka ti Zvezdica Zaspanka Omara Vidriga Von Vojaš (2024)", "Tachyon", "TACHYON.jpg", "IPthZzOolTwsCfdds6kFQ1npgoPvqZ3F"],
  ["Slijepa Ulica (2006)", "Tena Novak", "NOVAK.jpg", "vedaS5yc9hgkMoMnbQJsFI23AeTpueEB"]
];

function createSongsFromData(trackData) {
  return trackData.map(([title, artist, cover, audio]) => new Song(
    title,
    artist,
    cover.startsWith("http") ? cover : IMG_BASE + cover,
    AUDIO_BASE + audio
  ));
}

// change playlist
function changePlaylist(newPlaylist) {
  if (!newPlaylist || !(newPlaylist instanceof Playlist)) {
    console.error("Invalid playlist provided.");
    return;
  }

  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.getAudioLink();
    audio.play()
      .then(() => updatePlayPauseIcon(true))
      .catch(e => console.log("Autoplay blocked or waiting for interaction", e));
  }
}
window.changePlaylist = changePlaylist;

// update ui
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

// setup
function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) {
    console.warn("game_window element not found. Player will not be attached.");
    return;
  }

  // prevent duplicate players
  if (document.getElementById("player")) return;

  // playlists
  const mainPlaylist = new Playlist();
  createSongsFromData(MAIN_TRACKS).forEach(song => mainPlaylist.addSong(song));

  const instrumentalPlaylist = new Playlist();
  createSongsFromData(INSTRUMENTAL_TRACKS).forEach(song => instrumentalPlaylist.addSong(song));

  if (activePlaylist.songs.length === 0) {
    activePlaylist = mainPlaylist;
  }

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player {
      display: flex;
      flex-direction: row;
      height: 261px;
      width: 976px;
      background-image: url("${ASSETS.bg}");
      box-shadow: 5px 5px 15px black;
      font-family: sans-serif;
    }

    #display-box {
      display: flex;
      align-items: center;
      width: 50%;
      padding-top: 100px;
    }

    #cover {
      width: 159px;
      height: 159px;
      border: 1px solid black;
      object-fit: cover;
      cursor: pointer;
      user-select: none;
    }

    #info-container {
      display: flex;
      flex-direction: row;
      height: 161px;
      width: 127px;
      background-image: url("${ASSETS.infoBg}");
      background-size: cover;
      color: #fff;
      font-family: "Libre Baskerville", Cambria, serif;
    }

    #song-info {
      width: 100%;
      padding-left: 16px;
      padding-right: 16px;
      box-shadow: 6px 0px 5px black;
      box-sizing: border-box;
    }

    #title {
      font-weight: normal;
      margin: 10px 0 10px 0;
      font-size: 14px;
    }

    #artist {
      margin: 0;
      font-size: 12px;
      color: #e3e3e3;
    }

    #controls-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
      width: 100%;
      padding-top: 110px;
    }

    #controls {
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 80%;
      gap: 5px;
    }

    #prevButton, #playPauseButton, #nextButton {
      filter: drop-shadow(black 0.5rem 0.5rem 10px);
      transition: transform 0.1s;
      cursor: pointer;
    }

    #controls img:active {
      transform: scale(0.95);
    }

    #progress-bar-container {
      width: 100%;
	  margin-top: 5px;
      text-align: center;
    }

    #progress-bar {
      width: 85%;
      margin: auto;
      display: flex;
      margin-top: 20px;
      background-color: #261818;
      border-radius: 2px;
      cursor: pointer;
    }

    #progress-bar::-webkit-progress-bar {
      background-color: #ccc;
    }

    #progress-bar::-webkit-progress-value,
    #progress-bar::-moz-progress-bar {
      background-color: red;
    }

    #volume-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 100%;
      margin-right: 2.5em;
      margin-top: 3em;
    }

    .vol-wrapper {
      position: relative;
      height: 100px;
      margin-top: 5px;
    }

    #volumeSlider {
      appearance: none;
      -webkit-appearance: none;
      width: 12px;
      height: 100%;
      writing-mode: vertical-lr;
      direction: rtl;
      background: transparent;
      cursor: pointer;
    }

    #volumeSlider::-webkit-slider-runnable-track {
      width: 8px;
      background: linear-gradient(to top, red var(--volume, 100%), #ccc 0%);
      border-radius: 4px;
    }

    #volumeSlider::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      background: #FF5B5B;
      border-radius: 40%;
      margin: 0 0 0 -2px;
    }

    #volumeSlider::-moz-range-track {
      width: 8px;
      background: linear-gradient(to top, red var(--volume, 100%), #ccc 0%);
      border-radius: 4px;
    }

    #volumeSlider::-moz-range-thumb {
      width: 12px;
      height: 12px;
      background: #FF5B5B;
      border-radius: 40%;
      border: none;
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
      <img id="cover" src="" alt="Album cover">
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
        <img id="playPauseButton" src="${ASSETS.btnPlay}" alt="Play/Pause">
        <img id="nextButton" src="${ASSETS.btnNext}" alt="Next">
      </div>
      <div id="progress-bar-container">
        <progress id="progress-bar" value="0" min="0" max="100"></progress>
      </div>
    </div>
    <div id="volume-container">
      <div class="vol-wrapper">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="${currentVolume}" orient="vertical">
      </div>
      <span id="volume-display">${currentVolume}</span>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.getAudioLink();
  audio.volume = currentVolume / 9;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volumeSlider");
  const volDisplay = document.getElementById("volume-display");
  const cover = document.getElementById("cover");

  // switch playlist via cover dblclick
  const availablePlaylists = [mainPlaylist, instrumentalPlaylist].filter(Boolean);
  if (cover) {
    cover.addEventListener("dblclick", () => {
      if (availablePlaylists.length > 1) {
        const currentIndex = availablePlaylists.indexOf(activePlaylist);
        const nextIndex = (currentIndex + 1) % availablePlaylists.length;
        changePlaylist(availablePlaylists[nextIndex]);
      }
    });
  }

  // play/pause
  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    audio.src = activePlaylist.getCurrentSong().getAudioLink();
    audio.play()
      .then(() => updatePlayPauseIcon(true))
      .catch(e => console.log("Playback error:", e));
  };

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play()
        .then(() => updatePlayPauseIcon(true))
        .catch(e => console.log("Playback error:", e));
    } else {
      audio.pause();
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

  // progress bar
  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  let isDragging = false;

  const updateAudioTime = (event) => {
    if (!Number.isFinite(audio.duration)) return;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = (clickX / rect.width) * audio.duration;
    audio.currentTime = Math.max(0, Math.min(newTime, audio.duration));
  };

  progressBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateAudioTime(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) updateAudioTime(e);
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // volume
  const updateVolumeStyle = (val) => {
    const pct = (val / 9) * 100;
    volumeSlider.style.setProperty('--volume', `${pct}%`);
  };

  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    volDisplay.textContent = currentVolume;
    audio.volume = currentVolume / 9;
    updateVolumeStyle(currentVolume);
  });

  updateVolumeStyle(currentVolume);

  // initial play
  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

// setup
setupMusicPlayer();
