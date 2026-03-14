// This 'disables' the map view from a specific question onwards
// rewritten from the Y. of Korea version
(function () {
  const originalQuestionHTML = questionHTML;
  const originalOpenMap = openMap;

  function isBlackoutPeriod() {
    return e.question_number > 22;
  }

  function applyMapBlackout() {
    const mapButton = document.getElementById("view_electoral_map");
    if (!mapButton || !isBlackoutPeriod()) return;

    mapButton.innerHTML = "Polling Blackout Period";
    mapButton.title = "It's all so hazy.";
    mapButton.disabled = true;

    if (e.election_json[0].fields.has_visits) {
      e.election_json[0].fields.has_visits = false;
    }
  }

  questionHTML = function (...args) {
    const result = originalQuestionHTML.apply(this, args);
    applyMapBlackout();
    return result;
  };

  openMap = function (...args) {
    if (isBlackoutPeriod()) return;
    return originalOpenMap.apply(this, args);
  };
})();
