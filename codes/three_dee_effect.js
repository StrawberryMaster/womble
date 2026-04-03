// funny 3D effect for election night SVG, sort of
if (!document.getElementById("map-3d-styles")) {
    const style = document.createElement('style');
    style.id = "map-3d-styles";
    style.innerHTML = `
        #map_container svg path {
            transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), fill 0.5s ease;
            transform-origin: center;
            transform-box: fill-box;
        }

        .state-risen {
            transform: scale(1.05) translateY(-7px);
            filter: drop-shadow(0px 8px 4px rgba(0,0,0,0.4));
        }
    `;
    document.head.appendChild(style);
}

// wrap the existing updateUsMapStyles to apply the 'risen' class
const originalUpdateMapStyles = window.updateUsMapStyles;

window.updateUsMapStyles = function(config) {
    // run the original logic first to color the states
    originalUpdateMapStyles(config);

    if (!config || !config.stateSpecificStyles) return;

    const defaultColor = "#C9C9C9";

    Object.keys(config.stateSpecificStyles).forEach(abbr => {
        const style = config.stateSpecificStyles[abbr];
        const stateElement = document.querySelector(`#map_container svg path[name="${abbr}"]`);
        
        if (stateElement) {
            // if the state is not the default color, it means results have come in
            const isFilled = style.fill && style.fill.toUpperCase() !== defaultColor.toUpperCase();
            if (isFilled) {
                stateElement.classList.add('state-risen');
                stateElement.parentNode.appendChild(stateElement); 
            } else {
                stateElement.classList.remove('state-risen');
            }
        }
    });
};
console.log("bonk");