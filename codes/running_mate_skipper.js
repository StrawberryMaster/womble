// This allows for the running mate screen to be skipped
// expanded from the original by munastronaut
(() => {
  const abortCtrl = new AbortController();
  const { signal } = abortCtrl;

  const teardown = () => {
    if (!signal.aborted) {
      abortCtrl.abort();
    }
  };

  signal.addEventListener('abort', () => {
    observer?.disconnect();
  }, { once: true });

  // click event handling
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.matches('#candidate_id_button')) {
      // defer to next microtask so candSel/vpSelect state transition registers
      queueMicrotask(() => {
        document.getElementById('running_mate_id_button')?.click();
      });
    } else if (target.matches('#opponent_selection_id_back')) {
      queueMicrotask(() => {
        document.getElementById('running_mate_id_back')?.click();
      });
    } else if (target.matches('#opponent_selection_id_button')) {
      // we're in the code 2
      teardown();
    }
  }, { signal });

  const targetRoot = document.getElementById('game_window') || document.body;

  const observer = new MutationObserver((_, obs) => {
    // if we're in the code 2, terminate observer and listener
    if (document.querySelector('.inner_window_question') || window.e?.code2Loaded) {
      obs.disconnect();
      teardown();
    }
  });

  observer.observe(targetRoot, {
    childList: true,
    subtree: true,
  });

  // if code 2 is already loaded, disconnect immediately
  if (document.querySelector('.inner_window_question') || window.e?.code2Loaded) {
    teardown();
  }
})();
