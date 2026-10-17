// This forces candidates to appear at tables
// depending on the result
window.forcedTickets = window.forcedTickets || [];

window.forceTable = function(candPk, stateAbbrev, minPercent = 1e-8, minVotes = 0) {
  const parsedCand = Number(candPk);
  const parsedAbbrev = String(stateAbbrev).toUpperCase();

  const exists = window.forcedTickets.some(
    t => t.candPk === parsedCand && t.stateAbbrev === parsedAbbrev
  );

  if (!exists) {
    window.forcedTickets.push({
      candPk: parsedCand,
      stateAbbrev: parsedAbbrev,
      minPercent,
      minVotes
    });
  }
};

if (typeof window.A === "function") {
  const originalA = window.A;

  window.A = function(...args) {
    const res = originalA.apply(this, args);
    if (!res || !Array.isArray(res)) return res;

    res.forEach((stateResult) => {
      const stateAbbr = (stateResult.abbr || "").toUpperCase();

      window.forcedTickets.forEach(({ candPk, stateAbbrev, minPercent, minVotes }) => {
        if (stateAbbrev === stateAbbr) {
          let candRes = stateResult.result.find(r => Number(r.candidate) === candPk);

          // if the candidate isn't present in the state's result, insert them
          if (!candRes) {
            candRes = {
              candidate: candPk,
              result: 0,
              percent: 0,
              votes: 0,
              electoral_votes: 0
            };
            stateResult.result.push(candRes);
          }

          // override zero/empty values with placeholders
          if (candRes.percent <= 0) {
            candRes.percent = minPercent;
          }
          if (candRes.votes <= 0) {
            candRes.votes = minVotes;
          }
        }
      });
    });

    return res;
  };
}