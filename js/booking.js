(() => {
  const root = document.querySelector("[data-booking]");
  if (!root) return;

  const tabs = [...root.querySelectorAll("[data-booking-tab]")];
  const panels = [...root.querySelectorAll("[data-booking-panel]")];
  const nextButton = root.querySelector("[data-booking-next]");
  const backButton = root.querySelector("[data-booking-back]");
  const confirmation = root.querySelector("[data-booking-confirm]");
  const message = root.querySelector("[data-booking-message]");
  const passengerForm = root.querySelector("[data-passenger-form]");
  const passengerTabs = [...root.querySelectorAll("[data-passenger-tab]")];
  const passengerPanels = [...root.querySelectorAll("[data-passenger-panel]")];
  let currentStep = 1;

  const showPassenger = (passenger) => {
    passengerTabs.forEach((tab) => {
      const active = Number(tab.dataset.passengerTab) === passenger;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    passengerPanels.forEach((panel) => (panel.hidden = Number(panel.dataset.passengerPanel) !== passenger));
  };

  const updatePassengerErrors = () => {
    passengerPanels.forEach((panel) => {
      const invalidFields = [...panel.querySelectorAll("[required]")].filter((field) => !field.validity.valid);
      panel.querySelectorAll("[required]").forEach((field) => field.setAttribute("aria-invalid", String(!field.validity.valid)));
      const tab = passengerTabs.find((item) => item.dataset.passengerTab === panel.dataset.passengerPanel);
      tab.classList.toggle("has-error", invalidFields.length > 0);
      const marker = tab.querySelector("i");
      if (marker) marker.hidden = invalidFields.length === 0;
    });
  };

  const showStep = (step) => {
    currentStep = Math.max(1, Math.min(4, step));
    tabs.forEach((tab, index) => {
      const active = index + 1 === currentStep;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel, index) => (panel.hidden = index + 1 !== currentStep));
    backButton.hidden = currentStep === 1;
    nextButton.textContent = currentStep === 4 ? "Complete booking" : "Next step";
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => showStep(Number(tab.dataset.bookingTab))));
  passengerTabs.forEach((tab) => tab.addEventListener("click", () => showPassenger(Number(tab.dataset.passengerTab))));
  passengerForm.querySelectorAll("input, select").forEach((field) => field.addEventListener("input", updatePassengerErrors));
  backButton.addEventListener("click", () => showStep(currentStep - 1));
  nextButton.addEventListener("click", () => {
    if (currentStep === 2 && !passengerForm.checkValidity()) {
      updatePassengerErrors();
      const invalidPanel = passengerPanels.find((panel) => panel.querySelector(":invalid"));
      if (invalidPanel) showPassenger(Number(invalidPanel.dataset.passengerPanel));
      passengerForm.querySelector(":invalid")?.focus();
      return;
    }
    if (currentStep < 4) {
      showStep(currentStep + 1);
      root.querySelector(".booking-tabs").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    message.textContent = confirmation.checked ? "Booking prototype completed." : "Please confirm the itinerary before continuing.";
  });

  root.querySelectorAll('[name="protection"]').forEach((input) => {
    input.addEventListener("change", () => {
      root.querySelectorAll(".booking-choice").forEach((choice) => {
        const selected = choice.contains(input);
        choice.classList.toggle("is-selected", selected);
      });
      const price = Number(input.dataset.price || 0);
      root.querySelector("[data-protection-price] dd").textContent = `€${price}`;
      root.querySelector("[data-booking-total]").textContent = `€${(4280 + price).toLocaleString("en-US")}`;
    });
  });

  showPassenger(1);
  updatePassengerErrors();
  showStep(1);
})();
