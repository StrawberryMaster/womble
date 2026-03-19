// This is a modified version of the music player
// used in the ROC election series.
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
        this.albums = [];
        this.currentAlbumIndex = 0;
        this.currentSongIndex = 0;
        this.loop = false;
    }
    addSong(song, albumIndex) {
        if (!this.albums[albumIndex]) {
            this.albums[albumIndex] = [];
        }
        this.albums[albumIndex].push(song);
    }
    getCurrentSong() {
        return this.albums[this.currentAlbumIndex][this.currentSongIndex];
    }
    getPrevSongObj() {
        let album = this.albums[this.currentAlbumIndex];
        let prevIndex = (this.currentSongIndex - 1 + album.length) % album.length;
        return album[prevIndex];
    }
    getNextSongObj() {
        let album = this.albums[this.currentAlbumIndex];
        let nextIndex = (this.currentSongIndex + 1) % album.length;
        return album[nextIndex];
    }
    playNext() {
        if (this.loop) return;
        let album = this.albums[this.currentAlbumIndex];
        this.currentSongIndex = (this.currentSongIndex + 1) % album.length;
    }
    playPrevious() {
        let album = this.albums[this.currentAlbumIndex];
        this.currentSongIndex = (this.currentSongIndex - 1 + album.length) % album.length;
    }
    nextAlbum() {
        this.currentAlbumIndex = (this.currentAlbumIndex + 1) % this.albums.length;
        this.currentSongIndex = 0;
    }
}

window.Playlist = Playlist;
window.Song = Song;

let activePlaylist = new Playlist();
let audioInstance = null;
let currentVolume = 5;

// assets
const ASSETS = {
    bg: "https://i.imgur.com/CweYzgR.png",
    infoBg: "https://i.imgur.com/xyxCkA0.png",
    btnPrev: "https://i.imgur.com/jdfFCvo.png",
    btnPlay: "https://i.imgur.com/F5Cd7o6.png",
    btnPause: "https://i.imgur.com/7ofdqdY.png",
    btnNext: "https://i.imgur.com/B0ScI0A.png",
    btnAlbum: "https://i.imgur.com/NeUObQA.png",
    btnLoopOff: "https://i.imgur.com/PGcDNau.png",
    btnLoopOn: "https://i.imgur.com/Ssx40A9.png",
    volIcon: "https://i.imgur.com/1iKbM8E.png"
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
    if (btn) btn.src = isPlaying ? ASSETS.btnPause : ASSETS.btnPlay;
}

function safePlay(audioElement) {
    let playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            updatePlayPauseIcon(true);
        }).catch(error => {
            if (error.name === "AbortError") {
                console.log("Play interrupted by new load request");
            } else {
                console.error("Audio play error:", error);
                updatePlayPauseIcon(false);
            }
        });
    }
}

function changePlaylist(newPlaylist) {
    activePlaylist = newPlaylist;
    activePlaylist.currentAlbumIndex = 0;
    activePlaylist.currentSongIndex = 0;

    updateUI(activePlaylist);

    // ensure audio exists before trying to access it
    const audio = getAudioElement();
    const song = activePlaylist.getCurrentSong();

    if (song) {
        audio.src = song.audioLink;
        safePlay(audio);
    }
}
window.changePlaylist = changePlaylist;

function updateUI(playlist) {
    const player = document.getElementById("player");
    if (!player) return;

    const currentSong = playlist.getCurrentSong();
    const prevSong = playlist.getPrevSongObj();
    const nextSong = playlist.getNextSongObj();

    player.querySelector("#cover").src = currentSong.getCoverLink();
    player.querySelector("#prev-cover").src = prevSong.getCoverLink();
    player.querySelector("#next-cover").src = nextSong.getCoverLink();
    player.querySelector("#title").textContent = currentSong.getTitle();
    player.querySelector("#artist").textContent = currentSong.getArtist();
}
window.updateUI = updateUI;

function playCurrentSong() {
    updateUI(activePlaylist);
    const audio = getAudioElement();
    audio.src = activePlaylist.getCurrentSong().audioLink;
    safePlay(audio);
}

// setup
function setupMusicPlayer() {
    const gameWindow = document.getElementById("game_window");
    if (!gameWindow) return;

    // prevent duplicate players
    const existingPlayer = document.getElementById("player");
    if (existingPlayer) existingPlayer.remove();

    activePlaylist = new Playlist();
    const defaultSongs = [
        ["Train", "Luo Da-you", "https://i.imgur.com/ASbLWs0.jpeg", "https://file.garden/Z9XHdyLGHwUEZPS4/%E7%81%AB%E8%BB%8A%20-%20Lo%20Ta-yu%20(youtube).mp3?v=1765039147531", 0],
        ["Youth Dance Music 2000", "Luo Da-you", "https://i.imgur.com/ASbLWs0.jpeg", "https://file.garden/Z9XHdyLGHwUEZPS4/2000.mp3?v=1742063560494", 0],
        ["Wahaha March", "Pig Head Skin", "https://lh3.googleusercontent.com/WdEL1J3b1WYLN9vfgG75DrTVLk-FRvDQseiXOcZtCzvzZt4mMtXJnrZN3UuG4hT8avy1T5ffB-AIFTML", "https://file.garden/Z9XHdyLGHwUEZPS4/%E5%93%87%E5%93%88%E5%93%88%E9%80%B2%E8%A1%8C%E6%9B%B2%20(%E9%9F%BF%E4%BA%AE%E5%A4%A7%E8%81%B2%E5%93%87%E5%93%88%E5%93%88)%20-%20%E8%B1%AC%E9%A0%AD%E7%9A%AE%20(youtube).mp3?v=1766078689333", 0],
        ["The Great Citizen", "Zheng Zhi Hua", "https://i.kfs.io/album/global/18510911,1v1/fit/500x500.jpg", "https://file.garden/Z9XHdyLGHwUEZPS4/%E9%84%AD%E6%99%BA%E5%8C%96%20Zheng%20Zhi-Hua%20-%20%E5%A4%A7%E5%9C%8B%E6%B0%91%20The%20Great%20Citizen%20(official%E5%AE%98%E6%96%B9%E5%AE%8C%E6%95%B4%E7%89%88MV)%20-%20Timeless%20Music%20(youtube).mp3?v=1766076997114", 0],
        ["Taipei Empire", "Blacklist Studio", "https://i.kfs.io/album/global/57150293,0v1/fit/500x500.jpg", "https://file.garden/Z9XHdyLGHwUEZPS4/%E9%BB%91%E5%90%8D%E5%96%AE%E5%B7%A5%E4%BD%9C%E5%AE%A4%20Black%20List%E3%80%90%E5%8F%B0%E5%8C%97%E5%B8%9D%E5%9C%8B%20Taipei%20Empire%E3%80%91Official%20Music%20Video%20-%20%E6%BB%BE%E7%9F%B3%E5%94%B1%E7%89%87%20ROCK%20RECORDS%20(youtube).mp3?v=1766076751391", 0],
        ["Republic of China In Taiwan", "Pig Head Skin", "https://lh3.googleusercontent.com/Ofk4-1yPwv08M67VaAjiwo5B19waC2I4oxoXgWRgB2hztgZHHezwwBpEJT1et5BcNce7iAeQkXmcYiw", "https://file.garden/Z9XHdyLGHwUEZPS4/%E4%B8%AD%E8%8F%AF%E6%B0%91%E5%9C%8B%E5%9C%A8%E5%8F%B0%E7%81%A3%20-%20%E8%B1%AC%E9%A0%AD%E7%9A%AE%20(youtube).mp3?v=1766078484561", 0],
        ["1990 Taiwanese", "吉馬大對唱", "https://lh3.googleusercontent.com/9ILgtEm4fyBydA8rCHTuNeC8EMZNmDSCi6LCgJHQgTgX80kzEAEH_qI3UY2f-g5SJiOAWymmVZW_QIs", "https://file.garden/Z9XHdyLGHwUEZPS4/1990%E5%8F%B0%E7%81%A3%E4%BA%BA%20-%20%E5%90%89%E9%A6%AC%E5%A4%A7%E5%B0%8D%E5%94%B1%20(youtube).mp3?v=1766077770323", 0],
        ["漂浪 Hustling", "Wu Bai & China Blue", "https://upload.wikimedia.org/wikipedia/zh/1/11/%E6%A8%B9%E6%9E%9D%E5%AD%A4%E9%B3%A5.jpg", "https://file.garden/Z9XHdyLGHwUEZPS4/%E4%BC%8D%E4%BD%B0%20Wu%20Bai%26China%20Blue%E6%BC%82%E6%B5%AA%20%20HustlingOfficial%20Music%20Video.mp3?v=1766517078359", 0],
        ["Happy to Future", "謝志偉", "https://i.discogs.com/34rDE2suyXF995XVBobUX-OFeceDL5QPgq-lW4bT1bw/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE5MjMz/ODY4LTE3MjcxMzA2/OTQtMTMyNS5qcGVn.jpeg", "https://file.garden/Z9XHdyLGHwUEZPS4/02%20%E6%AD%A1%E5%96%9C%E7%9C%8B%E6%9C%AA%E4%BE%86%20-%20DJ%E9%99%B3%E7%88%B8%E7%88%B8%20(youtube).mp3?v=1766082435012", 1],
        ["Fifty NTD", "Luo Da-you", "https://lh3.googleusercontent.com/AaDL5R7GKA7C-bTzpD5QxZF_5IUCsZYnxjGisAMxdYl5H8JKbUY0PUBk8lPaNM8eD-P0mBO7aL-KLSXX", "https://file.garden/Z9XHdyLGHwUEZPS4/%E4%BA%94%E5%8D%81%E5%A1%8A%E9%8C%A2%20-%20Lo%20Ta-yu%20(youtube).mp3?v=1766086387769", 0],
        ["Taipei New HomeTown", "詹宏達", "https://i.imgur.com/HEaVtqB.png", "https://file.garden/Z9XHdyLGHwUEZPS4/%E8%A9%B9%E5%AE%8F%E9%81%94-%E5%8F%B0%E5%8C%97%E6%96%B0%E6%95%85%E9%84%89.mp3", 1],
        ["With you and me", "Wang Jianjie", "https://file.garden/Z9XHdyLGHwUEZPS4/20241228221610.jpg?v=1766081048768", "https://file.garden/Z9XHdyLGHwUEZPS4/you%20and%20me?v=1766080672991", 1],
        ["March of Taiwan", "OK 男女合唱團", "https://lh3.googleusercontent.com/0D0W16lF0zJg2Wbs-3w8r-HhlUxfI-SnwkfDt1I8HKlZZGDqFDBgeigdYPo2x6DBtDpsrGmTAWdWvJI", "https://file.garden/Z9XHdyLGHwUEZPS4/%E5%8F%B0%E7%81%A3%E9%80%B2%E8%A1%8C%E6%9B%B2%20-%20OK%20%E7%94%B7%E5%A5%B3%E5%90%88%E5%94%B1%E5%9C%98%20(youtube).mp3?v=1766081390100", 1],
        ["Promise of Century", "周恆毅　莊佳穎", "https://i.imgur.com/g176BJE.png", "https://file.garden/Z9XHdyLGHwUEZPS4/06%20%E4%B8%96%E7%B4%80%E4%B9%8B%E7%B4%84.mp3", 1],
        ["Dreamers are the most beautiful", "詹宏達", "https://i.imgur.com/g176BJE.png", "https://file.garden/Z9XHdyLGHwUEZPS4/%E6%9C%89%E5%A4%A2%E6%9C%80%E7%BE%8E.mp3", 1],
        ["Happiness March", "詹宏達", "https://i.imgur.com/g176BJE.png", "https://file.garden/Z9XHdyLGHwUEZPS4/%E5%B9%B8%E7%A6%8F%E9%80%B2%E8%A1%8C%E6%9B%B2.mp3", 1],
        ["Fallen Angels", "Zheng Zhi Hua", "https://lh3.googleusercontent.com/HMO4q42Sw6KzLEPPfjEFbnMkfSvyO-4hQNxBP0uKJ1yqBplCiSrNl08U5JScx1tKU4DFHMmedHcqwI0", "https://file.garden/Z9XHdyLGHwUEZPS4/%E5%A2%AE%E8%90%BD%E5%A4%A9%E4%BD%BF%20-%20Zheng%20Zhi%20Hua%20(youtube).mp3?v=1766080971862", 2],
        ["Young Taiwan", "詹宏達", "https://i.imgur.com/g176BJE.png", "https://file.garden/Z9XHdyLGHwUEZPS4/%E5%B0%91%E5%B9%B4%E5%8F%B0%E7%81%A3%20-%20DJ%E9%99%B3%E7%88%B8%E7%88%B8%20(youtube).mp3?v=1766082168842", 1],
        ["Enemies (feat. OK Choir)", "OK 男女合唱團", "https://lh3.googleusercontent.com/DazZg61156DaluWxMt0htx9j1b4WfbTv1yNb4Z3Re5fcGohzE89E15cEOQNgvBbRB0LEyKeZQuLJ6Qh3", "https://file.garden/Z9XHdyLGHwUEZPS4/%E5%86%A4%E5%AE%B6%20(feat.%20OK%20%E7%94%B7%E5%A5%B3%E5%90%88%E5%94%B1%E5%9C%98)%20-%20Lo%20Ta-yu%20(youtube).mp3?v=1766081867602", 2],
        ["Dow Ma Dan", "Coco Lee", "https://lh3.googleusercontent.com/rPRWAZBo7XHX896Ejw53yDM82ktfCSxvZfUvqvzAPWwGi4m5YIRcm_eaRpjiwvlf4Z6S8E05vYlNa48e", "https://file.garden/Z9XHdyLGHwUEZPS4/%E6%9D%8E%E7%8E%9F%20CoCo%20Lee%20-%20%E5%88%80%E9%A6%AC%E6%97%A6%20-%20cocoleeVEVO%20(youtube).mp3?v=1766083282163", 2],
        ["First experience of love", "Chang Cheng-Yue", "https://lh3.googleusercontent.com/o1z9ybGkIHSJgB08cuQn4JkfwmGsenpzY5LTGHP1K8e4ttJCGaP25kqUS4ZnQ1nbJ8l02-SRassM4IY", "https://file.garden/Z9XHdyLGHwUEZPS4/%E5%BC%B5%E9%9C%87%E5%B6%BD%20A-Yue%E3%80%90%E6%84%9B%E3%81%AE%E5%88%9D%E9%AB%94%E9%A9%97%20Love's%20first%20taste%E3%80%91Official%20Music%20Video%20-%20%E6%BB%BE%E7%9F%B3%E5%94%B1%E7%89%87%20ROCK%20RECORDS%20(youtube).mp3?v=1766083662744", 2],
        ["Di da di", "Coco Lee", "https://lh3.googleusercontent.com/nhJQeZBRfTfJgVMBkYUTLPf8zsvY7VVVU2UQJ9-nJtM-NiZ9A11PL0QEhhXyvta_u76B6UUGiFZqBB0htQ", "https://file.garden/Z9XHdyLGHwUEZPS4/%E6%9D%8E%E7%8E%9F%20Di%20DA%20Di%20%E6%AD%8C%E8%A9%9E%E7%89%88%20-%20LRCS%E7%B6%93%E5%85%B8%E6%B5%81%E8%A1%8C%E5%8F%B0%E8%8F%AF%E8%AA%9E%E6%AD%8C%E8%A9%9E%E9%83%A8%20(youtube).mp3?v=1766084461537", 2],
        ["Courage", "Fish Leong", "https://lh3.googleusercontent.com/g1LiJ5CvxWZcNJSBa8uS7oPAle_oHfNtJs8Bhn7XObwj8EzLuhdnSr5Lmr6Elyx-bdz4E74iTpQ52I4N", "https://file.garden/Z9XHdyLGHwUEZPS4/%E5%8B%87%E6%B0%94%20%E6%A2%81%E9%9D%99%E8%8C%B9%20(%E6%AD%8C%E8%AF%8D%E7%89%88)%20-%20GM%20Lyric%20(youtube).mp3?v=1766084727971", 2],
        ["Don't Stop", "Jolin Cai", "https://lh3.googleusercontent.com/1xT04q4t9qxtZpt6K1AqQQHgBqLlVK7BbftmsspNadHTCB33MrA0CBml5RIDUcM8PEqUSyzRtf02GlOM", "https://file.garden/Z9XHdyLGHwUEZPS4/%E8%94%A1%E4%BE%9D%E6%9E%97%20-%20Don't%20Stop%20MV%20(DVD)%20-%20Mr.%20Humburger%20(youtube).mp3?v=1766085360921", 2]
    ];

    defaultSongs.forEach(data => {
        activePlaylist.addSong(new Song(data[0], data[1], data[2], data[3]), data[4]);
    });

    // inject CSS
    if (!document.getElementById("player-style")) {
        const style = document.createElement("style");
        style.id = "player-style";
        style.textContent = `
        #player {
            border: 3px solid #C9C9C9;
            display: flex;
            flex-direction: row;
            height: 191px;
            background-image: url("${ASSETS.bg}");
            background-size: cover;
        }
        #display-box { display: flex; align-items: center; width: 50%; padding-left: 5px; }
        #covers-container { display: flex; flex-direction: row; align-items: center; justify-content: center; margin-right: 10px; gap: 5px; }
        #cover { width: 120px; height: 120px; border: 2px solid #fff; box-shadow: 0 0 5px rgba(0,0,0,0.5); z-index: 2; object-fit: cover; }
        .side-cover {
            width: 60px; height: 60px; opacity: 0.5; filter: grayscale(50%); border: 1px solid #888;
            z-index: 1; object-fit: cover; transition: all 0.3s ease; user-select: none; -webkit-user-select: none;
        }
        .side-cover:hover { opacity: 0.9; filter: grayscale(0%); transform: scale(1.05); cursor: pointer; }
        #info-container {
            display: flex; flex-direction: row; height: 178px; width: 127px; margin-top: 3px;
            background-image: url("${ASSETS.infoBg}"); background-size: cover; color: white;
        }
        #song-info { width: 100%; padding: 5px; }
        #title { font-weight: normal; margin-bottom: 5px;}
        #controls-container { display: flex; flex-direction: column; align-items: center; margin: 10px; width: 100%; padding-top: 15px; }
        #controls { display: flex; flex-direction: row; justify-content: center; width: 80%; gap: 5px; }
        #controls img { cursor: pointer; transition: transform 0.1s; }
        #controls img:active { transform: scale(0.95); }
        
        #progress-bar-container {
            width: 80%; height: 24px; background: linear-gradient(to bottom, #d4d0c8, #f1f1f1);
            border: 2px solid #808080; border-radius: 5px; padding: 2px; box-shadow: inset 2px 2px 2px rgba(0, 0, 0, 0.2);
        }
        #progress-bar { width: 100%; height: 100%; -webkit-appearance: none; appearance: none; background: transparent; border: none; margin: 0; overflow: hidden; display: block; cursor: pointer; }
        #progress-bar::-webkit-slider-runnable-track { width: 100%; height: 100%; background: #888; }
        #progress-bar::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 0; height: 0; background: transparent; box-shadow: -100vw 0 0 100vw green; }

        #volume-container {
            margin-top: 20px;
            margin-right: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            width: 40px; 
        }
        #volume-container img {
            width: 35px;
            height: auto;
            margin-bottom: 8px;
            z-index: 2;
        }
        .vol-wrapper {
            position: relative;
            width: 20px;
            height: 110px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #volumeSlider {
            -webkit-appearance: none; 
            appearance: none;
            width: 110px;
            height: 8px;
            background: linear-gradient(to bottom, #d4d0c8, #f1f1f1); 
            border-radius: 5px; 
            border: 2px solid #808080;
            box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.3); 
            transform: rotate(270deg); 
            transform-origin: center center;
            margin: 0;
            cursor: pointer;
        }
        #volumeSlider::-webkit-slider-thumb {
            -webkit-appearance: none; 
            appearance: none; 
            width: 14px;
            height: 14px; 
            background: green;
            border-radius: 50%; 
            border: 2px solid #808080; 
            box-shadow: 0px 0px 5px rgba(255, 255, 255, 0.6); 
            cursor: pointer;
        }
        `;
        document.head.appendChild(style);
    }

    // create HTML
    const playerContainer = document.createElement("div");
    playerContainer.id = "player";
    playerContainer.innerHTML = `
        <div id="display-box">
            <div id="covers-container">
                <img id="prev-cover" class="side-cover" title="Double click to play previous">
                <img id="cover">
                <img id="next-cover" class="side-cover" title="Double click to play next">
            </div>
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
                <img id="nextalbum" src="${ASSETS.btnAlbum}" alt="Next Album">
                <img id="loopButton" src="${ASSETS.btnLoopOff}" alt="Loop">
            </div>
            <div id="progress-bar-container">
                <input type="range" id="progress-bar" value="0" min="0" max="100" step="0.1">
            </div>
        </div>
        <div id="volume-container">
            <img src="${ASSETS.volIcon}" alt="Volume">
            <div class="vol-wrapper">
                <input type="range" id="volumeSlider" min="0" max="9" step="1" value="5">
            </div>
            <span id="volume-display" style="font-weight: bold; display: none;">5</span>
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
    const nextAlbumBtn = document.getElementById("nextalbum");
    const loopBtn = document.getElementById("loopButton");
    const prevCover = document.getElementById("prev-cover");
    const nextCover = document.getElementById("next-cover");

    const progressBar = document.getElementById("progress-bar");
    const volumeSlider = document.getElementById("volumeSlider");
    const volDisplay = document.getElementById("volume-display");

    // controls
    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) { safePlay(audio); }
        else { audio.pause(); updatePlayPauseIcon(false); }
    });

    nextBtn.addEventListener("click", () => { activePlaylist.playNext(); playCurrentSong(); });
    prevBtn.addEventListener("click", () => { activePlaylist.playPrevious(); playCurrentSong(); });
    nextAlbumBtn.addEventListener("click", () => { activePlaylist.nextAlbum(); playCurrentSong(); });

    // side-cover double click
    prevCover.addEventListener("dblclick", () => { activePlaylist.playPrevious(); playCurrentSong(); });
    nextCover.addEventListener("dblclick", () => { activePlaylist.playNext(); playCurrentSong(); });

    // loop logic
    loopBtn.addEventListener("click", () => {
        activePlaylist.loop = !activePlaylist.loop;
        loopBtn.src = activePlaylist.loop ? ASSETS.btnLoopOn : ASSETS.btnLoopOff;
    });

    // progress bar
    audio.addEventListener("timeupdate", () => {
        if (Number.isFinite(audio.duration)) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.value = isNaN(progress) ? 0 : progress;
        }
    });

    audio.addEventListener("ended", () => {
        activePlaylist.playNext();
        playCurrentSong();
    });

    progressBar.addEventListener("input", () => {
        if (Number.isFinite(audio.duration)) {
            audio.currentTime = (progressBar.value / 100) * audio.duration;
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
    safePlay(audio);
}

setupMusicPlayer();