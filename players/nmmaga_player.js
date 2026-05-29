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
let currentVolume = 0.2;

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  populateDropdown(activePlaylist);
  updateUI(activePlaylist);

  // ensure audio exists before trying to access it
  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.audioLink;
    audio.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
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

  if (cover) cover.style.backgroundImage = `url("${currentSong.getCoverLink()}")`;
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();
  if (dropdown) dropdown.value = playlist.currentSongIndex.toString();
}
window.updateUI = updateUI;

function populateDropdown(playlist) {
  const dropdown = document.getElementById("track_dropdown");
  if (!dropdown) return;
  dropdown.innerHTML = playlist.songs.map((song, i) =>
    `<option value="${i}">${song.getTitle()} - ${song.getArtist()}</option>`
  ).join("");
}

function updatePlayPauseButton(isPlaying) {
  const btn = document.getElementById("play_pause_btn");
  if (btn) {
    btn.textContent = isPlaying ? "Pause" : "Play";
  }
}

// helpers
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

const CUSTOM_PLAYER_STYLE_ID = "custom-music-player-style";

function ensureCustomMusicPlayerStyles() {
  if (document.getElementById(CUSTOM_PLAYER_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = CUSTOM_PLAYER_STYLE_ID;
  style.textContent = `
    #music_player.custom-player-box {
      display: flex !important;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: #161616;
      border: 5px solid #FFFFFF;
      border-radius: 10px;
      max-width: 900px;
      margin: auto;
      font-family: Arial, sans-serif;
      box-sizing: border-box;
    }

    #custom_player_wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    #album_cover {
      width: 150px;
      height: 150px;
      background: #ddd center / cover no-repeat;
      border: 3px solid #FFFFFF;
      flex-shrink: 0;
      box-sizing: border-box;
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
      font-size: 28px !important;
      line-height: 1.2 !important;
      font-weight: bold;
      color: #fff;
      word-break: break-word;
    }

    #artist_name {
      font-size: 20px !important;
      line-height: 1.2 !important;
      color: #fff;
      word-break: break-word;
    }

    #custom_player_sliders {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 10px;
    }

    .custom-player-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .custom-player-row label {
      width: 70px;
      color: #fff !important;
      flex-shrink: 0;
    }

    #volume_slider,
    #progress_slider {
      width: 400px !important;
      max-width: 100%;
      flex: 1;
    }

    #custom_player_controls {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;
    }

    #custom_player_controls button {
      padding: 5px 10px;
      font-size: 16px;
      cursor: pointer;
    }

    #track_dropdown {
      padding: 5px;
      font-size: 14px;
      margin-left: 10px;
      cursor: pointer;
      max-width: 100%;
    }
  `;
  document.head.appendChild(style);
}

// setup
function setupMusicPlayer() {
  const musicBox = document.getElementById("music_player");
  if (!musicBox) {
    console.warn("music_player not found. Player will not be attached.");
    return;
  }

  ensureCustomMusicPlayerStyles();

  Array.from(musicBox.children).forEach(child => {
    if (child.id !== "campaigntrailmusic" && child.id !== "custom_player_wrapper") {
      child.style.display = "none";
    }
  });

  document.getElementById("modLoadReveal")?.style.setProperty("display", "none");
  document.getElementById("modloaddiv")?.style.setProperty("display", "none");

  musicBox.classList.add("custom-player-box");

  // prevent duplicate players
  if (document.getElementById("custom_player_wrapper")) return;

  const defaultSongs = [
    ["Band on the Run", "Paul McCartney and Wings", "https://upload.wikimedia.org/wikipedia/en/f/f4/Paul_McCartney_%26_Wings-Band_on_the_Run_album_cover.jpg", "https://audio.jukehost.co.uk/WnUOlBu7wblrbE2t7xrWEmga8wxvnyBU"],
    ["Float On", "Modest Mouse", "https://upload.wikimedia.org/wikipedia/en/e/e4/Modest_Mouse-Float_on-_album_cover.jpg", "https://audio.jukehost.co.uk/xBWzqPqn5w1sYDFwDBdRXzyrXzTRDSRt"],
    ["Without Me", "Eminem", "https://upload.wikimedia.org/wikipedia/en/a/ad/Eminem_-_Without_Me_CD_cover.jpg", "https://audio.jukehost.co.uk/VZ3h9wEqzJvMLpCJVVg6Cd8Rredx2n32"],
    ["Somebody Told Me", "The Killers", "https://upload.wikimedia.org/wikipedia/en/f/f5/Somebody-Told-Me.jpg", "https://audio.jukehost.co.uk/GV8Wk2nHxsdHIBzv0qGI1x7dn8AlP6hc"],
    ["Touch the Sky", "Kanye West", "https://upload.wikimedia.org/wikipedia/en/5/56/Kanyewest_touchthesky.jpg", "https://audio.jukehost.co.uk/CEecRaPUPQ1vgwAYsIhMRTBQ4qq4dmIF"],
    ["Toxic", "Britney Spears", "https://upload.wikimedia.org/wikipedia/en/2/21/Britney_Spears_Toxic.png", "https://audio.jukehost.co.uk/jNs50cdopNPtwODL9d03PdI86RD035OO"],
    ["Hey Ya!", "OutKast", "https://upload.wikimedia.org/wikipedia/en/d/d8/Hey_Ya_single_cover.png", "https://audio.jukehost.co.uk/q6KIYkrSv3U2ztKRABuasRi5CTgY6OLk"],
    ["Crazy in Love", "Beyonce ft. Jay-Z", "https://upload.wikimedia.org/wikipedia/en/3/30/Beyonce_-_Crazy_in_Love_%28single%29.png", "https://audio.jukehost.co.uk/fldDyOS48lzKsTrxNOJW4WK87slysxep"],
    ["Let's Get It Started", "The Black Eyed Peas", "https://upload.wikimedia.org/wikipedia/en/9/9f/LetsGetItStarted.jpg", "https://audio.jukehost.co.uk/AF9EOhX8IVkcQrpm0esKn6BHnm3ntLHk"],
    ["Take Me Out", "Franz Ferdinand", "https://upload.wikimedia.org/wikipedia/en/5/52/Franz_Ferdinand_-_Take_Me_Out.jpg", "https://audio.jukehost.co.uk/OxTIUsaWHysTWKkpIad4YkqIrLigrrEj"],
    ["Island in the Sun", "Weezer", "https://upload.wikimedia.org/wikipedia/en/1/1d/Island_in_the_Sun_by_Weezer_Australian_single.png", "https://audio.jukehost.co.uk/ND1w5K5F3lHGICbA9MsJgHFTU8gTJPVZ"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // create HTML
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
          <button id="prev_btn" type="button">Prev</button>
          <button id="play_pause_btn" type="button">Play</button>
          <button id="next_btn" type="button">Next</button>
          <select id="track_dropdown"></select>
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

  populateDropdown(activePlaylist);
  updateUI(activePlaylist);

  const startSong = activePlaylist.getCurrentSong();
  if (startSong) audio.src = startSong.audioLink;
  audio.volume = currentVolume;

  const playPauseBtn = document.getElementById("play_pause_btn");
  const prevBtn = document.getElementById("prev_btn");
  const nextBtn = document.getElementById("next_btn");
  const progressBar = document.getElementById("progress_slider");
  const volumeSlider = document.getElementById("volume_slider");
  const dropdown = document.getElementById("track_dropdown");

  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    audio.src = activePlaylist.getCurrentSong().audioLink;
    audio.play().catch(e => console.log(e));
  };

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(e => console.log(e));
    } else {
      audio.pause();
    }
  });

  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playSongAtIndex();
  });

  dropdown.addEventListener("change", (e) => {
    activePlaylist.currentSongIndex = Number(e.target.value);
    playSongAtIndex();
  });

  audio.addEventListener("play", () => updatePlayPauseButton(true));
  audio.addEventListener("pause", () => updatePlayPauseButton(false));

  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      progressBar.value = audio.currentTime / audio.duration;
    } else {
      progressBar.value = 0;
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  progressBar.addEventListener("input", (e) => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = Number(e.target.value) * audio.duration;
    }
  });

  volumeSlider.addEventListener("input", (e) => {
    currentVolume = Number(e.target.value);
    audio.volume = currentVolume;
  });

  audio.play().catch(() => updatePlayPauseButton(false));
}

setupMusicPlayer();
