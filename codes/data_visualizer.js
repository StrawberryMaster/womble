// The data visualizer from 2012LBM
// many thanks to routevenus for their work here!
(function () {
  const VISUALIZATION_MODES = {
    SOLID: 'solid', MARGINS: 'margins', VOTE_SHARE: 'vote_share',
    CANDIDATE_STRENGTH: 'candidate_strength', COMPETITIVENESS: 'competitiveness',
    TURNOUT_CHANGE: 'turnout_change', TIPPING_POINT: 'tipping_point',
    ISSUE_STANCE: 'issue_stance', ISSUE_WEIGHT: 'issue_weight',
    CANDIDATE_ISSUE_ALIGNMENT: 'candidate_issue_alignment', COALITION_BUILDER: 'coalition_builder',
    CANDIDATE_COMBINER: 'candidate_combiner', SENATE_RACES: 'senate_races',
    HOUSE_COMPOSITION: 'house_composition'
  };

  const SENATE_INCUMBENT_PARTIES = {
    'AZ': 'R', 'CA': 'D', 'CT': 'I', 'DE': 'D', 'FL': 'D', 'HI': 'D', 'IN': 'R', 'ME': 'R',
    'MD': 'D', 'MA': 'R', 'MI': 'D', 'MN': 'D', 'MS': 'R', 'MO': 'D', 'MT': 'D', 'NE': 'D',
    'NV': 'R', 'NJ': 'D', 'NM': 'D', 'NY': 'D', 'ND': 'D', 'OH': 'D', 'PA': 'D', 'RI': 'D',
    'TN': 'R', 'TX': 'R', 'UT': 'R', 'VT': 'I', 'VA': 'D', 'WA': 'D', 'WV': 'D', 'WI': 'D', 'WY': 'R'
  };

  let currentMode = VISUALIZATION_MODES.SOLID, selectedCandidateIndex = 0, candidatePerformanceMode = 'absolute';
  let styleCache = {}, isInitialized = false, candidateMaxPercentages = {}, stateDataCache = {};
  let selectedIssueIndex = 0, selectedAlignmentCandidateIndex = 0, alignmentComparisonMode = 'single';
  let selectedComparisonCandidates = [0, 1, 2, 3], coalitionCandidateIndex = 0, coalitionVoteShare = 0.5;
  let coalitionMode = 'solid', coalitionResults = {}, candidates = [], coalitionTargetState = 'National', coalitionStateOverrides = {};
  let combinedCandidateIndex1 = 0, combinedCandidateIndex2 = 2, combinedCandidateIndex3 = -1, combinerMode = 'two', combinerResults = {};
  let showAverageIssueStance = false, headToHeadMode = false, headToHeadTeam1Index1 = 0, headToHeadTeam1Index2 = 1;
  let headToHeadTeam2Index1 = 2, headToHeadTeam2Index2 = 3, headToHeadResults = {}, legendPosition = null, legendMoved = false;

  const colorCache = {}, stateUpdateQueue = [];
  let animationFrameRequested = false;

  const dragState = { isDragging: false, currentElement: null, startX: 0, startY: 0, startLeft: 0, startTop: 0 };

  function cr(tag, props = {}, style = {}, children = []) {
    const el = document.createElement(tag);
    Object.assign(el, props);
    Object.assign(el.style, style);
    children.forEach(c => {
      if (c != null) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  function makeLegendTable(items, extraRowCallback = null) {
    const table = cr('table', {}, { width: '100%', borderCollapse: 'collapse' });
    items.forEach(item => {
      const tr = table.insertRow();
      const colorCell = tr.insertCell();
      Object.assign(colorCell.style, { width: '14px', height: '12px', backgroundColor: item.color, border: '1px solid #ddd' });
      const labelCell = tr.insertCell();
      labelCell.innerHTML = item.label;
      Object.assign(labelCell.style, { paddingLeft: '6px', fontSize: '10px' });
      if (extraRowCallback) extraRowCallback(tr, item);
    });
    return table;
  }

  function makeDraggable(element, handle = null) {
    const dragHandle = handle || element;
    dragHandle.style.cursor = 'move';
    if (!handle) element.style.borderTop = '3px solid #007acc';
    else {
      handle.style.background = 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)';
      handle.style.borderBottom = '1px solid #ccc';
    }

    const drag = (e) => {
      if (!dragState.isDragging || dragState.currentElement !== element) return;
      e.preventDefault();
      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;
      const newLeft = Math.max(0, Math.min(dragState.startLeft + deltaX, window.innerWidth - element.offsetWidth));
      const newTop = Math.max(0, Math.min(dragState.startTop + deltaY, window.innerHeight - element.offsetHeight));
      element.style.left = newLeft + 'px';
      element.style.top = newTop + 'px';
    };

    const stopDrag = (e) => {
      if (!dragState.isDragging || dragState.currentElement !== element) return;
      dragState.isDragging = false;
      dragState.currentElement = null;
      element.style.zIndex = '1000';
      element.style.opacity = '1';
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.body.style.userSelect = '';

      if (['map_legend', 'map_controls'].includes(element.id)) {
        const rect = element.getBoundingClientRect();
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (element.id === 'map_legend') {
          legendPosition = { left: rect.left, top: rect.top + scrollTop };
          legendMoved = true;
        }
      }
    };

    const startDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragState.isDragging = true;
      dragState.currentElement = element;
      const rect = element.getBoundingClientRect();
      dragState.startX = e.clientX;
      dragState.startY = e.clientY;
      dragState.startLeft = rect.left;
      dragState.startTop = rect.top;

      Object.assign(element.style, {
        position: 'absolute', left: rect.left + 'px', top: rect.top + 'px',
        right: 'auto', bottom: 'auto', zIndex: '10001', opacity: '0.9'
      });

      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
      document.body.style.userSelect = 'none';
    };

    dragHandle.addEventListener('mousedown', startDrag);
    dragHandle.addEventListener('touchstart', e => startDrag(new MouseEvent('mousedown', { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })));
    document.addEventListener('touchmove', e => dragState.isDragging && dragState.currentElement === element && drag(new MouseEvent('mousemove', { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })) && e.preventDefault(), { passive: false });
    document.addEventListener('touchend', e => dragState.isDragging && dragState.currentElement === element && stopDrag(new MouseEvent('mouseup', {})));
  }

  function getActiveCandidates() {
    if (candidates.length) return candidates;
    const res = campaignTrail_temp.final_state_results[0]?.result || [];
    candidates = res.map(r => campaignTrail_temp.candidate_json.find(c => c.pk === r.candidate)).filter(Boolean);
    return candidates;
  }

  function hexToRgb(hex) {
    const norm = hex.replace(/^#/, '');
    if (colorCache[norm]?.rgb) return colorCache[norm].rgb;
    const num = parseInt(norm, 16);
    const rgb = [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
    colorCache[norm] = { rgb };
    return rgb;
  }

  function rgbToHex(r, g, b) {
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));
    const key = `${r},${g},${b}`;
    if (colorCache[key]?.hex) return colorCache[key].hex;
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    colorCache[key] = { hex };
    return hex;
  }

  function interpolateColor(c1, c2, factor = 0.5) {
    if (factor <= 0) return c1;
    if (factor >= 1) return c2;
    return c1.map((v, i) => Math.round(v + factor * (c2[i] - v)));
  }

  function varyHexColor(hex, variationFrac = 0.05) {
    return rgbToHex(...hexToRgb(hex).map(c => Math.max(0, Math.min(255, Math.round(c + (Math.random() * 2 - 1) * variationFrac * 255)))));
  }

  function darkenColor(color, amount = 30) {
    const key = `dark_${color}_${amount}`;
    if (colorCache[key]) return colorCache[key];
    return colorCache[key] = rgbToHex(...hexToRgb(color).map(v => Math.max(0, v - amount)));
  }

  function blendMarginColor(baseColor, margin) {
    const key = `margin_${baseColor}_${(margin * 1000 | 0)}`;
    if (colorCache[key]) return colorCache[key];
    let factor = margin < 0.01 ? 0.15 :
                 margin < 0.05 ? 0.15 + (margin - 0.01) * 8 :
                 margin < 0.10 ? 0.47 + (margin - 0.05) * 5 :
                 margin < 0.15 ? 0.72 + (margin - 0.10) * 3 :
                 0.87 + Math.min((margin - 0.15) * 1.3, 0.13);
    return colorCache[key] = rgbToHex(...interpolateColor([255, 255, 255], hexToRgb(baseColor), factor));
  }

  function blendPerformanceColor(baseColor, percent, data) {
    const key = `perf_${baseColor}_${percent.toFixed(4)}_${data.max.toFixed(4)}`;
    if (colorCache[key]) return colorCache[key];

    const baseRGB = hexToRgb(baseColor);
    const hasEVs = campaignTrail_temp.final_overall_results.find(r => r.candidate == data.pk)?.electoral_votes > 0;
    let targetRGB, intensity;

    if (!hasEVs || data.max <= 0.15) {
      const norm = percent / Math.max(data.max, 0.001);
      if (norm > 0.85) { targetRGB = baseRGB; intensity = 0.9; }
      else if (norm > 0.70) { targetRGB = baseRGB.map(c => Math.min(255, c + 15)); intensity = 0.75; }
      else if (norm > 0.55) { targetRGB = baseRGB.map(c => Math.min(255, c + 35)); intensity = 0.60; }
      else if (norm > 0.40) { targetRGB = baseRGB.map(c => Math.min(255, c + 60)); intensity = 0.45; }
      else if (norm > 0.25) { targetRGB = baseRGB.map(c => Math.min(255, c + 90)); intensity = 0.35; }
      else if (norm > 0.10) { targetRGB = baseRGB.map(c => Math.min(255, c + 120)); intensity = 0.25; }
      else { targetRGB = baseRGB.map(c => Math.min(255, c + 150)); intensity = 0.18; }
    } else if (data.max > 0.75 && data.max - data.p90 > 0.15) {
      if (percent > data.p90) { targetRGB = baseRGB; intensity = 0.95; }
      else if (percent > data.avg) { targetRGB = baseRGB.map(c => Math.min(255, c + 30)); intensity = 0.6 + ((percent - data.avg) / (data.p90 - data.avg || 1) * 0.3); }
      else if (percent > data.p10) { targetRGB = baseRGB.map(c => Math.min(255, c + 80)); intensity = 0.3 + ((percent - data.p10) / (data.avg - data.p10 || 1) * 0.25); }
      else { targetRGB = baseRGB.map(c => Math.min(255, c + 120)); intensity = 0.2 + (data.p10 > 0 ? (percent / data.p10) * 0.15 : 0); }
    } else if (data.max > 0.40) {
      const norm = percent / data.max;
      if (norm > 0.8) { targetRGB = baseRGB; intensity = 0.85 + (norm - 0.8) * 0.75; }
      else if (norm > 0.6) { targetRGB = baseRGB.map(c => Math.min(255, c + 20)); intensity = 0.7 + (norm - 0.6) * 0.75; }
      else if (norm > 0.4) { targetRGB = baseRGB.map(c => Math.min(255, c + 50)); intensity = 0.5 + (norm - 0.4) * 1.0; }
      else if (norm > 0.2) { targetRGB = baseRGB.map(c => Math.min(255, c + 80)); intensity = 0.3 + (norm - 0.2) * 1.0; }
      else { targetRGB = baseRGB.map(c => Math.min(255, c + 110)); intensity = 0.2 + norm * 0.5; }
    } else if (data.max > 0.15) {
      const exp = Math.pow(percent / data.max, 0.7);
      if (exp > 0.7) { targetRGB = baseRGB.map(c => Math.min(255, c + 10)); intensity = 0.7 + (exp - 0.7) * 0.8; }
      else if (exp > 0.4) { targetRGB = baseRGB.map(c => Math.min(255, c + 40)); intensity = 0.45 + (exp - 0.4) * 0.8; }
      else { targetRGB = baseRGB.map(c => Math.min(255, c + 80)); intensity = 0.25 + exp * 0.5; }
    }
    return colorCache[key] = rgbToHex(...interpolateColor([255, 255, 255], targetRGB, intensity));
  }

  function blendRelativePerformanceColor(baseColor, relPct, avg) {
    const key = `rel_perf_${baseColor}_${relPct.toFixed(4)}_${avg.toFixed(4)}`;
    if (colorCache[key]) return colorCache[key];
    const baseRGB = hexToRgb(baseColor);
    let targetRGB, intensity;

    if (avg < 0.10) {
      const ratio = avg > 0 ? (relPct + avg) / avg : 1;
      if (ratio > 2.0) { targetRGB = baseRGB.map(c => Math.max(0, c - 30)); intensity = 0.95; }
      else if (ratio > 1.5) { targetRGB = baseRGB.map(c => Math.max(0, c - 20)); intensity = 0.85; }
      else if (ratio > 1.2) { targetRGB = baseRGB; intensity = 0.75; }
      else if (ratio > 0.8) { targetRGB = baseRGB.map(c => Math.min(255, c + 30)); intensity = 0.60; }
      else if (ratio > 0.5) { targetRGB = baseRGB.map(c => Math.min(255, c + 60)); intensity = 0.45; }
      else if (ratio > 0.2) { targetRGB = baseRGB.map(c => Math.min(255, c + 90)); intensity = 0.30; }
      else { targetRGB = baseRGB.map(c => Math.min(255, c + 120)); intensity = 0.20; }
    } else {
      if (relPct > 0.15) { targetRGB = baseRGB.map(c => Math.max(0, c - 30)); intensity = 0.95; }
      else if (relPct > 0.10) { targetRGB = baseRGB.map(c => Math.max(0, c - 20)); intensity = 0.90; }
      else if (relPct > 0.05) { targetRGB = baseRGB.map(c => Math.max(0, c - 10)); intensity = 0.85; }
      else if (relPct > 0.02) { targetRGB = baseRGB; intensity = 0.80; }
      else if (relPct > -0.02) { targetRGB = baseRGB.map(c => Math.min(255, c + 20)); intensity = 0.65; }
      else if (relPct > -0.05) { targetRGB = baseRGB.map(c => Math.min(255, c + 40)); intensity = 0.50; }
      else if (relPct > -0.10) { targetRGB = baseRGB.map(c => Math.min(255, c + 70)); intensity = 0.35; }
      else if (relPct > -0.15) { targetRGB = baseRGB.map(c => Math.min(255, c + 100)); intensity = 0.25; }
      else { targetRGB = baseRGB.map(c => Math.min(255, c + 130)); intensity = 0.15; }
    }
    return colorCache[key] = rgbToHex(...interpolateColor([255, 255, 255], targetRGB, intensity));
  }

  function getCompetitivenessColor(margin) {
    const m = margin;
    return m < 0.01 ? "#FF0000" : m < 0.025 ? "#FF3300" : m < 0.05 ? "#FF6600" :
           m < 0.075 ? "#FF9900" : m < 0.10 ? "#FFCC00" : m < 0.15 ? "#FFFF00" :
           m < 0.20 ? "#AADD00" : m < 0.30 ? "#55BB00" : "#0000FF";
  }

  function getTurnoutChangeColor(c) {
    return c <= -10 ? "#8B0000" : c <= -7.5 ? "#B22222" : c <= -5 ? "#FF0000" :
           c <= -2.5 ? "#FF6347" : c <= -1 ? "#FFA07A" : c < 1 ? "#F5F5F5" :
           c < 2.5 ? "#90EE90" : c < 5 ? "#3CB371" : c < 7.5 ? "#2E8B57" :
           c < 10 ? "#228B22" : "#006400";
  }

  function getStanceNumber(val) {
    const params = campaignTrail_temp.global_parameter_json?.[0]?.fields;
    if (params) {
      if (val <= params.issue_stance_1_max) return 1;
      if (val <= params.issue_stance_2_max) return 2;
      if (val <= params.issue_stance_3_max) return 3;
      if (val <= params.issue_stance_4_max) return 4;
      if (val <= params.issue_stance_5_max) return 5;
      if (val <= params.issue_stance_6_max) return 6;
      return 7;
    }
    return val <= -0.71 ? 1 : val <= -0.42 ? 2 : val <= -0.13 ? 3 : val <= 0.16 ? 4 : val <= 0.45 ? 5 : val <= 0.74 ? 6 : 7;
  }

  function getIssueStanceColor(val) {
    return ["#8B0000", "#FF0000", "#FF8D1C", "#FFD700", "#32CD32", "#0000FF", "#000080"][getStanceNumber(val) - 1];
  }

  function getIssueWeightRange(idx) {
    const issue = campaignTrail_temp.issues_json?.[idx];
    if (!issue) return null;
    let min = Infinity, max = -Infinity, has = false;
    campaignTrail_temp.final_state_results.forEach(r => {
      const data = campaignTrail_temp.state_issue_score_json?.find(s => s.fields.state === r.state && s.fields.issue === issue.pk);
      if (data) { min = Math.min(min, data.fields.weight); max = Math.max(max, data.fields.weight); has = true; }
    });
    return has ? { min, max } : null;
  }

  function getIssueWeightColor(weight, idx) {
    const range = getIssueWeightRange(idx);
    if (!range) return "#F8F8FF";
    if (range.min === range.max) return "#C9C9C9";
    if ((range.max - range.min) <= 0.15) {
      const w = Math.min(weight, 1.0);
      return w < 0.1 ? "#F8F8FF" : w < 0.25 ? "#E6E6FA" : w < 0.4 ? "#B0C4DE" :
             w < 0.55 ? "#87CEEB" : w < 0.7 ? "#4682B4" : w < 0.85 ? "#1E90FF" : "#0000CD";
    }
    return rgbToHex(...interpolateColor([248, 248, 255], [0, 0, 205], Math.max(0, Math.min(1, (weight - range.min) / (range.max - range.min)))));
  }

  function getCandidateIssueAlignment(sScore, cScore) {
    const a = Math.abs(sScore - cScore);
    return a < 0.2 ? "#006400" : a < 0.4 ? "#228B22" : a < 0.6 ? "#32CD32" :
           a < 0.8 ? "#FFD700" : a < 1.0 ? "#FF8C00" : a < 1.2 ? "#FF4500" : "#8B0000";
  }

  function blendVoteShareColor(baseColor, voteShare) {
    const key = `voteshare_${baseColor}_${voteShare.toFixed(4)}`;
    if (colorCache[key]) return colorCache[key];
    const [r, g, b] = hexToRgb(baseColor).map(c => c / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b), diff = max - min;
    let h = 0, s = 0, l = (max + min) / 2;
    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
      h = (max === r ? (g - b) / diff + (g < b ? 6 : 0) : max === g ? (b - r) / diff + 2 : (r - g) / diff + 4) / 6;
    }
    const h2r = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const rgbFn = (h, s, l) => {
      if (s === 0) return [l * 255, l * 255, l * 255];
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
      return [h2r(p, q, h + 1 / 3) * 255, h2r(p, q, h) * 255, h2r(p, q, h - 1 / 3) * 255];
    };
    let nL, nS;
    if (voteShare < 0.10) { nL = 0.97; nS = Math.min(s * 0.15, 0.1); }
    else if (voteShare < 0.20) { nL = 0.95; nS = Math.min(s * 0.25, 0.2); }
    else if (voteShare < 0.30) { nL = 0.92; nS = Math.min(s * 0.4, 0.35); }
    else if (voteShare < 0.40) { nL = 0.88; nS = Math.min(s * 0.6, 0.5); }
    else if (voteShare < 0.50) { nL = 0.82; nS = Math.min(s * 0.8, 0.7); }
    else if (voteShare < 0.60) { nL = 0.72; nS = Math.min(s * 1.0, 0.85); }
    else if (voteShare < 0.70) { nL = 0.60; nS = Math.min(s * 1.1, 0.95); }
    else if (voteShare < 0.80) { nL = 0.48; nS = Math.min(s * 1.15, 1.0); }
    else if (voteShare < 0.90) { nL = 0.35; nS = Math.min(s * 1.2, 1.0); }
    else { nL = 0.25; nS = Math.min(s * 1.25, 1.0); }
    return colorCache[key] = rgbToHex(...rgbFn(h, nS, nL));
  }

  function calculatePercentile(values, p) {
    if (!values?.length) return 0;
    const s = [...values].sort((a, b) => a - b);
    return s[Math.floor(s.length * (p / 100))];
  }

  function getTurnoutChangeData() {
    const out = {};
    campaignTrail_temp.states_json.forEach(state => {
      let v = 0;
      const res = campaignTrail_temp.final_state_results.find(r => r.state === state.pk);
      if (res?.result) res.result.forEach(c => v += c.votes || 0);
      else v = state.fields.popular_votes;
      const orig = campaignTrail_temp.TurnoutSystem?.originalTurnouts?.[state.pk] || state.fields.popular_votes;
      out[state.pk] = orig > 0 ? ((v - orig) / orig) * 100 : 0;
    });
    return out;
  }

  function analyzePerformanceData() {
    candidateMaxPercentages = {};
    getActiveCandidates().forEach(c => {
      candidateMaxPercentages[c.pk] = { max: 0, min: 1, avg: 0, median: 0, counts: 0, percentiles: [], pk: c.pk, hasElectoralVotes: false };
    });
    campaignTrail_temp.final_state_results.forEach(s => {
      if (s.abbr === "DC") return;
      s.result.forEach(r => {
        const d = candidateMaxPercentages[r.candidate];
        if (d) { d.max = Math.max(d.max, r.percent); d.min = Math.min(d.min, r.percent); d.avg += r.percent; d.counts++; d.percentiles.push(r.percent); }
      });
    });
    Object.values(candidateMaxPercentages).forEach(d => {
      if (d.counts > 0) {
        d.avg /= d.counts;
        d.percentiles.sort((a, b) => a - b);
        d.median = d.percentiles[Math.floor(d.percentiles.length / 2)];
        d.p10 = calculatePercentile(d.percentiles, 10);
        d.p90 = calculatePercentile(d.percentiles, 90);
        d.p95 = calculatePercentile(d.percentiles, 95);
      }
    });
  }

  function getPerformanceThresholds(pk) {
    const d = candidateMaxPercentages[pk];
    if (!d || d.counts === 0) return [0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05];
    let max = d.max, thresholds;
    const hasEV = campaignTrail_temp.final_overall_results.find(r => r.candidate == pk)?.electoral_votes > 0;
    const dcRes = campaignTrail_temp.final_state_results.find(r => r.abbr === "DC")?.result.find(c => c.candidate === pk);
    if (dcRes && dcRes.percent === max && max > d.p90 * 1.3 && d.p90 > 0.10) max = d.p90 * 1.1;

    if (!hasEV || max <= 0.15) {
      if (max > 0.08) thresholds = [max, max * 0.85, max * 0.7, max * 0.55, max * 0.4, max * 0.25, max * 0.12];
      else if (max > 0.03) thresholds = [max, max * 0.8, max * 0.6, max * 0.4, max * 0.25, max * 0.1];
      else { const inc = max / 5; thresholds = [max, max - inc * 0.8, max - inc * 1.8, max - inc * 2.9, max - inc * 4.1]; }
    } else if (max > 0.50) {
      if (max - d.p90 > 0.20) thresholds = [max, Math.max(d.p90, max * 0.88), Math.max(d.avg + (d.p90 - d.avg) * 0.6, max * 0.75), Math.max(d.avg, max * 0.62), Math.max(d.avg * 0.7, max * 0.45), Math.max(d.p10, max * 0.28), Math.max(d.min, max * 0.15)];
      else thresholds = [max, max * 0.85, max * 0.7, max * 0.55, max * 0.4, max * 0.25, max * 0.12];
    } else if (max > 0.25) thresholds = [max, max * 0.82, max * 0.65, max * 0.48, max * 0.32, max * 0.18, max * 0.08];
    else { const base = Math.pow(max, 1 / 6); thresholds = [max, Math.pow(base, 5), Math.pow(base, 4.2), Math.pow(base, 3.5), Math.pow(base, 2.8), Math.pow(base, 2), Math.pow(base, 1.2)]; }

    thresholds = thresholds.filter(v => v > 0).filter((v, i, a) => i === 0 || v < a[i - 1] * 0.9);
    if (thresholds.length < 4) { const st = max / 4; thresholds = [max, max - st, max - st * 2, max - st * 3].filter(v => v > 0); }
    return thresholds;
  }

  function getCoalitionPerformanceThresholds(d) {
    if (!d || d.max === d.min) return [0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05];
    const max = Math.max(d.max, 0.01);
    if (max > 0.75 && max - d.p90 > 0.15) return max > d.p90 ? [max, d.p90 + (max - d.p90) * 0.5, d.p90, d.avg + (d.p90 - d.avg) * 0.5, d.avg, d.p10, d.min].filter((v, i, a) => i === 0 || v < a[i - 1] * 0.95) : [max, d.p90, d.avg, d.p10, d.min];
    else if (max > 0.40) return [1, 0.95, 0.9, 0.8, 0.65, 0.5, 0.3].map(s => Math.max(max * s, max - (0.04 * (1 - s) * 10)));
    else if (max > 0.10) return [max, max * 0.8, max * 0.6, max * 0.4, max * 0.25, max * 0.15];
    else if (max > 0.03) return [max, max * 0.75, max * 0.5, max * 0.25, max * 0.1];
    else { const st = max / 4; return [max, max - st, max - st * 2, max - st * 3, 0].filter(v => v > 0); }
  }

  function applyColorVariations() {
    if (window._colorVariationsApplied) return;
    campaignTrail_temp.candidate_json.forEach(c => {
      const f = c.fields;
      f._original_color_hex = f._original_color_hex || f.color_hex;
      f._original_secondary_color_hex = f._original_secondary_color_hex || f.secondary_color_hex || f.color_hex;
      f.color_hex = varyHexColor(f._original_color_hex, 0.05);
      f.secondary_color_hex = f.secondary_color_hex ? varyHexColor(f._original_secondary_color_hex, 0.05) : rgbToHex(...interpolateColor(hexToRgb(f.color_hex), [255, 255, 255], 0.7));
    });
    if (window.HistHexcolour?.map) window.HistHexcolour = window.HistHexcolour.map(h => varyHexColor(h, 0.05));
    window._colorVariationsApplied = true;
  }

  function getTopCandidates(limit = 5) {
    let tot = 0, cands = campaignTrail_temp.final_overall_results.map(r => {
      tot += r.popular_votes;
      return { pk: r.candidate, candidate: campaignTrail_temp.candidate_json.find(c => c.pk === r.candidate), electoral_votes: r.electoral_votes, popular_votes: r.popular_votes };
    }).filter(c => c.candidate);
    const win = cands.filter(c => c.electoral_votes > 0).sort((a, b) => b.electoral_votes !== a.electoral_votes ? b.electoral_votes - a.electoral_votes : b.popular_votes - a.popular_votes);
    return win.length ? win.slice(0, limit) : cands.filter(c => c.popular_votes / tot > 0.05).sort((a, b) => b.popular_votes - a.popular_votes).slice(0, limit);
  }

  function getSenateRaceData() {
    const d = window.campaignTrail_temp?.__congress2012?.senateDetails?.byState;
    if (!d) return null;
    const m = new Map((window.campaignTrail_temp.states_json || []).map(s => [s.fields.name, s.fields.abbr]));
    const out = {};
    for (const n in d) {
      const abbr = m.get(n);
      if (!abbr) continue;
      let dem = 0, rep = 0, trd = 0;
      d[n].results.forEach(c => { const p = c.party.toLowerCase(); if (p.includes('dem')) dem += c.pct; else if (p.includes('rep')) rep += c.pct; else trd += c.pct; });
      out[abbr] = { dem, rep, trd };
    }
    return out;
  }

  function getHouseCompositionData() {
    const E = window.campaignTrail_temp || window.e;
    const con = E.__congress2012;
    if (!con?.house) return { _totals: { dem: 0, rep: 0, ind: 0, total: 435 } };
    const tDem = con.house.dem, pool = [];
    let dId, rId, cDem = 0;
    E.candidate_json.forEach(c => { const p = (c.fields.party || "").toLowerCase(); if (p.includes("dem")) dId = c.pk; if (p.includes("rep")) rId = c.pk; });
    (E.states_json || []).forEach(s => {
      const abbr = s.fields.abbr, m = window.HOUSE_2012_DATA?.[abbr] || { seats: 0, bias: 0 };
      if (m.seats === 0) return;
      const res = E.final_state_results.find(r => r.state === s.pk);
      const dV = res?.result.find(r => r.candidate === dId)?.percent || 0.5, rV = res?.result.find(r => r.candidate === rId)?.percent || 0.5;
      const p = dV / (dV + rV || 1), iS = (abbr === "OH" && rV < 0.46) ? 1 : 0;
      let dS = Math.round((m.seats - iS) * Math.max(0, Math.min(1, p + m.bias)));
      pool.push({ abbr, seats: m.seats, iS, dS, p, bias: m.bias, score: p + m.bias });
      cDem += dS;
    });
    for (let safe = 0; cDem !== tDem && safe < 1000; safe++) {
      const step = tDem > cDem ? 1 : -1;
      pool.sort((a, b) => step === 1 ? b.score - a.score : a.score - b.score);
      for (const s of pool) {
        if (step === 1 && s.dS < s.seats - s.iS) { s.dS++; cDem++; break; }
        if (step === -1 && s.dS > 0) { s.dS--; cDem--; break; }
      }
    }
    const out = { _totals: { dem: tDem, rep: 435 - tDem - (con.house.ind || 0), ind: con.house.ind || 0, total: 435 } };
    pool.forEach(s => {
      const rS = s.seats - s.iS - s.dS, dPct = (s.dS / s.seats) * 100, rPct = (rS / s.seats) * 100;
      let c = "#E6E6E6";
      if (s.iS > 0 && s.abbr === "OH") c = "#FFDE3A";
      else if (dPct > 50) c = dPct >= 100 ? "#0000AA" : dPct >= 80 ? "#2b6cb8" : dPct >= 70 ? "#0487E6" : dPct >= 60 ? "#3A9FE0" : "#9DCDF3";
      else if (rPct > 50) c = rPct >= 100 ? "#880000" : rPct >= 80 ? "#c12525" : rPct >= 70 ? "#DD2929" : rPct >= 60 ? "#FF3333" : "#FF9999";
      else if (dPct === 50 && rPct === 50) c = "#D896FF";
      out[s.abbr] = { demSeats: s.dS, repSeats: rS, indSeats: s.iS, seats: s.seats, color: c, demShare: s.p };
    });
    return out;
  }

  function prepareStyles() {
    if (Object.keys(styleCache).length > 0) return;
    applyColorVariations();
    analyzePerformanceData();
    const tChange = getTurnoutChangeData();
    styleCache = { solid: {}, margins: {}, candidate_strength: {}, competitiveness: {}, turnout_change: {}, vote_share: {}, issue_stance: {}, issue_weight: {}, candidate_issue_alignment: {}, tipping_point: {}, coalition_builder: {}, candidate_combiner: {}, senate_races: {}, house_composition: {} };
    if (!getActiveCandidates().length) return;

    const sD = getSenateRaceData();
    if (sD) Object.keys(sD).forEach(abbr => {
      const r = sD[abbr];
      let winC = "#C9C9C9", m = 0;
      if (r.dem > r.rep && r.dem > (r.trd || 0)) { winC = "#0487E6"; m = r.dem - Math.max(r.rep, r.trd || 0); }
      else if (r.rep > r.dem && r.rep > (r.trd || 0)) { winC = "#DD2929"; m = r.rep - Math.max(r.dem, r.trd || 0); }
      else if ((r.trd || 0) > 0) { winC = "#FFDE3A"; m = r.trd - Math.max(r.dem, r.rep); }
      const hm = blendMarginColor(winC, m), hg = (winC === "#C9C9C9") ? "#CCCCCC" : (
        ['D','R','I'][['#0487E6','#DD2929','#FFDE3A'].indexOf(winC)] === SENATE_INCUMBENT_PARTIES[abbr]
          ? {'D':'#92C5DE','R':'#F48882','I':'#999999'} : {'D':'#0671B0','R':'#CA0120','I':'#666666'}
      )[['D','R','I'][['#0487E6','#DD2929','#FFDE3A'].indexOf(winC)]];
      styleCache.senate_races[abbr] = { solidFill: winC, solidHoverFill: darkenColor(winC), marginFill: hm, marginHoverFill: darkenColor(hm), holdsGainsFill: hg, holdsGainsHoverFill: darkenColor(hg) };
    });

    const hD = getHouseCompositionData();
    Object.keys(hD).forEach(a => { if (a !== '_totals') styleCache.house_composition[a] = { fill: hD[a].color, hoverFill: hD[a].color }; });

    campaignTrail_temp.final_state_results.forEach(sr => {
      const abbr = sr.abbr, id = sr.state;
      stateDataCache[abbr] = { id, results: sr.result, turnoutChange: tChange[id] || 0 };
      if (sr.result_time <= 500 && sr.result.length) {
        const winId = sr.result[0].candidate, win = getActiveCandidates().find(c => c.pk === winId);
        if (win) {
          const m = sr.result.length >= 2 ? sr.result[0].percent - sr.result[1].percent : 1;
          const mc = blendMarginColor(win.fields.color_hex, m);
          styleCache.solid[abbr] = { fill: win.fields.color_hex, hoverFill: darkenColor(win.fields.color_hex) };
          styleCache.margins[abbr] = { fill: mc, hoverFill: darkenColor(mc) };
          const cc = getCompetitivenessColor(m);
          styleCache.competitiveness[abbr] = { fill: cc, hoverFill: darkenColor(cc) };
          const tc = getTurnoutChangeColor(tChange[id] || 0);
          styleCache.turnout_change[abbr] = { fill: tc, hoverFill: darkenColor(tc) };
          const vc = blendVoteShareColor(win.fields.color_hex, sr.result[0].percent);
          styleCache.vote_share[abbr] = { fill: vc, hoverFill: darkenColor(vc) };

          if (campaignTrail_temp.issues_json && campaignTrail_temp.state_issue_score_json) {
            styleCache.issue_stance[abbr] = { stanceValues: [] }; styleCache.issue_weight[abbr] = {}; styleCache.candidate_issue_alignment[abbr] = {};
            campaignTrail_temp.issues_json.forEach((iss, iIdx) => {
              const sid = campaignTrail_temp.state_issue_score_json.find(si => si.fields.state === id && si.fields.issue === iss.pk);
              if (sid) {
                const ss = sid.fields.state_issue_score, w = sid.fields.weight, sc = getIssueStanceColor(ss);
                styleCache.issue_stance[abbr][iIdx] = { fill: sc, hoverFill: darkenColor(sc), stanceValue: ss };
                styleCache.issue_stance[abbr].stanceValues.push(ss);
                const wc = getIssueWeightColor(w, iIdx);
                styleCache.issue_weight[abbr][iIdx] = { fill: wc, hoverFill: darkenColor(wc) };
                styleCache.candidate_issue_alignment[abbr][iIdx] = {};
                getActiveCandidates().forEach((cand, cIdx) => {
                  const cid = campaignTrail_temp.candidate_issue_score_json?.find(ci => ci.fields.candidate === cand.pk && ci.fields.issue === iss.pk);
                  const alignC = cid ? getCandidateIssueAlignment(ss, cid.fields.issue_score) : "#C9C9C9";
                  styleCache.candidate_issue_alignment[abbr][iIdx][cIdx] = { fill: alignC, hoverFill: darkenColor(alignC), alignment: cid ? Math.abs(ss - cid.fields.issue_score) : 999 };
                });
              }
            });
            if (styleCache.issue_stance[abbr].stanceValues.length) {
              const avg = styleCache.issue_stance[abbr].stanceValues.reduce((a, b) => a + b, 0) / styleCache.issue_stance[abbr].stanceValues.length;
              const ac = getIssueStanceColor(avg);
              styleCache.issue_stance[abbr].average = { fill: ac, hoverFill: darkenColor(ac), stanceValue: avg };
              styleCache.candidate_issue_alignment[abbr].average = {};
              getActiveCandidates().forEach((cand, cIdx) => {
                let t = 0, c = 0;
                campaignTrail_temp.issues_json.forEach(iss => {
                  const cid = campaignTrail_temp.candidate_issue_score_json?.find(ci => ci.fields.candidate === cand.pk && ci.fields.issue === iss.pk);
                  if (cid) { t += cid.fields.issue_score; c++; }
                });
                const cavg = c > 0 ? t / c : 0;
                const alignC = c > 0 ? getCandidateIssueAlignment(avg, cavg) : "#C9C9C9";
                styleCache.candidate_issue_alignment[abbr].average[cIdx] = { fill: alignC, hoverFill: darkenColor(alignC), alignment: c > 0 ? Math.abs(avg - cavg) : 999 };
              });
            }
          }

          styleCache.tipping_point[abbr] = { fill: "#C9C9C9", hoverFill: "#AAAAAA" };
          styleCache.coalition_builder[abbr] = { fill: "#C9C9C9", hoverFill: "#AAAAAA" };
          styleCache.candidate_strength[abbr] = {};
          const tot = campaignTrail_temp.final_overall_results.reduce((s, r) => s + r.popular_votes, 0);
          getActiveCandidates().forEach((cand, idx) => {
            const cr = sr.result.find(r => r.candidate === cand.pk), cd = candidateMaxPercentages[cand.pk];
            const nr = campaignTrail_temp.final_overall_results.find(r => r.candidate === cand.pk);
            const nAvg = nr && tot > 0 ? nr.popular_votes / tot : 0;
            if (cr) {
              const pc = blendPerformanceColor(cand.fields.color_hex, cr.percent, cd);
              const rpc = blendRelativePerformanceColor(cand.fields.color_hex, cr.percent - nAvg, nAvg);
              styleCache.candidate_strength[abbr][idx] = { fill: pc, hoverFill: darkenColor(pc), relativeFill: rpc, relativeHoverFill: darkenColor(rpc) };
            } else styleCache.candidate_strength[abbr][idx] = { fill: "#EEEEEE", hoverFill: "#DDDDDD", relativeFill: "#EEEEEE", relativeHoverFill: "#DDDDDD" };
          });
        }
      } else {
        ['solid', 'margins', 'competitiveness', 'turnout_change', 'vote_share', 'coalition_builder'].forEach(k => styleCache[k][abbr] = { fill: "#C9C9C9", hoverFill: "#AAAAAA" });
        styleCache.candidate_strength[abbr] = {}; getActiveCandidates().forEach((_, i) => styleCache.candidate_strength[abbr][i] = { fill: "#C9C9C9", hoverFill: "#AAAAAA" });
      }
      styleCache.candidate_combiner[abbr] = { fill: "#C9C9C9", hoverFill: "#AAAAAA" };
    });
  }

  function processStateUpdateQueue() {
    if (!stateUpdateQueue.length) return;
    if (window._isExporting) {
        stateUpdateQueue.forEach(u => u.shape.attr('fill', u.fill));
        stateUpdateQueue.length = 0;
        return;
    }
    if (animationFrameRequested) return;
    animationFrameRequested = true;
    requestAnimationFrame(() => {
      stateUpdateQueue.forEach(u => {
        u.shape.attr('fill', u.fill);
        if (typeof u.shape.data === 'function') { u.shape.data('originalFill', u.fill); u.shape.data('hoverFill', u.hoverFill); }
      });
      stateUpdateQueue.length = 0; animationFrameRequested = false;
    });
  }

  function calculateTippingPointPath() {
    const cand = getActiveCandidates()[selectedCandidateIndex];
    if (!cand) return null;
    const thresh = campaignTrail_temp.election_json?.[0]?.fields?.winning_electoral_vote_number || 270;
    const cEV = campaignTrail_temp.final_overall_results.find(r => r.candidate === cand.pk)?.electoral_votes || 0;
    if (cEV >= thresh) return null;
    const needed = thresh - cEV;
    const avail = campaignTrail_temp.final_state_results.filter(sr => sr.result_time <= 500 && sr.result.length >= 2 && sr.result[0].candidate !== cand.pk).map(sr => {
      const st = campaignTrail_temp.states_json.find(s => s.pk === sr.state);
      const def = sr.result[0].percent - (sr.result.find(r => r.candidate === cand.pk)?.percent || 0);
      return st ? { abbr: sr.abbr, stateId: sr.state, electoralVotes: st.fields.electoral_votes, deficit: def } : null;
    }).filter(Boolean).sort((a, b) => a.deficit - b.deficit);

    let run = 0, path = [], tip = null;
    for (const s of avail) {
      if (run >= needed) break;
      s.pathPosition = path.length + 1; s.isRequired = true; path.push(s); run += s.electoralVotes;
      if (run >= needed && !tip) tip = s.abbr;
    }
    return { candidate: cand, path, currentEVs: cEV, neededEVs: needed, totalPathEVs: run, tippingPointState: tip };
  }

  function getTippingPointColor(pos, req, def, len, hex) {
    const [r, g, b] = hexToRgb(hex);
    const p = r > Math.max(g, b) + 50 ? ["#8B0000", "#B22222", "#DC143C", "#FF4500", "#FF6347", "#FFA500", "#FFD700"] :
            b > Math.max(r, g) + 50 ? ["#000080", "#0000CD", "#4169E1", "#6A5ACD", "#8A2BE2", "#DA70D6", "#DDA0DD"] :
            g > Math.max(r, b) + 50 ? ["#006400", "#228B22", "#32CD32", "#00CED1", "#40E0D0", "#48D1CC", "#AFEEEE"] :
            ["#4B0082", "#800080", "#9932CC", "#BA55D3", "#DA70D6", "#DDA0DD", "#E6E6FA"];
    let idx = len <= 5 ? Math.min(pos - 1, 4) : len <= 10 ? Math.min(Math.floor((pos - 1) * (6 / (len - 1))), 6) :
            pos <= 3 ? pos - 1 : pos <= Math.ceil(len * 0.3) ? 3 : pos <= Math.ceil(len * 0.6) ? 4 : pos <= Math.ceil(len * 0.8) ? 5 : 6;
    return p[idx];
  }

  function updateMapStyles() {
    const map = $('#map_container').data('plugin-usmap');
    if (!map?.stateShapes) return;
    let s = {};
    const cands = getActiveCandidates();
    switch (currentMode) {
      case VISUALIZATION_MODES.MARGINS: s = styleCache.margins; break;
      case VISUALIZATION_MODES.CANDIDATE_STRENGTH:
        for (const a in styleCache.candidate_strength) {
          const d = styleCache.candidate_strength[a][selectedCandidateIndex];
          s[a] = d ? { fill: candidatePerformanceMode === 'relative' ? d.relativeFill : d.fill, hoverFill: candidatePerformanceMode === 'relative' ? d.relativeHoverFill : d.hoverFill } : { fill: "#EEEEEE", hoverFill: "#DDDDDD" };
        } break;
      case VISUALIZATION_MODES.COMPETITIVENESS: s = styleCache.competitiveness; break;
      case VISUALIZATION_MODES.TURNOUT_CHANGE: s = styleCache.turnout_change; break;
      case VISUALIZATION_MODES.VOTE_SHARE: s = styleCache.vote_share; break;
      case VISUALIZATION_MODES.ISSUE_STANCE:
        for (const a in styleCache.issue_stance) s[a] = styleCache.issue_stance[a][showAverageIssueStance ? 'average' : selectedIssueIndex] || { fill: "#EEEEEE", hoverFill: "#DDDDDD" }; break;
      case VISUALIZATION_MODES.ISSUE_WEIGHT:
        for (const a in styleCache.issue_weight) s[a] = showAverageIssueStance ? { fill: "#C9C9C9", hoverFill: "#AAAAAA" } : (styleCache.issue_weight[a][selectedIssueIndex] || { fill: "#EEEEEE", hoverFill: "#DDDDDD" }); break;
      case VISUALIZATION_MODES.CANDIDATE_ISSUE_ALIGNMENT:
        for (const a in styleCache.candidate_issue_alignment) {
          if (alignmentComparisonMode === 'comparison') {
            let bA = 999, bC = -1, bHex = "#EEEEEE";
            selectedComparisonCandidates.forEach(i => {
              const d = styleCache.candidate_issue_alignment[a]?.[showAverageIssueStance ? 'average' : selectedIssueIndex]?.[i];
              if (d && d.alignment < bA) { bA = d.alignment; bC = i; bHex = cands[i].fields.color_hex; }
            });
            if (bC !== -1) {
              const c = rgbToHex(...interpolateColor(hexToRgb(bHex), [255, 255, 255], 0.1 + Math.min(bA / 2.0, 1.0) * 0.8));
              s[a] = { fill: c, hoverFill: darkenColor(c) };
            } else s[a] = { fill: "#EEEEEE", hoverFill: "#DDDDDD" };
          } else {
            const d = styleCache.candidate_issue_alignment[a]?.[showAverageIssueStance ? 'average' : selectedIssueIndex]?.[selectedAlignmentCandidateIndex];
            s[a] = d && d.alignment < 999 ? d : { fill: "#EEEEEE", hoverFill: "#DDDDDD" };
          }
        } break;
      case VISUALIZATION_MODES.TIPPING_POINT:
        const tp = calculateTippingPointPath();
        for (const a in styleCache.tipping_point) s[a] = { fill: "#E0E0E0", hoverFill: "#D0D0D0" };
        if (tp) {
          campaignTrail_temp.final_state_results.forEach(r => { if (r.result_time <= 500 && r.result[0]?.candidate === tp.candidate.pk) s[r.abbr] = { fill: tp.candidate.fields.color_hex, hoverFill: darkenColor(tp.candidate.fields.color_hex) }; });
          tp.path.forEach(st => { const c = getTippingPointColor(st.pathPosition, st.isRequired, st.deficit, tp.path.length, tp.candidate.fields.color_hex); if (c) s[st.abbr] = { fill: c, hoverFill: darkenColor(c) }; });
        } else s = styleCache.solid; break;
      case VISUALIZATION_MODES.COALITION_BUILDER:
        coalitionResults = calculateCoalitionResults(coalitionCandidateIndex, coalitionVoteShare);
        for (const a in coalitionResults.states) {
          const d = coalitionResults.states[a], win = cands.find(c => c.pk === d.newWinner);
          if (win) {
            const m = d.newResults.length >= 2 ? d.newResults[0].percent - d.newResults[1].percent : d.newResults[0].percent;
            if (coalitionMode === 'solid') s[a] = { fill: win.fields.color_hex, hoverFill: darkenColor(win.fields.color_hex) };
            else if (coalitionMode === 'margins') { const mc = blendMarginColor(win.fields.color_hex, m); s[a] = { fill: mc, hoverFill: darkenColor(mc) }; }
            else { const t = cands[coalitionCandidateIndex], tr = d.newResults.find(r => r.candidate === t.pk), pc = blendPerformanceColor(t.fields.color_hex, tr ? tr.percent : 0, candidateMaxPercentages[t.pk]); s[a] = { fill: pc, hoverFill: darkenColor(pc) }; }
          } else s[a] = { fill: "#E0E0E0", hoverFill: "#D0D0D0" };
        } break;
      case VISUALIZATION_MODES.CANDIDATE_COMBINER:
        if (headToHeadMode) {
          headToHeadResults = calculateHeadToHeadResults(headToHeadTeam1Index1, headToHeadTeam1Index2, headToHeadTeam2Index1, headToHeadTeam2Index2);
          campaignTrail_temp.final_state_results.forEach(r => {
            const d = headToHeadResults.states[r.abbr];
            if (d) { const c = blendMarginColor(cands[d.team1Wins ? headToHeadTeam1Index1 : headToHeadTeam2Index1].fields.color_hex, d.margin); s[r.abbr] = { fill: c, hoverFill: darkenColor(c) }; }
            else s[r.abbr] = { fill: "#E0E0E0", hoverFill: "#D0D0D0" };
          });
        } else {
          combinerResults = calculateCombinerResults(combinedCandidateIndex1, combinedCandidateIndex2, combinedCandidateIndex3);
          campaignTrail_temp.final_state_results.forEach(r => {
            const d = combinerResults.states[r.abbr];
            if (d?.newWinner) { const win = cands.find(c => c.pk === d.newWinner); if (win) { const mc = blendMarginColor(win.fields.color_hex, d.projectedMargin); s[r.abbr] = { fill: mc, hoverFill: darkenColor(mc) }; } }
            else { const win = cands.find(c => c.pk === r.result[0]?.candidate); if (win) s[r.abbr] = { fill: win.fields.color_hex, hoverFill: darkenColor(win.fields.color_hex) }; }
          });
        } break;
      case VISUALIZATION_MODES.SENATE_RACES:
        const sm = window.currentSenateMode || 'solid';
        for (const a in styleCache.senate_races) {
          const d = styleCache.senate_races[a];
          s[a] = sm === 'margins' ? { fill: d.marginFill, hoverFill: d.marginHoverFill } : sm === 'holds_gains' ? { fill: d.holdsGainsFill, hoverFill: d.holdsGainsHoverFill } : { fill: d.solidFill, hoverFill: d.solidHoverFill };
        }
        for (const a in styleCache.solid) if (!s[a]) s[a] = { fill: "#E0E0E0", hoverFill: "#D0D0D0" }; break;
      case VISUALIZATION_MODES.HOUSE_COMPOSITION: s = styleCache.house_composition; break;
      default: s = styleCache.solid;
    }

    stateUpdateQueue.length = 0;
    for (const a in s) if (map.stateShapes[a]) stateUpdateQueue.push({ shape: map.stateShapes[a], fill: s[a]?.fill || "#C9C9C9", hoverFill: s[a]?.hoverFill || darkenColor(s[a]?.fill || "#C9C9C9") });
    processStateUpdateQueue();
  }

  function createSolidLegend() {
    const f = document.createDocumentFragment();
    f.appendChild(cr('div', { textContent: 'Winner' }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    const items = getTopCandidates().map(c => ({
      color: c.candidate.fields.color_hex,
      label: c.candidate.fields.last_name
    }));
    f.appendChild(makeLegendTable(items));
    return cr('div', {}, {}, [f]);
  }

  function createMarginLegend() {
    const f = document.createDocumentFragment();
    f.appendChild(cr('div', { textContent: 'Margin of victory' }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    const t = cr('table', {}, { width: '100%', borderCollapse: 'collapse' });
    const ranges = [{ l: ">15% (Safe)", m: 0.20 }, { l: "10-15% (Solid)", m: 0.12 }, { l: "5-10% (Likely)", m: 0.07 }, { l: "1-5% (Lean)", m: 0.03 }, { l: "<1% (Tossup)", m: 0.005 }];
    const tops = getTopCandidates();
    tops.forEach(({ candidate: c, pk }, idx) => {
      const nr = t.insertRow(), nc = nr.insertCell(); nc.colSpan = 2; nc.style.padding = '5px 3px';
      nc.appendChild(cr('span', {}, { display: 'inline-block', width: '12px', height: '12px', backgroundColor: c.fields.color_hex, marginRight: '4px', border: '1px solid #999', verticalAlign: 'bottom' }));
      nc.appendChild(document.createTextNode(c.fields.last_name)); nc.style.fontWeight = 'bold';
      ranges.forEach(r => {
        const row = t.insertRow(), cc = row.insertCell(); Object.assign(cc.style, { width: '14px', height: '12px', backgroundColor: blendMarginColor(c.fields.color_hex, r.m), border: '1px solid #ddd' });
        const lc = row.insertCell(); lc.textContent = r.l; Object.assign(lc.style, { paddingLeft: '6px', fontSize: '10px' });
      });
      if (idx !== tops.length - 1) { const sr = t.insertRow(), sc = sr.insertCell(); sc.colSpan = 2; sc.style.height = '5px'; }
    });
    f.appendChild(t);
    return cr('div', {}, { paddingRight: '5px' }, [f]);
  }

  function createPerformanceLegend(cIdx) {
    const c = getActiveCandidates()[cIdx]; if (!c) return null;
    const d = candidateMaxPercentages[c.pk]; if (!d) return null;
    const th = getPerformanceThresholds(c.pk), f = document.createDocumentFragment(), fmt = v => v >= 0.01 ? Math.round(v * 100) + '%' : (v * 100).toFixed(1) + '%';
    f.appendChild(cr('div', { textContent: `${c.fields.last_name} performance` }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    f.appendChild(cr('div', { textContent: `Best: ${fmt(d.max)} | Avg: ${fmt(d.avg)}` }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#555' }));
    f.appendChild(cr('div', { textContent: 'Darker = higher performance | Lighter = lower performance' }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#777', fontStyle: 'italic' }));
    const t = makeLegendTable(th.map((v, i) => ({
      color: blendPerformanceColor(c.fields.color_hex, i === 0 ? v : i === th.length - 1 ? v * 0.5 : (v + th[i - 1]) / 2, d),
      label: i === 0 ? `${fmt(v)}+` : i === th.length - 1 ? `Up to ${fmt(th[i - 1])}` : `${fmt(v)} - ${fmt(th[i - 1])}`
    })));
    f.appendChild(t);
    const dcRes = campaignTrail_temp.final_state_results.find(r => r.abbr === "DC")?.result.find(r => r.candidate === c.pk);
    if (dcRes) f.appendChild(cr('div', { textContent: `DC is ignored (${(dcRes.percent * 100).toFixed(1)}%)` }, { fontSize: '9px', marginTop: '5px', textAlign: 'center', color: '#777', fontStyle: 'italic' }));
    return cr('div', {}, {}, [f]);
  }

  function createRelativePerformanceLegend(cIdx) {
    const c = getActiveCandidates()[cIdx]; if (!c) return null;
    const f = document.createDocumentFragment();
    f.appendChild(cr('div', { textContent: `${c.fields.last_name} vs National average` }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    const nr = campaignTrail_temp.final_overall_results.find(r => r.candidate === c.pk), tot = campaignTrail_temp.final_overall_results.reduce((s, r) => s + r.popular_votes, 0);
    const avg = nr && tot > 0 ? nr.popular_votes / tot : 0;
    f.appendChild(cr('div', { textContent: `National average: ${(avg * 100).toFixed(1)}%` }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#555' }));
    let b = -1, w = 1, bS = '', wS = '';
    campaignTrail_temp.final_state_results.forEach(r => {
      const cr = r.result.find(x => x.candidate === c.pk);
      if (cr) { const rel = cr.percent - avg; if (rel > b) { b = rel; bS = r.abbr; } if (rel < w) { w = rel; wS = r.abbr; } }
    });
    f.appendChild(cr('div', { textContent: `Best: ${bS} (+${(b * 100).toFixed(1)}%) | Worst: ${wS} (${(w * 100).toFixed(1)}%)` }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#666' }));
    const ranges = avg < 0.10 ? [
      { l: "2x+ national avg", r: avg * 2.0 }, { l: "1.5-2x national", r: avg * 0.75 }, { l: "1.2-1.5x national", r: avg * 0.35 },
      { l: "0.8-1.2x national", r: 0 }, { l: "0.5-0.8x national", r: -avg * 0.4 }, { l: "0.2-0.5x national", r: -avg * 0.7 }, { l: "<0.2x national", r: -avg * 0.9 }
    ] : [
      { l: "+15%+", r: 0.18 }, { l: "+10 to +15%", r: 0.125 }, { l: "+5 to +10% ", r: 0.075 }, { l: "+2 to +5%", r: 0.035 },
      { l: "-2 to +2%", r: 0 }, { l: "-2 to -5%", r: -0.035 }, { l: "-5 to -10%", r: -0.075 }, { l: "-10 to -15%", r: -0.125 }, { l: "-15%+", r: -0.18 }
    ];
    f.appendChild(makeLegendTable(ranges.map(r => ({ color: blendRelativePerformanceColor(c.fields.color_hex, r.r, avg), label: r.l }))));
    return cr('div', {}, {}, [f]);
  }

  function createCompetitivenessLegend() {
    const f = document.createDocumentFragment();
    f.appendChild(cr('div', { textContent: 'Race competitiveness' }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    let mC = { state: '', m: 1 }, lC = { state: '', m: 0 };
    campaignTrail_temp.final_state_results.forEach(r => {
      if (r.result_time <= 500 && r.result.length >= 2) {
        const m = r.result[0].percent - r.result[1].percent;
        if (m < mC.m) mC = { state: r.abbr, m };
        if (m > lC.m) lC = { state: r.abbr, m };
      }
    });
    f.appendChild(cr('div', { textContent: `Most competitive: ${mC.state} | Least: ${lC.state}` }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#555' }));
    f.appendChild(makeLegendTable([
      { color: "#FF0000", label: "<1% (Tossup)" }, { color: "#FF3300", label: "1-2.5% (Very Close)" }, { color: "#FF6600", label: "2.5-5% (Close)" },
      { color: "#FF9900", label: "5-7.5% (Lean)" }, { color: "#FFCC00", label: "7.5-10% (Likely)" }, { color: "#FFFF00", label: "10-15% (Safe)" },
      { color: "#AADD00", label: "15-20% (Very Safe)" }, { color: "#55BB00", label: "20-30% (Solid)" }, { color: "#0000FF", label: ">30% (Landslide)" }
    ]));
    return cr('div', {}, {}, [f]);
  }

  function createTurnoutChangeLegend() {
    const f = document.createDocumentFragment();
    f.appendChild(cr('div', { textContent: 'Turnout change' }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    f.appendChild(cr('div', { textContent: campaignTrail_temp.TurnoutSystem ? '(% change from baseline turnout)' : '(estimated from results)' }, { fontSize: '9px', marginBottom: '5px', color: '#777', textAlign: 'center' }));
    f.appendChild(makeLegendTable([
      { color: "#006400", label: ">10% (Major increase)" }, { color: "#228B22", label: "7.5-10% (Large increase)" }, { color: "#2E8B57", label: "5-7.5% (Significant)" },
      { color: "#3CB371", label: "2.5-5% (Moderate)" }, { color: "#90EE90", label: "1-2.5% (Minor increase)" }, { color: "#F5F5F5", label: "±1% (Minimal change)" },
      { color: "#FFA07A", label: "-1 to -2.5% (Minor drop)" }, { color: "#FF6347", label: "-2.5 to -5% (Moderate)" }, { color: "#FF0000", label: "-5 to -7.5% (Significant)" },
      { color: "#B22222", label: "-7.5 to -10% (Large drop)" }, { color: "#8B0000", label: ">10% (Major decrease)" }
    ]));
    return cr('div', {}, {}, [f]);
  }

  function createCoalitionBuilderLegend() {
    if (!coalitionResults?.states) return null;
    const c = getActiveCandidates()[coalitionCandidateIndex]; if (!c) return null;
    const f = document.createDocumentFragment();
    const oCnt = coalitionResults.overrideCount || 0;
    const nTxt = oCnt > 0 ? `Natl: ${(coalitionResults.newNatPct * 100).toFixed(1)}% (${oCnt} override${oCnt > 1 ? 's' : ''})` : `Natl: ${Math.round(coalitionVoteShare * 100)}%`;
    f.appendChild(cr('div', { textContent: `${c.fields.last_name} coalition - ${nTxt}` }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));

    const tEV = coalitionResults.totalElectoralVotes, win = tEV >= (campaignTrail_temp.election_json?.[0]?.fields?.winning_electoral_vote_number || 270);
    let fS = 0, lS = 0, fmt = v => v >= 0.01 ? Math.round(v * 100) + '%' : (v * 100).toFixed(1) + '%';
    for (const a in coalitionResults.states) {
      const d = coalitionResults.states[a], oW = campaignTrail_temp.final_state_results.find(r => r.abbr === a)?.result[0]?.candidate;
      if (d.wouldWin && oW !== c.pk) fS++; else if (!d.wouldWin && oW === c.pk) lS++;
    }
    f.appendChild(cr('div', { textContent: `Electoral votes: ${tEV}/${campaignTrail_temp.election_json?.[0]?.fields?.winning_electoral_vote_number || 270}${fS > 0 ? ` | Flipped: ${fS}` : ''}${lS > 0 ? ` | Lost: ${lS}` : ''}` }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: win ? '#006400' : '#8B0000', fontWeight: 'bold' }));
    const net = Object.values(coalitionResults.states).filter(s => s.wouldWin).length - campaignTrail_temp.final_state_results.filter(r => r.result_time <= 500 && r.result[0]?.candidate === c.pk).length;
    f.appendChild(cr('div', { textContent: net > 0 ? `Flips ${net} states from current results` : net < 0 ? `Loses ${Math.abs(net)} currently won states` : 'Same states as current results' }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#555' }));

    if (coalitionMode === 'performance') {
      const pVs = Object.values(coalitionResults.states).map(s => s.newVoteShare);
      const cD = { max: Math.max(...pVs), min: Math.min(...pVs), avg: pVs.reduce((a, b) => a + b, 0) / pVs.length, p10: calculatePercentile(pVs, 10), p90: calculatePercentile(pVs, 90), percentiles: pVs.sort((a, b) => a - b) };
      const th = getCoalitionPerformanceThresholds(cD);
      f.appendChild(cr('div', { textContent: `Coalition best: ${fmt(cD.max)} | Avg: ${fmt(cD.avg)}` }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#555' }));
      f.appendChild(makeLegendTable(th.map((v, i) => ({ color: blendPerformanceColor(c.fields.color_hex, v, cD), label: i === 0 ? `${fmt(v)}+` : i === th.length - 1 ? `Up to ${fmt(v)}` : `${fmt(v)} - ${fmt(th[i - 1])}` }))));
    } else if (coalitionMode === 'solid') {
      f.appendChild(makeLegendTable([{ color: c.fields.color_hex, label: `${c.fields.last_name} wins` }]));
    } else {
      f.appendChild(makeLegendTable([
        { color: blendMarginColor(c.fields.color_hex, 0.20), label: ">15% (Safe)" }, { color: blendMarginColor(c.fields.color_hex, 0.12), label: "10-15% (Solid)" },
        { color: blendMarginColor(c.fields.color_hex, 0.07), label: "5-10% (Likely)" }, { color: blendMarginColor(c.fields.color_hex, 0.03), label: "1-5% (Lean)" },
        { color: blendMarginColor(c.fields.color_hex, 0.005), label: "<1% (Tossup)" }, { color: "#E0E0E0", label: "Does not win" }
      ]));
    }
    return cr('div', {}, {}, [f]);
  }

  function createVoteShareLegend() {
    const f = document.createDocumentFragment();
    f.appendChild(cr('div', { textContent: 'Winner vote share' }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    let tV = 0, cV = 0, wW = { s: 1.0, st: '' };
    const cvs = {};
    campaignTrail_temp.final_state_results.forEach(r => {
      if (r.result_time <= 500 && r.result.length > 0) {
        const v = r.result[0].percent, c = r.result[0].candidate;
        tV += v; cV++;
        if (v < wW.s) wW = { s: v, st: r.abbr };
        (cvs[c] = cvs[c] || []).push(v);
      }
    });
    f.appendChild(cr('div', { textContent: cV > 0 ? `Average winner share: ${Math.round(tV / cV * 100)}% | Weakest win: ${wW.st} (${Math.round(wW.s * 100)}%)` : 'No results' }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#555' }));
    const t = cr('table', {}, { width: '100%', borderCollapse: 'collapse' });
    const ranges = [{ min: 0.9, max: 1, l: "90-100%", m: 0.95 }, { min: 0.8, max: 0.9, l: "80-90%", m: 0.85 }, { min: 0.7, max: 0.8, l: "70-80%", m: 0.75 }, { min: 0.6, max: 0.7, l: "60-70%", m: 0.65 }, { min: 0.5, max: 0.6, l: "50-60%", m: 0.55 }, { min: 0.4, max: 0.5, l: "40-50%", m: 0.45 }, { min: 0.3, max: 0.4, l: "30-40%", m: 0.35 }, { min: 0.2, max: 0.3, l: "20-30%", m: 0.25 }, { min: 0.1, max: 0.2, l: "10-20%", m: 0.15 }, { min: 0, max: 0.1, l: "0-10%", m: 0.05 }];
    const tops = getTopCandidates();
    tops.forEach(({ candidate: c, pk }, idx) => {
      if (!cvs[pk]?.length) return;
      const nr = t.insertRow(), nc = nr.insertCell(); nc.colSpan = 2; nc.style.padding = '4px 0 2px';
      nc.appendChild(cr('span', {}, { display: 'inline-block', width: '12px', height: '12px', backgroundColor: c.fields.color_hex, marginRight: '4px', border: '1px solid #999', verticalAlign: 'bottom' }));
      nc.appendChild(document.createTextNode(c.fields.last_name)); nc.style.fontWeight = 'bold';
      ranges.filter(r => cvs[pk].some(s => r.max === 1 ? s >= r.min : s >= r.min && s < r.max)).forEach(r => {
        const row = t.insertRow(), cc = row.insertCell(); Object.assign(cc.style, { width: '14px', height: '12px', backgroundColor: blendVoteShareColor(c.fields.color_hex, r.m), border: '1px solid #ddd' });
        const lc = row.insertCell(); lc.textContent = r.l; Object.assign(lc.style, { paddingLeft: '6px', fontSize: '10px' });
      });
      if (idx !== tops.length - 1) { const sr = t.insertRow(), sc = sr.insertCell(); sc.colSpan = 2; sc.style.height = '5px'; }
    });
    f.appendChild(t);
    return cr('div', {}, { paddingRight: '5px' }, [f]);
  }

  function getLegendNode(mode) {
    const lFn = {
      [VISUALIZATION_MODES.SOLID]: createSolidLegend,
      [VISUALIZATION_MODES.MARGINS]: createMarginLegend,
      [VISUALIZATION_MODES.CANDIDATE_STRENGTH]: () => candidatePerformanceMode === 'relative' ? createRelativePerformanceLegend(selectedCandidateIndex) : createPerformanceLegend(selectedCandidateIndex),
      [VISUALIZATION_MODES.COMPETITIVENESS]: createCompetitivenessLegend,
      [VISUALIZATION_MODES.TURNOUT_CHANGE]: createTurnoutChangeLegend,
      [VISUALIZATION_MODES.VOTE_SHARE]: createVoteShareLegend,
      [VISUALIZATION_MODES.ISSUE_STANCE]: () => createIssueStanceLegend(selectedIssueIndex),
      [VISUALIZATION_MODES.ISSUE_WEIGHT]: () => createIssueWeightLegend(selectedIssueIndex),
      [VISUALIZATION_MODES.CANDIDATE_ISSUE_ALIGNMENT]: () => alignmentComparisonMode === 'comparison' ? createComparisonAlignmentLegend(selectedIssueIndex) : createCandidateIssueAlignmentLegend(selectedIssueIndex, selectedAlignmentCandidateIndex),
      [VISUALIZATION_MODES.COALITION_BUILDER]: createCoalitionBuilderLegend,
      [VISUALIZATION_MODES.CANDIDATE_COMBINER]: () => headToHeadMode ? createHeadToHeadLegend() : createCandidateCombinerLegend(),
      [VISUALIZATION_MODES.TIPPING_POINT]: createTippingPointLegend,
      [VISUALIZATION_MODES.SENATE_RACES]: createSenateRacesLegend,
      [VISUALIZATION_MODES.HOUSE_COMPOSITION]: createHouseCompositionLegend
    }[mode];
    return lFn ? lFn() : null;
  }

  function openExportDialog() {
    if (document.getElementById('export_modal')) return;

    const modal = cr('div', { id: 'export_modal' }, { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: '10005', width: '300px' });
    modal.appendChild(cr('h3', { textContent: 'Export map(s)' }, { marginTop: '0', textAlign: 'center', fontFamily: 'sans-serif' }));
    modal.appendChild(cr('p', { textContent: 'Select map modes to combine into a single image grid:' }, { fontSize: '13px', color: '#555', marginBottom: '10px', fontFamily: 'sans-serif' }));

    const opts = [
      { v: 'solid', t: 'Solid colors' }, { v: 'margins', t: 'Margin of victory' },
      { v: 'vote_share', t: 'Winner vote share' }, { v: 'candidate_strength', t: 'Candidate performance' },
      { v: 'competitiveness', t: 'Race competitiveness' }, { v: 'turnout_change', t: 'Turnout change' }
    ];

    const checks = [];
    opts.forEach(o => {
      const lbl = cr('label', {}, { display: 'block', marginBottom: '4px', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif' });
      const cb = cr('input', { type: 'checkbox', value: o.v, checked: true }, { marginRight: '6px' });
      lbl.appendChild(cb);
      lbl.appendChild(document.createTextNode(o.t));
      checks.push({ cb, ...o });
      modal.appendChild(lbl);
    });

    const btnContainer = cr('div', {}, { display: 'flex', justifyContent: 'space-between', marginTop: '15px' });
    const cancelBtn = cr('button', { textContent: 'Cancel' }, { padding: '6px 10px', cursor: 'pointer', background: '#ccc', border: 'none', borderRadius: '3px' });
    cancelBtn.addEventListener('click', () => modal.remove());

    const startBtn = cr('button', { textContent: 'Generate grid' }, { padding: '6px 10px', cursor: 'pointer', background: '#007acc', color: 'white', border: 'none', borderRadius: '3px', fontWeight: 'bold' });
    startBtn.addEventListener('click', async () => {
      const selected = checks.filter(c => c.cb.checked);
      if (!selected.length) { alert('Please select at least one map mode.'); return; }
      startBtn.textContent = 'Generating...';
      startBtn.disabled = true;
      cancelBtn.disabled = true;
      await runExport(selected);
      modal.remove();
    });

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(startBtn);
    modal.appendChild(btnContainer);

    document.body.appendChild(modal);
  }

  async function runExport(selectedModes) {
    if (!window.html2canvas) {
      await new Promise(res => {
        const s = document.createElement('script');
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        s.onload = res;
        document.head.appendChild(s);
      });
    }

    const origMode = currentMode;
    const n = selectedModes.length;
    let cols = 1;
    if (n === 2 || n === 4) cols = 2;
    else if (n >= 3) cols = 3;

    const exportStage = cr('div', { id: 'export_stage' }, {
      position: 'absolute', top: '-9999px', left: '-9999px',
      display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: '30px', background: '#eaeaea', padding: '30px', zIndex: -1
    });
    document.body.appendChild(exportStage);

    window._isExporting = true;

    for (let i = 0; i < selectedModes.length; i++) {
      const mode = selectedModes[i];
      currentMode = mode.v;

      updateMapStyles();
      updateLegend();

      const cell = cr('div', {}, {
        background: 'white', padding: '20px', borderRadius: '8px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif'
      });

      cell.appendChild(cr('h2', { textContent: mode.t }, { margin: '0 0 15px 0', fontSize: '22px', color: '#333' }));

      const row = cr('div', {}, { display: 'flex', gap: '0px', alignItems: 'center' });

      const origMap = document.getElementById('map_container');
      const cloneMap = origMap.cloneNode(true);
      cloneMap.id = '';
      Object.assign(cloneMap.style, { width: '700px', height: '450px', position: 'relative', margin: '0', padding: '0' });
      row.appendChild(cloneMap);

      const legWrap = cr('div', {}, { position: 'relative', zIndex: '100', width: '200px', background: '#fcfcfc', border: '1px solid #ddd', padding: '12px', borderRadius: '4px', boxSizing: 'border-box' });
      const spec = getLegendNode(mode.v);
      if (spec) legWrap.appendChild(spec);
      row.appendChild(legWrap);

      cell.appendChild(row);
      exportStage.appendChild(cell);
    }

    await new Promise(r => setTimeout(r, 100));

    const canvas = await html2canvas(exportStage, { scale: 2, useCORS: true, logging: false, backgroundColor: '#eaeaea' });

    const link = document.createElement('a');
    link.download = `Election_Maps_Grid_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    exportStage.remove();
    window._isExporting = false;
    currentMode = origMode;
    const sel = document.getElementById('visualization_mode');
    if (sel) sel.value = origMode;

    updateControls();
    updateMapStyles();
    updateLegend();
  }

  function updateControls() {
    let ctrl = document.getElementById('map_controls');

	if (ctrl && !document.getElementById('grid_export_btn')) {
      ctrl.remove();
      ctrl = null;
    }

    if (ctrl) {
      const t = (id, cond) => { const el = document.getElementById(id); if (el) el.style.display = cond ? 'block' : 'none'; };
      t('senate_controls_container', currentMode === VISUALIZATION_MODES.SENATE_RACES);
      t('candidate_selector_container', currentMode === VISUALIZATION_MODES.CANDIDATE_STRENGTH);
      t('coalition_controls_container', currentMode === VISUALIZATION_MODES.COALITION_BUILDER);
      t('combiner_controls_container', currentMode === VISUALIZATION_MODES.CANDIDATE_COMBINER);
      t('tipping_point_controls_container', currentMode === VISUALIZATION_MODES.TIPPING_POINT);
      const isIss = ['issue_stance', 'issue_weight', 'candidate_issue_alignment'].includes(currentMode);
      t('issue_selector_container', isIss);
      if (isIss) { t('alignment_candidate_container', currentMode === VISUALIZATION_MODES.CANDIDATE_ISSUE_ALIGNMENT); t('single_alignment_container', alignmentComparisonMode === 'single'); t('comparison_alignment_container', alignmentComparisonMode === 'comparison'); }
      const ms = document.getElementById('visualization_mode'); if (ms && ms.value !== currentMode) ms.value = currentMode;
      return;
    }

    ctrl = cr('div', { id: 'map_controls' }, { position: 'absolute', background: 'rgba(255, 255, 255, 0.92)', border: '1px solid #aaa', padding: '8px', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', zIndex: '1000', width: '180px' });
    const cont = document.querySelector('.container'), mapC = document.getElementById('map_container');
    const sT = document.documentElement.scrollTop || document.body.scrollTop;
    if (cont && mapC) { const cR = cont.getBoundingClientRect(), mR = mapC.getBoundingClientRect(); ctrl.style.left = Math.max(20, cR.left - 200) + 'px'; ctrl.style.top = (mR.top + sT) + 'px'; }
    else if (cont) { const cR = cont.getBoundingClientRect(); ctrl.style.left = Math.max(20, cR.left - 200) + 'px'; ctrl.style.top = Math.max(20, cR.top + sT + 200) + 'px'; }
    else { ctrl.style.top = '200px'; ctrl.style.left = '20px'; }

    const frag = document.createDocumentFragment();
    const hnd = cr('div', {}, { height: '20px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)', borderBottom: '1px solid #ccc', cursor: 'move', marginLeft: '-8px', marginRight: '-8px', marginTop: '-8px', borderRadius: '4px 4px 0 0' }, [cr('span', { textContent: '⋮⋮' }, { color: '#999', fontSize: '12px', letterSpacing: '2px' })]);
    frag.appendChild(hnd);

    let tO; const tU = (d = 10) => { clearTimeout(tO); tO = setTimeout(() => { updateMapStyles(); updateLegend(); }, d); };
    const sel = (id, opts, val, cb) => {
      const s = cr('select', { id }, { width: '100%', padding: '4px', marginBottom: '4px' });
      opts.forEach(o => s.appendChild(cr('option', { value: o.v, textContent: o.t, selected: o.v === val })));
      s.addEventListener('change', cb); return s;
    };

    frag.appendChild(sel('visualization_mode', [
      { v: 'solid', t: 'Solid colors' }, /*{ v: 'senate_races', t: 'Senate results' }, { v: 'house_composition', t: 'House results' },*/
      { v: 'margins', t: 'Margin of victory' }, { v: 'vote_share', t: 'Winner vote share' }, { v: 'candidate_strength', t: 'Candidate performance' },
      { v: 'competitiveness', t: 'Race competitiveness' }, { v: 'turnout_change', t: 'Turnout change' }, { v: 'tipping_point', t: 'Tipping point path' },
      { v: 'issue_stance', t: 'Issue stance' }, { v: 'issue_weight', t: 'Issue importance' }, { v: 'candidate_issue_alignment', t: 'Issue alignment' },
      { v: 'coalition_builder', t: 'Coalition builder' }, { v: 'candidate_combiner', t: 'Candidate combiner' }
    ], currentMode, function () { currentMode = this.value; updateControls(); tU(); }));

    const senDiv = cr('div', { id: 'senate_controls_container' }, { display: 'none', marginBottom: '8px' });
    senDiv.appendChild(sel('senate_mode_selector', [{ v: 'solid', t: 'Solid colors' }, { v: 'margins', t: 'Show margins' }, { v: 'holds_gains', t: 'Holds & gains' }], window.currentSenateMode || 'solid', function () { window.currentSenateMode = this.value; tU(); }));
    frag.appendChild(senDiv);

    const cands = getActiveCandidates();
    const candOpts = cands.map((c, i) => ({ v: i, t: c.fields.last_name }));

    const candDiv = cr('div', { id: 'candidate_selector_container' }, { display: 'none' });
    candDiv.appendChild(sel('candidate_selector', candOpts, selectedCandidateIndex, function () { selectedCandidateIndex = parseInt(this.value); tU(); }));
    const pBtn = cr('button', { textContent: candidatePerformanceMode === 'absolute' ? 'Show relative to national' : 'Show absolute performance' }, { fontSize: '10px', padding: '2px 8px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px', width: '100%', marginTop: '4px' });
    pBtn.addEventListener('click', function () { candidatePerformanceMode = candidatePerformanceMode === 'absolute' ? 'relative' : 'absolute'; this.textContent = candidatePerformanceMode === 'absolute' ? 'Show relative to national' : 'Show absolute performance'; tU(); });
    candDiv.appendChild(pBtn); frag.appendChild(candDiv);

    const coalDiv = cr('div', { id: 'coalition_controls_container' }, { display: 'none', marginBottom: '8px' });
    const cSel = sel('coalition_candidate_selector', candOpts, coalitionCandidateIndex, function () {
      coalitionCandidateIndex = parseInt(this.value);
      coalitionStateOverrides = {};
      const nr = campaignTrail_temp.final_overall_results.find(r => r.candidate === cands[coalitionCandidateIndex]?.pk), tot = campaignTrail_temp.final_overall_results.reduce((s, r) => s + r.popular_votes, 0);
      coalitionVoteShare = nr && tot > 0 ? nr.popular_votes / tot : 0.35;
      uVL(); tU();
    });

    const stateOpts = [{ v: 'National', t: 'National Swing' }];
    (campaignTrail_temp.states_json || []).sort((a,b) => a.fields.abbr.localeCompare(b.fields.abbr)).forEach(s => stateOpts.push({ v: s.fields.abbr, t: `${s.fields.abbr} - ${s.fields.name}` }));
    const stSel = sel('coalition_state_selector', stateOpts, coalitionTargetState, function() {
      coalitionTargetState = this.value; uVL();
    });

    const slLbl = cr('div', {}, { fontSize: '11px', marginBottom: '3px', textAlign: 'center' });
    const uVL = () => {
      const c = cands[coalitionCandidateIndex];
      const nr = campaignTrail_temp.final_overall_results.find(r => r.candidate === c?.pk), tot = campaignTrail_temp.final_overall_results.reduce((s, r) => s + r.popular_votes, 0), actNat = nr && tot > 0 ? nr.popular_votes / tot : 0.35;
      let curV, actV, pre = '';

      if (coalitionTargetState === 'National') {
        if (Math.abs(coalitionVoteShare - 0.5) < 0.01 && !window._coalitionVoteShareSet) { coalitionVoteShare = actNat; window._coalitionVoteShareSet = true; }
        curV = coalitionVoteShare; actV = actNat; pre = 'National';
      } else {
        const sr = campaignTrail_temp.final_state_results.find(r => r.abbr === coalitionTargetState);
        actV = sr ? (sr.result.find(x => x.candidate === c?.pk)?.percent || 0) : 0;
        curV = coalitionStateOverrides[coalitionTargetState] ?? coalitionResults?.states?.[coalitionTargetState]?.newVoteShare ?? actV;
        pre = coalitionTargetState;
      }

      if (vS) vS.value = curV;
      slLbl.innerHTML = `${pre} vote share: `;
      const vD = cr('span', { innerHTML: `${(curV * 100).toFixed(1)}%` }, { cursor: 'pointer', textDecoration: 'underline', color: '#0066cc' });

      vD.addEventListener('click', function (e) {
        e.stopPropagation();
        const inp = cr('input', { type: 'number', min: '0', max: '100', step: '0.1', value: (curV * 100).toFixed(1) }, { width: '50px', fontSize: '11px', textAlign: 'center', position: 'absolute', zIndex: '1001', left: this.getBoundingClientRect().left + 'px', top: this.getBoundingClientRect().top + 'px' });
        document.body.appendChild(inp); inp.focus(); inp.select(); this.style.visibility = 'hidden';
        const fin = (save) => {
          if (save) {
            let v = parseFloat(inp.value);
            if (!isNaN(v)) {
              v = Math.max(0, Math.min(100, v)) / 100;
              if (coalitionTargetState === 'National') { coalitionVoteShare = v; coalitionStateOverrides = {}; }
              else { coalitionStateOverrides[coalitionTargetState] = v; }
              if (vS) vS.value = v;
              uVL(); tU(50);
            }
          }
          vD.style.visibility = 'visible'; if (inp.parentNode) inp.parentNode.removeChild(inp);
        };
        inp.addEventListener('blur', () => fin(true)); inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') fin(true); if (ev.key === 'Escape') fin(false); });
      });
      slLbl.appendChild(vD); slLbl.appendChild(cr('span', { textContent: ` (Actual: ${(actV * 100).toFixed(1)}%)` }));
    };

    const vS = cr('input', { type: 'range', min: '0', max: '1', step: '0.001', value: coalitionVoteShare }, { width: '100%', marginBottom: '4px' });
    vS.addEventListener('input', function () {
      const v = parseFloat(this.value);
      if (coalitionTargetState === 'National') { coalitionVoteShare = v; coalitionStateOverrides = {}; }
      else { coalitionStateOverrides[coalitionTargetState] = v; }
      uVL(); tU(50);
    });

    coalDiv.appendChild(cSel); coalDiv.appendChild(stSel); coalDiv.appendChild(cr('div', {}, { marginBottom: '4px' }, [slLbl])); coalDiv.appendChild(vS);
    coalDiv.appendChild(sel('coalition_mode_selector', [{ v: 'solid', t: 'Solid colors' }, { v: 'margins', t: 'Projected margins' }, { v: 'performance', t: 'Candidate performance' }], coalitionMode, function () { coalitionMode = this.value; tU(); }));
    frag.appendChild(coalDiv);

    const cmbDiv = cr('div', { id: 'combiner_controls_container' }, { display: 'none', marginBottom: '8px' });
    if (cands.length >= 4) {
      const hBtn = cr('button', { textContent: headToHeadMode ? 'Switch to Single Team' : 'Head-to-Head Mode' }, { fontSize: '10px', padding: '2px 8px', cursor: 'pointer', backgroundColor: headToHeadMode ? '#e6f3ff' : '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px', width: '100%', marginBottom: '6px' });
      hBtn.addEventListener('click', function () { headToHeadMode = !headToHeadMode; this.textContent = headToHeadMode ? 'Switch to Single Team' : 'Head-to-Head Mode'; this.style.backgroundColor = headToHeadMode ? '#e6f3ff' : '#f0f0f0'; document.getElementById('single_team_container').style.display = headToHeadMode ? 'none' : 'block'; document.getElementById('head_to_head_container').style.display = headToHeadMode ? 'block' : 'none'; tU(); });
      cmbDiv.appendChild(hBtn);
    }
    const sTDiv = cr('div', { id: 'single_team_container' }, { display: headToHeadMode ? 'none' : 'block' });
    const cmBtn = cr('button', { textContent: combinerMode === 'two' ? 'Combine 3 candidates' : 'Combine 2 candidates' }, { fontSize: '10px', padding: '2px 8px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px', width: '100%', marginBottom: '6px' });
    cmBtn.addEventListener('click', function () {
      combinerMode = combinerMode === 'two' ? 'three' : 'two'; this.textContent = combinerMode === 'two' ? 'Combine 3 candidates' : 'Combine 2 candidates'; document.getElementById('combiner_third_container').style.display = combinerMode === 'three' ? 'block' : 'none';
      if (combinerMode === 'two') combinedCandidateIndex3 = -1; else if (combinedCandidateIndex3 === -1) { for (let i = 0; i < cands.length; i++) if (i !== combinedCandidateIndex1 && i !== combinedCandidateIndex2) { combinedCandidateIndex3 = i; document.getElementById('combiner_candidate_selector3').value = i; break; } }
      tU();
    });
    sTDiv.appendChild(cmBtn);
    const lbl = t => cr('div', { textContent: t }, { fontSize: '11px', marginBottom: '3px' });
    sTDiv.appendChild(lbl('Primary candidate:')); sTDiv.appendChild(sel('combiner_candidate_selector1', candOpts, combinedCandidateIndex1, function () { combinedCandidateIndex1 = parseInt(this.value); tU(); }));
    sTDiv.appendChild(lbl('Combine with:')); sTDiv.appendChild(sel('combiner_candidate_selector2', candOpts, combinedCandidateIndex2, function () { combinedCandidateIndex2 = parseInt(this.value); tU(); }));
    const tCDiv = cr('div', { id: 'combiner_third_container' }, { display: combinerMode === 'three' ? 'block' : 'none' }, [lbl('Also combine with:'), sel('combiner_candidate_selector3', candOpts, combinedCandidateIndex3, function () { combinedCandidateIndex3 = parseInt(this.value); tU(); })]);
    sTDiv.appendChild(tCDiv); cmbDiv.appendChild(sTDiv);
    const h2hDiv = cr('div', { id: 'head_to_head_container' }, { display: headToHeadMode ? 'block' : 'none' }, [
      lbl('Team 1:'), sel('head_to_head_team1_candidate1', candOpts, headToHeadTeam1Index1, function () { headToHeadTeam1Index1 = parseInt(this.value); tU(); }), sel('head_to_head_team1_candidate2', candOpts, headToHeadTeam1Index2, function () { headToHeadTeam1Index2 = parseInt(this.value); tU(); }),
      lbl('Team 2:'), sel('head_to_head_team2_candidate1', candOpts, headToHeadTeam2Index1, function () { headToHeadTeam2Index1 = parseInt(this.value); tU(); }), sel('head_to_head_team2_candidate2', candOpts, headToHeadTeam2Index2, function () { headToHeadTeam2Index2 = parseInt(this.value); tU(); })
    ]);
    cmbDiv.appendChild(h2hDiv); frag.appendChild(cmbDiv);

    const tpDiv = cr('div', { id: 'tipping_point_controls_container' }, { display: 'none', marginBottom: '8px' });
    tpDiv.appendChild(cr('label', { textContent: 'Perspective: ' }, { marginRight: '5px', fontSize: '11px' }));
    tpDiv.appendChild(sel('tipping_point_candidate_selector', candOpts, selectedCandidateIndex, function () { selectedCandidateIndex = parseInt(this.value); tU(); }));
    frag.appendChild(tpDiv);

    const issDiv = cr('div', { id: 'issue_selector_container' }, { display: 'none', marginBottom: '8px' });
    const issOpts = (campaignTrail_temp.issues_json || []).map((iss, i) => ({ v: i, t: iss.fields.name }));
    issOpts.push({ v: 'average', t: 'Average of all issues' });
    issDiv.appendChild(sel('issue_selector', issOpts, showAverageIssueStance ? 'average' : selectedIssueIndex, function () { if (this.value === 'average') { showAverageIssueStance = true; selectedIssueIndex = 0; } else { showAverageIssueStance = false; selectedIssueIndex = parseInt(this.value); } tU(); }));

    const aCDiv = cr('div', { id: 'alignment_candidate_container' }, { display: 'none' });
    const aBtn = cr('button', { textContent: alignmentComparisonMode === 'single' ? 'Compare multiple' : 'Single view' }, { fontSize: '10px', padding: '2px 8px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px' });
    aBtn.addEventListener('click', function () { alignmentComparisonMode = alignmentComparisonMode === 'single' ? 'comparison' : 'single'; this.textContent = alignmentComparisonMode === 'single' ? 'Compare multiple' : 'Single view'; document.getElementById('single_alignment_container').style.display = alignmentComparisonMode === 'single' ? 'block' : 'none'; document.getElementById('comparison_alignment_container').style.display = alignmentComparisonMode === 'comparison' ? 'block' : 'none'; tU(); });
    aCDiv.appendChild(cr('div', {}, { marginBottom: '4px', textAlign: 'center' }, [aBtn]));
    aCDiv.appendChild(cr('div', { id: 'single_alignment_container' }, { display: alignmentComparisonMode === 'single' ? 'block' : 'none' }, [sel('alignment_candidate_selector', cands.map((c, i) => ({ v: i, t: c.fields.last_name + ' alignment' })), selectedAlignmentCandidateIndex, function () { selectedAlignmentCandidateIndex = parseInt(this.value); tU(); })]));

    const cmpDiv = cr('div', { id: 'comparison_alignment_container' }, { display: alignmentComparisonMode === 'comparison' ? 'block' : 'none', fontSize: '10px' }, [cr('div', { textContent: `Select candidates (max ${Math.min(cands.length, 8)}):` }, { marginBottom: '3px', fontWeight: 'bold' })]);
    selectedComparisonCandidates = selectedComparisonCandidates.filter(i => i < cands.length);
    if (!selectedComparisonCandidates.length && cands.length > 0) selectedComparisonCandidates = [0, 1].filter(i => i < cands.length);
    cands.forEach((c, i) => {
      const cb = cr('input', { type: 'checkbox', id: `cand_check_${i}`, value: i, checked: selectedComparisonCandidates.includes(i) }, { marginRight: '4px' });
      cb.addEventListener('change', function () { const max = Math.min(cands.length, 8); if (this.checked) { if (selectedComparisonCandidates.length < max) selectedComparisonCandidates.push(i); else { this.checked = false; alert(`Maximum ${max} candidates can be compared`); } } else { if (selectedComparisonCandidates.length > 1) selectedComparisonCandidates = selectedComparisonCandidates.filter(x => x !== i); else this.checked = true; } tU(); });
      const lb = cr('label', { htmlFor: `cand_check_${i}`, textContent: c.fields.last_name }, { cursor: 'pointer' });
      cmpDiv.appendChild(cr('div', {}, { marginBottom: '2px' }, [cb, lb]));
    });
    aCDiv.appendChild(cmpDiv); issDiv.appendChild(aCDiv); frag.appendChild(issDiv);

    const expDiv = cr('div', {}, { marginTop: '8px', borderTop: '1px solid #ccc', paddingTop: '8px' });
    const expBtn = cr('button', { id: 'grid_export_btn', textContent: 'Export map(s)' }, { fontSize: '11px', padding: '4px', width: '100%', cursor: 'pointer', backgroundColor: '#e6ffe6', border: '1px solid #aaa', borderRadius: '3px', fontWeight: 'bold' });
    expBtn.addEventListener('click', openExportDialog);
    expDiv.appendChild(expBtn);
    frag.appendChild(expDiv);

    ctrl.appendChild(frag); document.body.appendChild(ctrl);
    makeDraggable(ctrl, hnd);
    updateControls();
  }

  function createIssueStanceLegend(iIdx) {
    const f = document.createDocumentFragment();
    if (showAverageIssueStance) {
      f.appendChild(cr('div', { textContent: 'Average issue stance' }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
      f.appendChild(cr('div', { textContent: 'Assumes 1 is most conservative and 7 is most liberal. It might not be true for some mods!' }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#666' }));
      f.appendChild(makeLegendTable(["1: Very Conservative", "2: Conservative", "3: Somewhat Conservative", "4: Moderate", "5: Somewhat Liberal", "6: Liberal", "7: Very Liberal"].map((l, i) => ({ color: ["#8B0000", "#FF0000", "#FF8D1C", "#FFD700", "#32CD32", "#0000FF", "#000080"][i], label: l }))));
    } else {
      const iss = campaignTrail_temp.issues_json?.[iIdx]; if (!iss) return null;
      f.appendChild(cr('div', { textContent: iss.fields.name + ' stance' }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
      const items = [];
      for (let s = 1; s <= 7; s++) if (iss.fields[`stance_${s}`]) items.push({ color: ["#8B0000", "#FF0000", "#FF8D1C", "#FFD700", "#32CD32", "#0000FF", "#000080"][s - 1], label: `${s}: ${iss.fields[`stance_${s}`]}` });
      f.appendChild(makeLegendTable(items));
    }
    return cr('div', {}, {}, [f]);
  }

  function createTippingPointLegend() {
    const tp = calculateTippingPointPath(), f = document.createDocumentFragment();
    if (!tp) return cr('div', {}, {}, [cr('div', { textContent: 'No path to victory' }, { fontWeight: 'bold', textAlign: 'center' }), cr('div', { textContent: 'This candidate has already won!' }, { fontSize: '10px', color: '#666', textAlign: 'center', marginTop: '5px' })]);
    f.appendChild(cr('div', { textContent: `${tp.candidate.fields.last_name} path to victory` }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    f.appendChild(cr('div', { textContent: `Current: ${tp.currentEVs} EVs | Needs: ${tp.neededEVs} more | Path total: ${tp.totalPathEVs}` }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#555' }));
    if (tp.tippingPointState) f.appendChild(cr('div', { textContent: `Tipping point state: ${tp.tippingPointState}` }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#d63384', fontWeight: 'bold' }));
    const cH = cr('div', {}, { fontWeight: 'bold', margin: '2px 0' });
    cH.innerHTML = `<span style="display:inline-block;width:12px;height:12px;background:${tp.candidate.fields.color_hex};border:1px solid #999;margin-right:4px;vertical-align:bottom;"></span>Currently won`;
    f.appendChild(cr('div', {}, { fontSize: '10px', marginBottom: '8px', padding: '3px', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }, [cH]));

    const t = cr('table', {}, { width: '100%', borderCollapse: 'collapse', marginTop: '5px' });
    const hR = t.insertRow(); hR.style.backgroundColor = '#f0f0f0';
    [{ t: 'State', a: 'left' }, { t: 'EVs', a: 'center' }, { t: 'Gap', a: 'center' }].forEach(h => { const c = hR.insertCell(); c.textContent = h.t; Object.assign(c.style, { fontWeight: 'bold', fontSize: '9px', padding: '2px 4px', textAlign: h.a }); });
    tp.path.forEach(s => {
      const r = t.insertRow(), sC = r.insertCell(); sC.style.fontSize = '9px'; sC.style.padding = '2px 4px';
      sC.appendChild(cr('span', {}, { display: 'inline-block', width: '8px', height: '8px', backgroundColor: getTippingPointColor(s.pathPosition, s.isRequired, s.deficit, tp.path.length, tp.candidate.fields.color_hex), marginRight: '3px', border: '1px solid #999', verticalAlign: 'middle' }));
      sC.appendChild(document.createTextNode(s.abbr === tp.tippingPointState ? `${s.pathPosition}. ${s.abbr} ★` : `${s.pathPosition}. ${s.abbr}`));
      if (s.abbr === tp.tippingPointState) { sC.style.fontWeight = 'bold'; sC.style.color = '#d63384'; }
      const eV = r.insertCell(); eV.textContent = s.electoralVotes; Object.assign(eV.style, { fontSize: '9px', padding: '2px 4px', textAlign: 'center' });
      const dV = r.insertCell(); dV.textContent = `${(s.deficit * 100).toFixed(1)}%`; Object.assign(dV.style, { fontSize: '9px', padding: '2px 4px', textAlign: 'center' });
    });
    f.appendChild(t);
    f.appendChild(cr('div', { textContent: '★ = Tipping point | Darker = Higher priority' }, { fontSize: '9px', marginTop: '5px', color: '#666', textAlign: 'center' }));
    return cr('div', {}, {}, [f]);
  }

  function calculateCombinerResults(idx1, idx2, idx3 = -1) {
    const cands = getActiveCandidates(), vIdxs = idx3 !== -1 ? [idx1, idx2, idx3] : [idx1, idx2];
    if (new Set(vIdxs).size !== vIdxs.length || vIdxs.some(i => i >= cands.length || i < 0)) return {};
    const c1 = cands[idx1], c2 = cands[idx2], c3 = idx3 !== -1 ? cands[idx3] : null, res = {}; let tEV = 0;
    campaignTrail_temp.final_state_results.forEach(r => {
      const eV = campaignTrail_temp.states_json.find(s => s.pk === r.state)?.fields.electoral_votes || 0;
      const o1 = r.result.find(x => x.candidate === c1.pk), o2 = r.result.find(x => x.candidate === c2.pk), o3 = c3 ? r.result.find(x => x.candidate === c3.pk) : null;
      const v1 = o1?.percent || 0, v2 = o2?.percent || 0, v3 = o3?.percent || 0, cV = v1 + v2 + v3;
      const nRes = r.result.filter(x => ![c1.pk, c2.pk, c3?.pk].includes(x.candidate)).map(x => ({ ...x }));
      nRes.push({ candidate: c1.pk, percent: cV, votes: (o1?.votes || 0) + (o2?.votes || 0) + (o3?.votes || 0) });
      nRes.sort((a, b) => b.percent - a.percent);
      const wWin = nRes[0].candidate === c1.pk;
      res[r.abbr] = { wouldWin: wWin, electoralVotes: eV, combinedVoteShare: cV, originalCandidate1Votes: v1, originalCandidate2Votes: v2, originalCandidate3Votes: v3, projectedMargin: nRes.length >= 2 ? nRes[0].percent - nRes[1].percent : nRes[0].percent, newWinner: nRes[0].candidate, newResults: nRes };
      if (wWin) tEV += eV;
    });
    return { states: res, totalElectoralVotes: tEV, candidate1Index: idx1, candidate2Index: idx2, candidate3Index: idx3, candidate1: c1, candidate2: c2, candidate3: c3 };
  }

  function calculateHeadToHeadResults(t1i1, t1i2, t2i1, t2i2) {
    const c = getActiveCandidates(), t1c1 = c[t1i1], t1c2 = c[t1i2], t2c1 = c[t2i1], t2c2 = c[t2i2];
    if (!t1c1 || !t1c2 || !t2c1 || !t2c2) return {};
    const res = {}; let ev1 = 0, ev2 = 0;
    campaignTrail_temp.final_state_results.forEach(r => {
      const eV = campaignTrail_temp.states_json.find(s => s.pk === r.state)?.fields.electoral_votes || 0;
      const v1 = (r.result.find(x => x.candidate === t1c1.pk)?.percent || 0) + (r.result.find(x => x.candidate === t1c2.pk)?.percent || 0);
      const v2 = (r.result.find(x => x.candidate === t2c1.pk)?.percent || 0) + (r.result.find(x => x.candidate === t2c2.pk)?.percent || 0);
      const w1 = v1 > v2;
      res[r.abbr] = { team1Wins: w1, team2Wins: !w1, electoralVotes: eV, team1VoteShare: v1, team2VoteShare: v2, margin: Math.abs(v1 - v2), winner: w1 ? 'team1' : 'team2' };
      if (w1) ev1 += eV; else ev2 += eV;
    });
    return { states: res, team1ElectoralVotes: ev1, team2ElectoralVotes: ev2, team1Candidate1: t1c1, team1Candidate2: t1c2, team2Candidate1: t2c1, team2Candidate2: t2c2 };
  }

  function calculateCoalitionResults(idx, targetV) {
    const c = getActiveCandidates()[idx]; if (!c) return {};
    const res = {}, stByM = []; let tEV = 0, simNat = 0, totAll = 0;
    const nV = campaignTrail_temp.final_overall_results.find(r => r.candidate === c.pk)?.popular_votes || 0;
    const nTot = campaignTrail_temp.final_overall_results.reduce((s, r) => s + r.popular_votes, 0);
    const actNat = nTot > 0 ? nV / nTot : 0, nSw = targetV - actNat;

    campaignTrail_temp.final_state_results.forEach(r => {
      const sD = campaignTrail_temp.states_json.find(s => s.pk === r.state);
      const eV = sD?.fields.electoral_votes || 0;
      let sV = 0; r.result.forEach(x => sV += x.votes || 0);
      if (sV === 0) sV = sD?.fields.popular_votes || 0;
      totAll += sV;

      const cV = r.result.find(x => x.candidate === c.pk)?.percent || 0;
      let nTV = coalitionStateOverrides[r.abbr];

      if (nTV === undefined) {
        const cM = r.result.length >= 2 ? r.result[0].percent - r.result[1].percent : 1;
        const mod = cM < 0.05 ? 1.4 : cM < 0.10 ? 1.2 : cM < 0.20 ? 1.0 : 0.7;
        nTV = Math.max(0, Math.min(1, cV + nSw * mod));
      }
      simNat += nTV * sV;

      const oT = r.result.filter(x => x.candidate !== c.pk).reduce((s, x) => s + x.percent, 0);
      const rem = 1 - nTV;
      const nRes = r.result.map(x => x.candidate === c.pk ? { ...x, percent: nTV } : { ...x, percent: rem * (oT > 0 ? x.percent / oT : 0) }).sort((a, b) => b.percent - a.percent);
      const wW = nRes[0].candidate === c.pk, nM = nRes.length >= 2 ? nRes[0].percent - nRes[1].percent : nRes[0].percent;
      res[r.abbr] = { wouldWin: wW, electoralVotes: eV, currentVoteShare: cV, newVoteShare: nTV, projectedMargin: wW ? nM : 0, newWinner: nRes[0].candidate, newResults: nRes, swing: nTV - cV };
      if (wW) tEV += eV;
      stByM.push({ abbr: r.abbr, margin: wW ? nM : -nM, electoralVotes: eV, wouldWin: wW });
    });

    let tip = null, rEV = 0; const tThresh = campaignTrail_temp.election_json?.[0]?.fields?.winning_electoral_vote_number || 270;
    stByM.filter(s => s.wouldWin).sort((a, b) => a.margin - b.margin).forEach(s => { rEV += s.electoralVotes; if (rEV >= tThresh && !tip) tip = s.abbr; });
    return { states: res, totalElectoralVotes: tEV, tippingPointState: tip, candidateIndex: idx, targetVoteShare: targetV, newNatPct: totAll > 0 ? simNat / totAll : targetV, overrideCount: Object.keys(coalitionStateOverrides).length };
  }

  function createIssueWeightLegend(iIdx) {
    if (showAverageIssueStance) return cr('div', {}, {}, [cr('div', { textContent: 'No data' }, { fontWeight: 'bold', textAlign: 'center' }), cr('p', { textContent: 'The "Average of all issues" view is not applicable to Issue importance. Please select a specific issue from the dropdown.' }, { fontSize: '10px', textAlign: 'center', margin: '5px 0 0 0', color: '#555' })]);
    const iss = campaignTrail_temp.issues_json?.[iIdx]; if (!iss) return null;
    const f = document.createDocumentFragment();
    f.appendChild(cr('div', { textContent: iss.fields.name + ' Importance' }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    let hW = -1, lW = 999, hS = '', lS = '';
    campaignTrail_temp.final_state_results.forEach(r => {
      const w = campaignTrail_temp.state_issue_score_json?.find(s => s.fields.state === r.state && s.fields.issue === iss.pk)?.fields.weight;
      if (w != null) { if (w > hW) { hW = w; hS = r.abbr; } if (w < lW) { lW = w; lS = r.abbr; } }
    });
    f.appendChild(cr('div', { textContent: hS && lS ? (hW === lW ? `All states uniform` : `Highest priority: ${hS} (${hW.toFixed(2)}) | Lowest: ${lS} (${lW.toFixed(2)})`) : 'No weight data available' }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#555' }));
    const rng = getIssueWeightRange(iIdx);
    if (rng && rng.min === rng.max) {
      f.appendChild(makeLegendTable([{ color: "#C9C9C9", label: `Uniform importance (${rng.min.toFixed(2)})` }]));
    } else if (rng && (rng.max - rng.min) > 0.15) {
      const sz = (rng.max - rng.min) / 5, items = [];
      for (let i = 4; i >= 0; i--) {
        const mn = rng.min + (i * sz), mx = i === 4 ? rng.max : rng.min + ((i + 1) * sz);
        items.push({ color: getIssueWeightColor((mn + mx) / 2, iIdx), label: i === 4 ? `${mn.toFixed(2)}+ (Highest)` : i === 0 ? `${mn.toFixed(2)}-${mx.toFixed(2)} (Lowest)` : `${mn.toFixed(2)}-${mx.toFixed(2)}` });
      }
      f.appendChild(makeLegendTable(items));
    } else {
      f.appendChild(makeLegendTable([{ color: "#0000CD", label: "0.85+ (Critical)" }, { color: "#1E90FF", label: "0.70-0.85 (Very High)" }, { color: "#4682B4", label: "0.55-0.70 (High)" }, { color: "#87CEEB", label: "0.40-0.55 (Moderate)" }, { color: "#B0C4DE", label: "0.25-0.40 (Low)" }, { color: "#E6E6FA", label: "0.10-0.25 (Very Low)" }, { color: "#F8F8FF", label: "<0.10 (Minimal)" }]));
    }
    return cr('div', {}, {}, [f]);
  }

  function createCandidateCombinerLegend() {
    if (!combinerResults?.states) return null;
    const f = document.createDocumentFragment(), { candidate1: c1, candidate2: c2, candidate3: c3, totalElectoralVotes: tEV } = combinerResults;
    f.appendChild(cr('div', { textContent: `${c1.fields.last_name} + ${c2.fields.last_name}${c3 ? ` + ${c3.fields.last_name}` : ''}` }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    const thresh = campaignTrail_temp.election_json?.[0]?.fields?.winning_electoral_vote_number || 270;
    const oEV1 = campaignTrail_temp.final_overall_results.find(r => r.candidate === c1.pk)?.electoral_votes || 0;
    const oEV2 = campaignTrail_temp.final_overall_results.find(r => r.candidate === c2.pk)?.electoral_votes || 0;
    const oEV3 = c3 ? (campaignTrail_temp.final_overall_results.find(r => r.candidate === c3.pk)?.electoral_votes || 0) : 0;
    const chg = tEV - (oEV1 + oEV2 + oEV3);
    f.appendChild(cr('div', { textContent: `Combined EVs: ${tEV}/${thresh}${chg !== 0 ? ` (${chg > 0 ? '+' : ''}${chg} vs separate)` : ''}` }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: tEV >= thresh ? '#006400' : '#8B0000', fontWeight: 'bold' }));
    let tV = 0, t1 = 0, t2 = 0, t3 = 0, c = 0;
    for (const a in combinerResults.states) { const s = combinerResults.states[a]; tV += s.combinedVoteShare; t1 += s.originalCandidate1Votes; t2 += s.originalCandidate2Votes; t3 += s.originalCandidate3Votes || 0; c++; }
    if (c > 0) f.appendChild(cr('div', { textContent: `Avg vote share: ${(tV / c * 100).toFixed(1)}% (${(t1 / c * 100).toFixed(1)}% + ${(t2 / c * 100).toFixed(1)}%${c3 ? ` + ${(t3 / c * 100).toFixed(1)}%` : ''})` }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#555' }));
    f.appendChild(makeLegendTable([{ color: blendMarginColor(c1.fields.color_hex, 0.20), label: ">15% margin (Safe)" }, { color: blendMarginColor(c1.fields.color_hex, 0.12), label: "10-15% (Solid)" }, { color: blendMarginColor(c1.fields.color_hex, 0.07), label: "5-10% (Likely)" }, { color: blendMarginColor(c1.fields.color_hex, 0.03), label: "1-5% (Lean)" }, { color: blendMarginColor(c1.fields.color_hex, 0.005), label: "<1% (Tossup)" }, { color: "#E0E0E0", label: "Does not win" }]));
    const flips = [];
    for (const a in combinerResults.states) {
      const oW = campaignTrail_temp.final_state_results.find(r => r.abbr === a)?.result[0]?.candidate, nW = combinerResults.states[a].newWinner;
      if (oW !== nW && nW === c1.pk) flips.push({ abbr: a, ev: combinerResults.states[a].electoralVotes, m: combinerResults.states[a].projectedMargin });
    }
    if (flips.length) {
      const fL = flips.sort((a, b) => a.m - b.m).map(s => `${s.abbr} (${s.ev} EVs, +${(s.m * 100).toFixed(1)}%)`);
      f.appendChild(cr('div', {}, { marginTop: '8px', padding: '4px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '3px' }, [
        cr('div', { textContent: `States flipped (${flips.length})` }, { fontWeight: 'bold', fontSize: '10px', marginBottom: '3px', textAlign: 'center' }),
        cr('div', { textContent: fL.length > 3 ? Array.from({ length: Math.ceil(fL.length / 3) }, (_, i) => fL.slice(i * 3, i * 3 + 3).join(', ')).join('\n') : fL.join(', ') }, { fontSize: '9px', textAlign: 'center', lineHeight: '1.2', whiteSpace: fL.length > 3 ? 'pre-line' : 'normal' })
      ]));
    } else f.appendChild(cr('div', { textContent: 'No states flipped by combination' }, { marginTop: '8px', fontSize: '9px', textAlign: 'center', color: '#666', fontStyle: 'italic' }));
    return cr('div', {}, {}, [f]);
  }

  function createHeadToHeadLegend() {
    if (!headToHeadResults?.states) return null;
    const f = document.createDocumentFragment(), r = headToHeadResults;
    f.appendChild(cr('div', { textContent: 'Head-to-Head Results' }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    const tDiv = cr('div', {}, { fontSize: '9px', marginBottom: '8px', textAlign: 'center' });
    const t1 = cr('div', {}, { marginBottom: '2px' }); t1.innerHTML = `<span style="display:inline-block;width:12px;height:12px;background:${r.team1Candidate1.fields.color_hex};border:1px solid #999;margin-right:4px;vertical-align:middle;"></span>Team 1: ${r.team1Candidate1.fields.last_name} + ${r.team1Candidate2.fields.last_name}`;
    const t2 = cr('div'); t2.innerHTML = `<span style="display:inline-block;width:12px;height:12px;background:${r.team2Candidate1.fields.color_hex};border:1px solid #999;margin-right:4px;vertical-align:middle;"></span>Team 2: ${r.team2Candidate1.fields.last_name} + ${r.team2Candidate2.fields.last_name}`;
    tDiv.appendChild(t1); tDiv.appendChild(t2); f.appendChild(tDiv);
    const th = campaignTrail_temp.election_json?.[0]?.fields?.winning_electoral_vote_number || 270;
    f.appendChild(cr('div', { textContent: r.team1ElectoralVotes >= th ? `Team 1 wins! ${r.team1ElectoralVotes}-${r.team2ElectoralVotes}` : r.team2ElectoralVotes >= th ? `Team 2 wins! ${r.team2ElectoralVotes}-${r.team1ElectoralVotes}` : `No majority: ${r.team1ElectoralVotes}-${r.team2ElectoralVotes}` }, { fontSize: '10px', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold', color: r.team1ElectoralVotes >= th ? '#006400' : r.team2ElectoralVotes >= th ? '#8B0000' : '#666' }));
    f.appendChild(makeLegendTable([{ color: blendMarginColor(r.team1Candidate1.fields.color_hex, 0.20), label: "Team 1 >15%" }, { color: blendMarginColor(r.team1Candidate1.fields.color_hex, 0.07), label: "Team 1 5-15%" }, { color: blendMarginColor(r.team1Candidate1.fields.color_hex, 0.005), label: "Team 1 <5%" }, { color: blendMarginColor(r.team2Candidate1.fields.color_hex, 0.005), label: "Team 2 <5%" }, { color: blendMarginColor(r.team2Candidate1.fields.color_hex, 0.07), label: "Team 2 5-15%" }, { color: blendMarginColor(r.team2Candidate1.fields.color_hex, 0.20), label: "Team 2 >15%" }]));
    return cr('div', {}, {}, [f]);
  }

  function createSenateRacesLegend() {
    const f = document.createDocumentFragment();
    f.appendChild(cr('div', { textContent: 'U.S. Senate' }, { fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', textAlign: 'center' }));
    let dS = 0, rS = 0, iS = 0, sD = getSenateRaceData();
    if (sD && Object.keys(sD).length > 0) {
      dS = Math.round((100 - Object.keys(sD).length) * 0.45); rS = 100 - Object.keys(sD).length - dS;
      Object.values(sD).forEach(r => { if (r.dem > r.rep && r.dem > (r.trd || 0)) dS++; else if (r.rep > r.dem && r.rep > (r.trd || 0)) rS++; else if ((r.trd || 0) > 0) iS++; });
    } else { dS = 51; rS = 49; iS = 0; }
    const sDiv = cr('div', {}, { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '6px', backgroundColor: '#f8f8f8', border: '1px solid #ddd', borderRadius: '3px' });
    sDiv.innerHTML = `<span style="color: #0487E6; font-weight: bold;">DEM: ${dS}</span><span style="color: #FFDE3A; font-weight: bold;">IND: ${iS}</span><span style="color: #DD2929; font-weight: bold;">REP: ${rS}</span>`;
    f.appendChild(sDiv);
    const sm = window.currentSenateMode || 'solid';
    const items = sm === 'holds_gains' ? [{ color: '#92C5DE', label: 'Democratic hold' }, { color: '#0671B0', label: 'Democratic gain' }, { color: '#F48882', label: 'Republican hold' }, { color: '#CA0120', label: 'Republican gain' }] :
                  sm === 'margins' ? [{ color: '#0487E6', label: 'Democratic wins' }, { color: '#DD2929', label: 'Republican wins' }] :
                  [{ color: '#0487E6', label: 'Democratic win' }, { color: '#DD2929', label: 'Republican win' }, { color: '#FFDE3A', label: 'Independent win' }, { color: '#E0E0E0', label: 'No election' }];
    f.appendChild(makeLegendTable(items));
    return cr('div', {}, { width: '100%', fontSize: '11px' }, [f]);
  }

  function createHouseCompositionLegend() {
    const f = document.createDocumentFragment();
    f.appendChild(cr('div', { textContent: 'U.S. House' }, { fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', textAlign: 'center' }));
    const hD = getHouseCompositionData(), t = hD._totals || { dem: 0, rep: 0, ind: 0, total: 435 };
    const sDiv = cr('div', {}, { display: 'flex', justifyContent: 'space-around', marginBottom: '8px', padding: '6px', backgroundColor: '#f8f8f8', border: '1px solid #ddd', borderRadius: '3px' });
    sDiv.innerHTML = `<span style="color: #0487E6; font-weight: bold;">DEM: ${t.dem}</span>${t.ind > 0 ? ` <span style="color: #D4AF37; font-weight: bold;">IND: ${t.ind}</span>` : ''} <span style="color: #DD2929; font-weight: bold;">REP: ${t.rep}</span>`;
    f.appendChild(sDiv);
    const uC = new Set(Object.keys(hD).filter(a => a !== '_totals' && hD[a].color).map(a => hD[a].color.toUpperCase()));
    const items = [{ color: '#0000AA', label: 'All Democratic (100%)' }, { color: '#2b6cb8', label: 'Strong Dem (80-99%)' }, { color: '#0487E6', label: 'Likely Dem (70-79%)' }, { color: '#3A9FE0', label: 'Lean Dem (60-69%)' }, { color: '#9DCDF3', label: 'Slight Dem (51-59%)' }, { color: '#D896FF', label: 'Split Delegation (50%)' }, { color: '#FF9999', label: 'Slight Rep (51-59%)' }, { color: '#FF3333', label: 'Lean Rep (60-69%)' }, { color: '#DD2929', label: 'Likely Rep (70-79%)' }, { color: '#c12525', label: 'Strong Rep (80-99%)' }, { color: '#880000', label: 'All Republican (100%)' }, { color: '#FFDE3A', label: 'Independent Member' }].filter(i => uC.has(i.color.toUpperCase()));
    f.appendChild(makeLegendTable(items));
    f.appendChild(cr('div', { textContent: 'Colors represent seat share within state delegation' }, { fontSize: '9px', marginTop: '8px', color: '#666', textAlign: 'center', fontStyle: 'italic' }));
    return cr('div', {}, { width: '100%', fontSize: '11px' }, [f]);
  }

  function createCandidateIssueAlignmentLegend(iIdx, cIdx) {
    if (!campaignTrail_temp.issues_json || (iIdx >= campaignTrail_temp.issues_json.length && !showAverageIssueStance)) return null;
    const isA = showAverageIssueStance, iss = isA ? { fields: { name: "Average of all issues" } } : campaignTrail_temp.issues_json[iIdx];
    const c = getActiveCandidates()[cIdx]; if (!c) return null;
    let cS = 0, cN = 1;
    if (isA) {
      let t = 0, ct = 0; campaignTrail_temp.issues_json.forEach(i => { const d = campaignTrail_temp.candidate_issue_score_json?.find(x => x.fields.candidate === c.pk && x.fields.issue === i.pk); if (d) { t += d.fields.issue_score; ct++; } });
      cS = ct > 0 ? t / ct : 0; cN = getStanceNumber(cS);
    } else {
      const d = campaignTrail_temp.candidate_issue_score_json?.find(x => x.fields.candidate === c.pk && x.fields.issue === iss.pk);
      if (!d) return null; cS = d.fields.issue_score; cN = getStanceNumber(cS);
    }
    let bA = 2, wA = 0, bS = '', wS = '';
    campaignTrail_temp.final_state_results.forEach(r => {
      let a = 999;
      if (isA) a = styleCache.candidate_issue_alignment[r.abbr]?.average?.[cIdx]?.alignment ?? 999;
      else { const d = campaignTrail_temp.state_issue_score_json?.find(x => x.fields.state === r.state && x.fields.issue === iss.pk); if (d) a = Math.abs(d.fields.state_issue_score - cS); }
      if (a < 999) { if (a < bA) { bA = a; bS = r.abbr; } if (a > wA) { wA = a; wS = r.abbr; } }
    });
    const f = document.createDocumentFragment();
    f.appendChild(cr('div', { textContent: `${c.fields.last_name} - ${iss.fields.name}` }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    f.appendChild(cr('div', { innerHTML: `Candidate stance: ${isA ? `${cN}: ${["Very Conservative", "Conservative", "Somewhat Conservative", "Moderate", "Somewhat Liberal", "Liberal", "Very Liberal"][cN - 1]}` : (iss.fields[`stance_${cN}`] || `Stance ${cN}`)} (${cS.toFixed(2)})` }, { fontSize: '9px', marginBottom: '3px', textAlign: 'center', color: '#333', fontWeight: 'bold' }));
    f.appendChild(cr('div', { textContent: `Best: ${bS} (${bA.toFixed(2)}) | Worst: ${wS} (${wA.toFixed(2)})` }, { fontSize: '9px', marginBottom: '5px', textAlign: 'center', color: '#555' }));
    f.appendChild(makeLegendTable([{ color: "#006400", label: "Perfect Sync (0-0.2)" }, { color: "#228B22", label: "Well Aligned (0.2-0.4)" }, { color: "#32CD32", label: "Generally Aligned (0.4-0.6)" }, { color: "#FFD700", label: "Somewhat Off (0.6-0.8)" }, { color: "#FF8C00", label: "Misaligned (0.8-1.0)" }, { color: "#FF4500", label: "Very Misaligned (1.0-1.2)" }, { color: "#8B0000", label: "Completely Opposed (1.2+)" }]));
    return cr('div', {}, {}, [f]);
  }

  function createComparisonAlignmentLegend(iIdx) {
    if (!campaignTrail_temp.issues_json || (iIdx >= campaignTrail_temp.issues_json.length && !showAverageIssueStance)) return null;
    const isA = showAverageIssueStance, iss = isA ? { fields: { name: "Average of all issues" } } : campaignTrail_temp.issues_json[iIdx], cands = getActiveCandidates();
    const f = document.createDocumentFragment();
    f.appendChild(cr('div', { textContent: `Alignment comparison - ${iss.fields.name}` }, { fontWeight: 'bold', marginBottom: '5px', textAlign: 'center' }));
    const t = cr('table', {}, { width: '100%', borderCollapse: 'collapse', marginBottom: '8px' });
    const hR = t.insertRow(); hR.style.backgroundColor = '#f0f0f0';
    [{ t: 'Candidate', a: 'left' }, { t: 'Best match', a: 'center' }].forEach(h => { const c = hR.insertCell(); c.textContent = h.t; Object.assign(c.style, { fontWeight: 'bold', fontSize: '9px', padding: '3px', textAlign: h.a }); });
    selectedComparisonCandidates.filter(i => i < cands.length).forEach(i => {
      const c = cands[i], r = t.insertRow(); let cS = 0;
      if (isA) { let tS = 0, ct = 0; campaignTrail_temp.issues_json.forEach(iss2 => { const d = campaignTrail_temp.candidate_issue_score_json?.find(x => x.fields.candidate === c.pk && x.fields.issue === iss2.pk); if (d) { tS += d.fields.issue_score; ct++; } }); cS = ct > 0 ? tS / ct : 0; }
      else cS = campaignTrail_temp.candidate_issue_score_json?.find(x => x.fields.candidate === c.pk && x.fields.issue === iss.pk)?.fields.issue_score || 0;
      const nC = r.insertCell(); nC.style.fontSize = '9px'; nC.style.padding = '3px';
      nC.appendChild(cr('span', {}, { display: 'inline-block', width: '10px', height: '10px', backgroundColor: c.fields.color_hex, marginRight: '4px', border: '1px solid #999' }));
      nC.appendChild(document.createTextNode(`${c.fields.last_name} (${cS.toFixed(2)})`));
      let bA = 999, bS = '';
      campaignTrail_temp.final_state_results.forEach(sr => { const a = styleCache.candidate_issue_alignment[sr.abbr]?.[isA ? 'average' : iIdx]?.[i]?.alignment ?? 999; if (a < bA) { bA = a; bS = sr.abbr; } });
      const bsC = r.insertCell(); bsC.textContent = bS ? `${bS} (${bA.toFixed(2)})` : 'N/A'; Object.assign(bsC.style, { fontSize: '9px', padding: '3px', textAlign: 'center' });
    });
    f.appendChild(t);
    f.appendChild(cr('div', {}, { fontSize: '9px', marginTop: '5px' }, [cr('div', { textContent: 'Map shows best-aligned candidate per state' }, { fontWeight: 'bold', marginBottom: '3px', textAlign: 'center' })]));
    return cr('div', {}, {}, [f]);
  }

  function updateLegend() {
    let leg = document.getElementById('map_legend');
    if (currentMode === VISUALIZATION_MODES.SOLID && !window._isExporting) { if (leg) leg.style.display = 'none'; return; }
    let cCont;
    if (!leg) {
      leg = cr('div', { id: 'map_legend' }, { position: 'absolute', background: 'rgba(252, 252, 252, 0.92)', border: '1px solid #aaa', padding: '8px', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', zIndex: '1000', fontSize: '11px' });
      const hnd = cr('div', {}, { height: '20px', marginBottom: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)', borderBottom: '1px solid #ccc', cursor: 'move', marginLeft: '-8px', marginRight: '-8px', marginTop: '-8px', borderRadius: '4px 4px 0 0' }, [cr('span', { textContent: '⋮⋮' }, { color: '#999', fontSize: '12px', letterSpacing: '2px' })]);
      leg.appendChild(hnd);
      cCont = cr('div', { id: 'map_legend_content' }); leg.appendChild(cCont);
      if (legendMoved && legendPosition) { leg.style.left = legendPosition.left + 'px'; leg.style.top = legendPosition.top + 'px'; document.body.appendChild(leg); }
      else {
        const ctrl = document.getElementById('map_controls'), sT = document.documentElement.scrollTop || document.body.scrollTop;
        if (ctrl) {
          leg.style.visibility = 'hidden'; document.body.appendChild(leg);
          const r = ctrl.getBoundingClientRect();
          if ((r.bottom + 15 + leg.offsetHeight) < window.innerHeight) { leg.style.top = (r.bottom + sT + 15) + 'px'; leg.style.left = r.left + 'px'; }
          else if ((r.right + 15 + leg.offsetWidth) < window.innerWidth) { leg.style.top = (r.top + sT) + 'px'; leg.style.left = (r.right + 15) + 'px'; }
          else { leg.style.top = Math.max(sT + 10, r.top + sT - leg.offsetHeight - 15) + 'px'; leg.style.left = r.left + 'px'; }
          leg.style.visibility = 'visible';
        } else { leg.style.top = '350px'; leg.style.left = '20px'; document.body.appendChild(leg); }
      }
      makeDraggable(leg, hnd);
    } else { leg.style.display = 'block'; cCont = document.getElementById('map_legend_content'); }
    leg.style.width = currentMode === VISUALIZATION_MODES.CANDIDATE_COMBINER && headToHeadMode ? '200px' : '180px';

    const spec = getLegendNode(currentMode);
    if (spec) cCont.replaceChildren(spec);
    else cCont.replaceChildren();
  }

  function isInElectionMapView() { return document.getElementById('map_container') && document.getElementById('final_election_map_button')?.disabled === true; }

  function initVisualization() {
    if (!isInElectionMapView()) return;
    if (isInitialized) { if (!document.getElementById('map_controls')) { updateControls(); updateLegend(); } return; }
    prepareStyles(); updateControls(); currentMode = VISUALIZATION_MODES.SOLID; updateMapStyles(); updateLegend();
    const map = $('#map_container').data('plugin-usmap');
    if (map && !map._customHoverAttached) {
      map.options.mouseover = function (e, d) { d.shape.attr({ fill: d.shape.data('hoverFill') || "#AAAAAA" }); if (map.options.click) map.options.click(e, d); return false; };
      map.options.mouseout = function (e, d) { d.shape.attr({ fill: d.shape.data('originalFill') || "#C9C9C9" }); return false; };
      map._customHoverAttached = true;
      for (const a in map.stateShapes) if (map.stateShapes[a]?.data) { map.stateShapes[a].data('originalFill', map.stateShapes[a].attr('fill')); map.stateShapes[a].data('hoverFill', darkenColor(map.stateShapes[a].attr('fill'))); }
    }
    isInitialized = true;
  }

  function hookMapButton() {
    const btn = document.getElementById('final_election_map_button');
    if (btn && !btn._marginHooked) {
      const oClk = btn.onclick;
      btn.onclick = function (e) { if (oClk) oClk.call(this, e); isInitialized = false; styleCache = {}; setTimeout(initVisualization, 200); };
      btn._marginHooked = true;
    }
  }

  hookMapButton();
  if (isInElectionMapView()) initVisualization();

  window.dataVisualizer = {
    refreshVisualization: function () { hookMapButton(); if (isInElectionMapView() && !isInitialized) initVisualization(); },
    forceReset: function () { isInitialized = false; styleCache = {}; }
  };
})();

// This is a catch-all mutation observer so that
// we keep one having them all run at once
(function () {
  'use strict';

  if (window.bobert) {
    window.bobert.disconnect();
  }

  window.bobertTasks = [];

  const initialTasks = () => {
    // data visualizer
    try { window.dataVisualizer?.refreshVisualization?.(); } catch (e) { }
  };

  window.bobertTasks.push(initialTasks);

    let scheduled = false;

    const runTasks = () => {
        scheduled = false;
        const tasks = window.bobertTasks;

        if (tasks.length === 0) {
            if (window.bobert) window.bobert.disconnect();
            return;
        }

        for (let i = tasks.length - 1; i >= 0; i--) {
            try {
                if (tasks[i]() === true) tasks.splice(i, 1);
            } catch (e) {
                console.error("bobert task failed:", e);
            }
        }

        if (tasks.length === 0 && window.bobert) {
            window.bobert.disconnect();
        }
    };

    const handleMutations = () => {
        if (scheduled || window.bobertTasks.length === 0) return;
        scheduled = true;
        requestAnimationFrame(runTasks);
    };

    const targetNode = document.getElementById("game_window");

    if (targetNode) {
        window.bobert = new MutationObserver(handleMutations);
        window.bobert.observe(targetNode, { childList: true, subtree: true });
        handleMutations();
		//console.log("bobert...");
    } else {
    console.warn("Zoinks! Bobert could not find game_window.");
    }
})();
