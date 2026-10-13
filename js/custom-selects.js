(() => {
  const selector = [
    ".flight-search__options select",
    ".home-search__hotel-fields select",
    ".flight-results__sort select",
  ].join(",");

  const closeAll = (except) => {
    document.querySelectorAll(".ui-select.is-open").forEach((component) => {
      if (component === except) return;
      component.classList.remove("is-open");
      component.querySelector(".ui-select__trigger").setAttribute("aria-expanded", "false");
    });
  };

  document.querySelectorAll(selector).forEach((select, index) => {
    if (select.dataset.customSelectReady) return;
    select.dataset.customSelectReady = "true";
    select.classList.add("ui-select__native");

    const component = document.createElement("div");
    component.className = "ui-select";
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "ui-select__trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    const panel = document.createElement("div");
    panel.className = "ui-select__panel";
    panel.id = `ui-select-panel-${index + 1}`;
    panel.setAttribute("role", "listbox");
    trigger.setAttribute("aria-controls", panel.id);

    const sync = () => {
      trigger.textContent = select.options[select.selectedIndex]?.textContent || "Select";
      panel.querySelectorAll("button").forEach((option, optionIndex) => {
        const selected = optionIndex === select.selectedIndex;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-selected", String(selected));
      });
    };

    [...select.options].forEach((sourceOption, optionIndex) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "ui-select__option";
      option.setAttribute("role", "option");
      option.textContent = sourceOption.textContent;
      option.disabled = sourceOption.disabled;
      option.addEventListener("click", () => {
        select.selectedIndex = optionIndex;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        sync();
        component.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
      });
      panel.append(option);
    });

    trigger.addEventListener("click", () => {
      const open = !component.classList.contains("is-open");
      closeAll(component);
      component.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", String(open));
    });
    select.parentElement.addEventListener("click", (event) => {
      if (event.target === select.parentElement) trigger.click();
    });
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        component.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
    select.addEventListener("change", sync);
    select.insertAdjacentElement("afterend", component);
    component.append(trigger, panel);
    sync();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".ui-select")) closeAll();
  });
})();
