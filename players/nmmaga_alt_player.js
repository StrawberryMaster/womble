// This is a modified version of the music player
// used in the mod 2024: No More Maga.
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
  addSong(song) {
    this.songs.push(song);
  }
  getCurrentSong() {
    return this.songs[this.currentSongIndex];
  }
  playNext(shuffleMode = false) {
    if (this.songs.length === 0) return;
    if (shuffleMode) {
      this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
    } else {
      this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    }
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
let currentVolume = 0.2;
let shuffleMode = false;
let loopMode = false;

const ASSETS = {
  bg: "#161616",
  accent: "#1DB954",
  btnPrev: "https://file.garden/aNvElm887DiA_9HR/PrevButton.png",
  btnPlay: "https://file.garden/aNvElm887DiA_9HR/ChangedPPButton.png?v=1763460439302",
  btnPause: "https://file.garden/aNvElm887DiA_9HR/DefaultPPButton.png?v=1763460435758",
  btnNext: "https://file.garden/aNvElm887DiA_9HR/NextButton.png",
  btnShuffle: "https://file.garden/aNvElm887DiA_9HR/ShuffleButton.png?v=1763556513133",
  btnLoop: "https://file.garden/aNvElm887DiA_9HR/LoopButton.png?v=1763556741244"
};

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  populateDropdown(activePlaylist);
  updateUI(activePlaylist);

  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.audioLink;
    audio.play().catch(e => console.log("Playback deferred for user interaction.", e));
    updatePlayPauseIcon(true);
  }
}
window.changePlaylist = changePlaylist;

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  if (!currentSong) return;

  const cover = document.getElementById("album_cover");
  const title = document.getElementById("track_name");
  const artist = document.getElementById("artist_name");
  const dropdown = document.getElementById("track_dropdown");
  const progressBar = document.getElementById("progress_slider");

  if (cover) cover.style.backgroundImage = `url("${currentSong.getCoverLink()}")`;
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();
  if (dropdown) dropdown.value = playlist.currentSongIndex.toString();
  if (progressBar) {
    progressBar.value = 0;
    progressBar.style.background = `linear-gradient(to right, ${ASSETS.accent} 0%, #444 0%)`;
  }
}
window.updateUI = updateUI;

function populateDropdown(playlist) {
  const dropdown = document.getElementById("track_dropdown");
  if (!dropdown) return;
  dropdown.innerHTML = playlist.songs.map((song, i) =>
    `<option value="${i}">${song.getTitle()} - ${song.getArtist()}</option>`
  ).join("");
}

function updatePlayPauseIcon(isPlaying) {
  const btn = document.getElementById("play_pause_btn");
  if (btn && btn.firstChild) {
    btn.firstChild.src = isPlaying ? ASSETS.btnPause : ASSETS.btnPlay;
  }
}

function getAudioElement() {
  if (!audioInstance) {
    audioInstance = document.getElementById("campaigntrailmusic");
    if (!audioInstance) {
      audioInstance = document.createElement("audio");
      audioInstance.id = "campaigntrailmusic";
      document.body.appendChild(audioInstance);
    }
  }
  return audioInstance;
}

function ensureMusicPlayerStyles() {
  const STYLE_ID = "standardized-spotify-player-styles";
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @font-face {
      font-family: 'Circular Spotify';
      src: url('https://file.garden/aNvElm887DiA_9HR/CircularSpotifyText-Black.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }

    #music_player, #music_player * {
      font-family: 'Circular Spotify', Arial, sans-serif !important;
      box-sizing: border-box;
    }

    #music_player.custom-player-box {
      display: flex !important;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: ${ASSETS.bg};
      border: 5px solid ${ASSETS.accent};
      border-radius: 10px;
      max-width: 900px;
      margin: auto;
    }

    #custom_player_wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }

    #album_cover {
      width: 150px;
      height: 150px;
      background: #ddd center / cover no-repeat;
      border: 3px solid ${ASSETS.accent};
      flex-shrink: 0;
    }

    #custom_player_details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 0;
    }

    #custom_player_info {
      margin-bottom: 10px;
      text-align: center;
      width: 100%;
    }

    #track_name {
      font-size: 24px !important;
      line-height: 1.2 !important;
      font-weight: bold;
      color: #fff;
      word-break: break-word;
    }

    #artist_name {
      font-size: 16px !important;
      line-height: 1.2 !important;
      color: #b3b3b3;
      word-break: break-word;
    }

    #custom_player_sliders {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    .custom-player-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
    }

    .custom-player-row label {
      width: 75px;
      color: #fff !important;
      flex-shrink: 0;
      font-size: 14px;
    }

    #volume_slider,
    #progress_slider {
      width: 100% !important;
      max-width: 400px;
      appearance: none;
      -webkit-appearance: none;
      background: #444;
      height: 6px;
      border-radius: 3px;
      cursor: pointer;
      outline: none;
    }

    #volume_slider::-webkit-slider-thumb,
    #progress_slider::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;
      height: 12px;
      width: 12px;
      background: ${ASSETS.accent};
      border-radius: 50%;
      border: none;
    }

    #volume_slider::-moz-range-thumb,
    #progress_slider::-moz-range-thumb {
      height: 12px;
      width: 12px;
      background: ${ASSETS.accent};
      border-radius: 50%;
      border: none;
    }

    #custom_player_controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-top: 10px;
    }

    #custom_player_controls button {
      border: none;
      background: none;
      cursor: pointer;
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.1s;
    }

    #custom_player_controls button:active {
      transform: scale(0.95);
    }

    #custom_player_controls button img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    #track_dropdown {
      padding: 4px 8px;
      font-size: 14px;
      background: #282828;
      color: #fff;
      border: 1px solid #444;
      border-radius: 4px;
      cursor: pointer;
      max-width: 200px;
      outline: none;
    }
  `;
  document.head.appendChild(style);
}

function createImgButton(id, imgUrl, size = 40) {
  const btn = document.createElement("button");
  btn.id = id;
  btn.type = "button";
  btn.style.width = `${size}px`;
  btn.style.height = `${size}px`;

  const img = document.createElement("img");
  img.src = imgUrl;
  btn.appendChild(img);
  return btn;
}

function setupMusicPlayer() {
  const musicBox = document.getElementById("music_player");
  if (!musicBox) {
    console.warn("music_player container not found.");
    return;
  }

  ensureMusicPlayerStyles();

  Array.from(musicBox.children).forEach(child => {
    if (child.id !== "campaigntrailmusic" && child.id !== "custom_player_wrapper") {
      child.style.display = "none";
    }
  });

  const loadDiv = document.getElementById("modloaddiv");
  const loadReveal = document.getElementById("modLoadReveal");
  if (loadDiv) loadDiv.style.display = "none";
  if (loadReveal) loadReveal.style.display = "none";

  musicBox.classList.add("custom-player-box");

  if (document.getElementById("custom_player_wrapper")) return;

  const defaultSongs = [
    ["The American Dream is Killing Me", "Green Day", "https://upload.wikimedia.org/wikipedia/en/c/c9/Green_Day_-_Saviors.png", "https://audio.jukehost.co.uk/xVflzX2agfU70s5rmti5BfQncpqLOCjw"],
    ["Rich Men North of Richmond", "Oliver Anthony", "https://upload.wikimedia.org/wikipedia/en/d/d4/Oliver_Anthony_-_Rich_Men_North_of_Richmond.png", "https://audio.jukehost.co.uk/Po5eKwlVG0M4wQ3oOG9otBNFevRmkpPC"],
    ["If I Can Dream", "Elvis Presley", "https://i.scdn.co/image/ab67616d0000b273bd203dd3964d591637975d24", "https://audio.jukehost.co.uk/SOXH6LMirjYFqNHPLKbWYo7UwkYNAWY9"],
    ["Solidarity Forever", "Pete Seeger", "https://i.scdn.co/image/ab67616d0000b2736528dcc259ef64aea8630ae3", "https://audio.jukehost.co.uk/DWT5a5mhtWAterfxYN77Y50BVfcyGEui"],
    ["Power to the People", "John Lennon", "https://upload.wikimedia.org/wikipedia/en/2/22/John-lennon-plastic-ono-band-power-to-the-people-apple-2-s.jpg", "https://audio.jukehost.co.uk/Hiuh9OUEkhKWsgC2dERB8SSazIeEj8I3"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  const wrapper = document.createElement("div");
  wrapper.id = "custom_player_wrapper";
  wrapper.innerHTML = `
    <div id="album_cover"></div>
    <div id="custom_player_details">
      <div id="custom_player_info">
        <div id="track_name"></div>
        <div id="artist_name"></div>
      </div>
      <div id="custom_player_sliders">
        <div class="custom-player-row">
          <label for="volume_slider">Volume:</label>
          <input id="volume_slider" type="range" min="0" max="1" step="0.01" value="${currentVolume}">
        </div>
        <div class="custom-player-row">
          <label for="progress_slider">Progress:</label>
          <input id="progress_slider" type="range" min="0" max="1" step="0.001" value="0">
        </div>
      </div>
      <div id="custom_player_controls">
        <!-- Buttons injected dynamically -->
      </div>
    </div>
  `;

  const audio = getAudioElement();
  audio.loop = false;

  if (audio.parentNode === musicBox) {
    musicBox.insertBefore(wrapper, audio);
  } else {
    musicBox.appendChild(wrapper);
  }

  const controls = document.getElementById("custom_player_controls");
  const shuffleBtn = createImgButton("shuffle_btn", ASSETS.btnShuffle, 30);
  const prevBtn = createImgButton("prev_btn", ASSETS.btnPrev, 40);
  const playPauseBtn = createImgButton("play_pause_btn", ASSETS.btnPlay, 55);
  const nextBtn = createImgButton("next_btn", ASSETS.btnNext, 40);
  const loopBtn = createImgButton("loop_btn", ASSETS.btnLoop, 30);
  const dropdown = document.createElement("select");
  dropdown.id = "track_dropdown";

  controls.append(shuffleBtn, prevBtn, playPauseBtn, nextBtn, loopBtn, dropdown);

  populateDropdown(activePlaylist);
  updateUI(activePlaylist);

  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.audioLink;
  audio.volume = currentVolume;

  const progressBar = document.getElementById("progress_slider");
  const volumeSlider = document.getElementById("volume_slider");

  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    const song = activePlaylist.getCurrentSong();
    if (song) {
      audio.src = song.audioLink;
      audio.play().catch(e => console.log(e));
    }
  };

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(e => console.log(e));
    } else {
      audio.pause();
    }
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playSongAtIndex();
  });

  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext(shuffleMode);
    playSongAtIndex();
  });

  dropdown.addEventListener("change", (e) => {
    activePlaylist.currentSongIndex = Number(e.target.value);
    playSongAtIndex();
  });

  shuffleBtn.addEventListener("click", () => {
    shuffleMode = !shuffleMode;
    shuffleBtn.firstChild.style.filter = shuffleMode ? "hue-rotate(90deg) brightness(1.3)" : "none";
  });

  loopBtn.addEventListener("click", () => {
    loopMode = !loopMode;
    audio.loop = loopMode;
    loopBtn.firstChild.style.filter = loopMode ? "hue-rotate(90deg) brightness(1.3)" : "none";
  });

  // Native Audio Element Events
  audio.addEventListener("play", () => updatePlayPauseIcon(true));
  audio.addEventListener("pause", () => updatePlayPauseIcon(false));

  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const progress = audio.currentTime / audio.duration;
      progressBar.value = progress;
      const percent = progress * 100;
      progressBar.style.background = `linear-gradient(to right, ${ASSETS.accent} ${percent}%, #444 ${percent}%)`;
    }
  });

  audio.addEventListener("ended", () => {
    if (loopMode) return;
    activePlaylist.playNext(shuffleMode);
    playSongAtIndex();
  });

  progressBar.addEventListener("input", (e) => {
    if (Number.isFinite(audio.duration)) {
      const ratio = Number(e.target.value);
      audio.currentTime = ratio * audio.duration;
      const percent = ratio * 100;
      progressBar.style.background = `linear-gradient(to right, ${ASSETS.accent} ${percent}%, #444 ${percent}%)`;
    }
  });

  progressBar.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = ratio * audio.duration;
    progressBar.value = ratio;
    const percent = ratio * 100;
    progressBar.style.background = `linear-gradient(to right, ${ASSETS.accent} ${percent}%, #444 ${percent}%)`;
  });

  volumeSlider.addEventListener("input", (e) => {
    currentVolume = Number(e.target.value);
    audio.volume = currentVolume;
    const percent = currentVolume * 100;
    volumeSlider.style.background = `linear-gradient(to right, ${ASSETS.accent} ${percent}%, #444 ${percent}%)`;
  });

  const initialVolPercent = currentVolume * 100;
  volumeSlider.style.background = `linear-gradient(to right, ${ASSETS.accent} ${initialVolPercent}%, #444 ${initialVolPercent}%)`;

  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

setupMusicPlayer();
