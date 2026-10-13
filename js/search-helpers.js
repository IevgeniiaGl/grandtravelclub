(() => {
  const form = document.querySelector("#search");
  if (!form) return;

  // Popular routes: one click fills the destination field named by data-route-target (flights: #to).
  const routeButtons = [...form.querySelectorAll("[data-popular-route]")];
  routeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = form.querySelector(button.closest("[data-route-target]")?.dataset.routeTarget || "#to");
      if (!target) return;
      target.value = button.dataset.popularRoute;
      target.dispatchEvent(new Event("change", { bubbles: true }));
      routeButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    });
  });

  // Compact search bar and the mobile contact bar appear once the search form scrolls out of view.
  // Each [data-sticky-fields] lists the form fields it summarises, joined by data-sticky-join.
  const sticky = document.querySelector("[data-search-sticky]");
  const contactBar = document.querySelector("[data-contact-bar]");
  const cityName = (value) => value.split(/[,(—]/)[0].trim();
  const readField = (selector) => {
    const field = form.querySelector(selector);
    if (!field) return "";
    return ["INPUT", "SELECT", "TEXTAREA"].includes(field.tagName) ? field.value : field.textContent;
  };

  const fillSticky = () => {
    sticky?.querySelectorAll("[data-sticky-fields]").forEach((output) => {
      output.textContent = output.dataset.stickyFields
        .split(",")
        .map((selector) => {
          const value = readField(selector.trim()).trim();
          return (output.hasAttribute("data-sticky-city") ? cityName(value) : value) || output.dataset.stickyEmpty || "";
        })
        .join(output.dataset.stickyJoin || " · ");
    });
  };

  let ticking = false;
  const updateBars = () => {
    ticking = false;
    const past = form.getBoundingClientRect().bottom < 0;
    if (past && !sticky?.classList.contains("is-visible")) fillSticky();
    sticky?.classList.toggle("is-visible", past);
    contactBar?.classList.toggle("is-visible", past);
  };
  window.addEventListener("scroll", () => {
    if (!ticking) requestAnimationFrame(updateBars);
    ticking = true;
  }, { passive: true });
  updateBars();

  const editButton = sticky?.querySelector("[data-sticky-edit]");
  editButton?.addEventListener("click", (event) => {
    event.preventDefault();
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => form.querySelector(editButton.dataset.focus || "#to")?.focus({ preventScroll: true }), 400);
  });

  // Fare alerts: front-end only for now, the backend will store the subscription.
  const alertForm = document.querySelector("[data-fare-alert]");
  alertForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!alertForm.reportValidity()) return;
    const destination = alertForm.elements.destination.value.trim();
    alertForm.querySelector(".fare-alert__status").textContent = `Done! We will email you when ${alertForm.dataset.fareAlert || "fares"} to ${destination} drop.`;
    alertForm.reset();
  });
})();
