// helper to initialize and play songs
const playEndingSong = (title, artist, coverUrl, audioUrl) => {
    const audio = document.getElementById("audio");
    if (audio && audio.src) {
        try {
            if (new URL(audio.src).href === new URL(audioUrl).href) {
                return;
            }
        } catch (e) {
            if (audio.src === audioUrl || audio.src.endsWith(audioUrl)) {
                return;
            }
        }
    }

    if (typeof activePlaylist !== "undefined" && activePlaylist && typeof activePlaylist.getCurrentSong === "function") {
        const currentSong = activePlaylist.getCurrentSong();
        if (currentSong && currentSong.getAudioLink() === audioUrl) {
            return;
        }
    }

    const playlist = new Playlist();
    const song = new Song(title, artist, coverUrl, audioUrl);
    playlist.addSong(song);
    changePlaylist(playlist);
};
