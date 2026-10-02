// This allows for the ending tables to be expanded with their veeps - edited from Obamanation
// retrieves the player's chosen running mate
function getPlayerRunningMate() {
    try {
        const rmId = window.campaignTrail_temp?.running_mate_id ?? window.e?.running_mate_id;
        if (rmId != null) {
            if (typeof PROPS !== "undefined" && PROPS.CANDIDATES) {
                const c = PROPS.CANDIDATES.get(String(rmId));
                if (c) return `${c.first_name} ${c.last_name}`.trim();
            }
            const list = window.campaignTrail_temp?.candidate_json ?? window.e?.candidate_json;
            const cand = list?.find((c) => String(c.pk) === String(rmId));
            if (cand?.fields) {
                return `${cand.fields.first_name} ${cand.fields.last_name}`.trim();
            }
        }
    } catch (_) {}
    return "N/A";
}

let vpName = getPlayerRunningMate();

window.vpTable = {
    "Barack Obama": vpName,
    "Chris Christie": "Haley Barbour",
    "Jon Huntsman": "Nikki Haley",
    "Stanley McChrystal": "Rick Perry",
    "Condoleezza Rice": "John Thune",
    "Michael Bloomberg": "Charlie Crist",
    "Mitt Romney": "Paul Ryan",
    "Newt Gingrich": "Rick Santorum",
    "David Petraeus": "John Kasich",
    "Donald Trump": "Lou Barletta",
    "Michele Bachmann": "Tom Tancredo",
    "Ron Paul": vpName,
    "Joe Arpaio": "Bobby Jindal",
    "Dick Cheney": "Michael Steele",
    "Jeb Bush": "Susana Martinez",
    "Clint Eastwood": "<i>Various</i>",
    "Ben Carson": "Marco Rubio",
    "John McCain": "Joe Lieberman",
    "Gary Johnson": "Mark B. Madsen",
    "Gary Sinise": "Andrew Napolitano",
    "Glenn Beck": "Virgil Goode",
    "Jimmy McMillan": "Vermin Supreme",
    "Penn Jillette": "Adam Carolla",
    "Curtis Sliwa": "Rupert Boneham",
    "Pat Buchanan": vpName,
    "David Lynch": "Kyle MacLachlan",
    "Chelsea Manning": "Cindy Sheehan",
    "Cenk Uygur": "Matt Taibbi",
    "Chris Matthews": "Alan Greenspan",
    "Jill Stein": "Cynthia Nixon",
    "Dennis Kucinich": "Steve Kubby",
    "Joe Lieberman": "Lincoln Chafee",
    "Bernie Sanders": "Cornel West",
    "Zombie Reagan": "Howard Baker",
};

const vpTableHistorical = {
    "Chris Christie": "Haley Barbour",
    "Barack Hussein Obama": "Joe Biden",
    "Dennis Kucinich": "Steve Kubby",
    "Penn Jillette": "Adam Carolla",
};

// historical result table
HistHexcolour = ["#590205", "#20788c", "#5d0a61", "#ab076c"];
HistName = ["Chris Christie", "Barack Hussein Obama", "Dennis Kucinich", "Penn Jillette"];
HistEV = [370, 168, 0, 0];
HistPV = ["68,672,437", "56,492,526", "1,725,647", "1,195,818"];
HistPVP = ["53.6%", "44.1%", "1.3%", "0.9%"];

function onGameWindowChangeCandidates() {
    const container = document.getElementById("overall_details_container");
    if (!container || container.classList.contains("done")) return;

    container.classList.add("done");

    const tables = container.querySelectorAll("table");
    const activePlayerVP = getPlayerRunningMate();

    const processTable = (table, lookupTable) => {
        const tbody = table?.querySelector("tbody") || table;
        if (!tbody || !lookupTable) return;

        const rows = tbody.rows || tbody.children;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            if (i === 0) {
                // header row
                const th = document.createElement("th");
                th.innerText = "Running Mate";
                row.insertBefore(th, row.cells[1]);
            } else {
                // data row
                const cell = row.insertCell(1);
                const cellText = row.cells[0]?.innerText || "";

                // strip leading dashes and other spaces
                const name = cellText.replace(/^[-\s\u2800]+|[-\s\u2800]+$/g, "").trim();

                let vp = lookupTable[name];
                // resolve player running mate
                if (!vp || vp === "ERROR YOU DIDN'T SET ME" || vp === "N/A") {
                    vp = activePlayerVP || vp || "";
                }

                cell.innerHTML = vp;
            }
        }
    };

    if (tables[0]) processTable(tables[0], window.vpTable);
    if (tables[1]) processTable(tables[1], vpTableHistorical);
}

const gameWindowNode = document.getElementById("game_window") || document.body;

if (window._vpTableObserver) {
    window._vpTableObserver.disconnect();
}

window._vpTableObserver = new MutationObserver(() => {
    if (document.getElementById("overall_details_container")) {
        onGameWindowChangeCandidates();
    }
});

window._vpTableObserver.observe(gameWindowNode, { childList: true, subtree: true });
