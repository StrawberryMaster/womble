// This is to change the question counter to whatever you want
(function() {
  const originalQuestionHTML = window.questionHTML;

  window.questionHTML = function(polling) {
    // render the UI elements first
    originalQuestionHTML(polling);

    // target the progress bar header
    const progressBarHeader = document.querySelector("#progress_bar h3");
    if (progressBarHeader) {
      const currentQuestionPk = campaignTrail_temp.questions_json[campaignTrail_temp.question_number]?.pk;

      // map of question PKs to their custom route names
      const routeNames = {
        1200: "Pocket Dimension Route",
        1201: "Electric Boogaloo Route",
        1202: "example",
      };

      // update the text if the current question matches a route
      if (routeNames[currentQuestionPk] !== undefined) {
        progressBarHeader.textContent = routeNames[currentQuestionPk];
      }
    }
  };
})();
