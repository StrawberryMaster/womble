// no sneaky cheats system
// this was made for CTS, for NCT it might be different -SM
(() => {
  // config
  const disableConfig = {
    console: true,
    benefit: true,
    cheatMenu: true,
    autoplay: true
  };

  const blockedKeys = new Set();
  if (disableConfig.console) {
    blockedKeys.add("$");
  }
  if (disableConfig.benefit) {
    blockedKeys.add("~");
    blockedKeys.add("`");
  }
  if (disableConfig.cheatMenu) {
    blockedKeys.add("#");
  }
  if (disableConfig.autoplay) {
    blockedKeys.add("@");
    blockedKeys.add("$");
  }

  const keyBlocker = (e) => {
    if (blockedKeys.has(e.key)) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  };

  window.addEventListener("keydown", keyBlocker, true);
  window.addEventListener("keypress", keyBlocker, true);

  const dummyStorage = {};

  const neutralizeGlobal = (propName, actualName) => {
    const dummyFunc = () => {
      console.warn(`One does not simply use ${actualName} in this scenario.`);
    };

    const desc = Object.getOwnPropertyDescriptor(window, propName);

    // property exists and is non-configurable
    if (desc && !desc.configurable) {
      if (desc.writable || desc.set) {
        try {
          window[propName] = dummyFunc;
        } catch (e) {
          try {
            desc.set.call(window, dummyFunc);
          } catch (err) {}
        }
      }
      return;
    }

    // property is configurable or doesn't exist yet
    try {
      Object.defineProperty(window, propName, {
        get() {
          return dummyFunc;
        },
        set(val) {
          // we store the incoming value to prevent TypeErrors during script initialization,
          // but the getter will ensure the real function is never exposed or executed
          dummyStorage[propName] = val;
        },
        configurable: true
      });
    } catch (e) {}
  };

  if (disableConfig.console) {
    neutralizeGlobal("useConsoleCheats", "Console Cheats");
    neutralizeGlobal("toggleCampaignTerminal", "Console Cheats");

    const descUCC = Object.getOwnPropertyDescriptor(window, "UsingConsoleCheats");
    if (descUCC && !descUCC.configurable) {
      if (descUCC.writable || descUCC.set) {
        window.UsingConsoleCheats = true;
      }
    } else {
      try {
        Object.defineProperty(window, "UsingConsoleCheats", {
          get() { return true; },
          set() {},
          configurable: true
        });
      } catch (e) {}
    }
  }

  if (disableConfig.benefit) {
    neutralizeGlobal("activateBenefitCheck", "the Benefit Checker");
    neutralizeGlobal("benefitChecker", "the Benefit Checker");
    neutralizeGlobal("benefitCheck", "the Benefit Checker");
    neutralizeGlobal("showBenefitChecker", "the Benefit Checker");
  }

  if (disableConfig.cheatMenu) {
    neutralizeGlobal("activateCheatMenu", "the Cheat Menu");
  }

  if (disableConfig.autoplay) {
    neutralizeGlobal("autoplay", "Autoplay");
    neutralizeGlobal("startAutoplayWhenReady", "Autoplay");
    neutralizeGlobal("stopAutoplay", "Autoplay");
    neutralizeGlobal("enableAutoplayUI", "Autoplay");
  }

  const purgeSelector = (selector) => {
    try {
      document.querySelectorAll(selector).forEach(el => el.remove());
    } catch (e) {}
  };

  if (disableConfig.console) {
    purgeSelector(".terminal-container");
  }
  if (disableConfig.benefit) {
    purgeSelector("#benefitwindow");
    purgeSelector("#site_credits button[onclick*='activateBenefitCheck']");
  }
  if (disableConfig.cheatMenu) {
    purgeSelector("#cheatMenu");
    purgeSelector("#site_credits button[onclick*='activateCheatMenu']");
  }
  if (disableConfig.autoplay) {
    purgeSelector("#autoplayMenu");
    purgeSelector("#cheatIndicator");
  }

  const style = document.createElement("style");
  let cssRules = "";

  if (disableConfig.console) {
    cssRules += ".terminal-container { display: none !important; }\n";
  }
  if (disableConfig.benefit) {
    cssRules += "#benefitwindow { display: none !important; }\n";
    cssRules += "#site_credits button[onclick*='activateBenefitCheck'] { display: none !important; }\n";
  }
  if (disableConfig.cheatMenu) {
    cssRules += "#cheatMenu { display: none !important; }\n";
    cssRules += "#site_credits button[onclick*='activateCheatMenu'] { display: none !important; }\n";
  }
  if (disableConfig.autoplay) {
    cssRules += "#autoplayMenu, #cheatIndicator { display: none !important; }\n";
  }

  style.textContent = cssRules;
  document.head.appendChild(style);
})();
