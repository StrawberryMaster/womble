// This highlights states on a TCT map.
// rewritten from 2025 NJ Gov

(function () {
  function setupMapHighlights() {
    const container = document.getElementById('map_container');
    if (!container) return;

    const svg = container.querySelector('svg');
    if (!svg) return;

    // kip if this exact SVG instance has already been initialized
    if (svg.dataset.highlighterActive === "true") return;

    const paths = svg.querySelectorAll('path');
    if (!paths.length) return;

    const visPathMap = new Map();
    const clickPaths = [];

    // single-pass classification
    paths.forEach((path) => {
      const isClickable =
        path.style.cursor === 'pointer' ||
        path.getAttribute('cursor') === 'pointer' ||
        window.getComputedStyle(path).cursor === 'pointer';

      const d = path.getAttribute('d');
      if (!d) return;

      if (isClickable) {
        path.classList.add('clickpath');
        clickPaths.push(path);
      } else {
        path.classList.add('vispath');
        if (!visPathMap.has(d)) {
          visPathMap.set(d, path);
        }
      }
    });

    // pair clickable paths with their visual paths using the Map
    clickPaths.forEach((clickPath) => {
      const d = clickPath.getAttribute('d');
      const visualPath = visPathMap.get(d);

      if (visualPath) {
        clickPath.addEventListener('mouseover', () => {
          visualPath.style.filter = 'brightness(1.2) saturate(1.5)';
        });
        clickPath.addEventListener('mouseleave', () => {
          visualPath.style.filter = '';
        });
      }
    });

    // mark this SVG instance as processed
    svg.dataset.highlighterActive = "true";
  }

  let debounceTimer = null;
  const targetNode = document.getElementById('map_container') || document.body;

  const mapObserver = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(setupMapHighlights, 50);
  });

  mapObserver.observe(targetNode, { childList: true, subtree: true });

  setupMapHighlights();
})();