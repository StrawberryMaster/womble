// pseudo-preferential voting (IRV/2CP)

(function () {
  // national baseline preference flows
  // these are AEC 2010 estimates
  const defaultPreferenceFlows = {
    // Labor preferences
    "ALP": { "IND": 0.70, "LNP": 0.20, "GRN": 0.10 },

    // Coalition preferences
    "LNP": { "IND": 0.65, "ALP": 0.20, "GRN": 0.15 },

    // Independents/Others preferences
    "IND": { "LNP": 0.52, "ALP": 0.40, "GRN": 0.08 },

    // Australian Greens preferences
    "GRN": { "ALP": 0.79, "LNP": 0.15, "IND": 0.06 }
  };

  // seat-specific preference flow overrrides
  const seatSpecificFlows = {
    // Melbourne
    "Melbourne": {
      "LNP": { "GRN": 0.80, "ALP": 0.20 }
    },
    // Denison
    "Denison": {
      "GRN": { "IND": 0.75, "ALP": 0.20, "LNP": 0.05 },
      "LNP": { "IND": 0.82, "ALP": 0.18 }
    },
    // New England & Lyne
    "New England": { "ALP": { "IND": 0.85, "LNP": 0.15 } },
    "Lyne": { "ALP": { "IND": 0.85, "LNP": 0.15 } }
  };

  // helpers to resolve names, acronyms, and seats to numeric PKs
  function normalize(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  function resolveCandidatePk(identifier) {
    if (typeof identifier === "number") return identifier;
    if (!isNaN(identifier) && String(identifier).trim() !== "") return Number(identifier);

    const norm = normalize(identifier);
    const candidates = (window.campaignTrail_temp && campaignTrail_temp.candidate_json) || [];

    for (const c of candidates) {
      if (norm === String(c.pk)) return c.pk;
      if (normalize(c.fields.last_name) === norm) return c.pk;
      if (normalize(c.fields.party) === norm) return c.pk;
      if (normalize(c.fields.first_name + c.fields.last_name) === norm) return c.pk;
    }

    const aliasGroups = {
      alp: ["alp", "labor", "australianlaborparty", "gillard", "rudd"],
      lnp: ["lnp", "lib", "liberal", "national", "coalition", "abbott", "liberalnationalparty"],
      grn: ["grn", "green", "greens", "australiangreens", "brown", "bandt"],
      ind: ["ind", "independent", "independents", "indoth", "other", "others"]
    };

    for (const c of candidates) {
      const cParty = normalize(c.fields.party);
      const cLast = normalize(c.fields.last_name);
      for (const [key, aliases] of Object.entries(aliasGroups)) {
        if (aliases.includes(norm)) {
          if (aliases.includes(cParty) || aliases.includes(cLast) || cLast.includes(key)) {
            return c.pk;
          }
        }
      }
    }

    return identifier;
  }

  function resolveSeatPk(identifier) {
    if (typeof identifier === "number") return identifier;
    if (!isNaN(identifier) && String(identifier).trim() !== "") return Number(identifier);

    const norm = normalize(identifier);
    const states = (window.campaignTrail_temp && campaignTrail_temp.states_json) || [];

    for (const s of states) {
      if (norm === String(s.pk)) return s.pk;
      if (normalize(s.fields.name) === norm) return s.pk;
      if (normalize(s.fields.abbr) === norm) return s.pk;
    }

    return identifier;
  }

  let compiledDefaultFlows = null;
  let compiledSeatFlows = null;

  function compilePreferenceTables() {
    if (compiledDefaultFlows && compiledSeatFlows) return;

    compiledDefaultFlows = {};
    for (const [sourceKey, targets] of Object.entries(defaultPreferenceFlows)) {
      const srcPk = resolveCandidatePk(sourceKey);
      compiledDefaultFlows[srcPk] = {};
      for (const [targetKey, weight] of Object.entries(targets)) {
        const tgtPk = resolveCandidatePk(targetKey);
        compiledDefaultFlows[srcPk][tgtPk] = weight;
      }
    }

    compiledSeatFlows = {};
    for (const [seatKey, candidateOverrides] of Object.entries(seatSpecificFlows)) {
      const seatPk = resolveSeatPk(seatKey);
      compiledSeatFlows[seatPk] = {};
      for (const [sourceKey, targets] of Object.entries(candidateOverrides)) {
        const srcPk = resolveCandidatePk(sourceKey);
        compiledSeatFlows[seatPk][srcPk] = {};
        for (const [targetKey, weight] of Object.entries(targets)) {
          const tgtPk = resolveCandidatePk(targetKey);
          compiledSeatFlows[seatPk][srcPk][tgtPk] = weight;
        }
      }
    }
  }

  /**
   * distributes preferences iteratively until a candidate exceeds 50% or 2 remain
   */
  function calculatePreferentialOutcome(seatPk, candidateResults) {
    compilePreferenceTables();

    const totalVotes = candidateResults.reduce((sum, r) => sum + (r.votes || 0), 0);
    if (totalVotes <= 0) return candidateResults;

    // working copies for elimination rounds
    let tallies = candidateResults.map((r) => ({
      candidate: r.candidate,
      currentVotes: r.votes,
      primaryVotes: r.votes,
      eliminated: false,
      origObj: { ...r }
    }));

    // iterative IRV count
    while (true) {
      const active = tallies.filter((t) => !t.eliminated);
      if (active.length <= 1) break;

      // check if any candidate has an outright majority
      const leader = active.reduce((max, t) => (t.currentVotes > max.currentVotes ? t : max), active[0]);
      if (leader.currentVotes > 0.5 * totalVotes || active.length === 2) {
        break;
      }

      // eliminate candidate with lowest vote
      const lowest = active.reduce((min, t) => (t.currentVotes < min.currentVotes ? t : min), active[0]);
      lowest.eliminated = true;

      const votesToDistribute = lowest.currentVotes;
      lowest.currentVotes = 0;

      // determine preference flow rates
      const flows =
        (compiledSeatFlows[seatPk] && compiledSeatFlows[seatPk][lowest.candidate]) ||
        compiledDefaultFlows[lowest.candidate] ||
        {};

      const remaining = tallies.filter((t) => !t.eliminated);

      // calculate total weight of remaining eligible recipients
      let weightSum = 0;
      remaining.forEach((t) => {
        weightSum += flows[t.candidate] || 0;
      });

      // distribute to remaining candidates
      remaining.forEach((t) => {
        const share = weightSum > 0 ? (flows[t.candidate] || 0) / weightSum : 1 / remaining.length;
        t.currentVotes += votesToDistribute * share;
      });
    }

    // identify final 2-candidate preferred candidates
    const sortedActive = tallies.filter((t) => !t.eliminated).sort((a, b) => b.currentVotes - a.currentVotes);
    const winner = sortedActive[0];
    const runnerUp = sortedActive[1] || null;

    const twoCPTotal = (winner.currentVotes + (runnerUp ? runnerUp.currentVotes : 0)) || totalVotes;

    // build the final 2CP result array
    const finalResults = [];

    // winner
    const winObj = { ...winner.origObj };
    winObj.electoral_votes = 1;
    winObj.percent = winner.currentVotes / twoCPTotal;
    winObj.two_cp_percent = winObj.percent;
    winObj.two_cp_votes = Math.round(winner.currentVotes);
    finalResults.push(winObj);

    // runner-up
    if (runnerUp) {
      const runObj = { ...runnerUp.origObj };
      runObj.electoral_votes = 0;
      runObj.percent = runnerUp.currentVotes / twoCPTotal;
      runObj.two_cp_percent = runObj.percent;
      runObj.two_cp_votes = Math.round(runnerUp.currentVotes);
      finalResults.push(runObj);
    }

    // eliminated candidates
    tallies
      .filter((t) => t.eliminated)
      .forEach((t) => {
        const elimObj = { ...t.origObj };
        elimObj.electoral_votes = 0;
        elimObj.percent = 0.0;
        elimObj.two_cp_percent = 0.0;
        elimObj.two_cp_votes = 0;
        finalResults.push(elimObj);
      });

    return finalResults;
  }

  // post-election dual data store and selected seat tracker
  let postElectionCompiled = false;
  let primarySeatResults = [];
  let twoCpSeatResults = [];
  let currentPostElectionMode = "primary"; // starts on 1st preferences as seen on election night
  let lastSelectedSeatAbbr = null;
  let isUpdatingUi = false;

  // compile models for both 1st preferences and 2CP
  function compilePostElectionModels() {
    const e = window.campaignTrail_temp;
    if (!e || !e.final_state_results || postElectionCompiled) return;

    primarySeatResults = e.final_state_results.map((seat) => {
      const clonedResult = seat.result.map((r) => ({ ...r }));
      clonedResult.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      clonedResult.forEach((r, idx) => {
        r.electoral_votes = idx === 0 ? 1 : 0;
        r.primary_votes = r.votes;
        r.primary_percent = r.percent;
      });
      return {
        ...seat,
        result: clonedResult
      };
    });

    twoCpSeatResults = e.final_state_results.map((seat) => {
      const prefResult = calculatePreferentialOutcome(seat.state, seat.result);
      return {
        ...seat,
        result: prefResult
      };
    });

    postElectionCompiled = true;
  }

  // calculate national 2CP totals
  function compileTwoCpTotals() {
    const e = window.campaignTrail_temp;
    const cands = window.PROPS
      ? window.PROPS.CANDIDATES
      : new Map((e.candidate_json || []).map((c) => [String(c.pk), c.fields]));

    const totals = new Map();
    let grandTotal2CpVotes = 0;

    twoCpSeatResults.forEach((seat) => {
      seat.result.forEach((r) => {
        if (!totals.has(r.candidate)) {
          totals.set(r.candidate, { seats: 0, votes: 0 });
        }
        const item = totals.get(r.candidate);
        item.seats += (r.electoral_votes || 0);
        item.votes += (r.two_cp_votes || 0);
        grandTotal2CpVotes += (r.two_cp_votes || 0);
      });
    });

    const sorted = Array.from(totals.keys())
      .filter((candId) => totals.get(candId).votes > 0 || totals.get(candId).seats > 0)
      .sort((a, b) => (totals.get(b).seats - totals.get(a).seats) || (totals.get(b).votes - totals.get(a).votes));

    return { totals, grandTotal2CpVotes, sorted, cands };
  }

  // generate candidate seat tallies and percentages
  function renderTallyList(mode) {
    const e = window.campaignTrail_temp;
    const activeSeats = (mode === "2cp") ? twoCpSeatResults : primarySeatResults;
    const cands = window.PROPS
      ? window.PROPS.CANDIDATES
      : new Map((e.candidate_json || []).map((c) => [String(c.pk), c.fields]));

    const totalVotes = activeSeats.reduce((sum, s) => sum + s.result.reduce((s2, r) => s2 + (r.primary_votes || r.votes || 0), 0), 0);

    const candidateStats = new Map();
    activeSeats.forEach((s) => {
      s.result.forEach((r) => {
        if (!candidateStats.has(r.candidate)) {
          candidateStats.set(r.candidate, { seats: 0, votes: 0 });
        }
        const stat = candidateStats.get(r.candidate);
        stat.seats += (r.electoral_votes || 0);
        stat.votes += (r.primary_votes || r.votes || 0);
      });
    });

    const sortedCandIds = Array.from(candidateStats.keys()).sort((a, b) => {
      const sA = candidateStats.get(a);
      const sB = candidateStats.get(b);
      return (sB.seats - sA.seats) || (sB.votes - sA.votes);
    });

    return sortedCandIds
      .map((candId) => {
        const candObj = cands.get ? cands.get(String(candId)) : cands[String(candId)];
        if (!candObj) return "";
        const stat = candidateStats.get(candId);
        const pvShare = totalVotes > 0 ? ((stat.votes / totalVotes) * 100).toFixed(1) : "0.0";
        return `
          <li>
            <span style="color:${candObj.color_hex}; background-color: ${candObj.color_hex}">--</span>
            ${candObj.last_name}: ${stat.seats} / ${pvShare}%
          </li>
        `;
      })
      .join("");
  }

  // update seat detail when a state is clicked or when toggled
  function updateSeatDetail(abbr) {
    const e = window.campaignTrail_temp;
    if (!e || !e.states_json) return;

    const activeSeats = (currentPostElectionMode === "2cp") ? twoCpSeatResults : primarySeatResults;
    const seatResults = activeSeats.find((f) => String(f.abbr) === String(abbr));
    const stateObj = e.states_json.find((f) => String(f.fields.abbr) === String(abbr));
    if (!seatResults || !stateObj) return;

    lastSelectedSeatAbbr = abbr;

    const cands = window.PROPS
      ? window.PROPS.CANDIDATES
      : new Map((e.candidate_json || []).map((c) => [String(c.pk), c.fields]));

    const formatNum = (num) => (typeof formatNumbers === "function" ? formatNumbers(num) : Number(num).toLocaleString());

    // in 2CP mode only, show candidates that made the final preferred count
    const displayList = (currentPostElectionMode === "2cp")
      ? seatResults.result.filter((f) => f.percent > 0)
      : seatResults.result.filter((f) => (f.primary_votes || f.votes || 0) > 0);

    const resultHtml = displayList
      .slice(0, 4)
      .map((f) => {
        const candObj = cands.get ? cands.get(String(f.candidate)) : cands[String(f.candidate)];
        if (!candObj) return "";
        const pctDisplay = f.percent ? (100 * f.percent).toFixed(1) : "0.0";
        const voteCount = (currentPostElectionMode === "2cp")
          ? (f.two_cp_votes || 0)
          : (f.primary_votes || f.votes || 0);

        return `
          <li>
            <span style="color:${candObj.color_hex}; background-color: ${candObj.color_hex}">--</span>
            ${candObj.last_name}: ${pctDisplay}% <font size="1">(${formatNum(voteCount)})</font>
          </li>
        `;
      })
      .join("");

    const returnStr = `
      <h3>STATE RESULTS</h3>
      <p>${stateObj.fields.name}</p>
      <ul>${resultHtml}</ul>
    `;

    $("#state_result").html(returnStr);
  }

  // provide map styles and click handler for active mode
  function getMapStylesForMode(mode) {
    const e = window.campaignTrail_temp;
    const activeSeats = (mode === "2cp") ? twoCpSeatResults : primarySeatResults;
    const cands = window.PROPS
      ? window.PROPS.CANDIDATES
      : new Map((e.candidate_json || []).map((c) => [String(c.pk), c.fields]));

    const stateColor = {};
    activeSeats.forEach((seat) => {
      const winner = seat.result[0];
      const candObj = cands.get ? cands.get(String(winner.candidate)) : cands[String(winner.candidate)];
      if (candObj) {
        stateColor[seat.abbr] = {
          fill: candObj.color_hex,
          "fill-opacity": e.stateOpacity || 1
        };
      }
    });

    return {
      stateSpecificStyles: stateColor,
      stateSpecificHoverStyles: stateColor,
      click: function (_evt, data) {
        if (data && data.name) {
          updateSeatDetail(data.name);
        }
      }
    };
  }

  // synchronize map and handlers
  function applyMapSync() {
    const $map = $("#map_container");
    if (!$map.length) return;

    const plugin = $map.data("plugin-usmap");
    if (!plugin) {
      setTimeout(applyMapSync, 25);
      return;
    }

    if (typeof updateUsMapStyles === "function") {
      updateUsMapStyles(getMapStylesForMode(currentPostElectionMode));
    }

    if (lastSelectedSeatAbbr) {
      updateSeatDetail(lastSelectedSeatAbbr);
    }
  }

  // switch between 1st preferences and 2-candidate preferred
  function togglePreferenceMode() {
    currentPostElectionMode = (currentPostElectionMode === "primary") ? "2cp" : "primary";

    // update button text
    const btn = document.getElementById("pref_switch_button");
    if (btn) {
      btn.textContent = (currentPostElectionMode === "primary")
        ? "Switch to 2-Candidate Preferred"
        : "Switch to 1st Preferences";
    }

    // update overall_result header and tally list
    const header = $("#overall_result > h3");
    if (header.length) {
      header.text((currentPostElectionMode === "primary") ? "OVERALL RESULTS (1ST PREFS)" : "OVERALL RESULTS (2CP)");
    }

    const ul = $("#overall_result > ul");
    if (ul.length) {
      ul.html(renderTallyList(currentPostElectionMode));
    }

    // sync active state result pointer
    const e = window.campaignTrail_temp;
    if (e && e.final_state_results) {
      e.final_state_results = (currentPostElectionMode === "2cp") ? twoCpSeatResults : primarySeatResults;
    }

    // apply map update and refresh seat tab if already selected
    applyMapSync();
  }

  // handle post-election map screen injection
  function handleMapScreenUi() {
    const overallResult = document.getElementById("overall_result");
    if (overallResult && !document.getElementById("pref_switch_button")) {
      const btn = document.createElement("button");
      btn.id = "pref_switch_button";
      btn.style.marginTop = "8px";
      btn.style.width = "100%";
      btn.style.fontSize = "12px";
      btn.style.cursor = "pointer";
      btn.style.padding = "4px";
      btn.textContent = (currentPostElectionMode === "primary")
        ? "Switch to 2-Candidate Preferred"
        : "Switch to 1st Preferences";

      btn.onclick = function (evt) {
        evt.preventDefault();
        togglePreferenceMode();
      };

      overallResult.appendChild(btn);

      // sync list and map state when returning to map tab
      const ul = $("#overall_result > ul");
      if (ul.length) {
        ul.html(renderTallyList(currentPostElectionMode));
      }

      applyMapSync();
    }
  }

  // render both 2CP and primary tables on results by seat page
  function renderCustomSeatTables(statePk) {
    compilePostElectionModels();

    const e = window.campaignTrail_temp;
    const stateObj = (e.states_json || []).find((s) => s.pk === Number(statePk));
    const twoCpSeat = twoCpSeatResults.find((s) => s.state === Number(statePk));
    const primarySeat = primarySeatResults.find((s) => s.state === Number(statePk));
    if (!stateObj || !twoCpSeat || !primarySeat) return "<p>No seat results available.</p>";

    const cands = window.PROPS
      ? window.PROPS.CANDIDATES
      : new Map((e.candidate_json || []).map((c) => [String(c.pk), c.fields]));

    const formatNum = (num) => (typeof formatNumbers === "function" ? formatNumbers(num) : Number(num).toLocaleString());

    // 2CP table rows
    const twoCpRows = twoCpSeat.result
      .filter((r) => r.percent > 0)
      .map((r) => {
        const cObj = cands.get ? cands.get(String(r.candidate)) : cands[String(r.candidate)];
        const partyName = cObj ? `${cObj.first_name} ${cObj.last_name}` : "Unknown";
        return `
          <tr>
            <td>${partyName}</td>
            <td>${formatNum(r.two_cp_votes || 0)}</td>
            <td>${(100 * r.percent).toFixed(2)}%</td>
            <td>${r.electoral_votes || 0}</td>
          </tr>
        `;
      })
      .join("");

    // 1st preferences primary table rows
    const primaryTotal = primarySeat.result.reduce((sum, r) => sum + (r.primary_votes || r.votes || 0), 0);
    const primaryRows = primarySeat.result
      .filter((r) => (r.primary_votes || r.votes || 0) > 0)
      .map((r) => {
        const cObj = cands.get ? cands.get(String(r.candidate)) : cands[String(r.candidate)];
        const partyName = cObj ? `${cObj.first_name} ${cObj.last_name}` : "Unknown";
        const pVotes = r.primary_votes || r.votes || 0;
        const pPct = primaryTotal > 0 ? ((pVotes / primaryTotal) * 100).toFixed(2) : "0.00";
        return `
          <tr>
            <td>${partyName}</td>
            <td>${formatNum(pVotes)}</td>
            <td>${pPct}%</td>
          </tr>
        `;
      })
      .join("");

    return `
      <h4>Two-Party Preferred (2CP)</h4>
      <table id="twocp_seat_table">
        <tbody>
          <tr>
            <th>Party</th>
            <th>Popular Votes</th>
            <th>Popular Vote %</th>
            <th>Seats</th>
          </tr>
          ${twoCpRows}
        </tbody>
      </table>
      <br>
      <h4>1st Preferences (Primary)</h4>
      <table>
        <tbody>
          <tr>
            <th>Party</th>
            <th>Popular Votes</th>
            <th>Popular Vote %</th>
          </tr>
          ${primaryRows}
        </tbody>
      </table>
    `;
  }

  // hook T(t) function on results by seat page
  if (typeof T === "function") {
    const originalT = T;
    T = function (t) {
      compilePostElectionModels();
      if (twoCpSeatResults.length > 0) {
        return renderCustomSeatTables(t);
      }
      return originalT(t);
    };
    window.T = T;
  }

  // extend overall final results page with 2CP table
  function handleOverallStatsUi(container) {
    if (!container || container.querySelector("#twocp_results_table")) return;

    const { totals, grandTotal2CpVotes, sorted, cands } = compileTwoCpTotals();
    const formatNum = (num) => (typeof formatNumbers === "function" ? formatNumbers(num) : Number(num).toLocaleString());

    // update seats in existing primary results table to reflect true 2CP seats won
    const primaryTable = container.querySelector(".final_results_table");
    if (primaryTable) {
      const rows = primaryTable.querySelectorAll("tr:not(:first-child)");
      rows.forEach((row) => {
        const partyText = row.children[0]?.textContent || "";
        for (const candId of sorted) {
          const candObj = cands.get ? cands.get(String(candId)) : cands[String(candId)];
          if (candObj && partyText.includes(candObj.last_name)) {
            const seatCellIndex = row.children.length >= 5 ? 2 : 1;
            const targetVal = String(totals.get(candId).seats);
            if (row.children[seatCellIndex] && row.children[seatCellIndex].textContent !== targetVal) {
              row.children[seatCellIndex].textContent = targetVal;
            }
            break;
          }
        }
      });
    }

    // construct 2CP estimate table
    const twoCpRows = sorted
      .map((candId) => {
        const candObj = cands.get ? cands.get(String(candId)) : cands[String(candId)];
        const stat = totals.get(candId);
        const votePct = grandTotal2CpVotes > 0 ? ((stat.votes / grandTotal2CpVotes) * 100).toFixed(1) : "0.0";
        const colorHex = candObj ? candObj.color_hex : "#888888";
        const partyDisplay = candObj ? `${candObj.first_name} ${candObj.last_name}` : "Party";

        return `
          <tr>
            <td style="text-align: left;">
              <span style="background-color: ${colorHex}; color: ${colorHex};">----</span> ${partyDisplay}
            </td>
            <td>${stat.seats}</td>
            <td>${formatNum(stat.votes)}</td>
            <td>${votePct}%</td>
          </tr>
        `;
      })
      .join("");

    const twoCpTableHtml = `
      <br>
      <h4>Two-Party Preferred (2CP) Estimate</h4>
      <table class="final_results_table" id="twocp_results_table">
        <tbody>
          <tr>
            <th>Party</th>
            <th>Seats</th>
            <th>2CP Votes</th>
            <th>2CP Vote %</th>
          </tr>
          ${twoCpRows}
        </tbody>
      </table>
    `;

    container.insertAdjacentHTML("beforeend", twoCpTableHtml);
  }

  // general post-election coordinator
  function handlePostElectionUi() {
    if (isUpdatingUi) return;
    isUpdatingUi = true;

    try {
      const isPostElection = document.querySelector(".final_menu_button") || document.querySelector("#overall_vote_statistics");
      if (!isPostElection) return;

      compilePostElectionModels();

      // handle final election map screen
      const finalMapActive = document.querySelector("#overall_result_container") && document.querySelector("#final_election_map_button");
      if (finalMapActive && postElectionCompiled) {
        handleMapScreenUi();
      }

      // handle overall final results page
      const overallStats = document.getElementById("overall_vote_statistics");
      if (overallStats && postElectionCompiled) {
        handleOverallStatsUi(overallStats);
      }
    } finally {
      isUpdatingUi = false;
    }
  }

  // the observer.
  const gameWindowTarget = document.getElementById("game_window");
  if (gameWindowTarget) {
    const windowObserver = new MutationObserver(function () {
      handlePostElectionUi();
    });
    windowObserver.observe(gameWindowTarget, { childList: true, subtree: true });
  }
})();