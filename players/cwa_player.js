// This is a modified version of the music player
// used in the mod 1996: Contract With America.
class Song {
    constructor(title, artist, coverLink, audioLink, genre, year, album) {
        this.title = title;
        this.artist = artist;
        this.coverLink = coverLink;
        this.audioLink = audioLink;
        this.genre = genre;
        this.year = year;
        this.album = album;
    }
    getTitle() { return this.title; }
    getArtist() { return this.artist; }
    getCoverLink() { return this.coverLink; }
    getAudioLink() { return this.audioLink; }
    getGenre() { return this.genre; }
    getYear() { return this.year; }
    getAlbum() { return this.album; }
}

class Playlist {
    constructor(name) {
        this.name = name;
        this.songs = [];
        this.currentSongIndex = 0;
    }
    addSong(song) { this.songs.push(song); }
    getCurrentSong() { return this.songs[this.currentSongIndex]; }
    playNext() { this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length; }
    playPrevious() { this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length; }
}

let playlists = [];
let activePlaylistIndex = 0;
let audioInstance = null;
let currentVolume = 1;

// helpers
const toTime = (seconds) => {
    var date = new Date(null);
    date.setSeconds(seconds || 0);
    return date.toISOString().slice(11, 19);
};

function getAudioElement() {
    if (!audioInstance) {
        audioInstance = document.createElement("audio");
        audioInstance.id = "campaigntrailmusic";
        document.body.appendChild(audioInstance);
    }
    return audioInstance;
}

function updatePlayPauseIcon(isPlaying) {
    const btn = document.getElementById("music-pauseplay");
    if (btn) btn.textContent = isPlaying ? "❚❚" : "▶";
}

function safePlay(audioElement) {
    let playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            updatePlayPauseIcon(true);
        }).catch(error => {
            if (error.name !== "AbortError") {
                console.error("Audio Play Error:", error);
                updatePlayPauseIcon(false);
            }
        });
    }
}

function setRangeFillPosition(sliderEl, value01, cssVarName, thumbPx = 16) {
    if (!sliderEl) return;
    const clamped = Math.max(0, Math.min(1, Number(value01) || 0));
    const rect = sliderEl.getBoundingClientRect ? sliderEl.getBoundingClientRect() : null;
    const lengthPx = rect ? Math.max(rect.width, rect.height) : (sliderEl.offsetWidth || sliderEl.offsetHeight);

    if (!lengthPx) {
        sliderEl.style.setProperty(cssVarName, `${clamped * 100}%`);
        return;
    }
    if (clamped <= 0) { sliderEl.style.setProperty(cssVarName, `0%`); return; }
    if (clamped >= 1) { sliderEl.style.setProperty(cssVarName, `100%`); return; }

    const minPercent = (thumbPx / 2) / lengthPx * 100;
    const maxPercent = 100 - minPercent;
    const posPercent = minPercent + clamped * (maxPercent - minPercent);
    sliderEl.style.setProperty(cssVarName, `${posPercent}%`);
}

function updateUI() {
    const playlist = playlists[activePlaylistIndex];
    const currentSong = playlist.getCurrentSong();
    if (!currentSong) return;

    document.getElementById("recordcover").src = currentSong.getCoverLink();
    document.getElementById("playlist-title").textContent = playlist.name;
    document.getElementById("meta-genre").textContent = currentSong.getGenre();
    document.getElementById("meta-year").textContent = currentSong.getYear();
    document.getElementById("meta-album").textContent = currentSong.getAlbum();

    const items = document.querySelectorAll(".playlist-item");
    items.forEach((el, i) => {
        el.classList.toggle("active", i === playlist.currentSongIndex);
    });
}

function playCurrentSong() {
    updateUI();
    const audio = getAudioElement();
    audio.src = playlists[activePlaylistIndex].getCurrentSong().getAudioLink();
    audio.currentTime = 0;
    safePlay(audio);
}

function renderPlaylistUI() {
    const listContainer = document.getElementById("playlist-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";
    const playlist = playlists[activePlaylistIndex];

    playlist.songs.forEach((song, idx) => {
        const item = document.createElement("div");
        item.className = "playlist-item";
        item.setAttribute("role", "button");
        item.innerHTML = `<div class="playlist-track-name">${song.getTitle()} - ${song.getArtist()}</div>`;

        item.addEventListener("click", () => {
            playlist.currentSongIndex = idx;
            playCurrentSong();
        });
        listContainer.appendChild(item);
    });
    updateUI();
}

// global hooks
function setSoundtrack(soundtrackIndex, { autoplay = true } = {}) {
    const idx = Number(soundtrackIndex);
    if (!playlists[idx]) return false;

    activePlaylistIndex = idx;
    playlists[activePlaylistIndex].currentSongIndex = 0;

    renderPlaylistUI();
    const audio = getAudioElement();
    audio.src = playlists[activePlaylistIndex].getCurrentSong().getAudioLink();

    if (autoplay) safePlay(audio);
    return true;
}

try { window.campaignTrail_temp.setSoundtrack = setSoundtrack; } catch (e) { }
window.setSoundtrack = setSoundtrack;

// setup
function setupMusicPlayer() {
    const container = document.querySelector(".content_single");
    if (!container) return;

    const existingBox = document.getElementById("player");
    if (existingBox) existingBox.remove();

    function createList(name, trackData) {
        let p = new Playlist(name);
        trackData.forEach(d => p.addSong(new Song(...d)));
        return p;
    }

    playlists = [
        createList("Contract With America", [
            ["Sabbath Bloody Sabbath", "The Cardigans", "https://files.catbox.moe/0gdec5.jpg", "https://files.catbox.moe/9oihg9.mp3", "Rock", "1993", "Emmerdale"],
            ["Paid For Loving", "Love Jones", "https://fastly-s3.allmusic.com/release/mr0001505330/front/400/GAKLSQcqxWWEldpmhvQ3xN_M69_UI9rrJSVvWL2-yAg=.jpg", "https://files.catbox.moe/706lt0.mp3", "Lounge", "1993", "Here's To the Losers"],
            ["This Charming Man", "Death Cab for Cutie", "https://upload.wikimedia.org/wikipedia/en/a/ae/Death_Cab_for_Cutie_-_You_Can_Play_These_Songs_With_Chords.jpg", "https://files.catbox.moe/fuz6kt.mp3", "Rock", "1995", "You Can Play These Songs With Chords"],
            ["Heaven or Las Vegas", "Cocteau Twins", "https://e.snmc.io/i/300/w/ca39d13d49f3f9ea31f5815ee93444f3/11766199", "https://files.catbox.moe/xy3lyz.mp3", "Pop/Rock", "1990", "Heaven or Las Vegas"],
            ["Dog New Tricks", "Garbage", "https://upload.wikimedia.org/wikipedia/en/4/42/GarbageSTinternational.png", "https://files.catbox.moe/5zta22.mp3", "Rock", "1995", "Garbage"],
            ["Last Goodbye", "Jeff Buckley", "https://upload.wikimedia.org/wikipedia/en/e/e4/Jeff_Buckley_grace.jpg", "https://files.catbox.moe/fpzydt.mp3", "Rock", "1994", "Grace"]
        ]),
        createList("A New Contract", [
            ["Iron Man", "The Cardigans", "https://upload.wikimedia.org/wikipedia/en/0/09/FirstBandOnTheMoon.jpg", "https://file.garden/aYjZLAM7UCBtT7eY/Iron%20Man.mp3", "Rock", "1996", "First Band on the Moon"]
        ]),
        createList("New Century", [
            ["Careless Whisper", "Wham!", "https://upload.wikimedia.org/wikipedia/en/7/7d/BlurParklife.jpg", "https://file.garden/aYjZLAM7UCBtT7eY/George%20Michael%20-%20Careless%20Whisper%20(Remastered).mp3", "Rock", "1994", "Parklife"]
        ]),
        createList("Falling Down", [
            ["Dear Prudence", "Siouxsie and the Banshees", "https://upload.wikimedia.org/wikipedia/en/0/0f/Siouxsie_%26_the_Banshees-Hyaena.jpg", "https://file.garden/aYjZLAM7UCBtT7eY/Siouxsie%20And%20The%20Banshees%20-%20Dear%20Prudence%20(Video).mp3", "Rock", "1983", "Hyaena"]
        ]),
        createList("Breach of Contract", [
            ["Black Star", "Radiohead", "https://upload.wikimedia.org/wikipedia/en/5/55/Radioheadthebends.png", "https://file.garden/aYjZLAM7UCBtT7eY/Black%20Star.mp3", "Rock", "1995", "The Bends"]
        ]),
        createList("The Untouchables", [
            ["Love Theme from Twin Peaks", "Angelo Badalamenti", "https://upload.wikimedia.org/wikipedia/en/3/38/Soundtrack_From_Twin_Peaks.jpg", "https://file.garden/aYjZLAM7UCBtT7eY/Love%20Theme%20from%20Twin%20Peaks%20(Instrumental).mp3", "Score", "1990", "Music from Twin Peaks"]
        ]),
        createList("Us and Them", [
            ["Swords and Knives", "Tears for Fears", "https://upload.wikimedia.org/wikipedia/en/d/dd/Seeds_of_LoveLP.jpg", "https://file.garden/aYjZLAM7UCBtT7eY/Swords%20And%20Knives.mp3", "Rock", "1989", "The Seeds of Love"]
        ])
    ];

    // inject CSS
    if (!document.getElementById("player-style")) {
        const style = document.createElement("style");
        style.id = "player-style";
        style.textContent = `
        #player { display: flex; flex-direction: column; background: #ebebeb; width: 70%; margin: 0; overflow: hidden; box-sizing: border-box; border: 3px solid rgb(179, 179, 179); outline: 3px solid #545454; font-family: 'Inter', Helvetica Neue, Helvetica, Arial, sans-serif; }
        
        #player-top { display: flex; flex-direction: row; gap: 10px; padding: 10px; box-sizing: border-box; align-items: flex-start; justify-content: space-between; }
        #player-bottom { display: flex; flex-direction: row; gap: 10px; padding: 10px; box-sizing: border-box; align-items: flex-end; }
        
        #player-left { display: flex; flex-direction: row; gap: 10px; align-items: flex-start; flex: 1; min-width: 0; }
        #playlist-root { width: 32em; flex: 0 0 32em; overflow: hidden; display: flex; flex-direction: column; box-sizing: border-box; }
        #playlist-list { overflow-y: auto; padding-right: 6px; background-color: white; border: 3px solid darkgray; height: 100%; }
        
        .playlist-item { padding: 6px; border-radius: 6px; cursor: pointer; user-select: none; color: black; outline: none; }
        .playlist-item:hover { background: rgba(0, 0, 0, 0.05); }
        .playlist-item.active { color: #005dbd; }
        .playlist-track-name { font-size: 10px; font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        #meta-column { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; min-width: 0; }
        .playlist-header { color: black; font-size: 13px; font-weight: 300; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; border: 3px solid darkgray; margin-bottom: 3px; padding: 2px; background-color: white; box-sizing: border-box; text-align: left; max-width: 145px; }
        
        #recordcover { height: 75px; width: 75px; border: 2px solid darkgray; margin-left: auto; align-self: flex-start; }
        
        #time-tracker { text-align: left; padding: 6px; flex: 1; transform: translateX(-3px); }
        #controls-container { display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 6px; }
        
        .transport-btn { box-shadow: rgb(0 0 0) -1px -1px inset, rgb(222 222 222) 1px 1px inset, #696969 -2px -2px inset, rgb(214 214 214) 2px 2px inset; box-sizing: border-box; min-height: 23px; min-width: 75px; padding: 0 12px; text-shadow: 0 0 #222; height: 25px; background: #e8e8e8; border: none; cursor: pointer; font-family: 'Inter', Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 23px; color: #111; }
        .transport-btn:active { background: #d0d0d0; box-shadow: inset 2px 2px #696969; }
        
        #time-progress-container { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 5px; }
        #current-time-display, #total-time-display { min-width: 50px; color: black; font-variant: tabular-nums; }
        #current-time-display { text-align: left; }
        #total-time-display { text-align: right; }
        
        #slider-container { flex: 1; padding: 0 10px; }
        input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; border-radius: 0; outline: none; }
        
        #time-slider { width: 100%; height: 10px; }
        #time-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 8px; height: 16px; background: #fff; border: 1px solid #000; cursor: pointer; transform: translateY(-4px); }
        #time-slider::-webkit-slider-runnable-track { height: 12px; border: 2px inset #b5b5b5; background: linear-gradient(to right, #1a1aa3 0%, #75c0f2 var(--progress-pos, 0%), #797979 var(--progress-pos, 0%), #797979 100%); }

        #volume-container { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; width: 160px; position: relative; height: 0; overflow: visible; }
        #volume-label { position: absolute; left: 75%; bottom: 110px; transform: translateX(-50%); color: black; font-size: 13px; background: white; padding: 2px; border: 3px solid darkgray; font-weight: 300; }
        #volume-slider { width: 105px; height: 10px; position: absolute; left: 75%; bottom: 45px; transform: translateX(-50%) rotate(-90deg); transform-origin: center; display: block; cursor: pointer; }
        #volume-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 8px; height: 16px; background: #fff; border: 1px solid #000; cursor: pointer; transform: translateY(-4px); }
        #volume-slider::-webkit-slider-runnable-track { height: 12px; border: 2px inset #b5b5b5; background: linear-gradient(to right, #1a1aa3 0%, #75c0f2 var(--volume-pos, 100%), #797979 var(--volume-pos, 100%), #797979 100%); }
        `;
        document.head.appendChild(style);
    }

    // create HTML
    const musicBox = document.createElement("div");
    musicBox.id = "player";
    musicBox.innerHTML = `
        <div id="player-top">
            <div id="player-left">
                <div id="playlist-root">
                    <div id="playlist-list"></div>
                </div>
                <div id="meta-column">
                    <div id="playlist-title" class="playlist-header"></div>
                    <div id="meta-genre" class="playlist-header"></div>
                    <div id="meta-year" class="playlist-header"></div>
                    <div id="meta-album" class="playlist-header"></div>
                </div>
            </div>
            <img id="recordcover">
        </div>
        <div id="player-bottom">
            <div id="time-tracker">
                <div id="controls-container">
                    <button id="music-prev" class="transport-btn">◄◄</button>
                    <button id="music-pauseplay" class="transport-btn">▶</button>
                    <button id="music-next" class="transport-btn">►►</button>
                </div>
                <div id="time-progress-container">
                    <span id="current-time-display">0:00:00</span>
                    <div id="slider-container">
                        <input type="range" id="time-slider" min="0" max="1" step="0.001" value="0">
                    </div>
                    <span id="total-time-display">0:00:00</span>
                </div>
            </div>
            <div id="volume-container">
                <div id="volume-label">Volume</div>
                <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="${currentVolume}">
            </div>
        </div>
    `;

    container.insertBefore(musicBox, container.children[1]);

    // set up audio & logic
    const audio = getAudioElement();
    const pausePlayBtn = document.getElementById("music-pauseplay");
    const prevBtn = document.getElementById("music-prev");
    const nextBtn = document.getElementById("music-next");
    const timeSlider = document.getElementById("time-slider");
    const volumeSlider = document.getElementById("volume-slider");
    const currentTimeDisplay = document.getElementById("current-time-display");
    const totalTimeDisplay = document.getElementById("total-time-display");

    renderPlaylistUI();

    if (playlists[activePlaylistIndex]) {
        audio.src = playlists[activePlaylistIndex].getCurrentSong().getAudioLink();
    }
    audio.volume = currentVolume;
    setRangeFillPosition(volumeSlider, currentVolume, '--volume-pos');

    pausePlayBtn.addEventListener("click", () => {
        if (audio.paused) safePlay(audio);
        else { audio.pause(); updatePlayPauseIcon(false); }
    });

    prevBtn.addEventListener("click", () => { playlists[activePlaylistIndex].playPrevious(); playCurrentSong(); });
    nextBtn.addEventListener("click", () => { playlists[activePlaylistIndex].playNext(); playCurrentSong(); });

    audio.addEventListener("ended", () => {
        playlists[activePlaylistIndex].playNext();
        playCurrentSong();
    });

    audio.addEventListener("timeupdate", () => {
        if (!audio.duration || isNaN(audio.duration)) return;
        const progress = audio.currentTime / audio.duration;
        timeSlider.value = progress;
        currentTimeDisplay.textContent = toTime(audio.currentTime);
        totalTimeDisplay.textContent = toTime(audio.duration);
        setRangeFillPosition(timeSlider, progress, '--progress-pos');
    });

    timeSlider.addEventListener("input", (e) => {
        if (!audio.duration || isNaN(audio.duration)) return;
        const val = parseFloat(e.target.value);
        audio.currentTime = val * audio.duration;
        setRangeFillPosition(timeSlider, val, '--progress-pos');
    });

    volumeSlider.addEventListener("input", (e) => {
        currentVolume = parseFloat(e.target.value);
        audio.volume = currentVolume;
        setRangeFillPosition(volumeSlider, currentVolume, '--volume-pos');
    });
}

setupMusicPlayer();