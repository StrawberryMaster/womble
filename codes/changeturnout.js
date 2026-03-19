// This function changes the turnout for a given state or all states
// by applying a multiplier to the popular votes.
// originally shown in Things That Never Were
const changeTurnout = (multiplier = 1.0, stateSelector = 0) => {
    if (stateSelector !== 0) {
        // check for state PK or abbrev
        const targetState = e.states_json.find(f => 
            f.pk === stateSelector || f.fields.abbr === stateSelector
        );
        
        if (targetState) {
            // apply multiplier
            targetState.fields.popular_votes = Math.floor(targetState.fields.popular_votes * multiplier);
        } else {
            console.warn(`State '${stateSelector}' could not be found.`);
        }
    } else {
        // otherwise, just target every state
        e.states_json.forEach(state => {
            state.fields.popular_votes = Math.floor(state.fields.popular_votes * multiplier);
        });
    }
}