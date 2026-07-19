// This lets you use different names for candidates
(function() {
  // helper function to return the correct name depending on the state
  function getTargetName(stateAbbr) {
    if (stateAbbr === "MA" || stateAbbr === "OR") {
      return "Edward Kennedy";
    }
    return "Teddy Kennedy";
  }

  // patch the state summary tooltip/hover card
  const originalSetStatePollText = window.setStatePollText;
  window.setStatePollText = function(state, t) {
    originalSetStatePollText(state, t);

    if (state) {
      const targetName = getTargetName(state.fields.abbr);

      const overallResultEl = document.getElementById("overall_result");
      if (overallResultEl) {
        overallResultEl.innerHTML = overallResultEl.innerHTML.replace(/Ted Kennedy/g, targetName);
      }
      const stateInfoEl = document.getElementById("state_info");
      if (stateInfoEl) {
        stateInfoEl.innerHTML = stateInfoEl.innerHTML.replace(/Ted Kennedy/g, targetName);
      }
    }
  };

  // patch the final map screen click-details on election night
  const originalMapResultColor = window.mapResultColor;
  window.mapResultColor = function(time) {
    const config = originalMapResultColor(time);
    const originalClick = config.click;

    config.click = function(i, a) {
      originalClick(i, a);

      if (a) {
        const targetName = getTargetName(a.name);
        const stateResultEl = document.getElementById("state_result");
        if (stateResultEl) {
          stateResultEl.innerHTML = stateResultEl.innerHTML.replace(/Ted Kennedy/g, targetName);
        }
      }
    };

    return config;
  };

  // patch the "Results by State" page summaries
  const originalT = window.T;
  window.T = function(t) {
    let html = originalT(t);
    const stateObj = campaignTrail_temp.states_json.find(s => s.pk === Number(t));

    if (stateObj) {
      const targetName = getTargetName(stateObj.fields.abbr);
      html = html.replace(/Ted Kennedy/g, targetName);
    }
    return html;
  };

  // patch the overall/national results details page
  const originalOverallDetailsHtml = window.overallDetailsHtml;
  window.overallDetailsHtml = function() {
    originalOverallDetailsHtml();
    const mainContent = document.getElementById("main_content_area");
    if (mainContent) {
      mainContent.innerHTML = mainContent.innerHTML.replace(/Ted Kennedy/g, "Teddy Kennedy");
    }
  };
})();
