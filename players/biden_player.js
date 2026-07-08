// This is a modified version of the music player
// used in the mod Biden '08.
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

// assets
const ASSETS = {
  bg: "https://i.postimg.cc/43VRTVXv/Qbn-Mi4s-Imgur-(1).png",
  infoBg: "",
  btnPrev: "https://file.garden/aNxawo8jlVkymd8s/joe%2008/election%20%2B%20music%20play/emaVVZr%20-%20Imgur.png",
  btnPlay: "https://file.garden/aNxawo8jlVkymd8s/joe%2008/election%20%2B%20music%20play/roCPjJ7%20-%20Imgur.png",
  btnPause: "https://file.garden/aNxawo8jlVkymd8s/joe%2008/election%20%2B%20music%20play/CxAJHDS%20-%20Imgur.png",
  btnNext: "https://file.garden/aNxawo8jlVkymd8s/joe%2008/election%20%2B%20music%20play/prB8JyH%20-%20Imgur.png",
  volIcon: "https://file.garden/aNxawo8jlVkymd8s/joe%2008/election%20%2B%20music%20play/fIQkAed%20-%20Imgur.png"
};

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

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
    ["I'm Yours", "Jason Mraz", "https://file.garden/aOp8cCiQ5ho9r5b1/Biden%20'08%20Assets/Song%20Covers/I'm%20Yours%20Album%20Cover.png", "https://audio.jukehost.co.uk/NKsXFLWEFa6vBMDvTKZRmm1giCMvLFZR"],
    ["What I've Done", "Linkin Park", "https://file.garden/aOp8cCiQ5ho9r5b1/Biden%20'08%20Assets/Song%20Covers/What%20I've%20Done%20Album%20Cover.png", "https://audio.jukehost.co.uk/Mvhy2k9kL7o3dh9yYLeq71K6MvwV6fgh"],
    ["Rehab", "Amy Winehouse", "https://file.garden/aOp8cCiQ5ho9r5b1/Biden%20'08%20Assets/Song%20Covers/Rehab%20Album%20Cover.png", "https://audio.jukehost.co.uk/SrLI389FsGa83nuhnGrzJqBtR895u2gS"],
    ["Makes Me Wonder", "Maroon 5", "https://file.garden/aOp8cCiQ5ho9r5b1/Biden%20'08%20Assets/Song%20Covers/Makes%20Me%20Wonder%20Album%20Cover.png", "https://audio.jukehost.co.uk/anJyKMuPw2esdMzoDpv8SXRHqovTsVn1"],
    ["Dance Tonight", "Paul McCartney", "https://file.garden/aOp8cCiQ5ho9r5b1/Biden%20'08%20Assets/Song%20Covers/Dance%20Tonight%20Album%20Cover.png", "https://audio.jukehost.co.uk/COzBUnJd50RgE88rb2r7uG03bi6iuCEj"],
    ["How Far We've Come", "Matchbox Twenty", "https://file.garden/aOp8cCiQ5ho9r5b1/Biden%20'08%20Assets/Song%20Covers/How%20Far%20We've%20Come%20Album%20Cover.png", "https://audio.jukehost.co.uk/t3qoQy1ozOjnxNcp6qz2aB6a8X9g0V3G"],
    ["Before He Cheats", "Carrie Underwood", "https://file.garden/aOp8cCiQ5ho9r5b1/Biden%20'08%20Assets/Song%20Covers/Before%20He%20Cheats%20Album%20Cover.png", "https://audio.jukehost.co.uk/L9IOj74Bhd0MUvftKXzZCZtAsVLDFyKa"],
    ["Summer Love", "Justin Timberlake", "https://file.garden/aOp8cCiQ5ho9r5b1/Biden%20'08%20Assets/Song%20Covers/Summer%20Love%20Album%20Cover.png", "https://audio.jukehost.co.uk/RPK1n6hh3gQDYHWRpvMMmFP0FTQQllVw"],
    ["Dashboard", "Modest Mouse", "https://file.garden/aOp8cCiQ5ho9r5b1/Biden%20'08%20Assets/Song%20Covers/Dashboard%20Album%20Cover.png", "https://audio.jukehost.co.uk/8dppiZ46JVBC8LJKXZSUddysbS2Yv7tc"],
    ["Viva La Vida", "Coldplay", "https://file.garden/aOp8cCiQ5ho9r5b1/Biden%20'08%20Assets/Song%20Covers/Viva%20La%20Vida%20Album%20Cover.png", "https://audio.jukehost.co.uk/jcvpE5cplrNeHNdck9TZXSyiFOmiETtB"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player {
      border: 3px solid #8586c0;
      display: flex;
      flex-direction: row;
      height: 191px;
      background:
          linear-gradient(
              135deg,
              rgba(255,255,255,.95),
              rgba(250,252,255,.88),
              rgba(240,246,254,.65),
              rgba(248,251,255,.82),
              rgba(255,255,255,.95)
          )/*,
          url("${ASSETS.bg}")*/;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.7), 0 2px 8px rgba(0,0,0,.18);
      font-family: sans-serif;
    }
    #display-box { display: flex; align-items: center; width: 50%; }
    #cover { width: 176px; height: 176px; border: .125em solid #243956; box-shadow: inset 0 0 0 1px rgba(255,255,255,.4), 0 2px 6px rgba(0,0,0,.25); }
    #info-container {
      display: flex;
      flex-direction: row;
      height: 178px; width: 127px; margin-top: 3px;
      color: black;
      background:
          linear-gradient(
              180deg,
              rgba(255,255,255,.88),
              rgba(238,243,251,.82),
              rgba(214,223,239,.78)
          );
      border-left: 1px solid rgba(90,110,150,.35);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.75);
    }
    #song-info { width: 100%; padding: 5px; }
    #title { font-weight: bold; font-size: 16px; color: #243956; text-shadow: 0 1px 0 rgba(255,255,255,.95); }
    #artist { font-size: 12px; color: #17191e; letter-spacing: .15px; }
    #controls-container {
      display: flex; flex-direction: column; align-items: center;
      margin: 10px; width: 100%; padding-top: 15px;
    }
    .is-vertical #volumeSlider {
      width: 125px; margin: 0;
    }
    #controls { display: flex; flex-direction: row; justify-content: center; width: 80%; gap: 5px; cursor: pointer; }
    #controls img { transition: transform 0.1s; }
    #controls img:active { transform: scale(0.95); }
    #progress-bar-container { width: 100%; }
    #progress-bar { width: 80%; margin: auto; display: flex; margin-top: 20px; cursor: pointer; }
    #volume-container { display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 1em; }
    #volume-display { font-weight: bold; display: none; }

    :root {
      --w7-sdt-w: 10px;
      --w7-sdt-h: 18px;
      --w7-surface: #f0f0f0;
      --w7-sdt-icon: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC7SURBVHgBlZLBCYQwEEVj9CDYgRfbswF7sRAbsArPdhBICDmEzPoDE9CdXeKH0eHP48fINOrSPM+k/mhd16YDtCyLmqZJhM7zxIs6PAF570WQAzJIRLkksd89DUl939eB1Ym3b0wpiQBmIYSXiTFGZYwRgWEY6o8uIPQLZGlu2rYtP54L3g3c912N45gHSEahh4dZERZj2zZyztFxHLnQw/vaLIattbmeULkMdg6XxLFaa3WB7MlCirTIHxVUkxicbwSEAAAAAElFTkSuQmCC");
      --w7-sdt-icon-h: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAMAAABVab95AAAAWlBMVEUAAAAAjf8AVpo8f7G44/v5/f7l9P3g8/za8Pzp9v32+/7u+f695v2z4PmWvdjr9/1onMKu3vjQ4e2Zv9l+pcJLc5GTu9eMtNGCqseLrcVhlbt0l7BWfptOdpOMIi2BAAAAA3RSTlMADUenYG6gAAAAWklEQVQI113GRwKAIAwEwCBBRaUo9vL/b0qWG3MaaqKG2FBcDCw3aWPB6NwW6nYgHUoHaQ9VxwlGKUPVwC7joOlIgeeZQ3pJnd46Z/2miNTqbZl8918efj2yH/8dBY1fB+zGAAAAAElFTkSuQmCC");
      --w7-sdt-icon-a: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACsSURBVHgB3ZKxCoMwEIYvJWOn0r10LHTuVDp1KIU+RN+gT9FZ6AP0LYqDY+nQWXAScXMQdRYh+ouRqEF0cPGHHJfcl7sbfkaFroYlqEefx5lxQK/blu6rjRZ6R34RLcFxAWSkmRZEbUkeLWigZgVymZhuoid264lGjwMvTkhmtYsqvKEGMQQY43jYNwoy//7t0j31b8DPXyBOcVYe5Kr9mDpKdoY6ndoCrDNyDnRZRNbxQWFyAAAAAElFTkSuQmCC");
    }

        input[type=range] {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background: transparent;
          padding: 10px 1px;
          width: 100%;
        }
        input[type=range]:focus-visible {
          outline: 1px dotted #000;
        }

        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          background: var(--w7-sdt-icon);
          filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.125));
          height: var(--w7-sdt-h);
          transform: translateY(-7px);
          width: var(--w7-sdt-w);
        }
        input[type=range]::-webkit-slider-thumb:hover {
          background: var(--w7-sdt-icon-h);
        }
        input[type=range]::-webkit-slider-thumb:active {
          background: var(--w7-sdt-icon-a);
        }

        input[type=range]::-moz-range-thumb {
          background: var(--w7-sdt-icon);
          border: 0;
          border-radius: 0;
          filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.125));
          height: var(--w7-sdt-h);
          width: var(--w7-sdt-w);
        }
        input[type=range]::-moz-range-thumb:hover {
          background: var(--w7-sdt-icon-h);
        }
        input[type=range]::-moz-range-thumb:active {
          background: var(--w7-sdt-icon-a);
        }

        input[type=range]::-webkit-slider-runnable-track {
          background: var(--w7-surface);
          box-shadow: inset 1px 1px 1px #999, inset -1px 0 #999, 0 1px #fff;
          box-sizing: border-box;
          height: 3px;
          width: 100%;
        }
        input[type=range]::-moz-range-track {
          background: var(--w7-surface);
          box-shadow: inset 1px 1px 1px #999, inset -1px 0 #999, 0 1px #fff;
          box-sizing: border-box;
          height: 3px;
          width: 100%;
        }

        .is-vertical {
          display: inline-block;
          height: 150px;
          transform: translateY(50%);
          width: 4px;
        }
        .is-vertical > input[type=range] {
          height: 4px;
          margin: 0 16px 0 10px;
          transform: rotate(270deg) translateX(calc(-50% + 8px));
          transform-origin: left;
          width: 150px;
        }
        .is-vertical > input[type=range]::-webkit-slider-thumb {
          transform: translateY(-8px) scaleX(-1);
        }
        .is-vertical > input[type=range]::-moz-range-thumb {
          transform: translateY(2px) scaleX(-1);
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
      <div id="controls">
        <img id="prevButton" src="${ASSETS.btnPrev}" alt="Previous">
        <img id="playPauseButton" src="${ASSETS.btnPlay}" alt="Play/Pause">
        <img id="nextButton" src="${ASSETS.btnNext}" alt="Next">
      </div>
      <div id="progress-bar-container">
        <progress id="progress-bar" value="0" max="100"></progress>
      </div>
    </div>
    <div id="volume-container">
      <img src="${ASSETS.volIcon}" alt="Volume" style="margin-bottom: 1em;">
      <div class="is-vertical" style="height: 126px;">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="1">
      </div>
      <span id="volume-display" style="font-weight: bold; display: none;">1</span>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.audioLink;
  audio.volume = currentVolume / 9;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volumeSlider");
  const volDisplay = document.getElementById("volume-display");

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
  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    audio.src = activePlaylist.getCurrentSong().audioLink;
    audio.play();
    updatePlayPauseIcon(true);
  };

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
    if (Number.isFinite(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progress;
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  // native progress click-to-seek functionality
  progressBar.addEventListener("click", (e) => {
    if (Number.isFinite(audio.duration)) {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.right - rect.left;
      const seekTime = (clickX / width) * audio.duration;
      audio.currentTime = seekTime;
    }
  });

  // volume
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    volDisplay.textContent = currentVolume;
    audio.volume = currentVolume / 9;
  });

  // initial play
  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}
setupMusicPlayer();
