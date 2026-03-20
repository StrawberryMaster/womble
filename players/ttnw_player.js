// This is a modified version of the music player
// used in Things That Never Were.
// standardized classes
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
    playNext() { this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length; }
    playPrevious() { this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length; }
}
window.Playlist = Playlist;
window.Song = Song;

// globals
let playlist = new Playlist();
let rfk_playlist = new Playlist();
let rep_playlist = new Playlist();
let audioInstance = null;
let currentVolume = 1;
let currentTheme = "RFK"; // tracks active playlist theme

// button toggle tracking
let ppBTN = "https://i.imgur.com/KRddgx9.png";
let ppBTN_pause = "https://i.imgur.com/IO44pbG.png";

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
    if (btn) btn.src = isPlaying ? ppBTN_pause : ppBTN;
}

function safePlay(audioElement) {
    let playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            updatePlayPauseIcon(true);
        }).catch(error => {
            if (error.name !== "AbortError") {
                console.error("audio play error:", error);
                updatePlayPauseIcon(false);
            }
        });
    }
}

function changePlaylist(newPlaylist) {
    playlist = newPlaylist;
    playlist.currentSongIndex = 0;
    updateUI(playlist);

    // ensure audio exists before trying to access it
    const audio = getAudioElement();
    audio.src = playlist.getCurrentSong().audioLink;
    safePlay(audio);
}
window.changePlaylist = changePlaylist;

function updateUI(playlist) {
    const currentSong = playlist.getCurrentSong();
    const player = document.getElementById("player");
    if (!player || !currentSong) return;

    player.querySelector("#cover").src = currentSong.getCoverLink();
    player.querySelector("#title").textContent = currentSong.getTitle();
    player.querySelector("#artist").textContent = currentSong.getArtist();
}
window.updateUI = updateUI;

function playCurrentSong() {
    updateUI(playlist);
    const audio = getAudioElement();
    audio.src = playlist.getCurrentSong().audioLink;
    safePlay(audio);
}

// setup
function setupMusicPlayer() {
    const gameWindow_player = document.getElementById("game_window");
    if (!gameWindow_player) return;

    // prevent duplicate players
    const existingPlayer = document.getElementById("player");
    if (existingPlayer) existingPlayer.remove();

    playlist = new Playlist();
    rfk_playlist = new Playlist();
    rep_playlist = new Playlist();

    const commonSongs = [
        ["Dear Boy", "Paul McCartney", "https://i.imgur.com/cMRraQk.png", "https://audio.jukehost.co.uk/ZZVLpos0tLqOCSi0CSKFdlSoAbfbfRZl"],
        ["Uncle Albert/Admiral Halsey", "Paul McCartney", "https://i.imgur.com/cMRraQk.png", "https://audio.jukehost.co.uk/bKLFsbsVrlir9M2QXxm27CMzdW85113U"],
        ["I'm Still in Love with You", "Al Green", "https://i.imgur.com/Pw9Jidu.png", "https://audio.jukehost.co.uk/Be83hVY5wR1x2xcjVLaxHguuZ2Quyy0A"],
        ["My Whole World Ended", "David Ruffin", "https://i.imgur.com/qVVtZuR.png", "https://audio.jukehost.co.uk/GLV4WY4TywEf4sA1n4nOdVk9zqTaWkjO"],
        ["Nights In White Satin", "The Moody Blues", "https://i.imgur.com/0FbXJ7e.png", "https://audio.jukehost.co.uk/UP4ZQQVhMJXrRIJEkIdoCDOAKGAPdYsB"]
    ];

    const songRFK = new Song("Company", "Dean Jones", "https://i.imgur.com/4aRIys9.png", "https://audio.jukehost.co.uk/1MrAYcjHVGI1ldMQoLvEFkByR0qNtldI");
    const songREP = new Song("I Believe in You", "Robert Morse", "https://i.imgur.com/Ets8X5z.png", "https://audio.jukehost.co.uk/mADm02cj0T8ouVlDG94zb9BxGN2yx6Tr");

    rfk_playlist.addSong(songRFK);
    rep_playlist.addSong(songREP);

    commonSongs.forEach(data => {
        let s = new Song(data[0], data[1], data[2], data[3]);
        rfk_playlist.addSong(s);
        rep_playlist.addSong(s);
    });

    // create HTML
    const playerContainer = document.createElement("div");
    playerContainer.id = "player";
    playerContainer.innerHTML = `
    <img id="cover" title="Click to switch playlist">
    
    <div id="center-column">
      <div id="song-info">
        <p id="artist"></p>
        <h3 id="title"></h3>
      </div>
      
      <div id="progress-bar-container">
        <!-- quirk: using progress element instead of input range -->
        <progress id="progress-bar" value="0" max="100"></progress>
      </div>
      
      <div id="controls">
        <img id="prevButton" alt="Previous">
        <img id="playPauseButton" alt="Play/Pause">
        <img id="nextButton" alt="Next">
      </div>
    </div>
	
	<div id="volume-container">
      <div class="is-vertical">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="${currentVolume}">
      </div>
    </div>
  `;

    gameWindow_player.insertAdjacentElement("afterend", playerContainer);

    // set up audio & logic
    const audio = getAudioElement();
    audio.volume = currentVolume / 9;

    const playPauseBtn = document.getElementById("playPauseButton");
    const prevBtn = document.getElementById("prevButton");
    const nextBtn = document.getElementById("nextButton");
    const progressBar = document.getElementById("progress-bar");
    const volumeSlider = document.getElementById("volumeSlider");
    const coverImg = document.getElementById("cover");

    // playlist switching via cover click
    coverImg.addEventListener("click", () => {
        if (currentTheme === "RFK") {
            currentTheme = "REP";
            changePlaylist(rep_playlist);
            changePlayerStyle("https://i.imgur.com/8SKzKLX.png", "#02A6CF");
        } else {
            currentTheme = "RFK";
            changePlaylist(rfk_playlist);
            changePlayerStyle("https://i.imgur.com/nNt9E10.png", "#B42D1B");
        }
    });

    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) safePlay(audio);
        else { audio.pause(); updatePlayPauseIcon(false); }
    });

    nextBtn.addEventListener("click", () => { playlist.playNext(); playCurrentSong(); });
    prevBtn.addEventListener("click", () => { playlist.playPrevious(); playCurrentSong(); });

    // progress bars
    progressBar.addEventListener("click", function (e) {
        if (!audio.duration || isNaN(audio.duration)) return;
        const rect = this.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    audio.addEventListener("timeupdate", () => {
        if (audio.duration && !isNaN(audio.duration)) {
            progressBar.value = (audio.currentTime / audio.duration) * 100;
        }
    });

    audio.addEventListener("ended", () => {
        playlist.playNext();
        playCurrentSong();
    });

    volumeSlider.addEventListener("input", function () {
        currentVolume = parseInt(this.value, 10);
        audio.volume = currentVolume / 9;
    });

    // inject CSS
    if (!document.getElementById("tape-base-style")) {
        document.documentElement.style.setProperty('--theme-color', "#B42D1B");
        const style = document.createElement("style");
        style.id = "tape-base-style";
        style.textContent = `
    #player {
      position: relative;
      border: 1px solid #C9C9C9;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 191px;
      background-size: cover;
      background-position: center;
      font-family: Arial, sans-serif;
    }
    
    #cover {
      width: 176px;
      height: 176px;
      margin-left: 11px;
      cursor: pointer;
      z-index: 2;
    }
    
    #center-column {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      height: 100%;
      padding-left: 20px;
      padding-right: 40px;
    }
    
    #song-info {
      display: flex;
      flex-direction: column;
      color: var(--theme-color);
      margin-bottom: 2px;
	  margin-left: 100px;
      margin-top: 5px;
    }
    
    #artist {
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 2px 0;
      white-space: nowrap;
    }
    
    #title {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
      white-space: nowrap;
    }
    
    #progress-bar-container {
      width: 560px;
      height: 18px;
      margin-bottom: 8px;
	  margin-left: 100px;
      border-radius: 5px;
    }
    
    #progress-bar {
      width: 100%;
      height: 100%;
      appearance: none;
      -webkit-appearance: none;
      border: none;
      cursor: pointer;
      background-color: transparent;
      background-size: 100% 100%;
    }
    
    #progress-bar::-webkit-progress-bar { background-color: transparent; }
    #progress-bar::-webkit-progress-value { background-color: var(--theme-color); }
    #progress-bar::-moz-progress-bar { background-color: var(--theme-color); }
    #progress-bar::-ms-fill { background-color: var(--theme-color); }
    
    #controls {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 18px;
    }
    
    #controls img {
      cursor: pointer;
      height: 35px;
    }
    
    #prevButton, #nextButton { width: 38px; }
    #playPauseButton { width: 57px; }
    
    #volume-container {
      position: absolute;
      right: 5px;
      top: 0;
      bottom: 0;
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .is-vertical {
      height: 173px;
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: rotate(-90deg);
      transform-origin: center;
    }
    
    #volumeSlider {
      width: 173px;
      height: 10px;
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      border-left: 3px solid var(--theme-color);
      border-right: 3px solid var(--theme-color);
      padding: 0 3px;
    }
    
    #volumeSlider::-webkit-slider-runnable-track { width: 100%; height: 4px;  border-radius: 0px; }
    #volumeSlider::-moz-range-track { width: 100%; height: 4px; border-radius: 0px; }
    #volumeSlider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; background: var(--theme-color); border: none; width: 15px; height: 4px; margin-top: -4px; border-radius: 0px; }
    #volumeSlider::-moz-range-thumb { background: var(--theme-color); border: 1px solid var(--theme-color); width: 15px; height: 4px; border-radius: 0px; }
    `;
        document.head.appendChild(style);
    }

    // start player
    changePlaylist(rfk_playlist);
    changePlayerStyle("https://i.imgur.com/nNt9E10.png", "#B42D1B");
}

// player style swapper
function changePlayerStyle(bgImage, txtColor) {
    document.documentElement.style.setProperty('--theme-color', txtColor);

    const playerElement = document.getElementById("player");
    const progBar = document.getElementById("progress-bar");
    const prevBtn = document.getElementById("prevButton");
    const ppBtn = document.getElementById("playPauseButton");
    const ffBtn = document.getElementById("nextButton");

    if (playerElement) playerElement.style.backgroundImage = `url("${bgImage}")`;

    if (bgImage === "https://i.imgur.com/8SKzKLX.png") { // blue theme
        if (progBar) progBar.style.backgroundImage = `url("https://i.imgur.com/rnjhNUP.png")`;
        if (prevBtn) prevBtn.src = "https://i.imgur.com/ve5zlYr.png";
        if (ppBtn) ppBtn.src = "https://i.imgur.com/JvAtC7d.png";
        if (ffBtn) ffBtn.src = "https://i.imgur.com/AEr4q3y.png";
        ppBTN = "https://i.imgur.com/JvAtC7d.png";
        ppBTN_pause = "https://i.imgur.com/XbvsrNf.png";
    } else { // red theme
        if (progBar) progBar.style.backgroundImage = `url("https://i.imgur.com/eFPTv7f.png")`;
        if (prevBtn) prevBtn.src = "https://i.imgur.com/JacXKcT.png";
        if (ppBtn) ppBtn.src = "https://i.imgur.com/KRddgx9.png";
        if (ffBtn) ffBtn.src = "https://i.imgur.com/btmG7j2.png";
        ppBTN = "https://i.imgur.com/KRddgx9.png";
        ppBTN_pause = "https://i.imgur.com/IO44pbG.png";
    }

    const audio = getAudioElement();
    updatePlayPauseIcon(!audio.paused);
}
setupMusicPlayer();