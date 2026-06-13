// This is a dynamic election night thingy,
// similar to that of The Political Process
(function () {
  //if (!window.campaignTrail_temp?.dynamicEN) return;

  var oldElectionNight = window.electionNight;

  // configure time increment if desired, defaults to 3 for high-frequency ticks. old was 15
  var timeIncrement = window.campaignTrail_temp?.en_time_increment ?? 3; // minutes per tick
  var isPaused = false;
  var tickRate = 300; // default MS per tick. old was 1000

  var activeStateAbbr = null;
  var stateBiases = {};
  var currentTickState = {};

  var stateNextUpdate = {};

  window.electionNight = function (type = 'general', timestep = 10, states = []) {
    const isGeneral = type === 'general';
    const globalParam = campaignTrail_temp.global_parameter_json ? campaignTrail_temp.global_parameter_json[0].fields : {};

    // initialize data
    if (campaignTrail_temp.final_state_results.length > 0 && campaignTrail_temp.final_state_results[0].result) {
      campaignTrail_temp.final_overall_results = campaignTrail_temp.final_state_results[0].result.map((f) => ({
        candidate: f.candidate,
        electoral_votes: 0,
        popular_votes: 0,
      }));
    }

    const sortedCands = getSortedCands();
    const activeStates = isGeneral ? campaignTrail_temp.states_json : states;
    const someStatesHaveEVs = activeStates.some((f) => f.fields.electoral_votes > 0);
    const stateMap = mapPkToFields(activeStates);

    // reset simulation vars
    activeStateAbbr = null;
    isPaused = false;
    tickRate = 300;
    currentTickState = {};
    stateBiases = {};
    stateNextUpdate = {};

    // mirages!
    // for every state, we decide *how* it reports (e.g. urban dump, rural mirage, steady)
    activeStates.forEach(s => {
      const resData = campaignTrail_temp.final_state_results.find(r => r.state === s.pk);
      if (!resData) return;

      // find actual winner and runner up
      let sortedRes = [...resData.result].sort((a, b) => b.votes - a.votes);
      let winner = sortedRes[0].candidate;
      let runnerUp = sortedRes.length > 1 ? sortedRes[1].candidate : winner;

      // randomly pick a scenario
      let rand = Math.random();
      let biasCand = winner;
      let strength = 0;

      if (rand < 0.35) {
        // mirage (loser leads early)
        biasCand = runnerUp;
        strength = 0.15 + (Math.random() * 0.25);
      } else if (rand < 0.65) {
        // dominance (winner leads even more early)
        biasCand = winner;
        strength = 0.10 + (Math.random() * 0.15);
      } else {
        // balanced (roughly accurate from start)
        strength = 0.02;
      }

      stateBiases[s.pk] = {
        biasCandidate: biasCand,
        biasStrength: strength,
        // random reporting curve speed (0.8 = fast start, 1.2 = slow start)
        reportingSpeed: 0.8 + (Math.random() * 0.4),
        lastDisplayedProgress: 0,
        stagnationTicks: 0,
        // jitter the call time by +/- 15 minutes so it's not totally predictable
        callTimeJitter: Math.floor(Math.random() * 30) - 15
      };
    });

    const s = PROPS.ELECTIONS.get(String(campaignTrail_temp.election_id));
    const winningEV = s.winning_electoral_vote_number;
    const evsToWin = `${someStatesHaveEVs ? `</br>${formatNumbers(winningEV)} to win` : ""}`;
    const footerText = isGeneral ? 'Final results' : 'Back to questions';

    // remove old windows
    $("#election_night_overlay, #election_night_window").remove();

    // build HTML
    $("#game_window").html(`
    <div class="game_header">${window.corrr}</div>
    <div id="main_content_area">
      <div id="map_container"></div>
      <div id="menu_container">
        <div id="overall_result_container">
          <div id="overall_result">
            <h3>${isGeneral ? 'ELECTORAL VOTES' : 'DELEGATES'}</h3>
            <ul id="top_bar_list">
            </ul>
            <p id="progress_text">
              <span id="sim_clock" style="display: inline; font-weight:bold; color:#555;">--</span><br/>
              0% reporting
              ${evsToWin}
            </p>
          </div>
        </div>
        <div id="state_result_container">
          <div id="state_result">
            <h3>STATE RESULTS</h3>
            <p id="state_hover_info">Hover or click a state to view live returns.</p>
          </div>
        </div>
      </div>
    </div>
    <div id="map_footer">
       <div style="display:flex; align-items:center; justify-content:center; gap: 15px; margin-bottom: 8px; padding-top: 5px; border-top: 1px solid #ccc;">
            <button id="pause_play_btn" style="width: 80px; font-weight:bold;">PAUSE</button>

            <label style="font-size: 12px; font-weight:bold;">Speed:</label>
            <select id="speed_selector">
                <option value="600">Very Slow</option>
                <option value="400">Slow</option>
                <option value="300" selected>Default</option>
                <option value="200">Vanilla</option>
                <option value="150">Fast</option>
                <option value="100">Very Fast</option>
                <option value="0">Instant</option>
            </select>
			<button id="final_result_button">${footerText}</button>
       </div>
    </div>

    <div class="overlay" id="election_night_overlay"></div>
    <div class="overlay_window" id="election_night_window">
        <div class="overlay_window_content" id="election_night_content">
          <h3>Advisor Feedback</h3>
          <img src="${s.advisor_url}" width="208" height="128"/>
          <p>${isGeneral ? campaignTrail_temp.ElectionPopup : 'One of many election nights has arrived. Winning the delegates in these races will be vital to your primary victory.'}</p>
        </div>
      <div class="overlay_buttons" id="election_night_buttons">
        <button id="ok_button">OK</button><br>
      </div>
    </div>
  `);

    // map config
    const initialStyles = {};
    activeStates.forEach(st => {
      initialStyles[st.fields.abbr] = {
        fill: globalParam.default_map_color_hex,
        "fill-opacity": campaignTrail_temp.stateOpacity
      };
    });

    const hoverHandler = (e, data) => {
      activeStateAbbr = data.name;
      updateStateSidebar(activeStateAbbr);
    };

    $("#map_container").usmap({
      stateStyles: { fill: "transparent" },
      stateHoverStyles: { fill: "transparent" },
      stateSpecificStyles: initialStyles,
      stateSpecificHoverStyles: initialStyles,
      click: hoverHandler,
      mouseover: hoverHandler
    });

    // pre-calc data
    campaignTrail_temp.final_state_results.forEach((f) => {
      const stateObj = stateMap.get(String(f.state));
      const biasData = stateBiases[f.state];
      let rawCallTime = marginTime(f.result, stateObj.poll_closing_time);
      f.result_time = Math.max(stateObj.poll_closing_time + 1, rawCallTime + (biasData ? biasData.callTimeJitter : 0));
      f.total_votes_final = f.result.reduce((a, b) => a + b.votes, 0);

      let topV = -1;
      let win = null;
      f.result.forEach(r => { if (r.votes > topV) { topV = r.votes; win = r.candidate; } });
      f.final_winner = win;
    });

    // interaction handlers
    $("#ok_button").click(() => {
      $("#election_night_overlay, #election_night_window").remove();
      // initialize clock view on start
      $("#sim_clock").text(formatClock(time));
      window.results_timeout = setTimeout(loop, 1000);
    });

    $("#pause_play_btn").click(function () {
      isPaused = !isPaused;
      $(this).text(isPaused ? "PLAY" : "PAUSE");
      if (!isPaused) loop();
    });

    $("#speed_selector").change(function () {
      tickRate = parseInt($(this).val());
      if (tickRate === 0 && !isPaused) {
        time = 10000;
      }
    });

    $("#final_result_button").click(() => {
      clearTimeout(window.results_timeout);
      $("#map_footer").html("<i>Processing results...</i>");
      if (isGeneral) {
        handleFinalResults(10000);
        m();
      } else {
        campaignTrail_temp.question_number++;
        nextQuestion();
      }
    });

    // formats the in-game 'time' integer into a readable clock
    function formatClock(t) {
        // default: time=0 is 7:00 PM (19:00). this can be overridden
        let baseHour = window.campaignTrail_temp?.en_base_hour ?? 19;
        let currentMinutes = (baseHour * 60) + t;

        while(currentMinutes < 0) currentMinutes += 24 * 60;

        let h = Math.floor(currentMinutes / 60);
        let m = currentMinutes % 60;

        let ampm = h % 24 >= 12 ? "PM" : "AM";
        let displayH = h % 12 || 12;
        let displayM = m.toString().padStart(2, '0');

        return `${displayH}:${displayM} ${ampm} EST`;
    }

    // calc snapshot for a state
    function calculateStateSnapshot(resData, currTime, closeTime, callTime, prevSnapshot) {
      if (currTime < closeTime) {
        return {
          pk: resData.state,
          isReporting: false,
          isCalled: false,
          justCalled: false,
          flashTicks: 0,
          pctReporting: 0,
          votes: resData.result.map(r => ({ ...r, sim_votes: 0 })),
          leader: null,
          marginPercent: 0
        };
      }

      const isCalled = (currTime >= callTime);
      let wasCalledLastTick = prevSnapshot ? prevSnapshot.isCalled : false;
      let justCalled = isCalled && !wasCalledLastTick;

      // give called states a brief flash time to attract the eye (about 1 second at default speed)
      let flashTicks = prevSnapshot ? prevSnapshot.flashTicks : 0;
      if (justCalled) flashTicks = 4;
      if (flashTicks > 0) flashTicks--;

      // reporting %
      // we use a curve so it starts slow and speeds up (or vice versa based on random speed)
      let rawProgress = (currTime - closeTime) / (callTime - closeTime);
      if (isCalled) rawProgress = 1.0;

      const biasData = stateBiases[resData.state];
      // reporting speed variance
      let adjustedProgress = Math.pow(rawProgress, biasData.reportingSpeed);
      if (adjustedProgress > 1) adjustedProgress = 1;
      if (adjustedProgress < 0) adjustedProgress = 0;

      // vote dumping logic
      // states occasionally stall and don't update their reported progress, then dump a batch
      if (!isCalled) {
        if (biasData.stagnationTicks > 0) {
            biasData.stagnationTicks--;
            adjustedProgress = biasData.lastDisplayedProgress;
        } else if (Math.random() < 0.15 && adjustedProgress < 0.95) {
            // chance to stall for 3-10 ticks (since ticks are fast)
            biasData.stagnationTicks = Math.floor(Math.random() * 8) + 3;
            adjustedProgress = biasData.lastDisplayedProgress;
        } else {
            biasData.lastDisplayedProgress = adjustedProgress;
        }
      } else {
        biasData.lastDisplayedProgress = 1.0;
      }

      // total votes counted so far
      const totalCounted = Math.floor(resData.total_votes_final * adjustedProgress);

      // vote shares with bias
      // if progress is low, bias strength is high. as progress -> 1, bias -> 0
      let decay = Math.pow(1 - adjustedProgress, 2);

      let simResults = resData.result.map(r => {
        // get actual final percentage
        let finalShare = r.votes / resData.total_votes_final;
        if (isNaN(finalShare)) finalShare = 0;

        let currentShare = finalShare;

        if (!isCalled) {
          // apply mirage
          if (r.candidate === biasData.biasCandidate) {
            currentShare += (biasData.biasStrength * decay);
          }

          // random noise (high noise early, low noise late)
          let noise = (Math.random() - 0.5) * 0.05 * decay;
          currentShare += noise;

          if (currentShare < 0) currentShare = 0;
        } else {
          currentShare = finalShare; // exact match when called
        }

        return {
          candidate: r.candidate,
          share: currentShare,
          final_votes: r.votes
        };
      });

      // normalize shares
      let totalShare = simResults.reduce((a, b) => a + b.share, 0);
      if (totalShare === 0) totalShare = 1;

      let finalSimulatedVotes = simResults.map(r => {
        let normalizedShare = r.share / totalShare;
        let votes = Math.floor(totalCounted * normalizedShare);

        // cap at final votes so a small candidate can't exceed their total
        if (votes > r.final_votes) {
          votes = r.final_votes;
        }

        // ensure votes don't go down from previous tick
        if (prevSnapshot) {
          let prevData = prevSnapshot.votes.find(p => p.candidate === r.candidate);
          if (prevData && votes < prevData.sim_votes) {
            votes = prevData.sim_votes;
          }
        }

        return {
          candidate: r.candidate,
          sim_votes: votes,
          percent: (normalizedShare * 100)
        };
      });

      // find leader
      let sortedByVotes = [...finalSimulatedVotes].sort((a,b) => b.sim_votes - a.sim_votes);
      let leader = sortedByVotes.length > 0 ? sortedByVotes[0].candidate : null;

      // calculate active margin for map shading
      let marginPct = 0;
      if (sortedByVotes.length >= 2 && totalCounted > 0) {
          marginPct = (sortedByVotes[0].sim_votes - sortedByVotes[1].sim_votes) / totalCounted;
      }

      return {
        pk: resData.state,
        isReporting: true,
        isCalled: isCalled,
        justCalled: justCalled,
        flashTicks: flashTicks,
        pctReporting: Math.floor(adjustedProgress * 100),
        votes: finalSimulatedVotes,
        leader: leader,
        marginPercent: marginPct,
        final_winner: resData.final_winner
      };
    }

    // sidebar update
    function updateStateSidebar(abbr) {
      if (!abbr) return;
      const stateObj = activeStates.find(s => s.fields.abbr === abbr);
      if (!stateObj) return;

      // read from snapshot
      const snapshot = currentTickState[stateObj.pk];
      if (!snapshot) return;

      let content = `<h3>${stateObj.fields.name}</h3>`;

      if (!snapshot.isReporting) {
        const closingTime = stateObj.fields.poll_closing_time;
        content += `<p>Polls close in ${Math.max(0, closingTime - time)} minutes.</p>`;
      } else {
        let sortedVotes = [...snapshot.votes].sort((a, b) => b.sim_votes - a.sim_votes);
        let statusMsg = `<p>${snapshot.pctReporting}% reporting</p>`;

        // too close to call status
        if (snapshot.isCalled) {
          const w = sortedCands.find(c => c.candidate === snapshot.final_winner);
          statusMsg = `<p style="font-weight:bold;">Projected winner: ${w ? w.last_name : "Unknown"} <span style='color:green'>&#10003;</span></p>`;
        } else if (snapshot.pctReporting > 85 && snapshot.marginPercent < 0.02) {
          statusMsg += `<p style="color:#d9534f; font-weight:bold; font-size: 0.9em;">TOO CLOSE TO CALL</p>`;
        } else {
          statusMsg += `<p>Counting...</p>`;
        }
        content += statusMsg;

        content += `<table style="width:100%; font-size:0.9em; margin-top:5px;">`;

        // sort by current simulated votes
        sortedVotes.forEach(row => {
          const cand = sortedCands.find(c => c.candidate === row.candidate);
          const col = cand ? cand.color : "#ccc";
          const name = cand ? cand.last_name : "Other";
          const p = row.percent.toFixed(1);

          content += `
                    <tr>
                        <td style="width:10px;"><div style="width:10px; height:10px; background-color:${col}; border-radius:30%;"></div></td>
                        <td>${name}</td>
                        <td style="text-align:right;">${formatNumbers(row.sim_votes)}</td>
                        <td style="text-align:right; font-weight:bold;">${p}%</td>
                    </tr>
                 `;
        });
        content += `</table>`;

        // raw margin tracker
        if (sortedVotes.length > 1 && sortedVotes[0].sim_votes > 0) {
            let marginVotes = sortedVotes[0].sim_votes - sortedVotes[1].sim_votes;
            content += `<p style="font-size: 0.8em; font-style: italic; margin-top: 6px;">Lead: +${formatNumbers(marginVotes)} votes</p>`;
        }

        content += `<p style="margin-top:5px; font-size:0.8em; border-top:1px solid #ddd; padding-top:2px;">${stateObj.fields.electoral_votes} Electoral Votes</p>`;
      }
      $("#state_result").html(content);
    }

    // ability to set specific start times (defaults to -60, or 6:00 PM EST)
    let enStartTime = window.campaignTrail_temp?.en_start_time ?? -60;
    let time = enStartTime;
    let winnerDeclared = false;

    // main loop
    function loop() {
      if (isPaused) return;
      if (tickRate === 0) time = 10000;

      let currentEVs = {};
      let currentPVs = {};
      let totalNationwide = 0;
      sortedCands.forEach(c => { currentEVs[c.candidate] = 0; currentPVs[c.candidate] = 0; });

      let mapStyles = {};
      let statesCalled = 0;

      // calculate snapshot for all states
      campaignTrail_temp.final_state_results.forEach(st => {
        const stateObj = stateMap.get(String(st.state));
        const abbr = stateObj.abbr;

        const snapshot = calculateStateSnapshot(st, time, stateObj.poll_closing_time, st.result_time, currentTickState[st.state]);
        currentTickState[st.state] = snapshot;

        // aggregates
        if (snapshot.isReporting) {
          snapshot.votes.forEach(r => {
            if (currentPVs[r.candidate] !== undefined) currentPVs[r.candidate] += r.sim_votes;
            totalNationwide += r.sim_votes;
          });

          // map coloring
          if (snapshot.isCalled) {
            statesCalled++;
            if (currentEVs[st.final_winner] !== undefined) currentEVs[st.final_winner] += stateObj.electoral_votes;

            const candObj = PROPS.CANDIDATES.get(String(st.final_winner));
            const c = candObj ? candObj.color_hex : "#ccc";

            // flash state brightly if it was just called
            //if (snapshot.flashTicks > 0) {
            //    mapStyles[abbr] = { fill: "#ffffff", "fill-opacity": 0.8 };
            //} else {
                mapStyles[abbr] = { fill: c, "fill-opacity": campaignTrail_temp.stateOpacity };
            //}

          } else {
            if (snapshot.leader) {
              const candObj = PROPS.CANDIDATES.get(String(snapshot.leader));
              const c = candObj ? candObj.color_hex : "#ccc";

              // dynamic opacity scaling based on margin
              let dynamicOpacity = Math.min(campaignTrail_temp.stateOpacity, 0.3 + (snapshot.marginPercent * 4.5));
              mapStyles[abbr] = { fill: c, "fill-opacity": dynamicOpacity };
            } else {
              mapStyles[abbr] = { fill: globalParam.default_map_color_hex, "fill-opacity": campaignTrail_temp.stateOpacity };
            }
          }
        } else {
          mapStyles[abbr] = { fill: globalParam.default_map_color_hex, "fill-opacity": campaignTrail_temp.stateOpacity };
        }
      });

      // top bar
      const topBarHTML = sortedCands.map(f => {
        let ev = currentEVs[f.candidate];
        let pvPct = totalNationwide > 0 ? ((currentPVs[f.candidate] / totalNationwide) * 100).toFixed(1) : "0.0";
        return `
              <li>
                <span style="color:${f.color}; background-color:${f.color}">--</span>
                ${f.last_name}: ${someStatesHaveEVs ? `${ev} / ` : ""}${pvPct}%
              </li>
            `;
      }).join("");
      $("#top_bar_list").html(topBarHTML);

      // map
      updateMapViews(mapStyles);

      // sidebar
      if (activeStateAbbr) updateStateSidebar(activeStateAbbr);

      // progress
      let maxProgressTime = 560;
      let prog = Math.max(0, Math.min(100, Math.floor(((time - enStartTime) / maxProgressTime) * 100)));
      if (statesCalled === activeStates.length) prog = 100;

      $("#progress_text").html(`
          <span id="sim_clock" style="display: inline; font-weight:bold; color:#555;">${formatClock(time)}</span><br/>
          ${prog}% reporting ${evsToWin}
      `);

      // winner check
      if (!winnerDeclared && isGeneral) {
        let winnerId = null;
        for (let cid in currentEVs) {
          if (currentEVs[cid] >= winningEV) winnerId = cid;
        }
        if (winnerId) {
          winnerDeclared = true;
          isPaused = true;
          $("#pause_play_btn").text("PLAY");

          let tempRes = [];
          for (let cid in currentEVs) tempRes.push({ candidate: Number(cid), electoral_votes: currentEVs[cid] });
          tempRes.sort((a, b) => b.electoral_votes - a.electoral_votes);
          showOutcomePopup(campaignTrail_temp.election_id, tempRes);

          $("#ok_button").off('click').click(() => {
            $("#election_night_overlay, #election_night_window").remove();
            isPaused = false;
            $("#pause_play_btn").text("PAUSE");
            loop();
          });
          return;
        }
      }

      // advance
      if (statesCalled < activeStates.length && time < 10000) {

        let currentTickRate = tickRate;
        // top of the hour linger. if time lands exactly on an hour mark, slow down
		// the tick rate heavily to process the flood of poll closings
        if (time >= 0 && time % 60 === 0 && tickRate > 0) {
            currentTickRate = tickRate * 5;
        }

        window.results_timeout = setTimeout(() => {
          time += timeIncrement;
          loop();
        }, currentTickRate);
      } else {
        $("#progress_text").html(`
          <span id="sim_clock" style="display: inline; font-weight:bold; color:#555;">${formatClock(time)}</span><br/>
          100% reporting ${evsToWin}
        `);
        handleFinalResults(10000);
      }
    }

    // map update helper
    function updateMapViews(styles) {
      const $map = $("#map_container");
      const plugin = $map.data("plugin-usmap");
      if (!plugin) return;

      plugin.options.stateSpecificStyles = styles;
      plugin.options.stateSpecificHoverStyles = styles;

      for (let abbr in styles) {
        if (plugin.stateShapes[abbr]) {
          plugin.stateShapes[abbr].attr(styles[abbr]);
        }
      }
    }
  };

  function marginTime(results, time) {
    results = [...results].sort((a, b) => b.votes - a.votes);
    if (results.length < 2) return time;
    const margin = (results[0].votes - results[1].votes) / (results[0].votes + results[1].votes);
    if (margin < 0.0025) return 480;
    if (margin < 0.005) return 460;
    if (margin < 0.01) return time > 200 ? 440 : time + 240;
    if (margin < 0.015) return time > 260 ? 440 : time + 180;
    if (margin < 0.03) return time > 270 ? 420 : time + 150;
    if (margin < 0.045) return time > 300 ? 420 : time + 120;
    if (margin < 0.066) return time > 330 ? 420 : time + 90;
    if (margin < 0.085) return time > 340 ? 420 : time + 80;
    if (margin < 0.1) return time > 350 ? 420 : time + 70;
    if (margin < 0.12) return time > 360 ? 420 : time + 60;
    if (margin < 0.14) return time > 370 ? 420 : time + 50;
    if (margin < 0.16) return time > 380 ? 420 : time + 40;
    if (margin < 0.18) return time > 390 ? 420 : time + 30;
    if (margin < 0.2) return time > 400 ? 420 : time + 20;
    if (margin < 0.25) return time > 410 ? 420 : time + 10;
    return time;
  }
})();
