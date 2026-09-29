// This is a modified version of the music player
// used in the mod The Apple Trail.
var selectedSoundtrack = 0;
var soundtracks = {
    0: {
        name: "Apple \'76",
        tracklist: [
            {
                "name": "Bob Dylan - One Too Many Mornings",
                "url": "https://file.garden/aTSzLyzGbgwzK-kK/Apple/One%20Too%20Many%20Mornings.ogg"
            },
            {
                "name": "Bob Dylan - The Times They Are A-Changin'",
                "url": "https://file.garden/aTSzLyzGbgwzK-kK/Apple/The%20Times%20They%20Are%20A-Changin'.ogg"
            }
        ]
    },
};

// YouTube URL support
let ytApiReady = false;
let ytPlayer = null;
let ytPlayerReady = false;
let ytConstructing = false;
let ytReadyPending = false;
let ytProgressTimer = null;
let backendVolume = 1;

const ytHooks = {
  onEnded: null,
  onProgress: null
};

const ytCallbacks = [];

function flushYTCallbacks() {
  while (ytCallbacks.length) {
    const cb = ytCallbacks.shift();
    try {
      cb?.();
    } catch (e) {
      console.log("YouTube player callback failed.", e);
    }
  }
}

function extractYouTubeId(url) {
  if (typeof url !== "string") return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

function isYouTubeSong(song) {
  return !!song?.getYouTubeId?.();
}

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

function applyVolumeToYT() {
  if (!ytPlayer) return;
  try {
    ytPlayer.setVolume(Math.round(backendVolume * 100));
    if (backendVolume === 0) ytPlayer.mute();
    else ytPlayer.unMute();
  } catch (e) {}
}

function ensureYTPlayer(onReady) {
  if (onReady) ytCallbacks.push(onReady);
  if (ytPlayer && ytPlayerReady) {
    flushYTCallbacks();
    return;
  }
  if (ytConstructing) return;

  const createPlayer = () => {
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

    ytConstructing = true;
    try {
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
            if (ytConstructing) {
              ytReadyPending = true;
              return;
            }
            ytPlayerReady = true;
            applyVolumeToYT();
            flushYTCallbacks();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) {
              ytHooks.onEnded?.();
            }
            if (e.data === YT.PlayerState.PLAYING) {
              applyVolumeToYT();
            }
          }
        }
      });
    } catch (e) {
      ytConstructing = false;
      console.log("Could not create the YouTube player.", e);
      return;
    }
    ytConstructing = false;

    if (ytReadyPending) {
      ytReadyPending = false;
      ytPlayerReady = true;
      applyVolumeToYT();
      flushYTCallbacks();
    }
  };

  if (ytApiReady && window.YT && window.YT.Player) {
    createPlayer();
  } else {
    const timer = setInterval(() => {
      if (ytApiReady && window.YT && window.YT.Player) {
        clearInterval(timer);
        createPlayer();
      }
    }, 50);
  }
}

function stopYTProgressPump() {
  if (ytProgressTimer) {
    clearInterval(ytProgressTimer);
    ytProgressTimer = null;
  }
}

function startYTProgressPump() {
  stopYTProgressPump();
  ytProgressTimer = setInterval(() => {
    ytHooks.onProgress?.(backendGetCurrentTime(), backendGetDuration());
  }, 250);
}

function backendSetSrcAndLoad(song, audio) {
  if (!song) return;

  if (isYouTubeSong(song)) {
    stopYTProgressPump();
    ensureYTPlayer(() => {
      ytPlayer.loadVideoById(song.getYouTubeId());
      applyVolumeToYT();
    });
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  } else {
    stopYTProgressPump();
    if (ytPlayer) {
      try { ytPlayer.stopVideo(); } catch (e) {}
    }
    audio.src = song.getAudioLink() || "";
    audio.load();
  }
}

function backendPlay(audio) {
  const song = ytCurrentSong();
  if (!song) return Promise.resolve();

  if (isYouTubeSong(song)) {
    return new Promise((resolve) => {
      ensureYTPlayer(() => {
        ytPlayer.playVideo();
        resolve();
      });
    });
  }

  return audio.play().catch(e => {
    console.log("Playback deferred for user interaction.", e);
  });
}

function backendPause(audio) {
  const song = ytCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ytPlayer?.pauseVideo?.();
  } else {
    audio.pause();
  }
}

function backendSetVolume(audio, volume) {
  backendVolume = volume;
  audio.volume = volume;
  if (isYouTubeSong(ytCurrentSong())) applyVolumeToYT();
}

function backendGetCurrentTime() {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) return ytPlayer.getCurrentTime?.() || 0;
  const audio = ytAudioElement();
  return audio ? audio.currentTime || 0 : 0;
}

function backendGetDuration() {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) return ytPlayer.getDuration?.() || 0;
  const audio = ytAudioElement();
  return audio ? audio.duration || 0 : 0;
}

function backendSeekTo(seconds) {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    ytPlayer.seekTo(seconds, true);
  } else {
    const audio = ytAudioElement();
    if (audio && Number.isFinite(audio.duration)) audio.currentTime = seconds;
  }
}

let tatCurrentTrackIndex = 0;

function tatCurrentSong() {
    const list = (soundtracks[selectedSoundtrack] || {}).tracklist || [];
    const track = list[tatCurrentTrackIndex] || list[0];
    if (!track) return null;

    const youtubeId = extractYouTubeId(track.url);
    return {
        title: track.name,
        youtubeId: youtubeId,
        getYouTubeId: () => youtubeId,
        getAudioLink: () => (youtubeId ? null : track.url)
    };
}

function ytCurrentSong() { return tatCurrentSong(); }
function ytAudioElement() { return document.getElementById("campaigntrailmusic"); }

function musicMode() {
    songsPlayed = 0;
    let musicInterval = null;

    const musicBox = document.getElementById("music_player");
    const footer = document.querySelector(".footer");

    // prepend to footer once
    if (footer && musicBox) {
        footer.prepend(musicBox);
    }

    musicBox.style.display = "";
    // hide default children
    Array.from(musicBox.children).forEach(child => child.style.display = "none");

    document.getElementById("modLoadReveal").style.display = "none";
    document.getElementById("modloaddiv").style.display = "none";

    const audio = document.getElementById("campaigntrailmusic");

    const toTime = (seconds) => {
        const date = new Date(null);
        date.setSeconds(seconds || 0);
        return date.toISOString().substring(11, 19);
    };

    const clamp = (a, max, min, overflow = true) =>
        overflow ? (a > max ? min : a < min ? max : a) : Math.min(max, Math.max(min, a));

    const createEl = (tag, props = {}, styles = {}) => {
        const el = document.createElement(tag);
        Object.assign(el, props);
        Object.assign(el.style, styles);
        return el;
    };

    this.newMusicPlayer = function () {
        const existing = document.getElementById("trackSelParent");
        if (existing) existing.remove();
        if (musicInterval) clearInterval(musicInterval);

        // batch DOM updates
        const fragment = document.createDocumentFragment();
        const trackSel = createEl("div", { id: "trackSelParent" });
        const container = createEl("div", {}, {
            display: "flex", gap: "0px", justifyContent: "center", alignItems: "stretch"
        });

        // track list
        const trackListDiv = createEl("div", { id: "trackSel" }, {
            textAlign: "left", borderStyle: "solid", borderWidth: "1px",
            overflowY: "scroll", overflowX: "hidden", height: "170px",
            width: "350px", backgroundColor: "#FFFFFF", boxShadow: "2px 2px #000",
            padding: "10px", boxSizing: "border-box"
        });

        const currentSoundtrack = soundtracks[selectedSoundtrack];
        let dropdownHTML = `<b><select id="selectSoundtrack">`;
        dropdownHTML += `<option value="${currentSoundtrack.name}">${currentSoundtrack.name}</option>`;
        for (let i in soundtracks) {
            if (i != selectedSoundtrack) {
                dropdownHTML += `<option value="${soundtracks[i].name}">${soundtracks[i].name}</option>`;
            }
        }
        dropdownHTML += `</select></b><br><br>`;

        currentSoundtrack.tracklist.forEach((track, i) => {
            dropdownHTML += `<label><input class="trackSelector" type="radio" name="trackSelector" value="${i}">${track.name}</label><br>`;
        });
        trackListDiv.innerHTML = dropdownHTML;

        // controls
        const controlsDiv = createEl("div", {}, {
            textAlign: "left", borderStyle: "solid", borderWidth: "1px",
            height: "170px", width: "220px", backgroundColor: "#FFFFFF",
            boxShadow: "2px 2px #000", padding: "10px", boxSizing: "border-box",
            display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px"
        });

        const pausePlay = createEl("button", {}, {
            width: "100%",
            marginBottom: "0.5em"
        });

        const positionDisplay = createEl("span", { id: "position-display" });
        const timeSlider = createEl("input", {
            type: "range", min: 0, max: 1, step: 0.001, value: 0, id: "time-slider"
        }, { width: "100%" });

        const volumeSlider = createEl("input", {
            type: "range", min: 0, max: 1, step: 0.001, value: audio.volume, id: "volume-slider"
        }, { width: "100%" });

        // sync logic
        const isCurrentPlaying = () => {
            if (isYouTubeSong(ytCurrentSong())) {
                return window.YT?.PlayerState
                    ? ytPlayer?.getPlayerState?.() === YT.PlayerState.PLAYING
                    : false;
            }
            return !audio.paused;
        };

        const updateButtonText = () => {
            pausePlay.innerHTML = isCurrentPlaying() ? "<b>Pause</b>" : "<b>Play</b>";
        };

        audio.onplay = updateButtonText;
        audio.onpause = updateButtonText;

        // only update DOM if the song is playing
        const updateProgressUI = () => {
            if (!isCurrentPlaying()) return;
            const current = backendGetCurrentTime();
            const duration = backendGetDuration();
            positionDisplay.innerHTML = "<b>Time:</b> " + toTime(current);
            timeSlider.value = (duration && !isNaN(duration)) ? current / duration : 0;
        };

        pausePlay.onclick = (e) => {
            e.preventDefault();
            if (isCurrentPlaying()) {
                backendPause(audio);
                updateButtonText();
            } else {
                backendPlay(audio).then(updateButtonText, updateButtonText);
            }
        };

        timeSlider.oninput = () => {
            const duration = backendGetDuration();
            if (duration) {
                backendSeekTo(timeSlider.value * duration);
                positionDisplay.innerHTML = "<b>Time:</b> " + toTime(backendGetCurrentTime());
            }
        };

        volumeSlider.oninput = (e) => { backendSetVolume(audio, e.target.value); };

        // assemble
        controlsDiv.append(pausePlay, positionDisplay, timeSlider, createEl("span", { innerHTML: "<b>Volume:</b>" }), volumeSlider);
        container.append(trackListDiv, controlsDiv);
        trackSel.appendChild(container);
        fragment.appendChild(trackSel);
        musicBox.appendChild(fragment);

        const trackButtons = trackListDiv.querySelectorAll(".trackSelector");

        document.getElementById("selectSoundtrack").onchange = function () {
            for (let i in soundtracks) {
                if (soundtracks[i].name === this.value) { selectedSoundtrack = i; break; }
            }
            newMusicPlayer();
        };

        const loadTrack = (index) => {
            const track = soundtracks[selectedSoundtrack].tracklist[index];
            if (!track) return;

            tatCurrentTrackIndex = index;
            backendSetSrcAndLoad(tatCurrentSong(), audio);
            startYTProgressPump();
            backendPlay(audio).then(updateButtonText, updateButtonText);
        };

        trackButtons.forEach((btn) => {
            btn.onchange = function () {
                loadTrack(Number(this.value));
            };
        });

        ytHooks.onEnded = () => {
            const list = soundtracks[selectedSoundtrack].tracklist;
            if (list.length <= 1) {
                loadTrack(0);
                return;
            }
            advanceToNextTrack();
        };

        ytHooks.onProgress = () => updateProgressUI();

        // ensure source is valid before the first play
        if (currentSoundtrack.tracklist.length > 0) {
            const firstTrack = currentSoundtrack.tracklist[0];
            if (trackButtons.length) trackButtons[0].checked = true;
            tatCurrentTrackIndex = 0;
            if (isYouTubeSong(tatCurrentSong())) {
                backendSetSrcAndLoad(tatCurrentSong(), audio);
                startYTProgressPump();
            } else if (audio.src !== firstTrack.url) {
                backendSetSrcAndLoad(tatCurrentSong(), audio);
            }
        }

        audio.loop = trackButtons.length === 1;

        const advanceToNextTrack = () => {
            const selected = Number(document.querySelector('input[name="trackSelector"]:checked').value);
            const nextIdx = clamp(selected + 1, soundtracks[selectedSoundtrack].tracklist.length - 1, 0);
            trackButtons[nextIdx].checked = true;
            trackButtons[nextIdx].dispatchEvent(new Event('change'));
            songsPlayed++;
        };

        audio.onended = advanceToNextTrack;

        // initial sync
        updateButtonText();
        positionDisplay.innerHTML = "<b>Time:</b> " + toTime(backendGetCurrentTime());
        const initialDuration = backendGetDuration();
        timeSlider.value = (initialDuration && !isNaN(initialDuration)) ? backendGetCurrentTime() / initialDuration : 0;

        musicInterval = setInterval(updateProgressUI, 1000);
    };

    newMusicPlayer();
}

musicMode();
