// This lets you remove candidates more easily. Taken from 2012 - Obamanation
(function () {
  const e = campaignTrail_temp;

  function ensureNumber(x, def = 0) {
    const n = Number(x);
    return Number.isFinite(n) ? n : def;
  }

  function unique(arr) {
    return Array.from(new Set(arr));
  }

  function getStateMeta(statePk) {
    return e.states_json.find((s) => s.pk === Number(statePk))?.fields || null;
  }

  // d'Hondt for primary mode if needed
  function dhondtAlloc(votes, seats, thresh = 0.15) {
    const totals = votes.slice();
    const allocations = new Array(totals.length).fill(0);
    const sum = totals.reduce((a, b) => a + ensureNumber(b, 0), 0);
    const perc = totals.map((v) => (sum > 0 ? v / sum : 0));
    for (let i = 0; i < seats; i++) {
      let bestIdx = -1;
      let bestQ = -1;
      for (let c = 0; c < totals.length; c++) {
        const q = perc[c] < thresh ? 0 : totals[c] / (allocations[c] + 1);
        if (q > bestQ) { bestQ = q; bestIdx = c; }
      }
      if (bestIdx >= 0) allocations[bestIdx] += 1;
    }
    return allocations;
  }

  function recomputeEVsForState(stateEntry) {
    const stFields = getStateMeta(stateEntry.state);
    if (!stFields) return;

    const totalEV = ensureNumber(stFields.electoral_votes, 0);
    if (totalEV <= 0) {
      stateEntry.result.forEach((cr) => (cr.electoral_votes = 0));
      return;
    }

    // keep sorted desc by percent for EV assignment
    stateEntry.result.sort((a, b) => b.percent - a.percent);

    if (e.primary) {
      const votes = stateEntry.result.map((r) => ensureNumber(r.votes, 0));
      const alloc = dhondtAlloc(votes, totalEV, 0.15);
      stateEntry.result.forEach((r, i) => (r.electoral_votes = alloc[i] || 0));
      return;
    }

    const isProp = Number(e.game_type_id) === 2;
    if (isProp) {
      const shares = divideElectoralVotesProp(stateEntry.result.map((r) => r.percent), totalEV);
      stateEntry.result.forEach((r, i) => (r.electoral_votes = shares[i] || 0));
      return;
    }

    if (ensureNumber(stFields.winner_take_all_flg, 0) === 1) {
      stateEntry.result.forEach((r, i) => (r.electoral_votes = i === 0 ? totalEV : 0));
    } else {
      const totVotes = stateEntry.result.reduce((acc, r) => acc + ensureNumber(r.votes, 0), 0);
      const topVotes = ensureNumber(stateEntry.result[0]?.votes, 0);
      const [L, D] = splitEVTopTwo(totalEV, topVotes, totVotes);
      stateEntry.result.forEach((r, i) => (r.electoral_votes = i === 0 ? L : i === 1 ? D : 0));
    }
  }

  function buildSyntheticVotesIfNeeded(stateEntry) {
    const hasVotes = stateEntry.result.some((r) => ensureNumber(r.votes, 0) > 0);
    if (hasVotes) return;
    const totalPct = stateEntry.result.reduce((acc, r) => acc + ensureNumber(r.percent, 0), 0);
    if (totalPct <= 0) return;
    const st = getStateMeta(stateEntry.state);
    const totalVotes = Math.max(1, ensureNumber(st?.popular_votes, 0)) || 1000000;
    for (const r of stateEntry.result) {
      r.votes = Math.floor(ensureNumber(r.percent, 0) * totalVotes);
    }
  }

  function finalizeStateResult(stateEntry) {
    buildSyntheticVotesIfNeeded(stateEntry);
    const totalVotes = stateEntry.result.reduce((acc, r) => acc + ensureNumber(r.votes, 0), 0);
    for (const r of stateEntry.result) {
      r.percent = totalVotes > 0 ? ensureNumber(r.votes, 0) / totalVotes : 0;
    }
    recomputeEVsForState(stateEntry);
    stateEntry.result.sort((a, b) => b.percent - a.percent);
  }

  function computeRemovedVotes(stateEntry, removed) {
    const removedVotes = ensureNumber(removed.votes, 0);
    if (removedVotes > 0) return removedVotes;

    const removedPct = ensureNumber(removed.percent, 0);
    if (removedPct <= 0) return 0;

    buildSyntheticVotesIfNeeded(stateEntry);
    const baseTotal = stateEntry.result
      .filter((r) => r.candidate !== removed.candidate)
      .reduce((acc, r) => acc + ensureNumber(r.votes, 0), 0);

    if (baseTotal <= 0) return Math.round(removedPct * 1000000);
    return (removedPct / Math.max(1e-12, 1 - removedPct)) * baseTotal;
  }

  function proportionalize(stateEntry, extraVotes) {
    const baseTotal = stateEntry.result.reduce((acc, r) => acc + ensureNumber(r.votes, 0), 0);
    if (baseTotal <= 0) return;
    for (const r of stateEntry.result) {
      const share = ensureNumber(r.votes, 0) / baseTotal;
      r.votes = ensureNumber(r.votes, 0) + share * extraVotes;
    }
  }

  function ensureCandidateInState(stateEntry, candPk) {
    const present = stateEntry.result.some((r) => Number(r.candidate) === Number(candPk));
    if (present) return;
    stateEntry.result.push({
      candidate: Number(candPk),
      result: 0,
      electoral_votes: 0,
      percent: 0,
      votes: 0,
    });
  }

  function redistributeStateResult(stateEntry, removedPk, mode, opts) {
    const target = Number(opts?.target);
    const weightsObj = opts?.weights || null;
    const insertTargetIfMissing = opts?.insertTargetIfMissing !== false;

    const idx = stateEntry.result.findIndex((r) => Number(r.candidate) === Number(removedPk));
    if (idx === -1) return;

    const removed = stateEntry.result[idx];
    const extraVotes = computeRemovedVotes(stateEntry, removed);

    stateEntry.result.splice(idx, 1);

    if (stateEntry.result.length === 0) {
      finalizeStateResult(stateEntry);
      return;
    }

    if (extraVotes > 0) {
      if (mode === 'toCandidate' && Number.isFinite(target)) {
        if (insertTargetIfMissing) ensureCandidateInState(stateEntry, target);
        const tgt = stateEntry.result.find((r) => Number(r.candidate) === target);
        if (tgt) {
          tgt.votes = ensureNumber(tgt.votes, 0) + extraVotes;
        } else {
          proportionalize(stateEntry, extraVotes);
        }
      } else if (mode === 'weights' && weightsObj && typeof weightsObj === 'object') {
        const presentIds = stateEntry.result.map((r) => Number(r.candidate));
        const weights = presentIds.map((pk) => Math.max(0, ensureNumber(weightsObj[pk], 0)));
        const sumW = weights.reduce((a, b) => a + b, 0);
        if (sumW > 0) {
          for (let i = 0; i < stateEntry.result.length; i++) {
            const add = (weights[i] / sumW) * extraVotes;
            stateEntry.result[i].votes = ensureNumber(stateEntry.result[i].votes, 0) + add;
          }
        } else {
          proportionalize(stateEntry, extraVotes);
        }
      } else {
        proportionalize(stateEntry, extraVotes);
      }
    }

    finalizeStateResult(stateEntry);
  }

  function applyRedistributionToArray(stateArray, removedPk, mode, opts) {
    if (!Array.isArray(stateArray)) return;
    for (const st of stateArray) {
      if (!st || !Array.isArray(st.result)) continue;
      redistributeStateResult(st, removedPk, mode, opts);
    }
  }

  function rebuildFinalOverallFromStates() {
    const candIds = unique(
      (e.final_state_results || [])
        .flatMap((st) => (Array.isArray(st.result) ? st.result : []))
        .map((r) => Number(r.candidate))
        .filter((pk) => Number.isFinite(pk))
    );

    e.final_overall_results = candIds.map((pk) => ({
      candidate: pk,
      electoral_votes: 0,
      popular_votes: 0,
    }));

    handleFinalResults(500);
  }

  // A() wrapper for future polls/results
  function patchAOnce() {
    if (window.__ctApatched) return;
    const origA = window.A;
    if (typeof origA !== 'function') return;

    window.__ct_dropouts ||= [];
    window.A = function patchedA(t) {
      const res = origA.call(this, t);
      const arr = Array.isArray(res) ? res : (Array.isArray(res?.[1]) ? res[1] : null);
      if (!Array.isArray(arr) || !window.__ct_dropouts?.length) return res;

      for (const rule of window.__ct_dropouts) {
        applyRedistributionToArray(arr, rule.removedPk, rule.mode, {
          target: rule.target,
          weights: rule.weights,
          insertTargetIfMissing: true,
        });
      }
      return res;
    };
    window.__ctApatched = true;
  }

  // storage for backups to allow restore
  window.__ct_dropout_backups ||= {}; // { [pk]: { removedCSMRows: [], wasActive: 0|1, wasInOpponents: boolean } }

  window.clearDropouts = function clearDropouts() {
    window.__ct_dropouts = [];
  };

  window.listDropouts = function listDropouts() {
    return (window.__ct_dropouts || []).slice();
  };

  window.removeDropoutRule = function removeDropoutRule(pk) {
    if (!window.__ct_dropouts) return;
    window.__ct_dropouts = window.__ct_dropouts.filter((r) => Number(r.removedPk) !== Number(pk));
  };

  function deepClone(obj) {
    try { return JSON.parse(JSON.stringify(obj)); } catch { return obj; }
  }

  // the API.
  window.removeCandidate = function removeCandidate(removedPk, options = {}) {
    const {
      mode = 'proportional', // 'proportional' | 'toCandidate' | 'weights'
      target,
      weights,
      touch = 'polls', // 'polls' | 'final' | 'both' | 'none'
      removeFromOpponentList = true,
      deactivateInRoster = true,
      insertTargetIfMissing = true,
    } = options;

    if (Number(removedPk) === Number(e.candidate_id)) {
      console.warn('removeCandidate: refusing to remove the player candidate.');
      return;
    }

    // init backups container for this pk
    const bk = (window.__ct_dropout_backups[removedPk] ||= { removedCSMRows: [], wasActive: null, wasInOpponents: null });

    // hide from roster and opponent list
    if (removeFromOpponentList && Array.isArray(e.opponents_list)) {
      bk.wasInOpponents ??= e.opponents_list.includes(Number(removedPk));
      e.opponents_list = e.opponents_list.filter((pk) => Number(pk) !== Number(removedPk));
    }

    if (deactivateInRoster && Array.isArray(e.candidate_json)) {
      const c = e.candidate_json.find((c) => Number(c.pk) === Number(removedPk));
      if (c && c.fields) {
        if (bk.wasActive == null) bk.wasActive = c.fields.is_active;
        c.fields.is_active = 0;
      }
    }

    // for pure proportional dropout we delete multipliers; for transfer modes we keep them
    if (mode === 'proportional') {
      const arr = (e.candidate_state_multiplier_json || []);
      const kept = [];
      const removedRows = [];
      for (const row of arr) {
        if (Number(row?.fields?.candidate) === Number(removedPk)) {
          removedRows.push(deepClone(row));
        } else {
          kept.push(row);
        }
      }
      bk.removedCSMRows = removedRows;
      e.candidate_state_multiplier_json = kept;
    }

    // register/patch for future polls and results
    patchAOnce();
    window.__ct_dropouts ||= [];
    window.__ct_dropouts = window.__ct_dropouts.filter((r) => Number(r.removedPk) !== Number(removedPk));
    window.__ct_dropouts.push({ removedPk: Number(removedPk), mode, target: Number(target), weights });

    // rewrite any cached arrays now if requested
    if (touch === 'polls' || touch === 'both') {
      let pollStates = null;
      if (Array.isArray(e.current_results)) {
        const maybeStates = e.current_results[1];
        if (Array.isArray(maybeStates) && maybeStates[0]?.result) {
          pollStates = maybeStates;
        }
      }
      if (Array.isArray(pollStates)) {
        applyRedistributionToArray(pollStates, removedPk, mode, { target, weights, insertTargetIfMissing });
      }
    }

    if ((touch === 'final' || touch === 'both') && Array.isArray(e.final_state_results)) {
      applyRedistributionToArray(e.final_state_results, removedPk, mode, { target, weights, insertTargetIfMissing });
      rebuildFinalOverallFromStates();
    }

    console.info(
      `removeCandidate(${removedPk}) done. Mode: ${mode}${
        mode === 'toCandidate' ? ` -> ${target}` : mode === 'weights' ? ' (weights)' : ''
      }. Touch: ${touch}.`
    );
  };

  window.restoreCandidate = function restoreCandidate(pk, options = {}) {
    const {
      touch = 'polls', // 'polls' | 'final' | 'both' | 'none'
      addToOpponentList = true, // re-add to opponents_list if missing
      reactivateInRoster = true, // set is_active back to 1 (or previous value if backed up)
      preferBackupMultipliers = true, // if we deleted multipliers before, restore from backup
    } = options;

    if (Number(pk) === Number(e.candidate_id)) {
      console.warn('restoreCandidate: player candidate is already active.');
      return;
    }

    // remove dropout redistribution rule for this candidate
    window.removeDropoutRule?.(pk);

    // restore multipliers if we backed them up (only relevant if we did a proportional delete)
    const bk = window.__ct_dropout_backups?.[pk];
    if (preferBackupMultipliers && bk && Array.isArray(bk.removedCSMRows) && bk.removedCSMRows.length) {
      const existingKey = new Set(
        (e.candidate_state_multiplier_json || []).map(
          (row) => `${row?.fields?.candidate}|${row?.fields?.state}`
        )
      );
      for (const row of bk.removedCSMRows) {
        const key = `${row.fields.candidate}|${row.fields.state}`;
        if (!existingKey.has(key)) {
          e.candidate_state_multiplier_json.push(deepClone(row));
          existingKey.add(key);
        }
      }
      // clear backup so repeated restore doesn't duplicate
      bk.removedCSMRows = [];
    }

    // re-add to opponents_list if requested
    if (addToOpponentList && Array.isArray(e.opponents_list)) {
      if (!e.opponents_list.includes(Number(pk))) {
        e.opponents_list.push(Number(pk));
      }
    } else if (bk?.wasInOpponents && Array.isArray(e.opponents_list) && !e.opponents_list.includes(Number(pk))) {
      // if caller didn't force add, but we know it used to be there, re-add to match original state
      e.opponents_list.push(Number(pk));
    }

    // reactivate in roster if requested
    if (reactivateInRoster && Array.isArray(e.candidate_json)) {
      const c = e.candidate_json.find((c) => Number(c.pk) === Number(pk));
      if (c && c.fields) {
        const prev = bk?.wasActive;
        c.fields.is_active = (prev != null) ? prev : 1;
      }
    }

    // refresh cached arrays if requested
    if (touch === 'polls' || touch === 'both') {
      try {
        const polls = A(2);
        // update e.current_results in the same shape as the code expects
        const latest = window.getLatestRes ? window.getLatestRes(polls) : null;
        e.current_results = latest ? [latest[0], polls] : polls;
      } catch (err) {
        console.warn('restoreCandidate: failed to recompute polls:', err);
      }
    }

    if (touch === 'final' || touch === 'both') {
      try {
        e.final_state_results = A(1);
        rebuildFinalOverallFromStates();
      } catch (err) {
        console.warn('restoreCandidate: failed to recompute final via A(1):', err);
      }
    }

    console.info(`restoreCandidate(${pk}) complete. Touch: ${touch}. Rule removed; candidate reactivated.`);
  };
})();
