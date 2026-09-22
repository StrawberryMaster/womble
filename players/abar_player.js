// This is a modified version of the music player
// used in the mod A Billionaire, A Revolutionary.
(function () {
    const SONGS_DATA = [
        { title: "I Fought The Law", artist: "The Clash", coverLink: "https://upload.wikimedia.org/wikipedia/en/0/0d/CostofLivingEP.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original", videoIds: ["AL8chWFuM-s"] }, 
        { title: "Youth of America", artist: "Birdbrain", coverLink: "https://upload.wikimedia.org/wikipedia/en/d/dd/Let%27s_Be_Nice.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original", videoIds: ["MCp5ior44dA"] }, 
        { title: "Out of Touch", artist: "Daryl Hall & John Oates", coverLink: "https://upload.wikimedia.org/wikipedia/en/2/20/Daryl_Hall_%26_John_Oates_-_Big_Bam_Boom.png?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original", videoIds: ["DCkJ5lGPqFs"] }, 
        { title: "Hooked on America", artist: "Royal Philharmonic Orchestra", coverLink: "https://file.garden/aPF6sdg4jk-629YB/Screenshot%202026-08-07%20094848.png", videoIds: ["3pj2Pd6T3uA"] }, 
        { title: "The Humbling River", artist: "Puscifer", coverLink: "https://upload.wikimedia.org/wikipedia/en/5/54/C_Is_for_%28Please_Insert_Sophomoric_Genitalia_Reference_Here%29.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original", videoIds: ["siWusSBld7k"] }, 
        { title: "We Didn't Start The Fire", artist: "Billy Joel", coverLink: "https://upload.wikimedia.org/wikipedia/en/4/45/BillyJoel_StormFront.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original", videoIds: ["eFTLKWw542g"] }, 
        { title: "Golden Eagle", artist: "AJJ", coverLink: "https://upload.wikimedia.org/wikipedia/en/a/a4/The_Bible_2.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original", videoIds: ["GmnnQ0M0tlw"] }, 
        { title: "Baby I'm Yours", artist: "Breakbot", coverLink: "https://upload.wikimedia.org/wikipedia/en/0/00/Baby_I%27m_Yours_%28Breakbot_song%29.jpg?utm_source=en.wikipedia.org&utm_campaign=imageinfo&utm_content=original", videoIds: ["6okxuiiHx2w"] }, 
        { title: "Resonance", artist: "Home", coverLink: "https://t2.genius.com/unsafe/275x275/https%3A%2F%2Fimages.genius.com%2F219e03edd52f8fc70803bc40b7297b8d.1000x1000x1.jpg", videoIds: ["8GW6sLrK40k"] }
    ];

    const YOUTUBE_PLAYER_DIV_ID = 'youtube-player-div';
    const PLAYER_CONTAINER_ID = 'musicPlayerContainer';
    const YOUTUBE_API_URL = 'https://www.youtube.com/iframe_api';
    const RECENT_TRACKS_COUNT = 3;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const SVG_ICONS = {
        play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
        pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
        prev: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>',
        next: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>',
        shuffle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>',
        repeat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>',
        volHigh: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
        volLow: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>',
        volMute: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>'
    };

    let ytPlayer = null;
    let playlist = null;
    let recentTracks = [];
    let currentVolume = 40;
    let isMuted = false;
    let isShuffle = false;
    let isRepeat = false;

    let playButton, nextButton, prevButton, shuffleButton, repeatButton, volumeButton;
    let songTitleElement, artistElement, coverElement, progressElement, volumeSliderElement;
    let currentTimeSpan, durationSpan;

    let isUpdaterRunning = false;
    let isSeeking = false;
    let rafId = null;
    let lastRafUpdateTime = 0;
    let cachedDuration = 0;

    let lastRenderedTitle = "";
    let lastRenderedArtist = "";
    let lastRenderedCover = "";
    let lastPlayState = null;
    let lastRenderedTimeText = "0:00";
    let lastRenderedDurationText = "0:00";
    let lastProgressRatio = -1;
    let lastDurationMax = -1;

    class Song {
        constructor(title, artist, coverLink, videoIds) {
            this.title = title;
            this.artist = artist;
            this.coverLink = coverLink;
            this.videoIds = Array.isArray(videoIds) ? videoIds : [videoIds];
            this.currentVideoIndex = 0;
        }
        getNextVideoId() {
            const id = this.videoIds[this.currentVideoIndex];
            this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videoIds.length;
            return id;
        }
        getVideoId() {
            return this.videoIds[this.currentVideoIndex];
        }
    }

    class Playlist {
        constructor(songs) {
            this.songs = songs;
            this.currentSongIndex = 0;
        }
        getCurrentSong() { return this.songs[this.currentSongIndex]; }
        nextSong() {
            if (isShuffle && this.songs.length > 1) {
                let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * this.songs.length);
                } while (nextIndex === this.currentSongIndex);
                this.currentSongIndex = nextIndex;
            } else {
                this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
            }
            return this.getCurrentSong();
        }
        prevSong() {
            if (isShuffle && this.songs.length > 1) {
                let prevIndex;
                do {
                    prevIndex = Math.floor(Math.random() * this.songs.length);
                } while (prevIndex === this.currentSongIndex);
                this.currentSongIndex = prevIndex;
            } else {
                this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
            }
            return this.getCurrentSong();
        }
        setCurrentSongIndex(index) {
            this.currentSongIndex = index;
            updateUI();
        }
    }

    function extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    }

    window.playEndingSong = (title, artist, cover, url) => {
        if (!ytPlayer) return;
        const videoId = extractYouTubeId(url);
        playlist = new Playlist([new Song(title, artist, cover, [videoId])]);
        playlist.setCurrentSongIndex(0);
        loadCurrentSong(true);
    };

    function formatTime(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) return "0:00";
        const total = totalSeconds | 0;
        const min = (total / 60) | 0;
        const sec = total % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    function injectStyles() {
        if (document.getElementById('abar-music-player-styles')) return;
        const style = document.createElement('style');
        style.id = 'abar-music-player-styles';
        style.type = 'text/css';
        style.innerHTML = `
            :root {
                --m-bg: #FFFFFF;
                --m-text-dark: #0D2133;
                --m-text-muted: #728496;
                --m-blue: #2B9CD9;
                --m-blue-dark: #1E79AB;
                --m-track-bg: #E8ECEF;
                --m-shadow: 0 10px 30px rgba(13, 33, 51, 0.08), 0 2px 6px rgba(13, 33, 51, 0.03);
                --m-border: 1px solid rgba(43, 156, 217, 0.22);
            }
            #${PLAYER_CONTAINER_ID} {
                width: 840px;
                max-width: 95%;
                background-color: var(--m-bg);
                border: var(--m-border);
                border-radius: 14px;
                padding: 16px 20px;
                margin: 22px auto;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 20px;
                box-shadow: var(--m-shadow);
                box-sizing: border-box;
                font-family: 'Jost', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                user-select: none;
                position: relative;
                overflow: hidden;
            }
            #${PLAYER_CONTAINER_ID} * {
                box-sizing: border-box;
            }
            #coverContainer {
                position: relative;
                width: 140px;
                height: 140px;
                flex-shrink: 0;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 14px rgba(13, 33, 51, 0.12);
                border: 1px solid rgba(0,0,0,0.06);
                background: #f0f3f6;
            }
            #coverArt {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
                transition: transform 0.35s ease;
            }
            #${PLAYER_CONTAINER_ID}:hover #coverArt {
                transform: scale(1.03);
            }
            #rightPanel {
                flex: 1;
                min-width: 0;
                height: 140px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            #playerTopRow {
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 0;
            }
            #infoPanel {
                min-width: 0;
                flex: 1;
            }
            #songTitle {
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--m-text-dark);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.2;
            }
            #artistName {
                font-size: 0.95rem;
                font-weight: 500;
                color: var(--m-blue);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-top: 3px;
            }
            #progressTimeContainer {
                width: 100%;
                margin: 2px 0;
            }
            .abar-range {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 5px;
                border-radius: 4px;
                background: linear-gradient(to right, var(--m-blue) 0%, var(--m-blue) var(--progress-percent, 0%), var(--m-track-bg) var(--progress-percent, 0%), var(--m-track-bg) 100%);
                cursor: pointer;
                outline: none;
                margin: 3px 0;
                padding: 0;
                border: none;
                transition: height 0.15s ease;
            }
            .abar-range:hover {
                height: 7px;
            }
            .abar-range::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 13px;
                height: 13px;
                border-radius: 50%;
                background: #FFFFFF;
                border: 2px solid var(--m-blue);
                box-shadow: 0 1px 3px rgba(0,0,0,0.25);
                cursor: pointer;
                transition: transform 0.1s ease;
            }
            .abar-range:hover::-webkit-slider-thumb {
                transform: scale(1.2);
                border-color: var(--m-blue-dark);
            }
            .abar-range::-moz-range-thumb {
                width: 13px;
                height: 13px;
                border-radius: 50%;
                background: #FFFFFF;
                border: 2px solid var(--m-blue);
                box-shadow: 0 1px 3px rgba(0,0,0,0.25);
                cursor: pointer;
            }
            #timeDisplayElement {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                font-weight: 600;
                color: var(--m-text-muted);
                margin-top: 1px;
            }
            #playerBottomRow {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
            }
            #playerControls {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .player-control-button {
                background: transparent;
                border: none;
                outline: none;
                color: var(--m-text-dark);
                cursor: pointer;
                padding: 6px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .player-control-button svg {
                width: 20px;
                height: 20px;
                display: block;
            }
            .player-control-button:hover {
                color: var(--m-blue);
                background: rgba(43, 156, 217, 0.08);
                transform: scale(1.08);
            }
            .player-control-button:active {
                transform: scale(0.95);
            }
            .player-control-button.active {
                color: var(--m-blue);
                background: rgba(43, 156, 217, 0.12);
            }
            #playButton {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, var(--m-blue) 0%, var(--m-blue-dark) 100%);
                color: #FFFFFF !important;
                box-shadow: 0 4px 12px rgba(43, 156, 217, 0.35);
                padding: 0;
                margin: 0 4px;
            }
            #playButton svg {
                width: 20px;
                height: 20px;
            }
            #playButton:hover {
                background: linear-gradient(135deg, #38a8e6 0%, var(--m-blue) 100%);
                box-shadow: 0 6px 16px rgba(43, 156, 217, 0.45);
                transform: scale(1.08);
            }
            #volumeContainer {
                display: flex;
                align-items: center;
                gap: 7px;
                background: #F4F7F9;
                padding: 5px 12px 5px 8px;
                border-radius: 20px;
                border: 1px solid rgba(0,0,0,0.05);
            }
            #volumeBtn {
                background: transparent;
                border: none;
                outline: none;
                color: var(--m-text-muted);
                cursor: pointer;
                padding: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: color 0.15s ease;
            }
            #volumeBtn svg {
                width: 18px;
                height: 18px;
                display: block;
            }
            #volumeBtn:hover {
                color: var(--m-blue);
            }
            #volumeSlider {
                width: 70px;
                margin: 0;
                --progress-percent: 40%;
            }
            #youtube-player-div {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 1px;
                height: 1px;
                opacity: 0;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }

    function createPlayerElements() {
        const fragment = document.createDocumentFragment();
        const container = document.createElement("div");
        container.id = PLAYER_CONTAINER_ID;

        const coverWrap = document.createElement("div");
        coverWrap.id = "coverContainer";
        coverElement = document.createElement("img");
        coverElement.id = "coverArt";
        coverElement.alt = "Album Cover";
        coverWrap.appendChild(coverElement);
        container.appendChild(coverWrap);

        const rightPanel = document.createElement("div");
        rightPanel.id = "rightPanel";

        const topRow = document.createElement("div");
        topRow.id = "playerTopRow";

        const infoPanel = document.createElement("div");
        infoPanel.id = "infoPanel";
        songTitleElement = document.createElement("div");
        songTitleElement.id = "songTitle";
        artistElement = document.createElement("div");
        artistElement.id = "artistName";
        infoPanel.appendChild(songTitleElement);
        infoPanel.appendChild(artistElement);
        topRow.appendChild(infoPanel);
        rightPanel.appendChild(topRow);

        const progressContainer = document.createElement("div");
        progressContainer.id = "progressTimeContainer";

        progressElement = document.createElement("input");
        progressElement.type = "range";
        progressElement.className = "abar-range";
        progressElement.min = "0";
        progressElement.value = "0";
        progressContainer.appendChild(progressElement);

        const timeDisplay = document.createElement("div");
        timeDisplay.id = "timeDisplayElement";
        currentTimeSpan = document.createElement("span");
        currentTimeSpan.textContent = "0:00";
        durationSpan = document.createElement("span");
        durationSpan.textContent = "0:00";
        timeDisplay.appendChild(currentTimeSpan);
        timeDisplay.appendChild(durationSpan);
        progressContainer.appendChild(timeDisplay);
        rightPanel.appendChild(progressContainer);

        const bottomRow = document.createElement("div");
        bottomRow.id = "playerBottomRow";

        const controls = document.createElement("div");
        controls.id = "playerControls";

        shuffleButton = document.createElement("button");
        shuffleButton.className = "player-control-button";
        shuffleButton.innerHTML = SVG_ICONS.shuffle;
        shuffleButton.title = "Shuffle";

        prevButton = document.createElement("button");
        prevButton.className = "player-control-button";
        prevButton.innerHTML = SVG_ICONS.prev;
        prevButton.title = "Previous Track";

        playButton = document.createElement("button");
        playButton.id = "playButton";
        playButton.className = "player-control-button";
        playButton.innerHTML = SVG_ICONS.play;
        playButton.title = "Play/Pause";

        nextButton = document.createElement("button");
        nextButton.className = "player-control-button";
        nextButton.innerHTML = SVG_ICONS.next;
        nextButton.title = "Next Track";

        repeatButton = document.createElement("button");
        repeatButton.className = "player-control-button";
        repeatButton.innerHTML = SVG_ICONS.repeat;
        repeatButton.title = "Repeat";

        controls.appendChild(shuffleButton);
        controls.appendChild(prevButton);
        controls.appendChild(playButton);
        controls.appendChild(nextButton);
        controls.appendChild(repeatButton);
        bottomRow.appendChild(controls);

        const volContainer = document.createElement("div");
        volContainer.id = "volumeContainer";

        volumeButton = document.createElement("button");
        volumeButton.id = "volumeBtn";
        volumeButton.innerHTML = SVG_ICONS.volLow;
        volumeButton.title = "Mute/Unmute";

        volumeSliderElement = document.createElement("input");
        volumeSliderElement.id = "volumeSlider";
        volumeSliderElement.type = "range";
        volumeSliderElement.className = "abar-range";
        volumeSliderElement.min = "0";
        volumeSliderElement.max = "100";
        volumeSliderElement.value = currentVolume.toString();
        volumeSliderElement.style.setProperty('--progress-percent', `${currentVolume}%`);

        volContainer.appendChild(volumeButton);
        volContainer.appendChild(volumeSliderElement);
        bottomRow.appendChild(volContainer);

        rightPanel.appendChild(bottomRow);
        container.appendChild(rightPanel);

        const ytDiv = document.createElement("div");
        ytDiv.id = YOUTUBE_PLAYER_DIV_ID;
        container.appendChild(ytDiv);

        fragment.appendChild(container);
        return fragment;
    }

    function updateVolumeUI() {
        if (!volumeButton || !volumeSliderElement) return;
        const val = isMuted ? 0 : currentVolume;
        volumeSliderElement.value = val;
        volumeSliderElement.style.setProperty('--progress-percent', `${val}%`);

        if (isMuted || val === 0) {
            volumeButton.innerHTML = SVG_ICONS.volMute;
        } else if (val < 50) {
            volumeButton.innerHTML = SVG_ICONS.volLow;
        } else {
            volumeButton.innerHTML = SVG_ICONS.volHigh;
        }
    }

    function toggleMute() {
        if (!ytPlayer) return;
        isMuted = !isMuted;
        if (isMuted) {
            ytPlayer.mute();
        } else {
            ytPlayer.unMute();
            ytPlayer.setVolume(currentVolume);
        }
        updateVolumeUI();
    }

    function setVolume(val) {
        currentVolume = Math.max(0, Math.min(100, val));
        isMuted = (currentVolume === 0);
        if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
            if (isMuted) {
                ytPlayer.mute();
            } else {
                ytPlayer.unMute();
                ytPlayer.setVolume(currentVolume);
            }
        }
        updateVolumeUI();
    }

    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleButton.classList.toggle("active", isShuffle);
    }

    function toggleRepeat() {
        isRepeat = !isRepeat;
        repeatButton.classList.toggle("active", isRepeat);
    }

    function updateUI() {
        const song = playlist ? playlist.getCurrentSong() : null;
        if (song) {
            if (lastRenderedTitle !== song.title) {
                songTitleElement.textContent = song.title;
                lastRenderedTitle = song.title;
            }
            if (lastRenderedArtist !== song.artist) {
                artistElement.textContent = song.artist;
                lastRenderedArtist = song.artist;
            }
            if (lastRenderedCover !== song.coverLink) {
                coverElement.src = song.coverLink;
                lastRenderedCover = song.coverLink;
            }
        }

        const isPlaying = ytPlayer && typeof ytPlayer.getPlayerState === 'function' && ytPlayer.getPlayerState() === YT.PlayerState.PLAYING;
        if (lastPlayState !== isPlaying) {
            playButton.innerHTML = isPlaying ? SVG_ICONS.pause : SVG_ICONS.play;
            lastPlayState = isPlaying;
        }
    }

    function bindUIEventListeners() {
        playButton.addEventListener('click', togglePlayPause);
        nextButton.addEventListener('click', playNext);
        prevButton.addEventListener('click', playPrev);
        shuffleButton.addEventListener('click', toggleShuffle);
        repeatButton.addEventListener('click', toggleRepeat);
        volumeButton.addEventListener('click', toggleMute);

        volumeSliderElement.addEventListener('input', (e) => {
            setVolume(parseFloat(e.target.value) || 0);
        });

        progressElement.addEventListener('mousedown', () => { isSeeking = true; stopRafUpdater(); });
        progressElement.addEventListener('touchstart', () => { isSeeking = true; stopRafUpdater(); }, { passive: true });
        progressElement.addEventListener('input', () => {
            if (!isSeeking) return;
            const val = parseFloat(progressElement.value) || 0;
            const max = parseFloat(progressElement.max) || 1;
            const ratio = max > 0 ? (val / max) : 0;
            progressElement.style.setProperty('--progress-percent', `${ratio * 100}%`);
            currentTimeSpan.textContent = formatTime(val);
        });
        progressElement.addEventListener('change', seekTo);

        const handleSeekEnd = () => {
            if (isSeeking) progressElement.dispatchEvent(new Event('change'));
        };
        progressElement.addEventListener('mouseup', handleSeekEnd);
        progressElement.addEventListener('touchend', handleSeekEnd);

        document.addEventListener('visibilitychange', () => {
            if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') return;
            if (document.visibilityState === 'hidden') {
                stopRafUpdater();
            } else if (document.visibilityState === 'visible') {
                if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) startRafUpdater();
            }
        });
    }

    function loadYouTubeAPI() {
        return new Promise(resolve => {
            if (window.YT && window.YT.Player) {
                resolve();
                return;
            }
            const tag = document.createElement('script');
            tag.src = YOUTUBE_API_URL;
            window.onYouTubeIframeAPIReady = resolve;
            document.head.appendChild(tag);
        });
    }

    function loadCurrentSong(autoplay = true) {
        const song = playlist.getCurrentSong();
        if (!song || !ytPlayer || !ytPlayer.loadVideoById) return;

        stopRafUpdater();
        cachedDuration = 0;

        let videoId = song.getVideoId();
        let maxAttempts = song.videoIds.length;
        let attempts = 0;

        while (recentTracks.includes(videoId) && attempts < maxAttempts) {
            videoId = song.getNextVideoId();
            attempts++;
        }
        if (attempts === maxAttempts) videoId = song.getVideoId();

        recentTracks.push(videoId);
        if (recentTracks.length > RECENT_TRACKS_COUNT) recentTracks.shift();

        ytPlayer.loadVideoById(videoId, 0, 'default');
        if (autoplay) {
            ytPlayer.playVideo();
        } else {
            ytPlayer.pauseVideo();
        }

        updateUI();
    }

    function togglePlayPause() {
        if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') return;
        const playerState = ytPlayer.getPlayerState();
        if (playerState === YT.PlayerState.PLAYING) {
            ytPlayer.pauseVideo();
        } else {
            ytPlayer.playVideo();
        }
        updateUI();
    }

    function playNext() {
        playlist.nextSong();
        loadCurrentSong(true);
    }

    function playPrev() {
        playlist.prevSong();
        loadCurrentSong(true);
    }

    function rafUpdateProgress(timestamp) {
        if (!isUpdaterRunning || !ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
        if (isSeeking) {
            rafId = requestAnimationFrame(rafUpdateProgress);
            return;
        }

        if (timestamp - lastRafUpdateTime >= FRAME_INTERVAL) {
            lastRafUpdateTime = timestamp;

            if (!cachedDuration) cachedDuration = ytPlayer.getDuration() || 0;
            const currentTime = ytPlayer.getCurrentTime();

            if (cachedDuration > 0) {
                if (lastDurationMax !== cachedDuration) {
                    progressElement.max = cachedDuration;
                    lastDurationMax = cachedDuration;

                    const newDurationText = formatTime(cachedDuration);
                    if (newDurationText !== lastRenderedDurationText) {
                        durationSpan.textContent = newDurationText;
                        lastRenderedDurationText = newDurationText;
                    }
                }

                const ratio = currentTime / cachedDuration;
                if (Math.abs(ratio - lastProgressRatio) > 0.001) {
                    progressElement.value = currentTime;
                    progressElement.style.setProperty('--progress-percent', `${ratio * 100}%`);
                    lastProgressRatio = ratio;
                }

                const newTimeText = formatTime(currentTime);
                if (newTimeText !== lastRenderedTimeText) {
                    currentTimeSpan.textContent = newTimeText;
                    lastRenderedTimeText = newTimeText;
                }
            }
        }

        if (isUpdaterRunning) rafId = requestAnimationFrame(rafUpdateProgress);
        else if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }

    function startRafUpdater() {
        if (isUpdaterRunning || !ytPlayer || ytPlayer.getPlayerState() !== YT.PlayerState.PLAYING) return;
        if (document.visibilityState === 'hidden') return;
        isUpdaterRunning = true;
        lastRafUpdateTime = 0;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(rafUpdateProgress);
    }

    function stopRafUpdater() {
        if (!isUpdaterRunning && !rafId) return;
        isUpdaterRunning = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }

    function seekTo() {
        if (ytPlayer && typeof ytPlayer.seekTo === 'function') {
            const seekTime = parseFloat(progressElement.value) || 0;
            ytPlayer.seekTo(seekTime, true);
            const newTimeText = formatTime(seekTime);
            if (newTimeText !== lastRenderedTimeText) {
                currentTimeSpan.textContent = newTimeText;
                lastRenderedTimeText = newTimeText;
            }
            isSeeking = false;
            if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) startRafUpdater();
        }
    }

    function onPlayerReady(event) {
        event.target.setVolume(currentVolume);
        updateVolumeUI();
        loadCurrentSong(true);
    }

    function onPlayerStateChange(event) {
        updateUI();
        if (event.data === YT.PlayerState.PLAYING) {
            cachedDuration = ytPlayer.getDuration();
            startRafUpdater();
        } else if (event.data === YT.PlayerState.PAUSED) {
            stopRafUpdater();
        } else if (event.data === YT.PlayerState.ENDED) {
            stopRafUpdater();
            progressElement.value = cachedDuration;
            progressElement.style.setProperty('--progress-percent', '100%');
            if (isRepeat) {
                loadCurrentSong(true);
            } else {
                playNext();
            }
        } else if (event.data === YT.PlayerState.UNSTARTED || event.data === YT.PlayerState.CUED) {
            stopRafUpdater();
            progressElement.value = 0;
            progressElement.style.setProperty('--progress-percent', '0%');
            currentTimeSpan.textContent = "0:00";
            lastRenderedTimeText = "0:00";
            lastProgressRatio = -1;
        }
    }

    function onPlayerError() {
        const song = playlist.getCurrentSong();
        if (song && song.videoIds.length > 1) {
            loadCurrentSong(true);
        } else {
            playNext();
        }
    }

    async function initializeMusicPlayer() {
        if (document.getElementById(PLAYER_CONTAINER_ID)) return;
        try {
            injectStyles();

            const initialSongs = SONGS_DATA.map(d => new Song(d.title, d.artist, d.coverLink, d.videoIds || d.videoId));
            playlist = new Playlist(initialSongs);

            const playerFragment = createPlayerElements();
            const anchorElement = document.getElementById("game_window");
            const targetContainer = (anchorElement && anchorElement.parentNode) ? anchorElement.parentNode : document.body;
            const insertBeforeElement = (anchorElement && anchorElement.parentNode) ? anchorElement.nextSibling : null;
            targetContainer.insertBefore(playerFragment, insertBeforeElement);

            bindUIEventListeners();
            updateUI();
            updateVolumeUI();

            await loadYouTubeAPI();
            ytPlayer = new YT.Player(YOUTUBE_PLAYER_DIV_ID, {
                height: '1', width: '1',
                playerVars: {
                    'playsinline': 1,
                    'autoplay': 1,
                    'controls': 0,
                    'disablekb': 1,
                    'modestbranding': 1,
                    'origin': window.location.origin
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onPlayerError
                }
            });
        } catch (error) {
            if (songTitleElement) songTitleElement.textContent = "Player Error";
            if (artistElement) artistElement.textContent = "Could not initialize track.";
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMusicPlayer);
    } else {
        initializeMusicPlayer();
    }
})();