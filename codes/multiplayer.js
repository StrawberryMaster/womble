// This code allows for multiplayer functionality
// in Campaign Trail Showcase.
// based off the original from https://github.com/Mrcinemazo9nn/The-New-Campaign-Trail-MP
(async function () {
    console.log("Starting...");

    const e = campaignTrail_temp;
    const calculationCache = { qn: -1, cache: {} };

    window.answerEffects = function (t) {
        if (window.stopSpacebar && $("#visit_overlay")[0]) return;
        const numT = Number(t);
        const numCand = Number(e.candidate_id);
        const tToUse = t != null && Number.isNaN(numT) ? t : numT;

        e.player_answers.push(tToUse);
        const election = PROPS.ELECTIONS.get(String(e.election_id));

        const proceed = () => {
            if (e.mp_active && window.MP) {
                MP.submitTurn(tToUse);
            } else {
                nextQuestion();
            }
        };

        if (e.answer_feedback_flg === 1) {
            const feedback = e.answer_feedback_json.find(
                (f) => stringsEqual(f.fields.answer, tToUse) && stringsEqual(f.fields.candidate, numCand),
            )?.fields;
            if (feedback) {
                const n = `
                    <div class="overlay" id="visit_overlay"></div>
                    <div class="overlay_window" id="visit_window">
                        <div class="overlay_window_content" id="visit_content">
                            <h3>Advisor Feedback</h3>
                            <img src="${election.advisor_url}" width="208" height="128"/>
                            <p>${substitutePlaceholders(feedback.answer_feedback)}</p>
                        </div>
                        <div class="overlay_buttons" id="visit_buttons">
                            <button id="ok_button">OK</button>
                            <br>
                            <button id="no_feedback_button">Don't give me advice</button>
                        </div>
                    </div>
                `.trim();
                $("#game_window").append(n);
                $("#ok_button").click(() => {
                    $("#visit_overlay, #visit_window").remove();
                    proceed();
                });
                $("#no_feedback_button").click(() => {
                    e.answer_feedback_flg = 0;
                    $("#visit_overlay, #visit_window").remove();
                    proceed();
                });
            } else {
                proceed();
            }
        } else {
            proceed();
        }
    };

    window.A = function (t) {
        if (window.MP && MP.active) {
            if (calculationCache.qn !== e.question_number) {
                calculationCache.qn = e.question_number;
                calculationCache.cache = {};
            }
            if (calculationCache.cache[t]) {
                return calculationCache.cache[t];
            }
        }

        let result;
        if (window.MP && MP.active && MP.roomId) {
            const calculationSeed = `${MP.roomId}_qn${e.question_number}_t${t}`;
            const seed = cyrb128(calculationSeed);
            const localRand = sfc32(seed[0], seed[1], seed[2], seed[3]);

            const origRand = Math.random;
            Math.random = localRand;

            try {
                result = runCalculation(t);
            } finally {
                Math.random = origRand;
            }
        } else {
            result = runCalculation(t);
        }

        if (window.MP && MP.active) {
            calculationCache.cache[t] = result;
        }
        return result;

        function cyrb128(str) {
            let h1 = 1779033703, h2 = 3024733117, h3 = 3362453659, h4 = 2149369558;
            for (let i = 0, k; i < str.length; i++) {
                k = str.charCodeAt(i);
                h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
                h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
                h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
                h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
            }
            h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
            h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
            h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
            h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
            return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
        }

        function sfc32(a, b, c, d) {
            return function () {
                a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
                var t = (a + b) | 0;
                a = b ^ (b >>> 9);
                b = (c + (c << 3)) | 0;
                c = (c << 21) | (c >>> 11);
                d = (d + 1) | 0;
                t = (t + d) | 0;
                c = (c + t) | 0;
                return (t >>> 0) / 4294967296;
            }
        }

        function runCalculation(t) {
            const gp = PROPS.PARAMS;
            const variance = gp.global_variance;
            const candidateIssueWeight = gp.candidate_issue_weight;
            const runningMateIssueWeight = gp.running_mate_issue_weight;
            const voteVar = gp.vote_variable;
            const difficultyMult = e.difficulty_level_multiplier;
            const shiningVisitMult = (e.shining_data && e.shining_data.visit_multiplier) ?? 1;
            const playerAnswers = e.player_answers || [];
            const playerAnswersSet = new Set(playerAnswers);
            const gameType = Number(e.game_type_id);

            const candIdOpponents = [...new Set([e.candidate_id, ...e.opponents_list])];

            const stateFieldsByPk = new Map((e.states_json || []).map((s) => [s.pk, s.fields]));
            const stateAbbrByPk = new Map((e.states_json || []).map((s) => [s.pk, s.fields.abbr]));

            function seededRandomNormal(seedStr) {
                const seed = cyrb128(seedStr);
                const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
                let x, y, r2;
                do {
                    x = 2 * rand() - 1;
                    y = 2 * rand() - 1;
                    r2 = x ** 2 + y ** 2;
                } while (r2 >= 1 || r2 === 0);
                return x * Math.sqrt((-2 * Math.log(r2)) / r2);
            }

            const getRandNormal = (candId, stateId = null) => {
                if (window.MP && MP.active && MP.roomId) {
                    const suffix = stateId != null ? `_state${stateId}` : "";
                    const seedStr = `${MP.roomId}_qn${e.question_number}_t${t}_cand${candId}${suffix}`;
                    return seededRandomNormal(seedStr);
                }
                return randomNormal(candId);
            };

            const getStateRand = (stateId, salt = "") => {
                if (window.MP && MP.active && MP.roomId) {
                    const seedStr = `${MP.roomId}_qn${e.question_number}_t${t}_state${stateId}_${salt}`;
                    const seed = cyrb128(seedStr);
                    return sfc32(seed[0], seed[1], seed[2], seed[3])();
                }
                return Math.random();
            };

            const visitCountByState = (() => {
                const m = new Map();
                for (const st of (e.player_visits || [])) {
                    m.set(st, (m.get(st) || 0) + 1);
                }
                return m;
            })();

            const asgIndex = (() => {
                const m = new Map();
                for (const item of (e.answer_score_global_json || [])) {
                    const f = item.fields;
                    const k = `${f.answer}|${f.candidate}|${f.affected_candidate}`;
                    if (!m.has(k)) m.set(k, f.global_multiplier);
                }
                return m;
            })();

            const candsGAnsScores = candIdOpponents.map((candidate) => {
                let cumulScores = playerAnswers.reduce((total, answer) => {
                    const key = `${answer}|${e.candidate_id}|${candidate}`;
                    return total + (asgIndex.get(key) || 0);
                }, 0);

                const mpOppId = e.mp_opponent_candidate_id;
                const isMpGuestCandidate = mpOppId != null && candidate === mpOppId;

                const MP_NO_CROSS_ELECTIONS = [12, 11, 10, 15, 20, 4, 8];
                if (mpOppId != null && Array.isArray(e.player_answers_p2) && !MP_NO_CROSS_ELECTIONS.includes(Number(e.election_id))) {
                    const cumulScoresP2 = e.player_answers_p2.reduce((total, answer) => {
                        const key = `${answer}|${mpOppId}|${candidate}`;
                        return total + (asgIndex.get(key) || 0);
                    }, 0);
                    cumulScores += cumulScoresP2;
                }

                const isHumanPlayer = candidate === e.candidate_id || isMpGuestCandidate;
                const base = (isHumanPlayer && cumulScores < -0.4) ? 0.6 : 1 + cumulScores;
                const rand = 1 + getRandNormal(candidate) * variance;

                let mult = base * rand;
                if (candidate === e.candidate_id) {
                    mult *= difficultyMult;
                } else if (isMpGuestCandidate) {
                    mult *= (e.mp_guest_difficulty_multiplier ?? 1);
                }

                return {
                    candidate,
                    global_multiplier: mult,
                };
            });

            const issueByCandidate = (() => {
                const m = new Map();
                for (const item of (e.candidate_issue_score_json || [])) {
                    const cand = item.fields.candidate;
                    if (!m.has(cand)) m.set(cand, []);
                    m.get(cand).push(item);
                }
                return m;
            })();

            const candsIssueScores = candIdOpponents.map((candidate) => {
                const arr = issueByCandidate.get(candidate) || [];
                const v = arr.map((item) => ({
                    issue: item.fields.issue,
                    issue_score: item.fields.issue_score,
                }));
                return {
                    candidate_id: candidate,
                    issue_scores: removeIssueDuplicates(v),
                };
            });

            const runningMateByIssue = new Map((e.running_mate_issue_score_json || []).map((x) => [x.fields.issue, x]));

            const candIssueAgg = new Map();
            const stateIssueAgg = new Map();

            for (const answ of (e.answer_score_issue_json || [])) {
                const f = answ.fields;

                let tag = f.tag;
                if (!tag) {
                    if (f.candidate != null && f.state == null) tag = 'CANDIDATE';
                    else if (f.state != null && f.candidate == null) tag = 'STATE';
                    else if (f.candidate == null && f.state == null) tag = 'CANDIDATE';
                }

                if (tag !== 'CANDIDATE' && tag !== 'STATE')
                    throw new Error("Tag must be either of the two strings 'CANDIDATE' or 'STATE'");

                if (tag === 'CANDIDATE' && f.state != null)
                    throw new Error('Answer issue score can only apply to either a candidate or a state, but not both');

                if (tag === 'STATE' && f.candidate != null)
                    throw new Error('Answer issue score can only apply to either a state or a candidate, but not both');

                if (!playerAnswersSet.has(f.answer)) continue;

                const [tgtMap, tgtKey] = (tag === 'STATE')
                    ? [stateIssueAgg, f.state]
                    : [candIssueAgg, f.candidate || e.candidate_id];

                if (!tgtMap.has(tgtKey)) tgtMap.set(tgtKey, new Map());

                const inner = tgtMap.get(tgtKey);
                const prev = inner.get(f.issue) || { g: 0, b: 0 };
                prev.g += f.issue_score * f.issue_importance;
                prev.b += f.issue_importance;

                if (!inner.has(f.issue)) inner.set(f.issue, { ...prev });
            }

            for (const candIssueScore of candsIssueScores) {
                const candId = candIssueScore.candidate_id;
                const aggMap = candIssueAgg.get(candId);

                if (!aggMap && candId !== e.candidate_id) continue;

                candIssueScore.issue_scores = candIssueScore.issue_scores.map((it) => {
                    const { issue } = it;
                    const agg = (aggMap && aggMap.get(issue)) || { g: 0, b: 0 };

                    let rmScore = 0;
                    let rmWeight = 0;
                    if (candId === e.candidate_id) {
                        const runIssue = runningMateByIssue.get(issue);
                        if (!runIssue) {
                            console.warn(`No running mate issue for issue ${issue}`);
                            return it;
                        }
                        rmScore = runIssue.fields.issue_score;
                        rmWeight = runningMateIssueWeight;
                    }

                    const numerator = (it.issue_score * candidateIssueWeight)
                        + (rmScore * rmWeight)
                        + agg.g;
                    const denominator = (candidateIssueWeight + rmWeight + agg.b);
                    return {
                        ...it,
                        issue_score: numerator / denominator,
                    };
                });
            }

            const csmByCandidate = (() => {
                const filtered = (e.candidate_state_multiplier_json || []).filter(
                    (f) => f.model === "campaign_trail.candidate_state_multiplier",
                );
                const m = new Map();
                for (const item of filtered) {
                    const cand = item.fields.candidate;
                    if (!m.has(cand)) m.set(cand, []);
                    m.get(cand).push(item);
                }
                return m;
            })();

            const candsStateMults = candIdOpponents.map((candId, idx) => {
                const arr = csmByCandidate.get(candId) || [];
                const stateMults = arr.map((g) => {
                    const rand = getRandNormal(g.fields.candidate, Number(g.fields.state));
                    const effectiveMult = g.fields.state_multiplier
                        * candsGAnsScores[idx].global_multiplier
                        * (1 + rand * variance);
                    return { state: Number(g.fields.state), state_multiplier: effectiveMult };
                }).sort((a, b) => a.state - b.state);

                return { candidate_id: candId, state_multipliers: stateMults };
            });

            const asStateAgg = (() => {
                const m = new Map();
                for (const ans of (e.answer_score_state_json || [])) {
                    const f = ans.fields;
                    const k = `${f.candidate}|${f.state}|${f.answer}|${f.affected_candidate}`;
                    m.set(k, (m.get(k) || 0) + f.state_multiplier);
                }
                return m;
            })();

            candIdOpponents.forEach((cand, idx) => {
                candsStateMults[idx].state_multipliers.forEach((mult) => {
                    const { state } = mult;

                    let w = 0;
                    for (const ans of playerAnswers) {
                        w += asStateAgg.get(`${e.candidate_id}|${state}|${ans}|${cand}`) || 0;
                    }

                    const mpOppId = e.mp_opponent_candidate_id;
                    const MP_NO_CROSS_ELECTIONS = [12, 11, 10, 15, 20];
                    if (mpOppId != null && Array.isArray(e.player_answers_p2) && !MP_NO_CROSS_ELECTIONS.includes(Number(e.election_id))) {
                        for (const ans of e.player_answers_p2) {
                            w += asStateAgg.get(`${mpOppId}|${state}|${ans}|${cand}`) || 0;
                        }
                    }

                    let boost = 0;

                    if (idx === 0) {
                        if (e.running_mate_state_id === state) {
                            boost += 0.004 * mult.state_multiplier;
                        }
                        const visits = visitCountByState.get(state) || 0;
                        if (visits > 0) {
                            boost += visits * 0.005 * Math.max(0.1, mult.state_multiplier) * shiningVisitMult;
                        }
                    }

                    if (mpOppId != null && cand === mpOppId) {
                        if (e.mp_running_mate_state_id_p2 === state) {
                            boost += 0.004 * mult.state_multiplier;
                        }
                        if (Array.isArray(e.player_visits_p2)) {
                            const opponentVisits = e.player_visits_p2.filter((v) => v === state).length;
                            if (opponentVisits > 0) {
                                boost += opponentVisits * 0.005 * Math.max(0.1, mult.state_multiplier) * (e.mp_guest_visit_multiplier ?? 1);
                            }
                        }
                    }

                    mult.state_multiplier += w + boost;
                });
            });

            const stateIssueByState = (() => {
                const m = new Map();
                for (const s of (e.state_issue_score_json || [])) {
                    const f = s.fields;
                    if (!m.has(f.state)) m.set(f.state, new Map());
                    const inner = m.get(f.state);

                    if (!inner.has(f.issue)) inner.set(f.issue, { ...s.fields });
                }

                for (const [stateId, issuesMap] of stateIssueAgg.entries()) {
                    if (!m.has(stateId)) continue;

                    const stateIssues = m.get(stateId);
                    for (const [issueId, agg] of issuesMap.entries()) {
                        const sFields = stateIssues.get(issueId);
                        if (!sFields) continue;

                        const numerator = (sFields.state_issue_score * sFields.weight) + agg.g;
                        const denominator = sFields.weight + agg.b;

                        sFields.state_issue_score = numerator / denominator;
                    }
                }
                return m;
            })();

            e.computed_state_issue_scores = stateIssueByState;

            const smByCandIndex = candsStateMults.map((c) => {
                const m = new Map();
                for (const s of c.state_multipliers) m.set(s.state, s.state_multiplier);
                return m;
            });

            const baseStates = (candsStateMults[0] && candsStateMults[0].state_multipliers) || [];
            const calcStatePolls = baseStates.map((st) => {
                const { state } = st;

                const finalStatePoll = candIdOpponents.map((candId, r) => {
                    const smValue = smByCandIndex[r].get(state);
                    if (smValue == null) {
                        return { candidate: candId, result: 0 };
                    }

                    let score = 0;
                    const issuesR = candsIssueScores[r].issue_scores;
                    const issues0 = candsIssueScores[0].issue_scores;

                    for (let idx = 0; idx < issuesR.length; idx += 1) {
                        const iss = issuesR[idx];
                        const refIssue = issues0[idx] && issues0[idx].issue;
                        const stateIssueMap = stateIssueByState.get(state);
                        let stateScore = 0;
                        let issueWeight = 1;
                        if (stateIssueMap && stateIssueMap.has(refIssue)) {
                            const sFields = stateIssueMap.get(refIssue);
                            stateScore = sFields.state_issue_score;
                            issueWeight = sFields.weight;
                        }

                        const S = iss.issue_score * Math.abs(iss.issue_score);
                        const E = stateScore * Math.abs(stateScore);
                        score += (voteVar - Math.abs((S - E) * issueWeight));
                    }

                    if (typeof DEBUG !== "undefined" && DEBUG) {
                        console.log(`From key ${r} into f, state multiplier: ${smValue}`);
                    }

                    score = Math.max(score * smValue, 0);
                    return { candidate: candId, result: score };
                });

                return { state, result: finalStatePoll };
            });

            calcStatePolls.forEach((f) => {
                f.abbr = stateAbbrByPk.get(f.state)
                    ?? (e.states_json.find((g) => g.pk === f.state)?.fields.abbr ?? null);

                const sf = stateFieldsByPk.get(f.state);

                const M = sf ? Math.floor(sf.popular_votes * (0.95 + 0.1 * getStateRand(f.state, "pop"))) : 0;
                const total = f.result.reduce((acc, g) => acc + g.result, 0);
                f.result.forEach((g) => {
                    const N = g.result / total;
                    g.percent = N;
                    g.votes = Math.floor(N * M);
                });
                const O = sf ? sf.electoral_votes : 0;
                f.result.sort((a, b) => b.percent - a.percent);

                if ([1, 3].includes(gameType)) {
                    if (sf?.winner_take_all_flg === 1) {
                        f.result.forEach((g, idx) => {
                            g.electoral_votes = idx === 0 ? O : 0;
                        });
                    } else {
                        const H = f.result.reduce((acc, g) => acc + g.votes, 0);
                        const [L, D] = splitEVTopTwo(O, f.result[0].votes, H);
                        f.result.forEach((g, idx) => {
                            if (idx === 0) g.electoral_votes = L;
                            else if (idx === 1) g.electoral_votes = D;
                            else g.electoral_votes = 0;
                        });
                    }
                }

                if (gameType === 2) {
                    const V = f.result.map((g) => g.percent);
                    const q = divideElectoralVotesProp(V, O);
                    f.result.forEach((g, idx) => {
                        g.electoral_votes = q[idx];
                    });
                }
            });

            if (e.primary_states) {
                const primaryStates = JSON.parse(e.primary_states);
                const primaryMap = new Map();
                for (const ps of primaryStates) {
                    if (!primaryMap.has(ps.state)) primaryMap.set(ps.state, ps.result);
                }
                calcStatePolls.forEach((f) => {
                    if (primaryMap.has(f.state)) {
                        f.result = primaryMap.get(f.state);
                    }
                });
            }

            if (t === 1) {
                try {
                    const latest = getLatestRes(calcStatePolls);
                    window.res = latest;
                    [window.nn2] = window.res;
                    window.nn3 = window.nn2.map((c) => c.evvs || 0);
                } catch (err) { }
                return calcStatePolls;
            }

            if (t === 2) {
                const out = calcStatePolls.map((f) => {
                    const res = f.result.map((candidate) => {
                        const G = 1 + getRandNormal(candidate.candidate, f.state) * variance;
                        return { ...candidate, result: candidate.result * G };
                    });
                    const sf = stateFieldsByPk.get(f.state);
                    const M = sf ? Math.floor(sf.popular_votes * (0.95 + 0.1 * getStateRand(f.state, "pop_t2"))) : 0;
                    const total = res.reduce((acc, candidate) => acc + candidate.result, 0);
                    const N = res.map((candidate) => ({
                        ...candidate,
                        percent: candidate.result / total,
                        votes: Math.floor((candidate.result / total) * M),
                    }));
                    return { ...f, result: N };
                });

                try {
                    const latest = getLatestRes(out);
                    window.res = latest;
                    [window.nn2] = window.res;
                    window.nn3 = window.nn2.map((c) => c.evvs || 0);
                } catch (err) { }

                return out;
            }
        }
    };

    campaignTrail_temp.MP_internal = {
        A: window.A,
        n: window.answerEffects,
        nextQuestion: window.nextQuestion,
        o: window.questionHTML,
        electionNight: window.electionNight,
        election_HTML: window.election_HTML,
        findFromPK: window.findFromPK,
        S: (t) => e.election_json.findIndex((x) => String(x.pk) === String(t)),
        E: (t) => e.candidate_json.findIndex((x) => String(x.pk) === String(t))
    };

    (function () {
        "use strict";

        const DEFAULT_TIME_LIMIT_SECONDS = 5 * 60; // 5 minutes

        const MP = {
            active: false,
            role: null, // "host" | "guest"
            roomId: null,
            pc: null, // RTCPeerConnection instance
            dc: null, // RTCDataChannel instance
            sse: null, // EventSource signaling channel
            guestCandidateIdTemp: null,
            timeLimitSeconds: DEFAULT_TIME_LIMIT_SECONDS,
            myTurnData: {},
            theirTurnData: {},
            deadlineTimer: null,
            currentDeadline: null,
        };
        window.MP = MP;

        function getInternals() {
            return campaignTrail_temp.MP_internal || {};
        }

        function arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }

        function base64ToArrayBuffer(base64) {
            const binary = atob(base64);
            const len = binary.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes.buffer;
        }

        async function compressSDP(sdp) {
            if (typeof CompressionStream !== "undefined") {
                try {
                    const stream = new Blob([sdp]).stream();
                    const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
                    const response = new Response(compressedStream);
                    const buffer = await response.arrayBuffer();
                    return "C:" + arrayBufferToBase64(buffer);
                } catch (e) {
                    console.warn("Native CompressionStream failed. Falling back to Raw Base64:", e);
                }
            }
            return "R:" + btoa(sdp);
        }

        async function decompressSDP(payloadStr) {
            if (payloadStr.startsWith("C:")) {
                const base64 = payloadStr.substring(2);
                const buffer = base64ToArrayBuffer(base64);
                const stream = new Blob([buffer]).stream();
                const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
                const response = new Response(decompressedStream);
                return await response.text();
            } else if (payloadStr.startsWith("R:")) {
                return atob(payloadStr.substring(2));
            }
            return atob(payloadStr);
        }

        function makeRoomCode() {
            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            let code = "";
            for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
            return code;
        }

        function stateNameToPk(stateName) {
            const e = campaignTrail_temp;
            const found = (e.states_json || []).find(s => s.fields.name === stateName);
            return found ? found.pk : null;
        }

        function getCandidateRecord(pk) {
            const e = campaignTrail_temp;
            return (e.candidate_json || []).find(c => c.pk === Number(pk));
        }

        function runningMatesFor(candidateId) {
            const e = campaignTrail_temp;
            return (e.running_mate_json || [])
                .filter(f => f.fields.candidate === Number(candidateId))
                .map(f => f.fields.running_mate);
        }

        function runningMateOptionsHtml(candidateId) {
            const mates = runningMatesFor(candidateId);
            if (!mates.length) return `<option value="">(no running mate data found)</option>`;
            return mates.map(pk => {
                const rec = getCandidateRecord(pk);
                const name = rec ? `${rec.fields.first_name} ${rec.fields.last_name}` : `Running mate ${pk}`;
                return `<option value="${pk}">${name}</option>`;
            }).join("");
        }

        function computeOpponentsList(electionId, myCandidateId) {
            const e = campaignTrail_temp;
            const oppEntry = (e.opponents_default_json || []).find(f => f.election === electionId);
            if (!oppEntry) return [];

            const droppedOut = (e.candidate_dropout_json || [])
                .filter(f => f.fields.candidate === myCandidateId)
                .map(f => f.fields.affected_candidate);

            return oppEntry.candidates.filter(c => c !== myCandidateId && droppedOut.indexOf(c) === -1);
        }

        function firstRunningMateFor(candidateId) {
            const e = campaignTrail_temp;
            const match = (e.running_mate_json || []).find(f => f.fields.candidate === Number(candidateId));
            return match ? match.fields.running_mate : null;
        }

        function runningMateStateIdFor(candidateId) {
            const rmPk = firstRunningMateFor(candidateId);
            if (rmPk == null) return null;
            const rec = getCandidateRecord(rmPk);
            if (!rec) return null;
            return stateNameToPk(rec.fields.state);
        }

        function clearDeadlineTimer() {
            if (MP.deadlineTimer) {
                clearInterval(MP.deadlineTimer);
                MP.deadlineTimer = null;
            }
            $("#mp_turn_timer").text("");
        }

        function injectLobbyButton() {
            if ($("#mp_play_online_btn")[0]) return;
            const $gameStart = $("#game_start");
            if (!$gameStart.length) {
                setTimeout(injectLobbyButton, 250);
                return;
            }
            const btn = $(`<span class="campaign_trail_start_emphasis" style="margin-left:10px;">
                <button id="mp_play_online_btn"><strong>Play Online (vs. a friend)</strong></button>
            </span>`);
            $gameStart.parent().after(btn);
            btn.find("button").click(openLobbyChoiceModal);
        }

        function modalShell(innerHtml) {
            $("#mp_modal_overlay").remove();

            const overlay = $(`
                <div id="mp_modal_overlay" style="position:fixed; top:0; left:0; width:100%; height:100%;
                     background:rgba(0,0,0,0.6); z-index:9999; display:flex; align-items:center; justify-content:center;">
                    <div id="mp_modal_box" style="background:#F8F8F8; color:#000; max-width:500px; width:95%;
                         padding:1.5em; border:double #C9C9C9; border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,0.4);
                         max-height:90vh; overflow-y:auto; text-align:center;">
                        ${innerHtml}
                    </div>
                </div>
            `);

            $("body").append(overlay);
            return overlay;
        }

        function closeModal() {
            $("#mp_modal_overlay").remove();
        }

        function openLobbyChoiceModal() {
            const overlay = modalShell(`
                <h3 class="title_h3" style="background-color: #BFE6FF; padding: 0.5em 0; border-bottom: double #C9C9C9; margin-top: 0;">Play Online</h3>
                <p style="margin-top: 1.5em; font-size: 1.15em; line-height: 1.5em; text-align: left;">Play against a friend, each of you controlling one candidate, on separate devices. This room system establishes a direct browser-to-browser connection using serverless signaling.</p>
                <div style="margin-top: 2em; display: flex; justify-content: center; gap: 10px;">
                    <button id="mp_host_btn"><strong>Host a Game</strong></button>
                    <button id="mp_join_btn"><strong>Join a Game</strong></button>
                    <button id="mp_cancel_btn">Cancel</button>
                </div>
            `);
            overlay.find("#mp_cancel_btn").click(closeModal);
            overlay.find("#mp_host_btn").click(() => {
                closeModal();
                startHostFlow();
            });
            overlay.find("#mp_join_btn").click(() => {
                closeModal();
                openJoinModal();
            });
        }

        function startHostFlow() {
            MP.pendingHostSetup = true;
            modalShell(`
                <h3 class="title_h3" style="background-color: #BFE6FF; padding: 0.5em 0; border-bottom: double #C9C9C9; margin-top: 0;">Host Setup</h3>
                <p style="margin-top: 1.5em; font-size: 1.15em; line-height: 1.5em; text-align: left;">First, you need to set up your election options (candidate, running mate if available, and difficulty) on the mod menu.</p>
                <p style="font-style: italic; color: #7f8c8d; margin-top: 1em;">The multiplayer generator will pop up automatically as soon as your first question loads.</p>
                <div style="margin-top: 2em; display: flex; justify-content: center; gap: 10px;">
                    <button id="mp_ready_btn"><strong>Click here to begin!</strong></button>
                    <button id="mp_back_btn">Cancel</button>
                </div>
            `);
            $("#mp_back_btn").click(() => {
                MP.pendingHostSetup = false;
                closeModal();
            });
            $("#mp_ready_btn").click(() => {
                closeModal();
                setTimeout(() => { $("#game_start").click(); }, 80);
                watchForHostSetupComplete();
            });
        }

        function watchForHostSetupComplete() {
            const interval = setInterval(() => {
                if (!MP.pendingHostSetup) {
                    clearInterval(interval);
                    return;
                }
                const e = campaignTrail_temp;
                if (e.candidate_id && e.election_id && e.opponents_list && e.opponents_list.length &&
                    e.question_number === 0 && $("#answer_select_button")[0]) {
                    clearInterval(interval);
                    MP.pendingHostSetup = false;
                    openHostSetupPanel();
                }
            }, 400);
        }

        function openHostSetupPanel() {
            const e = campaignTrail_temp;

            if (String(e.game_type_id) === "3") {
                modalShell(`
                    <h3 class="title_h3" style="background-color: #FFB3B3; padding: 0.5em 0; border-bottom: double #C9C9C9; margin-top: 0;">Mode Unsupported</h3>
                    <p style="margin-top: 1.5em; font-size: 1.15em; line-height: 1.5em; padding: 0 10px;">As of now, the <i>Sea to Shining Sea</i> mode is not supported in online multiplayer. Please reload and set up a standard game (Default or Proportional) to play online.</p>
                    <div style="margin-top: 2em;">
                        <button id="mp_ok_btn">OK</button>
                    </div>
                `);
                $("#mp_ok_btn").click(closeModal);
                return;
            }

            const firstOpponentId = e.opponents_list[0];

            const opponentOptions = e.opponents_list
                .map(pk => {
                    const rec = getCandidateRecord(pk);
                    const name = rec ? `${rec.fields.first_name} ${rec.fields.last_name} (${rec.fields.party})` : `Candidate ${pk}`;
                    return `<option value="${pk}">${name}</option>`;
                })
                .join("");

            const overlay = modalShell(`
                <h3 class="title_h3" style="background-color: #BFE6FF; padding: 0.5em 0; border-bottom: double #C9C9C9; margin-top: 0;">Host Setup — Step 2</h3>
                <div style="text-align: left; margin: 1.5em 0.5em 0; font-size: 1.15em; line-height: 1.6em;">
                    <p>Your Candidate choice: <b>${e.candidate_last_name}</b></p>
                    <p style="margin-top: 1em;">
                        <label for="mp_opp_select">Select opponent's candidate:</label><br>
                        <select id="mp_opp_select" style="width:100%; margin-top:0.3em; padding: 0.3em; border: 2px double #C9C9C9; font-size: 0.95em;">${opponentOptions}</select>
                    </p>
                    <p style="margin-top: 1em;">
                        <label for="mp_opp_rm_select">Choose their running mate:</label><br>
                        <select id="mp_opp_rm_select" style="width:100%; margin-top:0.3em; padding: 0.3em; border: 2px double #C9C9C9; font-size: 0.95em;">${runningMateOptionsHtml(firstOpponentId)}</select>
                    </p>
                    <p style="margin-top: 1em;">
                        <label for="mp_time_limit">Turn clock limit (minutes):</label><br>
                        <input type="number" id="mp_time_limit" min="1" max="60" value="5" style="width:100%; margin-top:0.3em; padding: 0.3em; border: 2px double #C9C9C9; font-size: 0.95em;">
                    </p>
                </div>
                <div style="margin-top: 2em; display: flex; justify-content: center; gap: 10px;">
                    <button id="mp_init_p2p_host_btn"><strong>Create room</strong></button>
                    <button id="mp_setup_cancel_btn">Cancel</button>
                </div>
                <div id="mp_host_step3" style="display:none; margin-top:1.5em; text-align:center;">
                    <hr style="border: 0; border-top: 2px double #C9C9C9; margin: 1em 0;">
                    <p style="font-size:1.15em; margin-bottom: 0.3em;">Give this Room Code to your opponent:</p>
                    <h2 id="mp_display_room_code" style="letter-spacing:0.3em; font-size:2.8em; margin:0.2em 0; color:#700016; font-family: monospace; font-weight: bold;"></h2>
                    <p id="mp_waiting_text" style="color:#7f8c8d; font-style:italic; font-size: 1.05em;">Connecting to coordination network...</p>
                </div>
            `);

            overlay.find("#mp_opp_select").on("change", function () {
                const selectedId = Number($(this).val());
                overlay.find("#mp_opp_rm_select").html(runningMateOptionsHtml(selectedId));
            });

            overlay.find("#mp_setup_cancel_btn").click(closeModal);
            overlay.find("#mp_init_p2p_host_btn").click(() => {
                const guestCandidateId = Number($("#mp_opp_select").val());
                const guestRunningMateId = Number($("#mp_opp_rm_select").val());
                let minutes = Number($("#mp_time_limit").val());
                if (isNaN(minutes) || minutes < 1) minutes = 1;
                const timeLimitSeconds = Math.round(minutes * 60);

                const roomId = makeRoomCode();
                MP.roomId = roomId;
                MP.role = "host";
                MP.timeLimitSeconds = timeLimitSeconds;
                MP.guestCandidateIdTemp = guestCandidateId;
                MP.guestRunningMateIdTemp = guestRunningMateId;

                overlay.find("#mp_init_p2p_host_btn").prop("disabled", true);
                overlay.find("#mp_setup_cancel_btn").prop("disabled", true);
                overlay.find("#mp_display_room_code").text(roomId);
                overlay.find("#mp_host_step3").show();

                initiateHostWebRTC(roomId, overlay);
            });
        }

        function initiateHostWebRTC(roomId, overlay) {
            const topic = `tct-p2p-${roomId}`;
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            MP.pc = pc;

            pc.onconnectionstatechange = () => {
                if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
                    $("#mp_status_text").html(`<b style="color:#700016;">Direct connection lost.</b>`);
                } else if (pc.connectionState === "connected" && MP.active) {
                    const qn = campaignTrail_temp.question_number || 0;
                    $("#mp_status_text").html(`Room Code: <b>${MP.roomId}</b> | Direct connection established. Turn ${qn + 1} ready.`);
                }
            };

            const dc = pc.createDataChannel("tct_multiplayer");
            MP.dc = dc;
            setupDataChannelHandlers(dc);

            const sse = new EventSource(`https://ntfy.sh/${topic}/sse?since=all`);
            MP.sse = sse;

            sse.onmessage = async (event) => {
                let msgObj;
                try { msgObj = JSON.parse(event.data); } catch (e) { return; }
                if (msgObj.event === "message") {
                    let payload;
                    try {
                        const decompressed = await decompressSDP(msgObj.message);
                        payload = JSON.parse(decompressed);
                    } catch (e) { return; }

                    if (payload.sender === "guest" && payload.type === "answer" && !pc.currentRemoteDescription) {
                        const remoteAnswer = new RTCSessionDescription({
                            type: "answer",
                            sdp: payload.sdp
                        });
                        pc.setRemoteDescription(remoteAnswer).then(() => {
                            console.log("Remote answer assigned.");
                        }).catch(err => {
                            console.error("Failed to parse remote answer:", err);
                        });
                    }
                }
            };

            pc.onicecandidate = async (event) => {
                if (!event.candidate) {
                    const offerPayload = {
                        sender: "host",
                        type: "offer",
                        sdp: pc.localDescription.sdp
                    };
                    const compressed = await compressSDP(JSON.stringify(offerPayload));

                    fetch(`https://ntfy.sh/${topic}`, {
                        method: 'POST',
                        body: compressed
                    }).then(() => {
                        overlay.find("#mp_waiting_text").html(`<i>Waiting for opponent to connect...</i>`);
                    }).catch(err => {
                        console.error("Handshake transmission failed:", err);
                    });
                }
            };

            pc.createOffer().then(offer => {
                return pc.setLocalDescription(offer);
            }).catch(err => {
                console.error("Offer generation failed:", err);
            });
        }

        function openJoinModal() {
            const overlay = modalShell(`
                <h3 class="title_h3" style="background-color: #BFE6FF; padding: 0.5em 0; border-bottom: double #C9C9C9; margin-top: 0;">Join Game</h3>
                <div style="margin-top: 1.5em; text-align: center;">
                    <p style="font-size: 1.15em; margin-bottom: 0.8em;">Enter the 5-digit Room Code shared by the Host:</p>
                    <input type="text" id="mp_join_code" maxlength="5" style="text-align: center; font-size: 1.8em; font-family: monospace; letter-spacing: 0.3em; width: 60%; text-transform: uppercase; padding: 0.2em; border: 2px double #C9C9C9;" placeholder="CODE">
                </div>
                <div style="margin-top: 2em; display: flex; justify-content: center; gap: 10px;">
                    <button id="mp_join_confirm_btn" style="width: 40%;"><strong>Connect</strong></button>
                    <button id="mp_join_cancel_btn">Cancel</button>
                </div>
                <p id="mp_join_status" style="margin-top:1.5em; text-align:center; color:#7f8c8d; font-style:italic; font-size: 1.05em; display:none;"></p>
            `);

            overlay.find("#mp_join_cancel_btn").click(closeModal);
            overlay.find("#mp_join_confirm_btn").click(() => {
                const code = overlay.find("#mp_join_code").val().trim().toUpperCase();
                if (code.length !== 5) {
                    alert("Please enter a valid 5-character room code.");
                    return;
                }
                overlay.find("#mp_join_confirm_btn").prop("disabled", true);
                overlay.find("#mp_join_status").text("Locating host peer route...").show();
                initiateGuestWebRTC(code, overlay);
            });
        }

        function initiateGuestWebRTC(roomId, overlay) {
            const topic = `tct-p2p-${roomId}`;
            MP.roomId = roomId;
            MP.role = "guest";

            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            MP.pc = pc;

            pc.onconnectionstatechange = () => {
                if (pc.connectionState === "disconnected" || pc.connectionState === "failed" || pc.connectionState === "closed") {
                    $("#mp_status_text").html(`<b style="color:#700016;">Direct connection lost.</b>`);
                } else if (pc.connectionState === "connected" && MP.active) {
                    const qn = campaignTrail_temp.question_number || 0;
                    $("#mp_status_text").html(`Room Code: <b>${MP.roomId}</b> | Direct connection established. Turn ${qn + 1} ready.`);
                }
            };

            pc.ondatachannel = (event) => {
                MP.dc = event.channel;
                setupDataChannelHandlers(event.channel);
            };

            const sse = new EventSource(`https://ntfy.sh/${topic}/sse?since=all`);
            MP.sse = sse;

            sse.onmessage = async (event) => {
                let msgObj;
                try { msgObj = JSON.parse(event.data); } catch (e) { return; }
                if (msgObj.event === "message") {
                    let payload;
                    try {
                        const decompressed = await decompressSDP(msgObj.message);
                        payload = JSON.parse(decompressed);
                    } catch (e) { return; }

                    if (payload.sender === "host" && payload.type === "offer" && !pc.remoteDescription) {
                        overlay.find("#mp_join_status").text("Processing incoming host params...");

                        const remoteOffer = new RTCSessionDescription({
                            type: "offer",
                            sdp: payload.sdp
                        });

                        pc.setRemoteDescription(remoteOffer).then(() => {
                            return pc.createAnswer();
                        }).then(answer => {
                            return pc.setLocalDescription(answer);
                        }).catch(err => {
                            console.error("Local SDP answer generation failed:", err);
                        });
                    }
                }
            };

            pc.onicecandidate = async (event) => {
                if (!event.candidate) {
                    const answerPayload = {
                        sender: "guest",
                        type: "answer",
                        sdp: pc.localDescription.sdp
                    };
                    const compressed = await compressSDP(JSON.stringify(answerPayload));

                    fetch(`https://ntfy.sh/${topic}`, {
                        method: 'POST',
                        body: compressed
                    }).then(() => {
                        overlay.find("#mp_join_status").text("Activating direct WebRTC channel...");
                    }).catch(err => {
                        console.error("Could not broadcast guest answer:", err);
                    });
                }
            };
        }

        function setupDataChannelHandlers(dc) {
            dc.onopen = () => {
                console.log("P2P data channel opened.");

                if (MP.sse) {
                    MP.sse.close();
                    MP.sse = null;
                }

                if (MP.role === "host") {
                    const e = campaignTrail_temp;
                    const difficultyEntry = (e.difficulty_level_json || []).find(d => String(d.pk) === String(e.difficulty_level_id));
                    const difficultyMultiplier = difficultyEntry ? difficultyEntry.fields.multiplier : (e.difficulty_level_multiplier || 1);

                    let isHostModded = false;
                    try { if (typeof modded !== "undefined" && modded) isHostModded = true; } catch (err) { }

                    const config = {
                        electionId: Number(e.election_id),
                        hostCandidateId: Number(e.candidate_id),
                        hostRunningMateId: Number(e.running_mate_id),
                        guestCandidateId: MP.guestCandidateIdTemp,
                        guestRunningMateId: MP.guestRunningMateIdTemp,
                        gameTypeId: String(e.game_type_id),
                        difficultyLevelId: Number(e.difficulty_level_id),
                        difficultyMultiplier: difficultyMultiplier,
                        timeLimitSeconds: MP.timeLimitSeconds,
                        createdAt: Date.now(),
                        isModded: isHostModded,
                        modSelectVal: $("#modSelect")[0] ? $("#modSelect")[0].value : "other",
                        customModVal: (typeof customMod !== "undefined") ? customMod : null,
                        codeset1Val: $("#codeset1")[0] ? $("#codeset1")[0].value : "",
                        codeset2Val: $("#codeset2")[0] ? $("#codeset2")[0].value : "",
                        codeset3Val: $("#codeset3")[0] ? $("#codeset3")[0].value : "",
                    };

                    dc.send(JSON.stringify({
                        type: 'CONFIG',
                        config: config
                    }));

                    initMultiplayerState(config, "host");
                    closeModal();

                    const guestRunningMateId = config.guestRunningMateId;
                    mergeOpponentScoringTables(config, config.guestCandidateId, guestRunningMateId, () => { });
                }
            };

            dc.onmessage = async (event) => {
                let data;
                try {
                    data = JSON.parse(event.data);
                } catch (e) {
                    return;
                }

                if (data.type === 'CONFIG') {
                    const config = data.config;
                    MP.timeLimitSeconds = config.timeLimitSeconds || DEFAULT_TIME_LIMIT_SECONDS;

                    if (config.isModded) {
                        try { window.modded = true; } catch (err) { }
                        if (config.modSelectVal && config.modSelectVal !== "other") {
                            await evalFromUrl(`../static/mods/${config.modSelectVal}_init.html`);
                        } else if (config.codeset1Val) {
                            executeMod(config.codeset1Val, {
                                campaignTrail_temp, window, document, $, jQuery
                            });
                        }
                    }
                    loadGuestScenario(config);
                    closeModal();
                }
                else if (data.type === 'TURN') {
                    handleOpponentTurn(data.qn, data.turn);
                }
                else if (data.type === 'FINAL_RESULTS') {
                    const e = campaignTrail_temp;
                    e.final_state_results = data.state_results;
                    e.final_overall_results = data.overall_results;
                    getInternals().electionNight();
                    $("#mp_status_bar").remove();
                }
            };

            dc.onclose = () => {
                if (MP.sse) {
                    MP.sse.close();
                    MP.sse = null;
                }
                $("#mp_status_text").html(`<b style="color:#700016;">Direct connection closed.</b>`);
            };
        }

        function loadGuestScenario(config) {
            const waitForBaseData = setInterval(() => {
                const e = campaignTrail_temp;
                if (!(e.candidate_json && e.candidate_json.length && e.election_json && e.election_json.length &&
                    e.opponents_default_json && e.running_mate_json)) {
                    return;
                }
                clearInterval(waitForBaseData);

                const internals = getInternals();
                if (!internals.election_HTML) {
                    setTimeout(() => loadGuestScenario(config), 200);
                    return;
                }

                const guestCandidateId = config.guestCandidateId;
                const guestRunningMateId = config.guestRunningMateId != null
                    ? config.guestRunningMateId
                    : firstRunningMateFor(guestCandidateId);

                const filename = internals.election_HTML(config.electionId, guestCandidateId, guestRunningMateId);
                const url = "../static/questionset/" + filename;

                $("#game_window").load(url, async () => {
                    const e2 = campaignTrail_temp;

                    e2.question_number = 0;
                    e2.election_id = config.electionId;
                    e2.difficulty_level_id = config.difficultyLevelId;
                    e2.difficulty_level_multiplier = config.difficultyMultiplier;
                    e2.game_type_id = config.gameTypeId;
                    if (!Array.isArray(e2.player_answers)) e2.player_answers = [];
                    if (!Array.isArray(e2.player_visits)) e2.player_visits = [];

                    e2.candidate_id = guestCandidateId;
                    e2.running_mate_id = guestRunningMateId;
                    e2.opponents_list = computeOpponentsList(config.electionId, guestCandidateId);

                    e2.mp_opponent_candidate_id = config.hostCandidateId;
                    e2.mp_running_mate_state_id_p2 = runningMateStateIdFor(config.hostCandidateId);
                    e2.mp_guest_difficulty_multiplier = config.difficultyMultiplier;
                    e2.player_answers_p2 = [];
                    e2.player_visits_p2 = [];

                    initMultiplayerState(config, "guest");

                    if (config.isModded) {
                        const cands = PROPS.CANDIDATES;
                        const year = (e2.temp_election_list || []).find((f) => stringsEqual(f.id, e2.election_id))?.display_year || "2012";
                        const candName = cands.get(String(e2.candidate_id))?.last_name;
                        const runName = cands.get(String(e2.running_mate_id))?.last_name;

                        let loadedGuestCode2 = false;

                        if (candName && runName) {
                            const theorId = `${e2.code2_id || year}_${candName}${runName}`;
                            const theorUrl = `../static/mods/${theorId}.html`;
                            const exists = await fileExists(theorUrl);
                            if (exists) {
                                await evalFromUrl(theorUrl);
                                loadedGuestCode2 = true;

                                const endingUrl = `../static/mods/${theorId}_ending.html`;
                                const endingExists = await fileExists(endingUrl);
                                if (endingExists) {
                                    fetch(endingUrl).then(r => r.text()).then(text => {
                                        important_info = text;
                                    });
                                }
                            }
                        }

                        if (!loadedGuestCode2) {
                            if (config.codeset2Val) {
                                executeMod(config.codeset2Val, {
                                    campaignTrail_temp, window, document, $, jQuery
                                });
                            }
                            if (config.codeset3Val) {
                                important_info = config.codeset3Val;
                            }
                        }
                    }

                    const hostRunningMateId = config.hostRunningMateId;
                    mergeOpponentScoringTables(config, config.hostCandidateId, hostRunningMateId, () => {
                        const internals2 = getInternals();
                        internals2.o(internals2.A(2));
                    });
                });
            }, 200);
        }

        function mergeOpponentScoringTables(config, otherCandidateId, otherRunningMateId, callback) {
            const e = campaignTrail_temp;
            const internals = getInternals();

            if (!otherCandidateId) { callback(); return; }

            const filename = internals.election_HTML(config.electionId, otherCandidateId, otherRunningMateId);
            const url = "../static/questionset/" + filename;

            const myASG = e.answer_score_global_json || [];
            const myASS = e.answer_score_state_json || [];

            const snapshot = {};
            for (const key in e) snapshot[key] = e[key];

            const scratch = $('<div style="display:none;"></div>').appendTo("body");
            scratch.load(url, (responseText, textStatus, jqXHR) => {
                if (textStatus === "error") {
                    console.error("Failed to load opponent questionset: " + url);
                    scratch.remove();
                    callback();
                    return;
                }

                const otherASG = campaignTrail_temp.answer_score_global_json || [];
                const otherASS = campaignTrail_temp.answer_score_state_json || [];

                for (const key in snapshot) campaignTrail_temp[key] = snapshot[key];

                campaignTrail_temp.answer_score_global_json = mergeByKey(myASG, otherASG,
                    item => `${item.fields.candidate}-${item.fields.answer}-${item.fields.affected_candidate}`);
                campaignTrail_temp.answer_score_state_json = mergeByKey(myASS, otherASS,
                    item => `${item.fields.candidate}-${item.fields.answer}-${item.fields.state}-${item.fields.affected_candidate}`);

                scratch.remove();
                callback();
            });
        }

        function mergeByKey(arrA, arrB, keyFn) {
            const seen = new Set(arrA.map(keyFn));
            const merged = arrA.slice();
            for (const item of arrB) {
                const k = keyFn(item);
                if (!seen.has(k)) {
                    seen.add(k);
                    merged.push(item);
                }
            }
            return merged;
        }

        function initMultiplayerState(config, role) {
            const e = campaignTrail_temp;
            MP.active = true;
            MP.role = role;
            e.mp_active = true;

            if (role === "host") {
                e.mp_opponent_candidate_id = config.guestCandidateId;
                e.mp_running_mate_state_id_p2 = runningMateStateIdFor(config.guestCandidateId);
                e.mp_guest_difficulty_multiplier = config.difficultyMultiplier;
                if (!Array.isArray(e.player_answers_p2)) e.player_answers_p2 = [];
                if (!Array.isArray(e.player_visits_p2)) e.player_visits_p2 = [];
            }

            injectStatusBar();
            $("#mp_status_text").html(`Room Code: <b>${MP.roomId}</b> | Direct connection established. Turn 1 ready.`);
            startTurnTimer(0);
        }

        MP.submitTurn = function (answerId) {
            const e = campaignTrail_temp;
            const qn = e.question_number;

            clearDeadlineTimer();
            $("#answer_select_button").prop("disabled", true);

            let visit = null;
            const hasVisits = e.election_json && e.election_json[getInternals().S(e.election_id)] &&
                e.election_json[getInternals().S(e.election_id)].fields.has_visits === 1;
            if (hasVisits && qn % 2 === 0 && e.player_visits && e.player_visits.length) {
                visit = e.player_visits[e.player_visits.length - 1];
            }

            const turnPayload = {
                answer: Number(answerId),
                visit: visit,
                ts: Date.now()
            };

            MP.myTurnData[qn] = turnPayload;
            $("#mp_status_text").html(`Room Code: <b>${MP.roomId}</b> | Turn ${qn + 1} submitted. Waiting for opponent...`);

            if (MP.dc && MP.dc.readyState === "open") {
                MP.dc.send(JSON.stringify({
                    type: 'TURN',
                    qn: qn,
                    turn: turnPayload
                }));
            }

            if (MP.theirTurnData[qn]) {
                applyTurn(qn, {
                    mine: MP.myTurnData[qn],
                    theirs: MP.theirTurnData[qn]
                });
            }
        };

        function handleOpponentTurn(qn, turnData) {
            MP.theirTurnData[qn] = turnData;
            const currentQn = campaignTrail_temp.question_number;
            if (MP.myTurnData[qn] && currentQn === qn) {
                applyTurn(qn, {
                    mine: MP.myTurnData[qn],
                    theirs: turnData
                });
            } else if (!MP.myTurnData[qn] && currentQn === qn) {
                $("#mp_status_text").html(`Room Code: <b>${MP.roomId}</b> | Opponent submitted turn ${qn + 1}. Waiting for your answer...`);
            }
        }

        function applyTurn(qn, data) {
            const e = campaignTrail_temp;
            const internals = getInternals();

            const mine = data.mine;
            const theirs = data.theirs;

            e.player_answers_p2[qn] = theirs.answer;
            if (theirs.visit != null) {
                if (!Array.isArray(e.player_visits_p2)) e.player_visits_p2 = [];
                e.player_visits_p2.push(theirs.visit);
            }

            const questionCount = e.global_parameter_json[0].fields.question_count;
            const isFinalTurn = (qn + 1) === questionCount;

            if (isFinalTurn) {
                if (MP.role === "host") {
                    internals.nextQuestion();
                    if (MP.dc && MP.dc.readyState === "open") {
                        MP.dc.send(JSON.stringify({
                            type: 'FINAL_RESULTS',
                            state_results: e.final_state_results,
                            overall_results: e.final_overall_results
                        }));
                    }
                } else {
                    e.question_number = qn + 1;
                    $("#mp_status_text").html(`Room Code: <b>${MP.roomId}</b> | Tallying final results...`);
                }
                clearDeadlineTimer();
                return;
            }

            internals.nextQuestion();
            startTurnTimer(e.question_number);
            const nextQn = e.question_number;

            if (MP.theirTurnData[nextQn]) {
                $("#mp_status_text").html(`Room Code: <b>${MP.roomId}</b> | Opponent submitted turn ${nextQn + 1}. Waiting for your answer...`);
            } else {
                $("#mp_status_text").html(`Room Code: <b>${MP.roomId}</b> | Direct connection established. Turn ${nextQn + 1} ready.`);
            }
        }

        function startTurnTimer(questionNumber) {
            clearDeadlineTimer();
            const deadline = Date.now() + MP.timeLimitSeconds * 1000;
            MP.currentDeadline = deadline;
            runTimerUI(questionNumber, deadline);
        }

        function runTimerUI(questionNumber, deadline) {
            MP.deadlineTimer = setInterval(() => {
                const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
                const mins = Math.floor(remaining / 60);
                const secs = remaining % 60;

                $("#mp_turn_timer").text(`Clock: ${mins}:${secs.toString().padStart(2, "0")}`);

                if (remaining <= 0 && campaignTrail_temp.question_number === questionNumber) {
                    clearInterval(MP.deadlineTimer);
                    MP.deadlineTimer = null;
                    autoSubmitTurn(questionNumber);
                }
            }, 1000);
        }

        function autoSubmitTurn(questionNumber) {
            const e = campaignTrail_temp;
            if (e.question_number !== questionNumber) return;
            if ($("#visit_overlay")[0]) {
                $("#no_visit_button").click();
            }
            if ($("#confirm_visit_button")[0]) {
                $("#confirm_visit_button").click();
            }

            if (!$("#answer_select_button")[0] && $("#map_container")[0] && !$("#visit_overlay")[0]) {
                const paths = $("#map_container path, #map_container .state, #map_container [data-name]");
                if (paths.length) {
                    paths.eq(Math.floor(Math.random() * paths.length)).trigger("click");
                    setTimeout(() => {
                        if ($("#confirm_visit_button")[0]) $("#confirm_visit_button").click();
                        setTimeout(() => autoSubmitTurn(questionNumber), 300);
                    }, 300);
                    return;
                }
            }

            const radios = $("input[name=game_answers]");
            if (radios.length) {
                const idx = Math.floor(Math.random() * radios.length);
                radios.eq(idx).prop("checked", true);
                $("#answer_select_button").click();
            }
        }

        function injectStatusBar() {
            $("#mp_status_bar").remove();

            $("#game_window").before(`
                <div id="mp_status_bar" class="quote_fact_bar" style="width: auto; height: auto; margin: .5em; display: flex; justify-content: space-between; font-weight: bold; font-size: 1.22em; box-sizing: border-box; text-align: left; background-color: #fafafa; border-style: double; border-color: #d5d5d5;">
                    <span id="mp_status_text">Room Code: <b>${MP.roomId || ''}</b> | Initializing connection...</span>
                    <span id="mp_turn_timer" style="color: #700016; padding-right: 0.5em; margin: .2em 0 0 0; float: right;"></span>
                </div>
            `);
        }

        injectLobbyButton();
        console.log("Working!");
    })();
})();
