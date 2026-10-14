// The womble guide menu
(function () {
  "use strict";

  const MENU_ID = "scenario-guide-menu";
  const STYLE_ID = "scenario-guide-styles";

  const oldInstance = document.getElementById(MENU_ID);
  if (oldInstance) oldInstance.remove();
  const oldStyles = document.getElementById(STYLE_ID);
  if (oldStyles) oldStyles.remove();

  const styleTag = document.createElement("style");
  styleTag.id = STYLE_ID;
  styleTag.textContent = `
    #${MENU_ID} {
      position: fixed;
      top: 14%;
      right: 24px;
      width: 360px;
      background-color: #ffffff;
      color: #1e293b;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 13px;
      border-radius: 12px;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.08);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
      transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #${MENU_ID} * {
      box-sizing: border-box;
    }

    #${MENU_ID} .guide-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
      font-weight: 600;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      line-height: 1.3;
      transition: background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease, color 0.15s ease;
      outline: none;
      user-select: none;
    }

    #${MENU_ID} .guide-btn:focus-visible {
      box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #2563eb !important;
    }

    #${MENU_ID} .guide-btn:active {
      transform: translateY(1px) scale(0.98);
    }

    #${MENU_ID} .guide-header-btn {
      background: #1e293b;
      color: #94a3b8;
      border: 1px solid #334155;
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 700;
    }
    #${MENU_ID} .guide-header-btn:hover {
      background: #334155;
      color: #f8fafc;
      border-color: #475569;
    }
    #${MENU_ID} .guide-header-btn:active {
      background: #0f172a;
    }

    #${MENU_ID} .guide-btn-primary {
      background-color: #2563eb;
      color: #ffffff;
      padding: 8px 14px;
      font-size: 12px;
    }
    #${MENU_ID} .guide-btn-primary:hover {
      background-color: #1d4ed8;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
    }
    #${MENU_ID} .guide-btn-primary:active {
      background-color: #1e40af;
    }

    #${MENU_ID} .guide-btn-success {
      background-color: #059669;
      color: #ffffff;
      padding: 8px 12px;
      font-size: 12px;
    }
    #${MENU_ID} .guide-btn-success:hover {
      background-color: #047857;
      box-shadow: 0 2px 6px rgba(5, 150, 105, 0.35);
    }
    #${MENU_ID} .guide-btn-success:active {
      background-color: #065f46;
    }

    #${MENU_ID} .guide-btn-slate {
      background-color: #475569;
      color: #ffffff;
      padding: 8px 12px;
      font-size: 12px;
    }
    #${MENU_ID} .guide-btn-slate:hover {
      background-color: #334155;
      box-shadow: 0 2px 6px rgba(71, 85, 105, 0.3);
    }
    #${MENU_ID} .guide-btn-slate:active {
      background-color: #1e293b;
    }

    #${MENU_ID} .guide-btn-dark {
      background-color: #0f172a;
      color: #ffffff;
      padding: 8px 14px;
      font-size: 12px;
      width: 100%;
    }
    #${MENU_ID} .guide-btn-dark:hover {
      background-color: #1e293b;
    }
    #${MENU_ID} .guide-btn-dark:active {
      background-color: #334155;
    }

    #${MENU_ID} textarea {
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    #${MENU_ID} textarea:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important;
    }
    #${MENU_ID} ::-webkit-scrollbar {
      width: 6px;
    }
    #${MENU_ID} ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    #${MENU_ID} ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;
  document.head.appendChild(styleTag);

  // engine utilities
  const sharedDOMParser = new DOMParser();

  function getEngineInstance() {
    if (typeof e !== "undefined" && e) return e;
    if (window.campaignTrail_temp) return window.campaignTrail_temp;
    if (window.e) return window.e;
    return null;
  }

  function resolveTemplateVars(text) {
    if (!text || typeof text !== "string") return "";
    return text.replace(/\{\{(.*?)\}\}/g, (_, varName) => {
      try {
        const key = varName.trim();
        return window[key] !== undefined ? window[key] : `{{${key}}}`;
      } catch {
        return `{{${varName}}}`;
      }
    });
  }

  function sanitizeAnswerText(rawHtml) {
    if (!rawHtml) return "";
    const resolved = resolveTemplateVars(rawHtml);
    const doc = sharedDOMParser.parseFromString(resolved, "text/html");
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
  }

  function extractWordTokens(str) {
    return (str || "")
      .toLowerCase()
      .replace(/^[0-9]+[.)\-:]\s*/, "") // strip leading list numbering (e.g. "1. ", "4) ")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  function computeDiceCoefficient(tokensA, tokensB) {
    if (tokensA.size === 0 || tokensB.size === 0) return 0;
    let intersection = 0;
    for (const token of tokensA) {
      if (tokensB.has(token)) intersection++;
    }
    return (2 * intersection) / (tokensA.size + tokensB.size);
  }

  const container = document.createElement("aside");
  container.id = MENU_ID;
  container.setAttribute("aria-label", "Guide menu");

  container.innerHTML = `
    <!-- Header -->
    <header id="guide-drag-handle" style="background: #0f172a; color: #f8fafc; padding: 10px 14px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; cursor: grab;">
      <div style="display: flex; align-items: center; gap: 8px; pointer-events: none;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
        <span id="guide-title-text">Guide menu</span>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <button id="guide-help-toggle-btn" class="guide-btn guide-header-btn" title="Open help guide" type="button">?</button>
        <button id="guide-minimize-btn" class="guide-btn guide-header-btn" title="Minimize guide" type="button">&minus;</button>
      </div>
    </header>

    <div id="guide-main-view" style="padding: 14px; display: flex; flex-direction: column; gap: 12px; max-height: 80vh; overflow-y: auto;">
      <section style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label for="guide-input" style="font-weight: 600; color: #334155;">Highlight answers (import)</label>
          <span style="font-size: 11px; color: #64748b;">Fuzzy matcher</span>
        </div>
        <textarea id="guide-input" rows="3" placeholder="Paste your guide lines here (e.g. 1. Take the stand)..." style="width: 100%; resize: vertical; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; font-family: inherit; outline: none;"></textarea>
        <button id="guide-apply-btn" class="guide-btn guide-btn-primary" type="button">Highlight answers</button>
      </section>

      <div style="border-top: 1px solid #e2e8f0;"></div>

      <section style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label for="guide-export" style="font-weight: 600; color: #334155;">Export in-game answers</label>
          <span style="font-size: 11px; color: #64748b;">Current game</span>
        </div>
        <textarea id="guide-export" rows="4" readonly placeholder="Exported answers (1. Answer description...) will appear here..." style="width: 100%; resize: vertical; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; background: #f8fafc; font-family: inherit; outline: none;"></textarea>
        <div style="display: flex; gap: 8px;">
          <button id="guide-record-btn" class="guide-btn guide-btn-success" style="flex: 1;" type="button">Export choices</button>
          <button id="guide-copy-btn" class="guide-btn guide-btn-slate" style="flex: 1;" type="button">Copy to clipboard</button>
        </div>
      </section>
      
      <div id="guide-status-bar" style="display: none; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 500; text-align: center;"></div>
    </div>

    <div id="guide-help-view" style="display: none; padding: 16px; flex-direction: column; gap: 12px; max-height: 80vh; overflow-y: auto; background: #f8fafc;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
        <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">Guide menu help</h4>
        <span style="font-size: 11px; color: #64748b;">Tips & guide</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px; line-height: 1.5; color: #334155;">
        <div style="background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <strong style="color: #1d4ed8; display: block; margin-bottom: 3px;">Highlighting answers</strong>
          Paste the guide text with answers (either numbered like <code>1. Take the stand</code> or raw lines) into it. Matches are highlighted on your current screen and future questions automatically.
        </div>

        <div style="background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <strong style="color: #047857; display: block; margin-bottom: 3px;">Exporting answers</strong>
          This generates a numbered list of choices made up to your current question, including any option currently picked on screen.
        </div>

        <div style="background: #ffffff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <strong style="color: #64748b; display: block; margin-bottom: 3px;">Pro-tips</strong>
          • <strong>Minimizing:</strong> Click <b>&minus;</b> in the top right to collapse this window.<br>
          • <strong>Dragging:</strong> Click and hold the dark top title bar to drag this window.
        </div>
      </div>

      <button id="guide-close-help-btn" class="guide-btn guide-btn-dark" type="button">Got it, return to guide</button>
    </div>
  `;

  document.body.appendChild(container);

  const dragHandle = container.querySelector("#guide-drag-handle");
  const mainView = container.querySelector("#guide-main-view");
  const helpView = container.querySelector("#guide-help-view");
  const minimizeBtn = container.querySelector("#guide-minimize-btn");
  const helpToggleBtn = container.querySelector("#guide-help-toggle-btn");
  const closeHelpBtn = container.querySelector("#guide-close-help-btn");
  const titleText = container.querySelector("#guide-title-text");
  const statusBar = container.querySelector("#guide-status-bar");
  const exportArea = container.querySelector("#guide-export");
  const copyBtn = container.querySelector("#guide-copy-btn");

  let isMinimized = false;
  let statusTimeout = null;
  const activeHighlightedPks = new Set();

  // status banner helper
  function showStatus(message, type = "info") {
    if (statusTimeout) clearTimeout(statusTimeout);
    statusBar.style.display = "block";
    statusBar.textContent = message;

    if (type === "success") {
      statusBar.style.background = "#dcfce7";
      statusBar.style.color = "#15803d";
      statusBar.style.border = "1px solid #bbf7d0";
    } else if (type === "warning") {
      statusBar.style.background = "#fef3c7";
      statusBar.style.color = "#b45309";
      statusBar.style.border = "1px solid #fde68a";
    } else {
      statusBar.style.background = "#e0f2fe";
      statusBar.style.color = "#0369a1";
      statusBar.style.border = "1px solid #bae6fd";
    }

    statusTimeout = setTimeout(() => {
      statusBar.style.display = "none";
    }, 4500);
  }

  function toggleMinimize(forceState) {
    isMinimized = typeof forceState === "boolean" ? forceState : !isMinimized;

    if (isMinimized) {
      mainView.style.display = "none";
      helpView.style.display = "none";
      minimizeBtn.innerHTML = "&#9633;";
      minimizeBtn.title = "Restore guide";
      titleText.textContent = "Guide menu (minimized)";
      container.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
    } else {
      mainView.style.display = "flex";
      helpView.style.display = "none";
      minimizeBtn.innerHTML = "&minus;";
      minimizeBtn.title = "Minimize guide";
      titleText.textContent = "Guide menu";
      container.style.boxShadow = "0 10px 30px -5px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.08)";
    }
  }

  minimizeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMinimize();
  });

  dragHandle.addEventListener("click", (e) => {
    if (isMinimized && e.target !== minimizeBtn && e.target !== helpToggleBtn) {
      toggleMinimize(false);
    }
  });

  // help toggle
  function showHelpView(show) {
    if (isMinimized) toggleMinimize(false);
    mainView.style.display = show ? "none" : "flex";
    helpView.style.display = show ? "flex" : "none";
  }

  helpToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showHelpView(helpView.style.display !== "flex");
  });

  closeHelpBtn.addEventListener("click", () => showHelpView(false));

  // drag engine
  let isMoving = false;
  let dragOffset = { x: 0, y: 0 };

  dragHandle.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    isMoving = true;
    dragHandle.setPointerCapture(e.pointerId);
    dragHandle.style.cursor = "grabbing";

    const box = container.getBoundingClientRect();
    dragOffset.x = e.clientX - box.left;
    dragOffset.y = e.clientY - box.top;
  });

  dragHandle.addEventListener("pointermove", (e) => {
    if (!isMoving) return;
    const maxX = window.innerWidth - container.offsetWidth;
    const maxY = window.innerHeight - container.offsetHeight;
    const nextLeft = Math.max(0, Math.min(maxX, e.clientX - dragOffset.x));
    const nextTop = Math.max(0, Math.min(maxY, e.clientY - dragOffset.y));

    container.style.left = `${nextLeft}px`;
    container.style.top = `${nextTop}px`;
    container.style.right = "auto";
  });

  const stopDragging = (e) => {
    if (!isMoving) return;
    isMoving = false;
    dragHandle.style.cursor = "grab";
    try {
      dragHandle.releasePointerCapture(e.pointerId);
    } catch {
      // ignore if capture ended
    }
  };

  dragHandle.addEventListener("pointerup", stopDragging);
  dragHandle.addEventListener("pointercancel", stopDragging);

  let isHighlightScheduled = false;

  function applyLiveRadioHighlights() {
    if (activeHighlightedPks.size === 0) return;
    const gameWindow = document.getElementById("game_window");
    if (!gameWindow) return;

    const radios = gameWindow.querySelectorAll("input[name='game_answers']");
    radios.forEach((radio) => {
      if (activeHighlightedPks.has(String(radio.value))) {
        const parentLabel = radio.closest("label") || radio.parentElement;
        if (parentLabel && !parentLabel.dataset.guideStyled) {
          parentLabel.style.backgroundColor = "#fef08a";
          parentLabel.style.borderRadius = "4px";
          parentLabel.style.padding = "2px 6px";
          parentLabel.dataset.guideStyled = "true";
        }
      }
    });
  }

  function scheduleHighlight() {
    if (isHighlightScheduled) return;
    isHighlightScheduled = true;
    requestAnimationFrame(() => {
      applyLiveRadioHighlights();
      isHighlightScheduled = false;
    });
  }

  // observe question switches so highlights automatically persist on future questions
  if (window.__guideObserver) {
    window.__guideObserver.disconnect();
  }

  const observer = new MutationObserver(() => scheduleHighlight());
  window.__guideObserver = observer;

  const targetWindow = document.getElementById("game_window");
  if (targetWindow) {
    observer.observe(targetWindow, { childList: true, subtree: true });
  } else {
    const initObserver = new MutationObserver(() => {
      const gw = document.getElementById("game_window");
      if (gw) {
        initObserver.disconnect();
        observer.observe(gw, { childList: true, subtree: true });
        scheduleHighlight();
      }
    });
    initObserver.observe(document.body, { childList: true, subtree: true });
  }

  // answer export logic
  function exportRecordedAnswers() {
    const engine = getEngineInstance();
    if (!engine || !engine.answers_json) {
      showStatus("Game scenario not loaded yet. Start the game first!", "warning");
      return;
    }

    const answerMap = new Map();
    for (const ans of engine.answers_json) {
      answerMap.set(String(ans.pk), ans.fields?.description || "");
    }

    const recordedPks = [...(engine.player_answers || [])];

    // read current on-screen selected radio if not yet finalized in player_answers
    const activeRadio = document.querySelector("input[name='game_answers']:checked");
    if (activeRadio && activeRadio.value) {
      if (recordedPks.length <= (engine.question_number || 0)) {
        recordedPks.push(activeRadio.value);
      }
    }

    if (recordedPks.length === 0) {
      exportArea.value = "";
      showStatus("No answers recorded yet. Pick an answer first!", "warning");
      return;
    }

    const formattedLines = recordedPks
      .filter((pk) => pk != null)
      .map((pk, idx) => {
        const rawDescription = answerMap.get(String(pk));
        const text = rawDescription ? sanitizeAnswerText(rawDescription) : `[Answer PK: ${pk}]`;
        return `${idx + 1}. ${text}`;
      });

    exportArea.value = formattedLines.join("\n");
    showStatus(`Exported ${formattedLines.length} answer(s) successfully.`, "success");
  }

  function applyGuideHighlights() {
    const engine = getEngineInstance();
    if (!engine || !engine.answers_json) {
      showStatus("Game scenario not loaded yet. Start the game first!", "warning");
      return;
    }

    const inputText = document.getElementById("guide-input").value;
    const lines = inputText.split("\n").map((l) => l.trim()).filter(Boolean);

    if (lines.length === 0) {
      showStatus("Please paste guide answers into the text area.", "warning");
      return;
    }

    const indexedAnswers = engine.answers_json.map((ans, idx) => {
      const cleanDesc = sanitizeAnswerText(ans?.fields?.description || "");
      return {
        index: idx,
        pk: String(ans.pk),
        entry: ans,
        tokens: new Set(extractWordTokens(cleanDesc))
      };
    });

    let matchCount = 0;
    activeHighlightedPks.clear();

    for (const line of lines) {
      const lineTokens = new Set(extractWordTokens(line));
      if (lineTokens.size === 0) continue;

      let highestScore = 0;
      let matchedIndices = [];

      for (const item of indexedAnswers) {
        const score = computeDiceCoefficient(lineTokens, item.tokens);
        if (score > highestScore && score >= 0.3) {
          highestScore = score;
          matchedIndices = [item.index];
        } else if (score === highestScore && score >= 0.3) {
          matchedIndices.push(item.index);
        }
      }

      if (matchedIndices.length > 0) {
        matchCount += matchedIndices.length;
        for (const idx of matchedIndices) {
          const item = indexedAnswers[idx];
          activeHighlightedPks.add(item.pk);

          // strip previous injected highlight spans before wrapping
          const cleanOriginal = item.entry.fields.description.replace(
            /<span[^>]*class="guide-highlight"[^>]*>([\s\S]*?)<\/span>/gi,
            "$1"
          );
          item.entry.fields.description = `<span class="guide-highlight" style="background: #fde047; color: #0f172a; padding: 2px 4px; border-radius: 4px; font-weight: 600;">${cleanOriginal}</span>`;
        }
      }
    }

    applyLiveRadioHighlights();
    showStatus(`Highlights applied to ${matchCount} matching choice(s)!`, "success");
  }

  async function copyExportedContent() {
    const text = exportArea.value.trim();
    if (!text) {
      showStatus("Nothing to copy! Export your answers first.", "warning");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      exportArea.select();
      document.execCommand("copy");
    }

    const originalText = copyBtn.textContent;
    copyBtn.textContent = "✓ Copied!";
    copyBtn.classList.remove("guide-btn-slate");
    copyBtn.classList.add("guide-btn-success");

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.classList.remove("guide-btn-success");
      copyBtn.classList.add("guide-btn-slate");
    }, 1800);
  }

  container.querySelector("#guide-apply-btn").addEventListener("click", applyGuideHighlights);
  container.querySelector("#guide-record-btn").addEventListener("click", exportRecordedAnswers);
  copyBtn.addEventListener("click", copyExportedContent);
})();