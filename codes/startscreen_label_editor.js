// This changes the labels (and values) of unordered lists in the selection screens
(function () {
  const originalDescHTML = window.descHTML || descHTML;
  if (!originalDescHTML) return;

  function isHiddenValue(value) {
    const text = String(value ?? "").trim().toLowerCase();
    return text === "" || text === "none";
  }

  function cleanLabel(label, fallback) {
    return String(label ?? fallback ?? "").replace(/:\s*$/, "").trim();
  }

  function fullName(candObj) {
    return `${candObj.first_name ?? ""} ${candObj.last_name ?? ""}`.trim();
  }

  function resolveField(candObj, fieldName) {
    const key = String(fieldName ?? "").trim();

    switch (key) {
      case "full_name":
        return fullName(candObj);
      case "first_name":
        return candObj.first_name ?? "";
      case "last_name":
        return candObj.last_name ?? "";
      case "party":
        return candObj.party ?? "";
      case "state":
        return candObj.state ?? "";
      case "abbreviation":
        return candObj.abbreviation ?? "";
      case "":
        return "";
      default:
        return candObj[key] ?? "";
    }
  }

  function getRows(isRunningMate) {
    if (isRunningMate) {
      return [
        {
          label: e.RMLabel1 ?? "Name",
          field: e.RMField1 ?? "full_name",
        },
        {
          label: e.RMLabel2 ?? e.PartyText ?? "Party:",
          field: e.RMField2 ?? "party",
        },
        {
          label: e.RMLabel3 ?? e.HomeStateText ?? "Home State:",
          field: e.RMField3 ?? "state",
        },
      ];
    }

    return [
      {
        label: e.CandLabel1 ?? "Name",
        field: e.CandField1 ?? "full_name",
      },
      {
        label: e.CandLabel2 ?? e.PartyText ?? "Party:",
        field: e.CandField2 ?? "party",
      },
      {
        label: e.CandLabel3 ?? e.HomeStateText ?? "Home State:",
        field: e.CandField3 ?? "state",
      },
    ];
  }

  window.descHTML = function (descWindow, id) {
    originalDescHTML(descWindow, id);

    const candObj = PROPS.CANDIDATES.get(String(id));
    if (!candObj) return;

    const isRunningMate = descWindow === "#running_mate_description_window";
    const rows = getRows(isRunningMate);

    const $list = $(descWindow).find("ul").first();
    if (!$list.length) return;

    $list.empty();

    rows.forEach(row => {
      const label = cleanLabel(row.label);
      const field = String(row.field ?? "").trim();

      if (isHiddenValue(label) || isHiddenValue(field)) return;

      const value = resolveField(candObj, field);
      $list.append($("<li>").text(`${label}: ${value ?? ""}`));
    });
  };
})();