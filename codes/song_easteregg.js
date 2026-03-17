// This is the temporary songs easter egg
// as seen on All The Way.
const temporarySongs = {
  "https://i.imgur.com/kyGgGv1.gif": new Song(
    "68 Nixon",
    "The Chad Mitchell Trio",
    "https://i.imgur.com/qCeXoEF.png",
    "https://audio.jukehost.co.uk/GbUjVZl2OLsFKuDCDtXqtRYyx1SVm3Sy"
  ),
  "https://i.imgur.com/2Igi5G3.gif": new Song(
    "Hitler Ain't Dead",
    "Bill Frederick",
    "https://i.imgur.com/FPd1WCt.png",
    "https://audio.jukehost.co.uk/W67k1jONY0PWwHEQ9VVMHOg5pma6eOid"
  ),
  "https://i.imgur.com/Z9V9Qpm.gif": new Song(
    "Talking Birmingham Jam",
    "Phil Ochs",
    "https://i.imgur.com/3gmDdNl.png",
    "https://audio.jukehost.co.uk/mCxNOjWAri7S02PnoK7P1b7PETgd3wK3"
  ),
  "https://i.imgur.com/5hesrbB.gif": new Song(
    "Whatever Became Of Hubert",
    "Tom Lehrer",
    "https://i.imgur.com/PLhhDQe.png",
    "https://audio.jukehost.co.uk/xPx4kKdX9DrLlx6smlGrRj9DaBmKAYX0"
  )
};

const clickCounts = {};

function playTemporarySong(temporarySong) {
  let targetPlaylist;
  if (typeof activePlaylist !== "undefined") {
    targetPlaylist = activePlaylist;
  } else if (typeof playlist !== "undefined") {
    targetPlaylist = playlist;
  } else {
    console.error("Music player playlist not found!");
    return;
  }

  // check if the song is already in the main playlist
  const existsIndex = targetPlaylist.songs.findIndex(s => s.audioLink === temporarySong.audioLink);

  if (existsIndex === -1) {
    targetPlaylist.songs.splice(targetPlaylist.currentSongIndex + 1, 0, temporarySong); // add song
    targetPlaylist.currentSongIndex++; // jump to song
  } else {
    // if already unlocked, jump directly to it
    targetPlaylist.currentSongIndex = existsIndex;
  }

  // update UI
  if (typeof updateUI === "function") {
    updateUI(targetPlaylist);
  }

  // get the audio element
  const audio = (typeof getAudioElement === "function")
    ? getAudioElement()
    : document.getElementById("audio");

  if (audio) {
    audio.src = targetPlaylist.getCurrentSong().audioLink;

    // trigger needle decoding if it exists
    if (typeof decodeAudio === "function") {
      decodeAudio(audio.src);
    }

    audio.play()
      .then(() => {
        if (typeof updatePlayPauseIcon === "function") updatePlayPauseIcon(true);
      })
      .catch((e) => console.log("Audio play prevented:", e));
  }
}

document.addEventListener("click", function (event) {
  // check if the exact thing the user clicked was one of the two target images
  const targetImage = event.target.closest("#candidate_image img, #running_mate_image img");

  // if they clicked anything else on the entire page, stop
  if (!targetImage) return;

  const imageSrc = targetImage.src;

  // if the clicked image has a secret song attached to it
  if (temporarySongs[imageSrc]) {
    clickCounts[imageSrc] = (clickCounts[imageSrc] || 0) + 1;

    // trigger the song after 6 clicks
    if (clickCounts[imageSrc] === 6) {
      playTemporarySong(temporarySongs[imageSrc]);
      clickCounts[imageSrc] = 0;
    }
  }
});
