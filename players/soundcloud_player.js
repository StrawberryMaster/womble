// This is a SoundCloud-themed
// music player.
class Song {
    constructor(title, artist, coverLink, audioLink) {
        this.title = title;
        this.artist = artist;
        this.coverLink = coverLink;
        this.audioLink = audioLink;
    }
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

let activePlaylist = new Playlist();
let audioInstance = null;
let audioCtx = null;
let isDraggingWaveform = false;
let waveformCache = new Map();
let waveformBaseCanvasCache = new Map();
let waveformRequestId = 0;

// assets
const ASSETS = {
    play: `
    <svg class="sc-icon sc-play-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 5.14v13.72c0 .72.78 1.17 1.4.81l10.2-6.86a.95.95 0 0 0 0-1.58L9.4 4.33A.94.94 0 0 0 8 5.14Z" fill="currentColor"></path>
    </svg>`,
    pause: `
    <svg class="sc-icon sc-pause-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"></rect>
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"></rect>
    </svg>`,
    prev: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4.44444 3C4.19898 3 4 3.20147 4 3.45V20.55C4 20.7985 4.19898 21 4.44444 21H6.22222C6.46768 21 6.66667 20.7985 6.66667 20.55V12.5625L19.32 20.5697C19.616 20.757 20 20.5415 20 20.1881V3.81191C20 3.45847 19.616 3.24299 19.32 3.43031L6.66667 11.4375V3.45C6.66667 3.20147 6.46768 3 6.22222 3H4.44444Z" fill="currentColor"></path></svg>`,
    next: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M17.7778 3C17.5323 3 17.3333 3.20147 17.3333 3.45V11.4375L4.68 3.43031C4.38398 3.24299 4 3.45847 4 3.81191V20.1881C4 20.5415 4.38398 20.757 4.68 20.5697L17.3333 12.5625V20.55C17.3333 20.7985 17.5323 21 17.7778 21H19.5556C19.801 21 20 20.7985 20 20.55V3.45C20 3.20147 19.801 3 19.5556 3H17.7778Z" fill="currentColor"></path></svg>`,
    vol: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7.14645 1.85356C7.46143 1.53858 8 1.76167 8 2.20712V13.7929C8 14.2384 7.46143 14.4614 7.14645 14.1465L4 11H1.5C1.22386 11 1 10.7762 1 10.5V5.50001C1 5.22387 1.22386 5.00001 1.5 5.00001H4L7.14645 1.85356Z" fill="currentColor"></path><path d="M15 7.99997C15 11.1453 12.5798 13.7254 9.5 13.9794V12.4725C11.75 12.2238 13.5 10.3162 13.5 7.99997C13.5 5.68369 11.75 3.77616 9.5 3.52744V2.02051C12.5798 2.27458 15 4.85464 15 7.99997Z" fill="currentColor"></path><path d="M12 7.99997C12 9.48647 10.9189 10.7205 9.5 10.9585V5.04145C10.9189 5.27949 12 6.51347 12 7.99997Z" fill="currentColor"></path></svg>`
};

// waveform engine
async function drawWaveform(url) {
    const canvas = document.getElementById("waveform-canvas");
    const progCanvas = document.getElementById("waveform-prog-canvas");
    if (!canvas || !progCanvas) return;

    const ctx = canvas.getContext("2d");
    const progCtx = progCanvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    progCtx.clearRect(0, 0, progCanvas.width, progCanvas.height);
    window.currentWaveformData = null;

    const requestId = ++waveformRequestId;

    // use cached waveform data if available
    if (waveformCache.has(url) && waveformBaseCanvasCache.has(url)) {
        if (requestId !== waveformRequestId) return;

        window.currentWaveformData = waveformCache.get(url);
        ctx.drawImage(waveformBaseCanvasCache.get(url), 0, 0);
        const audio = getAudioElement();
        if (audio.duration) {
            updateWaveformProgress((audio.currentTime / audio.duration) * 100);
        }
        return;
    }

    try {
        const response = await fetch(url, { mode: "cors", cache: "force-cache" });
        const arrayBuffer = await response.arrayBuffer();
        if (requestId !== waveformRequestId) return;

        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        if (requestId !== waveformRequestId) return;

        const rawData = audioBuffer.getChannelData(0);

        const barWidth = 2;
        const gap = 1;
        const stride = barWidth + gap;
        const samples = Math.floor(canvas.width / stride);
        const blockSize = Math.max(1, Math.floor(rawData.length / samples));
        const filteredData = new Float32Array(samples);

        // sample only a subset of frames in each block
        const step = Math.max(1, Math.floor(blockSize / 32));

        for (let i = 0; i < samples; i++) {
            const blockStart = i * blockSize;
            let max = 0;

            for (let j = 0; j < blockSize; j += step) {
                const sample = Math.abs(rawData[blockStart + j] || 0);
                if (sample > max) max = sample;
            }

            filteredData[i] = max;
        }

        let peak = 0;
        for (let i = 0; i < filteredData.length; i++) {
            if (filteredData[i] > peak) peak = filteredData[i];
        }
        const multiplier = peak > 0 ? 1 / peak : 1;

        const normalizedData = new Float32Array(filteredData.length);
        for (let i = 0; i < filteredData.length; i++) {
            normalizedData[i] = filteredData[i] * multiplier;
        }

        if (requestId !== waveformRequestId) return;

        // pre-render static gray waveform to offscreen canvas
        const baseCanvas = document.createElement("canvas");
        baseCanvas.width = canvas.width;
        baseCanvas.height = canvas.height;
        const baseCtx = baseCanvas.getContext("2d");

        baseCtx.fillStyle = "#cccccc";
        for (let i = 0; i < normalizedData.length; i++) {
            const x = i * stride;
            const h = Math.max(1, normalizedData[i] * canvas.height * 0.9);
            baseCtx.fillRect(x, canvas.height - h, barWidth, h);
        }

        waveformCache.set(url, normalizedData);
        waveformBaseCanvasCache.set(url, baseCanvas);

        window.currentWaveformData = normalizedData;
        ctx.drawImage(baseCanvas, 0, 0);

        const audio = getAudioElement();
        if (audio.duration) {
            updateWaveformProgress((audio.currentTime / audio.duration) * 100);
        }
    } catch (e) {
        console.warn("Waveform bypass:", e);
    }
}

function updateWaveformProgress(pct) {
    const progCanvas = document.getElementById("waveform-prog-canvas");
    const baseCanvas = document.getElementById("waveform-canvas");
    if (!progCanvas || !baseCanvas || !window.currentWaveformData) return;

    const ctx = progCanvas.getContext("2d");
    ctx.clearRect(0, 0, progCanvas.width, progCanvas.height);

    pct = Math.max(0, Math.min(100, pct));
    const progressWidth = Math.floor(progCanvas.width * (pct / 100));
    if (progressWidth <= 0) return;

    // draw gray waveform slice, then tint it orange
    ctx.drawImage(baseCanvas, 0, 0, progressWidth, progCanvas.height, 0, 0, progressWidth, progCanvas.height);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = "#ff5500";
    ctx.fillRect(0, 0, progressWidth, progCanvas.height);
    ctx.globalCompositeOperation = "source-over";
}

// helpers
function getAudioElement() {
    if (!audioInstance) {
        audioInstance = document.createElement("audio");
        audioInstance.id = "audio";
        document.body.appendChild(audioInstance);
    }
    return audioInstance;
}

function formatTime(seconds) {
    if (isNaN(seconds) || !Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function updateUI() {
    const song = activePlaylist.getCurrentSong();
    const player = document.getElementById("player");
    if (!player || !song) return;

    player.querySelector("#cover").src = song.coverLink;
    player.querySelector("#title").textContent = song.title;
    player.querySelector("#artist").textContent = song.artist;

    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();

    requestAnimationFrame(() => {
        setTimeout(() => drawWaveform(song.audioLink), 0);
    });
}

function updatePlayPauseIcon(isPlaying) {
    const btn = document.getElementById("playPauseButton");
    if (btn) btn.innerHTML = isPlaying ? ASSETS.pause : ASSETS.play;
}

function safePlay(audio) {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            updatePlayPauseIcon(true);
        }).catch(error => {
            if (error.name === "AbortError") {
                console.log("Play interrupted by a new request.");
            } else {
                updatePlayPauseIcon(false);
            }
        });
    }
}
async function loadAndPlaySong() {
    const audio = getAudioElement();
    const song = activePlaylist.getCurrentSong();

    updateUI();

    audio.src = song.audioLink;
    audio.load();

    await safePlay(audio);
}

// setup
function setupMusicPlayer() {
    const gameWindow = document.getElementById("game_window");
    if (!gameWindow || document.getElementById("player")) return;

    const defaultSongs = [
        ["Down in the Park", "Gary Numan", "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2F7696abfc43320c8a4fe6cb062491fc3f.1000x1000x1.jpg", "https://audio.jukehost.co.uk/drki4p21WHHivGlYgqESTuxCaP66So8v"],
        ["O Green World", "Gorillaz", "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2Fb14cbb5cc4c481ff0f102801035c5538.574x565x1.png", "https://audio.jukehost.co.uk/h8jMif7RF3JH3aHHncof7PGTuXMbudkJ"],
        ["Out of Sequence", "Drab Majesty", "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2F4bf35bcf37b3d758d0c761f6c82952ba.1000x1000x1.jpg", "https://audio.jukehost.co.uk/eP39sPdHxTSEqLWLkUNIIjefdD1WrwqY"],
        ["Motion", "Boy Harsher", "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2Fe9f969abcc6e94fd20f1f982b5c4fa61.700x700x1.jpg", "https://audio.jukehost.co.uk/N0NpE3BFWsKHMe9UG1Opw1LuX9SJuNIz"]
    ];

    if (activePlaylist.songs.length === 0) {
        defaultSongs.forEach(d => activePlaylist.addSong(new Song(...d)));
    }

    // inject CSS
    const style = document.createElement("style");
    style.textContent = `
    #player {
      display: flex;
      height: 160px;
      background: #fff;
      border: 1px solid #e5e5e5;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      position: relative;
      box-sizing: border-box;
      margin-top: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    #cover { 
      height: 100%; 
      width: 160px; 
      object-fit: cover; 
      border-right: 1px solid #e5e5e5;
    }
    
    #sc-main-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding: 15px;
        position: relative;
        min-width: 0;
    }

    #sc-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
    }

    #sc-play-info { 
        display: flex; 
        align-items: center; 
        gap: 10px; 
    }

    #playPauseButton {
        width: 46px; 
        height: 46px;
        background: #ff5500;
        border-radius: 50%;
        border: none;
        color: white;
        cursor: pointer;
        display: flex; 
        align-items: center; 
        justify-content: center;
        transition: transform 0.1s;
    }
    #playPauseButton:active { transform: scale(0.95); }
    
    .sc-play-svg { width: 25px; height: 25px; transform: translateX(-1px); }
    .sc-pause-svg { width: 27px; height: 27px; }

    #sc-meta { 
        display: flex; 
        flex-direction: column; 
        gap: 4px; 
    }
    .sc-box {
        background: #999; 
        color: #fff;
        font-size: 12px; 
        padding: 2px 6px;
        width: fit-content;
        line-height: 1.2;
    }
    .sc-box.artist { background: #333; color: #ccc; }
    .sc-box.title { background: #000; font-size: 16px; }

    #sc-nav { 
        display: flex; 
        align-items: center; 
        gap: 15px; 
        color: #333; 
    }
    .nav-btn { 
        background: none; 
        border: none; 
        cursor: pointer; 
        color: inherit; 
        padding: 0; 
        display: flex; 
        align-items: center; 
        justify-content: center;
    }
    .nav-btn svg { width: 20px; height: 20px; }
    .nav-btn:hover { color: #ff5500; }

    #volSlider {
        width: 80px; 
        accent-color: #ff5500;
        cursor: pointer;
    }

    #waveform-area {
        position: relative;
        flex-grow: 1;
        margin-top: 15px;
        cursor: pointer;
    }
    canvas {
        position: absolute;
        bottom: 0; 
        left: 0;
        width: 100%; 
        height: 100%;
    }
    
    .time-stamp {
        position: absolute;
        bottom: 0;
        background: #000;
        font-size: 11px;
        padding: 2px 4px;
        z-index: 10;
        pointer-events: none;
        line-height: 1.2;
    }
    #time-current { left: 0; color: #ff5500; }
    #time-total { right: 0; color: #ccc; }
  `;
    document.head.appendChild(style);

    // create HTML
    const container = document.createElement("div");
    container.id = "player";
    container.innerHTML = `
    <img id="cover">
    <div id="sc-main-content">
        <div id="sc-top-bar">
            <div id="sc-play-info">
                <button id="playPauseButton">${ASSETS.play}</button>
                <div id="sc-meta">
                    <span id="artist" class="sc-box artist"></span>
                    <span id="title" class="sc-box title"></span>
                </div>
            </div>
            <div id="sc-nav">
                <button id="prevBtn" class="nav-btn">${ASSETS.prev}</button>
                <button id="nextBtn" class="nav-btn">${ASSETS.next}</button>
                <div style="display:flex; align-items:center; gap:5px">
                    <div class="nav-btn">${ASSETS.vol}</div>
                    <input type="range" id="volSlider" min="0" max="1" step="0.05" value="0.8">
                </div>
            </div>
        </div>
        <div id="waveform-area">
            <canvas id="waveform-canvas" width="1000" height="80"></canvas>
            <canvas id="waveform-prog-canvas" width="1000" height="80"></canvas>
            <div id="time-current" class="time-stamp">0:00</div>
            <div id="time-total" class="time-stamp">0:00</div>
        </div>
    </div>
  `;

    gameWindow.insertAdjacentElement("afterend", container);

    const audio = getAudioElement();
    audio.volume = 0.8;

    const playPauseBtn = document.getElementById("playPauseButton");

    playPauseBtn.onclick = async () => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") await audioCtx.resume();

        if (audio.paused) {
            await safePlay(audio);
        } else {
            audio.pause();
        }
    };

    document.getElementById("nextBtn").onclick = () => { activePlaylist.playNext(); loadAndPlaySong(); };
    document.getElementById("prevBtn").onclick = () => { activePlaylist.playPrevious(); loadAndPlaySong(); };
    document.getElementById("volSlider").oninput = (e) => { audio.volume = e.target.value; };

    const timeCurrent = document.getElementById("time-current");
    const timeTotal = document.getElementById("time-total");

    audio.ontimeupdate = () => {
        if (isDraggingWaveform || !audio.duration || isNaN(audio.duration)) return;

        const pct = (audio.currentTime / audio.duration) * 100;
        updateWaveformProgress(pct);

        timeCurrent.textContent = formatTime(audio.currentTime);
        timeTotal.textContent = formatTime(audio.duration);
    };

    audio.onloadedmetadata = () => {
        timeTotal.textContent = formatTime(audio.duration);
    };

    const waveArea = document.getElementById("waveform-area");

    const scrubWaveform = (e) => {
        if (!audio.duration || isNaN(audio.duration)) return undefined;
        const rect = waveArea.getBoundingClientRect();
        let pct = (e.clientX - rect.left) / rect.width;
        pct = Math.max(0, Math.min(1, pct));

        updateWaveformProgress(pct * 100);
        timeCurrent.textContent = formatTime(pct * audio.duration);
        return pct;
    };

    waveArea.addEventListener("mousedown", (e) => {
        isDraggingWaveform = true;
        scrubWaveform(e);
    });

    window.addEventListener("mousemove", (e) => {
        if (isDraggingWaveform) {
            scrubWaveform(e);
        }
    });

    window.addEventListener("mouseup", (e) => {
        if (isDraggingWaveform) {
            isDraggingWaveform = false;
            const pct = scrubWaveform(e);
            if (pct !== undefined) {
                audio.currentTime = pct * audio.duration;
            }
        }
    });

    audio.onplay = () => updatePlayPauseIcon(true);
    audio.onpause = () => updatePlayPauseIcon(false);
    audio.onended = () => { activePlaylist.playNext(); loadAndPlaySong(); };

    loadAndPlaySong();
}

setupMusicPlayer();