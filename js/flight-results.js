(() => {
  const resultsRoot = document.querySelector("[data-flight-offers]");
  const template = document.querySelector("#flightOfferTemplate");
  if (!resultsRoot || !template) return;

  const searchForm = document.querySelector("[data-results-search]");
  const swapButton = document.querySelector("[data-results-swap]");
  const travelers = document.querySelector("[data-results-travelers]");
  const travelersTrigger = travelers.querySelector("[data-results-travelers-trigger]");
  const travelersPanel = travelers.querySelector("[data-results-travelers-panel]");
  const passengerCounts = { adults: 2, children: 0, infants: 0 };

  const updatePassengerCounters = () => {
    travelers.querySelectorAll("[data-passenger-type]").forEach((row) => {
      const type = row.dataset.passengerType;
      const value = passengerCounts[type];
      row.querySelector("output").textContent = value;
      row.querySelector('[data-passenger-action="decrease"]').disabled = type === "adults" ? value <= 1 : value <= 0;
      row.querySelector('[data-passenger-action="increase"]').disabled = type === "infants" ? value >= passengerCounts.adults : value >= 9;
    });
  };

  travelersTrigger.addEventListener("click", () => {
    const willOpen = travelersPanel.hidden;
    travelersPanel.hidden = !willOpen;
    travelers.classList.toggle("is-open", willOpen);
    travelersTrigger.setAttribute("aria-expanded", String(willOpen));
    closeAirportLists();
  });

  travelers.querySelectorAll("[data-passenger-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.closest("[data-passenger-type]").dataset.passengerType;
      const change = button.dataset.passengerAction === "increase" ? 1 : -1;
      passengerCounts[type] += change;
      if (type === "adults" && passengerCounts.infants > passengerCounts.adults) passengerCounts.infants = passengerCounts.adults;
      updatePassengerCounters();
    });
  });

  travelers.querySelector("[data-results-travelers-apply]").addEventListener("click", () => {
    const total = passengerCounts.adults + passengerCounts.children + passengerCounts.infants;
    travelers.querySelector("[data-results-travelers-summary]").textContent = `${total} ${total === 1 ? "Traveler" : "Travelers"}`;
    travelersPanel.hidden = true;
    travelers.classList.remove("is-open");
    travelersTrigger.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-results-travelers]")) {
      travelersPanel.hidden = true;
      travelers.classList.remove("is-open");
      travelersTrigger.setAttribute("aria-expanded", "false");
    }
  });
  updatePassengerCounters();

  const airportOptions = {
    from: [
      "Paris, France — All Airports (PAR)",
      "Paris, France — Charles de Gaulle Airport (CDG)",
      "Paris, France — Orly Airport (ORY)",
      "Paris, France — Le Bourget Airport (LBG)",
      "Paris, France — Beauvais–Tillé Airport (BVA)",
    ],
    to: [
      "Los Angeles, USA — All Airports (LAX)",
      "Los Angeles, USA — Los Angeles International Airport (LAX)",
      "Los Angeles, USA — Hollywood Burbank Airport (BUR)",
      "Los Angeles, USA — Long Beach Airport (LGB)",
      "Los Angeles, USA — Ontario International Airport (ONT)",
      "Los Angeles, USA — John Wayne Airport (SNA)",
    ],
  };

  const closeAirportLists = (except) => {
    document.querySelectorAll(".airport-options.is-open").forEach((list) => {
      if (list !== except) {
        list.classList.remove("is-open");
        list.closest("[data-airport-field]").querySelector("input").setAttribute("aria-expanded", "false");
      }
    });
  };

  document.querySelectorAll("[data-airport-field]").forEach((field) => {
    const input = field.querySelector("input");
    const list = document.createElement("div");
    const listId = `airport-options-${field.dataset.airportField}`;
    list.className = "airport-options";
    list.id = listId;
    list.setAttribute("role", "listbox");
    input.setAttribute("aria-controls", listId);
    field.append(list);

    const renderAirports = (query = "") => {
      const normalizedQuery = query.trim().toLowerCase();
      const matches = airportOptions[field.dataset.airportField].filter((airport) => airport.toLowerCase().includes(normalizedQuery));
      list.replaceChildren();
      matches.forEach((airport, index) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "airport-options__item";
        option.setAttribute("role", "option");
        option.innerHTML = '<span aria-hidden="true">✈</span><strong></strong>';
        option.querySelector("strong").textContent = airport;
        if (index === 0 && !normalizedQuery) option.classList.add("is-highlighted");
        option.addEventListener("click", () => {
          input.value = airport;
          list.classList.remove("is-open");
          input.setAttribute("aria-expanded", "false");
          input.focus();
        });
        list.append(option);
      });
    };

    input.addEventListener("focus", () => {
      renderAirports();
      closeAirportLists(list);
      list.classList.add("is-open");
      input.setAttribute("aria-expanded", "true");
    });
    input.addEventListener("input", () => {
      renderAirports(input.value);
      list.classList.add("is-open");
      input.setAttribute("aria-expanded", "true");
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        list.classList.remove("is-open");
        input.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-airport-field]")) closeAirportLists();
  });

  const dateField = document.querySelector("[data-date-range-field]");
  const dateInput = dateField.querySelector("input");
  const calendar = window.createDateRangeCalendar({
    title: "Prices for return tickets",
    applyText: "Choose round trip",
  });
  dateField.append(calendar);

  let visibleMonth = new Date(2026, 8, 1);
  let selectedStart = new Date(2026, 8, 18);
  let selectedEnd = new Date(2026, 8, 27);
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
  const shortDateFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
  const sameDay = (first, second) => first && second && first.getTime() === second.getTime();

  const renderCalendarMonth = (root, month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    root.replaceChildren();

    const title = document.createElement("h3");
    title.textContent = monthFormatter.format(month);
    root.append(title);
    const weekdays = document.createElement("div");
    weekdays.className = "date-range-calendar__weekdays";
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
      const label = document.createElement("span");
      label.textContent = day;
      weekdays.append(label);
    });
    root.append(weekdays);

    const days = document.createElement("div");
    days.className = "date-range-calendar__days";
    for (let index = 0; index < firstWeekday; index += 1) days.append(document.createElement("span"));
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, monthIndex, day);
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = day;
      button.setAttribute("aria-label", shortDateFormatter.format(date));
      if (sameDay(date, selectedStart)) button.classList.add("is-start");
      if (sameDay(date, selectedEnd)) button.classList.add("is-end");
      if (selectedStart && selectedEnd && date > selectedStart && date < selectedEnd) button.classList.add("is-in-range");
      button.addEventListener("click", () => {
        if (!selectedStart || selectedEnd || date < selectedStart) {
          selectedStart = date;
          selectedEnd = null;
        } else {
          selectedEnd = date;
        }
        renderCalendar();
      });
      days.append(button);
    }
    root.append(days);
  };

  const renderCalendar = () => {
    const monthRoots = calendar.querySelectorAll("[data-calendar-month]");
    renderCalendarMonth(monthRoots[0], visibleMonth);
    renderCalendarMonth(monthRoots[1], new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1));
    calendar.querySelector("[data-calendar-apply]").disabled = !selectedStart || !selectedEnd;
  };

  dateInput.addEventListener("click", () => {
    calendar.classList.add("is-open");
    dateInput.setAttribute("aria-expanded", "true");
    closeAirportLists();
  });
  calendar.querySelector("[data-calendar-prev]").addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  calendar.querySelector("[data-calendar-next]").addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    renderCalendar();
  });
  calendar.querySelector("[data-calendar-apply]").addEventListener("click", () => {
    if (!selectedStart || !selectedEnd) return;
    dateInput.value = `${shortDateFormatter.format(selectedStart)} — ${shortDateFormatter.format(selectedEnd)}`;
    calendar.classList.remove("is-open");
    dateInput.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", (event) => {
    // A day click re-renders the month, so the clicked button is already detached: that is not an outside click.
    if (event.target.isConnected && !event.target.closest("[data-date-range-field]")) {
      calendar.classList.remove("is-open");
      dateInput.setAttribute("aria-expanded", "false");
    }
  });
  renderCalendar();

  swapButton.addEventListener("click", () => {
    const from = searchForm.elements.from;
    const to = searchForm.elements.to;
    [from.value, to.value] = [to.value, from.value];
    const fromField = from.closest("[data-airport-field]");
    const toField = to.closest("[data-airport-field]");
    [fromField.dataset.airportField, toField.dataset.airportField] = [toField.dataset.airportField, fromField.dataset.airportField];
  });
  searchForm.addEventListener("submit", (event) => event.preventDefault());

  // Mock data source. Replace this array with normalized API data when integration begins.
  const outboundOffers = [
    { id: 1, airline: "Air France", logo: "img/airlines/airfrance.svg", brandColor: "#e71939", flight: "AF 022", departure: "10:30", arrival: "13:05", arrivalOffset: "+0", duration: 695, stops: "direct", stopLabel: "Direct", returnFlight: "Return · AF 021 · 15:25", baggage: "2 checked bags", rating: 4.8, price: 4280, badge: "Best overall", badgeTone: "recommended", rank: 1 },
    { id: 2, airline: "Lufthansa", logo: "img/airlines/lufthansa.svg", brandColor: "#05164d", flight: "LH 1027 · LH 456", departure: "09:00", arrival: "15:15", arrivalOffset: "+0", duration: 975, stops: "1", stopLabel: "1 stop · Frankfurt", returnFlight: "Return · 1 stop · 14:10", baggage: "2 checked bags", rating: 4.7, price: 3650, badge: "Best value", badgeTone: "value", rank: 2 },
    { id: 3, airline: "Air France", logo: "img/airlines/airfrance.svg", brandColor: "#e71939", flight: "AF 072", departure: "13:20", arrival: "15:55", arrivalOffset: "+0", duration: 695, stops: "direct", stopLabel: "Direct", returnFlight: "Return · AF 065 · 15:40", baggage: "2 checked bags", rating: 4.6, price: 3890, badge: "", badgeTone: "", rank: 3 },
    { id: 4, airline: "Turkish Airlines", logo: "img/airlines/turkish.svg", brandColor: "#c70a0c", flight: "TK 1822 · TK 009", departure: "18:55", arrival: "17:10", arrivalOffset: "+1", duration: 1515, stops: "1", stopLabel: "1 stop · Istanbul", returnFlight: "Return · 1 stop · 18:45", baggage: "2 checked bags", rating: 4.7, price: 3490, badge: "Lowest fare", badgeTone: "lowest", rank: 4 },
    { id: 5, airline: "Qatar Airways", logo: "img/airlines/qatar.svg", brandColor: "#5c0632", flight: "QR 040 · QR 739", departure: "15:15", arrival: "13:40", arrivalOffset: "+1", duration: 1585, stops: "1", stopLabel: "1 stop · Doha", returnFlight: "Return · 1 stop · 15:05", baggage: "2 checked bags", rating: 4.9, price: 4720, badge: "Top rated", badgeTone: "rating", rank: 5 },
    { id: 6, airline: "Emirates", logo: "img/airlines/emirates.svg", brandColor: "#d71920", flight: "EK 074 · EK 215", departure: "14:25", arrival: "12:45", arrivalOffset: "+1", duration: 1580, stops: "1", stopLabel: "1 stop · Dubai", returnFlight: "Return · 1 stop · 16:20", baggage: "2 checked bags", rating: 4.9, price: 4890, badge: "", badgeTone: "", rank: 6 },
  ];

  const returnOffers = [
    { id: 101, airline: "Air France", logo: "img/airlines/airfrance.svg", brandColor: "#e71939", flight: "AF 021", departure: "15:25", arrival: "11:05", arrivalOffset: "+1", duration: 640, stops: "direct", stopLabel: "Direct", returnFlight: "Outbound · AF 022 · 10:30", baggage: "2 checked bags", rating: 4.8, price: 2140, badge: "Recommended", badgeTone: "recommended", rank: 1 },
    { id: 102, airline: "Lufthansa", logo: "img/airlines/lufthansa.svg", brandColor: "#05164d", flight: "LH 457 · LH 1026", departure: "17:30", arrival: "17:45", arrivalOffset: "+1", duration: 915, stops: "1", stopLabel: "1 stop · Frankfurt", returnFlight: "Outbound · LH 1027 · LH 456", baggage: "2 checked bags", rating: 4.7, price: 1890, badge: "Best value", badgeTone: "value", rank: 2 },
  ];

  const offersByDirection = { outbound: outboundOffers, return: returnOffers };
  const directionMeta = {
    outbound: {
      origin: "Paris (CDG)",
      destination: "Los Angeles (LAX)",
      detailOrigin: "Paris — Charles de Gaulle Airport (CDG)",
      detailDestination: "Los Angeles International Airport (LAX)",
    },
    return: {
      origin: "Los Angeles (LAX)",
      destination: "Paris (CDG)",
      detailOrigin: "Los Angeles International Airport (LAX)",
      detailDestination: "Paris — Charles de Gaulle Airport (CDG)",
    },
  };
  let activeDirection = "outbound";
  let outboundSelected = false;

  const sortControl = document.querySelector("[data-flight-sort]");
  const resultsPanel = document.querySelector("#flight-results-panel");
  const resultTabs = [...document.querySelectorAll("[data-results-tab]")];
  const airlineFilters = document.querySelector("[data-airline-filters]");
  const filterDetails = [...document.querySelectorAll(".flight-filters details")];
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const aircraftByAirline = {
    "Air France": "Air France · Business class · Boeing 777-300ER",
    Lufthansa: "Lufthansa · Business class · Airbus A350-900",
    "Turkish Airlines": "Turkish Airlines · Business class · Boeing 787-9",
    "Qatar Airways": "Qatar Airways · Business class · Airbus A350-1000",
    Emirates: "Emirates · Business class · Airbus A380-800",
  };
  const durationLabel = (minutes) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  const departureMinutes = (offer) => {
    const [hours, minutes] = offer.departure.split(":").map(Number);
    return hours * 60 + minutes;
  };

  [...new Set([...outboundOffers, ...returnOffers].map(({ airline }) => airline))].forEach((airline) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = airline;
    input.dataset.airlineFilter = "";
    label.append(input, document.createTextNode(` ${airline}`));
    airlineFilters.append(label);
  });

  const render = () => {
    const flightOffers = offersByDirection[activeDirection];
    const route = directionMeta[activeDirection];
    const stops = [...document.querySelectorAll("[data-stop-filter]:checked")].map(({ value }) => value);
    const airlines = [...document.querySelectorAll("[data-airline-filter]:checked")].map(({ value }) => value);
    const period = document.querySelector('[name="departurePeriod"]:checked').value;
    const ranges = { morning: [0, 720], afternoon: [720, 1080], evening: [1080, 1440] };

    let visibleOffers = flightOffers.filter((offer) => {
      const minutes = departureMinutes(offer);
      const matchesPeriod = period === "all" || (minutes >= ranges[period][0] && minutes < ranges[period][1]);
      return (!stops.length || stops.includes(offer.stops)) && (!airlines.length || airlines.includes(offer.airline)) && matchesPeriod;
    });

    const sorters = {
      recommended: (a, b) => a.rank - b.rank,
      price: (a, b) => a.price - b.price,
      duration: (a, b) => a.duration - b.duration,
      departure: (a, b) => departureMinutes(a) - departureMinutes(b),
    };
    visibleOffers.sort(sorters[sortControl.value]);
    resultsRoot.replaceChildren();

    visibleOffers.forEach((offer) => {
      const card = template.content.firstElementChild.cloneNode(true);
      const logo = card.querySelector("[data-offer-logo]");
      logo.style.maskImage = `url("${offer.logo}")`;
      logo.style.webkitMaskImage = `url("${offer.logo}")`;
      logo.style.backgroundColor = offer.brandColor;
      logo.setAttribute("aria-label", `${offer.airline} logo`);
      card.querySelector("[data-offer-airline]").textContent = offer.airline;
      card.querySelector("[data-offer-flight]").textContent = offer.flight;
      const badge = card.querySelector("[data-offer-badge]");
      badge.textContent = offer.badge;
      badge.hidden = !offer.badge;
      if (offer.badgeTone) badge.classList.add(`flight-offer__badge--${offer.badgeTone}`);
      card.querySelector("[data-offer-departure]").textContent = offer.departure;
      card.querySelector("[data-offer-arrival]").textContent = `${offer.arrival}${offer.arrivalOffset === "+1" ? " +1" : ""}`;
      card.querySelector("[data-offer-origin]").textContent = route.origin;
      card.querySelector("[data-offer-destination]").textContent = route.destination;
      card.querySelector("[data-offer-duration]").textContent = durationLabel(offer.duration);
      card.querySelector("[data-offer-stops]").textContent = offer.stopLabel;
      card.querySelector("[data-offer-price]").textContent = money.format(offer.price);
      card.querySelector("[data-detail-departure]").textContent = offer.departure;
      card.querySelector("[data-detail-arrival]").textContent = `${offer.arrival}${offer.arrivalOffset === "+1" ? " +1 day" : ""}`;
      card.querySelector("[data-detail-origin]").textContent = route.detailOrigin;
      card.querySelector("[data-detail-destination]").textContent = route.detailDestination;
      card.querySelector("[data-detail-duration]").textContent = `Journey time: ${durationLabel(offer.duration)} · ${offer.stopLabel}`;
      card.querySelector("[data-detail-aircraft]").textContent = aircraftByAirline[offer.airline];

      const detailsButton = card.querySelector(".flight-offer__details-toggle");
      const expandedDetails = card.querySelector(".flight-offer__expanded");
      const selectButton = card.querySelector(".flight-offer__price .button");
      const detailsId = `flight-details-${offer.id}`;
      expandedDetails.id = detailsId;
      detailsButton.setAttribute("aria-controls", detailsId);
      detailsButton.addEventListener("click", () => {
        const willOpen = expandedDetails.hidden;
        expandedDetails.hidden = !willOpen;
        detailsButton.setAttribute("aria-expanded", String(willOpen));
        detailsButton.firstChild.textContent = willOpen ? "Hide details " : "Flight details ";
      });
      selectButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (activeDirection === "outbound") {
          outboundSelected = true;
          const returnTab = resultTabs.find((tab) => tab.dataset.resultsTab === "return");
          returnTab.click();
          returnTab.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

        if (!outboundSelected) {
          const outboundTab = resultTabs.find((tab) => tab.dataset.resultsTab === "outbound");
          outboundTab.click();
          outboundTab.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

        window.location.href = selectButton.href;
      });
      resultsRoot.append(card);
    });

    if (!visibleOffers.length) {
      const empty = document.createElement("div");
      empty.className = "flight-offers__empty";
      empty.innerHTML = "<h3>No matching offers</h3><p>Try removing one or more filters.</p>";
      resultsRoot.append(empty);
    }
  };

  resultTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeDirection = tab.dataset.resultsTab;
      resultTabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
        item.tabIndex = isActive ? 0 : -1;
      });
      resultsPanel.setAttribute("aria-labelledby", tab.id);
      render();
    });
  });

  document.querySelectorAll("[data-stop-filter], [data-airline-filter], [name='departurePeriod']").forEach((control) => control.addEventListener("change", render));
  sortControl.addEventListener("change", render);
  filterDetails.forEach((details) => {
    details.addEventListener("toggle", () => {
      if (details.open) filterDetails.forEach((item) => {
        if (item !== details) item.open = false;
      });
    });
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".flight-filters")) filterDetails.forEach((details) => (details.open = false));
  });
  document.querySelector("[data-filter-reset]").addEventListener("click", () => {
    document.querySelectorAll("[data-stop-filter], [data-airline-filter]").forEach((input) => (input.checked = false));
    document.querySelector('[name="departurePeriod"][value="all"]').checked = true;
    sortControl.value = "recommended";
    filterDetails.forEach((details) => (details.open = false));
    render();
  });

  render();
})();
