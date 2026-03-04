// Useful if you want to replace the 'Continue' text in the select election screen
// button with something else. Taken from 2028 - An Old Cycle
const originalGameStart = gameStart;

window.gameStart = (event) => {
    originalGameStart(event);

    // swap the button text
    const electionBtn = document.getElementById("election_id_button");
    if (electionBtn) {
        electionBtn.innerHTML = "Your text here"; 
    }
};

// re-bind the event listener
const playBtn = document.getElementById("game_start");
if (playBtn) {
    playBtn.removeEventListener("click", originalGameStart);
    playBtn.addEventListener("click", window.gameStart);
}
