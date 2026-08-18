// This is a recreation of the music player
// showcased in the mockup 1992+.
class Song {
  constructor(title, artist, coverLink, audioLink, isFavorite = false) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;
    this.audioLink = audioLink;
    this.isFavorite = isFavorite;
  }
  getTitle() { return this.title; }
  getArtist() { return this.artist; }
  getCoverLink() { return this.coverLink; }
  getAudioLink() { return this.audioLink; }
}

class Playlist {
  constructor(name = "Playlist") {
    this.name = name;
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

// globals
let mainPlaylist = new Playlist("Default");
let activePlaylist = mainPlaylist;
let loopSong = false;

let audioInstance = null;
let currentVolume = 0.8;
let isCurrentYT = false;

let ytPlayer = null;
let isYTReady = false;

// helpers
function extractYouTubeId(url) {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getAudioElement() {
  if (!audioInstance) {
    audioInstance = document.getElementById("audio") || document.createElement("audio");
    audioInstance.id = "audio";
    if (!document.body.contains(audioInstance)) {
      document.body.appendChild(audioInstance);
    }
  }
  return audioInstance;
}

function updatePlayPauseIcon(isPlaying) {
  const btn = document.getElementById("playPause");
  if (btn) btn.textContent = isPlaying ? "PAUSE" : "PLAY";
}

// UI update
function updateUI(playlist) {
  const currentPlaylist = playlist || activePlaylist;
  if (!currentPlaylist) return;

  const currentSong = currentPlaylist.getCurrentSong();
  if (!currentSong) return;

  const title = document.getElementById("songTitle");
  if (title) title.textContent = currentSong.getTitle();
}
window.updateUI = updateUI;

// playlist switching
function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;
  updateUI(activePlaylist);
  playSongAtIndex();
}
window.changePlaylist = changePlaylist;

// YT iframe api integration
function setupYouTubeAPI() {
  if (document.getElementById("yt-player-container")) return;

  const ytDiv = document.createElement("div");
  ytDiv.id = "yt-player-container";
  ytDiv.style.cssText = "position:absolute; width:1px; height:1px; opacity:0; pointer-events:none; overflow:hidden; top:-9999px; left:-9999px;";
  document.body.appendChild(ytDiv);

  if (!window.YT) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
}

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player("yt-player-container", {
    height: "1",
    width: "1",
    playerVars: {
      "autoplay": 0,
      "controls": 0,
      "disablekb": 1,
      "rel": 0
    },
    events: {
      "onReady": () => { isYTReady = true; },
      "onStateChange": (event) => {
        if (event.data === YT.PlayerState.ENDED) {
          if (loopSong) {
            ytPlayer.seekTo(0, true);
            ytPlayer.playVideo();
          } else {
            activePlaylist.playNext();
            playSongAtIndex();
          }
        }
      }
    }
  });
};

// play song handler
function playSongAtIndex() {
  if (!activePlaylist) return;
  const song = activePlaylist.getCurrentSong();
  if (!song) return;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  const ytId = extractYouTubeId(song.getAudioLink());

  if (ytId) {
    isCurrentYT = true;
    audio.pause();
    audio.currentTime = 0;

    const loadYT = () => {
      if (ytPlayer && ytPlayer.loadVideoById) {
        ytPlayer.loadVideoById(ytId);
        ytPlayer.setVolume(currentVolume * 100);
        updatePlayPauseIcon(true);
      } else {
        setTimeout(loadYT, 300);
      }
    };
    loadYT();
  } else {
    isCurrentYT = false;
    if (ytPlayer && isYTReady && ytPlayer.pauseVideo) {
      ytPlayer.pauseVideo();
    }
    audio.src = song.getAudioLink();
    audio.volume = currentVolume;
    audio.loop = loopSong;
    audio.play().then(() => updatePlayPauseIcon(true)).catch(() => updatePlayPauseIcon(false));
  }
}

// setup music player
function setupMusicPlayer() {
  if (document.getElementById("pixelPlayer")) return;

  setupYouTubeAPI();

  // default tracklist setup
  const defaultSongs = [
    ["Sabbath Bloody Sabbath", "The Cardigans", "https://files.catbox.moe/0gdec5.jpg", "https://files.catbox.moe/9oihg9.mp3"],
    ["Paid For Loving", "Love Jones", "https://fastly-s3.allmusic.com/release/mr0001505330/front/400/GAKLSQcqxWWEldpmhvQ3xN_M69_UI9rrJSVvWL2-yAg=.jpg", "https://files.catbox.moe/706lt0.mp3"],
    ["This Charming Man", "Death Cab for Cutie", "https://upload.wikimedia.org/wikipedia/en/a/ae/Death_Cab_for_Cutie_-_You_Can_Play_These_Songs_With_Chords.jpg", "https://files.catbox.moe/fuz6kt.mp3"],
    ["Heaven or Las Vegas", "Cocteau Twins", "https://e.snmc.io/i/300/w/ca39d13d49f3f9ea31f5815ee93444f3/11766199", "https://files.catbox.moe/xy3lyz.mp3"],
    ["Dog New Tricks", "Garbage", "https://upload.wikimedia.org/wikipedia/en/4/42/GarbageSTinternational.png", "https://files.catbox.moe/5zta22.mp3"],
    ["Last Goodbye", "Jeff Buckley", "https://upload.wikimedia.org/wikipedia/en/e/e4/Jeff_Buckley_grace.jpg", "https://files.catbox.moe/fpzydt.mp3"]
  ];

  if (mainPlaylist.songs.length === 0) {
    defaultSongs.forEach(data => mainPlaylist.addSong(new Song(...data)));
  }
  activePlaylist = mainPlaylist;

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

    #pixelPlayer {
      background-color: #181f2c;
      color: #ffffff;
      font-family: 'VT323', monospace;
      -webkit-font-smoothing: none;
      image-rendering: pixelated;
      width: 320px;
      padding: 8px 12px 10px 12px;
      box-sizing: border-box;
      user-select: none;
      border: 2px solid #101622;
      margin: 8px auto;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    }

    #pixelPlayer-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    #pixelPlayer-info {
      flex: 1;
      overflow: hidden;
      padding-right: 8px;
    }

    #now-playing-label {
      font-size: 15px;
      color: #d6deeb;
      display: flex;
      align-items: center;
      gap: 5px;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    #now-playing-note {
      font-size: 18px;
      color: #ffffff;
    }

    #songTitle {
      font-size: 26px;
      line-height: 1;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-transform: none;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    #pixelPlayer-controls {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1px;
      flex-shrink: 0;
    }

    .pixel-btn {
      background: none;
      border: none;
      color: #ffffff;
      font-family: 'VT323', monospace;
      font-size: 16px;
      cursor: pointer;
      padding: 0;
      line-height: 1.1;
      letter-spacing: 1px;
    }

    .pixel-btn:hover {
      color: #7c9ccc;
    }

    .pixel-btn:active {
      transform: translateY(1px);
    }

    #playPause {
      font-size: 18px;
    }

    #pixelPlayer-bottom {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
    }

    #volumeSlider {
      -webkit-appearance: none;
      appearance: none;
      width: 110px;
      height: 8px;
      background: #334460;
      outline: none;
      border: 1px solid #101622;
      cursor: pointer;
      margin: 0;
    }

    #volumeSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 8px;
      height: 12px;
      background: #ffffff;
      cursor: pointer;
      border-radius: 0;
    }

    #volumeSlider::-moz-range-thumb {
      width: 8px;
      height: 12px;
      background: #ffffff;
      cursor: pointer;
      border: none;
      border-radius: 0;
    }

    .volume-label {
      font-size: 15px;
      color: #ffffff;
      letter-spacing: 1px;
    }
  `;
  document.head.appendChild(style);

  // create HTML
  const player = document.createElement("div");
  player.id = "pixelPlayer";
  player.innerHTML = `
    <div id="pixelPlayer-top">
      <div id="pixelPlayer-info">
        <div id="now-playing-label">
          <span>NOW PLAYING..</span>
          <span id="now-playing-note">♪</span>
        </div>
        <div id="songTitle">${activePlaylist.getCurrentSong().getTitle()}</div>
      </div>
      <div id="pixelPlayer-controls">
        <button id="nextTrack" class="pixel-btn">&gt;&gt;</button>
        <button id="playPause" class="pixel-btn">PAUSE</button>
        <button id="prevTrack" class="pixel-btn">&lt;&lt;</button>
      </div>
    </div>
    <div id="pixelPlayer-bottom">
      <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="${currentVolume}">
      <span class="volume-label">VOLUME</span>
    </div>
  `;

  const gameWindow = document.getElementById("game_window");
  if (gameWindow) {
    gameWindow.insertAdjacentElement("afterend", player);
  } else {
    document.body.appendChild(player);
  }

  // setup audio & logic
  const audio = getAudioElement();
  audio.volume = currentVolume;

  const playPauseBtn = document.getElementById("playPause");
  const prevBtn = document.getElementById("prevTrack");
  const nextBtn = document.getElementById("nextTrack");
  const volumeSlider = document.getElementById("volumeSlider");

  // play/pause
  playPauseBtn.addEventListener("click", () => {
    if (isCurrentYT && ytPlayer && isYTReady) {
      const state = ytPlayer.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        ytPlayer.pauseVideo();
        updatePlayPauseIcon(false);
      } else {
        ytPlayer.playVideo();
        updatePlayPauseIcon(true);
      }
    } else {
      if (audio.paused) {
        audio.play();
        updatePlayPauseIcon(true);
      } else {
        audio.pause();
        updatePlayPauseIcon(false);
      }
    }
  });

  // next/prev
  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playSongAtIndex();
  });

  // volume control
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseFloat(e.target.value);
    audio.volume = currentVolume;
    if (ytPlayer && isYTReady && ytPlayer.setVolume) {
      ytPlayer.setVolume(currentVolume * 100);
    }
  });

  // audio events
  audio.addEventListener("ended", () => {
    if (!isCurrentYT && !loopSong) {
      activePlaylist.playNext();
      playSongAtIndex();
    }
  });

  // initial play
  playSongAtIndex();
}

setupMusicPlayer();