// This is a modified version of the music player
// used in the mod 1972: More Than Ever and 1976: Year Zero.
class Song {
    constructor(title, artist, coverLink, audioLink) {
        this.title = title;
        this.artist = artist;
        this.coverLink = coverLink; 
        this.audioLink = audioLink;
    }
    getTitle()     { return this.title; }
    getArtist()    { return this.artist; }
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
    playNext() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    }
    playPrevious() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
    }
}
window.Playlist = Playlist;
window.Song = Song;

let activePlaylist = new Playlist();
let audioInstance = null;
let currentVolume = 50;

// assets
const ASSETS = {
    bgPlaying: "url('https://i.imgur.com/I7jF0Ak.gif')",
    bgPaused: "url('https://i.imgur.com/Bui2rFO.png')",
    coverBg: "https://i.imgur.com/E2mOaNa.png"
};

// helpers
function getAudioElement() {
    if (!audioInstance) {
        audioInstance = document.createElement("audio");
        audioInstance.id = "audio";
        document.body.appendChild(audioInstance);
    }
    return audioInstance;
}

// state handling for the tape recorder aesthetics
function updatePlayState(isPlaying) {
    const tapeRecorder = document.getElementById("tape-recorder");
    const toggleButton = document.getElementById("toggle-button");
    if (tapeRecorder) tapeRecorder.style.backgroundImage = isPlaying ? ASSETS.bgPlaying : ASSETS.bgPaused;
    if (toggleButton) toggleButton.textContent = isPlaying ? "Stop" : "Start";
}

function safePlay(audioElement) {
    let playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            updatePlayState(true);
        }).catch(error => {
            if (error.name === "AbortError") {
                console.log("Play interrupted by new load request.");
            } else {
                console.log("Autoplay blocked. Waiting for user interaction...");
                updatePlayState(false);
            }
        });
    }
}

function changePlaylist(newPlaylist) {
    activePlaylist = newPlaylist;
    activePlaylist.currentSongIndex = 0;
    
    updateUI(activePlaylist);
    const audio = getAudioElement();
    const song = activePlaylist.getCurrentSong();
    
    if (song) {
        audio.src = song.getAudioLink();
        safePlay(audio);
    }
}
window.changePlaylist = changePlaylist;

function updateUI() {
    const currentSong = activePlaylist.getCurrentSong();
    const player = document.getElementById("tape-recorder");
    if (!player || !currentSong) return;

    player.querySelector("#track-title").textContent = currentSong.getTitle();
    player.querySelector("#track-artist").textContent = currentSong.getArtist();
    player.querySelector("#cover-art").src = currentSong.getCoverLink();
}
window.updateUI = updateUI;

function playCurrentSong() {
    updateUI();
    const audio = getAudioElement();
    audio.src = activePlaylist.getCurrentSong().getAudioLink();
    audio.currentTime = 0;
    safePlay(audio);
}

// setup
function setupMusicPlayer() {
    const gameWindow = document.getElementById("game_window");
    if (!gameWindow) return;

    // prevent duplicate players
    const existingPlayer = document.getElementById("tape-recorder");
    if (existingPlayer) existingPlayer.remove();

    activePlaylist = new Playlist();
    const defaultSongs = [
        ["April 6, 1971", "Nixon Tapes", "https://i.imgur.com/dkWThDq.png", "https://audio.jukehost.co.uk/tdtb2JXG7urdbrGhJyjjDS0lLMFAPwcQ"],
        ["You Haven't Done Nothin'", "Stevie Wonder", "https://i.imgur.com/HzyJsHc.png", "https://audio.jukehost.co.uk/KkYkAtKwaEu3faB3UYA5uA3m6JYuej8Z"],
        ["The Boss", "James Brown, The J.B.'s", "https://i.imgur.com/sHc82J8.png", "https://audio.jukehost.co.uk/wXKdYwHRMCY6mihDx7uCPwFb53XcozO3"],
        ["Move On Up", "Curtis Mayfield", "https://i.imgur.com/w34qrzb.png", "https://audio.jukehost.co.uk/4Vnq14MvwlkJknbh66Vcn9bKNmQZNlKi"],
        ["California Soul", "Marlena Shaw", "https://i.imgur.com/lMdeuTk.png", "https://audio.jukehost.co.uk/Kc7Wzzw5njxgX2u7EkPeYf97gqnwe34H"],
        ["Walk On By", "Isaac Hayes", "https://i.imgur.com/mWQJo9Q.png", "https://audio.jukehost.co.uk/YjgdvXru9UslQahiFR0l7zxs4DHQqa6J"],
        ["Inner City Blues", "Marvin Gaye", "https://i.imgur.com/U67Q3Sv.png", "https://audio.jukehost.co.uk/bqnaqmk7FPLLoaaOXUXSUF85Ac9D9nhP"],
        ["Papa Was A Rolling Stone", "Roy Ayers", "https://i.imgur.com/p8HfRPE.png", "https://audio.jukehost.co.uk/uhha3of3vFulQXRvpLuJSXKJj6LNhCLU"],
        ["I Choose You", "Willie Hutch", "https://i.imgur.com/VfLyJZH.png", "https://audio.jukehost.co.uk/Qhg5pRWDix1LiWXrxq8t9Gva4xXd1EhD"]
    ];

    defaultSongs.forEach(data => {
        activePlaylist.addSong(new Song(data[0], data[1], data[2], data[3]));
    });

    // inject CSS
    if (!document.getElementById("tape-player-style")) {
        const style = document.createElement("style");
        style.id = "tape-player-style";
        style.textContent = `
        #tape-recorder { width: 495px; height: 325px; transform: scale(0.85); background-position: center; background-size: cover; position: absolute; display: block; margin: 0 auto; }
        #info-overlay { position: absolute; top: 10px; left: 10px; color: #fff; font-family: sans-serif; text-shadow: 1px 1px 2px black; }
        #track-title { font-size: 18px; font-weight: bold; }
        #track-artist { font-size: 14px; margin-top: 3px; }
        #cover-wrapper { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 1; pointer-events: none; }
        #cover-bg { position: absolute; width: 200px; bottom: 0; left: 50%; transform: translateX(-50%); }
        #cover-art { position: absolute; width: 180px; bottom: 50px; left: 50%; transform: translateX(-50%); }
        #player-bottom { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2; }
        #controls-overlay { display: flex; flex-direction: row; align-items: center; gap: 10px; }
        
        #prev-button, #next-button, #toggle-button {
            appearance: auto; font-style: normal; font-weight: normal; font-size: 1rem; font-family: inherit;
            color: buttontext; text-align: center; cursor: pointer; box-sizing: border-box; background-color: buttonface;
            margin: 0em; border: 2px outset buttonborder; padding: 6px 10px; min-width: 60px;
        }
        #prev-button:hover, #next-button:hover, #toggle-button:hover { border-style: inset; background-color: #e0e0e0; }
        
        #volume-slider { -webkit-appearance: none; appearance: none; width: 100px; height: 14px; background-color: buttonface; border: 2px solid buttonborder; border-radius: 0; margin: 0; padding: 0; cursor: pointer; }
        #volume-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 24px; background: buttonface; border: 2px solid buttonborder; border-radius: 0; cursor: pointer; margin-top: -5px; }
        #volume-slider::-moz-range-thumb { width: 14px; height: 24px; background: buttonface; border: 2px solid buttonborder; border-radius: 0; cursor: pointer; }
        
        #progress-container { display: flex; flex-direction: row; width: 100%; justify-content: center; }
        #progress-bar { -webkit-appearance: none; appearance: none; width: 200px; height: 14px; background-color: #515151; border: 2px solid buttonborder; border-radius: 0; margin: 0; padding: 0; cursor: pointer; }
        #progress-bar::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 24px; background: #d0d0d0; border: 2px solid buttonborder; border-radius: 0; cursor: pointer; margin-top: -5px; }
        #progress-bar::-moz-range-thumb { width: 14px; height: 24px; background: #d0d0d0; border: 2px solid buttonborder; border-radius: 0; cursor: pointer; }
        #bonus_menu_area { margin-top: 120px; }
        `;
        document.head.appendChild(style);
    }

    // create HTML
    const tapeRecorder = document.createElement("div");
    tapeRecorder.id = "tape-recorder";
    tapeRecorder.style.backgroundImage = ASSETS.bgPaused;
    
    tapeRecorder.innerHTML = `
        <div id="info-overlay">
            <div id="track-title"></div>
            <div id="track-artist"></div>
        </div>
        <div id="cover-wrapper">
            <img id="cover-bg" src="${ASSETS.coverBg}">
            <img id="cover-art">
        </div>
        <div id="player-bottom">
            <div id="controls-overlay">
                <button id="prev-button">←</button>
                <button id="next-button">→</button>
                <input type="range" id="volume-slider" min="0" max="100" value="${currentVolume}">
                <button id="toggle-button">Start</button>
            </div>
            <div id="progress-container">
                <input type="range" id="progress-bar" min="0" value="0" step="1">
            </div>
        </div>
    `;

    gameWindow.insertAdjacentElement("afterend", tapeRecorder);

    // set up audio & logic
    const audio = getAudioElement();
    const startSong = activePlaylist.getCurrentSong();
    if (startSong) audio.src = startSong.getAudioLink();
    audio.volume = currentVolume / 100;

    const prevBtn = document.getElementById("prev-button");
    const nextBtn = document.getElementById("next-button");
    const toggleBtn = document.getElementById("toggle-button");
    const volumeSlider = document.getElementById("volume-slider");
    const progressBar = document.getElementById("progress-bar");

    // controls
    prevBtn.addEventListener("click", () => { activePlaylist.playPrevious(); playCurrentSong(); });
    nextBtn.addEventListener("click", () => { activePlaylist.playNext(); playCurrentSong(); });

    toggleBtn.addEventListener("click", () => {
        if (audio.paused) { safePlay(audio); } 
        else { audio.pause(); updatePlayState(false); }
    });

    volumeSlider.addEventListener("input", function() {
        currentVolume = parseFloat(this.value);
        audio.volume = currentVolume / 100;
    });

    progressBar.addEventListener("input", (e) => {
        audio.currentTime = parseFloat(e.target.value);
    });

    audio.addEventListener("timeupdate", () => {
        if (!audio.duration || isNaN(audio.duration)) return;
        progressBar.max = audio.duration;
        progressBar.value = audio.currentTime;
    });

    audio.addEventListener("ended", () => {
        activePlaylist.playNext();
        playCurrentSong();
    });

    // initial play
    updateUI();
    safePlay(audio);
}

setupMusicPlayer();