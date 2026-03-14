// Applies volatility to global multipliers in the answer score global JSON
// taken from 1992: Moonbeam
function volatilizeMultiplier_Conservative(baseValue, volatilityFactor = 0.25) {
  const variance = baseValue * volatilityFactor;
  const randomAdjustment = (Math.random() - 0.5) * variance * 2;
  return Math.round((baseValue + randomAdjustment) * 1e6) / 1e6;
}

function applyVolatilityToGlobals() {
  if (campaignTrail_temp._asgVolApplied) return;
  const asg = campaignTrail_temp.answer_score_global_json;
  if (!Array.isArray(asg)) return;

  asg.forEach((entry) => {
    const f = entry.fields;
    let vr = f.volatility_range;

    if (!vr || (Array.isArray(vr) && vr[0] === 0 && vr[1] === 0)) {
      // auto-generate a range based on the multiplier
      const baseImpact = Math.abs(f.global_multiplier);

      // we want volatility to be between 10% and 30% of the impact
      vr = [baseImpact * 0.1, baseImpact * 0.3];
    }

    const factor = vr[0] + Math.random() * (vr[1] - vr[0]);
    f.global_multiplier = volatilizeMultiplier_Conservative(f.global_multiplier, factor);
  });

  campaignTrail_temp._asgVolApplied = true;
}
applyVolatilityToGlobals();
