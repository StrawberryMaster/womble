// This is, essentially, for preventing candidates or running mates
// from being selected. Very useful if you're having a one-candidate
// mod but still want to list the other candidates
(function () {
  const BAD_CANDIDATE_IDS = new Set(['17', '18', '19']);
  const RESET_CANDIDATE_ID = '16';

  const IDS = {
    gameWindow: "game_window",
    candidateInput: "candidate_id",
    candidateButton: "candidate_id_button",
    backButton: "candidate_id_back",
    runningMateButton: "running_mate_id_button",
    finalNext: "opponent_selection_id_button",
    finalBack: "opponent_selection_id_back",
    initialContinue: "election_id_button",
    gameMapHeader: "inner_window_question"
  };

  let lastSelectedCandidateId = null;

  function automateStartSequence() {
    // check for the candidate input
    const candidateInput = document.getElementById(IDS.candidateInput);
    const finalNext = document.getElementById(IDS.finalNext);
    const finalBack = document.getElementById(IDS.finalBack);
    const gameMap = document.querySelector(IDS.gameMapHeader);

    // if the question screen is loaded, we are done with setup
    if (gameMap) {
      finished = true;
      return;
    }

    // if we are on the opponent selection screen, clean up and stop
    if (finalNext && finalBack) {
      let candidateId = lastSelectedCandidateId;

      // try to read candidate_id directly if available
      if (candidateInput?.value) {
        candidateId = candidateInput.value;
        lastSelectedCandidateId = candidateId;
      }

      if (BAD_CANDIDATE_IDS.has(candidateId)) {
        finalBack.remove();
      }
      return;
    }

    // candidate selection screen check
    if (candidateInput) {
      const currentId = candidateInput.value;
      lastSelectedCandidateId = currentId;

      const candidateButton = document.getElementById(IDS.candidateButton);
      const backButton = document.getElementById(IDS.backButton);

      // block 'bad' candidates by removing the Continue button
      if (BAD_CANDIDATE_IDS.has(currentId) && candidateButton) {
        candidateButton.remove();
      }

      // if a specific candidate should force a Back click
      else if (currentId === RESET_CANDIDATE_ID && backButton && !candidateButton) {
        backButton.click();

        // try to click the initial continue button if we got sent back to start
        const initialContinue = document.getElementById(IDS.initialContinue);
        if (initialContinue) {
          initialContinue.click();
        }
      }
    }
  }

  window.tctAutoStart = { tick: automateStartSequence };

})();

// This is a catch-all mutation observer so that
// we keep one having them all run at once
(function () {
  'use strict';

  if (window.glorble) {
    window.glorble.disconnect();
  }

  window.glorbleTasks = [];

  const initialTasks = () => {
    // candidate blocking
    if (window.tctAutoStart?.tick) {
      window.tctAutoStart.tick();
    }

    if (document.querySelector(".inner_window_question")) {
      return true; // removes this task from the list
    }
    return false;

  };

  window.glorbleTasks.push(initialTasks);

  let scheduled = false;

  const runTasks = () => {
    scheduled = false;
    const tasks = window.glorbleTasks;

    if (tasks.length === 0) {
      if (window.glorble) window.glorble.disconnect();
      return;
    }

    for (let i = tasks.length - 1; i >= 0; i--) {
      try {
        if (tasks[i]() === true) tasks.splice(i, 1);
      } catch (e) {
        console.error("glorble task failed:", e);
      }
    }

    if (tasks.length === 0 && window.glorble) {
      window.glorble.disconnect();
    }
  };

  const handleMutations = () => {
    if (scheduled || window.glorbleTasks.length === 0) return;
    scheduled = true;
    requestAnimationFrame(runTasks);
  };

  const targetNode = document.getElementById("game_window");

  if (targetNode) {
    window.glorble = new MutationObserver(handleMutations);
    window.glorble.observe(targetNode, { childList: true, subtree: true });
    handleMutations();
    //console.log("glorble...");
  } else {
    console.warn("Zoinks! Glorble could not find game_window.");
  }
})();
