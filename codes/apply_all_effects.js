// This will override the A function to remove the "player-only"
// filter on global and state multipliers, on CTS/NCT/TCT.net

// read the current engine's A() function
let aStr = A.toString();

// fix global multipliers
aStr = aStr.replace(
    /const k = `\$\{f\.answer\}\|\$\{f\.candidate\}\|\$\{f\.affected_candidate\}`;/g,
    "const k = `${f.answer}|${f.affected_candidate}`;"
);
aStr = aStr.replace(
    /const key = `\$\{answer\}\|\$\{e\.candidate_id\}\|\$\{candidate\}`;/g,
    "const key = `${answer}|${candidate}`;"
);

// fix state multipliers
aStr = aStr.replace(
    /if\s*\(\s*f\.candidate\s*!==\s*e\.candidate_id\s*\)\s*continue;/g,
    "/* bypassed candidate check */"
);

// re-evaluate the modified string back into the global A function
eval("A = " + aStr);