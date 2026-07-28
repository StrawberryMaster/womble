// This is a modified version of the music player
// used in the mockup Perpetual American Terror.
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

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  const player = document.getElementById("player");

  if (!player || !currentSong) return;
  const root = player.shadowRoot || player;

  const cover = root.querySelector("#cover");
  const title = root.querySelector("#title");
  const artist = root.querySelector("#artist");

  if (cover) cover.src = currentSong.getCoverLink ? currentSong.getCoverLink() : currentSong.coverLink;
  if (title) title.textContent = currentSong.getTitle ? currentSong.getTitle() : currentSong.title;
  if (artist) artist.textContent = currentSong.getArtist ? currentSong.getArtist() : currentSong.artist;
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
    btn.innerHTML = isPlaying
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M8 5v14l11-7z"/></svg>`;
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
    ["Black Hole Sun", "Soundgarden", "https://upload.wikimedia.org/wikipedia/en/3/3a/Superunknown.jpg", "https://files.catbox.moe/swan8n.mp3"],
    ["American Jesus", "Bad Religion", "https://upload.wikimedia.org/wikipedia/en/c/c3/BadReligionRecipeForHate.jpg", "https://file.garden/Z7qfmQZIZjO_xV5N/American%20Jesus.mp3"],
    ["Ifwhiteamericatoldthetruthforonedayitsworldwouldfallapart", "Manic Street Preachers", "https://i.scdn.co/image/ab67616d0000b2733f8f060e2f4ad634a94ae1df", "https://file.garden/Z7qfmQZIZjO_xV5N/whiteamerica.mp3"],
    ["Americana", "The Offspring", "https://upload.wikimedia.org/wikipedia/en/f/f5/TheOffspringAmericanaalbumcover.jpg", "https://files.catbox.moe/jrsqnu.mp3"],
    ["Youth Against Fascism", "Sonic Youth", "https://upload.wikimedia.org/wikipedia/en/c/cb/Sonicyouthdirty.png", "https://files.catbox.moe/wf6ttu.mp3"],
    ["Minority", "Green Day", "https://upload.wikimedia.org/wikipedia/en/5/5e/Green_Day_-_Warning_cover.jpg", "https://files.catbox.moe/epec4p.mp3"],
    ["Calm Like A Bomb", "Rage Against The Machine", "https://upload.wikimedia.org/wikipedia/en/5/51/RAtM-BattleofLosAngeles.jpeg", "https://files.catbox.moe/gy0bla.mp3"],
    ["The Day The Nazi Died", "Chumbawamba", "https://files.catbox.moe/refkbo.jpg", "https://files.catbox.moe/a4ijy0.mp3"],
    ["Angel", "Massive Attack", "https://upload.wikimedia.org/wikipedia/en/9/9d/Angelmassiveattack.jpg", "https://files.catbox.moe/8mse5e.mp3"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 20px;
      padding: 18px 25px;
      min-height: 250px;
      margin: 20px auto;
      width: 780px;
      background: linear-gradient(180deg, #383a3d 0%, #222325 50%, #161718 100%);
      border: 3px outset #666;
      border-radius: 8px;
      box-shadow: inset 0 0 10px #000, 0 6px 15px rgba(0,0,0,0.7);
      color: white;
      box-sizing: border-box;
    }

    #cover { 
      width: 210px; 
      height: 210px; 
      object-fit: cover;
      border: 3px inset #555;
      border-radius: 4px;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.6);
      flex-shrink: 0; 
    }

    #rightPanel { 
      display: flex; 
      flex-direction: column; 
      flex-grow: 1; 
      min-width: 0; 
      gap: 15px;
    }

    #info-container {
      background: linear-gradient(180deg, #b8beaf 0%, #9ba092 100%);
      border: 2px inset #444;
      border-radius: 4px;
      padding: 12px 16px;
      box-shadow: inset 1px 1px 4px rgba(0,0,0,0.6);
      color: #111;
    }

    #title-row {
      display: flex;
      align-items: center;
    }

    #song-info #title { 
      font-size: clamp(12px, 16px, 18px);
      font-weight: bold; 
      margin: 0; 
      color: #111; 
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 
    }

    #song-info #artist { 
      font-size: 1.0em; 
      margin: 4px 0 0 0; 
      color: #333; 
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 
    }

    #progress-bar-container { 
      width: 100%; 
      height: 10px; 
      background: #111;
      border: 2px inset #444;
      border-radius: 2px;
      cursor: pointer; 
      margin-top: 12px;
      position: relative;
      overflow: hidden;
    }

    #progress { 
      height: 100%; 
      width: 0%; 
      background: linear-gradient(90deg, #33cc33 0%, #66ff66 100%);
      box-shadow: 0 0 6px #33cc33;
      position: absolute;
      top: 0;
      left: 0;
    }

    #controls-container {
      display: flex; 
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    #controls { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
    }

    #controls button { 
      background: linear-gradient(180deg, #ffffff 0%, #d0d0d0 50%, #adadad 100%);
      border: 2px outset #fff;
      border-radius: 4px;
      box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
      cursor: pointer; 
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 32px;
      transition: background 0.1s;
    }

    #controls button:active { 
      border-style: inset;
      background: linear-gradient(180deg, #888 0%, #bbb 100%);
    }

    #volume-container { 
      display: flex; 
      align-items: center; 
      gap: 8px; 
    }

    #volumeSlider {
      -webkit-appearance: none;
      width: 110px;
      height: 8px;
      background: linear-gradient(to right, #0052d4 0%, #4364f7 22.2%, #111 22.2%, #111 100%);
      border: 2px inset #444;
      border-radius: 2px;
      outline: none;
    }

    #volumeSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 18px;
      background: linear-gradient(180deg, #fff 0%, #ccc 100%);
      border: 1px solid #000;
      border-radius: 2px;
      cursor: pointer;
      box-shadow: 1px 1px 3px rgba(0,0,0,0.8);
    }

    #volumeSlider::-webkit-slider-thumb:active {
      background: #888;
    }
  `;
  document.head.appendChild(style);

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <img id="cover" src="" alt="Album Cover">
    <div id="rightPanel">
      <div id="info-container">
        <div id="song-info">
          <div id="title-row">
            <h3 id="title"></h3>
          </div>
          <p id="artist"></p>
        </div>
        <div id="progress-bar-container">
          <div id="progress"></div>
        </div>
      </div>
      <div id="controls-container">
        <div id="controls">
          <button id="prevButton" title="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6zM11 12l8.5 6V6z"/></svg>
          </button>
          <button id="playPauseButton" title="Play/Pause">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button id="nextButton" title="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>
        <div id="volume-container">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#ccc"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
          <input type="range" id="volumeSlider" min="0" max="9" step="1" value="2">
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

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBarContainer = document.getElementById("progress-bar-container");
  const progressBar = document.getElementById("progress");
  const volumeSlider = document.getElementById("volumeSlider");

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

  // progress bar
  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const progress = (audio.currentTime / audio.duration) * 100;
      if (progressBar) progressBar.style.width = progress + "%";
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

  progressBarContainer.addEventListener("click", (e) => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const rect = progressBarContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      audio.currentTime = (clickX / width) * audio.duration;
    }
  });
  
  // volume
  const updateVolumeFill = (val) => {
	const pct = (val / 9) * 100;
	volumeSlider.style.background = `linear-gradient(to right, #0052d4 0%, #4364f7 ${pct}%, #111 ${pct}%, #111 100%)`;
  };

  updateVolumeFill(volumeSlider.value);
  
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    audio.volume = currentVolume / 9;
	updateVolumeFill(currentVolume);
  });

  // initial play
  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}
setupMusicPlayer();