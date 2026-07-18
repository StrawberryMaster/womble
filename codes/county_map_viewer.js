// The county map feature from 2000TML
let CURRENT_YEAR = "2000";
let HISTORICAL_YEAR = "1996";

// precinct assets
const PMTILES_URLS = {
    "2008": "https://files.catbox.moe/p5rcjl.gz",
    "2012": "https://files.catbox.moe/it9ru8.gz",
    "2016": "https://files.catbox.moe/rdm8eg.gz",
    "2020": "https://files.catbox.moe/b59w5d.gz",
    "2024": "https://files.catbox.moe/hr6fc6.gz"
};

// congressional district assets
const CD_GEOJSON_BASE = "https://strawberrymaster.github.io/scripts/geojson";
const CD_VOTES_BASE = "https://strawberrymaster.github.io/scripts/cd_votes_data";

const STATE_PO_TO_FIPS = {
    "AL":"01","AK":"02","AZ":"04","AR":"05","CA":"06","CO":"08","CT":"09",
    "DE":"10","DC":"11","FL":"12","GA":"13","HI":"15","ID":"16","IL":"17",
    "IN":"18","IA":"19","KS":"20","KY":"21","LA":"22","ME":"23","MD":"24",
    "MA":"25","MI":"26","MN":"27","MS":"28","MO":"29","MT":"30","NE":"31",
    "NV":"32","NH":"33","NJ":"34","NM":"35","NY":"36","NC":"37","ND":"38",
    "OH":"39","OK":"40","OR":"41","PA":"42","RI":"44","SC":"45","SD":"46",
    "TN":"47","TX":"48","UT":"49","VT":"50","VA":"51","WA":"53","WV":"54",
    "WI":"55","WY":"56"
};

const STATE_FIPS_TO_PO = {};
for (const po in STATE_PO_TO_FIPS) {
    STATE_FIPS_TO_PO[STATE_PO_TO_FIPS[po]] = po;
}

function getPmTilesUrl(year) {
    return PMTILES_URLS[year] || "https://files.catbox.moe/p5rcjl.gz";
}

function getCdGeojsonUrl(vintage) {
    return `${CD_GEOJSON_BASE}/cd_${vintage}_albers.geojson`;
}

function getCdVotesUrl(year, vintage) {
    return `${CD_VOTES_BASE}/cd_votes_${year}_${vintage}.json`;
}

function getFeatureCdCode(f) {
    if (!f || !f.properties) return null;
    const p = f.properties;

    // check direct standard properties
    if (p.cd_code) return String(p.cd_code);
    if (p.CD_CODE) return String(p.CD_CODE);
    if (p.cd) return String(p.cd);

    // parse and normalize from GEOID (e.g. "0101" or "01001" or "3622")
    if (p.GEOID) {
        const geoid = String(p.GEOID);
        if (geoid.length === 4) {
            const stFips = geoid.slice(0, 2);
            const cdNum = geoid.slice(2);
            const stPo = STATE_FIPS_TO_PO[stFips];
            if (stPo) return `${stPo}-${cdNum.padStart(2, '0')}`;
        } else if (geoid.length === 5) {
            const stFips = geoid.slice(0, 2);
            const cdNum = geoid.slice(2);
            const stPo = STATE_FIPS_TO_PO[stFips];
            if (stPo) return `${stPo}-${String(parseInt(cdNum, 10)).padStart(2, '0')}`;
        }
    }

    // parse and normalize from STATEFP + CD field combo
    if (p.STATEFP) {
        const stPo = STATE_FIPS_TO_PO[p.STATEFP];
        const cdNum = p.CD113FP || p.CD114FP || p.CD115FP || p.CD116FP || p.CD117FP || p.CD118FP || p.CD119FP || p.CDFP;
        if (stPo && cdNum !== undefined) {
            return `${stPo}-${String(parseInt(cdNum, 10)).padStart(2, '0')}`;
        }
    }

    // fallback to parsing numeric Feature ID strings (e.g., "0101" or "101")
    if (f.id) {
        const idStr = String(f.id).padStart(4, '0');
        if (idStr.length === 4) {
            const stFips = idStr.slice(0, 2);
            const cdNum = idStr.slice(2);
            const stPo = STATE_FIPS_TO_PO[stFips];
            if (stPo) return `${stPo}-${cdNum.padStart(2, '0')}`;
        }
    }

    return null;
}

// helper to approximate geographic center of unprojected geometries
function getGeographicCentroid(geometry) {
    let sumX = 0, sumY = 0, count = 0;
    function processRings(rings) {
        rings.forEach(ring => {
            ring.forEach(pt => {
                if (Array.isArray(pt) && isFinite(pt[0]) && isFinite(pt[1])) {
                    sumX += pt[0];
                    sumY += pt[1];
                    count++;
                }
            });
        });
    }
    if (geometry.type === "Polygon") {
        processRings(geometry.coordinates);
    } else if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach(poly => processRings(poly));
    }
    return count > 0 ? [sumX / count, sumY / count] : null;
}

// approximate district weights from county shapes and district GeoJSON
function generateDistrictVotesTable(geojson, usCounties, fipsResults) {
    if (!geojson || !geojson.features) return {};

    const table = {};

    // group CD features by State PO and normalize IDs
    const cdsByState = {};
    geojson.features.forEach(f => {
        const cdCode = getFeatureCdCode(f);
        if (!cdCode) return;
        f.properties.cd_code = cdCode;

        const statePo = cdCode.includes('-') ? cdCode.split('-')[0].toUpperCase() : cdCode.slice(0, 2).toUpperCase();
        if (!cdsByState[statePo]) cdsByState[statePo] = [];
        cdsByState[statePo].push(f);
        table[cdCode] = {};
    });

    // group counties by State PO
    const countiesByState = {};
    usCounties.forEach(c => {
        const fips = String(c.id || c.fips || "").padStart(5, '0');
        const res = fipsResults[fips];
        const statePo = res ? res.state_po : (STATE_FIPS_TO_PO[fips.slice(0, 2)] || "");
        if (!statePo) return;

        if (!countiesByState[statePo]) countiesByState[statePo] = [];
        countiesByState[statePo].push(c);
    });

    // helpers for spatial point-in-polygon
    function pointInPoly(pt, ring) {
        let x = pt[0], y = pt[1], inside = false;
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            let xi = ring[i][0], yi = ring[i][1];
            let xj = ring[j][0], yj = ring[j][1];
            let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    function pointInGeom(pt, geom) {
        if (!geom || !geom.coordinates) return false;
        if (geom.type === "Polygon") {
            if (!pointInPoly(pt, geom.coordinates[0])) return false;
            for (let i = 1; i < geom.coordinates.length; i++) {
                if (pointInPoly(pt, geom.coordinates[i])) return false;
            }
            return true;
        } else if (geom.type === "MultiPolygon") {
            for (let k = 0; k < geom.coordinates.length; k++) {
                let poly = geom.coordinates[k];
                if (pointInPoly(pt, poly[0])) {
                    let inHole = false;
                    for (let i = 1; i < poly.length; i++) {
                        if (pointInPoly(pt, poly[i])) { inHole = true; break; }
                    }
                    if (!inHole) return true;
                }
            }
            return false;
        }
        return false;
    }

    // dynamic coordinate system classification
    const firstGeom = geojson.features[0]?.geometry;
    let coordinateSystem = "unknown"; // "scaled-screen", "raw-screen", "geographic", "projected-meters"
    let firstPt = null;

    if (firstGeom && firstGeom.coordinates) {
        if (firstGeom.type === "Polygon") {
            firstPt = firstGeom.coordinates[0][0];
        } else if (firstGeom.type === "MultiPolygon") {
            firstPt = firstGeom.coordinates[0][0][0];
        }
    }

    if (firstPt && Array.isArray(firstPt) && isFinite(firstPt[0])) {
        const x = firstPt[0];
        const y = firstPt[1];
        if (x >= 0 && x <= 12 && y >= 0 && y <= 8) {
            coordinateSystem = "scaled-screen";
        } else if (x > 12 && x <= 1000 && y >= 0 && y <= 650) {
            coordinateSystem = "raw-screen";
        } else if (x < 0 && x >= -180 && y >= 0 && y <= 90) {
            coordinateSystem = "geographic";
        } else {
            coordinateSystem = "projected-meters";
        }
    }

    const proj = coordinateSystem === "geographic" ? d3.geoAlbersUsa().scale(1300).translate([487.5, 305]) : null;
    const pathGenerator = proj ? d3.geoPath(proj) : d3.geoPath();

    // intersect counties and CDs
    for (const statePo in cdsByState) {
        const stateCds = cdsByState[statePo];
        const stateCounties = countiesByState[statePo] || [];

        if (stateCds.length === 0 || stateCounties.length === 0) continue;

        // single CD state (e.g. At-Large)
        if (stateCds.length === 1) {
            const cdCode = stateCds[0].properties.cd_code;
            stateCounties.forEach(c => {
                const fips = String(c.id || c.fips || "").padStart(5, '0');
                table[cdCode][fips] = 1.0;
            });
            continue;
        }

        // calculate CD centroids in screen coordinates
        stateCds.forEach(f => {
            if (!f.centroid) {
                try {
                    const cent = pathGenerator.centroid(f);
                    if (cent && isFinite(cent[0]) && isFinite(cent[1])) {
                        if (coordinateSystem === "scaled-screen") {
                            // convert back to [0, 975] screen coordinate space
                            f.centroid = [cent[0] * 100, cent[1] * 100];
                        } else {
                            f.centroid = cent;
                        }
                    }
                } catch (err) {
                    f.centroid = null;
                }

                // if projection fails, estimate centroid manually
                if (!f.centroid && f.geometry) {
                    try {
                        const geoCent = getGeographicCentroid(f.geometry);
                        if (geoCent) {
                            if (coordinateSystem === "geographic" && proj) {
                                const cent = proj(geoCent);
                                f.centroid = (cent && isFinite(cent[0]) && isFinite(cent[1])) ? cent : null;
                            } else if (coordinateSystem === "scaled-screen") {
                                f.centroid = [geoCent[0] * 100, geoCent[1] * 100];
                            } else {
                                f.centroid = geoCent;
                            }
                        }
                    } catch (err) {
                        f.centroid = null;
                    }
                }
            }
        });

        // multi-CD state matching
        stateCounties.forEach(c => {
            const fips = String(c.id || c.fips || "").padStart(5, '0');
            let cent = c.centroid;
            if (!cent && c.geometry) {
                try {
                    const pathCent = d3.geoPath().centroid(c);
                    if (isFinite(pathCent[0]) && isFinite(pathCent[1])) cent = pathCent;
                } catch (err) {}
            }
            if (!cent) return;

            let bbox;
            try {
                bbox = d3.geoPath().bounds(c);
            } catch (err) {
                bbox = [[cent[0] - 2, cent[1] - 2], [cent[0] + 2, cent[1] + 2]];
            }
            let w = (bbox[1][0] - bbox[0][0]) * 0.35 || 2.0;
            let h = (bbox[1][1] - bbox[0][1]) * 0.35 || 2.0;

            const samplePoints = [
                cent,
                [cent[0] - w, cent[1]],
                [cent[0] + w, cent[1]],
                [cent[0], cent[1] - h],
                [cent[0], cent[1] + h],
                [cent[0] - w, cent[1] - h],
                [cent[0] + w, cent[1] + h],
                [cent[0] - w, cent[1] + h],
                [cent[0] + w, cent[1] - h]
            ];

            const cdHits = {};
            let totalHits = 0;

            samplePoints.forEach(pt => {
                let testPt = pt;
                if (coordinateSystem === "geographic" && proj) {
                    try {
                        testPt = proj.invert(pt);
                    } catch (err) {
                        testPt = null;
                    }
                } else if (coordinateSystem === "scaled-screen") {
                    // downscale the county screen points to match the [0, 9.75] space
                    testPt = [pt[0] / 100, pt[1] / 100];
                }

                if (!testPt) return;

                for (let i = 0; i < stateCds.length; i++) {
                    const cdFeat = stateCds[i];
                    if (pointInGeom(testPt, cdFeat.geometry)) {
                        const cdCode = cdFeat.properties.cd_code;
                        cdHits[cdCode] = (cdHits[cdCode] || 0) + 1;
                        totalHits++;
                        break;
                    }
                }
            });

            if (totalHits > 0) {
                for (const cdCode in cdHits) {
                    table[cdCode][fips] = cdHits[cdCode] / totalHits;
                }
            } else {
                // border-splitting fallback via inverse distance weighting (IDW)
                const cdDists = [];
                stateCds.forEach(cdFeat => {
                    if (cdFeat.centroid) {
                        const dx = cdFeat.centroid[0] - cent[0];
                        const dy = cdFeat.centroid[1] - cent[1];
                        const distSq = dx * dx + dy * dy;
                        cdDists.push({ cdCode: cdFeat.properties.cd_code, dist: Math.sqrt(distSq) });
                    }
                });

                cdDists.sort((a, b) => a.dist - b.dist);

                if (cdDists.length > 0) {
                    const closest = cdDists[0];
                    const second = cdDists[1];

                    // if the second closest district is far away, the county is safely inside the closest district
                    if (!second || (second.dist / Math.max(0.1, closest.dist)) > 2.5) {
                        table[closest.cdCode][fips] = 1.0;
                    } else {
                        // otherwise, the county is split/on the border, so smoothly distribute weights using IDW
                        const invClosest = 1 / (closest.dist * closest.dist || 0.01);
                        const invSecond = 1 / (second.dist * second.dist || 0.01);
                        const sumInv = invClosest + invSecond;

                        table[closest.cdCode][fips] = invClosest / sumInv;
                        table[second.cdCode][fips] = invSecond / sumInv;
                    }
                }
            }
        });
    }

    return table;
}

// computes district-level results with strict county-level partisan weight normalization
function computeCdMargins(table, fipsResults, demCandId, repCandId, tpCandidatesInGame) {
    const cdMargins = {};
    const cdTotals = {};
    const countyHistTotals = {}; // pre-pass aggregator for fallback county totals

    function parseVotes(obj) {
        if (!obj) return { d: 0, r: 0, o: 0 };

        if (Array.isArray(obj)) {
            const d = Number(obj[0] || 0);
            const r = Number(obj[1] || 0);
            const total = Number(obj[2] || 0);
            const o = Math.max(0, total - d - r);
            return { d, r, o };
        }

        if (typeof obj === 'object') {
            const d = Number(obj.dem || obj.d || obj.votes_dem || obj.dem_votes || obj.votes_d || 0);
            const r = Number(obj.rep || obj.r || obj.votes_rep || obj.rep_votes || obj.votes_r || 0);
            const o = Number(obj.other || obj.oth || obj.o || obj.votes_other || obj.other_votes || obj.votes_o || obj.votes_oth || 0);
            return { d, r, o };
        }

        return { d: 0, r: 0, o: 0 };
    }

    // sum up county-level totals from the loaded fallback table
    const keys = Object.keys(table || {});
    if (keys.length > 0) {
        const firstKey = keys[0];
        const firstVal = table[firstKey];

        if (Array.isArray(firstVal)) {
            for (const cdCode in table) {
                const arr = table[cdCode];
                if (Array.isArray(arr)) {
                    arr.forEach(piece => {
                        const fips = String(piece.fips || piece.f || "").replace(/\D/g, '').padStart(5, '0');
                        const { d, r, o } = parseVotes(piece);
                        if (!countyHistTotals[fips]) countyHistTotals[fips] = { dem: 0, rep: 0, other: 0 };
                        countyHistTotals[fips].dem += d;
                        countyHistTotals[fips].rep += r;
                        countyHistTotals[fips].other += o;
                    });
                }
            }
        } else if (typeof firstVal === 'object' && firstVal !== null) {
            const innerKeys = Object.keys(firstVal);
            if (innerKeys.length > 0) {
                const firstInnerKey = innerKeys[0];
                const isFirstKeyFips = /^(US)?\d{4,5}$/i.test(firstKey);
                const isInnerKeyFips = /^(US)?\d{4,5}$/i.test(firstInnerKey);

                if (isFirstKeyFips) {
                    for (const fips in table) {
                        const cdPieces = table[fips];
                        const cleanFips = String(fips).replace(/\D/g, '').padStart(5, '0');
                        for (const cdCode in cdPieces) {
                            const { d, r, o } = parseVotes(cdPieces[cdCode]);
                            if (!countyHistTotals[cleanFips]) countyHistTotals[cleanFips] = { dem: 0, rep: 0, other: 0 };
                            countyHistTotals[cleanFips].dem += d;
                            countyHistTotals[cleanFips].rep += r;
                            countyHistTotals[cleanFips].other += o;
                        }
                    }
                } else if (isInnerKeyFips) {
                    for (const cdCode in table) {
                        const fipsList = table[cdCode];
                        for (const fips in fipsList) {
                            const cleanFips = String(fips).replace(/\D/g, '').padStart(5, '0');
                            const { d, r, o } = parseVotes(fipsList[fips]);
                            if (!countyHistTotals[cleanFips]) countyHistTotals[cleanFips] = { dem: 0, rep: 0, other: 0 };
                            countyHistTotals[cleanFips].dem += d;
                            countyHistTotals[cleanFips].rep += r;
                            countyHistTotals[cleanFips].other += o;
                        }
                    }
                }
            }
        }
    }

    // distribute votes using partisan piece weights
    function addPiece(cdCode, fips, pieceData) {
        if (!cdTotals[cdCode]) {
            cdTotals[cdCode] = { dem: 0, rep: 0, other: 0, tp: {} };
        }

        const cleanF = String(fips).replace(/\D/g, '').padStart(5, '0');
        const res = fipsResults[cleanF];
        if (!res) return;

        let pieceDem = 0;
        let pieceRep = 0;
        let pieceOth = 0;

        if (typeof pieceData === 'number') {
            const weight = pieceData;
            pieceDem = res.curDem * weight;
            pieceRep = res.curRep * weight;
            pieceOth = res.curOth * weight;
        } else {
            const { d, r, o } = parseVotes(pieceData);
            const hist = countyHistTotals[cleanF];

            // convert to partisan segment weight shares relative to the fallback dataset
            const wD = (hist && hist.dem > 0) ? (d / hist.dem) : 0;
            const wR = (hist && hist.rep > 0) ? (r / hist.rep) : 0;
            const wO = (hist && hist.other > 0) ? (o / hist.other) : 0;

            // multiply active game county results by fallback partisan weight shares
            // falls back to raw ratio scaling if the decade segment total is 0
            pieceDem = (hist && hist.dem > 0) ? (res.curDem * wD) : (d * (res.baseDem > 0 ? res.curDem / res.baseDem : 1));
            pieceRep = (hist && hist.rep > 0) ? (res.curRep * wR) : (r * (res.baseRep > 0 ? res.curRep / res.baseRep : 1));
            pieceOth = (hist && hist.other > 0) ? (res.curOth * wO) : (o * (res.baseOth > 0 ? res.curOth / res.baseOth : 1));
        }

        cdTotals[cdCode].dem += pieceDem;
        cdTotals[cdCode].rep += pieceRep;
        cdTotals[cdCode].other += pieceOth;

        // distribute third party/other votes
        const tpShares = res.tpShares || {};
        if (tpCandidatesInGame && tpCandidatesInGame.length > 0) {
            tpCandidatesInGame.forEach(candId => {
                const share = (tpShares && tpShares[candId] !== undefined) ? tpShares[candId] : (1 / tpCandidatesInGame.length);
                cdTotals[cdCode].tp[candId] = (cdTotals[cdCode].tp[candId] || 0) + (pieceOth * share);
            });
        }
    }

    // run distribution loop
    if (keys.length > 0) {
        const firstKey = keys[0];
        const firstVal = table[firstKey];

        if (Array.isArray(firstVal)) {
            for (const cdCode in table) {
                const arr = table[cdCode];
                if (Array.isArray(arr)) {
                    arr.forEach(piece => {
                        const fips = String(piece.fips || piece.f || "").replace(/\D/g, '').padStart(5, '0');
                        addPiece(cdCode, fips, piece);
                    });
                }
            }
        } else if (typeof firstVal === 'object' && firstVal !== null) {
            const innerKeys = Object.keys(firstVal);
            if (innerKeys.length > 0) {
                const firstInnerKey = innerKeys[0];
                const isFirstKeyFips = /^(US)?\d{4,5}$/i.test(firstKey);
                const isInnerKeyFips = /^(US)?\d{4,5}$/i.test(firstInnerKey);

                if (isFirstKeyFips) {
                    for (const fips in table) {
                        const cdPieces = table[fips];
                        for (const cdCode in cdPieces) {
                            addPiece(cdCode, fips, cdPieces[cdCode]);
                        }
                    }
                } else if (isInnerKeyFips) {
                    for (const cdCode in table) {
                        const fipsList = table[cdCode];
                        for (const fips in fipsList) {
                            addPiece(cdCode, fips, fipsList[fips]);
                        }
                    }
                } else {
                    // direct district scaling fallback (for non-breakdown entries)
                    for (const cdCode in table) {
                        const val = table[cdCode];
                        const { d, r, o } = parseVotes(val);

                        const statePrefix = cdCode.includes('-') ? cdCode.split('-')[0].toUpperCase() : cdCode.slice(0, 2);

                        let sumRD = 0, sumRR = 0, sumRO = 0, count = 0;
                        for (const fips in fipsResults) {
                            const res = fipsResults[fips];
                            const isMatch = (res.state_po && res.state_po.toUpperCase() === statePrefix) || fips.startsWith(statePrefix);

                            if (isMatch) {
                                const rD = res.baseDem > 0 ? (res.curDem / res.baseDem) : 1;
                                const rR = res.baseRep > 0 ? (res.curRep / res.baseRep) : 1;
                                const rO = res.baseOth > 0 ? (res.curOth / res.baseOth) : 1;
                                sumRD += rD; sumRR += rR; sumRO += rO;
                                count++;
                            }
                        }
                        const avgRD = count > 0 ? (sumRD / count) : 1;
                        const avgRR = count > 0 ? (sumRR / count) : 1;
                        const avgRO = count > 0 ? (sumRO / count) : 1;

                        if (!cdTotals[cdCode]) {
                            cdTotals[cdCode] = { dem: 0, rep: 0, other: 0, tp: {} };
                        }
                        cdTotals[cdCode].dem += d * avgRD;
                        cdTotals[cdCode].rep += r * avgRR;
                        cdTotals[cdCode].other += o * avgRO;

                        // scale and distribute non-breakdown third party votes
                        if (tpCandidatesInGame && tpCandidatesInGame.length > 0) {
                            tpCandidatesInGame.forEach(candId => {
                                let sumShare = 0, fipsCount = 0;
                                for (const fips in fipsResults) {
                                    if (fips.startsWith(statePrefix)) {
                                        const res = fipsResults[fips];
                                        if (res.tpShares && res.tpShares[candId] !== undefined) {
                                            sumShare += res.tpShares[candId];
                                            fipsCount++;
                                        }
                                    }
                                }
                                const share = fipsCount > 0 ? (sumShare / fipsCount) : (1 / tpCandidatesInGame.length);
                                cdTotals[cdCode].tp[candId] = (cdTotals[cdCode].tp[candId] || 0) + (o * avgRO * share);
                            });
                        }
                    }
                }
            }
        }
    }

    for (const cdCode in cdTotals) {
        const { dem, rep, other, tp } = cdTotals[cdCode];
        const total = dem + rep + other;
        const margin = total > 0 ? (dem - rep) / total : 0;
        cdMargins[cdCode] = { dem, rep, other, tp, margin };
    }

    return cdMargins;
}

function getCustomPreference(key, defaultVal) {
    try {
        const prefs = JSON.parse(localStorage.getItem('tml_custom_preferences')) || {};
        return prefs.hasOwnProperty(key) ? prefs[key] : defaultVal;
    } catch(e) {
        return defaultVal;
    }
}

// suspends map re-renders while painting states or adjusting sliders
let isUserInteracting = false;
window.addEventListener("pointerdown", (e) => {
    if (e.target && (e.target.tagName === "INPUT" || e.target.closest("#map_controls") || e.target.closest("#redraw_panel") || e.target.closest("#cd_vintage_selector") || e.target.closest("#more_modes_selector"))) {
        isUserInteracting = true;
    }
}, { capture: true });
window.addEventListener("pointerup", () => {
    if (isUserInteracting) {
        isUserInteracting = false;
        if (window._triggerPrecinctUpdate) window._triggerPrecinctUpdate();
    }
}, { capture: true });

// inject button into DOM
function injectCountyMapButton() {
    if (!document.getElementById("county_map_button")) {
        const btn = document.createElement("button");
        btn.className = "final_menu_button";
        btn.id = "county_map_button";
        btn.textContent = "County Map";
        btn.onclick = countyMapScreenHtml;

        const ref = document.getElementById("final_election_map_button");
        if (ref) ref.parentNode.insertBefore(btn, ref.nextSibling);
    }
}

// shared HTML chunks
const MAP_CONTROLS_HTML = `
    <div id="map_controls" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; margin-bottom: 10px; font-family: Arial, sans-serif; font-size: 14px; background: rgba(0,0,0,0.08); padding: 10px; border-radius: 6px; color: #000; align-items: center;">
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="choropleth" checked> Margin</label>
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="voteshare"> Vote Share</label>
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="binary"> Solid Colors</label>
       <label style="cursor:pointer;" title="Bivariate palette based on total votes to highlight populous areas"><input type="radio" name="map_mode" value="density"> Margin + Density</label>
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="proportional"> Proportional</label>
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="flipped"> Flipped</label>
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="shift"> Shift (from '08)</label>

       <select id="more_modes_selector" style="font-size:13px; border:1px solid #ccc; border-radius:3px; padding:2px; font-family:sans-serif; cursor:pointer;">
           <option value="" selected>More...</option>
           <option value="redraw" style="color: #d9534f; font-weight: bold;">Redraw the States</option>
       </select>

       <select id="cd_vintage_selector" style="display:none; font-size:12px; border:1px solid #ccc; border-radius:3px; padding:2px; margin-left:10px; font-family:sans-serif;"></select>
    </div>
    <p id="county_map_status" style="margin-top: 0; text-align:center;"><i>Loading map data (this may take a moment)...</i></p>
`;

function getMapInstructionsHtml(mode) {
    let baseZoomText = mode === 'seamless'
        ? "<i>Scroll to zoom, click and drag to pan. Scroll all the way out to return to State Map.</i>"
        : "<i>Scroll to zoom, click and drag to pan.</i>";

    return `
        <div id="redraw_instructions" style="margin-top:5px; font-size:12px; text-align:center; display:none; font-weight:bold; color:#0056b3;">
            Right-Click & Drag to paint. Click to paint county, Shift+Click for state. Drag map to pan.
        </div>
        <div id="normal_instructions" style="margin-top:5px; font-size:12px; text-align:center;">
            ${baseZoomText}
        </div>
    `;
}

const REDRAW_PANEL_HTML = `
    <div id="redraw_panel" style="display:none; position:absolute; top:10px; right:10px; background:rgba(255,255,255,0.95); border:2px solid #333; border-radius:6px; width:280px; max-height:330px; flex-direction:column; box-shadow: 0 4px 8px rgba(0,0,0,0.4); z-index:10; font-family:sans-serif; text-align:left;">
        <div style="padding:10px; border-bottom:1px solid #ccc; background:#f8f9fa; border-radius:4px 4px 0 0;">
            <h4 style="margin:0 0 4px 0; color:#000; display:flex; justify-content:space-between;">
                <span>🖍️ Redraw the States</span>
                <span id="rs_ev_tracker" style="font-size:12px; font-weight:normal; color:#0056b3;">0 / 538 EV</span>
            </h4>
            <div style="display:flex; gap:5px; flex-wrap:wrap; font-size:11px; margin-top:6px;">
                <button id="rs_btn_new" style="flex:1; cursor:pointer;">+ New</button>
                <button id="rs_btn_existing" style="flex:1; cursor:pointer;" title="Load actual states">Load US</button>
                <button id="rs_btn_random" style="flex:1; cursor:pointer;" title="Generate random states">Randomize</button>
                <button id="rs_btn_clear" style="flex:1; cursor:pointer; color:red;">Clear</button>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; margin-top:8px; color:#555;">
                <div style="display:flex; gap:6px;">
                    <label style="cursor:pointer;"><input type="checkbox" id="rs_toggle_labels" checked> labels</label>
                    <label style="cursor:pointer;"><input type="checkbox" id="rs_toggle_counties"> counties</label>
                </div>
                <select id="rs_sort_mode" style="font-size:10px; border:1px solid #ccc; border-radius:3px; padding:1px;">
                    <option value="id">sort: id</option>
                    <option value="name">sort: a-z</option>
                    <option value="ev">sort: ev</option>
                </select>
            </div>
        </div>
        <div id="redraw_list" style="flex:1; overflow-y:auto; padding:5px; background:#fff;"></div>
        <div id="rs_results_panel" style="border-top:1px solid #ccc; padding:6px 8px; background:#f8f9fa; font-size:11px; font-family:sans-serif; display:none;"></div>
    </div>
`;

// determine active and historical years dynamically from current campaign session data
function getActiveYears() {
    // fall back to the top-level configured values if game data is unavailable
    let current = CURRENT_YEAR || "2012";
    let historical = HISTORICAL_YEAR || "2008";
    try {
        const electionData = window.campaignTrail_temp || window.e;
        if (electionData && electionData.election) {
            const activeY = electionData.election.year || (electionData.election.fields && electionData.election.fields.year);
            if (activeY) {
                current = String(activeY);
                historical = String(parseInt(activeY, 10) - 4);
            }
        }
    } catch (e) {}

    // adjust historical shift year dynamically if shuffler list is loaded
    if (window.MW_SHUFFLER_DATA && window.MW_SHUFFLER_DATA.years) {
        const yList = window.MW_SHUFFLER_DATA.years;
        const curYInt = parseInt(current, 10);
        if (yList.includes(curYInt)) {
            const idx = yList.indexOf(curYInt);
            if (idx > 0) {
                historical = String(yList[idx - 1]);
            }
        }
    }
    return { current, historical };
}

function populateCdVintageSelector(year) {
    const selector = document.getElementById("cd_vintage_selector");
    if (!selector) return;

    selector.innerHTML = "";
    const vintages = [
        { value: "110", label: "110th Congress (2006)" },
        { value: "111", label: "111th Congress (2008)" },
        { value: "112", label: "112th Congress (2010)" },
        { value: "113", label: "113th Congress (2012)" },
        { value: "114", label: "114th Congress (2014)" },
        { value: "115", label: "115th Congress (2016)" },
        { value: "116", label: "116th Congress (2018)" },
        { value: "117", label: "117th Congress (2020)" },
        { value: "118", label: "118th Congress (2022)" },
        { value: "119", label: "119th Congress (2024)" },
        { value: "2026", label: "2026 (current)" }
    ];

    vintages.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v.value;
        opt.textContent = v.label;
        selector.appendChild(opt);
    });

    const yr = parseInt(year, 10);
    if (yr === 2008) selector.value = "111";
    else if (yr === 2012) selector.value = "113";
    else if (yr === 2016) selector.value = "115";
    else if (yr === 2020) selector.value = "117";
    else if (yr === 2024) selector.value = "119";
    else selector.value = "2026";
}

// inject into election map screen
function injectCountyMapInPlace(mode) {
    const mapContainer = document.getElementById("map_container");
    if (!mapContainer || document.getElementById("county_map_wrapper")) return;

    let toggleDiv, btnState, btnCounty;

    if (mode === 'together') {
        toggleDiv = document.createElement("div");
        toggleDiv.style.cssText = "display: flex; justify-content: center; gap: 10px; margin-bottom: 10px;";
        toggleDiv.innerHTML = `
            <button class="final_menu_button" id="btn_show_state_map" style="background:#ddd; color:#000;">State Map</button>
            <button class="final_menu_button" id="btn_show_county_map">County Map</button>
        `;
        mapContainer.parentNode.insertBefore(toggleDiv, mapContainer);
        btnState = toggleDiv.querySelector("#btn_show_state_map");
        btnCounty = toggleDiv.querySelector("#btn_show_county_map");
    }

    const originalChildren = Array.from(mapContainer.children);

    const countySvgContainer = document.createElement("div");
    countySvgContainer.id = "county_map_wrapper";
    countySvgContainer.style.display = "none";
    countySvgContainer.style.width = "100%";
    countySvgContainer.style.height = "100%";
    countySvgContainer.style.position = "relative";
    countySvgContainer.style.background = "#e2e6ea";
    countySvgContainer.style.overflow = "hidden";
    countySvgContainer.innerHTML = `
        <svg id="county_svg" viewBox="0 0 975 610" style="width: 100%; height: 100%; cursor: grab;"></svg>
        ${REDRAW_PANEL_HTML}
    `;
    mapContainer.appendChild(countySvgContainer);

    const controlsDiv = document.createElement("div");
    controlsDiv.id = "county_map_bottom_controls";
    controlsDiv.style.display = "none";
    controlsDiv.style.marginTop = "10px";

    // substitute historical year dynamically in the map mode label
    const { historical, current } = getActiveYears();
    let controlsHtml = MAP_CONTROLS_HTML.replace("from '08", `from '${historical.slice(-2)}`);
    controlsDiv.innerHTML = controlsHtml + getMapInstructionsHtml(mode);

    // populate advanced dropdown items if precincts are active for the current year
    const selectorElement = controlsDiv.querySelector("#more_modes_selector");
    if (selectorElement) {
        const precinctsOption = document.createElement("option");
        precinctsOption.value = "precinct";
        precinctsOption.textContent = "Precincts";
        precinctsOption.style.color = "#0275d8";
        precinctsOption.style.fontWeight = "bold";
        selectorElement.appendChild(precinctsOption);

        const districtsOption = document.createElement("option");
        districtsOption.value = "districts";
        districtsOption.textContent = "Districts";
        districtsOption.style.color = "#17a2b8";
        districtsOption.style.fontWeight = "bold";
        selectorElement.appendChild(districtsOption);
    }

    const mapFooter = document.getElementById("map_footer");
    if (mapFooter) {
        mapFooter.parentNode.insertBefore(controlsDiv, mapFooter);
    } else {
        mapContainer.parentNode.insertBefore(controlsDiv, mapContainer.nextSibling);
    }

    let countyLoaded = false;

    window._switchToStateMap = function() {
        originalChildren.forEach(c => c.style.display = '');
        countySvgContainer.style.display = "none";
        controlsDiv.style.display = "none";
        if (mode === 'together') {
            btnState.style.background = "#ddd";
            btnState.style.color = "#000";
            btnCounty.style.background = "";
            btnCounty.style.color = "";
        }
    };

    window._switchToCountyMap = function(zoomX, zoomY) {
        originalChildren.forEach(c => c.style.display = 'none');
        countySvgContainer.style.display = "block";
        controlsDiv.style.display = "block";
        if (mode === 'together') {
            btnCounty.style.background = "#ddd";
            btnCounty.style.color = "#000";
            btnState.style.background = "";
            btnState.style.color = "";
        }

        const handleZoom = () => {
            if (mode === 'seamless' && zoomX !== undefined && zoomY !== undefined && window._d3zoom) {
                const k = 2.5;
                const tx = zoomX - zoomX * k;
                const ty = zoomY - zoomY * k;
                d3.select("#county_svg").transition().duration(350).call(
                    window._d3zoom.transform,
                    d3.zoomIdentity.translate(tx, ty).scale(k)
                );
            }
        };

        if (!countyLoaded) {
            countyLoaded = true;
            loadAndDrawCountyMap(mode).then(handleZoom);
        } else {
            handleZoom();
        }
    };

    if (mode === 'together') {
        btnState.onclick = window._switchToStateMap;
        btnCounty.onclick = () => window._switchToCountyMap();
    } else if (mode === 'seamless') {
        // desktop: mouse wheel zoom
        mapContainer.addEventListener("wheel", (e) => {
            if (countySvgContainer.style.display === "block") return;
            if (e.deltaY < 0) {
                e.preventDefault();
                const rect = mapContainer.getBoundingClientRect();
                const rx = ((e.clientX - rect.left) / rect.width) * 975;
                const ry = ((e.clientY - rect.top) / rect.height) * 610;
                window._switchToCountyMap(rx, ry);
            }
        }, {passive: false, capture: true});

        // mobile: pinch-to-zoom and double-tap
        let initialPinchDist = null;
        let lastTap = 0;

        mapContainer.addEventListener("touchstart", (e) => {
            if (countySvgContainer.style.display === "block") return;

            // double tap to zoom
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0 && e.touches.length === 1) {
                e.preventDefault();
                const rect = mapContainer.getBoundingClientRect();
                const rx = ((e.touches[0].clientX - rect.left) / rect.width) * 975;
                const ry = ((e.touches[0].clientY - rect.top) / rect.height) * 610;
                window._switchToCountyMap(rx, ry);
            }
            lastTap = currentTime;

            // pinch to zoom initialize
            if (e.touches.length === 2) {
                initialPinchDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        }, {passive: false});

        mapContainer.addEventListener("touchmove", (e) => {
            if (countySvgContainer.style.display === "block" || !initialPinchDist) return;
            if (e.touches.length === 2) {
                const currentDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );

                // if user spreads fingers by more than 30px, zoom in
                if (currentDist > initialPinchDist + 30) {
                    e.preventDefault();
                    initialPinchDist = null;
                    const rect = mapContainer.getBoundingClientRect();
                    const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                    const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                    const rx = ((centerX - rect.left) / rect.width) * 975;
                    const ry = ((centerY - rect.top) / rect.height) * 610;
                    window._switchToCountyMap(rx, ry);
                }
            }
        }, {passive: false});

        mapContainer.addEventListener("touchend", () => { initialPinchDist = null; });
    }
}

// monkey-patch the core endgame screen functions
const screensToWrap = [
    "overallResultsHtml",
    "finalMapScreenHtml",
    "stateResultsHtml",
    "overallDetailsHtml",
    "furtherReadingHtml"
];

screensToWrap.forEach(fnName => {
    if (typeof window[fnName] === "function" && !window[fnName].patchedForCountyMap) {
        const originalFn = window[fnName];
        window[fnName] = function(...args) {
            originalFn.apply(this, args);

            const mode = getCustomPreference('countyZoom', 'separate');
            if (mode === 'separate') {
                setTimeout(injectCountyMapButton, 10);
            } else if (mode === 'together' || mode === 'seamless') {
                // only attach if we are exactly on the map screen
                if (fnName === 'finalMapScreenHtml') {
                    setTimeout(() => injectCountyMapInPlace(mode), 10);
                }
            }
        };
        window[fnName].patchedForCountyMap = true;
    }
});

// setup separate screen mode
function countyMapScreenHtml() {
    const gameHeader = document.querySelector(".game_header");
    const headerHtml = gameHeader ? gameHeader.outerHTML : `<div class="game_header">${window.corrr}</div>`;

    // substitute historical year dynamically in the map mode label
    const activeY = getActiveYears();
    let controlsHtml = MAP_CONTROLS_HTML.replace("from '08", `from '${activeY.historical.slice(-2)}`);

    document.getElementById("game_window").innerHTML = `
        ${headerHtml}
        <div id="main_content_area" style="padding-bottom: 20px; position:relative;">
            <h3 style="margin-bottom: 5px; color: #000;">SIMULATED COUNTY RESULTS</h3>

            ${controlsHtml}

            <div id="county_map_container" style="position:relative; width:100%; height:350px; display:flex; justify-content:center; align-items:center; background:#e2e6ea; border:1px solid #ccc; overflow:hidden;">
               <svg id="county_svg" viewBox="0 0 975 610" style="width: 100%; height: 100%; cursor: grab;"></svg>
               ${REDRAW_PANEL_HTML}
            </div>

            ${getMapInstructionsHtml('separate')}
        </div>
        <button class="final_menu_button" id="overall_results_button">Final Election Results</button>
        <button class="final_menu_button" id="final_election_map_button">Election Map</button>
        <button class="final_menu_button" id="county_map_button" disabled>County Map</button>
        <button class="final_menu_button" id="state_results_button">Results by State</button>
        <button class="final_menu_button" id="overall_details_button">Overall Results Details</button>
		<button class="final_menu_button" id="recommended_reading_button">Further Reading</button>
        <button class="final_menu_button" id="play_again_button">Play Again!</button>
    `;

    const moreSelector = document.getElementById("more_modes_selector");
    if (moreSelector) {
        const pr = document.createElement("option");
        pr.value = "precinct";
        pr.textContent = "Precincts";
        pr.style.color = "#0275d8";
        pr.style.fontWeight = "bold";
        moreSelector.appendChild(pr);

        const ds = document.createElement("option");
        ds.value = "districts";
        ds.textContent = "Districts";
        ds.style.color = "#17a2b8";
        ds.style.fontWeight = "bold";
        moreSelector.appendChild(ds);
    }

    document.getElementById("overall_results_button").onclick = window.overallResultsHtml;
    document.getElementById("final_election_map_button").onclick = window.finalMapScreenHtml;
    document.getElementById("state_results_button").onclick = window.stateResultsHtml;
    document.getElementById("overall_details_button").onclick = window.overallDetailsHtml;
    document.getElementById("play_again_button").onclick = window.beginNewGameHtml;
    if(document.getElementById("recommended_reading_button") && window.furtherReadingHtml) {
        document.getElementById("recommended_reading_button").onclick = window.furtherReadingHtml;
    }

    loadAndDrawCountyMap('separate');
}

// the actual county map rendering function
const _countyMapCache = { current: {}, historical: {}, us: null };

async function loadAndDrawCountyMap(mode) {
    // restore native Blob constructor
	// seems funny, but is necessary to get it working on mods like OBN
	try {
        new window.Blob([]);
    } catch (e) {
        try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            window.Blob = iframe.contentWindow.Blob;
            document.body.removeChild(iframe);
        } catch (recoveryError) {
            console.error("Failed to recover native Blob constructor:", recoveryError);
        }
    }

    const activeYears = getActiveYears();
    CURRENT_YEAR = activeYears.current;
    HISTORICAL_YEAR = activeYears.historical;

    const loadScript = src => new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = (err) => reject(err);
        document.head.appendChild(s);
    });

    const scriptsToLoad = [];
    if (!window.d3) scriptsToLoad.push(loadScript("https://cdn.jsdelivr.net/npm/d3@7"));
    if (!window.topojson) scriptsToLoad.push(loadScript("https://cdn.jsdelivr.net/npm/topojson@3.0.2/dist/topojson.min.js"));

    if (!window.maplibregl) scriptsToLoad.push(loadScript("https://unpkg.com/maplibre-gl@4.1.3/dist/maplibre-gl.js"));
    if (!window.pmtiles) scriptsToLoad.push(loadScript("https://unpkg.com/pmtiles@3.0.3/dist/pmtiles.js"));
    if (!document.getElementById("maplibre_css")) {
        const link = document.createElement("link");
        link.id = "maplibre_css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/maplibre-gl@4.1.3/dist/maplibre-gl.css";
        document.head.appendChild(link);
    }

    if (scriptsToLoad.length > 0) {
        try {
            await Promise.all(scriptsToLoad);
        } catch (err) {
            console.error("Could not load core rendering libraries:", err);
        }
    }

    if (!window.MW_SHUFFLER_DATA) {
        try {
            await loadScript("https://strawberrymaster.github.io/scripts/shuffler-data.js");
        } catch (err) {
            console.warn("Could not load shuffler data script:", err);
        }
    }
    if (!window.MW_COUNTIES_TOPO) {
        try {
            await loadScript("https://strawberrymaster.github.io/scripts/counties-albers-10m.js");
        } catch (err) {
            console.warn("Could not load counties topo script:", err);
        }
    }

    try {
        let countyResultsRaw, countyResultsHistoricalRaw, us;
        const electionData = window.campaignTrail_temp || window.e;

        // perform fetch and baseline adjustments only if cache is empty for the current years
        if (!_countyMapCache.current[CURRENT_YEAR] || !_countyMapCache.historical[HISTORICAL_YEAR] || !_countyMapCache.us) {
            let raw = [];
            let rawHistorical = [];
            let usData;

            // use the mapwise topojson if it was successfully loaded, otherwise fetch from npm
            if (window.MW_COUNTIES_TOPO) {
                usData = window.MW_COUNTIES_TOPO;
            } else {
                const usMapUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json";
                usData = await fetch(usMapUrl).then(r => r.json());
            }

            if (window.MW_SHUFFLER_DATA) {
                // map shuffler fields to county results format
                window.MW_SHUFFLER_DATA.counties.forEach(c => {
                    const fips = String(c.f).padStart(5, '0');
                    const curRes = c.r[CURRENT_YEAR];
                    if (curRes) {
                        raw.push({
                            fips: fips,
                            county_name: c.n,
                            state_po: c.s,
                            year: CURRENT_YEAR,
                            votes_dem: curRes[0] || 0,
                            votes_rep: curRes[1] || 0,
                            votes_other: curRes[2] || 0,
                            votes_all: (curRes[0] || 0) + (curRes[1] || 0) + (curRes[2] || 0),
                            tp: c.tp ? c.tp[CURRENT_YEAR] : null
                        });
                    }
                    const histRes = c.r[HISTORICAL_YEAR];
                    if (histRes) {
                        rawHistorical.push({
                            fips: fips,
                            county_name: c.n,
                            state_po: c.s,
                            year: HISTORICAL_YEAR,
                            votes_dem: histRes[0] || 0,
                            votes_rep: histRes[1] || 0,
                            votes_other: histRes[2] || 0,
                            votes_all: (histRes[0] || 0) + (histRes[1] || 0) + (histRes[2] || 0)
                        });
                    }
                });
            } else {
                // fall back to raw github json files
                const countyDataUrl = `https://raw.githubusercontent.com/StrawberryMaster/StrawberryMaster.github.io/refs/heads/master/scripts/county_results_${CURRENT_YEAR}.min.json`;
                const countyDataHistoricalUrl = `https://raw.githubusercontent.com/StrawberryMaster/StrawberryMaster.github.io/refs/heads/master/scripts/county_results_${HISTORICAL_YEAR}.min.json`;

                [raw, rawHistorical] = await Promise.all([
                    fetch(countyDataUrl).then(r => r.json()),
                    fetch(countyDataHistoricalUrl).then(r => r.json()).catch(() => [])
                ]);
            }

            // pre-standardize and pad FIPS keys to five characters
            raw.forEach(c => c.fips = String(c.fips).padStart(5, '0'));
            rawHistorical.forEach(c => c.fips = String(c.fips).padStart(5, '0'));

			 const akBoroughMap = {
                "02020": { name: "Anchorage", d:["02010","02011","02012","02014","02015","02016","02017","02018","02019","02021","02022","02023","02024","02025"] },
                "02170": { name: "Matanuska-Susitna", d:["02026","02027","02028"] },
                "02090": { name: "Fairbanks North Star", d:["02029","02030","02031","02032","02033"] },
                "02110": { name: "Juneau", d:["02003","02004"] },
                "02122": { name: "Kenai Peninsula", d:["02007","02008","02009"] },
                "02150": { name: "Kodiak Island", d: ["02006"] },
                "02130": { name: "Ketchikan Gateway", d:["02001"] },
                "02198": { name: "Prince of Wales-Hyder", d:["02001"] },
                "02275": { name: "Wrangell", d:["02001"] },
                "02220": { name: "Sitka", d: ["02002"] },
                "02195": { name: "Petersburg", d: ["02002"] },
                "02282": { name: "Yakutat", d: ["02005"] },
                "02100": { name: "Haines", d: ["02005"] },
                "02230": { name: "Skagway", d: ["02005"] },
                "02105": { name: "Hoonah-Angoon", d: ["02005"] },
                "02063": { name: "Chugach", d:["02034"] },
                "02066": { name: "Copper River", d:["02034"] },
                "02261": { name: "Valdez-Cordova", d:["02034"] },
                "02068": { name: "Denali", d:["02034"] },
                "02240": { name: "Southeast Fairbanks", d:["02035"] },
                "02290": { name: "Yukon-Koyukuk", d: ["02036"] },
                "02188": { name: "Northwest Arctic", d: ["02037"] },
                "02185": { name: "North Slope", d: ["02037"] },
                "02180": { name: "Nome", d: ["02038"] },
                "02050": { name: "Bethel", d:["02039"] },
                "02158": { name: "Kusilvak", d:["02039"] },
                "02013": { name: "Aleutians East", d:["02040"] },
                "02016": { name: "Aleutians West", d: ["02040"] },
                "02060": { name: "Bristol Bay", d: ["02040"] },
                "02070": { name: "Dillingham", d: ["02040"] },
                "02164": { name: "Lake and Peninsula", d: ["02040"] }
            };

            function applyConditionalFixes(dataset, year) {
                if (!dataset) return dataset;
                const yearNum = parseInt(year, 10);

                // Shannon County, SD --> Oglala Lakota
                if (yearNum < 2016) {
                    dataset.forEach(c => {
                        if (c.fips === "46113") {
                            c.fips = "46102";
                        }
                    });
                }

                // synthesize modern Alaska boroughs
				// basically a rough guess to get them working in the map
                if (yearNum < 2020) {
                    const akDistricts = {};
                    dataset.forEach(c => {
                        if (c.state_po === "AK" && String(c.year) === String(year)) {
                            akDistricts[String(c.fips).padStart(5, '0')] = c;
                        }
                    });

                    const newBoroughs = [];
                    Object.keys(akBoroughMap).forEach(bFips => {
                        const bInfo = akBoroughMap[bFips];
                        let tDem = 0, tRep = 0, tOth = 0, tAll = 0;
                        bInfo.d.forEach(distFips => {
                            const dData = akDistricts[distFips];
                            if (dData) {
                                tDem += dData.votes_dem || 0;
                                tRep += dData.votes_rep || 0;
                                tOth += dData.votes_other || 0;
                                tAll += dData.votes_all || 0;
                            }
                        });
                        if (tAll > 0) {
                            newBoroughs.push({
                                fips: bFips, county_name: bInfo.name, state_po: "AK", year: String(year),
                                votes_dem: tDem, votes_rep: tRep, votes_other: tOth, votes_all: tAll
                            });
                        }
                    });

                    // remove old legislative districts and merge the synthesized boroughs
                    dataset = dataset.filter(c => !(c.state_po === "AK" && String(c.fips).startsWith("02") && c.county_name.includes("DISTRICT")));
                    dataset.push(...newBoroughs);
                }

                return dataset;
            }

            raw = applyConditionalFixes(raw, CURRENT_YEAR);
            rawHistorical = applyConditionalFixes(rawHistorical, HISTORICAL_YEAR);

            // cache the final processed arrays directly
            _countyMapCache.current[CURRENT_YEAR] = raw;
            _countyMapCache.historical[HISTORICAL_YEAR] = rawHistorical;
            _countyMapCache.us = usData;
        }

        // assign raw references directly
        countyResultsRaw = _countyMapCache.current[CURRENT_YEAR];
        countyResultsHistoricalRaw = _countyMapCache.historical[HISTORICAL_YEAR];
        us = _countyMapCache.us;

        // pre-process historical dataset
        const baseHistoricalMap = {};
        for (let i = 0, len = countyResultsHistoricalRaw.length; i < len; i++) {
            const c = countyResultsHistoricalRaw[i];
            if (c.year === HISTORICAL_YEAR) {
                baseHistoricalMap[c.fips] = c;
            }
        }

        // pre-process current dataset
        const baseCurrentMap = {};
        const stateBase = {};
        let nationalTotalVotes = 0;

        for (let i = 0, len = countyResultsRaw.length; i < len; i++) {
            const c = countyResultsRaw[i];
            if (c.year === CURRENT_YEAR) {
                baseCurrentMap[c.fips] = c;
                const st = c.state_po;
                if (!stateBase[st]) stateBase[st] = { dem: 0, rep: 0, other: 0, all: 0 };
                stateBase[st].dem += (c.votes_dem || 0);
                stateBase[st].rep += (c.votes_rep || 0);
                stateBase[st].other += (c.votes_other || 0);
                stateBase[st].all += (c.votes_all || 0);
                nationalTotalVotes += (c.votes_all || 0);
            }
        }

        const candsInfo = PROPS.CANDIDATES;
        const activeCandidates = electionData.final_overall_results.map(r => r.candidate);
        const topCands = [...electionData.final_overall_results].sort((a,b) => b.popular_votes - a.popular_votes);
        if (topCands.length < 2) throw new Error("Could not find two main candidates.");

        let demCandId = topCands[0].candidate, repCandId = topCands[1].candidate;

        const cand0Data = electionData.candidate_json.find(c => c.pk === demCandId)?.fields || {};
        const cand1Data = electionData.candidate_json.find(c => c.pk === repCandId)?.fields || {};
        const party0 = (cand0Data.party || "").toLowerCase();
        const party1 = (cand1Data.party || "").toLowerCase();

        const is0Dem = party0.includes("democrat");
        const is1Dem = party1.includes("democrat");
        const is0Rep = party0.includes("republican");
        const is1Rep = party1.includes("republican");

        if ((is0Dem && is1Rep) || (is1Dem && is0Rep)) {
            if (is1Dem) {
                demCandId = topCands[1].candidate;
                repCandId = topCands[0].candidate;
            }
        } else {
            const stateNY = electionData.final_state_results.find(s => s.abbr === "NY");
            const stateTX = electionData.final_state_results.find(s => s.abbr === "TX");
            if (stateNY && stateTX && (stateTX.result.find(r => r.candidate === demCandId)?.percent || 0) > (stateNY.result.find(r => r.candidate === demCandId)?.percent || 0)) {
                repCandId = topCands[0].candidate; demCandId = topCands[1].candidate;
            }
        }

        const demName = candsInfo.get(String(demCandId))?.last_name || "Democrat";
        const repName = candsInfo.get(String(repCandId))?.last_name || "Republican";
        const demColor = candsInfo.get(String(demCandId))?.color_hex || "#0000ff";
        const repColor = candsInfo.get(String(repCandId))?.color_hex || "#ff0000";

        const stateSwings = {};
        electionData.final_state_results.forEach(f => {
            const base = stateBase[f.abbr];
            const swings = {};
            f.result.forEach(r => {
                let basePct = 0;
                if (base && base.all > 0) {
                    if (r.candidate === demCandId) basePct = base.dem / base.all;
                    else if (r.candidate === repCandId) basePct = base.rep / base.all;
                    else basePct = (base.other / base.all) / Math.max(1, activeCandidates.length - 2);
                }
                swings[r.candidate] = (r.percent || 0) - basePct;
            });
            stateSwings[f.abbr] = swings;
        });

        const colorInterpolators = {};
        activeCandidates.forEach(candId => {
            colorInterpolators[candId] = d3.interpolateRgb("#ffffff", candsInfo.get(String(candId))?.color_hex || "#888888");
        });

        const usCounties = topojson.feature(us, us.objects.counties).features;
		const geomFips = us.objects.counties.geometries.map(g => String(g.id).padStart(5, '0'));
		const fipsToGeomIdx = {};
		geomFips.forEach((f, i) => fipsToGeomIdx[f] = i);
		const neighborData = topojson.neighbors(us.objects.counties.geometries);

        const path = d3.geoPath();
        let maxMarginVotes = 0;
        const densityScale = d3.scaleLog().domain([1000, 200000]).range([0, 1]).clamp(true);

        // caching pass
        const unnormalizedCounties = {};
        const simStateVotes = {};

        // target percentages straight from the game results
        const targetStatePct = {};
        electionData.final_state_results.forEach(f => {
            targetStatePct[f.abbr] = {};
            f.result.forEach(r => {
                targetStatePct[f.abbr][r.candidate] = r.percent || 0;
            });
        });

        // map third party candidates to game candidates using their names
        const tpCandidatesInGame = activeCandidates.filter(id => id !== demCandId && id !== repCandId);
        const tpMapping = {};
        if (window.MW_SHUFFLER_DATA) {
            const tpc = window.MW_SHUFFLER_DATA.tpCands ? window.MW_SHUFFLER_DATA.tpCands[CURRENT_YEAR] : null;
            if (tpc && Array.isArray(tpc)) {
                tpCandidatesInGame.forEach(candId => {
                    const cInfo = candsInfo.get(String(candId)) || {};
                    const lName = (cInfo.last_name || "").toLowerCase();
                    const fName = (cInfo.first_name || "").toLowerCase();
                    const party = (cInfo.party || "").toLowerCase();

                    // find the closest string match inside the shuffler metadata names
                    const idx = tpc.findIndex(name => {
                        const n = name.toLowerCase();
                        return n.includes(lName) || lName.includes(n) || n.includes(fName) || party.includes(n);
                    });
                    if (idx !== -1) {
                        tpMapping[candId] = idx;
                    }
                });
            }
        }

        // calculate raw swung baseline and accumulate simulated state totals
        usCounties.forEach(d => {
            d.fips = String(d.id).padStart(5, '0');
            const c = baseCurrentMap[d.fips];
            if (!c) return;

            const total = c.votes_all || 1;
            const swings = stateSwings[c.state_po] || {};

            const countyResults = activeCandidates.map(candId => {
                let baseVotes = 0;
                if (candId === demCandId) {
                    baseVotes = c.votes_dem || 0;
                } else if (candId === repCandId) {
                    baseVotes = c.votes_rep || 0;
                } else {
                    // map third party candidates using our mapping if available
                    if (tpMapping[candId] !== undefined && c.tp) {
                        baseVotes = c.tp[tpMapping[candId]] || 0;
                    } else {
                        // fallback to division of remaining other votes
                        const matchedTpIds = Object.keys(tpMapping).filter(id => c.tp && c.tp[tpMapping[id]] !== undefined);
                        const matchedVotesSum = matchedTpIds.reduce((sum, id) => sum + (c.tp[tpMapping[id]] || 0), 0);
                        const remainingOther = Math.max(0, (c.votes_other || 0) - matchedVotesSum);
                        const unmatchedCount = tpCandidatesInGame.length - matchedTpIds.length;
                        baseVotes = unmatchedCount > 0 ? (remainingOther / unmatchedCount) : 0;
                    }
                }
                let basePct = baseVotes / total;
                let rawSwing = swings[candId] || 0;

                // swing math (dampened to avoid going below 0 or above 100)
                let dampenedSwing = rawSwing > 0 ? rawSwing * (1 - basePct) * 1.2 : rawSwing * basePct * 1.2;
                let dynamicCap = Math.max(0.15, Math.abs(rawSwing) * 1.75);
                dampenedSwing = Math.max(-dynamicCap, Math.min(dynamicCap, dampenedSwing));
                let newPct = Math.max(0, Math.min(1, basePct + dampenedSwing));

                return { id: candId, pct: newPct, votes: newPct * total, baseVotes: baseVotes };
            });

            // make sure the raw estimates sum to 100% locally
            const sumPct = countyResults.reduce((sum, cr) => sum + cr.pct, 0);
            if (sumPct > 0) {
                countyResults.forEach(cr => {
                    cr.pct = cr.pct / sumPct;
                    cr.votes = cr.pct * total;
                });
            }

            unnormalizedCounties[d.fips] = { results: countyResults, total: total, state_po: c.state_po };

            // tally up simulated state totals
            if (!simStateVotes[c.state_po]) simStateVotes[c.state_po] = { total: 0 };
            simStateVotes[c.state_po].total += total;
            countyResults.forEach(cr => {
                simStateVotes[c.state_po][cr.id] = (simStateVotes[c.state_po][cr.id] || 0) + cr.votes;
            });
        });

        // apply state-level correction multipliers and finalize
        const fipsResults = {};
        const fipsMultipliers = {};

        usCounties.forEach(d => {
            const c = baseCurrentMap[d.fips];
            const unnorm = unnormalizedCounties[d.fips];
            if (!c || !unnorm) return;

			const total = unnorm.total;
            const st = c.state_po;
            const targetPcts = targetStatePct[st] || {};
            const simVotes = simStateVotes[st] || {};
            const stateTotalVotes = simVotes.total || 1;

            // normalize each candidate's votes against the game's actual state percentage
            const normalizedResults = unnorm.results.map(cr => {
                const targetPct = targetPcts[cr.id] || 0;
                const simPct = (simVotes[cr.id] || 0) / stateTotalVotes;

				let normVotes = cr.votes * (targetPct / simPct);
                if (simPct === 0 && targetPct > 0) {
                    // edge case: county swung to 0, but state has votes, so re-distribute proportionately.
                    normVotes = unnorm.total * targetPct;
                } else if (targetPct === 0) {
                    normVotes = 0;
                }
                return { ...cr, normVotes: normVotes };
            });

            // rescale finalized votes to exactly equal the county's total turnout capacity
            const normTotal = normalizedResults.reduce((sum, cr) => sum + cr.normVotes, 0);
            let finalResults = [];
            if (normTotal > 0) {
                finalResults = normalizedResults.map(cr => {
                    const finalPct = cr.normVotes / normTotal;
                    return {
                        id: cr.id,
                        pct: finalPct,
                        votes: Math.round(finalPct * unnorm.total),
                        baseVotes: cr.baseVotes
                    };
                });
            } else {
                finalResults = unnorm.results.map(cr => ({ ...cr, votes: Math.round(cr.votes) }));
            }

            // determine the IRL vs simulated winners
            let irlWinner = finalResults.reduce((prev, current) => (prev.baseVotes > current.baseVotes) ? prev : current);
            finalResults.sort((a, b) => b.pct - a.pct);

            const winner = finalResults[0];
            const flipped = irlWinner.id !== winner.id;
            const marginPct = winner.pct - (finalResults.length > 1 ? finalResults[1].pct : 0);
            const marginVotesEst = winner.votes - (finalResults.length > 1 ? finalResults[1].votes : 0);

            if (marginVotesEst > maxMarginVotes) maxMarginVotes = marginVotesEst;

            const candColor = candsInfo.get(String(winner.id))?.color_hex || "#888";

            // build bivariate density palette
            const dens = densityScale(total);

            // ensure even razor-thin margins retain a distinct tint of the candidate's color
            const colorWeight = 0.35 + 0.65 * Math.min(1, marginPct * 3.0);

            // high density: dark gray + candidate color
            const maxDensityColor = d3.interpolateRgb("#555555", candColor)(colorWeight);

            // low density: white + candidate color
            const minDensityColor = d3.interpolateRgb("#ffffff", candColor)(colorWeight * 0.4);

            const densityColor = d3.interpolateRgb(minDensityColor, maxDensityColor)(dens);

            // shift calculations
            const cHistorical = baseHistoricalMap[d.fips];
            let shiftHtml = "";
            let colorShift = "#ccc";

            if (cHistorical && cHistorical.votes_all > 0) {
                let histDemPct = (cHistorical.votes_dem || 0) / cHistorical.votes_all;
                let histRepPct = (cHistorical.votes_rep || 0) / cHistorical.votes_all;
                let histMargin = histDemPct - histRepPct;

                let simDemPct = 0, simRepPct = 0;
                finalResults.forEach(r => {
                    if (r.id === demCandId) simDemPct = r.pct;
                    if (r.id === repCandId) simRepPct = r.pct;
                });
                let simMargin = simDemPct - simRepPct;

                let shift = simMargin - histMargin; // positive = Dem shift, negative = Rep shift
                let shiftIntensity = Math.min(Math.abs(shift) * 3, 1); // max out visual at 33.3% shift

                if (shift > 0) {
                    colorShift = d3.interpolateRgb("#ffffff", demColor)(shiftIntensity);
                    shiftHtml = `<div style="color:#99ccff; font-size:12px; margin-top:2px;"><i>Shift: ${demName} +${(shift*100).toFixed(1)}%</i></div>`;
                } else {
                    colorShift = d3.interpolateRgb("#ffffff", repColor)(shiftIntensity);
                    shiftHtml = `<div style="color:#ff9999; font-size:12px; margin-top:2px;"><i>Shift: ${repName} +${(Math.abs(shift)*100).toFixed(1)}%</i></div>`;
                }
            } else {
                shiftHtml = `<div style="color:#aaa; font-size:12px; margin-top:2px;"><i>No ${HISTORICAL_YEAR} data available</i></div>`;
            }

            d.proj = {
                name: c.county_name, state: c.state_po, results: finalResults, totalVotes: unnorm.total, marginVotes: marginVotesEst,
                winnerId: winner.id,
                colorChoro: colorInterpolators[winner.id](Math.sqrt(marginPct)),
                colorShare: colorInterpolators[winner.id](winner.pct),
                colorBinary: candColor,
                colorDensity: densityColor,
                colorFlipped: flipped ? candColor : "#ececec",
                colorShift: colorShift,
                winText: `${candsInfo.get(String(winner.id))?.last_name} +${(marginPct * 100).toFixed(1)}% (${marginVotesEst.toLocaleString()} votes)`
            };

            d.proj.tooltipHtml = `<strong style="font-size:16px">${d.proj.name}, ${d.proj.state}</strong><br><div style="font-size:12px; color:#bbb; margin-top:-2px; margin-bottom:8px;">Total votes: ${unnorm.total.toLocaleString()}</div>` +
                finalResults.slice(0,3).map(r =>
                    `<div style="display:flex; align-items:center; margin-bottom: 4px;">
                        <span style="display:inline-block; width:12px; height:12px; background-color:${candsInfo.get(String(r.id))?.color_hex || '#888'}; margin-right:8px; border: 1px solid #aaa;"></span>
                        <span style="font-weight:bold;">${candsInfo.get(String(r.id))?.last_name}: ${(r.pct * 100).toFixed(1)}%</span>
                        <span style="color:#ccc; font-size:12px; margin-left:6px;">(${r.votes.toLocaleString()})</span>
                    </div>`).join('') +
                `<hr style="margin:6px 0; border:0; border-top:1px solid #777;"><div style="color:#ddd; font-size:13px; margin-top:4px;"><i>Margin: ${d.proj.winText}</i></div>` +
                (flipped ? `<div style="color:#ffb2b2; font-size:12px; margin-top:2px;"><i>Flipped from ${candsInfo.get(String(irlWinner.id))?.last_name}</i></div>` : `<div style="color:#b2ffb2; font-size:12px; margin-top:2px;"><i>Held by ${candsInfo.get(String(winner.id))?.last_name}</i></div>`) +
                shiftHtml;

            const cent = path.centroid(d);
            d.centroid = (isFinite(cent[0]) && isFinite(cent[1]) && (cent[0] !== 0 || cent[1] !== 0)) ? cent : null;

            // map D3 calculations to a results reference object for MapLibre
            const curDem = finalResults.find(r => r.id === demCandId)?.votes || 0;
            const curRep = finalResults.find(r => r.id === repCandId)?.votes || 0;
            const curOth = finalResults.filter(r => r.id !== demCandId && r.id !== repCandId).reduce((sum, r) => sum + r.votes, 0);

            const finalTPResults = finalResults.filter(r => r.id !== demCandId && r.id !== repCandId);
            const totalTPCountyVotes = finalTPResults.reduce((sum, r) => sum + r.votes, 0);
            const tpShares = {};
            if (totalTPCountyVotes > 0) {
                finalTPResults.forEach(r => {
                    tpShares[r.id] = r.votes / totalTPCountyVotes;
                });
            } else if (tpCandidatesInGame.length > 0) {
                tpCandidatesInGame.forEach(candId => {
                    tpShares[candId] = 1 / tpCandidatesInGame.length;
                });
            }

            fipsResults[d.fips] = {
                state_po: c.state_po,
                baseDem: c.votes_dem || 0,
                baseRep: c.votes_rep || 0,
                baseOth: c.votes_other || 0,
                curDem: curDem,
                curRep: curRep,
                curOth: curOth,
                tpShares: tpShares
            };

            fipsMultipliers[d.fips] = {
                mD: (c.votes_dem || 0) > 0 ? curDem / (c.votes_dem || 0) : 1,
                mR: (c.votes_rep || 0) > 0 ? curRep / (c.votes_rep || 0) : 1,
                mO: (c.votes_other || 0) > 0 ? curOth / (c.votes_other || 0) : 1,
                tpShares: tpShares
            };
        });

        const radiusScale = d3.scaleSqrt().domain([0, maxMarginVotes]).range([0, 35]);

        usCounties.forEach(d => { if (d.proj && d.centroid) d.baseR = radiusScale(d.proj.marginVotes); });

        // map setup
        const svg = d3.select("#county_svg");
        const g = svg.append("g").attr("id", "county_map_g");
        let currentZoomK = 1;
        let currentMode = "choropleth";

        svg.on("contextmenu", (e) => e.preventDefault());

        let tooltip = d3.select("#county_tooltip");
        if (tooltip.empty()) tooltip = d3.select("body").append("div").attr("id", "county_tooltip").attr("style", "position:absolute; background:rgba(0,0,0,0.9); color:#fff; padding:12px; border-radius:6px; pointer-events:none; display:none; font-size:14px; font-family:sans-serif; z-index:999999; white-space:nowrap; border:1px solid #666; box-shadow:0px 4px 8px rgba(0,0,0,0.5);");

        const highlightPath = g.append("path").attr("id", "county-highlight").attr("fill", "none").attr("stroke", "#000").attr("stroke-width", "1.5").attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none").style("display", "none");

        // redraw the states special logic
        let customStates = {};
        let countyToCustom = {};
        let activeRS = null;
        let rsCounter = 1;
        let isPainting = false;
        let allocatedEVs = 0;
        let activePaintColor = "#aaa";
        let rsStateCentroids = {};

        function recalcRSStats() {
			Object.values(customStates).forEach(s => { s.tVotes = 0; s.cands = {}; s.ev = 0; });

			const stateCentroids = {};
			let totalPaintedVotes = 0;

			usCounties.forEach(c => {
				const sid = countyToCustom[c.fips];
				if (!sid) return;

				// tally votes if the custom state and project data are valid
				if (customStates[sid] && c.proj) {
					customStates[sid].tVotes += c.proj.totalVotes;
					c.proj.results.forEach(r => {
						customStates[sid].cands[r.id] = (customStates[sid].cands[r.id] || 0) + r.votes;
					});
				}

				// tally coordinate weights for dynamic label centroids
				if (c.centroid) {
					if (!stateCentroids[sid]) {
						stateCentroids[sid] = { x: 0, y: 0, w: 0 };
					}
					const w = c.proj ? c.proj.totalVotes : 1;
					stateCentroids[sid].x += c.centroid[0] * w;
					stateCentroids[sid].y += c.centroid[1] * w;
					stateCentroids[sid].w += w;
				}
			});

			rsStateCentroids = stateCentroids;

			Object.values(customStates).forEach(s => {
				totalPaintedVotes += s.tVotes;
				if (s.tVotes === 0) {
					s.color = "#888"; s.marginText = "Empty"; s.winName = ""; s.winnerId = null;
				} else {
					const arr = Object.keys(s.cands).map(id => ({ id, v: s.cands[id], pct: s.cands[id] / s.tVotes })).sort((a,b) => b.v - a.v);
					const margin = arr[0].pct - (arr[1] ? arr[1].pct : 0);
					s.color = colorInterpolators[arr[0].id](Math.min(margin * 1.5, 1));
					s.winName = candsInfo.get(String(arr[0].id))?.last_name || "Win";
					s.winnerId = arr[0].id;
					s.marginText = `+${(margin * 100).toFixed(1)}%`;
				}
			});

			// EV apportionment
			allocatedEVs = 0;
			let totalAllocated = 0;
			const stateRemainders = [];
			const realStateEVs = {};
			electionData.states_json.forEach(s => {
				realStateEVs["rs_" + s.fields.abbr] = s.fields.electoral_votes;
			});

			Object.values(customStates).forEach(s => {
				if (s.tVotes === 0) { s.ev = 0; return; }

				if (realStateEVs[s.id] !== undefined) {
					s.ev = realStateEVs[s.id];
					totalAllocated += s.ev;
				} else {
					const exactEV = (s.tVotes / nationalTotalVotes) * 538;
					s.ev = Math.floor(exactEV);
					totalAllocated += s.ev;
					stateRemainders.push({ id: s.id, remainder: exactEV - s.ev });
				}
			});

			stateRemainders.sort((a, b) => b.remainder - a.remainder);
			let targetTotalEVs = Math.min(538, Math.round((totalPaintedVotes / nationalTotalVotes) * 538));
			let remainingToDistribute = targetTotalEVs - totalAllocated;
			for (let i = 0; i < remainingToDistribute && i < stateRemainders.length; i++) {
				customStates[stateRemainders[i].id].ev += 1;
			}
			Object.values(customStates).forEach(s => { allocatedEVs += s.ev; });

			const evTracker = document.getElementById("rs_ev_tracker");
			if (evTracker) evTracker.innerText = `${allocatedEVs} / 538 EV`;

			// labels
			const labelData = Object.values(customStates).map(s => {
				const cen = stateCentroids[s.id];
				return { ...s, cx: cen ? cen.x / cen.w : null, cy: cen ? cen.y / cen.w : null };
			}).filter(s => s.cx !== null);

			const lblSel = customLabelsG.selectAll("g.rs-label").data(labelData, d => d.id);
			lblSel.exit().remove();
			const lblEnter = lblSel.enter().append("g").attr("class", "rs-label");
			lblEnter.append("text").attr("class", "rs-lbl-name").attr("text-anchor", "middle").attr("dy", "-0.2em")
				.style("font-family", "Arial, sans-serif").style("font-weight", "bold").style("fill", "#000")
				.style("paint-order", "stroke").style("stroke", "#fff").style("stroke-width", "3px").style("stroke-linejoin", "round");
			lblEnter.append("text").attr("class", "rs-lbl-ev").attr("text-anchor", "middle").attr("dy", "0.9em")
				.style("font-family", "Arial, sans-serif").style("fill", "#000")
				.style("paint-order", "stroke").style("stroke", "#fff").style("stroke-width", "2px").style("stroke-linejoin", "round");

			const lblMerged = lblSel.merge(lblEnter);
			lblMerged.attr("transform", d => `translate(${d.cx},${d.cy})`);
			lblMerged.select(".rs-lbl-name").text(d => d.name).style("font-size", `${Math.max(4, 11 / Math.sqrt(currentZoomK))}px`);
			lblMerged.select(".rs-lbl-ev").text(d => d.ev > 0 ? `${d.ev} EV` : "").style("font-size", `${Math.max(3, 9 / Math.sqrt(currentZoomK))}px`);

			updateRSResults();
		}

		function recalcRSBorders() {
			const mesh = topojson.mesh(us, us.objects.counties, (a, b) => {
				const cA = countyToCustom[String(a.id).padStart(5, '0')];
				const cB = countyToCustom[String(b.id).padStart(5, '0')];
				return cA !== cB;
			});
			d3.select("#custom-borders-path").datum(mesh).attr("d", path);
		}

		function recalcAllRS() {
			recalcRSStats();
			recalcRSBorders();
		}

		function renderRSPanel() {
			const list = document.getElementById("redraw_list");
            if (!list) return;
			const existing = new Map([...list.querySelectorAll("[data-rs-id]")].map(el => [el.dataset.rsId, el]));

            const sortMode = document.getElementById("rs_sort_mode") ? document.getElementById("rs_sort_mode").value : "id";
            let statesArr = Object.values(customStates);
            if (sortMode === "name") {
                statesArr.sort((a,b) => a.name.localeCompare(b.name));
            } else if (sortMode === "ev") {
                statesArr.sort((a,b) => b.ev - a.ev);
            } else {
                statesArr.sort((a,b) => {
                    const numA = parseInt(a.id.replace('rs_', '')) || 0;
                    const numB = parseInt(b.id.replace('rs_', '')) || 0;
                    return numA - numB;
                });
            }

			statesArr.forEach(s => {
				let div = existing.get(s.id);
				if (!div) {
					div = document.createElement("div");
					div.dataset.rsId = s.id;
					div.style.cssText = `display:flex; align-items:center; padding:6px; margin-bottom:4px; border:1px solid #ddd; background:#fff; cursor:pointer; border-radius:4px; font-size:12px;`;

					div.innerHTML = `
						<div class="rs-color-dot" title="click to pan to state" style="width:14px; height:14px; border-radius:50%; background:${s.color}; border:1px solid #777; margin-right:8px; flex-shrink:0; cursor:crosshair;"></div>
						<div style="flex:1; min-width:0;">
							<input type="text" class="rs-name-input" style="width:90px; font-size:11px; border:1px solid #ccc; background:transparent; font-weight:bold;">
							<div class="rs-ev-label" style="font-size:10px; color:#555;">${s.ev} EV &nbsp;|&nbsp; ${s.winName} ${s.marginText}</div>
						</div>
						<button data-rs-del="${s.id}" style="border:none; background:transparent; color:red; cursor:pointer; font-weight:bold; padding:2px 6px;">×</button>`;

                    div.onclick = () => { activeRS = s.id; renderRSPanel(); };

                    div.querySelector(".rs-color-dot").onclick = (e) => {
                        e.stopPropagation();
                        activeRS = s.id;
                        renderRSPanel();
                        if (rsStateCentroids[s.id]) {
                            const cx = rsStateCentroids[s.id].x / rsStateCentroids[s.id].w;
                            const cy = rsStateCentroids[s.id].y / rsStateCentroids[s.id].w;
                            const svgNode = document.getElementById("county_svg");
                            const width = svgNode.clientWidth || 975;
                            const height = svgNode.clientHeight || 610;
                            const k = Math.max(3, currentZoomK); // zoom in a bit automatically
                            svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(width/2 - cx*k, height/2 - cy*k).scale(k));
                        }
                    };

                    const inputEl = div.querySelector(".rs-name-input");
                    inputEl.value = s.name;
                    inputEl.onclick = (e) => e.stopPropagation();
                    inputEl.addEventListener("input", (e) => s.name = e.target.value);

                    list.appendChild(div);
				} else {
					existing.delete(s.id);
                    list.appendChild(div);
				}

				// always update dynamic parts
				div.style.border = `1px solid ${activeRS === s.id ? '#000' : '#ddd'}`;
				div.style.background = activeRS === s.id ? '#eef5ff' : '#fff';
				div.querySelector(".rs-color-dot").style.background = s.color;
				div.querySelector(".rs-ev-label").textContent = `${s.ev} EV \u00a0|\u00a0 ${s.winName} ${s.marginText}`;
                div.querySelector(".rs-name-input").value = s.name;
			});

			existing.forEach(el => el.remove());
		}

		function updateRSResults() {
			const panel = document.getElementById("rs_results_panel");
			if (!panel || Object.keys(customStates).length === 0) { if(panel) panel.style.display="none"; return; }

			// tally EVs per candidate
			const evTotals = {};
			Object.values(customStates).forEach(s => {
				if (!s.winnerId || s.ev === 0) return;
				evTotals[s.winnerId] = (evTotals[s.winnerId] || 0) + s.ev;
			});

			const sorted = Object.entries(evTotals).sort((a,b) => b[1] - a[1]);
			const winner270 = sorted.find(([,ev]) => ev >= 270);

			let html = `<div style="font-weight:bold; margin-bottom:4px; color:#333;">Electoral Result</div>`;
			sorted.forEach(([candId, ev]) => {
				const info = candsInfo.get(String(candId));
				const isWinner = winner270 && winner270[0] === candId;
				html += `<div style="display:flex; align-items:center; margin-bottom:3px;">
					<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${info?.color_hex||'#888'}; margin-right:6px; border:1px solid #777;"></span>
					<span style="flex:1; font-weight:${isWinner?'bold':'normal'};">${info?.last_name||candId}</span>
					<span style="font-weight:bold; color:${isWinner?'#007700':'#333'};">${ev} EV ${isWinner ? '✓ WINS' : ''}</span>
				</div>`;
			});

			const unallocated = 538 - Object.values(evTotals).reduce((a,b)=>a+b,0);
			if (unallocated > 0) html += `<div style="color:#999; margin-top:2px;">Unallocated: ${unallocated} EV</div>`;

			panel.innerHTML = html;
			panel.style.display = "block";
		}

        const deleteRS = (id) => {
            delete customStates[id];
            if (activeRS === id) activeRS = Object.keys(customStates)[0] || null;
            Object.keys(countyToCustom).forEach(fips => { if (countyToCustom[fips] === id) delete countyToCustom[fips]; });
            refreshMapFills();
            renderRSPanel();
        };

        const redrawList = document.getElementById("redraw_list");
        if(redrawList) {
            redrawList.addEventListener("click", e => {
                const delBtn = e.target.closest("[data-rs-del]");
                if (delBtn) {
                    e.stopPropagation();
                    deleteRS(delBtn.dataset.rsDel);
                }
            });
        }

        const btnNew = document.getElementById("rs_btn_new");
        if(btnNew) btnNew.onclick = () => { const id = "rs_" + rsCounter++; customStates[id] = { id, name: "State " + (rsCounter-1), tVotes:0, cands:{}, ev:0, color:"transparent", marginText:"", winName:"" }; activeRS = id; renderRSPanel(); };

        const btnClear = document.getElementById("rs_btn_clear");
        if(btnClear) btnClear.onclick = () => { customStates = {}; countyToCustom = {}; activeRS = null; refreshMapFills(); renderRSPanel(); };

        const btnExisting = document.getElementById("rs_btn_existing");
        if(btnExisting) btnExisting.onclick = () => {
            customStates = {}; countyToCustom = {};
            usCounties.forEach(c => {
                if (!c.proj) return;
                const sid = "rs_" + c.proj.state;
                if (!customStates[sid]) customStates[sid] = { id: sid, name: c.proj.state, tVotes:0, cands:{}, ev:0, color:"", marginText:"", winName:"" };
                countyToCustom[c.fips] = sid;
            });
            activeRS = Object.keys(customStates)[0]; recalcAllRS(); refreshMapFills(); renderRSPanel();
        };

        const btnRandom = document.getElementById("rs_btn_random");
        if(btnRandom) btnRandom.onclick = () => {
			customStates = {}; countyToCustom = {};

			const validCounties = usCounties.filter(c => c.proj);
			const fipsToIndex = {};
			validCounties.forEach((c, i) => fipsToIndex[c.fips] = i);

			const numStates = 50;
			// pick seed counties
			const shuffled = d3.shuffle([...validCounties]);
			const seeds = shuffled.slice(0, numStates);

			seeds.forEach((seed, i) => {
				const sid = "rs_rand_" + i;
				customStates[sid] = { id: sid, name: seed.proj.name, tVotes: 0, cands: {}, ev: 0, color: "", marginText: "", winName: "" };
				countyToCustom[seed.fips] = sid;
			});

			// grow outward from seeds until all counties assigned
			const assigned = new Set(seeds.map(s => s.fips));
			let frontier = [...seeds.map(s => s.fips)];

			while (frontier.length > 0) {
				const next = [];
				d3.shuffle(frontier).forEach(fips => {
					const geomIdx = fipsToGeomIdx[fips];
					if (geomIdx === undefined) return;
					(neighborData[geomIdx] || []).forEach(nIdx => {
						const nFips = geomFips[nIdx];
						if (!assigned.has(nFips) && fipsToIndex[nFips] !== undefined) {
							assigned.add(nFips);
							countyToCustom[nFips] = countyToCustom[fips];
							next.push(nFips);
						}
					});
				});
				frontier = next;
			}

			// assign any still-unassigned county to nearest seed by centroid
			validCounties.forEach(c => {
				if (assigned.has(c.fips) || !c.centroid) return;
				let bestId = null, bestD = Infinity;
				seeds.forEach(s => {
					if (!s.centroid) return;
					const dx = c.centroid[0] - s.centroid[0], dy = c.centroid[1] - s.centroid[1];
					const d = dx*dx + dy*dy;
					if (d < bestD) { bestD = d; bestId = countyToCustom[s.fips]; }
				});
				if (bestId) { countyToCustom[c.fips] = bestId; assigned.add(c.fips); }
			});

			activeRS = Object.keys(customStates)[0];
			recalcAllRS(); refreshMapFills(); renderRSPanel();
        };

        // attach newly added UI listeners
        const toggleLabels = document.getElementById("rs_toggle_labels");
        if(toggleLabels) toggleLabels.addEventListener("change", (e) => {
            customLabelsG.style("display", e.target.checked ? "block" : "none");
        });

        const toggleCounties = document.getElementById("rs_toggle_counties");
        if(toggleCounties) toggleCounties.addEventListener("change", () => {
            refreshMapFills();
        });

        const sortModeEl = document.getElementById("rs_sort_mode");
        if(sortModeEl) sortModeEl.addEventListener("change", () => {
            renderRSPanel();
        });

        function refreshMapFills() {
			const showCounties = document.getElementById("rs_toggle_counties") && document.getElementById("rs_toggle_counties").checked;

			const isRedraw = currentMode === "redraw";
			const isProportional = currentMode === "proportional";

			const projColorKeys = {
				density: "colorDensity",
				voteshare: "colorShare",
				flipped: "colorFlipped",
				shift: "colorShift",
				binary: "colorBinary",
				choropleth: "colorChoro"
			};

			const colorKey = projColorKeys[currentMode];

			// determine the fill callback
			let fillFn;
			if (isRedraw) {
				fillFn = d => {
					const sid = countyToCustom[d.fips];
					return (sid && customStates[sid]) ? customStates[sid].color : "#444";
				};
			} else if (isProportional) {
				fillFn = () => "#f4f6f8"; // clean background mapping
			} else {
				fillFn = d => d.proj ? (d.proj[colorKey] || "#ccc") : "#ccc";
			}

			// determine the stroke callback
			let strokeFn;
			if (isRedraw) {
				if (showCounties) {
					strokeFn = () => "rgba(0,0,0,0.15)"; // subtle county lines inside the state
				} else {
					strokeFn = d => {
						const sid = countyToCustom[d.fips];
						return (sid && customStates[sid]) ? customStates[sid].color : "#444";
					};
				}
			} else if (isProportional) {
				strokeFn = () => "none"; // hide county lines on proportional to un-clutter the bubbles
			} else {
				strokeFn = () => "rgba(255,255,255,0.2)";
			}

			// resolve stroke-width
			let strokeWidthVal;
			if (isRedraw) {
				strokeWidthVal = showCounties ? 0.2 : 0.5;
			} else if (isProportional) {
				strokeWidthVal = 0;
			} else {
				strokeWidthVal = 0.2;
			}

			// apply the configured render loops to the SVG selection
			countyPaths
				.attr("fill", fillFn)
				.attr("stroke", strokeFn)
				.attr("stroke-width", strokeWidthVal);

			// toggle custom boundaries overlay
			d3.select("#custom-borders-path")
				.style("display", isRedraw ? "block" : "none");
		}

        d3.select(window).on("mouseup.redraw", () => {
			if (isPainting) {
				isPainting = false;
				recalcRSStats();
				recalcRSBorders();
				refreshMapFills();
				renderRSPanel();
			}
		});

        // the county layer
        const countyPaths = g.append("g").attr("class", "counties-layer")
            .selectAll("path.county").data(usCounties).join("path")
            .attr("class", "county").attr("d", path)
            .attr("vector-effect", "non-scaling-stroke").attr("stroke-width", 0.2)
            .on("mouseover", function(event, d) {
                if (!d.proj) return;
				highlightPath.attr("d", this.getAttribute("d")).style("display", "block").raise();

                if (isPainting && currentMode === "redraw" && activeRS) {
                    countyToCustom[d.fips] = activeRS;
                    this.setAttribute("fill", activePaintColor);
                    if (document.getElementById("rs_toggle_counties") && !document.getElementById("rs_toggle_counties").checked) {
                        this.setAttribute("stroke", activePaintColor);
                    }
                }

                let customText = "";
                if (currentMode === "redraw" && countyToCustom[d.fips] && customStates[countyToCustom[d.fips]]) {
                    const st = customStates[countyToCustom[d.fips]];
                    customText = `<div style="color:#ffcc00; font-size:13px; margin-top:6px; border-top:1px solid #777; padding-top:4px;"><b>${st.name}</b> (${st.ev} EV)<br><b>Net:</b> ${st.winName} ${st.marginText}</div>`;
                }

                tooltip.style("display", "block").html(d.proj.tooltipHtml + customText);
            })
            .on("mousemove", (e) => tooltip.style("left", (e.pageX + 15) + "px").style("top", (e.pageY + 15) + "px"))
            .on("mouseout", function() { highlightPath.style("display", "none"); tooltip.style("display", "none"); })
            .on("mousedown", function(event, d) {
                if (currentMode !== "redraw" || !activeRS || !d.proj) return;

                if (event.button === 2) {
                    activePaintColor = customStates[activeRS].color || "#aaa";
                    isPainting = true;
                    countyToCustom[d.fips] = activeRS;
                    this.setAttribute("fill", activePaintColor);
                    if (document.getElementById("rs_toggle_counties") && !document.getElementById("rs_toggle_counties").checked) {
                        this.setAttribute("stroke", activePaintColor);
                    }
                }
            })
            .on("click", function(event, d) {
                if (currentMode !== "redraw" || !activeRS || !d.proj || event.defaultPrevented) return;
                if (event.shiftKey) {
                    const bs = d.proj.state;
                    usCounties.forEach(c => { if (c.proj && c.proj.state === bs) countyToCustom[c.fips] = activeRS; });
                } else {
                    countyToCustom[d.fips] = activeRS;
                }

                requestAnimationFrame(() => {
                    recalcAllRS(); refreshMapFills(); renderRSPanel();
                });
            });

        // the circle layer
        const circles = g.append("g").attr("class", "circles-layer")
            .selectAll("circle.symbol").data(usCounties.filter(d => d.proj && d.centroid))
            .join("circle").attr("class", "symbol")
            .attr("transform", d => `translate(${d.centroid})`).attr("r", 0)
            .attr("fill", d => d.proj.colorBinary).attr("fill-opacity", 0.75).attr("stroke", "#fff")
            .attr("stroke-width", 0.5).attr("vector-effect", "non-scaling-stroke").style("pointer-events", "none");

        // the border layer
        const realStateBorders = g.append("g").attr("class", "state-borders-layer").append("path").datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b)).attr("fill", "none").attr("stroke", "#333").attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke").attr("stroke-width", 0.8).attr("d", path).style("pointer-events", "none");
        const realNationBorders = g.append("g").attr("class", "nation-borders-layer").append("path").datum(topojson.mesh(us, us.objects.nation)).attr("fill", "none").attr("stroke", "#000").attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke").attr("stroke-width", 1.5).attr("d", path).style("pointer-events", "none");

        // the custom borders layer
        const customBordersPath = g.append("g").attr("class", "custom-borders-layer").append("path").attr("id", "custom-borders-path").attr("fill", "none").attr("stroke", "#000").attr("stroke-linejoin", "round").attr("vector-effect", "non-scaling-stroke").attr("stroke-width", 1.2).style("pointer-events", "none").style("display", "none");
		const customLabelsG = g.append("g").attr("class", "custom-labels-layer").style("pointer-events", "none");

        // maplibre precinct map
        let mlMap = null;
        let mlMapReady = false;
        let precVisCache = null;
        let precViewDirty = true;
        let precColorCache = {};
        let isPrecinctUpdating = false;
        let precinctUpdatePending = false;

        let cdCurrentVintage = null;
        let currentDistrictMargins = {};
        let cdVotesTableCache = {};

        function getPrecinctGPUColorExpression() {
            const toRgbStr = (hex, weight = 1) => {
                const c = d3.color(hex) || d3.color("#888888");
                if (weight !== 1) {
                    const w = d3.interpolateRgb("#ffffff", c)(weight);
                    const cw = d3.color(w);
                    return `rgb(${cw.r}, ${cw.g}, ${cw.b})`;
                }
                return `rgb(${c.r}, ${c.g}, ${c.b})`;
            };

            const marginExpr = [
                "case",
                [">", ["coalesce", ["to-number", ["get", "votes_total"]], 0], 0],
                ["/",
                    ["-", ["to-number", ["get", "votes_dem"]], ["to-number", ["get", "votes_rep"]]],
                    ["to-number", ["get", "votes_total"]]
                ],
                0
            ];

            return [
                "interpolate", ["linear"], marginExpr,
                -0.60, toRgbStr(repColor, 1.0),
                -0.40, toRgbStr(repColor, 0.8),
                -0.20, toRgbStr(repColor, 0.6),
                -0.05, toRgbStr(repColor, 0.3),
                 0.00, "#ffffff",
                 0.05, toRgbStr(demColor, 0.3),
                 0.20, toRgbStr(demColor, 0.6),
                 0.40, toRgbStr(demColor, 0.8),
                 0.60, toRgbStr(demColor, 1.0)
            ];
        }

        function throttlePrecinctUpdate() {
            if (isPrecinctUpdating) {
                precinctUpdatePending = true;
                return;
            }
            isPrecinctUpdating = true;
            updatePrecinctColors();
            setTimeout(() => {
                isPrecinctUpdating = false;
                if ( precinctUpdatePending ) {
                    precinctUpdatePending = false;
                    throttlePrecinctUpdate();
                }
            }, 80);
        }

        window._triggerPrecinctUpdate = () => {
            precViewDirty = true;
            throttlePrecinctUpdate();
        };

        function initPrecinctMap() {
            if (mlMap) return;
            if (typeof maplibregl === "undefined" || typeof pmtiles === "undefined") {
                console.warn("MapLibre GL or PMTiles not loaded yet. Retrying shortly...");
                setTimeout(initPrecinctMap, 150);
                return;
            }

            if (!window._pmtilesProtocolRegistered) {
                const protocol = new pmtiles.Protocol();
                maplibregl.addProtocol("pmtiles", protocol.tile);
                window._pmtilesProtocolRegistered = true;
            }

            const tileUrl = `pmtiles://${getPmTilesUrl(CURRENT_YEAR)}`;

            mlMap = new maplibregl.Map({
                container: "precinct_map_div",
                style: {
                    version: 8,
                    sources: {
                        blockgroups: {
                            type: "vector",
                            url: tileUrl,
                            promoteId: "GEOID",
                            maxzoom: 11
                        }
                    },
                    layers: [
                        {
                            id: "bg",
                            type: "background",
                            paint: { "background-color": "#e2e6ea" }
                        },
                        {
                            id: "precinct-fill",
                            type: "fill",
                            source: "blockgroups",
                            "source-layer": "blockgroups",
                            filter: [">", ["coalesce", ["to-number", ["get", "votes_total"]], 0], 0],
                            paint: {
                                "fill-color": getPrecinctGPUColorExpression(),
                                "fill-opacity": 1
                            }
                        },
                        {
                            id: "precinct-line",
                            type: "line",
                            source: "blockgroups",
                            "source-layer": "blockgroups",
                            filter: [">", ["coalesce", ["to-number", ["get", "votes_total"]], 0], 0],
                            paint: {
                                "line-color": "rgba(255,255,255,0.2)",
                                "line-width": 0.15
                            }
                        }
                    ]
                },
                center: [4.875, 3.05],
                zoom: 1,
                maxZoom: 13,
                minZoom: 0,
                dragRotate: false,
                pitchWithRotate: false,
                renderWorldCopies: false,
                attributionControl: false,
                fadeDuration: 0,
                maxTileCacheSize: 512
            });

            mlMap.on("load", () => {
                mlMapReady = true;

                // force layout reflow and check dimensions before fitting bounds (fixes firefox blank-viewport errors)
                mlMap.resize();
                const container = mlMap.getContainer();
                if (container && container.clientWidth > 0 && container.clientHeight > 0) {
                    try {
                        mlMap.fitBounds([[0, 0], [9.75, 6.1]], { padding: 0, animate: false });
                    } catch (e) {
                        console.warn("Could not fit bounds on load:", e);
                    }
                } else {
                    mlMap.setCenter([4.875, 3.05]);
                    mlMap.setZoom(1);
                }

                // ensure districts render if selected on initial map load
                if (currentMode === "districts") {
                    if (mlMap.getLayer("precinct-fill")) mlMap.setLayoutProperty("precinct-fill", "visibility", "none");
                    if (mlMap.getLayer("precinct-line")) mlMap.setLayoutProperty("precinct-line", "visibility", "none");
                    initDistrictLayer();
                } else {
                    if (mlMap.getLayer("precinct-fill")) mlMap.setLayoutProperty("precinct-fill", "visibility", "visible");
                    if (mlMap.getLayer("precinct-line")) mlMap.setLayoutProperty("precinct-line", "visibility", "visible");
                    updatePrecinctColors();
                }
            });

            mlMap.on("moveend", () => {
                precViewDirty = true;
                if (!isUserInteracting) throttlePrecinctUpdate();
            });

            mlMap.on("idle", () => {
                if (!isUserInteracting) throttlePrecinctUpdate();
            });

            let hoveredBgId = null;
            mlMap.on("mousemove", "precinct-fill", (e) => {
                if (!e.features || e.features.length === 0) return;
                const feat = e.features[0];
                const geoid = String(feat.id || (feat.properties && feat.properties.GEOID) || "");
                if (!geoid) return;

                if (hoveredBgId && hoveredBgId !== geoid) {
                    mlMap.setFeatureState({ source: "blockgroups", sourceLayer: "blockgroups", id: hoveredBgId }, { hover: false });
                }
                hoveredBgId = geoid;
                mlMap.setFeatureState({ source: "blockgroups", sourceLayer: "blockgroups", id: geoid }, { hover: true });

                mlMap.getCanvas().style.cursor = "pointer";

                const countyFips = geoid.length >= 5 ? geoid.slice(0, 5) : geoid;
                const props = feat.properties || {};
                const baseTotal = Number(props.votes_total) || 0;
                const baseDem = Number(props.votes_dem) || 0;
                const baseRep = Number(props.votes_rep) || 0;
                const baseOth = Math.max(0, baseTotal - baseDem - baseRep);

                const mults = fipsMultipliers[countyFips];
                const mD = mults ? mults.mD : 1;
                const mR = mults ? mults.mR : 1;
                const mO = mults ? mults.mO : 1;

                const dem = Math.round(baseDem * mD);
                const rep = Math.round(baseRep * mR);
                const oth = Math.round(baseOth * mO);
                const total = dem + rep + oth;

                const bgResults = [
                    { id: demCandId, votes: dem, pct: total > 0 ? dem / total : 0 },
                    { id: repCandId, votes: rep, pct: total > 0 ? rep / total : 0 }
                ];

                tpCandidatesInGame.forEach(candId => {
                    const share = (mults && mults.tpShares && mults.tpShares[candId] !== undefined) ? mults.tpShares[candId] : (1 / Math.max(1, tpCandidatesInGame.length));
                    const candVotes = Math.round(oth * share);
                    bgResults.push({
                        id: candId,
                        votes: candVotes,
                        pct: total > 0 ? candVotes / total : 0
                    });
                });

                bgResults.sort((a, b) => b.votes - a.votes);

                const winner = bgResults[0];
                const second = bgResults.length > 1 ? bgResults[1] : { votes: 0, pct: 0 };
                const marginVal = winner.pct - second.pct;
                const side = (candsInfo.get(String(winner.id))?.last_name || "Winner");
                const pct = (marginVal * 100).toFixed(1);

                const candRowsHtml = bgResults.slice(0, 4).map(r => {
                    const cInfo = candsInfo.get(String(r.id)) || {};
                    const candName = (cInfo.last_name || r.id);
                    const candColor = cInfo.color_hex || '#888';
                    return `
                        <div style="display:flex; align-items:center; margin-bottom: 4px;">
                            <span style="display:inline-block; width:12px; height:12px; background-color:${candColor}; margin-right:8px; border: 1px solid #aaa;"></span>
                            <span style="font-weight:bold;">${candName}: ${(r.pct * 100).toFixed(1)}%</span>
                            <span style="color:#ccc; font-size:12px; margin-left:6px;">(${r.votes.toLocaleString()})</span>
                        </div>
                    `;
                }).join('');

                let customText = "";
                if (countyToCustom[countyFips] && customStates[countyToCustom[countyFips]]) {
                    const st = customStates[countyToCustom[countyFips]];
                    customText = `<div style="color:#ffcc00; font-size:13px; margin-top:6px; border-top:1px solid #777; padding-top:4px;"><b>${st.name}</b> (${st.ev} ev)<br><b>net:</b> ${st.winName} ${st.marginText}</div>`;
                }

                tooltip.style("display", "block").html(
                    `<strong style="font-size:16px">block group: ${geoid}</strong><br>` +
                    `<div style="font-size:12px; color:#bbb; margin-top:-2px; margin-bottom:8px;">county: ${(props.county || "unknown")}, state: ${(props.state || "")}</div>` +
                    candRowsHtml +
                    `<hr style="margin:6px 0; border:0; border-top:1px solid #777;"><div style="color:#ddd; font-size:13px; margin-top:4px;"><i>Margin: ${side} +${pct}%</i></div>` +
                    customText
                );
            });

            mlMap.on("mouseleave", "precinct-fill", () => {
                if (hoveredBgId) {
                    mlMap.setFeatureState({ source: "blockgroups", sourceLayer: "blockgroups", id: hoveredBgId }, { hover: false });
                    hoveredBgId = null;
                }
                mlMap.getCanvas().style.cursor = "";
                tooltip.style("display", "none");
            });

            mlMap.on("mousemove", (e) => {
                const ev = e.originalEvent;
                tooltip.style("left", (ev.pageX + 15) + "px").style("top", (ev.pageY + 15) + "px");
            });

            // bind district mouse hover handler once maplibre instantiates
            mlMap.on("mousemove", "cd-fill", (e) => {
                if (!e.features || e.features.length === 0) return;
                const feat = e.features[0];
                const cdCode = String(feat.properties.cd_code || feat.id || "");
                if (!cdCode) return;

                mlMap.getCanvas().style.cursor = "pointer";

                const m = currentDistrictMargins[cdCode];
                if (!m) return;

                const dem = Math.round(m.dem);
                const rep = Math.round(m.rep);
                const oth = Math.round(m.other);
                const total = dem + rep + oth;

                const districtResults = [
                    { id: demCandId, votes: dem, pct: total > 0 ? dem / total : 0 },
                    { id: repCandId, votes: rep, pct: total > 0 ? rep / total : 0 }
                ];

                if (tpCandidatesInGame && tpCandidatesInGame.length > 0) {
                    tpCandidatesInGame.forEach(candId => {
                        const candVotes = Math.round(m.tp ? (m.tp[candId] || 0) : 0);
                        districtResults.push({
                            id: candId,
                            votes: candVotes,
                            pct: total > 0 ? candVotes / total : 0
                        });
                    });
                }

                districtResults.sort((a, b) => b.votes - a.votes);

                const winner = districtResults[0];
                const second = districtResults.length > 1 ? districtResults[1] : { votes: 0, pct: 0 };
                const marginVal = winner.pct - second.pct;
                const sign = (candsInfo.get(String(winner.id))?.last_name || "Winner");
                const pctStr = (marginVal * 100).toFixed(1);

                const candRowsHtml = districtResults.slice(0, 4).map(r => {
                    const cInfo = candsInfo.get(String(r.id)) || {};
                    const candName = (cInfo.last_name || r.id);
                    const candColor = cInfo.color_hex || '#888';
                    return `
                        <div style="display:flex; align-items:center; margin-bottom: 4px;">
                            <span style="display:inline-block; width:12px; height:12px; background-color:${candColor}; margin-right:8px; border: 1px solid #aaa;"></span>
                            <span style="font-weight:bold;">${candName}: ${(r.pct * 100).toFixed(1)}%</span>
                            <span style="color:#ccc; font-size:12px; margin-left:6px;">(${r.votes.toLocaleString()})</span>
                        </div>
                    `;
                }).join('');

                let customText = "";
                const matchedFips = Object.keys(countyToCustom).find(fips => countyToCustom[fips] && fips.startsWith(cdCode.slice(0, 2)));
                if (matchedFips && customStates[countyToCustom[matchedFips]]) {
                    const st = customStates[countyToCustom[matchedFips]];
                    customText = `<div style="color:#ffcc00; font-size:13px; margin-top:6px; border-top:1px solid #777; padding-top:4px;"><b>${st.name}</b> (${st.ev} ev)<br><b>net:</b> ${st.winName} ${st.marginText}</div>`;
                }

                tooltip.style("display", "block").html(
                    `<strong style="font-size:16px">District: ${cdCode}</strong><br>` +
                    `<div style="font-size:12px; color:#bbb; margin-top:-2px; margin-bottom:8px;">Total votes: ${total.toLocaleString()}</div>` +
                    candRowsHtml +
                    `<hr style="margin:6px 0; border:0; border-top:1px solid #777;"><div style="color:#ddd; font-size:13px; margin-top:4px;"><i>Margin: ${sign} +${pctStr}%</i></div>` +
                    customText
                );
            });

            mlMap.on("mouseleave", "cd-fill", () => {
                mlMap.getCanvas().style.cursor = "";
                tooltip.style("display", "none");
            });
        }

        function updatePrecinctColors() {
            if (!mlMap || !mlMapReady || isUserInteracting) return;

            let hasActiveShuffle = false;
            for (let fips in fipsMultipliers) {
                const mult = fipsMultipliers[fips];
                if (Math.abs(mult.mD - 1) > 0.001 || Math.abs(mult.mR - 1) > 0.001) {
                    hasActiveShuffle = true;
                    break;
                }
            }

            if (!hasActiveShuffle) {
                try {
                    mlMap.removeFeatureState({ source: "blockgroups", sourceLayer: "blockgroups" });
                } catch (e) {}
                mlMap.setPaintProperty("precinct-fill", "fill-color", getPrecinctGPUColorExpression());
                precColorCache = {};
                return;
            }

            if (precViewDirty || !precVisCache) {
                let raw;
                try {
                    raw = mlMap.queryRenderedFeatures({ layers: ["precinct-fill"] });
                } catch (e) {
                    return;
                }
                if (!raw || raw.length === 0) return;
                const seenB = {};
                precVisCache = [];
                for (let ri = 0; ri < raw.length; ri++) {
                    const rf = raw[ri];
                    const rg = String(rf.id || (rf.properties && rf.properties.GEOID) || "");
                    if (!rg || seenB[rg]) continue;
                    seenB[rg] = true;
                    const rp = rf.properties || {};
                    precVisCache.push({
                        geoid: rg,
                        cf: rg.length >= 5 ? rg.slice(0, 5) : rg,
                        vt: Number(rp.votes_total) || 0,
                        vd: Number(rp.votes_dem) || 0,
                        vr: Number(rp.votes_rep) || 0
                    });
                }
                precViewDirty = false;
            }

            if (precVisCache.length === 0) return;

            mlMap.setPaintProperty("precinct-fill", "fill-color", ["coalesce", ["feature-state", "color"], "#ffffff"]);

            requestAnimationFrame(() => {
                const len = precVisCache.length;
                for (let fi = 0; fi < len; fi++) {
                    const f = precVisCache[fi];
                    const geoid = f.geoid;
                    const countyFips = f.cf;
                    const baseTotal = f.vt;
                    const baseDem = f.vd;
                    const baseRep = f.vr;
                    const baseOth = Math.max(0, baseTotal - baseDem - baseRep);

                    const mults = fipsMultipliers[countyFips];
                    const mD = mults ? mults.mD : 1;
                    const mR = mults ? mults.mR : 1;
                    const mO = mults ? mults.mO : 1;

                    const dem = Math.round(baseDem * mD);
                    const rep = Math.round(baseRep * mR);
                    const ots = Math.round(baseOth * mO);
                    const total = dem + rep + ots;

                    let maxVotes = dem;
                    let winnerId = demCandId;

                    if (rep > maxVotes) {
                        maxVotes = rep;
                        winnerId = repCandId;
                    }

                    if (tpCandidatesInGame.length > 0 && mults && mults.tpShares) {
                        tpCandidatesInGame.forEach(candId => {
                            const share = mults.tpShares[candId] || 0;
                            const candVotes = Math.round(ots * share);
                            if (candVotes > maxVotes) {
                                maxVotes = candVotes;
                                winnerId = candId;
                            }
                        });
                    }

                    let secondVotes = 0;
                    if (winnerId === demCandId) {
                        secondVotes = rep;
                        if (tpCandidatesInGame.length > 0 && mults && mults.tpShares) {
                            tpCandidatesInGame.forEach(candId => {
                                const candVotes = Math.round(ots * (mults.tpShares[candId] || 0));
                                if (candVotes > secondVotes) secondVotes = candVotes;
                            });
                        }
                    } else if (winnerId === repCandId) {
                        secondVotes = dem;
                        if (tpCandidatesInGame.length > 0 && mults && mults.tpShares) {
                            tpCandidatesInGame.forEach(candId => {
                                const candVotes = Math.round(ots * (mults.tpShares[candId] || 0));
                                if (candVotes > secondVotes) secondVotes = candVotes;
                            });
                        }
                    } else {
                        secondVotes = Math.max(dem, rep);
                        tpCandidatesInGame.forEach(candId => {
                            if (candId === winnerId) return;
                            const candVotes = Math.round(ots * (mults.tpShares[candId] || 0));
                            if (candVotes > secondVotes) secondVotes = candVotes;
                        });
                    }

                    const marginVal = total > 0 ? (maxVotes - secondVotes) / total : 0;
                    const color = colorInterpolators[winnerId] ? colorInterpolators[winnerId](Math.sqrt(marginVal)) : "#888888";

                    const sig = marginVal + "@" + color;
                    if (precColorCache[geoid] === sig) continue;
                    precColorCache[geoid] = sig;

                    mlMap.setFeatureState(
                        { source: "blockgroups", sourceLayer: "blockgroups", id: geoid },
                        { color: color }
                    );
                }
            });
        }

		// decade-level boundary-matched fallback helper
		function getFallbackVotesUrl(year, vintage) {
			const v = parseInt(vintage, 10);
			if (v >= 110 && v <= 112) {
				// 2000s boundaries (fallback to 2008)
				return getCdVotesUrl("2008", "111");
			} else if ((v >= 113 && v <= 117) || vintage === "113" || vintage === "115" || vintage === "117") {
				// 2010s boundaries (fallback to 2016 or 2020)
				const y = parseInt(year, 10);
				if (Math.abs(y - 2020) < Math.abs(y - 2016)) {
					return getCdVotesUrl("2020", "117");
				} else {
					return getCdVotesUrl("2016", "115");
				}
			} else {
				// 2020s boundaries (fallback to 2024)
				return getCdVotesUrl("2024", "119");
			}
		}

        async function initDistrictLayer(vintage) {
			if (!mlMap || !mlMapReady) return;

			const v = vintage || document.getElementById("cd_vintage_selector")?.value || "2026";

			if (cdCurrentVintage === v && mlMap.getSource("districts-source")) {
				recolorDistricts(v, cdVotesTableCache[v]);
				return;
			}

			removeDistrictLayer();

			try {
				let geojson, votesTable;

				// attempt to fetch exact year/vintage CD votes file
				try {
					[geojson, votesTable] = await Promise.all([
						fetch(getCdGeojsonUrl(v)).then(r => r.json()),
						fetch(getCdVotesUrl(CURRENT_YEAR, v)).then(r => {
							if (!r.ok) throw new Error("Votes file 404");
							return r.json();
						})
					]);
				} catch (firstErr) {
					// fetch boundary-matched decade fallback blueprint to retain non-homogeneous splits
					console.warn(`Votes file 404 for ${CURRENT_YEAR} vintage ${v}. Retrying decade-level fallback...`);
					const fallbackUrl = getFallbackVotesUrl(CURRENT_YEAR, v);

					[geojson, votesTable] = await Promise.all([
						fetch(getCdGeojsonUrl(v)).then(r => r.json()),
						fetch(fallbackUrl).then(r => {
							if (!r.ok) throw new Error("Fallback votes file 404");
							return r.json();
						}).catch(() => {
							// fallback to empty if even decade blueprint is unreachable
							return {};
						})
					]);
				}

				if (!geojson) return;

				// fallback to spatial overlapping weights if no blueprints are available at all
				let finalVotesTable = votesTable || {};
				if (!finalVotesTable || Object.keys(finalVotesTable).length === 0) {
					console.log(`Generating dynamic spatial district weights from county shapes for ${CURRENT_YEAR} / vintage ${v}...`);
					finalVotesTable = generateDistrictVotesTable(geojson, usCounties, fipsResults);
				}

				mlMap.addSource("districts-source", {
					type: "geojson",
					data: geojson,
					promoteId: "cd_code"
				});

				const beforeId = mlMap.getLayer("county-line") ? "county-line" : (mlMap.getLayer("precinct-line") ? "precinct-line" : undefined);

				mlMap.addLayer({
					id: "cd-fill",
					type: "fill",
					source: "districts-source",
					paint: {
						"fill-color": "#e5e5e8",
						"fill-opacity": 1
					}
				}, beforeId);

				mlMap.addLayer({
					id: "cd-line",
					type: "line",
					source: "districts-source",
					paint: {
						"line-color": "#ffffff",
						"line-width": 0.8
					}
				});

				cdCurrentVintage = v;
				cdVotesTableCache[v] = finalVotesTable;
				recolorDistricts(v, finalVotesTable);

			} catch (err) {
				console.error("Error drawing districts:", err);
			}
		}

        function removeDistrictLayer() {
            if (!mlMap) return;
            if (mlMap.getLayer("cd-fill")) mlMap.removeLayer("cd-fill");
            if (mlMap.getLayer("cd-line")) mlMap.removeLayer("cd-line");
            if (mlMap.getSource("districts-source")) mlMap.removeSource("districts-source");
            cdCurrentVintage = null;
            currentDistrictMargins = {};
        }

        function recolorDistricts(vintage, votesTable) {
			if (!mlMap || !mlMapReady || !mlMap.getLayer("cd-fill")) return;

			const table = votesTable || {};
			const cdMargins = computeCdMargins(table, fipsResults, demCandId, repCandId, tpCandidatesInGame);
			currentDistrictMargins = cdMargins;

			// if empty, set default color
			const keys = Object.keys(cdMargins);
			if (keys.length === 0) {
				mlMap.setPaintProperty("cd-fill", "fill-color", "#e5e5e8");
				return;
			}

			const colorMatchExpression = ["match", ["get", "cd_code"]];

			for (const cdCode in cdMargins) {
				const m = cdMargins[cdCode];
				const winningId = m.margin >= 0 ? demCandId : repCandId;
				const color = colorInterpolators[winningId] ? colorInterpolators[winningId](Math.sqrt(Math.abs(m.margin))) : "#888888";
				colorMatchExpression.push(cdCode, color);
			}

			colorMatchExpression.push("#e5e5e8"); // fallback
			mlMap.setPaintProperty("cd-fill", "fill-color", colorMatchExpression);
		}

        function setMapMode(uiMode) {
            currentMode = uiMode;
            const isRedraw = uiMode === "redraw";
            const isProp = uiMode === "proportional";
            const isPrecinct = uiMode === "precinct";
            const isDistrict = uiMode === "districts";

            const redrawPanel = document.getElementById("redraw_panel");
            const normalInst = document.getElementById("normal_instructions");
            const redrawInst = document.getElementById("redraw_instructions");
            const cdSelector = document.getElementById("cd_vintage_selector");

            if (redrawPanel) redrawPanel.style.display = isRedraw ? "flex" : "none";
            if (redrawInst) redrawInst.style.display = isRedraw ? "block" : "none";
            if (normalInst) normalInst.style.display = isRedraw ? "none" : "block";
            if (cdSelector) cdSelector.style.display = isDistrict ? "inline-block" : "none";

            realStateBorders.style("display", (isRedraw || isPrecinct || isDistrict) ? "none" : "block");

            if (isRedraw) {
                const labelsChecked = document.getElementById("rs_toggle_labels") ? document.getElementById("rs_toggle_labels").checked : true;
                customLabelsG.style("display", labelsChecked ? "block" : "none");
                if (Object.keys(customStates).length === 0 && document.getElementById("rs_btn_new")) document.getElementById("rs_btn_new").click();
                recalcAllRS(); renderRSPanel();
            } else {
                customLabelsG.style("display", "none");
            }

            const moreSelector = document.getElementById("more_modes_selector");
            if (moreSelector) {
                if (uiMode === "redraw") {
                    moreSelector.style.color = "#d9534f";
                    moreSelector.style.fontWeight = "bold";
                } else if (uiMode === "precinct") {
                    moreSelector.style.color = "#0275d8";
                    moreSelector.style.fontWeight = "bold";
                } else if (uiMode === "districts") {
                    moreSelector.style.color = "#17a2b8";
                    moreSelector.style.fontWeight = "bold";
                } else {
                    moreSelector.style.color = "";
                    moreSelector.style.fontWeight = "";
                }
            }

            refreshMapFills();

            if (isProp) { const sqrtK = Math.sqrt(currentZoomK); circles.transition().duration(400).attr("r", d => d.baseR / sqrtK); }
            else circles.transition().duration(400).attr("r", 0);

            // toggle maplibre precinct / district container
            const countySvg = document.getElementById("county_svg");
            let precinctMapDiv = document.getElementById("precinct_map_div");
            if (countySvg) {
                if (!precinctMapDiv) {
                    precinctMapDiv = document.createElement("div");
                    precinctMapDiv.id = "precinct_map_div";
                    precinctMapDiv.style.cssText = "width: 100%; height: 100%; display: none; position: absolute; top: 0; left: 0;";
                    countySvg.parentNode.insertBefore(precinctMapDiv, countySvg);
                    countySvg.parentNode.style.position = "relative";
                }

                if (isPrecinct || isDistrict) {
                    countySvg.style.display = "none";
                    precinctMapDiv.style.display = "block";

                    // force synchronous layout calculations
                    // this is so Firefox & friends can acquire correct canvas dimensions
                    void precinctMapDiv.offsetHeight;

                    // delay maplibre resizing by one animation frame
                    // this prevents projection NaN-failures on load
                    requestAnimationFrame(() => {
                        initPrecinctMap();

                        if (mlMap) {
                            mlMap.resize();
                            if (isDistrict) {
                                if (mlMap.getLayer("precinct-fill")) mlMap.setLayoutProperty("precinct-fill", "visibility", "none");
                                if (mlMap.getLayer("precinct-line")) mlMap.setLayoutProperty("precinct-line", "visibility", "none");
                                initDistrictLayer();
                            } else {
                                if (mlMap.getLayer("precinct-fill")) mlMap.setLayoutProperty("precinct-fill", "visibility", "visible");
                                if (mlMap.getLayer("precinct-line")) mlMap.setLayoutProperty("precinct-line", "visibility", "visible");
                                removeDistrictLayer();
                                precViewDirty = true;
                                throttlePrecinctUpdate();
                            }
                        }
                    });
                } else {
                    countySvg.style.display = "block";
                    precinctMapDiv.style.display = "none";
                    removeDistrictLayer();
                }
            }
        }

        const mapControls = document.getElementById("map_controls");
        if(mapControls) {
            const radios = mapControls.querySelectorAll("input[name='map_mode']");
            const moreSelector = document.getElementById("more_modes_selector");

            radios.forEach(r => {
                r.addEventListener("change", (e) => {
                    if (e.target.checked) {
                        if (moreSelector) moreSelector.value = "";
                        setMapMode(e.target.value);
                    }
                });
            });

            if (moreSelector) {
                moreSelector.addEventListener("change", (e) => {
                    const val = e.target.value;
                    if (val) {
                        radios.forEach(r => r.checked = false);
                        setMapMode(val);
                    } else {
                        const marginRadio = mapControls.querySelector("input[value='choropleth']");
                        if (marginRadio) {
                            marginRadio.checked = true;
                            setMapMode("choropleth");
                        }
                    }
                });
            }
        }

        const vintageSelector = document.getElementById("cd_vintage_selector");
        if (vintageSelector) {
            vintageSelector.addEventListener("change", () => {
                if (currentMode === "districts") {
                    initDistrictLayer(vintageSelector.value);
                }
            });
        }

		let lastZoomK = 1;
        let zoomTicking = false;

        const zoom = d3.zoom().scaleExtent([1, 10])
            .translateExtent([[0, 0], [975, 610]])
            .clickDistance(10)
            .filter(event => { if (currentMode === "redraw" && event.type === "mousedown") return event.button === 0; return !event.button; })
            .on("zoom", (event) => {
                if (currentMode === "precinct" || currentMode === "districts") return;

                // if we zoom down enough and scroll out (mouse) or pinch in (touch), switch maps smoothly
				if (mode === 'seamless' && event.transform.k <= 1.05 && event.sourceEvent) {
                    const isWheelOut = event.sourceEvent.type === 'wheel' && event.sourceEvent.deltaY > 0;
                    const isPinchOut = event.sourceEvent.type === 'touchmove' && currentZoomK > event.transform.k;

                    if (isWheelOut || isPinchOut) {
                        if (window._switchToStateMap) {
                            window._switchToStateMap();
                            setTimeout(() => {
                                d3.select("#county_svg").call(zoom.transform, d3.zoomIdentity);
                            }, 0);
                            return;
                        }
                    }
				}

                currentZoomK = event.transform.k;
                g.attr("transform", event.transform);

                if (!zoomTicking) {
                    requestAnimationFrame(() => {
                        if (currentMode === "proportional" && currentZoomK !== lastZoomK) {
                            const sqrtK = Math.sqrt(currentZoomK);
                            circles.attr("r", d => d.baseR / sqrtK);
                        }
                        if (currentMode === "redraw" && currentZoomK !== lastZoomK) {
                            customLabelsG.selectAll(".rs-lbl-name").style("font-size", `${Math.max(4, 11 / Math.sqrt(currentZoomK))}px`);
                            customLabelsG.selectAll(".rs-lbl-ev").style("font-size", `${Math.max(3, 9 / Math.sqrt(currentZoomK))}px`);
                        }
                        lastZoomK = currentZoomK;
                        zoomTicking = false;
                    });
                    zoomTicking = true;
                }
            });

        window._d3zoom = zoom;
        svg.call(zoom);

        populateCdVintageSelector(CURRENT_YEAR);

        const statusLabel = document.getElementById("county_map_status");
        if (statusLabel) statusLabel.style.display = "none";
        setMapMode("choropleth");

    } catch (err) {
        console.error(err);
        const statusNode = document.getElementById("county_map_status");
        if (statusNode) statusNode.innerHTML = "<span style='color:red'>Error processing map data. Check console.</span>";
    }
}
