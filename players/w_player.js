// This is a modified version of the music player
// used in the mod W. and 2004: Four More Wars.
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

// assets
const ASSETS = {
  bg: "https://i.ibb.co/dKL29kY/background.png",
  infoBg: "https://i.ibb.co/M73CBjW/overlay.png",
  btnPrev: "https://i.ibb.co/gMyNq5T/back.png",
  btnPlay: "https://i.ibb.co/G5TsX12/play.png",
  btnPause: "https://i.ibb.co/5TwzzWN/pause.png",
  btnNext: "https://i.ibb.co/5Rx0cYt/forward.png",
  volIcon: "https://i.ibb.co/9Gkg5Qp/volume.png"
};

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  // ensure audio exists before trying to access it
  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.audioLink;
    audio.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
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
  if (btn) {
    btn.src = isPlaying ? ASSETS.btnPause : ASSETS.btnPlay;
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
    ["Two Words", "Kanye West, Mos Def, The Boys Choir Of Harlem", "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg", "https://audio.jukehost.co.uk/SeyciEFDB7FW27mwoe6eUPNtLoEjTEDa"],
    ["Jesus of Suburbia", "Green Day", "https://upload.wikimedia.org/wikipedia/en/e/ed/Green_Day_-_American_Idiot_album_cover.png", "https://audio.jukehost.co.uk/ie5hY1Mg2vFmhLCg6B4SCkLxR7qPJj8X"],
    ["Holiday / Blvd of Broken Dreams", "Green Day", "https://upload.wikimedia.org/wikipedia/en/e/ed/Green_Day_-_American_Idiot_album_cover.png", "https://audio.jukehost.co.uk/8CLWokDOaUI0nDFrFmDUMBYHCRHrnCDG"],
    ["The Middle", "Jimmy Eat World", "https://resources.tidal.com/images/8434cc6f/7ce9/4558/bea8/af00b34dce36/320x320.jpg", "https://audio.jukehost.co.uk/VLIEj9gbu4y1WBgJjMKkdlckXQzAQsb8"],
    ["Saddest Girl Story", "The Starting Line", "https://resources.tidal.com/images/89571243/7a8b/4a85/945b/ec723866e109/320x320.jpg", "https://audio.jukehost.co.uk/A2jyXHWjaFVimqsqdgldYnBokmEV2Aup"],
    ["The Boy Who Blocked His Own Shot", "Brand New", "https://resources.tidal.com/images/1c1ba9d5/f47c/417d/86d3/48d46dac02db/320x320.jpg", "https://audio.jukehost.co.uk/5tx0d7xnGrJw3T2ue4r451SLrRUphlBd"],
    ["War All The Time", "Thursday", "https://resources.tidal.com/images/2eb4dbc7/0f01/4d0c/ac73/c19691259eea/320x320.jpg", "https://audio.jukehost.co.uk/seThtysSBS6MsbfeUUNRuKlxAkR0GSlO"],
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes sliding {
      from { transform: translateX(-30px); }
      to   { transform: translateX(100%); }
    }

    :root {
      --xp-progress-shadow: inset 0 0 1px 0 #686868;
      --xp-progress-value-bg: repeating-linear-gradient(90deg, #fff 0, #fff 2px, transparent 0, transparent 10px), linear-gradient(180deg, #acedad 0, #7be47d 14%, #4cda50 28%, #2ed330 42%, #42d845 57%, #76e275 71%, #8fe791 85%, #fff);
      --xp-progress-indeterminate-bg: repeating-linear-gradient(90deg, transparent 0, transparent 8px, #fff 0, #fff 10px, transparent 0, transparent 18px, #fff 0, #fff 20px, transparent 0, transparent 28px, #fff 0, #fff), linear-gradient(180deg, #acedad 0, #7be47d 14%, #4cda50 28%, #2ed330 42%, #42d845 57%, #76e275 71%, #8fe791 85%, #fff);
      --xp-range-track-shadow: 1px 0 0 #fff, 1px 1px 0 #fff, 0 1px 0 #fff, -1px 0 0 #9d9c99, -1px -1px 0 #9d9c99, 0 -1px 0 #9d9c99, -1px 1px 0 #fff, 1px -1px #9d9c99;
      --xp-range-track-shadow-vertical: -1px 0 0 #fff, -1px 1px 0 #fff, 0 1px 0 #fff, 1px 0 0 #9d9c99, 1px -1px 0 #9d9c99, 0 -1px 0 #9d9c99, 1px 1px 0 #fff, -1px -1px #9d9c99;
    }

    /* progress bar */
    progress {
      box-sizing: border-box; appearance: none; -webkit-appearance: none; -moz-appearance: none;
      height: 14px; padding: 1px 2px 1px 0; overflow: hidden; background-color: #fff; border: 1px solid #686868; border-radius: 4px;
      -webkit-box-shadow: var(--xp-progress-shadow); -moz-box-shadow: var(--xp-progress-shadow); box-shadow: var(--xp-progress-shadow);
      cursor: pointer; /* Ensures users know they can click it */
    }
    progress[value]::-webkit-progress-bar { background-color: transparent; }
    progress[value]::-webkit-progress-value, progress[value]::-moz-progress-bar { border-radius: 2px; background: var(--xp-progress-value-bg); }
    progress:not([value]) { position: relative; }
    progress:not([value])::-webkit-progress-bar, progress:not([value])::-moz-progress-bar { width: 100%; background: var(--xp-progress-indeterminate-bg); animation: sliding 2s linear infinite; }
    progress:not([value]):before { content: ""; position: absolute; inset: 0; box-sizing: border-box; background-color: #fff; box-shadow: var(--xp-progress-shadow); }
    progress:not([value]):after { content: ""; position: absolute; top: 1px; left: 2px; width: 100%; height: calc(100% - 2px); box-sizing: border-box; padding: 1px 2px; border-radius: 2px; background: var(--xp-progress-indeterminate-bg); animation: sliding 2s linear infinite; }

    /* range */
    input[type=range] { -webkit-appearance:none; width:100%; background:transparent }
    input[type=range]:focus { outline:none }
    .is-vertical { display:inline-block; width:4px; height:150px; transform:translateY(50%) }
    .is-vertical>input[type=range] { width:150px; height:4px; margin:0 16px 0 10px; transform-origin:left; transform:rotate(270deg) translateX(calc(-50% + 8px)) }
    .is-vertical>input[type=range]::-webkit-slider-thumb { transform:translateY(-8px) scaleX(-1) }
    .is-vertical>input[type=range]::-moz-range-thumb { transform:translateY(2px) scaleX(-1) }
    .is-vertical>input[type=range].has-box-indicator::-webkit-slider-thumb { transform:translateY(-10px) scaleX(-1) }
    .is-vertical>input[type=range].has-box-indicator::-moz-range-thumb { transform:translateY(0) scaleX(-1) }

    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance:none; height:21px; width:11px; transform:translateY(-8px);
      background:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -0.5 11 21' shape-rendering='crispEdges'%3E%3Cpath stroke='%23becbd3' d='M1 0h1M0 1h1'/%3E%3Cpath stroke='%23b6c5cd' d='M2 0h1M0 2h1'/%3E%3Cpath stroke='%23b5c4cd' d='M3 0h5M0 3h1M0 4h1M0 5h1M0 6h1M0 7h1M0 8h1M0 9h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23afbfc8' d='M8 0h1M0 14h1'/%3E%3Cpath stroke='%239fb2be' d='M9 0h1M0 15h1'/%3E%3Cpath stroke='%23a6d1b1' d='M1 1h1'/%3E%3Cpath stroke='%236fd16e' d='M2 1h1M1 2h1'/%3E%3Cpath stroke='%2367ce65' d='M3 1h1M1 3h1'/%3E%3Cpath stroke='%2366ce64' d='M4 1h3'/%3E%3Cpath stroke='%2362cd61' d='M7 1h1'/%3E%3Cpath stroke='%2345c343' d='M8 1h1M7 2h1'/%3E%3Cpath stroke='%2363ac76' d='M9 1h1M2 16h1m0 1h1m0 1h1'/%3E%3Cpath stroke='%23879aa6' d='M10 1h1'/%3E%3Cpath stroke='%2363cd62' d='M2 2h1'/%3E%3Cpath stroke='%2349c547' d='M3 2h1M2 3h1'/%3E%3Cpath stroke='%2347c446' d='M4 2h3'/%3E%3Cpath stroke='%2321b71f' d='M8 2h1'/%3E%3Cpath stroke='%231da41c' d='M9 2h1'/%3E%3Cpath stroke='%237d8e99' d='M10 2h1'/%3E%3Cpath stroke='%2325b923' d='M3 3h1'/%3E%3Cpath stroke='%2321b81f' d='M4 3h4M2 15h1'/%3E%3Cpath stroke='%231ea71c' d='M8 3h1'/%3E%3Cpath stroke='%231b9619' d='M9 3h1'/%3E%3Cpath stroke='%23778892' d='M10 3h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23f7f7f4' d='M1 4h1M1 5h1M1 6h1M1 7h1M1 8h1M1 9h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23f5f5f2' d='M2 4h1M2 5h1M2 6h1M2 7h1M2 8h1M2 9h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23f3f3ef' d='M3 4h5M3 5h5M3 6h5M3 7h5M3 8h5M3 9h5m-5 1h5m-5 1h5m-5 1h5m-5 1h4m-4 1h3m-2 1h1'/%3E%3Cpath stroke='%23dcdcd9' d='M8 4h1M8 5h1M8 6h1M8 7h1M8 8h1M8 9h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23c3c3c0' d='M9 4h1M9 5h1M9 6h1M9 7h1M9 8h1M9 9h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23f1f1ed' d='M7 13h1m-2 1h1m-2 1h1'/%3E%3Cpath stroke='%23dbdbd8' d='M8 13h1'/%3E%3Cpath stroke='%23c4c4c1' d='M9 13h1'/%3E%3Cpath stroke='%234bc549' d='M1 14h1'/%3E%3Cpath stroke='%23f4f4f1' d='M2 14h1'/%3E%3Cpath stroke='%23e6e6e2' d='M7 14h1m-2 1h1'/%3E%3Cpath stroke='%23cececa' d='M8 14h1'/%3E%3Cpath stroke='%231a9319' d='M9 14h1'/%3E%3Cpath stroke='%23788993' d='M10 14h1'/%3E%3Cpath stroke='%2369b17b' d='M1 15h1'/%3E%3Cpath stroke='%23f2f2ee' d='M3 15h1m0 1h1'/%3E%3Cpath stroke='%23d0d0cc' d='M7 15h1m-2 1h1'/%3E%3Cpath stroke='%231a9118' d='M8 15h1m-2 1h1m-2 1h1'/%3E%3Cpath stroke='%234c845a' d='M9 15h1'/%3E%3Cpath stroke='%2372838d' d='M10 15h1'/%3E%3Cpath stroke='%2391a6b2' d='M1 16h1m0 1h1m0 1h1m0 1h1'/%3E%3Cpath stroke='%2321b61f' d='M3 16h1m0 1h1'/%3E%3Cpath stroke='%23e7e7e3' d='M5 16h1'/%3E%3Cpath stroke='%234b8259' d='M8 16h1m-2 1h1m-2 1h1'/%3E%3Cpath stroke='%236e7e88' d='M9 16h1m-2 1h1m-2 1h1m-2 1h1'/%3E%3Cpath stroke='%23d7d7d4' d='M5 17h1'/%3E%3Cpath stroke='%231da21b' d='M5 18h1'/%3E%3Cpath stroke='%23589868' d='M5 19h1'/%3E%3Cpath stroke='%2380929e' d='M5 20h1'/%3E%3C/svg%3E");
    }
    input[type=range]::-moz-range-thumb {
      height:21px; width:11px; border:0; border-radius:0; transform:translateY(2px);
      background:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -0.5 11 21' shape-rendering='crispEdges'%3E%3Cpath stroke='%23becbd3' d='M1 0h1M0 1h1'/%3E%3Cpath stroke='%23b6c5cd' d='M2 0h1M0 2h1'/%3E%3Cpath stroke='%23b5c4cd' d='M3 0h5M0 3h1M0 4h1M0 5h1M0 6h1M0 7h1M0 8h1M0 9h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23afbfc8' d='M8 0h1M0 14h1'/%3E%3Cpath stroke='%239fb2be' d='M9 0h1M0 15h1'/%3E%3Cpath stroke='%23a6d1b1' d='M1 1h1'/%3E%3Cpath stroke='%236fd16e' d='M2 1h1M1 2h1'/%3E%3Cpath stroke='%2367ce65' d='M3 1h1M1 3h1'/%3E%3Cpath stroke='%2366ce64' d='M4 1h3'/%3E%3Cpath stroke='%2362cd61' d='M7 1h1'/%3E%3Cpath stroke='%2345c343' d='M8 1h1M7 2h1'/%3E%3Cpath stroke='%2363ac76' d='M9 1h1M2 16h1m0 1h1m0 1h1'/%3E%3Cpath stroke='%23879aa6' d='M10 1h1'/%3E%3Cpath stroke='%2363cd62' d='M2 2h1'/%3E%3Cpath stroke='%2349c547' d='M3 2h1M2 3h1'/%3E%3Cpath stroke='%2347c446' d='M4 2h3'/%3E%3Cpath stroke='%2321b71f' d='M8 2h1'/%3E%3Cpath stroke='%231da41c' d='M9 2h1'/%3E%3Cpath stroke='%237d8e99' d='M10 2h1'/%3E%3Cpath stroke='%2325b923' d='M3 3h1'/%3E%3Cpath stroke='%2321b81f' d='M4 3h4M2 15h1'/%3E%3Cpath stroke='%231ea71c' d='M8 3h1'/%3E%3Cpath stroke='%231b9619' d='M9 3h1'/%3E%3Cpath stroke='%23778892' d='M10 3h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23f7f7f4' d='M1 4h1M1 5h1M1 6h1M1 7h1M1 8h1M1 9h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23f5f5f2' d='M2 4h1M2 5h1M2 6h1M2 7h1M2 8h1M2 9h1m-1 1h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23f3f3ef' d='M3 4h5M3 5h5M3 6h5M3 7h5M3 8h5M3 9h5m-5 1h5m-5 1h5m-5 1h5m-5 1h4m-4 1h3m-2 1h1'/%3E%3Cpath stroke='%23dcdcd9' d='M8 4h1M8 5h1M8 6h1M8 7h1M8 8h1M8 9h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23c3c3c0' d='M9 4h1M9 5h1M9 6h1M9 7h1M9 8h1M9 9h1m-1 1h1m-1 1h1m-1 1h1'/%3E%3Cpath stroke='%23f1f1ed' d='M7 13h1m-2 1h1m-2 1h1'/%3E%3Cpath stroke='%23dbdbd8' d='M8 13h1'/%3E%3Cpath stroke='%23c4c4c1' d='M9 13h1'/%3E%3Cpath stroke='%234bc549' d='M1 14h1'/%3E%3Cpath stroke='%23f4f4f1' d='M2 14h1'/%3E%3Cpath stroke='%23e6e6e2' d='M7 14h1m-2 1h1'/%3E%3Cpath stroke='%23cececa' d='M8 14h1'/%3E%3Cpath stroke='%231a9319' d='M9 14h1'/%3E%3Cpath stroke='%23788993' d='M10 14h1'/%3E%3Cpath stroke='%2369b17b' d='M1 15h1'/%3E%3Cpath stroke='%23f2f2ee' d='M3 15h1m0 1h1'/%3E%3Cpath stroke='%23d0d0cc' d='M7 15h1m-2 1h1'/%3E%3Cpath stroke='%231a9118' d='M8 15h1m-2 1h1m-2 1h1'/%3E%3Cpath stroke='%234c845a' d='M9 15h1'/%3E%3Cpath stroke='%2372838d' d='M10 15h1'/%3E%3Cpath stroke='%2391a6b2' d='M1 16h1m0 1h1m0 1h1m0 1h1'/%3E%3Cpath stroke='%2321b61f' d='M3 16h1m0 1h1'/%3E%3Cpath stroke='%23e7e7e3' d='M5 16h1'/%3E%3Cpath stroke='%234b8259' d='M8 16h1m-2 1h1m-2 1h1'/%3E%3Cpath stroke='%236e7e88' d='M9 16h1m-2 1h1m-2 1h1m-2 1h1'/%3E%3Cpath stroke='%23d7d7d4' d='M5 17h1'/%3E%3Cpath stroke='%231da21b' d='M5 18h1'/%3E%3Cpath stroke='%23589868' d='M5 19h1'/%3E%3Cpath stroke='%2380929e' d='M5 20h1'/%3E%3C/svg%3E");
    }
    input[type=range]::-webkit-slider-runnable-track { width:100%; height:2px; box-sizing:border-box; background:#ecebe4; border-right:1px solid #f3f2ea; border-bottom:1px solid #f3f2ea; border-radius:2px; box-shadow:1px 0 0 #fff,1px 1px 0 #fff,0 1px 0 #fff,-1px 0 0 #9d9c99,-1px -1px 0 #9d9c99,0 -1px 0 #9d9c99,-1px 1px 0 #fff,1px -1px #9d9c99 }
    input[type=range]::-moz-range-track { width:100%; height:2px; box-sizing:border-box; background:#ecebe4; border-right:1px solid #f3f2ea; border-bottom:1px solid #f3f2ea; border-radius:2px; box-shadow:1px 0 0 #fff,1px 1px 0 #fff,0 1px 0 #fff,-1px 0 0 #9d9c99,-1px -1px 0 #9d9c99,0 -1px 0 #9d9c99,-1px 1px 0 #fff,1px -1px #9d9c99 }
    .is-vertical>input[type=range]::-webkit-slider-runnable-track { border-left:1px solid #f3f2ea; border-right:0; border-bottom:1px solid #f3f2ea; box-shadow:-1px 0 0 #fff,-1px 1px 0 #fff,0 1px 0 #fff,1px 0 0 #9d9c99,1px -1px 0 #9d9c99,0 -1px 0 #9d9c99,1px 1px 0 #fff,-1px -1px #9d9c99 }
    .is-vertical>input[type=range]::-moz-range-track { border-left:1px solid #f3f2ea; border-right:0; border-bottom:1px solid #f3f2ea; box-shadow:-1px 0 0 #fff,-1px 1px 0 #fff,0 1px 0 #fff,1px 0 0 #9d9c99,1px -1px 0 #9d9c99,0 -1px 0 #9d9c99,1px 1px 0 #fff,-1px -1px #9d9c99 }

    /* actual player styling */
    #player {
      border: 3px solid #C9C9C9;
      display: flex;
      flex-direction: row;
      height: 191px;
      background-image: url("${ASSETS.bg}");
      font-family: sans-serif;
    }
    #display-box { display: flex; align-items: center; width: 50%; }
    #cover { width: 176px; height: 176px; object-fit: cover; }

    #info-container {
      display: flex;
      flex-direction: row;
      height: 178px;
      width: 127px;
      margin-top: 3px;
      background-image: url("${ASSETS.infoBg}");
      background-size: cover;
      color: white;
    }

    #song-info { width: 100%; padding: 5px; box-sizing: border-box; }
    #title { font-weight: normal; font-size: 15px; line-height: 1.1; }
    #artist { margin: 0; opacity: 0.95; }

    #controls-container {
      display: flex; flex-direction: column; align-items: center;
      margin: 10px; width: 100%; padding-top: 15px;
    }

    #controls {
      display: flex; flex-direction: row; justify-content: center;
      width: 80%; cursor: pointer;
    }
    #controls img { transition: transform 0.1s; }
    #controls img:active { transform: scale(0.95); }

    #progress-bar-container { width: 100%; }
    #progress-bar { width: 80%; display: block; margin: 20px auto 0 auto; }

    #volume-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    #player .is-vertical {
      height: 126px;
      margin-left: 23%;
      margin: 0 1.2em 1em 0;
    }
    #player .is-vertical>input[type=range] { width: 125px; }
    #volume-display { font-weight: bold; display: none; }
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
      <div id="controls">
        <img id="prevButton" src="${ASSETS.btnPrev}" alt="Previous">
        <img id="playPauseButton" src="${ASSETS.btnPlay}" alt="Play/Pause">
        <img id="nextButton" src="${ASSETS.btnNext}" alt="Next">
      </div>
      <div id="progress-bar-container">
        <progress id="progress-bar" value="0" max="100"></progress>
      </div>
    </div>
    <div id="volume-container">
      <img src="${ASSETS.volIcon}" alt="Volume">
      <div class="is-vertical">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="1">
      </div>
      <span id="volume-display">1</span>
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
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volumeSlider");
  const volDisplay = document.getElementById("volume-display");

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

  // progressbar
  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration)) {
      progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  progressBar.addEventListener("click", function (e) {
    if (Number.isFinite(audio.duration)) {
      const rect = this.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const seekTime = (clickX / rect.width) * audio.duration;
      audio.currentTime = seekTime;
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
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

setupMusicPlayer();
