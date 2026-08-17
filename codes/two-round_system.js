// This gets a two-round system going, sort of
campaignTrail_temp.cyoa = true;

// which question ends Round 1 (e.g., question 20 = array index 19)
const ROUND_1_FINAL_QUESTION_INDEX = 9; 

let isRunoffTriggered = false;
let runoffOpponentId = null;

// preserve original nextQuestion function
const originalNextQuestion = nextQuestion;

nextQuestion = function() {
  // check if Round 1 has just ended
  if (campaignTrail_temp.question_number === ROUND_1_FINAL_QUESTION_INDEX && !isRunoffTriggered) {
    triggerRound1ElectionNight();
    return false;
  }
  return originalNextQuestion();
};

function triggerRound1ElectionNight() {
  // gnerate state results for Round 1
  campaignTrail_temp.final_state_results = A(1);

  // run election night
  electionNight();

  // helper to attach our runoff handler to the election night buttons
  function attachRunoffHandler() {
    $("#final_result_button, #overlay_result_button")
      .off("click")
      .on("click", onRound1Finish);
  }

  attachRunoffHandler();

  // ensures the button handler stays attached
  const observer = new MutationObserver(() => {
    attachRunoffHandler();
  });
  observer.observe(document.getElementById("game_window"), { childList: true, subtree: true });
}

function onRound1Finish() {
  clearTimeout(window.results_timeout);
  $("#map_footer").html("<i>Processing results, wait one moment...</i>");

  // compute overall popular vote totals for Round 1
  handleFinalResults(500);

  const totalVotes = campaignTrail_temp.final_overall_results.reduce((sum, f) => sum + f.popular_votes, 0);
  const sorted = [...campaignTrail_temp.final_overall_results].sort((a, b) => b.popular_votes - a.popular_votes);

  const winner = sorted[0];
  const runnerUp = sorted[1];
  const winnerPct = totalVotes > 0 ? (winner.popular_votes / totalVotes) * 100 : 0;

  const playerPk = campaignTrail_temp.candidate_id;
  const playerInRunoff = (winner.candidate === playerPk || runnerUp.candidate === playerPk);

  if (winnerPct > 50.0 || !playerInRunoff) {
    // outright winner (>50%) OR player eliminated: ending screen time
    m();
  } else {
    // runoff triggered
    isRunoffTriggered = true;
    runoffOpponentId = (winner.candidate === playerPk) ? runnerUp.candidate : winner.candidate;

    // filter active opponents down to ONLY the runoff opponent
    campaignTrail_temp.opponents_list = [runoffOpponentId];

    // zero out state multipliers for eliminated candidates
    campaignTrail_temp.candidate_state_multiplier_json.forEach((item) => {
      if (item.fields.candidate !== playerPk && item.fields.candidate !== runoffOpponentId) {
        item.fields.state_multiplier = 0;
      }
    });

    // advance question number to Round 2 start
    campaignTrail_temp.question_number++;

    // return to the game questions for Round 2
    originalNextQuestion();
  }
}