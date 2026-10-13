const menuButton = document.querySelector(".menu-toggle");

const benefitsCarousel = document.querySelector(".premium-benefits__slider");
if (benefitsCarousel) {
  const track = benefitsCarousel.querySelector("[data-benefits-track]");
  const items = [...track.children];
  let benefitIndex = 0;
  let benefitsTimer;
  const visibleBenefits = () =>
    window.innerWidth <= 440
      ? 1
      : window.innerWidth <= 720
        ? 2
        : window.innerWidth <= 980
          ? 3
          : 4;
  const renderBenefits = () => {
    const visible = visibleBenefits();
    benefitIndex = Math.min(benefitIndex, Math.max(0, items.length - visible));
    track.style.transform = `translateX(-${benefitIndex * (100 / visible)}%)`;
  };
  const moveBenefits = (direction) => {
    const maximum = Math.max(0, items.length - visibleBenefits());
    benefitIndex =
      direction > 0
        ? benefitIndex >= maximum
          ? 0
          : benefitIndex + 1
        : benefitIndex <= 0
          ? maximum
          : benefitIndex - 1;
    renderBenefits();
  };
  const startBenefits = () => {
    clearInterval(benefitsTimer);
    benefitsTimer = setInterval(() => moveBenefits(1), 4500);
  };
  benefitsCarousel.addEventListener("mouseenter", () =>
    clearInterval(benefitsTimer),
  );
  benefitsCarousel.addEventListener("mouseleave", startBenefits);
  benefitsCarousel.addEventListener("focusin", () =>
    clearInterval(benefitsTimer),
  );
  benefitsCarousel.addEventListener("focusout", startBenefits);
  window.addEventListener("resize", renderBenefits);
  renderBenefits();
  startBenefits();
}

const homeSearchTabs = document.querySelectorAll("[data-home-search-tab]");
const homeSearchPanels = document.querySelectorAll("[data-home-search-panel]");

homeSearchTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.homeSearchTab;

    homeSearchTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    homeSearchPanels.forEach((panel) => {
      const active = panel.dataset.homeSearchPanel === target;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  });
});

const requestedSearch = new URLSearchParams(location.search).get("search");
if (["flights", "hotels", "cruises"].includes(requestedSearch)) {
  document.querySelector(`[data-home-search-tab="${requestedSearch}"]`)?.click();
}

const requestedDestination = new URLSearchParams(location.search).get("to");
if (requestedDestination) {
  const toInput = document.querySelector("[data-initial-airport-field='to'] input");
  if (toInput) toInput.value = requestedDestination;
}

document.querySelector("[data-hotel-search]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.querySelector(".search-form__message").textContent =
    "Hotel search is ready.";
});

document.querySelector("#homeCruiseSearch")?.addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.querySelector(".search-form__message").textContent =
    "Cruise search is ready.";
});

document.querySelectorAll("[data-hotel-destination]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector('[data-home-search-tab="hotels"]')?.click();
    const destinationInput = document.querySelector(
      "[data-hotel-search] [name='destination']",
    );
    if (destinationInput) destinationInput.value = link.dataset.hotelDestination;
  });
});

const airlinesCarousel = document.querySelector(".airlines__viewport");
if (airlinesCarousel) {
  const track = airlinesCarousel.querySelector("[data-airlines-track]");
  const items = [...track.children];
  let airlineIndex = 0;
  let airlinesTimer;
  const visibleAirlines = () =>
    window.innerWidth <= 720 ? 2 : window.innerWidth <= 980 ? 3 : 6;
  const renderAirlines = () => {
    const visible = visibleAirlines();
    const maximum = Math.max(0, items.length - visible);
    airlineIndex = Math.min(airlineIndex, maximum);
    track.style.setProperty("--airlines-visible", visible);
    track.style.transform = `translateX(-${airlineIndex * (100 / visible)}%)`;
  };
  const moveAirlines = () => {
    const maximum = Math.max(0, items.length - visibleAirlines());
    airlineIndex = airlineIndex >= maximum ? 0 : airlineIndex + 1;
    renderAirlines();
  };
  const startAirlines = () => {
    clearInterval(airlinesTimer);
    airlinesTimer = setInterval(moveAirlines, 3200);
  };
  airlinesCarousel.addEventListener("mouseenter", () => clearInterval(airlinesTimer));
  airlinesCarousel.addEventListener("mouseleave", startAirlines);
  airlinesCarousel.addEventListener("focusin", () => clearInterval(airlinesTimer));
  airlinesCarousel.addEventListener("focusout", startAirlines);
  window.addEventListener("resize", renderAirlines);
  renderAirlines();
  startAirlines();
}
const nav = document.querySelector(".nav");
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

// The flight search (the only form with a trip type); hotel and cruise forms have their own logic.
const form = document.querySelector(".search-form #tripType")?.closest(".search-form");
const formatDate = (date) => date.toISOString().split("T")[0];
if (form) {
  const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return formatDate(date);
  };
  const tripType = form.querySelector("#tripType");
  const from = form.querySelector("#from");
  const to = form.querySelector("#to");
  const depart = form.querySelector("#depart");
  const returnDate = form.querySelector("#return");
  const multiCity = form.querySelector("[data-multi-city]");
  const segmentsRoot = form.querySelector("[data-route-segments]");
  const addSegmentButton = form.querySelector("[data-add-segment]");
  const travelerPicker = form.querySelector(".traveler-picker");
  const travelerTrigger = travelerPicker.querySelector(".traveler-picker__trigger");
  const travelerPanel = travelerPicker.querySelector(".traveler-picker__panel");
  const travelerSummary = travelerPicker.querySelector("[data-traveler-summary]");
  const cabinClass = form.querySelector("#cabinClass");
  const directOnly = form.querySelector("#directOnly");
  const baggagePicker = form.querySelector(".baggage-picker");
  const baggageSummary = baggagePicker?.querySelector("[data-baggage-summary]");
  const message = form.querySelector(".search-form__message");
  const travelerCounts = { adults: 1, children: 0, infants: 0 };
  const travelerInputs = {
    adults: form.querySelector("#travelerAdults"),
    children: form.querySelector("#travelerChildren"),
    infants: form.querySelector("#travelerInfants"),
  };
  const maximumTravelers = 9;

  depart.min = formatDate(new Date());
  returnDate.min = depart.min;
  depart.value = addDays(14);
  returnDate.value = addDays(21);

  const airportChoices = [
    "Chișinău, Moldova — Chișinău International Airport (RMO)",
    "Paris, France — All Airports (PAR)",
    "Paris, France — Charles de Gaulle Airport (CDG)",
    "Paris, France — Orly Airport (ORY)",
    "Los Angeles, USA — All Airports (LAX)",
    "Los Angeles, USA — Los Angeles International Airport (LAX)",
    "London, UK — All Airports (LON)",
    "Dubai, UAE — Dubai International Airport (DXB)",
    "New York, USA — All Airports (NYC)",
    "Tokyo, Japan — All Airports (TYO)",
  ];

  const closeInitialAirportLists = (except) => {
    form.querySelectorAll(".airport-options.is-open").forEach((list) => {
      if (list === except) return;
      list.classList.remove("is-open");
      list.closest("[data-initial-airport-field]")?.querySelector("input")?.setAttribute("aria-expanded", "false");
    });
  };

  let airportListSequence = 0;
  const enhanceAirportField = (field) => {
    if (field.dataset.airportReady) return;
    field.dataset.airportReady = "true";
    const input = field.querySelector("input");
    const list = document.createElement("div");
    list.className = "airport-options";
    airportListSequence += 1;
    list.id = `initial-airport-options-${airportListSequence}`;
    list.setAttribute("role", "listbox");
    input.setAttribute("aria-controls", list.id);
    input.setAttribute("aria-expanded", "false");
    field.append(list);

    const renderOptions = (queryValue = "") => {
      const query = queryValue.trim().toLowerCase();
      const matches = airportChoices.filter((airport) => airport.toLowerCase().includes(query));
      list.replaceChildren();
      matches.forEach((airport, index) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "airport-options__item";
        option.setAttribute("role", "option");
        option.innerHTML = '<span aria-hidden="true">✈</span><strong></strong>';
        option.querySelector("strong").textContent = airport;
        if (index === 0 && !query) option.classList.add("is-highlighted");
        option.addEventListener("click", () => {
          input.value = airport;
          list.classList.remove("is-open");
          input.setAttribute("aria-expanded", "false");
        });
        list.append(option);
      });
    };

    input.addEventListener("focus", () => {
      renderOptions();
      closeInitialAirportLists(list);
      list.classList.add("is-open");
      input.setAttribute("aria-expanded", "true");
    });
    input.addEventListener("input", () => {
      renderOptions(input.value);
      closeInitialAirportLists(list);
      list.classList.add("is-open");
      input.setAttribute("aria-expanded", "true");
    });
  };

  form.querySelectorAll("[data-initial-airport-field]").forEach(enhanceAirportField);

  const dateRangeField = form.querySelector("[data-initial-date-range-field]");
  const dateRangeInput = dateRangeField.querySelector("#dateRange");
  const calendar = window.createDateRangeCalendar({
    title: "Choose your travel dates",
    applyText: "Choose round trip",
  });
  dateRangeField.append(calendar);

  let visibleMonth = new Date(new Date(depart.value).getFullYear(), new Date(depart.value).getMonth(), 1);
  let selectedStart = new Date(`${depart.value}T00:00:00`);
  let selectedEnd = new Date(`${returnDate.value}T00:00:00`);
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
  const shortDateFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
  const toInputDate = (date) => date ? formatDate(new Date(date.getTime() - date.getTimezoneOffset() * 60000)) : "";
  const sameDay = (first, second) => first && second && first.getTime() === second.getTime();
  const dayMs = 864e5;
  const flexibleDays = () => Number(calendar.querySelector('[name="dateFlex"]:checked')?.value || 0);
  const isFlexibleDay = (date, flex) =>
    flex > 0 && [selectedStart, selectedEnd].some((anchor) => anchor && !sameDay(date, anchor) && Math.abs(date - anchor) <= flex * dayMs);

  const renderInitialMonth = (monthRoot, month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    monthRoot.replaceChildren();
    const title = document.createElement("h3");
    title.textContent = monthFormatter.format(month);
    monthRoot.append(title);
    const weekdays = document.createElement("div");
    weekdays.className = "date-range-calendar__weekdays";
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => { const item = document.createElement("span"); item.textContent = day; weekdays.append(item); });
    monthRoot.append(weekdays);
    const days = document.createElement("div");
    days.className = "date-range-calendar__days";
    for (let index = 0; index < new Date(year, monthIndex, 1).getDay(); index += 1) days.append(document.createElement("span"));
    const flex = flexibleDays();
    for (let day = 1; day <= new Date(year, monthIndex + 1, 0).getDate(); day += 1) {
      const date = new Date(year, monthIndex, day);
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = day;
      if (isFlexibleDay(date, flex)) button.classList.add("is-flex");
      if (sameDay(date, selectedStart)) button.classList.add("is-start");
      if (sameDay(date, selectedEnd)) button.classList.add("is-end");
      if (selectedStart && selectedEnd && date > selectedStart && date < selectedEnd) button.classList.add("is-in-range");
      button.addEventListener("click", () => {
        if (tripType.value === "one-way") { selectedStart = date; selectedEnd = null; }
        else if (!selectedStart || selectedEnd || date < selectedStart) { selectedStart = date; selectedEnd = null; }
        else selectedEnd = date;
        renderInitialCalendar();
      });
      days.append(button);
    }
    monthRoot.append(days);
  };

  const renderInitialCalendar = () => {
    const monthRoots = calendar.querySelectorAll("[data-calendar-month]");
    renderInitialMonth(monthRoots[0], visibleMonth);
    renderInitialMonth(monthRoots[1], new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1));
    const oneWay = tripType.value === "one-way";
    const apply = calendar.querySelector("[data-calendar-apply]");
    apply.textContent = oneWay ? "Choose departure" : "Choose round trip";
    apply.disabled = !selectedStart || (!oneWay && !selectedEnd);
  };

  const updateDateSummary = () => {
    const oneWay = tripType.value === "one-way";
    depart.value = toInputDate(selectedStart);
    returnDate.value = oneWay ? "" : toInputDate(selectedEnd);
    dateRangeInput.value = selectedStart ? `${shortDateFormatter.format(selectedStart)}${!oneWay && selectedEnd ? ` — ${shortDateFormatter.format(selectedEnd)}` : ""}` : "";
  };

  dateRangeInput.addEventListener("click", () => {
    calendar.classList.add("is-open");
    dateRangeInput.setAttribute("aria-expanded", "true");
    closeInitialAirportLists();
  });
  calendar.querySelector("[data-calendar-prev]").addEventListener("click", () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1); renderInitialCalendar(); });
  calendar.querySelector("[data-calendar-next]").addEventListener("click", () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1); renderInitialCalendar(); });
  calendar.querySelector("[data-calendar-apply]").addEventListener("click", () => { updateDateSummary(); calendar.classList.remove("is-open"); dateRangeInput.setAttribute("aria-expanded", "false"); });
  calendar.querySelector(".date-range-calendar__flexibility").addEventListener("change", renderInitialCalendar);
  updateDateSummary();
  renderInitialCalendar();

  const swapValues = (first, second) => {
    [first.value, second.value] = [second.value, first.value];
  };

  form.querySelector(".search-form__fields .swap").addEventListener("click", () =>
    swapValues(from, to),
  );

  const updateTravelerPicker = () => {
    const total = Object.values(travelerCounts).reduce((sum, count) => sum + count, 0);
    travelerSummary.textContent = `${total} ${total === 1 ? "traveler" : "travelers"}`;

    Object.entries(travelerCounts).forEach(([type, count]) => {
      const row = travelerPicker.querySelector(`[data-traveler-type="${type}"]`);
      row.querySelector("output").textContent = count;
      row.querySelector('[data-counter-action="decrease"]').disabled =
        type === "adults" ? count <= 1 : count <= 0;
      row.querySelector('[data-counter-action="increase"]').disabled =
        total >= maximumTravelers || (type === "infants" && count >= travelerCounts.adults);
      travelerInputs[type].value = String(count);
    });
  };

  const setTravelerPanel = (open) => {
    travelerPanel.hidden = !open;
    travelerTrigger.setAttribute("aria-expanded", String(open));
  };

  travelerTrigger.addEventListener("click", () =>
    setTravelerPanel(travelerPanel.hidden),
  );
  travelerPicker.querySelector(".traveler-picker__done").addEventListener("click", () =>
    setTravelerPanel(false),
  );
  cabinClass.addEventListener("change", updateTravelerPicker);
  travelerPicker.addEventListener("click", (event) => {
    const counterButton = event.target.closest("[data-counter-action]");
    if (!counterButton) return;
    const type = counterButton.closest("[data-traveler-type]").dataset.travelerType;
    const change = counterButton.dataset.counterAction === "increase" ? 1 : -1;
    const minimum = type === "adults" ? 1 : 0;
    const total = Object.values(travelerCounts).reduce((sum, count) => sum + count, 0);

    if (change > 0 && total >= maximumTravelers) return;
    travelerCounts[type] = Math.max(minimum, travelerCounts[type] + change);
    if (type === "adults" && travelerCounts.infants > travelerCounts.adults) {
      travelerCounts.infants = travelerCounts.adults;
    }
    updateTravelerPicker();
  });
  document.addEventListener("click", (event) => {
    if (!travelerPicker.contains(event.target)) setTravelerPanel(false);
    if (!event.target.closest("[data-initial-airport-field]")) closeInitialAirportLists();
    // A day click re-renders the month, so the clicked button is already detached: that is not an outside click.
    if (event.target.isConnected && !event.target.closest("[data-initial-date-range-field]")) {
      calendar.classList.remove("is-open");
      dateRangeInput.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setTravelerPanel(false);
      if (baggagePicker) baggagePicker.open = false;
    }
  });

  const updateBaggageSummary = () => {
    if (!baggagePicker || !baggageSummary) return;
    const selected = [...baggagePicker.querySelectorAll('input[type="checkbox"]:checked')];
    baggageSummary.textContent =
      selected.length === 0
        ? "Baggage"
        : selected.length === 1
          ? selected[0].nextElementSibling.textContent
          : "Cabin + checked";
  };

  if (baggagePicker) {
    baggagePicker.addEventListener("change", updateBaggageSummary);
    document.addEventListener("click", (event) => {
      if (!baggagePicker.contains(event.target)) baggagePicker.open = false;
    });
    updateBaggageSummary();
  }

  const enhanceSegmentDateField = (field, initialValue) => {
    const display = field.querySelector("[data-segment-date-display]");
    const valueInput = field.querySelector("[data-segment-date-value]");
    let selectedDate = new Date(`${initialValue}T00:00:00`);
    let segmentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const segmentCalendar = document.createElement("div");
    segmentCalendar.className = "date-range-calendar date-range-calendar--segment";
    segmentCalendar.innerHTML = `
      <p>Choose departure date</p>
      <div class="date-range-calendar__months">
        <button type="button" class="date-range-calendar__nav" data-calendar-prev aria-label="Previous month"><span class="ui-chevron ui-chevron--left" aria-hidden="true"></span></button>
        <div data-calendar-month></div><div data-calendar-month></div>
        <button type="button" class="date-range-calendar__nav" data-calendar-next aria-label="Next month"><span class="ui-chevron ui-chevron--right" aria-hidden="true"></span></button>
      </div>
      ${window.dateFlexibilityMarkup()}
      <button type="button" class="date-range-calendar__apply" data-calendar-apply>Choose departure</button>`;
    field.append(segmentCalendar);

    const renderSegmentMonth = (monthRoot, month) => {
      const year = month.getFullYear();
      const monthIndex = month.getMonth();
      monthRoot.replaceChildren();
      const title = document.createElement("h3");
      title.textContent = monthFormatter.format(month);
      monthRoot.append(title);
      const weekdays = document.createElement("div");
      weekdays.className = "date-range-calendar__weekdays";
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => { const item = document.createElement("span"); item.textContent = day; weekdays.append(item); });
      monthRoot.append(weekdays);
      const days = document.createElement("div");
      days.className = "date-range-calendar__days";
      for (let blank = 0; blank < new Date(year, monthIndex, 1).getDay(); blank += 1) days.append(document.createElement("span"));
      for (let day = 1; day <= new Date(year, monthIndex + 1, 0).getDate(); day += 1) {
        const date = new Date(year, monthIndex, day);
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = day;
        if (sameDay(date, selectedDate)) button.classList.add("is-start");
        button.addEventListener("click", () => { selectedDate = date; renderSegmentCalendar(); });
        days.append(button);
      }
      monthRoot.append(days);
    };

    const renderSegmentCalendar = () => {
      const months = segmentCalendar.querySelectorAll("[data-calendar-month]");
      renderSegmentMonth(months[0], segmentMonth);
      renderSegmentMonth(months[1], new Date(segmentMonth.getFullYear(), segmentMonth.getMonth() + 1, 1));
    };

    const syncSegmentDate = () => {
      valueInput.value = toInputDate(selectedDate);
      display.value = shortDateFormatter.format(selectedDate);
    };

    display.addEventListener("click", () => {
      form.querySelectorAll(".date-range-calendar--segment.is-open").forEach((item) => item.classList.remove("is-open"));
      segmentCalendar.classList.add("is-open");
      display.setAttribute("aria-expanded", "true");
      closeInitialAirportLists();
    });
    segmentCalendar.querySelector("[data-calendar-prev]").addEventListener("click", () => { segmentMonth = new Date(segmentMonth.getFullYear(), segmentMonth.getMonth() - 1, 1); renderSegmentCalendar(); });
    segmentCalendar.querySelector("[data-calendar-next]").addEventListener("click", () => { segmentMonth = new Date(segmentMonth.getFullYear(), segmentMonth.getMonth() + 1, 1); renderSegmentCalendar(); });
    segmentCalendar.querySelector("[data-calendar-apply]").addEventListener("click", () => { syncSegmentDate(); segmentCalendar.classList.remove("is-open"); display.setAttribute("aria-expanded", "false"); });
    document.addEventListener("click", (event) => {
      if (field.contains(event.target)) return;
      segmentCalendar.classList.remove("is-open");
      display.setAttribute("aria-expanded", "false");
    });
    syncSegmentDate();
    renderSegmentCalendar();
  };

  const createSegment = (index, values = {}) => {
    const segment = document.createElement("div");
    segment.className = "multi-city__segment";
    const segmentDate = values.date || addDays(14 + index * 3);
    segment.innerHTML = `
      <span class="multi-city__number">${String(index + 1).padStart(2, "0")}</span>
      <label class="search-form__field search-form__field--from flight-search__field" data-initial-airport-field="from">
        <span class="sr-only">From</span>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m3 16 18-5-1-3-7 2-5-7-2 1 3 8-5 2-2-2-1 1 2 4Zm0 3h18v2H3v-2Z" /></svg>
        <input name="segmentFrom[]" type="text" value="${values.from || ""}" placeholder="City or airport" autocomplete="off" required>
      </label>
      <button class="swap flight-search__swap" type="button" aria-label="Swap cities for flight ${index + 1}">⇄</button>
      <label class="search-form__field search-form__field--to flight-search__field" data-initial-airport-field="to">
        <span class="sr-only">To</span>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M2.5 19h19v2h-19v-2Zm17.61-5.94-5.3-1.42-2.76-8.97-1.93-.52v8.07L5.15 8.89l-.93-2.32-1.45-.39v4.05l7.91 3.09 3.37 1.16 3.3 1.42c.78.21 1.59-.26 1.8-1.04.21-.78-.26-1.59-1.04-1.8Z" /></svg>
        <input name="segmentTo[]" type="text" value="${values.to || ""}" placeholder="City or airport" autocomplete="off" required>
      </label>
      <div class="search-form__field search-form__field--depart flight-search__field" data-segment-date-field>
        <span class="sr-only">Departure</span>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm13 8H4v10h16V10ZM4 8h16V6H4v2Z" /></svg>
        <input type="text" data-segment-date-display aria-label="Departure date" aria-expanded="false" readonly>
        <input name="segmentDate[]" type="hidden" value="${segmentDate}" data-segment-date-value>
      </div>
      <button class="multi-city__remove" type="button" aria-label="Remove flight ${index + 1}">×</button>`;

    segment.querySelector(".swap").addEventListener("click", () => {
      const fields = segment.querySelectorAll('[data-initial-airport-field] input');
      swapValues(fields[0], fields[1]);
    });
    segment.querySelector(".multi-city__remove").addEventListener("click", () => {
      segment.remove();
      refreshSegments();
    });
    segment.querySelectorAll("[data-initial-airport-field]").forEach(enhanceAirportField);
    enhanceSegmentDateField(segment.querySelector("[data-segment-date-field]"), segmentDate);
    return segment;
  };

  const refreshSegments = () => {
    [...segmentsRoot.children].forEach((segment, index) => {
      segment.querySelector(".multi-city__number").textContent = String(index + 1).padStart(2, "0");
      segment.querySelector(".multi-city__remove").disabled = segmentsRoot.children.length <= 2;
    });
    addSegmentButton.disabled = segmentsRoot.children.length >= 6;
  };

  const addSegment = (values) => {
    if (segmentsRoot.children.length >= 6) return;
    segmentsRoot.append(createSegment(segmentsRoot.children.length, values));
    refreshSegments();
  };

  addSegment({ from: from.value, to: "", date: depart.value });
  addSegment({ from: "", to: "", date: addDays(18) });
  addSegmentButton.addEventListener("click", () => addSegment());

  let previousTripType = tripType.value;
  const updateTripType = () => {
    const type = tripType.value;
    const isMultiCity = type === "multi-city";
    const isRoundTrip = type === "round-trip";

    if (type === "one-way" && previousTripType !== "one-way") {
      selectedStart = new Date(`${addDays(21)}T00:00:00`);
      selectedEnd = null;
      visibleMonth = new Date(selectedStart.getFullYear(), selectedStart.getMonth(), 1);
    }

    form.classList.toggle("is-multi-city", isMultiCity);
    multiCity.hidden = !isMultiCity;
    returnDate.required = isRoundTrip;
    dateRangeField.dataset.tripType = type;
    updateDateSummary();
    renderInitialCalendar();
    [from, to, depart].forEach((field) => (field.required = !isMultiCity));
    segmentsRoot
      .querySelectorAll("input")
      .forEach((field) => (field.disabled = !isMultiCity));
    message.textContent = "";
    previousTripType = type;
  };

  tripType.addEventListener("change", updateTripType);
  depart.addEventListener("change", () => {
    returnDate.min = depart.value || formatDate(new Date());
    if (returnDate.value && returnDate.value < depart.value) returnDate.value = depart.value;
  });
  updateTravelerPicker();
  updateTripType();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    location.href = "flight-results.html";
  });
}

document.querySelectorAll(".accordion button").forEach((button) =>
  button.addEventListener("click", () => {
    const item = button.closest("article");
    const accordion = button.closest(".accordion");
    const willOpen = !item.classList.contains("is-open");

    accordion.querySelectorAll(":scope > article").forEach((accordionItem) => {
      accordionItem.classList.remove("is-open");
      accordionItem
        .querySelector("button")
        ?.setAttribute("aria-expanded", "false");
    });

    if (willOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  }),
);

const catalogDate = document.querySelector("#catalogDepart");
if (catalogDate) catalogDate.value = formatDate(new Date(Date.now() + 12096e5));
const regionFilters = document.querySelectorAll(
  ".deal-catalog__filters button",
);
const countryFilters = document.querySelector("[data-country-filters]");
let selectedRegion = "all";
let selectedCountry = "all";

const filterDestinationCards = () => {
  document.querySelectorAll(".deal-card, .deal-catalog .place-card, .deal-catalog .hotel-card[data-region]").forEach((card) => {
    const matchesRegion =
      selectedRegion === "all" || card.dataset.region === selectedRegion;
    const matchesCountry =
      selectedCountry === "all" || card.dataset.country === selectedCountry;
    card.hidden = !matchesRegion || !matchesCountry;
  });
};

regionFilters.forEach((button) => {
  button.addEventListener("click", () => {
    selectedRegion = button.dataset.region;
    selectedCountry = "all";
    regionFilters.forEach((item) => {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });

    if (countryFilters) {
      const regionCountries = countryFilters.querySelectorAll(
        `[data-country-region="${selectedRegion}"]`,
      );
      // A country row only helps when the region has more than one country.
      countryFilters.hidden = selectedRegion === "all" || regionCountries.length < 2;
      countryFilters.querySelectorAll("button").forEach((countryButton) => {
        const isAll = countryButton.dataset.country === "all";
        countryButton.hidden =
          !isAll && countryButton.dataset.countryRegion !== selectedRegion;
        countryButton.classList.toggle("is-active", isAll);
        countryButton.setAttribute("aria-pressed", String(isAll));
      });
      countryFilters.scrollLeft = 0;
    }

    filterDestinationCards();
  });
});

// Country row arrows: shown only when the row overflows, disabled at either end.
const countryScroller = countryFilters?.closest("[data-country-scroller]");
const updateCountryArrows = () => {
  if (!countryScroller) return;
  const max = countryFilters.scrollWidth - countryFilters.clientWidth;
  countryScroller.classList.toggle("is-scrollable", max > 1);
  countryScroller.querySelector("[data-country-scroll=\"-1\"]").disabled = countryFilters.scrollLeft <= 1;
  countryScroller.querySelector("[data-country-scroll=\"1\"]").disabled = countryFilters.scrollLeft >= max - 1;
};
countryScroller?.querySelectorAll("[data-country-scroll]").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    countryFilters.scrollBy({ left: Number(arrow.dataset.countryScroll) * countryFilters.clientWidth * 0.6 });
  });
});
countryFilters?.addEventListener("scroll", updateCountryArrows, { passive: true });
window.addEventListener("resize", updateCountryArrows);
regionFilters.forEach((button) => button.addEventListener("click", () => requestAnimationFrame(updateCountryArrows)));

// Long country lists stay on one line: let the mouse wheel scroll the row sideways.
countryFilters?.addEventListener(
  "wheel",
  (event) => {
    const canScroll = countryFilters.scrollWidth > countryFilters.clientWidth;
    if (!canScroll || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    countryFilters.scrollLeft += event.deltaY;
  },
  { passive: false },
);

countryFilters?.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedCountry = button.dataset.country;
    countryFilters.querySelectorAll("button").forEach((item) => {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    filterDestinationCards();
  });
});
document.querySelectorAll(".deal-card, .place-card").forEach((card) => {
  const link = card.querySelector("a");
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.setAttribute("aria-label", link.getAttribute("aria-label") || link.textContent.trim());
  card.addEventListener("click", (event) => {
    if (!event.target.closest("a")) location.href = link.href;
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      location.href = link.href;
    }
  });
});

document.querySelectorAll("[data-destinations-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");

  if (!track || !previous || !next) return;

  const move = direction => {
    const card = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.scrollBy({ left: direction * ((card?.getBoundingClientRect().width || track.clientWidth) + gap), behavior: "smooth" });
  };

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let autoplay;

    const stopAutoplay = () => clearInterval(autoplay);
    const startAutoplay = () => {
      stopAutoplay();
      autoplay = setInterval(() => {
        const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        if (isAtEnd) {
          track.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          move(1);
        }
      }, 4000);
    };

    carousel.addEventListener("pointerenter", stopAutoplay);
    carousel.addEventListener("pointerleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);
    startAutoplay();
  }
});

// Popular block: Destinations / Hotels / Cruises tabs (arrow keys move between tabs).
const catalogTabs = [...document.querySelectorAll("[data-catalog-tab]")];
const selectCatalogTab = (tab) => {
  catalogTabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
    document.querySelector(`[data-catalog-panel="${item.dataset.catalogTab}"]`).hidden = !active;
  });
};
catalogTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectCatalogTab(tab));
  tab.addEventListener("keydown", (event) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const nextTab = catalogTabs[(index + step + catalogTabs.length) % catalogTabs.length];
    selectCatalogTab(nextTab);
    nextTab.focus();
  });
});

document.querySelectorAll("[data-search-tab-target]").forEach((link) => {
  link.addEventListener("click", () => {
    const tab = document.querySelector(`[data-home-search-tab="${link.dataset.searchTabTarget}"]`);
    tab?.click();
  });
});
const quoteCard = document.querySelector(".quote-card");
if (quoteCard)
  quoteCard.addEventListener("submit", (event) => {
    event.preventDefault();
    quoteCard.querySelector(".quote-card__message").textContent =
      "Thank you. Your personal travel expert will contact you shortly.";
  });

document.querySelectorAll(".contact-form").forEach((contactForm) => {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.querySelector(".contact-form__message").textContent =
      "Thank you. Our team will contact you shortly.";
  });
});

const hotelSearch = document.querySelector("[data-hotel-search]");

if (hotelSearch) {
  const cityField = hotelSearch.querySelector("[data-hotel-city-field]");
  const cityInput = cityField.querySelector("input");
  const cityList = document.createElement("div");
  const hotelCities = [
    "Chișinău, Moldova",
    "Paris, France",
    "Los Angeles, USA",
    "London, United Kingdom",
    "Dubai, UAE",
    "New York, USA",
    "Tokyo, Japan",
    "Singapore",
  ];

  cityList.className = "airport-options";
  cityList.id = "hotel-city-options";
  cityList.setAttribute("role", "listbox");
  cityInput.setAttribute("aria-controls", cityList.id);
  cityField.append(cityList);

  const renderHotelCities = () => {
    const query = cityInput.value.trim().toLowerCase();
    cityList.replaceChildren();
    hotelCities
      .filter((city) => city.toLowerCase().includes(query))
      .forEach((city) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "airport-options__item";
        option.setAttribute("role", "option");
        option.innerHTML = '<span aria-hidden="true">⌖</span><strong></strong>';
        option.querySelector("strong").textContent = city;
        option.addEventListener("click", () => {
          cityInput.value = city;
          cityList.classList.remove("is-open");
          cityInput.setAttribute("aria-expanded", "false");
        });
        cityList.append(option);
      });
  };

  const openHotelCities = () => {
    renderHotelCities();
    cityList.classList.add("is-open");
    cityInput.setAttribute("aria-expanded", "true");
  };

  cityInput.addEventListener("focus", openHotelCities);
  cityInput.addEventListener("click", openHotelCities);
  cityInput.addEventListener("input", openHotelCities);

  const dateField = hotelSearch.querySelector("[data-hotel-date-range-field]");
  const dateDisplay = dateField.querySelector("[data-hotel-date-display]");
  const checkinInput = dateField.querySelector("[data-hotel-checkin]");
  const checkoutInput = dateField.querySelector("[data-hotel-checkout]");
  const hotelToday = new Date();
  const addHotelDays = (days) => {
    const date = new Date(hotelToday);
    date.setDate(date.getDate() + days);
    return date;
  };
  let hotelStart = addHotelDays(14);
  let hotelEnd = addHotelDays(17);
  let hotelVisibleMonth = new Date(
    hotelStart.getFullYear(),
    hotelStart.getMonth(),
    1,
  );
  const hotelMonthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });
  const hotelDateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const sameHotelDay = (first, second) =>
    first && second && first.getTime() === second.getTime();
  const hotelCalendar = window.createDateRangeCalendar({
    title: "Choose your stay dates",
    applyText: "Choose dates",
  });
  dateField.append(hotelCalendar);

  const renderHotelMonth = (root, month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    root.replaceChildren();
    const title = document.createElement("h3");
    title.textContent = hotelMonthFormatter.format(month);
    root.append(title);
    const weekdays = document.createElement("div");
    weekdays.className = "date-range-calendar__weekdays";
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
      const item = document.createElement("span");
      item.textContent = day;
      weekdays.append(item);
    });
    root.append(weekdays);
    const days = document.createElement("div");
    days.className = "date-range-calendar__days";
    for (let index = 0; index < new Date(year, monthIndex, 1).getDay(); index += 1) days.append(document.createElement("span"));
    for (let day = 1; day <= new Date(year, monthIndex + 1, 0).getDate(); day += 1) {
      const date = new Date(year, monthIndex, day);
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = day;
      if (sameHotelDay(date, hotelStart)) button.classList.add("is-start");
      if (sameHotelDay(date, hotelEnd)) button.classList.add("is-end");
      if (hotelStart && hotelEnd && date > hotelStart && date < hotelEnd) button.classList.add("is-in-range");
      button.addEventListener("click", () => {
        if (!hotelStart || hotelEnd || date < hotelStart) {
          hotelStart = date;
          hotelEnd = null;
        } else {
          hotelEnd = date;
        }
        renderHotelCalendar();
      });
      days.append(button);
    }
    root.append(days);
  };

  const renderHotelCalendar = () => {
    const months = hotelCalendar.querySelectorAll("[data-calendar-month]");
    renderHotelMonth(months[0], hotelVisibleMonth);
    renderHotelMonth(months[1], new Date(hotelVisibleMonth.getFullYear(), hotelVisibleMonth.getMonth() + 1, 1));
    hotelCalendar.querySelector("[data-calendar-apply]").disabled = !hotelStart || !hotelEnd;
  };

  const updateHotelDates = () => {
    const toHotelInputDate = (date) => formatDate(new Date(date.getTime() - date.getTimezoneOffset() * 60000));
    checkinInput.value = toHotelInputDate(hotelStart);
    checkoutInput.value = toHotelInputDate(hotelEnd);
    dateDisplay.value = `${hotelDateFormatter.format(hotelStart)} — ${hotelDateFormatter.format(hotelEnd)}`;
  };

  dateDisplay.addEventListener("click", () => {
    hotelCalendar.classList.add("is-open");
    dateDisplay.setAttribute("aria-expanded", "true");
    cityList.classList.remove("is-open");
  });
  hotelCalendar.querySelector("[data-calendar-prev]").addEventListener("click", () => {
    hotelVisibleMonth = new Date(hotelVisibleMonth.getFullYear(), hotelVisibleMonth.getMonth() - 1, 1);
    renderHotelCalendar();
  });
  hotelCalendar.querySelector("[data-calendar-next]").addEventListener("click", () => {
    hotelVisibleMonth = new Date(hotelVisibleMonth.getFullYear(), hotelVisibleMonth.getMonth() + 1, 1);
    renderHotelCalendar();
  });
  hotelCalendar.querySelector("[data-calendar-apply]").addEventListener("click", () => {
    updateHotelDates();
    hotelCalendar.classList.remove("is-open");
    dateDisplay.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-hotel-city-field]")) {
      cityList.classList.remove("is-open");
      cityInput.setAttribute("aria-expanded", "false");
    }
    // A day click re-renders the month, so the clicked button is already detached: that is not an outside click.
    if (event.target.isConnected && !event.target.closest("[data-hotel-date-range-field]")) {
      hotelCalendar.classList.remove("is-open");
      dateDisplay.setAttribute("aria-expanded", "false");
    }
  });

  updateHotelDates();
  renderHotelCalendar();
}
