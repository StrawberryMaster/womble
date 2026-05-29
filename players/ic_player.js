// This is a modified version of the music player
// used in the mod Infinite Carnage.
class Song {
  constructor(title, artist, coverLink, audioOrYouTube) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;

    // detect and parse YouTube IDs, otherwise treat as a standard audio link
    const ytMatch = audioOrYouTube?.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/
    );

    if (ytMatch) {
      this.youtubeId = ytMatch[1];
      this.audioLink = null;
    } else {
      this.youtubeId = null;
      this.audioLink = audioOrYouTube || null;
    }
  }

  getTitle() { return this.title; }
  getArtist() { return this.artist; }
  getCoverLink() { return this.coverLink; }
  getAudioLink() { return this.audioLink; }
  getYouTubeId() { return this.youtubeId; }
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

let playlist = null;
let currentPlaylistIndex = 0;
let isRepeat = false;

let ytApiReady = false;
let ytPlayer = null;
let ytPlayerReady = false;
let ytProgressTimer = null;
let ytAutoAdvancing = false;

(function injectYouTubeAPI() {
  if (document.getElementById("yt-iframe-api")) return;
  const tag = document.createElement("script");
  tag.id = "yt-iframe-api";
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
})();

window.onYouTubeIframeAPIReady = function () {
  ytApiReady = true;
};

const ASSETS = {
  bg: "https://file.garden/aZpOy1sRbiDb3nw_/AC%20File%20Change/musicplaerbackground.png",
  infoBg: "https://file.garden/aZpOy1sRbiDb3nw_/AC%20File%20Change/spotify.png",
  btnPlaylist: "https://file.garden/aZpOy1sRbiDb3nw_/AC%20File%20Change/shuffle.png",
  btnPrev: "https://file.garden/aZpOy1sRbiDb3nw_/AC%20File%20Change/back2.png",
  btnPlay: "https://file.garden/aZpOy1sRbiDb3nw_/AC%20File%20Change/play2.png",
  btnPause: "https://file.garden/aZpOy1sRbiDb3nw_/AC%20File%20Change/pause2.png",
  btnNext: "https://file.garden/aZpOy1sRbiDb3nw_/AC%20File%20Change/forward2.png",
  btnRepeat: "https://file.garden/aZpOy1sRbiDb3nw_/AC%20File%20Change/Repeat.png",
  volIcon: "https://file.garden/aZpOy1sRbiDb3nw_/AC%20File%20Change/volume2.png"
};

const allPlaylists = [
  [
    new Song("Little Dark Age", "MGMT", "https://i.imgur.com/d2ctDiz.png", "https://audio.jukehost.co.uk/LQF5RB2PrVcCeObaqQafC2FTwkysnWdT"),
    new Song("Arrest the President", "Ice Cube", "https://i.imgur.com/BBOMLln.png", "https://audio.jukehost.co.uk/c2cWOAnjSfzh2YI3OhW923cClDn3Iqic"),
    new Song("This is America", "Childish Gambino", "https://i.imgur.com/cBtRj9K.png", "https://audio.jukehost.co.uk/ZaGEkUEbz72UP4IMnC01mwSxwqX4gen6"),
    new Song("Troubled Times", "Green Day", "https://i.imgur.com/unNGqOH.png", "https://audio.jukehost.co.uk/CeVuU7lokNQcuzCWWR2cJ6I6qJuSffzT"),
    new Song("Is This the Life We Really Want", "Roger Waters", "https://i.imgur.com/3NCgTGN.png", "https://audio.jukehost.co.uk/ng58tjZYGQSrNKrGgmH5pFp4wobiaUPe"),
    new Song("The Kids are Alt-Right", "Bad Religion", "https://i.imgur.com/KzlAiiO.png", "https://audio.jukehost.co.uk/f9HDWEKzRO8NtI5ePOLgh0Nn6pz4nXmQ"),
    new Song("Vigilante Man", "Glen Hansard", "https://i.imgur.com/SvUzGQH.png", "https://audio.jukehost.co.uk/MasC7udHqmabHGNLCJdlD9sSHIx9gpnV"),
    new Song("Real American", "Rick Derringer", "https://i.imgur.com/CalYXXW.png", "https://audio.jukehost.co.uk/5aZ2PQqoNvJN2kPuLCaOoGSHmkmI95lk"),
    new Song("You Want It Darker", "Leonard Cohen", "https://i.imgur.com/rBk8DKk.png", "https://youtu.be/v0nmHymgM7Y?list=RDv0nmHymgM7Y"),
    new Song("Nobody Speak", "DJ Shadow ft. Run the Jewels", "https://i.imgur.com/wxFvBIm.png", "https://youtu.be/8gJ3HzBbdxI?list=RD8gJ3HzBbdxI"),
    new Song("Let Me Out", "Gorillaz", "https://i.imgur.com/NRjqwCZ.png", "https://youtu.be/1dONxX9rifs?list=RD1dONxX9rifs"),
    new Song("45\n(A Matter of Time)", "Sum 41", "https://i.imgur.com/Vk6p3wJ.png", "https://youtu.be/EHVm2rXv0OE?list=RDEHVm2rXv0OE"),
    new Song("March March", "The Chicks", "https://i.imgur.com/UgKgJMH.png", "https://youtu.be/KYCzDiVSems?list=PLKfqhS8sZngzG3JtCMPmoG4xEeB1ACrjU"),
    new Song("Forty Five", "Surfbot", "https://i.imgur.com/TKEdl4t.png", "https://youtu.be/TUo8vt_Ye_g?list=RDTUo8vt_Ye_g"),
    new Song("The Man", "The Killers", "https://i.imgur.com/ctzC6N1.png", "https://youtu.be/D-pwB753qJM?list=RDD-pwB753qJM")
  ]
];

function isYouTubeSong(song) {
  return !!song?.getYouTubeId?.();
}

function getScaledVolume(volumeStep) {
  const normalized = volumeStep / 9;
  return Math.pow(normalized, 3);
}

function stopYTProgressPump() {
  if (ytProgressTimer) {
    clearInterval(ytProgressTimer);
    ytProgressTimer = null;
  }
}

function startYTProgressPump(progressBar) {
  stopYTProgressPump();
  ytProgressTimer = setInterval(() => {
    if (!progressBar) return;
    const duration = backendGetDuration();
    const current = backendGetCurrentTime();
    const progress = duration > 0 ? (current / duration) * 100 : 0;
    progressBar.value = progress;
    progressBar.style.background =
      `linear-gradient(to right, #16893f ${progress}%, #ddd ${progress}%)`;
  }, 250);
}

function syncYTVolumeFromSlider() {
  const volumeSlider = document.getElementById("volumeSlider");
  if (!volumeSlider || !ytPlayer) return;

  const volumeStep = parseInt(volumeSlider.value, 10);
  const scaled = getScaledVolume(volumeStep);

  ytPlayer.setVolume(Math.round(scaled * 100));
  if (scaled === 0) ytPlayer.mute();
  else ytPlayer.unMute();
}

function ensureYTPlayer(onReady) {
  const createPlayer = () => {
    if (ytPlayer) {
      onReady?.();
      return;
    }

    const holder = document.getElementById("ytplayer") || (() => {
      const el = document.createElement("div");
      el.id = "ytplayer";
      el.style.width = "0px";
      el.style.height = "0px";
      el.style.position = "absolute";
      el.style.overflow = "hidden";
      el.style.pointerEvents = "none";
      document.body.appendChild(el);
      return el;
    })();

    ytPlayer = new YT.Player(holder, {
      height: "0",
      width: "0",
      videoId: "",
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        playsinline: 1
      },
      events: {
        onReady: () => {
          ytPlayerReady = true;
          syncYTVolumeFromSlider();
          onReady?.();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) {
            ytAutoAdvancing = true;
            window._spotifyOnYTEnded?.();
          }
          if (e.data === YT.PlayerState.PLAYING && ytAutoAdvancing) {
            syncYTVolumeFromSlider();
            ytAutoAdvancing = false;
          }
        }
      }
    });
  };

  if (!ytApiReady || !window.YT || !window.YT.Player) {
    const timer = setInterval(() => {
      if (ytApiReady && window.YT && window.YT.Player) {
        clearInterval(timer);
        createPlayer();
      }
    }, 50);
  } else {
    createPlayer();
  }
}

function backendSetSrcAndLoad(song, audio, progressBar) {
  if (!song) return;

  if (isYouTubeSong(song)) {
    ensureYTPlayer(() => {
      const id = song.getYouTubeId();
      if (ytAutoAdvancing) {
        try { ytPlayer.mute(); } catch (e) {}
        ytPlayer?.loadVideoById?.(id);
      } else {
        ytPlayer?.loadVideoById?.(id);
        syncYTVolumeFromSlider();
      }
      if (progressBar) startYTProgressPump(progressBar);
    });

    audio.pause();
    audio.src = "";
    audio.load();
  } else {
    stopYTProgressPump();
    if (ytPlayer) ytPlayer.stopVideo?.();
    audio.src = song.getAudioLink() || "";
    audio.load();
  }
}

function backendPlay(audio) {
  const song = playlist?.getCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ensureYTPlayer(() => {
      ytPlayer?.playVideo?.();
    });
  } else {
    audio.play().catch(e => console.log("Direct playback deferred for user interaction.", e));
  }
}

function backendPause(audio) {
  const song = playlist?.getCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ytPlayer?.pauseVideo?.();
  } else {
    audio.pause();
  }
}

function backendSetVolume(audio, volume) {
  audio.volume = volume;
  const song = playlist?.getCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    ytPlayer.setVolume(Math.round(volume * 100));
    if (volume === 0) ytPlayer.mute();
    else ytPlayer.unMute();
  }
}

function backendGetCurrentTime() {
  const song = playlist?.getCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    return ytPlayer.getCurrentTime?.() || 0;
  }
  const audio = document.getElementById("audio");
  return audio ? audio.currentTime || 0 : 0;
}

function backendGetDuration() {
  const song = playlist?.getCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    return ytPlayer.getDuration?.() || 0;
  }
  const audio = document.getElementById("audio");
  return audio ? audio.duration || 0 : 0;
}

function backendSeekTo(seconds) {
  const song = playlist?.getCurrentSong();
  const audio = document.getElementById("audio");
  if (isYouTubeSong(song) && ytPlayer) {
    ytPlayer.seekTo(seconds, true);
  } else if (audio && audio.duration > 0) {
    audio.currentTime = seconds;
  }
}

function updateUI(activePlaylist) {
  const currentSong = activePlaylist.getCurrentSong();
  const player = document.getElementById("player");
  if (!player || !currentSong) return;

  player.querySelector("#cover").src = currentSong.getCoverLink() || "";
  player.querySelector("#title").textContent = currentSong.getTitle();
  player.querySelector("#artist").textContent = currentSong.getArtist();
}
window.updateUI = updateUI;

function changePlaylist(newPlaylist) {
  playlist = newPlaylist;
  playlist.currentSongIndex = 0;
  updateUI(playlist);

  const audio = document.getElementById("audio");
  const progressBar = document.getElementById("progress-bar");
  const playPauseButton = document.getElementById("playPauseButton");

  if (audio && progressBar) {
    backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
    backendPlay(audio);
    if (playPauseButton) playPauseButton.src = ASSETS.btnPause;
  }
}
window.changePlaylist = changePlaylist;

function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) return;
  if (document.getElementById("player")) return;

  isRepeat = localStorage.getItem("IC_repeat_mode") === "true";
  currentPlaylistIndex = parseInt(localStorage.getItem("IC_selected_playlist") || "0", 10);
  const savedSongIndex = parseInt(localStorage.getItem("IC_selected_song") || "0", 10);
  const savedVolume = localStorage.getItem("IC_music_volume");
  const initialVolume = savedVolume !== null ? parseInt(savedVolume, 10) : 1;

  playlist = new Playlist();
  allPlaylists[currentPlaylistIndex].forEach(data => playlist.addSong(data));
  playlist.currentSongIndex = (savedSongIndex >= 0 && savedSongIndex < playlist.songs.length) ? savedSongIndex : 0;

  const style = document.createElement("style");
  style.textContent = `
    #player {
      border: 3px solid #C9C9C9;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 191px;
      background-image: url("${ASSETS.bg}");
      font-family: sans-serif;
    }
    #display-box {
      display: flex;
      align-items: center;
      width: 50%;
    }
    #cover {
      width: 176px;
      height: 176px;
      object-fit: cover;
    }
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
    #song-info {
      width: 100%;
      padding: 5px;
      box-sizing: border-box;
    }
    #title {
      font-weight: normal;
      white-space: pre-line;
      margin: 10px 2px;
      font-size: 14px;
    }
    #artist {
      margin: 0;
      font-size: 11px;
      margin: auto 2px;
      opacity: 0.8;
    }
    #controls-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
      width: 100%;
      padding-bottom: 3%;
    }
    #controls {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 80%;
      gap: 5px;
    }
    #controls img {
      cursor: pointer;
      transition: opacity 0.1s;
    }
    #controls img:hover {
      opacity: 0.8;
    }
    #progress-bar-container {
      width: 100%;
    }
    #progress-bar {
      width: 80%;
      margin: 20px auto 0 auto;
      display: flex;
      height: 10px;
      background: #ddd;
      border-radius: 5px;
      appearance: none;
      cursor: pointer;
      background-image: linear-gradient(to right, #16893f 0%, #ddd 0%);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: relative;
    }
    #progress-bar::-webkit-slider-thumb {
      appearance: none;
      height: 14px;
      width: 14px;
      border-radius: 50%;
      background: #767676;
      margin-top: -1px;
      border: none;
      box-shadow: none;
    }
    #progress-bar::-moz-range-thumb {
      height: 14px;
      width: 14px;
      border-radius: 50%;
      background: #767676;
      border: none;
      box-shadow: none;
    }
    #volume-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    #volume-slider-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 126px;
      margin-top: auto;
    }
    #volumeSlider {
      appearance: none;
      transform: rotate(-90deg);
      height: 10px;
      width: 100px;
      background: #ddd;
      border-radius: 5px;
      cursor: pointer;
      background-image: linear-gradient(to right, #16893f 0%, #ddd 0%);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      margin: 0;
      padding: 0;
    }
    #volumeSlider::-webkit-slider-thumb {
      appearance: none;
      height: 14px;
      width: 14px;
      border-radius: 50%;
      background: #767676;
      border: none;
      margin-top: -1px;
    }
    #volumeSlider::-moz-range-thumb {
      height: 14px;
      width: 14px;
      border-radius: 50%;
      background: #767676;
      border: none;
    }
  `;
  document.head.appendChild(style);

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
        <img id="playlistSwitcher" src="${ASSETS.btnPlaylist}" style="height: 49px; margin-right: 15px;" alt="Playlist">
        <img id="prevButton" src="${ASSETS.btnPrev}" alt="Prev">
        <img id="playPauseButton" src="${ASSETS.btnPause}" alt="Play/Pause">
        <img id="nextButton" src="${ASSETS.btnNext}" alt="Next">
        <img id="repeatButton" src="${ASSETS.btnRepeat}" style="height: 49px; margin-left: 15px" alt="Repeat">
      </div>
      <div id="progress-bar-container">
        <input type="range" id="progress-bar" min="0" max="100" value="0" step="0.1">
      </div>
    </div>
    <div id="volume-container">
      <img src="${ASSETS.volIcon}" alt="Volume">
      <div id="volume-slider-container">
        <input type="range" id="volumeSlider" min="0" max="9" step="1">
      </div>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  const playPauseButton = document.getElementById("playPauseButton");
  const playlistSwitcher = document.getElementById("playlistSwitcher");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const repeatButton = document.getElementById("repeatButton");
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volumeSlider");

  const audio = document.createElement("audio");
  audio.id = "audio";
  document.body.appendChild(audio);

  volumeSlider.value = initialVolume;
  const initialVolumePercent = (initialVolume / 9) * 100;
  volumeSlider.style.background = `linear-gradient(to right, #16893f ${initialVolumePercent}%, #ddd ${initialVolumePercent}%)`;
  audio.volume = getScaledVolume(initialVolume);

  repeatButton.style.opacity = isRepeat ? "0.5" : "1.0";

  window._spotifyOnYTEnded = function () {
    if (isRepeat) {
      backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
      backendPlay(audio);
      playPauseButton.src = ASSETS.btnPause;
    } else {
      playlist.playNext();
      updateUI(playlist);
      backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
      backendPlay(audio);
      playPauseButton.src = ASSETS.btnPause;
      localStorage.setItem("IC_selected_song", playlist.currentSongIndex);
    }
  };

  audio.addEventListener("timeupdate", () => {
    const duration = backendGetDuration();
    const current = backendGetCurrentTime();
    const progress = duration > 0 ? (current / duration) * 100 : 0;
    progressBar.value = progress;
    progressBar.style.background = `linear-gradient(to right, #16893f ${progress}%, #ddd ${progress}%)`;
  });

  audio.addEventListener("ended", () => {
    window._spotifyOnYTEnded();
  });

  progressBar.addEventListener("input", () => {
    const duration = backendGetDuration();
    const seekTime = (progressBar.value / 100) * duration;
    backendSeekTo(seekTime);
  });

  volumeSlider.addEventListener("input", () => {
    const volumeStep = parseInt(volumeSlider.value, 10);
    const scaled = getScaledVolume(volumeStep);
    backendSetVolume(audio, scaled);

    const percent = (volumeStep / 9) * 100;
    volumeSlider.style.background = `linear-gradient(to right, #16893f ${percent}%, #ddd ${percent}%)`;
    localStorage.setItem("IC_music_volume", volumeStep);
  });

  playPauseButton.addEventListener("click", () => {
    const song = playlist.getCurrentSong();
    let isPaused = true;

    if (isYouTubeSong(song)) {
      const state = ytPlayer?.getPlayerState?.();
      isPaused = !(state === YT.PlayerState.PLAYING);
    } else {
      isPaused = audio.paused;
    }

    if (isPaused) {
      backendPlay(audio);
      playPauseButton.src = ASSETS.btnPause;
    } else {
      backendPause(audio);
      playPauseButton.src = ASSETS.btnPlay;
    }
  });

  prevButton.addEventListener("click", () => {
    playlist.playPrevious();
    updateUI(playlist);
    backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
    backendPlay(audio);
    playPauseButton.src = ASSETS.btnPause;
    localStorage.setItem("IC_selected_song", playlist.currentSongIndex);
  });

  nextButton.addEventListener("click", () => {
    playlist.playNext();
    updateUI(playlist);
    backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
    backendPlay(audio);
    playPauseButton.src = ASSETS.btnPause;
    localStorage.setItem("IC_selected_song", playlist.currentSongIndex);
  });

  playlistSwitcher.addEventListener("click", () => {
    currentPlaylistIndex = (currentPlaylistIndex + 1) % allPlaylists.length;
    playlist = new Playlist();
    allPlaylists[currentPlaylistIndex].forEach(data => playlist.addSong(data));
    playlist.currentSongIndex = 0;

    updateUI(playlist);
    backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
    backendPlay(audio);
    playPauseButton.src = ASSETS.btnPause;

    localStorage.setItem("IC_selected_playlist", currentPlaylistIndex);
    localStorage.setItem("IC_selected_song", 0);
  });

  repeatButton.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatButton.style.opacity = isRepeat ? "0.5" : "1.0";
    localStorage.setItem("IC_repeat_mode", isRepeat);
  });

  updateUI(playlist);
  backendSetSrcAndLoad(playlist.getCurrentSong(), audio, progressBar);
  backendPlay(audio);
}

setupMusicPlayer();
