// The county map feature from 2000TML
let CURRENT_YEAR = "2000";
let HISTORICAL_YEAR = "1996";

function getCustomPreference(key, defaultVal) {
    try {
        const prefs = JSON.parse(localStorage.getItem('tml_custom_preferences')) || {};
        return prefs.hasOwnProperty(key) ? prefs[key] : defaultVal;
    } catch(e) {
        return defaultVal;
    }
}

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
    <div id="map_controls" style="width: 100%; display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; margin-bottom: 10px; font-family: Arial, sans-serif; font-size: 14px; background: rgba(0,0,0,0.08); padding: 10px; border-radius: 6px; color: #000;">
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="choropleth" checked> Margin</label>
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="voteshare"> Vote Share</label>
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="binary"> Solid Colors</label>
       <label style="cursor:pointer;" title="Bivariate palette based on total votes to highlight populous areas"><input type="radio" name="map_mode" value="density"> Margin + Density</label>
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="proportional"> Proportional</label>
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="flipped"> Flipped</label>
       <label style="cursor:pointer;"><input type="radio" name="map_mode" value="shift"> Shift (from '08)</label>
       <label style="cursor:pointer; font-weight:bold; color:#d9381e;" title="Paint your own states!"><input type="radio" name="map_mode" value="redraw"> Redraw the States</label>
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
    const { historical } = getActiveYears();
    const controlsHtml = MAP_CONTROLS_HTML.replace("from '08", `from '${historical.slice(-2)}'`);
    controlsDiv.innerHTML = controlsHtml + getMapInstructionsHtml(mode);

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
    const { historical } = getActiveYears();
    const controlsHtml = MAP_CONTROLS_HTML.replace("from '08", `from '${historical.slice(-2)}'`);

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
    if (!window.d3) scriptsToLoad.push(loadScript("https://d3js.org/d3.v7.min.js"));
    if (!window.topojson) scriptsToLoad.push(loadScript("https://d3js.org/topojson.v3.min.js"));
    if (scriptsToLoad.length > 0) {
        try {
            await Promise.all(scriptsToLoad);
        } catch (err) {
            console.error("Could not load core D3/TopoJSON libraries:", err);
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
                "02105": { name: "Hoonah-Angoon", d:["02005"] },
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
        const tpMapping = {}; // candId -> index in tpCands list
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

                let normVotes = cr.votes;
                if (simPct > 0 && targetPct > 0) {
                    normVotes = cr.votes * (targetPct / simPct);
                } else if (simPct === 0 && targetPct > 0) {
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

            d.proj.tooltipHtml = `<strong style="font-size:16px">${d.proj.name}, ${d.proj.state}</strong><br><div style="font-size:12px; color:#bbb; margin-top:-2px; margin-bottom:8px;">Total Votes: ${unnorm.total.toLocaleString()}</div>` +
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

        function setMapMode(uiMode) {
            currentMode = uiMode;
            const isRedraw = uiMode === "redraw";
            const isProp = uiMode === "proportional";

            const redrawPanel = document.getElementById("redraw_panel");
            const normalInst = document.getElementById("normal_instructions");
            const redrawInst = document.getElementById("redraw_instructions");

            if (redrawPanel) redrawPanel.style.display = isRedraw ? "flex" : "none";
            if (redrawInst) redrawInst.style.display = isRedraw ? "block" : "none";
            if (normalInst) normalInst.style.display = isRedraw ? "none" : "block";

            realStateBorders.style("display", isRedraw ? "none" : "block");

            if (isRedraw) {
                const labelsChecked = document.getElementById("rs_toggle_labels") ? document.getElementById("rs_toggle_labels").checked : true;
                customLabelsG.style("display", labelsChecked ? "block" : "none");
                if (Object.keys(customStates).length === 0 && document.getElementById("rs_btn_new")) document.getElementById("rs_btn_new").click();
                recalcAllRS(); renderRSPanel();
            } else {
                customLabelsG.style("display", "none");
            }

            refreshMapFills();

            if (isProp) { const sqrtK = Math.sqrt(currentZoomK); circles.transition().duration(400).attr("r", d => d.baseR / sqrtK); }
            else circles.transition().duration(400).attr("r", 0);
        }

        const mapControls = document.getElementById("map_controls");
        if(mapControls) {
            mapControls.addEventListener("change", (e) => {
                if (e.target.name === "map_mode") setMapMode(e.target.value);
            });
        }

		let lastZoomK = 1;
        let zoomTicking = false;

        const zoom = d3.zoom().scaleExtent([1, 15])
            .filter(event => { if (currentMode === "redraw" && event.type === "mousedown") return event.button === 0; return !event.button; })
            .on("zoom", (event) => {

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

        const statusLabel = document.getElementById("county_map_status");
        if (statusLabel) statusLabel.style.display = "none";
        setMapMode("choropleth");

    } catch (err) {
        console.error(err);
        const statusNode = document.getElementById("county_map_status");
        if (statusNode) statusNode.innerHTML = "<span style='color:red'>Error processing map data. Check console.</span>";
    }
}
