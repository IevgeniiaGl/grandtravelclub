(() => {
  const form = document.querySelector(".paris-page #search, #top:has(.paris-deals) #search");
  if (!form) return;

  const from = form.querySelector("#from");
  const to = form.querySelector("#to");

  const regionTabs = [...document.querySelectorAll("[data-paris-deal-region]")];
  const sortTabs = [...document.querySelectorAll("[data-deal-sort]")];
  const grid = document.querySelector("[data-deals-grid]");
  const moreButton = document.querySelector("[data-deals-more]");
  const moreLabel = moreButton?.textContent.trim();
  const dealCards = [...document.querySelectorAll("[data-paris-deal-card]")];
  const collapsedCount = 3;
  let region = "all";
  let sortTab = sortTabs.find((tab) => tab.classList.contains("is-active"));
  let expanded = false;

  const setActive = (tabs, active) =>
    tabs.forEach((item) => {
      item.classList.toggle("is-active", item === active);
      item.setAttribute("aria-pressed", String(item === active));
    });

  // Region filter, then sort, then show the first three unless the visitor expanded the list.
  const renderDeals = () => {
    const matching = dealCards.filter((card) => region === "all" || card.dataset.parisDealCard === region);
    if (grid && sortTab) {
      const key = sortTab.dataset.dealSort;
      const direction = sortTab.dataset.dealSortDir === "desc" ? -1 : 1;
      matching.sort((a, b) => direction * (Number(a.dataset[key]) - Number(b.dataset[key])));
      matching.forEach((card) => grid.append(card));
    }
    const limit = moreButton && !expanded ? collapsedCount : Infinity;
    dealCards.forEach((card) => {
      card.hidden = !matching.includes(card) || matching.indexOf(card) >= limit;
    });
    if (moreButton) {
      const rest = matching.length - collapsedCount;
      moreButton.hidden = expanded || rest <= 0;
      moreButton.textContent = `${moreLabel} (${rest})`;
    }
  };

  regionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      region = tab.dataset.parisDealRegion;
      setActive(regionTabs, tab);
      renderDeals();
    });
  });

  sortTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      sortTab = tab;
      setActive(sortTabs, tab);
      renderDeals();
    });
  });

  moreButton?.addEventListener("click", () => {
    expanded = true;
    renderDeals();
  });

  document.querySelectorAll("[data-paris-deal-origin]").forEach((link) => {
    link.addEventListener("click", () => {
      if (!from || !to) return;
      from.value = link.dataset.parisDealOrigin;
      to.value = link.dataset.parisDealDestination || "Paris, FR (PAR)";
    });
  });

  document.querySelector("[data-paris-cta]")?.addEventListener("click", () => {
    if (from.value === "Paris, FR (PAR)") from.value = "Chișinău (RMO)";
    to.value = "Paris, FR (PAR)";
  });

  renderDeals();
})();
