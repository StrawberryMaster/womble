// This is a modified version of the music player
// used in Sundance '08.
class Song {
  constructor(title, artist, coverLink, audioLink, album = "", duration = 0) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;
    this.audioLink = audioLink;
    this.album = album;
    this.duration = duration;
  }
  getTitle() { return this.title; }
  getArtist() { return this.artist; }
  getCoverLink() { return this.coverLink; }
  getAudioLink() { return this.audioLink; }
  getAlbum() { return this.album; }
  getDuration() { return this.duration; }
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
let currentVolume = 0.5;
let listenersInitialized = false;

function getAudioElement() {
  if (!audioInstance) {
    audioInstance = document.getElementById("campaigntrailmusic");
    if (!audioInstance) {
      audioInstance = document.createElement("audio");
      audioInstance.id = "campaigntrailmusic";
      audioInstance.style.display = "none";
      document.body.appendChild(audioInstance);
    }
  }
  window.campaignTrailMusic = audioInstance;
  return audioInstance;
}

const min_sec = function(float) {
  if (isNaN(float) || float < 0) return "0:00";
  return `${Math.floor(float / 60)}:${Math.floor(float) % 60 < 10 ? "0" : ""}${Math.floor(float) % 60}`;
}

const calc_indicator = function(currentTime, duration) {
  if (!duration) return 0;
  let a = Math.floor((currentTime / duration) * 45) - 2;
  if (a < 0) {
    return 0;
  }
  return a;
}

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.getAudioLink();
    audio.play()
      .then(() => updateUI(activePlaylist))
      .catch(e => console.log("Autoplay waiting for manual user interaction", e));
  }
}
window.changePlaylist = changePlaylist;

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  const player = document.getElementById("music_player");

  if (!player || !currentSong) return;

  const titleEl = player.querySelector("#j_songname");
  const artistEl = player.querySelector("#j_artist");
  const albumEl = player.querySelector("#j_album");
  const playbackBtn = player.querySelector("#j_playback");
  const coverContainer = player.querySelector("#j_cover_container");
  const coverEl = player.querySelector("#j_cover");
  const metaContainer = player.querySelector("#j_meta_container");
  const audio = getAudioElement();

  if (titleEl) titleEl.innerText = currentSong.getTitle();
  if (artistEl) artistEl.innerHTML = currentSong.getArtist();
  if (albumEl) albumEl.innerHTML = currentSong.getAlbum();

  if (playbackBtn) {
    const isPlaying = !audio.paused;
    playbackBtn.setAttribute("playing", isPlaying ? "true" : "false");
  }

  const coverUrl = currentSong.getCoverLink();
  const hasCover = coverUrl && coverUrl.trim() !== "";

  if (hasCover) {
    if (coverEl) coverEl.src = coverUrl;
    if (coverContainer) coverContainer.style.display = "flex";
    if (metaContainer) metaContainer.style.width = "121px";

    if (titleEl) titleEl.className = titleEl.scrollWidth > 121 ? "sn_overflow_cover" : "";
    if (artistEl) artistEl.className = artistEl.scrollWidth > 121 ? "sn_overflow_cover" : "";
    if (albumEl) albumEl.className = albumEl.scrollWidth > 121 ? "sn_overflow_cover" : "";
  } else {
    if (coverContainer) coverContainer.style.display = "none";
    if (metaContainer) metaContainer.style.width = "163px";

    if (titleEl) titleEl.className = titleEl.scrollWidth > 163 ? "sn_overflow" : "";
    if (artistEl) artistEl.className = artistEl.scrollWidth > 163 ? "sn_overflow" : "";
    if (albumEl) albumEl.className = albumEl.scrollWidth > 163 ? "sn_overflow" : "";
  }
}
window.updateUI = updateUI;

function playSongAtIndex() {
  const audio = getAudioElement();
  const currentSong = activePlaylist.getCurrentSong();
  if (currentSong) {
    audio.src = currentSong.getAudioLink();
    audio.play()
      .then(() => updateUI(activePlaylist))
      .catch(e => console.log("Playback waiting for user interaction", e));
  }
}

window.j_playback = function() {
  const audio = getAudioElement();
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  updateUI(activePlaylist);
}

window.j_rewind = function() {
  activePlaylist.playPrevious();
  playSongAtIndex();
}

window.j_fastforward = function() {
  activePlaylist.playNext();
  playSongAtIndex();
}

function setupMusicPlayer() {
  let mp_element = document.querySelector("#music_player");
  if (!mp_element) {
    const gameWindow = document.getElementById("game_window");
    if (gameWindow) {
      mp_element = document.createElement("div");
      mp_element.id = "music_player";
      gameWindow.insertAdjacentElement("afterend", mp_element);
    } else {
      console.warn("Target elements not found. Player cannot attach.");
      return;
    }
  }

  const defaultSongs = [
    ["Can't Tell Me Nothing", "KanYe West", "https://resources.tidal.com/images/05f8dc0e/260a/469f/8635/272daa77130f/320x320.jpg", "https://audio.jukehost.co.uk/lmSnMtGnGROPpdqODdL2PQAzgC7hkgV5", "Graduation", 271.627029],
    ["Glass Onion", "The Beatles", "https://resources.tidal.com/images/6f188b5e/9aa0/4f2a/835e/337f61c52e8d/320x320.jpg", "https://audio.jukehost.co.uk/j7aPv7XgxTUiIgnrPYhtuKzum5pLvZUR", "The Beatles", 137.694331],
    ["Read My Mind", "The Killers", "https://resources.tidal.com/images/068d3c96/8e39/4cae/902d/5682484f88d9/320x320.jpg", "https://audio.jukehost.co.uk/T65Q6fBSIUKbtCAsjalfcdUozaU8wwjs", "Sam's Town", 169.69675],
    ["CuDi Get", "Kid Cudi", "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/65/3c/54/653c54d8-cab9-2240-8c05-6454cf52f352/22UMGIM75437.rgb.jpg/208x208bb.webp", "https://audio.jukehost.co.uk/67NfEusUI7hCVltoHty677GbfIQUT33a", "A Kid Named Cudi", 140.155646],
    ["Dat New \"New\"", "Kid Cudi", "https://t2.genius.com/unsafe/258x258/https%3A%2F%2Fimages.genius.com%2Febcb77757c612f25684d71737b331002.600x600x1.jpg", "https://audio.jukehost.co.uk/AK7fUXIuh7n5hX4AzLOXzmJZ3lkwpuaf", "Dat New \"New\"", 254.328163],
    ["Us Placers", "Child Rebel Soldier", "https://t2.genius.com/unsafe/258x258/https%3A%2F%2Fimages.genius.com%2Ff14c94ef2b1181a3f643b08c4a24d50e.640x640x1.jpg", "https://audio.jukehost.co.uk/HHZRabpfdJIBRyN1FX43cWNfSBc5oMOo", "Us Placers", 230.45052],
    ["Walking On A Dream", "Empire Of The Sun", "https://resources.tidal.com/images/4052b941/ef6a/490d/b652/b150a39cac49/320x320.jpg", "https://audio.jukehost.co.uk/z7omI4XeH9JYea9uQzHQUIp0ojRmsDmF", "Walking On A Dream", 198.460952],
    ["Around the Bend", "The Asteroids Galaxy Tour", "https://resources.tidal.com/images/6937f496/62ef/4076/b123/a6eaf2348ef6/320x320.jpg", "https://audio.jukehost.co.uk/pKlji6MofPGVoOpWm8jG8iNrez4PPl8q", "Fruit", 229.92399],
    ["Yeah You", "N*E*R*D", "https://resources.tidal.com/images/3d7f26ff/3457/418f/b6be/fd822ea95fbe/320x320.jpg", "https://audio.jukehost.co.uk/UVWsbZQWrN6u8gn6vLlj5tdUjNRTbsdP", "Seeing Sounds", 245.57424],
    ["Lovely Rita", "The Beatles", "https://resources.tidal.com/images/26af3629/6638/4b5b/9e98/60c64778ec28/320x320.jpg", "https://audio.jukehost.co.uk/NCTstfQNnbwaisvKt2SiOUixowqqFAx9", "Sgt. Pepper's Lonely Hearts Club Band", 165.836916],
    ["Real People", "Common", "https://resources.tidal.com/images/7ae997f9/1cd5/417d/a8ec/4df8b3f5d0c6/320x320.jpg", "https://audio.jukehost.co.uk/qQrM0KzIKAg87DvKgsCbGvndrrjM3WlN", "Be", 168.298231],
    ["Homecoming", "KanYe West", "https://resources.tidal.com/images/05f8dc0e/260a/469f/8635/272daa77130f/320x320.jpg", "https://audio.jukehost.co.uk/Xm7cDBHvZapvlnSUdLB3UH7YSOs435LV", "Graduation", 203.522902]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => {
      activePlaylist.addSong(new Song(data[0], data[1], data[2], data[3], data[4], data[5]));
    });
  }

  if (!document.getElementById("juke_styling")) {
    const juke_styling = document.createElement("style");
    juke_styling.id = "juke_styling";
    juke_styling.innerHTML = `
      #music_player button {font-size: 0 !important; appearance: none; background-color: rgba(0,0,0,0) !important; border: none !important; cursor: default !important; border-radius: 0 !important; box-shadow: none !important;}
      #music_player { width: 314px; height: 67px; background-image: url('https://i.imgur.com/AiqrigV.png'); margin-left: auto; position: relative; margin-right: -0.7em; filter: drop-shadow(0px 15px 20px rgba(0, 0, 0, 0.7)); user-select: none; }

      .j_controls, .j_activesong { display: none; }

      #j_playback { width: 31px; height: 32px; background-image: url("https://i.imgur.com/G954cIJ.png") !important; position: absolute; top: 11px; left: 57px;}
      #j_playback:active { background-image: url("https://i.imgur.com/RONuHOZ.png") !important;}
      #j_playback[playing="true"] { background-image: url("https://i.imgur.com/TwpvDtJ.png") !important;}
      #j_playback[playing="true"]:active { background-image: url("https://i.imgur.com/XwIqds5.png") !important;}
      #j_rewind, #j_fastforward {width: 27px; height: 28px;}
      #j_rewind { background-image: url("https://i.imgur.com/FD53ilv.png") !important; position: absolute; top: 13px; left: 28px;}
      #j_rewind:active { background-image: url("https://i.imgur.com/pVnJB7z.png") !important;}
      #j_fastforward { background-image: url("https://i.imgur.com/EW3ZVek.png") !important; position: absolute; top: 13px; left: 90px;}
      #j_fastforward:active { background-image: url("https://i.imgur.com/GV7Qag4.png") !important;}

      #j_volume {width: 58px; height: 12px; appearance: none; background-image: url("https://i.imgur.com/JUHYrk0.png"); position: absolute; top: 46px; left: 41px;}
      #j_volume::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; background-image: url("https://i.imgur.com/eJNSqh4.png"); border: none;}
      #j_volume::-webkit-slider-thumb:active { background-image: url("https://i.imgur.com/D1fg9sx.png") !important;}
      #j_volume::-moz-range-thumb { width: 12px; height: 12px; background-image: url("https://i.imgur.com/eJNSqh4.png"); border: none;}
      #j_volume::-moz-range-thumb:active { background-image: url("https://i.imgur.com/D1fg9sx.png") !important;}

      /* Flexible active LCD layout setup */
      .j_activesong {
        font-size: 8.25pt;
        font-family: Lucida Grande, Lucida Sans Unicode, Lucida Sans, Geneva, Verdana, sans-serif !important;
        position: absolute;
        top: 11px;
        left: 130px;
        width: 173px;
        height: 46px;
        background-image: url("https://i.imgur.com/ZZIKa9G.png");
        text-align: center;
        display: none; /* Changed from display: flex !important to maintain hidden-state synchronization */
        align-items: center;
        justify-content: flex-start;
        padding: 0 4px;
        box-sizing: border-box;
      }

      /* LCD Bezel-style Image Wrapper Frame */
      #j_cover_container {
        width: 40px;
        height: 40px;
        min-width: 40px;
        position: relative;
        display: none; /* Triggered dynamically depending on song payload */
        align-items: center;
        justify-content: center;
        background-color: #d1d5db;
        border-radius: 3px;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.25);
        overflow: hidden;
        margin-right: 4px;
      }

      /* Diagonal reflective sheen overlaying the art module */
      #j_cover_container::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 50%, rgba(0,0,0,0.05) 50.1%, rgba(0,0,0,0.12) 100%);
        pointer-events: none;
        z-index: 2;
      }

      /* Image Blending filter sets targeting the backing paper-like pattern */
      #j_cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
        opacity: 0.85;
        filter: sepia(0.35) brightness(1.05) contrast(1.1) hue-rotate(-5deg);
        mix-blend-mode: multiply;
      }

      #j_meta_container {
        display: flex;
        flex-direction: column;
        width: 163px; /* Controlled dynamically in updateUI */
        overflow: hidden;
        text-align: center;
      }

      .j_activesong p {margin: 0;}
      #j_progressbar {display: inline-flex; align-items: center; height: 1.44em; justify-content: center;}

      #j_songname {margin: 0; white-space: nowrap; transform: translateX(0%);}
      #j_artistalbum {margin: 0; transform: translateY(0%); animation: art_alb 22s linear infinite;}
      #j_artist {margin: 0; white-space: nowrap; transform: translateX(0%);}
      #j_album {margin: 0; white-space: nowrap; transform: translateX(0%);}

      #sn_container {margin: 2px 0 0 0; overflow: clip;}
      #aa_container {margin: -2px 0 0 0; height: 1.3em; overflow: clip;}
      #j_progresscont {margin: 0; padding: 0; width: 52px; height: 10px; position: relative; top: -2px;}
      #j_indicator {margin: 0; padding: 0; max-width: 45px; width: 0px; height: 7px; position: absolute; top: 3px; left: 6px; background-image: url("https://i.imgur.com/10lj62t.png"); content: ""; pointer-events: none; z-index: 3;}
      #j_progresscont::after {width: 46px; height: 10px; position: absolute; top: 2px; left: 5px; background-image: url("https://i.imgur.com/Q8uYbH4.png"); content: ""; z-index: 2; pointer-events: none;}
      #j_songprogress {appearance: none; width: 100%; height: 10px; background-color: rgba(0, 0, 0, 0); position: relative; z-index: 1;}
      #j_songprogress::-webkit-slider-thumb { appearance: none; padding: 0; width: 7px; height: 7px; background-image: url("https://i.imgur.com/uLoIfpp.png"); border: none; border-radius: 0; margin: auto 0; margin-top: -1px;}
      #j_songprogress::-moz-range-thumb { appearance: none; width: 7px; height: 7px; background-image: url("https://i.imgur.com/uLoIfpp.png"); border: none; border-radius: 0; margin: auto 0; margin-top: -1px; padding: 0; padding-top: 1px;}

      #j_after_button { height: 48px; width: 13px; position: absolute; content: ''; top: 5px; left: 6px; opacity: 0; background-image: url("https://i.imgur.com/ndAfmWx.png"); display: block;}
      #j_after_button:hover { opacity: 100%; }

      @keyframes art_alb {
          0% { transform: translateY(0%);}
          45.45455% { transform: translateY(0%);}
          50% { transform: translateY(-50%);}
          95.45455% { transform: translateY(-50%);}
          100% { transform: translateY(0%);}
      }

      /* Overflow text scroll animations corresponding with cover toggles */
      .sn_overflow {
        animation: name_overflow_full 11s linear infinite;
        width: fit-content !important;
      }
      .sn_overflow_cover {
        animation: name_overflow_cover 11s linear infinite;
        width: fit-content !important;
      }

      @keyframes name_overflow_full {
          0% { transform: translateX(0%);}
          36.36364% { transform: translateX(calc(-100% + 163px));}
          45.45455% { transform: translateX(calc(-100% + 163px));}
          81.81818% { transform: translateX(0%);}
          100% { transform: translateX(0%);}
      }

      @keyframes name_overflow_cover {
          0% { transform: translateX(0%);}
          36.36364% { transform: translateX(calc(-100% + 121px));}
          45.45455% { transform: translateX(calc(-100% + 121px));}
          81.81818% { transform: translateX(0%);}
          100% { transform: translateX(0%);}
      }
    `;
    document.head.appendChild(juke_styling);
  }

  mp_element.style.display = "flex";
  mp_element.innerHTML = `
    <audio id="campaigntrailmusic" style="display:none"></audio>
    <div class="j_controls">
      <button id="j_rewind" onclick="j_rewind()">Rewind</button>
      <button id="j_playback" onclick="j_playback()" playing="false">Play</button>
      <button id="j_fastforward" onclick="j_fastforward()">Fast Forward</button>
      <input type="range" min="0" max="1" value="0.5" step="0.01" id="j_volume">
    </div>
    <div class="j_activesong">
      <div id="j_cover_container">
        <img id="j_cover" src="">
      </div>
      <div id="j_meta_container">
        <div id="sn_container"><p id="j_songname">Can't Tell Me Nothing</p></div>
        <div id="aa_container">
          <div id="j_artistalbum">
            <p id="j_artist">KanYe West</p>
            <p id="j_album">Graduation</p>
          </div>
        </div>
        <div id="j_progressbar">
          <p id="j_played">0:00</p>
          <div id="j_progresscont">
            <div id="j_indicator"></div>
            <input type="range" min="0" max="228" value="0" id="j_songprogress">
          </div>
          <p id="j_songlen">-4:31</p>
        </div>
      </div>
    </div>
    <span id="j_after_button"></span>
  `;

  const audio = getAudioElement();
  audio.removeAttribute("loop");
  audio.volume = currentVolume;

  if (typeof campaignTrail_temp !== 'undefined') {
    if (campaignTrail_temp.CTS) {
      const firstBr = document.querySelector(".footer > br:first-of-type");
      if (firstBr) firstBr.style.display = "none";
    }
  }
}

window.j_activate = function() {
  const controls = document.querySelector(".j_controls");
  const activeSong = document.querySelector(".j_activesong");

  if (controls) controls.style.display = "inline-block";
  if (activeSong) activeSong.style.display = "flex";
  const audio = getAudioElement();

  const currentSong = activePlaylist.getCurrentSong();
  if (currentSong && !audio.src) {
    audio.src = currentSong.getAudioLink();
  }

  let will_autoplay = true;
  try {
    const sd_persistent = JSON.parse(localStorage.getItem("SD2008"));
    if (sd_persistent && sd_persistent.settings && sd_persistent.settings.jukebox_autoplay !== 'always') {
      will_autoplay = false;
    }
  } catch (err) {
    will_autoplay = true;
  }

  updateUI(activePlaylist);

  if (will_autoplay) {
    audio.play()
      .then(() => updateUI(activePlaylist))
      .catch(e => console.log("Autoplay waiting for manual user interaction", e));
  } else {
    audio.pause();
    updateUI(activePlaylist);
  }

  // bind tracker events if they have not been configured yet
  if (!listenersInitialized) {
    audio.addEventListener("timeupdate", () => {
      const progressInput = document.querySelector("#j_songprogress");
      const indicator = document.querySelector("#j_indicator");
      const playedText = document.querySelector("#j_played");
      const songLenText = document.querySelector("#j_songlen");
      const curSong = activePlaylist.getCurrentSong();

      if (progressInput) progressInput.value = Math.floor(audio.currentTime);
      if (indicator) indicator.style.width = `${calc_indicator(audio.currentTime, audio.duration)}px`;
      if (playedText) playedText.innerText = min_sec(audio.currentTime);

      if (songLenText && curSong) {
        const totalDur = curSong.getDuration() || audio.duration || 0;
        const remainingTime = Math.max(0, totalDur - Math.floor(audio.currentTime));
        songLenText.innerText = `-${min_sec(remainingTime)}`;
      }
    });

    audio.addEventListener("durationchange", () => {
      const progressInput = document.querySelector("#j_songprogress");
      const songLenText = document.querySelector("#j_songlen");
      const indicator = document.querySelector("#j_indicator");
      const curSong = activePlaylist.getCurrentSong();

      if (progressInput && Number.isFinite(audio.duration)) {
        progressInput.max = Math.floor(audio.duration);
      }
      if (songLenText && curSong) {
        const totalDur = curSong.getDuration() || audio.duration || 0;
        songLenText.innerText = `-${min_sec(totalDur)}`;
      }
      if (indicator) indicator.style.width = "0px";
    });

    audio.addEventListener("ended", () => {
      window.j_fastforward();
    });

    const progressInput = document.querySelector("#j_songprogress");
    if (progressInput) {
      progressInput.addEventListener("input", () => {
        audio.currentTime = progressInput.value;
      });
    }

    const volumeInput = document.querySelector("#j_volume");
    if (volumeInput) {
      volumeInput.value = currentVolume;
      volumeInput.addEventListener("input", () => {
        currentVolume = parseFloat(volumeInput.value);
        audio.volume = currentVolume;
      });
    }

    listenersInitialized = true;
  }

  if (typeof campaignTrail_temp !== 'undefined') {
    audio.muted = campaignTrail_temp.mute || false;
  }
}

setupMusicPlayer();

// trigger activation only at candidate selection screen
const gameStartBtn = document.querySelector("#game_start");
if (gameStartBtn) {
  gameStartBtn.addEventListener("click", function(e) {
    const electionBtn = document.querySelector("#election_id_button");
    if (electionBtn) {
      electionBtn.addEventListener("click", window.j_activate);
    }
  });
}
