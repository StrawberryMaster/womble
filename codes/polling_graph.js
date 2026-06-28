// The polling graph feature
(function() {
    if (window.pollgraph) return;

    const POLL = window.pollgraph = {
        metric: 'pv',
        showThirdParties: false,
        _candCache: {},

        init() {
            campaignTrail_temp.poll_history = [];

            const hookFn = (origFn, callback, resetStyles) => {
                if (!origFn) return null;
                return function() {
                    let ret = origFn.apply(this, arguments);
                    if (resetStyles) {
                        let gw = document.getElementById("game_window");
                        if (gw) {
                            gw.style.height = "";
                            gw.style.overflowY = "";
                        }
                    }
                    if (callback) callback();
                    return ret;
                };
            };

            window.questionHTML = hookFn(window.questionHTML, () => POLL.record(false), false);
            window.overallResultsHtml = hookFn(window.overallResultsHtml, () => POLL.record(true), true);

            const hooks = ["finalMapScreenHtml", "stateResultsHtml", "furtherReadingHtml"];
            for (let i = 0; i < hooks.length; i++) {
                window[hooks[i]] = hookFn(window[hooks[i]], null, true);
            }

            window.overallDetailsHtml = hookFn(window.overallDetailsHtml, () => setTimeout(POLL.injectInline, 10), false);
        },

        getCandMeta(pk) {
            if (POLL._candCache[pk]) return POLL._candCache[pk];
            let cands = campaignTrail_temp.candidate_json;
            for (let i = 0; i < cands.length; i++) {
                if (cands[i].pk == pk) {
                    let f = cands[i].fields;
                    return POLL._candCache[pk] = { name: f.last_name, color: f.color_hex };
                }
            }
            return POLL._candCache[pk] = { name: "Other", color: "#888" };
        },

        record(isFinal) {
            const ct = campaignTrail_temp;
            let label = isFinal ? "Final" : "Q" + (ct.question_number + 1);
            let history = ct.poll_history;
            if (history.length === 0) POLL._candCache = {};

            let existingIdx = history.findIndex(x => x.label === label);
            let turnData = {};

            if (isFinal && ct.final_overall_results) {
                let totalPV = 0;
                const res = ct.final_overall_results;
                for (let i = 0; i < res.length; i++) totalPV += (res[i].popular_votes || 0);
                for (let i = 0; i < res.length; i++) {
                    let c = res[i];
                    let pv = totalPV > 0 ? (c.popular_votes / totalPV) * 100 : 0;
                    if (pv >= 0.1) turnData[c.candidate] = { pv, ev: c.electoral_votes || 0 };
                }
            } else if (!isFinal && window.nn2) {
                for (let i = 0; i < window.nn2.length; i++) {
                    let c = window.nn2[i];
                    if (c.pvp * 100 >= 0.1) turnData[c.pk] = { pv: c.pvp * 100, ev: c.evvs || 0 };
                }
            } else {
                return;
            }

            let entry = { label, data: turnData };
            if (existingIdx >= 0) history[existingIdx] = entry;
            else history.push(entry);
        },

        switchMetric(m) {
            POLL.metric = m;
            let radios = document.querySelectorAll('input[name="pollMetricInline"], input[name="pollMetricLarge"]');
            for (let i = 0; i < radios.length; i++) radios[i].checked = (radios[i].value === m);

            if (document.getElementById("inlinePollGraph")) POLL.render("inlinePollGraph", "inlinePollTooltip", 888, 140, false);
            if (document.getElementById("largePollGraph")) POLL.render("largePollGraph", "largePollTooltip", 1050, 460, true);
        },

        toggleThirdParties(val) {
            POLL.showThirdParties = val;
            let cbs = document.querySelectorAll('#pollThirdPartyInline, #pollThirdPartyLarge');
            for (let i = 0; i < cbs.length; i++) cbs[i].checked = val;

            if (document.getElementById("inlinePollGraph")) POLL.render("inlinePollGraph", "inlinePollTooltip", 888, 140, false);
            if (document.getElementById("largePollGraph")) POLL.render("largePollGraph", "largePollTooltip", 1050, 460, true);
        },

        injectInline() {
            let gw = document.getElementById("game_window");
            if (gw) {
				gw.style.overflowX = "hidden";
                gw.style.overflowY = "auto";
            }

            let h4s = gw ? gw.getElementsByTagName("h4") : [];
            for (let i = 0; i < h4s.length; i++) {
                let h4 = h4s[i];
                if (h4.innerText.indexOf("Historical") !== -1) {
                    let table = h4.nextElementSibling;
                    if (table && table.tagName === "TABLE") {
                        let container = document.createElement("div");
                        container.style.cssText = "position:relative; width:100%; margin-top:20px; margin-bottom:20px;";
                        container.innerHTML = `
                            <h4 style="margin-top:20px; margin-bottom:10px; font-family:sans-serif;">Campaign Polling History</h4>
                            <div style="text-align:center; margin-bottom:8px; font-family:sans-serif; font-size:13px; color:#333;">
                                <label style="margin-right:15px; cursor:pointer; font-weight:bold;"><input type="radio" name="pollMetricInline" value="pv" ${POLL.metric === 'pv' ? 'checked' : ''} onchange="window.pollgraph.switchMetric('pv')"> Popular Vote %</label>
                                <label style="margin-right:25px; cursor:pointer; font-weight:bold;"><input type="radio" name="pollMetricInline" value="ev" ${POLL.metric === 'ev' ? 'checked' : ''} onchange="window.pollgraph.switchMetric('ev')"> Electoral Votes</label>
                                <label style="cursor:pointer; font-weight:normal; font-size:12px; color:#555;"><input type="checkbox" id="pollThirdPartyInline" ${POLL.showThirdParties ? 'checked' : ''} onchange="window.pollgraph.toggleThirdParties(this.checked)"> Show Third Parties</label>
                            </div>
                            <div style="position:relative;">
                                <canvas id="inlinePollGraph" style="cursor:pointer; background:#fdfdfd; border:1px solid #ccc; border-radius:6px; width:100%; max-width:888px; height:140px; box-shadow:inset 0 1px 3px rgba(0,0,0,0.05);"></canvas>
                                <div id="inlinePollTooltip" style="display:none; position:absolute; z-index:10; background:rgba(20,20,20,0.95); color:#fff; padding:10px; border-radius:6px; font-size:13px; font-family:sans-serif; pointer-events:none; box-shadow:0 4px 8px rgba(0,0,0,0.4); white-space:nowrap; left:0; top:0; transform:translate(0px, 0px); transition: transform 0.05s linear;"></div>
                            </div>
                            <div style="text-align:center; font-size:11px; color:#666; margin-top:5px; font-style:italic; user-select:none;">(Click graph to expand)</div>
                        `;
                        table.parentNode.insertBefore(container, table.nextSibling);

                        POLL.render("inlinePollGraph", "inlinePollTooltip", 888, 140, false);
                    }
                }
            }
        },

        render(canvasId, tooltipId, cssWidth, cssHeight, isLarge) {
            let canvas = document.getElementById(canvasId);
            let tooltip = document.getElementById(tooltipId);
            if (!canvas) return;

            let history = campaignTrail_temp.poll_history || [];
            let hLen = history.length;
            if (hLen === 0) return;

            let mKey = POLL.metric;
            let dpr = window.devicePixelRatio || 1;
            canvas.width = cssWidth * dpr;
            canvas.height = cssHeight * dpr;
            let ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);

            let minY = 9999, maxY = -9999;
            let validCands = new Set();

            let maxPvPerCand = {};
            for (let i = 0; i < hLen; i++) {
                for (let pk in history[i].data) {
                    maxPvPerCand[pk] = Math.max(maxPvPerCand[pk] || 0, history[i].data[pk].pv);
                }
            }
            let majorCands = Object.keys(maxPvPerCand).filter(pk => maxPvPerCand[pk] > 15.0);
            if (majorCands.length < 2) {
                majorCands = Object.keys(maxPvPerCand).sort((a,b) => maxPvPerCand[b] - maxPvPerCand[a]).slice(0, 2);
            }

            for (let i = 0; i < hLen; i++) {
                let data = history[i].data;
                for (let pk in data) {
                    if (!POLL.showThirdParties && !majorCands.includes(pk)) continue;
                    let val = data[pk];
                    if ((mKey === 'pv' && val.pv >= 1.0) || (mKey === 'ev' && val.ev > 0)) validCands.add(pk);
                }
            }

            if (validCands.size === 0) {
                for (let i = 0; i < hLen; i++) {
                    for (let pk in history[i].data) validCands.add(pk);
                }
            }

            let candMeta = {};
            validCands.forEach(pk => { candMeta[pk] = POLL.getCandMeta(pk); });

            let turnCandsCache = new Array(hLen);
            for (let i = 0; i < hLen; i++) {
                let data = history[i].data;
                let turnCands = [];
                for (let pk in data) {
                    if (!validCands.has(pk)) continue;
                    let val = data[pk][mKey];
                    if (val > maxY) maxY = val;
                    if (val < minY) minY = val;
                    turnCands.push({ pk, pv: data[pk].pv, ev: data[pk].ev });
                }
                turnCands.sort((a, b) => b[mKey] - a[mKey]);
                turnCandsCache[i] = turnCands;
            }

            let range = Math.max(maxY - minY, 2);
            let padding = range * 0.15;

            minY = Math.max(0, minY - padding);
            maxY += padding;
            if (mKey === 'pv' && maxY > 100) maxY = 100;

            let stepVal = mKey === 'pv'
                ? (range <= 10 ? 2 : (range <= 30 ? 5 : 10))
                : (range <= 20 ? 5 : (range <= 100 ? 25 : (range <= 300 ? 50 : 100)));

            minY = Math.floor(minY / stepVal) * stepVal;
            maxY = Math.ceil(maxY / stepVal) * stepVal;
            if (minY === maxY) maxY += stepVal;

            let padT = 20, padB = 25, padL = mKey === 'ev' ? 45 : 40, padR = isLarge ? 110 : 60;
            let plotW = cssWidth - padL - padR, plotH = cssHeight - padT - padB;
            let stepX = hLen > 1 ? plotW / (hLen - 1) : plotW;
            let yRange = maxY - minY;

            let suffix = mKey === 'pv' ? "%" : "";
            let skipLabel = (hLen > 15 && !isLarge) ? Math.ceil(hLen / 8) : 1;
            let pointRadius = isLarge ? 5 : 3.5;

            function draw(hoverIndex) {
                ctx.clearRect(0, 0, cssWidth, cssHeight);

                ctx.fillStyle = "#333";
                ctx.font = isLarge ? "14px Arial" : "11px Arial";
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                ctx.lineWidth = 1;

                ctx.beginPath();
                for (let i = minY; i <= maxY; i += stepVal) {
                    let y = padT + plotH - ((i - minY) / yRange) * plotH;
                    ctx.fillText(i + suffix, padL - 8, y);
                    ctx.moveTo(padL, y); ctx.lineTo(cssWidth - padR, y);
                }
                ctx.strokeStyle = "#e8e8e8";
                ctx.stroke();

                ctx.fillStyle = "#555";
                ctx.textAlign = "center";

                ctx.beginPath();
                for (let i = 0; i < hLen; i++) {
                    let x = padL + i * stepX;
                    ctx.moveTo(x, padT); ctx.lineTo(x, cssHeight - padB);
                    if (i % skipLabel === 0 || i === hLen - 1) {
                        ctx.fillText(history[i].label, x, cssHeight - padB + 14);
                    }
                }
                ctx.strokeStyle = "#f0f0f0";
                ctx.stroke();

                if (hoverIndex !== -1) {
                    let hx = padL + hoverIndex * stepX;
                    ctx.fillStyle = "rgba(0,0,0,0.04)";
                    ctx.fillRect(hx - stepX/2, padT, stepX, plotH);
                    ctx.strokeStyle = "rgba(0,0,0,0.3)";
                    ctx.lineWidth = 1;
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath(); ctx.moveTo(hx, padT); ctx.lineTo(hx, cssHeight - padB); ctx.stroke();
                    ctx.setLineDash([]);
                }

                validCands.forEach(pk => {
                    let meta = candMeta[pk];
                    ctx.beginPath();
                    ctx.strokeStyle = meta.color;
                    ctx.lineWidth = isLarge ? 4 : 2.5;
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";

                    let hasStarted = false;
                    for (let i = 0; i < hLen; i++) {
                        let cData = history[i].data[pk];
                        if (!cData) continue;
                        let x = padL + i * stepX;
                        let y = padT + plotH - ((cData[mKey] - minY) / yRange) * plotH;

                        if (!hasStarted) { ctx.moveTo(x, y); hasStarted = true; }
                        else ctx.lineTo(x, y);
                    }

                    ctx.shadowColor = "rgba(0,0,0,0.25)";
                    ctx.shadowBlur = isLarge ? 5 : 3;
                    ctx.shadowOffsetY = isLarge ? 2 : 1;
                    ctx.stroke();
                    ctx.shadowColor = "transparent";

                    ctx.fillStyle = meta.color;
                    for (let i = 0; i < hLen; i++) {
                        let cData = history[i].data[pk];
                        if (!cData) continue;
                        let x = padL + i * stepX;
                        let y = padT + plotH - ((cData[mKey] - minY) / yRange) * plotH;

                        ctx.beginPath();
                        ctx.arc(x, y, pointRadius + (i === hoverIndex ? 2 : 0), 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.strokeStyle = "#fff";
                        ctx.lineWidth = isLarge ? 1.5 : 1;
                        ctx.stroke();

                        if (i === hLen - 1) {
                            let lblX = x + (isLarge ? 10 : 6);
                            ctx.textAlign = "left";
                            ctx.font = isLarge ? "bold 13px sans-serif" : "bold 11px sans-serif";
                            ctx.lineWidth = isLarge ? 4 : 3;
                            ctx.strokeStyle = "rgba(255,255,255,0.85)";
                            ctx.strokeText(meta.name, lblX, y);
                            ctx.fillText(meta.name, lblX, y);
                        }
                    }
                });
            }

            let lastHoverIdx = -1;
            let hoverFrame = null;
            draw(-1);

            canvas.onmousemove = function(e) {
                let rect = canvas.getBoundingClientRect();
                let scaleX = canvas.width / rect.width;
                let mouseX = (e.clientX - rect.left) * scaleX / dpr;
                let mouseY = (e.clientY - rect.top) * scaleX / dpr;

                let hoverIdx = Math.round((mouseX - padL) / stepX);
                if (hoverIdx < 0) hoverIdx = 0;
                else if (hoverIdx >= hLen) hoverIdx = hLen - 1;

                if (hoverIdx !== lastHoverIdx) {
                    lastHoverIdx = hoverIdx;
                    if (hoverFrame) cancelAnimationFrame(hoverFrame);

                    hoverFrame = requestAnimationFrame(() => {
                        draw(hoverIdx);
                        if (tooltip) {
                            let pt = history[hoverIdx];
                            let html = `<strong style="font-size:1.15em; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:4px; display:block; margin-bottom:6px;">${pt.label}</strong>`;

                            let turnCands = turnCandsCache[hoverIdx];
                            for (let i = 0; i < turnCands.length; i++) {
                                let p = turnCands[i];
                                let meta = candMeta[p.pk];
                                let mainText = mKey === 'pv' ? p.pv.toFixed(1) + "%" : p.ev + " EV";
                                let subText = mKey === 'pv' ? p.ev + " EV" : p.pv.toFixed(1) + "%";
                                html += `<div style="margin:3px 0; display:flex; align-items:center;">
                                    <span style="color:${meta.color}; font-size:1.4em; line-height:0.8; margin-right:6px;">■</span>
                                    <b style="flex-grow:1; margin-right:12px;">${meta.name}</b>
                                    <span>${mainText} <span style="color:#aaa; font-size:0.85em;">(${subText})</span></span>
                                </div>`;
                            }
                            tooltip.innerHTML = html;
                            tooltip.style.display = "block";
                        }
                    });
                }

                if (tooltip && tooltip.style.display === "block") {
                    let actualMouseX = e.clientX - rect.left;
                    let actualMouseY = e.clientY - rect.top;

                    let ttX = actualMouseX + 15;
                    let ttY = actualMouseY + 15;

                    if (ttX + tooltip.offsetWidth > rect.width) ttX = actualMouseX - tooltip.offsetWidth - 15;
                    if (ttY + tooltip.offsetHeight > rect.height) ttY = actualMouseY - tooltip.offsetHeight - 15;

                    tooltip.style.transform = `translate(${ttX}px, ${ttY}px)`;
                }
            };

            canvas.onmouseleave = function() {
                if (lastHoverIdx !== -1) {
                    lastHoverIdx = -1;
                    if (hoverFrame) cancelAnimationFrame(hoverFrame);
                    hoverFrame = requestAnimationFrame(() => draw(-1));
                    if (tooltip) tooltip.style.display = "none";
                }
            };

            if (!isLarge) canvas.onclick = POLL.openLargeModal;
        },

        openLargeModal() {
            if (document.getElementById("graphModal")) return;
            let overlay = document.createElement("div");
            overlay.id = "graphModal";
            overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; opacity:0; transition:opacity 0.2s;";

            let container = document.createElement("div");
            container.style.cssText = "position:relative; width:95%; max-width:1100px; background-color:#fcfcfc; padding:25px; border-radius:10px; box-shadow:0 10px 40px rgba(0,0,0,0.6); transform:scale(0.95); transition:transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);";

            let closeBtn = document.createElement("button");
            closeBtn.innerHTML = "&times;";
            closeBtn.style.cssText = "position:absolute; top:12px; right:15px; cursor:pointer; width:30px; height:30px; background:#e74c3c; color:#fff; border:none; border-radius:50%; font-size:20px; font-weight:bold; line-height:30px; padding:0; text-align:center; box-shadow:0 2px 5px rgba(0,0,0,0.2);";
            closeBtn.onclick = () => {
                overlay.style.opacity = "0";
                container.style.transform = "scale(0.95)";
                setTimeout(() => document.body.removeChild(overlay), 200);
            };

            container.innerHTML = `
                <h2 style="margin:0 0 15px 0; color:#222; border-bottom:2px solid #ddd; padding-bottom:10px; font-family:sans-serif;">Campaign Polling History</h2>
                <div style="text-align:center; margin-bottom:15px; font-family:sans-serif; font-size:15px; color:#333;">
                    <label style="margin-right:25px; cursor:pointer; font-weight:bold;"><input type="radio" name="pollMetricLarge" value="pv" ${POLL.metric === 'pv' ? 'checked' : ''} onchange="window.pollgraph.switchMetric('pv')"> Popular Vote %</label>
                    <label style="margin-right:35px; cursor:pointer; font-weight:bold;"><input type="radio" name="pollMetricLarge" value="ev" ${POLL.metric === 'ev' ? 'checked' : ''} onchange="window.pollgraph.switchMetric('ev')"> Electoral Votes</label>
                    <label style="cursor:pointer; font-weight:normal; font-size:14px; color:#555;"><input type="checkbox" id="pollThirdPartyLarge" ${POLL.showThirdParties ? 'checked' : ''} onchange="window.pollgraph.toggleThirdParties(this.checked)"> Show Third Parties</label>
                </div>
                <div style="position:relative; width:100%;">
                    <canvas id="largePollGraph" style="width:100%; max-width:1050px; height:460px; display:block; margin:0 auto; cursor:crosshair; background:#fff; border-radius:8px; border:1px solid #ddd;"></canvas>
                    <div id="largePollTooltip" style="display:none; position:absolute; background:rgba(20,20,20,0.95); color:#fff; padding:12px; border-radius:8px; font-size:15px; font-family:sans-serif; pointer-events:none; box-shadow:0 5px 15px rgba(0,0,0,0.5); white-space:nowrap; left:0; top:0; transform:translate(0px, 0px); transition: transform 0.05s linear; z-index:100;"></div>
                </div>
            `;

            container.appendChild(closeBtn);
            overlay.appendChild(container);
            document.body.appendChild(overlay);

            requestAnimationFrame(() => {
                overlay.style.opacity = "1";
                container.style.transform = "scale(1)";
            });

            setTimeout(() => POLL.render("largePollGraph", "largePollTooltip", 1050, 460, true), 50);

            overlay.onclick = (e) => { if (e.target === overlay) closeBtn.click(); };
        }
    };

    POLL.init();
})();
