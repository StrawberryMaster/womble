// Useful if you want to replace the 'Click here to begin!' text in the starting screen
// button with something else. Taken from Viva Garfield
const gameStart = document.getElementById('game_start');
const gameWindow = document.getElementById('game_window');

if (gameStart) {
    gameStart.innerHTML = "<strong>Your text here</strong>";

    const clearHeight = () => {
        if (gameWindow) {
            gameWindow.style.removeProperty('height');
        }
    };

    gameStart.addEventListener('click', clearHeight);
}