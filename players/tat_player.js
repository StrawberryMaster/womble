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
        const updateButtonText = () => {
            pausePlay.innerHTML = audio.paused ? "<b>Play</b>" : "<b>Pause</b>";
        };

        audio.onplay = updateButtonText;
        audio.onpause = updateButtonText;

        // only update DOM if the song is playing
        const updateProgressUI = () => {
            if (audio.paused) return;
            positionDisplay.innerHTML = "<b>Time:</b> " + toTime(audio.currentTime);
            timeSlider.value = (audio.duration && !isNaN(audio.duration)) ? audio.currentTime / audio.duration : 0;
        };

        pausePlay.onclick = (e) => {
            e.preventDefault();
            if (audio.paused) {
                audio.play().catch(console.warn);
            } else {
                audio.pause();
            }
        };

        timeSlider.oninput = () => {
            if (audio.duration) {
                audio.currentTime = timeSlider.value * audio.duration;
                positionDisplay.innerHTML = "<b>Time:</b> " + toTime(audio.currentTime);
            }
        };

        volumeSlider.oninput = (e) => { audio.volume = e.target.value; };

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

        trackButtons.forEach((btn) => {
            btn.onchange = function () {
                audio.src = soundtracks[selectedSoundtrack].tracklist[this.value].url;
                audio.currentTime = 0;
                audio.play().catch(console.warn);
            };
        });

        // ensure source is valid before the first play
        if (currentSoundtrack.tracklist.length > 0) {
            const firstTrackUrl = currentSoundtrack.tracklist[0].url;
            if (audio.src !== firstTrackUrl) {
                audio.src = firstTrackUrl;
            }
            if (trackButtons.length) trackButtons[0].checked = true;
        }

        audio.loop = trackButtons.length === 1;

        audio.onended = () => {
            const selected = Number(document.querySelector('input[name="trackSelector"]:checked').value);
            const nextIdx = clamp(selected + 1, soundtracks[selectedSoundtrack].tracklist.length - 1, 0);
            trackButtons[nextIdx].checked = true;
            trackButtons[nextIdx].dispatchEvent(new Event('change'));
            songsPlayed++;
        };

        // initial sync
        updateButtonText();
        positionDisplay.innerHTML = "<b>Time:</b> " + toTime(audio.currentTime);
        timeSlider.value = (audio.duration && !isNaN(audio.duration)) ? audio.currentTime / audio.duration : 0;

        musicInterval = setInterval(updateProgressUI, 1000);
    };

    newMusicPlayer();
}

musicMode();
