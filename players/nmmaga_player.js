// This is a modified version of the music player
// used in the mod 2024: No More Maga.
campaignTrail_temp.musicOn = true;
campaignTrail_temp.selectedSoundtrack ??= 0;

const CUSTOM_PLAYER_STYLE_ID = "custom-music-player-style";

function ensureCustomMusicPlayerStyles() {
  if (document.getElementById(CUSTOM_PLAYER_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = CUSTOM_PLAYER_STYLE_ID;
  style.textContent = `
    #music_player.custom-player-box {
      display: flex !important;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: #161616;
      border: 5px solid #FFFFFF;
      border-radius: 10px;
      max-width: 900px;
      margin: auto;
      font-family: Arial, sans-serif;
      box-sizing: border-box;
    }

    #custom_player_wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    #album_cover {
      width: 150px;
      height: 150px;
      background: #ddd center / cover no-repeat;
      border: 3px solid #FFFFFF;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    #custom_player_details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 0;
    }

    #custom_player_info {
      margin-bottom: 10px;
      text-align: center;
      width: 100%;
    }

    #track_name {
      font-size: 28px !important;
      line-height: 1.2 !important;
      font-weight: bold;
      color: #fff;
      word-break: break-word;
    }

    #artist_name {
      font-size: 20px !important;
      line-height: 1.2 !important;
      color: #fff;
      word-break: break-word;
    }

    #custom_player_sliders {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 10px;
    }

    .custom-player-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .custom-player-row label {
      width: 70px;
      color: #fff !important;
      flex-shrink: 0;
    }

    #volume_slider,
    #progress_slider {
      width: 400px !important;
      max-width: 100%;
      flex: 1;
    }

    #custom_player_controls {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px;
    }

    #custom_player_controls button {
      padding: 5px 10px;
      font-size: 16px;
      cursor: pointer;
    }

    #track_dropdown {
      padding: 5px;
      font-size: 14px;
      margin-left: 10px;
      cursor: pointer;
      max-width: 100%;
    }
  `;
  document.head.appendChild(style);
}

function wrapIndex(index, length) {
  return length ? (index + length) % length : 0;
}

function hideOriginalMusicUI(musicBox) {
  if (!musicBox) return;

  Array.from(musicBox.children).forEach(child => {
    if (child.id !== "campaigntrailmusic" && child.id !== "custom_player_wrapper") {
      child.style.display = "none";
    }
  });

  document.getElementById("modLoadReveal")?.style.setProperty("display", "none");
  document.getElementById("modloaddiv")?.style.setProperty("display", "none");
}

function getCurrentTracklist() {
  return soundtracks[campaignTrail_temp.selectedSoundtrack]?.tracklist ?? [];
}

function newMusicPlayer() {
  const musicBox = document.getElementById("music_player");
  const audio = document.getElementById("campaigntrailmusic");

  if (!musicBox || !audio) {
    console.warn("music_player or campaigntrailmusic not found.");
    return;
  }

  ensureCustomMusicPlayerStyles();
  hideOriginalMusicUI(musicBox);
  musicBox.classList.add("custom-player-box");

  document.getElementById("custom_player_wrapper")?.remove();

  audio.preload = "metadata";

  const wrapper = document.createElement("div");
  wrapper.id = "custom_player_wrapper";
  wrapper.innerHTML = `
    <div id="album_cover"></div>

    <div id="custom_player_details">
      <div id="custom_player_info">
        <div id="track_name"></div>
        <div id="artist_name"></div>
      </div>

      <div id="custom_player_sliders">
        <div class="custom-player-row">
          <label for="volume_slider">Volume:</label>
          <input id="volume_slider" type="range" min="0" max="1" step="0.01">
        </div>

        <div class="custom-player-row">
          <label for="progress_slider">Progress:</label>
          <input id="progress_slider" type="range" min="0" max="1" step="0.001" value="0">
        </div>
      </div>

      <div id="custom_player_controls">
        <button id="prev_btn" type="button">Prev</button>
        <button id="play_pause_btn" type="button">Play</button>
        <button id="next_btn" type="button">Next</button>
        <select id="track_dropdown"></select>
      </div>
    </div>
  `;

  if (audio.parentNode === musicBox) {
    musicBox.insertBefore(wrapper, audio);
  } else {
    musicBox.appendChild(wrapper);
  }

  const cover = wrapper.querySelector("#album_cover");
  const titleEl = wrapper.querySelector("#track_name");
  const artistEl = wrapper.querySelector("#artist_name");
  const volumeSlider = wrapper.querySelector("#volume_slider");
  const progressSlider = wrapper.querySelector("#progress_slider");
  const prevBtn = wrapper.querySelector("#prev_btn");
  const playBtn = wrapper.querySelector("#play_pause_btn");
  const nextBtn = wrapper.querySelector("#next_btn");
  const dropdown = wrapper.querySelector("#track_dropdown");

  const tracks = getCurrentTracklist();

  if (!tracks.length) {
    titleEl.textContent = "No tracks available";
    artistEl.textContent = "";
    [volumeSlider, progressSlider, prevBtn, playBtn, nextBtn, dropdown].forEach(el => {
      el.disabled = true;
    });
    return;
  }

  const initialVolume = 0.2;
  volumeSlider.value = String(initialVolume);
  audio.volume = initialVolume;

  dropdown.innerHTML = tracks.map((track, i) =>
    `<option value="${i}">${track.name} - ${track.artist}</option>`
  ).join("");

  let currentIndex = 0;

  function setPlayButtonState(isPlaying) {
    campaignTrail_temp.musicOn = isPlaying;
    playBtn.textContent = isPlaying ? "Pause" : "Play";
  }

  function renderTrack(index) {
    const track = tracks[index];
    cover.style.backgroundImage = `url("${track.cover}")`;
    titleEl.textContent = track.name;
    artistEl.textContent = track.artist;
    dropdown.value = String(index);
  }

  function playAudio() {
    audio.play()
      .then(() => setPlayButtonState(true))
      .catch(() => setPlayButtonState(false));
  }

  function loadTrack(index, autoplay = true) {
    currentIndex = wrapIndex(index, tracks.length);
    const track = tracks[currentIndex];

    renderTrack(currentIndex);

    audio.src = track.url;
    audio.currentTime = 0;
    audio.loop = false;
    progressSlider.value = "0";

    if (autoplay) {
      playAudio();
    } else {
      audio.pause();
      setPlayButtonState(false);
    }
  }

  function syncProgress() {
    if (audio.duration) {
      progressSlider.value = String(audio.currentTime / audio.duration);
    } else {
      progressSlider.value = "0";
    }
  }

  prevBtn.addEventListener("click", () => {
    loadTrack(currentIndex - 1, true);
  });

  nextBtn.addEventListener("click", () => {
    loadTrack(currentIndex + 1, true);
  });

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
      setPlayButtonState(false);
    }
  });

  dropdown.addEventListener("change", e => {
    loadTrack(Number(e.target.value), true);
  });

  volumeSlider.addEventListener("input", e => {
    audio.volume = Number(e.target.value);
  });

  progressSlider.addEventListener("input", e => {
    if (audio.duration) {
      audio.currentTime = Number(e.target.value) * audio.duration;
    }
  });

  audio.ontimeupdate = syncProgress;
  audio.onloadedmetadata = syncProgress;
  audio.onplay = () => setPlayButtonState(true);
  audio.onpause = () => setPlayButtonState(false);
  audio.onended = () => loadTrack(currentIndex + 1, true);

  loadTrack(0, campaignTrail_temp.musicOn);
}

let soundtracks = [
  {
    name: "New Age for America",
    tracklist: [
      {
        name: "Band on the Run",
        artist: "Paul McCartney and Wings",
        url: "https://audio.jukehost.co.uk/WnUOlBu7wblrbE2t7xrWEmga8wxvnyBU",
        cover: "https://upload.wikimedia.org/wikipedia/en/f/f4/Paul_McCartney_%26_Wings-Band_on_the_Run_album_cover.jpg"
      },
      {
        name: "Float On",
        artist: "Modest Mouse",
        url: "https://audio.jukehost.co.uk/xBWzqPqn5w1sYDFwDBdRXzyrXzTRDSRt",
        cover: "https://upload.wikimedia.org/wikipedia/en/e/e4/Modest_Mouse-Float_on-_album_cover.jpg"
      },
      {
        name: "Without Me",
        artist: "Eminem",
        url: "https://audio.jukehost.co.uk/VZ3h9wEqzJvMLpCJVVg6Cd8Rredx2n32",
        cover: "https://upload.wikimedia.org/wikipedia/en/a/ad/Eminem_-_Without_Me_CD_cover.jpg"
      },
      {
        name: "Somebody Told Me",
        artist: "The Killers",
        url: "https://audio.jukehost.co.uk/GV8Wk2nHxsdHIBzv0qGI1x7dn8AlP6hc",
        cover: "https://upload.wikimedia.org/wikipedia/en/f/f5/Somebody-Told-Me.jpg"
      },
      {
        name: "Touch the Sky",
        artist: "Kanye West",
        url: "https://audio.jukehost.co.uk/CEecRaPUPQ1vgwAYsIhMRTBQ4qq4dmIF",
        cover: "https://upload.wikimedia.org/wikipedia/en/5/56/Kanyewest_touchthesky.jpg"
      },
      {
        name: "Toxic",
        artist: "Britney Spears",
        url: "https://audio.jukehost.co.uk/jNs50cdopNPtwODL9d03PdI86RD035OO",
        cover: "https://upload.wikimedia.org/wikipedia/en/2/21/Britney_Spears_Toxic.png"
      },
      {
        name: "Hey Ya!",
        artist: "OutKast",
        url: "https://audio.jukehost.co.uk/q6KIYkrSv3U2ztKRABuasRi5CTgY6OLk",
        cover: "https://upload.wikimedia.org/wikipedia/en/d/d8/Hey_Ya_single_cover.png"
      },
      {
        name: "Crazy in Love",
        artist: "Beyonce ft. Jay-Z",
        url: "https://audio.jukehost.co.uk/fldDyOS48lzKsTrxNOJW4WK87slysxep",
        cover: "https://upload.wikimedia.org/wikipedia/en/3/30/Beyonce_-_Crazy_in_Love_%28single%29.png"
      },
      {
        name: "Let's Get It Started",
        artist: "The Black Eyed Peas",
        url: "https://audio.jukehost.co.uk/AF9EOhX8IVkcQrpm0esKn6BHnm3ntLHk",
        cover: "https://upload.wikimedia.org/wikipedia/en/9/9f/LetsGetItStarted.jpg"
      },
      {
        name: "Take Me Out",
        artist: "Franz Ferdinand",
        url: "https://audio.jukehost.co.uk/OxTIUsaWHysTWKkpIad4YkqIrLigrrEj",
        cover: "https://upload.wikimedia.org/wikipedia/en/5/52/Franz_Ferdinand_-_Take_Me_Out.jpg"
      },
      {
        name: "Island in the Sun",
        artist: "Weezer",
        url: "https://audio.jukehost.co.uk/ND1w5K5F3lHGICbA9MsJgHFTU8gTJPVZ",
        cover: "https://upload.wikimedia.org/wikipedia/en/1/1d/Island_in_the_Sun_by_Weezer_Australian_single.png"
      }
    ]
  }
];

newMusicPlayer();
