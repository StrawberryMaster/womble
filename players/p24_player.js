// This is a recreation of the music player
// showcased in the mod Project 2024 sneak peeks.
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
let currentVolume = 0.5;

// assets
const ASSETS = {
    bg: "https://raw.githubusercontent.com/StrawberryMaster/womble/refs/heads/main/images/p24_background.png",

    btnPrev: `<svg width="32" height="28" viewBox="0 0 32 28" fill="currentColor" style="transform: scaleX(-1);"><path d="M18.14 20.68c.365 0 .672-.107 1.038-.323l8.508-4.997c.623-.365.938-.814.938-1.37 0-.564-.307-.988-.938-1.361l-8.508-4.997c-.366-.216-.68-.324-1.046-.324-.73 0-1.337.556-1.337 1.569v4.773c-.108-.399-.406-.73-.904-1.021L7.382 7.632c-.357-.216-.672-.324-1.037-.324-.73 0-1.345.556-1.345 1.569v10.235c0 1.013.614 1.569 1.345 1.569.365 0 .68-.108 1.037-.324l8.509-4.997c.49-.29.796-.631.904-1.038v4.79c0 1.013.615 1.569 1.345 1.569z" fill-rule="nonzero"></path></svg>`,
    btnNext: `<svg width="32" height="28" viewBox="0 0 32 28" fill="currentColor"><path d="M18.14 20.68c.365 0 .672-.107 1.038-.323l8.508-4.997c.623-.365.938-.814.938-1.37 0-.564-.307-.988-.938-1.361l-8.508-4.997c-.366-.216-.68-.324-1.046-.324-.73 0-1.337.556-1.337 1.569v4.773c-.108-.399-.406-.73-.904-1.021L7.382 7.632c-.357-.216-.672-.324-1.037-.324-.73 0-1.345.556-1.345 1.569v10.235c0 1.013.614 1.569 1.345 1.569.365 0 .68-.108 1.037-.324l8.509-4.997c.49-.29.796-.631.904-1.038v4.79c0 1.013.615 1.569 1.345 1.569z" fill-rule="nonzero"></path></svg>`,

    btnPlay: `<svg width="32" height="28" viewBox="0 0 32 28" fill="currentColor"><path d="M10.345 23.287c.415 0 .763-.15 1.22-.407l12.742-7.404c.838-.481 1.178-.855 1.178-1.46 0-.599-.34-.972-1.178-1.462L11.565 5.158c-.457-.265-.805-.407-1.22-.407-.789 0-1.345.606-1.345 1.57V21.71c0 .971.556 1.577 1.345 1.577z" fill-rule="nonzero"></path></svg>`,
    btnPause: `<svg width="32" height="28" viewBox="0 0 32 28" fill="currentColor"><path d="M13.293 22.772c.955 0 1.436-.481 1.436-1.436V6.677c0-.98-.481-1.427-1.436-1.427h-2.457c-.954 0-1.436.473-1.436 1.427v14.66c-.008.954.473 1.435 1.436 1.435h2.457zm7.87 0c.954 0 1.427-.481 1.427-1.436V6.677c0-.98-.473-1.427-1.428-1.427h-2.465c-.955 0-1.428.473-1.428 1.427v14.66c0 .954.473 1.435 1.428 1.435h2.465z" fill-rule="nonzero"></path></svg>`,
    volLow: `<svg width="18" height="18" viewBox="0 0 64 64" fill="currentColor"><path transform="translate(2,11.149)" d="m23.477 39.911c1.4129 0 2.431-1.0389 2.431-2.431v-33.141c0-1.3921-1.0181-2.5349-2.4726-2.5349-1.0181 0-1.7038 0.43634-2.805 1.4752l-9.2046 8.6644c-0.14545 0.12464-0.31166 0.18698-0.51945 0.18698h-6.2126c-2.9297 0-4.5088 1.5999-4.5088 4.7374v8.0411c0 3.1167 1.5791 4.7166 4.5088 4.7166h6.2126c0.20779 0 0.374 0.06234 0.51945 0.18698l9.2046 8.7475c0.99732 0.93501 1.8285 1.3506 2.8466 1.3506z"></path></svg>`,
    volHigh: `<svg width="18" height="18" viewBox="0 0 64 64" fill="currentColor"><path transform="translate(2,11.149)" d="m23.477 39.911c1.4129 0 2.431-1.0389 2.431-2.431v-33.141c0-1.3921-1.0181-2.5349-2.4726-2.5349-1.0181 0-1.7038 0.43634-2.805 1.4752l-9.2046 8.6644c-0.14545 0.12464-0.31166 0.18698-0.51945 0.18698h-6.2126c-2.9297 0-4.5088 1.5999-4.5088 4.7374v8.0411c0 3.1167 1.5791 4.7166 4.5088 4.7166h6.2126c0.20779 0 0.374 0.06234 0.51945 0.18698l9.2046 8.7475c0.99732 0.93501 1.8285 1.3506 2.8466 1.3506z"></path><path transform="translate(2,11.149)" d="m34.864 29.959c0.70647 0.49868 1.7246 0.35323 2.3271-0.47787 1.6205-2.1817 2.5971-5.3815 2.5971-8.6436 0-3.2621-0.9766-6.4411-2.5971-8.6436-0.60255-0.83111-1.5999-0.97655-2.3271-0.49868-0.89345 0.62336-1.0181 1.683-0.35319 2.5765 1.2051 1.6207 1.9323 4.0932 1.9323 6.5658 0 2.4726-0.76881 4.9451-1.9531 6.5866-0.62332 0.89345-0.51945 1.9116 0.374 2.5349z"></path><path transform="translate(2,11.149)" d="m43.154 35.569c0.81021 0.54023 1.8077 0.33245 2.3894-0.49867 2.7426-3.8231 4.3426-8.9137 4.3426-14.233 0-5.3399-1.5583-10.451-4.3426-14.254-0.60255-0.81034-1.5791-1.0181-2.3894-0.47787-0.78979 0.54021-0.91447 1.5583-0.29106 2.4518 2.2647 3.3245 3.6779 7.6878 3.6779 12.28s-1.3923 8.9969-3.6779 12.28c-0.60255 0.89345-0.49872 1.9116 0.29106 2.4518z"></path><path transform="translate(2,11.149)" d="m51.527 41.241c0.76894 0.51945 1.7872 0.31166 2.3898-0.54021 3.8438-5.423 6.0255-12.446 6.0255-19.864s-2.2443-14.42-6.0255-19.864c-0.60255-0.87268-1.6209-1.0805-2.3898-0.54021-0.78936 0.56098-0.91404 1.5791-0.31149 2.4518 3.3451 4.9244 5.423 11.241 5.423 17.952 0 6.7113-1.9945 13.132-5.423 17.952-0.60255 0.87268-0.47787 1.8908 0.31149 2.4518z"></path></svg>`
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

function updatePlayPauseIcon(isPlaying) {
    const btn = document.getElementById("playPauseButton");
    if (btn) btn.innerHTML = isPlaying ? ASSETS.btnPause : ASSETS.btnPlay;
}

function changePlaylist(newPlaylist) {
    activePlaylist = newPlaylist;
    activePlaylist.currentSongIndex = 0;

    updateUI(activePlaylist);

    const audio = getAudioElement();
    const song = activePlaylist.getCurrentSong();

    if (song) {
        audio.src = song.audioLink;
        audio.play().catch(e => console.log("Autoplay blocked", e));
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

function setSliderFill(slider, cssVar) {
    const val = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.setProperty(cssVar, `${val}%`);
}

// setup
function setupMusicPlayer() {
    const gameWindow = document.getElementById("game_window");
    if (!gameWindow) return;

    if (document.getElementById("player")) return;

    const defaultSongs = [
        ["Sometimes You Can't Make It On Your Own", "U2", "https://mangolith.com/ProjectPics/WfileReUp/GH7irq6.png", "https://audio.jukehost.co.uk/Ky9CuUDTHKofacJVOdC4eWGLX7vc9Tdq"],
        ["M1 A1", "Gorillaz", "https://mangolith.com/ProjectPics/WfileReUp/vEj7tPn.jpeg", "https://audio.jukehost.co.uk/LZxF8483nd3iFZtJebOPIxEOM8OLdcGu"],
        ["motherfucker= redeemer", "Godspeed You! Black Emperor", "https://media.pitchfork.com/photos/5929bf4cea9e61561daa7a31/1:1/w_450%2Cc_limit/a2766e8a.jpg", "https://dl.dropboxusercontent.com/scl/fi/lxjlbdidp6zm7u8huw6yu/motherfucker.mp3?rlkey=cqqauq3dkffwcfvr7p5ir2b0p&st=3ypl5rd4"],
        ["Beautiful Enemy", "Dar Williams", "https://mangolith.com/ProjectPics/WfileReUp/tq1hqFb.jpeg", "https://audio.jukehost.co.uk/fGb2FosmrSjpx8SSZODpS5i8M1mA3O3Y"]
    ];

    if (activePlaylist.songs.length === 0) {
        defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
    }

    // inject CSS
    const style = document.createElement("style");
    style.textContent = `
    #player {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 173px;
        background-image: url("${ASSETS.bg}");
        background-size: cover;
        background-position: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        color: white;
        user-select: none;
        overflow: hidden;
        border: 1px solid #333;
    }

    #display-box {
        display: flex;
        align-items: center;
    }
    #cover {
        border-radius: .5em 0 0 .5em;
        height: 173px;
        width: 173px;
        object-fit: cover;
        box-shadow: 2px 0 10px rgba(0,0,0,0.4);
    }
    #info-container {
        display: flex;
        height: 173px;
        width: 127px;
        margin-top: 3px;
        color: white;
    }
    #song-info {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
    }
    #title {
        font-size: 1.17em;
        font-weight: bold;
        margin-block-start: 1em;
        margin-block-end: 0.5em;
    }
    #artist {
        margin: 0;
        font-size: 12px;
        opacity: 0.9;
    }

    #controls-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    #controls-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        margin-top: -60px;
    }
    #controls {
        display: flex;
        align-items: center;
        gap: 0;
    }
    .transport-btn {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        color: #a3a3a3;
        transition: color 0.1s ease, transform 0.1s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .transport-btn:hover { color: #ffffff; }
    .transport-btn:active { transform: scale(0.9); }
    #playPauseButton { color: #ffffff; }

    #volume-container {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    .vol-icon {
        display: flex;
        color: #8c8c8c;
    }

    input[type=range] {
        -webkit-appearance: none;
        background: transparent;
        outline: none;
        cursor: pointer;
        margin: 0;
    }
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.5);
    }

    #volumeSlider { width: 110px; height: 10px; }
    #volumeSlider::-webkit-slider-runnable-track {
        height: 5px;
        border-radius: 2px;
        background: linear-gradient(to right, #b0b0b0 var(--vol-pos, 50%), #555555 var(--vol-pos, 50%));
    }
    #volumeSlider::-webkit-slider-thumb {
        width: 10px;
        height: 10px;
        background: #bebebe;
        margin-top: -3px;
    }

    #progress-bar-container {
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 81%;
        margin-left: .1em;
        height: 10px;
        display: flex;
        align-items: center;
    }
    #progress-bar {
        width: 100%;
        height: 10px;
    }
    #progress-bar::-webkit-slider-runnable-track {
        height: 4px;
        border-radius: 2px;
        background: linear-gradient(to right, #b8b8b8 var(--prog-pos, 0%), #e7e7e7 var(--prog-pos, 0%));
    }
    #progress-bar::-webkit-slider-thumb {
        background: #bebebe;
        width: 10px;
        height: 10px;
        margin-top: -3px;
        opacity: 0;
        transition: opacity 0.2s;
    }
    #progress-bar:hover::-webkit-slider-thumb {
        opacity: 1;
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
            <div id="controls-wrapper">
                <div id="controls">
                    <button id="prevButton" class="transport-btn">${ASSETS.btnPrev}</button>
                    <button id="playPauseButton" class="transport-btn">${ASSETS.btnPlay}</button>
                    <button id="nextButton" class="transport-btn">${ASSETS.btnNext}</button>
                </div>
                <div id="volume-container">
                    <div class="vol-icon">${ASSETS.volLow}</div>
                    <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="${currentVolume}">
                    <div class="vol-icon">${ASSETS.volHigh}</div>
                </div>
            </div>
            <div id="progress-bar-container">
                <input type="range" id="progress-bar" value="0" max="100" step="0.1">
            </div>
        </div>
    `;

    gameWindow.insertAdjacentElement("afterend", playerContainer);

    // set up audio & logic
    const audio = getAudioElement();
    const startSong = activePlaylist.getCurrentSong();
    if (startSong) audio.src = startSong.audioLink;
    audio.volume = currentVolume;

    const playPauseBtn = document.getElementById("playPauseButton");
    const prevBtn = document.getElementById("prevButton");
    const nextBtn = document.getElementById("nextButton");
    const progressBar = document.getElementById("progress-bar");
    const volumeSlider = document.getElementById("volumeSlider");

    setSliderFill(volumeSlider, '--vol-pos');

    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            updatePlayPauseIcon(true);
        } else {
            audio.pause();
            updatePlayPauseIcon(false);
        }
    });

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

    audio.addEventListener("timeupdate", () => {
        if (Number.isFinite(audio.duration)) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progress;
            setSliderFill(progressBar, '--prog-pos');
        }
    });

    audio.addEventListener("ended", () => {
        activePlaylist.playNext();
        playSongAtIndex();
    });

    progressBar.addEventListener("input", (e) => {
        if (Number.isFinite(audio.duration)) {
            audio.currentTime = (e.target.value / 100) * audio.duration;
            setSliderFill(progressBar, '--prog-pos');
        }
    });

    volumeSlider.addEventListener("input", (e) => {
        currentVolume = parseFloat(e.target.value);
        audio.volume = currentVolume;
        setSliderFill(volumeSlider, '--vol-pos');
    });

    updateUI(activePlaylist);
    audio.play()
        .then(() => updatePlayPauseIcon(true))
        .catch(() => updatePlayPauseIcon(false));
}
setupMusicPlayer();